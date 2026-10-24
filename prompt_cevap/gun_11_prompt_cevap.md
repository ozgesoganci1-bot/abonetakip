# Gün 11: Aylık MRR grafiği, boş durum ve hata ekranları

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 24 Eki 2026 (Türkiye saati). **Kapsam:** 34 prompt ve 33 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Ad taramasının kendi arama deseni `[AD_DESENI]` olarak yazılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 11 promptu: aylık MRR grafiği, boş durum ve hata ekranları. Önce karar notu ve plan, onaydan sonra iki parçada ve iki PR ile (A: grafik, PR #37; B: ekranlar, PR #38). Plan ve uygulama ayrı bir sohbette yapıldı |
| **Ne üretildi** | Parça A: `sonAylar`, `mrr-grafigi.ts` (eksen ve özet cümle), `kisaAyEtiketi`, `MrrGrafigi.tsx` (paketsiz SVG, sunucuda çizilir, özet cümle, açılır tablo), aboneliği olan planda fiyat ve aralık kilidi, `demo:gecmis` betiği; `npm test` 90 ve `npm run test:db` 49 test. Parça B: kök 404, `error.tsx`, `global-error.tsx`, `loading.tsx`, boş durum başlıkları, giriş ve kayıt formlarının ortak mesaj yapısına geçmesi, `lang="tr"`; ADR Gün 11 bölümü |
| **Düzeltme gerekti mi** | Evet: (1) ilk planda projede olmayan klasör yolları (`lib/metrics/`) ve ay sınırı için yeni bir fonksiyon vardı, mevcut `metrikler.ts`, `mrrGecmisi` ve `turkiyeAyi` kullanıldı; (2) geçmiş MRR için fiyat kopyası riski ilk planda yoktu, iptal edilmiş aboneliği olan planlarda da fiyat ve aralık kilitlendi (ADR D1 kapandı); (3) AI işi tek commit olarak planlamıştı, kuralımıza uygun küçük commitlere bölündü; (4) sohbetin elindeki kurallar eskiydi (iki tarama), güncel kurallar eklendi; (5) AI iki kez çok satırlı commit komutu verdi, tek satırlık sürümle değiştirildi; (6) Parça B birleştirilirken GitHub varsayılan açıklaması beş commit mesajını tekrarlıyordu, ekler tek blokta en sonda kalacak biçimde düzeltildi; (7) `loading.tsx` ile panel 404 ekranları HTTP 200 döner, ölçülüp ADR bilinen sınırı olarak yazıldı |

## Gün 11 sohbeti (planlar, onaylar, iki parça, commitler ve test sonuçları)

_Plan ve uygulama bu sohbette yapıldı. Parça A (grafik, PR #37) ve Parça B (ekranlar, PR #38) aynı sohbette yürütüldü._

### Prompt 1 · 24 Eki 2026 08:24

````text
```markdown
Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: ## Gün 11 • Aylık MRR grafiği, boş durum ve hata ekranları

**Amaç:** MRR geçmişini görselleştirmek, uygulamayı hata ve boşluklara karşı sağlamlaştırmak.

```
[Görev] Dashboard'a son 12 ayın aylık MRR grafiğini ekle ve uygulamanın
hata ve boş durum ekranlarını tamamla.

Grafik:
- Gün 8'deki "belirli tarihteki MRR" fonksiyonunu her ayın son günü için
  çağırarak son 12 ayın MRR değerini hesapla.
- Önce paketsiz, Tailwind veya basit SVG ile çözüm mümkün mü değerlendir.
  Paket şartsa en yaygın ve bakımı sürdürülen seçeneği öner, adını ve
  gerekçesini yaz, npm'de varlığını kontrol etmem için ayrıca belirt.
- Eksenlerde ay adı (Türkçe) ve TL değeri, hover'da değer görünsün.

Ekranlar:
- Boş durum: müşteri yok, plan yok, abonelik yok, grafik verisi yok.
- Hata sayfaları: 404 ("bulunamadı") ve genel hata. Yetkisiz erişimde
  (403) anlaşılır bir mesaj.
- Yüklenme durumları.
- Formlarda tutarlı hata ve başarı mesajları.

[Kısıtlar]
- Veri tenant yardımcısından gelir. Grafik hesabı istemcide değil
  sunucuda yapılır.
- Türkçe metin tutarlılığı: tüm başlıklar, düğmeler ve hatalar Türkçe.
- Erişilebilirlik: renk tek başına anlam taşımasın, grafiğe metin
  alternatifi (özet cümle) ekle.
- Yeni özellik ekleme.

[Format] 1) Karar notu: grafik yaklaşımı ve gerekçe (onay bekle).
2) Dosyalar tam yollarıyla. 3) Sınama listesi: boş hesap, tek abonelik,
12 aydan eski veri, yıllık plan.

[Doğrulama] Yıllık planın aylık MRR'a doğru yansıdığını, ay sınırlarını
(ayın son günü) ve saat dilimi riskini düşün. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Grafik değerleri Gün 8 testlerindeki mantıkla uyuşuyor (elle bir ayı hesapla)
- [ ] Boş ve hata ekranları denendi (var olmayan adres, başka kiracının kimliği)
- **Commit:** `feat: aylık MRR grafiği, boş durum ve hata ekranları`

---
```
````

### Claude cevabı 1 · 24 Eki 2026 08:25

> # Gün 11 Planı: Aylık MRR grafiği, boş durum ve hata ekranları
>
> Henüz hiçbir dosyayı değiştirmiyorum. Önce karar notunu onaylaman, sonra aşağıda istediğim dosyaları göstermen gerekiyor.
>
> ---
>
> ## 1) Karar notu: Grafik yaklaşımı (onayını bekliyor)
>
> **Önerim: Paket eklemeden, sunucuda çizilen basit SVG çubuk grafik.**
>
> Gerekçeler:
>
> 1. **Paket gerekmiyor.** 12 çubuk, iki eksen ve etiketler birkaç düzine satır SVG ile çizilebilir. Yeni paket eklemek bakım yükü ve "var mı, güvenilir mi" kontrolü demek.
> 2. **Hesap ve çizim sunucuda kalır.** Grafik bir Server Component olur. Tarayıcıya JavaScript gitmez, veri istemcide hesaplanmaz. Bu da kısıtınla birebir uyuşuyor.
> 3. **Hover için JavaScript gerekmez.** Her çubuğun içine SVG'nin kendi `<title>` etiketini koyarız. Fare çubuğun üzerine gelince tarayıcı "Mart 2026: 12.500 TL" gibi bir ipucu gösterir. Ek olarak Tailwind ile çubuğun rengini koyulaştırırız.
> 4. **Erişilebilirlik:**
>    - Grafiğin altında bir özet cümle: "Son 12 ayda MRR 8.000 TL'den 12.500 TL'ye yükseldi. En yüksek değer Eylül 2026."
>    - "Değerleri tablo olarak göster" diye açılan bir bölüm (`<details>`). Ekran okuyucu kullanan biri de, rengi ayırt edemeyen biri de değerlere ulaşır.
>    - Renk tek başına anlam taşımaz. Değerler her zaman metin olarak da yazılır.
> 5. **Türkçe biçimlendirme:** Ay adları ve TL değerleri, Node.js'in yerleşik `Intl` aracıyla `tr-TR` olarak yazılır (paket gerekmez).
>
> **Paket şart olsaydı:** En yaygın seçenek **Recharts** olurdu (React için, bakımı sürüyor). Ama istemci tarafında çalışır ve sayfaya JavaScript ekler. Bu yüzden önermiyorum. Yine de bilgi olarak: npm'de `recharts` adıyla kontrol edebilirsin.
>
> **Hesaplama yaklaşımı:**
> - Kiracının aboneliklerini tenant yardımcısından **bir kez** çekeriz.
> - Gün 8'deki "belirli tarihteki MRR" fonksiyonunu bu liste üzerinde 12 farklı tarih için çağırırız (12 ayrı veritabanı sorgusu yerine).
> - Bunun için Gün 8 fonksiyonunun saf fonksiyon olması gerekiyor (abonelik listesi + tarih alıp sayı döndürmesi). Değilse küçük bir uyarlama önereceğim. Kodu görünce karar vereceğiz.
>
> ---
>
> ## 2) Saat dilimi ve ay sınırı (önemli risk)
>
> - Render sunucuları **UTC** saatinde çalışır. Türkiye ise **UTC+3** (yaz saati uygulaması yok).
> - Risk: 31 Mart saat 23:30'da (İstanbul) iptal edilen bir abonelik, UTC'de hâlâ 31 Mart 20:30 olur. Bu sorun değil. Ama 1 Nisan saat 01:00'de (İstanbul) başlayan abonelik UTC'de **31 Mart 22:00** görünür ve yanlışlıkla Mart grafiğine girer.
> - Çözüm: "Ayın son günü" yerine **"bir sonraki ayın 1'i, saat 00:00 İstanbul, eksi 1 milisaniye"** anını kullanırız. Bunu paket kullanmadan, UTC'den 3 saat çıkararak hesaplayan küçük bir saf fonksiyon yazarız ve testini ekleriz.
> - **İçinde bulunduğumuz ay:** Ay sonu henüz gelmedi. Bu ay için "bugün itibarıyla MRR" gösterilir ve etikette "(bu ay)" yazar.
>
> ---
>
> ## 3) Dosyalar (tahmini, kodu görünce kesinleşecek)
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `lib/metrics/monthEnds.ts` | Yeni | Son 12 ayın kapanış anlarını İstanbul saatine göre hesaplar (saf fonksiyon) |
> | `lib/metrics/monthEnds.test.ts` | Yeni | Ay sınırı ve saat dilimi testleri |
> | `lib/metrics/mrrHistory.ts` | Yeni | Gün 8 fonksiyonunu 12 kez çağırıp `{ay, mrr}` listesi döndürür |
> | `lib/metrics/mrrHistory.test.ts` | Yeni | Yıllık plan, eski veri, iptal testleri |
> | `components/MrrChart.tsx` | Yeni | SVG grafik + özet cümle + açılır tablo |
> | `components/EmptyState.tsx` | Yeni | Ortak boş durum kutusu (başlık, açıklama, yönlendirme düğmesi) |
> | `components/FormMessage.tsx` | Yeni | Ortak hata/başarı mesajı (ikon + metin, sadece renk değil) |
> | `app/not-found.tsx` | Yeni | 404 "Aradığınız kayıt bulunamadı" |
> | `app/error.tsx` | Yeni | Genel hata ekranı, "Tekrar dene" düğmesi |
> | `app/global-error.tsx` | Yeni | Ana yerleşim de çökerse son çare ekranı |
> | `app/yetkisiz/page.tsx` | Yeni | 403 "Bu sayfayı görme yetkiniz yok" |
> | `.../loading.tsx` | Yeni | Dashboard, müşteriler, planlar, abonelikler için yüklenme ekranı |
> | Dashboard sayfası | Değişecek | Grafiği ekler |
> | Müşteri/plan/abonelik liste sayfaları | Değişecek | Boş durumu ekler |
> | Form bileşenleri | Değişecek | Mesajları `FormMessage` ile tutarlı hale getirir |
> | Rol kontrol yardımcısı | Değişebilir | Yetkisiz kullanıcıyı `/yetkisiz` sayfasına yönlendirir |
>
> Not: Next.js'in yeni sürümlerinde deneysel bir `forbidden()` özelliği var. Deneysel olduğu için kullanmayı önermiyorum. Yerine ayrı bir `/yetkisiz` sayfası kullanırız. API rotaları ise gerçek 403 kodu döndürmeye devam eder.
>
> ---
>
> ## 4) Senden istediklerim (onaydan sonra)
>
> Mevcut yapıya uymam için şunları görmem lazım. Terminalde proje klasöründeyken:
>
> **Komut 1: Klasör yapısını listeler** (yalnızca dosya adlarını gösterir, içerik basmaz)
> ```
> find app components lib -type f | sort
> ```
>
> **Komut 2: Next.js ve Prisma sürümlerini gösterir**
> ```
> grep -E '"(next|react|prisma|@prisma/client)"' package.json
> ```
>
> Sonra şu dosyaların içeriğini yapıştır (içlerinde gerçek adres veya parola yoksa; varsa önce maskele):
> 1. Gün 8'deki MRR fonksiyonu ve test dosyası
> 2. Tenant yardımcı fonksiyonu
> 3. Rol kontrol yardımcısı
> 4. Dashboard sayfası
> 5. Örnek olarak bir liste sayfası (ör. müşteriler) ve bir form
> 6. `prisma/schema.prisma` içindeki abonelik modeli (özellikle başlangıç ve iptal tarihi alanları)
>
> ---
>
> ## 5) Sınama listesi
>
> | Durum | Beklenen |
> |---|---|
> | **Boş hesap** (hiç müşteri/plan yok) | Dashboard'da "Henüz veri yok" kutusu ve "İlk planını oluştur" düğmesi. Grafik yerine boş durum mesajı, hata yok |
> | **Tek abonelik** (aylık 500 TL, 15 Mart'ta başladı) | Şubat ve öncesi 0 TL, Mart'tan itibaren 500 TL |
> | **12 aydan eski veri** (2 yıl önce başlamış, hâlâ aktif) | 12 ayın tamamında görünür; 12. aydan önceki aylar grafikte yer almaz |
> | **Yıllık plan** (12.000 TL/yıl) | Her ay 1.000 TL olarak görünür |
> | **Ay içinde iptal** (10 Haziran'da iptal) | Mayıs'ta dahil, Haziran sonunda dahil değil |
> | **Ay sınırı** (1 Nisan 01:00 İstanbul'da başladı) | Mart'ta görünmez, Nisan'da görünür |
> | **Var olmayan adres** (`/musteriler/abc123`) | 404 ekranı |
> | **Başka kiracının kaydı** | 404 ekranı (403 değil, kaydın varlığı bile belli olmaz) |
> | **finance kullanıcısı ayarlara giriyor** | Yetkisiz ekranı |
>
> **Elle hesap örneği (bitiş kontrolü için):** Aylık 500 TL ve yıllık 12.000 TL iki aktif abonelik varsa, o ayın MRR'ı = 500 + (12.000 / 12) = **1.500 TL** olmalı. Grafikteki değerle bunu karşılaştıracağız.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Yıllık planda yuvarlama:** 1.000 / 12 = 83,33 TL gibi küsuratlı sonuçlar çıkabilir. Gün 8'de yuvarlamanın her abonelikte mi yoksa toplamda mı yapıldığını görmem lazım. Grafik aynı kuralı kullanmalı, yoksa dashboard'daki MRR ile grafikteki son değer farklı çıkar.
> 2. **Geçmiş durum bilgisi:** Geçmişteki bir tarihte aboneliğin aktif olup olmadığını bilmek için iptal tarihine ihtiyaç var. Bunun abonelik tablosunda mı yoksa SUBSCRIPTION_EVENTS tablosunda mı tutulduğunu bilmiyorum.
> 3. **Gün 8 fonksiyonunun saf olup olmadığı:** Veritabanına kendisi soru soruyorsa küçük bir uyarlama gerekecek.
> 4. **Tarih alanlarının türü:** Prisma `DateTime` alanları PostgreSQL'de saat dilimli saklanıyor varsayıyorum, şemadan doğrulayacağım.
> 5. **Formların yapısı:** Server Action mı, API rotası mı kullandığını bilmiyorum; mesaj bileşenini buna göre bağlayacağım.
> 6. **Next.js sürümü:** `error.tsx` ve `not-found.tsx` App Router'da standart, ama sürüme göre küçük farklar olabilir; `package.json`'u görünce kontrol edeceğim.
>
> **Senden onay beklediğim tek karar:** Paketsiz SVG grafik yaklaşımı uygun mu? Onaylarsan ve yukarıdaki dosyaları paylaşırsan, ilk adım olarak ay sınırı fonksiyonu ve testleriyle başlarım.

### Prompt 2 · 24 Eki 2026 11:02

````text
Karar notunu onaylıyorum: paketsiz, sunucuda çizilen SVG grafik, özet cümle ve açılır tablo uygun. Ama plana geçmeden önce şu düzeltmeleri yap:

1) Yollar: Projede her şey src/ altında (src/app/(panel)/..., src/lib/..., src/components/ui/...). app, lib, components kökte yok. Komut 1'i şöyle düzelt: find src prisma -type f | sort. Yeni bir lib/metrics/ klasörü açma, mevcut yapıya uy: hesaplar src/lib/metrikler.ts ve src/lib/dashboard-verisi.ts içinde. Dosya adlarını projedeki adlandırmaya uydur (örneğin metrikler, bicim, riskli-abonelikler gibi Türkçe adlar).

2) Tekrar yazma: Türkiye saatine göre ay sınırı için src/lib/metrikler.ts içinde turkiyeAyi zaten var ve testli. monthEnds yazmadan önce onu yeniden kullanabilir misin değerlendir. Yeni fonksiyon gerekiyorsa nedenini yaz.

3) Geçmiş MRR için fiyat: Bir ayın MRR'ını geçmiş tarihte hesaplamak için, o tarihte aboneliğin aktif olup olmadığını ve o zamanki fiyatı bilmemiz gerekir. Plan fiyatı sonradan değişirse eski aylar yanlış çıkabilir. Gün 8'de fiyat kopyası ile ilgili bir karar alındı. docs/02_ADR.md içindeki Gün 8 bölümünü ve prisma/schema.prisma içindeki Subscription modelini isteyeceğin dosyalara ekle. Bu riski ve iptal tarihinin nerede tutulduğunu planına ve varsayımlarına yaz. Emin olmadığın yerde tahmin etme, bana sor.

4) Bölme: Gün 11'i iki parçaya böl, her biri ayrı dal ve ayrı PR olsun. Parça A: grafik (ay sınırı, geçmiş MRR hesabı ve testleri, SVG bileşeni, dashboard'a ekleme). Parça B: boş durum, hata ekranları (404, genel hata, yetkisiz), yüklenme ekranları ve form mesajları. Önce yalnızca Parça A'nın planını sun.

5) Tutarlılık: Grafikteki son ayın değeri, dashboard'daki MRR kartıyla aynı hesap kuralını ve yuvarlamayı kullanmalı.

Kurallar aynı: önce plan, ben onaylamadan kod yok; komutları tek tek ve her birinin ne işe yaradığını yazarak ver; dosyaları touch ile boş oluşturtup tam içeriği ver; sonunda varsayımlarını listele.
````

### Claude cevabı 2 · 24 Eki 2026 11:03

> # Gün 11 • Parça A Planı: Aylık MRR grafiği
>
> Düzeltmelerin için teşekkürler. Hiçbir dosyayı değiştirmiyorum. Bu yalnızca Parça A'nın planı. Parça B (boş durum, hata, yüklenme, form mesajları) bu PR birleştikten sonra ayrı dalda gelecek.
>
> ---
>
> ## 1) Kapsam
>
> **Parça A'da olanlar:**
> - Son 12 ayın kapanış anlarını Türkiye saatine göre bulmak
> - Her ay için geçmiş MRR'ı hesaplamak ve testleri
> - Sunucuda çizilen SVG grafik, özet cümle, açılır tablo
> - Grafiği dashboard'a eklemek
>
> **Parça A'da olmayanlar:** Genel boş durum bileşeni, 404, hata, yetkisiz ve yüklenme ekranları, form mesajları. Hepsi Parça B'de.
>
> Tek istisna: Hiç abonelik yoksa grafik çökmemeli. Grafik bu durumda kısa bir "Henüz MRR verisi yok" cümlesi gösterir. Parça B'de bu, ortak boş durum bileşeniyle değiştirilir.
>
> ---
>
> ## 2) Kodu görmeden karar veremediğim üç nokta
>
> ### a) `turkiyeAyi` yeniden kullanılabilir mi?
>
> Önceliğim yeni fonksiyon yazmamak. Karar, `turkiyeAyi`'nin ne döndürdüğüne bağlı:
>
> | `turkiyeAyi` ne döndürüyorsa | Sonuç |
> |---|---|
> | Ayın başlangıç anı (ve/veya bitiş anı) | **Yeni fonksiyon yok.** Bir ayın kapanışı = sonraki ayın başlangıcı eksi 1 milisaniye. 12 ayı geriye doğru sayan küçük bir döngü yeterli. |
> | Yalnızca ay bilgisi (ör. `{ yil: 2026, ay: 3 }`) | Ay sınırının **anını** bulmak için küçük bir yardımcı gerekebilir. Gerekirse `metrikler.ts` içine ekler, `turkiyeAyi`'nin testiyle aynı yöntemle test ederim ve nedenini yazarım. |
>
> ### b) Geçmiş fiyat riski
>
> Geçmiş bir ayın MRR'ı için iki şey bilinmeli: o anda abonelik aktif miydi ve **o zamanki fiyat** neydi.
>
> Risk şu: Hesap plan tablosundaki **bugünkü** fiyatı kullanırsa ve plan fiyatı Haziran'da 500'den 600 TL'ye çıktıysa, Ocak–Mayıs ayları da 600 TL üzerinden hesaplanır. Grafik geçmişi yanlış gösterir.
>
> Gün 8'de bu konuda bir karar alındığını söyledin. Kararı görmeden tahmin etmiyorum. Olası durumlar ve sonuçları:
>
> | Gün 8 kararı | Grafikte sonuç |
> |---|---|
> | Abonelikte başlangıç fiyatının kopyası tutuluyor ve **hiç değişmiyor** | Geçmiş doğru çıkar. |
> | Kopya var ama **yenilemede güncelleniyor** | Yenileme öncesi aylar yeni fiyatla hesaplanır. Olaylar tablosunda (SUBSCRIPTION_EVENTS) fiyat saklanıyorsa oradan doğru fiyat bulunabilir. Saklanmıyorsa sana soracağım. |
> | Kopya yok, fiyat plandan okunuyor | Geçmiş, bugünkü fiyatla hesaplanır. Bu durumda ne yapacağımıza sen karar vermelisin (ör. grafiğe "bugünkü fiyatlarla hesaplanmıştır" notu). Şema değişikliği Gün 11 kapsamı dışında olur. |
>
> ### c) İptal ve başlangıç tarihi nerede?
>
> Geçmiş bir anda aktiflik kontrolü şöyle olmalı:
>
> > başlangıç tarihi ≤ ayın kapanışı **VE** (iptal tarihi yok **VEYA** iptal tarihi > ayın kapanışı)
>
> Aboneliğin bugünkü `status` alanı (ACTIVE/CANCELED) bunun için yetmez. Haziran'da iptal edilmiş bir abonelik Mart'ta aktifti. Bu yüzden şunu öğrenmem gerek:
> - İptal tarihi Subscription modelinde ayrı bir alan mı (ör. `canceledAt`), yoksa yalnızca CANCELED olayının tarihinden mi anlaşılıyor?
> - Başlangıç tarihi ayrı bir alan mı, yoksa `createdAt` mi kullanılıyor?
>
> **Ek risk:** `dashboard-verisi.ts` MRR kartı için şu an yalnızca ACTIVE abonelikleri çekiyor olabilir. Geçmiş için iptal edilmişler de lazım. Gerekirse sorguyu genişletirim, ama tenant yardımcısının dışına çıkmadan.
>
> ---
>
> ## 3) Kart ile grafiğin tutarlılığı
>
> Grafiğin son noktası ile MRR kartı aynı sayıyı göstermeli. Bunu üç yolla garanti ederim:
>
> 1. **Aynı fonksiyon:** İkisi de Gün 8'deki "belirli tarihteki MRR" fonksiyonundan gelir. Ayrı bir MRR hesabı yazılmaz.
> 2. **Aynı "şimdi":** `dashboard-verisi.ts` içinde tarih bir kez alınır ve hem karta hem grafiğe aynı değer verilir. İki ayrı `new Date()` milisaniyelik fark yaratabilir.
> 3. **Aynı yuvarlama ve biçim:** Yıllık plan bölmesi (ör. 1.000 / 12 = 83,33) Gün 8'de nerede yuvarlanıyorsa aynen kullanılır. Ekranda TL gösterimi için `bicim` içindeki mevcut fonksiyon kullanılır.
>
> Bunu bir birim testiyle de sabitlerim: "geçmişin son değeri = kartın değeri".
>
> **Bu ayın noktası:** Ay henüz bitmediği için bu ayın değeri "bugün itibarıyla" hesaplanır ve etikette "(bu ay)" yazar. Kartla aynı sayı budur.
>
> ---
>
> ## 4) Dosyalar (tahmini, `find` çıktısını görünce kesinleşecek)
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `src/lib/metrikler.ts` | Değişecek | Son 12 ayın MRR listesini döndüren saf fonksiyon eklenir (`turkiyeAyi` ve Gün 8 fonksiyonunu kullanır) |
> | `src/lib/metrikler` test dosyası (mevcut adıyla) | Değişecek | Yeni testler eklenir |
> | `src/lib/dashboard-verisi.ts` | Değişecek | Tek "şimdi" ile kart + grafik verisini birlikte döndürür |
> | `src/lib/bicim.ts` | Değişebilir | Türkçe kısa ay etiketi ("Mar 2026") yoksa eklenir, varsa kullanılır |
> | Grafik bileşeni | Yeni | SVG çubuk grafik, `<title>` ile hover değeri, özet cümle, açılır tablo. Konumu ve adı mevcut yapıya göre (ör. `src/components/...`) `find` çıktısından sonra belirlenecek. Bu `ui` klasörüne mi yoksa başka bir yere mi girmeli, onu da sana soracağım. |
> | `src/app/(panel)/.../page.tsx` (dashboard) | Değişecek | Grafiği kartların altına ekler |
>
> Yeni dosyaları kod aşamasında önce `touch` ile boş oluşturtacağım, ardından tam içeriğini vereceğim.
>
> ---
>
> ## 5) Senden istediklerim
>
> Proje klasöründeyken, sırayla:
>
> **Komut 1:** `src` ve `prisma` altındaki tüm dosyaların adlarını sıralı listeler (içerik göstermez).
> ```
> find src prisma -type f | sort
> ```
>
> **Komut 2:** Next.js, React ve Prisma sürümlerini gösterir.
> ```
> grep -E '"(next|react|prisma|@prisma/client)"' package.json
> ```
>
> **Komut 3:** Test komutunun ve test aracının (Vitest/Jest) adını gösterir.
> ```
> grep -E '"(test|vitest|jest)"' package.json
> ```
>
> Sonra şunların içeriğini editörden kopyalayıp yapıştır:
> 1. `docs/02_ADR.md` içindeki **Gün 8 bölümü** (fiyat kopyası kararı)
> 2. `prisma/schema.prisma` içindeki **Subscription**, **Plan** ve **SubscriptionEvent** modelleri
> 3. `src/lib/metrikler.ts` (tamamı) ve test dosyası
> 4. `src/lib/dashboard-verisi.ts`
> 5. `src/lib/bicim.ts`
> 6. Dashboard sayfasının `page.tsx` dosyası
>
> Bu dosyalarda secret olmaması gerekir, yine de yapıştırmadan önce bir göz at.
>
> ---
>
> ## 6) Onaydan sonraki çalışma sırası
>
> 1. Güncel `main`'den yeni dal açmak (önerilen ad: `gun11a-mrr-grafigi`)
> 2. Önce testleri, sonra `metrikler.ts` içindeki geçmiş MRR fonksiyonunu yazmak
> 3. `dashboard-verisi.ts`'i tek "şimdi" ile güncellemek
> 4. Gerekirse `bicim.ts`'e ay etiketi eklemek
> 5. SVG grafik bileşeni
> 6. Dashboard sayfasına ekleme
> 7. Sınama listesi ve elle bir ay hesabı
> 8. CLAUDE.md'deki iki secret taraması, commit, push, PR
>
> Önerilen commit mesajı: `feat: aylık MRR grafiği` (Parça B'ninki ayrı olacak: `feat: boş durum ve hata ekranları`).
>
> ---
>
> ## 7) Sınama listesi (Parça A)
>
> | Durum | Beklenen |
> |---|---|
> | Boş hesap | 12 ayın hepsi 0, grafik çökmez, "Henüz MRR verisi yok" cümlesi |
> | Tek abonelik (aylık 500 TL, 15 Mart başlangıç) | Şubat ve öncesi 0, Mart'tan itibaren 500 TL |
> | 12 aydan eski veri (2 yıl önce başlamış, aktif) | 12 ayın tamamında görünür, daha eski aylar grafikte yok |
> | Yıllık plan (12.000 TL) | Her ay 1.000 TL; küsuratlı fiyatta kartla aynı yuvarlama |
> | Ay içinde iptal (10 Haziran) | Mayıs'ta var, Haziran kapanışında yok |
> | Ay sınırı (1 Nisan 00:30 Türkiye = 31 Mart 21:30 UTC) | Mart'ta yok, Nisan'da var |
> | Plan fiyatı değişmiş | Gün 8 kararına göre beklenen sonuç; kararı görünce yazacağım |
> | Son ay | Kart değeriyle birebir aynı |
> | Başka kiracının aboneliği | Grafikte hiçbir ayda görünmez |
>
> **Elle hesap (bitiş kontrolü):** Bir ayda aylık 500 TL ve yıllık 12.000 TL iki aktif abonelik varsa: 500 + 12.000 / 12 = **1.500 TL**.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **`turkiyeAyi`'nin dönüş değeri:** Ay başı anını mı yoksa yalnızca ay bilgisini mi döndürdüğünü bilmiyorum. Yeni fonksiyon gerekip gerekmediği buna bağlı.
> 2. **Fiyat kopyası:** Gün 8 kararını görmeden geçmiş fiyatın doğru çıkıp çıkmayacağını bilmiyorum. Kopya yoksa veya yenilemede değişiyorsa sana soracağım, tahmin etmeyeceğim.
> 3. **İptal ve başlangıç tarihi:** Subscription'da ayrı alan mı, yoksa olaylardan mı okunuyor, bilmiyorum.
> 4. **Kart sorgusu:** `dashboard-verisi.ts` yalnızca ACTIVE abonelikleri çekiyorsa genişletmem gerekecek.
> 5. **Yuvarlama:** Yıllık plan bölmesinin Gün 8'de abonelik başına mı, toplamda mı yuvarlandığını bilmiyorum; aynısını kullanacağım.
> 6. **Bileşen konumu:** `src/components/ui/` yalnızca temel parçalar (düğme, kart vb.) için mi, yoksa grafik de oraya mı girmeli, `find` çıktısından sonra sana soracağım.
> 7. **Tarih alanları:** Prisma `DateTime` alanlarının UTC olarak saklandığını varsayıyorum, şemadan doğrulayacağım.
>
> Planı onaylarsan ve yukarıdaki çıktıları ile dosyaları paylaşırsan, önce bu yedi noktayı netleştirip sonra kod aşamasına geçeceğim.

### Prompt 3 · 24 Eki 2026 11:16

````text
Planı büyük ölçüde onaylıyorum, kod yazmadan önce şu düzeltmeleri planına işle:

1) Komut 3'ü atla: test aracımız node --test, ek paket yok.
2) Grafik bileşeni src/app/(panel)/dashboard/ içine girer (KpiKarti.tsx ile yan yana). src/components/ui/ yalnızca Rozet gibi küçük parçalar için.
3) Commit öncesi taramalar iki değil üç: parola, sunucu adı ve geniş ad/kullanıcı adı taraması. Üçü de CLAUDE.md ve proje talimatlarında yazılı.
4) Yeni test dosyası açarsan package.json test (veritabanısız) ya da test:db (veritabanı gerektiren) betiğine dosya adını eklemeyi planına yaz.
5) Elle test için geçmiş tarihli sahte veriye ihtiyaç var. demo:veri yalnızca bu ayı yazıyor. Neon test dalında bunu nasıl kuracağını planına yaz, canlıya yazma.
6) Commit ve PR eklerinde bu sohbetin kendi sistem notundaki satırları kullan.

Dosyalar ve komut çıktıları ekte tek metin dosyası olarak. Yedi noktayı bunlara bakarak netleştir, tahmin etme. Planı güncelle, ben onaylamadan kod yazma. Sonunda varsayımlarını listele.
````

_[ek dosya: gun11_dosyalar.txt]_

### Claude cevabı 3 · 24 Eki 2026 11:19

> # Gün 11 • Parça A Planı (güncellenmiş)
>
> Dosyaları okudum. Hiçbir dosyayı değiştirmiyorum. Yedi noktadan beşi netleşti, ikisi için senin kararın ve birkaç dosya daha gerekiyor.
>
> **En önemli bulgu:** Gün 8'de grafik hesabının büyük kısmı zaten yazılmış ve test edilmiş. `metrikler.ts` içinde `mrrGecmisi` fonksiyonu var: her ayın son anındaki MRR'ı hesaplıyor, içinde bulunulan ay için "şimdi"yi kullanıyor ve tam TL'ye yuvarlıyor. Bu yüzden Parça A planı küçüldü.
>
> ---
>
> ## 1) Yedi noktanın durumu
>
> | # | Nokta | Durum | Ne buldum |
> |---|---|---|---|
> | 1 | `turkiyeAyi` yeniden kullanılabilir mi? | ✅ Netleşti | Yalnızca `{yil, ay}` döndürüyor. Ama ay sınırı anları için `ayAraligi` ve `ayinSonAni` zaten var ve testli. **Ay sonu fonksiyonu yazılmayacak.** Eksik olan tek şey "son 12 ayın listesi" (aşağıda) |
> | 2 | Fiyat kopyası | ⚠️ Karar gerekiyor | Subscription'da fiyat alanı **yok**. ADR'de "D1: karar MRR grafiği gününde verilecek" yazıyor. Bugün o gün |
> | 3 | İptal ve başlangıç tarihi nerede? | ✅ Büyük ölçüde netleşti | Subscription'da `startedAt` ve `canceledAt` var. Hesap olay tablosunu kullanmıyor (Gün 9 kararı). Yenileme `startedAt`'i değiştirmiyor (ADR). Açık kalan: iptalde `canceledAt` her zaman yazılıyor mu, `startedAt` gelecek tarih olabilir mi? `abonelikler/actions.ts`'i görmem lazım |
> | 4 | Kart sorgusu yalnızca ACTIVE mi çekiyor? | ✅ Netleşti | Hayır, bütün abonelikleri (iptal edilmişler dahil) çekiyor. **Sorgu değişmeyecek** |
> | 5 | Yuvarlama | ✅ Netleşti, ⚠️ bir fark var | İkisi de toplam üzerinde bir kez `yuvarla(…, 0)` kullanıyor. Ama **aktiflik kuralları farklı** (aşağıda) |
> | 6 | Bileşen konumu | ✅ Netleşti | `src/app/(panel)/dashboard/MrrGrafigi.tsx`, `KpiKarti.tsx` ile yan yana |
> | 7 | Tarih türü | ✅ Netleşti | Prisma `DateTime` (`@db.Timestamptz` yok). Prisma değerleri UTC yazar ve okur, ADR K8.4 ile uyumlu. Tek risk: Neon konsolundan elle SQL ile tarih girilirse saat dilimi karışabilir. Bu yüzden sahte veri Prisma ile yazılacak (bölüm 5) |
>
> ---
>
> ## 2) Senden beklediğim iki karar
>
> ### Karar 1: Fiyat kopyası (ADR D1)
>
> **Durum:** Geçmiş aylar `plan.price` ile, yani planın **bugünkü** fiyatıyla hesaplanıyor. Bir planın fiyatı veya aralığı (aylık/yıllık) değiştirilirse grafikte geçmiş aylar da değişir. Bugünkü MRR etkilenmez.
>
> Seçenekler:
>
> | Seçenek | Ne yapılır | Artı | Eksi |
> |---|---|---|---|
> | **A. Abonelikte fiyat kopyası** | Subscription'a `fiyat` ve `aralik` alanı eklenir, başlatmada plandan kopyalanır, eski kayıtlar plandan doldurulur | Geçmiş her zaman doğru | Şema değişikliği ve migration, başlatma kodu değişir. Parça A büyür |
> | **B. Fiyat değiştirmeyi kapatmak** | Aboneliği olan planın fiyatı ve aralığı düzenlenemez. Fiyat değişikliği = yeni plan oluştur, eskisini pasife al | Şema değişmez, geçmiş doğru kalır. "Kayıt silinmez, pasife alınır" kuralıyla uyumlu | Plan formunda küçük bir kısıt gerekir |
> | **C. Kabul edip not düşmek** | Grafiğin altına "Geçmiş aylar planların bugünkü fiyatıyla hesaplanır" notu | Hiç kod değişmez | Grafik yanlış bilgi gösterebilir |
>
> **Önce şunu öğrenmem lazım:** `planlar/actions.ts` bugün fiyat veya aralık güncellemeye izin veriyor mu? İzin vermiyorsa B zaten fiilen geçerli, yalnızca ADR'ye yazılır. İzin veriyorsa önerim **B**, çünkü 2 haftalık projede şema değişikliğinden daha az risklidir. Kararı sen vereceksin.
>
> ### Karar 2: MRR kartı ile grafiğin son noktası
>
> İkisi aynı yuvarlamayı kullanıyor ama "aktif"i farklı tanımlıyor:
>
> - **Kart** (`mrrHesapla`): `status === "ACTIVE"` olanlar
> - **Grafik** (`tarihtekiMrr`): `startedAt ≤ şimdi` ve (`canceledAt` boş veya `> şimdi`) olanlar
>
> Veri tutarlıysa (iptalde hem `status` hem `canceledAt` yazılıyorsa, başlangıç gelecekte değilse) ikisi aynı sayıyı verir. Tutarsızsa farklı çıkar. Gün 8'deki mevcut bir test bunu gösteriyor: 25 Ekim'de başlayacak bir abonelik "22 Ekim"de grafikte yok ama `status` ACTIVE olduğu için kartta sayılırdı.
>
> Seçenekler:
> - **Önerim:** Kartı değiştirmemek. `dashboard-verisi.ts` içinde aynı "şimdi" ile ikisini de hesaplamak ve tutarlı veride "kart = grafiğin son noktası" testini eklemek. `abonelikler/actions.ts`'te gelecek tarihli başlangıç mümkünse bu kararı yeniden konuşuruz.
> - Alternatif: Kartı da `tarihtekiMrr(abonelikler, simdi)` ile hesaplamak. Eşitlik kesinleşir ama Gün 9 davranışı değişir ve ARPU ile aktif müşteri sayısı farklı kurallardan gelmeye başlar.
>
> ---
>
> ## 3) Parça A'da değişecek dosyalar
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `src/lib/metrikler.ts` | Değişecek | Yeni küçük saf fonksiyon `sonAylar(simdi, adet)`: `turkiyeAyi(simdi)`'den başlayıp geriye doğru 12 `{yil, ay}` üretir. **Neden yeni:** `turkiyeAyi` yalnızca bulunduğumuz ayı verir; Ocak'tan geriye Aralık'a ve yıl değişimine geçen bir liste hiçbir yerde yok |
> | `src/lib/metrikler.test.ts` | Değişecek | `sonAylar` testleri (yıl geçişi, gece 00:30 TR'de ay, adet) ve elle hesap senaryosu |
> | `src/lib/dashboard-verisi.ts` | Değişecek | Aynı `simdi` ile `mrrGecmisi: mrrGecmisi(abonelikler, sonAylar(simdi, 12), simdi)` alanı eklenir. Sorgu değişmez |
> | `src/lib/dashboard-verisi.test.ts` | Değişecek | Kart = son nokta testi ve izolasyon testi (başka kiracının aboneliği grafikte yok) |
> | `src/lib/bicim.ts` | Değişecek | Eksen için kısa ay etiketi `kisaAyEtiketi(2026, 10)` → "Eki 26". Uzun etiket (`ayEtiketi`) ipucu ve tabloda kullanılır |
> | `src/lib/bicim.test.ts` | Değişecek | Kısa etiket testi |
> | `src/lib/mrr-grafigi.ts` | **Yeni** | Grafik için saf yardımcılar: dikey eksenin yuvarlak üst sınırı (ör. 4.583 → 5.000; hepsi 0 ise sabit bir sınır) ve özet cümle ("Son 12 ayda MRR 3.000 TL'den 2.083 TL'ye düştü. En yüksek değer: Mayıs 2026, 4.583 TL.") |
> | `src/lib/mrr-grafigi.test.ts` | **Yeni** | Üst sınır, hepsi 0, tek nokta, artış/düşüş/değişmedi cümleleri. **`package.json` içindeki `test` betiğine eklenecek** (veritabanı gerektirmez) |
> | `src/app/(panel)/dashboard/MrrGrafigi.tsx` | **Yeni** | Server Component (`"use client"` yok). SVG çubuk grafik, her çubukta `<title>` ile hover değeri, bu ay farklı tonda **ve** "(bu ay)" metniyle, `<figure>` + özet cümle + `<details>` içinde tablo |
> | `src/app/(panel)/dashboard/page.tsx` | Değişecek | Grafiği KPI kartlarının altına, `Kart` içinde ekler |
> | `docs/02_ADR.md` | Değişecek | Gün 11 bölümü: D1 kararı, kart/grafik kuralı, `sonAylar` gerekçesi |
> | (Karar 1 = B ise) `planlar/actions.ts` ve `PlanFormu.tsx` | Değişecek | Aboneliği olan planda fiyat/aralık düzenlemesini engeller |
> | `src/test-destek/...` + `package.json` | Yeni betik | Geçmiş tarihli sahte veri (bölüm 5) |
>
> **Boş durum hakkında:** Dashboard sayfası hiç abonelik yoksa zaten `BosDurum` gösterip çıkıyor, yani grafik boş hesapta hiç çizilmez. Bütün abonelikleri 12 aydan önce iptal edilmiş bir firmada grafik 12 tane 0 çizer ve özet cümle "Son 12 ayda MRR 0 TL" der. Parça A'da ek boş durum gerekmiyor.
>
> Yeni dosyaları kod aşamasında önce `touch` ile boş oluşturtacağım, sonra tam içeriğini vereceğim. Var olan dosyalar için tam içerik vereceğim.
>
> ---
>
> ## 4) Senden istediklerim
>
> **Komut:** `package.json` içindeki betikleri (test, test:db, demo:veri vb.) gösterir, secret içermez.
> ```
> grep -A 30 '"scripts"' package.json
> ```
>
> Editörden kopyalayıp yapıştırman gerekenler:
> 1. `src/app/(panel)/planlar/actions.ts` → Karar 1 için (fiyat ve aralık güncellenebiliyor mu?)
> 2. `src/app/(panel)/abonelikler/actions.ts` → Karar 2 için (iptalde `canceledAt` yazılıyor mu, `startedAt` gelecek olabilir mi?)
> 3. `src/lib/dashboard-verisi.test.ts` ve `src/lib/bicim.test.ts` → tam dosya vereceğim için
> 4. `src/test-destek/canli-koruma.ts` ve `src/test-destek/demo-verisi.ts` → sahte veri betiği için
> 5. **CLAUDE.md'nin güncel güvenlik ve commit bölümü.** Elimdeki sürümde yalnızca **iki** tarama (parola ve sunucu adı) var, üçüncü tarama (geniş ad/kullanıcı adı) ve commit/PR ek satırları **yok**. Benim gördüğüm talimat eski kalmış olabilir. Komutu ve satırları uydurmayacağım; lütfen o bölümleri yapıştır ve proje talimatlarındaki kopyayı da güncelle.
>
> ---
>
> ## 5) Elle test: geçmiş tarihli sahte veri (yalnızca Neon test dalı)
>
> **Yaklaşım:** `demo:veri` gibi Prisma ile yazan ayrı bir betik. Elle SQL yerine Prisma kullanıyorum, çünkü tarihleri UTC'ye doğru çevirir.
>
> 1. Dosya: `src/test-destek/gecmis-mrr-verisi.ts`, `package.json`'a örneğin `demo:gecmis` betiği olarak eklenir (adı mevcut betiklere göre kesinleşecek).
> 2. **Canlı koruması:** Betik ilk satırda `canli-koruma.ts`'i çağırır, adres test dalı değilse hiçbir şey yazmadan durur. Bunun nasıl çalıştığını ve test dalına hangi ortam değişkeniyle bağlandığını dosyayı görünce netleştireceğim, tahmin etmiyorum.
> 3. **Ayrı sahte firma:** "Gün 11 Demo" adıyla ayrı bir kiracı ve bir manager kullanıcı. Beklenen değerler başka verilerle karışmaz. Mevcut demo firma da "başka kiracı" denemesi için kullanılır.
> 4. Betik tekrar çalıştırılınca aynı kayıtları ikinci kez eklemez.
> 5. Her başlatma ve iptal için STARTED/CANCELED olayları da yazılır (proje kuralı).
>
> **Sahte veri ve beklenen grafik** (bugün 24 Ekim 2026'ya göre, son 12 ay: Kasım 2025 – Ekim 2026):
>
> | Müşteri | Plan | Başlangıç (TR) | İptal (TR) | Ne sınanıyor |
> |---|---|---|---|---|
> | A | Aylık 1.000 | 10 Ağu 2025 | yok | 12 aydan eski veri |
> | B | Yıllık 12.000 | 15 Oca 2026 | yok | Yıllık plan (1.000/ay) |
> | C | Aylık 500 | 5 Mar 2026 | 10 Haz 2026 | Ay içinde iptal |
> | D | Yıllık 1.000 | 1 May 2026 00:30 | yok | Ay sınırı + küsurat (83,33) |
> | E | Aylık 2.000 | 20 Kas 2025 | 1 Eyl 2026 00:00 | Tam sınırda iptal |
>
> | Ay | Beklenen MRR |
> |---|---|
> | Kas 2025 – Ara 2025 | 3.000 (A + E) |
> | Oca – Şub 2026 | 4.000 (+ B) |
> | Mar – Nis 2026 | 4.500 (+ C; D 1 Mayıs 00:30'da başladığı için Nisan'da yok) |
> | May 2026 | **4.583** (1.000 + 1.000 + 500 + 83,33 + 2.000 = 4.583,33) |
> | Haz – Ağu 2026 | 4.083 (C gitti; E 1 Eylül 00:00'da iptal olduğu için Ağustos'ta hâlâ var) |
> | Eyl 2026 | 2.083 (E gitti) |
> | Eki 2026 (bu ay) | 2.083 = MRR kartı (A + B + D) |
>
> **Elle hesaplanacak ay:** Mayıs 2026 = 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33 → **4.583 TL**. Aynı senaryo `metrikler.test.ts`'e de test olarak girer.
>
> Not: Betik Kasım'da çalıştırılırsa pencere bir ay kayar (Kasım 2025 düşer, Kasım 2026 gelir). Test sabit bir `simdi` kullandığı için etkilenmez.
>
> ---
>
> ## 6) Onaydan sonraki çalışma sırası
>
> 1. Güncel `main`'den dal: `gun11a-mrr-grafigi`
> 2. Karar 1'e göre gerekiyorsa plan formu kısıtı
> 3. `sonAylar` + testleri, `mrr-grafigi.ts` + testleri, `package.json` test betiği
> 4. `bicim.ts` kısa etiket + testi
> 5. `dashboard-verisi.ts` + testleri
> 6. `MrrGrafigi.tsx` ve dashboard'a ekleme
> 7. `npm test`, `npm run test:db`, `npm run lint`, `npm run build`
> 8. Test dalında sahte veri, elle sınama (tablo yukarıda)
> 9. ADR Gün 11 bölümü
> 10. **Üç** secret taraması (komutlarını CLAUDE.md'nin güncel hâlinden alacağım), commit `feat: aylık MRR grafiği`, push, PR. Commit ve PR ek satırları sen paylaşınca eklenecek
>
> ---
>
> ## 7) Sınama listesi (Parça A)
>
> | Durum | Beklenen |
> |---|---|
> | Boş hesap | Dashboard `BosDurum` gösterir, grafik çizilmez, hata yok |
> | Tek abonelik (testte) | Başlangıç ayından önce 0, sonra fiyat |
> | 12 aydan eski veri (A) | 12 ayın tamamında görünür |
> | Yıllık plan (B, D) | 12.000 → 1.000/ay; 1.000 → toplamda bir kez yuvarlanır (83 değil, toplamın içinde 83,33) |
> | Ay içinde iptal (C) | Mayıs'ta var, Haziran'da yok |
> | Ay sınırları (D, E) | D Nisan'da yok, E Ağustos'ta var |
> | Son nokta | MRR kartıyla aynı (2.083) |
> | Başka kiracı | Demo firmanın verisi grafikte görünmez |
> | Erişilebilirlik | Hover'da "Mayıs 2026: 4.583 TL", özet cümle okunuyor, tablo açılıyor, "bu ay" metinle de belli |
> | Plan fiyatı değişikliği | Karar 1'e göre |
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Fiyat kopyası yok** (şemadan kesin). Plan fiyatı bugün düzenlenebiliyor mu bilmiyorum; `planlar/actions.ts`'i görmeden Karar 1 kesinleşmez.
> 2. **`canceledAt` ve `startedAt` tutarlılığı:** İptalde `canceledAt`'in her zaman yazıldığını ve `startedAt`'in gelecek tarih olamadığını varsayıyorum, ama doğrulamadım. Karar 2 buna bağlı.
> 3. **Üçüncü secret taraması ve commit/PR ek satırları:** Elimdeki CLAUDE.md'de yok. Uydurmayacağım, senden bekliyorum.
> 4. **Neon test dalına bağlanma ve `canli-koruma.ts`'in işleyişi:** Görmeden bilmiyorum. Sahte veri betiği buna göre yazılacak.
> 5. **`test:db` betiği:** `dashboard-verisi.test.ts`'in zaten `test:db` betiğinde olduğunu varsayıyorum (`tenantaBagliDb` kullandığı için). Betik listesinden doğrulayacağım.
> 6. **`.tsx` testi yok:** `node --test` kancanın `.tsx` dosyalarını işleyip işlemediğini bilmediğim için grafik bileşenini doğrudan test etmiyorum. Test edilmesi gereken mantığı (üst sınır, özet cümle) `.ts` dosyasına aldım.
> 7. **Kısa ay etiketi:** Türkçede `Intl` kısa ay adının "Eki" biçiminde geleceğini varsayıyorum; testte sabitleyeceğim, farklı çıkarsa sana göstereceğim.
> 8. **Sahte veri tablosu** bugünün (24 Ekim 2026) tarihine göre hesaplandı.
>
> Karar 1 ve Karar 2 için tercihini ve bölüm 4'teki dosyaları paylaşırsan planı kesinleştirip onayına sunacağım. Onayından önce kod yazmayacağım.

### Prompt 4 · 24 Eki 2026 11:23

````text
Planı büyük ölçüde onaylıyorum, mrrGecmisi bulgusu çok değerliydi.

Karar 2: Önerini onaylıyorum, kartı değiştirme. Kart ile grafiğin son noktasının eşitliğini tutarlı veride testle sabitle.

Karar 1: planlar/actions.ts ekte. Fiyat ya da aralık düzenlenebiliyorsa B (aboneliği olan planda düzenlemeyi kapat, değişiklik için yeni plan aç) ile devam et ve nedenini ADR'ye yaz. Düzenlenemiyorsa yalnızca ADR'ye yaz. Hangisi olduğunu dosyaya bakarak söyle, tahmin etme.

Commit ve PR kuralları ile üçüncü tarama aşağıda. Elindeki talimat eski kalmış, bu metin güncel olandır:
[yukarıdaki "Güncel çalışma kuralları" bölümünü buraya yapıştır]

Commit ekindeki model adı olarak bu sohbette seçili olan modeli yaz. Oturum adresi: bu sohbetin sistem notundaki adres varsa onu, yoksa bana sor.

İstediğin dosyalar ekte. Planı kesinleştirip onayıma sun, ben onaylamadan kod yazma.
````

_[ek dosya: gun11_dosyalar_2.txt]_

### Prompt 5 · 24 Eki 2026 11:24

````text
## Güncel çalışma kuralları (Gün 9-11)
- Commit öncesi üç tarama yapılır, üçü de içerik basmaz ve dosyalar önce git add ile hazırlanır (--cached seçeneği desenden önce yazılır):
  1) git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}" (çıktı boş olmalı)
  2) git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx" (sonuç 0)
  3) git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]" (sonuç 0)
- Belgelere ve prompt_cevap dosyalarına yazılan ad taraması deseni [AD_DESENI] olarak maskelenir.
- main dalına doğrudan push yok. Dal açılır, GitHub Desktop'ta Publish branch ve Create Pull Request, Squash and merge, sonra git switch main ve git pull.
- Commit terminalden atılır. Ekler ardışık ve tek blokta en sonda: "Co-Authored-By: Claude <Model> <noreply@anthropic.com>" ve "Claude-Session: <oturum adresi>". PR açıklaması "🤖 Generated with [Claude Code](https://claude.com/claude-code)", boş satır, oturum adresi ile biter.
- Geliştirme: .env canlı veritabanıdır, .env.test Neon test dalıdır. npm run dev:test uygulamayı test dalında açar (canlı koruması ile), npm run demo:veri -- <e-posta> test firmasına demo veri yazar. npm test veritabanı istemez, npm run test:db test dalını kullanır.
- Yeni dosyalar terminalden touch ile boş açılır, içeriği kullanıcı editöre yapıştırır. Küçük düzenlemeler perl -pi -e ile yapılır.
````

### Claude cevabı 4 · 24 Eki 2026 11:25

> # Gün 11 • Parça A: Kesinleşmiş plan
>
> Güncel kuralları aldım, bundan sonra onları uyguluyorum. Hiçbir dosyayı değiştirmedim.
>
> ---
>
> ## 1) Karar 1: Dosyaya göre sonuç
>
> **`planlar/actions.ts` fiyat ve aralık değişikliğini kısmen engelliyor.** `planGuncelle` içinde şu kontrol var:
>
> > fiyat veya aralık değiştiyse **ve** `aktifAbonelikVarMi` doğruysa → hata
>
> Yani kilit yalnızca **aktif** abonelik varken devreye giriyor. Bir planın tüm abonelikleri iptal edilmişse fiyatı değiştirilebiliyor. O abonelikler geçmişte aktif olduğu için grafikte o ayların değeri değişir. Gün 8'de yazılan kural bugünkü MRR'ı koruyordu, geçmiş MRR'ı korumuyor.
>
> **Bu yüzden B uygulanacak:** Kilit "aktif abonelik var" yerine **"herhangi bir abonelik var (iptal edilmişler dahil)"** olacak. Fiyat değişikliği için yeni plan açılıp eskisi pasife alınacak.
>
> Değişiklik:
> - `planGuncelle` içinde `aktifAbonelikVarMi({ planId })` yerine, zaten açık olan tenant filtreli `db` ile `db.subscription.count({ where: { planId } }) > 0` kontrolü
> - Hata mesajı: "Bu plana bağlı abonelikler var (iptal edilmişler dahil). Fiyat ve aralık değiştirilemez. Yeni fiyat için yeni bir plan oluşturun ve bu planı pasife alın."
> - Dosyanın baş yorumu geçmiş MRR gerekçesiyle güncellenir
> - `aktifAbonelikVarMi` başka yerlerde (pasife alma) kullanılıyor olabilir, ona dokunulmaz
>
> **Kod aşamasında göreceğim:** Plan formu veya plan detay sayfası "kilitli" durumunu ekranda gösteriyorsa, aynı kurala göre güncellenmeli. Yoksa sunucu reddeder ama ekran "düzenlenebilir" gibi görünür.
>
> **ADR'ye bilinen sınır olarak:** Bu kuraldan önce, yalnızca iptal edilmiş aboneliği olan bir planın fiyatı değiştirildiyse geçmiş aylar zaten etkilenmiş olabilir. Bunu geriye dönük bulmanın yolu yok (fiyat geçmişi tutulmuyor).
>
> ## 2) Karar 2: Dosyaya göre doğrulama
>
> `abonelikler/actions.ts`'e baktım, eşitlik varsayımı uygulamada geçerli:
> - Başlatmada `startedAt` sunucudaki `new Date()`. Gelecek tarihli başlangıç **mümkün değil**.
> - İptalde `status: "CANCELED"` ve `canceledAt: new Date()` **aynı güncellemede** yazılıyor. İkisi birbirinden kopamaz.
>
> Kart değişmeyecek. `dashboard-verisi.test.ts`'e "grafiğin son noktası = MRR kartı" testi eklenecek.
>
> ---
>
> ## 3) Dosyalar (kesin liste)
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `src/lib/metrikler.ts` | Değişir | `sonAylar(simdi, adet)`: `turkiyeAyi`'den geriye doğru `{yil, ay}` listesi, eskiden yeniye sıralı |
> | `src/lib/metrikler.test.ts` | Değişir | `sonAylar` testleri (Ocak'tan Aralık'a yıl geçişi, gece 00:30 TR) + sahte veri senaryosunun beklenen 12 değeri |
> | `src/lib/mrr-grafigi.ts` | **Yeni** | Eksen üst sınırı ve özet cümle (saf fonksiyonlar) |
> | `src/lib/mrr-grafigi.test.ts` | **Yeni** | Yukarıdakilerin testleri. **`test` betiğine eklenir** (veritabanısız) |
> | `src/lib/bicim.ts` | Değişir | `kisaAyEtiketi` ("Eki 26") |
> | `src/lib/bicim.test.ts` | Değişir | Kısa etiket testi |
> | `src/lib/dashboard-verisi.ts` | Değişir | Aynı `simdi` ile `mrrGecmisi` alanı |
> | `src/lib/dashboard-verisi.test.ts` | Değişir | Son nokta = kart, 12 nokta, B'nin aboneliği A'nın grafiğinde yok. Zaten `test:db` betiğinde, betik değişmez |
> | `src/app/(panel)/dashboard/MrrGrafigi.tsx` | **Yeni** | SVG grafik, `<title>` ile hover, özet cümle, açılır tablo |
> | `src/app/(panel)/dashboard/page.tsx` | Değişir | Grafiği KPI kartlarının altına ekler |
> | `src/app/(panel)/planlar/actions.ts` | Değişir | Karar 1 (B) |
> | Plan formu / plan detay sayfası | Gerekirse değişir | Ekrandaki kilit bilgisi (bkz. Karar 1) |
> | `src/test-destek/donem-ilerlet.ts` | **Yeni** | `demo-verisi.ts`'teki `donemleriIlerlet` buraya taşınır, iki betik de kullanır (tekrar yazmamak için; `demo-verisi.ts`'ten içe aktarılamaz çünkü dosya yüklenince betik çalışır) |
> | `src/test-destek/demo-verisi.ts` | Değişir | Fonksiyon silinir, yeni dosyadan içe aktarılır. Davranış aynı kalır |
> | `src/test-destek/gecmis-mrr-verisi.ts` | **Yeni** | Geçmiş tarihli sahte veri (bölüm 4) |
> | `package.json` | Değişir | `test` betiğine `mrr-grafigi.test.ts`, yeni `demo:gecmis` betiği |
> | `docs/02_ADR.md` | Değişir | Gün 11 bölümü |
>
> Yeni dosyalar `touch` ile açılacak, içeriği sen editöre yapıştıracaksın. `package.json` gibi küçük düzenlemeler `perl -pi -e` ile yapılacak.
>
> ---
>
> ## 4) Geçmiş tarihli sahte veri (yalnızca test dalı)
>
> `demo:veri`'nin yapısını aynen izliyor:
>
> - Betik: `npm run demo:gecmis -- yeni-kullanici@ornek.com`
> - `package.json`'da: `node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts`
> - Güvenceler `demo-verisi.ts` ile aynı: `testDaliKontrolu()` veritabanı modülleri yüklenmeden önce, var olan kullanıcının firması, firmada abonelik varsa durur, tek işlem, `tenantaBagliDb`, ekrana adres veya kişisel bilgi yazılmaz.
> - **Firma veya kullanıcı oluşturmaz, parola yazmaz.** Önce `npm run dev:test` ile test dalında yeni bir firma kaydı açarsın.
> - Tarihler sabit değil, **çalıştırıldığı aya göre**: böylece Kasım'da çalıştırılsa da beklenen değerler aynı kalır. Betik sonunda 12 ayın beklenen değerini ay adlarıyla ekrana yazar.
> - Yenilemeler ve `currentPeriodEnd` taşınan `donemleriIlerlet` ile hesaplanır (riskli abonelik listesi de doğru çalışsın diye).
>
> "Bu ay" = 0. ay olmak üzere senaryo:
>
> | Müşteri | Plan | Başlangıç | İptal |
> |---|---|---|---|
> | A | Aylık 1.000 | 14 ay önce, ayın 10'u | yok |
> | B | Yıllık 12.000 | 9 ay önce, ayın 15'i | yok |
> | C | Aylık 500 | 7 ay önce, ayın 5'i | 4 ay önce, ayın 10'u |
> | D | Yıllık 1.000 | 5 ay önce, ayın 1'i **00:30 TR** | yok |
> | E | Aylık 2.000 | 11 ay önce, ayın 20'si | 1 ay önce, ayın 1'i **tam 00:00 TR** |
>
> Bugün çalıştırılırsa beklenen grafik:
>
> | Ay | MRR |
> |---|---|
> | Kasım 2025, Aralık 2025 | 3.000 |
> | Ocak, Şubat 2026 | 4.000 |
> | Mart, Nisan 2026 | 4.500 |
> | **Mayıs 2026** | **4.583** (elle hesap: 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33) |
> | Haziran, Temmuz, Ağustos 2026 | 4.083 |
> | Eylül 2026 | 2.083 |
> | Ekim 2026 (bu ay) | 2.083 = MRR kartı |
>
> Aynı senaryo `metrikler.test.ts`'te sabit bir "şimdi" ile test olarak da yer alır.
>
> ---
>
> ## 5) Çalışma sırası
>
> 1. `git switch main`, `git pull`, `git switch -c gun11a-mrr-grafigi`
> 2. Plan kilidi (Karar 1), ekrandaki kilit bilgisi
> 3. `sonAylar` + testler
> 4. `mrr-grafigi.ts` + testler, `package.json` `test` betiği
> 5. `kisaAyEtiketi` + test
> 6. `dashboard-verisi.ts` + testler
> 7. `MrrGrafigi.tsx` ve dashboard sayfası
> 8. `npm test`, `npm run test:db`, `npm run lint`, `npm run build`
> 9. `donem-ilerlet.ts`, `demo-verisi.ts` düzenlemesi, `gecmis-mrr-verisi.ts`, `demo:gecmis` betiği; `npm run demo:veri` ile eski betiğin hâlâ çalıştığını da denemek
> 10. Test dalında elle sınama: grafik değerleri, hover, tablo, özet cümle, başka firmanın verisi görünmüyor, iptal edilmiş aboneliği olan planın fiyatı değiştirilemiyor
> 11. ADR Gün 11 bölümü
> 12. `git add`, CLAUDE.md'deki **üç** tarama (`--cached` ile; ad taramasının desenini bu cevaba yazmıyorum çünkü cevap prompt günlüğüne girecek, komutu CLAUDE.md'den kopyalarsın)
> 13. Commit: `feat: aylık MRR grafiği`, sonunda tek blokta:
>     ```
>     Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
>     Claude-Session: <oturum adresi>
>     ```
> 14. GitHub Desktop: Publish branch, Create Pull Request, PR açıklaması kurala göre biter; Squash and merge; `git switch main`, `git pull`
>
> **ADR Gün 11 içeriği:** K11.1 plan kilidinin "herhangi abonelik"e genişletilmesi (D1 kapandı) ve bilinen sınır; K11.2 kart ile grafiğin farklı aktiflik kuralları ve neden eşit oldukları (başlatma/iptal kodu) + test; K11.3 `sonAylar` neden yeni; K11.4 paketsiz SVG kararı; K11.5 Gün 11'in iki PR'a bölünmesi.
>
> ---
>
> ## Senden onaydan önce istediklerim
>
> 1. **Oturum adresi:** Bu sohbette bana görünen bir oturum adresi yok. Commit ve PR için adresi senin vermen gerekiyor (tarayıcıdaki sohbet adresi).
> 2. **PR açıklaması:** Kural "Generated with Claude Code" satırını istiyor. Bu sohbet Claude Code'da değil, Claude uygulamasında yürüyor. Satırı kuraldaki gibi mi bırakalım, yoksa bu gün için değiştirelim mi?
> 3. **Kod aşamasının ilk adımı için** (onaydan sonra yeterli): `src/app/(panel)/planlar/PlanFormu.tsx`, `src/app/(panel)/planlar/[id]/page.tsx` ve `src/lib/abonelik-kontrol.ts`.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Plan kilidinin eski etkisi:** Kural genişlemeden önce iptal edilmiş abonelikli planlarda fiyat değiştirilmiş olabilir; tespit edilemez, yalnızca ADR'ye yazılır.
> 2. **Ekrandaki kilit bilgisi:** Plan formu veya detay sayfasının kilit durumunu gösterip göstermediğini bilmiyorum, dosyaları görünce netleşecek.
> 3. **Plan kilidinin testi:** Kontrol server action içinde kaldığı için otomatik testi yok, elle sınanacak. İstersen `pasife-alma.ts` gibi `src/lib`'e taşıyıp `test:db` testi ekleyebiliriz, ama bu kapsamı büyütür.
> 4. **`demo-verisi.ts` değişikliği:** Yalnızca fonksiyonun yeri değişiyor; davranışın aynı kaldığını `npm run demo:veri` ile yeni bir test firmasında doğrulayacağız.
> 5. **`.tsx` testi yok:** `MrrGrafigi.tsx` doğrudan test edilmiyor, mantığı `mrr-grafigi.ts`'te test ediliyor.
> 6. **Kısa ay etiketi:** Türkçe `Intl` kısa ay adının "Eki" olarak geleceğini varsayıyorum; testte sabitlenecek, farklı çıkarsa sana göstereceğim.
> 7. **Ayın ilk dakikaları:** Sahte veride bu aya ait kayıt olmadığı için `demo:veri`'deki "ayın ilk 15 dakikası" engeline gerek görmüyorum.
>
> Planı ve yukarıdaki iki soruyu onaylarsan, 5. bölümün 1. ve 2. adımlarıyla başlarım.

### Prompt 6 · 24 Eki 2026 11:29

````text
Planı onaylıyorum. İki kararı da kabul ediyorum.

1) Oturum adresi: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6 (Gün 9 ve 10 commitlerinde de bu vardı).
2) PR açıklaması: "Generated with Claude Code" satırı kuraldaki gibi kalsın.
3) Commit eki model adı:  `Claude Opus 5.5` sohbetteki seçili modeli ben seçiciden okuyup yazdım, sen tahmin etme.

Ek istekler:
- Sahte veri betiğinde örnek e-posta olarak example.com uzantılı adres kullan.
- demo-verisi.ts değişikliğinden sonra npm run demo:veri betiğinin eski davranışını yeni bir test firmasında mutlaka dene, davranış değişmemeli.
- PlanFormu.tsx, planlar/[id]/page.tsx ve abonelik-kontrol.ts ekte. Kod aşamasına bunlara bakarak başla, yine ben onaylamadan kod yazma. Dosyaları touch ile boş açtır, içeriği ben editöre yapıştırırım.
- Cevabın sonunda yine varsayımlarını listele.
````

_[ek dosya: gun11_dosyalar_3.txt]_

### Claude cevabı 5 · 24 Eki 2026 11:31

> # Gün 11 • Parça A: Adım 1 ve 2
>
> Kod aşamasına plan kilidiyle başlıyorum. Bu adımda yeni dosya yok, yalnızca dört mevcut dosya değişiyor. Sonuçları bana yazdıktan sonra Adım 3'e (`sonAylar` ve testleri) geçeceğim.
>
> ---
>
> ## Adım 1: Dal açmak
>
> **Komut 1:** Çalışma klasöründe kaydedilmemiş değişiklik var mı gösterir. "nothing to commit, working tree clean" görmelisin.
> ```
> git status
> ```
>
> **Komut 2:** `main` dalına geçer.
> ```
> git switch main
> ```
>
> **Komut 3:** GitHub'daki son hâli indirir (Gün 10 PR'ı dahil).
> ```
> git pull
> ```
>
> **Komut 4:** Parça A için yeni dalı açar ve ona geçer.
> ```
> git switch -c gun11a-mrr-grafigi
> ```
>
> ---
>
> ## Adım 2: Plan kilidini "herhangi abonelik"e genişletmek
>
> ### Ne değişiyor, neden?
>
> Dosyalara baktım. Kilit bugün iki yerde `aktifAbonelikVarMi` ile kuruluyor:
> - **Sunucu** (`planGuncelle`): asıl engel
> - **Ekran** (`planlar/[id]/page.tsx` → `PlanFormu`): fiyatı salt okunur gösterir
>
> İkisini de aynı yeni kurala bağlıyorum. Böylece ekran "düzenlenebilir" görünüp sunucu reddetmez.
>
> **Veri akışı:** Plan detay sayfası ve `planGuncelle`, `abonelik-kontrol.ts` içindeki yeni `abonelikVarMi` fonksiyonunu çağırır. O da tenant filtreli `db` ile `subscriptions` tablosunda bu plana bağlı kayıtları **durumuna bakmadan** sayar. Yazma yapan tablo yok, yalnızca okuma.
>
> **Yetki ve kiracı:** `count` tenant filtresinden geçer, başka firmanın abonelikleri sayılmaz. Rol kuralı değişmiyor (manager ve finance planı düzenleyebilir).
>
> **Dokunulmayanlar:** `aktifAbonelikVarMi` olduğu gibi kalıyor, çünkü müşteri ve plan pasife almada doğru kural "aktif abonelik". Pasife alma kodu değişmiyor.
>
> **Bilinen sınır (değişmedi):** Kontrol ile güncelleme iki adım olduğu için, tam aynı anda başlatılan bir abonelik küçük bir pencereden geçebilir. Dosyadaki mevcut "bilinen sınır" ile aynı risktir.
>
> ---
>
> ### 2a) `src/lib/abonelik-kontrol.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir:**
>
> ```ts
> // ABONELİK KONTROLLERİ
> //
> // İki kontrol vardır, ikisi de bu dosyadadır. Bu kontrollerin yapıldığı TEK yer burasıdır.
> //
> // 1) aktifAbonelikVarMi: hedefin ACTIVE durumda aboneliği var mı?
> //    Bir müşteri veya plan pasife alınmadan önce çağrılır.
> //
> // 2) abonelikVarMi (Gün 11): hedefe bağlı HERHANGİ bir abonelik var mı (iptal edilmişler dahil)?
> //    Bir planın fiyatı veya aralığı değiştirilmek istendiğinde çağrılır.
> //    Neden aktif değil de herhangi biri? Abonelikte fiyat kopyası yoktur; MRR ve aylık
> //    MRR grafiği planın ŞU ANKİ fiyatından hesaplanır. İptal edilmiş bir abonelik de
> //    geçmişte aktif olduğu aylarda grafiğe girer. Fiyat değişirse o aylar da değişir.
> //    (docs/02_ADR.md, Gün 11, K11.1)
> //
> // Sorgular tenant filtresinden geçen veritabanı nesnesiyle yapılır. "count" işlemi
> // tenant.ts içindeki OKUMA listesinde olduğu için filtreye tenantId otomatik
> // eklenir: başka firmanın abonelikleri hiçbir zaman sayılmaz.
> //
> // Gün 6: İsteğe bağlı ikinci parametre "db" eklendi.
> // - Verilirse o nesne kullanılır (pasife-alma.ts ve testler). Bu nesne de
> //   tenant filtresinden geçen bir nesnedir (TenantDb).
> // - Verilmezse eskisi gibi oturumdan alınır (getTenantDb). Mevcut çağrılar değişmedi.
> //
> // DURUM (Gün 5): Abonelikler artık oluşturuluyor (bkz. abonelikler/actions.ts),
> // bu yüzden kontrol gerçek veriyle çalışır.
> //
> // Pasif kayda aktif abonelik bağlanmasını engelleyen karşı taraf:
> // - abonelikBaslat, abonelik kaydını yazdıktan sonra AYNI veritabanı işleminde
> //   müşterinin ve planın hâlâ isActive=true olduğunu yeniden doğrular. Değilse
> //   işlem geri alınır.
> //
> // BİLİNEN SINIR (docs/02_ADR.md'de de yazılıdır):
> // Pasife alma ve fiyat değiştirme "önce kontrol et, sonra güncelle" şeklinde iki adımdır.
> // Bu işlemlerden biri ile abonelik başlatma TAM AYNI ANDA gelirse, ikisi de birbirinin
> // değişikliğini göremeden tamamlanabilir ve küçük bir pencere kalır. Bunu tamamen
> // kapatmak satır kilidi (SELECT ... FOR UPDATE) gerektirir; o da ham SQL demektir ve
> // projede ham SQL yasaktır (bkz. tenant.ts). Bu risk bilinçli olarak kabul edilmiştir.
>
> import { getTenantDb, type TenantDb } from "./tenant";
>
> type Hedef = { musteriId: string } | { planId: string };
>
> // Hedefe göre sorgu koşulu: müşteri kimliği ya da plan kimliği.
> function hedefKosulu(hedef: Hedef) {
>   return "musteriId" in hedef
>     ? { customerId: hedef.musteriId }
>     : { planId: hedef.planId };
> }
>
> // Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
> // Pasife almada kullanılır.
> export async function aktifAbonelikVarMi(
>   hedef: Hedef,
>   db?: TenantDb
> ): Promise<boolean> {
>   const veritabani = db ?? (await getTenantDb());
>
>   const sayi = await veritabani.subscription.count({
>     where: { ...hedefKosulu(hedef), status: "ACTIVE" },
>   });
>
>   return sayi > 0;
> }
>
> // Verilen müşteriye veya plana bağlı, durumu ne olursa olsun bir abonelik var mı?
> // Plan fiyatı ve aralığı kilidinde kullanılır (Gün 11).
> export async function abonelikVarMi(
>   hedef: Hedef,
>   db?: TenantDb
> ): Promise<boolean> {
>   const veritabani = db ?? (await getTenantDb());
>
>   const sayi = await veritabani.subscription.count({
>     where: hedefKosulu(hedef),
>   });
>
>   return sayi > 0;
> }
> ```
>
> ---
>
> ### 2b) `src/app/(panel)/planlar/actions.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişenler: baş yorum, içe aktarma, `KILITLI_MESAJ` ve `planGuncelle` içindeki kontrol. Geri kalanı aynı.
>
> ```ts
> "use server";
>
> // PLAN SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
> // Kurallar müşteri işlemleriyle aynıdır (bkz. musteriler/actions.ts).
> //
> // Ek kural: plana bağlı HERHANGİ bir abonelik varsa (iptal edilmişler dahil)
> // fiyat ve aralık değiştirilemez. Ad değişikliği serbesttir.
> // Neden? Abonelikte fiyat kopyası yoktur. MRR ve aylık MRR grafiği planın ŞU ANKİ
> // fiyatından hesaplanır. Fiyat değişirse bugünkü MRR ile birlikte o planın
> // abonelerinin aktif olduğu GEÇMİŞ aylar da değişir. Gün 8'de kilit yalnızca aktif
> // abonelik içindi; iptal edilmiş abonelikler de geçmiş aylara girdiği için Gün 11'de
> // genişletildi (docs/02_ADR.md, K11.1). Fiyat değişikliği için yeni plan oluşturulur,
> // eskisi pasife alınır.
> //
> // Gün 6: Pasife alma işleminin mantığı ve rol kontrolü src/lib/pasife-alma.ts
> // dosyasına taşındı (otomatik test edilebilsin diye).
>
> import { revalidatePath } from "next/cache";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula, planGirdisiniDogrula } from "@/lib/validation";
> import { abonelikVarMi } from "@/lib/abonelik-kontrol";
> import { planPasifeAlCekirdek } from "@/lib/pasife-alma";
> import { MESAJ, formMetni, type FormDurumu } from "@/lib/islem";
>
> const KILITLI_MESAJ =
>   "Bu plana bağlı abonelikler var (iptal edilmişler dahil). Fiyat ve aralık değiştirilemez, yalnızca ad değiştirilebilir. Yeni fiyat için yeni bir plan oluşturun ve bu planı pasife alın.";
>
> // Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
> function formDegerleri(formData: FormData) {
>   return {
>     ad: formMetni(formData, "ad"),
>     fiyat: formMetni(formData, "fiyat"),
>     aralik: formMetni(formData, "aralik"),
>   };
> }
>
> // Yeni plan ekler. manager ve finance yapabilir.
> export async function planEkle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   const kullanici = await requireUser();
>   const degerler = formDegerleri(formData);
>
>   const sonuc = planGirdisiniDogrula(degerler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { ad, fiyat, aralik } = sonuc.deger;
>
>   const db = await getTenantDb();
>   try {
>     await db.plan.create({
>       // tenantId OTURUMDAN gelir; tenant.ts uzantısı da zorla üzerine yazar.
>       data: {
>         tenantId: kullanici.tenantId,
>         name: ad,
>         price: fiyat,
>         interval: aralik,
>       },
>     });
>   } catch {
>     console.error("Plan eklenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   revalidatePath("/planlar");
>   return { durum: "basarili", mesaj: `"${ad}" planı eklendi.` };
> }
>
> // Planı günceller. manager ve finance yapabilir.
> export async function planGuncelle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   await requireUser();
>   const degerler = formDegerleri(formData);
>
>   const kimlik = kimlikDogrula(formData.get("id"));
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>   }
>
>   const sonuc = planGirdisiniDogrula(degerler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { ad, fiyat, aralik } = sonuc.deger;
>
>   const db = await getTenantDb();
>   const mevcut = await db.plan.findFirst({
>     where: { id: kimlik.deger },
>     select: { price: true, interval: true },
>   });
>   if (!mevcut) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>   }
>
>   // Fiyat veya aralık değişiyorsa plana bağlı abonelik kontrolü yapılır
>   // (iptal edilmişler dahil; bkz. dosya başı ve abonelik-kontrol.ts).
>   const fiyatVeyaAralikDegisti =
>     mevcut.price !== fiyat || mevcut.interval !== aralik;
>   if (
>     fiyatVeyaAralikDegisti &&
>     (await abonelikVarMi({ planId: kimlik.deger }, db))
>   ) {
>     return { durum: "hata", mesaj: KILITLI_MESAJ, degerler };
>   }
>
>   try {
>     const sonucSatir = await db.plan.updateMany({
>       where: { id: kimlik.deger },
>       data: { name: ad, price: fiyat, interval: aralik },
>     });
>     if (sonucSatir.count === 0) {
>       return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>     }
>   } catch {
>     console.error("Plan güncellenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   revalidatePath("/planlar");
>   revalidatePath(`/planlar/${kimlik.deger}`);
>   return {
>     durum: "basarili",
>     mesaj: "Değişiklikler kaydedildi.",
>     degerler: { ad, fiyat: String(fiyat), aralik },
>   };
> }
>
> // Planı pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
> // Rol kontrolü ve asıl mantık src/lib/pasife-alma.ts içindedir.
> export async function planPasifeAl(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
>   // Giriş yapılmamışsa yönlendirme yapılır (try/catch dışında).
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>
>   const sonuc = await planPasifeAlCekirdek(kullanici, db, formData.get("id"));
>
>   // Yalnızca başarılı işlemde sayfalar yenilenir.
>   if (sonuc.durum === "basarili") {
>     revalidatePath("/planlar");
>     const kimlik = kimlikDogrula(formData.get("id"));
>     if (kimlik.ok) revalidatePath(`/planlar/${kimlik.deger}`);
>   }
>   return sonuc;
> }
> ```
>
> ---
>
> ### 2c) `src/app/(panel)/planlar/[id]/page.tsx` (küçük düzenleme)
>
> Üç satır değişiyor: içe aktarma, yorum ve kontrol çağrısı. Yol parantez içerdiği için tırnak içinde yazıldı (zsh parantezi özel karakter sayar).
>
> **Komut 5:** Sayfadaki kilit kontrolünü yeni fonksiyona bağlar.
> ```
> perl -pi -e 's/import \{ aktifAbonelikVarMi \}/import { abonelikVarMi }/; s/\/\/ Aktif abonelik varsa fiyat ve aralık alanları salt okunur gösterilir\./\/\/ Plana bağlı abonelik varsa (iptal edilmişler dahil) fiyat ve aralık salt okunur gösterilir./; s/await aktifAbonelikVarMi\(\{ planId: plan\.id \}\)/await abonelikVarMi({ planId: plan.id }, db)/' 'src/app/(panel)/planlar/[id]/page.tsx'
> ```
>
> **Komut 6:** Değişen üç satırı gösterir. `abonelikVarMi` iki kez, "iptal edilmişler dahil" bir kez görünmeli; `aktifAbonelikVarMi` hiç görünmemeli.
> ```
> grep -n -E "abonelikVarMi|AbonelikVarMi|iptal edilmişler" 'src/app/(panel)/planlar/[id]/page.tsx'
> ```
>
> ---
>
> ### 2d) `src/app/(panel)/planlar/PlanFormu.tsx` (küçük düzenleme)
>
> İki satır değişiyor: dosya başındaki yorum ve kilitliyken alanın altındaki yardım metni.
>
> **Komut 7:** Yorumu ve yardım metnini yeni kurala göre günceller.
> ```
> perl -pi -e 's/kilitli: planın aktif abonelikleri varsa/kilitli: plana bağlı abonelik varsa (iptal edilmişler dahil)/; s/"Aktif abonelikler olduğu için değiştirilemez\."/"Plana bağlı abonelikler olduğu için (iptal edilmişler dahil) değiştirilemez. Yeni fiyat için yeni plan oluşturun."/' 'src/app/(panel)/planlar/PlanFormu.tsx'
> ```
>
> **Komut 8:** Değişen iki satırı gösterir. İkisinde de "iptal edilmişler dahil" görünmeli.
> ```
> grep -n "iptal edilmişler dahil" 'src/app/(panel)/planlar/PlanFormu.tsx'
> ```
>
> ---
>
> ## Adım 2 kontrolleri
>
> **Komut 9:** Eski fonksiyonun hâlâ nerede kullanıldığını listeler. Yalnızca pasife alma ile ilgili dosyalar ve `abonelik-kontrol.ts` görünmeli, `planlar/` altında olmamalı.
> ```
> grep -rn "aktifAbonelikVarMi" src
> ```
>
> **Komut 10:** Kod kurallarını denetler, hata olmamalı.
> ```
> npm run lint
> ```
>
> **Komut 11:** Veritabanısız testleri çalıştırır; sayı değişmemeli, hepsi geçmeli.
> ```
> npm test
> ```
>
> **Komut 12:** Test dalındaki veritabanı testlerini çalıştırır; pasife alma testleri `aktifAbonelikVarMi`'yi kullandığı için hâlâ geçmeli.
> ```
> npm run test:db
> ```
>
> ### Elle sınama (test dalında)
>
> `demo:veri`'nin "Demo Yıllık 12.000" planı tam aradığımız durum: yalnızca **iptal edilmiş** bir aboneliği var.
>
> 1. **Komut 13:** Uygulamayı test dalında açar. Açık kalsın.
>    ```
>    npm run dev:test
>    ```
> 2. Tarayıcıda yeni bir firma kaydı aç, e-posta: `gun11-kilit@example.com` (parolayı sen belirle, bana yazma).
> 3. **Komut 14:** Yeni bir Terminal sekmesinde (Cmd + T), bu firmaya Gün 9 demo verisini yazar.
>    ```
>    npm run demo:veri -- gun11-kilit@example.com
>    ```
> 4. Planlar sayfasında kontrol et:
>
> | Plan | Durum | Beklenen |
> |---|---|---|
> | Demo Aylık 1.000 | Aktif aboneliği var | Fiyat ve aralık salt okunur (eskisi gibi) |
> | Demo Yıllık 12.000 | Yalnızca iptal edilmiş abonelik | **Artık salt okunur**, yardım metni yeni |
> | Demo Aylık 500 | Yalnızca iptal edilmiş abonelik | **Artık salt okunur** |
> | Yeni eklediğin bir plan | Aboneliği yok | Fiyat ve aralık değiştirilebilir |
> | Kilitli bir planın adı | | Ad değişikliği kaydedilir |
>
> Sonuçları (komut çıktılarındaki sayılar ve tablo) bana yaz. Commit Parça A'nın sonunda tek seferde atılacak.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Tür uyumu:** `hedefKosulu`'nun döndürdüğü `{ customerId } | { planId }` nesnesinin Prisma 7'de `where` olarak doğrudan kabul edileceğini varsayıyorum (eski kod aynı nesneyi `status` ile birleştirip kullanıyordu). `npm run lint` veya `npm run build` hata verirse çıktıyı gönder.
> 2. **`perl` eşleşmeleri:** Komutlar senin gönderdiğin dosya içeriğindeki satırlarla birebir eşleşecek şekilde yazıldı. Komut 6 ve 8 beklenen satırları göstermezse dosyada fark vardır; o zaman tam dosya veririm.
> 3. **Otomatik test yok:** `abonelikVarMi` için ayrı veritabanı testi eklemedim, çünkü `veri.ts`'teki test firmasının hangi alanları döndürdüğünü görmedim. Elle sınama yeterli değilse, `veri.ts`'i paylaşırsan `test:db`'ye bir test eklerim.
> 4. **Eski veriler:** Kural genişlemeden önce yalnızca iptal edilmiş aboneliği olan bir planın fiyatı değiştirildiyse geçmiş aylar zaten etkilenmiş olabilir. ADR'ye bilinen sınır olarak yazılacak.
> 5. **`demo:veri`'nin eski davranış denemesi:** Bu adımda `demo:veri` henüz değişmedi, burada yalnızca test verisi için kullanıyoruz. Asıl "davranış değişmedi" denemesi, Adım 9'da `donemleriIlerlet` taşındıktan sonra **yeni** bir test firmasında yapılacak.
> 6. **Oturum adresi ve model adı:** Commit ekinde senin verdiğin `Claude Opus 5.5` ve `https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6` kullanılacak; ad taramasının desenini bu cevaba bilerek yazmadım.

### Prompt 7 · 24 Eki 2026 11:33

````text
kullanici@bilgisayar abonetakip % grep -n -E "abonelikVarMi|AbonelikVarMi|iptal edilmişler" 'src/app/(panel)/planlar/[id]/page.tsx'
6:import { abonelikVarMi } from "@/lib/abonelik-kontrol";
31:  // Plana bağlı abonelik varsa (iptal edilmişler dahil) fiyat ve aralık salt okunur gösterilir.
32:  const kilitli = await abonelikVarMi({ planId: plan.id }, db);
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 6 · 24 Eki 2026 11:33

> Komut 6'nın çıktısı beklendiği gibi: içe aktarma, yorum ve kontrol çağrısı yeni fonksiyona bağlanmış, `aktifAbonelikVarMi` bu dosyada kalmamış. 2c tamam.
>
> Küçük bir hatırlatma: Bu çıktıyı `prompt_cevap/` günlüğüne yapıştırırsan, terminal satırının başındaki kullanıcı adı ve bilgisayar adı kısmını önce maskele. Ad taraması onu yakalar.
>
> Sıradaki adım 2d. 2a ve 2b'yi (iki tam dosya) editörde yapıştırdıysan devam et.
>
> **Komut 7:** `PlanFormu.tsx` içindeki yorumu ve kilitliyken görünen yardım metnini yeni kurala göre günceller.
> ```
> perl -pi -e 's/kilitli: planın aktif abonelikleri varsa/kilitli: plana bağlı abonelik varsa (iptal edilmişler dahil)/; s/"Aktif abonelikler olduğu için değiştirilemez\."/"Plana bağlı abonelikler olduğu için (iptal edilmişler dahil) değiştirilemez. Yeni fiyat için yeni plan oluşturun."/' 'src/app/(panel)/planlar/PlanFormu.tsx'
> ```
>
> **Komut 8:** Değişen satırları gösterir. İki satır görünmeli: biri dosya başındaki yorum, biri yardım metni.
> ```
> grep -n "iptal edilmişler dahil" 'src/app/(panel)/planlar/PlanFormu.tsx'
> ```
>
> Ardından önceki mesajdaki Komut 9–12'yi sırayla çalıştır (eski fonksiyonun kullanıldığı yerler, lint, `npm test`, `npm run test:db`) ve elle sınama tablosunu doldur. Çıktıları bana gönder, sonra Adım 3'e geçelim.

### Prompt 8 · 24 Eki 2026 11:37

````text
Last login: Sat Oct 24 09:32:38 on ttys000
kullanici@bilgisayar abonetakip %    npm run demo:veri -- gun11-kilit@example.com

> abonetakip@0.1.0 demo:veri
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/demo-verisi.ts gun11-kilit@example.com

(node:84932) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/demo-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:84932) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.
Demo verisi eklendi (test dalı): 3 plan, 3 müşteri, 3 abonelik (2'si bu ay iptal).
Dashboard'da beklenen (CAC girilmeden önce):
  MRR 1.000 TL | Aylık churn %66,7 | LTV 1.500 TL | LTV/CAC: CAC girilmedi
  Aktif müşteri 1 | Bu ay yeni 0 | Bu ay iptal 2
Ayarlar'dan CAC 5000 girildikten sonra: LTV/CAC 0,3 ve 'Dikkat'.
kullanici@bilgisayar abonetakip %
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 7 · 24 Eki 2026 11:38

> Demo verisi doğru yazılmış ve plan listesinde üç plan görünüyor. Terminaldeki iki uyarı (`MODULE_TYPELESS_PACKAGE_JSON` ve SSL modu) önceki günlerde de olan bilgi uyarıları; bu adımla ilgisi yok, dokunmuyoruz.
>
> Not: Listedeki "Aktif" rozeti **planın** pasif olup olmadığını gösterir, abonelik durumunu değil. Kilidi görmek için her planın düzenleme sayfasına girmen gerekiyor.
>
> ## Şimdi denenecekler
>
> Her satırda **Düzenle**'ye tıkla ve "Bilgiler" bölümüne bak:
>
> | # | Ne yap | Beklenen |
> |---|---|---|
> | 1 | **Demo Yıllık 12.000** → Düzenle | Fiyat salt okunur, Aralık seçilemez, altında yeni yardım metni: "Plana bağlı abonelikler olduğu için (iptal edilmişler dahil) değiştirilemez. Yeni fiyat için yeni plan oluşturun." **Bu, değişikliğin asıl kanıtı** (bu planın yalnızca iptal edilmiş aboneliği var) |
> | 2 | **Demo Aylık 500** → Düzenle | 1 ile aynı |
> | 3 | **Demo Aylık 1.000** → Düzenle | Yine kilitli (aktif aboneliği var, eskisi gibi) |
> | 4 | Kilitli planlardan birinin **adını** değiştir (ör. "Demo Aylık 500 eski"), kaydet | "Değişiklikler kaydedildi." |
> | 5 | Yukarıdaki formdan yeni plan ekle: ad "Kilit Deneme", fiyat 100, Aylık | Listeye eklenir |
> | 6 | **Kilit Deneme** → Düzenle, fiyatı 150 yap, kaydet | Fiyat düzenlenebilir ve "Değişiklikler kaydedildi." |
>
> Bana her satır için "oldu / olmadı" yazman yeterli. 1. satırın ekran görüntüsünü de gönderirsen yardım metnini birlikte kontrol ederiz.
>
> ## Henüz görmediğim çıktılar
>
> Önceki mesajdaki şu komutların çıktısını da gönder:
> - **Komut 8:** `PlanFormu.tsx` içinde "iptal edilmişler dahil" iki satır görünüyor mu?
> - **Komut 9:** `aktifAbonelikVarMi` nerelerde kalmış?
> - **Komut 10–12:** `npm run lint`, `npm test` ve `npm run test:db` sonuçları (son satırlardaki geçen/kalan test sayıları yeterli)
>
> Hatırlatma: Terminal çıktısını `prompt_cevap/` günlüğüne koyarken satır başındaki kullanıcı adı ve dosya yollarındaki kullanıcı klasörü adı maskelenmeli; ad taraması ikisini de yakalar.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Firma eşleşmesi:** Ekrandaki "deneme 11 ltd." firmasının `gun11-kilit@example.com` ile açtığın firma olduğunu varsayıyorum; plan listesi demo verisiyle uyuştuğu için büyük olasılıkla öyle.
> 2. **2a ve 2b yapıştırıldı mı:** Ekranda yalnızca liste görünüyor, düzenleme sayfası henüz yok. İki tam dosyanın editörde yapıştırılıp kaydedildiğini, `npm run dev:test`'in de bu hâli yüklediğini varsayıyorum. 1. satırda eski metni ("Aktif abonelikler olduğu için…") görürsen dosyalardan biri kaydedilmemiş ya da Komut 7 çalışmamış demektir.
> 3. **Uyarılar:** İki terminal uyarısının bu daldan önce de çıktığını varsayıyorum. İlk kez görüyorsan söyle.

### Prompt 9 · 24 Eki 2026 11:42

````text
her satır oldu , 8 9 10 11 12 komutları da olması gerektiği gibidir
````

### Claude cevabı 8 · 24 Eki 2026 11:44

> Adım 2 tamam: kilit hem sunucuda hem ekranda yeni kurala göre çalışıyor, eski testler bozulmadı.
>
> # Adım 3: `sonAylar` ve geçmiş MRR testleri
>
> ## Ne yapıyoruz?
>
> Grafiğin "son 12 ay" listesine ihtiyacı var. `turkiyeAyi` yalnızca bulunduğumuz ayı veriyor; Ocak'tan geriye Aralık'a ve önceki yıla geçen bir liste yok. Bu yüzden `metrikler.ts`'e tek küçük saf fonksiyon ekliyoruz:
>
> - `sonAylar(simdi, adet)` → `turkiyeAyi(simdi)`'den başlayıp geriye doğru `adet` kadar `{yil, ay}`, **eskiden yeniye** sıralı. Son eleman bu aydır.
> - Yöntem: Her ayı tek bir sayıya çeviriyoruz (`yil × 12 + ay`), geriye sayıyoruz, sonra yeniden yıl ve aya ayırıyoruz. Yıl geçişi kendiliğinden çözülüyor.
>
> **Veritabanı, tenant, yetki:** Bu adımda hiçbiri yok. Yalnızca saf fonksiyon ve test.
>
> **Testlere eklenenler (5 yeni test):**
> 1. 24 Ekim 2026 için 12 ay: Kasım 2025 – Ekim 2026
> 2. Yıl geçişi: Şubat 2027'den 3 ay geriye → Aralık 2026, Ocak 2027, Şubat 2027
> 3. Gece 00:30 (TR), UTC'de hâlâ önceki ay: yeni ay sayılır
> 4. `adet` 1 ve 0
> 5. **Geçmiş MRR senaryosu:** Plandaki A–E müşterileriyle 12 ayın beklenen değeri (Mayıs 4.583 dahil) ve "son nokta = kart" eşitliği. Sahte veri betiği de aynı senaryoyu yazacak.
>
> `metrikler.test.ts` zaten `npm test` betiğinde, `package.json` değişmiyor.
>
> ---
>
> ## 3a) `src/lib/metrikler.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişen tek yer: en alttaki "Dashboard yardımcıları" bölümünde `turkiyeAyi`'nin hemen altına eklenen `sonAylar`. Geri kalanı birebir aynı.
>
> ```ts
> // METRİK HESAPLAMA FONKSİYONLARI (MRR, churn, ARPU, ömür, LTV, LTV/CAC)
> //
> // Bu dosyadaki bütün fonksiyonlar "saf"tır:
> //   - Veritabanına dokunmaz, Prisma'yı içe aktarmaz.
> //   - Saate kendisi bakmaz. "Şu an" gerekiyorsa parametre olarak alır.
> //   - Aynı girdiye her zaman aynı sonucu verir.
> // Kiracı (tenant) filtresi bu dosyada YOKTUR ve olmamalıdır. Veriyi okuyan sunucu kodu,
> // kayıtları merkezi tenant yardımcısıyla zaten filtrelenmiş olarak buraya verir.
> //
> // "HESAPLANAMADI" KURALI (null):
> // Sıfıra bölme gereken her durumda sonuç null döner.
> //   - 0 döndürmüyoruz: "LTV = 0 TL" yöneticiye "müşteriler değersiz" gibi yanlış bir mesaj verir.
> //   - Infinity döndürmüyoruz: ekranda anlamsız görünür ve JSON'a çevrilemez (null olur).
> // null "bu değer şu an hesaplanamıyor" demektir. Nedeni metrikOzeti içinde metin olarak verilir.
> //
> // YUVARLAMA KURALI:
> // İç hesaplarda hiç yuvarlama yapılmaz (ör. yıllık 1.000 TL -> aylık 83,333...).
> // Yuvarlama yalnızca dışarıya sonuç veren iki fonksiyonda (metrikOzeti, mrrGecmisi)
> // ve yalnızca tek bir yardımcıyla (yuvarla) yapılır:
> //   - Para (MRR, ARPU, LTV): en yakın tam TL
> //   - Churn: 4 ondalık (Gün 9). Ekranda yüzde olarak 1 ondalıkla gösterilir:
> //     2/3 -> 0,6667 -> "%66,7". 2 ondalık olsaydı 0,67 -> "%67,0" görünürdü.
> //   - LTV/CAC: 2 ondalık
> //   - Ortalama ömür (ay): 1 ondalık
> // Not: Ömür, LTV ve LTV/CAC yuvarlanmış churn'den değil HAM churn'den hesaplanır.
> // Bu yüzden churn yuvarlamasını değiştirmek bu üç değeri etkilemez.
>
> import type { Aralik } from "./donem";
>
> // ---------- Tipler ----------
>
> // Hesaplama için gereken düz abonelik verisi. Prisma kaydından sunucu tarafında üretilir.
> export type AbonelikGirdisi = {
>   customerId: string;
>   fiyat: number; // Planın fiyatı, TL, tam sayı
>   aralik: Aralik; // "MONTHLY" | "YEARLY"
>   status: "ACTIVE" | "CANCELED";
>   startedAt: Date;
>   canceledAt: Date | null;
> };
>
> // Bir takvim ayının sınırları: baslangic dahil, bitis hariç.
> export type AyAraligi = {
>   baslangic: Date;
>   bitis: Date;
> };
>
> // MRR grafiğinin bir noktası
> export type MrrNoktasi = {
>   yil: number;
>   ay: number; // 1-12
>   mrr: number; // tam TL
> };
>
> // Dashboard'a gidecek özet
> export type MetrikOzeti = {
>   mrr: number; // tam TL, hiçbir zaman null değil
>   aktifMusteri: number;
>   churn: number | null; // 0,04 = %4. 4 ondalık (ör. 0,6667)
>   arpu: number | null;
>   ortalamaOmurAy: number | null;
>   ltv: number | null;
>   ltvCac: number | null;
>   // Yalnızca null olan alanlar için Türkçe açıklama
>   nedenler: Partial<Record<"churn" | "arpu" | "ortalamaOmurAy" | "ltv" | "ltvCac", string>>;
> };
>
> // Bir aydaki müşteri hareketi (Gün 9). İkisi de müşteri sayısıdır.
> export type AyHareketi = {
>   yeni: number;
>   iptal: number;
> };
>
> // ---------- Yardımcılar ----------
>
> // Türkiye saati UTC'nin 3 saat ilerisidir (2016'dan beri yaz saati uygulanmıyor).
> const TURKIYE_FARKI_MS = 3 * 60 * 60 * 1000;
>
> // Türkiye saatine göre bir takvim ayının başını ve sonunu UTC tarih olarak verir.
> // ay: 1 (Ocak) ... 12 (Aralık).
> // Örnek: Kasım 2026 -> baslangic 31 Ekim 21:00 UTC (= 1 Kasım 00:00 TR),
> //                      bitis      30 Kasım 21:00 UTC (= 1 Aralık 00:00 TR).
> // Aralık için Date.UTC ayı 12 alınca kendiliğinden sonraki yılın Ocak ayına geçer.
> export function ayAraligi(yil: number, ay: number): AyAraligi {
>   const baslangic = new Date(Date.UTC(yil, ay - 1, 1) - TURKIYE_FARKI_MS);
>   const bitis = new Date(Date.UTC(yil, ay, 1) - TURKIYE_FARKI_MS);
>   return { baslangic, bitis };
> }
>
> // "Ay başı" anı: ay başlangıcından 1 ms önce (önceki ayın son anı).
> // Böylece iki ay boşluksuz birbirine bağlanır: tam 1'i 00:00'da yapılan bir iptal
> // yeni ayın hesabına girer. Ay başlangıcının kendisine baksaydık bu iptal hiçbir aya sayılmazdı.
> function ayBasiAni(aralik: AyAraligi): Date {
>   return new Date(aralik.baslangic.getTime() - 1);
> }
>
> // Ayın son anı: bitişten 1 milisaniye önce. Ay sonu durumları bu ana göre değerlendirilir.
> // Neden bitis değil? Tam bitis anında (1'inin 00:00'ı) yapılan bir iptal SONRAKİ aya aittir;
> // bitis anına bakarsak o iptali yanlışlıkla bu aya yazardık.
> function ayinSonAni(aralik: AyAraligi): Date {
>   return new Date(aralik.bitis.getTime() - 1);
> }
>
> // Tek yuvarlama noktası. basamak = ondalık basamak sayısı (0 = tam sayı).
> // Not: Math.round yarımları yukarı yuvarlar (2,5 -> 3). Negatif değer beklenmiyor.
> function yuvarla(deger: number, basamak: number): number {
>   const carpan = 10 ** basamak;
>   return Math.round(deger * carpan) / carpan;
> }
>
> // Aynı değeri null'ı koruyarak yuvarlar.
> function yuvarlaVeyaNull(deger: number | null, basamak: number): number | null {
>   return deger === null ? null : yuvarla(deger, basamak);
> }
>
> // ---------- Hesap fonksiyonları ----------
>
> // Aylık fiyat = aylık planda fiyatın kendisi, yıllık planda fiyat / 12.
> // Yuvarlanmaz: 1.000 / 12 = 83,333... olarak taşınır.
> export function aylikFiyat(fiyat: number, aralik: Aralik): number {
>   return aralik === "YEARLY" ? fiyat / 12 : fiyat;
> }
>
> // Bir abonelik bir tarihte aktif mi?
> // Kural: startedAt <= tarih VE (canceledAt boş VEYA canceledAt > tarih).
> // Yani başladığı an aktif sayılır, iptal edildiği an artık aktif sayılmaz.
> // Not: Geçmişe bakarken status alanına değil tarihlere bakılır.
> export function tarihteAktifMi(abonelik: AbonelikGirdisi, tarih: Date): boolean {
>   const basladi = abonelik.startedAt.getTime() <= tarih.getTime();
>   const iptalOlmadi =
>     abonelik.canceledAt === null || abonelik.canceledAt.getTime() > tarih.getTime();
>   return basladi && iptalOlmadi;
> }
>
> // MRR (bugün) = status'u ACTIVE olan aboneliklerin aylık fiyatlarının toplamı.
> // Liste boşsa 0 döner: "hiç gelir yok" gerçek bir değerdir, null değildir.
> export function mrrHesapla(abonelikler: AbonelikGirdisi[]): number {
>   return abonelikler
>     .filter((a) => a.status === "ACTIVE")
>     .reduce((toplam, a) => toplam + aylikFiyat(a.fiyat, a.aralik), 0);
> }
>
> // Belirli bir tarihteki MRR = o tarihte aktif olan aboneliklerin aylık fiyat toplamı.
> // Grafik için kullanılır. Aktiflik tarihteAktifMi kuralıyla belirlenir.
> export function tarihtekiMrr(abonelikler: AbonelikGirdisi[], tarih: Date): number {
>   return abonelikler
>     .filter((a) => tarihteAktifMi(a, tarih))
>     .reduce((toplam, a) => toplam + aylikFiyat(a.fiyat, a.aralik), 0);
> }
>
> // Aylık MRR geçmişi (grafik). Her ay için ayın son anındaki MRR alınır.
> // İçinde bulunulan ay (veya gelecek bir ay) için ayın sonu yerine "şimdi" kullanılır.
> // simdi parametre olarak gelir, böylece fonksiyon saf kalır ve test edilebilir.
> // Para değeri olduğu için sonuç tam TL'ye yuvarlanır.
> export function mrrGecmisi(
>   abonelikler: AbonelikGirdisi[],
>   aylar: { yil: number; ay: number }[],
>   simdi: Date
> ): MrrNoktasi[] {
>   return aylar.map(({ yil, ay }) => {
>     const sonAn = ayinSonAni(ayAraligi(yil, ay));
>     const bakilacakAn = sonAn.getTime() < simdi.getTime() ? sonAn : simdi;
>     return { yil, ay, mrr: yuvarla(tarihtekiMrr(abonelikler, bakilacakAn), 0) };
>   });
> }
>
> // Aktif müşteri sayısı = ACTIVE aboneliği olan FARKLI müşteri sayısı.
> // Kural: bir müşterinin aynı anda tek ACTIVE aboneliği olur. Yine de sayım
> // müşteri kimliğine göre yapılır; böylece veri hatalı olsa bile müşteri iki kez sayılmaz.
> export function aktifMusteriSayisi(abonelikler: AbonelikGirdisi[]): number {
>   const musteriler = new Set(
>     abonelikler.filter((a) => a.status === "ACTIVE").map((a) => a.customerId)
>   );
>   return musteriler.size;
> }
>
> // Belirli bir anda aktif aboneliği olan müşterilerin kimlikleri (iç yardımcı).
> function andaAktifMusteriler(abonelikler: AbonelikGirdisi[], an: Date): Set<string> {
>   return new Set(abonelikler.filter((a) => tarihteAktifMi(a, an)).map((a) => a.customerId));
> }
>
> // Aylık churn = ay içinde iptal eden müşteriler / ay başındaki aktif müşteriler.
> // Müşteri bazlı yorum (ADR kararı):
> //   - Payda: ay başında aktif aboneliği olan farklı müşteriler.
> //   - Pay: bunlardan ayın son anında HİÇ aktif aboneliği kalmayanlar.
> // Sonuçları:
> //   - Ay içinde gelip aynı ay giden müşteri sayılmaz (paydada yok, paya da girmez).
> //   - Ay içinde iptal edip yeni abonelik başlatan (plan değiştiren) müşteri churn değildir.
> // "Ay başı" için bkz. ayBasiAni.
> // Ay başında aktif müşteri yoksa sıfıra bölme olur -> null.
> export function aylikChurn(abonelikler: AbonelikGirdisi[], aralik: AyAraligi): number | null {
>   const ayBasindakiler = andaAktifMusteriler(abonelikler, ayBasiAni(aralik));
>   if (ayBasindakiler.size === 0) return null;
>
>   const aySonundakiler = andaAktifMusteriler(abonelikler, ayinSonAni(aralik));
>   let kaybedilen = 0;
>   for (const musteriId of ayBasindakiler) {
>     if (!aySonundakiler.has(musteriId)) kaybedilen++;
>   }
>   return kaybedilen / ayBasindakiler.size;
> }
>
> // ARPU = MRR / aktif müşteri sayısı. Aktif müşteri yoksa null.
> export function arpuHesapla(mrr: number, aktifMusteri: number): number | null {
>   if (aktifMusteri <= 0) return null;
>   return mrr / aktifMusteri;
> }
>
> // Ortalama ömür (ay) = 1 / churn.
> // churn null ise (hesaplanamadıysa) null.
> // churn 0 ise null: bu ay kimse ayrılmadı diye müşterilerin "sonsuza kadar" kalacağı
> // söylenemez; ömür bu veriyle tahmin edilemez.
> export function ortalamaOmur(churn: number | null): number | null {
>   if (churn === null || churn <= 0) return null;
>   return 1 / churn;
> }
>
> // LTV = ARPU x ortalama ömür. İkisinden biri null ise null.
> export function ltvHesapla(arpu: number | null, omurAy: number | null): number | null {
>   if (arpu === null || omurAy === null) return null;
>   return arpu * omurAy;
> }
>
> // LTV/CAC = LTV / CAC. CAC tenant ayarından gelir (veritabanında varsayılan 0).
> // LTV null ise veya CAC girilmemişse (null ya da 0) null. 3 ve üzeri sağlıklı kabul edilir.
> export function ltvCacOrani(ltv: number | null, cac: number | null): number | null {
>   if (ltv === null || cac === null || cac <= 0) return null;
>   return ltv / cac;
> }
>
> // Bütün metrikleri tek seferde hesaplar, yuvarlar ve null olanlara neden ekler.
> // Dashboard bu fonksiyonun sonucunu doğrudan gösterebilir.
> //   - mrr, aktifMusteri, arpu: bugünkü duruma (status = ACTIVE) göre
> //   - churn ve ona bağlı ömür/LTV: verilen ay aralığına göre
> export function metrikOzeti(
>   abonelikler: AbonelikGirdisi[],
>   churnAyi: AyAraligi,
>   cac: number | null
> ): MetrikOzeti {
>   // 1) Ham (yuvarlanmamış) değerler
>   const mrr = mrrHesapla(abonelikler);
>   const aktifMusteri = aktifMusteriSayisi(abonelikler);
>   const churn = aylikChurn(abonelikler, churnAyi);
>   const arpu = arpuHesapla(mrr, aktifMusteri);
>   const omur = ortalamaOmur(churn);
>   const ltv = ltvHesapla(arpu, omur);
>   const ltvCac = ltvCacOrani(ltv, cac);
>
>   // 2) Null olanlar için ekranda gösterilecek nedenler
>   const nedenler: MetrikOzeti["nedenler"] = {};
>   if (churn === null) nedenler.churn = "Ay başında aktif müşteri yok, churn hesaplanamadı.";
>   if (arpu === null) nedenler.arpu = "Aktif müşteri yok, ARPU hesaplanamadı.";
>   if (omur === null) {
>     nedenler.ortalamaOmurAy =
>       churn === null
>         ? "Churn hesaplanamadığı için ömür hesaplanamadı."
>         : "Bu ay iptal yok, ortalama ömür tahmin edilemiyor.";
>   }
>   if (ltv === null) {
>     nedenler.ltv =
>       arpu === null
>         ? "Aktif müşteri yok, LTV hesaplanamadı."
>         : "Ortalama ömür hesaplanamadığı için LTV hesaplanamadı.";
>   }
>   if (ltvCac === null) {
>     nedenler.ltvCac =
>       ltv === null
>         ? "LTV hesaplanamadığı için LTV/CAC hesaplanamadı."
>         : "CAC girilmemiş. Ayarlardan CAC girin.";
>   }
>
>   // 3) Yuvarlama: yalnızca burada ve yalnızca yuvarla ile
>   return {
>     mrr: yuvarla(mrr, 0),
>     aktifMusteri,
>     churn: yuvarlaVeyaNull(churn, 4),
>     arpu: yuvarlaVeyaNull(arpu, 0),
>     ortalamaOmurAy: yuvarlaVeyaNull(omur, 1),
>     ltv: yuvarlaVeyaNull(ltv, 0),
>     ltvCac: yuvarlaVeyaNull(ltvCac, 2),
>     nedenler,
>   };
> }
>
> // ---------- Dashboard yardımcıları (Gün 9) ----------
>
> // Verilen an, Türkiye saatine göre hangi yılın hangi ayında? (ay: 1-12)
> // Sunucu (Render) UTC çalışır. Gece 00:00-03:00 arasında UTC hâlâ önceki aydadır;
> // bu yüzden ay, Türkiye farkı eklenerek bulunur. Sonuç ayAraligi'ne verilir.
> export function turkiyeAyi(an: Date): { yil: number; ay: number } {
>   const turkiyeSaatiyle = new Date(an.getTime() + TURKIYE_FARKI_MS);
>   return { yil: turkiyeSaatiyle.getUTCFullYear(), ay: turkiyeSaatiyle.getUTCMonth() + 1 };
> }
>
> // Son "adet" takvim ayı (Gün 11, MRR grafiği). Türkiye saatine göre, ESKİDEN YENİYE sıralı;
> // son eleman simdi'nin içinde bulunduğu aydır. Sonuç doğrudan mrrGecmisi'ne verilir.
> // Neden ayrı fonksiyon? turkiyeAyi yalnızca bulunulan ayı verir. Geriye doğru sayarken
> // Ocak'tan önceki yılın Aralık ayına geçmek gerekir. Her ay tek bir sıra numarasına
> // çevrilir (yil x 12 + ay - 1), geriye sayılır ve yeniden yıl/ay olarak ayrılır;
> // böylece yıl geçişi ayrıca ele alınmaz. adet 0 veya negatifse boş liste döner.
> export function sonAylar(simdi: Date, adet: number): { yil: number; ay: number }[] {
>   const { yil, ay } = turkiyeAyi(simdi);
>   const buAyinSirasi = yil * 12 + (ay - 1);
>   const aylar: { yil: number; ay: number }[] = [];
>   for (let geri = adet - 1; geri >= 0; geri--) {
>     const sira = buAyinSirasi - geri;
>     aylar.push({ yil: Math.floor(sira / 12), ay: (sira % 12) + 1 });
>   }
>   return aylar;
> }
>
> // Bir aydaki müşteri hareketi. Churn ile AYNI müşteri bazlı mantık ve AYNI iki an:
> //   - iptal: ay başında aktif olup ayın son anında HİÇ aktif aboneliği kalmayan müşteri.
> //            Bu sayı churn'ün payıyla birebir aynıdır.
> //   - yeni:  ay başında aktif aboneliği olmayıp ayın son anında aktif aboneliği olan müşteri.
> // Sonuçları:
> //   - Plan değiştiren müşteri (iptal + yeni abonelik) ne yeni ne iptal sayılır.
> //   - Ay içinde gelip aynı ay giden müşteri ne yeni ne iptal sayılır.
> // İçinde bulunulan ay için "ayın son anı" henüz gelmemiştir. Gelecek tarihli başlangıç
> // ve iptal olmadığı için sonuç "ay başından bugüne" ile aynıdır.
> export function ayHareketi(abonelikler: AbonelikGirdisi[], aralik: AyAraligi): AyHareketi {
>   const ayBasindakiler = andaAktifMusteriler(abonelikler, ayBasiAni(aralik));
>   const aySonundakiler = andaAktifMusteriler(abonelikler, ayinSonAni(aralik));
>
>   let iptal = 0;
>   for (const musteriId of ayBasindakiler) {
>     if (!aySonundakiler.has(musteriId)) iptal++;
>   }
>   let yeni = 0;
>   for (const musteriId of aySonundakiler) {
>     if (!ayBasindakiler.has(musteriId)) yeni++;
>   }
>   return { yeni, iptal };
> }
>
> // LTV/CAC için sağlıklılık eşiği (sektörde sık anılan değer, ADR kararı).
> export const LTV_CAC_SAGLIKLI_ESIK = 3;
>
> // LTV/CAC oranı sağlıklı mı? 3 ve üzeri sağlıklı, altı "dikkat".
> // Dashboard'da gösterilen (2 ondalığa yuvarlanmış) değerle çağrılır; böylece ekrandaki
> // sayı ile etiket her zaman birbiriyle tutarlıdır.
> export function ltvCacSaglikliMi(oran: number): boolean {
>   return oran >= LTV_CAC_SAGLIKLI_ESIK;
> }
> ```
>
> ---
>
> ## 3b) `src/lib/metrikler.test.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişenler: içe aktarma listesine `sonAylar`, "MRR GEÇMİŞİ" bölümünün sonuna senaryo testi, en sona `sonAylar` bölümü. Mevcut testlerin hiçbiri değişmedi.
>
> ```ts
> // METRİK HESAPLAMA BİRİM TESTİ
> //
> // Çalıştırmak için: npm test
> // Ek paket gerekmez: Node'un yerleşik test aracı kullanılır.
> // Veritabanı gerekmez: fonksiyonlar düz veriyle çalışır.
> // Bütün tarihler Türkiye saatiyle (+03:00) yazılmıştır. Müşteri kimlikleri sahtedir.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import {
>   type AbonelikGirdisi,
>   ayAraligi,
>   aylikFiyat,
>   tarihteAktifMi,
>   mrrHesapla,
>   tarihtekiMrr,
>   mrrGecmisi,
>   aktifMusteriSayisi,
>   aylikChurn,
>   arpuHesapla,
>   ortalamaOmur,
>   ltvHesapla,
>   ltvCacOrani,
>   metrikOzeti,
>   turkiyeAyi,
>   sonAylar,
>   ayHareketi,
>   ltvCacSaglikliMi,
> } from "./metrikler.ts";
>
> // ---------- Kısa yardımcılar ----------
>
> // Türkiye saatiyle tarih üretir. Örnek: tr("2026-10-01T00:00") -> 1 Ekim 00:00 TR
> function tr(metin: string): Date {
>   return new Date(`${metin}:00+03:00`);
> }
>
> // Test aboneliği üretir. Verilmeyen alanlar: aylık 1.000 TL, ACTIVE, 1 Ocak 2026'da başlamış.
> function abonelik(degisiklik: Partial<AbonelikGirdisi> & { customerId: string }): AbonelikGirdisi {
>   return {
>     fiyat: 1000,
>     aralik: "MONTHLY",
>     status: "ACTIVE",
>     startedAt: tr("2026-01-01T10:00"),
>     canceledAt: null,
>     ...degisiklik,
>   };
> }
>
> // İptal edilmiş abonelik kısayolu
> function iptalli(customerId: string, canceledAt: Date, ek: Partial<AbonelikGirdisi> = {}) {
>   return abonelik({ customerId, status: "CANCELED", canceledAt, ...ek });
> }
>
> const EKIM_2026 = ayAraligi(2026, 10);
>
> // ---------- Ortak senaryolar ----------
> // Aynı liste hem metrikOzeti hem ayHareketi testlerinde kullanılır.
>
> // Ders örneği: Eylül'den beri 50 müşteri. Ekim'de 2'si gider, 2 yeni gelir.
> function dersOrnegiListesi(): AbonelikGirdisi[] {
>   const liste: AbonelikGirdisi[] = [];
>   // Eylül'den beri aktif 48 müşteri (Ekim boyunca kalıyor)
>   for (let i = 1; i <= 48; i++) {
>     liste.push(abonelik({ customerId: `musteri-${i}`, startedAt: tr("2026-09-01T10:00") }));
>   }
>   // Eylül'den beri aktif, Ekim içinde iptal eden 2 müşteri
>   liste.push(iptalli("musteri-49", tr("2026-10-10T14:00"), { startedAt: tr("2026-09-01T10:00") }));
>   liste.push(iptalli("musteri-50", tr("2026-10-20T09:00"), { startedAt: tr("2026-09-01T10:00") }));
>   // Ekim içinde gelen 2 yeni müşteri
>   liste.push(abonelik({ customerId: "musteri-51", startedAt: tr("2026-10-05T11:00") }));
>   liste.push(abonelik({ customerId: "musteri-52", startedAt: tr("2026-10-15T16:00") }));
>   return liste;
> }
>
> // Gün 9 elle test senaryosu: 3 müşteri Eylül'den beri aktif, Ekim'de 2'si iptal ediyor.
> //   A: aylık 1.000 TL, kalıyor
> //   B: yıllık 12.000 TL (aylık 1.000), 10 Ekim'de iptal
> //   C: aylık 500 TL, 20 Ekim'de iptal
> function gun9SenaryoListesi(): AbonelikGirdisi[] {
>   const eylulBasi = tr("2026-09-01T10:00");
>   return [
>     abonelik({ customerId: "a", fiyat: 1000, startedAt: eylulBasi }),
>     iptalli("b", tr("2026-10-10T10:00"), {
>       fiyat: 12000,
>       aralik: "YEARLY",
>       startedAt: eylulBasi,
>     }),
>     iptalli("c", tr("2026-10-20T10:00"), { fiyat: 500, startedAt: eylulBasi }),
>   ];
> }
>
> // Gün 11 geçmiş MRR senaryosu ("şimdi" = 24 Ekim 2026). Sahte veri betiği
> // (demo:gecmis) aynı senaryoyu çalıştırıldığı aya göre kaydırarak yazar.
> //   A: aylık 1.000, 10 Ağustos 2025'ten beri (12 aydan eski veri)
> //   B: yıllık 12.000 (aylık 1.000), 15 Ocak 2026'dan beri
> //   C: aylık 500, 5 Mart 2026 - 10 Haziran 2026 (ay içinde iptal)
> //   D: yıllık 1.000 (aylık 83,33...), 1 Mayıs 2026 00:30'dan beri (ay sınırı + küsurat)
> //   E: aylık 2.000, 20 Kasım 2025 - 1 Eylül 2026 00:00 (tam ay sınırında iptal)
> function gun11SenaryoListesi(): AbonelikGirdisi[] {
>   return [
>     abonelik({ customerId: "a", fiyat: 1000, startedAt: tr("2025-08-10T10:00") }),
>     abonelik({
>       customerId: "b",
>       fiyat: 12000,
>       aralik: "YEARLY",
>       startedAt: tr("2026-01-15T10:00"),
>     }),
>     iptalli("c", tr("2026-06-10T10:00"), { fiyat: 500, startedAt: tr("2026-03-05T10:00") }),
>     abonelik({
>       customerId: "d",
>       fiyat: 1000,
>       aralik: "YEARLY",
>       startedAt: tr("2026-05-01T00:30"),
>     }),
>     iptalli("e", tr("2026-09-01T00:00"), { fiyat: 2000, startedAt: tr("2025-11-20T10:00") }),
>   ];
> }
>
> // =====================================================================
> // DERSTEKİ DOĞRULAMA ÖRNEĞİ
> // 50 müşteri, her biri aylık 1.000 TL, aylık churn %4, CAC 5.000 TL.
> // Beklenen: MRR 50.000, ömür 25 ay, LTV 25.000, LTV/CAC 5.
> // =====================================================================
>
> test("ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5", () => {
>   const mrr = 50 * 1000;
>   assert.equal(mrr, 50000);
>
>   const arpu = arpuHesapla(mrr, 50);
>   assert.equal(arpu, 1000);
>
>   const omur = ortalamaOmur(0.04);
>   assert.ok(omur !== null);
>   // Ondalıklı sayılarda bilgisayar 25,000000000000004 gibi küçük farklar verebilir.
>   // Bu yüzden ham değer "25'e çok yakın mı" diye kontrol edilir.
>   assert.ok(Math.abs(omur - 25) < 1e-9, `ömür 25 olmalı, ${omur} geldi`);
>
>   const ltv = ltvHesapla(arpu, omur);
>   assert.ok(ltv !== null && Math.abs(ltv - 25000) < 1e-6, `LTV 25.000 olmalı, ${ltv} geldi`);
>
>   const oran = ltvCacOrani(ltv, 5000);
>   assert.ok(oran !== null && Math.abs(oran - 5) < 1e-9, `LTV/CAC 5 olmalı, ${oran} geldi`);
> });
>
> test("ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir", () => {
>   const ozet = metrikOzeti(dersOrnegiListesi(), EKIM_2026, 5000);
>
>   assert.equal(ozet.mrr, 50000);
>   assert.equal(ozet.aktifMusteri, 50);
>   assert.equal(ozet.churn, 0.04); // 2 / 50
>   assert.equal(ozet.arpu, 1000);
>   assert.equal(ozet.ortalamaOmurAy, 25);
>   assert.equal(ozet.ltv, 25000);
>   assert.equal(ozet.ltvCac, 5);
>   assert.deepEqual(ozet.nedenler, {});
> });
>
> // =====================================================================
> // GÜN 9 ELLE TEST SENARYOSU
> // Dashboard'da elle karşılaştırılacak değerlerin kaynağı bu testtir.
> // Beklenen: MRR 1.000, churn 0,6667 (ekranda %66,7), ARPU 1.000,
> //           ömür 1,5 ay, LTV 1.500, LTV/CAC 0,3 ("Dikkat").
> // =====================================================================
>
> test("Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000", () => {
>   const ozet = metrikOzeti(gun9SenaryoListesi(), EKIM_2026, 5000);
>
>   assert.equal(ozet.mrr, 1000); // yalnızca A
>   assert.equal(ozet.aktifMusteri, 1);
>   assert.equal(ozet.churn, 0.6667); // 2 / 3, 4 ondalık
>   assert.equal(ozet.arpu, 1000); // 1.000 / 1
>   assert.equal(ozet.ortalamaOmurAy, 1.5); // 1 / (2/3), ham churn'den
>   assert.equal(ozet.ltv, 1500); // 1.000 x 1,5
>   assert.equal(ozet.ltvCac, 0.3); // 1.500 / 5.000, 3'ün altı: "Dikkat"
>   assert.deepEqual(ozet.nedenler, {});
> });
>
> // =====================================================================
> // SIFIRA BÖLME VE "HESAPLANAMADI" DURUMLARI
> // =====================================================================
>
> test("boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null", () => {
>   const ozet = metrikOzeti([], EKIM_2026, 5000);
>   assert.equal(ozet.mrr, 0);
>   assert.equal(ozet.aktifMusteri, 0);
>   assert.equal(ozet.arpu, null);
>   assert.equal(ozet.churn, null);
>   assert.equal(ozet.ortalamaOmurAy, null);
>   assert.equal(ozet.ltv, null);
>   assert.equal(ozet.ltvCac, null);
>   assert.ok(ozet.nedenler.arpu);
>   assert.ok(ozet.nedenler.churn);
> });
>
> test("churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır", () => {
>   const liste = [
>     abonelik({ customerId: "a" }),
>     abonelik({ customerId: "b" }),
>   ];
>   const ozet = metrikOzeti(liste, EKIM_2026, 5000);
>   assert.equal(ozet.churn, 0);
>   assert.equal(ozet.arpu, 1000); // ARPU yine hesaplanır
>   assert.equal(ozet.ortalamaOmurAy, null);
>   assert.equal(ozet.ltv, null);
>   assert.equal(ozet.ltvCac, null);
>   assert.equal(ozet.nedenler.ortalamaOmurAy, "Bu ay iptal yok, ortalama ömür tahmin edilemiyor.");
> });
>
> test("ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz)", () => {
>   const liste = [abonelik({ customerId: "a", startedAt: tr("2026-10-12T10:00") })];
>   assert.equal(aylikChurn(liste, EKIM_2026), null);
>   assert.equal(ortalamaOmur(null), null);
> });
>
> test("CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni", () => {
>   assert.equal(ltvCacOrani(25000, 0), null);
>   assert.equal(ltvCacOrani(25000, null), null);
>   assert.equal(ltvCacOrani(null, 5000), null);
>
>   // Churn'ü %50 olan küçük bir örnek: LTV hesaplanır ama CAC 0
>   const liste = [
>     abonelik({ customerId: "a" }),
>     iptalli("b", tr("2026-10-10T10:00")),
>   ];
>   const ozet = metrikOzeti(liste, EKIM_2026, 0);
>   assert.ok(ozet.ltv !== null);
>   assert.equal(ozet.ltvCac, null);
>   assert.equal(ozet.nedenler.ltvCac, "CAC girilmemiş. Ayarlardan CAC girin.");
> });
>
> test("aktif müşteri 0: ARPU null", () => {
>   assert.equal(arpuHesapla(0, 0), null);
>   assert.equal(ltvHesapla(null, 25), null);
> });
>
> // =====================================================================
> // YILLIK PLAN VE YUVARLAMA
> // =====================================================================
>
> test("yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83", () => {
>   assert.equal(aylikFiyat(12000, "YEARLY"), 1000);
>   assert.equal(aylikFiyat(1000, "MONTHLY"), 1000);
>
>   // İç hesapta yuvarlama yok
>   const ham = aylikFiyat(1000, "YEARLY");
>   assert.ok(Math.abs(ham - 1000 / 12) < 1e-12);
>
>   // Yuvarlama yalnızca özette
>   const ozet = metrikOzeti(
>     [abonelik({ customerId: "a", fiyat: 1000, aralik: "YEARLY" })],
>     EKIM_2026,
>     null
>   );
>   assert.equal(ozet.mrr, 83);
> });
>
> test("ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil)", () => {
>   const liste = ["a", "b", "c"].map((id) =>
>     abonelik({ customerId: id, fiyat: 1000, aralik: "YEARLY" })
>   );
>   assert.equal(metrikOzeti(liste, EKIM_2026, null).mrr, 250);
> });
>
> test("churn 4 ondalığa yuvarlanır: 1/3 -> 0,3333 (ham değer yuvarlanmaz)", () => {
>   // 3 müşteri ay başında aktif, 1'i Ekim'de iptal ediyor.
>   const liste = [
>     abonelik({ customerId: "a" }),
>     abonelik({ customerId: "b" }),
>     iptalli("c", tr("2026-10-15T10:00")),
>   ];
>   // Ham değer: yuvarlama yok
>   const ham = aylikChurn(liste, EKIM_2026);
>   assert.ok(ham !== null && Math.abs(ham - 1 / 3) < 1e-12);
>   // Özette: 4 ondalık
>   const ozet = metrikOzeti(liste, EKIM_2026, null);
>   assert.equal(ozet.churn, 0.3333);
>   // Ömür ham churn'den hesaplanır: 1 / (1/3) = 3 (1 / 0,3333 = 3,0003 değil)
>   assert.equal(ozet.ortalamaOmurAy, 3);
> });
>
> // =====================================================================
> // TARİH SINIRLARI
> // =====================================================================
>
> test("tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil", () => {
>   const an = tr("2026-10-15T12:00");
>   assert.equal(tarihteAktifMi(abonelik({ customerId: "a", startedAt: an }), an), true);
>   assert.equal(tarihteAktifMi(iptalli("a", an), an), false);
>   // İptalden 1 ms önce hâlâ aktif
>   assert.equal(tarihteAktifMi(iptalli("a", an), new Date(an.getTime() - 1)), true);
> });
>
> test("ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi", () => {
>   const kasim = ayAraligi(2026, 11);
>   assert.equal(kasim.baslangic.toISOString(), "2026-10-31T21:00:00.000Z"); // 1 Kasım 00:00 TR
>   assert.equal(kasim.bitis.toISOString(), "2026-11-30T21:00:00.000Z"); // 1 Aralık 00:00 TR
>
>   const aralik = ayAraligi(2026, 12);
>   assert.equal(aralik.bitis.toISOString(), "2026-12-31T21:00:00.000Z"); // 1 Ocak 2027 00:00 TR
> });
>
> test("1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez", () => {
>   // UTC'de bu an hâlâ 31 Ekim 22:00'dir. UTC'ye göre ay ayırsaydık Ekim'e düşerdi.
>   const liste = [
>     abonelik({ customerId: "kalan" }),
>     iptalli("giden", tr("2026-11-01T01:00")),
>   ];
>   assert.equal(aylikChurn(liste, ayAraligi(2026, 10)), 0);
>   assert.equal(aylikChurn(liste, ayAraligi(2026, 11)), 0.5);
> });
>
> test("tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir", () => {
>   const liste = [abonelik({ customerId: "kalan" }), iptalli("giden", tr("2026-11-01T00:00"))];
>   assert.equal(aylikChurn(liste, ayAraligi(2026, 10)), 0);
>   assert.equal(aylikChurn(liste, ayAraligi(2026, 11)), 0.5);
> });
>
> // =====================================================================
> // MÜŞTERİ BAZLI SAYIM (KURAL: müşteri başına tek ACTIVE abonelik)
> // =====================================================================
>
> test("aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır", () => {
>   const liste = [
>     iptalli("a", tr("2026-05-01T10:00")),
>     abonelik({ customerId: "a", startedAt: tr("2026-05-01T10:00") }),
>   ];
>   assert.equal(aktifMusteriSayisi(liste), 1);
>   assert.equal(mrrHesapla(liste), 1000);
> });
>
> test("ay içinde gelip aynı ay giden müşteri churn'e girmez", () => {
>   const liste = [
>     abonelik({ customerId: "a" }),
>     abonelik({ customerId: "b" }),
>     iptalli("gecici", tr("2026-10-20T10:00"), { startedAt: tr("2026-10-05T10:00") }),
>   ];
>   assert.equal(aylikChurn(liste, EKIM_2026), 0); // 0 / 2
> });
>
> test("ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir", () => {
>   const liste = [
>     abonelik({ customerId: "b" }),
>     // "a" eski planı 10 Ekim'de iptal etti, aynı anda yeni plana geçti
>     iptalli("a", tr("2026-10-10T10:00")),
>     abonelik({ customerId: "a", fiyat: 2000, startedAt: tr("2026-10-10T10:00") }),
>   ];
>   assert.equal(aylikChurn(liste, EKIM_2026), 0);
>   assert.equal(mrrHesapla(liste), 3000);
> });
>
> // =====================================================================
> // MRR GEÇMİŞİ (GRAFİK)
> // =====================================================================
>
> test("mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi'", () => {
>   const liste = [
>     abonelik({ customerId: "a", startedAt: tr("2026-08-10T10:00") }), // Ağustos'tan beri
>     iptalli("b", tr("2026-09-20T10:00"), { startedAt: tr("2026-08-15T10:00") }), // Eylül'de gitti
>     abonelik({ customerId: "c", startedAt: tr("2026-10-25T10:00") }), // "şimdi"den sonra başlıyor
>   ];
>   const simdi = tr("2026-10-22T20:00");
>
>   const sonuc = mrrGecmisi(
>     liste,
>     [
>       { yil: 2026, ay: 8 },
>       { yil: 2026, ay: 9 },
>       { yil: 2026, ay: 10 },
>     ],
>     simdi
>   );
>
>   assert.deepEqual(sonuc, [
>     { yil: 2026, ay: 8, mrr: 2000 }, // a + b
>     { yil: 2026, ay: 9, mrr: 1000 }, // yalnızca a
>     { yil: 2026, ay: 10, mrr: 1000 }, // 22 Ekim'e kadar: c henüz yok
>   ]);
>   assert.equal(tarihtekiMrr(liste, tr("2026-10-31T23:00")), 2000);
> });
>
> test("Gün 11 senaryosu: son 12 ayın MRR'ı (12 aydan eski veri, yıllık plan, ay sınırları)", () => {
>   const liste = gun11SenaryoListesi();
>   const simdi = tr("2026-10-24T11:00");
>
>   const sonuc = mrrGecmisi(liste, sonAylar(simdi, 12), simdi);
>
>   assert.deepEqual(sonuc, [
>     { yil: 2025, ay: 11, mrr: 3000 }, // A + E (A 12 aydan eski)
>     { yil: 2025, ay: 12, mrr: 3000 },
>     { yil: 2026, ay: 1, mrr: 4000 }, // + B (yıllık 12.000 -> 1.000)
>     { yil: 2026, ay: 2, mrr: 4000 },
>     { yil: 2026, ay: 3, mrr: 4500 }, // + C
>     { yil: 2026, ay: 4, mrr: 4500 }, // D 1 Mayıs 00:30'da başlıyor: Nisan'da yok
>     { yil: 2026, ay: 5, mrr: 4583 }, // elle hesap: 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33
>     { yil: 2026, ay: 6, mrr: 4083 }, // C 10 Haziran'da gitti
>     { yil: 2026, ay: 7, mrr: 4083 },
>     { yil: 2026, ay: 8, mrr: 4083 }, // E 1 Eylül 00:00'da gitti: Ağustos'un son anında hâlâ var
>     { yil: 2026, ay: 9, mrr: 2083 }, // E yok
>     { yil: 2026, ay: 10, mrr: 2083 }, // bu ay: "şimdi"ye göre
>   ]);
>
>   // Grafiğin son noktası MRR kartıyla aynı (Gün 11, Karar 2: tutarlı veride eşitlik).
>   const kart = metrikOzeti(liste, EKIM_2026, null).mrr;
>   assert.equal(kart, 2083);
>   assert.equal(sonuc[sonuc.length - 1].mrr, kart);
> });
>
> // =====================================================================
> // AY HAREKETİ: YENİ VE İPTAL SAYISI (Gün 9)
> // Churn ile aynı müşteri bazlı mantık. "iptal" her zaman churn'ün payına eşittir.
> // =====================================================================
>
> test("ayHareketi: Gün 9 senaryosu -> yeni 0, iptal 2; iptal / ay başı = churn", () => {
>   const liste = gun9SenaryoListesi();
>   assert.deepEqual(ayHareketi(liste, EKIM_2026), { yeni: 0, iptal: 2 });
>   // Ay başında 3 müşteri vardı: 2 / 3 = ham churn
>   assert.equal(2 / 3, aylikChurn(liste, EKIM_2026));
> });
>
> test("ayHareketi: ders örneği -> yeni 2, iptal 2; iptal / ay başı = churn", () => {
>   const liste = dersOrnegiListesi();
>   assert.deepEqual(ayHareketi(liste, EKIM_2026), { yeni: 2, iptal: 2 });
>   // Ay başında 50 müşteri vardı: 2 / 50 = 0,04
>   assert.equal(2 / 50, aylikChurn(liste, EKIM_2026));
> });
>
> test("ayHareketi: plan değiştiren müşteri ne yeni ne iptal sayılır", () => {
>   const liste = [
>     abonelik({ customerId: "b" }),
>     iptalli("a", tr("2026-10-10T10:00")),
>     abonelik({ customerId: "a", fiyat: 2000, startedAt: tr("2026-10-10T10:00") }),
>   ];
>   assert.deepEqual(ayHareketi(liste, EKIM_2026), { yeni: 0, iptal: 0 });
> });
>
> test("ayHareketi: ay içinde gelip aynı ay giden müşteri ne yeni ne iptal sayılır", () => {
>   const liste = [
>     abonelik({ customerId: "a" }),
>     iptalli("gecici", tr("2026-10-20T10:00"), { startedAt: tr("2026-10-05T10:00") }),
>   ];
>   assert.deepEqual(ayHareketi(liste, EKIM_2026), { yeni: 0, iptal: 0 });
> });
>
> test("ayHareketi: boş liste -> yeni 0, iptal 0", () => {
>   assert.deepEqual(ayHareketi([], EKIM_2026), { yeni: 0, iptal: 0 });
> });
>
> // =====================================================================
> // TÜRKİYE AYI VE SAĞLIKLILIK EŞİĞİ (Gün 9)
> // =====================================================================
>
> test("turkiyeAyi: ay, UTC'ye değil Türkiye saatine göre belirlenir", () => {
>   // 31 Ekim 20:59 UTC = 31 Ekim 23:59 TR -> Ekim
>   assert.deepEqual(turkiyeAyi(new Date("2026-10-31T20:59:00Z")), { yil: 2026, ay: 10 });
>   // 31 Ekim 21:00 UTC = 1 Kasım 00:00 TR -> Kasım (UTC'de hâlâ Ekim)
>   assert.deepEqual(turkiyeAyi(new Date("2026-10-31T21:00:00Z")), { yil: 2026, ay: 11 });
>   // 31 Aralık 21:00 UTC = 1 Ocak 2027 00:00 TR -> yıl da değişir
>   assert.deepEqual(turkiyeAyi(new Date("2026-12-31T21:00:00Z")), { yil: 2027, ay: 1 });
>   // ayAraligi ile birlikte: bulunan ayın aralığı o anı içerir
>   const an = new Date("2026-10-31T22:30:00Z"); // 1 Kasım 01:30 TR
>   const { yil, ay } = turkiyeAyi(an);
>   const aralik = ayAraligi(yil, ay);
>   assert.ok(aralik.baslangic.getTime() <= an.getTime() && an.getTime() < aralik.bitis.getTime());
> });
>
> test("ltvCacSaglikliMi: 3 ve üzeri sağlıklı, altı değil", () => {
>   assert.equal(ltvCacSaglikliMi(3), true);
>   assert.equal(ltvCacSaglikliMi(5), true);
>   assert.equal(ltvCacSaglikliMi(2.99), false);
>   assert.equal(ltvCacSaglikliMi(0.3), false);
> });
>
> // =====================================================================
> // SON AYLAR (Gün 11, MRR grafiği)
> // =====================================================================
>
> test("sonAylar: 24 Ekim 2026 için son 12 ay, eskiden yeniye (Kasım 2025 - Ekim 2026)", () => {
>   const aylar = sonAylar(tr("2026-10-24T11:00"), 12);
>   assert.equal(aylar.length, 12);
>   assert.deepEqual(aylar[0], { yil: 2025, ay: 11 });
>   assert.deepEqual(aylar[1], { yil: 2025, ay: 12 });
>   assert.deepEqual(aylar[2], { yil: 2026, ay: 1 });
>   assert.deepEqual(aylar[11], { yil: 2026, ay: 10 });
> });
>
> test("sonAylar: Ocak'tan geriye önceki yılın Aralık ayına geçer", () => {
>   assert.deepEqual(sonAylar(tr("2027-02-15T10:00"), 3), [
>     { yil: 2026, ay: 12 },
>     { yil: 2027, ay: 1 },
>     { yil: 2027, ay: 2 },
>   ]);
> });
>
> test("sonAylar: gece 00:30 (TR) yeni ay sayılır, UTC'de hâlâ önceki ay olsa bile", () => {
>   // 1 Kasım 00:30 TR = 31 Ekim 21:30 UTC
>   assert.deepEqual(sonAylar(tr("2026-11-01T00:30"), 2), [
>     { yil: 2026, ay: 10 },
>     { yil: 2026, ay: 11 },
>   ]);
> });
>
> test("sonAylar: adet 1 yalnızca bu ay, adet 0 boş liste", () => {
>   const simdi = tr("2026-10-24T11:00");
>   assert.deepEqual(sonAylar(simdi, 1), [{ yil: 2026, ay: 10 }]);
>   assert.deepEqual(sonAylar(simdi, 0), []);
> });
> ```
>
> ---
>
> ## Adım 3 kontrolleri
>
> **Komut 1:** Kod kurallarını denetler; hata olmamalı.
> ```
> npm run lint
> ```
>
> **Komut 2:** Veritabanısız testleri çalıştırır. Önceki çalıştırmaya göre **5 test fazla** olmalı ve hepsi geçmeli. Son satırlardaki `tests`, `pass` ve `fail` sayılarını gönder.
> ```
> npm test
> ```
>
> Bir test kalırsa (`fail` 0 değilse) hata mesajının tamamını gönder; tahmin edip değiştirmeyeceğim.
>
> Sonra Adım 4'e geçeceğiz: `mrr-grafigi.ts` (eksen üst sınırı ve özet cümle) ve testleri. O adımda ilk yeni dosyalar `touch` ile açılacak.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Senaryo değerleri:** 12 ayın değerlerini elle hesapladım. Test başka bir değer verirse önce hesabımı kontrol edeceğim, hesap doğruysa sorun kodda değil senaryo tarihindedir; ikisini birlikte inceleriz.
> 2. **Önceki test sayısı:** Komut 11'in çıktısında kaç test geçtiğini görmedim. "5 fazla" karşılaştırmasını sen yapacaksın; ADR Gün 8'de 37 test yazıyordu, Gün 9–10 ile artmış olmalı.
> 3. **`sonAylar`'ın yeri:** "Dashboard yardımcıları" bölümüne, `turkiyeAyi`'nin altına koydum; Gün 9'un düzeniyle uyumlu olduğunu varsayıyorum.
> 4. **Negatif sıra:** `sira % 12` yalnızca pozitif sayılarla doğru çalışır. Yıl 0'dan önceye gidecek kadar geriye sayılmayacağı için sorun olmadığını varsayıyorum.

### Prompt 10 · 24 Eki 2026 11:46

````text
ADIM 4 E GEÇEBİLİRİZ BİRDE LOCAL İ DURDURAYIM MI KALSIN MI
````

### Claude cevabı 9 · 24 Eki 2026 11:47

> Yerel sunucu **kalabilir**. Bu adımda yalnızca saf fonksiyon ve test yazıyoruz, sunucuya ihtiyaç yok ama zararı da yok. Adım 7'de grafiği ekranda görmek için zaten açık olması gerekecek. Durdurmak istersen, çalıştığı Terminal sekmesinde **Control + C** (Cmd değil). Testleri ayrı bir sekmede çalıştırmaya devam et.
>
> # Adım 4: Grafik yardımcıları (`mrr-grafigi.ts`)
>
> ## Ne yapıyoruz?
>
> Grafik bileşeninin hesap gerektiren iki parçasını test edilebilir saf fonksiyonlara ayırıyoruz. Bileşen (Adım 6) yalnızca çizecek.
>
> 1. **`eksenUstSiniri(enBuyuk)`**: Dikey eksenin "yuvarlak" üst sınırı. 1, 2, 2,5, 5 ve 10'un katlarından değere eşit ya da büyük ilkini seçer. Örnek: 4.583 → 5.000, 2.083 → 2.500. Hepsi 0 ya da çok küçükse en az 100.
> 2. **`eksenDegerleri(ust)`**: Eksen çizgileri: 0, yarısı, üst sınır. En az 100 olduğu için yarısı hep tam sayı.
> 3. **`grafikOzeti(noktalar)`**: Erişilebilirlik için özet cümle. Örnek: "Son 12 ayda MRR 3.000 TL'den 2.083 TL'ye düştü (Kasım 2025 – Ekim 2026). En yüksek değer 4.583 TL (Mayıs 2026)."
>    Türkçe ek uyumu sorun çıkarmasın diye ekler yalnızca "TL"ye gelir ("TL'den", "TL'ye"), ay adlarına ek getirilmez.
>
> **MRR hesabı burada yok**; değerler `mrrGecmisi`'nden hazır gelir. Veritabanı, tenant ve yetki de yok.
>
> **Testler:** 9 yeni test. Yeni test dosyası olduğu için `package.json`'daki `test` betiğine ekleniyor (veritabanısız).
>
> ---
>
> ## 4a) Boş dosyaları aç
>
> **Komut 1:** Yardımcı fonksiyonlar için boş dosya oluşturur.
> ```
> touch src/lib/mrr-grafigi.ts
> ```
>
> **Komut 2:** Testleri için boş dosya oluşturur.
> ```
> touch src/lib/mrr-grafigi.test.ts
> ```
>
> ## 4b) `src/lib/mrr-grafigi.ts`
>
> Yeni dosyayı editörde aç ve şu içeriği yapıştır:
>
> ```ts
> // MRR GRAFİĞİ YARDIMCILARI (Gün 11)
> //
> // Dashboard'daki aylık MRR grafiğinin (src/app/(panel)/dashboard/MrrGrafigi.tsx)
> // test edilebilir mantığı burada durur. Bileşen yalnızca çizer.
> //
> // Bütün fonksiyonlar saftır: veritabanı, oturum ve saat yok.
> // MRR hesabı burada YAPILMAZ. Değerler metrikler.ts içindeki mrrGecmisi'nden
> // hazır (tam TL'ye yuvarlanmış) gelir; burada yalnızca eksen ve metin hazırlanır.
>
> import type { MrrNoktasi } from "./metrikler";
> import { ayEtiketi, tlMetni } from "./bicim";
>
> // Dikey eksenin en küçük üst sınırı. Bütün değerler 0 ya da çok küçükse eksen
> // 0-100 TL olur. Böylece ortadaki çizgi (50 TL) her zaman tam sayıdır.
> const EN_KUCUK_UST_SINIR = 100;
>
> // Üst sınır için "yuvarlak" çarpanlar: 1, 2, 2,5, 5 ve 10'un basamak katları.
> // Örnek: 4.583 -> 5.000, 2.083 -> 2.500, 150 -> 200, 12.000 -> 20.000.
> const CARPANLAR = [1, 2, 2.5, 5, 10];
>
> // En büyük değere eşit ya da ondan büyük ilk "yuvarlak" sayıyı verir.
> // 100'ün altındaki (ya da sayı olmayan) değerlerde 100 döner.
> // Basamak 100 ve üstü olduğu için sonuç her zaman çift tam sayıdır (yarısı da tam sayı).
> export function eksenUstSiniri(enBuyuk: number): number {
>   if (!(enBuyuk > EN_KUCUK_UST_SINIR)) return EN_KUCUK_UST_SINIR;
>
>   // Basamak: enBuyuk'ten büyük olmayan en büyük 10'un kuvveti (4.583 -> 1.000).
>   let basamak = 1;
>   while (basamak * 10 <= enBuyuk) basamak *= 10;
>
>   for (const carpan of CARPANLAR) {
>     if (carpan * basamak >= enBuyuk) return carpan * basamak;
>   }
>   // Buraya ulaşılmaz: 10 x basamak her zaman enBuyuk'ten büyüktür.
>   return 10 * basamak;
> }
>
> // Yatay eksen çizgilerinin değerleri: 0, üst sınırın yarısı ve üst sınır.
> export function eksenDegerleri(ustSinir: number): number[] {
>   return [0, ustSinir / 2, ustSinir];
> }
>
> // Grafiğin metin alternatifi: ekran okuyucu ve rengi ayırt edemeyen kullanıcı için.
> // Ekler yalnızca "TL"ye gelir ("TL'den", "TL'ye"); ay adlarına ek getirilmez,
> // çünkü Türkçe ek uyumu yıla göre değişir ("2025'teki", "2026'daki").
> // En yüksek değer birden çok ayda varsa en eski ay yazılır.
> export function grafikOzeti(noktalar: MrrNoktasi[]): string {
>   if (noktalar.length === 0) return "MRR verisi yok.";
>
>   const ilk = noktalar[0];
>   const son = noktalar[noktalar.length - 1];
>   const sonEtiket = ayEtiketi(son.yil, son.ay);
>
>   if (noktalar.length === 1) return `MRR ${tlMetni(son.mrr)} (${sonEtiket}).`;
>
>   const bas = `Son ${noktalar.length} ayda MRR`;
>   const donem = `${ayEtiketi(ilk.yil, ilk.ay)} – ${sonEtiket}`;
>
>   if (noktalar.every((n) => n.mrr === 0)) return `${bas} 0 TL (${donem}).`;
>
>   let degisim: string;
>   if (son.mrr > ilk.mrr) {
>     degisim = `${tlMetni(ilk.mrr)}'den ${tlMetni(son.mrr)}'ye yükseldi`;
>   } else if (son.mrr < ilk.mrr) {
>     degisim = `${tlMetni(ilk.mrr)}'den ${tlMetni(son.mrr)}'ye düştü`;
>   } else {
>     degisim = `ilk ve son ayda aynı: ${tlMetni(son.mrr)}`;
>   }
>
>   // En yüksek değer: eşitlikte ilk (en eski) ay kalır, çünkü ">" kullanılıyor.
>   let enYuksek = ilk;
>   for (const nokta of noktalar) {
>     if (nokta.mrr > enYuksek.mrr) enYuksek = nokta;
>   }
>
>   return (
>     `${bas} ${degisim} (${donem}). ` +
>     `En yüksek değer ${tlMetni(enYuksek.mrr)} (${ayEtiketi(enYuksek.yil, enYuksek.ay)}).`
>   );
> }
> ```
>
> ## 4c) `src/lib/mrr-grafigi.test.ts`
>
> Yeni dosyayı editörde aç ve şu içeriği yapıştır:
>
> ```ts
> // MRR GRAFİĞİ YARDIMCILARI BİRİM TESTİ (Gün 11)
> //
> // Çalıştırmak için: npm test
> // Veritabanı gerekmez. Grafik noktaları elle yazılmıştır; Gün 11 senaryosunun
> // değerleri metrikler.test.ts içindeki "Gün 11 senaryosu" testiyle aynıdır.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import type { MrrNoktasi } from "./metrikler.ts";
> import { eksenUstSiniri, eksenDegerleri, grafikOzeti } from "./mrr-grafigi.ts";
>
> // Kısa yardımcı: [yil, ay, mrr] üçlülerinden nokta listesi üretir.
> function noktalar(liste: [number, number, number][]): MrrNoktasi[] {
>   return liste.map(([yil, ay, mrr]) => ({ yil, ay, mrr }));
> }
>
> // Gün 11 senaryosu: Kasım 2025 - Ekim 2026
> const GUN11 = noktalar([
>   [2025, 11, 3000],
>   [2025, 12, 3000],
>   [2026, 1, 4000],
>   [2026, 2, 4000],
>   [2026, 3, 4500],
>   [2026, 4, 4500],
>   [2026, 5, 4583],
>   [2026, 6, 4083],
>   [2026, 7, 4083],
>   [2026, 8, 4083],
>   [2026, 9, 2083],
>   [2026, 10, 2083],
> ]);
>
> // =====================================================================
> // EKSEN
> // =====================================================================
>
> test("eksenUstSiniri: değere eşit ya da büyük ilk yuvarlak sayı", () => {
>   assert.equal(eksenUstSiniri(4583), 5000); // Gün 11 en yüksek değer
>   assert.equal(eksenUstSiniri(2083), 2500);
>   assert.equal(eksenUstSiniri(3000), 5000);
>   assert.equal(eksenUstSiniri(5000), 5000); // tam eşitse kendisi
>   assert.equal(eksenUstSiniri(150), 200);
>   assert.equal(eksenUstSiniri(12000), 20000);
> });
>
> test("eksenUstSiniri: 0, küçük değer ve sayı olmayan değerde en az 100", () => {
>   assert.equal(eksenUstSiniri(0), 100);
>   assert.equal(eksenUstSiniri(83), 100);
>   assert.equal(eksenUstSiniri(100), 100);
>   assert.equal(eksenUstSiniri(Number.NaN), 100);
> });
>
> test("eksenDegerleri: 0, yarısı ve üst sınır; yarısı tam sayı", () => {
>   assert.deepEqual(eksenDegerleri(2500), [0, 1250, 2500]);
>   assert.deepEqual(eksenDegerleri(100), [0, 50, 100]);
>   assert.deepEqual(eksenDegerleri(5000), [0, 2500, 5000]);
> });
>
> // =====================================================================
> // ÖZET CÜMLE
> // =====================================================================
>
> test("grafikOzeti: Gün 11 senaryosu (düşüş, en yüksek Mayıs)", () => {
>   assert.equal(
>     grafikOzeti(GUN11),
>     "Son 12 ayda MRR 3.000 TL'den 2.083 TL'ye düştü (Kasım 2025 – Ekim 2026). " +
>       "En yüksek değer 4.583 TL (Mayıs 2026)."
>   );
> });
>
> test("grafikOzeti: artış", () => {
>   assert.equal(
>     grafikOzeti(noktalar([[2026, 9, 1000], [2026, 10, 2000]])),
>     "Son 2 ayda MRR 1.000 TL'den 2.000 TL'ye yükseldi (Eylül 2026 – Ekim 2026). " +
>       "En yüksek değer 2.000 TL (Ekim 2026)."
>   );
> });
>
> test("grafikOzeti: ilk ve son ay aynı (arada değişse bile 'değişmedi' denmez)", () => {
>   assert.equal(
>     grafikOzeti(noktalar([[2026, 8, 3000], [2026, 9, 4000], [2026, 10, 3000]])),
>     "Son 3 ayda MRR ilk ve son ayda aynı: 3.000 TL (Ağustos 2026 – Ekim 2026). " +
>       "En yüksek değer 4.000 TL (Eylül 2026)."
>   );
> });
>
> test("grafikOzeti: bütün aylar 0 ise en yüksek değer yazılmaz", () => {
>   const sifirlar = GUN11.map((n) => ({ ...n, mrr: 0 }));
>   assert.equal(grafikOzeti(sifirlar), "Son 12 ayda MRR 0 TL (Kasım 2025 – Ekim 2026).");
> });
>
> test("grafikOzeti: en yüksek değer birden çok ayda varsa en eski ay yazılır", () => {
>   assert.equal(
>     grafikOzeti(noktalar([[2026, 8, 1000], [2026, 9, 5000], [2026, 10, 5000]])),
>     "Son 3 ayda MRR 1.000 TL'den 5.000 TL'ye yükseldi (Ağustos 2026 – Ekim 2026). " +
>       "En yüksek değer 5.000 TL (Eylül 2026)."
>   );
> });
>
> test("grafikOzeti: tek nokta ve boş liste", () => {
>   assert.equal(grafikOzeti(noktalar([[2026, 10, 2083]])), "MRR 2.083 TL (Ekim 2026).");
>   assert.equal(grafikOzeti([]), "MRR verisi yok.");
> });
> ```
>
> ## 4d) Testi `npm test` betiğine eklemek
>
> **Komut 3:** `package.json`'daki `test` betiğinin sonuna yeni test dosyasını ekler. (`riskli-etiket.test.ts` yalnızca bu betikte, en sonda geçiyor; eşleşme tek yerde olur.)
> ```
> perl -pi -e 's/src\/lib\/riskli-etiket\.test\.ts"/src\/lib\/riskli-etiket.test.ts src\/lib\/mrr-grafigi.test.ts"/' package.json
> ```
>
> **Komut 4:** Eklemenin bir kez yapıldığını doğrular; çıktı `1` olmalı.
> ```
> grep -c "mrr-grafigi.test.ts" package.json
> ```
>
> ---
>
> ## Adım 4 kontrolleri
>
> **Komut 5:** Kod kurallarını denetler; hata olmamalı.
> ```
> npm run lint
> ```
>
> **Komut 6:** Veritabanısız testleri çalıştırır. Adım 3'e göre **9 test fazla** olmalı ve `fail 0` görünmeli.
> ```
> npm test
> ```
>
> Lütfen bu sefer Komut 4'ün çıktısını ve Komut 6'nın son satırlarındaki `tests`, `pass`, `fail` sayılarını gönder; Adım 3 için de sayıları biliyorsan ekle. Bir test kalırsa hata mesajının tamamını gönder.
>
> Sonraki adım (Adım 5): `bicim.ts`'e kısa ay etiketi ("Eki 26") ve `dashboard-verisi.ts`'e `mrrGecmisi` alanı.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Adım 3 sonucu:** "Geçebiliriz" dediğin için `npm test`'in Adım 3'te `fail 0` verdiğini varsayıyorum; sayıları görmedim.
> 2. **İçe aktarma uzantısı:** `mrr-grafigi.ts` içinde `./metrikler` ve `./bicim` uzantısız yazıldı (dashboard-verisi.ts gibi); testteki çözümleme kancasının bunu çözdüğünü varsayıyorum. `npm test` "Cannot find module" derse çıktıyı gönder.
> 3. **Türkçe metin:** `Intl` binlik ayıracının "3.000" biçiminde geldiğini `bicim.test.ts` zaten doğruluyor. Uzun tire (–) karakteri testte ve kodda aynı; editör onu kısa tireye çevirirse test kalır.
> 4. **Eksen ölçeği:** 3.000 gibi değerler 5.000'lik eksene çıkar (2,5'in bir sonraki adımı 5). Grafikte biraz boşluk kalır ama çizgi değerleri okunaklı olur; istersen 3 ve 4 çarpanlarını da ekleyebiliriz.

### Prompt 11 · 24 Eki 2026 11:49

````text
ADIM 5 E GEÇEBİLİRİZ
````

### Claude cevabı 10 · 24 Eki 2026 11:50

> # Adım 5: Kısa ay etiketi ve dashboard verisine MRR geçmişi
>
> ## Ne yapıyoruz?
>
> 1. **`bicim.ts`**: Grafiğin alt eksenine sığacak kısa ay etiketi: `kisaAyEtiketi(2026, 10)` → "Eki 26". Ay adı yerleşik `Intl` ile Türkçe alınır, yıl son iki hane olarak eklenir. İpucu ve tabloda uzun etiket (`ayEtiketi` → "Ekim 2026") kullanılmaya devam eder.
> 2. **`dashboard-verisi.ts`**: Dönen veriye `mrrGecmisi` alanı eklenir: `mrrGecmisi(abonelikler, sonAylar(simdi, 12), simdi)`.
>
> **Veri akışı:** Sorgu **değişmiyor**. Abonelikler zaten `getTenantDb()` ile, iptal edilmişler dahil okunuyor. Aynı `abonelikler` listesi ve **aynı `simdi`** hem MRR kartına hem grafiğe gidiyor (Karar 2). Hesap tamamen sunucuda, sayfa yalnızca hazır sayıları alacak.
>
> **Tenant:** Yeni bir okuma yok, mevcut tenant filtreli sorgu kullanılıyor. Test bunu ayrıca doğruluyor: A firmasının grafiğinde B'nin aboneliği görünmemeli.
>
> **Testler:**
> - `bicim.test.ts`: 1 yeni test (`npm test`)
> - `dashboard-verisi.test.ts`: 1 yeni test (`npm run test:db`): 12 nokta, son nokta = MRR kartı, B'nin aboneliği yok, önceki 11 ay 0
>
> İki test dosyası da betiklerde zaten kayıtlı, `package.json` değişmiyor. Yeni dosya yok.
>
> ---
>
> ## 5a) `src/lib/bicim.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişen: en alta `kisaAyEtiketi` eklendi.
>
> ```ts
> // EKRAN BİÇİMLENDİRME (Gün 9)
> //
> // Sayıları ekranda Türkçe biçimde göstermek için saf fonksiyonlar.
> // Hesap yapmaz, yalnızca hazır sayıyı metne çevirir. Yuvarlama kuralları
> // metrikler.ts içindedir; buradaki ondalık sınırları yalnızca görünümdür.
> // Ek paket yoktur: Node ve tarayıcıdaki yerleşik Intl kullanılır.
>
> // Para: binlik ayıracı nokta, kuruş yok. 1500 -> "1.500 TL"
> const TL_BICIMI = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
>
> export function tlMetni(deger: number): string {
>   return `${TL_BICIMI.format(deger)} TL`;
> }
>
> // Yüzde: her zaman 1 ondalık. 0,6667 -> "%66,7", 0,04 -> "%4,0"
> // Türkçede yüzde işareti sayının önüne yazılır.
> const YUZDE_BICIMI = new Intl.NumberFormat("tr-TR", {
>   style: "percent",
>   minimumFractionDigits: 1,
>   maximumFractionDigits: 1,
> });
>
> export function yuzdeMetni(oran: number): string {
>   return YUZDE_BICIMI.format(oran);
> }
>
> // Düz sayı (oran, ay sayısı): en fazla 2 ondalık, gereksiz sıfır yok.
> // 0,3 -> "0,3", 5 -> "5", 1,5 -> "1,5", 3,25 -> "3,25"
> const SAYI_BICIMI = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });
>
> export function sayiMetni(deger: number): string {
>   return SAYI_BICIMI.format(deger);
> }
>
> // Ay etiketi: (2026, 10) -> "Ekim 2026"
> // Ayın ortasındaki bir an UTC olarak verilir; saat dilimi farkı ayı değiştiremez.
> const AY_BICIMI = new Intl.DateTimeFormat("tr-TR", {
>   month: "long",
>   year: "numeric",
>   timeZone: "UTC",
> });
>
> export function ayEtiketi(yil: number, ay: number): string {
>   return AY_BICIMI.format(new Date(Date.UTC(yil, ay - 1, 15)));
> }
>
> // Kısa ay etiketi (Gün 11, MRR grafiğinin alt ekseni): (2026, 10) -> "Eki 26"
> // Ay adı Intl ile kısaltılır; yıl son iki hane olarak elle eklenir. Yıl biçimi
> // Intl'e bırakılmadı, çünkü kısa yıl gösterimi tarayıcıya ve sürüme göre değişebilir.
> // Ekranda tam ad gereken yerlerde (ipucu, tablo, özet cümle) ayEtiketi kullanılır.
> const KISA_AY_BICIMI = new Intl.DateTimeFormat("tr-TR", {
>   month: "short",
>   timeZone: "UTC",
> });
>
> export function kisaAyEtiketi(yil: number, ay: number): string {
>   const ayAdi = KISA_AY_BICIMI.format(new Date(Date.UTC(yil, ay - 1, 15)));
>   const kisaYil = String(yil % 100).padStart(2, "0");
>   return `${ayAdi} ${kisaYil}`;
> }
> ```
>
> ## 5b) `src/lib/bicim.test.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişen: içe aktarmaya `kisaAyEtiketi`, en sona bir test.
>
> ```ts
> // EKRAN BİÇİMLENDİRME BİRİM TESTİ (Gün 9)
> //
> // Çalıştırmak için: npm test
> // Dashboard'da görünecek metinlerin elle test senaryosuyla birebir aynı olduğunu kilitler.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi, kisaAyEtiketi } from "./bicim.ts";
>
> test("tlMetni: binlik ayıracı nokta, kuruş yok", () => {
>   assert.equal(tlMetni(1500), "1.500 TL");
>   assert.equal(tlMetni(50000), "50.000 TL");
>   assert.equal(tlMetni(83), "83 TL");
>   assert.equal(tlMetni(0), "0 TL");
> });
>
> test("yuzdeMetni: 1 ondalık, yüzde işareti önde", () => {
>   assert.equal(yuzdeMetni(0.6667), "%66,7"); // Gün 9 senaryosu
>   assert.equal(yuzdeMetni(0.04), "%4,0"); // ders örneği
>   assert.equal(yuzdeMetni(0), "%0,0");
>   assert.equal(yuzdeMetni(1), "%100,0");
> });
>
> test("sayiMetni: en fazla 2 ondalık, gereksiz sıfır yok", () => {
>   assert.equal(sayiMetni(0.3), "0,3"); // Gün 9 LTV/CAC
>   assert.equal(sayiMetni(5), "5"); // ders örneği LTV/CAC
>   assert.equal(sayiMetni(1.5), "1,5"); // Gün 9 ömür
>   assert.equal(sayiMetni(3.25), "3,25");
> });
>
> test("ayEtiketi: Türkçe ay adı ve yıl", () => {
>   assert.equal(ayEtiketi(2026, 10), "Ekim 2026");
>   assert.equal(ayEtiketi(2027, 1), "Ocak 2027");
> });
>
> test("kisaAyEtiketi (Gün 11): kısa Türkçe ay adı ve yılın son iki hanesi", () => {
>   assert.equal(kisaAyEtiketi(2026, 10), "Eki 26");
>   assert.equal(kisaAyEtiketi(2025, 11), "Kas 25");
>   assert.equal(kisaAyEtiketi(2027, 1), "Oca 27");
>   assert.equal(kisaAyEtiketi(2026, 5), "May 26");
>   assert.equal(kisaAyEtiketi(2026, 8), "Ağu 26");
> });
> ```
>
> ## 5c) `src/lib/dashboard-verisi.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişenler: baş yorum, içe aktarmalar, `GRAFIK_AY_SAYISI` sabiti, tipe ve dönüşe `mrrGecmisi` alanı. Sorgu aynı.
>
> ```ts
> // DASHBOARD VERİSİ (Gün 9, Gün 11'de MRR geçmişi eklendi)
> //
> // Dashboard sayfasının ihtiyaç duyduğu her şeyi tek fonksiyonda hazırlar:
> //   1. Abonelikleri plan bilgisiyle okur (tenant filtresi otomatik).
> //   2. Gün 8'deki AbonelikGirdisi biçimine çevirir.
> //   3. Hesabı metrikler.ts'e bırakır: metrikOzeti, ayHareketi ve mrrGecmisi.
> // Burada formül YOKTUR; sayfada da yoktur. Olay tablosu (SUBSCRIPTION_EVENTS)
> // kullanılmaz: churn, hareket ve MRR geçmişi aboneliklerin startedAt/canceledAt
> // tarihlerinden hesaplanır (ADR kararı, Gün 9 onayı).
> //
> // Gün 11: MRR kartı ile grafiğin son noktası AYNI "simdi" ve AYNI abonelik listesiyle
> // hesaplanır. Kart status alanına, grafik tarihlere bakar; uygulama ikisini her zaman
> // birlikte yazdığı için (başlatma ve iptal işlemleri) sonuç aynıdır. Eşitlik
> // metrikler.test.ts ve dashboard-verisi.test.ts içinde testle sabitlenmiştir.
> // Plan fiyatı geçmişi tutulmaz; geçmiş ayların doğru kalması için aboneliği olan
> // planın fiyatı değiştirilemez (planlar/actions.ts, ADR K11.1).
> //
> // db parametre olarak alınır (pasife-alma.ts gibi): uygulamada getTenantDb(),
> // testte tenantaBagliDb(). Böylece kiracı izolasyonu otomatik testle kontrol edilir.
> //
> // Not: Firmanın bütün abonelikleri belleğe okunur. Küçük yazılım firmaları için
> // (yüzlerce abonelik) sorun değildir; kapsam dışı bir büyüme olursa yeniden ele alınır.
>
> import type { TenantDb } from "./tenant";
> import {
>   type AbonelikGirdisi,
>   type AyHareketi,
>   type MetrikOzeti,
>   type MrrNoktasi,
>   ayAraligi,
>   ayHareketi,
>   metrikOzeti,
>   mrrGecmisi,
>   sonAylar,
>   turkiyeAyi,
> } from "./metrikler";
>
> // Grafikte gösterilen ay sayısı (bu ay dahil).
> export const GRAFIK_AY_SAYISI = 12;
>
> export type DashboardVerisi = {
>   yil: number; // Türkiye saatine göre içinde bulunulan yıl
>   ay: number; // 1-12
>   aboneVarMi: boolean; // firmada hiç abonelik (iptal edilmişler dahil) var mı?
>   cacGirildiMi: boolean; // CAC 0'dan büyük mü?
>   ozet: MetrikOzeti;
>   hareket: AyHareketi;
>   // Son 12 ayın MRR'ı, eskiden yeniye. Son eleman bu aydır ("simdi"ye göre). Tam TL.
>   mrrGecmisi: MrrNoktasi[];
> };
>
> // simdi: hesabın yapıldığı an. Uygulamada verilmez (şu an kullanılır);
> // testler belirli bir an verebilir.
> export async function dashboardVerisiniGetir(
>   db: TenantDb,
>   simdi: Date = new Date()
> ): Promise<DashboardVerisi> {
>   const [kayitlar, firma] = await Promise.all([
>     db.subscription.findMany({
>       select: {
>         customerId: true,
>         status: true,
>         startedAt: true,
>         canceledAt: true,
>         plan: { select: { price: true, interval: true } },
>       },
>     }),
>     db.tenant.findFirst({ select: { cac: true } }),
>   ]);
>
>   // Prisma kaydından metriklerin beklediği düz biçime çeviri (hesap yok).
>   const abonelikler: AbonelikGirdisi[] = kayitlar.map((k) => ({
>     customerId: k.customerId,
>     fiyat: k.plan.price,
>     aralik: k.plan.interval,
>     status: k.status,
>     startedAt: k.startedAt,
>     canceledAt: k.canceledAt,
>   }));
>
>   const cac = firma?.cac ?? 0;
>   const { yil, ay } = turkiyeAyi(simdi);
>   const buAy = ayAraligi(yil, ay);
>
>   return {
>     yil,
>     ay,
>     aboneVarMi: abonelikler.length > 0,
>     cacGirildiMi: cac > 0,
>     ozet: metrikOzeti(abonelikler, buAy, cac),
>     hareket: ayHareketi(abonelikler, buAy),
>     mrrGecmisi: mrrGecmisi(abonelikler, sonAylar(simdi, GRAFIK_AY_SAYISI), simdi),
>   };
> }
> ```
>
> ## 5d) `src/lib/dashboard-verisi.test.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişenler: baş yoruma bir satır ve ikinci testten sonra yeni test. CAC testi yine en sonda.
>
> ```ts
> // KİRACI TESTİ: DASHBOARD VERİSİ (Gün 9, Gün 11'de MRR geçmişi eklendi)
> //
> // Ne test edilir? src/lib/dashboard-verisi.ts: dashboard sayılarının yalnızca
> // oturumdaki firmanın kayıtlarından hesaplandığı.
> // Test firmalarının her birinde 1 ACTIVE abonelik vardır (aylık PLAN_FIYATI TL,
> // bu çalışmada, yani bu ay başlamış). CAC başlangıçta 0'dır.
> // Hesap kurallarının ayrıntısı metrikler.test.ts içindedir; burada yalnızca
> // veritabanından okuma ve kiracı ayrımı kontrol edilir.
> // Gün 11: MRR geçmişinin (grafik) de yalnızca firmanın kendi aboneliklerinden
> // geldiği ve son noktasının MRR kartıyla aynı olduğu kontrol edilir.
> //
> // Sıra önemlidir: B'nin CAC'sini değiştiren test en sondadır.
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   PLAN_FIYATI,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import { dashboardVerisiniGetir, GRAFIK_AY_SAYISI } from "./dashboard-verisi.ts";
> import { turkiyeAyi } from "./metrikler.ts";
>
> let A: TestFirmasi;
> let B: TestFirmasi;
> let dbA: TenantDb;
> let dbB: TenantDb;
>
> before(async () => {
>   A = await testFirmasiOlustur("a");
>   B = await testFirmasiOlustur("b");
>   dbA = tenantaBagliDb(A.tenantId);
>   dbB = tenantaBagliDb(B.tenantId);
> });
>
> after(async () => {
>   try {
>     await testVerisiniTemizle();
>   } finally {
>     await baglantiyiKapat();
>   }
> });
>
> describe("dashboard verisi", () => {
>   test("A'nın verisi yalnızca A'nın aboneliğini içerir (B'ninki sayılmaz)", async () => {
>     const simdi = new Date();
>     const veri = await dashboardVerisiniGetir(dbA, simdi);
>
>     assert.equal(veri.aboneVarMi, true);
>     // B'nin aboneliği de sayılsaydı MRR 2.000 ve aktif müşteri 2 olurdu.
>     assert.equal(veri.ozet.mrr, PLAN_FIYATI);
>     assert.equal(veri.ozet.aktifMusteri, 1);
>     assert.deepEqual({ yil: veri.yil, ay: veri.ay }, turkiyeAyi(simdi));
>   });
>
>   test("bu ay başlayan abonelik 'yeni' sayılır; ay başında müşteri yoksa churn hesaplanamaz", async () => {
>     const veri = await dashboardVerisiniGetir(dbA);
>
>     assert.deepEqual(veri.hareket, { yeni: 1, iptal: 0 });
>     assert.equal(veri.ozet.churn, null);
>     assert.ok(veri.ozet.nedenler.churn);
>   });
>
>   test("MRR geçmişi (Gün 11): 12 ay, yalnızca A'nın aboneliği, son nokta MRR kartıyla aynı", async () => {
>     // "simdi" 1 dakika ileri alınır: abonelik başlangıç anı ile bu bilgisayarın saati
>     // arasındaki milisaniyelik farklar testi kararsız yapmasın. Başlangıç "simdi"den
>     // sonra kalsaydı tarihe bakan grafik 0, status'a bakan kart PLAN_FIYATI gösterirdi.
>     const simdi = new Date(Date.now() + 60_000);
>     const veri = await dashboardVerisiniGetir(dbA, simdi);
>
>     assert.equal(veri.mrrGecmisi.length, GRAFIK_AY_SAYISI);
>
>     const son = veri.mrrGecmisi[veri.mrrGecmisi.length - 1];
>     assert.deepEqual({ yil: son.yil, ay: son.ay }, turkiyeAyi(simdi));
>     // B'nin aboneliği de sayılsaydı son nokta 2 x PLAN_FIYATI olurdu.
>     assert.equal(son.mrr, PLAN_FIYATI);
>     assert.equal(son.mrr, veri.ozet.mrr);
>
>     // Abonelik bu çalışmada başladı: önceki 11 ayda MRR yok.
>     assert.ok(veri.mrrGecmisi.slice(0, -1).every((n) => n.mrr === 0));
>   });
>
>   test("CAC her firmanın kendi ayarından okunur", async () => {
>     // B'nin CAC'si girilir. A etkilenmemeli.
>     await dbB.tenant.update({
>       where: { id: B.tenantId },
>       data: { cac: 5000 },
>       select: { id: true },
>     });
>
>     assert.equal((await dashboardVerisiniGetir(dbA)).cacGirildiMi, false);
>     assert.equal((await dashboardVerisiniGetir(dbB)).cacGirildiMi, true);
>   });
> });
> ```
>
> ---
>
> ## Adım 5 kontrolleri
>
> **Komut 1:** Kod kurallarını denetler; hata olmamalı.
> ```
> npm run lint
> ```
>
> **Komut 2:** Veritabanısız testleri çalıştırır; Adım 4'e göre **1 test fazla**, `fail 0`.
> ```
> npm test
> ```
>
> **Komut 3:** Test dalındaki veritabanı testlerini çalıştırır; **1 test fazla**, `fail 0`.
> ```
> npm run test:db
> ```
>
> Lütfen üç komutun sonucunu (özellikle `tests`, `pass`, `fail` satırlarını) gönder. Kısa ay etiketi testi kalırsa hata mesajında gelen gerçek değeri ("Eki 26" yerine ne yazdığını) mutlaka gönder; ona göre biçimi düzeltirim.
>
> Sonraki adım (Adım 6): `MrrGrafigi.tsx` bileşeni ve dashboard sayfasına ekleme. O adımda yerel sunucuda grafiği göreceğiz.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Kısa ay adları:** Node'un Türkçe `Intl` verisinin kısa ay adlarını "Eki, Kas, Oca, May, Ağu" olarak verdiğini varsayıyorum. Farklı gelirse (ör. sonunda nokta) test kalır ve gerçek değeri göreceğiz.
> 2. **1 dakika ileri "simdi":** Test ayın son dakikasında çalışırsa `simdi` yeni aya geçebilir; o durumda da abonelik bu aya ait olduğu için son nokta 0 ve önceki ay `PLAN_FIYATI` olur, test kalır. Olasılığı çok düşük, kabul ediyorum; olursa testi bir dakika sonra yeniden çalıştırmak yeterli.
> 3. **`veri.ts`'teki abonelik başlangıcı:** Test firmasının aboneliğinin "şu an" başladığını dosya yorumundan biliyorum; `veri.ts`'i görmedim.
> 4. **Adım 4 sonucu:** "Geçebiliriz" dediğin için `npm test`'in `fail 0` verdiğini ve Komut 4'ün `1` döndürdüğünü varsayıyorum.

### Prompt 12 · 24 Eki 2026 11:53

````text
her şey olması gerektiği gibi
````

### Claude cevabı 11 · 24 Eki 2026 11:55

> # Adım 6: Grafik bileşeni ve dashboard'a ekleme
>
> ## Ne yapıyoruz?
>
> 1. **`MrrGrafigi.tsx`** (yeni, `dashboard/` klasöründe `KpiKarti.tsx` ile yan yana): Server Component, yani `"use client"` yok, tarayıcıya JavaScript gitmez. Hazır `mrrGecmisi` noktalarını alır ve yalnızca çizer:
>    - SVG çubuk grafik, sol eksende TL (0, yarısı, üst sınır), alt eksende kısa ay ("Eki 26")
>    - Her ayın tüm sütunu fareye duyarlı; üzerine gelince tarayıcı ipucu gösterir: "Mayıs 2026: 4.583 TL"
>    - Bu ay: açık renk **ve** eksen altında "bu ay" yazısı, ipucunda "(bu ay)" (renk tek başına anlam taşımaz)
>    - Grafiğin altında özet cümle; ekran okuyucu grafiği bu cümleyle okur
>    - "Değerleri tablo olarak göster" açılır tablosu
>    - Telefonda okunaksız küçülmesin diye grafik en az 560 piksel genişlikte kalır, dar ekranda yana kaydırılır
> 2. **`dashboard/page.tsx`**: Grafik, KPI kartlarının altına eklenir.
>
> **Veri akışı, tenant, yetki:** Yeni sorgu yok. Sayfa zaten `dashboardVerisiniGetir(db)` çağırıyor; grafik onun döndürdüğü `veri.mrrGecmisi`'ni kullanır. Hesap sunucuda bitti, bileşende formül yok. Dashboard'u manager ve finance görüyor, grafik de ikisine görünür (yeni bir yetki kuralı yok).
>
> **Boş durum:** Hiç abonelik yoksa sayfa grafiğe gelmeden `BosDurum` gösterip çıkıyor, değişmedi.
>
> ---
>
> ## 6a) Boş dosyayı aç
>
> **Komut 1:** Grafik bileşeni için boş dosya oluşturur. Yol parantez içerdiği için tırnak içinde.
> ```
> touch 'src/app/(panel)/dashboard/MrrGrafigi.tsx'
> ```
>
> ## 6b) `src/app/(panel)/dashboard/MrrGrafigi.tsx`
>
> Yeni dosyayı editörde aç ve şu içeriği yapıştır:
>
> ```tsx
> import Kart from "@/components/ui/Kart";
> import type { MrrNoktasi } from "@/lib/metrikler";
> import { ayEtiketi, kisaAyEtiketi, tlMetni } from "@/lib/bicim";
> import { eksenDegerleri, eksenUstSiniri, grafikOzeti } from "@/lib/mrr-grafigi";
>
> // AYLIK MRR GRAFİĞİ (Gün 11)
> //
> // Server Component: tarayıcıya JavaScript gönderilmez ("use client" yok).
> // Bu bileşende HESAP YOKTUR. Noktalar dashboard-verisi.ts -> metrikler.ts (mrrGecmisi)
> // zincirinden hazır gelir; eksen ve özet cümle mrr-grafigi.ts'den alınır.
> // Ek paket yok: grafik elle yazılmış SVG'dir (ADR K11.4).
> //
> // Erişilebilirlik:
> //   - Her ayın <title> etiketi fareyle üzerine gelince değeri gösterir (tarayıcı ipucu).
> //   - Ekran okuyucu grafiği alttaki özet cümleyle okur (aria-labelledby).
> //   - Değerler açılır bir tabloda da verilir.
> //   - "Bu ay" yalnızca renkle değil, eksen altındaki yazıyla da belirtilir.
> //
> // Son nokta her zaman bu aydır (dashboard-verisi.ts, sonAylar). Değeri "bugüne kadar"dır
> // ve MRR kartıyla aynıdır.
>
> // SVG çizim alanı (viewBox birimleri). Grafik kartın genişliğine göre ölçeklenir.
> const GENISLIK = 720;
> const YUKSEKLIK = 280;
> const SOL_BOSLUK = 76; // sol eksendeki TL yazıları için
> const SAG_BOSLUK = 8;
> const UST_BOSLUK = 12;
> const ALT_BOSLUK = 48; // ay adı ve "bu ay" yazısı için
> const CIZIM_GENISLIGI = GENISLIK - SOL_BOSLUK - SAG_BOSLUK;
> const CIZIM_YUKSEKLIGI = YUKSEKLIK - UST_BOSLUK - ALT_BOSLUK;
> const TABAN_Y = UST_BOSLUK + CIZIM_YUKSEKLIGI; // 0 TL çizgisinin yeri
>
> // Sayfada tek grafik olduğu için sabit kimlik yeterli.
> const OZET_KIMLIGI = "mrr-grafigi-ozet";
>
> type Props = { noktalar: MrrNoktasi[] };
>
> export default function MrrGrafigi({ noktalar }: Props) {
>   const ozet = grafikOzeti(noktalar);
>   const ustSinir = eksenUstSiniri(Math.max(0, ...noktalar.map((n) => n.mrr)));
>   const sonIndeks = noktalar.length - 1;
>
>   // Bir TL değerinin SVG'deki dikey konumu (üst sınır en üstte, 0 en altta).
>   const yKonumu = (deger: number) =>
>     UST_BOSLUK + CIZIM_YUKSEKLIGI * (1 - deger / ustSinir);
>
>   // Her ayın yatay payı ve çubuğun bu payın içindeki genişliği.
>   const dilim = noktalar.length > 0 ? CIZIM_GENISLIGI / noktalar.length : 0;
>   const cubukGenisligi = dilim * 0.6;
>
>   return (
>     <Kart className="mt-4">
>       <h2 className="text-sm font-medium text-slate-600">
>         Aylık MRR (son {noktalar.length} ay)
>       </h2>
>       <p className="mt-1 text-xs text-slate-500">
>         Her ayın son günündeki MRR. Bu ay için bugünkü değer gösterilir. Değeri görmek
>         için çubuğun üzerine gelin.
>       </p>
>
>       {noktalar.length === 0 ? (
>         <p className="mt-4 text-sm text-slate-600">{ozet}</p>
>       ) : (
>         <>
>           <figure className="mt-4">
>             {/* Dar ekranda grafik küçülüp okunaksız olmasın: yana kaydırılır */}
>             <div className="overflow-x-auto">
>               <svg
>                 viewBox={`0 0 ${GENISLIK} ${YUKSEKLIK}`}
>                 role="img"
>                 aria-labelledby={OZET_KIMLIGI}
>                 className="h-auto w-full min-w-[560px]"
>               >
>                 {/* Yatay çizgiler ve sol eksen (TL) */}
>                 {eksenDegerleri(ustSinir).map((deger) => (
>                   <g key={deger}>
>                     <line
>                       x1={SOL_BOSLUK}
>                       x2={GENISLIK - SAG_BOSLUK}
>                       y1={yKonumu(deger)}
>                       y2={yKonumu(deger)}
>                       strokeDasharray={deger === 0 ? undefined : "4 4"}
>                       className={deger === 0 ? "stroke-slate-300" : "stroke-slate-200"}
>                     />
>                     <text
>                       x={SOL_BOSLUK - 8}
>                       y={yKonumu(deger) + 4}
>                       textAnchor="end"
>                       fontSize={11}
>                       className="fill-slate-500"
>                     >
>                       {tlMetni(deger)}
>                     </text>
>                   </g>
>                 ))}
>
>                 {/* Aylar: her ay bir grup. İpucu (title) bütün gruba uygulanır. */}
>                 {noktalar.map((nokta, i) => {
>                   const buAy = i === sonIndeks;
>                   const dilimBasi = SOL_BOSLUK + dilim * i;
>                   const ortaX = dilimBasi + dilim / 2;
>                   const cubukUstu = yKonumu(nokta.mrr);
>                   const ipucu = `${ayEtiketi(nokta.yil, nokta.ay)}${
>                     buAy ? " (bu ay)" : ""
>                   }: ${tlMetni(nokta.mrr)}`;
>
>                   return (
>                     <g key={`${nokta.yil}-${nokta.ay}`} className="group">
>                       <title>{ipucu}</title>
>                       {/* Görünmez alan: MRR 0 olan ayda da üzerine gelince değer görünsün */}
>                       <rect
>                         x={dilimBasi}
>                         y={UST_BOSLUK}
>                         width={dilim}
>                         height={CIZIM_YUKSEKLIGI}
>                         className="fill-transparent"
>                       />
>                       <rect
>                         x={ortaX - cubukGenisligi / 2}
>                         y={cubukUstu}
>                         width={cubukGenisligi}
>                         height={TABAN_Y - cubukUstu}
>                         rx={3}
>                         className={
>                           buAy
>                             ? "fill-indigo-300 group-hover:fill-indigo-500"
>                             : "fill-indigo-500 group-hover:fill-indigo-700"
>                         }
>                       />
>                       <text
>                         x={ortaX}
>                         y={TABAN_Y + 18}
>                         textAnchor="middle"
>                         fontSize={12}
>                         className="fill-slate-600"
>                       >
>                         {kisaAyEtiketi(nokta.yil, nokta.ay)}
>                       </text>
>                       {buAy && (
>                         <text
>                           x={ortaX}
>                           y={TABAN_Y + 34}
>                           textAnchor="middle"
>                           fontSize={11}
>                           className="fill-slate-500"
>                         >
>                           bu ay
>                         </text>
>                       )}
>                     </g>
>                   );
>                 })}
>               </svg>
>             </div>
>             <figcaption id={OZET_KIMLIGI} className="mt-3 text-sm text-slate-700">
>               {ozet}
>             </figcaption>
>           </figure>
>
>           {/* Metin alternatifi: bütün değerler tablo olarak */}
>           <details className="mt-3 text-sm">
>             <summary className="cursor-pointer font-medium text-indigo-700 hover:text-indigo-900">
>               Değerleri tablo olarak göster
>             </summary>
>             <table className="mt-3 w-full max-w-sm text-left">
>               <caption className="sr-only">Aylık MRR, son {noktalar.length} ay</caption>
>               <thead>
>                 <tr className="border-b border-slate-200 text-slate-500">
>                   <th scope="col" className="py-2 font-medium">
>                     Ay
>                   </th>
>                   <th scope="col" className="py-2 text-right font-medium">
>                     MRR
>                   </th>
>                 </tr>
>               </thead>
>               <tbody className="divide-y divide-slate-100">
>                 {noktalar.map((nokta, i) => (
>                   <tr key={`${nokta.yil}-${nokta.ay}`}>
>                     <th scope="row" className="py-2 font-normal text-slate-700">
>                       {ayEtiketi(nokta.yil, nokta.ay)}
>                       {i === sonIndeks ? " (bu ay)" : ""}
>                     </th>
>                     <td className="py-2 text-right tabular-nums text-slate-900">
>                       {tlMetni(nokta.mrr)}
>                     </td>
>                   </tr>
>                 ))}
>               </tbody>
>             </table>
>           </details>
>         </>
>       )}
>     </Kart>
>   );
> }
> ```
>
> ## 6c) `src/app/(panel)/dashboard/page.tsx`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişenler: baş yoruma iki satır, `MrrGrafigi` içe aktarması ve KPI kartlarının hemen altında `<MrrGrafigi noktalar={veri.mrrGecmisi} />`. Geri kalanı aynı.
>
> ```tsx
> import Link from "next/link";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { yoneticiMi } from "@/lib/yetki";
> import { dashboardVerisiniGetir } from "@/lib/dashboard-verisi";
> import { ltvCacSaglikliMi } from "@/lib/metrikler";
> import { riskliAbonelikler } from "@/lib/riskli-abonelikler";
> import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "@/lib/bicim";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import BosDurum from "@/components/ui/BosDurum";
> import Kart from "@/components/ui/Kart";
> import Rozet from "@/components/ui/Rozet";
> import KpiKarti from "./KpiKarti";
> import MrrGrafigi from "./MrrGrafigi";
>
> // KPI DASHBOARD (Gün 9)
> // Bu sayfada hesap YOKTUR. Sayılar dashboard-verisi.ts -> metrikler.ts zincirinden gelir,
> // burada yalnızca biçimlenir ve yerleştirilir.
> // manager ve finance ikisi de görür. Fark: CAC girilmemişse yalnızca manager'a
> // Ayarlar bağlantısı gösterilir (CAC'yi yalnızca manager değiştirebilir).
> // Gün 11: KPI kartlarının altına aylık MRR grafiği eklendi (MrrGrafigi.tsx).
> // Grafiğin son noktası MRR kartıyla aynı veriden ve aynı andan hesaplanır.
>
> const linkSinifi =
>   "font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900";
>
> // Tarihler UTC saklanır, ekranda Türkiye saatine göre gösterilir.
> const TARIH = new Intl.DateTimeFormat("tr-TR", {
>   dateStyle: "medium",
>   timeZone: "Europe/Istanbul",
> });
>
> export default async function DashboardSayfasi() {
>   // Layout da giriş kontrolü yapar, ama Next.js layout ile sayfayı birbirinden
>   // bağımsız çalıştırır. Bu yüzden her sayfa kendi kontrolünü de yapar.
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>   // İki sorgu birbirine bağlı değil: paralel çalışır. İkisi de aynı tenant filtreli db'yi kullanır.
>   const [veri, riskliler] = await Promise.all([
>     dashboardVerisiniGetir(db),
>     riskliAbonelikler(db),
>   ]);
>
>   const yonetici = yoneticiMi(kullanici.role);
>   const donemAdi = ayEtiketi(veri.yil, veri.ay);
>   const baslik = (
>     <SayfaBasligi baslik="Dashboard" aciklama={`${kullanici.firmaAdi} • ${donemAdi}`} />
>   );
>
>   // Boş durum: firmada hiç abonelik yok.
>   if (!veri.aboneVarMi) {
>     return (
>       <div>
>         {baslik}
>         <BosDurum
>           baslik="Henüz abonelik yok, ilk aboneliği ekleyin"
>           aciklama="Göstergeler, ilk abonelik başlatıldığında hesaplanmaya başlar."
>         >
>           <Link
>             href="/abonelikler"
>             className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
>           >
>             Abonelik ekle
>           </Link>
>         </BosDurum>
>       </div>
>     );
>   }
>
>   const { ozet, hareket } = veri;
>
>   // LTV hesaplandığı hâlde LTV/CAC yoksa tek neden CAC'nin girilmemiş olmasıdır.
>   // Mesaj role göre değişir: finance CAC'yi değiştiremez.
>   const cacEksik = ozet.ltv !== null && !veri.cacGirildiMi;
>   const ltvCacNedeni = cacEksik ? (
>     yonetici ? (
>       <>
>         CAC girilmedi.{" "}
>         <Link href="/ayarlar" className={linkSinifi}>
>           Ayarlardan CAC girin
>         </Link>
>         .
>       </>
>     ) : (
>       "CAC girilmedi. Firma yöneticisi Ayarlar'dan girebilir."
>     )
>   ) : (
>     ozet.nedenler.ltvCac
>   );
>
>   // Sağlıklı / Dikkat etiketi: simge ve metin birlikte (anlam yalnızca renge bırakılmaz).
>   const ltvCacDurumu =
>     ozet.ltvCac === null ? undefined : ltvCacSaglikliMi(ozet.ltvCac) ? (
>       <Rozet ton="yesil">
>         <span aria-hidden="true">✓&nbsp;</span>Sağlıklı (3 ve üzeri)
>       </Rozet>
>     ) : (
>       <Rozet ton="sari">
>         <span aria-hidden="true">!&nbsp;</span>Dikkat (3&apos;ün altında)
>       </Rozet>
>     );
>
>   // LTV kartında hesabın bileşenleri: elle kontrolü kolaylaştırır.
>   const ltvBilesenleri =
>     ozet.ltv !== null && ozet.arpu !== null && ozet.ortalamaOmurAy !== null
>       ? `ARPU ${tlMetni(ozet.arpu)} × ortalama ömür ${sayiMetni(ozet.ortalamaOmurAy)} ay`
>       : undefined;
>
>   return (
>     <div>
>       {baslik}
>
>       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
>         <KpiKarti
>           baslik="MRR"
>           donem="Bugün"
>           deger={tlMetni(ozet.mrr)}
>           aciklama="Her ay düzenli gelen abonelik geliri. Yıllık planlar 12'ye bölünerek eklenir."
>         />
>         <KpiKarti
>           baslik="Aylık churn"
>           donem="Ay başından bugüne"
>           deger={ozet.churn !== null ? yuzdeMetni(ozet.churn) : null}
>           neden={ozet.nedenler.churn}
>           aciklama="Ay başındaki müşterilerden aboneliğini bırakanların oranı."
>         />
>         <KpiKarti
>           baslik="LTV"
>           donem="Ay başından bugüne"
>           deger={ozet.ltv !== null ? tlMetni(ozet.ltv) : null}
>           neden={ozet.nedenler.ltv}
>           ekBilgi={ltvBilesenleri}
>           aciklama="Bir müşterinin bizimle kaldığı süre boyunca getirmesi beklenen toplam gelir."
>         />
>         <KpiKarti
>           baslik="LTV / CAC"
>           donem="Ay başından bugüne"
>           deger={ozet.ltvCac !== null ? sayiMetni(ozet.ltvCac) : null}
>           neden={ltvCacNedeni}
>           durum={ltvCacDurumu}
>           aciklama="Müşteri kazanmak için harcanan her 1 TL'nin kaç TL geri döndüğü."
>         />
>       </div>
>
>       <MrrGrafigi noktalar={veri.mrrGecmisi} />
>
>       <Kart className="mt-4">
>         <h2 className="text-sm font-medium text-slate-600">Müşteri özeti</h2>
>         <dl className="mt-3 grid gap-4 sm:grid-cols-3">
>           <div>
>             <dt className="text-sm text-slate-500">Aktif müşteri (bugün)</dt>
>             <dd className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
>               {ozet.aktifMusteri}
>             </dd>
>           </div>
>           <div>
>             <dt className="text-sm text-slate-500">Bu ay yeni (ay başından bugüne)</dt>
>             <dd className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
>               {hareket.yeni}
>             </dd>
>           </div>
>           <div>
>             <dt className="text-sm text-slate-500">Bu ay iptal (ay başından bugüne)</dt>
>             <dd className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
>               {hareket.iptal}
>             </dd>
>           </div>
>         </dl>
>         <p className="mt-4 text-xs text-slate-500">
>           Sayılar müşteri bazlıdır: ay içinde plan değiştiren müşteri ne yeni ne iptal
>           sayılır.
>         </p>
>       </Kart>
>
>       <Kart className="mt-4">
>         <h2 className="text-sm font-medium text-slate-600">
>           Riskli abonelikler ({riskliler.length})
>         </h2>
>         <p className="mt-1 text-xs text-slate-500">
>           Dönem bitişine 7 günden az kalmış ve henüz yenilenmemiş aktif abonelikler.
>         </p>
>
>         {riskliler.length === 0 ? (
>           <p className="mt-4 text-sm text-slate-600">Riskli abonelik yok.</p>
>         ) : (
>           <ul className="mt-4 divide-y divide-slate-100">
>             {riskliler.map((r) => (
>               <li
>                 key={r.id}
>                 className="flex flex-wrap items-center justify-between gap-2 py-3"
>               >
>                 <div className="min-w-0">
>                   <p className="truncate text-sm font-medium text-slate-900">
>                     {r.musteriAdi}
>                   </p>
>                   <p className="text-xs text-slate-500">
>                     {r.planAdi} · Dönem bitişi: {TARIH.format(r.bitis)}
>                   </p>
>                 </div>
>                 {/* Anlam yalnızca renge bırakılmaz: simge + metin */}
>                 {r.etiket.gecmis ? (
>                   <Rozet ton="kirmizi">
>                     <span aria-hidden="true">✕&nbsp;</span>
>                     {r.etiket.metin}
>                   </Rozet>
>                 ) : (
>                   <Rozet ton="sari">
>                     <span aria-hidden="true">!&nbsp;</span>
>                     {r.etiket.metin}
>                   </Rozet>
>                 )}
>               </li>
>             ))}
>           </ul>
>         )}
>       </Kart>
>     </div>
>   );
> }
> ```
>
> ---
>
> ## Adım 6 kontrolleri
>
> **Komut 2:** Kod kurallarını denetler; hata olmamalı.
> ```
> npm run lint
> ```
>
> **Komut 3:** Projeyi derler ve TypeScript tür hatası olup olmadığını gösterir. Son satırlarda hata olmamalı. (Derleme veritabanına bağlanmaz.)
> ```
> npm run build
> ```
>
> ### Ekranda kontrol (test dalında, `gun11-kilit@example.com` firması)
>
> `npm run dev:test` açık kalmış olmalı. Tarayıcıda `localhost:3000/dashboard` sayfasını yenile (Cmd + R). Bu firmada Gün 9 demo verisi var: üç abonelik geçen ayın 11'inde başladı, ikisi bugün iptal edildi. Beklenen:
>
> | Ne | Beklenen |
> |---|---|
> | Çubuklar | Kasım 2025 – Ağustos 2026 boş, **Eylül 2026 = 2.500 TL** (1.000 + 1.000 + 500), **Ekim 2026 = 1.000 TL** (açık renk, altında "bu ay") |
> | Sol eksen | 0 TL, 1.250 TL, 2.500 TL |
> | Fareyle Eylül çubuğu | İpucu "Eylül 2026: 2.500 TL", çubuk koyulaşır |
> | Fareyle boş bir ay (ör. Mart) | İpucu "Mart 2026: 0 TL" |
> | Özet cümle | "Son 12 ayda MRR 0 TL'den 1.000 TL'ye yükseldi (Kasım 2025 – Ekim 2026). En yüksek değer 2.500 TL (Eylül 2026)." |
> | Tablo | Açılınca 12 satır, son satır "Ekim 2026 (bu ay) – 1.000 TL" |
> | Tutarlılık | Grafiğin "bu ay" değeri = MRR kartı (1.000 TL) |
> | Dar pencere | Pencereyi daraltınca grafik yana kaydırılabilir, yazılar okunur kalır |
>
> Komut 2 ve 3'ün sonucunu ve ekranın bir görüntüsünü gönder. İpucu bir iki saniye bekleyince çıkar; ekran görüntüsünde görünmeyebilir, bu normal.
>
> Geçmiş ayların tamamını (Mayıs 4.583 dahil) Adım 7'deki `demo:gecmis` betiğiyle göreceğiz.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **`<title>` ve React 19:** React 19 sayfadaki `<title>` etiketlerini belge başlığına (`<head>`) taşıyabilir; SVG içindekilere dokunmadığını varsayıyorum. Sekme başlığı ay adına dönüşür ya da ipucu çıkmazsa, bunun nedeni budur ve başka bir yönteme geçeriz.
> 2. **`Kart` bileşeni:** `className` ve içerik (children) aldığını sayfadaki kullanımdan çıkardım; dosyayı görmedim.
> 3. **Tailwind SVG sınıfları:** `fill-indigo-500`, `stroke-slate-200`, `group-hover:` gibi sınıfların Tailwind 4'te SVG'de çalıştığını varsayıyorum; renkler görünmezse sınıfların derlenmediği anlaşılır.
> 4. **Demo tarihleri:** Beklenen değerler `demo-verisi.ts`'teki "geçen ay başından 20 gün önce başla" kuralına göre hesaplandı (bugün için 11 Eylül 2026). Eylül çubuğu 2.500 değilse firmayı ya da tarihi birlikte kontrol ederiz.
> 5. **`npm run build` ortamı:** Derlemenin veritabanına bağlanmadan bittiğini önceki günlerden varsayıyorum; bir bağlantı hatası görürsen çıktıyı gönder.

### Prompt 13 · 24 Eki 2026 11:57

````text
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 12ms

  Creating an optimized production build ...
✓ Compiled successfully in 437ms
  Running TypeScript ...
  Finished TypeScript in 1210ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 385ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 71ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 6ms

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /abonelikler
├ ƒ /api/events
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

kullanici@bilgisayar abonetakip %
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 12 · 24 Eki 2026 11:59

> Grafik beklendiği gibi: Eylül 2.500 TL, Ekim 1.000 TL (açık renk, altında "bu ay"), eksen 0 / 1.250 / 2.500, özet cümle birebir doğru, son nokta MRR kartıyla aynı. Lint ve derleme temiz. Adım 6 tamam.
>
> Ekranda göremediğim üç şeyi bir dakikada kontrol et (sonucu Adım 7 çıktılarıyla birlikte yazarsın):
> 1. Fareyi **Eylül** çubuğunda ve boş bir ayda (ör. Mart) bir iki saniye beklet: "Eylül 2026: 2.500 TL" ve "Mart 2026: 0 TL" ipuçları çıkıyor mu?
> 2. **Sekme başlığı** eskisi gibi mi? (Ay adına dönüştüyse React `<title>` etiketini taşımış demektir.)
> 3. Sayfayı aşağı kaydırıp **"Değerleri tablo olarak göster"**i aç: 12 satır, sonuncusu "Ekim 2026 (bu ay) – 1.000 TL" mi?
>
> ---
>
> # Adım 7: Geçmiş tarihli sahte veri (`demo:gecmis`)
>
> ## Ne yapıyoruz?
>
> 1. **`donem-ilerlet.ts`** (yeni): `demo-verisi.ts`'teki `donemleriIlerlet` fonksiyonu buraya taşınır. İki demo betiği de kullanır. Neden taşıma? `demo-verisi.ts`'ten içe aktarılamaz; içe aktarılınca betiğin kendisi çalışır.
> 2. **`demo-verisi.ts`**: Yalnızca fonksiyon silinir ve yeni dosyadan içe aktarılır. **Davranış değişmemeli**; bunu yeni bir test firmasında deneyeceğiz.
> 3. **`gecmis-mrr-verisi.ts`** (yeni): Plandaki A–E senaryosunu yazar. `demo-verisi.ts` ile aynı güvenceler: canlı koruması veritabanı yüklenmeden önce, yalnızca var olan kullanıcının firması, firmada abonelik varsa durur, tek işlem, tenant filtreli yazma, ekrana adres veya kişisel bilgi yok. Firma, kullanıcı veya parola oluşturmaz.
>    - Tarihler **çalıştırıldığı aya göre** kayar (ay hesabı `sonAylar` ve `ayAraligi` ile, saat dilimi doğru).
>    - Betik sonunda 12 ayın **elle hesaplanmış** beklenen değerlerini yazar. Değerler kodla hesaplanmaz, sabit listedir; böylece kod bağımsız bir sonuçla karşılaştırılır.
> 4. **`package.json`**: `demo:gecmis` betiği.
>
> **Yazılan tablolar:** `plans`, `customers`, `subscriptions`, `subscription_events`. Yalnızca test dalında ve yalnızca senin verdiğin e-postanın firmasında.
>
> ---
>
> ## 7a) Boş dosyaları aç
>
> **Komut 1:** Ortak yardımcı için boş dosya oluşturur.
> ```
> touch src/test-destek/donem-ilerlet.ts
> ```
>
> **Komut 2:** Yeni demo betiği için boş dosya oluşturur.
> ```
> touch src/test-destek/gecmis-mrr-verisi.ts
> ```
>
> ## 7b) `src/test-destek/donem-ilerlet.ts`
>
> ```ts
> // DÖNEM İLERLETME (demo betikleri için ortak yardımcı)
> //
> // Gün 11: demo-verisi.ts içinden taşındı; gecmis-mrr-verisi.ts de kullanır.
> // Ayrı dosyada durur, çünkü demo-verisi.ts içe aktarıldığında betiğin kendisi çalışır.
> // Veritabanına dokunmaz.
>
> import { donemSonu, type Aralik } from "../lib/donem.ts";
>
> // Başlangıçtan sınıra kadar dönem dönem ilerler (uygulamadaki yenileme kuralıyla).
> // Sınırdan önce dolan her dönem bir yenilemedir (RENEWED olayı).
> export function donemleriIlerlet(baslangic: Date, aralik: Aralik, sinir: Date) {
>   const yenilemeler: Date[] = [];
>   let bitis = donemSonu(baslangic, aralik);
>   while (bitis.getTime() <= sinir.getTime()) {
>     yenilemeler.push(bitis);
>     bitis = donemSonu(bitis, aralik);
>   }
>   return { yenilemeler, currentPeriodEnd: bitis };
> }
> ```
>
> ## 7c) `src/test-destek/demo-verisi.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişenler yalnızca: `donem.ts` içe aktarması yerine `donem-ilerlet.ts`, fonksiyonun kendisi silindi, baş yoruma bir satır. Senaryo, tarihler, kontroller ve ekran çıktısı aynı.
>
> ```ts
> // DEMO VERİSİ BETİĞİ (Gün 9) - YALNIZCA TEST DALI
> //
> // Çalıştırma: npm run demo:veri -- kullanici@ornek.com
> //
> // Ne yapar? Test dalında VAR OLAN bir kullanıcının firmasına Gün 9 elle test
> // senaryosunun sahte verisini ekler:
> //   A: aylık 1.000 TL, önceki aydan beri aktif, kalıyor
> //   B: yıllık 12.000 TL, önceki aydan beri aktif, bu ay iptal
> //   C: aylık 500 TL, önceki aydan beri aktif, bu ay iptal
> // Ne yapmaz? Firma veya kullanıcı oluşturmaz, parola yazmaz, CAC'ye dokunmaz,
> // canlı veritabanına bağlanmaz. Kendiliğinden çalışmaz, yalnızca elle çalıştırılır.
> //
> // Güvenceler:
> // 1. canli-koruma.ts: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı (.env) ile
> //    aynı sunucuyu gösteriyorsa veritabanına HİÇ bağlanmadan durur.
> // 2. veri.ts kendi TEST_VERITABANI kontrolünü ayrıca yapar.
> // 3. Yazma işlemleri tenant filtresinden geçer (tenantaBagliDb).
> // 4. Firmada zaten abonelik varsa (iptal edilmişler dahil) hiçbir şey yazmadan durur:
> //    rakamlar karışmaz ve betik aynı firmada iki kez çalıştırılamaz.
> // 5. Bütün kayıtlar tek işlemde (transaction) yazılır: ya hepsi ya hiçbiri.
> // 6. Ekrana hiçbir adres veya kişisel bilgi yazılmaz.
> //
> // Gün 11: donemleriIlerlet, gecmis-mrr-verisi.ts ile ortak kullanılsın diye
> // donem-ilerlet.ts dosyasına taşındı. Bu betiğin davranışı değişmedi.
>
> import { testDaliKontrolu } from "./canli-koruma.ts";
> import { epostaDogrula } from "../lib/validation.ts";
> import { ayAraligi, turkiyeAyi } from "../lib/metrikler.ts";
> import { donemleriIlerlet } from "./donem-ilerlet.ts";
>
> const DAKIKA = 60 * 1000;
> const GUN = 24 * 60 * DAKIKA;
>
> // 1. güvence: veritabanı modülleri yüklenmeden ÖNCE.
> const kontrol = testDaliKontrolu();
> if (!kontrol.ok) {
>   console.error(`Durduruldu: ${kontrol.hata}`);
>   process.exit(1);
> }
>
> const eposta = epostaDogrula(process.argv[2]);
> if (!eposta.ok) {
>   console.error("Kullanım: npm run demo:veri -- kullanici@ornek.com");
>   process.exit(1);
> }
>
> // Kontroller geçildikten SONRA veritabanı modülleri yüklenir.
> const { kullanicininFirmaKimligi, baglantiyiKapat } = await import("./veri.ts");
> const { tenantaBagliDb } = await import("../lib/tenant.ts");
>
> async function calistir(): Promise<number> {
>   if (!eposta.ok) return 1;
>
>   const tenantId = await kullanicininFirmaKimligi(eposta.deger);
>   if (!tenantId) {
>     console.error(
>       "Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun."
>     );
>     return 1;
>   }
>
>   const db = tenantaBagliDb(tenantId);
>
>   // 4. güvence: firmada hiç abonelik olmamalı.
>   if ((await db.subscription.count()) > 0) {
>     console.error(
>       "Bu firmada zaten abonelik var. Demo verisi yalnızca aboneliği olmayan bir firmaya eklenir (test dalında yeni bir kullanıcıyla kayıt olun)."
>     );
>     return 1;
>   }
>
>   // Tarihler: çalıştırıldığı aya göre.
>   const simdi = new Date();
>   const { yil, ay } = turkiyeAyi(simdi);
>   const buAy = ayAraligi(yil, ay);
>   if (simdi.getTime() - buAy.baslangic.getTime() < 15 * DAKIKA) {
>     console.error("Ayın ilk 15 dakikasındayız; iptaller bu aya düşmeyebilir. Biraz sonra tekrar deneyin.");
>     return 1;
>   }
>   // Abonelikler önceki ayın ortalarında başlar: ay başında üçü de aktiftir.
>   const baslangic = new Date(buAy.baslangic.getTime() - 20 * GUN);
>
>   const senaryo = [
>     { musteri: "Demo Müşteri A", plan: "Demo Aylık 1.000", fiyat: 1000, aralik: "MONTHLY", iptal: null },
>     { musteri: "Demo Müşteri B", plan: "Demo Yıllık 12.000", fiyat: 12000, aralik: "YEARLY", iptal: new Date(simdi.getTime() - 10 * DAKIKA) },
>     { musteri: "Demo Müşteri C", plan: "Demo Aylık 500", fiyat: 500, aralik: "MONTHLY", iptal: new Date(simdi.getTime() - 5 * DAKIKA) },
>   ] as const;
>
>   // 5. güvence: tek işlem.
>   await db.$transaction(
>     async (tx) => {
>       for (const s of senaryo) {
>         // tenantId burada TypeScript istediği için yazılır; tenant filtresi zaten ezer.
>         const plan = await tx.plan.create({
>           data: { tenantId, name: s.plan, price: s.fiyat, interval: s.aralik, createdAt: baslangic },
>           select: { id: true },
>         });
>         const musteri = await tx.customer.create({
>           data: { tenantId, name: s.musteri, email: null, createdAt: baslangic },
>           select: { id: true },
>         });
>
>         const sinir = s.iptal ?? simdi;
>         const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(baslangic, s.aralik, sinir);
>
>         const abonelik = await tx.subscription.create({
>           data: {
>             tenantId,
>             customerId: musteri.id,
>             planId: plan.id,
>             status: s.iptal ? "CANCELED" : "ACTIVE",
>             startedAt: baslangic,
>             currentPeriodEnd,
>             canceledAt: s.iptal,
>             createdAt: baslangic,
>           },
>           select: { id: true },
>         });
>
>         // Her durum değişikliği olay tablosuna (iş kuralı).
>         const olaylar = [
>           { type: "STARTED" as const, createdAt: baslangic },
>           ...yenilemeler.map((t) => ({ type: "RENEWED" as const, createdAt: t })),
>           ...(s.iptal ? [{ type: "CANCELED" as const, createdAt: s.iptal }] : []),
>         ];
>         await tx.subscriptionEvent.createMany({
>           data: olaylar.map((o) => ({
>             tenantId,
>             subscriptionId: abonelik.id,
>             type: o.type,
>             createdAt: o.createdAt,
>           })),
>         });
>       }
>     },
>     { timeout: 20_000 }
>   );
>
>   console.log("Demo verisi eklendi (test dalı): 3 plan, 3 müşteri, 3 abonelik (2'si bu ay iptal).");
>   console.log("Dashboard'da beklenen (CAC girilmeden önce):");
>   console.log("  MRR 1.000 TL | Aylık churn %66,7 | LTV 1.500 TL | LTV/CAC: CAC girilmedi");
>   console.log("  Aktif müşteri 1 | Bu ay yeni 0 | Bu ay iptal 2");
>   console.log("Ayarlar'dan CAC 5000 girildikten sonra: LTV/CAC 0,3 ve 'Dikkat'.");
>   return 0;
> }
>
> try {
>   process.exitCode = await calistir();
> } catch {
>   // Ayrıntı yazılmaz (adres veya veri sızmasın).
>   console.error("Demo verisi eklenemedi. Hiçbir kayıt yazılmadı (işlem geri alındı).");
>   process.exitCode = 1;
> } finally {
>   await baglantiyiKapat();
> }
> ```
>
> ## 7d) `src/test-destek/gecmis-mrr-verisi.ts`
>
> ```ts
> // GEÇMİŞ MRR DEMO VERİSİ (Gün 11) - YALNIZCA TEST DALI
> //
> // Çalıştırma: npm run demo:gecmis -- kullanici@example.com
> //
> // Ne yapar? Test dalında VAR OLAN bir kullanıcının firmasına, aylık MRR grafiğini
> // elle sınamak için 14 aya yayılan sahte veri ekler. Tarihler çalıştırıldığı aya göre
> // kaydırılır; böylece beklenen değerler her ay aynıdır. Senaryo, metrikler.test.ts
> // içindeki "Gün 11 senaryosu" ile aynıdır ("bu ay" = 0, "1 ay önce" = geçen ay).
> // Bütün saatler Türkiye saatidir:
> //   A: aylık 1.000,   14 ay önce ayın 10'u, kalıyor                   (12 aydan eski veri)
> //   B: yıllık 12.000,  9 ay önce ayın 15'i, kalıyor                   (yıllık plan)
> //   C: aylık 500,      7 ay önce ayın 5'i, 4 ay önce ayın 10'u iptal  (ay içinde iptal)
> //   D: yıllık 1.000,   5 ay önce ayın 1'i 00:30, kalıyor              (ay sınırı + küsurat)
> //   E: aylık 2.000,   11 ay önce ayın 20'si, 1 ay önce ayın 1'i 00:00 iptal (tam sınırda iptal)
> // Ne yapmaz? Firma veya kullanıcı oluşturmaz, parola yazmaz, CAC'ye dokunmaz,
> // canlı veritabanına bağlanmaz. Kendiliğinden çalışmaz, yalnızca elle çalıştırılır.
> //
> // Güvenceler (demo-verisi.ts ile aynı):
> // 1. canli-koruma.ts: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı (.env) ile
> //    aynı sunucuyu gösteriyorsa veritabanına HİÇ bağlanmadan durur.
> // 2. veri.ts kendi TEST_VERITABANI kontrolünü ayrıca yapar.
> // 3. Yazma işlemleri tenant filtresinden geçer (tenantaBagliDb).
> // 4. Firmada zaten abonelik varsa (iptal edilmişler dahil) hiçbir şey yazmadan durur.
> // 5. Bütün kayıtlar tek işlemde (transaction) yazılır: ya hepsi ya hiçbiri.
> // 6. Ekrana hiçbir adres veya kişisel bilgi yazılmaz.
>
> import { testDaliKontrolu } from "./canli-koruma.ts";
> import { epostaDogrula } from "../lib/validation.ts";
> import { ayAraligi, sonAylar } from "../lib/metrikler.ts";
> import { ayEtiketi, tlMetni } from "../lib/bicim.ts";
> import { donemleriIlerlet } from "./donem-ilerlet.ts";
>
> const DAKIKA = 60 * 1000;
> const SAAT = 60 * DAKIKA;
> const GUN = 24 * SAAT;
>
> // Elle hesaplanmış beklenen grafik: eskiden yeniye, son eleman bu ay.
> // Bilerek kodla hesaplanmaz; ekrandaki grafik bağımsız bir sonuçla karşılaştırılır.
> // Örnek (5 ay önceki ay, en yüksek): 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33 -> 4.583
> const BEKLENEN_MRR = [3000, 3000, 4000, 4000, 4500, 4500, 4583, 4083, 4083, 4083, 2083, 2083];
>
> // 1. güvence: veritabanı modülleri yüklenmeden ÖNCE.
> const kontrol = testDaliKontrolu();
> if (!kontrol.ok) {
>   console.error(`Durduruldu: ${kontrol.hata}`);
>   process.exit(1);
> }
>
> const eposta = epostaDogrula(process.argv[2]);
> if (!eposta.ok) {
>   console.error("Kullanım: npm run demo:gecmis -- kullanici@example.com");
>   process.exit(1);
> }
>
> // Kontroller geçildikten SONRA veritabanı modülleri yüklenir.
> const { kullanicininFirmaKimligi, baglantiyiKapat } = await import("./veri.ts");
> const { tenantaBagliDb } = await import("../lib/tenant.ts");
>
> // "geri" ay önceki ayın "gun". günü, Türkiye saatiyle saat:dakika (UTC Date olarak).
> // Ay, sonAylar ile bulunur (yıl geçişi ve Türkiye saati orada çözülmüştür).
> function ayinGunu(simdi: Date, geri: number, gun: number, saat = 10, dakika = 0): Date {
>   const { yil, ay } = sonAylar(simdi, geri + 1)[0];
>   const ayBasi = ayAraligi(yil, ay).baslangic; // ayın 1'i 00:00 (TR)
>   return new Date(ayBasi.getTime() + (gun - 1) * GUN + saat * SAAT + dakika * DAKIKA);
> }
>
> async function calistir(): Promise<number> {
>   if (!eposta.ok) return 1;
>
>   const tenantId = await kullanicininFirmaKimligi(eposta.deger);
>   if (!tenantId) {
>     console.error(
>       "Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun."
>     );
>     return 1;
>   }
>
>   const db = tenantaBagliDb(tenantId);
>
>   // 4. güvence: firmada hiç abonelik olmamalı.
>   if ((await db.subscription.count()) > 0) {
>     console.error(
>       "Bu firmada zaten abonelik var. Geçmiş MRR verisi yalnızca aboneliği olmayan bir firmaya eklenir (test dalında yeni bir kullanıcıyla kayıt olun)."
>     );
>     return 1;
>   }
>
>   const simdi = new Date();
>
>   const senaryo = [
>     { musteri: "Geçmiş Müşteri A", plan: "Geçmiş Aylık 1.000", fiyat: 1000, aralik: "MONTHLY", baslangic: ayinGunu(simdi, 14, 10), iptal: null },
>     { musteri: "Geçmiş Müşteri B", plan: "Geçmiş Yıllık 12.000", fiyat: 12000, aralik: "YEARLY", baslangic: ayinGunu(simdi, 9, 15), iptal: null },
>     { musteri: "Geçmiş Müşteri C", plan: "Geçmiş Aylık 500", fiyat: 500, aralik: "MONTHLY", baslangic: ayinGunu(simdi, 7, 5), iptal: ayinGunu(simdi, 4, 10) },
>     { musteri: "Geçmiş Müşteri D", plan: "Geçmiş Yıllık 1.000", fiyat: 1000, aralik: "YEARLY", baslangic: ayinGunu(simdi, 5, 1, 0, 30), iptal: null },
>     { musteri: "Geçmiş Müşteri E", plan: "Geçmiş Aylık 2.000", fiyat: 2000, aralik: "MONTHLY", baslangic: ayinGunu(simdi, 11, 20), iptal: ayinGunu(simdi, 1, 1, 0, 0) },
>   ] as const;
>
>   // 5. güvence: tek işlem.
>   await db.$transaction(
>     async (tx) => {
>       for (const s of senaryo) {
>         // tenantId burada TypeScript istediği için yazılır; tenant filtresi zaten ezer.
>         const plan = await tx.plan.create({
>           data: { tenantId, name: s.plan, price: s.fiyat, interval: s.aralik, createdAt: s.baslangic },
>           select: { id: true },
>         });
>         const musteri = await tx.customer.create({
>           data: { tenantId, name: s.musteri, email: null, createdAt: s.baslangic },
>           select: { id: true },
>         });
>
>         const sinir = s.iptal ?? simdi;
>         const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(s.baslangic, s.aralik, sinir);
>
>         const abonelik = await tx.subscription.create({
>           data: {
>             tenantId,
>             customerId: musteri.id,
>             planId: plan.id,
>             status: s.iptal ? "CANCELED" : "ACTIVE",
>             startedAt: s.baslangic,
>             currentPeriodEnd,
>             canceledAt: s.iptal,
>             createdAt: s.baslangic,
>           },
>           select: { id: true },
>         });
>
>         // Her durum değişikliği olay tablosuna (iş kuralı).
>         const olaylar = [
>           { type: "STARTED" as const, createdAt: s.baslangic },
>           ...yenilemeler.map((t) => ({ type: "RENEWED" as const, createdAt: t })),
>           ...(s.iptal ? [{ type: "CANCELED" as const, createdAt: s.iptal }] : []),
>         ];
>         await tx.subscriptionEvent.createMany({
>           data: olaylar.map((o) => ({
>             tenantId,
>             subscriptionId: abonelik.id,
>             type: o.type,
>             createdAt: o.createdAt,
>           })),
>         });
>       }
>     },
>     { timeout: 20_000 }
>   );
>
>   console.log("Geçmiş MRR demo verisi eklendi (test dalı): 5 plan, 5 müşteri, 5 abonelik (2'si geçmişte iptal).");
>   console.log("Dashboard'da beklenen grafik (son 12 ay, elle hesaplanmış):");
>   sonAylar(simdi, BEKLENEN_MRR.length).forEach(({ yil, ay }, i) => {
>     const buAy = i === BEKLENEN_MRR.length - 1 ? " (bu ay)" : "";
>     console.log(`  ${ayEtiketi(yil, ay)}${buAy}: ${tlMetni(BEKLENEN_MRR[i])}`);
>   });
>   console.log("MRR kartı: 2.083 TL (grafiğin son noktasıyla aynı olmalı).");
>   return 0;
> }
>
> try {
>   process.exitCode = await calistir();
> } catch {
>   // Ayrıntı yazılmaz (adres veya veri sızmasın).
>   console.error("Geçmiş MRR demo verisi eklenemedi. Hiçbir kayıt yazılmadı (işlem geri alındı).");
>   process.exitCode = 1;
> } finally {
>   await baglantiyiKapat();
> }
> ```
>
> ## 7e) `package.json`'a `demo:gecmis` betiği
>
> **Komut 3:** `demo:veri` satırının hemen altına yeni betik satırını ekler.
> ```
> perl -pi -e 's/^(\s*"demo:veri": .*,)$/$1\n    "demo:gecmis": "node --env-file=.env.test --import .\/src\/test-destek\/kancalar.mjs src\/test-destek\/gecmis-mrr-verisi.ts",/' package.json
> ```
>
> **Komut 4:** Demo betiklerini listeler; `demo:veri` ve hemen altında `demo:gecmis` görünmeli.
> ```
> grep -n "demo:" package.json
> ```
>
> ---
>
> ## Adım 7 kontrolleri
>
> **Komut 5:** Kod kurallarını denetler; hata olmamalı.
> ```
> npm run lint
> ```
>
> **Komut 6:** Canlı korumasını dener. `.env.test` verilmeden çalıştırıldığı için veritabanına **bağlanmadan** "Durduruldu: TEST_VERITABANI=evet bulunamadı…" demeli.
> ```
> node --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts deneme@example.com
> ```
>
> ### A) `demo:veri`'nin eski davranışı (yeni firma)
>
> 1. `npm run dev:test` açıkken tarayıcıda **çıkış yap**, yeni firma kaydı aç: `gun11-eski@example.com`.
> 2. **Komut 7:** Gün 9 demo verisini taşıma sonrası yazar. Çıktı, az önce `gun11-kilit` için gördüğün beş satırla **aynı** olmalı.
>    ```
>    npm run demo:veri -- gun11-eski@example.com
>    ```
> 3. Dashboard: MRR 1.000 TL, churn %66,7, LTV 1.500 TL, aktif 1, yeni 0, iptal 2; grafik `gun11-kilit` ile aynı (Eylül 2.500, Ekim 1.000).
> 4. **Komut 8:** Aynı firmaya ikinci kez çalıştırır; "Bu firmada zaten abonelik var" deyip **hiçbir şey yazmamalı**.
>    ```
>    npm run demo:veri -- gun11-eski@example.com
>    ```
>
> ### B) Geçmiş MRR verisi (yeni firma)
>
> 1. Çıkış yap, yeni firma kaydı: `gun11-gecmis@example.com`.
> 2. **Komut 9:** Geçmiş tarihli sahte veriyi yazar ve beklenen 12 ayı ekrana basar.
>    ```
>    npm run demo:gecmis -- gun11-gecmis@example.com
>    ```
> 3. Dashboard'daki grafik ve açılır tablo, Komut 9'un yazdığı listeyle birebir aynı olmalı. Özellikle: **Mayıs 2026 = 4.583 TL**, Nisan 4.500 (D henüz yok), Ağustos 4.083 (E hâlâ var), Eylül 2.083, Ekim (bu ay) 2.083 = MRR kartı.
> 4. Özet cümle: "Son 12 ayda MRR 3.000 TL'den 2.083 TL'ye düştü (Kasım 2025 – Ekim 2026). En yüksek değer 4.583 TL (Mayıs 2026)."
> 5. **Komut 10:** İkinci çalıştırma; reddetmeli.
>    ```
>    npm run demo:gecmis -- gun11-gecmis@example.com
>    ```
> 6. **Kiracı ayrımı:** `gun11-kilit` firmasıyla tekrar giriş yap; grafiği değişmemiş olmalı (Eylül 2.500, Ekim 1.000). "Geçmiş Müşteri" kayıtları orada görünmemeli.
>
> Komut 4, 6, 7, 9'un çıktılarını ve `gun11-gecmis` dashboard'unun ekran görüntüsünü (tablo açıkken) gönder. Sonra Adım 8 (ADR) ve Adım 9 (taramalar, commit, PR) kalıyor.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **`veri.ts` içe aktarması:** `kullanicininFirmaKimligi` ve `baglantiyiKapat`'ın `demo-verisi.ts`'teki gibi çalıştığını varsayıyorum; dosyayı görmedim.
> 2. **İptal edilmiş planlar ve kilit:** `gun11-gecmis` firmasında C ve E planları yalnızca iptal edilmiş aboneliğe sahip; Adım 2'deki kural nedeniyle onların da fiyatı kilitli görünmeli. Bu bir hata değil, beklenen davranış.
> 3. **Riskli abonelikler:** Aktif abonelikler (A, B, D) dönem bitişine 7 günden az kaldıysa "Riskli abonelikler" listesinde görünebilir; çalıştırma gününe bağlıdır, grafiği etkilemez.
> 4. **Komut 3:** `demo:veri` satırının sonunda virgül olduğunu ve satırın tek olduğunu `package.json` çıktısından biliyorum. Komut 4 iki satır göstermezse `package.json`'u bozmadan önce bana yaz.
> 5. **Ekranda görmediğim üç kontrol** (ipucu, sekme başlığı, tablo) için sonucu bekliyorum; ipucu çıkmazsa Adım 7'den bağımsız olarak düzeltiriz.

### Prompt 14 · 24 Eki 2026 12:01

````text
kullanici@bilgisayar abonetakip % touch src/test-destek/donem-ilerlet.ts
kullanici@bilgisayar abonetakip % touch src/test-destek/gecmis-mrr-verisi.ts
kullanici@bilgisayar abonetakip % perl -pi -e 's/^(\s*"demo:veri": .*,)$/$1\n    "demo:gecmis": "node --env-file=.env.test --import .\/src\/test-destek\/kancalar.mjs src\/test-destek\/gecmis-mrr-verisi.ts",/' package.json
kullanici@bilgisayar abonetakip % grep -n "demo:" package.json
8:    "demo:veri": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/demo-verisi.ts",
9:    "demo:gecmis": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts",
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

npm notice
npm notice New major version of npm available! 11.20.0 -> 12.2.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.1
npm notice To update run: npm install -g npm@12.2.1
npm notice
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 13 · 24 Eki 2026 12:01

> Komut 3 ve 4 doğru: `demo:gecmis` satırı `demo:veri`'nin hemen altında. Lint temiz.
>
> `npm notice` satırı yalnızca npm'in yeni sürüm duyurusu; projeyle ilgisi yok. Gün ortasında araç sürümünü değiştirmemek için **güncelleme yapma**.
>
> ## Önce bir kontrol
>
> Lint boş dosyada da temiz geçer. Bu yüzden üç dosyanın içeriğinin editörde yapıştırılıp kaydedildiğini doğrulayalım.
>
> **Komut A:** Üç dosyanın satır sayısını gösterir. Hiçbiri `0` olmamalı (yaklaşık: `donem-ilerlet.ts` 18, `gecmis-mrr-verisi.ts` 160, `demo-verisi.ts` 150 civarı).
> ```
> wc -l src/test-destek/donem-ilerlet.ts src/test-destek/gecmis-mrr-verisi.ts src/test-destek/demo-verisi.ts
> ```
>
> **Komut B:** `demo-verisi.ts` içinde fonksiyonun artık tanımlanmadığını, yalnızca içe aktarılıp kullanıldığını doğrular. Çıktıda `function donemleriIlerlet` **olmamalı**; `import { donemleriIlerlet }` ve bir kullanım satırı görünmeli.
> ```
> grep -n "donemleriIlerlet" src/test-destek/demo-verisi.ts
> ```
>
> Bir dosya 0 satırsa ya da Komut B'de `function donemleriIlerlet` görünürse, ilgili içeriği (7b, 7c veya 7d) editöre yapıştırıp **Cmd + S** ile kaydet ve `npm run lint`'i tekrar çalıştır.
>
> ## Sonra devam
>
> Önceki mesajdaki sırayla:
> - **Komut 6:** canlı koruması denemesi (veritabanına bağlanmadan "Durduruldu" demeli)
> - **A) bölümü:** `gun11-eski@example.com` ile `demo:veri`'nin eski davranışı (Komut 7 ve 8)
> - **B) bölümü:** `gun11-gecmis@example.com` ile `demo:gecmis` (Komut 9 ve 10), dashboard grafiği ve tablo, kiracı ayrımı
>
> Komut A, B, 6, 7, 9'un çıktılarını ve `gun11-gecmis` dashboard'unun ekran görüntüsünü (tablo açıkken) gönder. Adım 6'daki üç ekran kontrolünü (ipucu, sekme başlığı, tablo) de unutma.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Dosya içerikleri:** Lint temiz geçtiği için dosyaların hem dolu hem kurallara uygun olduğunu varsaymıyorum; Komut A bunu netleştirecek.
> 2. **Satır sayıları yaklaşık:** Editörün son satıra boş satır ekleyip eklemediğine göre bir iki satır fark olabilir; önemli olan 0 olmaması.

### Prompt 15 · 24 Eki 2026 12:02

````text
kullanici@bilgisayar abonetakip % wc -l src/test-destek/donem-ilerlet.ts src/test-destek/gecmis-mrr-verisi.ts src/test-destek/demo-verisi.ts
      18 src/test-destek/donem-ilerlet.ts
     165 src/test-destek/gecmis-mrr-verisi.ts
     154 src/test-destek/demo-verisi.ts
     337 total
kullanici@bilgisayar abonetakip % grep -n "donemleriIlerlet" src/test-destek/demo-verisi.ts
23:// Gün 11: donemleriIlerlet, gecmis-mrr-verisi.ts ile ortak kullanılsın diye
29:import { donemleriIlerlet } from "./donem-ilerlet.ts";
104:        const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(baslangic, s.aralik, sinir);
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 14 · 24 Eki 2026 12:02

> Üç dosya da dolu ve `demo-verisi.ts` doğru: fonksiyon artık yalnızca içe aktarılıyor (satır 29) ve kullanılıyor (satır 104), kendi tanımı yok. Taşıma tamam.
>
> Şimdi denemelere geçebilirsin.
>
> ## 1) Canlı koruması
>
> **Komut 6:** `.env.test` verilmeden çalıştırır. Veritabanına **bağlanmadan** durmalı ve "Durduruldu: TEST_VERITABANI=evet bulunamadı…" yazmalı.
> ```
> node --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts deneme@example.com
> ```
>
> ## 2) `demo:veri`'nin eski davranışı
>
> 1. `npm run dev:test` açıkken tarayıcıda **Çıkış yap**, yeni firma kaydı aç: `gun11-eski@example.com` (parolayı bana yazma).
> 2. **Komut 7:** Gün 9 demo verisini yazar. Çıktının son beş satırı, `gun11-kilit` için gördüğünle **aynı** olmalı ("Demo verisi eklendi… MRR 1.000 TL | Aylık churn %66,7…").
>    ```
>    npm run demo:veri -- gun11-eski@example.com
>    ```
> 3. Dashboard: MRR 1.000 TL, churn %66,7, LTV 1.500 TL; grafikte Eylül 2.500, Ekim 1.000.
> 4. **Komut 8:** Aynı firmaya ikinci kez çalıştırır; "Bu firmada zaten abonelik var" deyip durmalı.
>    ```
>    npm run demo:veri -- gun11-eski@example.com
>    ```
>
> ## 3) Geçmiş MRR verisi
>
> 1. Çıkış yap, yeni firma kaydı: `gun11-gecmis@example.com`.
> 2. **Komut 9:** Geçmiş tarihli veriyi yazar ve beklenen 12 ayı ekrana basar.
>    ```
>    npm run demo:gecmis -- gun11-gecmis@example.com
>    ```
> 3. Dashboard'u yenile, aşağı kaydırıp **"Değerleri tablo olarak göster"**i aç. Tablo Komut 9'un listesiyle birebir aynı olmalı; özellikle **Mayıs 2026 = 4.583 TL** ve **Ekim 2026 (bu ay) = 2.083 TL = MRR kartı**.
> 4. **Komut 10:** İkinci çalıştırma; reddetmeli.
>    ```
>    npm run demo:gecmis -- gun11-gecmis@example.com
>    ```
> 5. `gun11-kilit` ile tekrar giriş yap: grafiği değişmemiş olmalı (Eylül 2.500, Ekim 1.000), "Geçmiş Müşteri" kayıtları görünmemeli.
>
> Gönderilecekler: Komut 6, 7, 8, 9 ve 10'un çıktıları, `gun11-gecmis` dashboard'unun tablo açık ekran görüntüsü ve Adım 6'daki üç ekran kontrolünün (ipucu, sekme başlığı, tablo) sonucu.
>
> Terminal çıktılarını `prompt_cevap/` günlüğüne koyarken satır başındaki kullanıcı adını maskelemeyi unutma.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Satır sayıları:** `gecmis-mrr-verisi.ts` 165 satır, benim tahminimden biraz fazla; editörün uzun senaryo satırlarını bölmüş olması ya da sonda boş satır olabilir. Lint temiz olduğu için sorun saymıyorum; Komut 9 çalışmazsa ilk bakacağım yer burası.
> 2. **Komut 6'nın mesajı:** `canli-koruma.ts`'teki ilk kontrolün `TEST_VERITABANI` değişkenine baktığını dosyadan biliyorum. Bilgisayarında bu değişken başka bir yoldan tanımlıysa ikinci kontrol (canlı adresle karşılaştırma) devreye girer ve farklı bir "Durduruldu" mesajı görürsün; ikisi de doğru sonuçtur.

### Prompt 16 · 24 Eki 2026 12:07

````text
kullanici@bilgisayar abonetakip % wc -l src/test-destek/donem-ilerlet.ts src/test-destek/gecmis-mrr-verisi.ts src/test-destek/demo-verisi.ts
      18 src/test-destek/donem-ilerlet.ts
     165 src/test-destek/gecmis-mrr-verisi.ts
     154 src/test-destek/demo-verisi.ts
     337 total
kullanici@bilgisayar abonetakip % grep -n "donemleriIlerlet" src/test-destek/demo-verisi.ts
23:// Gün 11: donemleriIlerlet, gecmis-mrr-verisi.ts ile ortak kullanılsın diye
29:import { donemleriIlerlet } from "./donem-ilerlet.ts";
104:        const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(baslangic, s.aralik, sinir);
kullanici@bilgisayar abonetakip % node --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts deneme@example.com
Durduruldu: TEST_VERITABANI=evet bulunamadı. Bu betik yalnızca .env.test ile (test dalında) çalışır.
kullanici@bilgisayar abonetakip %    npm run demo:veri -- gun11-eski@example.com

> abonetakip@0.1.0 demo:veri
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/demo-verisi.ts gun11-eski@example.com

(node:85440) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/demo-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85440) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://ww  for libpq SSL mode definitions.
Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun.
kullanici@bilgisayar abonetakip %    npm run demo:veri -- gun11-eski@example.com

> abonetakip@0.1.0 demo:veri
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/demo-verisi.ts gun11-eski@example.com

(node:85485) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/demo-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85485) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https  for libpq SSL mode definitions.
Demo verisi eklendi (test dalı): 3 plan, 3 müşteri, 3 abonelik (2'si bu ay iptal).
Dashboard'da beklenen (CAC girilmeden önce):
  MRR 1.000 TL | Aylık churn %66,7 | LTV 1.500 TL | LTV/CAC: CAC girilmedi
  Aktif müşteri 1 | Bu ay yeni 0 | Bu ay iptal 2
Ayarlar'dan CAC 5000 girildikten sonra: LTV/CAC 0,3 ve 'Dikkat'.
kullanici@bilgisayar abonetakip %    npm run demo:veri -- gun11-eski@example.com

> abonetakip@0.1.0 demo:veri
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/demo-verisi.ts gun11-eski@example.com

(node:85501) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/demo-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85501) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www for libpq SSL mode definitions.
Bu firmada zaten abonelik var. Demo verisi yalnızca aboneliği olmayan bir firmaya eklenir (test dalında yeni bir kullanıcıyla kayıt olun).
kullanici@bilgisayar abonetakip %    npm run demo:gecmis -- gun11-gecmis@example.com

> abonetakip@0.1.0 demo:gecmis
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts gun11-gecmis@example.com

(node:85514) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/gecmis-mrr-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85514) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w for libpq SSL mode definitions.
Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun.
kullanici@bilgisayar abonetakip %    npm run demo:gecmis -- gun11-gecmis@example.com

> abonetakip@0.1.0 demo:gecmis
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts gun11-gecmis@example.com

(node:85527) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/gecmis-mrr-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85527) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https for libpq SSL mode definitions.
Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun.
kullanici@bilgisayar abonetakip %
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 15 · 24 Eki 2026 12:07

> ## Sonuçlar
>
> | Kontrol | Sonuç |
> |---|---|
> | Komut 6, canlı koruması | ✅ Veritabanına bağlanmadan durdu |
> | `demo:veri` ilk deneme | Kayıt henüz açılmamıştı, betik doğru şekilde "kullanıcı bulunamadı" dedi ve hiçbir şey yazmadı |
> | `demo:veri` kayıttan sonra | ✅ Beş satır, taşımadan önceki çıktıyla birebir aynı |
> | `demo:veri` ikinci çalıştırma | ✅ "Bu firmada zaten abonelik var" deyip durdu |
> | Ekran görüntüsü (güneş firması) | ✅ MRR 1.000, churn %66,7, LTV 1.500; grafikte Eylül 2.500, Ekim 1.000 "bu ay", özet cümle doğru |
>
> **`demo:veri`'nin davranışı değişmedi.** Taşıma tamam.
>
> ## `demo:gecmis`: "kullanıcı bulunamadı"
>
> İki çalıştırmada da betik veritabanına bağlandı (canlı koruması geçti) ama bu e-postayla bir kullanıcı bulamadı ve hiçbir şey yazmadı. Bu, betiğin değil kaydın durumu. En olası neden: `gun11-gecmis@example.com` ile kayıt henüz açılmadı ya da tamamlanmadı. Tahmin yürütmek yerine şunları sırayla kontrol et:
>
> 1. Tarayıcıda **Çıkış yap**, kayıt sayfasında e-postayı tam olarak `gun11-gecmis@example.com` yaz ve kaydı tamamla.
> 2. Kayıt başarılıysa seni dashboard'a götürür ve **"Henüz abonelik yok, ilk aboneliği ekleyin"** kutusunu görürsün. Bunu görmeden betiği çalıştırma.
> 3. Sunucunun test dalında çalıştığından emin ol: `localhost:3000`'i açan Terminal sekmesinde en son çalıştırdığın komut `npm run dev:test` olmalı, `npm run dev` değil. (Az önce `gun11-eski` aynı yoldan bulunduğu için büyük olasılıkla doğru, ama kontrol et.)
> 4. Sonra tekrar:
>
> **Komut 9:** Geçmiş tarihli veriyi yazar ve beklenen 12 ayı ekrana basar.
> ```
> npm run demo:gecmis -- gun11-gecmis@example.com
> ```
>
> Kayıt sırasında bir hata mesajı görürsen (ör. e-posta biçimi ya da parola kuralı) mesajın metnini gönder.
>
> ## Hâlâ beklediklerim
>
> - **Komut 9'un çıktısı** ve `gun11-gecmis` dashboard'unun **tablo açık** ekran görüntüsü (Mayıs 4.583, Ekim 2.083 = kart)
> - **Komut 10** (ikinci çalıştırma reddedilmeli)
> - `gun11-kilit` ile giriş yapınca grafiğin değişmediği (kiracı ayrımı)
> - Adım 6'daki üç kontrol: fareyle **ipucu** çıkıyor mu, **sekme başlığı** eskisi gibi mi, **tablo** açılıyor mu
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Firma eşleşmesi:** Ekrandaki "güneş" firmasının `gun11-eski@example.com` ile açtığın firma olduğunu varsayıyorum; değerler demo verisiyle uyuştuğu için büyük olasılıkla öyle.
> 2. **Kayıt nedeni:** "Kullanıcı bulunamadı"nın nedenini kaydın açılmamış olması olarak tahmin ediyorum; kaydı açtığın hâlde aynı mesaj gelirse e-postanın veritabanında nasıl kaydedildiğine (küçük harf, boşluk) birlikte bakarız.
> 3. **Uyarılar:** Terminaldeki iki uyarı (modül türü ve SSL modu) önceki günlerde de vardı ve sonucu etkilemiyor; bu dalda dokunmuyoruz.

### Prompt 17 · 24 Eki 2026 12:11

````text
kullanici@bilgisayar abonetakip %    npm run demo:gecmis -- gun11-gecmis@example.com

> abonetakip@0.1.0 demo:gecmis
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts gun11-gecmis@example.com

(node:85527) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/gecmis-mrr-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85527) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w for libpq SSL mode definitions.
Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun.
kullanici@bilgisayar abonetakip % npm run demo:gecmis -- gun11-gecmis@example.com

> abonetakip@0.1.0 demo:gecmis
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts gun11-gecmis@example.com

(node:85557) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/gecmis-mrr-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85557) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w for libpq SSL mode definitions.
Geçmiş MRR demo verisi eklendi (test dalı): 5 plan, 5 müşteri, 5 abonelik (2'si geçmişte iptal).
Dashboard'da beklenen grafik (son 12 ay, elle hesaplanmış):
  Kasım 2025: 3.000 TL
  Aralık 2025: 3.000 TL
  Ocak 2026: 4.000 TL
  Şubat 2026: 4.000 TL
  Mart 2026: 4.500 TL
  Nisan 2026: 4.500 TL
  Mayıs 2026: 4.583 TL
  Haziran 2026: 4.083 TL
  Temmuz 2026: 4.083 TL
  Ağustos 2026: 4.083 TL
  Eylül 2026: 2.083 TL
  Ekim 2026 (bu ay): 2.083 TL
MRR kartı: 2.083 TL (grafiğin son noktasıyla aynı olmalı).
````

_[2 ekran görüntüsü eklendi]_

### Claude cevabı 16 · 24 Eki 2026 12:12

> Geçmiş MRR denemesi başarılı. Ekranlara göre:
>
> | Kontrol | Sonuç |
> |---|---|
> | Grafik (bebek firması) | ✅ Komut 9'un listesiyle aynı şekil: Kasım–Aralık 3.000, Ocak–Şubat 4.000, Mart–Nisan 4.500, **Mayıs en yüksek (4.583)**, Haziran–Ağustos 4.083, Eylül ve Ekim 2.083 |
> | Eksen | ✅ 0 / 2.500 / 5.000 TL |
> | Son nokta = MRR kartı | ✅ 2.083 TL |
> | Özet cümle | ✅ Testteki cümleyle birebir |
> | İpucu | ✅ "Mart 2026: 0 TL" (0 olan ayda da çalışıyor) |
> | Kiracı ayrımı | ✅ deneme 11 ltd. grafiği değişmemiş (Eylül 2.500, Ekim 1.000), geçmiş veri orada yok |
>
> Churn kartının %0,0, LTV'nin "hesaplanamadı" göstermesi de doğru: bu firmada bu ay iptal yok (E geçen ayın 1'inde gitti), Gün 8 kuralına göre ömür tahmin edilemez.
>
> **Üç küçük kontrol kaldı**, Adım 9'dan önce yazman yeterli:
> 1. **Komut 10:** `npm run demo:gecmis -- gun11-gecmis@example.com` ikinci kez; "zaten abonelik var" demeli.
> 2. **Tablo:** bebek firmasında "Değerleri tablo olarak göster" açılıyor mu, Mayıs satırı 4.583 TL mi?
> 3. **Sekme başlığı:** Fareyle çubuğun üzerine geldikten sonra Chrome sekmesindeki başlık değişmiyor mu?
>
> ---
>
> # Adım 8: ADR Gün 11 bölümü
>
> `docs/02_ADR.md` dosyasını editörde aç, **en sona** (son satırdan sonra bir boş satır bırakarak) aşağıdaki bölümü yapıştır ve Cmd + S ile kaydet. Dosyanın geri kalanına dokunma.
>
> Not: Bu metinde ad taramasının deseni, kullanıcı adı, gerçek adres veya parola yok; sahte e-postalar `example.com` uzantılı.
>
> ```markdown
> ## Gün 11 kararları (24 Ekim 2026): aylık MRR grafiği (Parça A)
>
> **Durum:** Parça A kodu tamamlandı (dal: `gun11a-mrr-grafigi`). Gün 11 iki parçaya
> bölündü (K11.6). Parça B (boş durum, hata ve yüklenme ekranları, form mesajları) ayrı dal
> ve PR ile gelecek.
> **Sonuç:** `npm test`, `npm run test:db`, `npm run lint`, `npm run build` temiz. Grafik test
> dalında üç sahte firmayla elle sınandı (aşağıda).
>
> ### Kararlar
>
> **K11.1: Plan fiyatı ve aralığı, plana bağlı HERHANGİ bir abonelik varsa kilitlenir (D1 kapandı)**
> - **Durum öncesi:** Abonelikte fiyat kopyası yoktur; geçmiş MRR planın bugünkü fiyatıyla
>   hesaplanır (Gün 8, D1). Gün 8'deki kilit yalnızca **aktif** abonelik içindi. Bütün
>   abonelikleri iptal edilmiş bir planın fiyatı değiştirilebiliyordu; o abonelikler geçmişte
>   aktif olduğu için grafikte o aylar da değişirdi.
> - **Değerlendirilen seçenekler:**
>   - A. Abonelikte fiyat ve aralık kopyası (şema değişikliği ve migration): geçmiş her zaman
>     doğru, ama 2 haftalık projede şema değişikliği riski ve kapsamı büyük.
>   - B. Kilidi genişletmek (seçildi): aboneliği olan (iptal edilmişler dahil) planın fiyatı ve
>     aralığı değiştirilemez. Fiyat değişikliği = yeni plan oluşturup eskisini pasife almak.
>   - C. Kabul edip grafiğe not düşmek: grafik yanlış bilgi gösterebilir.
> - **Gerekçe:** B şema değişikliği gerektirmez, geçmişi korur ve "kayıt silinmez, pasife
>   alınır" kuralıyla uyumludur.
> - **Uygulama:** `abonelik-kontrol.ts` içine `abonelikVarMi` eklendi (durum filtresi yok).
>   `planGuncelle` (sunucu, asıl engel) ve plan detay sayfası (salt okunur alanlar) bu
>   fonksiyonu kullanır. `aktifAbonelikVarMi` değişmedi; pasife almada doğru kural
>   "aktif abonelik"tir. Ad değişikliği serbest.
> - **Bilinen sınır:** Bu karardan önce yalnızca iptal edilmiş aboneliği olan bir planın fiyatı
>   değiştirildiyse ilgili geçmiş aylar zaten etkilenmiş olabilir. Fiyat geçmişi tutulmadığı
>   için geriye dönük tespit edilemez. Kontrol ile güncelleme iki adım olduğundan pasife
>   almadaki "aynı anda gelen istek" penceresi burada da vardır (ham SQL yasağı, kabul edildi).
>
> **K11.2: MRR kartı değiştirilmedi; grafiğin son noktasıyla eşitliği testle sabitlendi**
> - **Fark:** Kart (`mrrHesapla`) `status = ACTIVE` olanları toplar. Grafik (`tarihtekiMrr`)
>   `startedAt` ve `canceledAt` tarihlerine bakar.
> - **Neden eşit:** Uygulamada `startedAt` başlatma anında sunucu saatiyle yazılır (gelecek
>   tarih mümkün değil). İptalde `status` ve `canceledAt` aynı güncellemede yazılır.
> - **Karar:** Kart, Gün 9 davranışını (ARPU ve aktif müşteri ile aynı kural) korumak için
>   değiştirilmedi. `dashboard-verisi.ts` kart ve grafiği aynı abonelik listesi ve aynı
>   `simdi` ile hesaplar. Eşitlik `metrikler.test.ts` (Gün 11 senaryosu) ve
>   `dashboard-verisi.test.ts` içinde testle sabitlendi.
> - **Dikkat:** Veritabanına uygulama dışından (elle SQL) `status` ile `canceledAt` birbirinden
>   bağımsız yazılırsa eşitlik bozulabilir.
>
> **K11.3: Ay sınırı için yeni fonksiyon yazılmadı; yalnızca `sonAylar` eklendi**
> - Ay sınırı anları (`ayAraligi`, `ayinSonAni`) ve geçmiş MRR (`mrrGecmisi`) Gün 8'de yazılmış
>   ve testliydi; aynen kullanıldı.
> - `sonAylar(simdi, adet)` yeni: `turkiyeAyi` yalnızca bulunulan ayı verir; Ocak'tan önceki
>   yılın Aralık ayına geçen bir liste yoktu. Her ay tek sıra numarasına çevrilip geriye
>   sayılır, yıl geçişi ayrıca ele alınmaz. Testleri: yıl geçişi, gece 00:30 (TR), adet 1 ve 0.
>
> **K11.4: Grafik paketsiz, sunucuda çizilen SVG (Server Component)**
> - **Gerekçe:** 12 çubuk ve iki eksen için paket gerekmez; tarayıcıya JavaScript gitmez; hesap
>   sunucuda kalır. Paket gerekseydi Recharts düşünülürdü, ama istemcide çalıştığı için
>   önerilmedi.
> - **Yapı:** Hesap gerektiren parçalar test edilebilsin diye `src/lib/mrr-grafigi.ts`
>   içindedir (eksen üst sınırı: 1, 2, 2,5, 5, 10 katları, en az 100; özet cümle). Bileşen
>   (`dashboard/MrrGrafigi.tsx`) yalnızca çizer.
> - **Erişilebilirlik:** Her ayın SVG `<title>` etiketi fareyle değeri gösterir (MRR 0 olan
>   ayda da). Ekran okuyucu grafiği özet cümleyle okur. Değerler açılır tabloda da verilir.
>   "Bu ay" renkle birlikte eksen altındaki yazıyla belirtilir. Dar ekranda grafik yana
>   kaydırılır.
> - **Biçim:** Alt eksende kısa ay (`kisaAyEtiketi`: "Eki 26"); yıl `Intl`'e bırakılmadı,
>   elle iki hane yazılır. İpucu, tablo ve özet cümlede uzun ay adı kullanılır. Özet cümlede
>   ekler yalnızca "TL"ye gelir (ay adlarında ek uyumu yıla göre değişir).
>
> **K11.5: Geçmiş tarihli demo verisi (`demo:gecmis`) ve ortak yardımcı**
> - `donemleriIlerlet`, `demo-verisi.ts`'ten `src/test-destek/donem-ilerlet.ts`'e taşındı
>   (içe aktarılınca betik çalıştığı için). `demo:veri`'nin davranışının değişmediği yeni
>   bir test firmasında denendi: çıktı ve dashboard aynı, ikinci çalıştırma reddedildi.
> - `demo:gecmis` aynı güvenceleri taşır (canlı koruması veritabanı yüklenmeden önce, var
>   olan firmaya yazma, aboneliği olan firmada durma, tek işlem, tenant filtresi). Tarihler
>   çalıştırıldığı aya göre kayar. Beklenen değerler kodla değil, elle hesaplanmış sabit
>   listeyle ekrana yazılır.
>
> **K11.6: Gün 11 iki PR'a bölündü**
> - Parça A: grafik ve geçmiş MRR hesabı (bu bölüm). Parça B: boş durum, hata sayfaları
>   (404, genel hata, yetkisiz), yüklenme ekranları ve form mesajları.
> - **Gerekçe:** Küçük ve gözden geçirilebilir PR'lar; grafik ile hata ekranları birbirine
>   bağlı değil.
>
> ### Elle sınama (test dalı)
>
> | Durum | Sonuç |
> |---|---|
> | Kilit: yalnızca iptal edilmiş aboneliği olan plan | Fiyat ve aralık salt okunur, ad değiştirilebilir |
> | Kilit: aboneliği olmayan yeni plan | Fiyat değiştirilebilir |
> | Gün 9 demo firması | Eylül 2.500 TL, Ekim (bu ay) 1.000 TL = MRR kartı |
> | Geçmiş MRR firması (`demo:gecmis`) | 12 ay elle hesaplanan listeyle aynı; Mayıs 2026 = 4.583 TL; Ekim 2.083 TL = MRR kartı |
> | 12 aydan eski veri, yıllık plan, ay içinde iptal, ay sınırları | Beklenen aylara düştü (Nisan'da D yok, Ağustos'ta E var) |
> | Kiracı ayrımı | Bir firmanın grafiğinde diğer firmanın verisi görünmedi |
> | İpucu | MRR 0 olan ayda da değer gösterdi |
> | Canlı koruması | `.env.test` olmadan betik veritabanına bağlanmadan durdu |
>
> **Elle hesap (Mayıs 2026):** 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33 → 4.583 TL.
>
> ### Bilinen sınırlar
> - K11.1'deki geriye dönük fiyat değişikliği sınırı.
> - `dashboard-verisi.test.ts` MRR geçmişi testinde "şimdi" 1 dakika ileri alınır (saat farkı
>   için). Test ayın son dakikasında çalışırsa kalabilir; yeniden çalıştırmak yeterli.
> - Grafik her zaman son 12 ayı gösterir; dönem seçimi kapsam dışıdır.
> - Terminaldeki modül türü ve SSL modu uyarıları önceki günlerden beri vardır; bu dalda
>   dokunulmadı.
>
> ### Parça B için notlar
> - Dashboard'un boş durumu Gün 9'da vardır; grafik hiç abonelik olmayan firmada çizilmez.
> - Plan detay sayfası ve abonelik işlemleri "bulunamadı" için zaten `notFound()` ve
>   `MESAJ.bulunamadi` kullanıyor; Parça B bunları ortak 404 ve mesaj bileşenleriyle
>   tutarlı hâle getirecek.
> ```
>
> **Komut 1:** Bölümün eklendiğini doğrular; çıktı `1` olmalı.
> ```
> grep -c "## Gün 11 kararları" docs/02_ADR.md
> ```
>
> **Komut 2:** Belgede gerçek sunucu adı kalmadığını kontrol eder (ikinci tarama ile aynı desen, yalnızca bu dosyada); sonuç `0` olmalı.
> ```
> grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" docs/02_ADR.md | grep -vc "ep-xxxx"
> ```
>
> Komut 1 ve 2'nin sonucunu ve yukarıdaki üç küçük kontrolü yazınca **Adım 9**'a geçeceğiz: son test turu, `git add`, üç tarama, commit, GitHub Desktop ile PR.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **ADR'nin sonu:** Gün 9 ve Gün 10 bölümlerinin dosyanın sonunda olduğunu ve yeni bölümün en sona eklenmesinin düzene uyduğunu varsayıyorum; dosyanın tamamını görmedim. Farklı bir düzen varsa (ör. en yeni gün en üstte) söyle.
> 2. **Test sayıları:** ADR'ye kesin test sayısı yazmadım, çünkü bu oturumda sayıları görmedim. İstersen Adım 9'daki son test turunun sayılarını "Sonuç" satırına eklersin.
> 3. **Sekme başlığı:** ADR'de React `<title>` konusuna yer vermedim; sekme başlığı değişiyorsa bu bir hata olur ve ADR'ye ayrıca eklenir.
> 4. **Komut 2'nin `0` dönüşü:** Belgede `neon.tech` hiç geçmezse `grep -vc` yine `0` yazar ve bu doğru sonuçtur; komut hata koduyla bitse de çıktıya bakman yeterli.

### Prompt 18 · 24 Eki 2026 12:13

````text
kullanici@bilgisayar abonetakip % npm run demo:gecmis -- gun11-gecmis@example.com

> abonetakip@0.1.0 demo:gecmis
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/gecmis-mrr-verisi.ts gun11-gecmis@example.com

(node:85591) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/gecmis-mrr-verisi.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85591) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https: for libpq SSL mode definitions.
Bu firmada zaten abonelik var. Geçmiş MRR verisi yalnızca aboneliği olmayan bir firmaya eklenir (test dalında yeni bir kullanıcıyla kayıt olun).
kullanici@bilgisayar abonetakip %
````

_[2 ekran görüntüsü eklendi]_

### Claude cevabı 17 · 24 Eki 2026 12:14

> Son kontroller de tamam:
>
> | Kontrol | Sonuç |
> |---|---|
> | Komut 10 (ikinci çalıştırma) | ✅ "Bu firmada zaten abonelik var", hiçbir şey yazılmadı |
> | Tablo | ✅ 12 satır, Komut 9'un listesiyle birebir; Mayıs 4.583 TL, Ekim (bu ay) 2.083 TL |
> | İpucu | ✅ "Mayıs 2026: 4.583 TL", çubuk koyulaşıyor |
> | Sekme başlığı | ✅ Ekran görüntülerinde etkin sekmenin başlığı önceki görüntülerle aynı ("Crea…"); ipucu metni sekmeye taşınmamış |
>
> Parça A'nın işlevi bitti. Şimdi kayıt ve teslim.
>
> ---
>
> ## Önce Adım 8'i bitir
>
> ADR bölümünü `docs/02_ADR.md`'nin sonuna yapıştırıp kaydettiysen önceki mesajdaki **Komut 1** (`1` dönmeli) ve **Komut 2** (`0` dönmeli) sonuçlarına bak. İkisi de doğruysa aşağıya geç.
>
> ---
>
> # Adım 9: Son test turu, taramalar, commit ve PR
>
> ## 9a) Son test turu
>
> Sırayla çalıştır; hepsi temiz olmalı.
>
> **Komut 1:** Kod kuralları.
> ```
> npm run lint
> ```
> **Komut 2:** Veritabanısız testler (`fail 0`).
> ```
> npm test
> ```
> **Komut 3:** Test dalındaki veritabanı testleri (`fail 0`).
> ```
> npm run test:db
> ```
> **Komut 4:** Derleme ve tür kontrolü.
> ```
> npm run build
> ```
>
> ## 9b) Değişen dosyaları gözden geçir
>
> **Komut 5:** Değişen ve yeni dosyaları kısa listeler.
> ```
> git status --short
> ```
>
> Beklenen liste (19 dosya; ` M` = değişti, `??` = yeni):
>
> | Durum | Dosya |
> |---|---|
> | ` M` | `docs/02_ADR.md`, `package.json` |
> | ` M` | `src/app/(panel)/dashboard/page.tsx` |
> | ` M` | `src/app/(panel)/planlar/PlanFormu.tsx`, `src/app/(panel)/planlar/[id]/page.tsx`, `src/app/(panel)/planlar/actions.ts` |
> | ` M` | `src/lib/abonelik-kontrol.ts`, `src/lib/bicim.ts`, `src/lib/bicim.test.ts`, `src/lib/dashboard-verisi.ts`, `src/lib/dashboard-verisi.test.ts`, `src/lib/metrikler.ts`, `src/lib/metrikler.test.ts` |
> | ` M` | `src/test-destek/demo-verisi.ts` |
> | `??` | `src/app/(panel)/dashboard/MrrGrafigi.tsx`, `src/lib/mrr-grafigi.ts`, `src/lib/mrr-grafigi.test.ts`, `src/test-destek/donem-ilerlet.ts`, `src/test-destek/gecmis-mrr-verisi.ts` |
>
> Bugünün `prompt_cevap/` dosyasını da eklediysen o da görünür; içeriği maskelenmiş olmalı. **Listede `.env` ya da `.env.test` görünürse durup bana yaz.** Başka beklenmedik bir dosya varsa da önce bana yaz.
>
> ## 9c) Dosyaları hazırla
>
> **Komut 6:** Listedeki bütün değişiklikleri commit için hazırlar.
> ```
> git add -A
> ```
>
> **Komut 7:** Hazırlanan dosyalar arasında ortam dosyası olmadığını doğrular; sonuç `0` olmalı.
> ```
> git diff --cached --name-only | grep -c -E "(^|/)\.env(\.test)?$"
> ```
>
> ## 9d) Üç tarama (hazırlanan dosyalarda, içerik basmadan)
>
> **Tarama 1:** Parola deseni. Çıktı **boş** olmalı.
> ```
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> **Tarama 2:** Gerçek Neon sunucu adı. Sonuç **0** olmalı.
> ```
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> **Tarama 3:** Ad taraması. Desenini bu cevaba bilerek yazmıyorum (bu metin prompt günlüğüne girecek). Komutu `CLAUDE.md`'deki "Güncel çalışma kuralları" bölümünün **3. maddesinden** olduğu gibi kopyala. Sonuç **0** olmalı.
>
> Bir tarama beklenenden farklı çıkarsa commit atma, çıktının yalnızca **sayısını** bana yaz (içeriği değil).
>
> ## 9e) Commit
>
> **Komut 8:** Commit'i atar. Tamamını tek seferde yapıştır; tırnak içindeki satır sonları mesajın parçasıdır. Ekler mesajın en sonunda, tek blokta.
> ```
> git commit -m "feat: aylık MRR grafiği" -m "- Dashboard'a son 12 ayın MRR grafiği (paketsiz SVG, sunucuda çizilir), özet cümle ve açılır tablo
> - sonAylar, mrr-grafigi yardımcıları ve kısa ay etiketi, birim testleriyle
> - Grafiğin son noktası MRR kartıyla aynı veriden ve aynı andan hesaplanır, testle sabitlendi
> - Plan fiyatı ve aralığı iptal edilmiş abonelikleri olan planlarda da kilitli (ADR K11.1)
> - demo:gecmis betiği; donemleriIlerlet ortak dosyaya taşındı, demo:veri davranışı aynı
> - ADR Gün 11 (Parça A)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> **Komut 9:** Commit mesajını gösterir; en sonda iki ek satır alt alta görünmeli.
> ```
> git --no-pager log -1 --format=%B
> ```
>
> ## 9f) GitHub Desktop ile PR
>
> 1. GitHub Desktop'ta mevcut dal `gun11a-mrr-grafigi` olmalı. **Publish branch**'e tıkla.
> 2. **Create Pull Request**'e tıkla; tarayıcıda GitHub açılır.
> 3. Başlık: `feat: aylık MRR grafiği`
> 4. Açıklama alanına şunu yapıştır:
>
> ```markdown
> ## Gün 11 • Parça A: Aylık MRR grafiği
>
> - Dashboard'a son 12 ayın MRR grafiği: paketsiz SVG, Server Component, hesap sunucuda
> - Erişilebilirlik: fareyle değer ipucu, özet cümle, açılır tablo, "bu ay" metinle de belirtilir
> - `sonAylar` (metrikler.ts), `mrr-grafigi.ts` (eksen ve özet cümle), `kisaAyEtiketi` (bicim.ts)
> - Grafiğin son noktası = MRR kartı (aynı veri, aynı an; testle sabitlendi)
> - Plan fiyatı ve aralığı, iptal edilmiş abonelikleri olan planlarda da kilitli (ADR K11.1, D1 kapandı)
> - `demo:gecmis` betiği (yalnızca test dalı); `donemleriIlerlet` ortak dosyaya taşındı
> - ADR Gün 11 (Parça A)
>
> ## Sınama
> - `npm run lint`, `npm test`, `npm run test:db`, `npm run build` temiz
> - Test dalında üç sahte firmayla elle sınandı: Mayıs 2026 = 4.583 TL (elle hesapla aynı), son nokta = MRR kartı, kiracı ayrımı korunuyor, `demo:veri` davranışı değişmedi
>
> Parça B (boş durum, hata ve yüklenme ekranları, form mesajları) ayrı PR ile gelecek.
>
> 🤖 Generated with [Claude Code](https://claude.com/claude-code)
>
> https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
> ```
>
> 5. **Create pull request**, ardından **Squash and merge**. Onay ekranındaki commit açıklamasında iki ek satırın (`Co-Authored-By` ve `Claude-Session`) en sonda kaldığını kontrol et, sonra **Confirm squash and merge**.
>
> ## 9g) Birleştirmeden sonra
>
> **Komut 10:** `main` dalına geçer.
> ```
> git switch main
> ```
> **Komut 11:** Birleştirilmiş hâli indirir.
> ```
> git pull
> ```
> **Komut 12:** Son commit'i tek satırda gösterir; `feat: aylık MRR grafiği` görünmeli.
> ```
> git --no-pager log -1 --oneline
> ```
>
> Komut 2, 3, 5, 7, üç taramanın ve Komut 12'nin sonuçlarını gönder. Ardından Parça B'nin planına geçeriz (yeni dal, önce plan, onayından sonra kod).
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Sekme başlığı:** Ekran görüntülerinde sekme başlıkları kısaltılmış; etkin sekmenin başlığının değişmediğini önceki görüntülerle karşılaştırarak çıkardım. Fareyi sekmenin üzerine getirip tam başlığa bakarsan kesinleşir.
> 2. **`git add -A`:** `.gitignore`'un `.env` ve `.env.test`'i dışarıda bıraktığını varsayıyorum; Komut 5 ve 7 bunu iki kez kontrol ediyor.
> 3. **Commit mesajı:** zsh'de tırnak içinde satır sonu bırakılınca komutun devam ettiğini varsayıyorum (satır başında `dquote>` görünür, bu normal). Komut yarım kalırsa Control + C ile iptal edip tekrar yapıştırabilirsin.
> 4. **Squash birleştirme:** GitHub'ın squash commit açıklamasına dal içindeki commit mesajını, ekleri dahil, kopyaladığını varsayıyorum; onay ekranında ekler kaybolmuşsa elle en sona ekle.

### Prompt 19 · 24 Eki 2026 13:11

````text
Parça A birleşti (PR #37, squash commit 344b753) ve canlıda doğrulandı. Şimdi Parça B'nin planını hazırla: boş durum, hata ekranları (404, genel hata, yetkisiz), yüklenme ekranları ve form mesajları. Kurallar aynı: önce plan, ben onaylamadan kod yok; yeni özellik ekleme; mevcut yapıya uy; tek tek komut; sonunda varsayımlar.

Planına şunları işle:
- Mevcut BosDurum bileşenini ve Parça A'da gördüğün dosyaları yeniden kullan, yeni bileşen açmadan önce mevcut olanı kontrol et.
- Başka kiracının kaydı 404 (Kayıt bulunamadı), yetkisiz erişim (finance kullanıcısı ayarlara girince) için anlaşılır mesaj. Rol kontrolü sunucuda kalır.
- Sınama listesi: boş hesap (müşteri yok, plan yok, abonelik yok), var olmayan adres, başka kiracının kimliği, finance ayarlara giriyor, yavaş yüklenme.
- Gün 11'in ADR bölümüne Parça B kararlarını ekleyecek şekilde planla. ADR'deki "Durum" satırını da güncelle (Parça A için 344b753 ve PR #37).
- Hangi dosyaların içeriğini görmen gerekiyorsa listele, ben tek metin dosyasında ileteyim.
````

### Claude cevabı 18 · 24 Eki 2026 13:13

> # Gün 11 • Parça B Planı: Boş durum, hata ve yüklenme ekranları, form mesajları
>
> Parça A'nın birleştiğini (PR #37, `344b753`) not ettim. Hiçbir dosyayı değiştirmiyorum. Bu yalnızca plan.
>
> ---
>
> ## 1) Projede zaten olanlar (Parça A'da gördüklerimden)
>
> Önce mevcut parçaları kullanacağım; yeni bileşeni yalnızca karşılığı yoksa açacağım.
>
> | Konu | Mevcut | Kaynak |
> |---|---|---|
> | Boş durum | `src/components/ui/BosDurum.tsx` (başlık, açıklama, içine düğme) | Dashboard'da kullanılıyor |
> | 404 | `src/app/(panel)/not-found.tsx` var; plan detay sayfası kayıt yoksa ya da başka firmanınsa `notFound()` çağırıyor | `find` çıktısı, `planlar/[id]/page.tsx` |
> | Yetkisiz | `src/app/(panel)/YetkiYok.tsx` var | `find` çıktısı |
> | Form mesajı | `src/components/ui/IslemMesaji.tsx` ve `src/lib/islem.ts` (`MESAJ`, `FormDurumu`) | `PlanFormu.tsx`, `planlar/actions.ts` |
> | Form bekleme | `PlanFormu`'nda "Kaydediliyor..." ve düğme kapalı | `PlanFormu.tsx` |
> | Hata sayfası | **Yok** (`error.tsx` yok) | `find` çıktısı |
> | Yüklenme | **Yok** (`loading.tsx` yok) | `find` çıktısı |
> | Kök 404 | **Yok**; derleme çıktısında `/_not-found` Next.js'in varsayılan (İngilizce) sayfası | `npm run build` çıktısı |
>
> Yani Parça B'nin çoğu **eksikleri tamamlamak ve tutarlı hâle getirmek**: iki ya da üç yeni dosya, gerisi mevcut dosyalarda küçük düzenlemeler.
>
> ---
>
> ## 2) Planlanan değişiklikler (dosyaları görünce kesinleşecek)
>
> ### a) 404: "Kayıt bulunamadı"
>
> - **Panel içi** (`(panel)/not-found.tsx`, mevcut): Başka firmanın kaydı, geçersiz kimlik ve var olmayan kayıt aynı ekranı gösterir. Metin "Kayıt bulunamadı" olacak şekilde gözden geçirilir; `BosDurum` ile görünüm tutarlı hâle getirilir, "Dashboard'a dön" bağlantısı. Bu ekran panel yerleşiminin (sol menü) içinde açılır.
> - **Kök 404** (`src/app/not-found.tsx`, **yeni**): Var olmayan bir adres (ör. `/olmayan-sayfa`) bugün Next.js'in İngilizce sayfasını gösteriyor. Türkçe, sade bir sayfa: "Sayfa bulunamadı" ve ana sayfaya bağlantı. Oturum gerektirmez, veri okumaz.
> - **Kontrol:** `musteriler/[id]/page.tsx`'in de `planlar/[id]` gibi geçersiz kimlikte ve başka kiracıda `notFound()` çağırdığını doğrulayacağım. Çağırmıyorsa aynı kalıba getireceğim.
> - **Kural değişmiyor:** Başka kiracının kaydı için 403 değil 404 ("bulunamadı"); kaydın varlığı bile belli olmaz (CLAUDE.md).
>
> ### b) Yetkisiz erişim (finance → Ayarlar, Kullanıcılar)
>
> - Mevcut `YetkiYok.tsx` kullanılır. `ayarlar/page.tsx` ve `kullanicilar/page.tsx`'in rol kontrolünü **sunucuda** yapıp `YetkiYok`'u gösterdiğini doğrulayacağım; metin anlaşılır hâle getirilir: "Bu sayfayı yalnızca firma yöneticisi görebilir. Bir değişiklik gerekiyorsa firma yöneticinize başvurun."
> - **Karar önerisi:** Ayrı bir `/yetkisiz` sayfası ya da Next.js'in `forbidden()` özelliği **kullanılmaz**. `forbidden()` deneysel bir ayar gerektiriyor (Next 16'da durumunu sürüme göre kontrol edeceğim, emin değilim); ayrı sayfa da yönlendirme ve yeni rota demek. Bu yüzden mevcut bileşen sayfanın içinde gösterilmeye devam eder. Sonucu: tarayıcıya giden HTTP kodu 200 olur, 403 değil. Sunucu işlemleri (form gönderimleri) zaten kendi içinde rol kontrolü yapıp hata mesajı döndürüyor; bu değişmez.
>
> ### c) Genel hata ekranı
>
> - `src/app/(panel)/error.tsx` (**yeni**, `"use client"` zorunlu): Panel sayfalarında beklenmeyen bir hata olursa sol menü yerinde kalır, içerikte "Bir şeyler ters gitti. Lütfen tekrar deneyin." ve **Tekrar dene** düğmesi. Hata ayrıntısı (mesaj, yığın izi) ekrana yazılmaz; yalnızca Next.js'in ürettiği kısa hata kodu (`digest`) "Destek için kod" olarak gösterilir.
> - **Açık soru:** Kök yerleşimin kendisi çökerse görünen `global-error.tsx` de eklensin mi? Kendi `<html>` ve `<body>`'si olan, düz metinli küçük bir dosya. Önerim **evet** (aksi hâlde o nadir durumda İngilizce varsayılan ekran çıkar), ama bu senin kararın.
>
> ### d) Yüklenme ekranı
>
> - `src/app/(panel)/loading.tsx` (**yeni**, tek dosya): Panelin bütün sayfaları için. Sayfa sunucuda hazırlanırken sol menü yerinde kalır, içerikte başlık ve kart iskeleti ile "Yükleniyor…" yazısı. Ekran okuyucu için `role="status"`; hareket azaltma tercihi olan kullanıcıda yanıp sönme kapanır (`motion-reduce`).
> - Sayfa başına ayrı `loading.tsx` açılmaz; tek dosya yeterli ve tutarlı.
> - Form düğmelerinin bekleme durumu ("Kaydediliyor...", düğme kapalı) bütün formlarda aynı mı, kontrol edilir.
>
> ### e) Boş durumlar
>
> Her liste sayfası `BosDurum` ile ve aynı dille:
>
> | Sayfa | Durum | Mesaj ve yönlendirme |
> |---|---|---|
> | Dashboard | Hiç abonelik yok | Mevcut, değişmez |
> | Müşteriler | Hiç müşteri yok | "Henüz müşteri yok" + yukarıdaki forma yönlendiren açıklama |
> | Planlar | Hiç plan yok | "Henüz plan yok" |
> | Planlar / Müşteriler | "Pasifleri göster" açık, pasif kayıt yok | "Pasif kayıt yok" |
> | Abonelikler | Müşteri ya da aktif plan yok | Başlatma formu yerine "Abonelik başlatmak için önce bir müşteri ve bir plan ekleyin" + Müşteriler / Planlar bağlantıları |
> | Abonelikler | Hiç abonelik yok | "Henüz abonelik yok" |
>
> Sayfalarda bugün ne olduğunu görmeden hangilerinin eksik olduğunu bilmiyorum; yalnızca eksikleri tamamlayacağım.
>
> ### f) Form mesajları
>
> - Tek kaynak: `IslemMesaji` bileşeni ve `islem.ts` içindeki `MESAJ` sözlüğü. Bütün formlar (giriş, kayıt, müşteri, plan, abonelik başlat/yenile/iptal, CAC, pasife alma) bunları kullanacak.
> - Tutarlılık kuralları: başarı ve hata mesajı **simge + metin** (renk tek başına anlam taşımaz), hata için `role="alert"`, başarı için `role="status"`; aynı durum için aynı cümle (ör. "bulunamadı", "beklenmeyen hata"); Türkçe ve nokta ile biten tam cümleler.
> - Yeni mesaj türü ya da yeni davranış eklenmez; yalnızca dağınık metinler `MESAJ`'a toplanır ve görünüm birleştirilir.
>
> ---
>
> ## 3) ADR planı
>
> `docs/02_ADR.md` içindeki **Gün 11 bölümüne** eklenecek:
>
> - **"Durum" satırı:** "Parça A birleşti: PR #37, squash commit `344b753`, canlıda doğrulandı. Parça B: dal `gun11b-bos-hata-ekranlari`."
> - **"Sonuç" satırı:** Parça B'nin test sonuçlarıyla güncellenir.
> - **Yeni kararlar** (Parça A'nın K11.6'sından sonra devam eden numaralarla):
>   - **K11.7** 404: panel içi ve kök 404 ayrımı, başka kiracı = "bulunamadı"
>   - **K11.8** Yetkisiz: mevcut `YetkiYok` sayfa içinde; `forbidden()` ve ayrı sayfa neden kullanılmadı; HTTP 200 sonucu
>   - **K11.9** Genel hata: ayrıntı gösterilmez, yalnızca kod; `global-error` kararı
>   - **K11.10** Yüklenme: panel grubu için tek `loading.tsx`
>   - **K11.11** Boş durum ve form mesajları: `BosDurum`, `IslemMesaji`, `MESAJ` tek kaynak
> - **Elle sınama tablosuna** Parça B satırları, **bilinen sınırlara** HTTP 200 notu eklenir.
>
> ---
>
> ## 4) Sınama listesi (test dalında)
>
> | # | Durum | Nasıl | Beklenen |
> |---|---|---|---|
> | 1 | Boş hesap | Yeni firma: `gun11-bos@example.com`, hiç veri yok | Dashboard, Müşteriler, Planlar, Abonelikler'de boş durum mesajları; Abonelikler'de "önce müşteri ve plan ekleyin" |
> | 2 | Kısmen boş | Aynı firmada yalnızca bir müşteri ekle | Abonelikler hâlâ "önce plan ekleyin" der |
> | 3 | Var olmayan adres | `localhost:3000/olmayan-sayfa` | Türkçe kök 404 |
> | 4 | Geçersiz kimlik | `localhost:3000/musteriler/abc` | Panel içi "Kayıt bulunamadı" |
> | 5 | Başka kiracının kimliği | `bebek` firmasında bir planın adres çubuğundaki kimliğini kopyala, `deneme 11 ltd.` ile giriş yapıp o adresi aç | "Kayıt bulunamadı" (yetkisiz değil) |
> | 6 | finance → Ayarlar | Bir firmada finance kullanıcısıyla giriş yapıp `/ayarlar` ve `/kullanicilar` adreslerini doğrudan aç | Anlaşılır yetkisiz mesajı, CAC formu ve kullanıcı listesi görünmez |
> | 7 | Yavaş yüklenme | Chrome geliştirici araçları (Cmd + Option + I) → Network → "Slow 4G", menüde sayfalar arasında geç | Sol menü yerinde, içerikte "Yükleniyor…" iskeleti |
> | 8 | Genel hata | Wi-Fi'yi kapat, panelde başka bir sayfaya geç (sunucu Neon'a ulaşamaz), sonra Wi-Fi'yi aç ve **Tekrar dene** | Türkçe hata ekranı, ayrıntı yok, Tekrar dene sonrası sayfa gelir |
> | 9 | Form mesajları | Her formda bir hatalı, bir başarılı gönderim | Aynı görünüm, simge + metin, Türkçe tam cümle |
>
> Not (8): Geliştirme sunucusu hatada kendi kırmızı uyarı penceresini de açar; onu kapatınca bizim ekranımız görünür. Canlıda o pencere çıkmaz.
>
> Finance kullanıcısı: Kullanıcılar sayfasından manager'ın finance kullanıcısı ekleyip ekleyemediğini dosyadan göreceğim; ekleyemiyorsa test kullanıcısının nasıl açılacağını ayrıca soracağım.
>
> ---
>
> ## 5) Görmem gereken dosyalar
>
> Tek metin dosyasında iletebilmen için bir komut veriyorum. Dosya **proje klasörünün dışına** (Masaüstü) yazılıyor; böylece yanlışlıkla `git add -A` ile repoya girmez. Bu dosyalarda secret olmaması gerekir, yine de göndermeden önce bir göz at.
>
> **Komut 1:** Listelenen dosyaları başlıklarıyla tek bir metin dosyasında birleştirir ve Masaüstü'ne kaydeder. Bulunamayan dosya varsa "YOK" yazar.
> ```
> for f in src/app/layout.tsx src/app/page.tsx 'src/app/(panel)/layout.tsx' 'src/app/(panel)/not-found.tsx' 'src/app/(panel)/YetkiYok.tsx' src/components/ui/BosDurum.tsx src/components/ui/IslemMesaji.tsx src/components/ui/Kart.tsx src/components/ui/SayfaBasligi.tsx src/components/ui/Dugme.tsx src/components/ui/FormAlani.tsx src/lib/islem.ts src/lib/yetki.ts src/lib/auth.ts 'src/app/(panel)/musteriler/page.tsx' 'src/app/(panel)/musteriler/[id]/page.tsx' 'src/app/(panel)/musteriler/MusteriFormu.tsx' 'src/app/(panel)/musteriler/PasifeAlDugmesi.tsx' 'src/app/(panel)/musteriler/actions.ts' 'src/app/(panel)/planlar/page.tsx' 'src/app/(panel)/planlar/PasifeAlDugmesi.tsx' 'src/app/(panel)/abonelikler/page.tsx' 'src/app/(panel)/abonelikler/BaslatFormu.tsx' 'src/app/(panel)/abonelikler/SatirIslemleri.tsx' 'src/app/(panel)/ayarlar/page.tsx' 'src/app/(panel)/ayarlar/CacFormu.tsx' 'src/app/(panel)/ayarlar/actions.ts' 'src/app/(panel)/kullanicilar/page.tsx' 'src/app/(auth)/actions.ts' 'src/app/(auth)/giris/GirisFormu.tsx' 'src/app/(auth)/kayit/KayitFormu.tsx' src/lib/pasife-alma.ts; do echo "=== $f ==="; if [ -f "$f" ]; then cat "$f"; else echo "YOK"; fi; echo; done > ~/Desktop/gun11b_dosyalar.txt
> ```
>
> **Komut 2:** Oluşan dosyanın satır sayısını gösterir (boş olmadığını görmek için).
> ```
> wc -l ~/Desktop/gun11b_dosyalar.txt
> ```
>
> Sonra Masaüstü'ndeki `gun11b_dosyalar.txt`'i buraya ekle. Ayrıca şu iki soruya cevap ver:
> 1. `global-error.tsx` eklensin mi? (Önerim: evet.)
> 2. Yetkisiz erişimde HTTP 200 dönmesini (sayfa içinde `YetkiYok`) kabul ediyor musun, yoksa gerçek 403 için deneysel bir ayar araştırmamı mı istersin?
>
> Onayından sonraki ilk adım: `main`'den `gun11b-bos-hata-ekranlari` dalını açmak. Commit mesajı: `feat: boş durum ve hata ekranları`.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Mevcut dosyaların içeriği:** `not-found.tsx`, `YetkiYok.tsx`, `BosDurum.tsx` ve `IslemMesaji.tsx`'in var olduğunu `find` çıktısından biliyorum, içeriklerini görmedim. Planın "yeni dosya" sayısı onları görünce azalabilir.
> 2. **Kök 404:** `/_not-found` rotasının Next.js'in varsayılan sayfası olduğunu, kök `not-found.tsx` olmadığı için çıkarıyorum. Var olmayan bir adresi açıp bakarsan kesinleşir.
> 3. **`forbidden()`:** Next.js 16.4'te hâlâ deneysel olup olmadığından emin değilim; kullanmayı önermediğim için araştırmadım. Gerçek 403 istersen önce güncel belgeye bakacağım.
> 4. **Genel hata denemesi:** Wi-Fi kapatmanın sunucunun Neon'a ulaşmasını engelleyip hata ekranını tetikleyeceğini varsayıyorum. Next.js önbellekten sayfa gösterirse denemeyi sayfayı yenileyerek (Cmd + R) yaparız; kodda geçici değişiklik yapmamak için başka yol gerekmezse bunu öneririm.
> 5. **Finance test kullanıcısı:** Kullanıcılar sayfasının finance kullanıcısı eklemeye izin verdiğini varsayıyorum; dosyayı görmedim.
> 6. **Kapsam:** `/api/events` (SSE) rotasının 401/403 davranışı bu parçanın kapsamında değil; dokunmayacağım.

### Prompt 20 · 24 Eki 2026 13:14

````text
Planı onaylıyorum.

1) global-error.tsx eklensin.
2) Yetkisiz erişimde sayfa içinde YetkiYok ve HTTP 200 kabul. ADR'ye bilinen sınır olarak yaz. Rol kontrolü sayfada veri çekmeden önce yapılsın.
3) Commit'leri dört küçük parçaya böl: (a) 404, yetkisiz, genel hata, yüklenme ekranları, (b) boş durumlar, (c) form mesajları, (d) ADR. Hepsi gun11b-bos-hata-ekranlari dalında ve tek PR'da.
4) Form mesajları: yalnızca gerçekten tutarsız olan formlara dokun (giriş ve kayıt formları dahil), tutarlı olana dokunma. Hangi dosyanın neden değiştiğini plana yaz.
5) loading.tsx ile notFound() birlikte kullanılınca yanıtın HTTP durumunun 404 mü 200 mü döndüğünü kontrol et. 200 dönüyorsa bunu ADR'de bilinen sınır olarak yaz (kaydın varlığı bu yüzden sızmaz).

Dosyalar ekte. Kod aşamasına bunlara bakarak başla, onayımı almadan kod yazma. Sonunda varsayımlarını listele.
````

_[ek dosya: gun11_dosyalar.txt]_

### Claude cevabı 19 · 24 Eki 2026 13:15

> # Parça B: Kod aşamasına geçmeden önce bir sorun
>
> **Ekteki dosya Parça B için istediğim dosya değil.** Ek, Parça A'nın başında gönderdiğin `gun11_dosyalar.txt` (find çıktısı, ADR Gün 8, şema, `metrikler.ts`, `dashboard-verisi.ts`'in Gün 9 hâli, dashboard sayfası). Parça B için gereken dosyaların hiçbiri içinde yok: `not-found.tsx`, `YetkiYok.tsx`, `BosDurum.tsx`, `IslemMesaji.tsx`, `islem.ts`, liste sayfaları, formlar ve işlemler.
>
> Bu dosyaları görmeden kod yazarsam mevcut yapıyı tahmin etmiş olurum; bu yüzden kod aşamasına başlamıyorum.
>
> **Gönderilecek dosya:** Masaüstü'ndeki `gun11b_dosyalar.txt`. Komut 1'i henüz çalıştırmadıysan:
>
> **Komut 1:** Gerekli dosyaları başlıklarıyla birleştirip Masaüstü'ne yazar (repo dışına).
> ```
> for f in src/app/layout.tsx src/app/page.tsx 'src/app/(panel)/layout.tsx' 'src/app/(panel)/not-found.tsx' 'src/app/(panel)/YetkiYok.tsx' src/components/ui/BosDurum.tsx src/components/ui/IslemMesaji.tsx src/components/ui/Kart.tsx src/components/ui/SayfaBasligi.tsx src/components/ui/Dugme.tsx src/components/ui/FormAlani.tsx src/lib/islem.ts src/lib/yetki.ts src/lib/auth.ts 'src/app/(panel)/musteriler/page.tsx' 'src/app/(panel)/musteriler/[id]/page.tsx' 'src/app/(panel)/musteriler/MusteriFormu.tsx' 'src/app/(panel)/musteriler/PasifeAlDugmesi.tsx' 'src/app/(panel)/musteriler/actions.ts' 'src/app/(panel)/planlar/page.tsx' 'src/app/(panel)/planlar/PasifeAlDugmesi.tsx' 'src/app/(panel)/abonelikler/page.tsx' 'src/app/(panel)/abonelikler/BaslatFormu.tsx' 'src/app/(panel)/abonelikler/SatirIslemleri.tsx' 'src/app/(panel)/ayarlar/page.tsx' 'src/app/(panel)/ayarlar/CacFormu.tsx' 'src/app/(panel)/ayarlar/actions.ts' 'src/app/(panel)/kullanicilar/page.tsx' 'src/app/(auth)/actions.ts' 'src/app/(auth)/giris/GirisFormu.tsx' 'src/app/(auth)/kayit/KayitFormu.tsx' src/lib/pasife-alma.ts; do echo "=== $f ==="; if [ -f "$f" ]; then cat "$f"; else echo "YOK"; fi; echo; done > ~/Desktop/gun11b_dosyalar.txt
> ```
>
> **Komut 2:** Dosyanın dolu olduğunu ve doğru dosya olduğunu gösterir; ilk başlık `=== src/app/layout.tsx ===` olmalı.
> ```
> wc -l ~/Desktop/gun11b_dosyalar.txt && head -1 ~/Desktop/gun11b_dosyalar.txt
> ```
>
> ---
>
> ## Kararlarını plana işledim
>
> | # | Karar | Plandaki karşılığı |
> |---|---|---|
> | 1 | `global-error.tsx` eklenecek | `src/app/global-error.tsx` (yeni, `"use client"`, kendi `<html lang="tr">` ve `<body>`'si, düz Türkçe metin ve "Tekrar dene"). Kök yerleşim çökünce Tailwind ve yazı tipi yüklenmemiş olabileceği için yalnızca satır içi basit stil |
> | 2 | Yetkisiz: sayfa içinde `YetkiYok`, HTTP 200 | Ayarlar ve Kullanıcılar sayfasında sıra: `requireUser()` → rol kontrolü → yetkisizse `YetkiYok` döner ve **hiçbir sorgu çalışmaz** → ancak sonra `getTenantDb()` ve sorgular. Dosyalarda sıra farklıysa düzelteceğim. ADR'ye bilinen sınır |
> | 3 | Dört commit, tek dal, tek PR | Aşağıdaki tablo |
> | 4 | Yalnızca tutarsız formlar | Dosyaları görünce her form için "değişiyor / değişmiyor ve neden" tablosu çıkaracağım; tutarlı olana dokunulmayacak |
> | 5 | `loading.tsx` + `notFound()` durum kodu | Aşağıdaki sınama |
>
> ### Commit bölünmesi (dal: `gun11b-bos-hata-ekranlari`)
>
> | Commit | Mesaj | Dosyalar (dosyaları görünce kesinleşecek) |
> |---|---|---|
> | a | `feat: 404, yetkisiz, hata ve yüklenme ekranları` | Yeni: `src/app/not-found.tsx`, `src/app/global-error.tsx`, `src/app/(panel)/error.tsx`, `src/app/(panel)/loading.tsx`. Gerekirse: `(panel)/not-found.tsx`, `YetkiYok.tsx`, `ayarlar/page.tsx`, `kullanicilar/page.tsx`, `musteriler/[id]/page.tsx` |
> | b | `feat: boş durum ekranları` | Gerekirse: `musteriler/page.tsx`, `planlar/page.tsx`, `abonelikler/page.tsx` (`BosDurum` ile) |
> | c | `fix: tutarsız form mesajları` | Yalnızca tutarsız bulunan formlar ve gerekiyorsa `islem.ts` (`MESAJ`) |
> | d | `docs: ADR Gün 11 Parça B` | `docs/02_ADR.md` (Durum satırı: PR #37, `344b753`; K11.7–K11.11; elle sınama; bilinen sınırlar) |
>
> Her commit'ten önce üç tarama yapılır, her commit'in sonunda aynı iki ek satırı olur. PR başlığı: `feat: boş durum ve hata ekranları`.
>
> ### 5. madde: `loading.tsx` ile `notFound()` durum kodu
>
> Bildiğim kadarıyla Next.js'te bir sayfa akış (streaming) ile gönderilmeye başladıktan sonra durum kodu artık değiştirilemez; `loading.tsx` akışı başlattığı için ardından gelen `notFound()` ekranda 404 sayfasını gösterir ama yanıt **200** döner ve sayfaya arama motorları için "dizinleme" uyarısı eklenir. Bundan emin olmak için tahmin değil ölçüm yapacağız:
>
> | Ne zaman | Adres | Ölçüm |
> |---|---|---|
> | `loading.tsx` eklemeden **önce** (dalın ilk hâli) | `/musteriler/abc`, başka kiracının plan adresi | Chrome geliştirici araçları → Network → ilk satır (belge isteği) → **Status** |
> | `loading.tsx` ekledikten **sonra** | Aynı iki adres | Aynı ölçüm |
> | Her iki durumda | `/olmayan-sayfa` (kök 404) | Aynı ölçüm |
>
> 200 çıkarsa ADR'ye bilinen sınır olarak yazılacak: var olmayan kayıt ile başka kiracının kaydı **aynı** yanıtı (aynı kod, aynı ekran) aldığı için kaydın varlığı sızmaz. İki adresin kodları birbirinden farklı çıkarsa bu bir sızıntıdır ve düzeltmeden ilerlemeyiz.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Ekteki dosya:** Yanlış dosyanın yanlışlıkla eklendiğini varsayıyorum; Komut 1 hiç çalıştırılmadıysa Masaüstü'nde `gun11b_dosyalar.txt` yoktur ve Komut 2 "No such file" der.
> 2. **Akış ve durum kodu:** 200 dönmesi beklentim Next.js'in genel akış davranışına dayanıyor; 16.4.2 sürümünde farklı olabilir. Kesin sonucu ölçüm verecek, ADR'ye ölçüm yazılacak.
> 3. **`global-error.tsx` görünümü:** Kök yerleşim çöktüğünde genel stillerin yüklenmeyebileceğini varsayıyorum; bu yüzden o dosyada Tailwind sınıflarına güvenmeyeceğim.
> 4. **Rol kontrolü sırası:** Ayarlar ve Kullanıcılar sayfalarının bugün rolü sorgulardan önce mi sonra mı kontrol ettiğini bilmiyorum; dosyaları görünce netleşecek.

### Prompt 21 · 24 Eki 2026 13:18

````text
Doğru dosya ekte (gun11b_dosyalar.txt). Kod aşamasına bunlara bakarak başla, önce planı güncelle.
````

_[ek dosya: gun11b_dosyalar.txt]_

### Claude cevabı 20 · 24 Eki 2026 13:20

> # Gün 11 • Parça B: Güncellenmiş plan (dosyalara göre)
>
> Dosyaları okudum. **Hiçbir dosyayı değiştirmiyorum.** Beklediğimden çok daha fazlası zaten yerinde; Parça B büyük ölçüde eksik dört dosyayı eklemek ve birkaç tutarsızlığı düzeltmek.
>
> ---
>
> ## 1) Dosyalara göre durum
>
> | Konu | Durum | Karar |
> |---|---|---|
> | Panel 404 (`(panel)/not-found.tsx`) | `BosDurum` ile "Kayıt bulunamadı", Dashboard'a bağlantı var | Yalnızca bağlantı metnindeki eksik boşluk ("←Dashboard'a dön" → "← Dashboard'a dön", diğer sayfalardaki gibi) |
> | Başka kiracı / geçersiz kimlik | `musteriler/[id]` ve `planlar/[id]` ikisi de `notFound()` çağırıyor, aynı cevap | **Değişmez** |
> | Kök 404 | Yok (varsayılan İngilizce sayfa) | **Yeni:** `src/app/not-found.tsx` |
> | Yetkisiz | `YetkiYok` var; Ayarlar ve Kullanıcılar `requireManager()`'ı **sorgulardan önce** çağırıyor, finance'te `getTenantDb()` hiç çalışmıyor | Sayfalar **değişmez**. `YetkiYok`'a "Bir değişiklik gerekiyorsa firma yöneticinize başvurun." cümlesi ve 404 sayfasıyla aynı "← Dashboard'a dön" bağlantısı |
> | Genel hata | Yok | **Yeni:** `src/app/(panel)/error.tsx` ve `src/app/global-error.tsx` |
> | Yüklenme | Yok | **Yeni:** `src/app/(panel)/loading.tsx` |
> | Boş durumlar | Müşteriler, Planlar, Abonelikler, Dashboard'da `BosDurum` var; Abonelik formu müşteri/plan yoksa yönlendiriyor | Yalnızca yanıltıcı başlıklar (aşağıda) |
> | Panel formları | Hepsi `IslemMesaji` + `MESAJ` + `noValidate` + bekleme metni | Yalnızca `BaslatFormu` (aşağıda) |
> | Giriş ve kayıt formları | Kendi mesaj türü ve kutusu, tarayıcı doğrulaması açık, hatada e-posta silinir | Panel formlarıyla aynı yapıya (aşağıda) |
>
> **Ek bulgu (karar senin):** `src/app/layout.tsx`'te `lang="en"` ve sekme başlığı `"Create Next App"` duruyor. Ekran görüntülerindeki "Crea…" sekme başlıkları buradan geliyor. `lang="en"` olduğu için ekran okuyucular Türkçe metni İngilizce telaffuzla okur. Önerim: `lang="tr"`, başlık "AboneTakip", açıklama Türkçe. Yeni özellik değil, Türkçe ve erişilebilirlik tutarlılığı; 404 ve hata ekranları da bu yerleşimin içinde görünüyor.
>
> ---
>
> ## 2) Form mesajları: dosya dosya
>
> | Dosya | Değişiyor mu? | Neden |
> |---|---|---|
> | `MusteriFormu.tsx` | Hayır | `IslemMesaji`, alan hataları, `noValidate`, değer koruma, bekleme metni: tutarlı |
> | `PlanFormu.tsx` | Hayır | Aynı; seçim kutusunun hatası `role="alert"` ve `aria-describedby` ile bağlı |
> | `CacFormu.tsx` | Hayır | Tutarlı |
> | `musteriler/PasifeAlDugmesi.tsx`, `planlar/PasifeAlDugmesi.tsx` | Hayır | Tutarlı (onay sorusu, "İşleniyor...", `IslemMesaji`) |
> | `SatirIslemleri.tsx` | Hayır | Tutarlı |
> | `abonelikler/BaslatFormu.tsx` | **Evet** | Seçim kutularının hata metni `role="alert"` taşımıyor ve kutuya `aria-describedby` ile bağlı değil; ekran okuyucu hatayı duyurmuyor. `PlanFormu`'ndaki seçim kutusuyla aynı yapıya getirilecek (kimlikli hata, `role="alert"`, hatada kırmızı odak çerçevesi). Metinler değişmez |
> | `(auth)/actions.ts` | **Evet** | Kendi `{ hata }` türünü kullanıyor; `islem.ts`'teki ortak `FormDurumu`'na geçecek (`durum: "hata"`, `mesaj`, `degerler`). Hata durumunda yalnızca e-posta, firma adı ve ad soyad geri döner; **parola asla dönmez**. Mesaj metinleri (`auth.ts`, `validation.ts`) değişmez |
> | `giris/GirisFormu.tsx` | **Evet** | Kendi hata kutusu yerine `IslemMesaji`; `noValidate` (bugün `required`/`type="email"` yüzünden tarayıcının kendi, dili tarayıcıya bağlı uyarıları çıkıyor ve sunucunun Türkçe mesajı görünmüyor); hatadan sonra e-posta alanı dolu kalır (bugün React form sıfırlaması yüzünden siliniyor) |
> | `kayit/KayitFormu.tsx` | **Evet** | Giriş formuyla aynı üç neden; parola alanı hatadan sonra bilerek boş kalır |
> | `components/ui/IslemMesaji.tsx` | **Senin kararın** | Bütün formlar zaten bunu kullandığı için tutarlı. Ancak başarı/hata yalnızca renkle ayrılıyor; dashboard'daki gibi `aria-hidden` bir simge (✓ / !) eklemek renk kuralını tamamlar. Tek dosya, bütün formları aynı anda etkiler |
>
> `islem.ts`'e yeni mesaj eklenmiyor.
>
> ## 3) Boş durumlar: dosya dosya
>
> | Dosya | Değişiklik | Neden |
> |---|---|---|
> | `musteriler/page.tsx` | Varsayılan görünümde başlık "Henüz müşteri yok" → **"Aktif müşteri yok"**, açıklamaya "Pasif müşterileri görmek için 'Pasifleri göster'e tıklayın." | Bütün müşterileri pasif olan firmada "Henüz müşteri yok" yanlış bilgi veriyor. Ek sorgu yok |
> | `planlar/page.tsx` | Aynı düzeltme ("Aktif plan yok") | Aynı neden |
> | `abonelikler/page.tsx` | Filtre seçiliyken başlık "Henüz abonelik yok" → **"Bu filtrede abonelik yok"** | Filtrede eşleşme olmaması "hiç abonelik yok" demek değil |
> | Dashboard, Kullanıcılar, `BaslatFormu`'nun yönlendirmesi | Hayır | Doğru ve tutarlı |
>
> Dokunmadığım ama gördüğüm küçük tekrar: `planlar/page.tsx`'teki `tlBicimle` ve `abonelikler/page.tsx`'teki `toLocaleString`, `bicim.tlMetni` ile aynı işi yapıyor. Kapsam dışı; ADR'ye "Parça B sonrası" notu olarak yazılır.
>
> ## 4) Yeni dosyaların tasarımı
>
> | Dosya | İçerik |
> |---|---|
> | `src/app/not-found.tsx` | Oturum ve veri yok. `BosDurum` ile "Sayfa bulunamadı", "Adres hatalı olabilir." ve ana sayfaya bağlantı (ana sayfa zaten giriş durumuna göre yönlendiriyor) |
> | `src/app/(panel)/error.tsx` | `"use client"`. Sol menü yerinde kalır. "Bir şeyler ters gitti", "İşlem tamamlanamadı. Lütfen tekrar deneyin." (`MESAJ.beklenmeyen` ile aynı dil), **Tekrar dene** düğmesi (`Dugme`), varsa kısa hata kodu "Destek için kod: …". Hata mesajı ve yığın izi yazılmaz |
> | `src/app/global-error.tsx` | `"use client"`, kendi `<html lang="tr">` ve `<body>`'si. Kök yerleşim çöktüğü için Tailwind'e güvenilmez; birkaç satır içi stil. Aynı metin ve **Tekrar dene** |
> | `src/app/(panel)/loading.tsx` | Sayfa başlığı ve iki kart iskeleti, `role="status"`, ekran okuyucu için "Yükleniyor…", `motion-reduce:animate-none` |
>
> ## 5) `loading.tsx` ile 404 durum kodu: ölçüm planı
>
> Beklentim: `loading.tsx` eklenince sayfa akışla gönderilir ve ardından gelen `notFound()` ekranda 404'ü gösterir ama yanıt **200** döner. Ölçeceğiz:
>
> | Adım | Ne zaman | Adresler | Beklenen |
> |---|---|---|---|
> | Ölçüm 1 | Dal açıldıktan hemen sonra, **hiç kod değişmeden** | `/musteriler/abc`, başka kiracının plan adresi, `/olmayan-sayfa` | 404, 404, 404 (sonuncusu İngilizce sayfa) |
> | Ölçüm 2 | `loading.tsx` eklendikten sonra | Aynı üç adres | Muhtemelen 200, 200, 404 |
>
> Ölçüm: Chrome'da Cmd + Option + I → **Network** → sayfayı yenile (Cmd + R) → listedeki **ilk satırın** (belge isteği) **Status** sütunu.
>
> Değerlendirme: Var olmayan kayıt ile başka kiracının kaydı **aynı** kodu ve aynı ekranı almalı; öyleyse kaydın varlığı sızmaz ve 200 ADR'ye bilinen sınır olarak yazılır. İkisi farklı çıkarsa durur, düzeltmeden ilerlemeyiz. 200'ü kabul etmek istemezsen alternatif: `loading.tsx`'i panel geneli yerine yalnızca Dashboard ve Abonelikler klasörlerine koymak (Müşteriler ve Planlar klasöründeki `loading.tsx` detay sayfalarını da kapsadığı için oraya konmaz).
>
> ## 6) Commit planı (dal `gun11b-bos-hata-ekranlari`, tek PR)
>
> | Commit | Mesaj | Dosyalar |
> |---|---|---|
> | a | `feat: 404, yetkisiz, hata ve yüklenme ekranları` | Yeni: `src/app/not-found.tsx`, `src/app/global-error.tsx`, `src/app/(panel)/error.tsx`, `src/app/(panel)/loading.tsx`. Değişen: `(panel)/not-found.tsx`, `YetkiYok.tsx`, onaylarsan `src/app/layout.tsx` |
> | b | `feat: boş durum ekranları` | `musteriler/page.tsx`, `planlar/page.tsx`, `abonelikler/page.tsx` |
> | c | `fix: tutarsız form mesajları` | `(auth)/actions.ts`, `GirisFormu.tsx`, `KayitFormu.tsx`, `BaslatFormu.tsx`, onaylarsan `IslemMesaji.tsx` |
> | d | `docs: ADR Gün 11 Parça B` | `docs/02_ADR.md` |
>
> Her commit'ten önce lint, `npm test`, gerekiyorsa `npm run build`, `git add` ve üç tarama; her commit'in sonunda aynı iki ek satır. PR başlığı: `feat: boş durum ve hata ekranları`.
>
> ## 7) ADR planı
>
> Gün 11 bölümünde:
> - **Durum:** "Parça A birleşti: PR #37, squash commit `344b753`, canlıda doğrulandı. Parça B: dal `gun11b-bos-hata-ekranlari`, dört commit."
> - **Yeni kararlar:** K11.7 (404: kök ve panel ayrımı, başka kiracı = bulunamadı), K11.8 (yetkisiz: sayfa içinde `YetkiYok`, rol kontrolü sorgulardan önce, HTTP 200), K11.9 (genel hata ve `global-error`, ayrıntı gösterilmez), K11.10 (panel için tek `loading.tsx` ve ölçülen durum kodu), K11.11 (boş durum başlıkları ve form mesajlarında tek kaynak; değişen ve değişmeyen formlar), onaylarsan K11.12 (kök yerleşimde `lang="tr"` ve başlık).
> - **Bilinen sınırlar:** Yetkisiz sayfada HTTP 200; ölçüme göre `loading.tsx` ile 404 yerine 200; tekrar eden TL biçimleme fonksiyonları.
>
> ## 8) Sınama listesi
>
> | # | Durum | Beklenen |
> |---|---|---|
> | 1 | Boş hesap (`gun11-bos@example.com`) | Dashboard, Müşteriler, Planlar, Abonelikler boş durumları; Abonelikler'de "önce bir müşteri ve bir plan ekleyin" |
> | 2 | Yalnızca bir müşteri eklenmiş | Abonelikler "önce bir plan ekleyin" |
> | 3 | Tek müşteri pasife alınmış | Müşteriler varsayılan görünümde "Aktif müşteri yok" ve "Pasifleri göster" ipucu |
> | 4 | `/olmayan-sayfa` | Türkçe kök 404 (ölçüm: 404) |
> | 5 | `/musteriler/abc` ve başka kiracının plan adresi | Aynı "Kayıt bulunamadı" ekranı, aynı durum kodu |
> | 6 | finance → `/ayarlar`, `/kullanicilar` | `YetkiYok`, CAC değeri hiçbir yerde görünmez |
> | 7 | Yavaş yüklenme ("Slow 4G") | Sol menü yerinde, "Yükleniyor…" iskeleti |
> | 8 | Wi-Fi kapalıyken sayfa geçişi | Türkçe hata ekranı, ayrıntı yok, Wi-Fi açınca **Tekrar dene** çalışır |
> | 9 | Giriş: yanlış parola | Türkçe mesaj `IslemMesaji` görünümünde, e-posta alanı dolu, parola boş |
> | 10 | Kayıt: 5 karakterli parola, bozuk e-posta | Tarayıcı balonu değil, sunucunun Türkçe mesajı; firma adı, ad soyad ve e-posta korunur |
> | 11 | Abonelik başlat: seçim yapmadan gönder | Alan hataları ekran okuyucuda duyurulur (VoiceOver: Cmd + F5 ile açıp kapatılır) |
> | 12 | Diğer formlar | Değişmeden çalışır (her birinde bir başarılı gönderim) |
>
> **Finance kullanıcısı (6. madde):** Kullanıcılar sayfası henüz yer tutucu; finance kullanıcısı arayüzden eklenemiyor. Bu denemenin nasıl yapılacağını bilmiyorum: test dalında daha önce açılmış bir finance kullanıcısı var mı, yoksa Gün 6 testlerindeki gibi yalnızca otomatik testle mi doğrulandı? Tahmin etmeyeceğim; senin cevabına göre ya elle deneriz ya da ADR'ye "otomatik testle doğrulandı, elle denenemedi" yazarız. Yeni bir betik açmayı ancak sen istersen planlarım.
>
> ---
>
> ## Onayından önce cevaplaman gerekenler
>
> 1. **Kök yerleşim:** `lang="tr"`, başlık "AboneTakip" ve Türkçe açıklama commit (a)'ya eklensin mi? (Önerim: evet.)
> 2. **`IslemMesaji` simgesi:** Başarı/hata kutusuna `aria-hidden` ✓ / ! eklensin mi? (Önerim: evet; tek dosya, bütün formlar aynı anda tutarlı kalır.)
> 3. **Finance denemesi:** Test dalında finance kullanıcısı var mı, yoksa nasıl denemeliyiz?
> 4. **Ölçüm 2'de 200 çıkarsa:** Kabul edip ADR'ye mi yazalım, yoksa `loading.tsx`'i Dashboard ve Abonelikler ile mi sınırlayalım?
>
> Onayından sonraki ilk adım: dalı açmak ve **hiç kod değiştirmeden Ölçüm 1**.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **`error.tsx` özellikleri:** Next.js'in hata sayfasına `error` ve `reset` verdiğini varsayıyorum; 16.4.2'de bir değişiklik varsa `npm run build`'in tür denetimi gösterir, o zaman düzeltirim.
> 2. **Form sıfırlanması:** React 19'da `useActionState` ile gönderilen formun, değeri `defaultValue` ile bağlanmamış alanları sıfırladığını varsayıyorum; giriş formunda e-postanın hatadan sonra silindiğini sen de görebilirsin (sınama 9'dan önce).
> 3. **Auth testleri:** `(auth)/actions.ts`'in dönüş türünü değiştirmenin hiçbir testi bozmadığını varsayıyorum (`kurallar.test.ts` ve `duman.test.ts`'i görmedim); `npm test` ve `npm run test:db` bunu gösterecek.
> 4. **Durum kodu beklentisi:** 200 beklentim Next.js'in genel akış davranışına dayanıyor; ADR'ye yalnızca ölçülen sonuç yazılacak.
> 5. **Geist yazı tipi:** Kök yerleşimde yalnızca `latin` alt kümesi yükleniyor; Türkçe harfler ekranlarda düzgün göründüğü için dokunmuyorum.

### Prompt 22 · 24 Eki 2026 13:21

````text
Planı onaylıyorum. Cevaplarım:
1) Kök yerleşimde lang="tr", başlık "AboneTakip" ve Türkçe açıklama: evet, commit (a)'ya.
2) IslemMesaji'na aria-hidden ✓ / ! simgesi: evet.
3) Finance denemesi: test dalında A ve B firmalarının finance kullanıcıları var (example.com adresli). Elle denerim, parola sormana gerek yok, ben giriş yapacağım.
4) Ölçüm 2'de 200 çıkarsa kabul et, ADR'ye bilinen sınır olarak yaz. Önemli olan var olmayan kayıt ile başka kiracının kaydının aynı kodu ve ekranı alması. Farklı çıkarsa dur.

Ek istekler:
- Commit (c)'yi ikiye böl: (c1) BaslatFormu ve IslemMesaji, (c2) giriş ve kayıt (auth/actions.ts, GirisFormu, KayitFormu). Toplam beş commit, tek PR.
- Ölçüm 2'ye şunu ekle: oturum açmamışken /dashboard adresi hâlâ giriş sayfasına yönleniyor mu, durum kodu ne.
- Giriş ve kayıt akışı için elle sınamaya şunları ekle: başarılı giriş, çıkış, yanlış parola, başarılı yeni firma kaydı ve manager ile finance rolünün doğru sayfaya düşmesi.

Dalı aç ve hiç kod değiştirmeden Ölçüm 1'i yaptır. Her adımda tek komut ver, dosyaları touch ile boş açtır, ben onaylamadan kod yazma. Sonunda varsayımlarını listele.
````

### Claude cevabı 21 · 24 Eki 2026 13:21

> # Adım 1: Dal açmak ve Ölçüm 1 (kod değişmeden)
>
> Kararlarını plana işledim: kök yerleşim ve `IslemMesaji` simgesi onaylandı, finance denemesini sen yapacaksın, 200 çıkarsa bilinen sınır olarak yazılacak (iki adres farklı çıkarsa dururuz). Commit'ler artık beş: **a**, **b**, **c1** (`BaslatFormu`, `IslemMesaji`), **c2** (giriş ve kayıt), **d** (ADR).
>
> Bu adımda **hiçbir dosya değişmiyor.**
>
> ---
>
> ## 1a) Dalı aç
>
> **Komut 1:** Kaydedilmemiş değişiklik olup olmadığını gösterir; "nothing to commit, working tree clean" görmelisin.
> ```
> git status
> ```
>
> **Komut 2:** `main` dalına geçer.
> ```
> git switch main
> ```
>
> **Komut 3:** GitHub'daki son hâli indirir (PR #37 dahil).
> ```
> git pull
> ```
>
> **Komut 4:** Son commit'in Parça A olduğunu doğrular; `344b753` ile başlayan satır görünmeli.
> ```
> git --no-pager log -1 --oneline
> ```
>
> **Komut 5:** Parça B dalını açar ve ona geçer.
> ```
> git switch -c gun11b-bos-hata-ekranlari
> ```
>
> ## 1b) Yerel sunucuyu temiz başlat
>
> `npm run dev:test` açıksa, çalıştığı Terminal sekmesinde **Control + C** ile durdur, sonra:
>
> **Komut 6:** Uygulamayı test dalının veritabanıyla açar (canlı koruması ile). Bu sekme açık kalsın.
> ```
> npm run dev:test
> ```
>
> ## 1c) Chrome'u ölçüme hazırla
>
> 1. Chrome'da `localhost:3000` sekmesinde **Cmd + Option + I** ile geliştirici araçlarını aç, **Network** sekmesine geç.
> 2. Üstteki **Preserve log** kutusunu işaretle (yönlendirmeler listeden silinmesin).
> 3. Filtre çubuğunda **Doc**'u seç (yalnızca sayfa istekleri görünsün).
> 4. Her ölçümden önce listeyi temizlemek için 🚫 simgesine tıkla, sonra adresi yaz ve Enter'a bas.
> 5. Bakacağın yer: listedeki **ilk satırın Status** sütunu.
>
> ## 1d) Ölçüm 1
>
> **Hazırlık (başka kiracının kimliği):** `gun11-gecmis@example.com` (bebek firması) ile giriş yap → **Planlar** → herhangi bir planda **Düzenle** → adres çubuğundaki adresi kopyala (ör. `localhost:3000/planlar/…`), bir yere not et. Bu adres "başka kiracının kaydı" olacak. Sonra **Çıkış yap**.
>
> | # | Oturum | Adres | Ekranda ne var? | Status |
> |---|---|---|---|---|
> | 1 | Kapalı | `localhost:3000/dashboard` | | ilk satır: …, ikinci satır: … |
> | 2 | `gun11-kilit@example.com` (deneme 11 ltd.) | `localhost:3000/musteriler/abc` | | |
> | 3 | Aynı | Hazırlıkta kopyaladığın **bebek** firmasının plan adresi | | |
> | 4 | Aynı | `localhost:3000/olmayan-sayfa` | | |
>
> Beklentim (kod değişmeden):
> - **1:** İlk satır `dashboard` **307** (yönlendirme), ikinci satır `giris` **200**; ekranda giriş sayfası.
> - **2 ve 3:** İkisi de **404** ve aynı "Kayıt bulunamadı" ekranı. **3'te planın adı ya da fiyatı görünmemeli.**
> - **4:** **404** ve Next.js'in İngilizce "This page could not be found" sayfası.
>
> Tabloyu doldurup gönder; Status değerlerinin olduğu bir ekran görüntüsü de yeterli. 2 ile 3 farklı çıkarsa (kod ya da ekran) dururuz, kod aşamasına geçmeyiz.
>
> Ölçüm 1 temizse sıradaki adım **commit (a)**: önce dört yeni dosyayı `touch` ile açtıracağım, kodu onayına sunacağım.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Yönlendirme kodu:** Oturum kapalıyken `/dashboard`'un `redirect()` ile **307** döndüreceğini varsayıyorum; Next.js bazı durumlarda 303 ya da 308 da kullanabilir. Hangisi çıkarsa ADR'ye o yazılır; önemli olan Ölçüm 2'de aynı kalması.
> 2. **Başka kiracının adresi:** `gun11-gecmis` ve `gun11-kilit` firmalarının farklı kiracılar olduğunu (ayrı kayıtlarla açıldıkları için) varsayıyorum.
> 3. **Geliştirme modu:** Ölçümü `npm run dev:test` ile yapıyoruz; durum kodlarının canlıdaki derlenmiş sürümle aynı olduğunu varsayıyorum. Fark şüphesi doğarsa birleştirmeden sonra canlıda yalnızca 1. ve 4. satırı tekrar ölçeriz (2 ve 3 canlı veride kayıt kimliği gerektirdiği için tekrarlanmaz).
> 4. **Ekran içeriği:** 3. satırda sayfa başlığında (sekme adında) planın adı görünmemeli. Kök yerleşim başlığı henüz "Create Next App" olduğu için sekmede bu yazacak; bu beklenen durum.

### Prompt 23 · 24 Eki 2026 13:24

````text
sürekli yenileniyor
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 22 · 24 Eki 2026 13:24

> Bu durum ölçümü engelliyor; önce nedenini bulalım. **Kodu henüz değiştirmedik** (dal `main` ile aynı ve canlıda çalışıyor), bu yüzden döngünün kaynağı büyük olasılıkla ortam: eski bir sunucu süreci, eski bir sekme ya da yeniden başlatma sonrası tarayıcının kendini yenilemesi. Terminaldeki istekler yalnızca okuma (`GET`), veritabanına bir şey yazılmıyor; acele gerektiren bir risk yok.
>
> Tahmin yürütmek yerine sırayla daraltalım. Her adımın sonucunu kısaca yaz.
>
> ## Adım 1: Döngüyü durdur
>
> `npm run dev:test`'in çalıştığı Terminal sekmesinde **Control + C**.
>
> Chrome sekmesindeki yükleniyor işareti (adres çubuğundaki ✕) birkaç saniye içinde duruyor mu?
>
> ## Adım 2: 3000 numaralı kapıda başka sunucu kalmış mı?
>
> **Komut 1:** 3000 numaralı kapıyı dinleyen süreçleri listeler. Sunucuyu durdurduğun için çıktı **boş** olmalı.
> ```
> lsof -nP -iTCP:3000 -sTCP:LISTEN
> ```
>
> Çıktıda `node` ile başlayan bir satır görünürse **hiçbir şeyi kapatmadan** satırı bana gönder; eski bir sunucu açık kalmış demektir, onu birlikte kapatırız.
>
> ## Adım 3: Çalışma klasörü temiz mi?
>
> **Komut 2:** Değişen dosya olup olmadığını gösterir; "nothing to commit, working tree clean" görmelisin.
> ```
> git status
> ```
>
> ## Adım 4: Tek sekmeyle yeniden başlat
>
> 1. Chrome'da `localhost:3000` açık olan **bütün** sekmeleri kapat (sekmelerin arasında başka bir uygulama sekmesi daha olabilir, ör. eski bir Abonelikler sayfası).
> 2. **Komut 3:** Uygulamayı test dalında yeniden açar.
>    ```
>    npm run dev:test
>    ```
> 3. Terminalde "Ready" yazısını gördükten sonra **tek** yeni sekmede `localhost:3000/giris` aç ve 10 saniye bekle.
>
> Sayfa sabit kalıyorsa sorun eski sekme ya da eski süreçti; Ölçüm 1'e geçeriz.
>
> ## Adım 5 (yalnızca hâlâ dönüyorsa)
>
> 1. Geliştirici araçlarında **Console** sekmesinin ekran görüntüsünü gönder ("Fast Refresh", "full reload" ya da kırmızı hata satırları arıyorum).
> 2. **Komut 4:** Sunucunun başlangıç satırlarını görmek için, `dev:test` sekmesinde Control + C ile durdurup yeniden başlatınca ekrana gelen **ilk 10–15 satırı** gönder. Özellikle "Local:" satırındaki kapı numarasına (3000 mü 3001 mi) ve "Port 3000 is in use" gibi bir uyarıya bakacağım.
>
> Bu çıktılarda ortam dosyası adresi görünmez, ama yine de göndermeden önce bir göz at.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Döngünün kaynağı:** Kod değişmediği ve aynı kod canlıda düzgün çalıştığı için ortamdan kaynaklandığını varsayıyorum. En olası iki neden: Control + C ile durmamış eski bir sunucu, ya da oturumu kapalı başka bir sekmedeki canlı uyarı dinleyicisinin (`/api/events`) yeniden bağlanırken sayfayı yenilemesi. Günlükte `/abonelikler` ve `/api/events` isteklerinin araya karışması ikinci olasılığı destekliyor, ama `UyariDinleyici.tsx`'i görmediğim için kesin söyleyemem.
> 2. **Kalıcı bir hata çıkarsa:** Adım 4'ten sonra da dönüyorsa `src/app/(panel)/UyariDinleyici.tsx` ve `src/app/(auth)/giris/page.tsx` dosyalarını isteyeceğim; bu Parça B'nin konusu değil, ayrı bir hata olarak ele alınır ve ADR'ye yazılır.
> 3. **Güvenlik:** Döngü sırasında yalnızca sayfa okuma istekleri görünüyor; test dalında veri değişmediğini varsayıyorum.

### Prompt 24 · 24 Eki 2026 13:25

````text
şuan durdu ama hep çalışıyordu demin
````

### Claude cevabı 23 · 24 Eki 2026 13:25

> Güzel. "Demin hep çalışıyordu" demen önemli: kod değişmediği için bu bir kod hatası değil, büyük olasılıkla **sunucu yeniden başlatılırken açık kalan eski sekmelerin** kendini sürekli yenilemesiydi (Next.js'in geliştirme modu, sunucu yeniden başlayınca açık sekmeleri yeniler; oturumu kapalı bir panel sekmesi de canlı uyarı bağlantısını yeniden kurmaya çalışır). Ölçüme temiz başlamak için kısa bir kontrol yapalım.
>
> ## Temiz başlangıç
>
> Sunucu şu an çalışıyorsa önce **Control + C** ile durdur.
>
> **Komut 1:** 3000 numaralı kapıda kalmış süreç var mı gösterir; çıktı **boş** olmalı.
> ```
> lsof -nP -iTCP:3000 -sTCP:LISTEN
> ```
>
> **Komut 2:** Çalışma klasörünün temiz olduğunu gösterir; "nothing to commit, working tree clean" görmelisin.
> ```
> git status
> ```
>
> Chrome'da `localhost:3000` açık olan **bütün** sekmeleri kapat.
>
> **Komut 3:** Uygulamayı test dalında açar; "Ready" yazısını bekle.
> ```
> npm run dev:test
> ```
>
> Tek yeni sekmede `localhost:3000/giris` aç, 10 saniye bekle. Sayfa sabit kalıyorsa Ölçüm 1'e geç. Yeniden dönmeye başlarsa hiçbir şeye dokunmadan bir önceki mesajdaki Adım 5'i (Console ekran görüntüsü ve sunucunun ilk satırları) gönder.
>
> ## Ölçüm 1 (hatırlatma)
>
> Geliştirici araçları (Cmd + Option + I) → **Network** → **Preserve log** işaretli, filtre **Doc**; her ölçümden önce 🚫 ile temizle, ilk satırın **Status** değerine bak.
>
> **Hazırlık:** `gun11-gecmis@example.com` ile giriş yap → Planlar → bir planda **Düzenle** → adres çubuğundaki adresi not et → **Çıkış yap**.
>
> | # | Oturum | Adres | Ekranda ne var? | Status |
> |---|---|---|---|---|
> | 1 | Kapalı | `localhost:3000/dashboard` | | ilk satır: …, ikinci satır: … |
> | 2 | `gun11-kilit@example.com` | `localhost:3000/musteriler/abc` | | |
> | 3 | Aynı | Not ettiğin **bebek** firmasının plan adresi | | |
> | 4 | Aynı | `localhost:3000/olmayan-sayfa` | | |
>
> Beklentim: 1 → `307` sonra `200` (giriş sayfası); 2 ve 3 → ikisi de `404`, aynı "Kayıt bulunamadı" ekranı, 3'te planın adı veya fiyatı görünmez; 4 → `404`, İngilizce varsayılan sayfa.
>
> Doldurulmuş tabloyu ya da Status sütununun göründüğü ekran görüntülerini gönder.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Döngünün nedeni:** Eski sekmelerin yeniden başlatma sonrası kendini yenilemesi olduğunu varsayıyorum; kanıtım yalnızca kodun değişmemiş olması ve döngünün sunucu durunca kesilmesi. Tek sekmeyle tekrar dönerse bu varsayım yanlıştır ve ayrı bir hata olarak inceleriz.
> 2. **Ölçümler arasında oturum değiştirme:** "Çıkış yap" ve yeni girişte sunucu yeniden başlamadığı için döngünün tekrarlanmayacağını varsayıyorum. Ölçüm sırasında sunucuyu yeniden başlatman gerekirse önce panel sekmelerini kapat.

### Prompt 25 · 24 Eki 2026 13:26

````text
sabit şuan
````

### Claude cevabı 24 · 24 Eki 2026 13:26

> Sayfa sabit; ortam temiz. Döngünün kaynağı eski sekmelermiş, ADR'ye "sunucu yeniden başlatılırken açık panel sekmeleri kendini yenileyebilir, önce sekmeleri kapatın" diye kısa bir geliştirme notu olarak yazarız.
>
> Şimdi **Ölçüm 1**. Kod hâlâ değişmedi.
>
> ## Hazırlık
>
> 1. Geliştirici araçlarını aç: **Cmd + Option + I** → **Network** sekmesi.
> 2. **Preserve log** kutusunu işaretle, filtre çubuğunda **Doc**'u seç.
> 3. `gun11-gecmis@example.com` ile giriş yap → **Planlar** → herhangi bir planda **Düzenle** → adres çubuğundaki adresi bir yere not et (ör. Notlar uygulaması) → **Çıkış yap**.
>
> ## Ölçümler
>
> Her satırdan önce 🚫 simgesiyle listeyi temizle, adresi adres çubuğuna yaz, Enter'a bas ve listedeki **ilk satırın Status** değerine bak.
>
> | # | Oturum | Adres | Ekranda ne var? | Status |
> |---|---|---|---|---|
> | 1 | Kapalı (çıkış yaptın) | `localhost:3000/dashboard` | | ilk satır: …, ikinci satır: … |
> | 2 | `gun11-kilit@example.com` ile giriş yap | `localhost:3000/musteriler/abc` | | |
> | 3 | Aynı | Not ettiğin **bebek** firmasının plan adresi | | |
> | 4 | Aynı | `localhost:3000/olmayan-sayfa` | | |
>
> **Beklentim:**
> - **1:** `dashboard` → **307**, ardından `giris` → **200**; ekranda giriş sayfası.
> - **2 ve 3:** İkisi de **404** ve aynı "Kayıt bulunamadı" ekranı. **3'te bebek firmasının plan adı veya fiyatı hiçbir yerde görünmemeli.**
> - **4:** **404**; Next.js'in İngilizce "This page could not be found" sayfası (Türkçesini commit (a)'da ekleyeceğiz).
>
> Tabloyu doldurup ya da Status sütununun göründüğü dört ekran görüntüsünü gönder. **2 ile 3 farklı çıkarsa** (kod ya da ekran) dururuz.
>
> Ölçüm 1 temizse sıradaki adım **commit (a)**: dört yeni dosyayı `touch` ile açtıracağım ve kodu onayına sunacağım.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Yönlendirme kodu:** 1. satırda 307 bekliyorum; Next.js 303 ya da 308 de verebilir. Hangisi çıkarsa ADR'ye o yazılır, Ölçüm 2'de aynı kalması yeterli.
> 2. **Döngü notu:** Döngünün yalnızca eski sekmelerden kaynaklandığını varsayıyorum; ölçüm sırasında tekrar ederse durup inceleriz.

### Prompt 26 · 24 Eki 2026 13:28

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 25 · 24 Eki 2026 13:28

> Geliştirici araçları açık, ama listede **0 / 22** istek görünüyor çünkü filtre kutusunda önceden kalmış **"event"** yazısı var. Üç küçük ayar yeter:
>
> 1. Filtre kutusundaki **"event"** yazısını sil (kutunun sağındaki ⓧ simgesine tıkla).
> 2. **Keep log** kutusunu işaretle (bu sürümde "Preserve log"un adı bu).
> 3. Alt satırdaki türlerden **Doc**'a tıkla (şu an "All" seçili).
>
> Üstteki "DevTools is now available in Turkish" uyarısını **Don't show again** ile kapatabilirsin; ölçümü etkilemez.
>
> Sonra aynı sayfayı **Cmd + R** ile yenile: listede `giris` satırı ve **Status 200** görmelisin. Bu, ayarların doğru olduğunu gösterir.
>
> ## Ölçüm 1
>
> Her satırdan önce listeyi 🚫 (Clear) ile temizle, adresi yaz, Enter'a bas, **ilk satırın Status** değerine bak.
>
> **Hazırlık:** `gun11-gecmis@example.com` ile giriş yap → Planlar → bir planda **Düzenle** → adresi not et → **Çıkış yap**.
>
> | # | Oturum | Adres | Ekranda ne var? | Status |
> |---|---|---|---|---|
> | 1 | Kapalı | `localhost:3000/dashboard` | | ilk satır: …, ikinci satır: … |
> | 2 | `gun11-kilit@example.com` | `localhost:3000/musteriler/abc` | | |
> | 3 | Aynı | Not ettiğin **bebek** firmasının plan adresi | | |
> | 4 | Aynı | `localhost:3000/olmayan-sayfa` | | |
>
> Beklentim: 1 → `307` ardından `200` (giriş sayfası); 2 ve 3 → ikisi de `404` ve aynı "Kayıt bulunamadı" ekranı, 3'te planın adı veya fiyatı görünmez; 4 → `404`, İngilizce varsayılan sayfa.
>
> Dört satırın sonucunu ya da Status sütununun göründüğü ekran görüntülerini gönder.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **"Keep log":** Chrome'un bu sürümünde "Preserve log" seçeneğinin "Keep log" adını aldığını ekran görüntüsünden çıkarıyorum; işlevi aynı (sayfa değişince ve yönlendirmede liste silinmez).
> 2. **"Doc" filtresi:** Yönlendirme satırının (`dashboard` → 307) da "Doc" türünde listeleneceğini varsayıyorum. 1. ölçümde yalnızca `giris` görünürse filtreyi **All** yapıp `dashboard` satırını ara.

### Prompt 27 · 24 Eki 2026 13:34

````text
hepsi doğru
````

### Claude cevabı 26 · 24 Eki 2026 13:36

> Ölçüm 1 temiz: oturumsuz `/dashboard` girişe yönleniyor, geçersiz kimlik ile başka kiracının kaydı **aynı kodu (404) ve aynı ekranı** alıyor, var olmayan adres 404. Sonuçları ADR'ye "Ölçüm 1" olarak yazacağız.
>
> # Commit (a): 404, yetkisiz, hata ve yüklenme ekranları
>
> ## Ne değişiyor?
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `src/app/not-found.tsx` | Yeni | Türkçe kök 404: "Sayfa bulunamadı", ana sayfaya bağlantı. Oturum ve veri okumaz |
> | `src/app/(panel)/error.tsx` | Yeni | Panel hata ekranı: sol menü yerinde, "Bir şeyler ters gitti", `MESAJ.beklenmeyen`, varsa kısa hata kodu, **Tekrar dene** (sunucudan veriyi yeniden ister). Hata ayrıntısı yazılmaz |
> | `src/app/global-error.tsx` | Yeni | Kök yerleşim çökerse son çare: kendi `<html lang="tr">`'si, satır içi stil, **Sayfayı yenile** |
> | `src/app/(panel)/loading.tsx` | Yeni | Başlık ve kart iskeleti, görünür "Yükleniyor…", `role="status"`, hareket azaltma tercihine uyar |
> | `src/app/(panel)/YetkiYok.tsx` | Değişir | "Bir değişiklik gerekiyorsa firma yöneticinize başvurun." ve "← Dashboard'a dön" bağlantısı |
> | `src/app/(panel)/not-found.tsx` | Değişir | "←Dashboard" → "← Dashboard" (boşluk) |
> | `src/app/layout.tsx` | Değişir | `lang="tr"`, başlık "AboneTakip", Türkçe açıklama |
>
> **Veri, tenant, yetki:** Yeni sorgu yok. Ayarlar ve Kullanıcılar sayfaları değişmiyor; rol kontrolü zaten sunucuda ve sorgulardan önce.
>
> ---
>
> ## A1) Boş dosyaları aç
>
> **Komut 1:** Kök 404 için boş dosya.
> ```
> touch src/app/not-found.tsx
> ```
> **Komut 2:** Kök hata ekranı için boş dosya.
> ```
> touch src/app/global-error.tsx
> ```
> **Komut 3:** Panel hata ekranı için boş dosya (yol parantez içerdiği için tırnaklı).
> ```
> touch 'src/app/(panel)/error.tsx'
> ```
> **Komut 4:** Panel yüklenme ekranı için boş dosya.
> ```
> touch 'src/app/(panel)/loading.tsx'
> ```
>
> ## A2) `src/app/not-found.tsx`
>
> ```tsx
> import Link from "next/link";
> import BosDurum from "@/components/ui/BosDurum";
>
> // KÖK 404 (Gün 11, Parça B)
> // Var olmayan bir adres açıldığında gösterilir (ör. /olmayan-sayfa).
> // Panelin dışındadır: oturum ve veri okumaz. Panel içindeki kayıtlar için
> // ayrı ekran vardır: src/app/(panel)/not-found.tsx ("Kayıt bulunamadı").
> // Ana sayfa bağlantısı giriş durumuna göre yönlendirir (src/app/page.tsx).
> export default function SayfaBulunamadi() {
>   return (
>     <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
>       <BosDurum
>         baslik="Sayfa bulunamadı"
>         aciklama="Aradığınız sayfa yok. Adres hatalı olabilir."
>       >
>         <Link
>           href="/"
>           className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>         >
>           ← Ana sayfaya dön
>         </Link>
>       </BosDurum>
>     </main>
>   );
> }
> ```
>
> ## A3) `src/app/global-error.tsx`
>
> ```tsx
> "use client";
>
> // KÖK HATA EKRANI (Gün 11, Parça B)
> // Yalnızca kök yerleşimin (src/app/layout.tsx) kendisi çökerse gösterilir; panel
> // sayfalarındaki hatalar src/app/(panel)/error.tsx ile yakalanır.
> // Kök yerleşimin yerini aldığı için kendi <html> ve <body> etiketleri vardır.
> // Genel stiller (Tailwind, yazı tipi) yüklenmemiş olabilir: bu yüzden yalnızca
> // satır içi basit stil kullanılır. Hata ayrıntısı ekrana yazılmaz.
>
> type Props = { error: Error & { digest?: string } };
>
> export default function KokHatasi({ error }: Props) {
>   return (
>     <html lang="tr">
>       <body
>         style={{
>           margin: 0,
>           minHeight: "100vh",
>           display: "flex",
>           alignItems: "center",
>           justifyContent: "center",
>           fontFamily: "system-ui, sans-serif",
>           background: "#f8fafc",
>           color: "#0f172a",
>         }}
>       >
>         <title>AboneTakip</title>
>         <div role="alert" style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
>           <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>Bir şeyler ters gitti</h1>
>           <p style={{ fontSize: 14, margin: "0 0 16px", color: "#475569" }}>
>             Uygulama yüklenemedi. Lütfen sayfayı yenileyin.
>           </p>
>           {error.digest && (
>             <p style={{ fontSize: 12, margin: "0 0 16px", color: "#64748b" }}>
>               Destek için kod: <code>{error.digest}</code>
>             </p>
>           )}
>           <button
>             type="button"
>             onClick={() => window.location.reload()}
>             style={{
>               padding: "8px 16px",
>               fontSize: 14,
>               border: "none",
>               borderRadius: 8,
>               background: "#4f46e5",
>               color: "#ffffff",
>               cursor: "pointer",
>             }}
>           >
>             Sayfayı yenile
>           </button>
>         </div>
>       </body>
>     </html>
>   );
> }
> ```
>
> ## A4) `src/app/(panel)/error.tsx`
>
> ```tsx
> "use client";
>
> // PANEL HATA EKRANI (Gün 11, Parça B)
> // Panel sayfalarında beklenmeyen bir hata olursa gösterilir. Sol menü (panel
> // yerleşimi) yerinde kalır, yalnızca içerik alanı bu ekranla değişir.
> //
> // Güvenlik: hata mesajı ve yığın izi ekrana YAZILMAZ (adres, sorgu veya veri
> // sızabilir). Yalnızca Next.js'in ürettiği kısa kod (digest) gösterilir; bu kod
> // sunucu günlüğündeki kayıtla eşleştirmek içindir, içinde bilgi taşımaz.
> //
> // "Tekrar dene": hata sunucuda olduysa (ör. veritabanına ulaşılamadı) yalnızca
> // ekranı yeniden çizmek yetmez; önce sayfa verisi sunucudan yeniden istenir
> // (router.refresh), sonra hata ekranı sıfırlanır (reset).
>
> import { startTransition } from "react";
> import { useRouter } from "next/navigation";
> import Dugme from "@/components/ui/Dugme";
> import { MESAJ } from "@/lib/islem";
>
> type Props = {
>   error: Error & { digest?: string };
>   reset: () => void;
> };
>
> export default function PanelHatasi({ error, reset }: Props) {
>   const router = useRouter();
>
>   function tekrarDene() {
>     startTransition(() => {
>       router.refresh();
>       reset();
>     });
>   }
>
>   return (
>     <div
>       role="alert"
>       className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800"
>     >
>       <h1 className="text-lg font-semibold">
>         <span aria-hidden="true">!&nbsp;</span>Bir şeyler ters gitti
>       </h1>
>       <p className="mt-1 text-sm">{MESAJ.beklenmeyen}</p>
>       {error.digest && (
>         <p className="mt-2 text-xs text-red-700">
>           Destek için kod: <code>{error.digest}</code>
>         </p>
>       )}
>       <div className="mt-4">
>         <Dugme type="button" onClick={tekrarDene}>
>           Tekrar dene
>         </Dugme>
>       </div>
>     </div>
>   );
> }
> ```
>
> ## A5) `src/app/(panel)/loading.tsx`
>
> ```tsx
> // PANEL YÜKLENME EKRANI (Gün 11, Parça B)
> // Panel sayfaları sunucuda hazırlanırken gösterilir. Sol menü yerinde kalır.
> // Tek dosya bütün panel sayfalarını kapsar (sayfa başına ayrı dosya yok).
> // Erişilebilirlik: görünür "Yükleniyor…" metni role="status" ile duyurulur;
> // iskelet kutuları ekran okuyucudan gizlenir; hareket azaltma tercihinde
> // yanıp sönme kapanır.
> // Bilinen sınır (ADR K11.10): bu dosya sayfayı akışla gönderdiği için panel
> // içinde notFound() çağrılan sayfalar 404 yerine 200 kodu alabilir. Var olmayan
> // kayıt ile başka firmanın kaydı yine aynı kodu ve aynı ekranı alır.
>
> export default function PanelYukleniyor() {
>   return (
>     <div className="space-y-6">
>       <p role="status" className="text-sm text-slate-500">
>         Yükleniyor…
>       </p>
>       <div
>         aria-hidden="true"
>         className="animate-pulse space-y-6 motion-reduce:animate-none"
>       >
>         <div className="space-y-2">
>           <div className="h-7 w-48 rounded bg-slate-200" />
>           <div className="h-4 w-72 max-w-full rounded bg-slate-200" />
>         </div>
>         <div className="grid gap-4 sm:grid-cols-2">
>           <div className="h-32 rounded-xl border border-slate-200 bg-white" />
>           <div className="h-32 rounded-xl border border-slate-200 bg-white" />
>         </div>
>         <div className="h-48 rounded-xl border border-slate-200 bg-white" />
>       </div>
>     </div>
>   );
> }
> ```
>
> ## A6) `src/app/(panel)/YetkiYok.tsx`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir:**
>
> ```tsx
> import Link from "next/link";
>
> // YETKİSİZ ERİŞİM
> // Finance kullanıcısı yalnızca manager'a açık bir sayfaya (Ayarlar, Kullanıcılar)
> // girerse gösterilir. Rol kontrolü sayfada, SUNUCUDA ve veri okunmadan ÖNCE yapılır
> // (requireManager); bu bileşen yalnızca mesajı gösterir.
> // Gün 11 (Parça B): yönlendirme cümlesi ve Dashboard bağlantısı eklendi.
> // Bilinen sınır: yanıt HTTP 200 döner, 403 değil (ADR K11.8).
> export default function YetkiYok() {
>   return (
>     <div className="space-y-4">
>       <div
>         role="alert"
>         className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900"
>       >
>         <h1 className="text-lg font-semibold">Bu sayfaya erişim yetkiniz yok</h1>
>         <p className="mt-1 text-sm">
>           Bu sayfayı yalnızca firma yöneticisi (manager) görüntüleyebilir. Bir
>           değişiklik gerekiyorsa firma yöneticinize başvurun.
>         </p>
>       </div>
>       <Link
>         href="/dashboard"
>         className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>       >
>         ← Dashboard&apos;a dön
>       </Link>
>     </div>
>   );
> }
> ```
>
> ## A7) Küçük düzenlemeler
>
> **Komut 5:** Panel 404'teki bağlantı metnine boşluk ekler.
> ```
> perl -pi -e 's/←Dashboard/← Dashboard/' 'src/app/(panel)/not-found.tsx'
> ```
> **Komut 6:** Doğrular; çıktıda `← Dashboard&apos;a dön` görünmeli.
> ```
> grep -n "Dashboard&apos;a dön" 'src/app/(panel)/not-found.tsx'
> ```
> **Komut 7:** Kök yerleşimde dili, sekme başlığını ve açıklamayı Türkçeye çevirir.
> ```
> perl -pi -e 's/lang="en"/lang="tr"/; s/title: "Create Next App"/title: "AboneTakip"/; s/description: "Generated by create next app"/description: "Küçük yazılım firmaları için abonelik, MRR ve churn takibi."/' src/app/layout.tsx
> ```
> **Komut 8:** Doğrular; üç satır görünmeli (`lang="tr"`, `"AboneTakip"`, Türkçe açıklama).
> ```
> grep -n -E 'lang=|title:|description:' src/app/layout.tsx
> ```
>
> ---
>
> ## A8) Kontroller
>
> **Komut 9:** Kod kuralları.
> ```
> npm run lint
> ```
> **Komut 10:** Derleme ve tür denetimi (`error.tsx`'in özelliklerini de doğrular).
> ```
> npm run build
> ```
> **Komut 11:** Veritabanısız testler; sayı değişmemeli, `fail 0`.
> ```
> npm test
> ```
>
> ## A9) Ölçüm 2 ve elle sınama
>
> Önce `npm run dev:test`'i **durdurup yeniden başlat** (Control + C, sonra Komut 6'nın aynısı: `npm run dev:test`); **yeniden başlatmadan önce panel sekmelerini kapat** (az önceki döngü yaşanmasın). Network ayarları aynı (Keep log, Doc, her ölçümden önce temizle).
>
> | # | Oturum | Adres / işlem | Beklenen ekran | Status (ölç) |
> |---|---|---|---|---|
> | 1 | Kapalı | `/dashboard` | Giriş sayfası | ilk: …, ikinci: … (Ölçüm 1 ile aynı olmalı) |
> | 2 | `gun11-kilit` | `/musteriler/abc` | "Kayıt bulunamadı", "← Dashboard'a dön" | … |
> | 3 | Aynı | Bebek firmasının plan adresi | **2 ile aynı ekran** | **2 ile aynı kod olmalı** |
> | 4 | Aynı | `/olmayan-sayfa` | Türkçe "Sayfa bulunamadı", menü yok | … |
> | 5 | Herhangi | Sekme başlığı | "AboneTakip" | |
> | 6 | A firmasının finance kullanıcısı | `/ayarlar` ve `/kullanicilar` (adres çubuğuna yazarak) | Sarı kutu, yeni cümle, Dashboard bağlantısı; menüde iki sayfa da yok; CAC değeri görünmez | |
> | 7 | Manager | Network'te "No throttling" yerine **Slow 4G**, menüde sayfalar arası geç | Sol menü yerinde, "Yükleniyor…" ve iskelet | (sonra **No throttling**'e geri al) |
> | 8 | Manager | Wi-Fi'yi kapat, menüden başka sayfaya geç | Kırmızı "Bir şeyler ters gitti" kutusu, ayrıntı yok | Geliştirme modunun kırmızı penceresi çıkarsa **Esc** ile kapat |
> | 9 | Aynı | Wi-Fi'yi aç, **Tekrar dene** | Sayfa gelir | |
>
> 2 ve 3 farklı kod ya da farklı ekran alırsa **dur**, commit atma.
>
> Not: `global-error.tsx` elle denenmeyecek (kök yerleşimi bilerek bozmak gerekir); ADR'ye "derleme ve tür denetimiyle doğrulandı, elle denenmedi" yazılacak.
>
> ## A10) Commit (a)
>
> Kontroller ve sınamalar temizse:
>
> **Komut 12:** Değişenleri listeler; yalnızca yukarıdaki 7 dosya görünmeli (4 yeni `??`, 3 değişen `M`).
> ```
> git status --short
> ```
> **Komut 13:** Bu yedi dosyayı hazırlar.
> ```
> git add src/app/not-found.tsx src/app/global-error.tsx 'src/app/(panel)/error.tsx' 'src/app/(panel)/loading.tsx' 'src/app/(panel)/YetkiYok.tsx' 'src/app/(panel)/not-found.tsx' src/app/layout.tsx
> ```
> **Üç tarama:** CLAUDE.md'deki üç komut (`--cached` ile); 1. boş, 2. ve 3. `0` olmalı. Ad taramasının desenini bu cevaba yazmıyorum.
>
> **Komut 14:** Commit'i atar (tamamını tek seferde yapıştır).
> ```
> git commit -m "feat: 404, yetkisiz, hata ve yüklenme ekranları" -m "- Türkçe kök 404 (Sayfa bulunamadı)
> - Panel hata ekranı (ayrıntı göstermez, Tekrar dene) ve kök global-error
> - Panel için tek yüklenme ekranı
> - YetkiYok: yönlendirme cümlesi ve Dashboard bağlantısı
> - Kök yerleşim: lang=tr, başlık AboneTakip, Türkçe açıklama" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> Gönderilecekler: Komut 6, 8'in çıktıları, lint/build/test sonuçları, sınama tablosundaki Status değerleri ve sonuçlar. Sonra commit (b) (boş durumlar) gelecek.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **`error.tsx` özellikleri:** Next.js 16.4.2'nin hata sayfasına hâlâ `error` ve `reset` verdiğini varsayıyorum; değiştiyse Komut 10 tür hatası verir, çıktıyı gönder.
> 2. **`router.refresh()` + `reset()`:** Sunucu kaynaklı hatada yeniden denemenin bu ikiliyle çalıştığını varsayıyorum (sınama 9 doğrulayacak). Çalışmazsa düğme sayfayı tamamen yeniler.
> 3. **`global-error` içinde `<title>`:** React 19'un `<title>`'ı belge başlığına taşıdığını varsayıyorum; elle denenmeyeceği için yalnızca derlemenin geçmesine güveniyoruz.
> 4. **Ölçüm 2 beklentisi:** 2 ve 3'te `loading.tsx` nedeniyle 200 bekliyorum; 404 kalırsa daha iyi, ADR'ye ölçülen değer yazılır. Önemli olan ikisinin aynı olması.
> 5. **Kök 404 görünümü:** Kök yerleşimin `body`'sinin arka plan rengini `globals.css`'ten aldığını varsayıyorum; sayfa beyaz görünürse sorun değil.
> 6. **Commit (a) içeriği:** Bu commit'te yalnızca yedi dosya olmalı; Komut 12'de başka dosya görünürse (ör. bir `prompt_cevap` dosyası) onu bu commit'e ekleme, bana yaz.

### Prompt 28 · 24 Eki 2026 13:48

````text
kullanici@bilgisayar abonetakip % git status --short
 M src/app/(panel)/YetkiYok.tsx
 M src/app/(panel)/not-found.tsx
 M src/app/layout.tsx
?? src/app/(panel)/error.tsx
?? src/app/(panel)/loading.tsx
?? src/app/global-error.tsx
?? src/app/not-found.tsx
kullanici@bilgisayar abonetakip % git add src/app/not-found.tsx src/app/global-error.tsx 'src/app/(panel)/error.tsx' 'src/app/(panel)/loading.tsx' 'src/app/(panel)/YetkiYok.tsx' 'src/app/(panel)/not-found.tsx' src/app/layout.tsx
kullanici@bilgisayar abonetakip % git commit -m "feat: 404, yetkisiz, hata ve yüklenme ekranları" -m "- Türkçe kök 404 (Sayfa bulunamadı)
- Panel hata ekranı (ayrıntı göstermez, Tekrar dene) ve kök global-error
- Panel için tek yüklenme ekranı
- YetkiYok: yönlendirme cümlesi ve Dashboard bağlantısı
- Kök yerleşim: lang=tr, başlık AboneTakip, Türkçe açıklama" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> 
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[gun11b-bos-hata-ekranlari c2cec85] feat: 404, yetkisiz, hata ve yüklenme ekranları
 7 files changed, 200 insertions(+), 13 deletions(-)
 create mode 100644 src/app/(panel)/error.tsx
 create mode 100644 src/app/(panel)/loading.tsx
 create mode 100644 src/app/global-error.tsx
 create mode 100644 src/app/not-found.tsx
kullanici@bilgisayar abonetakip %  . diğerleri de olması gerektiği gibi
````

### Claude cevabı 27 · 24 Eki 2026 13:49

> Commit (a) atıldı (`c2cec85`, 7 dosya). Hepsinin beklendiği gibi olduğunu not ettim.
>
> **ADR için iki şeyi kesinleştirmem lazım:**
>
> 1. **Ölçüm 2'nin değerleri:** 2. ve 3. satırda (`/musteriler/abc` ve başka kiracının plan adresi) Status **200 mü, 404 mü** çıktı? İkisinin aynı olduğunu biliyorum; ADR'ye ölçülen sayıyı yazacağım, tahmini değil. 1. satır (oturumsuz `/dashboard`) ve 4. satır (`/olmayan-sayfa`) için de sayıları yaz.
> 2. **Ek satırdaki boşluk:** Yapıştırdığın commit komutunda `<noreply@anthropic.com>`'dan sonra bir boşluk kalmış. Git normalde satır sonu boşluklarını siler, ama ekin bozulmadığını görelim.
>
> **Komut 1:** Commit mesajının son iki satırını, satır sonlarını `$` ile işaretleyerek gösterir. İki satır da `>$` ve `…AREY6$` ile bitmeli (`$`'dan önce boşluk olmamalı).
> ```
> git --no-pager log -1 --format=%B | tail -2 | cat -e
> ```
>
> Boşluk kalmışsa sorun değil; PR squash ile birleşirken son commit mesajını onay ekranında düzeltebiliriz, şimdi geçmişi değiştirmiyoruz.
>
> ---
>
> # Commit (b): Boş durum ekranları
>
> ## Ne değişiyor?
>
> Yalnızca başlık ve açıklama metinleri; yeni sorgu yok.
>
> | Dosya | Önce | Sonra | Neden |
> |---|---|---|---|
> | `musteriler/page.tsx` | Varsayılan görünümde "Henüz müşteri yok" / "…ilk müşterinizi ekleyin." | **"Aktif müşteri yok"** / "Yukarıdaki formdan müşteri ekleyin. Pasif müşterileri görmek için “Pasifleri göster” bağlantısına tıklayın." | Bütün müşterileri pasif olan firmada "Henüz yok" yanlış |
> | `planlar/page.tsx` | "Henüz plan yok" / "…ilk planınızı ekleyin." | **"Aktif plan yok"** / aynı yapıda açıklama | Aynı neden |
> | `abonelikler/page.tsx` | Filtre seçiliyken de "Henüz abonelik yok" | Filtre seçiliyken **"Bu filtrede abonelik yok"** | Filtrede eşleşme olmaması "hiç abonelik yok" demek değil |
>
> "Pasifleri göster" açıkken başlıklar "Henüz müşteri yok" / "Henüz plan yok" olarak kalıyor; o durumda gerçekten hiç kayıt yok.
>
> ## B1) Düzenlemeler
>
> **Komut 2:** Müşteriler sayfasında başlığı görünüme göre değiştirir ve açıklamaya ipucu ekler.
> ```
> perl -pi -e 's/baslik="Henüz müşteri yok"/baslik={pasifleriGoster ? "Henüz müşteri yok" : "Aktif müşteri yok"}/; s/"Yukarıdaki formdan ilk müşterinizi ekleyin\."/"Yukarıdaki formdan müşteri ekleyin. Pasif müşterileri görmek için “Pasifleri göster” bağlantısına tıklayın."/' 'src/app/(panel)/musteriler/page.tsx'
> ```
>
> **Komut 3:** Doğrular; iki satır görünmeli.
> ```
> grep -n -E "Aktif müşteri yok|Pasif müşterileri görmek" 'src/app/(panel)/musteriler/page.tsx'
> ```
>
> **Komut 4:** Planlar sayfasında aynı düzenleme.
> ```
> perl -pi -e 's/baslik="Henüz plan yok"/baslik={pasifleriGoster ? "Henüz plan yok" : "Aktif plan yok"}/; s/"Yukarıdaki formdan ilk planınızı ekleyin\."/"Yukarıdaki formdan plan ekleyin. Pasif planları görmek için “Pasifleri göster” bağlantısına tıklayın."/' 'src/app/(panel)/planlar/page.tsx'
> ```
>
> **Komut 5:** Doğrular; iki satır görünmeli.
> ```
> grep -n -E "Aktif plan yok|Pasif planları görmek" 'src/app/(panel)/planlar/page.tsx'
> ```
>
> **Komut 6:** Abonelikler sayfasında başlığı filtreye göre değiştirir.
> ```
> perl -pi -e 's/baslik="Henüz abonelik yok"/baslik={filtre ? "Bu filtrede abonelik yok" : "Henüz abonelik yok"}/' 'src/app/(panel)/abonelikler/page.tsx'
> ```
>
> **Komut 7:** Doğrular; bir satır görünmeli.
> ```
> grep -n "Bu filtrede abonelik yok" 'src/app/(panel)/abonelikler/page.tsx'
> ```
>
> ## B2) Kontroller
>
> **Komut 8:** Kod kuralları.
> ```
> npm run lint
> ```
> **Komut 9:** Derleme ve tür denetimi.
> ```
> npm run build
> ```
>
> ## B3) Elle sınama
>
> `npm run dev:test` açık kalsın (bu değişiklikler sunucuyu yeniden başlatmadan görünür). Yeni firma: `gun11-bos@example.com`.
>
> | # | İşlem | Beklenen |
> |---|---|---|
> | 1 | Dashboard | "Henüz abonelik yok, ilk aboneliği ekleyin" (değişmedi) |
> | 2 | Müşteriler | "Aktif müşteri yok" + ipucu; **Pasifleri göster** → "Henüz müşteri yok" / "Bu firmada kayıtlı müşteri bulunmuyor." |
> | 3 | Planlar | "Aktif plan yok" + ipucu; **Pasifleri göster** → "Henüz plan yok" |
> | 4 | Abonelikler | "Henüz abonelik yok"; formun yerinde "önce bir müşteri ve bir plan ekleyin" |
> | 5 | Abonelikler → **Aktif** filtresi | "Bu filtrede abonelik yok" |
> | 6 | Bir müşteri ekle ("Boş Deneme Müşterisi"), sonra Abonelikler | "önce bir plan ekleyin" |
> | 7 | O müşteriyi **Pasife al**, Müşteriler'e dön | Varsayılan görünümde "Aktif müşteri yok" + ipucu; **Pasifleri göster** → müşteri "Pasif" rozetiyle listede |
>
> ## B4) Commit (b)
>
> **Komut 10:** Yalnızca üç sayfa değişmiş olmalı (` M`).
> ```
> git status --short
> ```
> **Komut 11:** Üç sayfayı hazırlar.
> ```
> git add 'src/app/(panel)/musteriler/page.tsx' 'src/app/(panel)/planlar/page.tsx' 'src/app/(panel)/abonelikler/page.tsx'
> ```
> **Üç tarama:** CLAUDE.md'deki komutlar (`--cached`); 1. boş, 2. ve 3. `0`.
>
> **Komut 12:** Commit'i atar. Ek satırının sonunda boşluk bırakmamaya dikkat et.
> ```
> git commit -m "feat: boş durum ekranları" -m "- Müşteriler ve Planlar: varsayılan görünümde 'Aktif ... yok' başlığı ve Pasifleri göster ipucu
> - Abonelikler: filtre seçiliyken 'Bu filtrede abonelik yok'" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> Gönderilecekler: Ölçüm 2 sayıları, Komut 1, 3, 5, 7'nin çıktıları, lint/build sonucu, sınama sonuçları. Sonra commit (c1): `BaslatFormu` ve `IslemMesaji`.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **"Diğerleri olması gerektiği gibi":** Lint, derleme, `npm test`, üç tarama ve sınama tablosunun (finance, yavaş yüklenme, Wi-Fi ile hata ve Tekrar dene dahil) temiz geçtiğini bu cümleden çıkarıyorum; Ölçüm 2'nin sayılarını ise bilmiyorum.
> 2. **Tipografik tırnaklar:** Açıklamalarda “ ” kullandım; düz tırnak (") JSX metninde kaçış gerektirirdi. Ekranda düzgün görüneceğini varsayıyorum.
> 3. **`perl` ve Türkçe karakterler:** Komutlardaki Türkçe harflerin dosyadaki UTF-8 baytlarıyla birebir eşleşeceğini varsayıyorum (Parça A'daki perl komutları da böyle çalıştı). Komut 3, 5 ya da 7 boş dönerse dosyaya dokunmadan bana yaz.
> 4. **Pasife alma:** Yeni kayıtla açılan firmanın kullanıcısının manager olduğunu ve aboneliği olmayan müşterinin pasife alınabildiğini varsayıyorum (sınama 7).

### Prompt 29 · 24 Eki 2026 13:56

````text
kullanici@bilgisayar abonetakip % git status --short
 M src/app/(panel)/abonelikler/page.tsx
 M src/app/(panel)/musteriler/page.tsx
 M src/app/(panel)/planlar/page.tsx
kullanici@bilgisayar abonetakip % git add 'src/app/(panel)/musteriler/page.tsx' 'src/app/(panel)/planlar/page.tsx' 'src/app/(panel)/abonelikler/page.tsx'
kullanici@bilgisayar abonetakip % git commit -m "feat: boş durum ekranları" -m "- Müşteriler ve Planlar: varsayılan görünümde 'Aktif ... yok' başlığı ve Pasifleri göster ipucu
- Abonelikler: filtre seçiliyken 'Bu filtrede abonelik yok'" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> 
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[gun11b-bos-hata-ekranlari 1710934] feat: boş durum ekranları
 3 files changed, 5 insertions(+), 5 deletions(-)
kullanici@bilgisayar abonetakip % , diğerleri de olması gerektiği gibi
````

### Claude cevabı 28 · 24 Eki 2026 13:57

> Commit (b) atıldı (`1710934`, 3 dosya). 
>
> **Hâlâ beklediğim iki şey** (ADR'yi yazmadan önce gerekli, commit (d)'ye kadar gönderebilirsin):
>
> 1. **Ölçüm 2'nin sayıları:** Satır 1 (oturumsuz `/dashboard`: ilk ve ikinci satır), satır 2 ve 3 (`/musteriler/abc` ve başka kiracının adresi: 200 mü 404 mü), satır 4 (`/olmayan-sayfa`).
> 2. **Ek satırındaki boşluk:** İki commit'te de yapıştırılan komutta `<noreply@anthropic.com>`'dan sonra bir boşluk görünüyor (kopyalarken ekleniyor olabilir). Git bunu genelde siler; görelim:
>
> **Komut 1:** Son iki commit'in son iki satırını, satır sonu `$` ile işaretli gösterir. Satırlar `>$` ve `AREY6$` ile bitmeli.
> ```
> git --no-pager log -2 --format=%B | grep -E "Co-Authored-By|Claude-Session" | cat -e
> ```
>
> ---
>
> # Commit (c1): Abonelik formu ve mesaj simgesi
>
> ## Ne değişiyor?
>
> | Dosya | Değişiklik | Neden |
> |---|---|---|
> | `src/components/ui/IslemMesaji.tsx` | Başarıda **✓**, hatada **!** simgesi (`aria-hidden`); metin değişmez | Anlam yalnızca renge bırakılmasın; dashboard rozetleriyle aynı simgeler. Bütün panel formları bu bileşeni kullandığı için hepsi aynı anda tutarlı kalır |
> | `src/app/(panel)/abonelikler/BaslatFormu.tsx` | Seçim kutularının hata metni kimlik alır, `role="alert"` taşır, kutuya `aria-describedby` ile bağlanır; hatada kırmızı odak çerçevesi; etiket aralığı `PlanFormu` ile aynı | Bugün hata metni ekran okuyucuya duyurulmuyor ve kutuya bağlı değil; `PlanFormu`'ndaki seçim kutusu ve `FormAlani` bunu zaten yapıyor. **Mesaj metinleri ve form davranışı değişmez** |
>
> Veri, tenant ve yetki etkilenmiyor.
>
> ## C1-1) `src/components/ui/IslemMesaji.tsx`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir:**
>
> ```tsx
> import type { FormDurumu } from "@/lib/islem";
>
> // Bir form işleminin sonucunu gösterir: başarılıysa yeşil, hatalıysa kırmızı kutu.
> // Henüz işlem yapılmadıysa hiçbir şey göstermez.
> // Gün 11 (Parça B): anlam yalnızca renge bırakılmaz. Başarıda "✓", hatada "!" simgesi
> // gösterilir (dashboard rozetleriyle aynı). Simge ekran okuyucudan gizlenir; anlamı
> // mesaj metni ve role (status / alert) taşır.
> export default function IslemMesaji({ durum }: { durum: FormDurumu }) {
>   if (durum.durum === "bos" || !durum.mesaj) return null;
>
>   const basarili = durum.durum === "basarili";
>   const renk = basarili
>     ? "border-green-200 bg-green-50 text-green-800"
>     : "border-red-200 bg-red-50 text-red-700";
>
>   return (
>     <p
>       role={basarili ? "status" : "alert"}
>       className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${renk}`}
>     >
>       <span aria-hidden="true" className="font-semibold">
>         {basarili ? "✓" : "!"}
>       </span>
>       <span>{durum.mesaj}</span>
>     </p>
>   );
> }
> ```
>
> ## C1-2) `src/app/(panel)/abonelikler/BaslatFormu.tsx`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir.** Değişen yalnızca iki seçim kutusunun etiket, çerçeve ve hata kısmı; müşteri/plan yoksa gösterilen yönlendirme ve gönderim aynı.
>
> ```tsx
> "use client";
>
> // Abonelik başlatma formu: müşteri ve plan seçilir.
> // noValidate: tarayıcının kendi kontrolü kapalıdır, doğrulama sunucuda yapılır.
> // Listelerde yalnızca bu firmanın AKTİF müşterileri ve planları bulunur
> // (sayfa bunları getTenantDb() ile okur). Asıl kontrol yine sunucuda yapılır:
> // formu elle değiştirip başka firmanın kimliğini göndermek işe yaramaz.
> //
> // Gün 11 (Parça B): seçim kutularının hata gösterimi PlanFormu ve FormAlani ile
> // aynı yapıya getirildi: hata metni kimlik alır, role="alert" ile duyurulur ve
> // kutuya aria-describedby ile bağlanır. Mesajlar değişmedi.
>
> import Link from "next/link";
> import { useActionState } from "react";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { ARALIK_ETIKETI, type PlanAraligi } from "@/lib/validation";
> import { abonelikBaslat } from "./actions";
>
> type Props = {
>   musteriler: { id: string; ad: string }[];
>   planlar: { id: string; ad: string; fiyat: number; aralik: PlanAraligi }[];
> };
>
> const SECIM_SINIFI =
>   "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2";
>
> // Hata varsa kırmızı, yoksa normal çerçeve (PlanFormu'ndaki seçim kutusuyla aynı).
> function cerceve(hata: string | undefined): string {
>   return hata
>     ? "border-red-400 focus:border-red-500 focus:ring-red-200"
>     : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";
> }
>
> export default function BaslatFormu({ musteriler, planlar }: Props) {
>   const [durum, formIslemi, bekliyor] = useActionState(
>     abonelikBaslat,
>     BASLANGIC_DURUMU
>   );
>
>   // Müşteri veya plan yoksa form gösterilmez, nedeni söylenir.
>   if (musteriler.length === 0 || planlar.length === 0) {
>     return (
>       <p className="text-sm text-slate-600">
>         Abonelik başlatmak için önce{" "}
>         {musteriler.length === 0 && (
>           <Link
>             href="/musteriler"
>             className="font-medium text-indigo-600 hover:text-indigo-700"
>           >
>             bir müşteri
>           </Link>
>         )}
>         {musteriler.length === 0 && planlar.length === 0 && " ve "}
>         {planlar.length === 0 && (
>           <Link
>             href="/planlar"
>             className="font-medium text-indigo-600 hover:text-indigo-700"
>           >
>             bir plan
>           </Link>
>         )}{" "}
>         ekleyin.
>       </p>
>     );
>   }
>
>   const musteriHatasi = durum.alanHatalari?.musteriId;
>   const planHatasi = durum.alanHatalari?.planId;
>
>   return (
>     <form action={formIslemi} noValidate className="space-y-4">
>       <div className="grid gap-4 sm:grid-cols-2">
>         <div className="space-y-1.5">
>           <label htmlFor="musteriId" className="block text-sm font-medium text-slate-700">
>             Müşteri
>           </label>
>           <select
>             id="musteriId"
>             name="musteriId"
>             defaultValue={durum.degerler?.musteriId ?? ""}
>             aria-invalid={musteriHatasi ? true : undefined}
>             aria-describedby={musteriHatasi ? "musteriId-hata" : undefined}
>             className={`${SECIM_SINIFI} ${cerceve(musteriHatasi)}`}
>           >
>             <option value="">Müşteri seçin</option>
>             {musteriler.map((musteri) => (
>               <option key={musteri.id} value={musteri.id}>
>                 {musteri.ad}
>               </option>
>             ))}
>           </select>
>           {musteriHatasi && (
>             <p id="musteriId-hata" role="alert" className="text-sm text-red-600">
>               {musteriHatasi}
>             </p>
>           )}
>         </div>
>
>         <div className="space-y-1.5">
>           <label htmlFor="planId" className="block text-sm font-medium text-slate-700">
>             Plan
>           </label>
>           <select
>             id="planId"
>             name="planId"
>             defaultValue={durum.degerler?.planId ?? ""}
>             aria-invalid={planHatasi ? true : undefined}
>             aria-describedby={planHatasi ? "planId-hata" : undefined}
>             className={`${SECIM_SINIFI} ${cerceve(planHatasi)}`}
>           >
>             <option value="">Plan seçin</option>
>             {planlar.map((plan) => (
>               <option key={plan.id} value={plan.id}>
>                 {plan.ad} · {plan.fiyat.toLocaleString("tr-TR")} TL ·{" "}
>                 {ARALIK_ETIKETI[plan.aralik]}
>               </option>
>             ))}
>           </select>
>           {planHatasi && (
>             <p id="planId-hata" role="alert" className="text-sm text-red-600">
>               {planHatasi}
>             </p>
>           )}
>         </div>
>       </div>
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" disabled={bekliyor}>
>         {bekliyor ? "Başlatılıyor..." : "Aboneliği başlat"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ## C1-3) Kontroller
>
> **Komut 2:** Kod kuralları.
> ```
> npm run lint
> ```
> **Komut 3:** Derleme ve tür denetimi.
> ```
> npm run build
> ```
>
> ## C1-4) Elle sınama (`gun11-bos@example.com`, manager)
>
> | # | İşlem | Beklenen |
> |---|---|---|
> | 1 | Planlar: yeni plan "Boş Deneme Planı", 100, Aylık | Yeşil kutuda **✓** ve "…planı eklendi." |
> | 2 | Planlar: adı boş, fiyat boş gönder | Kırmızı kutuda **!** ve "Lütfen işaretli alanları düzeltin.", alan hataları altta |
> | 3 | Müşteriler: "Boş Deneme 2" ekle | **✓** ile başarı mesajı |
> | 4 | Abonelikler: hiçbir şey seçmeden **Aboneliği başlat** | İki seçim kutusu kırmızı çerçeveli, altlarında hata metni; formda **!** ile genel mesaj |
> | 5 | Aynı sayfada kutuya tıkla (Tab ile gez) | Hatalı kutuda odak çerçevesi kırmızı |
> | 6 | Müşteri ve plan seçip başlat | **✓** ile "…için abonelik başlatıldı." |
> | 7 | Listedeki satırda **Yenile** | **✓** "Abonelik yenilendi." |
> | 8 | Müşteriler: aktif aboneliği olan "Boş Deneme 2"yi **Pasife al** | **!** ile "Bu müşterinin aktif aboneliği var…" |
> | 9 | Ayarlar: CAC 5000 kaydet | **✓** "…" (mevcut başarı mesajı) |
> | 10 | (İsteğe bağlı) VoiceOver'ı **Cmd + F5** ile aç, 4. adımı tekrarla | Hata metinleri okunur; simge okunmaz; kapatmak için yine Cmd + F5 |
>
> ## C1-5) Commit (c1)
>
> **Komut 4:** Yalnızca iki dosya değişmiş olmalı.
> ```
> git status --short
> ```
> **Komut 5:** İki dosyayı hazırlar.
> ```
> git add src/components/ui/IslemMesaji.tsx 'src/app/(panel)/abonelikler/BaslatFormu.tsx'
> ```
> **Üç tarama:** CLAUDE.md'deki komutlar (`--cached`); 1. boş, 2. ve 3. `0`.
>
> **Komut 6:** Commit'i atar.
> ```
> git commit -m "fix: abonelik formu hata erişilebilirliği ve mesaj simgesi" -m "- IslemMesaji: başarıda ✓, hatada ! simgesi (aria-hidden), anlam yalnızca renge bırakılmaz
> - BaslatFormu: seçim kutusu hataları kimlikli, role=alert ve aria-describedby ile bağlı (PlanFormu ile aynı yapı), mesajlar değişmedi" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> Gönderilecekler: Ölçüm 2 sayıları, Komut 1 çıktısı, lint/build sonucu ve sınama sonuçları (özellikle 4 ve 5). Sonra commit (c2): giriş ve kayıt.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **"Diğerleri olması gerektiği gibi" (commit b):** Komut 3, 5, 7'nin beklenen satırları gösterdiğini, lint/derleme/taramaların temiz olduğunu ve yedi sınamanın geçtiğini bu cümleden çıkarıyorum.
> 2. **Satır sonu boşluğu:** Git'in `-m` ile verilen mesajda satır sonu boşluğunu sildiğini varsayıyorum; Komut 1 bunu doğrulayacak. Silinmediyse geçmişi şimdi değiştirmeyiz; PR'ın squash onay ekranında son mesajı temiz yazarız.
> 3. **Simge karakterleri:** "✓" ve "!" karakterlerinin Geist yazı tipinde ya da yedek yazı tipinde düzgün göründüğünü varsayıyorum (dashboard rozetlerinde aynı karakter zaten görünüyor).
> 4. **Kapsam:** `BaslatFormu`'ndaki `toLocaleString` ile fiyat biçimlemesine dokunmadım (planlanan kapsam dışı tekrar, ADR notu).

### Prompt 30 · 24 Eki 2026 13:57

````text
1 - yazdığın sayıların aynısıyla karşılaştım test aşamasında
````

### Claude cevabı 29 · 24 Eki 2026 13:58

> Teşekkürler. ADR'ye yazacağım için anladığımı açıkça yazıyorum; yanlışsa düzelt:
>
> | # | Adres | Ölçüm 1 (kod değişmeden) | Ölçüm 2 (`loading.tsx` ile) |
> |---|---|---|---|
> | 1 | Oturumsuz `/dashboard` | 307 → `giris` 200 | 307 → `giris` 200 |
> | 2 | `/musteriler/abc` | 404 | **200** |
> | 3 | Başka kiracının plan adresi | 404 | **200** |
> | 4 | `/olmayan-sayfa` | 404 (İngilizce) | 404 (Türkçe) |
>
> Yani beklendiği gibi: `loading.tsx` panel içindeki "bulunamadı" yanıtlarını **200**'e çevirdi, ama var olmayan kayıt ile başka kiracının kaydı yine **aynı kodu ve aynı ekranı** alıyor; kaydın varlığı sızmıyor. Panel dışındaki kök 404 ve oturum yönlendirmesi değişmedi. ADR'ye bilinen sınır olarak böyle yazılacak.
>
> Bir tek **2. madde** (ek satırındaki boşluk) için Komut 1'in çıktısını henüz görmedim:
> ```
> git --no-pager log -2 --format=%B | grep -E "Co-Authored-By|Claude-Session" | cat -e
> ```
> Satırlar `>$` ve `AREY6$` ile bitiyorsa sorun yok.
>
> Ardından önceki mesajdaki **commit (c1)** adımlarına (IslemMesaji ve BaslatFormu, kontroller, sınama, commit) devam edebilirsin.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Ölçüm 2'nin 2. ve 3. satırı:** "Yazdığın sayılar" ifadesini, commit (a) mesajındaki "2 ve 3'te 200 bekliyorum" beklentisi olarak yorumladım. 404 çıktıysa tabloyu düzelt; ADR'ye ölçülen değer yazılacak.
> 2. **1. satırın kodu:** Yönlendirmenin 307 olduğunu, Ölçüm 1'de yazdığım beklentiyle aynı olduğu için varsayıyorum.

### Prompt 31 · 24 Eki 2026 13:58

````text
kullanici@bilgisayar abonetakip % git commit -m "feat: boş durum ekranları" -m "- Müşteriler ve Planlar: varsayılan görünümde 'Aktif ... yok' başlığı ve Pasifleri göster ipucu
- Abonelikler: filtre seçiliyken 'Bu filtrede abonelik yok'" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> 
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[gun11b-bos-hata-ekranlari 1710934] feat: boş durum ekranları
 3 files changed, 5 insertions(+), 5 deletions(-)
kullanici@bilgisayar abonetakip % git --no-pager log -2 --format=%B | grep -E "Co-Authored-By|Claude-Session" | cat -e
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>$
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6$
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>$
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6$
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 30 · 24 Eki 2026 13:58

> İki commit'te de ek satırları temiz: `>$` ve `AREY6$` ile bitiyor, satır sonunda boşluk kalmamış. Git yapıştırırken gelen boşluğu silmiş; geçmişte düzeltilecek bir şey yok.
>
> Şu ana kadarki durum:
>
> | Commit | Kimlik | Durum |
> |---|---|---|
> | (a) 404, yetkisiz, hata ve yüklenme ekranları | `c2cec85` | ✅ |
> | (b) Boş durum ekranları | `1710934` | ✅ |
> | (c1) Abonelik formu ve mesaj simgesi | | Sırada |
> | (c2) Giriş ve kayıt | | |
> | (d) ADR | | |
>
> Ölçüm 2 de kesinleşti (2 ve 3 → 200, aynı ekran; 1 ve 4 değişmedi); ADR'ye böyle yazılacak.
>
> Şimdi önceki mesajdaki **commit (c1)** adımlarına geçebilirsin:
> 1. `IslemMesaji.tsx` ve `BaslatFormu.tsx`'in içeriğini tamamen değiştir (C1-1, C1-2)
> 2. `npm run lint` ve `npm run build`
> 3. Elle sınama tablosu (özellikle 4: boş gönderimde iki seçim kutusunun hatası ve **!** simgesi; 5: kırmızı odak çerçevesi; 6: **✓** ile başarı)
> 4. `git status --short` → yalnızca iki dosya; `git add`; üç tarama; commit
>
> Sonuçları gönderince commit (c2) için giriş ve kayıt formlarının kodunu onayına sunacağım.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Satır sonu boşluğu:** `cat -e` çıktısı boşluğun commit mesajına girmediğini gösteriyor; sonraki commit'lerde aynı şekilde yapıştırman sorun çıkarmaz.
> 2. **Ölçüm 2:** Tablodaki yorumumu düzeltmediğin için 2 ve 3'ün 200 olduğunu kesin kabul ediyorum.

### Prompt 32 · 24 Eki 2026 14:05

````text
kullanici@bilgisayar abonetakip % git status --short
 M src/app/(panel)/abonelikler/BaslatFormu.tsx
 M src/components/ui/IslemMesaji.tsx
kullanici@bilgisayar abonetakip % git add src/components/ui/IslemMesaji.tsx 'src/app/(panel)/abonelikler/BaslatFormu.tsx'
kullanici@bilgisayar abonetakip % git commit -m "fix: abonelik formu hata erişilebilirliği ve mesaj simgesi" -m "- IslemMesaji: başarıda ✓, hatada ! simgesi (aria-hidden), anlam yalnızca renge bırakılmaz
- BaslatFormu: seçim kutusu hataları kimlikli, role=alert ve aria-describedby ile bağlı (PlanFormu ile aynı yapı), mesajlar değişmedi" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[gun11b-bos-hata-ekranlari c991cae] fix: abonelik formu hata erişilebilirliği ve mesaj simgesi
 2 files changed, 37 insertions(+), 18 deletions(-)
kullanici@bilgisayar abonetakip %  , diğer her şey tamam
````

### Claude cevabı 31 · 24 Eki 2026 14:06

> Commit (c1) atıldı (`c991cae`). Kalan: (c2) giriş ve kayıt, (d) ADR.
>
> # Commit (c2): Giriş ve kayıt formları
>
> ## Ne değişiyor, ne değişmiyor?
>
> | Dosya | Değişiklik |
> |---|---|
> | `src/app/(auth)/actions.ts` | Kendi `{ hata }` türü yerine ortak `FormDurumu` (`islem.ts`). Hatada `durum: "hata"`, `mesaj` ve `degerler` döner: girişte yalnızca **e-posta**, kayıtta **firma adı, ad soyad, e-posta**. **Parola hiçbir zaman geri dönmez.** Doğrulama ve oturum mantığı (`auth.ts`, `validation.ts`) ve mesaj metinleri aynı |
> | `src/app/(auth)/giris/GirisFormu.tsx` | Kendi kırmızı kutusu yerine `IslemMesaji` (simgeli); `noValidate` (tarayıcı balonları yerine sunucunun Türkçe mesajı); e-posta hatadan sonra korunur |
> | `src/app/(auth)/kayit/KayitFormu.tsx` | Aynı üç değişiklik; firma adı, ad soyad, e-posta korunur, parola bilerek boş kalır |
>
> `required`, `type="email"` ve `minLength` alanlarda **kalıyor**: `noValidate` ile tarayıcı gönderimi engellemez ama ekran okuyucular alanın zorunlu olduğunu duyurmaya devam eder. Çıkış işlemi değişmiyor.
>
> **Güvenlik:** Giriş hatası yine "E-posta veya parola hatalı." (hangi alanın yanlış olduğu söylenmez). Parola sunucudan istemciye hiçbir yolla dönmez. `tenantId` formdan alınmaz (değişmedi).
>
> ## C2-1) `src/app/(auth)/actions.ts`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir:**
>
> ```ts
> "use server";
>
> // Kayıt, giriş ve çıkış formlarının sunucu işlemleri (Server Actions).
> // Bu dosya yalnızca src/lib/auth.ts içindeki fonksiyonları çağırır.
> // tenantId buraya hiçbir zaman formdan gelmez.
> //
> // Gün 11 (Parça B): panel formlarıyla aynı ortak türe geçildi (FormDurumu, islem.ts).
> // Hata durumunda form, kullanıcının yazdıklarıyla yeniden doldurulur (degerler).
> // PAROLA BİLEREK geri gönderilmez: hatadan sonra parola alanı boş kalır.
> // Mesaj metinleri ve doğrulama kuralları değişmedi (auth.ts, validation.ts).
>
> import { redirect } from "next/navigation";
> import { cikisYap, girisYap, kayitOl } from "@/lib/auth";
> import { kayitGirdisiniDogrula } from "@/lib/validation";
> import { formMetni, type FormDurumu } from "@/lib/islem";
>
> // Kayıt formu gönderildiğinde çalışır.
> export async function kayitAction(
>   _onceki: FormDurumu,
>   formVerisi: FormData
> ): Promise<FormDurumu> {
>   // Hata olursa formu yeniden doldurmak için. Parola yok.
>   const degerler = {
>     firmaAdi: formMetni(formVerisi, "firmaAdi"),
>     adSoyad: formMetni(formVerisi, "adSoyad"),
>     eposta: formMetni(formVerisi, "eposta"),
>   };
>
>   // Girdileri sunucuda doğrula (tarayıcıdaki kontrollere güvenilmez).
>   const dogrulama = kayitGirdisiniDogrula({
>     firmaAdi: formVerisi.get("firmaAdi"),
>     adSoyad: formVerisi.get("adSoyad"),
>     eposta: formVerisi.get("eposta"),
>     parola: formVerisi.get("parola"),
>   });
>   if (!dogrulama.ok) {
>     return { durum: "hata", mesaj: dogrulama.hata, degerler };
>   }
>
>   const sonuc = await kayitOl(dogrulama.deger);
>   if (!sonuc.ok) {
>     return { durum: "hata", mesaj: sonuc.hata, degerler };
>   }
>
>   // Kayıt başarılı, oturum açıldı: panele git.
>   // redirect bir hata olarak fırlatılır; bu yüzden try/catch içinde değildir.
>   redirect("/dashboard");
> }
>
> // Giriş formu gönderildiğinde çalışır.
> export async function girisAction(
>   _onceki: FormDurumu,
>   formVerisi: FormData
> ): Promise<FormDurumu> {
>   // Hata olursa yalnızca e-posta geri döner. Parola yok.
>   const degerler = { eposta: formMetni(formVerisi, "eposta") };
>
>   const sonuc = await girisYap(
>     formVerisi.get("eposta"),
>     formVerisi.get("parola")
>   );
>   if (!sonuc.ok) {
>     return { durum: "hata", mesaj: sonuc.hata, degerler };
>   }
>
>   redirect("/dashboard");
> }
>
> // Çıkış düğmesine basıldığında çalışır.
> export async function cikisAction(): Promise<void> {
>   await cikisYap();
>   redirect("/giris");
> }
> ```
>
> ## C2-2) `src/app/(auth)/giris/GirisFormu.tsx`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir:**
>
> ```tsx
> "use client";
>
> import { useActionState } from "react";
> import { girisAction } from "../actions";
> import Dugme from "@/components/ui/Dugme";
> import FormAlani from "@/components/ui/FormAlani";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
>
> // Giriş formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
> // Gün 11 (Parça B): panel formlarıyla aynı yapı.
> //   - noValidate: tarayıcının kendi uyarı balonları kapalı; mesaj her zaman
> //     sunucudan, Türkçe gelir. "required" ve "type" ekran okuyucular için kalır.
> //   - Mesaj ortak IslemMesaji bileşeniyle gösterilir.
> //   - Hatadan sonra e-posta korunur; parola bilerek boş kalır.
> export default function GirisFormu() {
>   const [durum, formAction, bekliyor] = useActionState(
>     girisAction,
>     BASLANGIC_DURUMU
>   );
>
>   return (
>     <form action={formAction} noValidate className="mt-6 space-y-4">
>       <FormAlani
>         etiket="E-posta"
>         name="eposta"
>         type="email"
>         autoComplete="email"
>         defaultValue={durum.degerler?.eposta ?? ""}
>         required
>       />
>
>       <FormAlani
>         etiket="Parola"
>         name="parola"
>         type="password"
>         autoComplete="current-password"
>         required
>       />
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" tamGenislik disabled={bekliyor}>
>         {bekliyor ? "Giriş yapılıyor..." : "Giriş yap"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ## C2-3) `src/app/(auth)/kayit/KayitFormu.tsx`
>
> Dosyayı editörde aç ve **içeriğini tamamen şununla değiştir:**
>
> ```tsx
> "use client";
>
> import { useActionState } from "react";
> import { kayitAction } from "../actions";
> import Dugme from "@/components/ui/Dugme";
> import FormAlani from "@/components/ui/FormAlani";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
>
> // Kayıt formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
> // Gün 11 (Parça B): panel formlarıyla aynı yapı.
> //   - noValidate: tarayıcının kendi uyarı balonları kapalı; mesaj her zaman
> //     sunucudan, Türkçe gelir. "required", "type" ve "minLength" ekran okuyucular
> //     ve parola yöneticileri için kalır.
> //   - Mesaj ortak IslemMesaji bileşeniyle gösterilir.
> //   - Hatadan sonra firma adı, ad soyad ve e-posta korunur; parola bilerek boş kalır.
> export default function KayitFormu() {
>   const [durum, formAction, bekliyor] = useActionState(
>     kayitAction,
>     BASLANGIC_DURUMU
>   );
>
>   const deger = (alan: "firmaAdi" | "adSoyad" | "eposta") =>
>     durum.degerler?.[alan] ?? "";
>
>   return (
>     <form action={formAction} noValidate className="mt-6 space-y-4">
>       <FormAlani
>         etiket="Firma adı"
>         name="firmaAdi"
>         type="text"
>         defaultValue={deger("firmaAdi")}
>         required
>       />
>
>       <FormAlani
>         etiket="Ad soyad"
>         name="adSoyad"
>         type="text"
>         autoComplete="name"
>         defaultValue={deger("adSoyad")}
>         required
>       />
>
>       <FormAlani
>         etiket="E-posta"
>         name="eposta"
>         type="email"
>         autoComplete="email"
>         defaultValue={deger("eposta")}
>         required
>       />
>
>       <FormAlani
>         etiket="Parola"
>         name="parola"
>         type="password"
>         autoComplete="new-password"
>         required
>         minLength={8}
>         yardim="En az 8 karakter olmalıdır."
>       />
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" tamGenislik disabled={bekliyor}>
>         {bekliyor ? "Kaydediliyor..." : "Kayıt ol"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ## C2-4) Kontroller
>
> **Komut 1:** Kod kuralları.
> ```
> npm run lint
> ```
> **Komut 2:** Derleme ve tür denetimi (eski `{ hata }` türünü kullanan başka yer kalmışsa burada görünür).
> ```
> npm run build
> ```
> **Komut 3:** Veritabanısız testler; `fail 0`.
> ```
> npm test
> ```
> **Komut 4:** Veritabanı testleri (oturum ve kiracı testleri dahil); `fail 0`.
> ```
> npm run test:db
> ```
>
> ## C2-5) Elle sınama (test dalı)
>
> Network sekmesi gerekmiyor. Her sınamadan önce gerekiyorsa **Çıkış yap**.
>
> | # | İşlem | Beklenen |
> |---|---|---|
> | 1 | Giriş: `gun11-kilit@example.com`, **yanlış** parola | Kırmızı kutuda **!** "E-posta veya parola hatalı."; e-posta alanı **dolu**, parola **boş**; tarayıcı balonu yok |
> | 2 | Giriş: boş form gönder | Aynı Türkçe mesaj; tarayıcı balonu yok |
> | 3 | Giriş: aynı manager doğru parolayla | Dashboard açılır; sol altta rozet **Yönetici**; menüde Ayarlar ve Kullanıcılar **var** |
> | 4 | **Çıkış yap** | Giriş sayfasına döner; adres `/giris` |
> | 5 | Giriş: A firmasının **finance** kullanıcısı | Dashboard açılır; rozet **Finans**; menüde Ayarlar ve Kullanıcılar **yok** |
> | 6 | Finance ile `/ayarlar` adresini elle aç | `YetkiYok` (commit a) |
> | 7 | Çıkış → Kayıt: parola 5 karakter | **!** "…en az 8 karakter…" (sunucu mesajı); firma adı, ad soyad, e-posta **dolu**, parola **boş** |
> | 8 | Kayıt: e-posta `bozuk-adres` | Sunucunun Türkçe e-posta mesajı; tarayıcı balonu yok |
> | 9 | Kayıt: zaten var olan e-posta (`gun11-kilit@example.com`) | **!** "Bu e-posta adresiyle zaten bir hesap var." |
> | 10 | Kayıt: yeni firma, `gun11-kayit@example.com`, geçerli parola | Dashboard açılır, rozet **Yönetici**, "Henüz abonelik yok" boş durumu |
>
> ## C2-6) Commit (c2)
>
> **Komut 5:** Yalnızca üç dosya değişmiş olmalı.
> ```
> git status --short
> ```
> **Komut 6:** Üç dosyayı hazırlar.
> ```
> git add 'src/app/(auth)/actions.ts' 'src/app/(auth)/giris/GirisFormu.tsx' 'src/app/(auth)/kayit/KayitFormu.tsx'
> ```
> **Üç tarama:** CLAUDE.md'deki komutlar (`--cached`); 1. boş, 2. ve 3. `0`.
>
> **Komut 7:** Commit'i atar.
> ```
> git commit -m "fix: giriş ve kayıt formlarında tutarlı mesajlar" -m "- Ortak FormDurumu türü ve IslemMesaji bileşeni (panel formlarıyla aynı yapı)
> - noValidate: tarayıcı balonları yerine sunucunun Türkçe mesajı
> - Hatadan sonra e-posta (ve kayıtta firma adı, ad soyad) korunur, parola geri gönderilmez
> - Mesaj metinleri ve doğrulama kuralları değişmedi" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> Gönderilecekler: lint, build, iki test komutunun sonucu ve on sınamanın sonucu. Sonra commit (d): ADR.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Değerlerin korunması:** Hatadan sonra alanların `defaultValue` ile yeniden dolduğunu varsayıyorum; bu, `MusteriFormu` ve `PlanFormu`'ndaki aynı kalıbın bugün çalışmasına dayanıyor. Sınama 1 ve 7 doğrulayacak.
> 2. **Başka kullanım:** Eski `{ hata }` türünün yalnızca bu üç dosyada kullanıldığını varsayıyorum (`giris/page.tsx` ve `kayit/page.tsx`'i görmedim). Başka yerde kullanılıyorsa Komut 2 tür hatası verir.
> 3. **Testler:** `kurallar.test.ts` ya da `duman.test.ts`'in giriş/kayıt işlemlerinin dönüş biçimine bağlı olmadığını varsayıyorum; Komut 3 ve 4 bunu gösterecek.
> 4. **Parola yöneticisi:** `noValidate` ve `defaultValue` eklemenin Chrome'un parola kaydetme ve otomatik doldurmasını etkilemediğini varsayıyorum; sınama 3'te otomatik doldurma görünürse sorun değil.
> 5. **`required` + `noValidate`:** Tarayıcının `required` alanları gönderimde engellemeyeceğini (noValidate yüzünden) ama erişilebilirlik bilgisi olarak koruyacağını varsayıyorum; sınama 2 boş gönderimin sunucuya ulaştığını gösterecek.

### Prompt 33 · 24 Eki 2026 14:14

````text
kullanici@bilgisayar abonetakip % git status --short
 M src/app/(auth)/actions.ts
 M src/app/(auth)/giris/GirisFormu.tsx
 M src/app/(auth)/kayit/KayitFormu.tsx
kullanici@bilgisayar abonetakip % git add 'src/app/(auth)/actions.ts' 'src/app/(auth)/giris/GirisFormu.tsx' 'src/app/(auth)/kayit/KayitFormu.tsx'
kullanici@bilgisayar abonetakip % git commit -m "fix: giriş ve kayıt formlarında tutarlı mesajlar" -m "- Ortak FormDurumu türü ve IslemMesaji bileşeni (panel formlarıyla aynı yapı)
- noValidate: tarayıcı balonları yerine sunucunun Türkçe mesajı
- Hatadan sonra e-posta (ve kayıtta firma adı, ad soyad) korunur, parola geri gönderilmez
- Mesaj metinleri ve doğrulama kuralları değişmedi" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[gun11b-bos-hata-ekranlari 791e55e] fix: giriş ve kayıt formlarında tutarlı mesajlar
 3 files changed, 66 insertions(+), 31 deletions(-)
kullanici@bilgisayar abonetakip %  , diğerleri de tamam
````

### Claude cevabı 32 · 24 Eki 2026 14:15

> Commit (c2) atıldı (`791e55e`). Kod tamam; kalan tek commit **(d) ADR**, sonra PR.
>
> | Commit | Kimlik |
> |---|---|
> | (a) 404, yetkisiz, hata ve yüklenme ekranları | `c2cec85` |
> | (b) Boş durum ekranları | `1710934` |
> | (c1) Abonelik formu ve mesaj simgesi | `c991cae` |
> | (c2) Giriş ve kayıt formları | `791e55e` |
> | (d) ADR | sırada |
>
> # Commit (d): ADR Gün 11, Parça B
>
> `docs/02_ADR.md` dosyasını editörde aç. İki değişiklik var.
>
> ## D1) "Durum" ve "Sonuç" satırlarını değiştir
>
> Gün 11 bölümünün başında, **`**Durum:**` ile başlayıp `dalında üç sahte firmayla elle sınandı (aşağıda).` ile biten beş satırı** seç ve şununla değiştir:
>
> ```markdown
> **Durum:** Gün 11 iki parçaya bölündü (K11.6).
> - Parça A (aylık MRR grafiği): birleşti, PR #37, squash commit `344b753`, canlıda doğrulandı.
> - Parça B (boş durum, hata ve yüklenme ekranları, form mesajları): dal
>   `gun11b-bos-hata-ekranlari`, beş commit (`c2cec85`, `1710934`, `c991cae`, `791e55e` ve bu
>   ADR commit'i), tek PR.
>
> **Sonuç:** Her iki parçada `npm test`, `npm run test:db`, `npm run lint`, `npm run build`
> temiz. Test dalında elle sınandı (Parça A ve Parça B tabloları).
> ```
>
> Seçtiğin beş satır dosyadakiyle farklıysa (ör. sen daha önce düzenlediysen) değiştirmeden önce bana yaz.
>
> ## D2) Dosyanın en sonuna Parça B bölümünü ekle
>
> Gün 11'in son alt başlığı olan "Parça B için notlar"dan sonra, **dosyanın en sonuna** bir boş satır bırakıp yapıştır:
>
> ```markdown
> ### Parça B kararları: boş durum, hata ve yüklenme ekranları, form mesajları
>
> **K11.7: 404 iki katmanlıdır; başka kiracının kaydı "bulunamadı"dır**
> - **Panel içi:** Mevcut `src/app/(panel)/not-found.tsx` kullanıldı ("Kayıt bulunamadı").
>   Geçersiz kimlik, var olmayan kayıt ve başka firmanın kaydı aynı ekranı alır; müşteri ve
>   plan detay sayfaları zaten `notFound()` çağırıyordu, değişmedi. Yalnızca bağlantı metnindeki
>   boşluk düzeltildi.
> - **Kök:** Yeni `src/app/not-found.tsx`. Var olmayan adreslerde Next.js'in İngilizce sayfası
>   yerine Türkçe "Sayfa bulunamadı". Oturum ve veri okumaz; ana sayfaya bağlantı verir.
>
> **K11.8: Yetkisiz erişim sayfa içinde `YetkiYok` ile gösterilir**
> - Ayarlar ve Kullanıcılar sayfaları rolü `requireManager()` ile **sunucuda ve sorgulardan
>   önce** kontrol ediyordu; değişmedi. Finance kullanıcısında `getTenantDb()` hiç çalışmaz.
> - `YetkiYok`'a "firma yöneticinize başvurun" cümlesi ve Dashboard bağlantısı eklendi.
> - **Değerlendirilen:** Next.js `forbidden()` (deneysel ayar gerektiriyor) ve ayrı `/yetkisiz`
>   sayfası (yeni rota ve yönlendirme). İkisi de kapsamı büyüttüğü için seçilmedi.
> - **Bilinen sınır:** Yetkisiz sayfa HTTP 200 döner, 403 değil. Sunucu işlemleri (CAC kaydetme,
>   pasife alma) kendi içinde ayrıca rol kontrolü yapar ve `MESAJ.yetkiYok` döner.
>
> **K11.9: Genel hata ekranları ayrıntı göstermez**
> - **Panel:** Yeni `src/app/(panel)/error.tsx`. Sol menü yerinde kalır; "Bir şeyler ters gitti",
>   `MESAJ.beklenmeyen` ve varsa Next.js'in kısa hata kodu (digest) gösterilir. Hata mesajı ve
>   yığın izi yazılmaz (adres, sorgu veya veri sızabilir). "Tekrar dene" önce sayfa verisini
>   sunucudan yeniden ister (`router.refresh`), sonra ekranı sıfırlar (`reset`).
> - **Kök:** Yeni `src/app/global-error.tsx`. Kök yerleşim çökerse görünür; kendi `<html lang="tr">`
>   etiketi ve yalnızca satır içi stil (genel stiller yüklenmemiş olabilir), "Sayfayı yenile".
>   Elle denenmedi (kök yerleşimi bilerek bozmak gerekir); derleme ve tür denetimiyle doğrulandı.
>
> **K11.10: Panel için tek yüklenme ekranı; ölçülen durum kodu**
> - Yeni `src/app/(panel)/loading.tsx`: başlık ve kart iskeleti, görünür "Yükleniyor…"
>   (`role="status"`), hareket azaltma tercihine uyar. Sayfa başına ayrı dosya yok.
> - **Ölçüm** (Chrome Network, belge isteğinin durum kodu):
>
> | Adres | Ölçüm 1 (kod değişmeden) | Ölçüm 2 (`loading.tsx` ile) |
> |---|---|---|
> | Oturumsuz `/dashboard` | 307 → `/giris` 200 | 307 → `/giris` 200 |
> | `/musteriler/abc` (geçersiz kimlik) | 404 | 200 |
> | Başka kiracının plan adresi | 404 | 200 |
> | `/olmayan-sayfa` | 404 (İngilizce) | 404 (Türkçe) |
>
> - **Bilinen sınır:** `loading.tsx` sayfayı akışla gönderdiği için, panel içinde `notFound()`
>   çağrılan sayfalar 404 ekranını gösterir ama yanıt kodu 200'dür. Var olmayan kayıt ile başka
>   firmanın kaydı **aynı kodu ve aynı ekranı** aldığı için kaydın varlığı sızmaz. Panel sayfaları
>   giriş gerektirdiği için arama motorlarına açık değildir.
> - **Değerlendirilen:** `loading.tsx`'i yalnızca Dashboard ve Abonelikler'e koymak (detay
>   sayfaları 404 kalırdı). Tutarlı yüklenme ekranı tercih edildi; sınır kabul edildi.
>
> **K11.11: Boş durum başlıkları gerçeği söyler**
> - Ortak `BosDurum` bileşeni zaten Dashboard, Müşteriler, Planlar ve Abonelikler'de vardı.
> - Müşteriler ve Planlar: varsayılan görünümde (yalnızca aktifler) başlık "Henüz … yok" yerine
>   "Aktif … yok" ve "Pasifleri göster" ipucu. Bütün kayıtları pasif olan firmada "henüz yok"
>   yanlış bilgi veriyordu. Ek sorgu yok.
> - Abonelikler: filtre seçiliyken "Bu filtrede abonelik yok".
>
> **K11.12: Form mesajlarında yalnızca tutarsız olanlar değişti**
>
> | Dosya | Değişti mi? | Neden |
> |---|---|---|
> | `IslemMesaji.tsx` | Evet | Başarıda ✓, hatada ! simgesi (`aria-hidden`); anlam yalnızca renge bırakılmaz |
> | `abonelikler/BaslatFormu.tsx` | Evet | Seçim kutusu hataları ekran okuyucuya duyurulmuyor ve kutuya bağlı değildi; `PlanFormu` ile aynı yapı (`role="alert"`, `aria-describedby`). Metinler aynı |
> | `(auth)/actions.ts`, `GirisFormu.tsx`, `KayitFormu.tsx` | Evet | Kendi mesaj türü ve kutusu vardı; tarayıcı doğrulaması açıktı (sunucunun Türkçe mesajı görünmüyordu); hatada e-posta siliniyordu. Ortak `FormDurumu`, `IslemMesaji` ve `noValidate`'e geçildi; e-posta (kayıtta firma adı ve ad soyad) korunur, **parola hiçbir zaman geri gönderilmez**. Mesaj metinleri ve doğrulama kuralları değişmedi |
> | `MusteriFormu`, `PlanFormu`, `CacFormu`, iki `PasifeAlDugmesi`, `SatirIslemleri` | Hayır | Zaten ortak yapıda ve tutarlı |
>
> **K11.13: Kök yerleşim Türkçe**
> - `src/app/layout.tsx`: `lang="en"` → `lang="tr"`, sekme başlığı "Create Next App" →
>   "AboneTakip", Türkçe açıklama. Ekran okuyucular Türkçe metni doğru dilde okur.
>
> ### Parça B elle sınama (test dalı)
>
> | Durum | Sonuç |
> |---|---|
> | Boş hesap (yeni firma) | Dashboard, Müşteriler, Planlar, Abonelikler boş durumları doğru; Abonelikler "önce bir müşteri ve bir plan ekleyin" |
> | Tek müşteri pasife alındı | Varsayılan görünümde "Aktif müşteri yok" ve ipucu; "Pasifleri göster" ile listede |
> | Var olmayan adres | Türkçe kök 404 |
> | Geçersiz kimlik ve başka kiracının kimliği | Aynı "Kayıt bulunamadı" ekranı ve aynı kod (K11.10) |
> | Finance → Ayarlar, Kullanıcılar | `YetkiYok`; menüde iki sayfa yok; CAC görünmez |
> | Yavaş bağlantı (Slow 4G) | Menü yerinde, yüklenme iskeleti |
> | Wi-Fi kapalıyken sayfa geçişi | Türkçe hata ekranı, ayrıntı yok; Wi-Fi açılınca "Tekrar dene" çalıştı |
> | Panel formları | Başarıda ✓, hatada !; abonelik formunda seçim kutusu hataları duyuruluyor |
> | Giriş: yanlış parola, boş form | Türkçe mesaj, tarayıcı balonu yok, e-posta korunur, parola boş |
> | Giriş: manager ve finance | İkisi de Dashboard'a düşer; rozet ve menü role göre doğru |
> | Çıkış | Giriş sayfasına döner |
> | Kayıt: kısa parola, bozuk e-posta, var olan e-posta | Sunucunun Türkçe mesajı; firma adı, ad soyad, e-posta korunur |
> | Kayıt: yeni firma | Dashboard, rozet Yönetici, boş durum |
>
> ### Parça B bilinen sınırları ve notlar
> - Yetkisiz sayfa ve `loading.tsx` sonrası panel 404'leri HTTP 200 döner (K11.8, K11.10).
> - `global-error.tsx` elle denenmedi (K11.9).
> - Yeni açılmış (hiç müşterisi olmayan) firmada da başlık "Aktif müşteri yok" görünür; ek sorgu
>   yapmamak için kabul edildi.
> - Fiyat biçimleme tekrarı: `planlar/page.tsx` (`tlBicimle`), `abonelikler/page.tsx` ve
>   `BaslatFormu.tsx` (`toLocaleString`) `bicim.tlMetni` ile aynı işi yapıyor; ayrı bir
>   temizlikte birleştirilecek.
> - **Geliştirme notu:** `npm run dev:test` yeniden başlatılırken açık kalan panel sekmeleri
>   kendini sürekli yenileyebilir. Sunucuyu yeniden başlatmadan önce `localhost:3000` sekmeleri
>   kapatılır.
> - Kullanıcılar sayfası hâlâ yer tutucu; finance denemeleri test dalında önceden açılmış finance
>   kullanıcılarıyla yapıldı.
> ```
>
> Kaydet (**Cmd + S**).
>
> ## D3) Kontroller
>
> **Komut 1:** Parça B başlığının bir kez eklendiğini doğrular; çıktı `1`.
> ```
> grep -c "### Parça B kararları" docs/02_ADR.md
> ```
> **Komut 2:** Yeni Durum satırının yerinde olduğunu doğrular; `344b753` ve `gun11b-bos-hata-ekranlari` geçen satırlar görünmeli.
> ```
> grep -n -E "344b753|gun11b-bos-hata-ekranlari" docs/02_ADR.md
> ```
> **Komut 3:** Eski Durum satırının kalmadığını doğrular; çıktı `0`.
> ```
> grep -c "Parça A kodu tamamlandı" docs/02_ADR.md
> ```
>
> ## D4) Commit (d)
>
> **Komut 4:** Yalnızca ADR değişmiş olmalı.
> ```
> git status --short
> ```
> **Komut 5:** ADR'yi hazırlar.
> ```
> git add docs/02_ADR.md
> ```
> **Üç tarama:** CLAUDE.md'deki komutlar (`--cached`); 1. boş, 2. ve 3. `0`.
>
> **Komut 6:** Commit'i atar.
> ```
> git commit -m "docs: ADR Gün 11 Parça B" -m "- Durum: Parça A birleşti (PR #37, 344b753), Parça B dalı ve commit'leri
> - K11.7-K11.13: 404, yetkisiz, hata, yüklenme ve ölçülen durum kodu, boş durum, form mesajları, kök yerleşim
> - Parça B elle sınama ve bilinen sınırlar" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> ## D5) PR
>
> 1. GitHub Desktop: dal `gun11b-bos-hata-ekranlari` → **Publish branch** → **Create Pull Request**.
> 2. Başlık: `feat: boş durum ve hata ekranları`
> 3. Açıklama:
>
> ```markdown
> ## Gün 11 • Parça B: Boş durum, hata ve yüklenme ekranları, form mesajları
>
> - Türkçe kök 404; panel içi "Kayıt bulunamadı" (başka kiracı = bulunamadı)
> - Yetkisiz: sayfa içinde YetkiYok, rol kontrolü sorgulardan önce (değişmedi), yönlendirme cümlesi
> - Panel hata ekranı (ayrıntı göstermez, Tekrar dene) ve kök global-error
> - Panel için tek yüklenme ekranı
> - Boş durum başlıkları: "Aktif … yok", "Bu filtrede abonelik yok"
> - IslemMesaji simgesi; abonelik formu hata erişilebilirliği
> - Giriş ve kayıt: ortak FormDurumu ve IslemMesaji, noValidate, değerler korunur, parola geri gönderilmez
> - Kök yerleşim: lang=tr, başlık AboneTakip
> - ADR Gün 11 Parça B (K11.7–K11.13)
>
> ## Sınama
> - `npm run lint`, `npm test`, `npm run test:db`, `npm run build` temiz
> - Durum kodu ölçümü: `loading.tsx` sonrası panel 404'leri 200; var olmayan kayıt ile başka kiracının kaydı aynı kod ve ekran (ADR K11.10)
> - Boş hesap, var olmayan adres, başka kiracının kimliği, finance → Ayarlar, yavaş yüklenme, Wi-Fi kesintisi, giriş/çıkış/kayıt akışları elle sınandı
>
> 🤖 Generated with [Claude Code](https://claude.com/claude-code)
>
> https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
> ```
>
> 4. **Create pull request** → **Squash and merge**. Onay ekranında GitHub beş commit mesajını alt alta koyar ve ek satırları tekrarlar. Açıklama kutusunu şununla değiştir, sonra **Confirm squash and merge**:
>
> ```
> - 404, yetkisiz, hata ve yüklenme ekranları
> - Boş durum ekranları
> - Abonelik formu hata erişilebilirliği ve mesaj simgesi
> - Giriş ve kayıt formlarında tutarlı mesajlar
> - ADR Gün 11 Parça B
>
> Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
> ```
>
> ## D6) Birleştirmeden sonra
>
> **Komut 7:** `main`'e geçer.
> ```
> git switch main
> ```
> **Komut 8:** Birleştirilmiş hâli indirir.
> ```
> git pull
> ```
> **Komut 9:** Son commit'i gösterir; `feat: boş durum ve hata ekranları` görünmeli.
> ```
> git --no-pager log -1 --oneline
> ```
>
> **Canlıda kısa doğrulama** (Render yayını bitince, veri yazmadan): sekme başlığı "AboneTakip"; `/olmayan-sayfa` Türkçe 404; giriş sayfasında yanlış parola → Türkçe mesaj, e-posta korunur; kendi hesabınla giriş → Dashboard ve grafik açılır.
>
> Gönderilecekler: Komut 1–3 ve 9'un çıktıları ve canlı doğrulamanın sonucu.
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **"Diğerleri tamam" (c2):** Lint, derleme, iki test komutu, üç tarama ve on sınamanın (başarılı giriş, çıkış, yanlış parola, kayıt hataları, yeni firma, manager ve finance rolleri) geçtiğini bu cümleden çıkarıyorum; ADR'deki sınama tablosu buna dayanıyor.
> 2. **Durum satırları:** ADR'deki Parça A "Durum" ve "Sonuç" satırlarının benim yazdığım beş satır olarak durduğunu varsayıyorum; değiştirdiysen D1'den önce bana yaz.
> 3. **Commit kimlikleri:** Kısa kimlikleri senin terminal çıktılarından aldım. Squash birleştirmede `main`'e tek bir yeni commit girer; ADR'deki dal commit kimlikleri dal geçmişini gösterir ve PR sayfasında görünmeye devam eder.
> 4. **Squash ekranı:** GitHub'ın onay ekranında açıklamayı düzenlemeye izin verdiğini varsayıyorum; izin vermezse varsayılan metin kalır ve ek satırları tekrarlı görünür, işlevini bozmaz.
> 5. **Canlı doğrulama:** Canlıda veri yazacak hiçbir işlem önermedim (kayıt veya müşteri ekleme yok); yalnızca okuma ve yanlış parola denemesi.

### Prompt 34 · 24 Eki 2026 14:21

````text
* feat: 404, yetkisiz, hata ve yüklenme ekranları

- Türkçe kök 404 (Sayfa bulunamadı)
- Panel hata ekranı (ayrıntı göstermez, Tekrar dene) ve kök global-error
- Panel için tek yüklenme ekranı
- YetkiYok: yönlendirme cümlesi ve Dashboard bağlantısı
- Kök yerleşim: lang=tr, başlık AboneTakip, Türkçe açıklama

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6

* feat: boş durum ekranları

- Müşteriler ve Planlar: varsayılan görünümde 'Aktif ... yok' başlığı ve Pasifleri göster ipucu
- Abonelikler: filtre seçiliyken 'Bu filtrede abonelik yok'

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6

* fix: abonelik formu hata erişilebilirliği ve mesaj simgesi

- IslemMesaji: başarıda ✓, hatada ! simgesi (aria-hidden), anlam yalnızca renge bırakılmaz
- BaslatFormu: seçim kutusu hataları kimlikli, role=alert ve aria-describedby ile bağlı (PlanFormu ile aynı yapı), mesajlar değişmedi

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6

* fix: giriş ve kayıt formlarında tutarlı mesajlar

- Ortak FormDurumu türü ve IslemMesaji bileşeni (panel formlarıyla aynı yapı)
- noValidate: tarayıcı balonları yerine sunucunun Türkçe mesajı
- Hatadan sonra e-posta (ve kayıtta firma adı, ad soyad) korunur, parola geri gönderilmez
- Mesaj metinleri ve doğrulama kuralları değişmedi

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6

* docs: ADR Gün 11 Parça B

- Durum: Parça A birleşti (PR #37, 344b753), Parça B dalı ve commit'leri
- K11.7-K11.13: 404, yetkisiz, hata, yüklenme ve ölçülen durum kodu, boş durum, form mesajları, kök yerleşim
- Parça B elle sınama ve bilinen sınırlar

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6

---------

Co-authored-by: Claude Opus 5.5 <noreply@anthropic.com>  extended ksımı böyle gözküyor
````

### Claude cevabı 33 · 24 Eki 2026 14:22

> Bu, GitHub'ın squash onay ekranındaki **varsayılan** açıklama: beş commit mesajını alt alta koymuş, ek satırları beş kez tekrarlamış ve en alta kendisi bir `---------` çizgisiyle küçük harfli `Co-authored-by` satırı eklemiş. Bu hâliyle bırakılırsa en sondaki blok yalnızca GitHub'ın satırı olur; kuraldaki "iki ek satır, tek blokta, en sonda" koşulu sağlanmaz.
>
> ## Henüz "Confirm squash and merge"e basmadıysan
>
> 1. Açıklama kutusunun içine tıkla, **Cmd + A** ile tamamını seç ve sil (alttaki `---------` ve `Co-authored-by` satırı dahil).
> 2. Şunu yapıştır:
>
> ```
> - 404, yetkisiz, hata ve yüklenme ekranları
> - Boş durum ekranları
> - Abonelik formu hata erişilebilirliği ve mesaj simgesi
> - Giriş ve kayıt formlarında tutarlı mesajlar
> - ADR Gün 11 Parça B
>
> Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
> ```
>
> 3. Başlık kutusunda `feat: boş durum ve hata ekranları (#…)` kalsın (GitHub PR numarasını kendisi ekler).
> 4. **Confirm squash and merge**.
>
> Ayrıntılı commit mesajları kaybolmaz: PR sayfasında ve dalın geçmişinde durmaya devam eder.
>
> ## Zaten birleştirdiysen
>
> Hiçbir şeyi değiştirme; `main`'in geçmişini sonradan yeniden yazmayız. Ek satırlarının hepsi metnin içinde mevcut, yalnızca biçim kurala tam uymuyor. Bu durumda bana yaz, ADR'ye bir satırlık süreç notu ekleriz ("Parça B squash mesajı GitHub'ın varsayılan biçimiyle birleştirildi").
>
> Birleştirmeden sonra önceki mesajdaki D6 adımları:
>
> **Komut 1:** `main`'e geçer.
> ```
> git switch main
> ```
> **Komut 2:** Birleştirilmiş hâli indirir.
> ```
> git pull
> ```
> **Komut 3:** Son commit'in mesajının son üç satırını gösterir; boş satırın ardından iki ek satırı görmelisin.
> ```
> git --no-pager log -1 --format=%B | tail -3
> ```
>
> Sonra canlıda kısa doğrulama (sekme başlığı, `/olmayan-sayfa`, yanlış parola mesajı, kendi hesabınla Dashboard).
>
> ---
>
> ## Varsayımlar ve emin olmadığım yerler
>
> 1. **Hangi ekrandasın:** Metnin squash onay ekranındaki açıklama kutusundan kopyalandığını ve henüz onaylanmadığını varsayıyorum.
> 2. **GitHub'ın kendi satırı:** Açıklama kutusundaki `Co-authored-by` satırını sildiğinde GitHub'ın onu yeniden eklemediğini varsayıyorum; Komut 3 son hâli gösterecek. Yeniden eklenirse metin yine de çalışır, ADR'ye not düşeriz.

