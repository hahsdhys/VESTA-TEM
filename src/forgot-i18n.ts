import type { LangCode } from './i18n';

export interface ForgotDict {
    show: string;
    hide: string;
    forgot: string;
    f_title: string;
    f_sub: string;
    f_cta: string;
    r_title: string;
    r_sub: string;
    code: string;
    code_ph: string;
    new_pw: string;
    r_cta: string;
    resend_code: string;
    code_sent: string;
    back: string;
    err_code: string;
    err_wait: string;
}

export const FORGOT: Record<LangCode, ForgotDict> = {
    en: {
        show: 'Show password',
        hide: 'Hide password',
        forgot: 'Forgot password?',
        f_title: 'Reset your password',
        f_sub: 'Enter your account email. VESTA TEM will send a verification code to your Gmail.',
        f_cta: 'Send verification code',
        r_title: 'Enter the code',
        r_sub: 'We sent a verification code to your email. Type it below and choose a new password.',
        code: 'Verification code',
        code_ph: '6-digit code',
        new_pw: 'New password',
        r_cta: 'Save new password',
        resend_code: 'Send a new code',
        code_sent: 'A new code was sent.',
        back: 'Back to log in',
        err_code: 'That code is wrong or has expired. Request a new one.',
        err_wait: 'Please wait a minute before asking for another code.',
    },
    tl: {
        show: 'Ipakita ang password',
        hide: 'Itago ang password',
        forgot: 'Nakalimutan ang password?',
        f_title: 'I-reset ang password',
        f_sub: 'Ilagay ang email ng account mo. Magpapadala ang VESTA TEM ng verification code sa Gmail mo.',
        f_cta: 'Ipadala ang verification code',
        r_title: 'Ilagay ang code',
        r_sub: 'Nagpadala kami ng verification code sa email mo. I-type ito sa ibaba at pumili ng bagong password.',
        code: 'Verification code',
        code_ph: '6-digit na code',
        new_pw: 'Bagong password',
        r_cta: 'I-save ang bagong password',
        resend_code: 'Magpadala ng bagong code',
        code_sent: 'Nagpadala ng bagong code.',
        back: 'Bumalik sa log in',
        err_code: 'Mali o expired na ang code. Humiling ng bago.',
        err_wait: 'Maghintay ng isang minuto bago humiling ng bagong code.',
    },
    it: {
        show: 'Mostra password',
        hide: 'Nascondi password',
        forgot: 'Password dimenticata?',
        f_title: 'Reimposta la password',
        f_sub: 'Inserisci l\'email dell\'account. VESTA TEM invierà un codice di verifica al tuo Gmail.',
        f_cta: 'Invia codice di verifica',
        r_title: 'Inserisci il codice',
        r_sub: 'Abbiamo inviato un codice di verifica alla tua email. Digitalo qui sotto e scegli una nuova password.',
        code: 'Codice di verifica',
        code_ph: 'Codice a 6 cifre',
        new_pw: 'Nuova password',
        r_cta: 'Salva nuova password',
        resend_code: 'Invia un nuovo codice',
        code_sent: 'Nuovo codice inviato.',
        back: 'Torna all\'accesso',
        err_code: 'Il codice è errato o scaduto. Richiedine uno nuovo.',
        err_wait: 'Attendi un minuto prima di chiedere un altro codice.',
    },
    es: {
        show: 'Mostrar contraseña',
        hide: 'Ocultar contraseña',
        forgot: '¿Olvidaste tu contraseña?',
        f_title: 'Restablece tu contraseña',
        f_sub: 'Escribe el correo de tu cuenta. VESTA TEM enviará un código de verificación a tu Gmail.',
        f_cta: 'Enviar código de verificación',
        r_title: 'Escribe el código',
        r_sub: 'Enviamos un código de verificación a tu correo. Escríbelo abajo y elige una nueva contraseña.',
        code: 'Código de verificación',
        code_ph: 'Código de 6 dígitos',
        new_pw: 'Nueva contraseña',
        r_cta: 'Guardar nueva contraseña',
        resend_code: 'Enviar un código nuevo',
        code_sent: 'Se envió un código nuevo.',
        back: 'Volver a iniciar sesión',
        err_code: 'El código es incorrecto o caducó. Pide uno nuevo.',
        err_wait: 'Espera un minuto antes de pedir otro código.',
    },
    fr: {
        show: 'Afficher le mot de passe',
        hide: 'Masquer le mot de passe',
        forgot: 'Mot de passe oublié ?',
        f_title: 'Réinitialisez votre mot de passe',
        f_sub: 'Saisissez l\'e-mail du compte. VESTA TEM enverra un code de vérification à votre Gmail.',
        f_cta: 'Envoyer le code de vérification',
        r_title: 'Saisissez le code',
        r_sub: 'Nous avons envoyé un code de vérification à votre e-mail. Saisissez-le ci-dessous et choisissez un nouveau mot de passe.',
        code: 'Code de vérification',
        code_ph: 'Code à 6 chiffres',
        new_pw: 'Nouveau mot de passe',
        r_cta: 'Enregistrer le nouveau mot de passe',
        resend_code: 'Envoyer un nouveau code',
        code_sent: 'Un nouveau code a été envoyé.',
        back: 'Retour à la connexion',
        err_code: 'Le code est incorrect ou expiré. Demandez-en un nouveau.',
        err_wait: 'Patientez une minute avant de redemander un code.',
    },
    ja: {
        show: 'パスワードを表示',
        hide: 'パスワードを非表示',
        forgot: 'パスワードをお忘れですか？',
        f_title: 'パスワードを再設定',
        f_sub: 'アカウントのメールを入力してください。VESTA TEMがGmailに確認コードを送ります。',
        f_cta: '確認コードを送る',
        r_title: 'コードを入力',
        r_sub: '確認コードをメールで送りました。下に入力して新しいパスワードを設定してください。',
        code: '確認コード',
        code_ph: '6桁のコード',
        new_pw: '新しいパスワード',
        r_cta: '新しいパスワードを保存',
        resend_code: '新しいコードを送る',
        code_sent: '新しいコードを送りました。',
        back: 'ログインに戻る',
        err_code: 'コードが違うか期限切れです。新しいコードを請求してください。',
        err_wait: '新しいコードを請求する前に1分ほどお待ちください。',
    },
};
