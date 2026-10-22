// TEST ÇÖZÜMLEME KANCASI
// Yalnızca testler çalışırken yüklenir. Uygulama (next dev, next build) bu dosyayı kullanmaz.
//
// Neden gerekli?
// Node, TypeScript dosyalarını doğrudan çalıştırabilir ama içe aktarmalarda dosya
// uzantısı ister ("./db" değil "./db.ts"). Next.js ise uzantısız yazıma ve "@/"
// kısaltmasına izin verir. Bu kanca, testler çalışırken aradaki farkı kapatır.
// Böylece mevcut dosyalara dokunmak gerekmez.
//
// Ne yapar? (sırayla)
//   1. "@/lib/x" yazımını "src/lib/x" yoluna çevirir.
//   2. Proje içindeki uzantısız yolları ".ts", ".tsx" ve "/index.ts" ile dener.
//   3. ".js" diye yazılmış ama aslında ".ts" olan dosyayı bulur (Prisma'nın ürettiği kod için).
//   4. "next/navigation" gibi paket alt yolları bulunamazsa sonuna ".js" ekleyip dener.
//
// Ek paket kullanmaz: Node'un yerleşik "node:module" özelliğidir.
// .ts değil .mjs yazıldı: "npm run build" tip kontrolüne girmesin diye.

import { registerHooks } from "node:module";
import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// Bu dosya src/test-destek/ içinde durur. Üç üst klasör proje köküdür.
const PROJE_KOKU = path.resolve(fileURLToPath(import.meta.url), "../../..");
const SRC = path.join(PROJE_KOKU, "src");
const NODE_MODULES = `${path.sep}node_modules${path.sep}`;

// Verilen yolda bir dosya (klasör değil) var mı?
function dosyaVarMi(yol) {
  try {
    return statSync(yol).isFile();
  } catch {
    return false;
  }
}

// Uzantısız ya da ".js" uzantılı bir yol için gerçek dosyayı arar.
// Bulamazsa undefined döner ve Node kendi kuralıyla devam eder.
function dosyayiBul(mutlakYol) {
  const adaylar = [mutlakYol];
  if (mutlakYol.endsWith(".js")) adaylar.push(mutlakYol.slice(0, -3) + ".ts");
  adaylar.push(mutlakYol + ".ts", mutlakYol + ".tsx", path.join(mutlakYol, "index.ts"));
  return adaylar.find(dosyaVarMi);
}

// Paket alt yolu mu? Örnek: "next/navigation" (evet), "react" (hayır), "./db" (hayır)
function paketAltYoluMu(belirtec) {
  if (belirtec.startsWith(".") || belirtec.startsWith("/") || belirtec.includes(":")) {
    return false;
  }
  const parcalar = belirtec.split("/");
  const enAzParca = belirtec.startsWith("@") ? 3 : 2; // "@kapsam/paket/alt" ya da "paket/alt"
  return parcalar.length >= enAzParca && path.extname(belirtec) === "";
}

registerHooks({
  resolve(belirtec, baglam, sonraki) {
    // 1) "@/..." kısaltması: src klasörüne çevir.
    if (belirtec.startsWith("@/")) {
      const bulunan = dosyayiBul(path.join(SRC, belirtec.slice(2)));
      if (bulunan) return sonraki(pathToFileURL(bulunan).href, baglam);
    }

    // 2) ve 3) Göreli yollar: yalnızca proje dosyalarından gelen içe aktarmalar.
    const ust = baglam.parentURL;
    if (
      (belirtec.startsWith("./") || belirtec.startsWith("../")) &&
      ust?.startsWith("file:") &&
      !fileURLToPath(ust).includes(NODE_MODULES)
    ) {
      const bulunan = dosyayiBul(path.resolve(path.dirname(fileURLToPath(ust)), belirtec));
      if (bulunan) return sonraki(pathToFileURL(bulunan).href, baglam);
    }

    // Diğer her şey: Node'un kendi kuralı.
    try {
      return sonraki(belirtec, baglam);
    } catch (hata) {
      // 4) "next/navigation" gibi paket alt yolu bulunamadıysa ".js" ekleyip dene.
      if (hata?.code === "ERR_MODULE_NOT_FOUND" && paketAltYoluMu(belirtec)) {
        return sonraki(belirtec + ".js", baglam);
      }
      throw hata;
    }
  },
});