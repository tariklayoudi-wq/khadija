import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, LayoutGrid, MapPin, MessageCircle, Plus, Search, Tag, ShoppingBag } from "lucide-react";
import { Toaster } from "sonner";
import { CATEGORIES, CITIES, defaultSearch, SELLER } from "@/lib/catalog";
import { cityLabel, useBrowseSearch, usePatchBrowse } from "@/lib/browse";
import { pick, useLocale, useUi } from "@/lib/l10n";
import { useAllListings, useMarket } from "@/lib/market-store";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "browse", icon: LayoutGrid, exact: true },
  { to: "/salvati", key: "saved", icon: Heart, exact: false },
  { to: "/messaggi", key: "messages", icon: MessageCircle, exact: false },
  { to: "/vendite", key: "mine", icon: Tag, exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = useShop(s => s.cart.reduce((n,i)=>n+i.quantity,0));
  const saved = useMarket((s) => s.saved.length);
  const { t, locale, setLocale } = useUi();

  useEffect(() => {
    void useMarket.persist.rehydrate();
    void useLocale.persist.rehydrate();
    void useShop.persist.rehydrate();
    void useShop.getState().load();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = t.docTitle;
    const campaign = window.location.search;
    if(campaign.includes("utm_"))sessionStorage.setItem("khadija-campaign",campaign);
  }, [locale, t.docTitle]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-30 bg-grove text-cream">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4">
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
          <ThemeSwitch locale={locale} />
          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <CitySelect className="hidden sm:flex" />
            <Link to="/panier" className="cart-header inline-flex h-11 items-center gap-2 rounded-full bg-clay px-4 text-sm font-semibold text-surface">
              <ShoppingBag className="size-5" /><span>{locale === "ar" ? "السلة" : "Panier"}</span>{cartCount>0?<span className="rounded-full bg-surface px-2 text-clay">{cartCount}</span>:null}
            </Link>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchField />
        </div>
        <div className="zellige" />
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <main className="min-w-0 flex-1 overflow-x-hidden pb-24 lg:pb-10">{children}<div className="px-6 py-4 text-xs text-muted"><a href={`${import.meta.env.BASE_URL}credits-photos.html`} className="underline">{locale === "ar" ? "صور توضيحية · مصادر الصور" : "Photos représentatives · Crédits photos"}</a></div></main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 bg-grove text-cream lg:hidden" aria-label="Navigazione">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          <Tab to="/" label={t.explore} icon={LayoutGrid} active={pathname === "/"} search={defaultSearch} />
          <Tab to="/salvati" label={t.saved} icon={Heart} active={pathname.startsWith("/salvati")} />
          <Tab to="/panier" label={locale === "ar" ? "السلة" : "Panier"} icon={ShoppingBag} active={pathname.startsWith("/panier")} badge={cartCount} />
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

function ThemeSwitch({ locale }: { locale: "ar" | "fr" }) {
  const [preference, setPreference] = useState("auto");
  useEffect(() => {
    try { setPreference(localStorage.getItem("khadija-theme") || "auto"); } catch {}
    const sync = (event: Event) => setPreference((event as CustomEvent).detail.preference);
    window.addEventListener("khadija-theme-applied", sync);
    return () => window.removeEventListener("khadija-theme-applied", sync);
  }, []);
  return <select aria-label={locale === "ar" ? "مظهر الموقع" : "Apparence du site"}
    title={locale === "ar" ? "تلقائي: داكن من 19:00 إلى 07:00 حسب توقيت جهازك" : "Auto : sombre de 19 h à 7 h, heure de votre appareil"}
    className="theme-select h-10 max-w-24 rounded-full border border-cream/30 bg-transparent px-2 text-xs"
    value={preference} onChange={event => {
      setPreference(event.target.value);
      window.dispatchEvent(new CustomEvent("khadija-theme-change", { detail: event.target.value }));
    }}>
      <option value="auto">{locale === "ar" ? "تلقائي" : "Auto"}</option>
      <option value="light">{locale === "ar" ? "فاتح" : "Clair"}</option>
      <option value="dark">{locale === "ar" ? "داكن" : "Sombre"}</option>
    </select>;
}

function Tab({
  to,
  label,
  icon: Icon,
  active,
  search,
  badge = 0,
}: {
  to: "/" | "/salvati" | "/vendi" | "/messaggi" | "/panier";
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
