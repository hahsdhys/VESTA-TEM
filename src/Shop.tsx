import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Layers,
  Lock,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { CONFIG } from './config';
import { DICT, LANGS } from './i18n';
import type { Dict, LangCode } from './i18n';
import { PRODUCTS } from './products';
import { useSession } from './AuthGate';
import { GATE } from './gate-i18n';
import Plans from './Plans';
import { PLANS } from './plans-i18n';
import { FeedbackWidget, PremiumButton } from './Feedback';
import AdminPanel, { OpenTemplateButton } from './Admin';
import { api } from './client';
import { MEMBERS_LABEL } from './stats-i18n';
import type { Product } from './products';

type Page = 'home' | 'templates' | 'plans' | 'about' | 'admin';
type Accent = 'cyan' | 'magenta' | 'lime' | 'amber';
type Mode = 'dark' | 'light';
type Filter = 'all' | 'free' | 'paid';

interface Prefs {
  lang: LangCode;
  mode: Mode;
  accent: Accent;
  effects: boolean;
  blur: number;
}

const STORAGE_KEY = 'vesta-tem-prefs';
const ACCENTS: { id: Accent; color: string }[] = [
  { id: 'cyan', color: '#22d3ee' },
  { id: 'magenta', color: '#ff2bd6' },
  { id: 'lime', color: '#a3ff12' },
  { id: 'amber', color: '#ffb703' },
];

function detectLang(): LangCode {
  const raw = (navigator.language || 'en').toLowerCase();
  if (raw.startsWith('fil') || raw.startsWith('tl')) {
    return 'tl';
  }
  const found = LANGS.find(l => l.code === raw.slice(0, 2));
  return found ? found.code : 'en';
}

function defaultPrefs(): Prefs {
  return {
    lang: detectLang(),
    mode: 'dark',
    accent: 'cyan',
    effects: true,
    blur: 18,
  };
}

function loadPrefs(): Prefs {
  const base = defaultPrefs();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...base, ...JSON.parse(raw) };
    }
  } catch {
    // storage unavailable, use defaults
  }
  return base;
}

function priceLabel(p: Product, t: Dict): string {
  return p.price === 0 ? t.free : `₱${p.price}`;
}

function Cover({ p }: { p: Product }) {
  const [broken, setBroken] = useState(false);
  const hasImg = Boolean(p.image) && !broken;
  return (
    <div
      className={`cover ${hasImg ? 'has-img' : ''}`}
      style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
    >
      {hasImg ? (
        <img
          className="cover-img"
          src={p.image}
          alt={p.title}
          loading="lazy"
          draggable={false}
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="cover-grid" />
      )}
      <span className="cover-tier">{p.price === 0 ? 'FREE' : 'PREMIUM'}</span>
      <span className="cover-pg">{p.pages}P</span>
      {!hasImg && <div className="cover-title">{p.title}</div>}
      <div className="cover-shield" />
    </div>
  );
}

function Card({
  p,
  t,
  onOpen,
}: {
  p: Product;
  t: Dict;
  onOpen: (p: Product) => void;
}) {
  return (
    <article className="glass card" data-testid="template-card">
      <Cover p={p} />
      <div className="card-body">
        <h3>{p.title}</h3>
        <p className="muted">
          {p.pages} {t.pages} · {t.canva_tpl}
        </p>
        <div className="card-foot">
          <span className="price">{priceLabel(p, t)}</span>
          <button className="btn btn-sm" onClick={() => onOpen(p)}>
            {p.price === 0 ? t.get_free : t.buy}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Shop() {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const session = useSession();
  const [members, setMembers] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .get('/api/stats')
      .then(res => {
        if (alive && typeof res?.data?.users === 'number') {
          setMembers(res.data.users);
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  const [page, setPage] = useState<Page>('home');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [active, setActive] = useState<Product | null>(null);
  const [toast, setToast] = useState('');

  const t = DICT[prefs.lang];
  const msgRef = useRef(t.copy_blocked);
  msgRef.current = t.copy_blocked;
  const toastTimer = useRef<number | undefined>(undefined);

  // apply + persist preferences
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mode = prefs.mode;
    root.dataset.accent = prefs.accent;
    root.dataset.fx = prefs.effects ? 'on' : 'off';
    root.lang = prefs.lang;
    root.style.setProperty('--blur', `${prefs.blur}px`);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  // content protection
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    const notify = () => {
      setToast(msgRef.current);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(''), 2400);
    };
    const onContext = (e: Event) => {
      e.preventDefault();
      notify();
    };
    const onBlock = (e: Event) => {
      if (isField(e.target)) {
        return;
      }
      e.preventDefault();
    };
    const onCopy = (e: ClipboardEvent) => {
      if (isField(e.target)) {
        return;
      }
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '© VESTA TEM');
      notify();
    };
    const onKey = (e: KeyboardEvent) => {
      const k = (e.key || '').toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      const tools =
        k === 'f12' ||
        (mod && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (mod && k === 'u');
      const save = mod && (k === 's' || k === 'p');
      const clip = mod && ['c', 'x', 'a'].includes(k) && !isField(e.target);
      if (tools || save || clip) {
        e.preventDefault();
        notify();
      }
    };
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('selectstart', onBlock);
    document.addEventListener('dragstart', onBlock);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCopy);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('selectstart', onBlock);
      document.removeEventListener('dragstart', onBlock);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('cut', onCopy);
      window.removeEventListener('keydown', onKey, true);
    };
  }, []);

  // Escape closes overlays
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(null);
        setSettingsOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PRODUCTS.filter(p => {
      const okFilter =
        filter === 'all' || (filter === 'free' ? p.price === 0 : p.price > 0);
      const okSearch =
        !s || `${p.title} ${p.keywords}`.toLowerCase().includes(s);
      return okFilter && okSearch;
    });
  }, [q, filter]);

  const go = (next: Page) => {
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSearch = (value: string) => {
    setQ(value);
    if (page !== 'templates') {
      setPage('templates');
    }
  };

  const update = (patch: Partial<Prefs>) => setPrefs(p => ({ ...p, ...patch }));

  const checkoutUrl = active ? active.buyUrl || CONFIG.checkoutUrl : '';
  const checkout = () => {
    if (!active || !checkoutUrl) {
      return;
    }
    const sep = checkoutUrl.includes('?') ? '&' : '?';
    window.open(
      `${checkoutUrl}${sep}template=${encodeURIComponent(active.title)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: t.nav_home },
    { id: 'templates', label: t.nav_templates },
    { id: 'plans', label: PLANS[prefs.lang].nav_plans },
    { id: 'about', label: t.nav_about },
    ...(session?.isAdmin ? [{ id: 'admin' as Page, label: 'Admin' }] : []),
  ];

  return (
    <div className="shell">
      <div className="bg" aria-hidden="true">
        <div className="bg-grid" />
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="scan" />
      </div>


      <header className="header glass">
        <button
          className="logo"
          onClick={() => go('home')}
          aria-label="VESTA TEM"
        >
          <span className="logo-mark">
            <svg viewBox="0 0 64 64" width="22" height="22" aria-hidden="true">
              <path
                d="M12 16l20 34 20-34"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="logo-text">VESTA TEM</span>
        </button>

        <nav className="nav" aria-label="Main">
          {navItems.map(n => (
            <button
              key={n.id}
              className={`nav-link ${page === n.id ? 'on' : ''}`}
              onClick={() => go(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="search">
          <Search size={16} />
          <input
            type="search"
            value={q}
            onChange={e => onSearch(e.target.value)}
            placeholder={t.search_ph}
            aria-label={t.search_ph}
          />
          {q && (
            <button
              className="icon-btn tiny"
              onClick={() => setQ('')}
              aria-label={t.clear}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <PremiumButton lang={prefs.lang} onClick={() => go('plans')} />
        <button
          className="icon-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label={t.settings}
        >
          <Settings size={18} />
        </button>
        <button
          className="icon-btn burger"
          onClick={() => setMenuOpen(true)}
          aria-label={t.menu}
        >
          <Menu size={18} />
        </button>
      </header>

      <main className="container">
        {page === 'home' && (
          <>
            <section className="hero">
              <span className="badge">
                <Sparkles size={14} /> {t.hero_badge}
              </span>
              <h1 className="glitch" data-text="VESTA TEM">
                VESTA TEM
              </h1>
              <h2 className="hero-title">{t.hero_title}</h2>
              <p className="hero-sub">{t.hero_sub}</p>
              <div className="cta">
                <button className="btn" onClick={() => go('templates')}>
                  {t.cta_browse} <ArrowRight size={16} />
                </button>
                <button className="btn ghost" onClick={() => go('about')}>
                  {t.cta_about}
                </button>
              </div>
              <div className="stats">
                <div className="glass stat">
                  <strong>{PRODUCTS.length}</strong>
                  <span>{t.stat_templates}</span>
                </div>
                <div className="glass stat">
                  <strong>{t.free}</strong>
                  <span>{t.stat_from}</span>
                </div>
                <div className="glass stat">
                  <strong>100%</strong>
                  <span>{t.stat_edit}</span>
                </div>
                <div className="glass stat" data-testid="members-stat">
                  <strong>{members === null ? '...' : members.toLocaleString()}</strong>
                  <span>{MEMBERS_LABEL[prefs.lang]}</span>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div>
                  <h2>{t.featured}</h2>
                  <p className="muted">{t.featured_sub}</p>
                </div>
                <button
                  className="btn ghost btn-sm"
                  onClick={() => go('templates')}
                >
                  {t.view_all} <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid">
                {PRODUCTS.slice(0, 4).map(p => (
                  <Card key={p.id} p={p} t={t} onOpen={setActive} />
                ))}
              </div>
            </section>

            <section className="section">
              <h2>{t.how_title}</h2>
              <div className="steps">
                <div className="glass step">
                  <Layers size={22} />
                  <h3>{t.step1_t}</h3>
                  <p className="muted">{t.step1_d}</p>
                </div>
                <div className="glass step">
                  <Zap size={22} />
                  <h3>{t.step2_t}</h3>
                  <p className="muted">{t.step2_d}</p>
                </div>
                <div className="glass step">
                  <Sparkles size={22} />
                  <h3>{t.step3_t}</h3>
                  <p className="muted">{t.step3_d}</p>
                </div>
              </div>
            </section>

            <Plans
              lang={prefs.lang}
              onBrowseFree={() => {
                setFilter('free');
                go('templates');
              }}
            />
          </>
        )}

        {page === 'templates' && (
          <section className="section first">
            <div className="section-head">
              <div>
                <h2>{t.all_templates}</h2>
                <p className="muted" data-testid="result-count">
                  {list.length} {t.results}
                </p>
              </div>
              <div className="chips" role="tablist">
                {(['all', 'free', 'paid'] as Filter[]).map(f => (
                  <button
                    key={f}
                    className={`chip ${filter === f ? 'on' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all'
                      ? t.filter_all
                      : f === 'free'
                        ? t.filter_free
                        : t.filter_paid}
                  </button>
                ))}
              </div>
            </div>
            {list.length === 0 ? (
              <div className="glass empty">{t.no_results}</div>
            ) : (
              <div className="grid">
                {list.map(p => (
                  <Card key={p.id} p={p} t={t} onOpen={setActive} />
                ))}
              </div>
            )}
          </section>
        )}

        {page === 'plans' && (
          <Plans
            lang={prefs.lang}
            onBrowseFree={() => {
              setFilter('free');
              go('templates');
            }}
          />
        )}

        {page === 'admin' && session?.isAdmin && <AdminPanel />}

        {page === 'about' && (
          <section className="section first">
            <div className="glass about">
              <ShieldCheck size={28} />
              <h2>{t.about_title}</h2>
              <p>{t.about_text}</p>
              <p className="muted">{t.about_text2}</p>
              {CONFIG.contactUrl && (
                <a
                  className="btn"
                  href={CONFIG.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.contact}
                </a>
              )}
            </div>
            <div className="steps">
              <div className="glass step">
                <Layers size={22} />
                <h3>{t.step1_t}</h3>
                <p className="muted">{t.step1_d}</p>
              </div>
              <div className="glass step">
                <Zap size={22} />
                <h3>{t.step2_t}</h3>
                <p className="muted">{t.step2_d}</p>
              </div>
              <div className="glass step">
                <Sparkles size={22} />
                <h3>{t.step3_t}</h3>
                <p className="muted">{t.step3_d}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>© 2026 VESTA TEM. {t.footer}</span>
        <span className="muted lock">
          <Lock size={13} /> {t.protected}
        </span>
      </footer>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}>
          <aside
            className="glass drawer left"
            onClick={e => e.stopPropagation()}
          >
            <div className="drawer-head">
              <strong>{t.menu}</strong>
              <button
                className="icon-btn"
                onClick={() => setMenuOpen(false)}
                aria-label={t.close}
              >
                <X size={18} />
              </button>
            </div>
            {navItems.map(n => (
              <button
                key={n.id}
                className={`menu-item ${page === n.id ? 'on' : ''}`}
                onClick={() => go(n.id)}
              >
                {n.label}
              </button>
            ))}
            <button
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                setSettingsOpen(true);
              }}
            >
              {t.settings}
            </button>
          </aside>
        </div>
      )}

      {settingsOpen && (
        <div className="overlay" onClick={() => setSettingsOpen(false)}>
          <aside
            className="glass drawer right"
            role="dialog"
            aria-label={t.settings}
            onClick={e => e.stopPropagation()}
          >
            <div className="drawer-head">
              <strong>{t.settings}</strong>
              <button
                className="icon-btn"
                onClick={() => setSettingsOpen(false)}
                aria-label={t.close}
              >
                <X size={18} />
              </button>
            </div>

            <div className="set-block">
              <label className="set-label">{t.language}</label>
              <div className="lang-grid">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    className={`chip ${prefs.lang === l.code ? 'on' : ''}`}
                    onClick={() => update({ lang: l.code })}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="set-block">
              <label className="set-label">
                {t.theme} · {t.mode}
              </label>
              <div className="seg">
                <button
                  className={`chip ${prefs.mode === 'dark' ? 'on' : ''}`}
                  onClick={() => update({ mode: 'dark' })}
                >
                  {t.dark}
                </button>
                <button
                  className={`chip ${prefs.mode === 'light' ? 'on' : ''}`}
                  onClick={() => update({ mode: 'light' })}
                >
                  {t.light}
                </button>
              </div>
            </div>

            <div className="set-block">
              <label className="set-label">{t.accent}</label>
              <div className="swatches">
                {ACCENTS.map(a => (
                  <button
                    key={a.id}
                    className={`swatch ${prefs.accent === a.id ? 'on' : ''}`}
                    style={{ background: a.color }}
                    onClick={() => update({ accent: a.id })}
                    aria-label={a.id}
                  />
                ))}
              </div>
            </div>

            <div className="set-block row">
              <div>
                <label className="set-label">{t.effects}</label>
                <p className="muted small">{t.effects_desc}</p>
              </div>
              <button
                className={`toggle ${prefs.effects ? 'on' : ''}`}
                role="switch"
                aria-checked={prefs.effects}
                aria-label={t.effects}
                onClick={() => update({ effects: !prefs.effects })}
              >
                <span />
              </button>
            </div>

            <div className="set-block">
              <label className="set-label">
                {t.blur}: {prefs.blur}px
              </label>
              <input
                type="range"
                min={6}
                max={32}
                value={prefs.blur}
                onChange={e => update({ blur: Number(e.target.value) })}
              />
            </div>

            {session && (
              <div className="set-block account">
                <label className="set-label">{GATE[prefs.lang].account}</label>
                <p className="muted small">
                  {GATE[prefs.lang].signed_in_as} {session.email || session.name}
                </p>
                <button className="btn ghost" onClick={() => session.signOut()}>
                  {GATE[prefs.lang].sign_out}
                </button>
              </div>
            )}

            <button
              className="btn ghost"
              onClick={() => setPrefs(defaultPrefs())}
            >
              {t.reset}
            </button>
          </aside>
        </div>
      )}

      {active && (
        <div className="overlay center" onClick={() => setActive(null)}>
          <div
            className="glass modal"
            role="dialog"
            aria-label={active.title}
            onClick={e => e.stopPropagation()}
          >
            <Cover p={active} />
            <div className="modal-body">
              <h3>{active.title}</h3>
              <p className="muted">
                {active.pages} {t.pages} · {t.canva_tpl}
              </p>
              <div className="price big">{priceLabel(active, t)}</div>
              <p className="muted small">{t.modal_note}</p>
              {session?.isAdmin ? (
                <OpenTemplateButton id={active.id} />
              ) : (
                !checkoutUrl && <p className="notice">{t.modal_soon}</p>
              )}
              <div className="cta">
                <button
                  className="btn"
                  onClick={checkout}
                  disabled={!checkoutUrl}
                >
                  {t.modal_continue}
                </button>
                <button
                  className="btn ghost"
                  onClick={() => {
                    setActive(null);
                    go('plans');
                  }}
                >
                  {PLANS[prefs.lang].view_plans}
                </button>
                <button className="btn ghost" onClick={() => setActive(null)}>
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FeedbackWidget lang={prefs.lang} />

      {toast && (
        <div className="toast glass" role="status">
          <ShieldCheck size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
