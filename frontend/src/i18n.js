import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        offers: "Offers",
        companies: "Companies",
        about: "About",
        login: "Login",
        signup: "Sign Up",
        search_placeholder: "Job title, keywords..."
      },
      hero: {
        title: "Find your internship, final project, or first job in Algeria.",
        subtitle: "The #1 platform for students. Access the best professional opportunities.",
        btn_browse: "Browse Offers",
        btn_post: "Post an Offer"
      },
      auth: {
        student: "Student",
        company: "Company",
        email: "Email Address",
        password: "Password",
        continue_btn: "CONTINUE",
        no_account: "No account?",
        register_link: "Sign up",
        login_headline_start: "Connect",
        login_headline_end: "with the best opportunities and talents.",
        forgot_title: "Forgot Password?",
forgot_subtitle: "Enter your email address and we'll send you a link to reset your password.",
back_login: "Back to Login",
send_link: "Send Reset Link",
reset_title: "Reset Password",
reset_subtitle: "Please enter your new password below.",
new_password: "New Password",
confirm_password: "Confirm Password",
reset_btn: "Reset Password",
success_reset: "Password successfully reset!",
check_email_title: "Check your mail",
check_email_subtitle: "We have sent a password recover instructions to your email.",
open_email_app: "Open email app",
didnt_receive: "Did not receive the email? Check your spam filter, or",
try_another_email: "try another email address",
otp_title: "Enter Verification Code",
otp_subtitle: "We have sent a 6-digit code to",
verify_btn: "Verify Code",
resend_text: "Didn't receive the code?",
resend_link: "Resend",
resend_wait: "Resend in {{seconds}}s",
      },
      job: {
  apply: "Apply Now",
  posted_on: "Posted on",
  location: "Location",
  type: "Job Type",
  salary: "Salary",
  description: "Job Description",
  requirements: "Requirements",
  similar_jobs: "Similar Offers",
  back_offers: "Back to Offers"
},
about: {
  title: "About STAGIA",
  subtitle: "Bridging the gap between Algerian talent and professional opportunities.",
  mission_title: "Our Mission",
  mission_desc: "To empower every student in Algeria to find their path.",
  stat_students: "Students",
  stat_companies: "Companies",
  stat_offers: "Offers Posted"
},
contact: {
  title: "Contact Us",
  subtitle: "Have a question? We'd love to hear from you.",
  form_name: "Full Name",
  form_email: "Email Address",
  form_message: "Message",
  form_send: "Send Message",
  info_address: "Address",
  info_phone: "Phone",
  success_msg: "Message sent successfully!"
}
    }
  },
  fr: {
    translation: {
      nav: {
        offers: "Offres",
        companies: "Entreprises",
        about: "À Propos",
        login: "Connexion",
        signup: "S'inscrire",
        search_placeholder: "Intitulé du poste, mots clés..."
      },
      hero: {
        title: "Trouvez votre stage, projet de fin d'études ou premier emploi en Algérie.",
        subtitle: "La plateforme numéro 1 pour les étudiants. Accédez aux meilleures opportunités professionnelles.",
        btn_browse: "Parcourir les offres",
        btn_post: "Publier une offre"
      },
      auth: {
        student: "Étudiant",
        company: "Entreprise",
        email: "Adresse email",
        password: "Mot de passe",
        continue_btn: "CONTINUER",
        no_account: "Pas de compte ?",
        register_link: "Inscrivez-vous",
        login_headline_start: "Connectez-vous",
        login_headline_end: "avec les meilleures opportunités et talents.",
        forgot_title: "Mot de passe oublié ?",
forgot_subtitle: "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
back_login: "Retour à la connexion",
send_link: "Envoyer le lien",
reset_title: "Réinitialisation",
reset_subtitle: "Veuillez entrer votre nouveau mot de passe ci-dessous.",
new_password: "Nouveau mot de passe",
confirm_password: "Confirmer le mot de passe",
reset_btn: "Réinitialiser le mot de passe",
success_reset: "Mot de passe réinitialisé avec succès !",
check_email_title: "Vérifiez votre boîte mail",
check_email_subtitle: "Nous avons envoyé les instructions de récupération de mot de passe à votre adresse email.",
open_email_app: "Ouvrir l'application mail",
didnt_receive: "Vous n'avez pas reçu l'email ? Vérifiez vos spams, ou",
try_another_email: "essayez une autre adresse email",
otp_title: "Entrez le code de vérification",
otp_subtitle: "Nous avons envoyé un code à 6 chiffres à",
verify_btn: "Vérifier le code",
resend_text: "Vous n'avez pas reçu le code ?",
resend_link: "Renvoyer",
resend_wait: "Renvoyer dans {{seconds}}s",
      },
      job: {
  apply: "Postuler maintenant",
  posted_on: "Publié le",
  location: "Lieu",
  type: "Type de poste",
  salary: "Salaire",
  description: "Description du poste",
  requirements: "Prérequis",
  similar_jobs: "Offres similaires",
  back_offers: "Retour aux offres"
},
about: {
  title: "À Propos de STAGIA",
  subtitle: "Combler le fossé entre les talents algériens et les opportunités professionnelles.",
  mission_title: "Notre Mission",
  mission_desc: "Donner à chaque étudiant en Algérie les moyens de trouver sa voie.",
  stat_students: "Étudiants",
  stat_companies: "Entreprises",
  stat_offers: "Offres Publiées"
},
contact: {
  title: "Contactez-nous",
  subtitle: "Une question ? Nous serions ravis de vous entendre.",
  form_name: "Nom complet",
  form_email: "Adresse email",
  form_message: "Message",
  form_send: "Envoyer le message",
  info_address: "Adresse",
  info_phone: "Téléphone",
  success_msg: "Message envoyé avec succès !"
}
    }
  },
  ar: {
    translation: {
      nav: {
        offers: "عروض",
        companies: "شركات",
        about: "حول",
        login: "دخول",
        signup: "تسجيل",
        search_placeholder: "المسمى الوظيفي، كلمات مفتاحية..."
      },
      hero: {
        title: "ابحث عن تدريبك، مشروع تخرجك، أو وظيفتك الأولى في الجزائر.",
        subtitle: "المنصة رقم 1 للطلاب. الوصول إلى أفضل الفرص المهنية.",
        btn_browse: "تصفح العروض",
        btn_post: "انشر عرضاً"
      },
      auth: {
        student: "طالب",
        company: "شركة",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        continue_btn: "متابعة",
        no_account: "ليس لديك حساب؟",
        register_link: "سجل الآن",
        login_headline_start: "تواصل",
        login_headline_end: "مع أفضل الفرص والمواهب.",
        forgot_title: "نسيت كلمة المرور؟",
forgot_subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
back_login: "العودة لتسجيل الدخول",
send_link: "إرسال الرابط",
reset_title: "إعادة تعيين كلمة المرور",
reset_subtitle: "يرجى إدخال كلمة المرور الجديدة أدناه.",
new_password: "كلمة المرور الجديدة",
confirm_password: "تأكيد كلمة المرور",
reset_btn: "إعادة تعيين",
success_reset: "تم إعادة تعيين كلمة المرور بنجاح!",
check_email_title: "تحقق من بريدك الإلكتروني",
check_email_subtitle: "لقد أرسلنا تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني.",
open_email_app: "فتح تطبيق البريد",
didnt_receive: "لم تستلم البريد؟ تحقق من الرسائل غير المرغوب فيها، أو",
try_another_email: "جرب عنوان بريد إلكتروني آخر",
otp_title: "أدخل رمز التحقق",
otp_subtitle: "لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى",
verify_btn: "تحقق من الرمز",
resend_text: "لم تستلم الرمز؟",
resend_link: "إعادة إرسال",
resend_wait: "إعادة الإرسال خلال {{seconds}} ثانية",
      },
      job: {
  apply: "قدم الآن",
  posted_on: "نشر في",
  location: "الموقع",
  type: "نوع الوظيفة",
  salary: "الراتب",
  description: "وصف الوظيفة",
  requirements: "المتطلبات",
  similar_jobs: "عروض مماثلة",
  back_offers: "العودة للعروض"
},
about: {
  title: "عن STAGIA",
  subtitle: "سد الفجوة بين المواهب الجزائرية والفرص المهنية.",
  mission_title: "مهمتنا",
  mission_desc: "تمكين كل طالب في الجزائر من العثور على مساره.",
  stat_students: "طلاب",
  stat_companies: "شركات",
  stat_offers: "عروض منشورة"
},
contact: {
  title: "اتصل بنا",
  subtitle: "لديك سؤال؟ نود أن نسمع منك.",
  form_name: "الاسم الكامل",
  form_email: "البريد الإلكتروني",
  form_message: "الرسالة",
  form_send: "إرسال الرسالة",
  info_address: "العنوان",
  info_phone: "الهاتف",
  success_msg: "تم إرسال الرسالة بنجاح!"
}
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    react: { 
      useSuspense: false 
    }
  });

// Automatically handle RTL/LTR direction
i18n.on('languageChanged', (lng) => {
  document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;