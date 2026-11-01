import type { LangCode } from './i18n';

export interface ExtraDict {
    premium_btn: string;
    fb_btn: string;
    fb_title: string;
    fb_what: string;
    fb_purpose: string;
    ty_template: string;
    ty_template_hint: string;
    ty_problem: string;
    ty_problem_hint: string;
    ty_idea: string;
    ty_idea_hint: string;
    ty_praise: string;
    ty_praise_hint: string;
    fb_msg_label: string;
    fb_msg_ph: string;
    fb_rating: string;
    fb_send: string;
    fb_sending: string;
    fb_thanks_t: string;
    fb_thanks_d: string;
    fb_err: string;
    fb_short: string;
    fb_privacy: string;
    fb_again: string;
    close: string;
}

export const EXTRA: Record<LangCode, ExtraDict> = {
    en: {
        premium_btn: 'Premium',
        fb_btn: 'Feedback',
        fb_title: 'Send feedback',
        fb_what: 'What is feedback for?',
        fb_purpose: 'Feedback is how you talk to the VESTA TEM team. Use it to ask for a template, report something that is not working, share an idea, or tell us what you like. It goes straight to the team to help improve the store.',
        ty_template: 'Request a template',
        ty_template_hint: 'Tell us a style or topic you want designed.',
        ty_problem: 'Report a problem',
        ty_problem_hint: 'Something broken, confusing or not loading.',
        ty_idea: 'Share an idea',
        ty_idea_hint: 'A feature or change you would like to see.',
        ty_praise: 'Say thanks',
        ty_praise_hint: 'Tell us what you enjoy about VESTA TEM.',
        fb_msg_label: 'Your message',
        fb_msg_ph: 'Write your feedback here...',
        fb_rating: 'How is your experience? (optional)',
        fb_send: 'Send feedback',
        fb_sending: 'Sending...',
        fb_thanks_t: 'Thank you!',
        fb_thanks_d: 'Your feedback was sent to the VESTA TEM team.',
        fb_err: 'Could not send your feedback. Please try again.',
        fb_short: 'Please write at least 5 characters.',
        fb_privacy: 'Sent privately and linked to your account email so we can follow up.',
        fb_again: 'Send another',
        close: 'Close',
    },
    tl: {
        premium_btn: 'Premium',
        fb_btn: 'Feedback',
        fb_title: 'Magpadala ng feedback',
        fb_what: 'Para saan ang feedback?',
        fb_purpose: 'Ang feedback ang paraan para makausap mo ang VESTA TEM team. Gamitin ito para humiling ng template, mag-ulat ng hindi gumagana, magbahagi ng ideya, o sabihin kung ano ang gusto mo. Diretso itong mapupunta sa team para mapabuti ang tindahan.',
        ty_template: 'Humiling ng template',
        ty_template_hint: 'Sabihin ang istilo o paksang gusto mong idisenyo.',
        ty_problem: 'Mag-ulat ng problema',
        ty_problem_hint: 'May sira, nakakalito, o hindi nagloload.',
        ty_idea: 'Magbahagi ng ideya',
        ty_idea_hint: 'Feature o pagbabagong gusto mong makita.',
        ty_praise: 'Magpasalamat',
        ty_praise_hint: 'Sabihin kung ano ang nagustuhan mo sa VESTA TEM.',
        fb_msg_label: 'Mensahe mo',
        fb_msg_ph: 'Isulat dito ang feedback mo...',
        fb_rating: 'Kumusta ang karanasan mo? (opsyonal)',
        fb_send: 'Ipadala ang feedback',
        fb_sending: 'Ipinapadala...',
        fb_thanks_t: 'Salamat!',
        fb_thanks_d: 'Naipadala na ang feedback mo sa VESTA TEM team.',
        fb_err: 'Hindi naipadala ang feedback. Pakisubukan ulit.',
        fb_short: 'Magsulat ng hindi bababa sa 5 character.',
        fb_privacy: 'Pribadong ipinapadala at nakakabit sa email ng account mo para masagot ka namin.',
        fb_again: 'Magpadala pa',
        close: 'Isara',
    },
    it: {
        premium_btn: 'Premium',
        fb_btn: 'Feedback',
        fb_title: 'Invia un feedback',
        fb_what: 'A cosa serve il feedback?',
        fb_purpose: "Il feedback è il modo per parlare con il team di VESTA TEM. Usalo per chiedere un template, segnalare qualcosa che non funziona, condividere un'idea o dirci cosa ti piace. Arriva direttamente al team per migliorare il negozio.",
        ty_template: 'Richiedi un template',
        ty_template_hint: 'Indicaci uno stile o un tema da progettare.',
        ty_problem: 'Segnala un problema',
        ty_problem_hint: 'Qualcosa non funziona, è confuso o non si carica.',
        ty_idea: "Condividi un'idea",
        ty_idea_hint: 'Una funzione o una modifica che vorresti vedere.',
        ty_praise: 'Ringrazia',
        ty_praise_hint: 'Dicci cosa ti piace di VESTA TEM.',
        fb_msg_label: 'Il tuo messaggio',
        fb_msg_ph: 'Scrivi qui il tuo feedback...',
        fb_rating: 'Com\'è la tua esperienza? (facoltativo)',
        fb_send: 'Invia feedback',
        fb_sending: 'Invio in corso...',
        fb_thanks_t: 'Grazie!',
        fb_thanks_d: 'Il tuo feedback è stato inviato al team di VESTA TEM.',
        fb_err: 'Impossibile inviare il feedback. Riprova.',
        fb_short: 'Scrivi almeno 5 caratteri.',
        fb_privacy: "Inviato in privato e collegato all'email del tuo account per poterti rispondere.",
        fb_again: 'Inviane un altro',
        close: 'Chiudi',
    },
    es: {
        premium_btn: 'Premium',
        fb_btn: 'Comentarios',
        fb_title: 'Enviar comentarios',
        fb_what: '¿Para qué sirven los comentarios?',
        fb_purpose: 'Los comentarios son tu forma de hablar con el equipo de VESTA TEM. Úsalos para pedir una plantilla, avisar de algo que no funciona, compartir una idea o contarnos qué te gusta. Llegan directamente al equipo para mejorar la tienda.',
        ty_template: 'Pedir una plantilla',
        ty_template_hint: 'Cuéntanos un estilo o tema que quieras que diseñemos.',
        ty_problem: 'Informar de un problema',
        ty_problem_hint: 'Algo roto, confuso o que no carga.',
        ty_idea: 'Compartir una idea',
        ty_idea_hint: 'Una función o cambio que te gustaría ver.',
        ty_praise: 'Dar las gracias',
        ty_praise_hint: 'Cuéntanos qué te gusta de VESTA TEM.',
        fb_msg_label: 'Tu mensaje',
        fb_msg_ph: 'Escribe aquí tus comentarios...',
        fb_rating: '¿Qué tal tu experiencia? (opcional)',
        fb_send: 'Enviar comentarios',
        fb_sending: 'Enviando...',
        fb_thanks_t: '¡Gracias!',
        fb_thanks_d: 'Tus comentarios se enviaron al equipo de VESTA TEM.',
        fb_err: 'No se pudieron enviar tus comentarios. Inténtalo de nuevo.',
        fb_short: 'Escribe al menos 5 caracteres.',
        fb_privacy: 'Se envía en privado y se vincula al correo de tu cuenta para poder responderte.',
        fb_again: 'Enviar otro',
        close: 'Cerrar',
    },
    fr: {
        premium_btn: 'Premium',
        fb_btn: 'Avis',
        fb_title: 'Envoyer un avis',
        fb_what: "À quoi sert l'avis ?",
        fb_purpose: "L'avis est votre moyen de parler à l'équipe VESTA TEM. Utilisez-le pour demander un modèle, signaler un problème, partager une idée ou nous dire ce que vous aimez. Il arrive directement à l'équipe pour améliorer la boutique.",
        ty_template: 'Demander un modèle',
        ty_template_hint: 'Indiquez un style ou un thème à créer.',
        ty_problem: 'Signaler un problème',
        ty_problem_hint: 'Quelque chose de cassé, confus ou qui ne charge pas.',
        ty_idea: 'Partager une idée',
        ty_idea_hint: 'Une fonction ou un changement que vous aimeriez voir.',
        ty_praise: 'Dire merci',
        ty_praise_hint: 'Dites-nous ce que vous aimez dans VESTA TEM.',
        fb_msg_label: 'Votre message',
        fb_msg_ph: 'Écrivez votre avis ici...',
        fb_rating: 'Comment se passe votre expérience ? (facultatif)',
        fb_send: "Envoyer l'avis",
        fb_sending: 'Envoi en cours...',
        fb_thanks_t: 'Merci !',
        fb_thanks_d: "Votre avis a été envoyé à l'équipe VESTA TEM.",
        fb_err: "Impossible d'envoyer votre avis. Veuillez réessayer.",
        fb_short: 'Écrivez au moins 5 caractères.',
        fb_privacy: "Envoyé en privé et lié à l'e-mail de votre compte pour pouvoir vous répondre.",
        fb_again: 'En envoyer un autre',
        close: 'Fermer',
    },
    ja: {
        premium_btn: 'Premium',
        fb_btn: 'フィードバック',
        fb_title: 'フィードバックを送る',
        fb_what: 'フィードバックとは？',
        fb_purpose: 'フィードバックはVESTA TEMチームへのメッセージです。テンプレートのリクエスト、不具合の報告、アイデアの提案、ご感想などにご利用ください。ストア改善のためにチームへ直接届きます。',
        ty_template: 'テンプレートをリクエスト',
        ty_template_hint: 'デザインしてほしいスタイルやテーマを教えてください。',
        ty_problem: '問題を報告',
        ty_problem_hint: '動かない、分かりにくい、読み込めないなど。',
        ty_idea: 'アイデアを共有',
        ty_idea_hint: 'あったらいいなと思う機能や変更点。',
        ty_praise: '感謝を伝える',
        ty_praise_hint: 'VESTA TEMの気に入っている点を教えてください。',
        fb_msg_label: 'メッセージ',
        fb_msg_ph: 'ここにフィードバックを入力...',
        fb_rating: 'ご利用の感想は？（任意）',
        fb_send: '送信',
        fb_sending: '送信中...',
        fb_thanks_t: 'ありがとうございます！',
        fb_thanks_d: 'フィードバックをVESTA TEMチームに送信しました。',
        fb_err: '送信できませんでした。もう一度お試しください。',
        fb_short: '5文字以上入力してください。',
        fb_privacy: '非公開で送信され、返信できるようアカウントのメールと紐付きます。',
        fb_again: 'もう一件送る',
        close: '閉じる',
    },
};
