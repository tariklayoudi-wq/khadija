import { useShop } from "./shop-store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getListing, LISTINGS, replyFor, type Listing } from "@/lib/catalog";

export type ChatMessage = {
  id: string;
  from: "me" | "khdija";
  text: string;
  at: number;
};

export type Thread = {
  listingId: string;
  messages: ChatMessage[];
};

type MarketState = {
  saved: string[];
  extras: Listing[];
  threads: Thread[];
  toggleSave: (id: string) => void;
  addListing: (listing: Listing) => void;
  removeListing: (id: string) => void;
  send: (listingId: string, text: string) => void;
};

export const useMarket = create<MarketState>()(
  persist(
    (set, get) => ({
      saved: [],
      extras: [],
      threads: [],
      toggleSave: (id) =>
        set((s) => ({
          saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
        })),
      addListing: (listing) => set((s) => ({ extras: [listing, ...s.extras] })),
      removeListing: (id) =>
        set((s) => ({
          extras: s.extras.filter((l) => l.id !== id),
          saved: s.saved.filter((x) => x !== id),
          threads: s.threads.filter((t) => t.listingId !== id),
        })),
      send: (listingId, text) => {
        const clean = text.trim();
        if (!clean) return;
        const msg: ChatMessage = {
          id: crypto.randomUUID(),
          from: "me",
          text: clean,
          at: Date.now(),
        };
        set((s) => {
          const hit = s.threads.some((t) => t.listingId === listingId);
          if (!hit) return { threads: [{ listingId, messages: [msg] }, ...s.threads] };
          return {
            threads: s.threads.map((t) =>
              t.listingId === listingId ? { ...t, messages: [...t.messages, msg] } : t,
            ),
          };
        });
        const listing = getListing(listingId, get().extras);
        if (!listing) return;
        const answer = replyFor(listing, clean);
        window.setTimeout(() => {
          const reply: ChatMessage = {
            id: crypto.randomUUID(),
            from: "khdija",
            text: answer,
            at: Date.now(),
          };
          set((s) => ({
            threads: s.threads.map((t) =>
              t.listingId === listingId ? { ...t, messages: [...t.messages, reply] } : t,
            ),
          }));
        }, 650);
      },
    }),
    { name: "khdija-market", skipHydration: true },
  ),
);

export function useAllListings() {
  const extras = useMarket((s) => s.extras);
  const products = useShop((s) => s.products);
  return [...extras, ...(products ?? LISTINGS)];
}
