import type { LangCode } from './i18n';

export interface PlansDict {
    nav_plans: string;
    title: string;
    sub: string;
    free_name: string;
    free_per: string;
    f_free1: string;
    f_free2: string;
    f_free3: string;
    m_name: string;
    m_per: string;
    y_name: string;
    y_per: string;
    y_save: string;
    popular: string;
    f_prem1: string;
    f_prem2: string;
    f_cancel: string;
    f_year: string;
    cta_free: string;
    cta_premium: string;
    note_soon: string;
    note_prices: string;
    view_plans: string;
}

export const PLANS: Record<LangCode, PlansDict> = {
    en: {
        nav_plans: 'Plans',
        title: 'Choose your plan',
        sub: 'Start free, or unlock every template with Premium.',
        free_name: 'Free',
        free_per: 'forever',
        f_free1: 'Free templates',
        f_free2: 'Preview every template cover',
        f_free3: 'Edit in Canva with your account',
        m_name: 'Premium Monthly',
        m_per: '/ month',
        y_name: 'Premium Yearly',
        y_per: '/ year',
        y_save: 'Save 34%',
        popular: 'Best value',
        f_prem1: 'Every template unlocked',
        f_prem2: 'Original VESTA TEM designs',
        f_cancel: 'Cancel anytime',
        f_year: 'Billed once a year',
        cta_free: 'Browse free templates',
        cta_premium: 'Get Premium',
        note_soon: 'Checkout is being set up. Please check back soon.',
        note_prices: 'Prices are in USD. You can also buy single templates from the Templates page.',
        view_plans: 'See Premium plans',
    },
    tl: {
        nav_plans: 'Mga Plano',
        title: 'Piliin ang plano mo',
        sub: 'Magsimula nang libre, o i-unlock lahat ng template gamit ang Premium.',
        free_name: 'Libre',
        free_per: 'habambuhay',
        f_free1: 'Mga libreng template',
        f_free2: 'Silipin ang cover ng bawat template',
        f_free3: 'I-edit sa Canva gamit ang account mo',
        m_name: 'Premium Buwanan',
        m_per: '/ buwan',
        y_name: 'Premium Taunan',
        y_per: '/ taon',
        y_save: 'Tipid 34%',
        popular: 'Pinakamura',
        f_prem1: 'Bukas lahat ng template',
        f_prem2: 'Orihinal na disenyo ng VESTA TEM',
        f_cancel: 'Puwedeng kanselahin anumang oras',
        f_year: 'Isang bayad kada taon',
        cta_free: 'Tingnan ang mga libreng template',
        cta_premium: 'Kunin ang Premium',
        note_soon: 'Inaayos pa ang checkout. Balikan po namin ito sa lalong madaling panahon.',
        note_prices: 'Ang mga presyo ay nasa USD. Puwede ka ring bumili ng isang template sa pahina ng Mga Template.',
        view_plans: 'Tingnan ang mga Premium plan',
    },
    it: {
        nav_plans: 'Piani',
        title: 'Scegli il tuo piano',
        sub: 'Inizia gratis, oppure sblocca tutti i template con Premium.',
        free_name: 'Gratis',
        free_per: 'per sempre',
        f_free1: 'Template gratuiti',
        f_free2: 'Anteprima di ogni copertina',
        f_free3: 'Modifica su Canva con il tuo account',
        m_name: 'Premium Mensile',
        m_per: '/ mese',
        y_name: 'Premium Annuale',
        y_per: '/ anno',
        y_save: 'Risparmia il 34%',
        popular: 'Il più conveniente',
        f_prem1: 'Tutti i template sbloccati',
        f_prem2: 'Design originali VESTA TEM',
        f_cancel: 'Annulla quando vuoi',
        f_year: 'Fatturato una volta l\'anno',
        cta_free: 'Sfoglia i template gratuiti',
        cta_premium: 'Passa a Premium',
        note_soon: 'Il checkout è in preparazione. Torna presto a trovarci.',
        note_prices: 'I prezzi sono in USD. Puoi anche acquistare singoli template dalla pagina Template.',
        view_plans: 'Vedi i piani Premium',
    },
    es: {
        nav_plans: 'Planes',
        title: 'Elige tu plan',
        sub: 'Empieza gratis o desbloquea todas las plantillas con Premium.',
        free_name: 'Gratis',
        free_per: 'para siempre',
        f_free1: 'Plantillas gratuitas',
        f_free2: 'Vista previa de cada portada',
        f_free3: 'Edita en Canva con tu cuenta',
        m_name: 'Premium Mensual',
        m_per: '/ mes',
        y_name: 'Premium Anual',
        y_per: '/ año',
        y_save: 'Ahorra 34%',
        popular: 'Mejor valor',
        f_prem1: 'Todas las plantillas desbloqueadas',
        f_prem2: 'Diseños originales de VESTA TEM',
        f_cancel: 'Cancela cuando quieras',
        f_year: 'Se cobra una vez al año',
        cta_free: 'Ver plantillas gratuitas',
        cta_premium: 'Obtener Premium',
        note_soon: 'El pago se está configurando. Vuelve pronto.',
        note_prices: 'Los precios están en USD. También puedes comprar plantillas sueltas en la página de Plantillas.',
        view_plans: 'Ver planes Premium',
    },
    fr: {
        nav_plans: 'Offres',
        title: 'Choisissez votre offre',
        sub: 'Commencez gratuitement, ou débloquez tous les modèles avec Premium.',
        free_name: 'Gratuit',
        free_per: 'à vie',
        f_free1: 'Modèles gratuits',
        f_free2: 'Aperçu de chaque couverture',
        f_free3: 'Modifiez dans Canva avec votre compte',
        m_name: 'Premium Mensuel',
        m_per: '/ mois',
        y_name: 'Premium Annuel',
        y_per: '/ an',
        y_save: 'Économisez 34 %',
        popular: 'Meilleur prix',
        f_prem1: 'Tous les modèles débloqués',
        f_prem2: 'Designs originaux VESTA TEM',
        f_cancel: 'Annulable à tout moment',
        f_year: 'Facturé une fois par an',
        cta_free: 'Parcourir les modèles gratuits',
        cta_premium: 'Passer à Premium',
        note_soon: 'Le paiement est en cours de configuration. Revenez bientôt.',
        note_prices: 'Les prix sont en USD. Vous pouvez aussi acheter des modèles à l\'unité depuis la page Modèles.',
        view_plans: 'Voir les offres Premium',
    },
    ja: {
        nav_plans: 'プラン',
        title: 'プランを選ぶ',
        sub: '無料で始めるか、Premiumですべてのテンプレートを解放しましょう。',
        free_name: '無料',
        free_per: 'ずっと',
        f_free1: '無料テンプレート',
        f_free2: 'すべてのテンプレートのカバーをプレビュー',
        f_free3: 'あなたのCanvaアカウントで編集',
        m_name: 'Premium 月額',
        m_per: '/ 月',
        y_name: 'Premium 年額',
        y_per: '/ 年',
        y_save: '34%お得',
        popular: '最もお得',
        f_prem1: 'すべてのテンプレートを解放',
        f_prem2: 'VESTA TEMオリジナルデザイン',
        f_cancel: 'いつでも解約可能',
        f_year: '年に1回のお支払い',
        cta_free: '無料テンプレートを見る',
        cta_premium: 'Premiumを始める',
        note_soon: '決済を準備中です。もうしばらくお待ちください。',
        note_prices: '価格はUSDです。テンプレートページで個別購入もできます。',
        view_plans: 'Premiumプランを見る',
    },
};
