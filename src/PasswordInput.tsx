import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    autoComplete?: string;
    show: string;
    hide: string;
}

export default function PasswordInput({ id, value, onChange, placeholder, autoComplete, show, hide }: Props) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="pw-wrap">
            <input
                id={id}
                className="gate-input pw-input"
                type={visible ? 'text' : 'password'}
                autoComplete={autoComplete}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                minLength={8}
                required
            />
            <button
                type="button"
                className="pw-eye"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? hide : show}
                aria-pressed={visible}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}
