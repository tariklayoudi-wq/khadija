import { ArrowUpRight, MapPin, MessageCircle, ShoppingBag } from "lucide-react";
import { useUi } from "@/lib/l10n";
import { whatsappHref, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function ShopIntro() {
  const { locale } = useUi();
  const ar = locale === "ar";
  return <>
    <section className="shop-hero mb-6 overflow-hidden rounded-[2rem] bg-grove text-cream">
      <div className="relative z-10 p-6 sm:p-8">
        <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-wide text-cream/80"><MapPin className="size-4" />{ar ? "خريبكة · مذاق الدار" : "KHOURIBGA · LE GOÛT DE LA MAISON"}</p>
        <h1 className="max-w-lg font-display text-4xl font-semibold leading-tight sm:text-5xl">{ar ? "من دار خديجة، لمائدتكم." : "De chez Khadija, à votre table."}</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-cream/90 sm:text-base">{ar ? "لبن، كسكس، عسل ومنتجات بلدية. اختاروا ما يعجبكم وتواصلوا مع خديجة لتأكيد المتوفر والاستلام." : "Lben, couscous, miel et produits du terroir. Choisissez vos envies et échangez avec Khadija pour confirmer la disponibilité et le retrait."}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#catalogue" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-5 font-semibold text-grove"><ShoppingBag className="size-4" />{ar ? "تصفح المنتجات" : "Découvrir les produits"}</a>
          <a href={whatsappHref(ar ? "السلام عليكم خديجة، ما هي المنتجات المتوفرة؟" : "Salam Khadija, quels produits sont disponibles ?")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cream/40 px-5 font-semibold"><MessageCircle className="size-4" />{ar ? "راسلوا خديجة" : "Parler à Khadija"}</a>
        </div>
        <p className="mt-5 text-xs text-cream/75">{ar ? "الاستلام بخريبكة · التوصيل حسب الاتفاق" : "Retrait à Khouribga · Livraison à convenir"}</p>
      </div>
      <div className="hero-portrait relative">
        <img src={`${import.meta.env.BASE_URL}media/couscous.jpg`} alt={ar ? "كسكس بالخضر" : "Couscous aux légumes"} width="1500" height="1500" fetchPriority="high" className="h-full w-full object-cover" />
        <span className="absolute bottom-5 start-5 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-grove">{ar ? "مذاق الدار" : "Le goût de la maison"}</span>
      </div>
    </section>
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {(ar ? [["01", "اختاروا منتجاتكم", "الثمن والوحدة في كل إعلان."], ["02", "أكدوا على واتساب", "التوفر، الكمية والتوقيت مع خديجة."], ["03", "اتفقوا على الاستلام", "التوصيل وثمنه قبل تأكيد الطلب."]] : [["01", "Choisissez vos produits", "Prix et unité sur chaque fiche."], ["02", "Confirmez sur WhatsApp", "Disponibilité, quantité et horaire avec Khadija."], ["03", "Convenez du retrait", "Livraison et frais confirmés avant la commande."]]).map(([n,title,body]) => <div key={n} className="flex gap-3 rounded-2xl border border-line bg-surface p-4"><span className="font-display text-xl text-clay">{n}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted">{body}</p></div></div>)}
    </div>
  </>;
}

export function ShopInfo() {
  const { locale } = useUi();
  const ar = locale === "ar";
  const faqs = ar ? [
    ["كيف أطلب؟", "افتحوا المنتج واختاروا الكمية، ثم افتحوا الطلب في واتساب. أرسلوا الرسالة هناك، وخديجة تؤكد التوفر والمجموع وطريقة الاستلام."],
    ["هل التوصيل متوفر؟", "الاستلام في خريبكة. للمدن القريبة، اسألوا خديجة عن الإمكانية والتوقيت وثمن التوصيل قبل تأكيد الطلب."],
    ["هل يمكن الدفع هنا؟", "لا يُحصّل الموقع أي مبلغ. اتفقوا على طريقة الدفع مع خديجة قبل تأكيد الطلب."],
    ["ماذا عن المكونات والحساسية؟", "اسألوا عن المكونات والحساسية وشروط الحفظ قبل الطلب، خاصة منتجات الحليب والمكسرات."],
    ["ماذا يُحفظ على هذا الجهاز؟", "اللغة والمفضلة ومسودات الإعلانات تُحفظ في المتصفح فقط. لا تُنشر المسودات للآخرين. واتساب خدمة خارجية، ولا يرسل الموقع رسالتكم تلقائياً."]
  ] : [
    ["Comment commander ?", "Ouvrez un produit, choisissez la quantité puis ouvrez la demande dans WhatsApp. Envoyez-y le message : Khadija confirme la disponibilité, le total et le retrait."],
    ["Livrez-vous ?", "Retrait à Khouribga. Pour les villes proches, confirmez avec Khadija la possibilité, le créneau et les frais avant de valider."],
    ["Peut-on payer sur le site ?", "Le site ne prélève aucun paiement. Convenez du mode de paiement avec Khadija avant de confirmer."],
    ["Ingrédients et allergies ?", "Demandez les ingrédients, allergènes et conditions de conservation avant de commander, notamment pour les laitages et les fruits à coque."],
    ["Que conserve ce navigateur ?", "La langue, les favoris et les brouillons d’annonces restent dans ce navigateur. Les brouillons ne sont pas publics. WhatsApp est un service externe ; le site n’envoie pas votre message automatiquement."]
  ];
  return <section className="mt-10 rounded-3xl border border-line bg-surface p-5 sm:p-7">
    <p className="text-xs font-semibold uppercase tracking-wide text-clay">{ar ? "قبل الطلب" : "AVANT DE COMMANDER"}</p>
    <h2 className="mt-2 font-display text-2xl font-semibold">{ar ? "بكل بساطة ووضوح" : "Simple, et en toute clarté."}</h2>
    <div className="mt-4">{faqs.map(([title,body]) => <details key={title} className="border-b border-line py-4 last:border-0"><summary className="cursor-pointer text-sm font-semibold">{title}</summary><p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{body}</p></details>)}</div>
    <a href={whatsappHref(ar ? "السلام عليكم خديجة، لدي سؤال بخصوص الطلب." : "Salam Khadija, j’ai une question avant de commander.")} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-grove"><MessageCircle className="size-5" /><span dir="ltr">{WHATSAPP_DISPLAY}</span><ArrowUpRight className="size-4" /></a>
  </section>;
}
