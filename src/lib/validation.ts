// Formların sunucu tarafı doğrulaması: kayıt ve giriş, müşteri, plan,
// abonelik başlatma ve CAC ayarı formları. Tarayıcıdaki kontrollere güvenilmez;
// her form sunucuda bu dosyadaki fonksiyonlarla yeniden kontrol edilir.
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

// ---------- Müşteri ve plan formları (Gün 4) ----------

// Form doğrulama sonucu: ya temiz değerler, ya da alan bazında hatalar.
// Kayıt formundan farkı: ilk hatada durmaz, bütün alanların hatasını birlikte döner.
export type AlanSonucu<T, Alan extends string> =
  | { ok: true; deger: T }
  | { ok: false; alanHatalari: Partial<Record<Alan, string>> };

// Kayıt kimliği (id) kontrolü. Kimlikler cuid biçimindedir: küçük harf ve rakam.
// Biçimi bozuk kimlik için de "bulunamadı" denir; neyin yanlış olduğu söylenmez.
const KIMLIK_DESENI = /^[a-z0-9]{1,50}$/;

export function kimlikDogrula(girdi: unknown): Sonuc<string> {
  const kimlik = temizle(girdi);
  if (!KIMLIK_DESENI.test(kimlik)) {
    return { ok: false, hata: "Kayıt bulunamadı." };
  }
  return { ok: true, deger: kimlik };
}

// İsteğe bağlı e-posta: boşsa null döner, doluysa normal e-posta kontrolü yapılır.
export function istegeBagliEpostaDogrula(girdi: unknown): Sonuc<string | null> {
  if (temizle(girdi).length === 0) {
    return { ok: true, deger: null };
  }
  return epostaDogrula(girdi);
}

// Fiyat sınırı. Veritabanındaki Int sütunu yaklaşık 2,1 milyara kadar sayı alır;
// gerçekçi bir üst sınır koyarak taşmayı ve yazım hatalarını önlüyoruz.
export const FIYAT_EN_COK = 10_000_000;

// TL tutarı (tam sayı) kontrolünün ortak çekirdeği (Gün 9).
// Fiyat ve CAC aynı yazım kurallarını kullanır. Bu fonksiyon mesaj üretmez,
// yalnızca hatanın TÜRÜNÜ söyler. Her alan kendi Türkçe mesajını seçer;
// böylece fiyat mesajları Gün 4'teki hâliyle birebir aynı kalır.
// 0 burada hata değildir: fiyatta reddedilir, CAC'de kabul edilir.
type TamSayiHatasi = "bos" | "eksi" | "ayirac" | "rakamDisi" | "cokBuyuk";

function tamSayiTlCoz(
  girdi: unknown
): { ok: true; deger: number } | { ok: false; neden: TamSayiHatasi } {
  const metin = temizle(girdi);
  if (metin.length === 0) return { ok: false, neden: "bos" };
  if (metin.startsWith("-")) return { ok: false, neden: "eksi" };
  // "1.000" (binlik) ile "12,5" (kuruş) yazımı karışmasın diye ikisi de reddedilir.
  if (/[.,]/.test(metin)) return { ok: false, neden: "ayirac" };
  if (!/^\d+$/.test(metin)) return { ok: false, neden: "rakamDisi" };
  // Çok uzun rakam dizilerini sayıya çevirmeden önce eleriz.
  const sayi = metin.length > 9 ? Infinity : Number(metin);
  if (sayi > FIYAT_EN_COK) return { ok: false, neden: "cokBuyuk" };
  return { ok: true, deger: sayi };
}

// Fiyat kontrolü: TL cinsinden, 0'dan büyük tam sayı (kuruş yok).
export function fiyatDogrula(girdi: unknown): Sonuc<number> {
  const sonuc = tamSayiTlCoz(girdi);
  if (sonuc.ok) {
    if (sonuc.deger === 0) {
      return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
    }
    return { ok: true, deger: sonuc.deger };
  }
  switch (sonuc.neden) {
    case "bos":
      return { ok: false, hata: "Fiyat boş bırakılamaz." };
    case "eksi":
      return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
    case "ayirac":
      return {
        ok: false,
        hata: "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.",
      };
    case "rakamDisi":
      return { ok: false, hata: "Fiyat yalnızca rakamlardan oluşmalıdır." };
    case "cokBuyuk":
      return {
        ok: false,
        hata: `Fiyat en fazla ${FIYAT_EN_COK.toLocaleString("tr-TR")} TL olabilir.`,
      };
  }
}

// Plan aralıkları ve ekranda gösterilen Türkçe karşılıkları.
export const PLAN_ARALIKLARI = ["MONTHLY", "YEARLY"] as const;
export type PlanAraligi = (typeof PLAN_ARALIKLARI)[number];
export const ARALIK_ETIKETI: Record<PlanAraligi, string> = {
  MONTHLY: "Aylık",
  YEARLY: "Yıllık",
};

// Aralık kontrolü: yalnızca listedeki değerler kabul edilir.
export function aralikDogrula(girdi: unknown): Sonuc<PlanAraligi> {
  const metin = temizle(girdi);
  const gecerli = (PLAN_ARALIKLARI as readonly string[]).includes(metin);
  if (!gecerli) {
    return { ok: false, hata: "Lütfen aylık veya yıllık aralığı seçin." };
  }
  return { ok: true, deger: metin as PlanAraligi };
}

// Müşteri formundan gelen temizlenmiş değerler.
export type MusteriGirdisi = {
  ad: string;
  eposta: string | null;
};

// Müşteri formunun tamamını kontrol eder.
export function musteriGirdisiniDogrula(girdi: {
  ad: unknown;
  eposta: unknown;
}): AlanSonucu<MusteriGirdisi, "ad" | "eposta"> {
  const ad = metinDogrula(girdi.ad, "Müşteri adı", 2, 100);
  const eposta = istegeBagliEpostaDogrula(girdi.eposta);

  if (ad.ok && eposta.ok) {
    return { ok: true, deger: { ad: ad.deger, eposta: eposta.deger } };
  }

  const alanHatalari: Partial<Record<"ad" | "eposta", string>> = {};
  if (!ad.ok) alanHatalari.ad = ad.hata;
  if (!eposta.ok) alanHatalari.eposta = eposta.hata;
  return { ok: false, alanHatalari };
}

// Plan formundan gelen temizlenmiş değerler.
export type PlanGirdisi = {
  ad: string;
  fiyat: number;
  aralik: PlanAraligi;
};

// Plan formunun tamamını kontrol eder.
export function planGirdisiniDogrula(girdi: {
  ad: unknown;
  fiyat: unknown;
  aralik: unknown;
}): AlanSonucu<PlanGirdisi, "ad" | "fiyat" | "aralik"> {
  const ad = metinDogrula(girdi.ad, "Plan adı", 2, 100);
  const fiyat = fiyatDogrula(girdi.fiyat);
  const aralik = aralikDogrula(girdi.aralik);

  if (ad.ok && fiyat.ok && aralik.ok) {
    return {
      ok: true,
      deger: { ad: ad.deger, fiyat: fiyat.deger, aralik: aralik.deger },
    };
  }

  const alanHatalari: Partial<Record<"ad" | "fiyat" | "aralik", string>> = {};
  if (!ad.ok) alanHatalari.ad = ad.hata;
  if (!fiyat.ok) alanHatalari.fiyat = fiyat.hata;
  if (!aralik.ok) alanHatalari.aralik = aralik.hata;
  return { ok: false, alanHatalari };
}

// ---------- Abonelik formları (Gün 5) ----------

// Abonelik başlatma formundan gelen temizlenmiş değerler.
export type AbonelikBaslatGirdisi = {
  musteriId: string;
  planId: string;
};

// Seçim kutusundan gelen kimliği kontrol eder.
// Hiçbir şey seçilmediyse "seçin" der. Kimlik biçimi bozuksa (formla oynanmışsa)
// "bulunamadı" der; neyin yanlış olduğu söylenmez.
function secimDogrula(
  girdi: unknown,
  secimMesaji: string,
  bulunamadiMesaji: string
): Sonuc<string> {
  if (temizle(girdi).length === 0) {
    return { ok: false, hata: secimMesaji };
  }
  const kimlik = kimlikDogrula(girdi);
  if (!kimlik.ok) {
    return { ok: false, hata: bulunamadiMesaji };
  }
  return kimlik;
}

// Abonelik başlatma formunun tamamını kontrol eder.
// Müşteri ve planın bu firmaya ait ve aktif olduğu burada DEĞİL, veritabanı
// sorgusunda (actions.ts) kontrol edilir.
export function abonelikBaslatGirdisiniDogrula(girdi: {
  musteriId: unknown;
  planId: unknown;
}): AlanSonucu<AbonelikBaslatGirdisi, "musteriId" | "planId"> {
  const musteri = secimDogrula(
    girdi.musteriId,
    "Lütfen bir müşteri seçin.",
    "Seçilen müşteri bulunamadı."
  );
  const plan = secimDogrula(
    girdi.planId,
    "Lütfen bir plan seçin.",
    "Seçilen plan bulunamadı."
  );

  if (musteri.ok && plan.ok) {
    return { ok: true, deger: { musteriId: musteri.deger, planId: plan.deger } };
  }

  const alanHatalari: Partial<Record<"musteriId" | "planId", string>> = {};
  if (!musteri.ok) alanHatalari.musteriId = musteri.hata;
  if (!plan.ok) alanHatalari.planId = plan.hata;
  return { ok: false, alanHatalari };
}

// ---------- CAC ayarı (Gün 9) ----------

// CAC üst sınırı fiyatla aynıdır.
export const CAC_EN_COK = FIYAT_EN_COK;

// CAC kontrolü: TL cinsinden tam sayı (kuruş yok). Fiyattan tek farkı: 0 kabul edilir.
// 0, "CAC girilmedi" anlamına gelir. Bu durumda LTV/CAC hesaplanmaz
// (bkz. metrikler.ts, ltvCacOrani). Böylece yönetici değeri sıfırlayabilir.
export function cacDogrula(girdi: unknown): Sonuc<number> {
  const sonuc = tamSayiTlCoz(girdi);
  if (sonuc.ok) return { ok: true, deger: sonuc.deger };
  switch (sonuc.neden) {
    case "bos":
      return { ok: false, hata: "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın." };
    case "eksi":
      return { ok: false, hata: "CAC negatif olamaz." };
    case "ayirac":
      return {
        ok: false,
        hata: "CAC değerini nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 5000). Kuruş girilmez.",
      };
    case "rakamDisi":
      return { ok: false, hata: "CAC yalnızca rakamlardan oluşmalıdır." };
    case "cokBuyuk":
      return {
        ok: false,
        hata: `CAC en fazla ${CAC_EN_COK.toLocaleString("tr-TR")} TL olabilir.`,
      };
  }
}


// ---------- Kullanıcı ekleme (Gün 14) ----------

// Kullanıcı ekleme formundan gelen temizlenmiş değerler.
// Rol burada YOKTUR: eklenen kullanıcı her zaman finance olur ve rolü sunucu yazar
// (src/lib/kullanici-yonetimi.ts). Formdan rol okunmaz.
export type KullaniciGirdisi = {
  adSoyad: string;
  eposta: string;
  parola: string;
};

// Kullanıcı ekleme formunun tamamını kontrol eder.
// Kurallar kayıt formuyla aynıdır: ad soyad 2-100 karakter; e-posta kırpılır ve
// küçük harfe çevrilir; parola en az 8 karakter, en çok 72 bayttır ve kırpılmaz.
// Kayıt formundan farkı: ilk hatada durmaz, müşteri formu gibi bütün alanların
// hatasını birlikte döner. Hata mesajlarında girilen değer (özellikle parola) geçmez.
export function kullaniciGirdisiniDogrula(girdi: {
  adSoyad: unknown;
  eposta: unknown;
  parola: unknown;
}): AlanSonucu<KullaniciGirdisi, "adSoyad" | "eposta" | "parola"> {
  const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
  const eposta = epostaDogrula(girdi.eposta);
  const parola = parolaDogrula(girdi.parola);

  if (ad.ok && eposta.ok && parola.ok) {
    return {
      ok: true,
      deger: { adSoyad: ad.deger, eposta: eposta.deger, parola: parola.deger },
    };
  }

  const alanHatalari: Partial<Record<"adSoyad" | "eposta" | "parola", string>> = {};
  if (!ad.ok) alanHatalari.adSoyad = ad.hata;
  if (!eposta.ok) alanHatalari.eposta = eposta.hata;
  if (!parola.ok) alanHatalari.parola = parola.hata;
  return { ok: false, alanHatalari };
}