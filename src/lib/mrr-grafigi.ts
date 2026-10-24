// MRR GRAFİĞİ YARDIMCILARI (Gün 11)
//
// Dashboard'daki aylık MRR grafiğinin (src/app/(panel)/dashboard/MrrGrafigi.tsx)
// test edilebilir mantığı burada durur. Bileşen yalnızca çizer.
//
// Bütün fonksiyonlar saftır: veritabanı, oturum ve saat yok.
// MRR hesabı burada YAPILMAZ. Değerler metrikler.ts içindeki mrrGecmisi'nden
// hazır (tam TL'ye yuvarlanmış) gelir; burada yalnızca eksen ve metin hazırlanır.

import type { MrrNoktasi } from "./metrikler";
import { ayEtiketi, tlMetni } from "./bicim";

// Dikey eksenin en küçük üst sınırı. Bütün değerler 0 ya da çok küçükse eksen
// 0-100 TL olur. Böylece ortadaki çizgi (50 TL) her zaman tam sayıdır.
const EN_KUCUK_UST_SINIR = 100;

// Üst sınır için "yuvarlak" çarpanlar: 1, 2, 2,5, 5 ve 10'un basamak katları.
// Örnek: 4.583 -> 5.000, 2.083 -> 2.500, 150 -> 200, 12.000 -> 20.000.
const CARPANLAR = [1, 2, 2.5, 5, 10];

// En büyük değere eşit ya da ondan büyük ilk "yuvarlak" sayıyı verir.
// 100'ün altındaki (ya da sayı olmayan) değerlerde 100 döner.
// Basamak 100 ve üstü olduğu için sonuç her zaman çift tam sayıdır (yarısı da tam sayı).
export function eksenUstSiniri(enBuyuk: number): number {
  if (!(enBuyuk > EN_KUCUK_UST_SINIR)) return EN_KUCUK_UST_SINIR;

  // Basamak: enBuyuk'ten büyük olmayan en büyük 10'un kuvveti (4.583 -> 1.000).
  let basamak = 1;
  while (basamak * 10 <= enBuyuk) basamak *= 10;

  for (const carpan of CARPANLAR) {
    if (carpan * basamak >= enBuyuk) return carpan * basamak;
  }
  // Buraya ulaşılmaz: 10 x basamak her zaman enBuyuk'ten büyüktür.
  return 10 * basamak;
}

// Yatay eksen çizgilerinin değerleri: 0, üst sınırın yarısı ve üst sınır.
export function eksenDegerleri(ustSinir: number): number[] {
  return [0, ustSinir / 2, ustSinir];
}

// Grafiğin metin alternatifi: ekran okuyucu ve rengi ayırt edemeyen kullanıcı için.
// Ekler yalnızca "TL"ye gelir ("TL'den", "TL'ye"); ay adlarına ek getirilmez,
// çünkü Türkçe ek uyumu yıla göre değişir ("2025'teki", "2026'daki").
// En yüksek değer birden çok ayda varsa en eski ay yazılır.
export function grafikOzeti(noktalar: MrrNoktasi[]): string {
  if (noktalar.length === 0) return "MRR verisi yok.";

  const ilk = noktalar[0];
  const son = noktalar[noktalar.length - 1];
  const sonEtiket = ayEtiketi(son.yil, son.ay);

  if (noktalar.length === 1) return `MRR ${tlMetni(son.mrr)} (${sonEtiket}).`;

  const bas = `Son ${noktalar.length} ayda MRR`;
  const donem = `${ayEtiketi(ilk.yil, ilk.ay)} – ${sonEtiket}`;

  if (noktalar.every((n) => n.mrr === 0)) return `${bas} 0 TL (${donem}).`;

  let degisim: string;
  if (son.mrr > ilk.mrr) {
    degisim = `${tlMetni(ilk.mrr)}'den ${tlMetni(son.mrr)}'ye yükseldi`;
  } else if (son.mrr < ilk.mrr) {
    degisim = `${tlMetni(ilk.mrr)}'den ${tlMetni(son.mrr)}'ye düştü`;
  } else {
    degisim = `ilk ve son ayda aynı: ${tlMetni(son.mrr)}`;
  }

  // En yüksek değer: eşitlikte ilk (en eski) ay kalır, çünkü ">" kullanılıyor.
  let enYuksek = ilk;
  for (const nokta of noktalar) {
    if (nokta.mrr > enYuksek.mrr) enYuksek = nokta;
  }

  return (
    `${bas} ${degisim} (${donem}). ` +
    `En yüksek değer ${tlMetni(enYuksek.mrr)} (${ayEtiketi(enYuksek.yil, enYuksek.ay)}).`
  );
}