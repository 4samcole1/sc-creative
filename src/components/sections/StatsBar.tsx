// src/components/sections/StatsBar.tsx
export default function TrustBar() {
  return (
    <div className="bg-white py-14 border-b border-gray-100">
      <div className="max-w-[1500px] mx-auto px-8">
        <p className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-10">
          Trusted by Businesses Across Industries
        </p>
        <div className="flex items-center justify-center gap-14">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              data-logo-slot
              className="h-8 w-32 bg-gray-200/60 rounded-md opacity-40 hover:opacity-60 transition-opacity"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
