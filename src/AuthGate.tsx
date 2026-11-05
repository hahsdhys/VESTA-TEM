import { createContext, useContext, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Lock, Mail } from 'lucide-react';
import { api, auth, getToken, setToken } from './client';
import { CODEX } from './code-i18n';
import { LANGS } from './i18n';
import { AUTHX } from './auth-i18n';
import { FORGOT } from './forgot-i18n';
import ForgotPanel from './ForgotPanel';
import PasswordInput from './PasswordInput';
import type { LangCode } from './i18n';
import { GATE } from './gate-i18n';

interface Session {
    email: string;
    name: string;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session | null {
    return useContext(SessionContext);
}

const STORAGE_KEY = 'vesta-tem-prefs';

function readPrefs(): { lang?: LangCode; mode?: string; accent?: string } {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function initialLang(): LangCode {
    const saved = readPrefs().lang;
    if (saved && LANGS.some((l) => l.code === saved)) {
        return saved;
    }
    const raw = (navigator.language || 'en').toLowerCase();
    if (raw.startsWith('fil') || raw.startsWith('tl')) {
        return 'tl';
    }
    const found = LANGS.find((l) => l.code === raw.slice(0, 2));
    return found ? found.code : 'en';
}

function saveLang(lang: LangCode) {
    try {
        const prefs = readPrefs();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, lang }));
    } catch {
        // ignore
    }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [lang, setLang] = useState<LangCode>(initialLang);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [info, setInfo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [code, setCode] = useState('');
    const [codeStep, setCodeStep] = useState(false);
    const [forgot, setForgot] = useState(false);
    const g = GATE[lang];
    const a = AUTHX[lang];
    const c = CODEX[lang];
    const fg = FORGOT[lang];

    useEffect(() => {
        const prefs = readPrefs();
        const root = document.documentElement;
        root.dataset.mode = prefs.mode === 'light' ? 'light' : 'dark';
        root.dataset.accent = prefs.accent || 'cyan';
        root.lang = lang;
    }, [lang]);

    // restore the saved session and learn whether this account is the admin
    useEffect(() => {
        let alive = true;
        if (!getToken()) {
            setReady(true);
            return;
        }
        api.get('/api/me')
            .then((res) => {
                if (alive) {
                    setUser({ email: res.data.email, name: res.data.name || '' });
                    setIsAdmin(Boolean(res.data.isAdmin));
                }
            })
            .catch((e: { response?: { status?: number } }) => {
                if (e?.response?.status === 401) {
                    setToken(null);
                }
            })
            .finally(() => {
                if (alive) {
                    setReady(true);
                }
            });
        return () => {
            alive = false;
        };
    }, []);

    const enter = async () => {
        const res = await api.get('/api/me');
        setUser({ email: res.data.email, name: res.data.name || '' });
        setIsAdmin(Boolean(res.data.isAdmin));
    };

    const pickLang = (lc: LangCode) => {
        setLang(lc);
        saveLang(lc);
    };

    const fail = (ex: unknown) => {
        const msg = String((ex as { message?: string })?.message || '').toLowerCase();
        if (msg === 'exists') {
            setErr(a.err_exists);
        } else if (msg === 'wait') {
            setErr(fg.err_wait);
        } else if (msg === 'code') {
            setErr(fg.err_code);
        } else if (msg.includes('wrong email')) {
            setErr(a.err_bad);
        } else if (msg.includes('send the email')) {
            const tag = String((ex as { message?: string })?.message || '').match(/\[[^\]]+\]/)?.[0] || '';
            setErr(`${c.err_mail} ${tag}`.trim());
        } else {
            const raw = String((ex as { message?: string })?.message || '');
            setErr(`${g.err_generic} (${raw.slice(0, 90)})`);
        }
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setErr('');
        setInfo('');
        const value = email.trim().toLowerCase();
        if (!EMAIL_RE.test(value)) {
            setErr(g.err_email);
            return;
        }
        if (password.length < 8) {
            setErr(a.err_pw_short);
            return;
        }
        if (tab === 'signup' && password !== password2) {
            setErr(a.err_pw_match);
            return;
        }
        setBusy(true);
        try {
            if (tab === 'signup') {
                await auth.signup(value, password, '');
                await enter();
            } else {
                await auth.login(value, password);
                await enter();
            }
        } catch (ex) {
            fail(ex);
        } finally {
            setBusy(false);
        }
    };

    const resendCode = async () => {
        setErr('');
        setInfo('');
        try {
            await auth.sendCode(email.trim().toLowerCase(), 'signup');
            setInfo(fg.code_sent);
        } catch (ex) {
            fail(ex);
        }
    };

    const signOut = async () => {
        await auth.logout();
        setIsAdmin(false);
        setUser(null);
        setCodeStep(false);
        setCode('');
        setPassword('');
        setPassword2('');
    };

    if (ready && user) {
        return (
            <SessionContext.Provider value={{ email: user.email, name: user.name, isAdmin, signOut }}>
                {children}
            </SessionContext.Provider>
        );
    }

    return (
        <div className="shell gate-shell">
            <div className="bg" aria-hidden="true">
                <div className="bg-grid" />
                <div className="blob b1" />
                <div className="blob b2" />
                <div className="scan" />
            </div>

            <main className="gate">
                <div className="glass gate-card">
                    <h1 className="glitch gate-logo" data-text="VESTA TEM">
                        VESTA TEM
                    </h1>

                    {!ready ? (
                        <p className="muted gate-loading">{g.loading}</p>
                    ) : forgot ? (
                        <ForgotPanel lang={lang} initialEmail={email} onBack={() => setForgot(false)} />
                    ) : (
                        <>
                            <div className="seg gate-tabs" role="tablist">
                                <button
                                    role="tab"
                                    aria-selected={tab === 'login'}
                                    className={`chip ${tab === 'login' ? 'on' : ''}`}
                                    onClick={() => {
                                        setTab('login');
                                        setErr('');
                                        setCodeStep(false);
                                    }}
                                >
                                    {g.tab_login}
                                </button>
                                <button
                                    role="tab"
                                    aria-selected={tab === 'signup'}
                                    className={`chip ${tab === 'signup' ? 'on' : ''}`}
                                    onClick={() => {
                                        setTab('signup');
                                        setErr('');
                                    }}
                                >
                                    {g.tab_signup}
                                </button>
                            </div>

                            <h2 className="gate-title">
                                {tab === 'signup' && codeStep ? c.conf_t : tab === 'login' ? g.title_login : g.title_signup}
                            </h2>
                            <p className="muted">
                                {tab === 'login' ? a.sub_login : codeStep ? c.conf_d : c.sub_signup}
                            </p>

                            <form className="gate-form" onSubmit={submit}>
                                <label className="set-label" htmlFor="gate-email">
                                    {g.email_label}
                                </label>
                                <input
                                    id="gate-email"
                                    className="gate-input"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    placeholder={g.email_ph}
                                    disabled={tab === 'signup' && codeStep}
                                    required
                                />
                                {!(tab === 'signup' && codeStep) && (
                                    <>
                                        <label className="set-label" htmlFor="gate-pw">
                                            {a.pw}
                                        </label>
                                        <PasswordInput
                                            id="gate-pw"
                                            value={password}
                                            onChange={setPassword}
                                            placeholder={a.pw_ph}
                                            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                                            show={fg.show}
                                            hide={fg.hide}
                                        />
                                    </>
                                )}
                                {tab === 'login' && (
                                    <button type="button" className="link-btn" onClick={() => setForgot(true)}>
                                        {fg.forgot}
                                    </button>
                                )}
                                {tab === 'signup' && !codeStep && (
                                    <>
                                        <label className="set-label" htmlFor="gate-pw2">
                                            {a.pw2}
                                        </label>
                                        <PasswordInput
                                            id="gate-pw2"
                                            value={password2}
                                            onChange={setPassword2}
                                            autoComplete="new-password"
                                            show={fg.show}
                                            hide={fg.hide}
                                        />
                                    </>
                                )}
                                {tab === 'signup' && codeStep && (
                                    <>
                                        <label className="set-label" htmlFor="gate-code">
                                            {fg.code}
                                        </label>
                                        <input
                                            id="gate-code"
                                            className="gate-input code-input"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={10}
                                            value={code}
                                            onChange={(ev) => setCode(ev.target.value.replace(/\D/g, ''))}
                                            placeholder={fg.code_ph}
                                            required
                                        />
                                    </>
                                )}
                                <button className="btn gate-cta" type="submit" disabled={busy}>
                                    <Mail size={18} />{' '}
                                    {tab === 'login' ? a.cta_login : codeStep ? c.verify_cta : c.cta_signup}
                                </button>
                            </form>

                            {tab === 'signup' && codeStep && (
                                <div className="gate-tabs seg">
                                    <button type="button" className="btn ghost btn-sm" onClick={resendCode}>
                                        {fg.resend_code}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn ghost btn-sm"
                                        onClick={() => {
                                            setCodeStep(false);
                                            setCode('');
                                            setErr('');
                                            setInfo('');
                                        }}
                                    >
                                        {g.again}
                                    </button>
                                </div>
                            )}

                            {err && (
                                <p className="notice" role="alert">
                                    {err}
                                </p>
                            )}
                            {info && <p className="notice">{info}</p>}
                            {tab === 'signup' && <p className="muted small">{c.note_signup}</p>}
                        </>
                    )}

                    <div className="gate-langs">
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                className={`chip tiny-chip ${lang === l.code ? 'on' : ''}`}
                                onClick={() => pickLang(l.code)}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                    <p className="muted small lock">
                        <Lock size={13} /> © 2026 VESTA TEM
                    </p>
                </div>
            </main>
        </div>
    );
}
