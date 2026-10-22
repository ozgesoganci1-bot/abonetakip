// CAC AYARI KAYDETME ÇEKİRDEĞİ (Gün 9)
//
// pasife-alma.ts ile aynı yapıdadır: asıl mantık burada, sunucu işlemi
// (app/(panel)/ayarlar/actions.ts) yalnızca oturumu okur, bu fonksiyonu çağırır
// ve sayfaları yeniler.
// Kullanıcıyı ve veritabanı nesnesini PARAMETRE olarak aldığı için testlerden
// doğrudan çağrılabilir. Böylece "finance CAC'yi değiştiremez" kuralı otomatik
// testle kontrol edilir (cac-ayari.test.ts).
//
// Uygulamada parametreler her zaman oturumdan gelir, formdan asla gelmez:
//   kullanici -> requireUser()
//   db        -> getTenantDb()  (tenantId filtresi otomatik)
// Hangi firmanın CAC'sinin değişeceğini YALNIZCA "db" belirler. Formda firma
// kimliği yoktur. tenant.ts ayrıca Tenant güncellemesinde "id" koşulunu oturumdaki
// değerle ezer; yani iki katmanlı koruma vardır.

import type { AktifKullanici } from "./auth";
import type { TenantDb } from "./tenant";
import { yoneticiMi } from "./yetki";
import { cacDogrula } from "./validation";
import { MESAJ, type FormDurumu } from "./islem";

// Çekirdeğin kullanıcıdan ihtiyaç duyduğu tek bilgi rolüdür.
type IslemYapan = Pick<AktifKullanici, "role">;

// CAC değerini kaydeder. YALNIZCA manager yapabilir.
// cacGirdisi: formdan gelen ham değer (formData.get("cac")). Burada doğrulanır.
// 0 kabul edilir ve "CAC girilmedi" anlamına gelir.
export async function cacKaydetCekirdek(
  kullanici: IslemYapan,
  db: TenantDb,
  cacGirdisi: unknown
): Promise<FormDurumu> {
  // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
  if (!yoneticiMi(kullanici.role)) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  // Hata olursa form, kullanıcının yazdığıyla yeniden doldurulur.
  const yazilan = typeof cacGirdisi === "string" ? cacGirdisi : "";

  // 2) Girdi doğrulama (sunucuda).
  const sonuc = cacDogrula(cacGirdisi);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: { cac: sonuc.hata },
      degerler: { cac: yazilan },
    };
  }

  // 3) Kendi firmasını bul ve güncelle. Tenant filtresi yüzünden findFirst
  //    yalnızca oturumdaki firmayı görebilir.
  try {
    const firma = await db.tenant.findFirst({ select: { id: true } });
    if (!firma) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi };
    }
    await db.tenant.update({
      where: { id: firma.id },
      data: { cac: sonuc.deger },
      select: { id: true },
    });
  } catch {
    // Ayrıntı kullanıcıya gösterilmez ve loglanmaz.
    console.error("CAC kaydedilirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler: { cac: yazilan } };
  }

  const mesaj =
    sonuc.deger === 0
      ? "CAC sıfırlandı. LTV/CAC oranı, CAC girilene kadar hesaplanmaz."
      : `CAC ${sonuc.deger.toLocaleString("tr-TR")} TL olarak kaydedildi.`;

  return { durum: "basarili", mesaj, degerler: { cac: String(sonuc.deger) } };
}