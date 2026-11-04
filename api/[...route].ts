import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';
import { createHash, randomBytes, randomInt, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';

const ADMIN_EMAILS = ['marknielpaiton@gmail.com'];
const FEEDBACK_TYPES = ['template', 'problem', 'idea', 'praise'];
const METHODS = ['GCash', 'PayPal', 'Bank', 'Other'];
const SESSION_DAYS = 30;
const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Canva template links stay on the server and are only handed to the admin (unlimited Premium).
const TEMPLATE_LINKS: Record<string, string> = {
    'minimalist-cyan': 'https://canva.link/4tevik5sp9pd8qo',
    'pixel-art-student': 'https://canva.link/lg7n6zejxlb1ha5',
    'victorian-classic': 'https://canva.link/zx8nob09woc6wib',
};

type Row = Record<string, any>;
const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
const sql = DB_URL ? neon(DB_URL) : null;

async function q(text: string, params: unknown[] = []): Promise<Row[]> {
    if (!sql) {
        throw new Error('database-not-configured');
    }
    return (await sql.query(text, params)) as Row[];
}

let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
    if (!schemaReady) {
        schemaReady = (async () => {
            const stmts = [
                `create table if not exists users (
                    id uuid primary key default gen_random_uuid(),
                    email text not null unique,
                    password_hash text not null,
                    created_at timestamptz not null default now())`,
                `create table if not exists sessions (
                    token_hash text primary key,
                    user_id uuid not null references users(id) on delete cascade,
                    expires_at timestamptz not null)`,
                `create table if not exists email_codes (
                    id bigserial primary key,
                    email text not null,
                    purpose text not null,
                    code_hash text not null,
                    expires_at timestamptz not null,
                    attempts int not null default 0,
                    created_at timestamptz not null default now())`,
                `create index if not exists email_codes_lookup on email_codes (email, purpose, created_at desc)`,
                `create table if not exists auth_fail (
                    id bigserial primary key,
                    email text not null,
                    created_at timestamptz not null default now())`,
                `create index if not exists auth_fail_lookup on auth_fail (email, created_at desc)`,
                `create table if not exists wallet (id text primary key, balance_cents bigint not null default 0)`,
                `insert into wallet (id, balance_cents) values ('main', 0) on conflict (id) do nothing`,
                `create table if not exists ledger (
                    id bigserial primary key,
                    type text not null,
                    cents bigint not null,
                    note text not null default '',
                    method text not null default '',
                    created_at timestamptz not null default now())`,
                `create table if not exists feedback (
                    id bigserial primary key,
                    user_id uuid,
                    email text not null,
                    type text not null,
                    message text not null,
                    rating int,
                    created_at timestamptz not null default now())`,
            ];
            for (const s of stmts) {
                await q(s);
            }
        })().catch((e) => {
            schemaReady = null;
            throw e;
        });
    }
    return schemaReady;
}

// ---- helpers -------------------------------------------------------------

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function toCents(v: unknown): number {
    const n = typeof v === 'number' ? v : Number(v);
    if (!Number.isFinite(n) || n <= 0 || n > 10000000) {
        return 0;
    }
    return Math.round(n * 100);
}

function scryptAsync(pw: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scryptCb(pw, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
    });
}

async function hashPassword(pw: string): Promise<string> {
    const salt = randomBytes(16);
    const key = await scryptAsync(pw, salt);
    return `${salt.toString('hex')}:${key.toString('hex')}`;
}

async function checkPassword(pw: string, stored: string | null): Promise<boolean> {
    const [saltHex, keyHex] = (stored || '00:00').split(':');
    const key = await scryptAsync(pw, Buffer.from(saltHex || '00', 'hex'));
    const want = Buffer.from(keyHex || '00', 'hex');
    return stored !== null && want.length === key.length && timingSafeEqual(key, want);
}

async function newSession(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    await q(`insert into sessions (token_hash, user_id, expires_at) values ($1, $2, now() + ($3 || ' days')::interval)`, [
        sha256(token),
        userId,
        String(SESSION_DAYS),
    ]);
    return token;
}

interface User {
    id: string;
    email: string;
}

function bearer(req: VercelRequest): string {
    return String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
}

async function getUser(req: VercelRequest): Promise<User | null> {
    const token = bearer(req);
    if (!token) {
        return null;
    }
    const rows = await q(
        `select u.id, u.email from sessions s join users u on u.id = s.user_id where s.token_hash = $1 and s.expires_at > now()`,
        [sha256(token)],
    );
    return rows[0] ? { id: rows[0].id, email: String(rows[0].email) } : null;
}

async function sendCodeMail(to: string, code: string, purpose: string): Promise<void> {
    const user = process.env.SMTP_USER;
    const pass = (process.env.SMTP_PASS || '').replace(/\s/g, '');
    if (!user || !pass) {
        throw new Error('mail-not-configured');
    }
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: { user, pass },
    });
    const what = purpose === 'reset' ? 'reset your password' : 'create your account';
    await transport.sendMail({
        from: `"VESTA TEM" <${process.env.SMTP_FROM || user}>`,
        to,
        subject: `${code} is your VESTA TEM verification code`,
        text: `Your VESTA TEM verification code is ${code}\n\nEnter it on the VESTA TEM page to ${what}. It expires in ${CODE_MINUTES} minutes.\nIf you did not ask for this, ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;background:#07060f;color:#e8f7ff;border-radius:14px">
<h2 style="margin:0 0 8px;letter-spacing:3px;color:#22d3ee">VESTA TEM</h2>
<p>Your verification code to ${what}:</p>
<p style="font-size:34px;font-weight:700;letter-spacing:10px;margin:16px 0;color:#ffffff">${code}</p>
<p style="color:#8fa3b8;font-size:13px">It expires in ${CODE_MINUTES} minutes. If you did not ask for this, ignore this email.</p></div>`,
    });
}

async function consumeCode(email: string, purpose: string, code: string): Promise<boolean> {
    const rows = await q(
        `select id, code_hash, attempts, expires_at > now() as live from email_codes where email = $1 and purpose = $2 order by id desc limit 1`,
        [email, purpose],
    );
    const row = rows[0];
    if (!row || !row.live || Number(row.attempts) >= MAX_ATTEMPTS) {
        return false;
    }
    if (row.code_hash !== sha256(`${email}:${purpose}:${code}`)) {
        await q(`update email_codes set attempts = attempts + 1 where id = $1`, [row.id]);
        return false;
    }
    await q(`delete from email_codes where email = $1 and purpose = $2`, [email, purpose]);
    return true;
}

// ---- handler -------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const send = (status: number, body: unknown) => {
        res.setHeader('Cache-Control', 'no-store');
        res.status(status).json(body);
    };
    const fail = (status: number, message: string) => send(status, { error: message });

    try {
        const path = new URL(req.url || '/', 'http://x').pathname.replace(/\/+$/, '');
        const route = `${req.method} ${path}`;
        if (route === 'GET /api/_healthcheck') {
            return send(200, { message: 'Success', db: Boolean(sql), mail: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS) });
        }
        if (!sql) {
            return fail(503, 'Database is not connected yet');
        }
        await ensureSchema();

        const body: Row = req.method === 'POST' && req.body && typeof req.body === 'object' ? req.body : {};
        const email = clean(body.email, 200).toLowerCase();

        // ---------- public auth routes ----------
        if (route === 'POST /api/auth/send-code') {
            const purpose = String(body.purpose || '');
            if (!EMAIL_RE.test(email) || !['signup', 'reset'].includes(purpose)) {
                return fail(400, 'Invalid request');
            }
            const exists = (await q(`select 1 from users where email = $1`, [email])).length > 0;
            if (purpose === 'signup' && exists) {
                return fail(409, 'exists');
            }
            if (purpose === 'reset' && !exists) {
                return send(200, { ok: true });
            }
            const recent = await q(
                `select count(*)::int as n, coalesce(max(extract(epoch from now() - created_at)), 9999) as age
                 from email_codes where email = $1 and created_at > now() - interval '1 hour'`,
                [email],
            );
            if (Number(recent[0]?.n) >= 5 || Number(recent[0]?.age) < 60) {
                return fail(429, 'wait');
            }
            const code = String(randomInt(0, 1000000)).padStart(6, '0');
            await q(`delete from email_codes where expires_at < now() - interval '1 day'`);
            const inserted = await q(
                `insert into email_codes (email, purpose, code_hash, expires_at) values ($1, $2, $3, now() + ($4 || ' minutes')::interval) returning id`,
                [email, purpose, sha256(`${email}:${purpose}:${code}`), String(CODE_MINUTES)],
            );
            try {
                await sendCodeMail(email, code, purpose);
            } catch (e) {
                await q(`delete from email_codes where id = $1`, [inserted[0].id]);
                console.error('mail failed', (e as Error).message);
                return fail(502, 'Could not send the email');
            }
            return send(200, { ok: true });
        }

        if (route === 'POST /api/auth/signup') {
            const password = typeof body.password === 'string' ? body.password : '';
            if (!EMAIL_RE.test(email) || password.length < 8 || password.length > 200) {
                return fail(400, 'Invalid request');
            }
            if (!(await consumeCode(email, 'signup', clean(body.code, 12)))) {
                return fail(400, 'code');
            }
            const hash = await hashPassword(password);
            const made = await q(`insert into users (email, password_hash) values ($1, $2) on conflict (email) do nothing returning id`, [
                email,
                hash,
            ]);
            if (!made[0]) {
                return fail(409, 'exists');
            }
            return send(200, { token: await newSession(made[0].id), email });
        }

        if (route === 'POST /api/auth/login') {
            const password = typeof body.password === 'string' ? body.password : '';
            if (!EMAIL_RE.test(email) || !password) {
                return fail(400, 'Invalid request');
            }
            const fails = await q(`select count(*)::int as n from auth_fail where email = $1 and created_at > now() - interval '15 minutes'`, [email]);
            if (Number(fails[0]?.n) >= 10) {
                return fail(429, 'wait');
            }
            const found = await q(`select id, password_hash from users where email = $1`, [email]);
            const ok = await checkPassword(password, found[0] ? String(found[0].password_hash) : null);
            if (!found[0] || !ok) {
                await q(`insert into auth_fail (email) values ($1)`, [email]);
                return fail(401, 'Wrong email or password');
            }
            await q(`delete from auth_fail where email = $1`, [email]);
            return send(200, { token: await newSession(found[0].id), email });
        }

        if (route === 'POST /api/auth/reset') {
            const password = typeof body.password === 'string' ? body.password : '';
            if (!EMAIL_RE.test(email) || password.length < 8 || password.length > 200) {
                return fail(400, 'Invalid request');
            }
            if (!(await consumeCode(email, 'reset', clean(body.code, 12)))) {
                return fail(400, 'code');
            }
            const hash = await hashPassword(password);
            const upd = await q(`update users set password_hash = $2 where email = $1 returning id`, [email, hash]);
            if (!upd[0]) {
                return fail(400, 'code');
            }
            await q(`delete from sessions where user_id = $1`, [upd[0].id]);
            await q(`delete from auth_fail where email = $1`, [email]);
            return send(200, { token: await newSession(upd[0].id), email });
        }

        // ---------- signed-in routes ----------
        const user = await getUser(req);
        if (!user) {
            return fail(401, 'Sign in required');
        }
        const isAdmin = ADMIN_EMAILS.includes(user.email);

        if (route === 'POST /api/auth/logout') {
            await q(`delete from sessions where token_hash = $1`, [sha256(bearer(req))]);
            return send(200, { ok: true });
        }
        if (route === 'GET /api/me') {
            return send(200, { userId: user.id, email: user.email, name: '', isAdmin });
        }
        if (route === 'GET /api/stats') {
            const r = await q(`select count(*)::int as n from users`);
            return send(200, { users: Number(r[0]?.n || 0) });
        }
        if (route === 'POST /api/feedback') {
            const message = clean(body.message, 1000);
            if (message.length < 5) {
                return fail(400, 'Message must be between 5 and 1000 characters');
            }
            const type = String(body.type || '');
            if (!FEEDBACK_TYPES.includes(type)) {
                return fail(400, 'Invalid feedback type');
            }
            const n = Number(body.rating);
            const rating = Number.isFinite(n) && n >= 1 && n <= 5 ? Math.round(n) : null;
            const r = await q(
                `insert into feedback (user_id, email, type, message, rating) values ($1, $2, $3, $4, $5) returning id`,
                [user.id, user.email, type, message, rating],
            );
            return send(200, { ok: true, id: r[0].id });
        }

        // ---------- admin only ----------
        if (!isAdmin) {
            return fail(403, 'Forbidden');
        }
        const tpl = path.match(/^\/api\/template\/([\w-]+)$/);
        if (req.method === 'GET' && tpl) {
            return send(200, { url: TEMPLATE_LINKS[tpl[1]] || null });
        }
        if (route === 'GET /api/admin/wallet') {
            const bal = await q(`select balance_cents from wallet where id = 'main'`);
            const rows = await q(`select type, cents, note, method, created_at from ledger order by id desc limit 200`);
            return send(200, {
                balanceCents: Number(bal[0]?.balance_cents || 0),
                entries: rows.map((r) => ({
                    type: r.type,
                    cents: Number(r.cents),
                    note: r.note,
                    method: r.method,
                    createdAt: new Date(r.created_at).getTime(),
                })),
            });
        }
        if (route === 'POST /api/admin/wallet/income') {
            const cents = toCents(body.amount);
            if (!cents) {
                return fail(400, 'Enter an amount greater than 0');
            }
            await q(
                `with u as (update wallet set balance_cents = balance_cents + $1::bigint where id = 'main' returning 1)
                 insert into ledger (type, cents, note, method) select 'income', $1::bigint, $2::text, '' from u`,
                [cents, clean(body.note, 200)],
            );
            return send(200, { ok: true });
        }
        if (route === 'POST /api/admin/wallet/withdraw') {
            const cents = toCents(body.amount);
            if (!cents) {
                return fail(400, 'Enter an amount greater than 0');
            }
            const m = String(body.method || '');
            const method = METHODS.includes(m) ? m : 'Other';
            const done = await q(
                `with u as (update wallet set balance_cents = balance_cents - $1::bigint where id = 'main' and balance_cents >= $1::bigint returning 1)
                 insert into ledger (type, cents, note, method) select 'withdrawal', $1::bigint, $2::text, $3::text from u returning id`,
                [cents, clean(body.note, 200), method],
            );
            if (!done[0]) {
                return fail(400, 'That is more than your balance');
            }
            return send(200, { ok: true });
        }
        if (route === 'GET /api/admin/feedback') {
            const rows = await q(`select user_id, email, type, message, rating, created_at from feedback order by id desc limit 200`);
            return send(200, {
                items: rows.map((r) => ({
                    userId: r.user_id,
                    email: r.email,
                    type: r.type,
                    message: r.message,
                    rating: r.rating,
                    createdAt: new Date(r.created_at).getTime(),
                })),
            });
        }
        return fail(404, 'Not found');
    } catch (e) {
        console.error(e);
        return fail(500, 'Server error');
    }
}
