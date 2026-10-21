"use server";

// PLAN SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
// Kurallar müşteri işlemleriyle aynıdır (bkz. musteriler/actions.ts).
// Ek kural: aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez,
// çünkü MRR planın ŞU ANKİ fiyatından hesaplanır. Fiyat değişirse geçmiş
// ve bugünkü MRR bir anda değişir. Ad değişikliği serbesttir.

import { revalidatePath } from "next/cache";
import { requireManager, requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula, planGirdisiniDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
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
export async function planPasifeAl(
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

  // Aktif aboneliği olan plan pasife alınamaz (bkz. src/lib/abonelik-kontrol.ts).
  if (await aktifAbonelikVarMi({ planId: kimlik.deger })) {
    return {
      durum: "hata",
      mesaj:
        "Bu planın aktif abonelikleri var. Önce abonelikleri iptal edin, sonra planı pasife alın.",
    };
  }

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

  revalidatePath("/planlar");
  revalidatePath(`/planlar/${kimlik.deger}`);
  return { durum: "basarili", mesaj: "Plan pasife alındı." };
}