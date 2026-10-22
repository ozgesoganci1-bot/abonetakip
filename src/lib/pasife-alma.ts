// PASİFE ALMA İŞLEMLERİNİN ÇEKİRDEĞİ (Gün 6)
//
// Müşteri ve plan pasife alma işlemlerinin asıl mantığı burada durur:
// rol kontrolü, kimlik kontrolü, kaydın bulunması, aktif abonelik kontrolü ve güncelleme.
// musteriler/actions.ts ve planlar/actions.ts içindeki sunucu işlemleri yalnızca
// oturumu okur, buradaki fonksiyonu çağırır ve sayfaları yeniler.
//
// Neden ayrıldı? Sunucu işlemleri oturumu çerezden okur ve çerez yalnızca bir
// Next.js isteği içinde vardır. Buradaki fonksiyonlar kullanıcıyı ve veritabanı
// nesnesini PARAMETRE olarak aldığı için testlerden doğrudan çağrılabilir.
// Böylece "finance pasife alamaz" kuralı otomatik testle kontrol edilir.
//
// Uygulamada parametreler her zaman oturumdan gelir, formdan asla gelmez:
//   kullanici -> requireUser()
//   db        -> getTenantDb()  (tenantId filtresi otomatik)
//
// Mesajlar ve kontrol sırası Gün 4-5'teki hâliyle birebir aynıdır.

import type { AktifKullanici } from "./auth";
import type { TenantDb } from "./tenant";
import { yoneticiMi } from "./yetki";
import { kimlikDogrula } from "./validation";
import { aktifAbonelikVarMi } from "./abonelik-kontrol";
import { MESAJ, type FormDurumu } from "./islem";

// Çekirdeğin kullanıcıdan ihtiyaç duyduğu tek bilgi rolüdür.
// Hangi firmanın verisine dokunulacağını "db" belirler.
type IslemYapan = Pick<AktifKullanici, "role">;

// Müşteriyi pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
// idGirdisi: formdan gelen ham değer (formData.get("id")). Burada doğrulanır.
export async function musteriPasifeAlCekirdek(
  kullanici: IslemYapan,
  db: TenantDb,
  idGirdisi: unknown
): Promise<FormDurumu> {
  // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
  if (!yoneticiMi(kullanici.role)) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  // 2) Kimlik biçimi bozuksa neyin yanlış olduğu söylenmez: "bulunamadı".
  const kimlik = kimlikDogrula(idGirdisi);
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  // 3) Kayıt bu firmada var mı? Başka firmanın kaydı tenant filtresi yüzünden eşleşmez.
  const musteri = await db.customer.findFirst({
    where: { id: kimlik.deger },
    select: { isActive: true },
  });
  if (!musteri) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }
  if (!musteri.isActive) {
    return { durum: "hata", mesaj: "Bu müşteri zaten pasif." };
  }

  // 4) Aktif aboneliği olan müşteri pasife alınamaz (bkz. abonelik-kontrol.ts).
  //    Aynı "db" verilir: sayım da aynı firmayla sınırlı kalır.
  if (await aktifAbonelikVarMi({ musteriId: kimlik.deger }, db)) {
    return {
      durum: "hata",
      mesaj:
        "Bu müşterinin aktif aboneliği var. Önce aboneliği iptal edin, sonra müşteriyi pasife alın.",
    };
  }

  // 5) Güncelleme. Koşulda isActive: true olduğu için çift tıklamada ikinci istek 0 satır etkiler.
  try {
    const sonucSatir = await db.customer.updateMany({
      where: { id: kimlik.deger, isActive: true },
      data: { isActive: false },
    });
    if (sonucSatir.count === 0) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi };
    }
  } catch {
    console.error("Müşteri pasife alınırken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen };
  }

  return { durum: "basarili", mesaj: "Müşteri pasife alındı." };
}

// Planı pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
// idGirdisi: formdan gelen ham değer (formData.get("id")). Burada doğrulanır.
export async function planPasifeAlCekirdek(
  kullanici: IslemYapan,
  db: TenantDb,
  idGirdisi: unknown
): Promise<FormDurumu> {
  // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
  if (!yoneticiMi(kullanici.role)) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  // 2) Kimlik biçimi bozuksa neyin yanlış olduğu söylenmez: "bulunamadı".
  const kimlik = kimlikDogrula(idGirdisi);
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  // 3) Kayıt bu firmada var mı? Başka firmanın kaydı tenant filtresi yüzünden eşleşmez.
  const plan = await db.plan.findFirst({
    where: { id: kimlik.deger },
    select: { isActive: true },
  });
  if (!plan) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }
  if (!plan.isActive) {
    return { durum: "hata", mesaj: "Bu plan zaten pasif." };
  }

  // 4) Aktif aboneliği olan plan pasife alınamaz (bkz. abonelik-kontrol.ts).
  if (await aktifAbonelikVarMi({ planId: kimlik.deger }, db)) {
    return {
      durum: "hata",
      mesaj:
        "Bu planın aktif abonelikleri var. Önce abonelikleri iptal edin, sonra planı pasife alın.",
    };
  }

  // 5) Güncelleme. Koşulda isActive: true olduğu için çift tıklamada ikinci istek 0 satır etkiler.
  try {
    const sonucSatir = await db.plan.updateMany({
      where: { id: kimlik.deger, isActive: true },
      data: { isActive: false },
    });
    if (sonucSatir.count === 0) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi };
    }
  } catch {
    console.error("Plan pasife alınırken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen };
  }

  return { durum: "basarili", mesaj: "Plan pasife alındı." };
}