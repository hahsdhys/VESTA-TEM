import type { LangCode } from './i18n';

export interface AuthDict {
    pw: string;
    pw2: string;
    pw_ph: string;
    sub_login: string;
    sub_signup: string;
    cta_login: string;
    cta_signup: string;
    note_signup: string;
    conf_t: string;
    conf_d: string;
    conf_hint: string;
    resend: string;
    resent: string;
    err_pw_short: string;
    err_pw_match: string;
    err_bad: string;
    err_unconfirmed: string;
    err_exists: string;
}

export const AUTHX: Record<LangCode, AuthDict> = {
    en: {
        pw: 'Password',
        pw2: 'Confirm password',
        pw_ph: 'At least 8 characters',
        sub_login: 'Log in with your email and password.',
        sub_signup: 'Create your VESTA TEM account. We will email you a link to confirm it.',
        cta_login: 'Log in',
        cta_signup: 'Create account',
        note_signup: 'You must confirm your email before you can log in.',
        conf_t: 'Confirm your account',
        conf_d: 'We sent a confirmation email from VESTA TEM. Open it and press Confirm, then log in.',
        conf_hint: 'Not there? Check Spam or Promotions.',
        resend: 'Resend confirmation email',
        resent: 'Confirmation email sent again.',
        err_pw_short: 'Password must be at least 8 characters.',
        err_pw_match: 'Passwords do not match.',
        err_bad: 'Wrong email or password.',
        err_unconfirmed: 'Your email is not confirmed yet. Check your inbox for the VESTA TEM email.',
        err_exists: 'This email already has an account. Please log in.',
    },
    tl: {
        pw: 'Password',
        pw2: 'Kumpirmahin ang password',
        pw_ph: 'Hindi bababa sa 8 character',
        sub_login: 'Mag-log in gamit ang email at password.',
        sub_signup: 'Gumawa ng VESTA TEM account. Padadalhan ka namin ng link para kumpirmahin ito.',
        cta_login: 'Mag-log in',
        cta_signup: 'Gumawa ng account',
        note_signup: 'Kailangan mong kumpirmahin ang email bago makapag-log in.',
        conf_t: 'Kumpirmahin ang account mo',
        conf_d: 'Nagpadala ang VESTA TEM ng confirmation email. Buksan ito, pindutin ang Confirm, tapos mag-log in.',
        conf_hint: 'Wala? Tingnan ang Spam o Promotions.',
        resend: 'Ipadala ulit ang confirmation email',
        resent: 'Naipadala ulit ang confirmation email.',
        err_pw_short: 'Dapat hindi bababa sa 8 character ang password.',
        err_pw_match: 'Hindi magkapareho ang mga password.',
        err_bad: 'Maling email o password.',
        err_unconfirmed: 'Hindi pa kumpirmado ang email mo. Tingnan ang inbox para sa email ng VESTA TEM.',
        err_exists: 'May account na ang email na ito. Mag-log in na lang.',
    },
    it: {
        pw: 'Password',
        pw2: 'Conferma password',
        pw_ph: 'Almeno 8 caratteri',
        sub_login: 'Accedi con email e password.',
        sub_signup: 'Crea il tuo account VESTA TEM. Ti invieremo un link per confermarlo.',
        cta_login: 'Accedi',
        cta_signup: 'Crea account',
        note_signup: 'Devi confermare l\'email prima di poter accedere.',
        conf_t: 'Conferma il tuo account',
        conf_d: 'Abbiamo inviato un\'email di conferma da VESTA TEM. Aprila, premi Conferma e poi accedi.',
        conf_hint: 'Non la trovi? Controlla Spam o Promozioni.',
        resend: 'Invia di nuovo l\'email di conferma',
        resent: 'Email di conferma inviata di nuovo.',
        err_pw_short: 'La password deve avere almeno 8 caratteri.',
        err_pw_match: 'Le password non coincidono.',
        err_bad: 'Email o password errata.',
        err_unconfirmed: 'La tua email non è ancora confermata. Controlla la posta per l\'email di VESTA TEM.',
        err_exists: 'Questa email ha già un account. Accedi.',
    },
    es: {
        pw: 'Contraseña',
        pw2: 'Confirmar contraseña',
        pw_ph: 'Al menos 8 caracteres',
        sub_login: 'Inicia sesión con tu correo y contraseña.',
        sub_signup: 'Crea tu cuenta de VESTA TEM. Te enviaremos un enlace para confirmarla.',
        cta_login: 'Iniciar sesión',
        cta_signup: 'Crear cuenta',
        note_signup: 'Debes confirmar tu correo antes de iniciar sesión.',
        conf_t: 'Confirma tu cuenta',
        conf_d: 'Enviamos un correo de confirmación de VESTA TEM. Ábrelo, pulsa Confirmar y luego inicia sesión.',
        conf_hint: '¿No aparece? Revisa Spam o Promociones.',
        resend: 'Reenviar correo de confirmación',
        resent: 'Correo de confirmación reenviado.',
        err_pw_short: 'La contraseña debe tener al menos 8 caracteres.',
        err_pw_match: 'Las contraseñas no coinciden.',
        err_bad: 'Correo o contraseña incorrectos.',
        err_unconfirmed: 'Tu correo aún no está confirmado. Revisa tu bandeja por el correo de VESTA TEM.',
        err_exists: 'Este correo ya tiene una cuenta. Inicia sesión.',
    },
    fr: {
        pw: 'Mot de passe',
        pw2: 'Confirmer le mot de passe',
        pw_ph: 'Au moins 8 caractères',
        sub_login: 'Connectez-vous avec votre e-mail et mot de passe.',
        sub_signup: 'Créez votre compte VESTA TEM. Nous vous enverrons un lien pour le confirmer.',
        cta_login: 'Connexion',
        cta_signup: 'Créer le compte',
        note_signup: 'Vous devez confirmer votre e-mail avant de vous connecter.',
        conf_t: 'Confirmez votre compte',
        conf_d: 'VESTA TEM vous a envoyé un e-mail de confirmation. Ouvrez-le, appuyez sur Confirmer, puis connectez-vous.',
        conf_hint: 'Introuvable ? Vérifiez les spams ou promotions.',
        resend: 'Renvoyer l\'e-mail de confirmation',
        resent: 'E-mail de confirmation renvoyé.',
        err_pw_short: 'Le mot de passe doit contenir au moins 8 caractères.',
        err_pw_match: 'Les mots de passe ne correspondent pas.',
        err_bad: 'E-mail ou mot de passe incorrect.',
        err_unconfirmed: 'Votre e-mail n\'est pas encore confirmé. Consultez l\'e-mail de VESTA TEM.',
        err_exists: 'Cet e-mail a déjà un compte. Connectez-vous.',
    },
    ja: {
        pw: 'パスワード',
        pw2: 'パスワード（確認）',
        pw_ph: '8文字以上',
        sub_login: 'メールアドレスとパスワードでログインします。',
        sub_signup: 'VESTA TEMアカウントを作成します。確認用リンクをメールでお送りします。',
        cta_login: 'ログイン',
        cta_signup: 'アカウントを作成',
        note_signup: 'ログインするにはメールの確認が必要です。',
        conf_t: 'アカウントを確認してください',
        conf_d: 'VESTA TEMから確認メールを送りました。開いて「確認」を押してからログインしてください。',
        conf_hint: '届かない場合は迷惑メールやプロモーションをご確認ください。',
        resend: '確認メールを再送',
        resent: '確認メールを再送しました。',
        err_pw_short: 'パスワードは8文字以上にしてください。',
        err_pw_match: 'パスワードが一致しません。',
        err_bad: 'メールまたはパスワードが違います。',
        err_unconfirmed: 'メールがまだ確認されていません。VESTA TEMからのメールをご確認ください。',
        err_exists: 'このメールは登録済みです。ログインしてください。',
    },
};
