import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, CITIES, PHOTO_PRESETS, type CategoryId, type Listing } from "@/lib/catalog";
import { fileToDataUrl } from "@/lib/image";
import { UNIT_IDS, cityName, pick, showUnit, useUi } from "@/lib/l10n";
import { useMarket } from "@/lib/market-store";
import { Shell } from "@/components/shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vendi")({
  component: SellPage,
});

const field =
  "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink focus:border-grove focus:outline-none";

function SellPage() {
  const { t, locale } = useUi();
  const navigate = useNavigate();
  const addListing = useMarket((s) => s.addListing);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState(UNIT_IDS[0] ?? "piece");
  const [category, setCategory] = useState<CategoryId>("latticini");
  const [city, setCity] = useState<(typeof CITIES)[number]>("Khouribga");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(PHOTO_PRESETS[0]?.src ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t.errType);
      return;
    }
    setBusy(true);
    try {
      setImage(await fileToDataUrl(file));
      setError("");
    } catch {
      setError(t.errRead);
    } finally {
      setBusy(false);
    }
  }

  function publish() {
    const amount = Number(price.replace(",", "."));
    if (title.trim().length < 3) {
      setError(t.errTitle);
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(t.errPrice);
      return;
    }
    if (description.trim().length < 10) {
      setError(t.errDesc);
      return;
    }
    if (!image) {
      setError(t.errPhoto);
      return;
    }
    const listing: Listing = {
      id: `mio-${Date.now()}`,
      title: title.trim(),
      price: Math.round(amount),
      unit,
      category,
      city,
      area: area.trim() || city,
      description: description.trim(),
      images: [image],
      hoursAgo: 0,
      fresh: true,
      mine: true,
    };
    addListing(listing);
    toast.success(t.published);
    void navigate({ to: "/listing/$id", params: { id: listing.id } });
  }

  return (
    <Shell>
      <div className="mx-auto max-w-xl px-4 py-4 lg:px-6">
        <h1 className="font-display text-2xl font-semibold">{t.sellTitle}</h1>
        <p className="mt-1 text-sm text-muted">{t.sellIntro}</p>

        <div className="mt-5">
          <p className="text-sm font-semibold">{t.photo}</p>
          <div className="mt-2 overflow-hidden rounded-xl bg-cream">
            {image ? (
              <img src={image} alt={t.preview} className="aspect-square w-full object-cover" />
            ) : (
              <div className="grid aspect-square place-items-center text-sm text-muted">{t.noPhoto}</div>
            )}
          </div>
          <div className="mt-2 flex w-full min-w-0 gap-2 overflow-x-auto no-scrollbar">
            {PHOTO_PRESETS.map((preset) => (
              <button
                key={preset.src}
                type="button"
                aria-label={pick(preset.label, locale)}
                onClick={() => setImage(preset.src)}
                className={cn(
                  "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                  image === preset.src ? "border-grove" : "border-transparent",
                )}
              >
                <img src={preset.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <label className="mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium">
            <ImagePlus className="size-4" />
            {busy ? t.loading : t.upload}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => void onFile(event.target.files?.[0])}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <label className="text-sm font-semibold">
            {t.fieldTitle}
            <input
              value={title}
              dir="auto"
              onChange={(e) => setTitle(e.target.value)}
              className={`${field} mt-1 font-normal`}
              placeholder={t.titlePh}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">
              {t.priceDh}
              <input
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`${field} mt-1 font-normal`}
                placeholder="12"
              />
            </label>
            <label className="text-sm font-semibold">
              {t.unit}
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className={`${field} mt-1 font-normal`}>
                {UNIT_IDS.map((id) => (
                  <option key={id} value={id}>
                    {showUnit(id, locale)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">
              {t.category}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className={`${field} mt-1 font-normal`}
              >
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {pick(item.label, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              {t.city}
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as (typeof CITIES)[number])}
                className={`${field} mt-1 font-normal`}
              >
                {CITIES.map((item) => (
                  <option key={item} value={item}>
                    {cityName(item, locale)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-sm font-semibold">
            {t.area}
            <input
              value={area}
              dir="auto"
              onChange={(e) => setArea(e.target.value)}
              placeholder={t.areaPh}
              className={`${field} mt-1 font-normal`}
            />
          </label>
          <label className="text-sm font-semibold">
            {t.fieldDesc}
            <textarea
              value={description}
              dir="auto"
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm font-normal focus:border-grove focus:outline-none"
              placeholder={t.descPh}
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-sm font-medium text-heart">{error}</p> : null}

        <button
          type="button"
          onClick={publish}
          disabled={busy}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-clay text-sm font-semibold text-surface disabled:opacity-50"
        >
          {t.publish}
        </button>
      </div>
    </Shell>
  );
}
