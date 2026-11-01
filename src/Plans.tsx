import { useState } from 'react';
import { Check } from 'lucide-react';
import { CONFIG } from './config';
import type { LangCode } from './i18n';
import { PLANS } from './plans-i18n';
import { PRODUCTS } from './products';
import type { Product } from './products';

type PlanId = 'free' | 'monthly' | 'yearly';

function Thumb({ p }: { p: Product }) {
    const [broken, setBroken] = useState(false);
    return (
        <span className="thumb" title={p.title} style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}>
            {p.image && !broken && (
                <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    draggable={false}
                    referrerPolicy="no-referrer"
                    onError={() => setBroken(true)}
                />
            )}
        </span>
    );
}

export default function Plans({ lang, onBrowseFree }: { lang: LangCode; onBrowseFree: () => void }) {
    const P = PLANS[lang];
    const [notice, setNotice] = useState<PlanId | null>(null);
    const freeList = PRODUCTS.filter((p) => p.price === 0);

    const choose = (id: PlanId) => {
        if (id === 'free') {
            onBrowseFree();
            return;
        }
        const base = CONFIG.checkoutUrl;
        if (!base) {
            setNotice(id);
            return;
        }
        const sep = base.includes('?') ? '&' : '?';
        const plan = id === 'monthly' ? 'premium-monthly' : 'premium-yearly';
        window.open(`${base}${sep}plan=${plan}`, '_blank', 'noopener,noreferrer');
    };

    const plans: {
        id: PlanId;
        name: string;
        price: string;
        was?: string;
        per: string;
        sub?: string;
        badge?: string;
        feats: string[];
        thumbs: Product[];
        cta: string;
        hl: boolean;
    }[] = [
        {
            id: 'free',
            name: P.free_name,
            price: '$0',
            per: P.free_per,
            feats: [P.f_free1, P.f_free2, P.f_free3],
            thumbs: freeList,
            cta: P.cta_free,
            hl: false,
        },
        {
            id: 'monthly',
            name: P.m_name,
            price: '$3',
            per: P.m_per,
            feats: [P.f_prem1, P.f_prem2, P.f_cancel],
            thumbs: PRODUCTS,
            cta: P.cta_premium,
            hl: false,
        },
        {
            id: 'yearly',
            name: P.y_name,
            price: '$23.76',
            was: '$36',
            per: P.y_per,
            sub: `≈ $1.98 ${P.m_per}`,
            badge: `${P.popular} · ${P.y_save}`,
            feats: [P.f_prem1, P.f_prem2, P.f_year],
            thumbs: PRODUCTS,
            cta: P.cta_premium,
            hl: true,
        },
    ];

    return (
        <section className="section" id="plans">
            <div className="section-head">
                <div>
                    <h2>{P.title}</h2>
                    <p className="muted">{P.sub}</p>
                </div>
            </div>
            <div className="plan-grid">
                {plans.map((pl) => {
                    const shown = pl.thumbs.slice(0, 5);
                    const extra = pl.thumbs.length - shown.length;
                    return (
                        <article key={pl.id} className={`glass plan ${pl.hl ? 'hl' : ''}`} data-testid={`plan-${pl.id}`}>
                            {pl.badge && <span className="plan-badge">{pl.badge}</span>}
                            <h3>{pl.name}</h3>
                            <div className="plan-price">
                                <strong>{pl.price}</strong>
                                {pl.was && <s className="muted">{pl.was}</s>}
                                <span className="muted">{pl.per}</span>
                            </div>
                            {pl.sub && <p className="muted small">{pl.sub}</p>}
                            <ul className="plan-feats">
                                {pl.feats.map((f) => (
                                    <li key={f}>
                                        <Check size={16} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="thumbs">
                                {shown.map((p) => (
                                    <Thumb key={p.id} p={p} />
                                ))}
                                {extra > 0 && <span className="thumb more">+{extra}</span>}
                            </div>
                            <button className={`btn ${pl.hl ? '' : 'ghost'}`} onClick={() => choose(pl.id)}>
                                {pl.cta}
                            </button>
                            {notice === pl.id && <p className="notice">{P.note_soon}</p>}
                        </article>
                    );
                })}
            </div>
            <p className="muted small plan-note">{P.note_prices}</p>
        </section>
    );
}
