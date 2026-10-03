import { Link, createFileRoute } from "@tanstack/react-router";
import { defaultSearch, SELLER } from "@/lib/catalog";
import { useUi } from "@/lib/l10n";
import { WhatsAppIcon } from "@/components/composer";
import { Shell } from "@/components/shell";
import { openWhatsapp, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/messaggi")({
  validateSearch: (search: Record<string, unknown>) => ({
    t: typeof search.t === "string" ? search.t : "",
  }),
  component: InboxPage,
});

function InboxPage() {
  const { t, locale } = useUi();
  const name = locale === "ar" ? SELLER.nameAr : SELLER.name;

  return (
    <Shell>
      <div className="mx-auto max-w-lg px-4 py-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#128C7E] text-white">
          <WhatsAppIcon className="size-8" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold">{t.noChat}</h1>
        <p className="mt-2 text-sm text-muted">{t.noChatHint}</p>
        <p className="mt-4 font-display text-3xl font-semibold tracking-tight" dir="ltr">
          {WHATSAPP_DISPLAY}
        </p>
        <p className="mt-1 text-sm text-muted">{name}</p>
        <button
          type="button"
          onClick={() => openWhatsapp(locale === "ar" ? "السلام عليكم" : "Salam")}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#128C7E] px-6 text-sm font-semibold text-white"
        >
          <WhatsAppIcon className="size-4" />
          {t.waOpen}
        </button>
        <div>
          <Link
            to="/"
            search={defaultSearch}
            className="mt-4 inline-flex h-11 items-center text-sm font-medium text-grove"
          >
            {t.goAds}
          </Link>
        </div>
      </div>
    </Shell>
  );
}
