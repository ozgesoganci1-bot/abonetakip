# Gün 9: KPI dashboard ve CAC ayarı

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 22 Eki 2026 (Türkiye saati). **Kapsam:** 13 prompt ve 13 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 9 promptu: KPI dashboard (MRR, aylık churn, LTV, LTV/CAC, müşteri özeti) ve Ayarlar sayfasında CAC formu. Önce plan, onaydan sonra dört küçük commit. Plan ve uygulama ayrı bir sohbette yapıldı |
| **Ne üretildi** | `dashboard-verisi.ts`, `cac-ayari.ts`, `bicim.ts`, `canli-koruma.ts`; Dashboard ve Ayarlar sayfaları; `ayHareketi`, `turkiyeAyi`, `ltvCacSaglikliMi` fonksiyonları; churn 4 ondalık; `dev:test` ve `demo:veri` betikleri; `npm test` 59, `npm run test:db` 44 test; ADR Gün 9 bölümü |
| **Düzeltme gerekti mi** | Kısmen: (1) AI `package.json` için tam dosya önerdi; bağımlılık listesi gerçek dosyayla aynı çıktı, yine de tam dosya yerine yalnızca betik satırları elle eklendi. (2) `canli-koruma.ts` onaylı planda yoktu, AI ekledi; kod ayrı incelenip kabul edildi (canlı veritabanına yanlışlıkla yazmayı engeller). (3) Elle test yalnızca test dalında yapıldı, `npm run dev` kullanılmadı |

## Gün 9 sohbeti (plan, onaylar, dört commit ve test sonuçları)

_Plan ve uygulama bu sohbette yapıldı._

### Prompt 1 · 22 Eki 2026 21:05

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
``` ## Gün 9 • KPI dashboard

**Amaç:** Metrikleri yöneticiye anlaşılır tek ekranda göstermek.

```
[Görev] Dashboard sayfasını yaz. Metrik fonksiyonlarını (Gün 8) gerçek
kiracı verisiyle birleştir.

İçerik:
- Üstte dört KPI kartı: MRR, aylık churn, LTV, LTV/CAC.
- LTV/CAC kartında 3 ve üzeri "sağlıklı", altı "dikkat" olarak
  etiketlenir (renk ve metin birlikte, yalnızca renge güvenilmez).
- Her kartta tek cümlelik açıklama (örn. "MRR: her ay düzenli gelen
  abonelik geliri").
- Altta kısa özet: aktif müşteri sayısı, bu ay yeni başlayan, bu ay iptal
  eden.
- Ayarlar bölümü (yalnızca manager): CAC değeri düzenlenir. Finance bu
  alanı göremez, sunucu tarafında da reddedilir.
- Veri yoksa anlaşılır boş durum mesajı: "Henüz abonelik yok, ilk
  aboneliği ekleyin".
- "Hesaplanamadı" durumunda değer yerine açıklayıcı metin göster, "NaN"
  veya "Infinity" asla görünmesin.

[Kısıtlar]
- Tüm veri merkezi tenant yardımcısıyla çekilir.
- Hesaplamayı sayfa içinde yeniden yazma, Gün 8'deki fonksiyonları kullan.
- Executive, sade ve okunaklı tasarım. Aşırı süsleme yok.
- Bu günün kapsamında grafik ve SSE yok.

[Format] 1) Sayfa yerleşimini kısa bir metin taslağıyla göster, veri
akışını açıkla (onay bekle). 2) Dosyalar tam yollarıyla. 3) Elle test:
elimde 3 müşteri ve 2 iptal olduğunda ekranda ne görmem gerektiğini
hesaplayarak yaz, ben karşılaştırayım.

[Doğrulama] Yetki ve tenant kontrollerini, boş veri ve sıfıra bölme
durumlarını sırayla düşün. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Dört KPI doğru görünüyor (elle hesapla karşılaştır)
- [ ] Finance CAC'yi değiştiremiyor (sunucu tarafında da)
- [ ] Boş veride hata yerine mesaj çıkıyor
- **Commit:** `feat: KPI dashboard`

```
````

### Claude cevabı 1 · 22 Eki 2026 21:06

> # Gün 9: KPI dashboard planı (1. adım, onayını bekliyor)
>
> Kurallar gereği bu adımda kod yok. Önce yerleşimi ve veri akışını gösteriyorum. Onaylarsan dosyaları yazarım.
>
> ## 1) Sayfa yerleşimi (metin taslağı)
>
> ```
> ┌──────────────────────────────────────────────────────────────┐
> │  Dashboard                          Ekim 2026 • [Firma adı]  │
> ├──────────────┬──────────────┬──────────────┬─────────────────┤
> │ MRR          │ Aylık churn  │ LTV          │ LTV / CAC       │
> │ 12.500 TL    │ %4,0         │ 25.000 TL    │ 5,0             │
> │ Her ay       │ Bu ay        │ Bir müşteri- │ ✓ Sağlıklı      │
> │ düzenli gelen│ aboneliğini  │ nin bizimle  │ (3 ve üzeri)    │
> │ abonelik     │ bırakan      │ kaldığı süre │                 │
> │ geliri.      │ müşteri oranı│ boyunca      │ Müşteri kazanma │
> │              │              │ getirdiği    │ maliyetinin kaç │
> │              │              │ toplam gelir.│ katı geri döner.│
> ├──────────────┴──────────────┴──────────────┴─────────────────┤
> │  Özet:  Aktif müşteri 25  •  Bu ay yeni 3  •  Bu ay iptal 1  │
> ├──────────────────────────────────────────────────────────────┤
> │  Ayarlar (yalnızca manager görür)                            │
> │  Müşteri edinme maliyeti (CAC): [ 5000 ] TL   [Kaydet]       │
> └──────────────────────────────────────────────────────────────┘
> ```
>
> - **Durum etiketi:** LTV/CAC kartında "✓ Sağlıklı" (yeşil) ya da "! Dikkat" (turuncu) gösterilir. Simge ve metin her zaman birlikte durur, renk görülmese de anlam kaybolmaz.
> - **Hesaplanamadı durumları:** Değer yerine "—" ve kısa bir açıklama gösterilir:
>   - Ay başında aktif müşteri yoksa churn için: "Ay başında aktif müşteri yok"
>   - Churn 0 ise LTV için: "Bu ay iptal yok, ömür hesaplanamıyor"
>   - CAC girilmemişse LTV/CAC için: "CAC girilmedi" (manager'a "Ayarlardan girin" notu eklenir)
> - **Boş durum:** Kiracının hiç aboneliği yoksa kartlar yerine tek bir kutu gösterilir: "Henüz abonelik yok, ilk aboneliği ekleyin", yanında abonelik sayfasına bir bağlantı.
>
> ## 2) Veri akışı
>
> 1. Kullanıcı `/dashboard` sayfasını açar. Sayfa bir sunucu bileşenidir, yani hesaplama tarayıcıda değil sunucuda yapılır.
> 2. Sunucu oturumu okur. Oturum yoksa kullanıcı giriş sayfasına yönlendirilir. `tenantId` ve `role` yalnızca oturumdan alınır.
> 3. Merkezi tenant yardımcısıyla şu veriler çekilir:
>    - **SUBSCRIPTIONS + PLANS:** ACTIVE abonelikler ve plan fiyat/aralığı (MRR, aktif müşteri sayısı için)
>    - **SUBSCRIPTION_EVENTS:** Bu aydaki STARTED ve CANCELED olayları (yeni/iptal sayıları), ay başındaki aktif müşteri sayısını bulmak için de ay başından önceki olaylar
>    - **TENANTS:** CAC değeri
> 4. Bu ham sayılar Gün 8'deki saf fonksiyonlara verilir. Sayfada yeni formül yazılmaz.
> 5. Fonksiyonların "hesaplanamadı" sonucu (örneğin `null`) kartta açıklayıcı metne çevrilir.
> 6. **CAC kaydetme:** Form bir sunucu eylemine (server action) gider. Eylem şu sırayla çalışır:
>    - Oturum kontrolü
>    - `role === "manager"` kontrolü, değilse reddedilir
>    - Girdi doğrulama: tam sayı ve 0'dan büyük
>    - Tenant yardımcısıyla yalnızca o kiracının CAC değeri güncellenir
>    - Sayfa yenilenir
>
> **Etkilenen tablolar:** Okuma için TENANTS, PLANS, SUBSCRIPTIONS ve SUBSCRIPTION_EVENTS. Yazma yalnızca TENANTS tablosunda, CAC alanında. Yeni tablo yok. Yeni paket de planlamıyorum.
>
> ## 3) Yetki, tenant ve hata durumları
>
> - **Dashboard görüntüleme:** manager ve finance ikisi de görebilir.
> - **Ayarlar bölümü:** finance için sayfaya hiç eklenmez. Bu tek başına yetki sayılmaz, asıl kontrol sunucu eyleminde yapılır.
> - **Tenant izolasyonu:** Her sorgu merkezi yardımcıdan geçer. Formda `tenantId` alanı bulunmaz.
> - **Hatalı CAC girdisi:** Boş, negatif, ondalıklı ya da metin girilirse form altında Türkçe hata mesajı çıkar.
> - **"Bu ay" sınırı:** Ay başı ve ay sonu Türkiye saatine (Europe/Istanbul) göre hesaplanır. Render sunucusu UTC çalıştığı için bunu açıkça yapmak gerekiyor. Aksi hâlde ayın ilk gecesi 00:00 ile 03:00 arasındaki iptaller yanlış aya düşer.
>
> ## 4) Elle test için ön hesap
>
> "3 müşteri, 2 iptal" senaryosunu netleştirmek için şu örneği öneriyorum:
>
> | Müşteri | Plan | Durum |
> |---|---|---|
> | A | Aylık 1.000 TL | ACTIVE |
> | B | Yıllık 12.000 TL | Bu ay CANCELED |
> | C | Aylık 500 TL | Bu ay CANCELED |
>
> CAC 5.000 TL ve üçü de ay başında aktifti. Bu durumda ekranda şunlar görünmeli:
>
> | Metrik | Hesap | Sonuç |
> |---|---|---|
> | MRR | Yalnızca A | 1.000 TL |
> | Churn | 2 / 3 | %66,7 |
> | ARPU | 1.000 / 1 | 1.000 TL |
> | Ortalama ömür | 1 / 0,667 | 1,5 ay |
> | LTV | 1.000 × 1,5 | 1.500 TL |
> | LTV/CAC | 1.500 / 5.000 | 0,3, "! Dikkat" |
> | Özet | | Aktif 1 • Yeni 0 • İptal 2 |
>
> Bu senaryo uygun mu? Kodu yazdıktan sonra 3. adımda bu hesabı kesinleştiririm.
>
> ## Senden ihtiyacım olanlar
>
> Mevcut yapıya uymak için şu dosyaların içeriğini yapıştırır mısın? Yapıştırmadan önce `.env` değerlerini maskele.
>
> 1. `package.json`: Next.js ve Prisma sürümleri
> 2. `prisma/schema.prisma`: CAC alanı TENANTS tablosunda mı, adı ne?
> 3. Gün 8'deki metrik fonksiyonlarının dosyası: girdi ve çıktı biçimleri, "hesaplanamadı" nasıl dönüyor?
> 4. Merkezi tenant yardımcısı ve oturum okuyan yardımcı dosya(lar)
> 5. Şu anki `app/.../dashboard/page.tsx` dosyası (varsa) ve klasör yapısı: Terminal'de `ls -R app lib` çıktısı yeterli
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **CAC'nin yeri:** TENANTS tablosunda tam sayı (Int) ve boş bırakılabilir bir alan olduğunu varsayıyorum. Değilse şemaya bakıp söyleyeceğim. Alan yoksa küçük bir migration gerekir, bunu ayrıca onayına sunarım.
> - **"Bu ay":** İçinde bulunulan takvim ayı (Ekim 2026, Türkiye saati) olarak alınıyor.
> - **"Aktif müşteri":** En az bir ACTIVE aboneliği olan müşteri, tekil olarak sayılıyor.
> - **Ay başındaki aktif müşteri:** Olay kayıtlarından hesaplanacak. Gün 8 fonksiyonları bunu farklı bir yolla bekliyorsa ona uyarım.
> - **Doğrulama aracı:** Projede `zod` varsa onu kullanırım. Yoksa yeni paket eklemeden elle doğrularım.
> - **Sürüme bağlı sözdizimi:** Server action ve `cookies()` kullanımı Next.js sürümüne göre değişiyor (bazı sürümlerde `await` gerekir). `package.json` dosyasını görmeden kesin kod yazmayacağım.
>
> Yerleşim, veri akışı ve test senaryosu uygunsa onay ver ve yukarıdaki dosyaları gönder, 2. adıma geçeyim.

### Prompt 2 · 22 Eki 2026 22:12

````text
Planı onaylıyorum, şu değişikliklerle:
1. Veri akışı: churn ve MRR için olay tablosunu kullanma. Abonelikleri plan bilgisiyle getTenantDb() ile oku, Gün 8'deki AbonelikGirdisi biçimine çevir, metrikOzeti(abonelikler, ayAraligi, cac) çağır.
2. metrikler.ts içinde churn yuvarlamasını 2 yerine 4 ondalığa çıkar (ekranda %66,7 görünsün). Testleri güncelle ve çalıştır, ayrı bir commit olsun.
3. "Bu ay yeni" ve "bu ay iptal" sayıları churn ile aynı müşteri bazlı mantıkla hesaplansın. metrikler.ts'e küçük bir saf fonksiyon ekle ve birim testini yaz. Sayfada hesap yazma.
4. CAC formu dashboard'a değil mevcut /ayarlar sayfasına gidecek (yalnızca manager). Dashboard'da "CAC girilmedi" mesajı manager'a /ayarlar bağlantısı versin.
5. CAC kaydetme işlemini Gün 6'daki pasife-alma.ts gibi test edilebilir çekirdeğe ayır (kullanıcı ve db parametre alsın). test:db içine finance reddi, manager başarısı, başka firmaya yazamama testleri ekle. redirect çağrıları try/catch dışında kalsın.
6. "Bu ay" = içinde bulunulan ay, ay başından bugüne. Ay sınırı için Gün 8'deki ayAraligi'ni kullan, yeni zaman yardımcısı yazma. Kartlarda "ay başından bugüne" yazsın.
Elle test senaryon (3 müşteri, 2 iptal, CAC 5.000) doğru: MRR 1.000, churn %66,7, ömür 1,5 ay, LTV 1.500, LTV/CAC 0,3 "Dikkat", özet: aktif 1, yeni 0, iptal 2.
İstediğin dosyalar ekte.
````

_[ek dosya: gun9_cikti.txt]_

### Claude cevabı 2 · 22 Eki 2026 22:13

> Onayın için teşekkürler. Kodu yazmaya başlamadan önce iki şeyi netleştirmem ve birkaç dosyayı daha görmem gerekiyor. Gönderdiğin dosyalara bakarken senaryoyla ilgili önemli bir sorun da fark ettim.
>
> ## Önemli: elle test senaryosu arayüzden kurulamaz
>
> Senaryodaki hesap doğru, ama bu verilerle arayüzden kurulamaz. Abonelik başlatıldığında `startedAt` "şu an" olur. Bugün arayüzden 3 abonelik başlatıp 2'sini iptal edersen ekranda şunlar çıkar:
>
> - Ay başında aktif müşteri olmadığı için churn **"hesaplanamadı"** görünür.
> - Özet **"yeni 1, iptal 0"** olur. Bunun sebebi, aynı ay içinde başlayıp biten iki müşterinin müşteri bazlı kurala göre hiçbir yere sayılmaması.
>
> Yani beklenen ekranı (%66,7, 1.500 TL, "yeni 0, iptal 2") görmek için abonelikleri **geçen ay başlamış** olarak kaydetmemiz gerekiyor. Önerim:
>
> 1. **Otomatik test:** Aynı senaryoyu tarihleri elle verilmiş hâliyle `metrikler.test.ts` içine birim testi olarak eklerim. Ekrandaki sayıların kaynağı bu testle kanıtlanır.
> 2. **Görsel kontrol için demo verisi:** Geliştirme veritabanına sahte "Demo Yazılım" firması kuran küçük bir betik yazarım. Betik 3 müşteriyi ve geçmiş tarihli abonelikleri ekler, 2 aboneliği bu ay iptal eder. Bu firmayla giriş yapıp ekranı kendi hesabınla karşılaştırırsın.
>
> ## Sana iki soru
>
> **1. Demo verisi betiği eklensin mi?** Önerim evet. Betik ham `prisma` kullanır, tıpkı `veri.ts` gibi, ve yalnızca sahte veri yazar.
>
> **2. CAC alanına 0 girilebilsin mi?** Önerim evet, 0 "CAC girilmedi" anlamına gelsin. Böylece manager değeri sıfırlayabilir. Kurallar şöyle olur:
> - Fiyatla aynı kurallar: yalnızca rakam, nokta ve virgül yok, en fazla 10.000.000
> - Fark olarak 0'a izin verilir
>
> ## Uygulayacağım kararlar (itirazın yoksa)
>
> **Yeni ve iptal sayısı:** `metrikler.ts` dosyasına `ayHareketi(abonelikler, aralik)` adında saf bir fonksiyon eklenir. Fonksiyon `{ yeni, iptal }` döndürür ve churn ile aynı iki anı kullanır:
> - **iptal:** Ay başında aktif olup ayın son anında aktif aboneliği kalmayan müşteri. Bu sayı churn payıyla birebir aynıdır.
> - **yeni:** Ay başında aktif değilken ayın son anında aktif olan müşteri.
> - Sonuç olarak plan değiştiren ve aynı ay içinde gelip giden müşteri hiçbirine sayılmaz.
>
> **Churn gösterimi:** Churn 0,6667 olarak saklanır, ekranda yüzde ve 1 ondalıkla gösterilir: %66,7.
>
> **CAC kaydetme çekirdeği:** `src/lib/cac-ayari.ts` dosyası `(kullanici, db, girdi)` parametrelerini alır. Hangi firmaya yazılacağını yalnızca `db` belirler. Çekirdek önce `db.tenant.findFirst` ile kendi firmasını bulur, sonra `update` yapar. Formdan hiçbir kimlik alınmaz.
>
> **Abonelik çevirimi:** Prisma kaydından `AbonelikGirdisi` biçimine çevirme işi `src/lib/dashboard-verisi.ts` dosyasında yapılır. Bu dosya da `db` parametresi alır, sayfada hesap yazılmaz.
>
> **Commit sırası:**
> 1. `refactor: churn 4 ondalık`: `metrikler.ts` ve `metrikler.test.ts`
> 2. `feat: CAC ayarı`: `validation.ts`, `cac-ayari.ts`, `cac-ayari.test.ts`, `package.json` (test:db), `ayarlar/actions.ts`, `ayarlar/CacFormu.tsx`, `ayarlar/page.tsx`
> 3. `feat: KPI dashboard`: `ayHareketi` ve testi, `dashboard-verisi.ts`, `dashboard/page.tsx`, demo betiği
>
> **Testleri sen çalıştıracaksın.** Ben senin bilgisayarına erişemiyorum. Her committen önce sana `npm test` ve `npm run test:db` komutlarını vereceğim, çıktıyı bana yapıştırırsın.
>
> ## Görmem gereken dosyalar
>
> Mevcut yapıya uymak ve tahmin etmemek için şu dosyalara ihtiyacım var:
>
> - **Testler:** `metrikler.test.ts`, `pasife-alma.test.ts` ve test altyapısı (`veri.ts`, `kancalar.mjs`, `kurallar.test.ts`). Testleri güncellemek ve aynı kalıpta yenisini yazmak için gerekli. `kurallar.test.ts` yeni dosyalarda yasak bir şey olup olmadığını da kontrol ediyor olabilir.
> - **`donem.ts`:** `Aralik` tipi ve "şu anki ay" için hazır bir yardımcı olup olmadığını görmek için.
> - **Arayüz bileşenleri ve form kalıbı:** Bileşenlerin hangi bilgileri aldığını ve formun nasıl kurulduğunu görmek için.
>
> Hepsini tek dosyada toplamak için Terminal'de proje klasöründeyken şu komutu çalıştır. Komut, listedeki dosyaların içeriğini başlıklarıyla birlikte `gun9_ek.txt` dosyasına yazar:
>
> ```zsh
> for f in src/lib/donem.ts src/lib/metrikler.test.ts src/lib/pasife-alma.test.ts src/test-destek/veri.ts src/test-destek/kancalar.mjs src/test-destek/kurallar.test.ts src/components/ui/Kart.tsx src/components/ui/Rozet.tsx src/components/ui/BosDurum.tsx src/components/ui/SayfaBasligi.tsx src/components/ui/FormAlani.tsx src/components/ui/Dugme.tsx src/components/ui/IslemMesaji.tsx "src/app/(panel)/YetkiYok.tsx" "src/app/(panel)/musteriler/MusteriFormu.tsx"; do echo "### $f"; cat "$f"; echo; done > gun9_ek.txt
> ```
>
> Bu dosyalarda secret olmaması gerekir. Yine de göndermeden önce içinde `npg_` ya da `neon.tech` geçmediğine bir göz at.
>
> İki sorunun cevabını ve `gun9_ek.txt` dosyasını gönderdiğinde 1. committen başlarım.
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **CAC 0:** "Girilmedi" anlamına geldiğini varsayıyorum. `ltvCacOrani` fonksiyonu da 0'ı böyle yorumluyor.
> - **Mevcut testler:** Rakamlarını görmedim. Churn yuvarlamasının hangi testleri bozacağını dosyayı görünce söyleyeceğim.
> - **Prisma 7 ve Tenant tablosunda `update`:** `update` tekil bir `where` ister. Bu yüzden önce `findFirst` ile firmayı bulmayı planladım. `tenant.ts` uzantısı yine de `id` alanını oturumdaki değerle eziyor, yani iki katmanlı koruma olacak.

### Prompt 3 · 22 Eki 2026 22:16

````text
Cevaplarım:
1. Demo verisi betiği: evet, şu koşullarla. (a) Yalnızca test dalında çalışsın, veri.ts gibi TEST_VERITABANI koruması olsun ve .env.test ile çalıştırılsın, canlı veritabanına asla yazmasın. (b) kurallar.test.ts ham prisma kuralını bozmasın: veri.ts yardımcılarını kullan ya da kuralı bilinçli ve gerekçeli olarak güncelle. (c) Betik yeni firma veya kullanıcı oluşturmasın, depoya parola girmesin. Mevcut bir test kullanıcısının e-postasını parametre alsın ve o firmaya sahte müşteri ve abonelikleri eklesin. (d) Betiği sadece benim isteğimle çalıştıracağım, otomatik çalışmasın.
2. CAC 0: evet, 0 "girilmedi" anlamına gelsin. Fiyat kurallarıyla aynı, yalnızca 0'a izin ver.
Diğer kararların hepsi uygun: ayHareketi (yeni/iptal), churn 4 ondalık ve %66,7 gösterimi, cac-ayari.ts çekirdeği, dashboard-verisi.ts, 3 commit sırası. Commit mesajlarında ASCII dışı karakter sorunu olursa söyle.
Kodu yazmadan önce her commit için hangi dosyaları değiştireceğini ve test beklentisini kısaca yaz, ben onaylayayım.
gun9_ek.txt ekte.
````

_[ek dosya: gun9_ek.txt]_

### Claude cevabı 3 · 22 Eki 2026 22:18

> Her commit için değişecek dosyalar ve test beklentileri aşağıda. Kod yok, onayını bekliyorum. Sondaki dört karar senin onayını gerektiriyor.
>
> ## Commit 1: `refactor: churn 4 ondalık`
>
> **Dosyalar**
>
> | Dosya | İşlem |
> |---|---|
> | `src/lib/metrikler.ts` | Değiştir. Churn yuvarlaması 2'den 4 ondalığa çıkar, dosya başındaki yuvarlama açıklaması güncellenir. LTV/CAC 2 ondalıkta kalır. |
> | `src/lib/metrikler.test.ts` | Değiştir. Elle test senaryosu yeni bir test olarak eklenir. |
>
> **Eklenecek test (senin onayladığın senaryo):** Üç müşteri Eylül'de başlar: A aylık 1.000 TL, B yıllık 12.000 TL, C aylık 500 TL. B 10 Ekim'de, C 20 Ekim'de iptal eder. CAC 5.000 TL. Beklenen değerler:
>
> | Metrik | Beklenen |
> |---|---|
> | MRR | 1.000 |
> | Churn | 0,6667 |
> | Ömür | 1,5 |
> | LTV | 1.500 |
> | LTV/CAC | 0,3 |
>
> **Test beklentisi**
> - Mevcut testlerin hiçbiri bozulmaz. Mevcut churn beklentileri (0,04 ve 0) her iki yuvarlamada da aynı sonucu verir.
> - Yeni test, değişiklikten önce çalıştırılırsa kırmızı olur (0,67 ≠ 0,6667), sonra yeşile döner. Bunu ister misin? İstersen önce yalnızca testi verip kırmızıyı gösterebilirim.
> - `npm test` tamamen yeşil olmalı.
>
> ## Commit 2: `feat: CAC ayarı`
>
> **Dosyalar**
>
> | Dosya | İşlem |
> |---|---|
> | `src/lib/validation.ts` | Değiştir. `cacDogrula` eklenir. Fiyat kontrolü ortak bir iç fonksiyona alınır, `fiyatDogrula` mesajları birebir aynı kalır. |
> | `src/lib/validation.test.ts` | Yeni. `npm test` kapsamında, veritabanı gerektirmez. |
> | `src/lib/cac-ayari.ts` | Yeni. `cacKaydetCekirdek(kullanici, db, girdi)` sırasıyla rol kontrolü, doğrulama, `findFirst` ile firmayı bulma ve `update` yapar. |
> | `src/lib/cac-ayari.test.ts` | Yeni. `npm run test:db` kapsamında. |
> | `package.json` | Değiştir. Yeni test dosyaları `test` ve `test:db` betiklerine eklenir. Yeni paket yok. |
> | `src/app/(panel)/ayarlar/actions.ts` | Yeni. Sunucu işlemi oturumu okur, çekirdeği çağırır, `/ayarlar` ve `/dashboard` sayfalarını yeniler. `requireUser` ve `getTenantDb` çağrıları try/catch dışında kalır. |
> | `src/app/(panel)/ayarlar/CacFormu.tsx` | Yeni. `MusteriFormu` kalıbıyla yazılır: `useActionState`, `FormAlani`, `Dugme`, `IslemMesaji`. |
> | `src/app/(panel)/ayarlar/page.tsx` | İçeriği tamamen değiştir. Finance kullanıcısı `YetkiYok` görür, manager mevcut CAC değerini ve formu görür. |
>
> **Test beklentisi**
>
> `validation.test.ts` (fiyat kontrolünün ortak fonksiyona taşınmasını da korur):
> - CAC için `"0"`, `"5000"` ve `"10000000"` kabul edilir.
> - CAC için `""`, `"-5"`, `"12,5"`, `"1.000"`, `"abc"` ve `"10000001"` reddedilir.
> - Fiyat için `"0"` hâlâ reddedilir.
>
> `cac-ayari.test.ts`, sırayla:
> 1. **Finance reddi:** Finance kullanıcısı `MESAJ.yetkiYok` alır, A'nın CAC değeri 0 kalır.
> 2. **Geçersiz girdi:** Manager geçersiz bir değer girerse alan hatası alır, değer değişmez.
> 3. **Manager başarısı:** Manager `"5000"` girer ve başarılı olur, A'nın CAC değeri 5000 olur. Ardından `"0"` girer, değer 0'a döner.
> 4. **Başka firmaya yazamama:** `dbA` ile kaydedildiğinde B'nin CAC değeri 0 kalır. Ayrıca `dbA.tenant.update({ where: { id: B.tenantId } })` doğrudan denenir ve B değişmez. Bu, tenant uzantısının `id` alanını ezdiğini kanıtlar.
>
> `npm test` ve `npm run test:db` tamamen yeşil olmalı.
>
> **Elle kontrol:** Finance kullanıcısı `/ayarlar` sayfasında "yetkiniz yok" mesajını görür. Manager CAC'yi kaydettiğinde yeşil mesaj çıkar.
>
> ## Commit 3: `feat: KPI dashboard`
>
> **Dosyalar**
>
> | Dosya | İşlem |
> |---|---|
> | `src/lib/metrikler.ts` | Değiştir. `ayHareketi(abonelikler, aralik)` ve `turkiyeAyi(an)` eklenir. `turkiyeAyi` için aşağıdaki 1. karara bak. |
> | `src/lib/metrikler.test.ts` | Değiştir. Yeni testler eklenir. |
> | `src/lib/bicim.ts` | Yeni, saf fonksiyonlar. Para gösterimi `1.500 TL`, yüzde gösterimi `%66,7`, oran gösterimi `0,3`. Türkçe biçim Node'un yerleşik `Intl` özelliğiyle yapılır. |
> | `src/lib/bicim.test.ts` | Yeni. `npm test` kapsamında. |
> | `src/lib/dashboard-verisi.ts` | Yeni. `dashboardVerisi(db, simdi)` abonelikleri plan bilgisiyle okur, `AbonelikGirdisi` biçimine çevirir ve `metrikOzeti` ile `ayHareketi` fonksiyonlarını çağırır. Olay tablosu kullanılmaz. |
> | `src/lib/dashboard-verisi.test.ts` | Yeni. `npm run test:db` kapsamında. |
> | `src/components/ui/Rozet.tsx` | Değiştir. "Dikkat" etiketi için sarı ton eklenir. 2. karara bak. |
> | `src/app/(panel)/dashboard/KpiKarti.tsx` | Yeni. Mevcut `Kart` bileşenini kullanır. |
> | `src/app/(panel)/dashboard/page.tsx` | İçeriği tamamen değiştir. |
> | `src/test-destek/veri.ts` | Değiştir. Demo betiği için e-postadan firma kimliğini bulan küçük bir fonksiyon eklenir. |
> | `src/test-destek/demo-verisi.ts` | Yeni. Demo betiği, kuralları aşağıda. |
> | `package.json` | Değiştir. Yeni testler eklenir, ayrıca `demo:veri` ve `dev:test` betikleri. `dev:test` için 3. karara bak. |
>
> **Dashboard'daki CAC eksik mesajı:** LTV hesaplandığı hâlde LTV/CAC hesaplanamıyorsa CAC girilmemiş demektir. Bu durumda mesaj role göre değişir:
> - **Manager:** "CAC girilmedi" yazısı ve `/ayarlar` bağlantısı görür.
> - **Finance:** "CAC girilmedi. Firma yöneticisi Ayarlar'dan girebilir." yazısını görür, bağlantı görmez.
>
> **Kart etiketleri:** Churn kartında ve özet satırında "ay başından bugüne" yazar.
>
> **Demo betiği, senin koşullarına göre:**
> - `veri.ts` dosyası içe aktarılır. Böylece `TEST_VERITABANI` koruması otomatik çalışır.
> - Betik yalnızca `.env.test` ile çalışır: `npm run demo:veri -- eposta@ornek.com`.
> - E-postadan firma bulma işi ham `prisma` gerektirir. Bu yüzden o fonksiyon `veri.ts` içine konur ve `kurallar.test.ts` hiç değişmez.
> - Kayıtlar `tenantaBagliDb(firmaId)` üzerinden yazılır, yani tenant filtresinden geçer.
> - Yeni firma veya kullanıcı oluşturulmaz, depoya parola girmez.
> - Firmada zaten abonelik varsa betik hiçbir şey yazmadan durur. Böylece hem rakamlar karışmaz hem de betik iki kez çalıştırılamaz.
> - Tarihler çalıştırıldığı aya göre hesaplanır. Başlangıçlar önceki ayın 1'i, iptaller "şimdiden 10 ve 5 dakika önce" olur. Ayın ilk 10 dakikasında çalıştırılırsa betik durur.
>
> **Test beklentisi**
>
> `metrikler.test.ts`, `ayHareketi` için:
>
> | Senaryo | Beklenen |
> |---|---|
> | Senin senaryon | yeni 0, iptal 2 |
> | Ders örneği | yeni 2, iptal 2 |
> | Plan değiştiren müşteri | yeni 0, iptal 0 |
> | Gelip aynı ay giden müşteri | yeni 0, iptal 0 |
>
> Ayrıca her senaryoda "iptal ÷ ay başındaki müşteri = churn" eşitliği kontrol edilir.
>
> `metrikler.test.ts`, `turkiyeAyi` için:
> - 31 Ekim 21:00 UTC → Kasım
> - 31 Ekim 20:59 UTC → Ekim
> - 31 Aralık 21:00 UTC → Ocak 2027
>
> `bicim.test.ts`:
> - 0,6667 → `%66,7`
> - 1500 → `1.500 TL`
> - 0,3 → `0,3`
> - 5 → `5`
>
> `dashboard-verisi.test.ts` (kiracı izolasyonu): B'nin de aboneliği olduğu hâlde A'nın verisinde yalnızca A görünür. Beklenen MRR 1.000 ve aktif müşteri 1.
>
> Son olarak `npm test`, `npm run test:db` ve `npm run build` (tip kontrolü dahil) yeşil olmalı.
>
> **Elle kontrol:**
> - Demo verisiyle ekran senin hesabınla eşleşir.
> - Hiç aboneliği olmayan firmada "Henüz abonelik yok, ilk aboneliği ekleyin" mesajı çıkar.
> - Finance kullanıcısı ayarlar bağlantısını görmez.
>
> ## Onayını istediğim dört karar
>
> **1. `turkiyeAyi` fonksiyonu.** `ayAraligi(yil, ay)` hangi ay olduğunu bilmek ister. Ama "şu an Türkiye'de hangi aydayız" sorusunun cevabı da bir hesap gerektirir. Gece 00:00 ile 03:00 arasında UTC hâlâ önceki aydadır. Bu yüzden `metrikler.ts` içine 3 satırlık `turkiyeAyi(an)` fonksiyonunu ekliyorum. Fonksiyon mevcut `TURKIYE_FARKI_MS` sabitini kullanır, ayrı bir zaman dosyası açılmaz. Bunu "yeni zaman yardımcısı" sayarsan alternatifi söyle.
>
> **2. Rozet'e sarı ton eklenmesi.** Rozet'te şu an sarı ton yok. Planda "Dikkat" etiketini turuncu demiştim. Önerim `Rozet.tsx` dosyasına `sari` tonu eklemek. Ortak bir bileşene dokunmak istemezsen mevcut `kirmizi` tonunu kullanırım.
>
> **3. Demo verisini tarayıcıda görmek için `dev:test` betiği.** Demo verisi test dalına yazılır, ama `npm run dev` `.env` dosyasını, yani geliştirme dalını okur. Bu yüzden ekranda göremezsin. Çözüm olarak `"dev:test"` betiğini ekliyorum. Betik uygulamayı `.env.test` ile, yani test dalına bağlı açar. Next.js, işlem ortamında zaten tanımlı olan değişkenleri `.env` dosyasıyla ezmez, bu yüzden test dalı kullanılır. Bunun anlamı şu:
> - Test kullanıcısını da bu modda kayıt olarak oluşturman gerekir.
> - `test:db` bu firmayı silmez, çünkü yalnızca kendi çalışmasında oluşturduğu firmaları siler.
>
> **4. Commit mesajları ve ASCII.** Git ve GitHub UTF-8 kullanır, macOS zsh varsayılanı da UTF-8'dir. "ı" harfi sorun çıkarmaz. Yine de tamamen güvenli olmak istersen ASCII sürümleri şöyle: `refactor: churn 4 ondalik`, `feat: CAC ayari`.
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **Yüzde biçimi:** `Intl` ile Türkçe yüzde biçiminin `%66,7` (işaret başta) olacağını varsayıyorum. `bicim.test.ts` bunu doğrulayacak. Farklı çıkarsa fonksiyonu düzeltirim.
> - **`dev:test` ile kayıt:** Uygulama test dalına bağlıyken kayıt ve giriş normal çalışır. Oturum anahtarının `.env.test` içinde de tanımlı olması gerekir. Bunu senin kontrol etmen lazım, değerini bana yazma.
> - **Commit 3'ün büyüklüğü:** Bu commit büyük. İstersen demo betiğini ayrı bir dördüncü commit yapabilirim: `chore: demo verisi betiği`.
>
> Dört kararı onaylarsan ya da değiştirirsen 1. commitin dosyalarını yazarım.

### Prompt 4 · 22 Eki 2026 22:20

````text
Planı onaylıyorum, dört karar:
1. turkiyeAyi: evet, metrikler.ts içinde, mevcut TURKIYE_FARKI_MS ile.
2. Rozet.tsx'e sarı ton: evet. "Dikkat" etiketinde simge ve metin yine birlikte dursun.
3. dev:test betiği: evet. Düzeltme: bizde ayrı bir "geliştirme dalı" yok, .env canlı veritabanını gösteriyor, .env.test test dalını gösteriyor. Demo betiği ve dev:test yalnızca test dalıyla çalışsın, ikisi de canlıya yazmasın ya da bağlanmasın. Betiklerin açıklamasında bunu belirt. Test kullanıcılarını gerekirse test dalında bu modda ben oluşturacağım.
4. Commit mesajları: Türkçe karakterli kalsın (ASCII'ye gerek yok).
Ek istekler: (a) Demo betiği ve dev:test ayrı bir 4. commit olsun: "chore: demo verisi ve test dalında çalıştırma betiği". (b) Commit 1'de önce kırmızı test adımına gerek yok, doğrudan yaz. (c) Her commit'ten sonra git push değil, dal ve PR ile ilerleyeceğim: ilk önce dal adını ver (örneğin gun9-dashboard), commit'leri o dalda yapacağım, PR ve squash merge ile main'e gireceğiz. main'e doğrudan push yok. (d) Her commit öncesi taramalar (parola, sunucu adı, kişisel bilgi) ve npm test, npm run test:db, build çıktılarını sana yapıştıracağım.
1. commitin dosyalarını yaz.
````

### Claude cevabı 4 · 22 Eki 2026 22:22

> Commit 1'in dosyaları aşağıda. Önce dalı açıyoruz, sonra iki dosyayı değiştiriyoruz, testleri ve taramaları çalıştırıyoruz. Çıktıları bana gönderdiğinde commit komutunu birlikte çalıştıracağız.
>
> Bir not: squash merge ile PR'daki 4 commit main'de **tek commit** olur. Churn yuvarlamasının ayrı commiti main geçmişinde değil, yalnızca PR geçmişinde ayrı görünür. Bilinçli bir tercihse sorun yok.
>
> ## Adım 1: Dalı aç
>
> Terminal'de proje klasöründe sırayla çalıştır.
>
> Çalışma alanında kaydedilmemiş değişiklik olup olmadığını gösterir ("nothing to commit, working tree clean" görmelisin):
> ```zsh
> git status
> ```
>
> Ana dala geçer:
> ```zsh
> git switch main
> ```
>
> GitHub'daki son main hâlini bilgisayarına çeker:
> ```zsh
> git pull
> ```
>
> `gun9-dashboard` adında yeni bir dal açar ve ona geçer:
> ```zsh
> git switch -c gun9-dashboard
> ```
>
> ## Adım 2: `src/lib/metrikler.ts`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Değişen yerler yalnızca üç tane: dosya başındaki yuvarlama açıklaması, `MetrikOzeti` tipindeki churn yorumu ve `metrikOzeti` içindeki churn yuvarlaması (2 → 4).
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
> // "Ay başı" olarak ay başlangıcından 1 ms önceki an (önceki ayın son anı) kullanılır.
> // Böylece iki ay boşluksuz birbirine bağlanır: tam 1'i 00:00'da yapılan bir iptal
> // yeni ayın churn'üne girer. Ay başlangıcının kendisine baksaydık bu iptal hiçbir aya sayılmazdı.
> // Ay başında aktif müşteri yoksa sıfıra bölme olur -> null.
> export function aylikChurn(abonelikler: AbonelikGirdisi[], aralik: AyAraligi): number | null {
>   const ayBasiAni = new Date(aralik.baslangic.getTime() - 1);
>   const ayBasindakiler = andaAktifMusteriler(abonelikler, ayBasiAni);
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
> ```
>
> ## Adım 3: `src/lib/metrikler.test.ts`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Yeni eklenenler iki test:
> - "Gün 9 elle test senaryosu", ders örneğinden hemen sonra.
> - "churn 4 ondalığa yuvarlanır", yuvarlama bölümünde. Bu test, değeri ilk testten farklı bir sayıyla (1/3) da kontrol eder.
>
> Mevcut testlerin hiçbiri değişmedi.
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
>   const liste: AbonelikGirdisi[] = [];
>
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
>
>   const ozet = metrikOzeti(liste, EKIM_2026, 5000);
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
> // 3 müşteri Eylül'den beri aktif. Ekim'de 2'si iptal ediyor. CAC 5.000 TL.
> //   A: aylık 1.000 TL, kalıyor
> //   B: yıllık 12.000 TL (aylık 1.000), 10 Ekim'de iptal
> //   C: aylık 500 TL, 20 Ekim'de iptal
> // Beklenen: MRR 1.000, churn 0,6667 (ekranda %66,7), ARPU 1.000,
> //           ömür 1,5 ay, LTV 1.500, LTV/CAC 0,3 ("Dikkat").
> // =====================================================================
>
> test("Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000", () => {
>   const eylulBasi = tr("2026-09-01T10:00");
>   const liste = [
>     abonelik({ customerId: "a", fiyat: 1000, startedAt: eylulBasi }),
>     iptalli("b", tr("2026-10-10T10:00"), {
>       fiyat: 12000,
>       aralik: "YEARLY",
>       startedAt: eylulBasi,
>     }),
>     iptalli("c", tr("2026-10-20T10:00"), { fiyat: 500, startedAt: eylulBasi }),
>   ];
>
>   const ozet = metrikOzeti(liste, EKIM_2026, 5000);
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
> ```
>
> ## Adım 4: Testler ve taramalar
>
> Sırayla çalıştır ve çıktıların hepsini bana yapıştır.
>
> Veritabanı gerektirmeyen birim testlerini çalıştırır (metrikler dahil):
> ```zsh
> npm test
> ```
>
> Test dalındaki veritabanı testlerini çalıştırır. Bu committe değişen bir şey yok, ama dalın sağlam olduğunu doğrular:
> ```zsh
> npm run test:db
> ```
>
> Uygulamayı derler ve TypeScript tip kontrolü yapar:
> ```zsh
> npm run build
> ```
>
> Depoda Neon parolası biçiminde bir metin arar. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Depoda gerçek Neon sunucu adı arar. Sonuç `0` olmalı:
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Kişisel bilgi taramanı da her zamanki gibi çalıştır.
>
> Yalnızca iki dosyanın değiştiğini gösterir:
> ```zsh
> git status
> ```
>
> ## Adım 5: Commit (çıktıları kontrol ettikten sonra)
>
> Çıktılar temizse şu iki komutu çalıştıracağız. Henüz çalıştırma, önce çıktıları gönder.
>
> Yalnızca bu iki dosyayı commit'e hazırlar:
> ```zsh
> git add src/lib/metrikler.ts src/lib/metrikler.test.ts
> ```
>
> Commit'i oluşturur:
> ```zsh
> git commit -m "refactor: churn 4 ondalık"
> ```
>
> **Beklenen `npm test` sonucu:** Önceden kaç test geçiyorsa artı 2 test geçmeli, hiç başarısız test olmamalı. `npm run test:db` ve `npm run build` öncekiyle aynı şekilde yeşil olmalı.
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **Test ve build yeşil varsayımı:** `main` dalında `npm test`, `test:db` ve `build` komutlarının şu an yeşil olduğunu varsayıyorum. Değilse sorun bu committen kaynaklanmıyordur, önce onu ayıralım.
> - **Yeni testlerin tam eşitlik kontrolü:** İki yeni test tam eşitlik bekliyor. Ham değerden yuvarlandığı için 2/3 → 0,6667, 1/(2/3) → 1,5 ve 1/(1/3) → 3 sonuçlarının bilgisayarda tam bu değerlere yuvarlanacağını hesapladım. Yine de ondalıklı sayı hesabı olduğu için küçük bir fark çıkarsa test bunu açıkça gösterir. Öyle olursa çıktıyı gönder, düzeltirim.
> - **Dal adı:** Dal adını `gun9-dashboard` olarak kullandım. Başka bir ad istersen 3. komutta değiştir.

### Prompt 5 · 22 Eki 2026 22:29

````text
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: main
Dalınız "origin/main" ile güncel.

İşlenecek bir şey yok, çalışma ağacı temiz
kullanici@bilgisayar abonetakip % git switch main
Halihazırda 'main' üzerinde
Dalınız "origin/main" ile güncel.
kullanici@bilgisayar abonetakip % git pull
Tümü güncel.
kullanici@bilgisayar abonetakip % git switch -c gun9-dashboard
Yeni 'gun9-dashboard' dalına geçildi.
kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts

(node:75693) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (1.533291ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.6135ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.066042ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.050333ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (0.04475ms)
✔ yıllık: bir yıl sonraya taşınır (0.036333ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.036416ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.040417ms)
(node:75694) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/metrikler.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5 (0.450125ms)
✔ ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir (1.068584ms)
✔ Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000 (0.162292ms)
✔ boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null (0.066208ms)
✔ churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır (0.084958ms)
✔ ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz) (0.049959ms)
✔ CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni (0.099416ms)
✔ aktif müşteri 0: ARPU null (0.045083ms)
✔ yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83 (0.063583ms)
✔ ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil) (0.087375ms)
✔ churn 4 ondalığa yuvarlanır: 1/3 -> 0,3333 (ham değer yuvarlanmaz) (0.061625ms)
✔ tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil (0.048208ms)
✔ ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi (0.160583ms)
✔ 1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez (0.046875ms)
✔ tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir (0.062917ms)
✔ aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır (0.051292ms)
✔ ay içinde gelip aynı ay giden müşteri churn'e girmez (0.039167ms)
✔ ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir (0.040958ms)
✔ mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi' (0.373667ms)
(node:75695) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (1.681292ms)
✔ 7 gün sonra süresi dolar (0.081791ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.078ms)
✔ imzası değiştirilen belirteç geçersizdir (0.053917ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.062834ms)
✔ biçimi bozuk belirteçler geçersizdir (0.062458ms)
(node:75696) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.700917ms)
✔ finance yönetici değildir (0.149125ms)
(node:75697) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (1.062041ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (8.464291ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (2.255ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.48675ms)
ℹ tests 39
ℹ suites 0
ℹ pass 39
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 218.007584
kullanici@bilgisayar abonetakip % npm run test:db

> abonetakip@0.1.0 test:db
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts

(node:75711) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/pasife-alma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:75711) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ müşteriyi pasife alamaz, kayıt değişmez (87.577208ms)
  ✔ planı pasife alamaz, kayıt değişmez (67.700833ms)
✔ finance kullanıcısı (3472.220792ms)
▶ manager kullanıcısı: engellenen durumlar
  ✔ B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (295.217542ms)
  ✔ B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (140.618833ms)
  ✔ biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır (0.659583ms)
  ✔ aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı) (393.091291ms)
  ✔ aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı) (197.674083ms)
✔ manager kullanıcısı: engellenen durumlar (1028.70175ms)
▶ manager kullanıcısı: başarılı pasife alma
  ✔ aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der (533.474334ms)
  ✔ aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der (441.599ms)
✔ manager kullanıcısı: başarılı pasife alma (976.123333ms)
(node:75712) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:75712) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://ww for libpq SSL mode definitions.
▶ Müşteriler
  ✔ liste yalnızca A'nın müşterilerini getirir (91.13875ms)
  ✔ B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique) (146.622584ms)
  ✔ B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez (420.30975ms)
  ✔ eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır (138.553458ms)
✔ Müşteriler (3667.700584ms)
▶ Planlar
  ✔ liste yalnızca A'nın planlarını getirir (254.868ms)
  ✔ B'nin planı kimlikle aranınca bulunamaz (141.683083ms)
  ✔ B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez (137.811667ms)
✔ Planlar (535.588292ms)
▶ Abonelikler ve olaylar
  ✔ liste yalnızca A'nın aboneliklerini getirir (235.935417ms)
  ✔ B'nin aboneliği kimlikle aranınca bulunamaz (148.2745ms)
  ✔ işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez (898.843334ms)
  ✔ A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder) (727.208417ms)
  ✔ A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder) (917.644458ms)
  ✔ aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz (451.638208ms)
✔ Abonelikler ve olaylar (3381.177458ms)
▶ Firma tablosu
  ✔ A yalnızca kendi firmasını görür (69.07425ms)
  ✔ A, B'nin firma ayarını (CAC) değiştiremez (161.705083ms)
  ✔ firma eklenemez ve silinemez (1.209542ms)
✔ Firma tablosu (232.501167ms)
▶ Filtre korumaları
  ✔ güncelleme verisinde tenantId varsa işlem durdurulur (66.410583ms)
  ✔ ilişki alanıyla güncelleme reddedilir (tenant: connect) (0.927ms)
  ✔ ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz (297.261291ms)
  ✔ iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır (81.236041ms)
  ✔ kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz (133.28625ms)
✔ Filtre korumaları (580.090916ms)
▶ Silme koruması
  ✔ müşteri, plan, abonelik ve olaylarda deleteMany reddedilir, kayıtlar yerinde kalır (458.698917ms)
  ✔ tek kayıt silme (delete) de reddedilir, kayıtlar yerinde kalır (505.081083ms)
  ✔ kullanıcı (User) tablosunda silme filtre tarafından engellenmez (319.11625ms)
✔ Silme koruması (1283.721792ms)
(node:75714) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/duman.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:75714) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www. for libpq SSL mode definitions.
✔ tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor (0.258083ms)
✔ var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor) (783.026459ms)
✔ var olmayan firma adına firma tablosunda hiçbir kayıt görünmez (66.352459ms)
ℹ tests 36
ℹ suites 9
ℹ pass 36
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 18345.743334
kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 54ms

  Creating an optimized production build ...
✓ Compiled successfully in 497ms
  Running TypeScript ...
  Finished TypeScript in 885ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 392ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 77ms
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

kullanici@bilgisayar abonetakip % git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
0
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: gun9-dashboard
İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
	değiştirildi:         src/lib/metrikler.test.ts
	değiştirildi:         src/lib/metrikler.ts

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)
````

### Claude cevabı 5 · 22 Eki 2026 22:29

> Hepsi temiz, commit'e hazır.
>
> **Sonuçlar:**
> - **`npm test`:** 39 testin 39'u geçti. İki yeni test de geçiyor ("Gün 9 elle test senaryosu" ve "churn 4 ondalığa yuvarlanır").
> - **`npm run test:db`:** 36 testin 36'sı geçti.
> - **`npm run build`:** Başarılı, TypeScript hatası yok.
> - **Taramalar:** Parola taraması boş, sunucu adı taraması `0`.
> - **`git status`:** Yalnızca iki dosya değişmiş.
>
> **Eksik bir çıktı:** Kişisel bilgi taramanın çıktısını göremedim. Commit'ten önce onu da çalıştır. Temizse aşağıdaki komutlara geç.
>
> ## Commit
>
> Yalnızca bu iki dosyayı commit'e hazırlar:
> ```zsh
> git add src/lib/metrikler.ts src/lib/metrikler.test.ts
> ```
>
> Commit'i oluşturur:
> ```zsh
> git commit -m "refactor: churn 4 ondalık"
> ```
>
> Bu daldaki commit'i tek satırla gösterir. En üstte `refactor: churn 4 ondalık` görmelisin:
> ```zsh
> git --no-pager log --oneline -3
> ```
>
> Push şimdilik yok. Dördüncü commit bittiğinde dalı GitHub'a gönderip PR açacağız.
>
> ## Çıktıdaki uyarılar
>
> Bunlar bu commit'le ilgili değil, önceden de vardı. İkisi de testleri bozmuyor, şimdilik dokunmuyoruz:
>
> - **`MODULE_TYPELESS_PACKAGE_JSON`:** Node, test dosyalarının ES modül olduğunu kendisi anlıyor ve sadece performans uyarısı veriyor. Önerdiği `"type": "module"` ayarını eklemiyoruz. Bu ayar Next.js ve Prisma yapılandırmasını etkileyebilir, kapsam dışı bir risk.
> - **SSL modu uyarısı:** `.env.test` içindeki bağlantı adresindeki `sslmode=require` ayarından geliyor. Şu an en güvenli mod (`verify-full`) gibi davranıyor. Uyarı, ileride bir sürümde bu davranışın değişeceğini söylüyor. İleride adresin sonundaki ayarı `sslmode=verify-full` yapmak yeterli olur. Bunu `.env.test` ve Render ortam değişkeninde sen yaparsın, değeri bana yazma. Bunu Gün 9'un dışında ayrı bir iş olarak not etmeni öneririm.
>
> Commit çıktısını gönderdiğinde 2. commitin (`feat: CAC ayarı`) dosyalarını yazarım.

### Prompt 6 · 22 Eki 2026 22:29

````text
kullanici@bilgisayar abonetakip % git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
0
````

### Claude cevabı 6 · 22 Eki 2026 22:30

> Bu, sunucu adı taramasının çıktısı ve sonucu yine `0`, temiz. Ancak kişisel bilgi taramasının çıktısı ve commit çıktısı burada yok.
>
> Kişisel bilgi taraması için hazır bir komutun yoksa şu ikisini kullanabilirsin. İkisi de içerik basmaz, yalnızca eşleşme bulunan dosyaların adını listeler.
>
> Depoda `example.com` ve `ornek.com` dışında bir e-posta adresi geçen dosyaları listeler. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -l -I -E "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" | xargs -r git --no-pager grep -L -I -E "@(example|ornek)\.com" ; git --no-pager grep -l -I -E "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" | xargs -r git --no-pager grep -c -I -E "@(gmail|hotmail|outlook|icloud|yahoo)\.com"
> ```
>
> Bu komut uzun ve okunması zor. Daha sade hâli şu, gerçek e-posta sağlayıcılarının adreslerini arar. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com"
> ```
>
> Türkiye cep telefonu biçiminde numara geçen dosyaları listeler. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
> ```
>
> Uzun komut yerine yalnızca son iki sade komutu çalıştırman yeterli. Kendi kişisel bilgi taraman varsa onu kullan.
>
> Çıktılar boşsa commit komutlarını çalıştır:
>
> ```zsh
> git add src/lib/metrikler.ts src/lib/metrikler.test.ts
> ```
>
> ```zsh
> git commit -m "refactor: churn 4 ondalık"
> ```
>
> ```zsh
> git --no-pager log --oneline -3
> ```
>
> Tarama ve commit çıktılarını gönderdiğinde 2. commite geçeriz.

### Prompt 7 · 22 Eki 2026 22:31

````text
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com" 
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
kullanici@bilgisayar abonetakip % git add src/lib/metrikler.ts src/lib/metrikler.test.ts
kullanici@bilgisayar abonetakip % git commit -m "refactor: churn 4 ondalık"
[gun9-dashboard 73ff2ca] refactor: churn 4 ondalık
 2 files changed, 59 insertions(+), 3 deletions(-)
kullanici@bilgisayar abonetakip % git --no-pager log --oneline -3
73ff2ca (HEAD -> gun9-dashboard) refactor: churn 4 ondalık
1ccec5c (origin/main, origin/HEAD, main) docs: Gün 8 kayıtları (prompt günlüğü satırı, prompt ve cevap dosyası, README) (#31)
65be7f4 Gün 8 metrik hesaplama fonksiyonları ve ADR kararları (#30)
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 7 · 22 Eki 2026 22:34

> Commit 1 tamam (`73ff2ca`), taramalar da temiz. Şimdi 2. commit, `feat: CAC ayarı`.
>
> **Önemli bir güvenlik notu:** `npm run dev` `.env` dosyasını, yani **canlı veritabanını** okur. Bu yüzden bu commitin elle kontrolünü (finance kullanıcısının reddedilmesi, manager'ın kaydetmesi) şimdi yapmayalım. 4. committe `dev:test` geldiğinde test dalında hepsini birlikte kontrol ederiz. Bu commitin doğruluğunu şimdilik otomatik testler kanıtlıyor.
>
> **Plandan bir sapma:** `dbA.tenant.update({ where: { id: B.tenantId } })` testini yazmadım. Bu kontrol `tenant.test.ts` içinde zaten var: "A, B'nin firma ayarını (CAC) değiştiremez" testi az önce yeşil geçti. Onun yerine çekirdek düzeyinde bir izolasyon testi ekledim: A ve B kendi değerlerini bağımsız kaydeder.
>
> ## Dosya 1: `src/lib/validation.ts`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Değişen yerler:
> - `fiyatDogrula` içindeki sayı kontrolü `tamSayiTlCoz` adında ortak bir iç fonksiyona taşındı. Fiyat mesajları harfi harfine aynı kaldı, yeni testler bunu kilitliyor.
> - Dosyanın sonuna `cacDogrula` eklendi. Fiyattan tek farkı 0'a izin vermesi.
>
> ```ts
> // Formların sunucu tarafı doğrulaması: kayıt ve giriş, müşteri, plan,
> // abonelik başlatma ve CAC ayarı formları. Tarayıcıdaki kontrollere güvenilmez;
> // her form sunucuda bu dosyadaki fonksiyonlarla yeniden kontrol edilir.
> // Bu dosyadaki fonksiyonlar "saf"tır: veritabanına veya çereze dokunmazlar,
> // aynı girdiye her zaman aynı sonucu verirler. Bu yüzden kolay test edilirler.
>
> // Doğrulama sonucu: ya temiz değer döner, ya da kullanıcıya gösterilecek hata.
> export type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };
>
> // Basit e-posta biçimi: boşluk içermez, "@" ve noktalı bir alan adı vardır.
> const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
>
> // Parola sınırları. bcrypt en fazla 72 baytı dikkate alır, bu yüzden üst sınır var.
> const PAROLA_EN_AZ = 8;
> const PAROLA_EN_COK_BAYT = 72;
>
> // Başındaki ve sonundaki boşlukları siler. Metin değilse boş metin döner.
> function temizle(girdi: unknown): string {
>   return typeof girdi === "string" ? girdi.trim() : "";
> }
>
> // Genel metin alanı kontrolü (firma adı, ad soyad).
> export function metinDogrula(
>   girdi: unknown,
>   alanAdi: string,
>   enAz: number,
>   enCok: number
> ): Sonuc<string> {
>   const metin = temizle(girdi);
>   if (metin.length === 0) {
>     return { ok: false, hata: `${alanAdi} boş bırakılamaz.` };
>   }
>   if (metin.length < enAz) {
>     return { ok: false, hata: `${alanAdi} en az ${enAz} karakter olmalıdır.` };
>   }
>   if (metin.length > enCok) {
>     return { ok: false, hata: `${alanAdi} en fazla ${enCok} karakter olabilir.` };
>   }
>   return { ok: true, deger: metin };
> }
>
> // E-posta kontrolü. Başarılıysa küçük harfe çevrilmiş hâli döner.
> // Neden küçük harf? PostgreSQL'de "Ali@x.com" ile "ali@x.com" farklı sayılır,
> // bu yüzden aynı kişi iki kez kayıt olabilirdi.
> export function epostaDogrula(girdi: unknown): Sonuc<string> {
>   const eposta = temizle(girdi).toLowerCase();
>   if (eposta.length === 0) {
>     return { ok: false, hata: "E-posta adresi boş bırakılamaz." };
>   }
>   if (eposta.length > 254 || !EPOSTA_DESENI.test(eposta)) {
>     return { ok: false, hata: "Lütfen geçerli bir e-posta adresi girin." };
>   }
>   return { ok: true, deger: eposta };
> }
>
> // Parola kontrolü. Parolanın başı ve sonu ASLA kırpılmaz (kullanıcı ne yazdıysa o).
> export function parolaDogrula(girdi: unknown): Sonuc<string> {
>   if (typeof girdi !== "string" || girdi.length === 0) {
>     return { ok: false, hata: "Parola boş bırakılamaz." };
>   }
>   if (girdi.length < PAROLA_EN_AZ) {
>     return {
>       ok: false,
>       hata: `Parola en az ${PAROLA_EN_AZ} karakter olmalıdır.`,
>     };
>   }
>   // Türkçe karakterler (ğ, ş, ı gibi) 2 bayt sayılır, bu yüzden bayt olarak ölçülür.
>   if (new TextEncoder().encode(girdi).length > PAROLA_EN_COK_BAYT) {
>     return { ok: false, hata: "Parola çok uzun. Daha kısa bir parola seçin." };
>   }
>   return { ok: true, deger: girdi };
> }
>
> // Kayıt formundan gelen temizlenmiş ve doğrulanmış değerler.
> export type KayitGirdisi = {
>   firmaAdi: string;
>   adSoyad: string;
>   eposta: string;
>   parola: string;
> };
>
> // Kayıt formunun tamamını kontrol eder. İlk bulduğu hatayı döner.
> export function kayitGirdisiniDogrula(girdi: {
>   firmaAdi: unknown;
>   adSoyad: unknown;
>   eposta: unknown;
>   parola: unknown;
> }): Sonuc<KayitGirdisi> {
>   const firma = metinDogrula(girdi.firmaAdi, "Firma adı", 2, 100);
>   if (!firma.ok) return firma;
>
>   const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
>   if (!ad.ok) return ad;
>
>   const eposta = epostaDogrula(girdi.eposta);
>   if (!eposta.ok) return eposta;
>
>   const parola = parolaDogrula(girdi.parola);
>   if (!parola.ok) return parola;
>
>   return {
>     ok: true,
>     deger: {
>       firmaAdi: firma.deger,
>       adSoyad: ad.deger,
>       eposta: eposta.deger,
>       parola: parola.deger,
>     },
>   };
> }
>
> // ---------- Müşteri ve plan formları (Gün 4) ----------
>
> // Form doğrulama sonucu: ya temiz değerler, ya da alan bazında hatalar.
> // Kayıt formundan farkı: ilk hatada durmaz, bütün alanların hatasını birlikte döner.
> export type AlanSonucu<T, Alan extends string> =
>   | { ok: true; deger: T }
>   | { ok: false; alanHatalari: Partial<Record<Alan, string>> };
>
> // Kayıt kimliği (id) kontrolü. Kimlikler cuid biçimindedir: küçük harf ve rakam.
> // Biçimi bozuk kimlik için de "bulunamadı" denir; neyin yanlış olduğu söylenmez.
> const KIMLIK_DESENI = /^[a-z0-9]{1,50}$/;
>
> export function kimlikDogrula(girdi: unknown): Sonuc<string> {
>   const kimlik = temizle(girdi);
>   if (!KIMLIK_DESENI.test(kimlik)) {
>     return { ok: false, hata: "Kayıt bulunamadı." };
>   }
>   return { ok: true, deger: kimlik };
> }
>
> // İsteğe bağlı e-posta: boşsa null döner, doluysa normal e-posta kontrolü yapılır.
> export function istegeBagliEpostaDogrula(girdi: unknown): Sonuc<string | null> {
>   if (temizle(girdi).length === 0) {
>     return { ok: true, deger: null };
>   }
>   return epostaDogrula(girdi);
> }
>
> // Fiyat sınırı. Veritabanındaki Int sütunu yaklaşık 2,1 milyara kadar sayı alır;
> // gerçekçi bir üst sınır koyarak taşmayı ve yazım hatalarını önlüyoruz.
> export const FIYAT_EN_COK = 10_000_000;
>
> // TL tutarı (tam sayı) kontrolünün ortak çekirdeği (Gün 9).
> // Fiyat ve CAC aynı yazım kurallarını kullanır. Bu fonksiyon mesaj üretmez,
> // yalnızca hatanın TÜRÜNÜ söyler. Her alan kendi Türkçe mesajını seçer;
> // böylece fiyat mesajları Gün 4'teki hâliyle birebir aynı kalır.
> // 0 burada hata değildir: fiyatta reddedilir, CAC'de kabul edilir.
> type TamSayiHatasi = "bos" | "eksi" | "ayirac" | "rakamDisi" | "cokBuyuk";
>
> function tamSayiTlCoz(
>   girdi: unknown
> ): { ok: true; deger: number } | { ok: false; neden: TamSayiHatasi } {
>   const metin = temizle(girdi);
>   if (metin.length === 0) return { ok: false, neden: "bos" };
>   if (metin.startsWith("-")) return { ok: false, neden: "eksi" };
>   // "1.000" (binlik) ile "12,5" (kuruş) yazımı karışmasın diye ikisi de reddedilir.
>   if (/[.,]/.test(metin)) return { ok: false, neden: "ayirac" };
>   if (!/^\d+$/.test(metin)) return { ok: false, neden: "rakamDisi" };
>   // Çok uzun rakam dizilerini sayıya çevirmeden önce eleriz.
>   const sayi = metin.length > 9 ? Infinity : Number(metin);
>   if (sayi > FIYAT_EN_COK) return { ok: false, neden: "cokBuyuk" };
>   return { ok: true, deger: sayi };
> }
>
> // Fiyat kontrolü: TL cinsinden, 0'dan büyük tam sayı (kuruş yok).
> export function fiyatDogrula(girdi: unknown): Sonuc<number> {
>   const sonuc = tamSayiTlCoz(girdi);
>   if (sonuc.ok) {
>     if (sonuc.deger === 0) {
>       return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
>     }
>     return { ok: true, deger: sonuc.deger };
>   }
>   switch (sonuc.neden) {
>     case "bos":
>       return { ok: false, hata: "Fiyat boş bırakılamaz." };
>     case "eksi":
>       return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
>     case "ayirac":
>       return {
>         ok: false,
>         hata: "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.",
>       };
>     case "rakamDisi":
>       return { ok: false, hata: "Fiyat yalnızca rakamlardan oluşmalıdır." };
>     case "cokBuyuk":
>       return {
>         ok: false,
>         hata: `Fiyat en fazla ${FIYAT_EN_COK.toLocaleString("tr-TR")} TL olabilir.`,
>       };
>   }
> }
>
> // Plan aralıkları ve ekranda gösterilen Türkçe karşılıkları.
> export const PLAN_ARALIKLARI = ["MONTHLY", "YEARLY"] as const;
> export type PlanAraligi = (typeof PLAN_ARALIKLARI)[number];
> export const ARALIK_ETIKETI: Record<PlanAraligi, string> = {
>   MONTHLY: "Aylık",
>   YEARLY: "Yıllık",
> };
>
> // Aralık kontrolü: yalnızca listedeki değerler kabul edilir.
> export function aralikDogrula(girdi: unknown): Sonuc<PlanAraligi> {
>   const metin = temizle(girdi);
>   const gecerli = (PLAN_ARALIKLARI as readonly string[]).includes(metin);
>   if (!gecerli) {
>     return { ok: false, hata: "Lütfen aylık veya yıllık aralığı seçin." };
>   }
>   return { ok: true, deger: metin as PlanAraligi };
> }
>
> // Müşteri formundan gelen temizlenmiş değerler.
> export type MusteriGirdisi = {
>   ad: string;
>   eposta: string | null;
> };
>
> // Müşteri formunun tamamını kontrol eder.
> export function musteriGirdisiniDogrula(girdi: {
>   ad: unknown;
>   eposta: unknown;
> }): AlanSonucu<MusteriGirdisi, "ad" | "eposta"> {
>   const ad = metinDogrula(girdi.ad, "Müşteri adı", 2, 100);
>   const eposta = istegeBagliEpostaDogrula(girdi.eposta);
>
>   if (ad.ok && eposta.ok) {
>     return { ok: true, deger: { ad: ad.deger, eposta: eposta.deger } };
>   }
>
>   const alanHatalari: Partial<Record<"ad" | "eposta", string>> = {};
>   if (!ad.ok) alanHatalari.ad = ad.hata;
>   if (!eposta.ok) alanHatalari.eposta = eposta.hata;
>   return { ok: false, alanHatalari };
> }
>
> // Plan formundan gelen temizlenmiş değerler.
> export type PlanGirdisi = {
>   ad: string;
>   fiyat: number;
>   aralik: PlanAraligi;
> };
>
> // Plan formunun tamamını kontrol eder.
> export function planGirdisiniDogrula(girdi: {
>   ad: unknown;
>   fiyat: unknown;
>   aralik: unknown;
> }): AlanSonucu<PlanGirdisi, "ad" | "fiyat" | "aralik"> {
>   const ad = metinDogrula(girdi.ad, "Plan adı", 2, 100);
>   const fiyat = fiyatDogrula(girdi.fiyat);
>   const aralik = aralikDogrula(girdi.aralik);
>
>   if (ad.ok && fiyat.ok && aralik.ok) {
>     return {
>       ok: true,
>       deger: { ad: ad.deger, fiyat: fiyat.deger, aralik: aralik.deger },
>     };
>   }
>
>   const alanHatalari: Partial<Record<"ad" | "fiyat" | "aralik", string>> = {};
>   if (!ad.ok) alanHatalari.ad = ad.hata;
>   if (!fiyat.ok) alanHatalari.fiyat = fiyat.hata;
>   if (!aralik.ok) alanHatalari.aralik = aralik.hata;
>   return { ok: false, alanHatalari };
> }
>
> // ---------- Abonelik formları (Gün 5) ----------
>
> // Abonelik başlatma formundan gelen temizlenmiş değerler.
> export type AbonelikBaslatGirdisi = {
>   musteriId: string;
>   planId: string;
> };
>
> // Seçim kutusundan gelen kimliği kontrol eder.
> // Hiçbir şey seçilmediyse "seçin" der. Kimlik biçimi bozuksa (formla oynanmışsa)
> // "bulunamadı" der; neyin yanlış olduğu söylenmez.
> function secimDogrula(
>   girdi: unknown,
>   secimMesaji: string,
>   bulunamadiMesaji: string
> ): Sonuc<string> {
>   if (temizle(girdi).length === 0) {
>     return { ok: false, hata: secimMesaji };
>   }
>   const kimlik = kimlikDogrula(girdi);
>   if (!kimlik.ok) {
>     return { ok: false, hata: bulunamadiMesaji };
>   }
>   return kimlik;
> }
>
> // Abonelik başlatma formunun tamamını kontrol eder.
> // Müşteri ve planın bu firmaya ait ve aktif olduğu burada DEĞİL, veritabanı
> // sorgusunda (actions.ts) kontrol edilir.
> export function abonelikBaslatGirdisiniDogrula(girdi: {
>   musteriId: unknown;
>   planId: unknown;
> }): AlanSonucu<AbonelikBaslatGirdisi, "musteriId" | "planId"> {
>   const musteri = secimDogrula(
>     girdi.musteriId,
>     "Lütfen bir müşteri seçin.",
>     "Seçilen müşteri bulunamadı."
>   );
>   const plan = secimDogrula(
>     girdi.planId,
>     "Lütfen bir plan seçin.",
>     "Seçilen plan bulunamadı."
>   );
>
>   if (musteri.ok && plan.ok) {
>     return { ok: true, deger: { musteriId: musteri.deger, planId: plan.deger } };
>   }
>
>   const alanHatalari: Partial<Record<"musteriId" | "planId", string>> = {};
>   if (!musteri.ok) alanHatalari.musteriId = musteri.hata;
>   if (!plan.ok) alanHatalari.planId = plan.hata;
>   return { ok: false, alanHatalari };
> }
>
> // ---------- CAC ayarı (Gün 9) ----------
>
> // CAC üst sınırı fiyatla aynıdır.
> export const CAC_EN_COK = FIYAT_EN_COK;
>
> // CAC kontrolü: TL cinsinden tam sayı (kuruş yok). Fiyattan tek farkı: 0 kabul edilir.
> // 0, "CAC girilmedi" anlamına gelir. Bu durumda LTV/CAC hesaplanmaz
> // (bkz. metrikler.ts, ltvCacOrani). Böylece yönetici değeri sıfırlayabilir.
> export function cacDogrula(girdi: unknown): Sonuc<number> {
>   const sonuc = tamSayiTlCoz(girdi);
>   if (sonuc.ok) return { ok: true, deger: sonuc.deger };
>   switch (sonuc.neden) {
>     case "bos":
>       return { ok: false, hata: "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın." };
>     case "eksi":
>       return { ok: false, hata: "CAC negatif olamaz." };
>     case "ayirac":
>       return {
>         ok: false,
>         hata: "CAC değerini nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 5000). Kuruş girilmez.",
>       };
>     case "rakamDisi":
>       return { ok: false, hata: "CAC yalnızca rakamlardan oluşmalıdır." };
>     case "cokBuyuk":
>       return {
>         ok: false,
>         hata: `CAC en fazla ${CAC_EN_COK.toLocaleString("tr-TR")} TL olabilir.`,
>       };
>   }
> }
> ```
>
> ## Dosya 2: `src/lib/validation.test.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // DOĞRULAMA BİRİM TESTİ (Gün 9)
> //
> // Çalıştırmak için: npm test
> // Veritabanı gerekmez.
> // İki amacı var:
> //   1. Gün 9'da fiyat kontrolü ortak bir iç fonksiyona taşındı. Fiyat mesajlarının
> //      Gün 4'teki hâliyle HARFİ HARFİNE aynı kaldığını kilitler.
> //   2. Yeni CAC kontrolünü test eder: fiyatla aynı kurallar, tek fark 0 kabul edilir.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { fiyatDogrula, cacDogrula, type Sonuc } from "./validation.ts";
>
> // Sonuç başarılıysa değeri döner, değilse testi durdurur.
> function deger(sonuc: Sonuc<number>): number {
>   assert.ok(sonuc.ok, `başarılı olmalıydı, hata geldi: ${sonuc.ok ? "" : sonuc.hata}`);
>   return sonuc.deger;
> }
>
> // Sonuç hatalıysa mesajı döner, değilse testi durdurur.
> function hata(sonuc: Sonuc<number>): string {
>   assert.ok(!sonuc.ok, "hata vermeliydi, başarılı oldu");
>   return sonuc.hata;
> }
>
> // ---------- Fiyat (mesajlar Gün 4'teki gibi kalmalı) ----------
>
> test("fiyat: geçerli tam sayılar kabul edilir", () => {
>   assert.equal(deger(fiyatDogrula("1000")), 1000);
>   assert.equal(deger(fiyatDogrula("  1000  ")), 1000); // baştaki/sondaki boşluk silinir
>   assert.equal(deger(fiyatDogrula("10000000")), 10_000_000); // üst sınır dahil
> });
>
> test("fiyat: 0 ve negatif reddedilir (mesaj değişmedi)", () => {
>   assert.equal(hata(fiyatDogrula("0")), "Fiyat 0'dan büyük olmalıdır.");
>   assert.equal(hata(fiyatDogrula("-5")), "Fiyat 0'dan büyük olmalıdır.");
> });
>
> test("fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi)", () => {
>   assert.equal(hata(fiyatDogrula("")), "Fiyat boş bırakılamaz.");
>   assert.equal(hata(fiyatDogrula(null)), "Fiyat boş bırakılamaz.");
>   const ayiracMesaji =
>     "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.";
>   assert.equal(hata(fiyatDogrula("12,5")), ayiracMesaji);
>   assert.equal(hata(fiyatDogrula("1.000")), ayiracMesaji);
>   assert.equal(hata(fiyatDogrula("abc")), "Fiyat yalnızca rakamlardan oluşmalıdır.");
>   assert.equal(hata(fiyatDogrula("10000001")), "Fiyat en fazla 10.000.000 TL olabilir.");
>   assert.equal(hata(fiyatDogrula("12345678901")), "Fiyat en fazla 10.000.000 TL olabilir.");
> });
>
> // ---------- CAC ----------
>
> test("CAC: 0 kabul edilir ('girilmedi' anlamında)", () => {
>   assert.equal(deger(cacDogrula("0")), 0);
>   assert.equal(deger(cacDogrula("00")), 0);
> });
>
> test("CAC: geçerli tam sayılar kabul edilir", () => {
>   assert.equal(deger(cacDogrula("5000")), 5000);
>   assert.equal(deger(cacDogrula("  5000  ")), 5000);
>   assert.equal(deger(cacDogrula("10000000")), 10_000_000); // üst sınır dahil
> });
>
> test("CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir", () => {
>   assert.equal(hata(cacDogrula("")), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
>   assert.equal(hata(cacDogrula("-5")), "CAC negatif olamaz.");
>   assert.equal(hata(cacDogrula("-0")), "CAC negatif olamaz.");
>   const ayiracMesaji =
>     "CAC değerini nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 5000). Kuruş girilmez.";
>   assert.equal(hata(cacDogrula("12,5")), ayiracMesaji);
>   assert.equal(hata(cacDogrula("1.000")), ayiracMesaji);
>   assert.equal(hata(cacDogrula("abc")), "CAC yalnızca rakamlardan oluşmalıdır.");
>   assert.equal(hata(cacDogrula("+5000")), "CAC yalnızca rakamlardan oluşmalıdır.");
>   assert.equal(hata(cacDogrula("10000001")), "CAC en fazla 10.000.000 TL olabilir.");
> });
>
> test("CAC: metin olmayan girdi (null, sayı) boş sayılır", () => {
>   // Formdan her zaman metin gelir. Başka bir şey gelirse (formla oynanmışsa) boş sayılır.
>   assert.equal(hata(cacDogrula(null)), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
>   assert.equal(hata(cacDogrula(5000)), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
> });
> ```
>
> ## Dosya 3: `src/lib/cac-ayari.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // CAC AYARI KAYDETME ÇEKİRDEĞİ (Gün 9)
> //
> // pasife-alma.ts ile aynı yapıdadır: asıl mantık burada, sunucu işlemi
> // (app/(panel)/ayarlar/actions.ts) yalnızca oturumu okur, bu fonksiyonu çağırır
> // ve sayfaları yeniler.
> // Kullanıcıyı ve veritabanı nesnesini PARAMETRE olarak aldığı için testlerden
> // doğrudan çağrılabilir. Böylece "finance CAC'yi değiştiremez" kuralı otomatik
> // testle kontrol edilir (cac-ayari.test.ts).
> //
> // Uygulamada parametreler her zaman oturumdan gelir, formdan asla gelmez:
> //   kullanici -> requireUser()
> //   db        -> getTenantDb()  (tenantId filtresi otomatik)
> // Hangi firmanın CAC'sinin değişeceğini YALNIZCA "db" belirler. Formda firma
> // kimliği yoktur. tenant.ts ayrıca Tenant güncellemesinde "id" koşulunu oturumdaki
> // değerle ezer; yani iki katmanlı koruma vardır.
>
> import type { AktifKullanici } from "./auth";
> import type { TenantDb } from "./tenant";
> import { yoneticiMi } from "./yetki";
> import { cacDogrula } from "./validation";
> import { MESAJ, type FormDurumu } from "./islem";
>
> // Çekirdeğin kullanıcıdan ihtiyaç duyduğu tek bilgi rolüdür.
> type IslemYapan = Pick<AktifKullanici, "role">;
>
> // CAC değerini kaydeder. YALNIZCA manager yapabilir.
> // cacGirdisi: formdan gelen ham değer (formData.get("cac")). Burada doğrulanır.
> // 0 kabul edilir ve "CAC girilmedi" anlamına gelir.
> export async function cacKaydetCekirdek(
>   kullanici: IslemYapan,
>   db: TenantDb,
>   cacGirdisi: unknown
> ): Promise<FormDurumu> {
>   // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
>   if (!yoneticiMi(kullanici.role)) {
>     return { durum: "hata", mesaj: MESAJ.yetkiYok };
>   }
>
>   // Hata olursa form, kullanıcının yazdığıyla yeniden doldurulur.
>   const yazilan = typeof cacGirdisi === "string" ? cacGirdisi : "";
>
>   // 2) Girdi doğrulama (sunucuda).
>   const sonuc = cacDogrula(cacGirdisi);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: { cac: sonuc.hata },
>       degerler: { cac: yazilan },
>     };
>   }
>
>   // 3) Kendi firmasını bul ve güncelle. Tenant filtresi yüzünden findFirst
>   //    yalnızca oturumdaki firmayı görebilir.
>   try {
>     const firma = await db.tenant.findFirst({ select: { id: true } });
>     if (!firma) {
>       return { durum: "hata", mesaj: MESAJ.bulunamadi };
>     }
>     await db.tenant.update({
>       where: { id: firma.id },
>       data: { cac: sonuc.deger },
>       select: { id: true },
>     });
>   } catch {
>     // Ayrıntı kullanıcıya gösterilmez ve loglanmaz.
>     console.error("CAC kaydedilirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler: { cac: yazilan } };
>   }
>
>   const mesaj =
>     sonuc.deger === 0
>       ? "CAC sıfırlandı. LTV/CAC oranı, CAC girilene kadar hesaplanmaz."
>       : `CAC ${sonuc.deger.toLocaleString("tr-TR")} TL olarak kaydedildi.`;
>
>   return { durum: "basarili", mesaj, degerler: { cac: String(sonuc.deger) } };
> }
> ```
>
> ## Dosya 4: `src/lib/cac-ayari.test.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // ROL VE KİRACI TESTLERİ: CAC AYARI (Gün 9)
> //
> // Ne test edilir? src/lib/cac-ayari.ts içindeki cacKaydetCekirdek.
> // Sunucu işleminin (ayarlar/actions.ts) çağırdığı fonksiyonun aynısıdır.
> // Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
> //
> // Not: "A, tenant.update ile B'nin kimliğini verse bile B'yi değiştiremez" kontrolü
> // tenant.test.ts içinde zaten var ("A, B'nin firma ayarını (CAC) değiştiremez").
> // Burada aynı kural çekirdek fonksiyon düzeyinde test edilir.
> //
> // Sıra önemlidir: CAC değerini gerçekten değiştiren testler sondadır.
> // Test firmaları CAC = 0 (varsayılan) ile oluşturulur.
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import { cacKaydetCekirdek } from "./cac-ayari.ts";
> import { MESAJ } from "./islem.ts";
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
> // Kısa yardımcı: firmanın kayıtlı CAC değeri
> async function cacOku(db: TenantDb): Promise<number | undefined> {
>   return (await db.tenant.findFirst({ select: { cac: true } }))?.cac;
> }
>
> describe("finance kullanıcısı", () => {
>   test("CAC'yi değiştiremez, kayıt değişmez", async () => {
>     const sonuc = await cacKaydetCekirdek({ role: "finance" }, dbA, "5000");
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
>     assert.equal(await cacOku(dbA), 0);
>   });
> });
>
> describe("manager kullanıcısı: geçersiz girdi", () => {
>   test("geçersiz değerler alan hatası verir, kayıt değişmez", async () => {
>     for (const girdi of ["", "-5", "12,5", "1.000", "abc", "10000001", null]) {
>       const sonuc = await cacKaydetCekirdek({ role: "manager" }, dbA, girdi);
>       assert.equal(sonuc.durum, "hata", `"${girdi}" reddedilmeliydi`);
>       assert.equal(sonuc.mesaj, MESAJ.formHatali);
>       assert.ok(sonuc.alanHatalari?.cac, `"${girdi}" için alan hatası yok`);
>     }
>     assert.equal(await cacOku(dbA), 0);
>   });
> });
>
> describe("manager kullanıcısı: başarılı kaydetme", () => {
>   test("5000 kaydedilir, B'nin CAC'si değişmez", async () => {
>     const sonuc = await cacKaydetCekirdek({ role: "manager" }, dbA, "5000");
>     assert.equal(sonuc.durum, "basarili");
>     assert.equal(sonuc.mesaj, "CAC 5.000 TL olarak kaydedildi.");
>     assert.equal(await cacOku(dbA), 5000);
>     assert.equal(await cacOku(dbB), 0);
>   });
>
>   test("0 ile sıfırlanır ('CAC girilmedi')", async () => {
>     const sonuc = await cacKaydetCekirdek({ role: "manager" }, dbA, "0");
>     assert.equal(sonuc.durum, "basarili");
>     assert.equal(sonuc.mesaj, "CAC sıfırlandı. LTV/CAC oranı, CAC girilene kadar hesaplanmaz.");
>     assert.equal(await cacOku(dbA), 0);
>   });
> });
>
> describe("kiracı izolasyonu", () => {
>   test("A ve B kendi CAC değerlerini bağımsız tutar", async () => {
>     await cacKaydetCekirdek({ role: "manager" }, dbA, "7000");
>     await cacKaydetCekirdek({ role: "manager" }, dbB, "3000");
>     assert.equal(await cacOku(dbA), 7000);
>     assert.equal(await cacOku(dbB), 3000);
>   });
> });
> ```
>
> ## Dosya 5: `package.json`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Yalnızca iki satır değişti:
> - `test` betiğinin sonuna `src/lib/validation.test.ts` eklendi.
> - `test:db` betiğinin sonuna `src/lib/cac-ayari.test.ts` eklendi.
>
> Paket listesi aynı.
>
> ```json
> {
>   "name": "abonetakip",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "build": "next build",
>     "start": "next start",
>     "lint": "eslint",
>     "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts",
>     "test:db": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts"
>   },
>   "dependencies": {
>     "@prisma/adapter-pg": "^7.10.1",
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "next": "16.4.2",
>     "react": "19.3.0",
>     "react-dom": "19.3.0"
>   },
>   "devDependencies": {
>     "@tailwindcss/turbopack": "^4",
>     "@types/node": "^20",
>     "@types/react": "^19",
>     "@types/react-dom": "^19",
>     "dotenv": "^18.0.8",
>     "eslint": "^9",
>     "eslint-config-next": "16.4.2",
>     "prisma": "^7.10.1",
>     "tailwindcss": "^4",
>     "typescript": "^5"
>   }
> }
> ```
>
> ## Dosya 6: `src/app/(panel)/ayarlar/actions.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> "use server";
>
> // AYARLAR SUNUCU İŞLEMLERİ (Gün 9): CAC kaydetme.
> //
> // Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
> // yetki kontrolü işlemin içinde yapılır; finance kullanıcısının sayfayı
> // görememesi tek başına yeterli değildir. Rol kontrolü ve asıl mantık
> // src/lib/cac-ayari.ts içindedir (otomatik test edilebilsin diye).
> //
> // DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
> // yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
> // bloklarının DIŞINDA tutulur. Çekirdeğin içindeki try/catch yalnızca veritabanı
> // işlemini sarar.
>
> import { revalidatePath } from "next/cache";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { cacKaydetCekirdek } from "@/lib/cac-ayari";
> import type { FormDurumu } from "@/lib/islem";
>
> // CAC değerini kaydeder. YALNIZCA manager yapabilir.
> export async function cacKaydet(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>
>   const sonuc = await cacKaydetCekirdek(kullanici, db, formData.get("cac"));
>
>   // Yalnızca başarılı işlemde sayfalar yenilenir. Dashboard'daki LTV/CAC da değişir.
>   if (sonuc.durum === "basarili") {
>     revalidatePath("/ayarlar");
>     revalidatePath("/dashboard");
>   }
>   return sonuc;
> }
> ```
>
> ## Dosya 7: `src/app/(panel)/ayarlar/CacFormu.tsx`
>
> **Yeni dosya oluştur.**
>
> ```tsx
> "use client";
>
> // CAC (müşteri edinme maliyeti) ayar formu. Yalnızca manager'a gösterilir.
> // noValidate: tarayıcının kendi kontrolü kapalıdır. Bütün doğrulama sunucuda
> // yapılır ve Türkçe mesajlar her zaman aynı yerden gelir (MusteriFormu ile aynı yapı).
>
> import { useActionState } from "react";
> import FormAlani from "@/components/ui/FormAlani";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { cacKaydet } from "./actions";
>
> type Props = {
>   mevcutCac: number; // veritabanındaki değer (0 = girilmedi)
> };
>
> export default function CacFormu({ mevcutCac }: Props) {
>   const [durum, formIslemi, bekliyor] = useActionState(cacKaydet, BASLANGIC_DURUMU);
>
>   // İşlemden dönen değer varsa onu, yoksa kayıtlı değeri göster.
>   const deger = durum.degerler?.cac ?? String(mevcutCac);
>
>   return (
>     <form action={formIslemi} noValidate className="space-y-4">
>       <FormAlani
>         etiket="Müşteri edinme maliyeti (TL)"
>         name="cac"
>         inputMode="numeric"
>         defaultValue={deger}
>         hata={durum.alanHatalari?.cac}
>         yardim="Bir yeni müşteri kazanmak için harcanan ortalama tutar. Tam sayı yazın (ör. 5000). 0 yazarsanız CAC girilmemiş sayılır."
>         autoComplete="off"
>       />
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" disabled={bekliyor}>
>         {bekliyor ? "Kaydediliyor..." : "CAC'yi kaydet"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ## Dosya 8: `src/app/(panel)/ayarlar/page.tsx`
>
> **Dosyanın içeriğini tamamen şununla değiştir.**
>
> ```tsx
> import { requireManager } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import YetkiYok from "../YetkiYok";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import Kart from "@/components/ui/Kart";
> import CacFormu from "./CacFormu";
>
> // Firma ayarları (Gün 9): müşteri edinme maliyeti (CAC).
> // Yalnızca manager görür, finance kullanıcısına "yetkiniz yok" mesajı gösterilir.
> // Not: Sayfayı gizlemek yetki kontrolü değildir. Kaydetme işlemi sunucuda
> // ayrıca rol kontrolü yapar (src/lib/cac-ayari.ts).
> export default async function AyarlarSayfasi() {
>   const kullanici = await requireManager();
>   if (!kullanici) return <YetkiYok />;
>
>   // Firma bilgisi tenant filtresinden geçer: yalnızca kullanıcının kendi firması.
>   const db = await getTenantDb();
>   const firma = await db.tenant.findFirst({ select: { cac: true } });
>   const mevcutCac = firma?.cac ?? 0;
>
>   return (
>     <div>
>       <SayfaBasligi
>         baslik="Ayarlar"
>         aciklama="Firma ayarları. Bu sayfayı yalnızca firma yöneticisi görür."
>       />
>       <Kart className="max-w-xl">
>         <h2 className="text-base font-semibold text-slate-900">
>           Müşteri edinme maliyeti (CAC)
>         </h2>
>         <p className="mb-4 mt-1 text-sm text-slate-500">
>           Dashboard&apos;daki LTV/CAC oranı bu değerle hesaplanır. 3 ve üzeri sağlıklı
>           kabul edilir.
>         </p>
>         <CacFormu mevcutCac={mevcutCac} />
>       </Kart>
>     </div>
>   );
> }
> ```
>
> ## Testler ve taramalar
>
> Sırayla çalıştır ve çıktıların hepsini bana yapıştır.
>
> Birim testlerini çalıştırır. 46 testin 46'sı geçmeli (39 + 7 yeni doğrulama testi):
> ```zsh
> npm test
> ```
>
> Test dalındaki veritabanı testlerini çalıştırır. 41 testin 41'i geçmeli (36 + 5 yeni CAC testi):
> ```zsh
> npm run test:db
> ```
>
> Derler ve tip kontrolü yapar. Hatasız bitmeli:
> ```zsh
> npm run build
> ```
>
> Parola taraması. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Sunucu adı taraması. Sonuç `0` olmalı:
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Kişisel e-posta taraması. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com"
> ```
>
> Telefon numarası taraması. Çıktı boş olmalı:
> ```zsh
> git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
> ```
>
> Değişen ve yeni dosyaları gösterir. 3 değişen ve 5 yeni (izlenmeyen) dosya görmelisin:
> ```zsh
> git status
> ```
>
> **Önemli:** Yeni dosyalar henüz git tarafından izlenmediği için yukarıdaki `git grep` taramaları onları kapsamaz. Taramalar yeni dosyaları da görsün diye önce dosyaları hazırlayıp (`git add`) sonra taramaları tekrarlayacağız:
>
> Bu committeki 8 dosyayı commit'e hazırlar:
> ```zsh
> git add src/lib/validation.ts src/lib/validation.test.ts src/lib/cac-ayari.ts src/lib/cac-ayari.test.ts package.json "src/app/(panel)/ayarlar/actions.ts" "src/app/(panel)/ayarlar/CacFormu.tsx" "src/app/(panel)/ayarlar/page.tsx"
> ```
>
> Ardından dört taramayı **bir kez daha** çalıştır. `git grep` hazırlanmış dosyaları da tarar. Bu ikinci sonuçları da gönder, commit'i onlardan sonra yapacağız.
>
> > **Not:** Commit 1'deki taramalarda bu sorun yoktu, çünkü iki dosya da zaten izleniyordu. Bundan sonraki commitlerde yeni dosya olduğunda sıra hep **önce `git add`, sonra tarama** olsun.
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **Tutar biçimi:** `toLocaleString("tr-TR")` sonucunun `10.000.000` ve `5.000` olacağını varsayıyorum. Node'un varsayılan kurulumunda Türkçe biçim verisi bulunur. Testler bunu doğrulayacak.
> - **Kaydettikten sonra form:** React 19'da form işlemi bittikten sonra form alanları `defaultValue` değerine sıfırlanır. Başarılı kayıtta işlem yeni değeri döndürdüğü için alanda kaydedilen değer görünmeli. `MusteriFormu` düzenleme modu da aynı şekilde çalışıyor. Bunu 4. committe test dalında elle kontrol edeceğiz.
> - **`tenant.update` ve Prisma 7:** `select: { id: true }` ile çağrılmasının Prisma 7'de sorun çıkarmayacağını varsayıyorum. Bir sorun olursa `build` ya da `test:db` bunu gösterir.

### Prompt 8 · 22 Eki 2026 22:50

````text
kullanici@bilgisayar abonetakip % git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
0
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com" 
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: gun9-dashboard
İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
değiştirildi:         package.json
değiştirildi:         src/app/(panel)/ayarlar/page.tsx
değiştirildi:         src/lib/validation.ts

İzlenmeyen dosyalar:
  (işlenecekler arasına koymak için "git add <dosya>..." kullanın)
src/app/(panel)/ayarlar/CacFormu.tsx
src/app/(panel)/ayarlar/actions.ts
src/lib/cac-ayari.test.ts
src/lib/cac-ayari.ts
src/lib/validation.test.ts

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)
kullanici@bilgisayar abonetakip % git add)
zsh: parse error near `)'
kullanici@bilgisayar abonetakip % git add
Hiçbir şey belirtilmedi, hiçbir şey eklenmedi.
ipucu:  'git add .' mi demek istediniz?
ipucu:  Disable this message with "git config set advice.addEmptyPathspec false"
kullanici@bilgisayar abonetakip % böyle bir şeyle karşılaştım nasıl çözebilirim
````

### Claude cevabı 8 · 22 Eki 2026 22:50

> Komut kopyalanırken kesilmiş ve zsh'e yalnızca `git add)` gitmiş. Sorun bu kadar, hiçbir dosya değişmedi.
>
> Bir de şunu fark ettim: `zsh: parse error` hatasının sebebi parantez. Klasör adındaki `(panel)` zsh için özel bir karakter. Bu yüzden bu yolların tırnak içinde yazılması gerekiyor.
>
> Uzun tek satır yerine dosyaları **tek tek** ekleyelim, kopyalarken kesilme riski kalmaz. Her komut bir dosyayı commit'e hazırlar, çıktı vermez:
>
> ```zsh
> git add src/lib/validation.ts
> ```
> ```zsh
> git add src/lib/validation.test.ts
> ```
> ```zsh
> git add src/lib/cac-ayari.ts
> ```
> ```zsh
> git add src/lib/cac-ayari.test.ts
> ```
> ```zsh
> git add package.json
> ```
> ```zsh
> git add "src/app/(panel)/ayarlar/actions.ts"
> ```
> ```zsh
> git add "src/app/(panel)/ayarlar/CacFormu.tsx"
> ```
> ```zsh
> git add "src/app/(panel)/ayarlar/page.tsx"
> ```
>
> Sonra durumu kontrol et. "İşlenecek değişiklikler" başlığı altında 8 dosya görmelisin, "İzlenmeyen dosyalar" bölümü olmamalı:
> ```zsh
> git status
> ```
>
> Ardından dört taramayı tekrar çalıştır. Bu kez yeni dosyalar da taranır:
>
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> ```zsh
> git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com"
> ```
> ```zsh
> git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
> ```
>
> **Eksik çıktılar:** `npm test`, `npm run test:db` ve `npm run build` çıktılarını henüz görmedim. Onları da çalıştırıp yapıştır:
>
> ```zsh
> npm test
> ```
> ```zsh
> npm run test:db
> ```
> ```zsh
> npm run build
> ```
>
> Beklenen sonuçlar:
> - `npm test`: 46 testin 46'sı geçmeli.
> - `npm run test:db`: 41 testin 41'i geçmeli.
> - `npm run build`: Hatasız bitmeli.
>
> Hepsini gönderdiğinde commit komutunu vereceğim.

### Prompt 9 · 22 Eki 2026 22:57

````text
kullanici@bilgisayar abonetakip % git add src/lib/validation.ts
kullanici@bilgisayar abonetakip % git add src/lib/validation.test.ts
kullanici@bilgisayar abonetakip % git add src/lib/cac-ayari.tsci@192 abonetakip % git add package.json
kullanici@bilgisayar abonetakip % git add "src/app/(panel)/ayarlar/actions.ts"
kullanici@bilgisayar abonetakip % git add "src/app/(panel)/ayarlar/CacFormu.tsx"
kullanici@bilgisayar abonetakip % git add "src/app/(panel)/ayarlar/page.tsx"
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: gun9-dashboard
İşlenecek değişiklikler:
  (hazırlıktan çıkarmak için "git restore --staged <dosya>..." kullanın)
	değiştirildi:         package.json
	yeni dosya:           src/app/(panel)/ayarlar/CacFormu.tsx
	yeni dosya:           src/app/(panel)/ayarlar/actions.ts
	değiştirildi:         src/app/(panel)/ayarlar/page.tsx
	yeni dosya:           src/lib/cac-ayari.test.ts
	yeni dosya:           src/lib/cac-ayari.ts
	yeni dosya:           src/lib/validation.test.ts
	değiştirildi:         src/lib/validation.ts

kullanici@bilgisayar abonetakip % git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
0
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com" 
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts

(node:76546) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (1.66775ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.065416ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.3945ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.044667ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (0.044542ms)
✔ yıllık: bir yıl sonraya taşınır (0.035125ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.0375ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.050167ms)
(node:76547) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/metrikler.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5 (0.436834ms)
✔ ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir (0.521417ms)
✔ Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000 (0.078458ms)
✔ boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null (0.060334ms)
✔ churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır (0.058667ms)
✔ ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz) (0.049417ms)
✔ CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni (0.049625ms)
✔ aktif müşteri 0: ARPU null (0.030917ms)
✔ yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83 (0.057083ms)
✔ ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil) (0.078959ms)
✔ churn 4 ondalığa yuvarlanır: 1/3 -> 0,3333 (ham değer yuvarlanmaz) (0.059708ms)
✔ tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil (0.044375ms)
✔ ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi (0.142083ms)
✔ 1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez (0.041459ms)
✔ tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir (0.036542ms)
✔ aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır (0.035625ms)
✔ ay içinde gelip aynı ay giden müşteri churn'e girmez (0.031584ms)
✔ ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir (0.032542ms)
✔ mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi' (0.127916ms)
(node:76548) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.535542ms)
✔ 7 gün sonra süresi dolar (0.064ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.073291ms)
✔ imzası değiştirilen belirteç geçersizdir (0.055125ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.063959ms)
✔ biçimi bozuk belirteçler geçersizdir (0.056416ms)
(node:76549) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/validation.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ fiyat: geçerli tam sayılar kabul edilir (0.434666ms)
✔ fiyat: 0 ve negatif reddedilir (mesaj değişmedi) (0.056583ms)
✔ fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi) (9.665667ms)
✔ CAC: 0 kabul edilir ('girilmedi' anlamında) (0.096166ms)
✔ CAC: geçerli tam sayılar kabul edilir (0.059208ms)
✔ CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir (0.070334ms)
✔ CAC: metin olmayan girdi (null, sayı) boş sayılır (0.0405ms)
(node:76550) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.310666ms)
✔ finance yönetici değildir (0.04975ms)
(node:76551) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (1.0805ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (2.645541ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (1.974708ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.505083ms)
ℹ tests 46
ℹ suites 0
ℹ pass 46
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 192.397583
kullanici@bilgisayar abonetakip % npm run test:db

> abonetakip@0.1.0 test:db
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts

(node:76565) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/cac-ayari.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:76565) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https:// for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ CAC'yi değiştiremez, kayıt değişmez (129.819792ms)
✔ finance kullanıcısı (2529.699375ms)
▶ manager kullanıcısı: geçersiz girdi
  ✔ geçersiz değerler alan hatası verir, kayıt değişmez (77.30425ms)
✔ manager kullanıcısı: geçersiz girdi (77.905875ms)
▶ manager kullanıcısı: başarılı kaydetme
  ✔ 5000 kaydedilir, B'nin CAC'si değişmez (229.144083ms)
  ✔ 0 ile sıfırlanır ('CAC girilmedi') (218.779917ms)
✔ manager kullanıcısı: başarılı kaydetme (448.764375ms)
▶ kiracı izolasyonu
  ✔ A ve B kendi CAC değerlerini bağımsız tutar (324.41975ms)
✔ kiracı izolasyonu (325.158958ms)
(node:76566) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/pasife-alma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:76566) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ müşteriyi pasife alamaz, kayıt değişmez (76.408791ms)
  ✔ planı pasife alamaz, kayıt değişmez (61.340625ms)
✔ finance kullanıcısı (1856.724792ms)
▶ manager kullanıcısı: engellenen durumlar
  ✔ B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (198.86825ms)
  ✔ B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (114.046041ms)
  ✔ biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır (0.603084ms)
  ✔ aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı) (189.029375ms)
  ✔ aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı) (221.480125ms)
✔ manager kullanıcısı: engellenen durumlar (725.408ms)
▶ manager kullanıcısı: başarılı pasife alma
  ✔ aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der (296.942375ms)
  ✔ aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der (342.24275ms)
✔ manager kullanıcısı: başarılı pasife alma (640.244667ms)
(node:76567) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:76567) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https:// for libpq SSL mode definitions.
▶ Müşteriler
  ✔ liste yalnızca A'nın müşterilerini getirir (73.973083ms)
  ✔ B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique) (116.218792ms)
  ✔ B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez (174.005208ms)
  ✔ eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır (156.821125ms)
✔ Müşteriler (2177.934333ms)
▶ Planlar
  ✔ liste yalnızca A'nın planlarını getirir (59.010209ms)
  ✔ B'nin planı kimlikle aranınca bulunamaz (114.888208ms)
  ✔ B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez (115.902208ms)
✔ Planlar (290.800666ms)
▶ Abonelikler ve olaylar
  ✔ liste yalnızca A'nın aboneliklerini getirir (57.354292ms)
  ✔ B'nin aboneliği kimlikle aranınca bulunamaz (175.98125ms)
  ✔ işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez (394.59575ms)
  ✔ A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder) (545.05375ms)
  ✔ A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder) (509.324875ms)
  ✔ aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz (289.176333ms)
✔ Abonelikler ve olaylar (1973.007167ms)
▶ Firma tablosu
  ✔ A yalnızca kendi firmasını görür (58.941666ms)
  ✔ A, B'nin firma ayarını (CAC) değiştiremez (129.488583ms)
  ✔ firma eklenemez ve silinemez (1.434834ms)
✔ Firma tablosu (190.431709ms)
▶ Filtre korumaları
  ✔ güncelleme verisinde tenantId varsa işlem durdurulur (60.148917ms)
  ✔ ilişki alanıyla güncelleme reddedilir (tenant: connect) (0.63475ms)
  ✔ ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz (177.659583ms)
  ✔ iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır (58.942333ms)
  ✔ kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz (112.349916ms)
✔ Filtre korumaları (410.597125ms)
▶ Silme koruması
  ✔ müşteri, plan, abonelik ve olaylarda deleteMany reddedilir, kayıtlar yerinde kalır (280.111292ms)
  ✔ tek kayıt silme (delete) de reddedilir, kayıtlar yerinde kalır (283.072334ms)
  ✔ kullanıcı (User) tablosunda silme filtre tarafından engellenmez (58.129ms)
✔ Silme koruması (621.881458ms)
(node:76568) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/duman.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:76568) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https: for libpq SSL mode definitions.
✔ tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor (0.256041ms)
✔ var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor) (513.403042ms)
✔ var olmayan firma adına firma tablosunda hiçbir kayıt görünmez (56.970083ms)
ℹ tests 41
ℹ suites 13
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 15475.494625
kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 14ms

  Creating an optimized production build ...
✓ Compiled successfully in 267ms
  Running TypeScript ...
  Finished TypeScript in 788ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 367ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 80ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 12ms

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

### Claude cevabı 9 · 22 Eki 2026 22:57

> Hepsi temiz, commit'e hazır.
>
> - **`npm test`:** 46 testin 46'sı geçti. Yeni 7 doğrulama testi de geçiyor. Fiyat mesajlarının değişmediği de kanıtlandı.
> - **`npm run test:db`:** 41 testin 41'i geçti. 5 yeni CAC testi de geçiyor (finance reddi, geçersiz girdi, 5000 ve 0 kaydı, kiracı izolasyonu).
> - **`npm run build`:** Başarılı, TypeScript hatası yok.
> - **Taramalar:** Dört tarama da yeni dosyalar dahil temiz.
> - **`git status`:** 8 dosyanın hepsi hazırlanmış. Terminal çıktısında `cac-ayari.test.ts` satırı kopyalarken birbirine karışmış görünüyor, ama `git status` dosyanın eklendiğini gösteriyor. Sorun yok.
>
> ## Commit
>
> Hazırlanmış 8 dosyayla commit'i oluşturur:
> ```zsh
> git commit -m "feat: CAC ayarı"
> ```
>
> Son üç commit'i gösterir. En üstte `feat: CAC ayarı`, altında `refactor: churn 4 ondalık` görmelisin:
> ```zsh
> git --no-pager log --oneline -3
> ```
>
> Çıktıyı gönderdiğinde 3. commitin (`feat: KPI dashboard`) dosyalarını yazarım. Bu committe `metrikler.ts` dosyasına `ayHareketi` ve `turkiyeAyi` fonksiyonları, `bicim.ts`, `dashboard-verisi.ts`, `Rozet.tsx` değişikliği ve dashboard sayfası gelecek.

### Prompt 10 · 22 Eki 2026 22:58

````text
kullanici@bilgisayar abonetakip % git commit -m "feat: CAC ayarı"
[gun9-dashboard 0388d5e] feat: CAC ayarı
 8 files changed, 439 insertions(+), 38 deletions(-)
 create mode 100644 src/app/(panel)/ayarlar/CacFormu.tsx
 create mode 100644 src/app/(panel)/ayarlar/actions.ts
 create mode 100644 src/lib/cac-ayari.test.ts
 create mode 100644 src/lib/cac-ayari.ts
 create mode 100644 src/lib/validation.test.ts
kullanici@bilgisayar abonetakip % git --no-pager log --oneline -3
0388d5e (HEAD -> gun9-dashboard) feat: CAC ayarı
73ff2ca refactor: churn 4 ondalık
1ccec5c (origin/main, origin/HEAD, main) docs: Gün 8 kayıtları (prompt günlüğü satırı, prompt ve cevap dosyası, README) (#31)
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 10 · 22 Eki 2026 23:03

> Commit 2 tamam (`0388d5e`). Şimdi 3. commit, `feat: KPI dashboard`.
>
> **Onaylanan plana göre üç küçük ekleme yaptım, hepsi saf fonksiyon ve testli:**
> - **`ltvCacSaglikliMi` (`metrikler.ts`):** "3 ve üzeri sağlıklı" kuralı bir iş kuralı olduğu için sayfaya değil buraya yazıldı.
> - **`sayiMetni` ve `ayEtiketi` (`bicim.ts`):** Ortalama ömür ve LTV/CAC gösterimi ile "Ekim 2026" başlığı için.
> - **Ortak senaryo fonksiyonları (`metrikler.test.ts`):** Ders örneği ve Gün 9 senaryosunun abonelik listeleri iki ortak fonksiyona taşındı. Böylece hem `metrikOzeti` hem `ayHareketi` testleri aynı veriyi kullanıyor. Mevcut testlerin beklentileri değişmedi.
>
> **Elle kontrol yine 4. committe:** Bu commitin görsel kontrolünü de 4. committe `dev:test` ile test dalında yapacağız. `npm run dev` canlı veritabanına bağlanır.
>
> ## Dosya 1: `src/lib/metrikler.ts`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Değişen yerler:
> - `ayBasiAni` küçük bir yardımcıya ayrıldı, `aylikChurn` onu kullanıyor. Davranış aynı.
> - Dosyanın sonuna yeni bir bölüm eklendi: `turkiyeAyi`, `ayHareketi` ve `ltvCacSaglikliMi`.
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
> ## Dosya 2: `src/lib/metrikler.test.ts`
>
> **Dosyanın içeriğini tamamen şununla değiştir.**
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
> ```
>
> ## Dosya 3: `src/lib/bicim.ts`
>
> **Yeni dosya oluştur.**
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
> ```
>
> ## Dosya 4: `src/lib/bicim.test.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // EKRAN BİÇİMLENDİRME BİRİM TESTİ (Gün 9)
> //
> // Çalıştırmak için: npm test
> // Dashboard'da görünecek metinlerin elle test senaryosuyla birebir aynı olduğunu kilitler.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "./bicim.ts";
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
> ```
>
> ## Dosya 5: `src/lib/dashboard-verisi.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // DASHBOARD VERİSİ (Gün 9)
> //
> // Dashboard sayfasının ihtiyaç duyduğu her şeyi tek fonksiyonda hazırlar:
> //   1. Abonelikleri plan bilgisiyle okur (tenant filtresi otomatik).
> //   2. Gün 8'deki AbonelikGirdisi biçimine çevirir.
> //   3. Hesabı metrikler.ts'e bırakır: metrikOzeti ve ayHareketi.
> // Burada formül YOKTUR; sayfada da yoktur. Olay tablosu (SUBSCRIPTION_EVENTS)
> // kullanılmaz: churn ve hareket, aboneliklerin startedAt/canceledAt tarihlerinden
> // hesaplanır (ADR kararı, Gün 9 onayı).
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
>   ayAraligi,
>   ayHareketi,
>   metrikOzeti,
>   turkiyeAyi,
> } from "./metrikler";
>
> export type DashboardVerisi = {
>   yil: number; // Türkiye saatine göre içinde bulunulan yıl
>   ay: number; // 1-12
>   aboneVarMi: boolean; // firmada hiç abonelik (iptal edilmişler dahil) var mı?
>   cacGirildiMi: boolean; // CAC 0'dan büyük mü?
>   ozet: MetrikOzeti;
>   hareket: AyHareketi;
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
>   };
> }
> ```
>
> ## Dosya 6: `src/lib/dashboard-verisi.test.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // KİRACI TESTİ: DASHBOARD VERİSİ (Gün 9)
> //
> // Ne test edilir? src/lib/dashboard-verisi.ts: dashboard sayılarının yalnızca
> // oturumdaki firmanın kayıtlarından hesaplandığı.
> // Test firmalarının her birinde 1 ACTIVE abonelik vardır (aylık PLAN_FIYATI TL,
> // bu çalışmada, yani bu ay başlamış). CAC başlangıçta 0'dır.
> // Hesap kurallarının ayrıntısı metrikler.test.ts içindedir; burada yalnızca
> // veritabanından okuma ve kiracı ayrımı kontrol edilir.
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
> import { dashboardVerisiniGetir } from "./dashboard-verisi.ts";
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
> ## Dosya 7: `src/components/ui/Rozet.tsx`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Yalnızca `sari` tonu eklendi.
>
> ```tsx
> import type { ReactNode } from "react";
>
> // Küçük durum etiketi: "Yönetici", "Finans", "Aktif", "Dikkat" gibi.
> // Not: Anlam yalnızca renge bırakılmaz; etiketin metni (ve gerekirse simgesi) her zaman yazılır.
> type Ton = "gri" | "indigo" | "yesil" | "kirmizi" | "sari";
>
> type RozetProps = {
>   ton?: Ton;
>   children: ReactNode;
> };
>
> const tonlar: Record<Ton, string> = {
>   gri: "bg-slate-100 text-slate-700",
>   indigo: "bg-indigo-50 text-indigo-700",
>   yesil: "bg-emerald-50 text-emerald-700",
>   kirmizi: "bg-red-50 text-red-700",
>   sari: "bg-amber-50 text-amber-800",
> };
>
> export default function Rozet({ ton = "gri", children }: RozetProps) {
>   return (
>     <span
>       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tonlar[ton]}`}
>     >
>       {children}
>     </span>
>   );
> }
> ```
>
> ## Dosya 8: `src/app/(panel)/dashboard/KpiKarti.tsx`
>
> **Yeni dosya oluştur.**
>
> ```tsx
> import type { ReactNode } from "react";
> import Kart from "@/components/ui/Kart";
>
> // Tek bir KPI kartı: başlık, dönem, değer, kısa açıklama.
> // Değer hesaplanamadıysa (null) sayı yerine "—" ve nedeni gösterilir.
> // "NaN" veya "Infinity" hiçbir zaman görünmez: değer ya biçimlenmiş metin ya da null gelir.
> type KpiKartiProps = {
>   baslik: string;
>   donem: string; // "Bugün" ya da "Ay başından bugüne"
>   deger: string | null; // biçimlenmiş metin; null = hesaplanamadı
>   neden?: ReactNode; // deger null ise gösterilir
>   durum?: ReactNode; // ör. "Sağlıklı" / "Dikkat" rozeti
>   ekBilgi?: string; // ör. hesabın bileşenleri
>   aciklama: string; // metriğin tek cümlelik tanımı
> };
>
> export default function KpiKarti({
>   baslik,
>   donem,
>   deger,
>   neden,
>   durum,
>   ekBilgi,
>   aciklama,
> }: KpiKartiProps) {
>   return (
>     <Kart className="flex flex-col">
>       <div className="flex items-baseline justify-between gap-2">
>         <h2 className="text-sm font-medium text-slate-600">{baslik}</h2>
>         <span className="text-xs text-slate-400">{donem}</span>
>       </div>
>
>       {deger !== null ? (
>         <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
>           {deger}
>         </p>
>       ) : (
>         <>
>           <p className="mt-2 text-3xl font-semibold text-slate-300">
>             <span aria-hidden="true">—</span>
>             <span className="sr-only">Hesaplanamadı</span>
>           </p>
>           {neden && <p className="mt-1 text-sm text-slate-700">{neden}</p>}
>         </>
>       )}
>
>       {durum && <div className="mt-2">{durum}</div>}
>       {ekBilgi && <p className="mt-2 text-xs text-slate-500 tabular-nums">{ekBilgi}</p>}
>
>       <p className="mt-auto pt-4 text-sm text-slate-500">{aciklama}</p>
>     </Kart>
>   );
> }
> ```
>
> ## Dosya 9: `src/app/(panel)/dashboard/page.tsx`
>
> **Dosyanın içeriğini tamamen şununla değiştir.**
>
> ```tsx
> import Link from "next/link";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { yoneticiMi } from "@/lib/yetki";
> import { dashboardVerisiniGetir } from "@/lib/dashboard-verisi";
> import { ltvCacSaglikliMi } from "@/lib/metrikler";
> import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "@/lib/bicim";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import BosDurum from "@/components/ui/BosDurum";
> import Kart from "@/components/ui/Kart";
> import Rozet from "@/components/ui/Rozet";
> import KpiKarti from "./KpiKarti";
>
> // KPI DASHBOARD (Gün 9)
> // Bu sayfada hesap YOKTUR. Sayılar dashboard-verisi.ts -> metrikler.ts zincirinden gelir,
> // burada yalnızca biçimlenir ve yerleştirilir.
> // manager ve finance ikisi de görür. Fark: CAC girilmemişse yalnızca manager'a
> // Ayarlar bağlantısı gösterilir (CAC'yi yalnızca manager değiştirebilir).
>
> const linkSinifi =
>   "font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900";
>
> export default async function DashboardSayfasi() {
>   // Layout da giriş kontrolü yapar, ama Next.js layout ile sayfayı birbirinden
>   // bağımsız çalıştırır. Bu yüzden her sayfa kendi kontrolünü de yapar.
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>   const veri = await dashboardVerisiniGetir(db);
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
>     </div>
>   );
> }
> ```
>
> ## Dosya 10: `package.json`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Yalnızca iki satır değişti:
> - `test` betiğinin sonuna `src/lib/bicim.test.ts` eklendi.
> - `test:db` betiğinin sonuna `src/lib/dashboard-verisi.test.ts` eklendi.
>
> ```json
> {
>   "name": "abonetakip",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "build": "next build",
>     "start": "next start",
>     "lint": "eslint",
>     "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts src/lib/bicim.test.ts",
>     "test:db": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts src/lib/dashboard-verisi.test.ts"
>   },
>   "dependencies": {
>     "@prisma/adapter-pg": "^7.10.1",
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "next": "16.4.2",
>     "react": "19.3.0",
>     "react-dom": "19.3.0"
>   },
>   "devDependencies": {
>     "@tailwindcss/turbopack": "^4",
>     "@types/node": "^20",
>     "@types/react": "^19",
>     "@types/react-dom": "^19",
>     "dotenv": "^18.0.8",
>     "eslint": "^9",
>     "eslint-config-next": "16.4.2",
>     "prisma": "^7.10.1",
>     "tailwindcss": "^4",
>     "typescript": "^5"
>   }
> }
> ```
>
> ## Sıra: önce `git add`, sonra tarama, sonra testler
>
> Dosyaları tek tek hazırla:
>
> ```zsh
> git add src/lib/metrikler.ts
> ```
> ```zsh
> git add src/lib/metrikler.test.ts
> ```
> ```zsh
> git add src/lib/bicim.ts
> ```
> ```zsh
> git add src/lib/bicim.test.ts
> ```
> ```zsh
> git add src/lib/dashboard-verisi.ts
> ```
> ```zsh
> git add src/lib/dashboard-verisi.test.ts
> ```
> ```zsh
> git add src/components/ui/Rozet.tsx
> ```
> ```zsh
> git add "src/app/(panel)/dashboard/KpiKarti.tsx"
> ```
> ```zsh
> git add "src/app/(panel)/dashboard/page.tsx"
> ```
> ```zsh
> git add package.json
> ```
>
> 10 dosyanın "İşlenecek değişiklikler" altında olduğunu ve izlenmeyen dosya kalmadığını gösterir:
> ```zsh
> git status
> ```
>
> Dört tarama:
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> ```zsh
> git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com"
> ```
> ```zsh
> git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
> ```
>
> Testler ve derleme:
> ```zsh
> npm test
> ```
> ```zsh
> npm run test:db
> ```
> ```zsh
> npm run build
> ```
>
> **Beklenen sonuçlar:**
> - **`npm test`:** 57 testin 57'si geçmeli. Yeni testler: 7 tane `metrikler`, 4 tane `bicim`.
> - **`npm run test:db`:** 44 testin 44'ü geçmeli. Yeni testler: 3 tane `dashboard-verisi`.
> - **`npm run build`:** Hatasız bitmeli.
> - **Taramalar:** Önceki gibi boş ve `0`.
>
> Çıktıları gönderdiğinde commit komutunu vereceğim.
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **Türkçe yüzde biçimi:** `Intl` ile Türkçe yüzde biçiminin `%66,7` olacağını varsayıyorum (işaret önde, boşluksuz). Farklı çıkarsa `bicim.test.ts` tam olarak neyin geldiğini gösterir, ona göre düzeltirim.
> - **Sayfada şu anki zaman:** Sayfa şu anki zamanı kendisi almıyor. `dashboardVerisiniGetir` fonksiyonu bunu varsayılan parametreyle alıyor. Böylece React'in "bileşen içinde zaman okuma" uyarısından kaçınılıyor. Sayfa çerez okuduğu için zaten her istekte yeniden çalışıyor (build çıktısında `ƒ /dashboard`).
> - **Prisma 7 tip uyumu:** Prisma 7'nin ürettiği `interval` ve `status` tiplerinin `"MONTHLY" | "YEARLY"` ve `"ACTIVE" | "CANCELED"` olarak `AbonelikGirdisi` ile uyumlu olduğunu varsayıyorum. Uyumsuzsa `build` hata verir ve açıkça gösterir.
> - **Ay sınırında test çalıştırma:** `dashboard-verisi.test.ts` içindeki "yeni 1" beklentisi, test firması oluşturulduğu anla dashboard verisinin okunduğu an aynı ay içinde kaldığı sürece doğrudur. Testi tam ay geçişinde (gece 00:00 civarı) çalıştırırsan bu test bir kez başarısız olabilir. Tekrar çalıştırınca düzelir.

### Prompt 11 · 22 Eki 2026 23:12

````text
kullanici@bilgisayar abonetakip % git add src/lib/metrikler.ts
kullanici@bilgisayar abonetakip % git add src/lib/metrikler.test.ts
kullanici@bilgisayar abonetakip % git add src/lib/bicim.ts
kullanici@bilgisayar abonetakip % git add src/lib/bicim.test.ts
kullanici@bilgisayar abonetakip % git add src/lib/dashboard-verisi.ts
kullanici@bilgisayar abonetakip % git add src/lib/dashboard-verisi.test.ts
kullanici@bilgisayar abonetakip % git add src/components/ui/Rozet.tsx
kullanici@bilgisayar abonetakip % git add "src/app/(panel)/dashboard/KpiKarti.tsx"
kullanici@bilgisayar abonetakip % git add "src/app/(panel)/dashboard/page.tsx"
kullanici@bilgisayar abonetakip % git add package.json
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: gun9-dashboard
İşlenecek değişiklikler:
  (hazırlıktan çıkarmak için "git restore --staged <dosya>..." kullanın)
	değiştirildi:         package.json
	yeni dosya:           src/app/(panel)/dashboard/KpiKarti.tsx
	değiştirildi:         src/app/(panel)/dashboard/page.tsx
	değiştirildi:         src/components/ui/Rozet.tsx
	yeni dosya:           src/lib/bicim.test.ts
	yeni dosya:           src/lib/bicim.ts
	yeni dosya:           src/lib/dashboard-verisi.test.ts
	yeni dosya:           src/lib/dashboard-verisi.ts
	değiştirildi:         src/lib/metrikler.test.ts
	değiştirildi:         src/lib/metrikler.ts

kullanici@bilgisayar abonetakip % git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
0
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com" 
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts src/lib/bicim.test.ts

(node:77434) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/bicim.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tlMetni: binlik ayıracı nokta, kuruş yok (0.393792ms)
✔ yuzdeMetni: 1 ondalık, yüzde işareti önde (0.088208ms)
✔ sayiMetni: en fazla 2 ondalık, gereksiz sıfır yok (0.076875ms)
✔ ayEtiketi: Türkçe ay adı ve yıl (0.431334ms)
(node:77435) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (3.7195ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.065291ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.045166ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.041875ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (0.519417ms)
✔ yıllık: bir yıl sonraya taşınır (0.042458ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.037125ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.035417ms)
(node:77436) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/metrikler.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5 (0.467917ms)
✔ ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir (0.50875ms)
✔ Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000 (0.0785ms)
✔ boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null (0.05775ms)
✔ churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır (0.2465ms)
✔ ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz) (0.141208ms)
✔ CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni (0.163459ms)
✔ aktif müşteri 0: ARPU null (0.1045ms)
✔ yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83 (0.155666ms)
✔ ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil) (0.178792ms)
✔ churn 4 ondalığa yuvarlanır: 1/3 -> 0,3333 (ham değer yuvarlanmaz) (0.134792ms)
✔ tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil (0.094166ms)
✔ ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi (0.314917ms)
✔ 1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez (0.10025ms)
✔ tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir (0.0705ms)
✔ aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır (0.067708ms)
✔ ay içinde gelip aynı ay giden müşteri churn'e girmez (0.070208ms)
✔ ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir (0.073375ms)
✔ mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi' (0.3165ms)
✔ ayHareketi: Gün 9 senaryosu -> yeni 0, iptal 2; iptal / ay başı = churn (0.1635ms)
✔ ayHareketi: ders örneği -> yeni 2, iptal 2; iptal / ay başı = churn (0.127709ms)
✔ ayHareketi: plan değiştiren müşteri ne yeni ne iptal sayılır (0.048458ms)
✔ ayHareketi: ay içinde gelip aynı ay giden müşteri ne yeni ne iptal sayılır (0.03675ms)
✔ ayHareketi: boş liste -> yeni 0, iptal 0 (0.026792ms)
✔ turkiyeAyi: ay, UTC'ye değil Türkiye saatine göre belirlenir (0.054041ms)
✔ ltvCacSaglikliMi: 3 ve üzeri sağlıklı, altı değil (0.026791ms)
(node:77437) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.795458ms)
✔ 7 gün sonra süresi dolar (0.076208ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.075584ms)
✔ imzası değiştirilen belirteç geçersizdir (0.061541ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.067792ms)
✔ biçimi bozuk belirteçler geçersizdir (0.061417ms)
(node:77438) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/validation.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ fiyat: geçerli tam sayılar kabul edilir (0.485417ms)
✔ fiyat: 0 ve negatif reddedilir (mesaj değişmedi) (0.068333ms)
✔ fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi) (8.0565ms)
✔ CAC: 0 kabul edilir ('girilmedi' anlamında) (0.094334ms)
✔ CAC: geçerli tam sayılar kabul edilir (0.0685ms)
✔ CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir (0.073292ms)
✔ CAC: metin olmayan girdi (null, sayı) boş sayılır (0.040917ms)
(node:77439) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.298292ms)
✔ finance yönetici değildir (0.047917ms)
(node:77440) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (0.588958ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (3.125958ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (2.495292ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.8455ms)
ℹ tests 57
ℹ suites 0
ℹ pass 57
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 212.88125
kullanici@bilgisayar abonetakip % npm run test:db

> abonetakip@0.1.0 test:db
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts src/lib/dashboard-verisi.test.ts

(node:77454) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/cac-ayari.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77454) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w or libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ CAC'yi değiştiremez, kayıt değişmez (82.653625ms)
✔ finance kullanıcısı (3148.633167ms)
▶ manager kullanıcısı: geçersiz girdi
  ✔ geçersiz değerler alan hatası verir, kayıt değişmez (86.967584ms)
✔ manager kullanıcısı: geçersiz girdi (87.441333ms)
▶ manager kullanıcısı: başarılı kaydetme
  ✔ 5000 kaydedilir, B'nin CAC'si değişmez (349.061125ms)
  ✔ 0 ile sıfırlanır ('CAC girilmedi') (193.262375ms)
✔ manager kullanıcısı: başarılı kaydetme (543.215667ms)
▶ kiracı izolasyonu
  ✔ A ve B kendi CAC değerlerini bağımsız tutar (456.1825ms)
✔ kiracı izolasyonu (456.733667ms)
(node:77455) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/dashboard-verisi.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77455) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https:/ for libpq SSL mode definitions.
▶ dashboard verisi
  ✔ A'nın verisi yalnızca A'nın aboneliğini içerir (B'ninki sayılmaz) (507.913125ms)
  ✔ bu ay başlayan abonelik 'yeni' sayılır; ay başında müşteri yoksa churn hesaplanamaz (116.254084ms)
  ✔ CAC her firmanın kendi ayarından okunur (330.206417ms)
✔ dashboard verisi (2757.031458ms)
(node:77456) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/pasife-alma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77456) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://ww for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ müşteriyi pasife alamaz, kayıt değişmez (84.404084ms)
  ✔ planı pasife alamaz, kayıt değişmez (63.853208ms)
✔ finance kullanıcısı (1982.11325ms)
▶ manager kullanıcısı: engellenen durumlar
  ✔ B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (181.946458ms)
  ✔ B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (125.06675ms)
  ✔ biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır (0.628917ms)
  ✔ aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı) (212.62275ms)
  ✔ aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı) (250.49175ms)
✔ manager kullanıcısı: engellenen durumlar (772.047167ms)
▶ manager kullanıcısı: başarılı pasife alma
  ✔ aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der (397.248166ms)
  ✔ aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der (313.426792ms)
✔ manager kullanıcısı: başarılı pasife alma (711.676834ms)
(node:77457) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77457) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://ww for libpq SSL mode definitions.
▶ Müşteriler
  ✔ liste yalnızca A'nın müşterilerini getirir (87.510583ms)
  ✔ B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique) (219.189042ms)
  ✔ B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez (222.887833ms)
  ✔ eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır (147.51825ms)
✔ Müşteriler (2787.691958ms)
▶ Planlar
  ✔ liste yalnızca A'nın planlarını getirir (151.86375ms)
  ✔ B'nin planı kimlikle aranınca bulunamaz (152.044208ms)
  ✔ B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez (147.215333ms)
✔ Planlar (452.290333ms)
▶ Abonelikler ve olaylar
  ✔ liste yalnızca A'nın aboneliklerini getirir (72.878875ms)
  ✔ B'nin aboneliği kimlikle aranınca bulunamaz (223.430834ms)
  ✔ işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez (592.339833ms)
  ✔ A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder) (673.507125ms)
  ✔ A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder) (618.7665ms)
  ✔ aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz (336.370208ms)
✔ Abonelikler ve olaylar (2519.023084ms)
▶ Firma tablosu
  ✔ A yalnızca kendi firmasını görür (65.707042ms)
  ✔ A, B'nin firma ayarını (CAC) değiştiremez (129.123958ms)
  ✔ firma eklenemez ve silinemez (1.248417ms)
✔ Firma tablosu (196.554458ms)
▶ Filtre korumaları
  ✔ güncelleme verisinde tenantId varsa işlem durdurulur (129.533ms)
  ✔ ilişki alanıyla güncelleme reddedilir (tenant: connect) (0.924166ms)
  ✔ ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz (125.4235ms)
  ✔ iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır (65.452ms)
  ✔ kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz (126.936916ms)
✔ Filtre korumaları (449.239291ms)
▶ Silme koruması
  ✔ müşteri, plan, abonelik ve olaylarda deleteMany reddedilir, kayıtlar yerinde kalır (359.720875ms)
  ✔ tek kayıt silme (delete) de reddedilir, kayıtlar yerinde kalır (369.057083ms)
  ✔ kullanıcı (User) tablosunda silme filtre tarafından engellenmez (66.315417ms)
✔ Silme koruması (795.869375ms)
(node:77458) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/duman.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77458) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https:// for libpq SSL mode definitions.
✔ tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor (0.255292ms)
✔ var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor) (661.130333ms)
✔ var olmayan firma adına firma tablosunda hiçbir kayıt görünmez (66.878583ms)
ℹ tests 44
ℹ suites 14
ℹ pass 44
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 22141.113708
kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 53ms

  Creating an optimized production build ...
✓ Compiled successfully in 607ms
  Running TypeScript ...
  Finished TypeScript in 1100ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 369ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 78ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 7ms

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

### Claude cevabı 11 · 22 Eki 2026 23:12

> Hepsi temiz, commit'e hazır.
>
> - **`npm test`:** 57 testin 57'si geçti. Türkçe biçimler beklendiği gibi çıktı: `%66,7`, `1.500 TL`, `0,3`, `Ekim 2026`.
> - **`npm run test:db`:** 44 testin 44'ü geçti. Dashboard verisi yalnızca kendi firmasının aboneliğini ve CAC'sini okuyor.
> - **`npm run build`:** Başarılı. Prisma 7 tipleri `AbonelikGirdisi` ile uyumlu çıktı.
> - **Taramalar:** Dördü de 10 hazırlanmış dosya dahil temiz.
>
> ## Commit
>
> Hazırlanmış 10 dosyayla commit'i oluşturur:
> ```zsh
> git commit -m "feat: KPI dashboard"
> ```
>
> Son dört commit'i gösterir. Üstte `feat: KPI dashboard`, sonra `feat: CAC ayarı`, sonra `refactor: churn 4 ondalık` görmelisin:
> ```zsh
> git --no-pager log --oneline -4
> ```
>
> Çıktıyı gönderdiğinde 4. commiti (`chore: demo verisi ve test dalında çalıştırma betiği`) yazarım. Bu committe şunlar olacak:
> - `veri.ts` dosyasına e-postadan firma bulan küçük fonksiyon
> - `demo-verisi.ts` betiği
> - `package.json` dosyasına `demo:veri` ve `dev:test` betikleri
>
> Bu committen sonra Gün 9'un bitiş kontrollerinin tamamını test dalında elle yapacağız:
> - Dört KPI'nın elle hesapla karşılaştırılması
> - Finance kullanıcısının CAC'yi değiştirememesi
> - Boş veride mesaj çıkması

### Prompt 12 · 22 Eki 2026 23:14

````text
kullanici@bilgisayar abonetakip % git commit -m "feat: KPI dashboard"
[gun9-dashboard e383c0f] feat: KPI dashboard
 10 files changed, 606 insertions(+), 49 deletions(-)
 create mode 100644 src/app/(panel)/dashboard/KpiKarti.tsx
 create mode 100644 src/lib/bicim.test.ts
 create mode 100644 src/lib/bicim.ts
 create mode 100644 src/lib/dashboard-verisi.test.ts
 create mode 100644 src/lib/dashboard-verisi.ts
kullanici@bilgisayar abonetakip % git --no-pager log --oneline -4
e383c0f (HEAD -> gun9-dashboard) feat: KPI dashboard
0388d5e feat: CAC ayarı
73ff2ca refactor: churn 4 ondalık
1ccec5c (origin/main, origin/HEAD, main) docs: Gün 8 kayıtları (prompt günlüğü satırı, prompt ve cevap dosyası, README) (#31)
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 12 · 22 Eki 2026 23:18

> Commit 3 tamam (`e383c0f`). Şimdi 4. ve son commit: `chore: demo verisi ve test dalında çalıştırma betiği`.
>
> **Plandan iki sapma, ikisi de güvenlik için:**
> - **Canlı veritabanı koruması (`canli-koruma.ts`):** `TEST_VERITABANI=evet` kontrolü tek başına yeterli değil. `next dev`, `.env.test` içinde eksik bir değişkeni `.env` dosyasından (canlıdan) tamamlar. Bu yüzden iki betik de başlamadan önce şunu kontrol ediyor: `DATABASE_URL`, `.env` dosyasındaki canlı adresle **aynı Neon sunucusunu** gösteriyor mu? Havuzlu (`-pooler`) ve doğrudan adres aynı sunucu sayılıyor. Aynıysa ya da adres okunamazsa betik veritabanına hiç bağlanmadan duruyor. Hiçbir adres ekrana yazılmıyor. Karşılaştırma fonksiyonunun birim testi de var.
> - **Dosya türü:** `dev:test` ve korumayı `.mjs` değil `.ts` olarak yazdım. Node 26 TypeScript'i doğrudan çalıştırıyor, böylece build'in tip kontrolüne de giriyorlar.
>
> ## Dosya 1: `src/test-destek/canli-koruma.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // CANLI VERİTABANI KORUMASI (Gün 9)
> //
> // Test dalında çalışması gereken betikler (demo:veri, dev:test) başlamadan önce
> // bu kontrolü çağırır. Kontrol geçilmezse betik veritabanına HİÇ bağlanmadan durur.
> //
> // Neden TEST_VERITABANI=evet tek başına yetmez?
> // next dev, .env.test'te eksik olan bir değişkeni .env'den (canlı) tamamlar.
> // Bir gün .env.test'teki DATABASE_URL silinir ya da yanlışlıkla canlı adres
> // yapıştırılırsa, işaret yine "evet" olur ama bağlantı canlıya gider.
> // Bu yüzden ikinci bir kontrol yapılır: DATABASE_URL, .env'deki canlı adresle
> // AYNI Neon sunucusunu gösteriyor mu? (Havuzlu "-pooler" ve doğrudan adres aynı sunucudur.)
> //
> // Güvenlik: Hiçbir adres, parola veya sunucu adı ekrana yazılmaz.
> // Belirsiz durumda (adres okunamadı) "izin ver" değil "durdur" denir.
>
> import { existsSync, readFileSync } from "node:fs";
> import path from "node:path";
> import { fileURLToPath } from "node:url";
> import dotenv from "dotenv";
>
> // Bu dosya src/test-destek/ içinde durur. İki üst klasör proje köküdür.
> const PROJE_KOKU = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
>
> // Bir PostgreSQL adresinden Neon uç noktasının kimliğini çıkarır.
> // "ep-xxxx-ornek-pooler.c-2.eu-central-1.aws.neon.tech" -> "ep-xxxx-ornek"
> // Havuzlu ve doğrudan adres aynı kimliği verir. Okunamazsa null döner.
> export function ucNoktaKimligi(adres: string | undefined): string | null {
>   if (!adres) return null;
>   try {
>     const sunucu = new URL(adres).hostname;
>     if (!sunucu) return null;
>     const ilkParca = sunucu.split(".")[0];
>     return ilkParca.replace(/-pooler$/, "") || null;
>   } catch {
>     return null;
>   }
> }
>
> export type KontrolSonucu = { ok: true } | { ok: false; hata: string };
>
> // Şu anki ortam değişkenleri test dalını mı gösteriyor? Canlıyla çakışma var mı?
> export function testDaliKontrolu(): KontrolSonucu {
>   if (process.env.TEST_VERITABANI !== "evet") {
>     return {
>       ok: false,
>       hata: "TEST_VERITABANI=evet bulunamadı. Bu betik yalnızca .env.test ile (test dalında) çalışır.",
>     };
>   }
>
>   const testUcu = ucNoktaKimligi(process.env.DATABASE_URL);
>   if (!testUcu) {
>     return { ok: false, hata: ".env.test içindeki DATABASE_URL bulunamadı veya okunamadı." };
>   }
>
>   // Canlı ayar dosyası yoksa karşılaştırılacak bir canlı adres de yoktur.
>   const canliDosyasi = path.join(PROJE_KOKU, ".env");
>   if (!existsSync(canliDosyasi)) return { ok: true };
>
>   const canliAdres = dotenv.parse(readFileSync(canliDosyasi, "utf8")).DATABASE_URL;
>   const canliUcu = ucNoktaKimligi(canliAdres);
>   if (!canliUcu) {
>     return {
>       ok: false,
>       hata: ".env içindeki DATABASE_URL okunamadı; canlı ile karşılaştırma yapılamadığı için durduruldu.",
>     };
>   }
>   if (canliUcu === testUcu) {
>     return {
>       ok: false,
>       hata: "DATABASE_URL canlı veritabanıyla AYNI sunucuyu gösteriyor. .env.test dosyasını kontrol edin.",
>     };
>   }
>   return { ok: true };
> }
> ```
>
> ## Dosya 2: `src/test-destek/canli-koruma.test.ts`
>
> **Yeni dosya oluştur.** Örnek adresler kurallara uygun olarak `ep-xxxx` biçiminde, parolalar da yer tutucu.
>
> ```ts
> // CANLI VERİTABANI KORUMASI BİRİM TESTİ (Gün 9)
> //
> // Çalıştırmak için: npm test
> // Veritabanına bağlanmaz. Örnek adresler sahtedir (ep-xxxx biçimi, yer tutucu parola).
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { ucNoktaKimligi } from "./canli-koruma.ts";
>
> const SON_EK = "c-2.eu-central-1.aws.neon.tech/vt?sslmode=require";
>
> test("ucNoktaKimligi: havuzlu ve doğrudan adres AYNI sunucu sayılır", () => {
>   const havuzlu = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-canli-pooler.${SON_EK}`;
>   const dogrudan = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-canli.${SON_EK}`;
>   assert.equal(ucNoktaKimligi(havuzlu), "ep-xxxx-canli");
>   assert.equal(ucNoktaKimligi(havuzlu), ucNoktaKimligi(dogrudan));
> });
>
> test("ucNoktaKimligi: farklı dallar farklı sunucudur; okunamayan adres null", () => {
>   const canli = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-canli-pooler.${SON_EK}`;
>   const test = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-test-pooler.${SON_EK}`;
>   assert.notEqual(ucNoktaKimligi(canli), ucNoktaKimligi(test));
>
>   assert.equal(ucNoktaKimligi(undefined), null);
>   assert.equal(ucNoktaKimligi(""), null);
>   assert.equal(ucNoktaKimligi("bozuk adres"), null);
> });
> ```
>
> ## Dosya 3: `src/test-destek/dev-test.ts`
>
> **Yeni dosya oluştur.**
>
> ```ts
> // UYGULAMAYI TEST DALINDA ÇALIŞTIRMA (Gün 9)
> //
> // Çalıştırma: npm run dev:test
> // Ne yapar? Uygulamayı (next dev) .env.test ile, yani Neon TEST DALINA bağlı açar.
> // Elle kontrol (dashboard, ayarlar, demo verisi) burada yapılır. CANLI VERİTABANINA
> // BAĞLANMAZ: başlamadan önce canli-koruma.ts kontrolü yapılır, geçilmezse durur.
> //
> // Nasıl çalışır? "npm run dev:test" komutu Node'u --env-file=.env.test ile başlatır;
> // değerler önce .env.test'ten yüklenir. Next.js daha sonra .env dosyasını da okur
> // ama zaten tanımlı değişkenlerin ÜZERİNE YAZMAZ. Bu yüzden terminalde
> // "Environments: .env" yazması normaldir.
> // Test kullanıcıları bu modda kayıt sayfasından oluşturulur ve yalnızca test dalında bulunur.
>
> import { spawn } from "node:child_process";
> import { createRequire } from "node:module";
> import { testDaliKontrolu } from "./canli-koruma.ts";
>
> const kontrol = testDaliKontrolu();
> if (!kontrol.ok) {
>   console.error(`Durduruldu: ${kontrol.hata}`);
>   process.exit(1);
> }
>
> // next komutunun dosya yolu (node_modules içinden)
> const yukle = createRequire(import.meta.url);
> const nextKomutu = yukle.resolve("next/dist/bin/next");
>
> console.log("Uygulama TEST DALINA bağlı olarak başlatılıyor (.env.test). Canlı veritabanı kullanılmaz.");
>
> const surec = spawn(process.execPath, [nextKomutu, "dev"], {
>   stdio: "inherit",
>   env: process.env,
> });
> surec.on("exit", (kod) => process.exit(kod ?? 0));
> ```
>
> ## Dosya 4: `src/test-destek/veri.ts`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Değişen yerler:
> - Dosya başına bir not eklendi.
> - Dosyanın sonuna `kullanicininFirmaKimligi` fonksiyonu eklendi.
>
> Mevcut kodun geri kalanı aynı.
>
> ```ts
> // TEST VERİSİ YARDIMCISI (yalnızca testlerde ve test dalı betiklerinde kullanılır)
> //
> // Her test dosyası çalışınca iki sahte firma (A ve B) oluşturur ve testler
> // bitince yalnızca BU ÇALIŞMADA oluşturduğu kayıtları siler.
> // Gün 9: demo-verisi.ts betiği de firma kimliği bulmak için bu dosyayı kullanır.
> //
> // İSTİSNA (Gün 6 onayı): Bu dosya ham "prisma" nesnesini kullanır. Firma (Tenant)
> // oluşturma ve silme işlemleri tenant filtresinden geçemez, çünkü filtre bunları
> // bilerek engeller. kurallar.test.ts yalnızca BU dosyaya bu izni verir.
> //
> // GÜVENLİK:
> // 1. TEST_VERITABANI=evet yoksa veritabanına hiç bağlanmadan durur.
> //    Bu işaret yalnızca .env.test içinde vardır (Neon test dalı).
> // 2. Silme yalnızca bu çalışmada oluşturulan firma kimlikleriyle yapılır ve
> //    firmanın adı bu çalışmanın etiketiyle başlamalıdır. Joker silme yoktur.
> // 3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.
>
> import { randomUUID } from "node:crypto";
>
> // 1. güvence: veritabanına bağlanmadan ÖNCE kontrol.
> if (process.env.TEST_VERITABANI !== "evet") {
>   throw new Error(
>     "TEST_VERITABANI=evet bulunamadı. Veritabanı testleri yalnızca .env.test ile (Neon test dalında) çalışır: npm run test:db"
>   );
> }
>
> // Kontrol geçildikten SONRA içe aktarılır.
> const { prisma } = await import("../lib/db.ts");
>
> // Bu çalışmaya özel etiket. Örnek: "test-3f9a1c2b". Firma adları bununla başlar.
> export const CALISMA = `test-${randomUUID().slice(0, 8)}`;
>
> // Test planlarının fiyatı (TL, tam sayı).
> export const PLAN_FIYATI = 1000;
>
> // Bu çalışmada oluşturulan firmaların kimlikleri. Silme yalnızca bunlarla yapılır.
> const olusturulanFirmaIdleri: string[] = [];
>
> // Bir test firmasının kayıtlarının kimlikleri.
> export type TestFirmasi = {
>   tenantId: string;
>   managerId: string;
>   financeId: string;
>   abonelikliPlanId: string; // aktif aboneliği olan plan
>   bosPlanId: string; // aboneliği olmayan plan
>   abonelikliMusteriId: string; // aktif aboneliği olan müşteri
>   bosMusteriId: string; // aboneliği olmayan müşteri
>   abonelikId: string; // abonelikli müşterinin ACTIVE aboneliği
> };
>
> // Bir sahte firma ve içindeki kayıtları oluşturur. etiket: "a" ya da "b".
> export async function testFirmasiOlustur(etiket: string): Promise<TestFirmasi> {
>   const on = `${CALISMA}-${etiket}`;
>
>   const firma = await prisma.tenant.create({
>     data: { name: on },
>     select: { id: true },
>   });
>   // Hemen listeye eklenir: sonraki adımlardan biri hata verse bile temizlenir.
>   olusturulanFirmaIdleri.push(firma.id);
>   const tenantId = firma.id;
>
>   // Kullanıcılar. passwordHash gerçek bir bcrypt özeti DEĞİLDİR:
>   // bu kullanıcılarla giriş yapılamaz, yalnızca test verisi olarak vardır.
>   const manager = await prisma.user.create({
>     data: {
>       tenantId,
>       email: `${on}-manager@example.com`,
>       name: "Test Yönetici",
>       passwordHash: "test-giris-yapilamaz",
>       role: "manager",
>     },
>     select: { id: true },
>   });
>   const finance = await prisma.user.create({
>     data: {
>       tenantId,
>       email: `${on}-finance@example.com`,
>       name: "Test Finans",
>       passwordHash: "test-giris-yapilamaz",
>       role: "finance",
>     },
>     select: { id: true },
>   });
>
>   const abonelikliPlan = await prisma.plan.create({
>     data: { tenantId, name: "Test Abonelikli Plan", price: PLAN_FIYATI, interval: "MONTHLY" },
>     select: { id: true },
>   });
>   const bosPlan = await prisma.plan.create({
>     data: { tenantId, name: "Test Boş Plan", price: PLAN_FIYATI, interval: "YEARLY" },
>     select: { id: true },
>   });
>
>   const abonelikliMusteri = await prisma.customer.create({
>     data: { tenantId, name: "Test Abonelikli Müşteri", email: `${on}-musteri1@example.com` },
>     select: { id: true },
>   });
>   const bosMusteri = await prisma.customer.create({
>     data: { tenantId, name: "Test Boş Müşteri", email: `${on}-musteri2@example.com` },
>     select: { id: true },
>   });
>
>   // Aktif abonelik ve "başladı" olayı (uygulamadaki gibi ikisi birlikte).
>   const abonelik = await prisma.subscription.create({
>     data: {
>       tenantId,
>       customerId: abonelikliMusteri.id,
>       planId: abonelikliPlan.id,
>       status: "ACTIVE",
>       currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
>     },
>     select: { id: true },
>   });
>   await prisma.subscriptionEvent.create({
>     data: { tenantId, subscriptionId: abonelik.id, type: "STARTED" },
>   });
>
>   return {
>     tenantId,
>     managerId: manager.id,
>     financeId: finance.id,
>     abonelikliPlanId: abonelikliPlan.id,
>     bosPlanId: bosPlan.id,
>     abonelikliMusteriId: abonelikliMusteri.id,
>     bosMusteriId: bosMusteri.id,
>     abonelikId: abonelik.id,
>   };
> }
>
> // Bu çalışmada oluşturulan firmaları ve içlerindeki her şeyi siler.
> export async function testVerisiniTemizle(): Promise<void> {
>   if (olusturulanFirmaIdleri.length === 0) return;
>
>   // 2. güvence: yalnızca kimliği listede OLAN ve adı bu çalışmanın etiketiyle başlayan firmalar.
>   const firmalar = await prisma.tenant.findMany({
>     where: { id: { in: olusturulanFirmaIdleri }, name: { startsWith: CALISMA } },
>     select: { id: true },
>   });
>   const idler = firmalar.map((f) => f.id);
>   if (idler.length === 0) return;
>
>   // Silme sırası, tablolar arasındaki bağlara göredir: önce olaylar, en son firmalar.
>   const kosul = { tenantId: { in: idler } };
>   await prisma.subscriptionEvent.deleteMany({ where: kosul });
>   await prisma.subscription.deleteMany({ where: kosul });
>   await prisma.customer.deleteMany({ where: kosul });
>   await prisma.plan.deleteMany({ where: kosul });
>   await prisma.user.deleteMany({ where: kosul });
>   await prisma.tenant.deleteMany({ where: { id: { in: idler } } });
>
>   // 3. güvence: gerçekten silindi mi?
>   const kalan = await prisma.tenant.count({ where: { id: { in: idler } } });
>   if (kalan > 0) {
>     throw new Error(`Temizlik tamamlanamadı: ${kalan} test firması kaldı (${CALISMA}).`);
>   }
>   olusturulanFirmaIdleri.length = 0;
> }
>
> // Veritabanı bağlantısını kapatır. Kapatılmazsa Node test bitince beklemede kalır.
> export async function baglantiyiKapat(): Promise<void> {
>   await prisma.$disconnect();
> }
>
> // ---------- Demo betiği yardımcısı (Gün 9) ----------
>
> // Test dalında, verilen e-postayla kayıtlı kullanıcının firma kimliğini bulur.
> // Kullanıcı e-postası bütün firmalarda benzersizdir ve firma henüz bilinmediği için
> // tenant filtresi kullanılamaz; bu yüzden ham prisma ile bu dosyada durur.
> // Yalnızca firma kimliği okunur; parola özeti ve diğer alanlar okunmaz.
> // Kullanan: src/test-destek/demo-verisi.ts
> export async function kullanicininFirmaKimligi(eposta: string): Promise<string | null> {
>   const kullanici = await prisma.user.findUnique({
>     where: { email: eposta },
>     select: { tenantId: true },
>   });
>   return kullanici?.tenantId ?? null;
> }
> ```
>
> ## Dosya 5: `src/test-destek/demo-verisi.ts`
>
> **Yeni dosya oluştur.**
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
>
> import { testDaliKontrolu } from "./canli-koruma.ts";
> import { epostaDogrula } from "../lib/validation.ts";
> import { ayAraligi, turkiyeAyi } from "../lib/metrikler.ts";
> import { donemSonu, type Aralik } from "../lib/donem.ts";
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
> // Başlangıçtan sınıra kadar dönem dönem ilerler (uygulamadaki yenileme kuralıyla).
> // Sınırdan önce dolan her dönem bir yenilemedir (RENEWED olayı).
> function donemleriIlerlet(baslangic: Date, aralik: Aralik, sinir: Date) {
>   const yenilemeler: Date[] = [];
>   let bitis = donemSonu(baslangic, aralik);
>   while (bitis.getTime() <= sinir.getTime()) {
>     yenilemeler.push(bitis);
>     bitis = donemSonu(bitis, aralik);
>   }
>   return { yenilemeler, currentPeriodEnd: bitis };
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
> ## Dosya 6: `package.json`
>
> **Dosyanın içeriğini tamamen şununla değiştir.** Değişen yerler:
> - Yeni `dev:test` ve `demo:veri` betikleri eklendi.
> - `test` betiğinin sonuna `src/test-destek/canli-koruma.test.ts` eklendi.
>
> ```json
> {
>   "name": "abonetakip",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "dev:test": "node --env-file=.env.test src/test-destek/dev-test.ts",
>     "demo:veri": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/demo-verisi.ts",
>     "build": "next build",
>     "start": "next start",
>     "lint": "eslint",
>     "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts src/lib/bicim.test.ts src/test-destek/canli-koruma.test.ts",
>     "test:db": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts src/lib/dashboard-verisi.test.ts"
>   },
>   "dependencies": {
>     "@prisma/adapter-pg": "^7.10.1",
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "next": "16.4.2",
>     "react": "19.3.0",
>     "react-dom": "19.3.0"
>   },
>   "devDependencies": {
>     "@tailwindcss/turbopack": "^4",
>     "@types/node": "^20",
>     "@types/react": "^19",
>     "@types/react-dom": "^19",
>     "dotenv": "^18.0.8",
>     "eslint": "^9",
>     "eslint-config-next": "16.4.2",
>     "prisma": "^7.10.1",
>     "tailwindcss": "^4",
>     "typescript": "^5"
>   }
> }
> ```
>
> ## Sıra: `git add`, tarama, testler
>
> ```zsh
> git add src/test-destek/canli-koruma.ts
> ```
> ```zsh
> git add src/test-destek/canli-koruma.test.ts
> ```
> ```zsh
> git add src/test-destek/dev-test.ts
> ```
> ```zsh
> git add src/test-destek/veri.ts
> ```
> ```zsh
> git add src/test-destek/demo-verisi.ts
> ```
> ```zsh
> git add package.json
> ```
>
> 6 dosyanın hazırlandığını gösterir:
> ```zsh
> git status
> ```
>
> Dört tarama. Test dosyasındaki örnek adresler `ep-xxxx` biçiminde olduğu için sunucu adı taramasının sonucu yine `0` olmalı:
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> ```zsh
> git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com"
> ```
> ```zsh
> git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
> ```
>
> Testler ve derleme:
> ```zsh
> npm test
> ```
> ```zsh
> npm run test:db
> ```
> ```zsh
> npm run build
> ```
>
> **Beklenen sonuçlar:**
> - **`npm test`:** 59 testin 59'u geçmeli (57 + 2 koruma testi). `kurallar.test.ts` de yeşil kalmalı, yani yeni dosyalarda ham prisma kullanılmıyor.
> - **`npm run test:db`:** 44 testin 44'ü geçmeli, değişmedi.
> - **`npm run build`:** Hatasız bitmeli.
>
> Bu adımda `dev:test` ve `demo:veri` betiklerini **çalıştırma**. Commit'ten sonra elle kontrol adımlarını sırayla birlikte yapacağız.
>
> ## Varsayımlar ve emin olmadıklarım
>
> - **Next.js ve ortam değişkenleri:** Next.js'in `.env` dosyasını okurken önceden tanımlı ortam değişkenlerinin üzerine yazmadığını varsayıyorum. Bu Next.js'in bilinen davranışı, ama bunu kendimiz de doğrulayacağız. Elle kontrolde test dalında oluşturduğun kullanıcıyla giriş yapabiliyorsan ve demo verisini görüyorsan uygulama test dalına bağlıdır. Bu kullanıcı canlıda yoktur.
> - **Oturum anahtarı:** `.env.test` içinde oturum anahtarının da bulunması gerekir. Yoksa `next dev` onu `.env` dosyasından alır. Bu veritabanına dokunmaz, ama test ortamının canlı anahtarla imzalanmış çerez üretmesi istenmez. Bunu sen kontrol et, değerini bana yazma.
> - **Prisma 7 işlemleri:** Prisma 7'de genişletilmiş istemcinin `$transaction` içinde de tenant filtresini uyguladığını varsayıyorum. `tenant.test.ts` içindeki "işlem (transaction) içinde de..." testi bunu doğruluyor.
> - **`dotenv` içe aktarımı:** `dotenv` paketinin `import dotenv from "dotenv"` biçiminde yüklendiğini varsayıyorum. Bir sorun olursa `npm run build` ya da `npm test` bunu gösterir.

### Prompt 13 · 22 Eki 2026 23:26

````text
kullanici@bilgisayar abonetakip % git add src/test-destek/canli-koruma.ts
kullanici@bilgisayar abonetakip % git add src/test-destek/canli-koruma.test.ts
kullanici@bilgisayar abonetakip % git add src/test-destek/dev-test.ts
kullanici@bilgisayar abonetakip % git add src/test-destek/veri.ts
kullanici@bilgisayar abonetakip % git add src/test-destek/demo-verisi.ts
kullanici@bilgisayar abonetakip % git add package.json
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: gun9-dashboard
İşlenecek değişiklikler:
  (hazırlıktan çıkarmak için "git restore --staged <dosya>..." kullanın)
	değiştirildi:         package.json
	yeni dosya:           src/test-destek/canli-koruma.test.ts
	yeni dosya:           src/test-destek/canli-koruma.ts
	yeni dosya:           src/test-destek/demo-verisi.ts
	yeni dosya:           src/test-destek/dev-test.ts
	değiştirildi:         src/test-destek/veri.ts

kullanici@bilgisayar abonetakip % git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
0
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -i -E "@(gmail|hotmail|outlook|icloud|yahoo|yandex)\.com" 
kullanici@bilgisayar abonetakip % git --no-pager grep -l -I -E "(\+90|0)? ?5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}"
kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts src/lib/bicim.test.ts src/test-destek/canli-koruma.test.ts

(node:78073) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/bicim.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tlMetni: binlik ayıracı nokta, kuruş yok (0.417333ms)
✔ yuzdeMetni: 1 ondalık, yüzde işareti önde (0.190625ms)
✔ sayiMetni: en fazla 2 ondalık, gereksiz sıfır yok (0.112333ms)
✔ ayEtiketi: Türkçe ay adı ve yıl (0.085666ms)
(node:78074) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (3.8155ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.193292ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.105208ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.08825ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (1.956667ms)
✔ yıllık: bir yıl sonraya taşınır (0.162125ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.093458ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.07625ms)
(node:78075) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/metrikler.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5 (0.478916ms)
✔ ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir (0.571291ms)
✔ Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000 (0.10525ms)
✔ boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null (0.065167ms)
✔ churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır (0.067792ms)
✔ ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz) (0.044458ms)
✔ CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni (0.053291ms)
✔ aktif müşteri 0: ARPU null (0.033334ms)
✔ yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83 (0.057958ms)
✔ ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil) (0.083625ms)
✔ churn 4 ondalığa yuvarlanır: 1/3 -> 0,3333 (ham değer yuvarlanmaz) (0.060583ms)
✔ tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil (0.060959ms)
✔ ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi (0.144292ms)
✔ 1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez (0.043291ms)
✔ tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir (0.031208ms)
✔ aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır (0.02925ms)
✔ ay içinde gelip aynı ay giden müşteri churn'e girmez (0.026375ms)
✔ ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir (0.035208ms)
✔ mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi' (0.137834ms)
✔ ayHareketi: Gün 9 senaryosu -> yeni 0, iptal 2; iptal / ay başı = churn (0.046375ms)
✔ ayHareketi: ders örneği -> yeni 2, iptal 2; iptal / ay başı = churn (0.088625ms)
✔ ayHareketi: plan değiştiren müşteri ne yeni ne iptal sayılır (0.032417ms)
✔ ayHareketi: ay içinde gelip aynı ay giden müşteri ne yeni ne iptal sayılır (0.026042ms)
✔ ayHareketi: boş liste -> yeni 0, iptal 0 (0.02325ms)
✔ turkiyeAyi: ay, UTC'ye değil Türkiye saatine göre belirlenir (0.044334ms)
✔ ltvCacSaglikliMi: 3 ve üzeri sağlıklı, altı değil (0.021667ms)
(node:78076) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.579458ms)
✔ 7 gün sonra süresi dolar (0.072833ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.142625ms)
✔ imzası değiştirilen belirteç geçersizdir (0.062458ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.06675ms)
✔ biçimi bozuk belirteçler geçersizdir (0.05525ms)
(node:78077) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/validation.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ fiyat: geçerli tam sayılar kabul edilir (0.445375ms)
✔ fiyat: 0 ve negatif reddedilir (mesaj değişmedi) (0.061875ms)
✔ fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi) (9.772959ms)
✔ CAC: 0 kabul edilir ('girilmedi' anlamında) (0.094292ms)
✔ CAC: geçerli tam sayılar kabul edilir (0.056125ms)
✔ CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir (0.065083ms)
✔ CAC: metin olmayan girdi (null, sayı) boş sayılır (0.036375ms)
(node:78078) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.303875ms)
✔ finance yönetici değildir (0.051208ms)
(node:78079) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/canli-koruma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ucNoktaKimligi: havuzlu ve doğrudan adres AYNI sunucu sayılır (0.475375ms)
✔ ucNoktaKimligi: farklı dallar farklı sunucudur; okunamayan adres null (0.102542ms)
(node:78080) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (1.156917ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (13.529ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (3.05925ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (7.04525ms)
ℹ tests 59
ℹ suites 0
ℹ pass 59
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 217.406417
kullanici@bilgisayar abonetakip % npm run test:db

> abonetakip@0.1.0 test:db
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts src/lib/dashboard-verisi.test.ts

(node:78094) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/cac-ayari.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78094) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ CAC'yi değiştiremez, kayıt değişmez (74.888542ms)
✔ finance kullanıcısı (2415.822167ms)
▶ manager kullanıcısı: geçersiz girdi
  ✔ geçersiz değerler alan hatası verir, kayıt değişmez (78.186ms)
✔ manager kullanıcısı: geçersiz girdi (78.670291ms)
▶ manager kullanıcısı: başarılı kaydetme
  ✔ 5000 kaydedilir, B'nin CAC'si değişmez (314.589042ms)
  ✔ 0 ile sıfırlanır ('CAC girilmedi') (169.4435ms)
✔ manager kullanıcısı: başarılı kaydetme (484.887625ms)
▶ kiracı izolasyonu
  ✔ A ve B kendi CAC değerlerini bağımsız tutar (401.749917ms)
✔ kiracı izolasyonu (402.353542ms)
(node:78095) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/dashboard-verisi.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78095) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www. for libpq SSL mode definitions.
▶ dashboard verisi
  ✔ A'nın verisi yalnızca A'nın aboneliğini içerir (B'ninki sayılmaz) (419.149167ms)
  ✔ bu ay başlayan abonelik 'yeni' sayılır; ay başında müşteri yoksa churn hesaplanamaz (155.566042ms)
  ✔ CAC her firmanın kendi ayarından okunur (279.282375ms)
✔ dashboard verisi (2967.796291ms)
(node:78096) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/pasife-alma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78096) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://w for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ müşteriyi pasife alamaz, kayıt değişmez (82.820458ms)
  ✔ planı pasife alamaz, kayıt değişmez (60.235125ms)
✔ finance kullanıcısı (1855.754625ms)
▶ manager kullanıcısı: engellenen durumlar
  ✔ B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (201.379167ms)
  ✔ B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (113.471708ms)
  ✔ biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır (0.535542ms)
  ✔ aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı) (185.9015ms)
  ✔ aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı) (228.70725ms)
✔ manager kullanıcısı: engellenen durumlar (731.23125ms)
▶ manager kullanıcısı: başarılı pasife alma
  ✔ aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der (326.42275ms)
  ✔ aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der (369.420292ms)
✔ manager kullanıcısı: başarılı pasife alma (696.745958ms)
(node:78097) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78097) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See h for libpq SSL mode definitions.
▶ Müşteriler
  ✔ liste yalnızca A'nın müşterilerini getirir (75.031791ms)
  ✔ B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique) (116.196834ms)
  ✔ B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez (165.487375ms)
  ✔ eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır (164.23675ms)
✔ Müşteriler (2137.38875ms)
▶ Planlar
  ✔ liste yalnızca A'nın planlarını getirir (55.006166ms)
  ✔ B'nin planı kimlikle aranınca bulunamaz (112.854625ms)
  ✔ B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez (114.585458ms)
✔ Planlar (283.486834ms)
▶ Abonelikler ve olaylar
  ✔ liste yalnızca A'nın aboneliklerini getirir (53.827125ms)
  ✔ B'nin aboneliği kimlikle aranınca bulunamaz (187.074209ms)
  ✔ işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez (384.285667ms)
  ✔ A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder) (554.865875ms)
  ✔ A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder) (508.696417ms)
  ✔ aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz (292.153125ms)
✔ Abonelikler ve olaylar (1982.426208ms)
▶ Firma tablosu
  ✔ A yalnızca kendi firmasını görür (58.215583ms)
  ✔ A, B'nin firma ayarını (CAC) değiştiremez (116.227125ms)
  ✔ firma eklenemez ve silinemez (1.231292ms)
✔ Firma tablosu (176.194209ms)
▶ Filtre korumaları
  ✔ güncelleme verisinde tenantId varsa işlem durdurulur (55.139958ms)
  ✔ ilişki alanıyla güncelleme reddedilir (tenant: connect) (0.729833ms)
  ✔ ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz (182.600167ms)
  ✔ iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır (57.639583ms)
  ✔ kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz (112.818209ms)
✔ Filtre korumaları (409.875416ms)
▶ Silme koruması
  ✔ müşteri, plan, abonelik ve olaylarda deleteMany reddedilir, kayıtlar yerinde kalır (292.742958ms)
  ✔ tek kayıt silme (delete) de reddedilir, kayıtlar yerinde kalır (282.523459ms)
  ✔ kullanıcı (User) tablosunda silme filtre tarafından engellenmez (58.073291ms)
✔ Silme koruması (634.105125ms)
(node:78098) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/duman.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78098) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https: or libpq SSL mode definitions.
✔ tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor (0.254834ms)
✔ var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor) (561.3125ms)
✔ var olmayan firma adına firma tablosunda hiçbir kayıt görünmez (58.615292ms)
ℹ tests 44
ℹ suites 14
ℹ pass 44
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 19323.692417
kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 53ms

  Creating an optimized production build ...
✓ Compiled successfully in 464ms
  Running TypeScript ...
  Finished TypeScript in 1026ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 390ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 84ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 6ms

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

kullanici@bilgisayar abonetakip %
````

### Claude cevabı 13 · 22 Eki 2026 23:26

> Hepsi temiz, commit'e hazır.
>
> - **`npm test`:** 59 testin 59'u geçti. Koruma testleri ve `kurallar.test.ts` de yeşil, yani yeni dosyalarda ham prisma kullanılmıyor.
> - **`npm run test:db`:** 44 testin 44'ü geçti.
> - **`npm run build`:** Başarılı. Yeni betikler de tip kontrolünden geçti.
> - **Taramalar:** Dördü de temiz. Test dosyasındaki örnek adresler `ep-xxxx` biçiminde olduğu için sunucu adı taraması `0` verdi.
>
> ## Commit
>
> ```zsh
> git commit -m "chore: demo verisi ve test dalında çalıştırma betiği"
> ```
>
> Dört Gün 9 commit'ini gösterir:
> ```zsh
> git --no-pager log --oneline -5
> ```
>
> ## Gün 9 bitiş kontrolü (test dalında, elle)
>
> Commit'ten sonra bu adımları sırayla yap. Push etmeden önce sonuçları bana yaz.
>
> **1. Uygulamayı test dalında başlat.** Bu komut uygulamayı test dalına bağlı açar ve terminal penceresi açık kaldıkça çalışır:
> ```zsh
> npm run dev:test
> ```
> Ekranda "Uygulama TEST DALINA bağlı olarak başlatılıyor" yazmalı. "Durduruldu" yazarsa devam etme, mesajı bana gönder.
>
> **2. Test firması oluştur.** Tarayıcıda `http://localhost:3000/kayit` adresini aç ve yeni bir firma kaydet:
> - Firma adı: "Demo Yazılım"
> - E-posta: `demo-yonetici@example.com`
> - Parola: yalnızca bu test için uydurduğun bir parola. Gerçek parolalarından birini kullanma ve bana yazma.
>
> Kayıt olabildiysen uygulama test dalına bağlı demektir, çünkü bu kullanıcı canlıda yok.
>
> **3. Boş durumu kontrol et.** `/dashboard` sayfasında kartlar yerine şunlar görünmeli:
> - "Henüz abonelik yok, ilk aboneliği ekleyin" mesajı
> - "Abonelik ekle" düğmesi
>
> **4. Demo verisini ekle.** İkinci bir Terminal sekmesi aç (Cmd+T), proje klasörüne geç ve şunu çalıştır. Komut, az önce kaydettiğin firmaya senaryonun sahte verisini ekler:
> ```zsh
> npm run demo:veri -- demo-yonetici@example.com
> ```
> Ekranda "Demo verisi eklendi (test dalı)" ve beklenen değerler yazmalı.
>
> **5. Dashboard'u kontrol et.** Sayfayı yenile (Cmd+R). Beklenenler:
>
> | Alan | Beklenen |
> |---|---|
> | MRR | 1.000 TL |
> | Aylık churn | %66,7 |
> | LTV | 1.500 TL, altında "ARPU 1.000 TL × ortalama ömür 1,5 ay" |
> | LTV / CAC | "—", altında "CAC girilmedi. Ayarlardan CAC girin" bağlantısı |
> | Müşteri özeti | Aktif 1, yeni 0, iptal 2 |
>
> **6. CAC'yi gir.** Bağlantıya tıkla ve `/ayarlar` sayfasında şunları dene:
> - `12,5` yaz ve kaydet. Kırmızı hata mesajı çıkmalı.
> - `5000` yaz ve kaydet. "CAC 5.000 TL olarak kaydedildi." mesajı çıkmalı ve alanda 5000 kalmalı.
> - `/dashboard` sayfasına dön. LTV/CAC kartında **0,3** ve sarı **"! Dikkat (3'ün altında)"** etiketi görünmeli.
>
> **7. Finance kontrolü.** `/kullanicilar` sayfasında finance kullanıcısı ekleyebiliyor musun? Bu sayfanın şu an ne durumda olduğunu bilmiyorum.
> - **Ekleyebiliyorsan:** Bir finance kullanıcısı oluştur (ör. `demo-finans@example.com`). Safari'de gizli pencere açıp (Cmd+Shift+N) o kullanıcıyla giriş yap ve kontrol et:
>   - `/ayarlar` sayfasında "Bu sayfaya erişim yetkiniz yok" mesajı çıkmalı.
>   - Dashboard'u görebilmeli.
> - **Ekleyemiyorsan:** Söyle. "Finance CAC'yi değiştiremez (sunucu tarafında da)" kontrolü şu an `cac-ayari.test.ts` ile otomatik olarak kanıtlanmış durumda. Elle kontrolü kullanıcı yönetimi geldiğinde yaparız.
>
> **8. Tekrar çalıştırma koruması (isteğe bağlı).** 4. adımdaki komutu tekrar çalıştır. "Bu firmada zaten abonelik var" diyerek hiçbir şey yazmadan durmalı.
>
> **9. Sunucuyu durdur.** Birinci Terminal sekmesinde Control+C'ye bas. Mac'te de Cmd değil Control tuşu.
>
> ## Sonrası
>
> Elle kontrol tamamsa dalı GitHub'a göndereceğiz ve PR açacağız. Komutları sonuçlarını gördükten sonra vereceğim. Gün 8'de olduğu gibi prompt günlüğünü ve README güncellemesini ayrı bir `docs` PR'ı olarak yapmak istersen onu da hazırlarım. Günlüğe yapıştıracağın her içerikte `[DATABASE_URL]`, `[NEON_HOST]` ve `[NEON_PAROLA]` maskelerini unutma.

