import { Link, createFileRoute } from "@tanstack/react-router";
import { defaultSearch } from "@/lib/catalog";
import { useUi } from "@/lib/l10n";
import { useAllListings, useMarket } from "@/lib/market-store";
import { ListingCard } from "@/components/listing-card";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/salvati")({
  component: SavedPage,
});

function SavedPage() {
  const { t } = useUi();
  const saved = useMarket((s) => s.saved);
  const listings = useAllListings().filter((listing) => saved.includes(listing.id));

  return (
    <Shell>
      <div className="px-4 py-4 lg:px-6">
        <h1 className="font-display text-2xl font-semibold">{t.savedTitle}</h1>
        <p className="text-sm text-muted">{listings.length === 0 ? t.savedNone : t.savedSome(listings.length)}</p>
        {listings.length === 0 ? (
          <div className="mt-8 rounded-xl border border-line bg-surface px-6 py-12 text-center">
            <p className="font-semibold">{t.savedEmpty}</p>
            <p className="mt-1 text-sm text-muted">{t.savedHint}</p>
            <Link
              to="/"
              search={defaultSearch}
              className="mt-4 inline-flex h-11 items-center rounded-full bg-grove px-5 text-sm font-semibold text-cream"
            >
              {t.browseAds}
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
