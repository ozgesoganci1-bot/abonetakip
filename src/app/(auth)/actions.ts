"use server";

// Kayıt, giriş ve çıkış formlarının sunucu işlemleri (Server Actions).
// Bu dosya yalnızca src/lib/auth.ts içindeki fonksiyonları çağırır.
// tenantId buraya hiçbir zaman formdan gelmez.
//
// Gün 11 (Parça B): panel formlarıyla aynı ortak türe geçildi (FormDurumu, islem.ts).
// Hata durumunda form, kullanıcının yazdıklarıyla yeniden doldurulur (degerler).
// PAROLA BİLEREK geri gönderilmez: hatadan sonra parola alanı boş kalır.
// Mesaj metinleri ve doğrulama kuralları değişmedi (auth.ts, validation.ts).

import { redirect } from "next/navigation";
import { cikisYap, girisYap, kayitOl } from "@/lib/auth";
import { kayitGirdisiniDogrula } from "@/lib/validation";
import { formMetni, type FormDurumu } from "@/lib/islem";

// Kayıt formu gönderildiğinde çalışır.
export async function kayitAction(
  _onceki: FormDurumu,
  formVerisi: FormData
): Promise<FormDurumu> {
  // Hata olursa formu yeniden doldurmak için. Parola yok.
  const degerler = {
    firmaAdi: formMetni(formVerisi, "firmaAdi"),
    adSoyad: formMetni(formVerisi, "adSoyad"),
    eposta: formMetni(formVerisi, "eposta"),
  };

  // Girdileri sunucuda doğrula (tarayıcıdaki kontrollere güvenilmez).
  const dogrulama = kayitGirdisiniDogrula({
    firmaAdi: formVerisi.get("firmaAdi"),
    adSoyad: formVerisi.get("adSoyad"),
    eposta: formVerisi.get("eposta"),
    parola: formVerisi.get("parola"),
  });
  if (!dogrulama.ok) {
    return { durum: "hata", mesaj: dogrulama.hata, degerler };
  }

  const sonuc = await kayitOl(dogrulama.deger);
  if (!sonuc.ok) {
    return { durum: "hata", mesaj: sonuc.hata, degerler };
  }

  // Kayıt başarılı, oturum açıldı: panele git.
  // redirect bir hata olarak fırlatılır; bu yüzden try/catch içinde değildir.
  redirect("/dashboard");
}

// Giriş formu gönderildiğinde çalışır.
export async function girisAction(
  _onceki: FormDurumu,
  formVerisi: FormData
): Promise<FormDurumu> {
  // Hata olursa yalnızca e-posta geri döner. Parola yok.
  const degerler = { eposta: formMetni(formVerisi, "eposta") };

  const sonuc = await girisYap(
    formVerisi.get("eposta"),
    formVerisi.get("parola")
  );
  if (!sonuc.ok) {
    return { durum: "hata", mesaj: sonuc.hata, degerler };
  }

  redirect("/dashboard");
}

// Çıkış düğmesine basıldığında çalışır.
export async function cikisAction(): Promise<void> {
  await cikisYap();
  redirect("/giris");
}