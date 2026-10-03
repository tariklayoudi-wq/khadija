import { useState } from "react";
import { SELLER } from "@/lib/catalog";
import { formatClock, useUi } from "@/lib/l10n";
import type { ChatMessage } from "@/lib/market-store";
import { useAllListings } from "@/lib/market-store";
import { listingInquiry, openWhatsapp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Bubbles({ messages }: { messages: ChatMessage[] }) {
  const { t, locale } = useUi();
  const name = locale === "ar" ? SELLER.nameAr : SELLER.name;
  if (!messages.length) return null;
  return (
    <ol className="flex flex-col gap-2">
      {messages.map((message) => {
        const mine = message.from === "me";
        return (
          <li key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug",
                mine ? "bg-grove text-cream" : "border border-line bg-surface text-ink",
              )}
            >
              <p dir="auto">{message.text}</p>
              <p className={cn("mt-1 text-xs", mine ? "text-cream/80" : "text-muted")}>
                {mine ? t.you : name} · {formatClock(message.at, locale)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Composer({ listingId }: { listingId: string }) {
  const { t, locale } = useUi();
  const listing = useAllListings().find((item) => item.id === listingId);
  const [text, setText] = useState("");

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        openWhatsapp(listingInquiry(listing, locale, text, window.location.href));
        setText("");
      }}
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">{t.writePh}</span>
        <textarea
          value={text}
          rows={2}
          dir="auto"
          placeholder={t.writePh}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          className="min-h-11 w-full resize-none rounded-2xl border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-grove focus:outline-none"
        />
      </label>
      <button
        type="submit"
        aria-label={t.send}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-[#128C7E] text-white"
      >
        <WhatsAppIcon className="size-5" />
      </button>
    </form>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.76 13.95c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.12.1-1.81-.11-.41-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.4 1.02-.4.12 0 .23 0 .33.01.3.01.45-.02.68.52.24.58.83 2 .9 2.15.07.14.12.32.02.51-.1.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.13-.28.27-.12.53.16.26.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.27.37-.23.62-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.12.07.68-.17 1.36z" />
    </svg>
  );
}
