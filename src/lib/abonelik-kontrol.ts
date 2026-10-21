// AKTİF ABONELİK KONTROLÜ
//
// Bir müşteri veya plan pasife alınmadan önce ve aktif aboneliği olan bir planın
// fiyatı veya aralığı değiştirilmek istendiğinde bu fonksiyon çağrılır.
// Bu kontrolün yapıldığı TEK yer burasıdır.
//
// Sorgu getTenantDb() üzerinden yapılır. "count" işlemi tenant.ts içindeki OKUMA
// listesinde olduğu için filtreye tenantId otomatik eklenir: başka firmanın
// abonelikleri hiçbir zaman sayılmaz.
//
// Abonelikler Gün 5'te yazılacak. O zamana kadar tablo boş olduğu için sonuç
// her zaman "yok" (false) çıkar.
//
// GÜN 5 NOTU:
// - Abonelik BAŞLATILIRKEN müşterinin ve planın isActive=true olduğu kontrol edilmeli.
//   Pasife alma "önce kontrol et, sonra güncelle" şeklinde iki adımdır. Aynı anda biri
//   pasife alırken diğeri abonelik başlatırsa pasif kayda aktif abonelik bağlanabilir.
//   Abonelik başlatmadaki isActive kontrolü bu açığı karşı taraftan kapatır.
// - Aynı kısa pencere plan fiyatı değiştirilirken de vardır. Gün 5'te abonelik
//   başlatma ve bu kontrol aynı veritabanı işlemi (transaction) içinde düşünülebilir.

import { getTenantDb } from "./tenant";

type Hedef = { musteriId: string } | { planId: string };

// Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
export async function aktifAbonelikVarMi(hedef: Hedef): Promise<boolean> {
  const db = await getTenantDb();

  const kosul =
    "musteriId" in hedef
      ? { customerId: hedef.musteriId }
      : { planId: hedef.planId };

  const sayi = await db.subscription.count({
    where: { ...kosul, status: "ACTIVE" },
  });

  return sayi > 0;
}