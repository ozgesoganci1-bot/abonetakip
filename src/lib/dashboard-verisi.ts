// DASHBOARD VERİSİ (Gün 9)
//
// Dashboard sayfasının ihtiyaç duyduğu her şeyi tek fonksiyonda hazırlar:
//   1. Abonelikleri plan bilgisiyle okur (tenant filtresi otomatik).
//   2. Gün 8'deki AbonelikGirdisi biçimine çevirir.
//   3. Hesabı metrikler.ts'e bırakır: metrikOzeti ve ayHareketi.
// Burada formül YOKTUR; sayfada da yoktur. Olay tablosu (SUBSCRIPTION_EVENTS)
// kullanılmaz: churn ve hareket, aboneliklerin startedAt/canceledAt tarihlerinden
// hesaplanır (ADR kararı, Gün 9 onayı).
//
// db parametre olarak alınır (pasife-alma.ts gibi): uygulamada getTenantDb(),
// testte tenantaBagliDb(). Böylece kiracı izolasyonu otomatik testle kontrol edilir.
//
// Not: Firmanın bütün abonelikleri belleğe okunur. Küçük yazılım firmaları için
// (yüzlerce abonelik) sorun değildir; kapsam dışı bir büyüme olursa yeniden ele alınır.

import type { TenantDb } from "./tenant";
import {
  type AbonelikGirdisi,
  type AyHareketi,
  type MetrikOzeti,
  ayAraligi,
  ayHareketi,
  metrikOzeti,
  turkiyeAyi,
} from "./metrikler";

export type DashboardVerisi = {
  yil: number; // Türkiye saatine göre içinde bulunulan yıl
  ay: number; // 1-12
  aboneVarMi: boolean; // firmada hiç abonelik (iptal edilmişler dahil) var mı?
  cacGirildiMi: boolean; // CAC 0'dan büyük mü?
  ozet: MetrikOzeti;
  hareket: AyHareketi;
};

// simdi: hesabın yapıldığı an. Uygulamada verilmez (şu an kullanılır);
// testler belirli bir an verebilir.
export async function dashboardVerisiniGetir(
  db: TenantDb,
  simdi: Date = new Date()
): Promise<DashboardVerisi> {
  const [kayitlar, firma] = await Promise.all([
    db.subscription.findMany({
      select: {
        customerId: true,
        status: true,
        startedAt: true,
        canceledAt: true,
        plan: { select: { price: true, interval: true } },
      },
    }),
    db.tenant.findFirst({ select: { cac: true } }),
  ]);

  // Prisma kaydından metriklerin beklediği düz biçime çeviri (hesap yok).
  const abonelikler: AbonelikGirdisi[] = kayitlar.map((k) => ({
    customerId: k.customerId,
    fiyat: k.plan.price,
    aralik: k.plan.interval,
    status: k.status,
    startedAt: k.startedAt,
    canceledAt: k.canceledAt,
  }));

  const cac = firma?.cac ?? 0;
  const { yil, ay } = turkiyeAyi(simdi);
  const buAy = ayAraligi(yil, ay);

  return {
    yil,
    ay,
    aboneVarMi: abonelikler.length > 0,
    cacGirildiMi: cac > 0,
    ozet: metrikOzeti(abonelikler, buAy, cac),
    hareket: ayHareketi(abonelikler, buAy),
  };
}