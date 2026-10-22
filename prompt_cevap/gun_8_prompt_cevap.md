# Gün 8: Metrik hesaplama fonksiyonları

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 22 Eki 2026 (Türkiye saati). **Kapsam:** 8 prompt ve 7 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 8 promptu: metrik hesaplama fonksiyonları (MRR, churn, ARPU, ömür, LTV, LTV/CAC) saf fonksiyon olarak, sıfıra bölme durumları ve birim testleri. Plan ve uygulama ayrı bir sohbette yapıldı |
| **Ne üretildi** | `src/lib/metrikler.ts` (saf hesap fonksiyonları, Türkiye saatine göre ay aralığı yardımcısı, tek yuvarlama yardımcısı, `null` ile hesaplanamadı nedenleri) ve `src/lib/metrikler.test.ts` (17 yeni test, `npm test` toplam 37); `package.json` test betiği; ADR Gün 8 bölümü |
| **Düzeltme gerekti mi** | Evet: (1) AI plan aşamasında yine Vitest önerdi, ADR'deki "ek paket yok" kararı hatırlatılınca `node --test` ve mevcut kancayla ilerlendi; (2) plan dört karar sorusuyla onaya sunuldu (test aracı, churn müşteri bazlı, ay sınırı Türkiye saati, fiyat kopyası); (3) AI son adımda dal açmadan `git push` önerdi, dal ve PR ile ilerlendi; (4) ADR taslağı koda göre karşılaştırıldı ve 3 eksik ya da yanlış ifade düzeltildi (yuvarlama iki fonksiyonda, ay geçişi kuralı, churn gösterim hassasiyeti) |

## Gün 8 sohbeti (plan, kod, testler ve bitiş kontrolü)

_Plan ve uygulama bu sohbette yapıldı._

### Prompt 1 · 22 Eki 2026 13:51

````text
```markdown
[Rol] Next.js (App Router), TypeScript, PostgreSQL ve Prisma konusunda
deneyimli, çok kiracılı SaaS ürünleri geliştirmiş kıdemli bir geliştirici
olarak davran. Ben kod bilmeyen bir YBS öğrencisiyim. Açıklamaları Türkçe,
sade ve adım adım yap. Her dosya için tam dosya yolunu yaz ve "yeni dosya
oluştur" ya da "dosyanın içeriğini tamamen şununla değiştir" diye açıkça
söyle. Terminal komutlarını tek tek ver ve her birinin ne işe yaradığını
bir cümleyle söyle. Ortamım MacBook Air M4 (macOS, zsh).

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Tek geliştirici, 2 hafta, GitHub ile entegre.
Tek Next.js uygulaması, tek PostgreSQL veritabanı (Neon), Prisma. Render
(PaaS) üzerinde sürekli açık Node sunucusu. GitHub deposu herkese açık. Ortak tablolar ve tenant_id ile çok
kiracılı yapı. Roller: manager ve finance. Gerçek zamanlı uyarılar SSE ile.
Kapsam: MUST (kayıt/giriş/roller, müşteri ve plan yönetimi, abonelik yaşam
döngüsü, KPI dashboard, kiracı izolasyonu), SHOULD (SSE uyarısı, aylık MRR
grafiği). Ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi ve
mikroservis kapsam dışıdır.

[Kısıtlar - her zaman geçerli]
- Önce plan, ben onaylamadan kod yazma.
- Tenant filtresi tek merkezi fonksiyondan uygulanır. tenant_id istemciden
  alınmaz, oturumdan okunur.
- Secret değerler yalnızca ortam değişkeninden okunur.
- Gereksiz paket ekleme. Var olduğundan emin olmadığın paketi önerme.
- Kullandığım Next.js ve Prisma sürümünü package.json'dan kontrol et,
  gerekirse dosyayı bana göster dedirt.
- Kapsam dışına çıkma. Anlamadığın bir yerde tahmin etme, bana sor.
- Cevabın sonunda varsayımlarını listele ve emin olmadığın yerleri belirt.
```  ## Gün 8 • Metrik hesaplama fonksiyonları (birim testli)

**Amaç:** MRR, churn, ARPU, LTV, LTV/CAC ve aylık MRR geçmişini saf fonksiyonlarla hesaplamak.

```
[Görev] Metrik hesaplama fonksiyonlarını saf fonksiyon olarak yaz ve
birim testlerini ekle.

Fonksiyonlar:
1) MRR: ACTIVE aboneliklerin aylık fiyat toplamı. Yıllık planlar 12'ye
   bölünür.
2) Belirli bir tarihteki MRR (grafik için): bir abonelik, startedAt <=
   tarih ve (canceledAt boş veya canceledAt > tarih) ise o tarihte
   aktiftir.
3) Aylık churn: ay içinde iptal edenler / ay başındaki aktif müşteriler.
4) ARPU = MRR / aktif müşteri sayısı.
5) Ortalama ömür = 1 / churn (ay cinsinden).
6) LTV = ARPU x ortalama ömür.
7) LTV/CAC (CAC tenant ayarından gelir).

Dersteki doğrulama örneği (testte mutlaka olsun): 50 müşteri, her biri
aylık 1.000 TL, aylık churn %4, CAC 5.000 TL. Beklenen: MRR = 50.000 TL,
ortalama ömür = 25 ay, LTV = 25.000 TL, LTV/CAC = 5.

[Kısıtlar]
- Fonksiyonlar veritabanına dokunmaz. Girdi olarak düz veri alır, sonuç
  döndürür (böylece test edilebilir).
- Sıfıra bölme durumları (ay başında aktif müşteri yok, churn 0, aktif
  müşteri yok) ele alınır. Bu durumlarda "hesaplanamadı" anlamına gelen
  açık bir değer döndür (örn. null) ve neden o seçimi yaptığını yorumla
  açıkla.
- Para değerleri TL, tam sayı girdi. Yuvarlama kuralını belirt ve tek
  yerde uygula.
- Her fonksiyonun üstüne Türkçe, formülü anlatan kısa yorum yaz.
- Gereksiz paket ekleme.

[Format] 1) Fonksiyon listesi, girdi/çıktı tipleri ve sıfıra bölme
tablosu (onay bekle). 2) Kod dosyası tam yoluyla. 3) Test dosyası: dersteki
örnek + en az 5 uç durum. 4) Test komutu.

[Doğrulama] Formülleri yukarıdaki tanımlarla tek tek karşılaştır. Churn'ün
"müşteri mi, abonelik mi" ayrımında kuralımı (müşteri başına tek ACTIVE
abonelik) kullandığını teyit et. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Dersteki örnek testi geçiyor (MRR 50.000, LTV 25.000, LTV/CAC 5)
- [ ] Sıfıra bölme testleri geçiyor
- [ ] Bir formülü elle (hesap makinesiyle) doğruladın
- **Commit:** `feat: metrik hesaplama fonksiyonları ve testleri`

---
```
````

### Claude cevabı 1 · 22 Eki 2026 13:52

> # Gün 8: Plan (1. adım: onayını bekliyorum)
>
> Bu adımda henüz kod yok. Aşağıda fonksiyon listesi, girdi/çıktı tipleri, sıfıra bölme tablosu ve senin karar vermen gereken dört nokta var.
>
> ## Veri akışı ve etkilenen tablolar
>
> Bu fonksiyonlar **hiçbir tabloya dokunmaz**. Akış şöyle olacak (dashboard günü yazılacak):
>
> 1. Sunucu, merkezi tenant fonksiyonuyla aktif kiracının aboneliklerini ve plan bilgisini okur.
> 2. Bu kayıtları aşağıdaki **düz veri** biçimine çevirir.
> 3. Hesap fonksiyonları bu düz veriyle çalışır ve sonuç döndürür.
>
> Tenant filtresi 1. adımda uygulanır. Hesap fonksiyonları kiracı bilgisini hiç görmez, bu yüzden izolasyonu bozamaz.
>
> ## Girdi tipi
>
> ```ts
> type PlanAraligi = "MONTHLY" | "YEARLY";
>
> type AbonelikGirdisi = {
>   customerId: string;
>   fiyat: number;            // TL, tam sayı (planın fiyatı)
>   aralik: PlanAraligi;
>   status: "ACTIVE" | "CANCELED";
>   startedAt: Date;
>   canceledAt: Date | null;
> };
> ```
>
> Prisma tiplerini bilerek kullanmıyorum. Böylece testler veritabanı olmadan çalışır.
>
> ## Fonksiyon listesi
>
> Dosya: `src/lib/metrics.ts` (klasör yapını görünce kesinleşecek)
>
> | # | Fonksiyon | Girdi | Çıktı | Formül |
> |---|---|---|---|---|
> | 1 | `aylikFiyat` | fiyat, aralık | number | Aylıksa fiyat, yıllıksa fiyat / 12 |
> | 2 | `tarihteAktifMi` | abonelik, tarih | boolean | startedAt ≤ tarih **ve** (canceledAt boş **veya** canceledAt > tarih) |
> | 3 | `mrrHesapla` | abonelikler | number | ACTIVE aboneliklerin aylıkFiyat toplamı |
> | 4 | `tarihtekiMrr` | abonelikler, tarih | number | O tarihte aktif olanların aylıkFiyat toplamı |
> | 5 | `mrrGecmisi` | abonelikler, ay listesi | {ay, mrr}[] | Her ay için ayın son anındaki MRR (grafik için) |
> | 6 | `aktifMusteriSayisi` | abonelikler | number | ACTIVE aboneliği olan **farklı** müşteri sayısı |
> | 7 | `aylikChurn` | abonelikler, ayBaşı, sonrakiAyBaşı | number \| null | İptal eden müşteriler / ay başındaki aktif müşteriler |
> | 8 | `arpuHesapla` | mrr, aktif müşteri | number \| null | MRR / aktif müşteri |
> | 9 | `ortalamaOmur` | churn | number \| null | 1 / churn (ay) |
> | 10 | `ltvHesapla` | arpu, ömür | number \| null | ARPU × ömür |
> | 11 | `ltvCacOrani` | ltv, cac | number \| null | LTV / CAC |
> | 12 | `metrikOzeti` | abonelikler, ay, cac | özet nesnesi | Hepsini çağırır, yuvarlar, "hesaplanamadı" nedenini ekler |
>
> ## Sıfıra bölme ve "hesaplanamadı" tablosu
>
> Dönüş değeri `null` olacak. `0` kullanmıyorum, çünkü "LTV = 0 TL" yöneticiye "müşteri değersiz" mesajı verir ve bu yanlıştır. `Infinity` de kullanmıyorum, çünkü ekranda anlamsız görünür ve JSON'a çevrilemez.
>
> | Durum | Etkilenen | Sonuç | Ekranda gösterilecek açıklama |
> |---|---|---|---|
> | Ay başında aktif müşteri yok | Churn | null | "Ay başında aktif müşteri yok, churn hesaplanamadı" |
> | Churn = 0 (kimse iptal etmedi) | Ömür, LTV | null | "Bu ay iptal yok, ömür tahmin edilemiyor" |
> | Churn hesaplanamadı | Ömür, LTV, LTV/CAC | null | Zincirleme olarak aynı neden |
> | Aktif müşteri = 0 | ARPU, LTV | null | "Aktif müşteri yok" |
> | CAC girilmemiş veya 0 | LTV/CAC | null | "Ayarlardan CAC girin" |
> | Abonelik listesi boş | MRR | **0** | MRR'nin 0 olması gerçek bir değerdir, null değildir |
>
> `metrikOzeti` her null değer için bir `neden` metni de döndürecek. Dashboard bu metni doğrudan gösterebilir.
>
> ## Yuvarlama kuralı
>
> - İç hesaplarda **hiç yuvarlama yok**. Örneğin yıllık 1.000 TL'lik plan aylık 83,333... olarak taşınır. Ara adımda yuvarlarsak hata birikir.
> - Yuvarlama yalnızca `metrikOzeti` içinde, tek bir `tlYuvarla` yardımcısıyla yapılır.
> - Para değerleri (MRR, ARPU, LTV) en yakın tam TL'ye yuvarlanır (`Math.round`).
> - Oranlar (churn, LTV/CAC) 2 ondalığa, ömür 1 ondalığa yuvarlanır.
>
> ## Test planı
>
> Dosya: `src/lib/metrics.test.ts`
>
> **Dersteki örnek, iki biçimde test edilecek:**
>
> 1. Doğrudan formülle: ARPU 1.000, churn 0,04, CAC 5.000 → ömür 25, LTV 25.000, LTV/CAC 5.
> 2. Gerçekçi veriyle: ay başında 50 müşteri (her biri aylık 1.000 TL). Ay içinde 2 müşteri iptal eder, 2 yeni müşteri gelir. Ay sonunda MRR = 50.000, churn = 2/50 = %4 çıkmalı. Bu sürüm formüllerin veri üzerinde de doğru çalıştığını gösterir.
>
> **Uç durumlar (8 adet):**
>
> 1. Boş liste → MRR 0, ARPU null
> 2. Churn 0 → ömür ve LTV null
> 3. Ay başında müşteri yok → churn null
> 4. CAC 0 veya null → LTV/CAC null
> 5. Yıllık 12.000 TL → aylık 1.000. Yıllık 1.000 TL → özette 83 TL
> 6. canceledAt tam tarihe eşit → o tarihte aktif **değil**. startedAt tam tarihe eşit → aktif
> 7. Aynı müşterinin bir CANCELED ve bir ACTIVE kaydı → tek müşteri sayılır
> 8. Ay içinde başlayıp aynı ay iptal eden müşteri → churn'e dahil edilmez (aşağıdaki 2. soruya bağlı)
>
> ## Senin karar vermen gerekenler
>
> **1. Test aracı (paket kararı).** Testleri çalıştıracak bir araç gerekiyor. İki seçenek var:
>
> - **(a) Vitest** (tek geliştirme paketi, `-D` ile). TypeScript dosyalarını ayar gerektirmeden çalıştırır. Yaygın ve iyi bilinen bir pakettir. **Önerim bu**, çünkü senin için en az ayar gerektiren yol.
> - **(b) Node'un yerleşik test aracı** (`node --test`). Paket gerektirmez ama Node sürümüne bağlıdır. Ayrıca TypeScript import'larında ek ayar ister, bu da `tsconfig.json`'a dokunmak demektir.
>
> Projede zaten bir test aracı kuruluysa onu kullanırım.
>
> **2. Churn'de kim "iptal eden" sayılır?** Önerim: **ay başında aktif olup ay sonunda hiç ACTIVE aboneliği kalmayan müşteriler.** Bunun iki sonucu var:
>
> - Ay içinde gelip aynı ay giden müşteri sayılmaz. Paydada olmayan birini paya koymak churn'ü %100'ün üstüne çıkarabilir.
> - Aynı ay içinde iptal edip yeni abonelik başlatan müşteri (plan değişikliği) **churn sayılmaz**, çünkü müşteri kaybedilmemiştir.
>
> Kuralın gereği her şey müşteri bazında sayılır, abonelik bazında değil. "Ay içinde CANCELED olayı olan herkes" demek istiyorsan söyle, ona göre değiştiririm.
>
> **3. Ay sınırı hangi saat dilimine göre?** Veritabanı tarihleri UTC tutar. Bir abonelik 31 Ekim 23:30'da (Türkiye saati) iptal edilirse UTC'de hâlâ 31 Ekim 20:30 olur. Bu iptal doğru aya düşer. Ama 1 Kasım 01:00'deki bir iptal UTC'de 31 Ekim'e kayar. Önerim: ay sınırlarını **Türkiye saatine (UTC+3, yaz saati yok)** göre hesaplayan küçük bir `ayAraligi(yil, ay)` yardımcısı yazmak.
>
> **4. Fiyat nereden geliyor?** Abonelik başladığında fiyat abonelik kaydına kopyalanıyor mu, yoksa her seferinde planın güncel fiyatı mı okunuyor? Fiyat kopyalanmıyorsa, plan fiyatı değiştiğinde **geçmiş MRR grafiği de değişir**. Bunu bilmem gerekiyor.
>
> ## Benden görmek istediklerim
>
> Terminalde proje klasöründeyken şu komutları sırayla çalıştırıp çıktıları buraya yapıştır. Hiçbiri `.env` içeriğini veya parola göstermez.
>
> ```zsh
> cat package.json
> ```
> Kurulu Next.js, Prisma ve test paketlerinin sürümlerini gösterir.
>
> ```zsh
> node -v
> ```
> Node sürümünü gösterir (1. sorudaki b seçeneği için gerekli).
>
> ```zsh
> ls src
> ```
> `src` klasörü olup olmadığını ve içindeki yapıyı gösterir. Dosyayı doğru yere koymak için gerekli.
>
> ```zsh
> cat prisma/schema.prisma
> ```
> Abonelik ve plan tablolarının alanlarını gösterir (4. soru için). Bağlantı adresi bu dosyada yalnızca `env("DATABASE_URL")` olarak geçer, gerçek adres görünmez.
>
> ## Varsayımlarım
>
> - **Yenileme `startedAt` değerini değiştirmiyor.** RENEWED olayı yalnızca SUBSCRIPTION_EVENTS'e yazılıyor. Değiştiriyorsa geçmiş MRR yanlış çıkar ve bunu şemada görmem gerekir.
> - Mevcut MRR için `status = ACTIVE`, geçmiş MRR ve churn için tarihler (`startedAt`/`canceledAt`) kullanılır. İptal edilen aboneliklerde `canceledAt` her zaman dolu kabul ediliyor.
> - Girdiler sunucu tarafında doğrulanmış geliyor (negatif fiyat yok). Hesap fonksiyonları ayrıca doğrulama yapmaz.
> - Grafik noktası, her ayın son anındaki MRR'dir. İçinde bulunulan ay için "şu an" kullanılır.
>
> ## Emin olmadığım noktalar
>
> - Vitest'in güncel sürümünün senin Next.js sürümünle sorunsuz çalıştığını `package.json`'ı görmeden kesin söyleyemem. Genelde sorun çıkarmaz ama kurulumdan önce kontrol edeceğim.
> - Node yerleşik test aracının TypeScript desteği Node sürümüne göre değişiyor. `node -v` çıktısını görmeden b seçeneğini önermiyorum.
>
> Dört soruyu cevaplayıp komut çıktılarını gönderdiğinde, onayınla 2. adıma (kod dosyası) geçerim.

### Prompt 2 · 22 Eki 2026 20:11

````text
Planı onaylıyorum, şu cevaplarla:
1. Test aracı: (b) node --test. Projede zaten kurulu: ADR "ek paket yok" kararı var, src/test-destek/kancalar.mjs çözümleme kancası mevcut. Vitest ekleme, tsconfig.json'a dokunma. Yeni test dosyasını package.json'daki test betiğine ekle.
2. Churn: müşteri bazlı öneriyi kabul ediyorum. ADR'ye "iptal edenler müşteri bazlı yorumlandı" notu gidecek.
3. Ay sınırı: Türkiye saati (UTC+3) ile ayAraligi yardımcısı. Testlerde +03:00 kullan.
4. Fiyat: Gün 8'de şemaya dokunma. Şemada fiyat kopyası yoksa geçmiş MRR'nin plan fiyat değişikliğinden etkilenmesi bilinen sınır olarak ADR'ye yazılacak. Karar MRR grafiği gününde.
Dosya adlarını mevcut src/lib yapısına uydur (ls çıktısına bak). Komut çıktıları aşağıda.
````

### Claude cevabı 2 · 22 Eki 2026 20:12

> Kararlarını not aldım, ama **komut çıktıları mesaja eklenmemiş**. Mesaj "aşağıda" diye bitiyor ve altında bir şey yok. Bunları görmeden kod yazarsam iki yerde tahmin etmem gerekir, kurallarımız da buna izin vermiyor:
>
> - `package.json`'daki test betiğini değiştirmem gerekiyor. Dosyanın tam halini görmeden onu "tamamen şununla değiştir" diye veremem.
> - Test dosyasının import satırı (`.ts` uzantılı mı, uzantısız mı, `@/` ile mi) `kancalar.mjs`'in nasıl çözümleme yaptığına bağlı. Yanlış biçim seçersem test hiç çalışmaz.
>
> Proje klasöründeyken şu komutları sırayla çalıştırıp çıktıların hepsini tek mesajda gönder:
>
> ```zsh
> cat package.json
> ```
> Test betiğinin şu anki halini ve kancanın nasıl bağlandığını gösterir.
>
> ```zsh
> node -v
> ```
> Node sürümünü gösterir. `node --test` TypeScript'i sürüme göre farklı ele alır.
>
> ```zsh
> ls src/lib
> ```
> Dosya adlandırma biçimini gösterir (Türkçe mi İngilizce mi), yeni dosyayı ona göre adlandırırım.
>
> ```zsh
> cat src/test-destek/kancalar.mjs
> ```
> Kancanın import'ları nasıl çözdüğünü gösterir. Test dosyasındaki import satırını buna göre yazacağım.
>
> ```zsh
> find src -name "*.test.*"
> ```
> Projede başka test dosyası varsa adını ve yerini gösterir. Varsa birini `cat` ile göstermen, yazım biçimini birebir izlemem için yeterli olur.
>
> Bu dosyaların hiçbirinde secret olmaması gerekir. Yine de yapıştırmadan önce bir göz at: içinde gerçek bir adres veya parola görürsen `[DATABASE_URL]` gibi bir yer tutucuyla maskele.
>
> `schema.prisma` bugün için gerekmiyor. Şemaya dokunmama kararın ve hesap fonksiyonlarının düz veriyle çalışması sayesinde fiyat sorusu MRR grafiği gününe kalabilir.
>
> **Onaylanan kararlar (koda böyle yansıyacak):**
>
> 1. Test aracı `node --test` ve mevcut kanca. Yeni paket yok, `tsconfig.json`'a dokunulmayacak.
> 2. Churn müşteri bazlı: ay başında aktif olup ay sonunda ACTIVE aboneliği kalmayanlar.
> 3. `ayAraligi` Türkiye saatine (+03:00) göre hesaplanacak. Testlerdeki tarihler `+03:00` ile yazılacak.
> 4. Şemaya dokunulmayacak. Fiyat kopyası yoksa bu durum ADR'ye bilinen sınır olarak yazılacak.
>
> Çıktılar gelince kod dosyasını, test dosyasını, güncellenmiş `package.json`'ı ve test komutunu tek cevapta vereceğim.

### Prompt 3 · 22 Eki 2026 20:15

_[yapıştırılan metin]_

````text
kullanici@bilgisayar abonetakip % cat package.json
{
  "name": "abonetakip",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts",
    "test:db": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.10.1",
    "@prisma/client": "^7.10.1",
    "bcryptjs": "^3.0.3",
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^18.0.8",
    "eslint": "^9",
    "eslint-config-next": "16.4.2",
    "prisma": "^7.10.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}%                                                                                                              kullanici@bilgisayar abonetakip % node -v
v26.11.1
kullanici@bilgisayar abonetakip % ls src/lib
abonelik-kontrol.ts	donem.ts		session.test.ts		validation.ts
auth.ts			islem.ts		session.ts		yetki.test.ts
db.ts			pasife-alma.test.ts	tenant.test.ts		yetki.ts
donem.test.ts		pasife-alma.ts		tenant.ts
kullanici@bilgisayar abonetakip % cat prisma/schema.prisma
// AboneTakip veritabanı şeması (Prisma 7)
// Veritabanı adresi burada yazmaz, prisma.config.ts üzerinden .env'den okunur.

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ---------- Sabit değer listeleri ----------

enum Role {
  manager
  finance
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
}

enum PlanInterval {
  MONTHLY
  YEARLY
}

enum EventType {
  STARTED
  RENEWED
  CANCELED
}

// ---------- Tablolar ----------

// Firma (kiracı). Bu tabloda tenantId yoktur, id'nin kendisi kiracıdır.
model Tenant {
  id        String   @id @default(cuid())
  name      String
  cac       Int      @default(0) // Müşteri edinme maliyeti (TL, tam sayı)
  createdAt DateTime @default(now())

  users         User[]
  customers     Customer[]
  plans         Plan[]
  subscriptions Subscription[]
  events        SubscriptionEvent[]

  @@map("tenants")
}

// Firma kullanıcısı (manager veya finance)
model User {
  id           String   @id @default(cuid())
  tenantId     String
  email        String   @unique
  passwordHash String // bcrypt ile özetlenmiş parola, düz metin saklanmaz
  name         String?
  role         Role
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("users")
}

// Firmanın müşterisi. Silinmez, isActive=false ile pasife alınır.
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  email     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  // Aynı firmaya ait olduğunu veritabanında garanti etmek için (id + tenantId) birlikte benzersiz
  @@unique([id, tenantId])
  // Aynı firmada aynı e-posta iki müşteride kullanılamaz. Büyük/küçük harf farkı,
  // uygulamada e-posta küçük harfe çevrilerek giderilir. E-postası boş (NULL) olan
  // müşteriler bu kurala takılmaz: PostgreSQL birden fazla NULL değere izin verir.
  // Farklı firmalar aynı e-postayı kullanabilir.
  @@unique([tenantId, email])
  @@index([tenantId])
  @@map("customers")
}

// Abonelik planı. Fiyat TL cinsinden tam sayıdır. Silinmez, pasife alınır.
model Plan {
  id        String       @id @default(cuid())
  tenantId  String
  name      String
  price     Int // TL, kuruş yok
  interval  PlanInterval
  isActive  Boolean      @default(true)
  createdAt DateTime     @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("plans")
}

// Müşterinin bir plana aboneliği
model Subscription {
  id         String             @id @default(cuid())
  tenantId   String
  customerId String
  planId     String
  status     SubscriptionStatus @default(ACTIVE)
  startedAt  DateTime           @default(now())
  // Mevcut dönemin bitişi: başlatmada ve her yenilemede güncellenir (UTC)
  currentPeriodEnd DateTime
  canceledAt DateTime?
  createdAt  DateTime           @default(now())

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  // Müşteri ve plan, aboneliğin firmasıyla aynı firmaya ait olmak zorunda
  customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
  plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])

  events SubscriptionEvent[]

  @@unique([id, tenantId])
  @@index([tenantId, status])
  @@index([tenantId, customerId])
  @@index([tenantId, planId])
  @@map("subscriptions")
}

// Aboneliğin yaşam döngüsü olayları (başladı, yenilendi, iptal edildi)
model SubscriptionEvent {
  id             String    @id @default(cuid())
  tenantId       String
  subscriptionId String
  type           EventType
  createdAt      DateTime  @default(now())

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])

  @@index([tenantId, type, createdAt])
  @@index([subscriptionId])
  @@map("subscription_events")
}%                                                                                                              kullanici@bilgisayar abonetakip % cat src/lib/donem.ts
// ABONELİK DÖNEM HESABI
//
// Bu dosyadaki fonksiyon "saf"tır: veritabanına dokunmaz, saate bakmaz, aynı
// girdiye her zaman aynı sonucu verir. Bu yüzden kolayca test edilir.
//
// Bütün hesap UTC'ye göre yapılır. Ekranda tarih gösterilirken Türkiye saatine
// çevrilir (bkz. abonelikler sayfası).

// Plan aralığı. Veritabanındaki PlanInterval değerleriyle aynıdır.
export type Aralik = "MONTHLY" | "YEARLY";

// Verilen tarihten bir aralık (1 ay veya 1 yıl) sonrasını hesaplar.
//
// Ay sonu taşması önlenir: 31 Ocak + 1 ay = 28 Şubat (artık yılda 29 Şubat).
// JavaScript'in kendi setMonth işlemi 31 Ocak + 1 ay için 3 Mart verirdi;
// bu, müşteriye bir günden fazla ek süre vermek demektir.
//
// Not: Yenilemede yeni bitiş, mevcut bitişten hesaplanır. Bir ay sonu kısaltması
// olduysa (31 Ocak -> 28 Şubat) sonraki dönemler 28'inden sürer. Bu kabul edilmiş
// bir basitleştirmedir.
export function donemSonu(baslangic: Date, aralik: Aralik): Date {
  const eklenecekAy = aralik === "YEARLY" ? 12 : 1;

  const yil = baslangic.getUTCFullYear();
  const ay = baslangic.getUTCMonth();
  const gun = baslangic.getUTCDate();

  // Hedef ayı bul (yıl taşmasını da hesaba kat).
  const hedefSira = ay + eklenecekAy;
  const hedefYil = yil + Math.floor(hedefSira / 12);
  const hedefAy = hedefSira % 12;

  // Hedef ayın son günü: bir sonraki ayın 0. günü.
  const hedefAyinSonGunu = new Date(
    Date.UTC(hedefYil, hedefAy + 1, 0)
  ).getUTCDate();
  const hedefGun = Math.min(gun, hedefAyinSonGunu);

  return new Date(
    Date.UTC(
      hedefYil,
      hedefAy,
      hedefGun,
      baslangic.getUTCHours(),
      baslangic.getUTCMinutes(),
      baslangic.getUTCSeconds(),
      baslangic.getUTCMilliseconds()
    )
  );
kullanici@bilgisayar abonetakip %
````

### Prompt 4 · 22 Eki 2026 20:17

````text
Çıktılar ekte. Gün 8 kararlarım değişmedi.
````

_[ek dosya: gun8_cikti.txt]_

### Claude cevabı 3 · 22 Eki 2026 20:19

> Kancanın son satırı ("});") dosyanın sonunda "### test dosyaları" ile aynı satırda; onu düzeltiyorum.
> Son satırdaki "}### node -v" ekini temizliyorum.
> # Gün 8: Metrik fonksiyonları ve testleri
>
> Üç dosya hazır: `metrikler.ts`, `metrikler.test.ts` ve `package.json`. Testleri senin `kancalar.mjs` ve `donem.ts` dosyalarının kopyalarıyla çalıştırdım. **25 testin 25'i geçti** (yeni 17 test ve senin mevcut 8 `donem` testin).
>
> Test sırasında kendi kodumda bir hata çıktı ve düzelttim. Ayın tam sınırında, yani 1 Kasım 00:00'da yapılan bir iptal ne Ekim'in ne de Kasım'ın churn'üne giriyordu. Artık "ay başındaki müşteriler" bir önceki ayın son anına göre sayılıyor, böyle bir iptal de Kasım'a düşüyor. Bunu kontrol eden test dosyada duruyor.
>
> ## Dosyaları yerleştirme
>
> 1. **Yeni dosya oluştur:** `src/lib/metrikler.ts`. İçeriği ekteki `metrikler.ts` dosyasının tamamı. Adı `donem.ts` ve `yetki.ts` gibi Türkçe tuttum. Plan aralığı tipi `donem.ts`'teki `Aralik`'ten alınıyor, tip iki yerde ayrı ayrı tanımlanmıyor.
> 2. **Yeni dosya oluştur:** `src/lib/metrikler.test.ts`. İçeriği ekteki `metrikler.test.ts` dosyasının tamamı. Import satırı `donem.test.ts`'teki gibi `.ts` uzantılı.
> 3. **Dosyanın içeriğini tamamen şununla değiştir:** proje kökündeki `package.json` → ekteki `package.json`. Tek fark, `test` betiğinin sonuna eklenen `src/lib/metrikler.test.ts`. Paket listesine dokunulmadı. `metrikler.test.ts` veritabanı kullanmadığı için `test:db`'ye değil `test`'e eklendi.
>
> ## Test komutu
>
> ```zsh
> npm test
> ```
> `package.json`'daki `test` betiğini çalıştırır. Mevcut testlerin hepsi ve yeni metrik testleri birlikte koşar.
>
> Sonuçta `# fail 0` görmelisin. Sorun çıkarsa çıktının tamamını buraya yapıştır.
>
> ```zsh
> npm run build
> ```
> TypeScript tip kontrolünü yapar. Benim ortamımda tip kontrolü aracı indirilemedi, bu yüzden bu adımı senin çalıştırman gerekiyor.
>
> ## Formüllerin karşılaştırması
>
> | Tanımın | Koddaki karşılığı | Uyuyor mu? |
> |---|---|---|
> | MRR: ACTIVE aylık toplam, yıllık / 12 | `mrrHesapla`: `status === "ACTIVE"` olanlar, `aylikFiyat` ile toplanıyor | ✓ |
> | Tarihteki MRR: startedAt ≤ t ve (canceledAt boş veya > t) | `tarihteAktifMi` bu koşulu birebir uyguluyor | ✓ |
> | Churn: ay içinde iptal edenler / ay başındaki aktif müşteriler | Payda ve pay `customerId` kümesiyle sayılıyor. Plan değiştiren müşteri ve aynı ay gelip giden müşteri churn sayılmıyor | ✓ (müşteri bazlı) |
> | ARPU = MRR / aktif müşteri | `arpuHesapla`. Aktif müşteri **farklı** `customerId` sayısı | ✓ |
> | Ömür = 1 / churn | `ortalamaOmur` | ✓ |
> | LTV = ARPU × ömür | `ltvHesapla` | ✓ |
> | LTV/CAC | `ltvCacOrani` | ✓ |
>
> **Müşteri bazlı sayım (teyit):** Churn ve aktif müşteri sayısında her şey `customerId` üzerinden sayılıyor, abonelik sayısı hiç kullanılmıyor. "Müşteri başına tek ACTIVE abonelik" kuralı bozulsa bile bir müşteri iki kez sayılmaz. Bunu gösteren test: "aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır".
>
> **Dersteki örnek iki biçimde test edildi:**
> - Doğrudan formüllerle: ömür 25, LTV 25.000, LTV/CAC 5.
> - 52 abonelik kaydıyla: 50 müşteri ay başında var, 2'si ayrılıyor, 2 yeni geliyor. Sonuç MRR 50.000, churn 0,04, LTV 25.000, LTV/CAC 5.
>
> ## Elle doğrulama (bitiş kontrolündeki hesap makinesi adımı)
>
> Hesap makinesinde sırayla şunları yap:
>
> 1. 50 × 1000 = **50.000** (MRR)
> 2. 50.000 ÷ 50 = **1.000** (ARPU)
> 3. 1 ÷ 0,04 = **25** (ömür)
> 4. 1.000 × 25 = **25.000** (LTV)
> 5. 25.000 ÷ 5.000 = **5** (LTV/CAC)
>
> ## ADR'ye eklenecek notlar
>
> İstersen ADR dosyana aynen yapıştırabilirsin:
>
> ```markdown
> - Churn müşteri bazlı yorumlandı: payda ay başında aktif aboneliği olan farklı
>   müşteriler, pay bunlardan ay sonunda hiç aktif aboneliği kalmayanlar. Plan
>   değiştiren müşteri ve aynı ay gelip giden müşteri churn sayılmaz.
> - Ay sınırları Türkiye saatine (UTC+3) göre hesaplanır. "Ay başı" bir önceki
>   ayın son anıdır; böylece tam 1'i 00:00'daki iptal yeni aya düşer.
> - Hesaplanamayan metrikler null döner (0 veya Infinity değil); nedeni metin
>   olarak verilir. Yuvarlama yalnızca çıktıda yapılır: para tam TL, oranlar
>   2 ondalık, ömür 1 ondalık.
> - Bilinen sınır: Abonelik kaydında fiyat kopyası yok. Plan fiyatı değişirse
>   geçmiş MRR grafiği de değişir. Karar MRR grafiği gününe bırakıldı.
> - CAC veritabanında varsayılan 0'dır. 0, "girilmemiş" kabul edilir ve
>   LTV/CAC hesaplanmaz.
> ```
>
> ## Commit
>
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> Repoda parola izi arar. Çıktı boş olmalı.
>
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> Repoda gerçek Neon sunucu adı arar. Sonuç 0 olmalı.
>
> ```zsh
> git add src/lib/metrikler.ts src/lib/metrikler.test.ts package.json
> ```
> Yalnızca bugün değişen üç dosyayı commit'e hazırlar.
>
> ```zsh
> git commit -m "feat: metrik hesaplama fonksiyonları ve testleri"
> ```
> Değişiklikleri kaydeder.
>
> ## Varsayımlarım
>
> - `src/lib/donem.ts` dosyasında `Aralik` tipi `export` edilmiş durumda. Senin gönderdiğin içerikte öyle.
> - Dashboard'daki MRR, ARPU ve aktif müşteri sayısı **bugünkü** duruma (`status`) göre hesaplanıyor. Churn ve buna bağlı ömür ve LTV ise `metrikOzeti`'ne verilen aya göre hesaplanıyor. Hangi ayın verileceğine dashboard gününde karar verilecek (içinde bulunulan ay mı, son tamamlanan ay mı).
> - Abonelik yenilemesi `startedAt` değerini değiştirmiyor. Şemada yenilemede yalnızca `currentPeriodEnd`'in güncellendiği yazıyor, bu varsayım şemayla uyumlu.
> - İptal edilen her abonelikte `canceledAt` dolu.
>
> ## Emin olmadığım noktalar
>
> - **Node sürümü:** Testleri Node 22'de çalıştırdım, sende Node 26 var. İki sürüm de TypeScript'i ve kancanın kullandığı `registerHooks`'u destekliyor, sorun beklemiyorum. Yine de `npm test` sonucu kesin cevabı verecek.
> - **Tip kontrolü:** `npm run build`'i ben çalıştıramadım. `import { type AbonelikGirdisi, ... }` yazımı senin `tsconfig` ayarınla sorun çıkarırsa hatayı bana gönder.
> - **Churn'ün yuvarlanması:** Plandaki karar gereği churn 2 ondalığa yuvarlanıyor. Bu yüzden %3,33 gibi bir değer ekranda %3 görünür. Dashboard'da yüzde olarak ondalıklı göstermek istersen yuvarlamayı 4 ondalığa çıkarmamız gerekir. Bunu dashboard gününde birlikte karar verelim.

### Prompt 5 · 22 Eki 2026 20:28

````text
elle doğrulama kısmında ne yapmam gerektiğini tam olarak anlayamadım
````

### Claude cevabı 4 · 22 Eki 2026 20:28

> Bu adımın amacı, bilgisayarın hesapladığı sonuçları senin de kendi elinle bulup karşılaştırman. Testler "kod 25.000 buldu" diyor. Sen hesap makinesiyle aynı sonuca ulaşırsan formülün doğru olduğunu kendin görmüş olursun. Kodla ilgili hiçbir şey yapmayacaksın, sadece beş işlem yapacaksın.
>
> **1. Hesap makinesini aç.** Cmd + Boşluk tuşlarına bas, "Hesap Makinesi" yaz ve Enter'a bas.
>
> **2. Sırayla şu işlemleri yap.** Her adımda bir öncekinin sonucunu kullanıyorsun:
>
> | Adım | Ne hesaplıyorsun | Tuşla | Çıkması gereken |
> |---|---|---|---|
> | 1 | MRR: 50 müşteri × aylık 1.000 TL | `50 × 1000 =` | 50000 |
> | 2 | ARPU: MRR ÷ müşteri sayısı | `50000 ÷ 50 =` | 1000 |
> | 3 | Ortalama ömür: 1 ÷ churn (%4 = 0,04) | `1 ÷ 0,04 =` | 25 |
> | 4 | LTV: ARPU × ömür | `1000 × 25 =` | 25000 |
> | 5 | LTV/CAC: LTV ÷ 5.000 TL | `25000 ÷ 5000 =` | 5 |
>
> Not: Mac Türkçe ayardaysa ondalık ayırıcı virgüldür. 3. adımda `0,04` yaz. Virgül kabul edilmezse `0.04` dene.
>
> **3. Sonuçları karşılaştır.** Bulduğun değerler dersteki beklenen sonuçlarla aynı olmalı: MRR 50.000, ömür 25 ay, LTV 25.000, LTV/CAC 5. `npm test` çıktısında aşağıdaki iki satırın başında `ok` yazıyorsa, kod da aynı sayıları bulmuş demektir:
>
> - `ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5`
> - `ders örneği (gerçekçi veriyle): ...`
>
> Elle bulduğun sonuçlar tutuyor ve bu iki satır `ok` ise bitiş kontrolündeki "Bir formülü elle doğruladın" kutusunu işaretleyebilirsin.
>
> Bir sonuç farklı çıkarsa hangi adımda ne bulduğunu yaz, birlikte bakalım. Hocana göstermek istersen bu tabloyu ekran görüntüsüyle `prompt_cevap/` klasörüne ekleyebilirsin. İçinde gizli bir bilgi olmadığı için maskelemen gerekmez.

### Prompt 6 · 22 Eki 2026 20:30

````text
beklenilen gibi her şey
````

### Claude cevabı 5 · 22 Eki 2026 20:30

> Güzel. Elle bulduğun sonuçlar kodla aynı, yani bitiş kontrolündeki üç madde de tamam.
>
> Gün 8'i kapatmak için sırayla şunları yap:
>
> 1. Henüz çalıştırmadıysan `npm run build` komutunu çalıştır. Bu komut TypeScript tip kontrolünü yapar. Ben bu adımı kendi ortamımda deneyemedim, o yüzden bir hata çıkarsa çıktısını bana gönder.
> 2. Önceki mesajdaki ADR notlarını ADR dosyana ekle.
> 3. Commit öncesi iki güvenlik taramasını çalıştır. Önceki mesajdaki iki `git --no-pager grep ...` komutu bunlar. İlkinin çıktısı boş, ikincisinin sonucu 0 olmalı.
> 4. Dosyaları ekle ve commit'le:
>
> ```zsh
> git add src/lib/metrikler.ts src/lib/metrikler.test.ts package.json
> ```
> Bugün değişen üç dosyayı commit'e hazırlar. ADR dosyasını da güncellediysen onun yolunu da bu satırın sonuna ekle.
>
> ```zsh
> git commit -m "feat: metrik hesaplama fonksiyonları ve testleri"
> ```
> Değişiklikleri kaydeder.
>
> ```zsh
> git push
> ```
> Commit'i GitHub'a gönderir.
>
> Bunlar bitince Gün 8 tamamlanmış olur. Sıradaki güne geçmek istediğinde görev metnini gönder, yine önce planla başlarım.

### Prompt 7 · 22 Eki 2026 20:31

````text
kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 72ms

  Creating an optimized production build ...
✓ Compiled successfully in 329ms
  Running TypeScript ...
  Finished TypeScript in 805ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 411ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 76ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 8ms

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /abonelikler
├ ƒ /ayarlar
├ ƒ /dashboard
├ ƒ /giris
├ ƒ /kayit
├ ƒ /kullanicilar
├ ƒ /musteriler
├ ƒ /musteriler/[id]
├ ƒ /planlar
└ ƒ /planlar/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
````

### Claude cevabı 6 · 22 Eki 2026 20:31

> Build başarılı oldu. `Finished TypeScript` satırından sonra hata çıkmadı, yani yeni dosyalar senin `tsconfig` ayarlarınla tip kontrolünden de geçti. Önceki mesajda tip kontrolü için belirttiğim belirsizlik böylece kapandı.
>
> Çıktıdaki `Environments: .env` satırı, Next.js'in yerel `.env` dosyanı okuduğunu gösteriyor. Bu normal, ama bu dosya repoya girmemeli. Commit'ten önce şunu da çalıştır:
>
> ```zsh
> git check-ignore .env
> ```
> `.env` dosyasının Git tarafından yok sayılıp sayılmadığını kontrol eder. Çıktı `.env` olmalı. Çıktı boş gelirse durup bana yaz.
>
> Bundan sonra kalan adımlar şunlar:
>
> 1. ADR notlarını ADR dosyana ekle.
> 2. İki güvenlik taramasını çalıştır. İlkinin çıktısı boş, ikincisinin sonucu 0 olmalı.
> 3. `git add`, `git commit` ve `git push` komutlarını önceki mesajdaki sırayla çalıştır.
>
> Bunlar bitince Gün 8 tamamlanmış olur.

### Prompt 8 · 22 Eki 2026 20:36

````text
gün 8 bu kadar mıydı
````

### Claude cevabı 7 · 22 Eki 2026 20:36

> Evet, Gün 8'in görevi bu kadardı. Bu günün işi metrikleri hesaplayan fonksiyonları yazmak ve test etmekti. Bunlar henüz ekranda görünmüyor. Dashboard'a bağlanmaları sonraki günlerin işi.
>
> Görevin istedikleriyle karşılaştırırsak:
>
> | Görevde istenen | Durum |
> |---|---|
> | MRR, tarihteki MRR, churn, ARPU, ömür, LTV, LTV/CAC fonksiyonları | ✓ `metrikler.ts` içinde, ayrıca aylık MRR geçmişi de var |
> | Fonksiyonlar veritabanına dokunmaz | ✓ Düz veriyle çalışıyor |
> | Sıfıra bölme durumları `null` ile ele alındı ve nedeni yorumda açıklandı | ✓ |
> | Yuvarlama kuralı tek yerde | ✓ `yuvarla` yardımcısı |
> | Her fonksiyonun üstünde Türkçe formül yorumu | ✓ |
> | Dersteki örnek ve en az 5 uç durum için test | ✓ Ders örneği 2 testte, uç durumlar 15 testte |
> | Test komutu | ✓ `npm test` |
> | Bitiş kontrolü: ders örneği geçiyor | ✓ |
> | Bitiş kontrolü: sıfıra bölme testleri geçiyor | ✓ |
> | Bitiş kontrolü: bir formül elle doğrulandı | ✓ Hesap makinesiyle yaptın |
> | Commit | ⏳ Kaldı |
>
> Gün 8'i kapatmak için şunlar kaldı: `git check-ignore .env` kontrolü, ADR notları, iki güvenlik taraması, `git add`, `git commit` ve `git push`. Bunlar bitince sıradaki güne geçebiliriz.
>
> Sonraki günlere taşınan iki karar var:
>
> - **Fiyat kopyası:** Plan fiyatı değişirse geçmiş MRR grafiği de değişiyor. Bunu MRR grafiği gününde çözeceğiz.
> - **Dashboard ayrıntıları:** Churn hangi aya göre gösterilecek (içinde bulunulan ay mı, son tamamlanan ay mı) ve yüzdede kaç ondalık görünecek, buna dashboard gününde karar vereceğiz.

