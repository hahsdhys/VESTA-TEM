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
        sub_signup: 'Create your VESTA TEM account. We will email you a 6-digit code to verify it.',
        cta_signup: 'Send verification code',
        note_signup: 'You will receive a code from VESTA TEM.',
        conf_t: 'Enter your code',
        conf_d: 'VESTA TEM sent a 6-digit code to your email. Type it below to create your account.',
        verify_cta: 'Verify and create account',
        err_mail: 'We could not send the email. Please try again in a moment.',
    },
    tl: {
        sub_signup: 'Gumawa ng VESTA TEM account. Padadalhan ka namin ng 6-digit na code para i-verify ito.',
        cta_signup: 'Ipadala ang verification code',
        note_signup: 'Makakatanggap ka ng code mula sa VESTA TEM.',
        conf_t: 'Ilagay ang code mo',
        conf_d: 'Nagpadala ang VESTA TEM ng 6-digit na code sa email mo. I-type ito sa ibaba para magawa ang account.',
        verify_cta: 'I-verify at gumawa ng account',
        err_mail: 'Hindi naipadala ang email. Subukan ulit mamaya.',
    },
    it: {
        sub_signup: 'Crea il tuo account VESTA TEM. Ti invieremo un codice a 6 cifre per verificarlo.',
        cta_signup: 'Invia codice di verifica',
        note_signup: 'Riceverai un codice da VESTA TEM.',
        conf_t: 'Inserisci il codice',
        conf_d: 'VESTA TEM ha inviato un codice a 6 cifre alla tua email. Digitalo qui sotto per creare l\'account.',
        verify_cta: 'Verifica e crea account',
        err_mail: 'Impossibile inviare l\'email. Riprova tra poco.',
    },
    es: {
        sub_signup: 'Crea tu cuenta de VESTA TEM. Te enviaremos un código de 6 dígitos para verificarla.',
        cta_signup: 'Enviar código de verificación',
        note_signup: 'Recibirás un código de VESTA TEM.',
        conf_t: 'Escribe tu código',
        conf_d: 'VESTA TEM envió un código de 6 dígitos a tu correo. Escríbelo abajo para crear tu cuenta.',
        verify_cta: 'Verificar y crear cuenta',
        err_mail: 'No pudimos enviar el correo. Inténtalo de nuevo en un momento.',
    },
    fr: {
        sub_signup: 'Créez votre compte VESTA TEM. Nous vous enverrons un code à 6 chiffres pour le vérifier.',
        cta_signup: 'Envoyer le code de vérification',
        note_signup: 'Vous recevrez un code de VESTA TEM.',
        conf_t: 'Saisissez votre code',
        conf_d: 'VESTA TEM a envoyé un code à 6 chiffres à votre e-mail. Saisissez-le ci-dessous pour créer votre compte.',
        verify_cta: 'Vérifier et créer le compte',
        err_mail: 'Impossible d\'envoyer l\'e-mail. Réessayez dans un instant.',
    },
    ja: {
        sub_signup: 'VESTA TEMアカウントを作成します。確認用の6桁コードをメールでお送りします。',
        cta_signup: '確認コードを送る',
        note_signup: 'VESTA TEMからコードが届きます。',
        conf_t: 'コードを入力',
        conf_d: 'VESTA TEMが6桁のコードをメールで送りました。下に入力してアカウントを作成してください。',
        verify_cta: '確認して作成',
        err_mail: 'メールを送信できませんでした。しばらくしてからお試しください。',
    },
};
