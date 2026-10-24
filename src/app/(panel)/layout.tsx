import { requireUser } from "@/lib/auth";
import { cikisAction } from "@/app/(auth)/actions";
import Dugme from "@/components/ui/Dugme";
import Rozet from "@/components/ui/Rozet";
import MenuBaglantisi from "./MenuBaglantisi";
import UyariDinleyici from "./UyariDinleyici";

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
// Masaüstünde sol kenar menü, küçük ekranda üstte yatay menü gösterilir.
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kullanici = await requireUser();
  const menu = MENU.filter(
    (oge) => !oge.sadeceManager || kullanici.role === "manager"
  );
  const yonetici = kullanici.role === "manager";
  const gorunenAd = kullanici.adSoyad ?? kullanici.eposta;

  return (
    <div className="min-h-screen md:flex">
      {/* Masaüstü: sol kenar menü */}
      <aside className="hidden border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="border-b border-slate-100 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            AboneTakip
          </p>
          <p className="mt-1 truncate text-base font-semibold text-slate-900">
            {kullanici.firmaAdi}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <MenuBaglantisi menu={menu} yon="dikey" />
        </nav>

        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-sm font-medium text-slate-900">
            {gorunenAd}
          </p>
          <div className="mt-1">
            <Rozet ton={yonetici ? "indigo" : "gri"}>
              {yonetici ? "Yönetici" : "Finans"}
            </Rozet>
          </div>
          <form action={cikisAction} className="mt-3">
            <Dugme type="submit" gorunum="ikincil" tamGenislik>
              Çıkış yap
            </Dugme>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        {/* Küçük ekran: üst çubuk ve yatay menü */}
        <header className="border-b border-slate-200 bg-white md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                AboneTakip
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {kullanici.firmaAdi}
              </p>
            </div>
            <form action={cikisAction}>
              <Dugme type="submit" gorunum="ikincil">
                Çıkış yap
              </Dugme>
            </form>
          </div>
          <nav className="overflow-x-auto px-3 pb-3">
            <MenuBaglantisi menu={menu} yon="yatay" />
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
          <UyariDinleyici />
          {children}
        </main>
      </div>
    </div>
  );
}