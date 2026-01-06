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
},
  company_dashboard: {
  welcome: "Hello, Recruiter!",
  subtitle: "Manage your job offers and track candidates.",
  btn_create: "Post New Offer",
  stat_active: "Active Jobs",
  stat_candidates: "New Candidates",
  stat_views: "Total Views",
  recent_jobs: "Recent Job Postings",
  col_title: "Job Title",
  col_applicants: "Applicants",
  col_date: "Posted Date",
  col_status: "Status",
  status_active: "Active",
  status_closed: "Closed",
  menu_dashboard: "Dashboard",
  menu_offers: "My Offers",
  menu_candidates: "Candidates",
  menu_profile: "Company Profile"
},
      company_nav: {
        dashboard: "Tableau de Bord",
        offers: "Mes offres",
        applications: "Candidatures",
        search: "Rechercher",
        logout: "Déconnexion"
      },
      company_hero: {
        greeting: "Bonjour, {{name}} !",
        subtitle: "Gérez vos offres de stage et d'emploi et suivez les candidatures."
      },
      stats: {
        active_offers: "Offres actives",
        apps_received: "Candidatures reçues",
        archived_offers: "Offres archivés",
        btn_view: "VOIR MES OFFRES",
        btn_manage: "GÉRER LES CANDIDATURES",
        btn_history: "HISTORIQUE"
      },
      table: {
        title: "Offres récemment publiées",
        search_placeholder: "Rechercher ...",
        headers: {
          title: "TITRE DE L'OFFRE",
          type: "TYPE",
          status: "STATUT",
          candidates: "CANDIDATURES"
        },
        badges: {
          first_job: "Premier Emploi",
          pfe: "Projet de Fin d'Etudes",
          internship: "Stage",
          active: "Active",
          archived: "Archivée"
        },
        published_on: "Publiée le {{date}}",
        candidates_count: "{{count}} Candidats",
        load_more: "Afficher Plus"
      },
      offers: {
  title: "My Offers",
  subtitle: "Manage and track the status of all your job, internship, and PFE offers.",
  tabs: {
    all: "All Offers",
    active: "Active",
    archived: "Archived"
  },
  btn_publish: "Publish New Offer",
  sort: {
    label: "Sort by:",
    recent: "Most Recent"
  },
  search_placeholder: "Search ...",
  table: {
    headers: {
      title: "OFFER TITLE",
      type: "TYPE",
      visibility: "VISIBILITY",
      status: "STATUS",
      candidates: "CANDIDATES"
    },
    visibility: {
      public: "Public",
      targeted: "Targeted"
    }
  },
  pagination: {
    prev: "Previous",
    next: "Next"
  }
},
applications: {
  breadcrumb: "My Offers / Applications",
  modify_offer: "Edit Offer",
  published_on: "Published on {{date}}",
  stats: {
    all: "All",
    received: "Received",
    under_review: "Under Review",
    shortlisted: "Interview Scheduled",
    accepted: "Accepted",
    refused: "Refused"
  },
  table: {
    headers: {
      name: "CANDIDATE NAME",
      university: "UNIVERSITY / SCHOOL",
      field: "FIELD OF STUDY",
      status: "STATUS"
    }
  }
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
},
  company_dashboard: {
  welcome: "Bonjour, Recruteur !",
  subtitle: "Gérez vos offres d'emploi et suivez les candidats.",
  btn_create: "Poster une offre",
  stat_active: "Offres Actives",
  stat_candidates: "Nouveaux Candidats",
  stat_views: "Vues Totales",
  recent_jobs: "Offres Récentes",
  col_title: "Titre du poste",
  col_applicants: "Candidats",
  col_date: "Date de publication",
  col_status: "Statut",
  status_active: "Active",
  status_closed: "Clôturée",
  menu_dashboard: "Tableau de bord",
  menu_offers: "Mes Offres",
  menu_candidates: "Candidats",
  menu_profile: "Profil Entreprise"
},
      company_nav: {
        dashboard: "Dashboard",
        offers: "My Offers",
        applications: "Applications",
        search: "Search",
        logout: "Logout"
      },
      company_hero: {
        greeting: "Hello, {{name}} !",
        subtitle: "Manage your internship and job offers and track applications."
      },
      stats: {
        active_offers: "Active Offers",
        apps_received: "Applications Received",
        archived_offers: "Archived Offers",
        btn_view: "VIEW MY OFFRES",
        btn_manage: "MANAGE APPLICATIONS",
        btn_history: "HISTORY"
      },
      table: {
        title: "Recently Published Offers",
        search_placeholder: "Search ...",
        headers: {
          title: "OFFER TITLE",
          type: "TYPE",
          status: "STATUS",
          candidates: "CANDIDATES"
        },
        badges: {
          first_job: "First Job",
          pfe: "Graduation Project",
          internship: "Internship",
          active: "Active",
          archived: "Archived"
        },
        published_on: "Published on {{date}}",
        candidates_count: "{{count}} Candidates",
        load_more: "Load More"
      },
      offers: {
  title: "Mes offres",
  subtitle: "Gérez et suivez le statut de toutes vos offres d'emploi, de stage et de PFE.",
  tabs: {
    all: "Toutes les offres",
    active: "Actives",
    archived: "Archivées"
  },
  btn_publish: "Publier une nouvelle offre",
  sort: {
    label: "Trier par :",
    recent: "Les plus récents"
  },
  search_placeholder: "Rechercher ...",
  table: {
    headers: {
      title: "TITRE DE L'OFFRE",
      type: "TYPE",
      visibility: "VISIBILITÉ",
      status: "STATUT",
      candidates: "CANDIDATURES"
    },
    visibility: {
      public: "Publique",
      targeted: "Ciblée"
    }
  },
  pagination: {
    prev: "Précédent",
    next: "Suivant"
  }
},
applications: {
  breadcrumb: "Mes offres / Candidatures",
  modify_offer: "Modifier l'offre",
  published_on: "Publiée le {{date}}",
  stats: {
    all: "Tous",
    received: "Reçue",
    under_review: "En cours d'étude",
    shortlisted: "Entretien planifié",
    accepted: "Accepté",
    refused: "Refusé"
  },
  table: {
    headers: {
      name: "NOM DU CANDIDAT",
      university: "UNIVERSITÉ / ÉCOLE",
      field: "FILIÈRE",
      status: "STATUT"
    }
  }
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
},
  company_dashboard: {
  welcome: "مرحباً أيها المجند!",
  subtitle: "إدارة عروض العمل الخاصة بك ومتابعة المرشحين.",
  btn_create: "نشر عرض جديد",
  stat_active: "وظائف نشطة",
  stat_candidates: "مرشحين جدد",
  stat_views: "إجمالي المشاهدات",
  recent_jobs: "وظائف حديثة",
  col_title: "المسمى الوظيفي",
  col_applicants: "المتقدمين",
  col_date: "تاريخ النشر",
  col_status: "الحالة",
  status_active: "نشط",
  status_closed: "مغلق",
  menu_dashboard: "لوحة التحكم",
  menu_offers: "عروضي",
  menu_candidates: "المرشحين",
  menu_profile: "ملف الشركة"
},
      company_nav: {
        dashboard: "لوحة القيادة",
        offers: "عروضي",
        applications: "الطلبات",
        search: "بحث",
        logout: "خروج"
      },
      company_hero: {
        greeting: "مرحباً، {{name}} !",
        subtitle: "إدارة عروض التدريب والتوظيف الخاصة بك ومتابعة الطلبات."
      },
      stats: {
        active_offers: "العروض النشطة",
        apps_received: "الطلبات المستلمة",
        archived_offers: "العروض المؤرشفة",
        btn_view: "عرض عروضي",
        btn_manage: "إدارة الطلبات",
        btn_history: "السجل"
      },
      table: {
        title: "العروض المنشورة مؤخراً",
        search_placeholder: "بحث ...",
        headers: {
          title: "عنوان العرض",
          type: "النوع",
          status: "الحالة",
          candidates: "المرشحين"
        },
        badges: {
          first_job: "وظيفة أولى",
          pfe: "مشروع تخرج",
          internship: "تدريب",
          active: "نشط",
          archived: "مؤرشف"
        },
        published_on: "نشر في {{date}}",
        candidates_count: "{{count}} مرشح",
        load_more: "عرض المزيد"
    },
    offers: {
  title: "عروضي",
  subtitle: "إدارة ومتابعة حالة جميع عروض العمل والتدريب ومشاريع التخرج.",
  tabs: {
    all: "كل العروض",
    active: "النشطة",
    archived: "المؤرشفة"
  },
  btn_publish: "نشر عرض جديد",
  sort: {
    label: "فرز حسب:",
    recent: "الأحدث"
  },
  search_placeholder: "بحث ...",
  table: {
    headers: {
      title: "عنوان العرض",
      type: "النوع",
      visibility: "الظهور",
      status: "الحالة",
      candidates: "المرشحين"
    },
    visibility: {
      public: "عام",
      targeted: "مستهدف"
    }
  },
  pagination: {
    prev: "السابق",
    next: "التالي"
  }
},
applications: {
  breadcrumb: "عروضي / Candidatures",
  modify_offer: "تعديل العرض",
  published_on: "نُشر في {{date}}",
  stats: {
    all: "الكل",
    received: "تم استلامها",
    under_review: "قيد الدراسة",
    shortlisted: "مقابلة مجدولة",
    accepted: "تم القبول",
    refused: "تم الرفض"
  },
  table: {
    headers: {
      name: "اسم المترشح",
      university: "الجامعة / المدرسة",
      field: "التخصص",
      status: "الحالة"
    }
  },
  pagination: {
    prev: "السابق",
    next: "التالي"
  }
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