# Gün 1: Planlama, issue'lar ve README

> Bu dosya, Gün 1 için yazdığım promptu ve yapay zekânın cevabını içerir.
> **Araç:** Claude (claude.ai, "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler).
> Cevabın hiç düzenlenmemiş hâli bu sayfanın "Ham metin" bölümündedir. Kişisel bilgiler (Mac kullanıcı adı) gizlenmiştir, gizli bilgi taraması yapılmıştır.

## Prompt

````text
# Ortak Başlık (kısa hâl: kurallar Project talimatlarındaysa bunu kullan)
Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
Ben kod bilmeyen bir YBS öğrencisiyim, Türkçe, sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: [Gün 1- planlama, issue'lar ve README]   

## Gün 1 • Planlama, depo, proje panosu

**Amaç:** MoSCoW maddelerini GitHub Issue'larına çevirmek, README iskeletini ve proje panosunu hazırlamak.
**Önce yap:** Kurulum Rehberi'ni tamamla. `docs/` klasöründe öneri ve ADR, proje kökünde `CLAUDE.md` hazır olsun.

```
[Görev] MoSCoW kapsamımı GitHub Issues olarak yazmama yardım et. 5 MUST ve
2 SHOULD madde için birer issue hazırla. Ayrıca README.md iskeleti yaz.

[Kısıtlar]
- Her issue'da: başlık, açıklama (iş değeri, 2-3 cümle), kabul kriterleri
  (işaretlenebilir kutular), etiket (must veya should) ve tahmini gün
  (takvimde hangi güne denk geliyor).
- Kabul kriterleri test edilebilir olsun (örn. "Finance rolü ayarlar
  sayfasına girince 403 alır").
- Kapsama yeni madde ekleme.
- README yalnızca şu başlıkları içersin: Proje özeti, Teknoloji, Kurulum
  (boş bırak, Gün 13'te dolacak), Canlı adres (boş), Rol ve yetkiler,
  Dokümanlar (docs/ bağlantıları).

[Format] Önce issue listesini madde madde ver. Her issue'yu GitHub'a
doğrudan yapıştırabileceğim Markdown olarak ayrı kod bloğunda yaz. En sonda
README.md'nin tam içeriğini tek kod bloğunda ver. Ardından GitHub'da
Issue ve Projects panosunu nasıl açacağımı ekran adımlarıyla anlat.

[Doğrulama] Issue'ların 5 MUST + 2 SHOULD olduğunu say ve doğrula. Varsayım
yaptığın yeri belirt.
**Bitiş kontrolü**
- [ ] GitHub'da 7 issue açıldı, etiketler (must, should) eklendi
- [ ] Projects panosu açıldı (To do, In progress, Done) ve issue'lar eklendi
- [ ] README.md commit edildi
- **Commit:** docs: README iskeleti ve proje belgeleri

```
````

## Yapay zekânın cevabı

### Okunaklı görünüm

_Aşağıdaki görünümde cümleler aynıdır. Yalnızca sohbet kopyalanırken kaybolan kod bloğu işaretleri ve tablolar yeniden kurulmuştur._

_Gün bazlı takvim varsayımları ve issue kriterlerini hazırlıyor._

Bugün kod yazmıyoruz, yalnızca metin hazırlıyoruz: 7 issue ve README. Senin deponda hiçbir dosyayı ben değiştirmiyorum. Aşağıdakileri GitHub’a sen yapıştıracaksın.

#### Kısa plan

1. 5 MUST ve 2 SHOULD maddesini issue’ya çevirmek
2. Her issue’yu takvimde bir güne yerleştirmek (takvim aşağıdaki varsayıma dayanıyor)
3. README iskeletini yazmak
4. GitHub’da etiket, issue ve pano açma adımları
5. README’yi commit etmek

#### 1. Issue listesi

| # | Başlık | Etiket | Tahmini gün |
|---|---|---|---|
| 1 | Kayıt, giriş ve roller | must | Gün 2–3 |
| 2 | Kiracı (tenant) izolasyonu | must | Gün 3–4 |
| 3 | Müşteri ve plan yönetimi | must | Gün 5–6 |
| 4 | Abonelik yaşam döngüsü | must | Gün 7–8 |
| 5 | KPI dashboard | must | Gün 9–10 |
| 6 | SSE ile iptal ve risk uyarısı | should | Gün 11 |
| 7 | Aylık MRR grafiği | should | Gün 12 |

Gün 13 yayın ve README’nin Kurulum bölümü, Gün 14 ise test ve sunum için ayrıldı.

##### Issue 1

````markdown
# Kayıt, giriş ve roller

## Açıklama
Bir yazılım firması sisteme kendi hesabını açabilmeli ve çalışanlarını rol ile ekleyebilmeli. Bu özellik olmadan diğer özelliklerin hiçbiri kime ait olduğunu bilemez. Roller, finans çalışanının ayarlara ve kullanıcı yönetimine dokunmasını engeller.

## Kabul kriterleri
- [ ] Kayıt formu tek seferde yeni bir firma (tenant) ve o firmanın `manager` kullanıcısını oluşturur
- [ ] Parolalar veritabanında bcrypt özeti olarak saklanır, düz metin parola bulunmaz
- [ ] Doğru e-posta ve parola ile giriş yapılınca dashboard açılır
- [ ] Yanlış parola ile giriş yapılınca "E-posta veya parola hatalı" mesajı görünür ve oturum açılmaz
- [ ] Oturum çerezi httpOnly'dir (tarayıcı geliştirici araçlarında görülebilir)
- [ ] Manager, kendi firmasına `finance` rolünde kullanıcı ekleyebilir
- [ ] Finance rolü kullanıcı yönetimi sayfasına girince 403 alır
- [ ] Giriş yapmamış biri korumalı bir sayfaya girerse giriş sayfasına yönlendirilir
- [ ] Çıkış yapınca oturum kapanır ve korumalı sayfalar açılmaz

**Etiket:** must
**Tahmini gün:** Gün 2–3
````

##### Issue 2

````markdown
# Kiracı (tenant) izolasyonu

## Açıklama
Sistemi birden çok firma kullanır ve her firma yalnızca kendi verisini görmelidir. Tek bir unutulmuş filtre başka bir firmanın müşteri ve gelir bilgilerini açığa çıkarır. Bu yüzden izolasyon her sorguda ve tek bir merkezden uygulanır.

## Kabul kriterleri
- [ ] TENANTS dışındaki her tabloda `tenantId` alanı zorunludur
- [ ] Tenant filtresi tek bir merkezi yardımcı fonksiyondan uygulanır, sorgularda elle tekrar yazılmaz
- [ ] `tenantId` yalnızca oturumdan okunur; istek gövdesine veya URL'ye başka bir `tenantId` yazıldığında dikkate alınmaz
- [ ] A firmasının kullanıcısı B firmasına ait bir müşterinin adresini açınca 404 ("bulunamadı") alır
- [ ] A firmasının kullanıcısı listelerde ve dashboardda yalnızca A firmasının kayıtlarını görür
- [ ] İki sahte firma ve her birinde sahte kayıtlarla yapılan elle testte veri karışmadığı görülür

**Etiket:** must
**Tahmini gün:** Gün 3–4
````

##### Issue 3

````markdown
# Müşteri ve plan yönetimi

## Açıklama
Firma, abonelik sattığı müşterilerini ve fiyat planlarını sisteme girebilmelidir. Bunlar MRR ve churn hesabının temel verisidir. Kayıtlar silinmez, geçmiş metriklerin bozulmaması için pasife alınır.

## Kabul kriterleri
- [ ] Manager ve finance müşteri ekleyebilir, düzenleyebilir ve listeleyebilir
- [ ] Manager ve finance plan ekleyebilir: ad, fiyat (TL, tam sayı), aralık (MONTHLY veya YEARLY)
- [ ] Fiyat alanına ondalıklı, negatif veya boş değer girilince sunucu kaydı reddeder ve hata mesajı gösterir
- [ ] Müşteri veya plan "silindiğinde" kayıt veritabanında kalır, `isActive=false` olur
- [ ] Pasif plan, yeni abonelik başlatma ekranındaki plan listesinde görünmez
- [ ] Tüm girdiler sunucu tarafında doğrulanır (yalnızca tarayıcıdaki kontrol yeterli sayılmaz)

**Etiket:** must
**Tahmini gün:** Gün 5–6
````

##### Issue 4

````markdown
# Abonelik yaşam döngüsü

## Açıklama
Bir müşterinin aboneliği başlatılabilmeli, yenilenebilmeli ve iptal edilebilmelidir. Her değişiklik olay kaydı olarak tutulur; churn ve MRR geçmişi bu kayıtlardan hesaplanır. Kurallar, hatalı veya çift aboneliğin oluşmasını engeller.

## Kabul kriterleri
- [ ] Bir müşteriye aktif bir plan seçilerek abonelik başlatılır; durum ACTIVE olur ve SUBSCRIPTION_EVENTS tablosuna STARTED yazılır
- [ ] Zaten ACTIVE aboneliği olan müşteriye ikinci abonelik başlatılmak istenince sunucu reddeder ve hata mesajı gösterir
- [ ] ACTIVE abonelik yenilenince SUBSCRIPTION_EVENTS tablosuna RENEWED yazılır
- [ ] Abonelik iptal edilince durum CANCELED olur ve CANCELED olayı yazılır
- [ ] CANCELED bir aboneliği yenileme denemesi reddedilir; ekranda "Yeni abonelik başlatın" yönlendirmesi görünür
- [ ] İptal edilmiş müşteriye yeni abonelik başlatılabilir
- [ ] Müşteri detay sayfasında abonelik olaylarının tarih sıralı geçmişi görünür

**Etiket:** must
**Tahmini gün:** Gün 7–8
````

##### Issue 5

````markdown
# KPI dashboard

## Açıklama
Firma sahibi abonelik işinin sağlığını tek ekranda görmelidir. MRR, churn, ARPU, LTV ve LTV/CAC metrikleri karar vermek için gereken temel göstergelerdir. Hesaplar doğru, test edilmiş ve sıfıra bölme gibi durumlarda anlaşılır olmalıdır.

## Kabul kriterleri
- [ ] Dashboard şu kartları gösterir: MRR, aylık churn, aktif müşteri sayısı, ARPU, LTV, LTV/CAC
- [ ] MRR, ACTIVE aboneliklerin aylık fiyat toplamıdır; yıllık planlar 12'ye bölünerek eklenir
- [ ] Churn = ay içinde iptal edenler / ay başındaki aktif müşteriler
- [ ] Churn 0 olduğunda ömür ve LTV kartında hata yerine "Hesaplanamaz (bu ay iptal yok)" gibi açık bir mesaj görünür
- [ ] Aktif müşteri 0 olduğunda ARPU kartında açık bir mesaj görünür, sayfa çökmez
- [ ] LTV/CAC 3 ve üzerindeyse "sağlıklı", altındaysa "dikkat" olarak işaretlenir
- [ ] CAC değeri ayarlar sayfasından girilir; yalnızca manager bu sayfayı açabilir
- [ ] Finance rolü ayarlar sayfasına girince 403 alır, dashboard'u ise görüntüleyebilir
- [ ] Hesap fonksiyonları saf fonksiyondur ve her biri için birim testi vardır (sıfıra bölme durumları dahil)

**Etiket:** must
**Tahmini gün:** Gün 9–10
````

##### Issue 6

````markdown
# SSE ile iptal ve risk uyarısı

## Açıklama
Bir müşteri aboneliğini iptal ettiğinde firma bunu sayfayı yenilemeden hemen görmelidir. Hızlı fark etmek, müşteriyi geri kazanma şansını artırır. Bilgi tek yönlü aktığı için SSE kullanılır.

## Kabul kriterleri
- [ ] Bir abonelik iptal edilince aynı firmanın açık ekrandaki manager ve finance kullanıcıları sayfayı yenilemeden uyarı görür
- [ ] Başka bir firmanın kullanıcıları bu uyarıyı görmez
- [ ] Riskli abonelik uyarısı, tanımlanan risk kuralına uyan abonelikler için gönderilir (kural netleştirilecek)
- [ ] WebSocket veya polling kullanılmaz
- [ ] Bağlantı kopup yeniden kurulduğunda sayfa hata vermez

**Etiket:** should
**Tahmini gün:** Gün 11
````

##### Issue 7

````markdown
# Aylık MRR grafiği

## Açıklama
Tek bir MRR sayısı bugünü gösterir ama gidişatı göstermez. Aylara göre MRR grafiği, büyümenin veya düşüşün ne zaman başladığını görmeyi sağlar. Veri, abonelik olay kayıtlarından hesaplanır.

## Kabul kriterleri
- [ ] Dashboard'da son 6 ayın MRR değerleri aylık grafik olarak görünür
- [ ] Her ayın değeri, o ayın sonundaki ACTIVE aboneliklerden MRR formülüyle hesaplanır
- [ ] Verisi olmayan aylar 0 olarak gösterilir, grafik çökmez
- [ ] Grafik yalnızca aktif kullanıcının firmasının verisini kullanır
- [ ] Ay bazlı hesap fonksiyonu saf fonksiyondur ve birim testi vardır

**Etiket:** should
**Tahmini gün:** Gün 12
````

#### 2. README.md

````markdown
# AboneTakip

## Proje özeti
AboneTakip, küçük yazılım firmaları için çok kiracılı (multi-tenant) bir abonelik takip SaaS'ıdır. Firmalar müşterilerini, planlarını ve aboneliklerini yönetir; MRR, churn, ARPU, LTV ve LTV/CAC metriklerini tek bir dashboardda izler. Her firma yalnızca kendi verisini görür.

## Teknoloji
- Next.js (App Router) ve TypeScript
- PostgreSQL (Neon) ve Prisma
- Barındırma: Render (PaaS)
- Gerçek zamanlı uyarılar: Server-Sent Events (SSE)

## Kurulum
_Bu bölüm Gün 13'te doldurulacak._

## Canlı adres
_Henüz yayında değil._

## Rol ve yetkiler

| Yetki | manager | finance |
|---|---|---|
| Dashboard görüntüleme | ✅ | ✅ |
| Müşteri, plan ve abonelik kayıtları | ✅ | ✅ |
| Ayarlar (CAC dahil) | ✅ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ |

Rol kontrolü sunucu tarafında yapılır. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez.

## Dokümanlar
- [Proje önerisi](docs/proje-onerisi.md)
- [Mimari Karar Kaydı (ADR)](docs/ADR.md)
- [AI talimat dosyası](CLAUDE.md)
````

#### 3. GitHub’da yapılacaklar

##### A. Etiketleri oluştur

1. Deponu aç, üstteki Issues sekmesine tıkla.
2. Labels düğmesine, ardından New label’a tıkla.
3. Adı must yaz, bir renk seç, Create label’a tıkla.
4. Aynısını should için tekrarla.

##### B. Issue’ları aç (7 kez tekrarla)

1. Issues sekmesinde New issue’ya tıkla.
2. Kod bloğundaki ilk satırı (#  olmadan) Title alanına yaz.
3. Geri kalanını açıklama alanına yapıştır.
4. Sağdaki Labels’tan must veya should’u seç.
5. Submit new issue’ya tıkla.

##### C. Proje panosunu aç

1. Deponda üstteki Projects sekmesine, ardından New project’e tıkla.
2. Şablon olarak Board’u seç. Bu şablonda Todo, In Progress ve Done sütunları hazır gelir.
3. Projeye bir ad ver (örneğin “AboneTakip”) ve Create project’e tıkla.
4. Panonun en altındaki + Add item’a tıkla, # yaz, çıkan listeden issue’ları tek tek seç.
5. Bütün issue’lar Todo sütununa düşer. Bir işe başladığında kartı In Progress’e sürükle.

##### D. README’yi commit et

Önce README.md içeriğini proje kökünde yeni dosya olarak kaydet (AboneTakip/README.md; dosya zaten varsa içeriğini tamamen bununla değiştir). Sonra Terminal’de proje klasöründeyken şunları sırayla çalıştır:

````bash
git status
````

Değişen dosyaları gösterir. .env listede görünmemeli; görünürse dur ve bana yaz.

````bash
git add README.md
````

Yalnızca README dosyasını commit’e hazırlar.

````bash
git commit -m "docs: README iskeleti ve proje belgeleri"
````

Değişikliği açıklamasıyla birlikte kaydeder.

````bash
git push
````

Kaydı GitHub’a gönderir.

#### Doğrulama

- MUST: 1, 2, 3, 4, 5 → 5 adet ✓
- SHOULD: 6, 7 → 2 adet ✓
- Toplam 7 issue. Kapsama yeni madde eklenmedi. COULD maddeleri (CSV, plan kırılımı) issue’ya çevrilmedi.

#### Varsayımlar ve emin olmadığım yerler

- Takvim: Senin gün planını görmedim. Gün 2–14 dağılımını kendim varsaydım. Elinde bir takvim varsa günleri ona göre düzeltelim.
- docs/ dosya adları: docs/proje-onerisi.md ve docs/ADR.md olarak varsaydım. Gerçek dosya adları farklıysa README’deki bağlantıları düzelt.
- “Riskli abonelik” tanımı: CLAUDE.md’de bu kavram tanımlanmamış. Örneğin “yenileme tarihi 7 gün içinde olan” veya “hiç yenilenmemiş” gibi bir kural gerekiyor. Issue 6'ya “netleştirilecek” diye yazdım; senin karar vermen gerekiyor.
- MRR grafiği: “Son 6 ay” ve “ay sonundaki aktif abonelikler” benim varsayımım.
- Kayıt akışı: Kaydolan kişinin otomatik olarak yeni firma ve onun manager’ı olacağını varsaydım. Finance kullanıcısını ise manager’ın eklediğini düşündüm.
- GitHub ekranı: Düğme adları GitHub arayüzü değiştikçe biraz farklı olabilir. Bir adımda düğmeyi bulamazsan ekranda ne gördüğünü yaz.

### Ham metin

<details>
<summary>Cevabın hiç düzenlenmemiş hâlini göstermek için tıkla</summary>

````text
Gün bazlı takvim varsayımları ve issue kriterlerini hazırlıyor.
Bugün kod yazmıyoruz, yalnızca metin hazırlıyoruz: 7 issue ve README. Senin deponda hiçbir dosyayı ben değiştirmiyorum. Aşağıdakileri GitHub’a sen yapıştıracaksın.

Kısa plan

5 MUST ve 2 SHOULD maddesini issue’ya çevirmek
Her issue’yu takvimde bir güne yerleştirmek (takvim aşağıdaki varsayıma dayanıyor)
README iskeletini yazmak
GitHub’da etiket, issue ve pano açma adımları
README’yi commit etmek
1. Issue listesi
#	Başlık	Etiket	Tahmini gün
1	Kayıt, giriş ve roller	must	Gün 2–3
2	Kiracı (tenant) izolasyonu	must	Gün 3–4
3	Müşteri ve plan yönetimi	must	Gün 5–6
4	Abonelik yaşam döngüsü	must	Gün 7–8
5	KPI dashboard	must	Gün 9–10
6	SSE ile iptal ve risk uyarısı	should	Gün 11
7	Aylık MRR grafiği	should	Gün 12
Gün 13 yayın ve README’nin Kurulum bölümü, Gün 14 ise test ve sunum için ayrıldı.

Issue 1
markdown
# Kayıt, giriş ve roller

## Açıklama
Bir yazılım firması sisteme kendi hesabını açabilmeli ve çalışanlarını rol ile ekleyebilmeli. Bu özellik olmadan diğer özelliklerin hiçbiri kime ait olduğunu bilemez. Roller, finans çalışanının ayarlara ve kullanıcı yönetimine dokunmasını engeller.

## Kabul kriterleri
- [ ] Kayıt formu tek seferde yeni bir firma (tenant) ve o firmanın `manager` kullanıcısını oluşturur
- [ ] Parolalar veritabanında bcrypt özeti olarak saklanır, düz metin parola bulunmaz
- [ ] Doğru e-posta ve parola ile giriş yapılınca dashboard açılır
- [ ] Yanlış parola ile giriş yapılınca "E-posta veya parola hatalı" mesajı görünür ve oturum açılmaz
- [ ] Oturum çerezi httpOnly'dir (tarayıcı geliştirici araçlarında görülebilir)
- [ ] Manager, kendi firmasına `finance` rolünde kullanıcı ekleyebilir
- [ ] Finance rolü kullanıcı yönetimi sayfasına girince 403 alır
- [ ] Giriş yapmamış biri korumalı bir sayfaya girerse giriş sayfasına yönlendirilir
- [ ] Çıkış yapınca oturum kapanır ve korumalı sayfalar açılmaz

**Etiket:** must
**Tahmini gün:** Gün 2–3
Issue 2
markdown
# Kiracı (tenant) izolasyonu

## Açıklama
Sistemi birden çok firma kullanır ve her firma yalnızca kendi verisini görmelidir. Tek bir unutulmuş filtre başka bir firmanın müşteri ve gelir bilgilerini açığa çıkarır. Bu yüzden izolasyon her sorguda ve tek bir merkezden uygulanır.

## Kabul kriterleri
- [ ] TENANTS dışındaki her tabloda `tenantId` alanı zorunludur
- [ ] Tenant filtresi tek bir merkezi yardımcı fonksiyondan uygulanır, sorgularda elle tekrar yazılmaz
- [ ] `tenantId` yalnızca oturumdan okunur; istek gövdesine veya URL'ye başka bir `tenantId` yazıldığında dikkate alınmaz
- [ ] A firmasının kullanıcısı B firmasına ait bir müşterinin adresini açınca 404 ("bulunamadı") alır
- [ ] A firmasının kullanıcısı listelerde ve dashboardda yalnızca A firmasının kayıtlarını görür
- [ ] İki sahte firma ve her birinde sahte kayıtlarla yapılan elle testte veri karışmadığı görülür

**Etiket:** must
**Tahmini gün:** Gün 3–4
Issue 3
markdown
# Müşteri ve plan yönetimi

## Açıklama
Firma, abonelik sattığı müşterilerini ve fiyat planlarını sisteme girebilmelidir. Bunlar MRR ve churn hesabının temel verisidir. Kayıtlar silinmez, geçmiş metriklerin bozulmaması için pasife alınır.

## Kabul kriterleri
- [ ] Manager ve finance müşteri ekleyebilir, düzenleyebilir ve listeleyebilir
- [ ] Manager ve finance plan ekleyebilir: ad, fiyat (TL, tam sayı), aralık (MONTHLY veya YEARLY)
- [ ] Fiyat alanına ondalıklı, negatif veya boş değer girilince sunucu kaydı reddeder ve hata mesajı gösterir
- [ ] Müşteri veya plan "silindiğinde" kayıt veritabanında kalır, `isActive=false` olur
- [ ] Pasif plan, yeni abonelik başlatma ekranındaki plan listesinde görünmez
- [ ] Tüm girdiler sunucu tarafında doğrulanır (yalnızca tarayıcıdaki kontrol yeterli sayılmaz)

**Etiket:** must
**Tahmini gün:** Gün 5–6
Issue 4
markdown
# Abonelik yaşam döngüsü

## Açıklama
Bir müşterinin aboneliği başlatılabilmeli, yenilenebilmeli ve iptal edilebilmelidir. Her değişiklik olay kaydı olarak tutulur; churn ve MRR geçmişi bu kayıtlardan hesaplanır. Kurallar, hatalı veya çift aboneliğin oluşmasını engeller.

## Kabul kriterleri
- [ ] Bir müşteriye aktif bir plan seçilerek abonelik başlatılır; durum ACTIVE olur ve SUBSCRIPTION_EVENTS tablosuna STARTED yazılır
- [ ] Zaten ACTIVE aboneliği olan müşteriye ikinci abonelik başlatılmak istenince sunucu reddeder ve hata mesajı gösterir
- [ ] ACTIVE abonelik yenilenince SUBSCRIPTION_EVENTS tablosuna RENEWED yazılır
- [ ] Abonelik iptal edilince durum CANCELED olur ve CANCELED olayı yazılır
- [ ] CANCELED bir aboneliği yenileme denemesi reddedilir; ekranda "Yeni abonelik başlatın" yönlendirmesi görünür
- [ ] İptal edilmiş müşteriye yeni abonelik başlatılabilir
- [ ] Müşteri detay sayfasında abonelik olaylarının tarih sıralı geçmişi görünür

**Etiket:** must
**Tahmini gün:** Gün 7–8
Issue 5
markdown
# KPI dashboard

## Açıklama
Firma sahibi abonelik işinin sağlığını tek ekranda görmelidir. MRR, churn, ARPU, LTV ve LTV/CAC metrikleri karar vermek için gereken temel göstergelerdir. Hesaplar doğru, test edilmiş ve sıfıra bölme gibi durumlarda anlaşılır olmalıdır.

## Kabul kriterleri
- [ ] Dashboard şu kartları gösterir: MRR, aylık churn, aktif müşteri sayısı, ARPU, LTV, LTV/CAC
- [ ] MRR, ACTIVE aboneliklerin aylık fiyat toplamıdır; yıllık planlar 12'ye bölünerek eklenir
- [ ] Churn = ay içinde iptal edenler / ay başındaki aktif müşteriler
- [ ] Churn 0 olduğunda ömür ve LTV kartında hata yerine "Hesaplanamaz (bu ay iptal yok)" gibi açık bir mesaj görünür
- [ ] Aktif müşteri 0 olduğunda ARPU kartında açık bir mesaj görünür, sayfa çökmez
- [ ] LTV/CAC 3 ve üzerindeyse "sağlıklı", altındaysa "dikkat" olarak işaretlenir
- [ ] CAC değeri ayarlar sayfasından girilir; yalnızca manager bu sayfayı açabilir
- [ ] Finance rolü ayarlar sayfasına girince 403 alır, dashboard'u ise görüntüleyebilir
- [ ] Hesap fonksiyonları saf fonksiyondur ve her biri için birim testi vardır (sıfıra bölme durumları dahil)

**Etiket:** must
**Tahmini gün:** Gün 9–10
Issue 6
markdown
# SSE ile iptal ve risk uyarısı

## Açıklama
Bir müşteri aboneliğini iptal ettiğinde firma bunu sayfayı yenilemeden hemen görmelidir. Hızlı fark etmek, müşteriyi geri kazanma şansını artırır. Bilgi tek yönlü aktığı için SSE kullanılır.

## Kabul kriterleri
- [ ] Bir abonelik iptal edilince aynı firmanın açık ekrandaki manager ve finance kullanıcıları sayfayı yenilemeden uyarı görür
- [ ] Başka bir firmanın kullanıcıları bu uyarıyı görmez
- [ ] Riskli abonelik uyarısı, tanımlanan risk kuralına uyan abonelikler için gönderilir (kural netleştirilecek)
- [ ] WebSocket veya polling kullanılmaz
- [ ] Bağlantı kopup yeniden kurulduğunda sayfa hata vermez

**Etiket:** should
**Tahmini gün:** Gün 11
Issue 7
markdown
# Aylık MRR grafiği

## Açıklama
Tek bir MRR sayısı bugünü gösterir ama gidişatı göstermez. Aylara göre MRR grafiği, büyümenin veya düşüşün ne zaman başladığını görmeyi sağlar. Veri, abonelik olay kayıtlarından hesaplanır.

## Kabul kriterleri
- [ ] Dashboard'da son 6 ayın MRR değerleri aylık grafik olarak görünür
- [ ] Her ayın değeri, o ayın sonundaki ACTIVE aboneliklerden MRR formülüyle hesaplanır
- [ ] Verisi olmayan aylar 0 olarak gösterilir, grafik çökmez
- [ ] Grafik yalnızca aktif kullanıcının firmasının verisini kullanır
- [ ] Ay bazlı hesap fonksiyonu saf fonksiyondur ve birim testi vardır

**Etiket:** should
**Tahmini gün:** Gün 12
2. README.md
markdown
# AboneTakip

## Proje özeti
AboneTakip, küçük yazılım firmaları için çok kiracılı (multi-tenant) bir abonelik takip SaaS'ıdır. Firmalar müşterilerini, planlarını ve aboneliklerini yönetir; MRR, churn, ARPU, LTV ve LTV/CAC metriklerini tek bir dashboardda izler. Her firma yalnızca kendi verisini görür.

## Teknoloji
- Next.js (App Router) ve TypeScript
- PostgreSQL (Neon) ve Prisma
- Barındırma: Render (PaaS)
- Gerçek zamanlı uyarılar: Server-Sent Events (SSE)

## Kurulum
_Bu bölüm Gün 13'te doldurulacak._

## Canlı adres
_Henüz yayında değil._

## Rol ve yetkiler

| Yetki | manager | finance |
|---|---|---|
| Dashboard görüntüleme | ✅ | ✅ |
| Müşteri, plan ve abonelik kayıtları | ✅ | ✅ |
| Ayarlar (CAC dahil) | ✅ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ |

Rol kontrolü sunucu tarafında yapılır. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez.

## Dokümanlar
- [Proje önerisi](docs/proje-onerisi.md)
- [Mimari Karar Kaydı (ADR)](docs/ADR.md)
- [AI talimat dosyası](CLAUDE.md)
3. GitHub’da yapılacaklar
A. Etiketleri oluştur

Deponu aç, üstteki Issues sekmesine tıkla.
Labels düğmesine, ardından New label’a tıkla.
Adı must yaz, bir renk seç, Create label’a tıkla.
Aynısını should için tekrarla.
B. Issue’ları aç (7 kez tekrarla)

Issues sekmesinde New issue’ya tıkla.
Kod bloğundaki ilk satırı (#  olmadan) Title alanına yaz.
Geri kalanını açıklama alanına yapıştır.
Sağdaki Labels’tan must veya should’u seç.
Submit new issue’ya tıkla.
C. Proje panosunu aç

Deponda üstteki Projects sekmesine, ardından New project’e tıkla.
Şablon olarak Board’u seç. Bu şablonda Todo, In Progress ve Done sütunları hazır gelir.
Projeye bir ad ver (örneğin “AboneTakip”) ve Create project’e tıkla.
Panonun en altındaki + Add item’a tıkla, # yaz, çıkan listeden issue’ları tek tek seç.
Bütün issue’lar Todo sütununa düşer. Bir işe başladığında kartı In Progress’e sürükle.
D. README’yi commit et

Önce README.md içeriğini proje kökünde yeni dosya olarak kaydet (AboneTakip/README.md; dosya zaten varsa içeriğini tamamen bununla değiştir). Sonra Terminal’de proje klasöründeyken şunları sırayla çalıştır:

zsh
git status
Değişen dosyaları gösterir. .env listede görünmemeli; görünürse dur ve bana yaz.

zsh
git add README.md
Yalnızca README dosyasını commit’e hazırlar.

zsh
git commit -m "docs: README iskeleti ve proje belgeleri"
Değişikliği açıklamasıyla birlikte kaydeder.

zsh
git push
Kaydı GitHub’a gönderir.

Doğrulama
MUST: 1, 2, 3, 4, 5 → 5 adet ✓
SHOULD: 6, 7 → 2 adet ✓
Toplam 7 issue. Kapsama yeni madde eklenmedi. COULD maddeleri (CSV, plan kırılımı) issue’ya çevrilmedi.
Varsayımlar ve emin olmadığım yerler
Takvim: Senin gün planını görmedim. Gün 2–14 dağılımını kendim varsaydım. Elinde bir takvim varsa günleri ona göre düzeltelim.
docs/ dosya adları: docs/proje-onerisi.md ve docs/ADR.md olarak varsaydım. Gerçek dosya adları farklıysa README’deki bağlantıları düzelt.
“Riskli abonelik” tanımı: CLAUDE.md’de bu kavram tanımlanmamış. Örneğin “yenileme tarihi 7 gün içinde olan” veya “hiç yenilenmemiş” gibi bir kural gerekiyor. Issue 6'ya “netleştirilecek” diye yazdım; senin karar vermen gerekiyor.
MRR grafiği: “Son 6 ay” ve “ay sonundaki aktif abonelikler” benim varsayımım.
Kayıt akışı: Kaydolan kişinin otomatik olarak yeni firma ve onun manager’ı olacağını varsaydım. Finance kullanıcısını ise manager’ın eklediğini düşündüm.
GitHub ekranı: Düğme adları GitHub arayüzü değiştikçe biraz farklı olabilir. Bir adımda düğmeyi bulamazsan ekranda ne gördüğünü yaz.
````

</details>

## Sonuç

| | |
|---|---|
| **Ne istendi** | 7 issue (5 MUST + 2 SHOULD) ve README taslağı |
| **Ne üretildi** | 7 issue metni (başlık, açıklama, kabul kriterleri, etiket, tahmini gün), README iskeleti, GitHub'da etiket, issue ve pano açma adımları |
| **Düzeltme gerekti mi** | Evet. Gün aralıkları, README bağlantıları, "riskli abonelik" kuralı ve MRR grafiği süresi bizim planımıza göre düzeltildi |

Bu gün sonunda GitHub'da 7 issue ve proje panosu (Todo, In Progress, Done) kuruldu. Pano sonradan aynı issue'larla ilerletildi.
