import {
  Amphora,
  Droplets,
  Egg,
  Flame,
  Flower2,
  Milk,
  Nut,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { L10n } from "@/lib/l10n";
import { cityName, formatPrice as priceOf, pick, showUnit, useLocale } from "@/lib/l10n";

const media = (file: string) => `${import.meta.env.BASE_URL}media/real/${file === "belboula.jpg" ? "belboula.svg" : file.replace(/\.jpg$/, ".webp")}`;

export type CategoryId =
  | "latticini"
  | "semole"
  | "miele"
  | "oli"
  | "spezie"
  | "frutta"
  | "fattoria"
  | "artigianato";

export type SortKey = "recenti" | "prezzo-asc" | "prezzo-desc";

export type HomeSearch = {
  q: string;
  cat: CategoryId | "tutti";
  city: string;
  sort: SortKey;
  max: string;
};

export const defaultSearch: HomeSearch = {
  q: "",
  cat: "tutti",
  city: "tutte",
  sort: "recenti",
  max: "",
};

export type Listing = {
  id: string;
  title: L10n;
  price: number;
  unit: L10n;
  category: CategoryId;
  city: string;
  area: L10n;
  description: L10n;
  images: string[];
  hoursAgo: number;
  fresh?: boolean;
  mine?: boolean;
};

export type Category = {
  id: CategoryId;
  label: L10n;
  icon: LucideIcon;
};

export const CATEGORIES: Category[] = [
  { id: "latticini", label: { ar: "منتجات الألبان", fr: "Produits laitiers" }, icon: Milk },
  { id: "semole", label: { ar: "الكسكس والسميد", fr: "Couscous et semoules" }, icon: Wheat },
  { id: "miele", label: { ar: "العسل", fr: "Miel" }, icon: Flower2 },
  { id: "oli", label: { ar: "الزيوت", fr: "Huiles" }, icon: Droplets },
  { id: "spezie", label: { ar: "التوابل", fr: "Épices" }, icon: Flame },
  { id: "frutta", label: { ar: "الفواكه الجافة", fr: "Fruits secs" }, icon: Nut },
  { id: "fattoria", label: { ar: "المزرعة", fr: "Ferme" }, icon: Egg },
  { id: "artigianato", label: { ar: "الصناعة التقليدية", fr: "Artisanat" }, icon: Amphora },
];

export const CITIES = ["Khouribga", "Oued Zem", "Boujad", "Rabat", "Casablanca"] as const;

export const PRICE_CAPS = [
  { value: "", label: { ar: "كل الأثمان", fr: "Tous les prix" } },
  { value: "20", label: { ar: "إلى 20 درهم", fr: "Jusqu'à 20 DH" } },
  { value: "50", label: { ar: "إلى 50 درهم", fr: "Jusqu'à 50 DH" } },
  { value: "100", label: { ar: "إلى 100 درهم", fr: "Jusqu'à 100 DH" } },
  { value: "200", label: { ar: "إلى 200 درهم", fr: "Jusqu'à 200 DH" } },
] as const;

export const PHOTO_PRESETS: { src: string; label: L10n }[] = [
  { src: media("lben.jpg"), label: { ar: "لبن", fr: "Lben" } },
  { src: media("cruche.jpg"), label: { ar: "قلة", fr: "Cruche" } },
  { src: media("lait.jpg"), label: { ar: "حليب", fr: "Lait" } },
  { src: media("raib.jpg"), label: { ar: "رايب", fr: "Raib" } },
  { src: media("couscous.jpg"), label: { ar: "كسكس", fr: "Couscous" } },
  { src: media("belboula.jpg"), label: { ar: "بلبولة", fr: "Belboula" } },
  { src: media("miele.jpg"), label: { ar: "عسل", fr: "Miel" } },
  { src: media("argan.jpg"), label: { ar: "أركان", fr: "Argan" } },
  { src: media("oliva.jpg"), label: { ar: "زيت الزيتون", fr: "Huile d'olive" } },
  { src: media("spezie.jpg"), label: { ar: "توابل", fr: "Épices" } },
  { src: media("datteri.jpg"), label: { ar: "تمر", fr: "Dattes" } },
  { src: media("jben.jpg"), label: { ar: "جبن", fr: "Jben" } },
  { src: media("amlou.jpg"), label: { ar: "أملو", fr: "Amlou" } },
  { src: media("uova.jpg"), label: { ar: "بيض", fr: "Œufs" } },
  { src: media("tagine.jpg"), label: { ar: "طاجين", fr: "Tajine" } },
  { src: media("smen.jpg"), label: { ar: "سمن", fr: "Smen" } },
];

export const SELLER = {
  name: "Khadija",
  nameAr: "خديجة",
  since: "2019",
  city: "Khouribga",
};

export const LISTINGS: Listing[] = [
  {
    id: "lben-casa",
    title: { ar: "لبن بلدي كثيف", fr: "Lben maison, bien épais" },
    price: 12,
    unit: "liter",
    category: "latticini",
    city: "Khouribga",
    area: { ar: "حي النهضة", fr: "Hay Nahda" },
    hoursAgo: 2,
    fresh: true,
    images: [media("lben.jpg"), media("cruche.jpg")],
    description: {
      ar: "لبن هذا الصباح من حليب الزريبة. كثيف وقليل الحموضة، يُشرب طرياً مع التمر. أسكبه في الكأس أو أضعه في القلة إذا أخذت أكثر. الأفضل اليوم أو غداً، ويُحفظ في الثلاجة.",
      fr: "Lben de ce matin, au lait de l'étable. Épais, un peu acidulé, celui qu'on boit frais avec les dattes. Au verre, ou dans la cruche si vous en prenez plus. Aujourd'hui ou demain, au frais.",
    },
  },
  {
    id: "brocca-lben",
    title: { ar: "قلة لبن من الفخار", fr: "Cruche de lben en terre" },
    price: 18,
    unit: "jug",
    category: "latticini",
    city: "Khouribga",
    area: { ar: "المركز", fr: "Centre" },
    hoursAgo: 5,
    fresh: true,
    images: [media("cruche.jpg"), media("lben.jpg")],
    description: {
      ar: "قلة ممتلئة، نحو لتر ونصف. اللبن يبقى أبرد في الفخار. القلة عارية: ترجعها المرة الجاية، أو تبقيها وأنقص لك من الثمن.",
      fr: "Une cruche pleine, environ un litre et demi. Le lben reste plus frais dans la terre. La cruche est prêtée : vous la rendez la prochaine fois, ou vous la gardez et je baisse le prix.",
    },
  },
  {
    id: "latte-munto",
    title: { ar: "حليب طازج من الحلبة", fr: "Lait tout juste trait" },
    price: 8,
    unit: "liter",
    category: "fattoria",
    city: "Khouribga",
    area: { ar: "دوار أولاد عبدون", fr: "Douar Ouled Abdoun" },
    hoursAgo: 1,
    fresh: true,
    images: [media("lait.jpg")],
    description: {
      ar: "حُلب عند الفجر وما زال حلواً. باللتر، أو سطل خمسة لترات بـ 35 درهماً إذا جئت أنت لأخذه. ليس للحفظ الطويل: اغله حين تصل إلى الدار.",
      fr: "Trait à l'aube, encore doux. Au litre, ou un seau de cinq litres à 35 DH si vous passez le prendre. Ce n'est pas un lait de garde : faites-le bouillir en arrivant.",
    },
  },
  {
    id: "raib-filtrato",
    title: { ar: "رايب مصفّى", fr: "Raib passé au tamis" },
    price: 20,
    unit: "liter",
    category: "latticini",
    city: "Oued Zem",
    area: { ar: "المركز", fr: "Centre" },
    hoursAgo: 6,
    fresh: true,
    images: [media("raib.jpg")],
    description: {
      ar: "حليب مخثر مصفّى، ناعم، يُؤكل بالملعقة أو يُشرب إذا خففته. أجهزه في علب من لتر. في واد زم أوصله بعد الظهر، وفي خريبكة يُستلم من عندي.",
      fr: "Lait caillé passé au tamis, lisse, à la cuillère ou à boire si vous l'allongez. En pots d'un litre. Livré l'après-midi à Oued Zem, à retirer chez moi à Khouribga.",
    },
  },
  {
    id: "jben",
    title: { ar: "جبن طري من الصباح", fr: "Jben frais du matin" },
    price: 25,
    unit: "mold",
    category: "latticini",
    city: "Khouribga",
    area: { ar: "حي الوحدة", fr: "Hay El Wahda" },
    hoursAgo: 8,
    images: [media("jben.jpg")],
    description: {
      ar: "جبن أبيض طري، قالبان صغيران بهذا الثمن. ملح قليل، والزيت على حدة إن أردت. يطيب مع العسل أو الزيتون أو خبز الصباح. بلا مواد حافظة.",
      fr: "Fromage blanc tendre, deux petites pièces pour ce prix. Peu de sel, l'huile à part si vous voulez. Bon avec le miel, les olives ou le pain du matin. Sans conservateur.",
    },
  },
  {
    id: "smen",
    title: { ar: "سمن معتّق في القلة", fr: "Smen affiné en jarre" },
    price: 60,
    unit: "jar",
    category: "latticini",
    city: "Boujad",
    area: { ar: "المدينة", fr: "Médina" },
    hoursAgo: 30,
    images: [media("smen.jpg")],
    description: {
      ar: "سمن الدار، يُترك في القلة حتى يأخذ الرائحة. علبة 250 غ تكفي كسكس شهر. قل لي إن أردته أصغر سناً أو أعتق.",
      fr: "Beurre clarifié de la maison, gardé en jarre jusqu'à ce qu'il prenne le parfum. Un pot de 250 g suffit pour le couscous d'un mois. Plus jeune ou plus affiné, dites-le-moi.",
    },
  },
  {
    id: "couscous-venerdi",
    title: { ar: "كسكس الجمعة بالخضر والحمص", fr: "Couscous du vendredi, légumes et pois chiches" },
    price: 45,
    unit: "plate",
    category: "semole",
    city: "Khouribga",
    area: { ar: "حي النهضة", fr: "Hay Nahda" },
    hoursAgo: 4,
    fresh: true,
    images: [media("couscous.jpg")],
    description: {
      ar: "سميد معجون باليد، قرع وجزر وكرنب وحمص وزبيب من فوق. الطبق في الصورة لشخصين بسخاء. إذا كنتم أربعة أجهز الطاجين بـ 80 درهماً، للاستلام نحو الظهر. المرق على حدة.",
      fr: "Semoule travaillée à la main, courge, carottes, chou, pois chiches et raisins. Le plat de la photo est pour deux, généreux. Pour quatre, le tajine est à 80 DH, à retirer vers midi. Le bouillon à part.",
    },
  },
  {
    id: "belboula",
    title: { ar: "بلبولة بالحليب وسميد ناعم", fr: "Belboula au lait et semoule fine" },
    price: 15,
    unit: "plate",
    category: "semole",
    city: "Khouribga",
    area: { ar: "المركز", fr: "Centre" },
    hoursAgo: 3,
    fresh: true,
    images: [media("belboula.jpg")],
    description: {
      ar: "شعير محمص مطبوخ في الحليب، فطور الدار. القصعة جاهزة وساخنة. في الصورة نفسها السميد الناعم: إن احتجته لكسكس الأحد فهو 18 درهماً للكيلو، مطحون هذا الأسبوع.",
      fr: "Orge grillée cuite dans le lait, le petit-déjeuner de la maison. Le bol est prêt, chaud. Sur la même photo, la semoule fine : pour le couscous de dimanche, 18 DH le kilo, moulue cette semaine.",
    },
  },
  {
    id: "miele",
    title: { ar: "عسل أزهار البر", fr: "Miel de fleurs des champs" },
    price: 85,
    unit: "jar",
    category: "miele",
    city: "Khouribga",
    area: { ar: "دوار أولاد عبدون", fr: "Douar Ouled Abdoun" },
    hoursAgo: 14,
    images: [media("miele.jpg")],
    description: {
      ar: "علبة 500 غ، عسل السنة، غير مسخّن. يتبلور قليلاً مع البرد وهذا طبيعي، يعود سائلاً في حمام مائي. آخذه من نحّال الجهة الذي أعرفه منذ سنوات.",
      fr: "Pot de 500 g, miel de l'année, non chauffé. Il cristallise un peu au frais : c'est normal, il redevient liquide au bain-marie. Je le prends chez un apiculteur du coin que je connais depuis des années.",
    },
  },
  {
    id: "amlou",
    title: { ar: "أملو اللوز والعسل", fr: "Amlou amandes et miel" },
    price: 70,
    unit: "jar",
    category: "miele",
    city: "Boujad",
    area: { ar: "المدينة", fr: "Médina" },
    hoursAgo: 26,
    images: [media("amlou.jpg")],
    description: {
      ar: "لوز محمص وزيت أركان وعسل، مطحون ناعماً. علبة 300 غ. يُدهن على الخبز وهو ساخن. إذا أردته أسلس أو أكثف قل لي قبلها.",
      fr: "Amandes grillées, huile d'argan et miel, broyés fin. Pot de 300 g. À tartiner sur le pain encore chaud. Plus fluide ou plus épais, dites-le-moi avant.",
    },
  },
  {
    id: "argan",
    title: { ar: "زيت أركان غذائي", fr: "Huile d'argan alimentaire" },
    price: 150,
    unit: "jar",
    category: "oli",
    city: "Khouribga",
    area: { ar: "حي الوحدة", fr: "Hay El Wahda" },
    hoursAgo: 40,
    images: [media("argan.jpg")],
    description: {
      ar: "قارورة 250 مل، للطبخ وللأملو فقط، ليست التجميلية. رائحة جوز محمص. أغلقها جيداً: بعد الفتح تُحفظ في الظل وتُستهلك خلال شهرين.",
      fr: "Bouteille de 250 ml, seulement pour la cuisine et l'amlou, pas la cosmétique. Parfum de noix grillée. Bien fermée : après ouverture, à l'abri de la lumière, à finir en deux mois.",
    },
  },
  {
    id: "oliva",
    title: { ar: "زيت زيتون جديد", fr: "Huile d'olive nouvelle" },
    price: 65,
    unit: "liter",
    category: "oli",
    city: "Oued Zem",
    area: { ar: "الأطراف", fr: "Périphérie" },
    hoursAgo: 48,
    images: [media("oliva.jpg")],
    description: {
      ar: "عصر أول من زيتون الجهة، لتر في قارورة زجاج. خضراء، تلذع الحلق قليلاً، طيبة نيئة على الجبن والسلطة. من خمسة لترات ينزل الثمن إلى 58 درهماً.",
      fr: "Première pression d'olives du coin, un litre en bouteille de verre. Verte, elle pique un peu la gorge, bonne crue sur le jben et la salade. À partir de cinq litres, 58 DH.",
    },
  },
  {
    id: "spezie",
    title: { ar: "توابل الطاجين", fr: "Épices pour le tajine" },
    price: 30,
    unit: "piece",
    category: "spezie",
    city: "Khouribga",
    area: { ar: "المركز", fr: "Centre" },
    hoursAgo: 20,
    images: [media("spezie.jpg")],
    description: {
      ar: "خلطة جاهزة: كركم وكمون وفلفل حلو وخيط زعفران. أجهزها في قصعة صغيرة أو في أكياس منفصلة إن كنت تطبخ كثيراً. تكفي أربعة طواجن دجاج.",
      fr: "Un mélange prêt : curcuma, cumin, paprika doux et un fil de safran. En petite coupe, ou en sachets séparés si vous cuisinez souvent. Assez pour quatre tajines de poulet.",
    },
  },
  {
    id: "datteri",
    title: { ar: "تمر ولوز", fr: "Dattes et amandes" },
    price: 40,
    unit: "kilo",
    category: "frutta",
    city: "Khouribga",
    area: { ar: "حي النهضة", fr: "Hay Nahda" },
    hoursAgo: 18,
    images: [media("datteri.jpg"), media("almonds.jpg")],
    description: {
      ar: "تمر لين غير يابس، ولوز كامل. أجمعهما لأنهما يُؤكلان مع اللبن في الدار. أستطيع فصلهما: التمر وحده 28 درهماً للكيلو.",
      fr: "Dattes souples, pas trop sèches, et amandes entières. Je les mets ensemble parce qu'à la maison on les mange avec le lben. Je peux les séparer : les dattes seules, 28 DH le kilo.",
    },
  },
  {
    id: "uova",
    title: { ar: "بيض الدجاج البلدي", fr: "Œufs de la basse-cour" },
    price: 18,
    unit: "dozen",
    category: "fattoria",
    city: "Khouribga",
    area: { ar: "دوار أولاد عبدون", fr: "Douar Ouled Abdoun" },
    hoursAgo: 2,
    fresh: true,
    images: [media("uova.jpg")],
    description: {
      ar: "اثنتا عشرة بيضة من اليوم، صفارها داكن، دجاج يسرح. إذا أردت ستاً فقط فهي 10 دراهم. أحملها في علبة كرتون، ضعها في الثلاجة حين تصل.",
      fr: "Douze œufs du jour, jaune foncé, poules qui courent. Six seulement : 10 DH. Je les mets dans une boîte en carton, au frais dès que vous arrivez.",
    },
  },
  {
    id: "tagine",
    title: { ar: "طاجين مرسوم باليد", fr: "Tajine peint à la main" },
    price: 140,
    unit: "piece",
    category: "artigianato",
    city: "Boujad",
    area: { ar: "المدينة", fr: "Médina" },
    hoursAgo: 72,
    images: [media("tagine.jpg")],
    description: {
      ar: "طاجين فخار لأربعة أشخاص، غطاء مخروطي، رسوم خضراء ولون التراب. في أول استعمال يُمرر على نار هادئة بالماء والزيت، أشرح لك ذلك عند الاستلام. ليس للعرض فقط: أطبخ فيه أنا أيضاً.",
      fr: "Tajine en terre pour quatre, couvercle conique, dessins verts et couleur de terre. La première fois, feu doux avec eau et huile : je vous explique au retrait. Ce n'est pas seulement pour la déco, j'y cuisine aussi.",
    },
  },
];

export function categoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function isCategory(value: unknown): value is CategoryId | "tutti" {
  return value === "tutti" || CATEGORIES.some((c) => c.id === value);
}

export function isCity(value: unknown): value is (typeof CITIES)[number] | "tutte" {
  return value === "tutte" || CITIES.some((c) => c === value);
}

export function formatPrice(amount: number) {
  return priceOf(amount, useLocale.getState().locale);
}

export function getListing(id: string, extras: Listing[]) {
  return extras.find((l) => l.id === id) ?? LISTINGS.find((l) => l.id === id);
}

export function replyFor(listing: Listing, text: string) {
  const locale = useLocale.getState().locale;
  const title = pick(listing.title, locale);
  const unit = showUnit(listing.unit, locale);
  const city = cityName(listing.city, locale);
  const area = pick(listing.area, locale);
  const price = priceOf(listing.price, locale);
  const q = text.toLowerCase();
  if (/سعر|ثمن|بكم|خصم|prix|combien|remise/.test(q)) {
    return locale === "ar"
      ? `السلام عليكم! ${title} بـ ${price} ${unit}. إذا أخذت أكثر أخصم لك، قل لي الكمية.`
      : `Salam ! ${title} est à ${price} ${unit}. Si vous en prenez plus, je fais un prix de la maison.`;
  }
  if (/توصيل|استلام|نجي|أمر|livraison|retrait|passer|venir/.test(q)) {
    return locale === "ar"
      ? `السلام عليكم! الاستلام في ${city}، ${area}. إذا كنت في الرباط أو مدينة قريبة أقول لك إن كنت أمرّ، حسب الوقت.`
      : `Salam ! Le retrait est à ${city}, ${area}. Si vous êtes à Rabat ou dans une ville proche, je vous dis si je passe.`;
  }
  if (/اليوم|متوف|كاين|aujourd|dispo|encore/.test(q)) {
    return locale === "ar"
      ? `السلام عليكم! نعم، ${title} موجود. أنا في الدار إلى المساء. إذا جئت، راسلني قبلها بربع ساعة.`
      : `Salam ! Oui, ${title} est là. Je suis à la maison jusqu'au soir. Écrivez-moi un quart d'heure avant de passer.`;
  }
  return locale === "ar"
    ? `السلام عليكم! شكراً على ${title}. جاهز، ${price} ${unit}. قل لي الكمية وإن كنت ستمر من ${city}.`
    : `Salam ! Merci pour ${title}. C'est prêt, ${price} ${unit}. Dites-moi la quantité et si vous passez à ${city}.`;
}
