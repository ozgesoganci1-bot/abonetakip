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
//
// Gün 6: Pasife alma işleminin mantığı ve rol kontrolü src/lib/pasife-alma.ts
// dosyasına taşındı (otomatik test edilebilsin diye). Buradaki işlem yalnızca
// oturumu okur, çekirdeği çağırır ve sayfaları yeniler.

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula, musteriGirdisiniDogrula } from "@/lib/validation";
import { musteriPasifeAlCekirdek } from "@/lib/pasife-alma";
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
// Rol kontrolü ve asıl mantık src/lib/pasife-alma.ts içindedir.
export async function musteriPasifeAl(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
  // Giriş yapılmamışsa yönlendirme yapılır (try/catch dışında).
  const kullanici = await requireUser();
  const db = await getTenantDb();

  const sonuc = await musteriPasifeAlCekirdek(kullanici, db, formData.get("id"));

  // Yalnızca başarılı işlemde sayfalar yenilenir.
  if (sonuc.durum === "basarili") {
    revalidatePath("/musteriler");
    const kimlik = kimlikDogrula(formData.get("id"));
    if (kimlik.ok) revalidatePath(`/musteriler/${kimlik.deger}`);
  }
  return sonuc;
}