// Содержимое для src/components/shared/Ring.tsx

type RingProps = {
  value: number;
  target: number;
};

export function Ring({ value, target }: RingProps) {
  const pct = Math.max(0, Math.min(1, value / target));
  const deg = Math.round(360 * pct);
  return (
    <div className="relative grid size-24 place-items-center">
      <div
        className="absolute inset-0 rounded-full"
        // Используем наши фирменные цвета
        style={{ background: `conic-gradient(#10B981 ${deg}deg, #E5E7EB ${deg}deg)` }}
        aria-hidden
      />
      <div className="absolute inset-2 rounded-full bg-white" aria-hidden />
      <div className="relative text-center">
        <div className="font-headings text-lg font-semibold text-neutral-ink">{Math.round(value)}</div>
        <div className="text-xs text-neutral-slate">/ {Math.round(target)} kcal</div>
      </div>
    </div>
  );
}