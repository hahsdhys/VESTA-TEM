import { createContext, useContext, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Lock, Mail } from 'lucide-react';
import { api, supabase } from './client';
import { LANGS } from './i18n';
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GOOGLE_LABEL: Record<LangCode, string> = {
    en: 'Continue with Google',
    tl: 'Magpatuloy gamit ang Google',
    it: 'Continua con Google',
    es: 'Continuar con Google',
    fr: 'Continuer avec Google',
    ja: 'Googleで続行',
};
const OR_LABEL: Record<LangCode, string> = {
    en: 'or use your email',
    tl: 'o gamitin ang email mo',
    it: 'oppure usa la tua email',
    es: 'o usa tu correo',
    fr: 'ou utilisez votre e-mail',
    ja: 'またはメールで',
};

export default function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [lang, setLang] = useState<LangCode>(initialLang);
    const [googleOn, setGoogleOn] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const g = GATE[lang];

    useEffect(() => {
        const prefs = readPrefs();
        const root = document.documentElement;
        root.dataset.mode = prefs.mode === 'light' ? 'light' : 'dark';
        root.dataset.accent = prefs.accent || 'cyan';
        root.lang = lang;
    }, [lang]);

    // restore the session and follow sign-in / sign-out (including the return from the email link)
    useEffect(() => {
        let alive = true;
        const apply = (u: { email?: string; user_metadata?: Record<string, unknown> } | null | undefined) => {
            if (!alive) {
                return;
            }
            if (u) {
                const name = (u.user_metadata?.full_name || u.user_metadata?.name || '') as string;
                setUser({ email: u.email || '', name });
            } else {
                setUser(null);
            }
        };
        supabase.auth
            .getSession()
            .then(({ data }) => apply(data.session?.user))
            .catch(() => undefined)
            .finally(() => {
                if (alive) {
                    setReady(true);
                }
            });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            apply(session?.user);
            if (alive) {
                setReady(true);
            }
        });
        return () => {
            alive = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    // ask the backend who this is (decides whether the admin area is available)
    useEffect(() => {
        if (!user) {
            setIsAdmin(false);
            return;
        }
        let alive = true;
        api.get('/api/me')
            .then((res) => {
                if (alive) {
                    setIsAdmin(Boolean(res?.data?.isAdmin));
                }
            })
            .catch(() => {
                if (alive) {
                    setIsAdmin(false);
                }
            });
        return () => {
            alive = false;
        };
    }, [user]);

    const pickLang = (code: LangCode) => {
        setLang(code);
        saveLang(code);
    };

    const sendLink = async (e: FormEvent) => {
        e.preventDefault();
        setErr('');
        const value = email.trim().toLowerCase();
        if (!EMAIL_RE.test(value)) {
            setErr(g.err_email);
            return;
        }
        setBusy(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: value,
                options: { emailRedirectTo: window.location.origin, shouldCreateUser: true },
            });
            if (error) {
                throw error;
            }
            setSent(true);
        } catch {
            setErr(g.err_generic);
        } finally {
            setBusy(false);
        }
    };

    useEffect(() => {
        let alive = true;
        const url = (import.meta.env.VITE_SUPABASE_URL || 'https://nlupwqdvklqwruxabbgx.supabase.co') + '/auth/v1/settings';
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_RcI9TcwbOH5mi2iBZsq8Ow_ki3C7mYn';
        fetch(url, { headers: { apikey: key } })
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => {
                if (alive) {
                    setGoogleOn(Boolean(j?.external?.google));
                }
            })
            .catch(() => undefined);
        return () => {
            alive = false;
        };
    }, []);

    const googleSignIn = async () => {
        setErr('');
        setBusy(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        });
        if (error) {
            setErr(g.err_generic);
            setBusy(false);
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch {
            // ignore
        }
        setIsAdmin(false);
        setUser(null);
        setSent(false);
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
                    ) : sent ? (
                        <div className="fb-done">
                            <span className="fb-check">
                                <Mail size={26} />
                            </span>
                            <h2 className="gate-title">{g.sent_t}</h2>
                            <p className="muted">{g.sent_d}</p>
                            <p className="gate-methods">{email.trim()}</p>
                            <button className="btn ghost" onClick={() => setSent(false)}>
                                {g.again}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="seg gate-tabs" role="tablist">
                                <button
                                    role="tab"
                                    aria-selected={tab === 'login'}
                                    className={`chip ${tab === 'login' ? 'on' : ''}`}
                                    onClick={() => setTab('login')}
                                >
                                    {g.tab_login}
                                </button>
                                <button
                                    role="tab"
                                    aria-selected={tab === 'signup'}
                                    className={`chip ${tab === 'signup' ? 'on' : ''}`}
                                    onClick={() => setTab('signup')}
                                >
                                    {g.tab_signup}
                                </button>
                            </div>

                            <h2 className="gate-title">{tab === 'login' ? g.title_login : g.title_signup}</h2>
                            <p className="muted">{g.sub}</p>

                            {googleOn && (
                                <>
                            <button type="button" className="btn ghost gate-cta gate-google" onClick={googleSignIn} disabled={busy}>
                                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                                    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
                                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                                </svg>
                                {GOOGLE_LABEL[lang]}
                            </button>
                            <p className="muted small">{OR_LABEL[lang]}</p>
                                </>
                            )}

                            <form className="gate-form" onSubmit={sendLink}>
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
                                    required
                                />
                                <button className="btn gate-cta" type="submit" disabled={busy}>
                                    <Mail size={18} /> {g.cta}
                                </button>
                            </form>
                            <p className="gate-methods">{g.methods}</p>

                            {err && (
                                <p className="notice" role="alert">
                                    {err}
                                </p>
                            )}
                            <p className="muted small">{g.note}</p>
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
