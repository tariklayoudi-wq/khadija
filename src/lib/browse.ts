import { useCallback, useMemo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { categoryById, defaultSearch, isCategory, isCity, type HomeSearch, type Listing, type SortKey } from "@/lib/catalog";
import { cityName, flat, type Locale } from "@/lib/l10n";

export function useBrowseSearch(): HomeSearch {
  const href = useRouterState({ select: (s) => s.location.href });
  return useMemo(() => readSearch(href), [href]);
}

function readSearch(href: string): HomeSearch {
  const noHost = href.replace(/^https?:\/\/[^/]+/, "");
  const hashless = noHost.split("#")[0] ?? "/";
  const qIndex = hashless.indexOf("?");
  const pathname = qIndex === -1 ? hashless : hashless.slice(0, qIndex);
  if (pathname !== "/") return defaultSearch;
  const params = new URLSearchParams(qIndex === -1 ? "" : hashless.slice(qIndex + 1));
  const sort = params.get("sort");
  const sortKey: SortKey = sort === "prezzo-asc" || sort === "prezzo-desc" ? sort : "recenti";
  const cat = params.get("cat");
  const city = params.get("city");
  return {
    q: params.get("q") ?? "",
    cat: isCategory(cat) ? cat : "tutti",
    city: isCity(city) ? city : "tutte",
    sort: sortKey,
    max: params.get("max") ?? "",
  };
}

export function usePatchBrowse() {
  const navigate = useNavigate();
  const current = useBrowseSearch();
  return useCallback(
    (patch: Partial<HomeSearch>) => {
      void navigate({ to: "/", search: { ...current, ...patch } });
    },
    [navigate, current],
  );
}

export function cityLabel(city: string, locale: Locale) {
  return cityName(city, locale);
}

export function filterListings(listings: Listing[], search: HomeSearch) {
  const words = search.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const max = search.max ? Number(search.max) : Number.NaN;
  const out = listings.filter((listing) => {
    if (search.cat !== "tutti" && listing.category !== search.cat) return false;
    if (search.city !== "tutte" && listing.city !== search.city) return false;
    if (Number.isFinite(max) && listing.price > max) return false;
    if (words.length) {
      const cat = categoryById(listing.category)?.label;
      const hay = `${flat(listing.title)} ${flat(listing.description)} ${listing.city} ${cityName(listing.city, "ar")} ${cityName(listing.city, "fr")} ${flat(listing.area)} ${flat(listing.unit)} ${cat ? flat(cat) : ""}`.toLowerCase();
      if (!words.every((word) => hay.includes(word))) return false;
    }
    return true;
  });
  out.sort((a, b) => {
    if (search.sort === "prezzo-asc") return a.price - b.price || a.hoursAgo - b.hoursAgo;
    if (search.sort === "prezzo-desc") return b.price - a.price || a.hoursAgo - b.hoursAgo;
    return a.hoursAgo - b.hoursAgo;
  });
  return out;
}
