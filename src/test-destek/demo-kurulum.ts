// DEMO KURULUM SENARYOSU (Gün 13) - saf veri üretimi
//
// seed-demo.ts betiğinin yazacağı demo verisini HESAPLAR, veritabanına dokunmaz.
// Ayrı dosyada durur, çünkü seed-demo.ts içe aktarıldığında betiğin kendisi çalışır;
// bu dosya ise demo-kurulum.test.ts içinden veritabanı olmadan test edilir.
//
// İki sahte kiracı: "Mavi Yazılım" ve "Kuzey Teknoloji". Her birinde:
//   - 1 manager ve 1 finance kullanıcısı (e-postalar @demo.example)
//   - 3 plan (2 aylık, 1 yıllık)
//   - 18 müşteri, son 12 aya yayılmış abonelikler: başlayanlar, yenilenenler, iptal edenler
//   - Bu ay en az 1 iptal (churn 0 olmasın, LTV ve LTV/CAC boş görünmesin)
//   - Dönem sonu 1-6 gün içinde olan tam 3 aktif abonelik (riskli abonelik listesi)
//   - İptal edip sonra geri dönen 1 müşteri (yeni abonelik başlatma kuralı görünsün)
//   - 2 pasif müşteri (isActive=false, aktif aboneliği yok)
//
// Tekrarlanabilirlik: Rastgele seçimler sabit tohumlu bir sayı üreteciyle yapılır.
// Tarihler çalıştırıldığı ana göre kaydırılır (gecmis-mrr-verisi.ts ile aynı yaklaşım).
// Bu yüzden aynı gün iki kez çalıştırmak aynı veriyi üretir.
//
// Neden "example" alan adı? example.com ve .example belgeler için ayrılmıştır (RFC 2606),
// gerçek bir kişiye ait olamaz. seed-demo.ts demo kiracıyı bu uzantıyla tanır.

import type { Aralik } from "../lib/donem.ts";
import { ayAraligi, sonAylar } from "../lib/metrikler.ts";
import { donemleriIlerlet } from "./donem-ilerlet.ts";

// ---------- Sabitler ----------

// README'de herkese açık yazılan demo parolası. Kayıt formundaki kurala uyar (en az 8 karakter).
// Gerçek bir parola değildir; yalnızca demo hesaplarında kullanılır.
export const DEMO_PAROLA = "demo1234";

// Demo kullanıcı e-postalarının uzantısı. Demo kiracı bu uzantıyla tanınır.
export const DEMO_UZANTI = "@demo.example";

const DAKIKA = 60 * 1000;
const SAAT = 60 * DAKIKA;
const GUN = 24 * SAAT;

// Riskli abonelik eşiği riskli-abonelikler.ts içinde 7 gündür. Riskli olmaması gereken
// aboneliklerin dönem sonu en az bu kadar uzakta tutulur (eşiğe 1 gün pay bırakılır).
const RISKSIZ_EN_AZ_GUN = 8;

// Ayın başından bu kadar süre geçmeden demo kurulmaz: bu ayın iptali ay başı ile
// "şimdi" arasına sığmalıdır (demo-verisi.ts'teki 15 dakika kuralının geniş hâli).
export const AY_BASI_BEKLEME_MS = 2 * SAAT;

// ---------- Kiracı tanımları ----------

export type DemoPlanTanimi = { ad: string; fiyat: number; aralik: Aralik };

export type DemoKiracisi = {
  anahtar: string; // e-postalarda kullanılır: yonetici.<anahtar>@demo.example
  ad: string; // firma adı (demo kiracıyı tanımanın ilk koşulu)
  kisaAd: string;
  cac: number; // TL, tam sayı
  tohum: number; // sabit tohum: her çalıştırmada aynı seçimler
  planlar: [DemoPlanTanimi, DemoPlanTanimi, DemoPlanTanimi]; // [aylık, aylık, yıllık]
  musteriAdlari: string[]; // 18 sahte firma adı
};

export const DEMO_KIRACILAR: DemoKiracisi[] = [
  {
    anahtar: "mavi",
    ad: "Mavi Yazılım",
    kisaAd: "Mavi",
    cac: 4000,
    tohum: 13001,
    planlar: [
      { ad: "Başlangıç", fiyat: 750, aralik: "MONTHLY" },
      { ad: "Profesyonel", fiyat: 1500, aralik: "MONTHLY" },
      { ad: "Kurumsal Yıllık", fiyat: 30000, aralik: "YEARLY" },
    ],
    musteriAdlari: [
      "Ege Dijital Ajans",
      "Kordon Muhasebe",
      "Alsancak Mimarlık",
      "Bornova Lojistik",
      "Karşıyaka Diş Kliniği",
      "Gediz Tarım",
      "Kemeraltı Tekstil",
      "Urla Bağcılık",
      "Çeşme Turizm",
      "Bayraklı Hukuk Bürosu",
      "Narlıdere Eczanesi",
      "Foça Yatçılık",
      "Tire Süt Ürünleri",
      "Seferihisar Enerji",
      "Menemen Seramik",
      "Buca Eğitim Kurumları",
      "Torbalı Otomotiv",
      "Dikili Balıkçılık",
    ],
  },
  {
    anahtar: "kuzey",
    ad: "Kuzey Teknoloji",
    kisaAd: "Kuzey",
    cac: 9000,
    tohum: 13002,
    planlar: [
      { ad: "Temel", fiyat: 900, aralik: "MONTHLY" },
      { ad: "Takım", fiyat: 2200, aralik: "MONTHLY" },
      { ad: "Takım Yıllık", fiyat: 22000, aralik: "YEARLY" },
    ],
    musteriAdlari: [
      "Trabzon Fındık Kooperatifi",
      "Rize Çay Evi",
      "Samsun Liman Hizmetleri",
      "Ordu Gıda",
      "Giresun Yazılım Atölyesi",
      "Sinop Tekne İmalatı",
      "Artvin Doğa Turizmi",
      "Bartın Mobilya",
      "Kastamonu Orman Ürünleri",
      "Zonguldak Enerji",
      "Amasya Elma Bahçeleri",
      "Tokat Dokuma",
      "Çorum Kuruyemiş",
      "Bolu Konaklama",
      "Düzce Mühendislik",
      "Karabük Metal",
      "Akçakoca Balıkçılık",
      "Ünye Lojistik",
    ],
  },
];

// ---------- Senaryo tipleri ----------

export type SenaryoKullanici = { eposta: string; ad: string; rol: "manager" | "finance" };
export type SenaryoPlan = { ad: string; fiyat: number; aralik: Aralik; olusturma: Date };
export type SenaryoMusteri = {
  ad: string;
  eposta: string | null;
  aktifMi: boolean;
  olusturma: Date;
};
export type SenaryoAbonelik = {
  musteriAdi: string;
  planAdi: string;
  fiyat: number;
  aralik: Aralik;
  baslangic: Date;
  iptal: Date | null;
  donemSonu: Date; // currentPeriodEnd
  yenilemeler: Date[]; // RENEWED olaylarının tarihleri
};
export type KiraciSenaryosu = {
  kiraci: DemoKiracisi;
  olusturma: Date; // firma ve kullanıcıların oluşturulma tarihi
  kullanicilar: SenaryoKullanici[];
  planlar: SenaryoPlan[];
  musteriler: SenaryoMusteri[];
  abonelikler: SenaryoAbonelik[];
};

export type SenaryoSonucu = { ok: true; senaryo: KiraciSenaryosu } | { ok: false; hata: string };

// ---------- Yardımcılar ----------

// Sabit tohumlu küçük rastgele sayı üreteci (mulberry32). 0 ile 1 arasında sayı verir.
// Ek paket gerekmez; aynı tohum her zaman aynı sırayı üretir.
function sayiUreteci(tohum: number): () => number {
  let durum = tohum >>> 0;
  return () => {
    durum = (durum + 0x6d2b79f5) >>> 0;
    let t = durum;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 0 ile adet-1 arasında rastgele tam sayı.
function tamSayi(r: () => number, adet: number): number {
  return Math.floor(r() * adet);
}

// Listeyi sabit üreteçle karıştırır (Fisher-Yates). Asıl listeyi değiştirmez.
function karistir<T>(r: () => number, liste: T[]): T[] {
  const kopya = [...liste];
  for (let i = kopya.length - 1; i > 0; i--) {
    const j = tamSayi(r, i + 1);
    [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
  }
  return kopya;
}

// "geri" ay önceki takvim ayının sınırları (Türkiye saati). geri = 0: bu ay.
function geriAy(simdi: Date, geri: number) {
  const { yil, ay } = sonAylar(simdi, geri + 1)[0];
  return ayAraligi(yil, ay);
}

// "geri" ay önceki ayın "gun". günü, Türkiye saatiyle "saat":00 (gecmis-mrr-verisi.ts ile aynı).
function ayinGunu(simdi: Date, geri: number, gun: number, saat: number): Date {
  return new Date(geriAy(simdi, geri).baslangic.getTime() + (gun - 1) * GUN + saat * SAAT);
}

// Verilen tarihten "ay" ay öncesi, aynı gün ve saat (UTC). Gün 28'i geçmemelidir.
function ayOncesi(tarih: Date, ay: number): Date {
  return new Date(
    Date.UTC(
      tarih.getUTCFullYear(),
      tarih.getUTCMonth() - ay,
      tarih.getUTCDate(),
      tarih.getUTCHours(),
      tarih.getUTCMinutes()
    )
  );
}

// Abonelik bugün iptal edilmeden sürse dönem sonu "şimdi"den en az 8 gün sonra mı?
// Değilse başlangıç 9 gün geri alınır: dönem sonu "şimdi"nin önüne düşer ve bir
// yenileme daha eklenir (yeni dönem sonu yaklaşık 3-4 hafta sonra olur).
// Böylece riskli listede yalnızca bilerek seçilen 3 abonelik görünür.
function riskliOlmasin(baslangic: Date, aralik: Aralik, simdi: Date): Date {
  let b = baslangic;
  for (let i = 0; i < 3; i++) {
    const { currentPeriodEnd } = donemleriIlerlet(b, aralik, simdi);
    if (currentPeriodEnd.getTime() - simdi.getTime() >= RISKSIZ_EN_AZ_GUN * GUN) return b;
    b = new Date(b.getTime() - 9 * GUN);
  }
  return b;
}

// ---------- Senaryo üretimi ----------

// Bir demo kiracının bütün verisini "simdi"ye göre hesaplar.
export function demoSenaryosu(kiraci: DemoKiracisi, simdi: Date): SenaryoSonucu {
  const buAy = geriAy(simdi, 0);
  if (simdi.getTime() - buAy.baslangic.getTime() < AY_BASI_BEKLEME_MS) {
    return {
      ok: false,
      hata: "Ayın ilk 2 saatindeyiz; bu ayın iptali ay içine sığmıyor. Biraz sonra tekrar deneyin.",
    };
  }

  const r = sayiUreteci(kiraci.tohum);
  const adlar = kiraci.musteriAdlari;

  // Her müşterinin ilk aboneliği (iptal ve geri dönüş sonra eklenir).
  type Ilk = { planNo: number; baslangic: Date; iptal: Date | null; riskli: boolean };
  const ilkler: Ilk[] = [];

  // Yeni müşterilerin başladığı aylar: 1-11 ay öncesinden 8 farklı ay, eskiden yeniye.
  const yeniAylar = karistir(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .slice(0, adlar.length - 10)
    .sort((a, b) => b - a);

  // Riskli 3 abonelik: dönem sonu "şimdi"den 1-6 gün sonra. Ayın 29-31'ine düşen
  // günler atlanır (ay sonu kısaltması dönem sonunu kaydırmasın diye).
  const riskliHedefler: Date[] = [];
  for (let k = 1; k <= 6 && riskliHedefler.length < 3; k++) {
    const hedef = new Date(simdi.getTime() + k * GUN + 6 * SAAT);
    if (hedef.getUTCDate() <= 28) riskliHedefler.push(hedef);
  }

  for (let i = 0; i < adlar.length; i++) {
    const zar = r();
    // İlk 3 müşteri riskli ve aylık; diğerlerinde plan dağılımı %45 / %35 / %20.
    const planNo = i < 3 ? [0, 1, 0][i] : zar < 0.45 ? 0 : zar < 0.8 ? 1 : 2;
    const aralik = kiraci.planlar[planNo].aralik;
    const gun = 1 + tamSayi(r, 28);
    const saat = 9 + tamSayi(r, 9);

    let baslangic: Date;
    if (i < 3) {
      // 14, 16 ve 18 ay önce başlamış; aylık yenilemeyle dönem sonu hedef güne düşer.
      baslangic = ayOncesi(riskliHedefler[i], 14 + 2 * i);
    } else if (i < 10) {
      // İlk müşteriler: 13-20 ay önce başlamış (grafiğin başında da müşteri var).
      baslangic = riskliOlmasin(ayinGunu(simdi, 13 + tamSayi(r, 8), gun, saat), aralik, simdi);
    } else {
      baslangic = riskliOlmasin(ayinGunu(simdi, yeniAylar[i - 10], gun, saat), aralik, simdi);
    }
    ilkler.push({ planNo, baslangic, iptal: null, riskli: i < 3 });
  }

  // İptal ayları: bu ay (zorunlu) ve 1-11 ay öncesinden 6 ay. Eskiden yeniye işlenir.
  const iptalAylari = [
    ...karistir(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 6).sort((a, b) => b - a),
    0,
  ];
  const iptalAyiNo = new Map<number, number>(); // müşteri no -> iptal ettiği ay (geri)
  for (const geri of iptalAylari) {
    const ay = geriAy(simdi, geri);
    // Aday: ay başında aktif, riskli olmayan, daha önce iptal etmemiş müşteri.
    const adaylar = ilkler
      .map((m, no) => ({ m, no }))
      .filter(({ m }) => !m.riskli && m.iptal === null && m.baslangic < ay.baslangic);
    if (adaylar.length === 0) continue;
    const { m, no } = adaylar[tamSayi(r, adaylar.length)];
    if (geri === 0) {
      // Bu ay: ay başından 1 saat sonra ile "şimdi"den 10 dakika önce arasında.
      const bas = ay.baslangic.getTime() + SAAT;
      const son = simdi.getTime() - 10 * DAKIKA;
      m.iptal = new Date(bas + Math.floor(r() * (son - bas)));
    } else {
      // Geçmiş aylar: ayın 2'si ile 27'si arasında bir gün, Türkiye saatiyle 10-17 arası.
      m.iptal = ayinGunu(simdi, geri, 2 + tamSayi(r, 26), 10 + tamSayi(r, 8));
    }
    iptalAyiNo.set(no, geri);
  }

  // Geri dönen müşteri: 5 ay ve daha önce iptal edenlerin en eskisi, 45 gün sonra
  // başka bir planla yeni abonelik başlatır.
  const donenNo = [...iptalAyiNo.entries()]
    .filter(([, geri]) => geri >= 5)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Pasif müşteriler: 3 ay ve daha önce iptal edip geri dönmeyenlerden ilk ikisi.
  const pasifNolar = new Set(
    [...iptalAyiNo.entries()]
      .filter(([no, geri]) => geri >= 3 && no !== donenNo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([no]) => no)
  );

  // Abonelik listesi: her müşterinin ilk aboneliği, geri dönen müşterinin ikinci aboneliği.
  const abonelikler: SenaryoAbonelik[] = [];
  const abonelikEkle = (musteriNo: number, planNo: number, baslangic: Date, iptal: Date | null) => {
    const plan = kiraci.planlar[planNo];
    const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(baslangic, plan.aralik, iptal ?? simdi);
    abonelikler.push({
      musteriAdi: adlar[musteriNo],
      planAdi: plan.ad,
      fiyat: plan.fiyat,
      aralik: plan.aralik,
      baslangic,
      iptal,
      donemSonu: currentPeriodEnd,
      yenilemeler,
    });
  };
  ilkler.forEach((m, no) => abonelikEkle(no, m.planNo, m.baslangic, m.iptal));
  if (donenNo !== undefined) {
    const ilk = ilkler[donenNo];
    const yeniPlanNo = (ilk.planNo + 1) % 3;
    const yeniBaslangic = riskliOlmasin(
      new Date((ilk.iptal as Date).getTime() + 45 * GUN),
      kiraci.planlar[yeniPlanNo].aralik,
      simdi
    );
    abonelikEkle(donenNo, yeniPlanNo, yeniBaslangic, null);
  }
  abonelikler.sort((a, b) => a.baslangic.getTime() - b.baslangic.getTime());

  // Oluşturma tarihleri: plan, kullanıcı ve firma ilk abonelikten 10 gün önce;
  // müşteri kendi ilk aboneliğinden 2 gün önce.
  const enEski = abonelikler[0].baslangic.getTime();
  const olusturma = new Date(enEski - 10 * GUN);

  const musteriler: SenaryoMusteri[] = adlar.map((ad, no) => ({
    ad,
    // Her üç müşteriden birinde e-posta boş (e-posta isteğe bağlıdır).
    eposta: no % 3 === 2 ? null : `${kiraci.anahtar}.musteri${String(no + 1).padStart(2, "0")}${DEMO_UZANTI}`,
    aktifMi: !pasifNolar.has(no),
    olusturma: new Date(ilkler[no].baslangic.getTime() - 2 * GUN),
  }));

  return {
    ok: true,
    senaryo: {
      kiraci,
      olusturma,
      kullanicilar: [
        { eposta: `yonetici.${kiraci.anahtar}${DEMO_UZANTI}`, ad: `Demo Yönetici (${kiraci.kisaAd})`, rol: "manager" },
        { eposta: `finans.${kiraci.anahtar}${DEMO_UZANTI}`, ad: `Demo Finans (${kiraci.kisaAd})`, rol: "finance" },
      ],
      planlar: kiraci.planlar.map((p) => ({ ...p, olusturma })),
      musteriler,
      abonelikler,
    },
  };
}
