import type { LangCode } from './i18n';

export interface CodeDict {
    sub_signup: string;
    cta_signup: string;
    note_signup: string;
    conf_t: string;
    conf_d: string;
    verify_cta: string;
    err_mail: string;
}

export const CODEX: Record<LangCode, CodeDict> = {
    en: {
        sub_signup: 'Create your VESTA TEM account with your email and a password.',
        cta_signup: 'Create account',
        note_signup: '',
        conf_t: 'Enter your code',
        conf_d: 'VESTA TEM sent a 6-digit code to your email. Type it below to create your account.',
        verify_cta: 'Verify and create account',
        err_mail: 'We could not send the email. Please try again in a moment.',
    },
    tl: {
        sub_signup: 'Gumawa ng VESTA TEM account gamit ang email at password.',
        cta_signup: 'Gumawa ng account',
        note_signup: '',
        conf_t: 'Ilagay ang code mo',
        conf_d: 'Nagpadala ang VESTA TEM ng 6-digit na code sa email mo. I-type ito sa ibaba para magawa ang account.',
        verify_cta: 'I-verify at gumawa ng account',
        err_mail: 'Hindi naipadala ang email. Subukan ulit mamaya.',
    },
    it: {
        sub_signup: 'Crea il tuo account VESTA TEM con email e password.',
        cta_signup: 'Crea account',
        note_signup: '',
        conf_t: 'Inserisci il codice',
        conf_d: 'VESTA TEM ha inviato un codice a 6 cifre alla tua email. Digitalo qui sotto per creare l\'account.',
        verify_cta: 'Verifica e crea account',
        err_mail: 'Impossibile inviare l\'email. Riprova tra poco.',
    },
    es: {
        sub_signup: 'Crea tu cuenta de VESTA TEM con tu correo y una contraseña.',
        cta_signup: 'Crear cuenta',
        note_signup: '',
        conf_t: 'Escribe tu código',
        conf_d: 'VESTA TEM envió un código de 6 dígitos a tu correo. Escríbelo abajo para crear tu cuenta.',
        verify_cta: 'Verificar y crear cuenta',
        err_mail: 'No pudimos enviar el correo. Inténtalo de nuevo en un momento.',
    },
    fr: {
        sub_signup: 'Créez votre compte VESTA TEM avec votre e-mail et un mot de passe.',
        cta_signup: 'Créer le compte',
        note_signup: '',
        conf_t: 'Saisissez votre code',
        conf_d: 'VESTA TEM a envoyé un code à 6 chiffres à votre e-mail. Saisissez-le ci-dessous pour créer votre compte.',
        verify_cta: 'Vérifier et créer le compte',
        err_mail: 'Impossible d\'envoyer l\'e-mail. Réessayez dans un instant.',
    },
    ja: {
        sub_signup: 'メールアドレスとパスワードでVESTA TEMアカウントを作成します。',
        cta_signup: 'アカウントを作成',
        note_signup: '',
        conf_t: 'コードを入力',
        conf_d: 'VESTA TEMが6桁のコードをメールで送りました。下に入力してアカウントを作成してください。',
        verify_cta: '確認して作成',
        err_mail: 'メールを送信できませんでした。しばらくしてからお試しください。',
    },
};
