"use server";

// KULLANICI SUNUCU İŞLEMLERİ (Gün 14): kullanıcı ekleme.
//
// Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
// yetki kontrolü işlemin içinde yapılır; finance kullanıcısının sayfayı
// görememesi tek başına yeterli değildir. Rol kontrolü ve asıl mantık
// src/lib/kullanici-yonetimi.ts içindedir (otomatik test edilebilsin diye).
//
// Formdan YALNIZCA üç alan okunur: adSoyad, eposta, parola. Forma "rol" ya da
// "tenantId" adında bir alan eklense bile okunmaz: rol sunucuda sabit (finance),
// firma oturumdan gelir.
//
// DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
// yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
// bloklarının DIŞINDA tutulur. Çekirdeğin içindeki try/catch yalnızca veritabanı
// işlemini sarar.

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kullaniciEkleCekirdek } from "@/lib/kullanici-yonetimi";
import type { FormDurumu } from "@/lib/islem";

// Firmaya yeni bir finance kullanıcısı ekler. YALNIZCA manager yapabilir.
export async function kullaniciEkle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
  const kullanici = await requireUser();
  const db = await getTenantDb();

  const sonuc = await kullaniciEkleCekirdek(kullanici, db, {
    adSoyad: formData.get("adSoyad"),
    eposta: formData.get("eposta"),
    parola: formData.get("parola"),
  });

  // Yalnızca başarılı işlemde liste yenilenir.
  if (sonuc.durum === "basarili") {
    revalidatePath("/kullanicilar");
  }
  return sonuc;
}