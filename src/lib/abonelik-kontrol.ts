// ABONELİK KONTROLLERİ
//
// İki kontrol vardır, ikisi de bu dosyadadır. Bu kontrollerin yapıldığı TEK yer burasıdır.
//
// 1) aktifAbonelikVarMi: hedefin ACTIVE durumda aboneliği var mı?
//    Bir müşteri veya plan pasife alınmadan önce çağrılır.
//
// 2) abonelikVarMi (Gün 11): hedefe bağlı HERHANGİ bir abonelik var mı (iptal edilmişler dahil)?
//    Bir planın fiyatı veya aralığı değiştirilmek istendiğinde çağrılır.
//    Neden aktif değil de herhangi biri? Abonelikte fiyat kopyası yoktur; MRR ve aylık
//    MRR grafiği planın ŞU ANKİ fiyatından hesaplanır. İptal edilmiş bir abonelik de
//    geçmişte aktif olduğu aylarda grafiğe girer. Fiyat değişirse o aylar da değişir.
//    (docs/02_ADR.md, Gün 11, K11.1)
//
// Sorgular tenant filtresinden geçen veritabanı nesnesiyle yapılır. "count" işlemi
// tenant.ts içindeki OKUMA listesinde olduğu için filtreye tenantId otomatik
// eklenir: başka firmanın abonelikleri hiçbir zaman sayılmaz.
//
// Gün 6: İsteğe bağlı ikinci parametre "db" eklendi.
// - Verilirse o nesne kullanılır (pasife-alma.ts ve testler). Bu nesne de
//   tenant filtresinden geçen bir nesnedir (TenantDb).
// - Verilmezse eskisi gibi oturumdan alınır (getTenantDb). Mevcut çağrılar değişmedi.
//
// DURUM (Gün 5): Abonelikler artık oluşturuluyor (bkz. abonelikler/actions.ts),
// bu yüzden kontrol gerçek veriyle çalışır.
//
// Pasif kayda aktif abonelik bağlanmasını engelleyen karşı taraf:
// - abonelikBaslat, abonelik kaydını yazdıktan sonra AYNI veritabanı işleminde
//   müşterinin ve planın hâlâ isActive=true olduğunu yeniden doğrular. Değilse
//   işlem geri alınır.
//
// BİLİNEN SINIR (docs/02_ADR.md'de de yazılıdır):
// Pasife alma ve fiyat değiştirme "önce kontrol et, sonra güncelle" şeklinde iki adımdır.
// Bu işlemlerden biri ile abonelik başlatma TAM AYNI ANDA gelirse, ikisi de birbirinin
// değişikliğini göremeden tamamlanabilir ve küçük bir pencere kalır. Bunu tamamen
// kapatmak satır kilidi (SELECT ... FOR UPDATE) gerektirir; o da ham SQL demektir ve
// projede ham SQL yasaktır (bkz. tenant.ts). Bu risk bilinçli olarak kabul edilmiştir.

import { getTenantDb, type TenantDb } from "./tenant";

type Hedef = { musteriId: string } | { planId: string };

// Hedefe göre sorgu koşulu: müşteri kimliği ya da plan kimliği.
function hedefKosulu(hedef: Hedef) {
  return "musteriId" in hedef
    ? { customerId: hedef.musteriId }
    : { planId: hedef.planId };
}

// Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
// Pasife almada kullanılır.
export async function aktifAbonelikVarMi(
  hedef: Hedef,
  db?: TenantDb
): Promise<boolean> {
  const veritabani = db ?? (await getTenantDb());

  const sayi = await veritabani.subscription.count({
    where: { ...hedefKosulu(hedef), status: "ACTIVE" },
  });

  return sayi > 0;
}

// Verilen müşteriye veya plana bağlı, durumu ne olursa olsun bir abonelik var mı?
// Plan fiyatı ve aralığı kilidinde kullanılır (Gün 11).
export async function abonelikVarMi(
  hedef: Hedef,
  db?: TenantDb
): Promise<boolean> {
  const veritabani = db ?? (await getTenantDb());

  const sayi = await veritabani.subscription.count({
    where: hedefKosulu(hedef),
  });

  return sayi > 0;
}