export interface Product {
    id: string;
    title: string;
    pages: number;
    price: number;
    c1: string;
    c2: string;
    keywords: string;
    // Cover image of the real Canva design (falls back to the generated cover if it fails to load).
    image?: string;
    // Optional per-template checkout link. Falls back to CONFIG.checkoutUrl.
    buyUrl?: string;
}

export const PRODUCTS: Product[] = [
    { id: 'neon-cyberpunk', title: 'Neon Cyberpunk', pages: 10, price: 0, c1: '#ff2bd6', c2: '#22d3ee', keywords: 'neon cyberpunk glow dark tech free', image: 'https://design.canva.ai/gVew6A3oVwUhug4' },
    { id: 'minimalist-cyan', title: 'Minimalist Cyan', pages: 10, price: 100, c1: '#0891b2', c2: '#67e8f9', keywords: 'minimalist minimal cyan clean simple', image: 'https://design.canva.ai/iWvfOapQSS5TUq4' },
    { id: 'pixel-art-student', title: 'Pixel Art Student', pages: 12, price: 100, c1: '#4c1d95', c2: '#8b5cf6', keywords: 'pixel art student violet royal school game', image: 'https://design.canva.ai/V61B_5VlN2BlJ5f' },
    { id: 'victorian-classic', title: 'Victorian Classic', pages: 10, price: 50, c1: '#111827', c2: '#9ca3af', keywords: 'victorian classic vintage black white gray elegant', image: 'https://design.canva.ai/qqX5GTL4l_thaaE' },
    { id: 'boho-aesthetic', title: 'Boho Aesthetic', pages: 10, price: 50, c1: '#a16207', c2: '#e9c8a0', keywords: 'boho bohemian earthy aesthetic warm beige', image: 'https://design.canva.ai/cgaYORMyKyZcrZn' },
    { id: 'retro-70s', title: 'Retro 70s', pages: 10, price: 25, c1: '#ea580c', c2: '#fbbf24', keywords: 'retro 70s seventies vintage orange groovy', image: 'https://design.canva.ai/FIZecfwe6AoKEE6' },
    { id: 'corporate-navy-gold', title: 'Corporate Navy & Gold', pages: 10, price: 125, c1: '#1e3a8a', c2: '#facc15', keywords: 'corporate business navy gold professional pitch', image: 'https://design.canva.ai/M4ES22aHLDOy93T' },
    { id: 'kawaii-pastel', title: 'Kawaii Pastel', pages: 10, price: 75, c1: '#f472b6', c2: '#a5b4fc', keywords: 'kawaii pastel cute pink soft', image: 'https://design.canva.ai/W7szRMBuhVOq9Gu' },
];
