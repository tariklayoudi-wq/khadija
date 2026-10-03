import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "ar" | "fr";
export type L10n = string | { ar: string; fr: string };

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "ar",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "khdija-locale", skipHydration: true },
  ),
);

export function pick(value: L10n, locale: Locale) {
  return typeof value === "string" ? value : value[locale];
}

export function flat(value: L10n) {
  return typeof value === "string" ? value : `${value.ar} ${value.fr}`;
}

const CITIES: Record<string, { ar: string; fr: string }> = {
  tutte: { ar: "خريبكة والنواحي", fr: "Khouribga et environs" },
  Khouribga: { ar: "خريبكة", fr: "Khouribga" },
  "Oued Zem": { ar: "واد زم", fr: "Oued Zem" },
  Boujad: { ar: "أبو الجعد", fr: "Boujad" },
  Rabat: { ar: "الرباط", fr: "Rabat" },
  Casablanca: { ar: "الدار البيضاء", fr: "Casablanca" },
};

export function cityName(city: string, locale: Locale) {
  return CITIES[city]?.[locale] ?? city;
}

const UNITS: Record<string, { ar: string; fr: string }> = {
  piece: { ar: "للقطعة", fr: "la pièce" },
  liter: { ar: "للتر", fr: "le litre" },
  kilo: { ar: "للكيلو", fr: "le kilo" },
  dozen: { ar: "للدستة", fr: "la douzaine" },
  jar: { ar: "للعلبة", fr: "le pot" },
  plate: { ar: "للطبق", fr: "le plat" },
  jug: { ar: "للقلّة", fr: "la cruche" },
  mold: { ar: "للقالب", fr: "le moule" },
};

export const UNIT_IDS = Object.keys(UNITS);

export function showUnit(unit: L10n, locale: Locale) {
  if (typeof unit === "string" && UNITS[unit]) return UNITS[unit][locale];
  return pick(unit, locale);
}

export function formatPrice(amount: number, locale: Locale) {
  const n = new Intl.NumberFormat(locale === "ar" ? "ar-MA-u-nu-latn" : "fr-FR").format(amount);
  return locale === "ar" ? `${n} درهم` : `${n} DH`;
}

export function timeAgo(hours: number, locale: Locale) {
  if (locale === "fr") {
    if (hours < 1) return "À l'instant";
    if (hours === 1) return "Il y a 1 heure";
    if (hours < 24) return `Il y a ${hours} heures`;
    const days = Math.round(hours / 24);
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  }
  if (hours < 1) return "الآن";
  if (hours === 1) return "منذ ساعة";
  if (hours === 2) return "منذ ساعتين";
  if (hours < 24) return `منذ ${hours} ساعات`;
  const days = Math.round(hours / 24);
  if (days === 1) return "أمس";
  if (days === 2) return "منذ يومين";
  return `منذ ${days} أيام`;
}

export function formatClock(ts: number, locale: Locale) {
  return new Date(ts).toLocaleTimeString(locale === "ar" ? "ar-MA-u-nu-latn" : "fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ui = {
  ar: {
    docTitle: "خديجة خريبكة — منتجات بلدية",
    browse: "تصفح الكل",
    saved: "المحفوظات",
    messages: "الرسائل",
    mine: "مسوداتي",
    explore: "استكشف",
    sell: "اقترح منتوجاً",
    search: "ابحث عن اللبن أو الكسكس أو العسل…",
    categories: "الأقسام",
    all: "الكل",
    chosen: "منتجات خديجة",
    results: (q: string) => `نتائج «${q}»`,
    oneAd: "إعلان واحد",
    nAds: (n: number) => `${n} إعلانات`,
    anyPrice: "كل الأثمان",
    upTo: (n: string) => `إلى ${n} درهم`,
    sortRecent: "الأحدث",
    sortAsc: "الثمن تصاعدياً",
    sortDesc: "الثمن تنازلياً",
    empty: "لا توجد إعلانات",
    emptyHint: "جرّب كلمة أخرى أو أزل التصفية.",
    reset: "مسح التصفية",
    footerTag: "طبيعة · أرض · أصالة",
    today: "اليوم",
    save: "حفظ الإعلان",
    unsave: "إزالة من المحفوظات",
    family: "مزرعة العائلة، منذ",
    zoomOwner: "تكبير صورة خديجة",
    ownerCaption: "خديجة · صاحبة المزرعة في خريبكة",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    close: "إغلاق",
    zoomHint: "اضغط للتكبير",
    back: "الإعلانات",
    gone: "هذا الإعلان لم يعد موجوداً",
    backTo: "العودة إلى الإعلانات",
    messageHer: "واتساب",
    sellsSince: "تبيع منذ",
    responds: "ترد على واتساب",
    description: "الوصف",
    writeTo: "راسل على واتساب",
    writeHint: "الرسالة تُفتح في واتساب وتصل إلى خديجة.",
    copyLink: "انسخ رابط الإعلان",
    linkCopied: "تم نسخ الرابط",
    copyFail: "انسخ الرابط من شريط المتصفح",
    similar: "إعلانات مشابهة",
    you: "أنت",
    send: "إرسال على واتساب",
    writePh: "اكتب رسالتك…",
    noChat: "الرسائل على واتساب",
    noChatHint: "كل رسالة تُفتح في واتساب وتصل إلى هذا الرقم.",
    goAds: "إلى الإعلانات",
    pickChat: "اكتب من إعلان، أو افتح واتساب مباشرة.",
    waOpen: "افتح واتساب",
    backChat: "رجوع",
    adFallback: "إعلان",
    savedTitle: "المحفوظات",
    savedNone: "لا شيء محفوظ بعد.",
    savedSome: (n: number) => `${n} إعلانات محفوظة`,
    savedEmpty: "اضغط القلب على الصورة",
    savedHint: "المنتجات التي تهمك تبقى هنا.",
    browseAds: "تصفح الإعلانات",
    yourAds: "مسوداتك الخاصة",
    yourHint: "محفوظة في هذا المتصفح فقط ولا يراها الزوار الآخرون.",
    newAd: "جديد",
    nonePublished: "لم تنشر شيئاً بعد",
    noneHint: "حضّروا اقتراحاً لخديجة، يظل خاصاً على هذا الجهاز.",
    delete: "حذف",
    deleteNamed: (name: string) => `حذف ${name}`,
    sellTitle: "بيع منتوج",
    sellIntro: "حضّروا مسودة تُحفظ في هذا المتصفح فقط ولا تُنشر للآخرين. يمكن اقتراحها على خديجة عبر واتساب.",
    photo: "الصورة",
    preview: "معاينة الإعلان",
    noPhoto: "لا توجد صورة",
    upload: "ارفع صورتك",
    loading: "جارٍ التحميل…",
    fieldTitle: "العنوان",
    titlePh: "مثال: لبن هذا الصباح",
    priceDh: "الثمن (درهم)",
    unit: "الوحدة",
    category: "القسم",
    city: "المدينة",
    area: "الحي",
    areaPh: "المركز",
    fieldDesc: "الوصف",
    descPh: "متى حُضّر، وكيف يُستلم، ولأي عدد من الأشخاص.",
    publish: "احفظ المسودة",
    published: "حُفظت المسودة على هذا الجهاز",
    errTitle: "ضع عنواناً من ثلاثة أحرف على الأقل.",
    errPrice: "الثمن رقم بالدرهم.",
    errDesc: "صف المنتوج في جملة.",
    errPhoto: "اختر صورة.",
    errType: "يجب أن تكون الصورة ملفاً صورياً.",
    errRead: "تعذر قراءة هذه الصورة.",
    bio: "أجهز اللبن والكسكس وما تعطيه مزرعة العائلة. الاستلام في خريبكة، والتوصيل للمدن القريبة إذا أخبرتني في الوقت.",
  },
  fr: {
    docTitle: "Khadija Khouribga — Produits du terroir",
    browse: "Tout parcourir",
    saved: "Enregistrés",
    messages: "Messages",
    mine: "Mes brouillons",
    explore: "Explorer",
    sell: "Proposer",
    search: "Chercher lben, couscous, miel…",
    categories: "Catégories",
    all: "Tout",
    chosen: "Les produits de Khadija",
    results: (q: string) => `Résultats pour « ${q} »`,
    oneAd: "1 annonce",
    nAds: (n: number) => `${n} annonces`,
    anyPrice: "Tous les prix",
    upTo: (n: string) => `Jusqu'à ${n} DH`,
    sortRecent: "Plus récentes",
    sortAsc: "Prix croissant",
    sortDesc: "Prix décroissant",
    empty: "Aucune annonce",
    emptyHint: "Essayez un autre mot ou retirez les filtres.",
    reset: "Effacer les filtres",
    footerTag: "Nature · Terroir · Authenticité",
    today: "Aujourd'hui",
    save: "Enregistrer l'annonce",
    unsave: "Retirer des enregistrés",
    family: "Ferme familiale, depuis",
    zoomOwner: "Agrandir la photo de Khadija",
    ownerCaption: "Khadija · la fermière de Khouribga",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    close: "Fermer",
    zoomHint: "Appuyer pour agrandir",
    back: "Annonces",
    gone: "Cette annonce n'est plus là",
    backTo: "Retour aux annonces",
    messageHer: "WhatsApp",
    sellsSince: "vend depuis",
    responds: "Répond sur WhatsApp",
    description: "Description",
    writeTo: "Écrire sur WhatsApp",
    writeHint: "Le message s'ouvre dans WhatsApp et arrive à Khadija.",
    copyLink: "Copier le lien de l'annonce",
    linkCopied: "Lien copié",
    copyFail: "Copiez le lien depuis la barre du navigateur",
    similar: "Autres annonces semblables",
    you: "Vous",
    send: "Envoyer sur WhatsApp",
    writePh: "Écrivez votre message…",
    noChat: "Les messages sont sur WhatsApp",
    noChatHint: "Chaque message s'ouvre dans WhatsApp et arrive à ce numéro.",
    goAds: "Voir les annonces",
    pickChat: "Écrivez depuis une annonce, ou ouvrez WhatsApp.",
    waOpen: "Ouvrir WhatsApp",
    backChat: "Retour",
    adFallback: "Annonce",
    savedTitle: "Enregistrés",
    savedNone: "Rien d'enregistré pour l'instant.",
    savedSome: (n: number) => `${n} annonces gardées`,
    savedEmpty: "Touchez le cœur sur une photo",
    savedHint: "Les produits qui vous intéressent restent ici.",
    browseAds: "Parcourir les annonces",
    yourAds: "Vos brouillons privés",
    yourHint: "Conservés dans ce navigateur uniquement, invisibles aux autres visiteurs.",
    newAd: "Nouveau",
    nonePublished: "Vous n'avez encore rien publié",
    noneHint: "Préparez une proposition pour Khadija. Elle restera privée sur cet appareil.",
    delete: "Supprimer",
    deleteNamed: (name: string) => `Supprimer ${name}`,
    sellTitle: "Vendre un produit",
    sellIntro: "Préparez un brouillon conservé uniquement dans ce navigateur. Il n’est pas publié. Proposez-le ensuite à Khadija sur WhatsApp.",
    photo: "Photo",
    preview: "Aperçu de l'annonce",
    noPhoto: "Aucune photo",
    upload: "Importer votre photo",
    loading: "Chargement…",
    fieldTitle: "Titre",
    titlePh: "Ex. Lben de ce matin",
    priceDh: "Prix (DH)",
    unit: "Unité",
    category: "Catégorie",
    city: "Ville",
    area: "Quartier",
    areaPh: "Centre",
    fieldDesc: "Description",
    descPh: "Quand c'est préparé, comment le retirer, pour combien de personnes.",
    publish: "Enregistrer le brouillon",
    published: "Brouillon enregistré sur cet appareil",
    errTitle: "Mettez un titre, au moins trois lettres.",
    errPrice: "Le prix doit être un nombre, en dirhams.",
    errDesc: "Décrivez le produit en une phrase.",
    errPhoto: "Choisissez une photo.",
    errType: "La photo doit être une image.",
    errRead: "Impossible de lire cette photo.",
    bio: "Je prépare le lben, le couscous et ce que donne la ferme familiale. Retrait à Khouribga, livraison dans les villes proches si vous me prévenez à temps.",
  },
} as const;

export function useUi() {
  const locale = useLocale((s) => s.locale);
  return { locale, t: ui[locale], setLocale: useLocale((s) => s.setLocale) };
}
