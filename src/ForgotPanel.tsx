import { useState } from 'react';
import type { FormEvent } from 'react';
import { KeyRound, Mail } from 'lucide-react';
import { auth } from './client';
import { CODEX } from './code-i18n';
import type { LangCode } from './i18n';
import { FORGOT } from './forgot-i18n';
import { GATE } from './gate-i18n';
import { AUTHX } from './auth-i18n';
import PasswordInput from './PasswordInput';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPanel({ lang, initialEmail, onBack }: { lang: LangCode; initialEmail: string; onBack: () => void }) {
    const f = FORGOT[lang];
    const g = GATE[lang];
    const a = AUTHX[lang];
    const c = CODEX[lang];
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [pw, setPw] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [info, setInfo] = useState('');

    const sendCode = async (e?: FormEvent) => {
        e?.preventDefault();
        setErr('');
        setInfo('');
        const value = email.trim().toLowerCase();
        if (!EMAIL_RE.test(value)) {
            setErr(g.err_email);
            return;
        }
        setBusy(true);
        try {
            await auth.sendCode(value, 'reset');
            if (step === 'code') {
                setInfo(f.code_sent);
            }
            setStep('code');
        } catch (ex) {
            const msg = String((ex as { message?: string })?.message || '').toLowerCase();
            setErr(msg === 'wait' ? f.err_wait : c.err_mail);
        } finally {
            setBusy(false);
        }
    };

    const saveNew = async (e: FormEvent) => {
        e.preventDefault();
        setErr('');
        setInfo('');
        if (!/^\d{6,10}$/.test(code.trim())) {
            setErr(f.err_code);
            return;
        }
        if (pw.length < 8) {
            setErr(a.err_pw_short);
            return;
        }
        setBusy(true);
        try {
            await auth.reset(email.trim().toLowerCase(), code.trim(), pw);
            // the session is saved; AuthGate follows it and enters the store.
            window.location.reload();
        } catch (ex) {
            const msg = String((ex as { message?: string })?.message || '').toLowerCase();
            setErr(msg === 'code' ? f.err_code : g.err_generic);
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <span className="fb-check">
                <KeyRound size={24} />
            </span>
            {step === 'email' ? (
                <>
                    <h2 className="gate-title">{f.f_title}</h2>
                    <p className="muted">{f.f_sub}</p>
                    <form className="gate-form" onSubmit={sendCode}>
                        <label className="set-label" htmlFor="fg-email">
                            {g.email_label}
                        </label>
                        <input
                            id="fg-email"
                            className="gate-input"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
                            placeholder={g.email_ph}
                            required
                        />
                        <button className="btn gate-cta" type="submit" disabled={busy}>
                            <Mail size={18} /> {f.f_cta}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h2 className="gate-title">{f.r_title}</h2>
                    <p className="muted">{f.r_sub}</p>
                    <p className="gate-methods">{email.trim()}</p>
                    <form className="gate-form" onSubmit={saveNew}>
                        <label className="set-label" htmlFor="fg-code">
                            {f.code}
                        </label>
                        <input
                            id="fg-code"
                            className="gate-input code-input"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={10}
                            value={code}
                            onChange={(ev) => setCode(ev.target.value.replace(/\D/g, ''))}
                            placeholder={f.code_ph}
                            required
                        />
                        <label className="set-label" htmlFor="fg-pw">
                            {f.new_pw}
                        </label>
                        <PasswordInput
                            id="fg-pw"
                            value={pw}
                            onChange={setPw}
                            placeholder={a.pw_ph}
                            autoComplete="new-password"
                            show={f.show}
                            hide={f.hide}
                        />
                        <button className="btn gate-cta" type="submit" disabled={busy}>
                            <KeyRound size={18} /> {f.r_cta}
                        </button>
                    </form>
                    <button type="button" className="btn ghost btn-sm" onClick={() => sendCode()} disabled={busy}>
                        {f.resend_code}
                    </button>
                </>
            )}
            {err && (
                <p className="notice" role="alert">
                    {err}
                </p>
            )}
            {info && <p className="notice">{info}</p>}
            <button type="button" className="btn ghost btn-sm" onClick={onBack}>
                {f.back}
            </button>
        </>
    );
}
