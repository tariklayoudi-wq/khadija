import { useMemo, type ReactNode } from "react";
import { LayoutGrid } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, CITIES, LISTINGS, defaultSearch, isCategory, isCity, PRICE_CAPS, type HomeSearch, type SortKey } from "@/lib/catalog";
import { cityLabel, filterListings, usePatchBrowse } from "@/lib/browse";
import { pick, useUi } from "@/lib/l10n";
import { useAllListings } from "@/lib/market-store";
import { ListingCard } from "@/components/listing-card";
import { Shell } from "@/components/shell";
import { ShopIntro, ShopInfo } from "@/components/shop-intro";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const sort = search.sort;
    const sortKey: SortKey = sort === "prezzo-asc" || sort === "prezzo-desc" ? sort : "recenti";
    const max = typeof search.max === "string" ? search.max : "";
    return {
      q: typeof search.q === "string" ? search.q : "",
      cat: isCategory(search.cat) ? search.cat : "tutti",
      city: isCity(search.city) ? search.city : "tutte",
      sort: sortKey,
      max: PRICE_CAPS.some((cap) => cap.value === max) ? max : "",
    };
  },
  component: Home,
});

function Home() {
  const { t, locale } = useUi();
  const search = Route.useSearch();
  const patch = usePatchBrowse();
  const listings = useAllListings();
  const items = useMemo(() => filterListings(listings, search), [listings, search]);
  const category = CATEGORIES.find((item) => item.id === search.cat);
  const title = search.q.trim()
    ? t.results(search.q.trim())
    : category
      ? pick(category.label, locale)
      : t.chosen;
  const showIntro = !search.q && search.cat === "tutti" && search.city === "tutte" && !search.max;

  return (
    <Shell>
      <div className="min-w-0 px-4 py-4 lg:px-6">
        {showIntro ? <ShopIntro /> : null}

        <div className="flex w-full min-w-0 gap-3 overflow-x-auto no-scrollbar pb-1">
          <CircleCat active={search.cat === "tutti"} label={t.all} onClick={() => patch({ cat: "tutti" })}>
            <LayoutGrid className="size-6" />
          </CircleCat>
          {CATEGORIES.map((item) => {
            const Icon = item.icon;
            return (
              <CircleCat
                key={item.id}
                active={search.cat === item.id}
                label={pick(item.label, locale)}
                onClick={() => patch({ cat: item.id })}
              >
                <img src={LISTINGS.find(p=>p.category===item.id)?.images[0]} alt="" className="h-full w-full rounded-full object-cover" loading="lazy" />
              </CircleCat>
            );
          })}
        </div>

        <div className="mt-2 flex w-full min-w-0 gap-2 overflow-x-auto no-scrollbar">
          {PRICE_CAPS.map((cap) => (
            <Chip key={cap.value || "any"} active={search.max === cap.value} onClick={() => patch({ max: cap.value })}>
              {pick(cap.label, locale)}
            </Chip>
          ))}
          <label className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm sm:hidden">
            <select
              aria-label={t.city}
              value={search.city}
              onChange={(event) => patch({ city: event.target.value })}
              className="max-w-36 bg-transparent font-medium focus:outline-none"
            >
              <option value="tutte">{cityLabel("tutte", locale)}</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {cityLabel(city, locale)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div id="catalogue" className="scroll-mt-40 mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted">
              {items.length === 1 ? t.oneAd : t.nAds(items.length)} · {cityLabel(search.city, locale)}
            </p>
          </div>
          <label className="relative shrink-0">
            <select
              aria-label={t.sortRecent}
              value={search.sort}
              onChange={(event) => patch({ sort: event.target.value as SortKey })}
              className="h-11 max-w-40 rounded-lg border border-line bg-surface px-3 text-sm font-medium sm:max-w-none"
            >
              <option value="recenti">{t.sortRecent}</option>
              <option value="prezzo-asc">{t.sortAsc}</option>
              <option value="prezzo-desc">{t.sortDesc}</option>
            </select>
          </label>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-line bg-surface px-6 py-12 text-center">
            <p className="text-lg font-semibold">{t.empty}</p>
            <p className="mt-1 text-sm text-muted">{t.emptyHint}</p>
            <button
              type="button"
              onClick={() => patch(defaultSearch)}
              className="mt-4 inline-flex h-11 items-center rounded-full bg-grove px-5 text-sm font-semibold text-cream"
            >
              {t.reset}
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <ShopInfo />
        <footer className="mt-10">
          <div className="zellige" />
          <div className="flex flex-wrap items-center justify-between gap-2 py-4 text-xs font-semibold tracking-wide text-muted">
            <span>{locale === "ar" ? "خريبكة · المغرب" : "Khouribga · Maroc"}</span>
            <span>{t.footerTag}</span>
          </div>
        </footer>
      </div>
    </Shell>
  );
}

function CircleCat({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-24 shrink-0 flex-col items-center gap-1.5">
      <span
        className={cn(
          "grid size-16 place-items-center rounded-full shadow-card",
          active ? "bg-grove text-cream" : "bg-surface text-grove",
        )}
      >
        {children}
      </span>
      <span className={cn("text-center text-xs font-medium leading-tight", active ? "text-grove" : "text-ink")}>
        {label}
      </span>
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium",
        active ? "bg-grove text-cream" : "border border-line bg-surface text-ink",
      )}
    >
      {children}
    </button>
  );
}
