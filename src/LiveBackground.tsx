import { useEffect, useRef } from 'react';

interface Dot {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alt: boolean;
}

const LINK_DIST = 140;
const MOUSE_DIST = 130;

export default function LiveBackground() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const mouse = { x: -9999, y: -9999 };
        let w = 0;
        let h = 0;
        let raf = 0;
        let frame = 0;
        let dots: Dot[] = [];
        let c1 = '#22d3ee';
        let c2 = '#ff2bd6';

        const readColors = () => {
            const cs = getComputedStyle(document.documentElement);
            c1 = cs.getPropertyValue('--accent').trim() || '#22d3ee';
            c2 = cs.getPropertyValue('--accent2').trim() || '#ff2bd6';
        };

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(90, Math.max(30, Math.floor((w * h) / 20000)));
            dots = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.55,
                vy: (Math.random() - 0.5) * 0.55,
                r: 1.2 + Math.random() * 2.2,
                alt: Math.random() > 0.5,
            }));
        };

        const onMove = (e: PointerEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const onLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };

        const draw = () => {
            raf = requestAnimationFrame(draw);
            if (document.hidden) {
                return;
            }
            ctx.clearRect(0, 0, w, h);
            if (document.documentElement.dataset.fx === 'off') {
                return;
            }
            frame += 1;
            if (frame % 40 === 1) {
                readColors();
            }

            for (const d of dots) {
                const dx = d.x - mouse.x;
                const dy = d.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_DIST && dist > 0) {
                    const push = (1 - dist / MOUSE_DIST) * 1.6;
                    d.x += (dx / dist) * push;
                    d.y += (dy / dist) * push;
                }
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < -10) d.x = w + 10;
                if (d.x > w + 10) d.x = -10;
                if (d.y < -10) d.y = h + 10;
                if (d.y > h + 10) d.y = -10;
            }

            ctx.lineWidth = 1;
            for (let i = 0; i < dots.length; i += 1) {
                for (let j = i + 1; j < dots.length; j += 1) {
                    const a = dots[i];
                    const b = dots[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < LINK_DIST) {
                        ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.35;
                        ctx.strokeStyle = a.alt ? c1 : c2;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 0.9;
            for (const d of dots) {
                const col = d.alt ? c1 : c2;
                ctx.fillStyle = col;
                ctx.shadowColor = col;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        };

        resize();
        readColors();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerleave', onLeave);
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return <canvas ref={ref} className="live-bg" aria-hidden="true" />;
}
