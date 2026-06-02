const stats = [
  { value: "22+", label: "Years of practice" },
  { value: "5", label: "Specialist doctors" },
  { value: "1,200+", label: "Patients cared for" },
  { value: "4.9", label: "Average rating" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-ink-100 bg-mist-100/50">
      <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-ink-700/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
