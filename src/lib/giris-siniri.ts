// GİRİŞ DENEME SINIRI (Gün 12, bulgu B1)
//
// Aynı e-postaya kısa sürede çok sayıda parola denenmesini engeller.
// Kural: 15 dakika içinde en fazla 5 deneme. 6. deneme ve sonrası 15 dakika reddedilir.
//
// NASIL ÇALIŞIR?
// - Bellekte "e-posta -> deneme bilgisi" listesi tutulur. Anahtar, küçük harfe
//   çevrilmiş e-postadır: "Ali@x.com" ile "ali@x.com" aynı sayaca düşer.
// - Deneme, parola kontrolünden ÖNCE sayılır (denemeyiKaydet). Kontrol ve sayma
//   aynı senkron adımdadır, arada await yoktur. Node tek iş parçacığında çalıştığı
//   için aynı anda gelen 50 istek bu adımın arasına giremez; hepsi sırayla sayılır.
// - Başarılı girişte o e-postanın sayacı silinir (basarili).
// - Blok sürerken doğru parola da reddedilir. Blok sırasında parola kontrolü ve
//   veritabanı sorgusu hiç yapılmaz (işlemci de korunur).
// - Sayaç e-postanın kayıtlı olup olmadığına BAKMAZ. Bu yüzden kayıtlı ve kayıtsız
//   e-postalar aynı sayıda denemeden sonra aynı mesajla bloklanır; cevap e-postanın
//   varlığını ele vermez.
//
// BELLEK TEMİZLİĞİ: Arka planda zamanlayıcı yoktur.
// - Bir e-posta yeniden denendiğinde süresi dolmuş kaydı önce silinir.
// - Liste üst sınıra (10.000 kayıt) ulaşınca süresi dolmuş bütün kayıtlar silinir.
//   Hâlâ doluysa en eski kayıt silinir. Böylece bellek sınırsız büyümez.
//
// BİLİNEN SINIRLAR (ADR, Gün 12):
// - Liste tek Render sürecinin belleğindedir. Sunucu yeniden başlarsa sayaç sıfırlanır,
//   ikinci bir sunucu açılırsa her biri ayrı sayar.
// - IP başına sınır yoktur: Render'ın X-Forwarded-For davranışı belgeli değildir.
// - Başkası bir kullanıcının e-postasıyla 6 yanlış deneme yaparsa o kullanıcı 15 dakika
//   giriş yapamaz.
//
// Bu dosya Next.js'e ve veritabanına bağlı değildir. Bu yüzden "npm test" ile
// veritabanı olmadan test edilir (giris-siniri.test.ts).

// Pencere içinde izin verilen en fazla deneme sayısı.
export const EN_COK_DENEME = 5;
// Denemelerin sayıldığı süre: ilk denemeden itibaren 15 dakika.
export const PENCERE_MS = 15 * 60 * 1000;
// Sınır aşılınca bloğun süresi.
export const BLOK_MS = 15 * 60 * 1000;
// Bellekte tutulacak en fazla kayıt (e-posta) sayısı.
export const EN_COK_KAYIT = 10_000;

// Blok sırasında kullanıcıya gösterilen mesaj. Kayıtlı ve kayıtsız e-postada aynıdır.
export const BLOK_MESAJI =
  "Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.";

// Bir e-postanın deneme bilgisi.
type Kayit = {
  deneme: number; // pencere içindeki deneme sayısı
  ilkDeneme: number; // pencerenin başladığı an (milisaniye)
  blokBitis: number | null; // blok varsa bitiş anı, yoksa null
};

// Testlerin küçük değerlerle çalışabilmesi için ayarlar değiştirilebilir.
export type SinirAyarlari = {
  enCokDeneme: number;
  pencereMs: number;
  blokMs: number;
  enCokKayit: number;
};

export type DenemeSonucu = { izin: boolean };

// Yeni bir sınırlayıcı üretir. Uygulama aşağıdaki tek örneği (girisSiniri) kullanır;
// testler her seferinde temiz bir sınırlayıcı üretir.
export function sinirlayiciOlustur(ayar: Partial<SinirAyarlari> = {}) {
  const enCokDeneme = ayar.enCokDeneme ?? EN_COK_DENEME;
  const pencereMs = ayar.pencereMs ?? PENCERE_MS;
  const blokMs = ayar.blokMs ?? BLOK_MS;
  const enCokKayit = ayar.enCokKayit ?? EN_COK_KAYIT;

  const kayitlar = new Map<string, Kayit>();

  // E-postayı anahtara çevirir: baş ve sondaki boşluk silinir, küçük harfe çevrilir.
  function anahtar(eposta: string): string {
    return eposta.trim().toLowerCase();
  }

  // Kaydın süresi doldu mu? Blokluysa blok bitince, değilse pencere bitince dolar.
  function suresiDolduMu(kayit: Kayit, simdi: number): boolean {
    if (kayit.blokBitis !== null) return kayit.blokBitis <= simdi;
    return kayit.ilkDeneme + pencereMs <= simdi;
  }

  // Süresi dolmuş bütün kayıtları siler.
  function temizle(simdi: number = Date.now()): void {
    for (const [a, kayit] of kayitlar) {
      if (suresiDolduMu(kayit, simdi)) kayitlar.delete(a);
    }
  }

  // Yeni kayıt eklemeden önce çağrılır. Liste doluysa yer açar.
  function yerAc(simdi: number): void {
    if (kayitlar.size < enCokKayit) return;
    temizle(simdi);
    // Hâlâ doluysa en eski kayıtlar silinir (Map, ekleme sırasını korur).
    while (kayitlar.size >= enCokKayit) {
      const enEski = kayitlar.keys().next().value;
      if (enEski === undefined) break;
      kayitlar.delete(enEski);
    }
  }

  // Bir giriş denemesini kaydeder ve denemeye izin verilip verilmediğini söyler.
  // Parola kontrolünden ÖNCE çağrılır. İçinde await yoktur (bkz. dosya başı).
  function denemeyiKaydet(eposta: string, simdi: number = Date.now()): DenemeSonucu {
    const a = anahtar(eposta);
    let kayit = kayitlar.get(a);

    // Süresi dolmuş kayıt yok sayılır ve silinir.
    if (kayit && suresiDolduMu(kayit, simdi)) {
      kayitlar.delete(a);
      kayit = undefined;
    }

    // İlk deneme: yeni pencere başlar.
    if (!kayit) {
      yerAc(simdi);
      kayitlar.set(a, { deneme: 1, ilkDeneme: simdi, blokBitis: null });
      return { izin: true };
    }

    // Blok sürüyor: reddedilir. Bloğun süresi uzatılmaz.
    if (kayit.blokBitis !== null) {
      return { izin: false };
    }

    // Sınır doldu: bu deneme reddedilir ve blok başlar.
    if (kayit.deneme >= enCokDeneme) {
      kayit.blokBitis = simdi + blokMs;
      return { izin: false };
    }

    kayit.deneme += 1;
    return { izin: true };
  }

  // Başarılı girişten sonra çağrılır: sayaç silinir.
  // Blok sürüyorsa silinmez (blok sırasında zaten parola kontrolüne gelinmez).
  function basarili(eposta: string): void {
    const a = anahtar(eposta);
    const kayit = kayitlar.get(a);
    if (kayit && kayit.blokBitis === null) kayitlar.delete(a);
  }

  // Bellekteki kayıt sayısı (testler ve kontrol için).
  function kayitSayisi(): number {
    return kayitlar.size;
  }

  return { denemeyiKaydet, basarili, temizle, kayitSayisi };
}

export type GirisSinirlayici = ReturnType<typeof sinirlayiciOlustur>;

// Uygulamanın kullandığı TEK sınırlayıcı. globalThis üzerinde saklanır: geliştirme
// modunda Next.js dosyaları yeniden yüklediğinde sayaçlar kaybolmaz (sse-hub.ts ile aynı).
const depo = globalThis as typeof globalThis & {
  abonetakipGirisSiniri?: GirisSinirlayici;
};
export const girisSiniri: GirisSinirlayici =
  depo.abonetakipGirisSiniri ?? sinirlayiciOlustur();
depo.abonetakipGirisSiniri = girisSiniri;