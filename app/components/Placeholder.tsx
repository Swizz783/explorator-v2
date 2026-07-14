/* Substituent pentru locurile fara poza — dreptunghi cu textul tipului, ca in proiectul vechi (.ph). */
export default function Placeholder({
  label,
  small,
}: {
  label: string;
  small?: boolean;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background:
          "repeating-linear-gradient(135deg, rgba(22,74,122,.05) 0 10px, rgba(22,74,122,.02) 10px 20px), var(--color-plaster-2)",
      }}
    >
      <span
        className={`rounded-full border border-line bg-card uppercase tracking-[0.12em] text-ink-soft ${
          small ? "px-2.5 py-1 text-[10.5px]" : "px-3 py-1 text-xs"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
