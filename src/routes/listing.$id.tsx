import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import { categoryById, defaultSearch, formatPrice, SELLER } from "@/lib/catalog";
import { cityName, pick, showUnit, timeAgo, useUi } from "@/lib/l10n";
import { useAllListings } from "@/lib/market-store";
import { listingInquiry, openWhatsapp, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { Shell } from "@/components/shell";
import { ListingCard, SaveButton } from "@/components/listing-card";
import { Composer } from "@/components/composer";

export const Route = createFileRoute("/listing/$id")({
  component: ListingPage,
});

function ListingPage() {
  const { t, locale } = useUi();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const listings = useAllListings();
  const listing = listings.find((item) => item.id === id);
  const [photo, setPhoto] = useState(0);
  const name = locale === "ar" ? SELLER.nameAr : SELLER.name;

  useEffect(() => {
    setPhoto(0);
  }, [id]);

  if (!listing) {
    return (
      <Shell>
        <div className="px-4 py-16 text-center">
          <p className="text-lg font-semibold">{t.gone}</p>
          <Link
            to="/"
            search={defaultSearch}
            className="mt-4 inline-flex h-11 items-center rounded-full bg-grove px-5 text-sm font-semibold text-cream"
          >
            {t.backTo}
          </Link>
        </div>
      </Shell>
    );
  }

  const category = categoryById(listing.category);
  const image = listing.images[Math.min(photo, listing.images.length - 1)] ?? listing.images[0];
  const similar = listings.filter((item) => item.category === listing.category && item.id !== listing.id).slice(0, 4);
  const title = pick(listing.title, locale);

  return (
    <Shell>
      <div className="px-4 py-4 lg:px-6">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) window.history.back();
            else void navigate({ to: "/", search: defaultSearch });
          }}
          className="mb-3 inline-flex h-11 items-center gap-1 text-sm font-medium text-muted"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
          {t.back}
        </button>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <div className="overflow-hidden rounded-xl bg-cream">
              <img src={image} alt={title} className="aspect-square w-full object-cover" />
            </div>
            {listing.images.length > 1 ? (
              <div className="mt-2 flex gap-2">
                {listing.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={locale === "ar" ? `صورة ${index + 1}` : `Photo ${index + 1}`}
                    onClick={() => setPhoto(index)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${index === photo ? "border-grove" : "border-transparent"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="font-display text-3xl font-semibold tracking-tight text-grove">{formatPrice(listing.price)}</p>
            <p className="text-sm text-muted">{showUnit(listing.unit, locale)}</p>
            <h1 dir="auto" className="mt-2 font-display text-3xl font-semibold leading-tight">
              {title}
            </h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted">
              <MapPin className="size-4 shrink-0 text-grove" />
              <span>
                {cityName(listing.city, locale)}، {pick(listing.area, locale)} · {timeAgo(listing.hoursAgo, locale)}
                {category ? ` · ${pick(category.label, locale)}` : ""}
              </span>
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openWhatsapp(listingInquiry(listing, locale, "", window.location.href))}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#128C7E] px-5 text-sm font-semibold text-white"
              >
                {t.messageHer}
              </button>
              <SaveButton id={listing.id} className="border border-line shadow-none" />
            </div>

            <section className="mt-5 rounded-xl border border-line bg-surface p-4">
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted">
                {cityName(SELLER.city, locale)} · {t.sellsSince} {SELLER.since}
              </p>
              <p className="text-sm font-medium text-[#128C7E]" dir="ltr">
                {WHATSAPP_DISPLAY}
              </p>
              <p className="text-sm text-muted">{t.responds}</p>
            </section>

            <section className="mt-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.description}</h2>
              <p dir="auto" className="mt-2 whitespace-pre-wrap text-base leading-relaxed">
                {pick(listing.description, locale)}
              </p>
            </section>

            <section id="scrivi" className="mt-6 scroll-mt-20 rounded-xl border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold">{t.writeTo}</h2>
              <p className="mb-3 mt-1 text-sm text-muted">{t.writeHint}</p>
              <Composer listingId={listing.id} />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success(t.linkCopied);
                  } catch {
                    toast(t.copyFail);
                  }
                }}
                className="mt-3 text-sm font-medium text-grove"
              >
                {t.copyLink}
              </button>
            </section>
          </div>
        </div>

        {similar.length ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t.similar}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {similar.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Shell>
  );
}
