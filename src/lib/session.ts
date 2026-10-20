// Oturum çerezi yönetimi.
// Çerezde yalnızca kullanıcı kimliği ve bitiş zamanı tutulur. tenantId ve rol
// çerezde YOKTUR, her istekte veritabanından okunur (bkz. src/lib/auth.ts).
// Çerez, gizli bir anahtarla imzalanır (HMAC-SHA256). Biri çerezi değiştirirse
// imza tutmaz ve çerez geçersiz sayılır.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_ADI = "oturum";
const SURE_SANIYE = 60 * 60 * 24 * 7; // 7 gün

// Gizli anahtarı ortam değişkeninden okur. Yoksa uygulama açık bir mesajla durur.
function anahtarOku(): string {
  const anahtar = process.env.SESSION_SECRET;
  if (!anahtar || anahtar.length < 16) {
    throw new Error(
      "SESSION_SECRET ortam değişkeni tanımlı değil veya çok kısa. .env dosyasını kontrol edin."
    );
  }
  return anahtar;
}

// Verilen metnin imzasını üretir.
function imzala(veri: string): string {
  return createHmac("sha256", anahtarOku()).update(veri).digest("base64url");
}

// Kullanıcı kimliğinden imzalı bir oturum belirteci üretir.
export function oturumBelirteciOlustur(
  kullaniciId: string,
  simdi: number = Date.now()
): string {
  const bitis = simdi + SURE_SANIYE * 1000;
  const veri = Buffer.from(JSON.stringify({ u: kullaniciId, b: bitis })).toString(
    "base64url"
  );
  return `${veri}.${imzala(veri)}`;
}

// Belirteci doğrular. Geçerliyse kullanıcı kimliğini, değilse null döner.
export function oturumBelirteciniCoz(
  belirtec: string,
  simdi: number = Date.now()
): string | null {
  const parcalar = belirtec.split(".");
  if (parcalar.length !== 2) return null;
  const [veri, imza] = parcalar;

  // İmzayı sabit sürede karşılaştır (süreden bilgi sızmasın diye).
  const gelen = Buffer.from(imza);
  const beklenen = Buffer.from(imzala(veri));
  if (gelen.length !== beklenen.length || !timingSafeEqual(gelen, beklenen)) {
    return null;
  }

  try {
    const yuk = JSON.parse(Buffer.from(veri, "base64url").toString("utf8"));
    if (typeof yuk.u !== "string" || typeof yuk.b !== "number") return null;
    if (yuk.b <= simdi) return null; // süresi dolmuş
    return yuk.u;
  } catch {
    return null;
  }
}

// Çerezi yazar. httpOnly: tarayıcıdaki JavaScript çereze erişemez.
// secure: Render'da (production) yalnızca https üzerinden gönderilir.
export async function oturumCerezineYaz(kullaniciId: string): Promise<void> {
  const cerezler = await cookies();
  cerezler.set(COOKIE_ADI, oturumBelirteciOlustur(kullaniciId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SURE_SANIYE,
  });
}

// Çerezi okur ve doğrular. Geçerli bir oturum yoksa null döner.
export async function oturumKullaniciIdOku(): Promise<string | null> {
  const cerezler = await cookies();
  const belirtec = cerezler.get(COOKIE_ADI)?.value;
  if (!belirtec) return null;
  return oturumBelirteciniCoz(belirtec);
}

// Çerezi siler (çıkış).
export async function oturumCerezindenSil(): Promise<void> {
  const cerezler = await cookies();
  cerezler.delete(COOKIE_ADI);
}