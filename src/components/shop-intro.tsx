import { ArrowUpRight, MapPin, MessageCircle, ShoppingBag, Wheat, Heart } from "lucide-react";
import { useUi } from "@/lib/l10n";
import { whatsappHref, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function ShopIntro() {
 const {locale}=useUi();const ar=locale==='ar';
 return <>
  <section className="warm-hero relative mb-7 overflow-hidden rounded-[2rem]">
    <img src={`${import.meta.env.BASE_URL}media/khadija-terroir.webp`} alt="" className="hero-art" fetchPriority="high" width="1536" height="1024" />
    <div className="hero-wash" />
    <div className="hero-copy relative z-10">
      <p className="hero-eyebrow"><MapPin className="size-4" />{ar?'خريبكة · خيرات البلاد':'KHOURIBGA · LE TERROIR À PARTAGER'}</p>
      <h1>{ar?<>مذاق الدار،<br/><em>دفء خديجة.</em></>:<>Le goût de la maison.<br/><em>La chaleur du Maroc.</em></>}</h1>
      <p className="hero-description">{ar?'لبن بلدي، كسكس، عسل وخيرات المائدة المغربية. اختاروا ما يعجبكم، وخديجة تتكلف بتأكيد الباقي.':'Du lben, du couscous, du miel… les petits bonheurs de la table marocaine. Composez votre panier, Khadija confirme la suite.'}</p>
      <div className="mt-6 flex flex-wrap gap-3"><a href="#catalogue" className="hero-primary"><ShoppingBag className="size-4" />{ar?'اكتشفوا المنتجات':'Composer mon panier'}</a><a href={whatsappHref(ar?'السلام عليكم خديجة، لدي سؤال عن المنتجات.':'Salam Khadija, j’ai une question sur vos produits.')} target="_blank" rel="noopener noreferrer" className="hero-secondary"><MessageCircle className="size-4" />{ar?'مرحبا على واتساب':'Un mot à Khadija'}</a></div>
      <p className="mt-5 text-xs leading-6 text-muted">{ar?'طلباتكم تُسجل هنا · الاستلام بخريبكة · التوصيل حسب الاتفاق':'Votre demande est enregistrée ici · Retrait à Khouribga · Livraison à convenir'}</p>
    </div>
    <span className="hero-stamp"><Wheat className="size-5" />{ar?'من خيرات بلادنا':'Les saveurs de chez nous'}</span>
  </section>
  <div className="welcome-strip"><span><Heart className="size-4" />{ar?'مائدة تجمعنا':'Une table qui nous rassemble'}</span><span>{ar?'الأسعار بالدرهم':'Des prix en dirhams'}</span><span>{ar?'تأكيد شخصي لكل طلب':'Chaque demande confirmée avec soin'}</span></div>
 </>;
}
export function ShopInfo(){const {locale}=useUi();const ar=locale==='ar';const faqs=ar?[
 ['كيف أطلب؟','أضيفوا المنتجات إلى السلة، أدخلوا الاسم ورقم الهاتف وطريقة الاستلام. يُسجل الطلب برقم خاص، وخديجة تؤكد التوفر والمجموع.'],
 ['هل التوصيل متوفر؟','الاستلام بخريبكة. طلب التوصيل يحتاج تأكيد الإمكانية والتوقيت والثمن قبل اعتماد الطلب.'],
 ['متى أدفع؟','لا يُحصّل الموقع أي مبلغ. طريقة الدفع تُتفق مع خديجة عند التأكيد.'],
 ['المكونات والحساسية','اذكروا أي حساسية في ملاحظات الطلب، واسألوا عن المكونات والحفظ قبل التأكيد.'],
 ['بيانات الطلب','نحفظ الاسم والهاتف وبيانات الاستلام لتنفيذ الطلب، ولا تظهر للزوار الآخرين. اللغة والسلة والمفضلة تُحفظ في هذا المتصفح. تواصلوا معنا لطلب تصحيح البيانات أو حذفها.']
 ]:[['Comment commander ?','Ajoutez vos produits au panier, indiquez votre nom, téléphone et mode de retrait. Votre demande reçoit un numéro ; Khadija confirme la disponibilité et le total.'],['Et la livraison ?','Retrait à Khouribga. Une livraison reste à confirmer avec son créneau et ses frais avant validation.'],['Quand payer ?','Aucun paiement n’est prélevé sur le site. Le mode de paiement est convenu avec Khadija lors de la confirmation.'],['Ingrédients et allergies','Indiquez vos allergies dans les notes et demandez les ingrédients et conditions de conservation avant confirmation.'],['Vos données de commande','Nous conservons votre nom, téléphone et informations de retrait pour traiter votre demande. Ces données ne sont pas publiques. Langue, panier et favoris restent dans ce navigateur. Contactez-nous pour une correction ou suppression.']];
 return <section className="shop-faq mt-12"><div><p className="hero-eyebrow">{ar?'كل شيء واضح':'TOUT SIMPLEMENT'}</p><h2 className="font-display text-3xl font-semibold">{ar?'طلب بسيط، ومرحبا بكم.':'Un panier, un échange, et bienvenue.'}</h2><p className="mt-3 text-sm leading-7 text-muted">{ar?'خديجة معكم من الاختيار حتى الاستلام.':'Khadija vous accompagne du choix des produits jusqu’au retrait.'}</p><a href={whatsappHref(ar?'السلام عليكم خديجة، لدي سؤال بخصوص الطلب.':'Salam Khadija, j’ai une question sur ma commande.')} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-grove"><MessageCircle className="size-5"/><span dir="ltr">{WHATSAPP_DISPLAY}</span><ArrowUpRight className="size-4"/></a></div><div>{faqs.map(([title,body])=><details key={title} className="border-b border-line py-4"><summary className="cursor-pointer text-sm font-semibold">{title}</summary><p className="mt-3 text-sm leading-7 text-muted">{body}</p></details>)}</div></section>;
}
