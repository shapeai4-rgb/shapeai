// Содержимое для src/components/shared/PdfMini.tsx

export function PdfMini() {
  return (
    <div className="rounded-card border border-neutral-lines bg-white p-4 shadow-soft">
      {/* Используем наш фирменный градиент, определенный в конфиге */}
      <div className="rounded-xl bg-brand-gradient p-4 ring-1 ring-neutral-lines/50">
        <div className="flex items-center gap-3">
          {/* Используем основной акцентный цвет */}
          <div className="size-10 rounded-md bg-accent" />
          <div>
            <div className="font-headings text-sm font-semibold text-neutral-ink">Weight Loss — 7‑Day Plan</div>
            <div className="text-xs text-neutral-slate">PDF • branded • QR enabled</div>
          </div>
        </div>
        {/* Стилизуем плейсхолдер */}
        <div className="mt-4 h-24 rounded-lg bg-white/70 ring-1 ring-neutral-lines" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-neutral-slate">Days 2–7 in PDF</div>
        <button className="text-sm font-semibold text-accent transition-opacity hover:opacity-80">Download demo</button>
      </div>
    </div>
  );
}