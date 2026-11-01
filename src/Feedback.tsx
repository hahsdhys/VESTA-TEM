import { useEffect, useState } from 'react';
import { api } from './client';
import { Check, Crown, MessageSquare, Send, Star, X } from 'lucide-react';
import type { LangCode } from './i18n';
import { EXTRA } from './extra-i18n';

type FbType = 'template' | 'problem' | 'idea' | 'praise';
type Status = 'idle' | 'sending' | 'done' | 'error' | 'short';

export function PremiumButton({ lang, onClick }: { lang: LangCode; onClick: () => void }) {
    return (
        <button className="premium-btn" onClick={onClick} aria-label={EXTRA[lang].premium_btn}>
            <Crown size={16} />
            <span>{EXTRA[lang].premium_btn}</span>
        </button>
    );
}

export function FeedbackWidget({ lang }: { lang: LangCode }) {
    const E = EXTRA[lang];
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<FbType>('template');
    const [msg, setMsg] = useState('');
    const [rating, setRating] = useState(0);
    const [status, setStatus] = useState<Status>('idle');

    useEffect(() => {
        if (!open) {
            return;
        }
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open]);

    const types: { id: FbType; label: string; hint: string }[] = [
        { id: 'template', label: E.ty_template, hint: E.ty_template_hint },
        { id: 'problem', label: E.ty_problem, hint: E.ty_problem_hint },
        { id: 'idea', label: E.ty_idea, hint: E.ty_idea_hint },
        { id: 'praise', label: E.ty_praise, hint: E.ty_praise_hint },
    ];

    const submit = async () => {
        if (msg.trim().length < 5) {
            setStatus('short');
            return;
        }
        setStatus('sending');
        try {
            await api.post('/api/feedback', { type, message: msg.trim(), rating: rating || undefined });
            setStatus('done');
            setMsg('');
            setRating(0);
        } catch {
            setStatus('error');
        }
    };

    const close = () => {
        setOpen(false);
        if (status === 'done' || status === 'error' || status === 'short') {
            setStatus('idle');
        }
    };

    return (
        <>
            <button className="fb-fab glass" onClick={() => setOpen(true)} aria-label={E.fb_btn}>
                <MessageSquare size={18} />
                <span>{E.fb_btn}</span>
            </button>

            {open && (
                <div className="overlay center" onClick={close}>
                    <div className="glass modal fb-modal" role="dialog" aria-label={E.fb_title} onClick={(e) => e.stopPropagation()}>
                        <div className="fb-head">
                            <h3>{E.fb_title}</h3>
                            <button className="icon-btn tiny" onClick={close} aria-label={E.close}>
                                <X size={14} />
                            </button>
                        </div>

                        {status === 'done' ? (
                            <div className="fb-done">
                                <span className="fb-check">
                                    <Check size={26} />
                                </span>
                                <h3>{E.fb_thanks_t}</h3>
                                <p className="muted">{E.fb_thanks_d}</p>
                                <button className="btn ghost" onClick={() => setStatus('idle')}>
                                    {E.fb_again}
                                </button>
                            </div>
                        ) : (
                            <div className="fb-body">
                                <div className="fb-what">
                                    <strong>{E.fb_what}</strong>
                                    <p className="muted small">{E.fb_purpose}</p>
                                </div>

                                <div className="fb-types">
                                    {types.map((ty) => (
                                        <button
                                            key={ty.id}
                                            className={`fb-type ${type === ty.id ? 'on' : ''}`}
                                            onClick={() => setType(ty.id)}
                                            aria-pressed={type === ty.id}
                                        >
                                            <strong>{ty.label}</strong>
                                            <span className="muted small">{ty.hint}</span>
                                        </button>
                                    ))}
                                </div>

                                <label className="set-label" htmlFor="fb-msg">
                                    {E.fb_msg_label}
                                </label>
                                <textarea
                                    id="fb-msg"
                                    className="fb-text"
                                    rows={4}
                                    maxLength={1000}
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    placeholder={E.fb_msg_ph}
                                />
                                <div className="muted small fb-count">{msg.length} / 1000</div>

                                <label className="set-label">{E.fb_rating}</label>
                                <div className="fb-stars">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            className={`fb-star ${rating >= n ? 'on' : ''}`}
                                            onClick={() => setRating(rating === n ? 0 : n)}
                                            aria-label={`${n}`}
                                        >
                                            <Star size={22} />
                                        </button>
                                    ))}
                                </div>

                                {status === 'short' && <p className="notice">{E.fb_short}</p>}
                                {status === 'error' && <p className="notice">{E.fb_err}</p>}

                                <button className="btn" onClick={submit} disabled={status === 'sending'}>
                                    <Send size={16} /> {status === 'sending' ? E.fb_sending : E.fb_send}
                                </button>
                                <p className="muted small">{E.fb_privacy}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
