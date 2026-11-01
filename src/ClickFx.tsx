import { useEffect } from 'react';

const SELECTOR = 'button, a, [role="button"], .chip, .menu-item, .swatch, .toggle';
const SPARKS = 8;

function burst(x: number, y: number) {
    const ring = document.createElement('div');
    ring.className = 'click-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.body.appendChild(ring);

    const sparks: HTMLElement[] = [];
    for (let i = 0; i < SPARKS; i += 1) {
        const angle = (Math.PI * 2 * i) / SPARKS + Math.random() * 0.5;
        const dist = 26 + Math.random() * 26;
        const s = document.createElement('div');
        s.className = i % 2 ? 'click-spark alt' : 'click-spark';
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(s);
        sparks.push(s);
    }

    window.setTimeout(() => {
        ring.remove();
        sparks.forEach((s) => s.remove());
    }, 700);
}

export default function ClickFx() {
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const onDown = (e: PointerEvent) => {
            if (reduce || document.documentElement.dataset.fx === 'off') {
                return;
            }
            const target = e.target as Element | null;
            const el = target && target.closest ? target.closest(SELECTOR) : null;
            if (!el || (el as HTMLButtonElement).disabled) {
                return;
            }
            burst(e.clientX, e.clientY);
        };
        document.addEventListener('pointerdown', onDown, true);
        return () => document.removeEventListener('pointerdown', onDown, true);
    }, []);

    return null;
}
