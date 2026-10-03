import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, LayoutGrid, MapPin, MessageCircle, Plus, Search, Tag } from "lucide-react";
import { Toaster } from "sonner";
import { CATEGORIES, CITIES, defaultSearch, SELLER } from "@/lib/catalog";
import { cityLabel, useBrowseSearch, usePatchBrowse } from "@/lib/browse";
import { pick, useLocale, useUi } from "@/lib/l10n";
import { useAllListings, useMarket } from "@/lib/market-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "browse", icon: LayoutGrid, exact: true },
  { to: "/salvati", key: "saved", icon: Heart, exact: false },
  { to: "/messaggi", key: "messages", icon: MessageCircle, exact: false },
  { to: "/vendite", key: "mine", icon: Tag, exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const saved = useMarket((s) => s.saved.length);
  const { t, locale, setLocale } = useUi();

  useEffect(() => {
    void useMarket.persist.rehydrate();
    void useLocale.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = t.docTitle;
  }, [locale, t.docTitle]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-30 bg-grove text-cream">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link to="/" search={defaultSearch} className="flex shrink-0 items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-cream font-display text-sm font-semibold text-grove">
              Kh
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-lg font-semibold leading-none">
                {locale === "ar" ? SELLER.nameAr : SELLER.name}
              </span>
              <span className="mt-0.5 block text-xs leading-none text-cream/80">خديجة · Khouribga</span>
            </span>
          </Link>
          <SearchField className="ms-auto hidden min-w-0 max-w-md flex-1 md:block" />
          <LangSwitch locale={locale} setLocale={setLocale} />
          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <CitySelect className="hidden sm:flex" />
            <Link
              to="/vendi"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-clay px-4 text-sm font-semibold text-surface"
            >
              <Plus className="size-4" />
              {t.sell}
            </Link>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchField />
        </div>
        <div className="zellige" />
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-header hidden h-[calc(100dvh-var(--spacing-header))] w-72 shrink-0 overflow-y-auto border-e border-line bg-canvas lg:block">
          <nav className="flex flex-col gap-1 p-3" aria-label="Marketplace">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              const badge = item.to === "/salvati" ? saved : 0;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={item.to === "/" ? defaultSearch : item.to === "/messaggi" ? { t: "" } : undefined}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-full px-2 text-sm font-medium",
                    active ? "bg-surface text-grove shadow-card" : "text-ink hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full shadow-card",
                      active ? "bg-grove text-cream" : "bg-surface text-grove",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1">{t[item.key]}</span>
                  {badge > 0 ? (
                    <span className="rounded-full bg-grove-soft px-2 py-0.5 text-xs font-semibold text-grove">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <SidebarFilters />
          <div className="m-3 rounded-2xl bg-surface p-3 shadow-card">
            <p className="truncate font-display text-base font-semibold">
              {locale === "ar" ? SELLER.nameAr : SELLER.name}
            </p>
            <p className="text-xs leading-snug text-muted">
              {t.family} {SELLER.since}
            </p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 overflow-x-hidden pb-24 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 bg-grove text-cream lg:hidden" aria-label="Navigazione">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          <Tab to="/" label={t.explore} icon={LayoutGrid} active={pathname === "/"} search={defaultSearch} />
          <Tab to="/salvati" label={t.saved} icon={Heart} active={pathname.startsWith("/salvati")} />
          <Tab to="/vendi" label={t.sell} icon={Plus} active={pathname.startsWith("/vendi")} />
          <Tab
            to="/messaggi"
            label={t.messages}
            icon={MessageCircle}
            active={pathname.startsWith("/messaggi")}
            search={{ t: "" }}
          />
        </ul>
      </nav>
    </div>
  );
}

function Tab({
  to,
  label,
  icon: Icon,
  active,
  search,
  badge = 0,
}: {
  to: "/" | "/salvati" | "/vendi" | "/messaggi";
  label: string;
  icon: typeof Heart;
  active: boolean;
  search?: Record<string, string>;
  badge?: number;
}) {
  return (
    <li>
      <Link
        to={to}
        search={search}
        className={cn(
          "relative flex h-16 flex-col items-center justify-center gap-0.5 text-xs font-medium",
          active ? "text-cream" : "text-cream/70",
        )}
      >
        <Icon className="size-5" />
        {label}
        {badge > 0 ? (
          <span className="absolute end-5 top-2 rounded-full bg-clay px-1.5 text-xs font-semibold leading-4 text-surface">
            {badge > 9 ? "9+" : badge}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function SearchField({ className }: { className?: string }) {
  const { t } = useUi();
  const browse = useBrowseSearch();
  const patch = usePatchBrowse();
  const [q, setQ] = useState(browse.q);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) {
      setQ(browse.q);
      return;
    }
    if (q === browse.q) {
      dirty.current = false;
      return;
    }
    const timer = window.setTimeout(() => patch({ q }), 250);
    return () => window.clearTimeout(timer);
  }, [q, browse.q, patch]);

  return (
    <form
      className={className}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        dirty.current = true;
        patch({ q });
      }}
    >
      <label className="relative block">
        <span className="sr-only">{t.search}</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(event) => {
            dirty.current = true;
            setQ(event.target.value);
          }}
          placeholder={t.search}
          className="h-10 w-full rounded-full border border-transparent bg-surface ps-9 pe-3 text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </label>
    </form>
  );
}

function CitySelect({ className }: { className?: string }) {
  const { locale, t } = useUi();
  const search = useBrowseSearch();
  const patch = usePatchBrowse();
  return (
    <label className={cn("relative h-11 items-center gap-1.5 rounded-full bg-surface px-3 text-sm text-ink", className)}>
      <MapPin className="size-4 text-clay" />
      <select
        aria-label={t.city}
        value={CITIES.includes(search.city as (typeof CITIES)[number]) || search.city === "tutte" ? search.city : "tutte"}
        onChange={(event) => patch({ city: event.target.value })}
        className="max-w-40 bg-transparent text-sm font-medium text-ink focus:outline-none"
      >
        <option value="tutte">{cityLabel("tutte", locale)}</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {cityLabel(city, locale)}
          </option>
        ))}
      </select>
    </label>
  );
}

function SidebarFilters() {
  const { t, locale } = useUi();
  const search = useBrowseSearch();
  const patch = usePatchBrowse();
  const listings = useAllListings();

  return (
    <div className="px-3 pb-2">
      <p className="px-2 pb-1 pt-3 text-xs font-semibold tracking-wide text-muted">{t.categories}</p>
      <ul className="flex flex-col">
        {CATEGORIES.map((category) => {
          const active = search.cat === category.id;
          const count = listings.filter((l) => l.category === category.id).length;
          const Icon = category.icon;
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => patch({ cat: active ? "tutti" : category.id })}
                className={cn(
                  "flex h-11 w-full items-center gap-2 rounded-full px-2 text-start text-sm",
                  active ? "bg-surface font-semibold text-grove shadow-card" : "text-ink hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full",
                    active ? "bg-grove text-cream" : "bg-cream text-grove",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 truncate">{pick(category.label, locale)}</span>
                <span className="text-xs text-muted">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LangSwitch({
  locale,
  setLocale,
}: {
  locale: "ar" | "fr";
  setLocale: (locale: "ar" | "fr") => void;
}) {
  return (
    <div className="flex h-11 items-center rounded-full bg-cream p-1 text-sm font-semibold text-ink">
      <button
        type="button"
        aria-pressed={locale === "ar"}
        onClick={() => setLocale("ar")}
        className={cn("h-9 rounded-full px-3", locale === "ar" ? "bg-grove text-cream" : "text-ink")}
      >
        عربي
      </button>
      <button
        type="button"
        aria-pressed={locale === "fr"}
        onClick={() => setLocale("fr")}
        className={cn("h-9 rounded-full px-3", locale === "fr" ? "bg-grove text-cream" : "text-ink")}
      >
        FR
      </button>
    </div>
  );
}
