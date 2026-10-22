// CANLI VERİTABANI KORUMASI (Gün 9)
//
// Test dalında çalışması gereken betikler (demo:veri, dev:test) başlamadan önce
// bu kontrolü çağırır. Kontrol geçilmezse betik veritabanına HİÇ bağlanmadan durur.
//
// Neden TEST_VERITABANI=evet tek başına yetmez?
// next dev, .env.test'te eksik olan bir değişkeni .env'den (canlı) tamamlar.
// Bir gün .env.test'teki DATABASE_URL silinir ya da yanlışlıkla canlı adres
// yapıştırılırsa, işaret yine "evet" olur ama bağlantı canlıya gider.
// Bu yüzden ikinci bir kontrol yapılır: DATABASE_URL, .env'deki canlı adresle
// AYNI Neon sunucusunu gösteriyor mu? (Havuzlu "-pooler" ve doğrudan adres aynı sunucudur.)
//
// Güvenlik: Hiçbir adres, parola veya sunucu adı ekrana yazılmaz.
// Belirsiz durumda (adres okunamadı) "izin ver" değil "durdur" denir.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Bu dosya src/test-destek/ içinde durur. İki üst klasör proje köküdür.
const PROJE_KOKU = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Bir PostgreSQL adresinden Neon uç noktasının kimliğini çıkarır.
// "ep-xxxx-ornek-pooler.c-2.eu-central-1.aws.neon.tech" -> "ep-xxxx-ornek"
// Havuzlu ve doğrudan adres aynı kimliği verir. Okunamazsa null döner.
export function ucNoktaKimligi(adres: string | undefined): string | null {
  if (!adres) return null;
  try {
    const sunucu = new URL(adres).hostname;
    if (!sunucu) return null;
    const ilkParca = sunucu.split(".")[0];
    return ilkParca.replace(/-pooler$/, "") || null;
  } catch {
    return null;
  }
}

export type KontrolSonucu = { ok: true } | { ok: false; hata: string };

// Şu anki ortam değişkenleri test dalını mı gösteriyor? Canlıyla çakışma var mı?
export function testDaliKontrolu(): KontrolSonucu {
  if (process.env.TEST_VERITABANI !== "evet") {
    return {
      ok: false,
      hata: "TEST_VERITABANI=evet bulunamadı. Bu betik yalnızca .env.test ile (test dalında) çalışır.",
    };
  }

  const testUcu = ucNoktaKimligi(process.env.DATABASE_URL);
  if (!testUcu) {
    return { ok: false, hata: ".env.test içindeki DATABASE_URL bulunamadı veya okunamadı." };
  }

  // Canlı ayar dosyası yoksa karşılaştırılacak bir canlı adres de yoktur.
  const canliDosyasi = path.join(PROJE_KOKU, ".env");
  if (!existsSync(canliDosyasi)) return { ok: true };

  const canliAdres = dotenv.parse(readFileSync(canliDosyasi, "utf8")).DATABASE_URL;
  const canliUcu = ucNoktaKimligi(canliAdres);
  if (!canliUcu) {
    return {
      ok: false,
      hata: ".env içindeki DATABASE_URL okunamadı; canlı ile karşılaştırma yapılamadığı için durduruldu.",
    };
  }
  if (canliUcu === testUcu) {
    return {
      ok: false,
      hata: "DATABASE_URL canlı veritabanıyla AYNI sunucuyu gösteriyor. .env.test dosyasını kontrol edin.",
    };
  }
  return { ok: true };
}