import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { cityName, pick, useUi } from "@/lib/l10n";
import { useMarket } from "@/lib/market-store";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/vendite")({
  component: MinePage,
});

function MinePage() {
  const { t, locale } = useUi();
  const extras = useMarket((s) => s.extras);
  const removeListing = useMarket((s) => s.removeListing);
  const [pending, setPending] = useState<string | null>(null);

  return (
    <Shell>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">{t.yourAds}</h1>
            <p className="text-sm text-muted">{t.yourHint}</p>
          </div>
          <Link
            to="/vendi"
            className="inline-flex h-11 items-center rounded-full bg-clay px-4 text-sm font-semibold text-surface"
          >
            {t.newAd}
          </Link>
        </div>

        {extras.length === 0 ? (
          <div className="mt-8 rounded-xl border border-line bg-surface px-6 py-12 text-center">
            <p className="font-semibold">{t.nonePublished}</p>
            <p className="mt-1 text-sm text-muted">{t.noneHint}</p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {extras.map((listing) => {
              const title = pick(listing.title, locale);
              return (
                <li key={listing.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                  <Link to="/listing/$id" params={{ id: listing.id }} className="flex min-w-0 flex-1 items-center gap-3">
                    <img src={listing.images[0]} alt="" className="size-16 rounded-lg object-cover" />
                    <span className="min-w-0">
                      <span dir="auto" className="block truncate font-semibold">
                        {title}
                      </span>
                      <span className="text-sm text-muted">
                        {formatPrice(listing.price)} · {cityName(listing.city, locale)}
                      </span>
                    </span>
                  </Link>
                  {pending === listing.id ? (
                    <button
                      type="button"
                      onClick={() => removeListing(listing.id)}
                      className="h-11 shrink-0 rounded-full bg-heart px-4 text-sm font-semibold text-surface"
                    >
                      {t.delete}
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label={t.deleteNamed(title)}
                      onClick={() => setPending(listing.id)}
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-line"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Shell>
  );
}
