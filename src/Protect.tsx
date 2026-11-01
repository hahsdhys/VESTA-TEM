import { useEffect, useState } from 'react';

// Deterrent only: browsers always let the owner of a device view what they download.
// This blocks the casual routes (right-click, F12, view-source, save, print) and
// covers the page while developer tools are open. Real secrets must stay on the server.
const BLOCKED_CTRL_SHIFT = ['i', 'j', 'c', 'k'];
const BLOCKED_CTRL = ['u', 's', 'p'];

function isDesktop(): boolean {
    return !window.matchMedia('(pointer: coarse)').matches;
}

export default function Protect() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const stop = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const onKey = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;
            const blocked =
                e.key === 'F12' ||
                (ctrl && e.shiftKey && BLOCKED_CTRL_SHIFT.includes(k)) ||
                (ctrl && e.altKey && BLOCKED_CTRL_SHIFT.includes(k)) ||
                (ctrl && !e.shiftKey && BLOCKED_CTRL.includes(k));
            if (blocked) {
                stop(e);
            }
        };
        const onContext = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest && t.closest('input, textarea')) {
                return;
            }
            stop(e);
        };
        document.addEventListener('contextmenu', onContext);
        document.addEventListener('dragstart', stop);
        window.addEventListener('keydown', onKey, true);

        let timer = 0;
        if (isDesktop()) {
            const check = () => {
                const wide = window.outerWidth - window.innerWidth > 200;
                const tall = window.outerHeight - window.innerHeight > 200;
                let paused = false;
                const t0 = performance.now();
                // eslint-disable-next-line no-debugger
                debugger;
                if (performance.now() - t0 > 100) {
                    paused = true;
                }
                setOpen(wide || tall || paused);
            };
            timer = window.setInterval(check, 1000);
            check();
        }

        return () => {
            document.removeEventListener('contextmenu', onContext);
            document.removeEventListener('dragstart', stop);
            window.removeEventListener('keydown', onKey, true);
            window.clearInterval(timer);
        };
    }, []);

    if (!open) {
        return null;
    }
    return (
        <div className="protect-wall" role="alert">
            <div className="glass protect-card">
                <h2>VESTA TEM</h2>
                <p className="muted">Developer tools are not allowed here. Close them to continue.</p>
            </div>
        </div>
    );
}
