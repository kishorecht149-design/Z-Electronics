export default function Loading() {
  return (
    <div className="page-shell py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}
