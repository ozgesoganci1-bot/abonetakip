"use server";

// Kayıt, giriş ve çıkış formlarının sunucu işlemleri (Server Actions).
// Bu dosya yalnızca src/lib/auth.ts içindeki fonksiyonları çağırır.
// tenantId buraya hiçbir zaman formdan gelmez.

import { redirect } from "next/navigation";
import { cikisYap, girisYap, kayitOl } from "@/lib/auth";
import { kayitGirdisiniDogrula } from "@/lib/validation";

// Formlara dönen durum: hata varsa kullanıcıya gösterilecek mesaj.
type FormDurumu = { hata: string | null };

// Kayıt formu gönderildiğinde çalışır.
export async function kayitAction(
  _onceki: FormDurumu,
  formVerisi: FormData
): Promise<FormDurumu> {
  // Girdileri sunucuda doğrula (tarayıcıdaki kontrollere güvenilmez).
  const dogrulama = kayitGirdisiniDogrula({
    firmaAdi: formVerisi.get("firmaAdi"),
    adSoyad: formVerisi.get("adSoyad"),
    eposta: formVerisi.get("eposta"),
    parola: formVerisi.get("parola"),
  });
  if (!dogrulama.ok) return { hata: dogrulama.hata };

  const sonuc = await kayitOl(dogrulama.deger);
  if (!sonuc.ok) return { hata: sonuc.hata };

  // Kayıt başarılı, oturum açıldı: panele git.
  redirect("/dashboard");
}

// Giriş formu gönderildiğinde çalışır.
export async function girisAction(
  _onceki: FormDurumu,
  formVerisi: FormData
): Promise<FormDurumu> {
  const sonuc = await girisYap(
    formVerisi.get("eposta"),
    formVerisi.get("parola")
  );
  if (!sonuc.ok) return { hata: sonuc.hata };

  redirect("/dashboard");
}

// Çıkış düğmesine basıldığında çalışır.
export async function cikisAction(): Promise<void> {
  await cikisYap();
  redirect("/giris");
}