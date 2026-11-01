import type { LangCode } from './i18n';

export interface GateDict {
    tab_login: string;
    tab_signup: string;
    title_login: string;
    title_signup: string;
    sub: string;
    cta: string;
    methods: string;
    note: string;
    loading: string;
    email_ph: string;
    email_label: string;
    sent_t: string;
    sent_d: string;
    again: string;
    err_email: string;
    err_generic: string;
    account: string;
    signed_in_as: string;
    sign_out: string;
}

export const GATE: Record<LangCode, GateDict> = {
    en: {
        tab_login: 'Log in',
        tab_signup: 'Sign up',
        title_login: 'Welcome back',
        title_signup: 'Create your account',
        sub: 'Enter your email and we will send you a secure sign-in link. No password needed.',
        cta: 'Send me a sign-in link',
        methods: 'Gmail · iCloud · any email',
        note: 'New here? Your account is created automatically the first time you sign in.',
        loading: 'Checking your session...',
        email_ph: 'you@gmail.com',
        email_label: 'Email address',
        sent_t: 'Check your email',
        sent_d: 'We sent a sign-in link to your email. Open it on this device to enter the store.',
        again: 'Use a different email',
        err_email: 'Please enter a valid email address.',
        err_generic: 'Could not send the link. Please wait a minute and try again.',
        account: 'Account',
        signed_in_as: 'Signed in as',
        sign_out: 'Sign out',
    },
    tl: {
        tab_login: 'Mag-log in',
        tab_signup: 'Mag-sign up',
        title_login: 'Welcome back',
        title_signup: 'Gumawa ng account',
        sub: 'Ilagay ang email mo at padadalhan ka namin ng ligtas na sign-in link. Hindi kailangan ng password.',
        cta: 'Padalhan ako ng sign-in link',
        methods: 'Gmail · iCloud · kahit anong email',
        note: 'Bago ka ba? Awtomatikong magagawa ang account mo sa unang pag-sign in.',
        loading: 'Sinusuri ang session mo...',
        email_ph: 'ikaw@gmail.com',
        email_label: 'Email address',
        sent_t: 'Tingnan ang email mo',
        sent_d: 'Nagpadala kami ng sign-in link sa email mo. Buksan ito sa device na ito para makapasok sa tindahan.',
        again: 'Gumamit ng ibang email',
        err_email: 'Maglagay ng tamang email address.',
        err_generic: 'Hindi naipadala ang link. Maghintay ng isang minuto at subukan ulit.',
        account: 'Account',
        signed_in_as: 'Naka-sign in bilang',
        sign_out: 'Mag-sign out',
    },
    it: {
        tab_login: 'Accedi',
        tab_signup: 'Registrati',
        title_login: 'Bentornato',
        title_signup: 'Crea il tuo account',
        sub: 'Inserisci la tua email e ti invieremo un link di accesso sicuro. Nessuna password.',
        cta: 'Inviami il link di accesso',
        methods: 'Gmail · iCloud · qualsiasi email',
        note: 'Sei nuovo? Il tuo account viene creato automaticamente al primo accesso.',
        loading: 'Controllo della sessione...',
        email_ph: 'tu@gmail.com',
        email_label: 'Indirizzo email',
        sent_t: 'Controlla la tua email',
        sent_d: 'Abbiamo inviato un link di accesso alla tua email. Aprilo su questo dispositivo per entrare nel negozio.',
        again: 'Usa un\'altra email',
        err_email: 'Inserisci un indirizzo email valido.',
        err_generic: 'Impossibile inviare il link. Attendi un minuto e riprova.',
        account: 'Account',
        signed_in_as: 'Accesso eseguito come',
        sign_out: 'Esci',
    },
    es: {
        tab_login: 'Iniciar sesión',
        tab_signup: 'Registrarse',
        title_login: 'Bienvenido de nuevo',
        title_signup: 'Crea tu cuenta',
        sub: 'Escribe tu correo y te enviaremos un enlace de acceso seguro. Sin contraseña.',
        cta: 'Enviarme el enlace de acceso',
        methods: 'Gmail · iCloud · cualquier correo',
        note: '¿Eres nuevo? Tu cuenta se crea automáticamente la primera vez que inicias sesión.',
        loading: 'Comprobando tu sesión...',
        email_ph: 'tu@gmail.com',
        email_label: 'Correo electrónico',
        sent_t: 'Revisa tu correo',
        sent_d: 'Enviamos un enlace de acceso a tu correo. Ábrelo en este dispositivo para entrar a la tienda.',
        again: 'Usar otro correo',
        err_email: 'Escribe un correo electrónico válido.',
        err_generic: 'No se pudo enviar el enlace. Espera un minuto e inténtalo de nuevo.',
        account: 'Cuenta',
        signed_in_as: 'Sesión iniciada como',
        sign_out: 'Cerrar sesión',
    },
    fr: {
        tab_login: 'Connexion',
        tab_signup: 'Inscription',
        title_login: 'Bon retour',
        title_signup: 'Créez votre compte',
        sub: 'Saisissez votre e-mail et nous vous enverrons un lien de connexion sécurisé. Pas de mot de passe.',
        cta: 'Envoyez-moi le lien de connexion',
        methods: 'Gmail · iCloud · toute adresse e-mail',
        note: 'Nouveau ici ? Votre compte est créé automatiquement à la première connexion.',
        loading: 'Vérification de votre session...',
        email_ph: 'vous@gmail.com',
        email_label: 'Adresse e-mail',
        sent_t: 'Consultez votre e-mail',
        sent_d: 'Nous avons envoyé un lien de connexion à votre e-mail. Ouvrez-le sur cet appareil pour entrer dans la boutique.',
        again: 'Utiliser un autre e-mail',
        err_email: 'Saisissez une adresse e-mail valide.',
        err_generic: 'Impossible d\'envoyer le lien. Patientez une minute et réessayez.',
        account: 'Compte',
        signed_in_as: 'Connecté en tant que',
        sign_out: 'Se déconnecter',
    },
    ja: {
        tab_login: 'ログイン',
        tab_signup: '新規登録',
        title_login: 'おかえりなさい',
        title_signup: 'アカウントを作成',
        sub: 'メールアドレスを入力すると、安全なサインインリンクをお送りします。パスワードは不要です。',
        cta: 'サインインリンクを送る',
        methods: 'Gmail · iCloud · どのメールでも',
        note: '初めてですか？初回サインイン時にアカウントが自動で作成されます。',
        loading: 'セッションを確認しています...',
        email_ph: 'you@gmail.com',
        email_label: 'メールアドレス',
        sent_t: 'メールをご確認ください',
        sent_d: 'サインインリンクをメールで送りました。この端末で開くとストアに入れます。',
        again: '別のメールを使う',
        err_email: '有効なメールアドレスを入力してください。',
        err_generic: 'リンクを送信できませんでした。1分ほど待ってからもう一度お試しください。',
        account: 'アカウント',
        signed_in_as: 'ログイン中',
        sign_out: 'ログアウト',
    },
};
