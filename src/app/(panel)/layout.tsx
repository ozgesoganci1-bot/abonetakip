import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { cikisAction } from "@/app/(auth)/actions";

// Menü bağlantıları. "sadeceManager" olanlar finance kullanıcısına gösterilmez.
// DİKKAT: Menüde bir bağlantıyı gizlemek yetki kontrolü DEĞİLDİR.
// Asıl kontrol, ilgili sayfanın kendi içinde sunucuda yapılır.
const MENU = [
  { href: "/dashboard", etiket: "Dashboard", sadeceManager: false },
  { href: "/musteriler", etiket: "Müşteriler", sadeceManager: false },
  { href: "/planlar", etiket: "Planlar", sadeceManager: false },
  { href: "/abonelikler", etiket: "Abonelikler", sadeceManager: false },
  { href: "/ayarlar", etiket: "Ayarlar", sadeceManager: true },
  { href: "/kullanicilar", etiket: "Kullanıcılar", sadeceManager: true },
];

// Panel çerçevesi. Giriş yapmamış kullanıcı giriş sayfasına yönlendirilir.
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kullanici = await requireUser();
  const menu = MENU.filter(
    (oge) => !oge.sadeceManager || kullanici.role === "manager"
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-semibold">{kullanici.firmaAdi}</p>
            <p className="text-xs text-gray-500">
              {kullanici.adSoyad ?? kullanici.eposta} ·{" "}
              {kullanici.role === "manager" ? "Yönetici" : "Finans"}
            </p>
          </div>

          <form action={cikisAction}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              Çıkış yap
            </button>
          </form>
        </div>

        <nav className="mx-auto flex max-w-5xl flex-wrap gap-1 px-4 pb-2 text-sm">
          {menu.map((oge) => (
            <Link
              key={oge.href}
              href={oge.href}
              className="rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-100"
            >
              {oge.etiket}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}