"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Menü bağlantıları. Bulunduğun sayfa indigo renkle vurgulanır.
// Bu bileşen tarayıcıda çalışır çünkü hangi sayfada olduğumuzu öğrenmesi gerekir.
type MenuOgesi = { href: string; etiket: string };

type MenuBaglantisiProps = {
  menu: MenuOgesi[];
  yon: "dikey" | "yatay"; // dikey: sol kenar menü, yatay: küçük ekranda üst menü
};

export default function MenuBaglantisi({ menu, yon }: MenuBaglantisiProps) {
  const yol = usePathname() ?? "";
  const kapsayici = yon === "dikey" ? "flex flex-col gap-1" : "flex w-max gap-1";

  return (
    <div className={kapsayici}>
      {menu.map((oge) => {
        const aktif = yol === oge.href || yol.startsWith(`${oge.href}/`);
        const renk = aktif
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

        return (
          <Link
            key={oge.href}
            href={oge.href}
            aria-current={aktif ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${renk}`}
          >
            {oge.etiket}
          </Link>
        );
      })}
    </div>
  );
}