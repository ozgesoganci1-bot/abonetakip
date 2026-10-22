import type { ReactNode } from "react";

// Küçük durum etiketi: "Yönetici", "Finans", "Aktif", "Dikkat" gibi.
// Not: Anlam yalnızca renge bırakılmaz; etiketin metni (ve gerekirse simgesi) her zaman yazılır.
type Ton = "gri" | "indigo" | "yesil" | "kirmizi" | "sari";

type RozetProps = {
  ton?: Ton;
  children: ReactNode;
};

const tonlar: Record<Ton, string> = {
  gri: "bg-slate-100 text-slate-700",
  indigo: "bg-indigo-50 text-indigo-700",
  yesil: "bg-emerald-50 text-emerald-700",
  kirmizi: "bg-red-50 text-red-700",
  sari: "bg-amber-50 text-amber-800",
};

export default function Rozet({ ton = "gri", children }: RozetProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tonlar[ton]}`}
    >
      {children}
    </span>
  );
}