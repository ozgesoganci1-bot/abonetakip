"use server";

// PLAN SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
// Kurallar müşteri işlemleriyle aynıdır (bkz. musteriler/actions.ts).
// Ek kural: aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez,
// çünkü MRR planın ŞU ANKİ fiyatından hesaplanır. Fiyat değişirse geçmiş
// ve bugünkü MRR bir anda değişir. Ad değişikliği serbesttir.
//
// Gün 6: Pasife alma işleminin mantığı ve rol kontrolü src/lib/pasife-alma.ts
// dosyasına taşındı (otomatik test edilebilsin diye).

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula, planGirdisiniDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
import { planPasifeAlCekirdek } from "@/lib/pasife-alma";
import { MESAJ, formMetni, type FormDurumu } from "@/lib/islem";

const KILITLI_MESAJ =
  "Bu planın aktif abonelikleri var. Fiyat ve aralık değiştirilemez, yalnızca ad değiştirilebilir.";

// Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
function formDegerleri(formData: FormData) {
  return {
    ad: formMetni(formData, "ad"),
    fiyat: formMetni(formData, "fiyat"),
    aralik: formMetni(formData, "aralik"),
  };
}

// Yeni plan ekler. manager ve finance yapabilir.
export async function planEkle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();
  const degerler = formDegerleri(formData);

  const sonuc = planGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, fiyat, aralik } = sonuc.deger;

  const db = await getTenantDb();
  try {
    await db.plan.create({
      // tenantId OTURUMDAN gelir; tenant.ts uzantısı da zorla üzerine yazar.
      data: {
        tenantId: kullanici.tenantId,
        name: ad,
        price: fiyat,
        interval: aralik,
      },
    });
  } catch {
    console.error("Plan eklenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/planlar");
  return { durum: "basarili", mesaj: `"${ad}" planı eklendi.` };
}

// Planı günceller. manager ve finance yapabilir.
export async function planGuncelle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  await requireUser();
  const degerler = formDegerleri(formData);

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  const sonuc = planGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, fiyat, aralik } = sonuc.deger;

  const db = await getTenantDb();
  const mevcut = await db.plan.findFirst({
    where: { id: kimlik.deger },
    select: { price: true, interval: true },
  });
  if (!mevcut) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  // Fiyat veya aralık değişiyorsa aktif abonelik kontrolü yapılır.
  const fiyatVeyaAralikDegisti =
    mevcut.price !== fiyat || mevcut.interval !== aralik;
  if (
    fiyatVeyaAralikDegisti &&
    (await aktifAbonelikVarMi({ planId: kimlik.deger }))
  ) {
    return { durum: "hata", mesaj: KILITLI_MESAJ, degerler };
  }

  try {
    const sonucSatir = await db.plan.updateMany({
      where: { id: kimlik.deger },
      data: { name: ad, price: fiyat, interval: aralik },
    });
    if (sonucSatir.count === 0) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
    }
  } catch {
    console.error("Plan güncellenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/planlar");
  revalidatePath(`/planlar/${kimlik.deger}`);
  return {
    durum: "basarili",
    mesaj: "Değişiklikler kaydedildi.",
    degerler: { ad, fiyat: String(fiyat), aralik },
  };
}

// Planı pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
// Rol kontrolü ve asıl mantık src/lib/pasife-alma.ts içindedir.
export async function planPasifeAl(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
  // Giriş yapılmamışsa yönlendirme yapılır (try/catch dışında).
  const kullanici = await requireUser();
  const db = await getTenantDb();

  const sonuc = await planPasifeAlCekirdek(kullanici, db, formData.get("id"));

  // Yalnızca başarılı işlemde sayfalar yenilenir.
  if (sonuc.durum === "basarili") {
    revalidatePath("/planlar");
    const kimlik = kimlikDogrula(formData.get("id"));
    if (kimlik.ok) revalidatePath(`/planlar/${kimlik.deger}`);
  }
  return sonuc;
}