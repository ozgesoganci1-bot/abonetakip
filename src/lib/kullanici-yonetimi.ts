// KULLANICI YÖNETİMİ ÇEKİRDEĞİ (Gün 14)
//
// cac-ayari.ts ve pasife-alma.ts ile aynı yapıdadır: asıl mantık burada, sunucu
// işlemi (app/(panel)/kullanicilar/actions.ts) yalnızca oturumu okur, bu
// fonksiyonları çağırır ve sayfayı yeniler. Kullanıcıyı ve veritabanı nesnesini
// PARAMETRE olarak aldığı için testlerden doğrudan çağrılabilir
// (kullanici-yonetimi.test.ts).
//
// Kurallar:
//   - Yalnızca manager kullanıcı ekleyebilir. Eklenen kullanıcı HER ZAMAN finance
//     olur: rol formdan okunmaz, burada sabit yazılır.
//   - tenantId formdan gelmez. Hangi firmaya yazılacağını "db" (getTenantDb)
//     belirler; tenant.ts ekleme sırasında tenantId'yi oturumdaki değerle ezer.
//   - E-posta bütün sistemde benzersizdir (schema.prisma: email @unique). Önceden
//     arama YAPILMAZ: kiracı filtresi yüzünden arama yalnızca kendi firmayı görür ve
//     başka firmadaki kaydı kaçırırdı. Asıl kontrol veritabanının kendisidir: tekrar
//     eden kayıt hatası (P2002) yakalanır ve kayıt formundaki mesajın aynısı gösterilir.
//     Bu mesaj, e-postanın başka bir firmada kayıtlı olduğunu da belli eder
//     (ADR: B11, kullanıcı eklemede de geçerli).
//   - Parola bcrypt ile özetlenir (auth.ts, parolaOzetle). Hata durumunda forma geri
//     gönderilmez ve hiçbir yerde loglanmaz.
//   - Yeni kullanıcı için oturum AÇILMAZ; manager kendi oturumunda kalır.
//   - Kapsam dışı: silme, rol değiştirme, pasife alma, parola sıfırlama, davet e-postası.

import type { Role } from "../../generated/prisma/enums";
import { parolaOzetle, type AktifKullanici } from "./auth";
import type { TenantDb } from "./tenant";
import { yoneticiMi } from "./yetki";
import { kullaniciGirdisiniDogrula } from "./validation";
import { MESAJ, tekrarEdenKayitMi, type FormDurumu } from "./islem";

// Kayıt formundaki mesajın aynısı (src/lib/auth.ts, kayitOl).
export const EPOSTA_KAYITLI = "Bu e-posta adresiyle zaten bir hesap var.";

// Çekirdeğin kullanıcıdan ihtiyaç duyduğu bilgiler. tenantId yalnızca TypeScript
// istediği için verilir (musteriler/actions.ts ile aynı); asıl filtre "db" içindedir.
type IslemYapan = Pick<AktifKullanici, "role" | "tenantId">;

// Listede gösterilen bilgiler. Parola özeti BİLEREK yoktur.
export type KullaniciSatiri = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
};

// Firmanın kullanıcılarını eklenme sırasına göre listeler.
// Kiracı filtresi yüzünden yalnızca oturumdaki firmanın kullanıcıları gelir.
// Rol kontrolü sayfada yapılır (requireManager); finance bu listeyi hiç görmez.
export async function kullanicilariListele(db: TenantDb): Promise<KullaniciSatiri[]> {
  return db.user.findMany({
    orderBy: [{ createdAt: "asc" }, { email: "asc" }],
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

// Firmaya yeni bir finance kullanıcısı ekler. YALNIZCA manager yapabilir.
// girdiler: formdan gelen ham değerler (formData.get(...)). Burada doğrulanır.
export async function kullaniciEkleCekirdek(
  kullanici: IslemYapan,
  db: TenantDb,
  girdiler: { adSoyad: unknown; eposta: unknown; parola: unknown }
): Promise<FormDurumu> {
  // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
  if (!yoneticiMi(kullanici.role)) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  // Hata olursa form bu değerlerle yeniden doldurulur. PAROLA BİLEREK YOK.
  const degerler = {
    adSoyad: typeof girdiler.adSoyad === "string" ? girdiler.adSoyad : "",
    eposta: typeof girdiler.eposta === "string" ? girdiler.eposta : "",
  };

  // 2) Girdi doğrulama (sunucuda). E-posta kırpılır ve küçük harfe çevrilir.
  const sonuc = kullaniciGirdisiniDogrula(girdiler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { adSoyad, eposta, parola } = sonuc.deger;

  // 3) Parola özetlenir ve kullanıcı eklenir. Rol sabit: finance.
  try {
    const passwordHash = await parolaOzetle(parola);
    await db.user.create({
      // tenantId yalnızca TypeScript istediği için yazılır ve OTURUMDAN gelir.
      // tenant.ts bu değeri zaten oturumdaki değerle zorla üzerine yazar.
      data: {
        tenantId: kullanici.tenantId,
        name: adSoyad,
        email: eposta,
        passwordHash,
        role: "finance",
      },
      select: { id: true },
    });
  } catch (hata) {
    // Aynı e-posta bu firmada ya da başka bir firmada kayıtlı.
    if (tekrarEdenKayitMi(hata)) {
      return {
        durum: "hata",
        mesaj: MESAJ.formHatali,
        alanHatalari: { eposta: EPOSTA_KAYITLI },
        degerler,
      };
    }
    // Ayrıntı kullanıcıya gösterilmez. Hata nesnesi ve girdiler loglanmaz.
    console.error("Kullanıcı eklenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  // Başarılı eklemede "degerler" dönülmez: form boşalır, yeni kayda hazır olur.
  return {
    durum: "basarili",
    mesaj: `"${adSoyad}" finans rolüyle eklendi. Giriş bilgilerini kendisine güvenli bir yoldan iletin.`,
  };
}