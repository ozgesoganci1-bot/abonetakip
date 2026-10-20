import type { ButtonHTMLAttributes } from "react";

// Düğme görünümleri: birincil (ana işlem), ikincil (vazgeç/geri), tehlike (silme/iptal)
type Gorunum = "birincil" | "ikincil" | "tehlike";

type DugmeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  gorunum?: Gorunum;
  tamGenislik?: boolean;
};

const temel =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const gorunumler: Record<Gorunum, string> = {
  birincil: "bg-indigo-600 text-white hover:bg-indigo-700",
  ikincil: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  tehlike: "bg-red-600 text-white hover:bg-red-700",
};

export default function Dugme({
  gorunum = "birincil",
  tamGenislik = false,
  className = "",
  type = "button", // Form gönderen düğmelerde type="submit" açıkça yazılmalı
  ...diger
}: DugmeProps) {
  const sinif = [temel, gorunumler[gorunum], tamGenislik ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={sinif} {...diger} />;
}