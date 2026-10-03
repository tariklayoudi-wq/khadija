import type { Listing } from "@/lib/catalog";
import { formatPrice, pick, type Locale } from "@/lib/l10n";

/** Morocco mobile, no plus: wa.me/212704221975 */
export const WHATSAPP_E164 = "212704221975";
export const WHATSAPP_DISPLAY = "+212 704-221975";

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

export function listingInquiry(listing: Listing | undefined, locale: Locale, note: string, pageUrl?: string) {
  const title = listing ? pick(listing.title, locale) : "";
  const price = listing ? formatPrice(listing.price, locale) : "";
  const about = title ? `${title} — ${price}` : "";
  const ask = note.trim() || (locale === "ar" ? "السلام عليكم، هل ما زال متوفراً؟" : "Salam, est-ce encore disponible ?");
  return [ask, about, pageUrl].filter(Boolean).join("\n");
}

export function openWhatsapp(text: string) {
  window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
}
