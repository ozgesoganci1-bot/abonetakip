"use server";

// ABONELİK SUNUCU İŞLEMLERİ: başlat, yenile, iptal et.
//
// Her işlem abonelik kaydı ile olay kaydını (SUBSCRIPTION_EVENTS) TEK veritabanı
// işleminde (transaction) yazar: biri başarısız olursa ikisi de geri alınır.
// manager ve finance bu işlemlerin hepsini yapabilir. Yetki kontrolü her işlemin
// KENDİ İÇİNDE yapılır; düğmeyi gizlemek yetmez.
//
// Bütün sorgular getTenantDb() üzerinden yapılır: tenantId oturumdan gelir,
// formdan asla alınmaz. Başka firmanın kaydı hiçbir sorguda eşleşmez.
//
// DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
// yapar. Yönlendirme hata olarak fırlatıldığı için bu çağrılar try/catch
// bloklarının DIŞINDA tutulur.

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { donemSonu } from "@/lib/donem";
import {
  abonelikBaslatGirdisiniDogrula,
  kimlikDogrula,
} from "@/lib/validation";
import {
  MESAJ,
  formMetni,
  tekrarEdenKayitMi,
  type FormDurumu,
} from "@/lib/islem";

const ZATEN_AKTIF =
  "Bu müşterinin zaten aktif bir aboneliği var. Önce onu iptal edin.";
const DEGISMIS =
  "Abonelik başka bir işlemle değişti (iptal edilmiş ya da zaten yenilenmiş olabilir). Sayfayı yenileyip tekrar deneyin.";

// Başlatma işlemi sırasında müşteri veya plan pasife alınmışsa işlemi geri almak
// için kullanılan iç hata. Dışarıya açılmaz.
class KayitPasifHatasi extends Error {}

// Yeni abonelik başlatır.
export async function abonelikBaslat(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();
  const degerler = {
    musteriId: formMetni(formData, "musteriId"),
    planId: formMetni(formData, "planId"),
  };

  const sonuc = abonelikBaslatGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { musteriId, planId } = sonuc.deger;

  const db = await getTenantDb();

  // Müşteri ve plan bu firmaya ait ve aktif mi? Başka firmanın kaydı eşleşmez.
  const [musteri, plan] = await Promise.all([
    db.customer.findFirst({
      where: { id: musteriId, isActive: true },
      select: { id: true, name: true },
    }),
    db.plan.findFirst({
      where: { id: planId, isActive: true },
      select: { id: true, interval: true },
    }),
  ]);

  if (!musteri || !plan) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: {
        ...(musteri ? {} : { musteriId: "Seçilen müşteri bulunamadı ya da pasif." }),
        ...(plan ? {} : { planId: "Seçilen plan bulunamadı ya da pasif." }),
      },
      degerler,
    };
  }

  // Kullanıcıya anlaşılır mesaj vermek için önceden bakılır. Asıl garanti
  // veritabanındaki subscriptions_one_active_per_customer dizinidir.
  const mevcutAktif = await db.subscription.findFirst({
    where: { customerId: musteri.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (mevcutAktif) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: { musteriId: ZATEN_AKTIF },
      degerler,
    };
  }

  const simdi = new Date();
  const bitis = donemSonu(simdi, plan.interval);

  try {
    await db.$transaction(async (tx) => {
      const abonelik = await tx.subscription.create({
        // tenantId burada yalnızca TypeScript'in istediği alan olduğu için yazılır
        // ve OTURUMDAN gelir. tenant.ts uzantısı bu değeri zaten zorla yazar.
        data: {
          tenantId: kullanici.tenantId,
          customerId: musteri.id,
          planId: plan.id,
          status: "ACTIVE",
          startedAt: simdi,
          currentPeriodEnd: bitis,
        },
        select: { id: true },
      });

      await tx.subscriptionEvent.create({
        data: {
          tenantId: kullanici.tenantId,
          subscriptionId: abonelik.id,
          type: "STARTED",
        },
      });

      // Kayıt yazıldıktan sonra müşteri ve planın hâlâ aktif olduğunu bir kez daha
      // doğrularız. Biri bu arada pasife alındıysa işlem geri alınır.
      const [aktifMusteri, aktifPlan] = await Promise.all([
        tx.customer.count({ where: { id: musteri.id, isActive: true } }),
        tx.plan.count({ where: { id: plan.id, isActive: true } }),
      ]);
      if (aktifMusteri === 0 || aktifPlan === 0) {
        throw new KayitPasifHatasi();
      }
    });
  } catch (hata) {
    // İki kişi aynı anda aynı müşteriye abonelik başlatırsa veritabanı engeller.
    if (tekrarEdenKayitMi(hata)) {
      return {
        durum: "hata",
        mesaj: MESAJ.formHatali,
        alanHatalari: { musteriId: ZATEN_AKTIF },
        degerler,
      };
    }
    if (hata instanceof KayitPasifHatasi) {
      return {
        durum: "hata",
        mesaj: "Müşteri veya plan bu sırada pasife alındı. Lütfen tekrar deneyin.",
        degerler,
      };
    }
    console.error("Abonelik başlatılırken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/abonelikler");
  // Başarılı işlemde "degerler" dönülmez: form boşalır.
  return {
    durum: "basarili",
    mesaj: `"${musteri.name}" için abonelik başlatıldı.`,
  };
}

// Aktif aboneliği bir aralık (ay veya yıl) yeniler.
export async function abonelikYenile(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  const db = await getTenantDb();
  const abonelik = await db.subscription.findFirst({
    where: { id: kimlik.deger },
    select: {
      status: true,
      currentPeriodEnd: true,
      plan: { select: { interval: true } },
    },
  });
  // Kayıt yok ya da başka firmaya ait: ikisinde de aynı cevap.
  if (!abonelik) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }
  if (abonelik.status !== "ACTIVE") {
    return {
      durum: "hata",
      mesaj:
        "Yalnızca aktif abonelik yenilenebilir. İptal edilmiş abonelik için yeni abonelik başlatın.",
    };
  }

  // Yeni bitiş, mevcut bitişten hesaplanır (şimdiden değil).
  const yeniBitis = donemSonu(abonelik.currentPeriodEnd, abonelik.plan.interval);

  try {
    const yenilendi = await db.$transaction(async (tx) => {
      // Koşula okunan bitiş tarihi de eklenir: aynı anda iki yenileme isteği
      // gelirse yalnızca biri uygulanır, ikincisi 0 satır etkiler.
      const guncel = await tx.subscription.updateMany({
        where: {
          id: kimlik.deger,
          status: "ACTIVE",
          currentPeriodEnd: abonelik.currentPeriodEnd,
        },
        data: { currentPeriodEnd: yeniBitis },
      });
      if (guncel.count === 0) return false;

      await tx.subscriptionEvent.create({
        data: {
          tenantId: kullanici.tenantId,
          subscriptionId: kimlik.deger,
          type: "RENEWED",
        },
      });
      return true;
    });

    if (!yenilendi) {
      return { durum: "hata", mesaj: DEGISMIS };
    }
  } catch {
    console.error("Abonelik yenilenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen };
  }

  revalidatePath("/abonelikler");
  return { durum: "basarili", mesaj: "Abonelik yenilendi." };
}

// Aktif aboneliği iptal eder. İptal edilen abonelik yenilenemez.
export async function abonelikIptal(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  const db = await getTenantDb();
  const abonelik = await db.subscription.findFirst({
    where: { id: kimlik.deger },
    select: { status: true },
  });
  if (!abonelik) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }
  if (abonelik.status !== "ACTIVE") {
    return { durum: "hata", mesaj: "Bu abonelik zaten iptal edilmiş." };
  }

  try {
    const iptalEdildi = await db.$transaction(async (tx) => {
      // Koşulda status: ACTIVE olduğu için çift tıklamada ikinci istek 0 satır
      // etkiler ve ikinci bir olay yazılmaz.
      const guncel = await tx.subscription.updateMany({
        where: { id: kimlik.deger, status: "ACTIVE" },
        data: { status: "CANCELED", canceledAt: new Date() },
      });
      if (guncel.count === 0) return false;

      await tx.subscriptionEvent.create({
        data: {
          tenantId: kullanici.tenantId,
          subscriptionId: kimlik.deger,
          type: "CANCELED",
        },
      });
      return true;
    });

    if (!iptalEdildi) {
      return { durum: "hata", mesaj: DEGISMIS };
    }
  } catch {
    console.error("Abonelik iptal edilirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen };
  }

  revalidatePath("/abonelikler");
  return { durum: "basarili", mesaj: "Abonelik iptal edildi." };
}