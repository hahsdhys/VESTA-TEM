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

export default function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [lang, setLang] = useState<LangCode>(initialLang);
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
