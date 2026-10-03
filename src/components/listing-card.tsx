import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { formatPrice, type Listing } from "@/lib/catalog";
import { cityName, pick, showUnit, useUi } from "@/lib/l10n";
import { useMarket } from "@/lib/market-store";
import { cn } from "@/lib/utils";

export function SaveButton({ id, className }: { id: string; className?: string }) {
  const { t } = useUi();
  const saved = useMarket((s) => s.saved.includes(id));
  const toggleSave = useMarket((s) => s.toggleSave);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t.unsave : t.save}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSave(id);
      }}
      className={cn(
        "grid size-11 place-items-center rounded-full bg-surface text-ink shadow-sm",
        saved && "text-heart",
        className,
      )}
    >
      <Heart className="size-5" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, locale } = useUi();
  const title = pick(listing.title, locale);
  return (
    <article className="group relative rounded-2xl bg-surface p-2 shadow-card">
      <Link to="/listing/$id" params={{ id: listing.id }} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
          <img
            src={listing.images[0]}
            alt={title}
            className="h-full w-full object-cover motion-safe:transition motion-safe:duration-200 motion-safe:group-hover:brightness-95"
          />
          {listing.fresh ? (
            <span className="absolute start-2 top-2 rounded-full bg-grove px-2.5 py-1 text-xs font-semibold text-cream">
              {t.today}
            </span>
          ) : null}
        </div>
        <div className="px-1.5 pb-1 pt-2">
          <p className="font-display text-lg font-semibold leading-tight text-grove">{formatPrice(listing.price)}</p>
          <h2 dir="auto" className="mt-0.5 line-clamp-2 text-sm leading-snug text-ink">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {cityName(listing.city, locale)} · {showUnit(listing.unit, locale)}
          </p>
        </div>
      </Link>
      <SaveButton id={listing.id} className="absolute end-3 top-3" />
    </article>
  );
}
