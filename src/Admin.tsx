import { useCallback, useEffect, useState } from 'react';
import { api } from './client';
import { Crown, Download, MessageSquare, Plus, Wallet } from 'lucide-react';

interface LedgerRow {
    type: 'income' | 'withdrawal';
    cents: number;
    note: string;
    method: string;
    createdAt: number;
}

interface FeedbackRow {
    type: string;
    message: string;
    rating: number | null;
    email: string;
    createdAt: number;
}

function money(cents: number): string {
    return (cents / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
}

function when(ts: number): string {
    return new Date(ts).toLocaleString();
}

function errText(e: unknown): string {
    const r = e as { response?: { data?: { error?: string; message?: string } }; message?: string };
    return r?.response?.data?.error || r?.response?.data?.message || r?.message || 'Something went wrong';
}

export function OpenTemplateButton({ id }: { id: string }) {
    const [msg, setMsg] = useState('');
    const [busy, setBusy] = useState(false);
    const open = async () => {
        setBusy(true);
        setMsg('');
        try {
            const res = await api.get(`/api/template/${id}`);
            const url = res.data?.url as string | null;
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                setMsg('No Canva link has been added for this template yet.');
            }
        } catch (e) {
            setMsg(errText(e));
        } finally {
            setBusy(false);
        }
    };
    return (
        <>
            <button className="btn premium-use" onClick={open} disabled={busy}>
                <Crown size={16} /> Use template · Unlimited Premium
            </button>
            {msg && <p className="notice">{msg}</p>}
        </>
    );
}

export default function AdminPanel() {
    const [balance, setBalance] = useState(0);
    const [entries, setEntries] = useState<LedgerRow[]>([]);
    const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [incAmount, setIncAmount] = useState('');
    const [incNote, setIncNote] = useState('');
    const [wdAmount, setWdAmount] = useState('');
    const [wdMethod, setWdMethod] = useState('GCash');
    const [wdNote, setWdNote] = useState('');
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const [w, f] = await Promise.all([api.get('/api/admin/wallet'), api.get('/api/admin/feedback')]);
            setBalance(w.data.balanceCents || 0);
            setEntries(w.data.entries || []);
            setFeedback(f.data.items || []);
        } catch (e) {
            setMsg(errText(e));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const addIncome = async () => {
        setBusy(true);
        setMsg('');
        try {
            await api.post('/api/admin/wallet/income', { amount: Number(incAmount), note: incNote });
            setIncAmount('');
            setIncNote('');
            await load();
        } catch (e) {
            setMsg(errText(e));
        } finally {
            setBusy(false);
        }
    };

    const withdraw = async () => {
        setBusy(true);
        setMsg('');
        try {
            await api.post('/api/admin/wallet/withdraw', { amount: Number(wdAmount), method: wdMethod, note: wdNote });
            setWdAmount('');
            setWdNote('');
            await load();
        } catch (e) {
            setMsg(errText(e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="section first">
            <div className="section-head">
                <div>
                    <h2>Admin</h2>
                    <p className="muted">Only your account can see this area.</p>
                </div>
            </div>

            {msg && <p className="notice">{msg}</p>}

            <div className="admin-grid">
                <div className="glass admin-card">
                    <h3>
                        <Crown size={18} /> Unlimited Premium
                    </h3>
                    <p className="muted">
                        Active for this account. Open any template from its card with the gold Use template button.
                    </p>
                </div>

                <div className="glass admin-card">
                    <h3>
                        <Wallet size={18} /> Earnings wallet
                    </h3>
                    <div className="balance" data-testid="wallet-balance">
                        {loading ? '...' : money(balance)}
                    </div>
                    <p className="muted small">
                        This is a bookkeeping ledger. The site does not hold or send real money: after you record a
                        withdrawal here, send the payout from your real GCash, PayPal or bank account.
                    </p>

                    <div className="field">
                        <label>Record income (₱)</label>
                        <input type="number" min="0" step="0.01" value={incAmount} onChange={(e) => setIncAmount(e.target.value)} placeholder="Amount" />
                        <input type="text" maxLength={200} value={incNote} onChange={(e) => setIncNote(e.target.value)} placeholder="Note (e.g. Minimalist Cyan sale)" />
                        <button className="btn btn-sm" onClick={addIncome} disabled={busy}>
                            <Plus size={14} /> Add income
                        </button>
                    </div>

                    <div className="field">
                        <label>Withdraw (₱)</label>
                        <input type="number" min="0" step="0.01" value={wdAmount} onChange={(e) => setWdAmount(e.target.value)} placeholder="Amount" />
                        <select value={wdMethod} onChange={(e) => setWdMethod(e.target.value)}>
                            <option>GCash</option>
                            <option>PayPal</option>
                            <option>Bank</option>
                            <option>Other</option>
                        </select>
                        <input type="text" maxLength={200} value={wdNote} onChange={(e) => setWdNote(e.target.value)} placeholder="Note (optional)" />
                        <button className="btn btn-sm" onClick={withdraw} disabled={busy}>
                            <Download size={14} /> Withdraw
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass admin-card ledger">
                <h3>Wallet history</h3>
                {entries.length === 0 && <p className="muted">No entries yet.</p>}
                {entries.map((en, i) => (
                    <div key={`${en.createdAt}-${i}`} className="ledger-row">
                        <div>
                            <strong>{en.type === 'income' ? 'Income' : `Withdrawal${en.method ? ` · ${en.method}` : ''}`}</strong>
                            <div className="muted small">
                                {when(en.createdAt)}
                                {en.note ? ` · ${en.note}` : ''}
                            </div>
                        </div>
                        <span className={en.type === 'income' ? 'pos' : 'neg'}>
                            {en.type === 'income' ? '+' : '-'}
                            {money(en.cents)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="glass admin-card ledger">
                <h3>
                    <MessageSquare size={18} /> Feedback inbox
                </h3>
                {feedback.length === 0 && <p className="muted">No feedback yet.</p>}
                {feedback.map((f, i) => (
                    <div key={`${f.createdAt}-${i}`} className="fb-item">
                        <div className="muted small">
                            {f.type.toUpperCase()}
                            {f.rating ? ` · ${'★'.repeat(f.rating)}` : ''} · {f.email || 'unknown'} · {when(f.createdAt)}
                        </div>
                        <p>{f.message}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
