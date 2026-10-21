"use server";

// MÜŞTERİ SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
//
// Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
// yetki kontrolü her işlemin KENDİ İÇİNDE yapılır; düğmeyi gizlemek yetmez.
// Bütün sorgular getTenantDb() üzerinden yapılır, tenantId otomatik eklenir.
// Başka firmanın kaydı hiçbir sorguda eşleşmez, sonuç "Kayıt bulunamadı." olur.
//
// DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
// yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
// bloklarının DIŞINDA tutulur.

import { revalidatePath } from "next/cache";
import { requireManager, requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula, musteriGirdisiniDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
import {
  MESAJ,
  formMetni,
  tekrarEdenKayitMi,
  type FormDurumu,
} from "@/lib/islem";

const EPOSTA_TEKRAR =
  "Bu e-posta adresi başka bir müşteride kayıtlı (pasif müşteriler dahil).";

// Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
function formDegerleri(formData: FormData) {
  return {
    ad: formMetni(formData, "ad"),
    eposta: formMetni(formData, "eposta"),
  };
}

// Bu firmada aynı e-postayı kullanan başka bir müşteri var mı?
// Kullanıcıya anlaşılır mesaj vermek için önceden bakılır. Asıl garanti
// veritabanındaki @@unique([tenantId, email]) kuralıdır.
// haricId: düzenlemede kaydın kendisi sayılmasın diye.
async function epostaKullaniliyorMu(
  eposta: string | null,
  haricId?: string
): Promise<boolean> {
  if (!eposta) return false;
  const db = await getTenantDb();
  const mevcut = await db.customer.findFirst({
    where: {
      email: eposta,
      ...(haricId ? { id: { not: haricId } } : {}),
    },
    select: { id: true },
  });
  return mevcut !== null;
}

// Yeni müşteri ekler. manager ve finance yapabilir.
export async function musteriEkle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();
  const degerler = formDegerleri(formData);

  const sonuc = musteriGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, eposta } = sonuc.deger;

  if (await epostaKullaniliyorMu(eposta)) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: { eposta: EPOSTA_TEKRAR },
      degerler,
    };
  }

  const db = await getTenantDb();
  try {
    await db.customer.create({
      // tenantId burada yalnızca TypeScript'in istediği alan olduğu için yazılır
      // ve OTURUMDAN gelir, formdan değil. tenant.ts uzantısı bu değeri zaten
      // oturumdaki değerle zorla üzerine yazar.
      data: { tenantId: kullanici.tenantId, name: ad, email: eposta },
    });
  } catch (hata) {
    // İki kişi aynı anda aynı e-postayı eklerse veritabanı engeller.
    if (tekrarEdenKayitMi(hata)) {
      return {
        durum: "hata",
        mesaj: MESAJ.formHatali,
        alanHatalari: { eposta: EPOSTA_TEKRAR },
        degerler,
      };
    }
    console.error("Müşteri eklenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/musteriler");
  // Başarılı eklemede "degerler" dönülmez: form boşalır, yeni kayda hazır olur.
  return { durum: "basarili", mesaj: `"${ad}" müşterisi eklendi.` };
}

// Müşteri bilgilerini günceller. manager ve finance yapabilir.
export async function musteriGuncelle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  await requireUser();
  const degerler = formDegerleri(formData);

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  const sonuc = musteriGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, eposta } = sonuc.deger;

  if (await epostaKullaniliyorMu(eposta, kimlik.deger)) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: { eposta: EPOSTA_TEKRAR },
      degerler,
    };
  }

  const db = await getTenantDb();
  let guncellenenSayisi: number;
  try {
    // updateMany: kayıt bu firmaya ait değilse hata fırlatmaz, 0 satır döner.
    const sonucSatir = await db.customer.updateMany({
      where: { id: kimlik.deger },
      data: { name: ad, email: eposta },
    });
    guncellenenSayisi = sonucSatir.count;
  } catch (hata) {
    if (tekrarEdenKayitMi(hata)) {
      return {
        durum: "hata",
        mesaj: MESAJ.formHatali,
        alanHatalari: { eposta: EPOSTA_TEKRAR },
        degerler,
      };
    }
    console.error("Müşteri güncellenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  // Kayıt yok ya da başka firmaya ait: ikisinde de aynı cevap.
  if (guncellenenSayisi === 0) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  revalidatePath("/musteriler");
  revalidatePath(`/musteriler/${kimlik.deger}`);
  return {
    durum: "basarili",
    mesaj: "Değişiklikler kaydedildi.",
    degerler: { ad, eposta: eposta ?? "" },
  };
}

// Müşteriyi pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
export async function musteriPasifeAl(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Sunucu tarafı yetki kontrolü: finance kullanıcısı için null döner.
  const yonetici = await requireManager();
  if (!yonetici) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  const db = await getTenantDb();
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

  // Aktif aboneliği olan müşteri pasife alınamaz (bkz. src/lib/abonelik-kontrol.ts).
  if (await aktifAbonelikVarMi({ musteriId: kimlik.deger })) {
    return {
      durum: "hata",
      mesaj:
        "Bu müşterinin aktif aboneliği var. Önce aboneliği iptal edin, sonra müşteriyi pasife alın.",
    };
  }

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

  revalidatePath("/musteriler");
  revalidatePath(`/musteriler/${kimlik.deger}`);
  return { durum: "basarili", mesaj: "Müşteri pasife alındı." };
}