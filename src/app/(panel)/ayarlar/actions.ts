"use server";

// AYARLAR SUNUCU İŞLEMLERİ (Gün 9): CAC kaydetme.
//
// Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
// yetki kontrolü işlemin içinde yapılır; finance kullanıcısının sayfayı
// görememesi tek başına yeterli değildir. Rol kontrolü ve asıl mantık
// src/lib/cac-ayari.ts içindedir (otomatik test edilebilsin diye).
//
// DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
// yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
// bloklarının DIŞINDA tutulur. Çekirdeğin içindeki try/catch yalnızca veritabanı
// işlemini sarar.

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { cacKaydetCekirdek } from "@/lib/cac-ayari";
import type { FormDurumu } from "@/lib/islem";

// CAC değerini kaydeder. YALNIZCA manager yapabilir.
export async function cacKaydet(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
  const kullanici = await requireUser();
  const db = await getTenantDb();

  const sonuc = await cacKaydetCekirdek(kullanici, db, formData.get("cac"));

  // Yalnızca başarılı işlemde sayfalar yenilenir. Dashboard'daki LTV/CAC da değişir.
  if (sonuc.durum === "basarili") {
    revalidatePath("/ayarlar");
    revalidatePath("/dashboard");
  }
  return sonuc;
}