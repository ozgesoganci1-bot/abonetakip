// UYGULAMAYI TEST DALINDA ÇALIŞTIRMA (Gün 9)
//
// Çalıştırma: npm run dev:test
// Ne yapar? Uygulamayı (next dev) .env.test ile, yani Neon TEST DALINA bağlı açar.
// Elle kontrol (dashboard, ayarlar, demo verisi) burada yapılır. CANLI VERİTABANINA
// BAĞLANMAZ: başlamadan önce canli-koruma.ts kontrolü yapılır, geçilmezse durur.
//
// Nasıl çalışır? "npm run dev:test" komutu Node'u --env-file=.env.test ile başlatır;
// değerler önce .env.test'ten yüklenir. Next.js daha sonra .env dosyasını da okur
// ama zaten tanımlı değişkenlerin ÜZERİNE YAZMAZ. Bu yüzden terminalde
// "Environments: .env" yazması normaldir.
// Test kullanıcıları bu modda kayıt sayfasından oluşturulur ve yalnızca test dalında bulunur.

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { testDaliKontrolu } from "./canli-koruma.ts";

const kontrol = testDaliKontrolu();
if (!kontrol.ok) {
  console.error(`Durduruldu: ${kontrol.hata}`);
  process.exit(1);
}

// next komutunun dosya yolu (node_modules içinden)
const yukle = createRequire(import.meta.url);
const nextKomutu = yukle.resolve("next/dist/bin/next");

console.log("Uygulama TEST DALINA bağlı olarak başlatılıyor (.env.test). Canlı veritabanı kullanılmaz.");

const surec = spawn(process.execPath, [nextKomutu, "dev"], {
  stdio: "inherit",
  env: process.env,
});
surec.on("exit", (kod) => process.exit(kod ?? 0));