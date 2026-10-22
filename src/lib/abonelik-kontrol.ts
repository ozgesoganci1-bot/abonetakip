// AKTİF ABONELİK KONTROLÜ
//
// Bir müşteri veya plan pasife alınmadan önce ve aktif aboneliği olan bir planın
// fiyatı veya aralığı değiştirilmek istendiğinde bu fonksiyon çağrılır.
// Bu kontrolün yapıldığı TEK yer burasıdır.
//
// Sorgu tenant filtresinden geçen veritabanı nesnesiyle yapılır. "count" işlemi
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
// Pasife alma "önce kontrol et, sonra güncelle" şeklinde iki adımdır. Pasife alma
// ile abonelik başlatma TAM AYNI ANDA gelirse, ikisi de birbirinin değişikliğini
// göremeden tamamlanabilir ve küçük bir pencere kalır. Bunu tamamen kapatmak satır
// kilidi (SELECT ... FOR UPDATE) gerektirir; o da ham SQL demektir ve projede ham
// SQL yasaktır (bkz. tenant.ts). Bu risk bilinçli olarak kabul edilmiştir.

import { getTenantDb, type TenantDb } from "./tenant";

type Hedef = { musteriId: string } | { planId: string };

// Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
export async function aktifAbonelikVarMi(
  hedef: Hedef,
  db?: TenantDb
): Promise<boolean> {
  const veritabani = db ?? (await getTenantDb());

  const kosul =
    "musteriId" in hedef
      ? { customerId: hedef.musteriId }
      : { planId: hedef.planId };

  const sayi = await veritabani.subscription.count({
    where: { ...kosul, status: "ACTIVE" },
  });

  return sayi > 0;
}