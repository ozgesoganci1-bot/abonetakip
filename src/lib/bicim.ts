// EKRAN BİÇİMLENDİRME (Gün 9)
//
// Sayıları ekranda Türkçe biçimde göstermek için saf fonksiyonlar.
// Hesap yapmaz, yalnızca hazır sayıyı metne çevirir. Yuvarlama kuralları
// metrikler.ts içindedir; buradaki ondalık sınırları yalnızca görünümdür.
// Ek paket yoktur: Node ve tarayıcıdaki yerleşik Intl kullanılır.

// Para: binlik ayıracı nokta, kuruş yok. 1500 -> "1.500 TL"
const TL_BICIMI = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export function tlMetni(deger: number): string {
  return `${TL_BICIMI.format(deger)} TL`;
}

// Yüzde: her zaman 1 ondalık. 0,6667 -> "%66,7", 0,04 -> "%4,0"
// Türkçede yüzde işareti sayının önüne yazılır.
const YUZDE_BICIMI = new Intl.NumberFormat("tr-TR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function yuzdeMetni(oran: number): string {
  return YUZDE_BICIMI.format(oran);
}

// Düz sayı (oran, ay sayısı): en fazla 2 ondalık, gereksiz sıfır yok.
// 0,3 -> "0,3", 5 -> "5", 1,5 -> "1,5", 3,25 -> "3,25"
const SAYI_BICIMI = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });

export function sayiMetni(deger: number): string {
  return SAYI_BICIMI.format(deger);
}

// Ay etiketi: (2026, 10) -> "Ekim 2026"
// Ayın ortasındaki bir an UTC olarak verilir; saat dilimi farkı ayı değiştiremez.
const AY_BICIMI = new Intl.DateTimeFormat("tr-TR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function ayEtiketi(yil: number, ay: number): string {
  return AY_BICIMI.format(new Date(Date.UTC(yil, ay - 1, 15)));
}