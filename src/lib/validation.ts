// Kayıt ve giriş formlarının sunucu tarafı doğrulaması.
// Bu dosyadaki fonksiyonlar "saf"tır: veritabanına veya çereze dokunmazlar,
// aynı girdiye her zaman aynı sonucu verirler. Bu yüzden kolay test edilirler.

// Doğrulama sonucu: ya temiz değer döner, ya da kullanıcıya gösterilecek hata.
export type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };

// Basit e-posta biçimi: boşluk içermez, "@" ve noktalı bir alan adı vardır.
const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Parola sınırları. bcrypt en fazla 72 baytı dikkate alır, bu yüzden üst sınır var.
const PAROLA_EN_AZ = 8;
const PAROLA_EN_COK_BAYT = 72;

// Başındaki ve sonundaki boşlukları siler. Metin değilse boş metin döner.
function temizle(girdi: unknown): string {
  return typeof girdi === "string" ? girdi.trim() : "";
}

// Genel metin alanı kontrolü (firma adı, ad soyad).
export function metinDogrula(
  girdi: unknown,
  alanAdi: string,
  enAz: number,
  enCok: number
): Sonuc<string> {
  const metin = temizle(girdi);
  if (metin.length === 0) {
    return { ok: false, hata: `${alanAdi} boş bırakılamaz.` };
  }
  if (metin.length < enAz) {
    return { ok: false, hata: `${alanAdi} en az ${enAz} karakter olmalıdır.` };
  }
  if (metin.length > enCok) {
    return { ok: false, hata: `${alanAdi} en fazla ${enCok} karakter olabilir.` };
  }
  return { ok: true, deger: metin };
}

// E-posta kontrolü. Başarılıysa küçük harfe çevrilmiş hâli döner.
// Neden küçük harf? PostgreSQL'de "Ali@x.com" ile "ali@x.com" farklı sayılır,
// bu yüzden aynı kişi iki kez kayıt olabilirdi.
export function epostaDogrula(girdi: unknown): Sonuc<string> {
  const eposta = temizle(girdi).toLowerCase();
  if (eposta.length === 0) {
    return { ok: false, hata: "E-posta adresi boş bırakılamaz." };
  }
  if (eposta.length > 254 || !EPOSTA_DESENI.test(eposta)) {
    return { ok: false, hata: "Lütfen geçerli bir e-posta adresi girin." };
  }
  return { ok: true, deger: eposta };
}

// Parola kontrolü. Parolanın başı ve sonu ASLA kırpılmaz (kullanıcı ne yazdıysa o).
export function parolaDogrula(girdi: unknown): Sonuc<string> {
  if (typeof girdi !== "string" || girdi.length === 0) {
    return { ok: false, hata: "Parola boş bırakılamaz." };
  }
  if (girdi.length < PAROLA_EN_AZ) {
    return {
      ok: false,
      hata: `Parola en az ${PAROLA_EN_AZ} karakter olmalıdır.`,
    };
  }
  // Türkçe karakterler (ğ, ş, ı gibi) 2 bayt sayılır, bu yüzden bayt olarak ölçülür.
  if (new TextEncoder().encode(girdi).length > PAROLA_EN_COK_BAYT) {
    return { ok: false, hata: "Parola çok uzun. Daha kısa bir parola seçin." };
  }
  return { ok: true, deger: girdi };
}

// Kayıt formundan gelen temizlenmiş ve doğrulanmış değerler.
export type KayitGirdisi = {
  firmaAdi: string;
  adSoyad: string;
  eposta: string;
  parola: string;
};

// Kayıt formunun tamamını kontrol eder. İlk bulduğu hatayı döner.
export function kayitGirdisiniDogrula(girdi: {
  firmaAdi: unknown;
  adSoyad: unknown;
  eposta: unknown;
  parola: unknown;
}): Sonuc<KayitGirdisi> {
  const firma = metinDogrula(girdi.firmaAdi, "Firma adı", 2, 100);
  if (!firma.ok) return firma;

  const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
  if (!ad.ok) return ad;

  const eposta = epostaDogrula(girdi.eposta);
  if (!eposta.ok) return eposta;

  const parola = parolaDogrula(girdi.parola);
  if (!parola.ok) return parola;

  return {
    ok: true,
    deger: {
      firmaAdi: firma.deger,
      adSoyad: ad.deger,
      eposta: eposta.deger,
      parola: parola.deger,
    },
  };
}