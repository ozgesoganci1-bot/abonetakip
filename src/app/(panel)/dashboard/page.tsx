import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { yoneticiMi } from "@/lib/yetki";
import { dashboardVerisiniGetir } from "@/lib/dashboard-verisi";
import { ltvCacSaglikliMi } from "@/lib/metrikler";
import { riskliAbonelikler } from "@/lib/riskli-abonelikler";
import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "@/lib/bicim";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";
import Kart from "@/components/ui/Kart";
import Rozet from "@/components/ui/Rozet";
import KpiKarti from "./KpiKarti";

// KPI DASHBOARD (Gün 9)
// Bu sayfada hesap YOKTUR. Sayılar dashboard-verisi.ts -> metrikler.ts zincirinden gelir,
// burada yalnızca biçimlenir ve yerleştirilir.
// manager ve finance ikisi de görür. Fark: CAC girilmemişse yalnızca manager'a
// Ayarlar bağlantısı gösterilir (CAC'yi yalnızca manager değiştirebilir).

const linkSinifi =
  "font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900";

// Tarihler UTC saklanır, ekranda Türkiye saatine göre gösterilir.
const TARIH = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeZone: "Europe/Istanbul",
});

export default async function DashboardSayfasi() {
  // Layout da giriş kontrolü yapar, ama Next.js layout ile sayfayı birbirinden
  // bağımsız çalıştırır. Bu yüzden her sayfa kendi kontrolünü de yapar.
  const kullanici = await requireUser();
  const db = await getTenantDb();
  // İki sorgu birbirine bağlı değil: paralel çalışır. İkisi de aynı tenant filtreli db'yi kullanır.
  const [veri, riskliler] = await Promise.all([
    dashboardVerisiniGetir(db),
    riskliAbonelikler(db),
  ]);

  const yonetici = yoneticiMi(kullanici.role);
  const donemAdi = ayEtiketi(veri.yil, veri.ay);
  const baslik = (
    <SayfaBasligi baslik="Dashboard" aciklama={`${kullanici.firmaAdi} • ${donemAdi}`} />
  );

  // Boş durum: firmada hiç abonelik yok.
  if (!veri.aboneVarMi) {
    return (
      <div>
        {baslik}
        <BosDurum
          baslik="Henüz abonelik yok, ilk aboneliği ekleyin"
          aciklama="Göstergeler, ilk abonelik başlatıldığında hesaplanmaya başlar."
        >
          <Link
            href="/abonelikler"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Abonelik ekle
          </Link>
        </BosDurum>
      </div>
    );
  }

  const { ozet, hareket } = veri;

  // LTV hesaplandığı hâlde LTV/CAC yoksa tek neden CAC'nin girilmemiş olmasıdır.
  // Mesaj role göre değişir: finance CAC'yi değiştiremez.
  const cacEksik = ozet.ltv !== null && !veri.cacGirildiMi;
  const ltvCacNedeni = cacEksik ? (
    yonetici ? (
      <>
        CAC girilmedi.{" "}
        <Link href="/ayarlar" className={linkSinifi}>
          Ayarlardan CAC girin
        </Link>
        .
      </>
    ) : (
      "CAC girilmedi. Firma yöneticisi Ayarlar'dan girebilir."
    )
  ) : (
    ozet.nedenler.ltvCac
  );

  // Sağlıklı / Dikkat etiketi: simge ve metin birlikte (anlam yalnızca renge bırakılmaz).
  const ltvCacDurumu =
    ozet.ltvCac === null ? undefined : ltvCacSaglikliMi(ozet.ltvCac) ? (
      <Rozet ton="yesil">
        <span aria-hidden="true">✓&nbsp;</span>Sağlıklı (3 ve üzeri)
      </Rozet>
    ) : (
      <Rozet ton="sari">
        <span aria-hidden="true">!&nbsp;</span>Dikkat (3&apos;ün altında)
      </Rozet>
    );

  // LTV kartında hesabın bileşenleri: elle kontrolü kolaylaştırır.
  const ltvBilesenleri =
    ozet.ltv !== null && ozet.arpu !== null && ozet.ortalamaOmurAy !== null
      ? `ARPU ${tlMetni(ozet.arpu)} × ortalama ömür ${sayiMetni(ozet.ortalamaOmurAy)} ay`
      : undefined;

  return (
    <div>
      {baslik}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiKarti
          baslik="MRR"
          donem="Bugün"
          deger={tlMetni(ozet.mrr)}
          aciklama="Her ay düzenli gelen abonelik geliri. Yıllık planlar 12'ye bölünerek eklenir."
        />
        <KpiKarti
          baslik="Aylık churn"
          donem="Ay başından bugüne"
          deger={ozet.churn !== null ? yuzdeMetni(ozet.churn) : null}
          neden={ozet.nedenler.churn}
          aciklama="Ay başındaki müşterilerden aboneliğini bırakanların oranı."
        />
        <KpiKarti
          baslik="LTV"
          donem="Ay başından bugüne"
          deger={ozet.ltv !== null ? tlMetni(ozet.ltv) : null}
          neden={ozet.nedenler.ltv}
          ekBilgi={ltvBilesenleri}
          aciklama="Bir müşterinin bizimle kaldığı süre boyunca getirmesi beklenen toplam gelir."
        />
        <KpiKarti
          baslik="LTV / CAC"
          donem="Ay başından bugüne"
          deger={ozet.ltvCac !== null ? sayiMetni(ozet.ltvCac) : null}
          neden={ltvCacNedeni}
          durum={ltvCacDurumu}
          aciklama="Müşteri kazanmak için harcanan her 1 TL'nin kaç TL geri döndüğü."
        />
      </div>

      <Kart className="mt-4">
        <h2 className="text-sm font-medium text-slate-600">Müşteri özeti</h2>
        <dl className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-slate-500">Aktif müşteri (bugün)</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
              {ozet.aktifMusteri}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Bu ay yeni (ay başından bugüne)</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
              {hareket.yeni}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Bu ay iptal (ay başından bugüne)</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
              {hareket.iptal}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Sayılar müşteri bazlıdır: ay içinde plan değiştiren müşteri ne yeni ne iptal
          sayılır.
        </p>
      </Kart>

      <Kart className="mt-4">
        <h2 className="text-sm font-medium text-slate-600">
          Riskli abonelikler ({riskliler.length})
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Dönem bitişine 7 günden az kalmış ve henüz yenilenmemiş aktif abonelikler.
        </p>

        {riskliler.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Riskli abonelik yok.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {riskliler.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {r.musteriAdi}
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.planAdi} · Dönem bitişi: {TARIH.format(r.bitis)}
                  </p>
                </div>
                {/* Anlam yalnızca renge bırakılmaz: simge + metin */}
                {r.etiket.gecmis ? (
                  <Rozet ton="kirmizi">
                    <span aria-hidden="true">✕&nbsp;</span>
                    {r.etiket.metin}
                  </Rozet>
                ) : (
                  <Rozet ton="sari">
                    <span aria-hidden="true">!&nbsp;</span>
                    {r.etiket.metin}
                  </Rozet>
                )}
              </li>
            ))}
          </ul>
        )}
      </Kart>
    </div>
  );
}