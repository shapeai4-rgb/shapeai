// Содержимое для src/components/shared/SkeletonCard.tsx

export function SkeletonCard() {
  // Заменяем цвета на наши кастомные из tailwind.config.ts
  return (
    <div className="animate-pulse rounded-card border border-neutral-lines bg-white p-4 shadow-soft">
      <div className="h-32 rounded-xl bg-neutral-lines/40" />
      <div className="mt-3 h-4 w-2/3 rounded bg-neutral-lines/40" />
      <div className="mt-2 h-4 w-1/2 rounded bg-neutral-lines/40" />
      <div className="mt-4 h-2 w-full rounded bg-neutral-lines/40" />
      <div className="mt-2 h-2 w-5/6 rounded bg-neutral-lines/40" />
    </div>
  );
}