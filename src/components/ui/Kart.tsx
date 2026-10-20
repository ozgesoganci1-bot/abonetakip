import type { HTMLAttributes } from "react";

// Beyaz, ince kenarlıklı, hafif gölgeli içerik kutusu
export default function Kart({
  className = "",
  ...diger
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
      {...diger}
    />
  );
}