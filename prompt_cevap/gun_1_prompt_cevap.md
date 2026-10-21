# Gün 1: Planlama, issue'lar ve README

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 19 Eki 2026 (Türkiye saati). **Kapsam:** 15 prompt ve 15 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | 7 issue (5 MUST + 2 SHOULD) ve README taslağı |
| **Ne üretildi** | 7 issue ve README üretildi |
| **Düzeltme gerekti mi** | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |

## Gün 1 promptunun verildiği sohbet (GitHub Issues ve README planlaması)

_Gün 1 promptu ayrı bir sohbette çalıştırıldı._

### Prompt 1 · 19 Eki 2026 11:51

````text
```markdown
# Ortak Başlık (kısa hâl: kurallar Project talimatlarındaysa bunu kullan)


```

Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
Ben kod bilmeyen bir YBS öğrencisiyim, Türkçe, sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: [Gün 1- planlama, issue'lar ve README]   

```markdown
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
```

**Bitiş kontrolü**
- [ ] GitHub'da 7 issue açıldı, etiketler (must, should) eklendi
- [ ] Projects panosu açıldı (To do, In progress, Done) ve issue'lar eklendi
- [ ] `README.md` commit edildi
- **Commit:** `docs: README iskeleti ve proje belgeleri`

```


```

```
````

### Claude cevabı 1 · 19 Eki 2026 11:52

> Bugün kod yazmıyoruz, yalnızca metin hazırlıyoruz: 7 issue ve README. Senin deponda hiçbir dosyayı ben değiştirmiyorum. Aşağıdakileri GitHub'a sen yapıştıracaksın.
>
> **Kısa plan**
> 1. 5 MUST ve 2 SHOULD maddesini issue'ya çevirmek
> 2. Her issue'yu takvimde bir güne yerleştirmek (takvim aşağıdaki varsayıma dayanıyor)
> 3. README iskeletini yazmak
> 4. GitHub'da etiket, issue ve pano açma adımları
> 5. README'yi commit etmek
>
> ---
>
> ## 1. Issue listesi
>
> | # | Başlık | Etiket | Tahmini gün |
> |---|---|---|---|
> | 1 | Kayıt, giriş ve roller | must | Gün 2–3 |
> | 2 | Kiracı (tenant) izolasyonu | must | Gün 3–4 |
> | 3 | Müşteri ve plan yönetimi | must | Gün 5–6 |
> | 4 | Abonelik yaşam döngüsü | must | Gün 7–8 |
> | 5 | KPI dashboard | must | Gün 9–10 |
> | 6 | SSE ile iptal ve risk uyarısı | should | Gün 11 |
> | 7 | Aylık MRR grafiği | should | Gün 12 |
>
> Gün 13 yayın ve README'nin Kurulum bölümü, Gün 14 ise test ve sunum için ayrıldı.
>
> ---
>
> ### Issue 1
>
> ```markdown
> # Kayıt, giriş ve roller
>
> ## Açıklama
> Bir yazılım firması sisteme kendi hesabını açabilmeli ve çalışanlarını rol ile ekleyebilmeli. Bu özellik olmadan diğer özelliklerin hiçbiri kime ait olduğunu bilemez. Roller, finans çalışanının ayarlara ve kullanıcı yönetimine dokunmasını engeller.
>
> ## Kabul kriterleri
> - [ ] Kayıt formu tek seferde yeni bir firma (tenant) ve o firmanın `manager` kullanıcısını oluşturur
> - [ ] Parolalar veritabanında bcrypt özeti olarak saklanır, düz metin parola bulunmaz
> - [ ] Doğru e-posta ve parola ile giriş yapılınca dashboard açılır
> - [ ] Yanlış parola ile giriş yapılınca "E-posta veya parola hatalı" mesajı görünür ve oturum açılmaz
> - [ ] Oturum çerezi httpOnly'dir (tarayıcı geliştirici araçlarında görülebilir)
> - [ ] Manager, kendi firmasına `finance` rolünde kullanıcı ekleyebilir
> - [ ] Finance rolü kullanıcı yönetimi sayfasına girince 403 alır
> - [ ] Giriş yapmamış biri korumalı bir sayfaya girerse giriş sayfasına yönlendirilir
> - [ ] Çıkış yapınca oturum kapanır ve korumalı sayfalar açılmaz
>
> **Etiket:** must
> **Tahmini gün:** Gün 2–3
> ```
>
> ### Issue 2
>
> ```markdown
> # Kiracı (tenant) izolasyonu
>
> ## Açıklama
> Sistemi birden çok firma kullanır ve her firma yalnızca kendi verisini görmelidir. Tek bir unutulmuş filtre başka bir firmanın müşteri ve gelir bilgilerini açığa çıkarır. Bu yüzden izolasyon her sorguda ve tek bir merkezden uygulanır.
>
> ## Kabul kriterleri
> - [ ] TENANTS dışındaki her tabloda `tenantId` alanı zorunludur
> - [ ] Tenant filtresi tek bir merkezi yardımcı fonksiyondan uygulanır, sorgularda elle tekrar yazılmaz
> - [ ] `tenantId` yalnızca oturumdan okunur; istek gövdesine veya URL'ye başka bir `tenantId` yazıldığında dikkate alınmaz
> - [ ] A firmasının kullanıcısı B firmasına ait bir müşterinin adresini açınca 404 ("bulunamadı") alır
> - [ ] A firmasının kullanıcısı listelerde ve dashboardda yalnızca A firmasının kayıtlarını görür
> - [ ] İki sahte firma ve her birinde sahte kayıtlarla yapılan elle testte veri karışmadığı görülür
>
> **Etiket:** must
> **Tahmini gün:** Gün 3–4
> ```
>
> ### Issue 3
>
> ```markdown
> # Müşteri ve plan yönetimi
>
> ## Açıklama
> Firma, abonelik sattığı müşterilerini ve fiyat planlarını sisteme girebilmelidir. Bunlar MRR ve churn hesabının temel verisidir. Kayıtlar silinmez, geçmiş metriklerin bozulmaması için pasife alınır.
>
> ## Kabul kriterleri
> - [ ] Manager ve finance müşteri ekleyebilir, düzenleyebilir ve listeleyebilir
> - [ ] Manager ve finance plan ekleyebilir: ad, fiyat (TL, tam sayı), aralık (MONTHLY veya YEARLY)
> - [ ] Fiyat alanına ondalıklı, negatif veya boş değer girilince sunucu kaydı reddeder ve hata mesajı gösterir
> - [ ] Müşteri veya plan "silindiğinde" kayıt veritabanında kalır, `isActive=false` olur
> - [ ] Pasif plan, yeni abonelik başlatma ekranındaki plan listesinde görünmez
> - [ ] Tüm girdiler sunucu tarafında doğrulanır (yalnızca tarayıcıdaki kontrol yeterli sayılmaz)
>
> **Etiket:** must
> **Tahmini gün:** Gün 5–6
> ```
>
> ### Issue 4
>
> ```markdown
> # Abonelik yaşam döngüsü
>
> ## Açıklama
> Bir müşterinin aboneliği başlatılabilmeli, yenilenebilmeli ve iptal edilebilmelidir. Her değişiklik olay kaydı olarak tutulur; churn ve MRR geçmişi bu kayıtlardan hesaplanır. Kurallar, hatalı veya çift aboneliğin oluşmasını engeller.
>
> ## Kabul kriterleri
> - [ ] Bir müşteriye aktif bir plan seçilerek abonelik başlatılır; durum ACTIVE olur ve SUBSCRIPTION_EVENTS tablosuna STARTED yazılır
> - [ ] Zaten ACTIVE aboneliği olan müşteriye ikinci abonelik başlatılmak istenince sunucu reddeder ve hata mesajı gösterir
> - [ ] ACTIVE abonelik yenilenince SUBSCRIPTION_EVENTS tablosuna RENEWED yazılır
> - [ ] Abonelik iptal edilince durum CANCELED olur ve CANCELED olayı yazılır
> - [ ] CANCELED bir aboneliği yenileme denemesi reddedilir; ekranda "Yeni abonelik başlatın" yönlendirmesi görünür
> - [ ] İptal edilmiş müşteriye yeni abonelik başlatılabilir
> - [ ] Müşteri detay sayfasında abonelik olaylarının tarih sıralı geçmişi görünür
>
> **Etiket:** must
> **Tahmini gün:** Gün 7–8
> ```
>
> ### Issue 5
>
> ```markdown
> # KPI dashboard
>
> ## Açıklama
> Firma sahibi abonelik işinin sağlığını tek ekranda görmelidir. MRR, churn, ARPU, LTV ve LTV/CAC metrikleri karar vermek için gereken temel göstergelerdir. Hesaplar doğru, test edilmiş ve sıfıra bölme gibi durumlarda anlaşılır olmalıdır.
>
> ## Kabul kriterleri
> - [ ] Dashboard şu kartları gösterir: MRR, aylık churn, aktif müşteri sayısı, ARPU, LTV, LTV/CAC
> - [ ] MRR, ACTIVE aboneliklerin aylık fiyat toplamıdır; yıllık planlar 12'ye bölünerek eklenir
> - [ ] Churn = ay içinde iptal edenler / ay başındaki aktif müşteriler
> - [ ] Churn 0 olduğunda ömür ve LTV kartında hata yerine "Hesaplanamaz (bu ay iptal yok)" gibi açık bir mesaj görünür
> - [ ] Aktif müşteri 0 olduğunda ARPU kartında açık bir mesaj görünür, sayfa çökmez
> - [ ] LTV/CAC 3 ve üzerindeyse "sağlıklı", altındaysa "dikkat" olarak işaretlenir
> - [ ] CAC değeri ayarlar sayfasından girilir; yalnızca manager bu sayfayı açabilir
> - [ ] Finance rolü ayarlar sayfasına girince 403 alır, dashboard'u ise görüntüleyebilir
> - [ ] Hesap fonksiyonları saf fonksiyondur ve her biri için birim testi vardır (sıfıra bölme durumları dahil)
>
> **Etiket:** must
> **Tahmini gün:** Gün 9–10
> ```
>
> ### Issue 6
>
> ```markdown
> # SSE ile iptal ve risk uyarısı
>
> ## Açıklama
> Bir müşteri aboneliğini iptal ettiğinde firma bunu sayfayı yenilemeden hemen görmelidir. Hızlı fark etmek, müşteriyi geri kazanma şansını artırır. Bilgi tek yönlü aktığı için SSE kullanılır.
>
> ## Kabul kriterleri
> - [ ] Bir abonelik iptal edilince aynı firmanın açık ekrandaki manager ve finance kullanıcıları sayfayı yenilemeden uyarı görür
> - [ ] Başka bir firmanın kullanıcıları bu uyarıyı görmez
> - [ ] Riskli abonelik uyarısı, tanımlanan risk kuralına uyan abonelikler için gönderilir (kural netleştirilecek)
> - [ ] WebSocket veya polling kullanılmaz
> - [ ] Bağlantı kopup yeniden kurulduğunda sayfa hata vermez
>
> **Etiket:** should
> **Tahmini gün:** Gün 11
> ```
>
> ### Issue 7
>
> ```markdown
> # Aylık MRR grafiği
>
> ## Açıklama
> Tek bir MRR sayısı bugünü gösterir ama gidişatı göstermez. Aylara göre MRR grafiği, büyümenin veya düşüşün ne zaman başladığını görmeyi sağlar. Veri, abonelik olay kayıtlarından hesaplanır.
>
> ## Kabul kriterleri
> - [ ] Dashboard'da son 6 ayın MRR değerleri aylık grafik olarak görünür
> - [ ] Her ayın değeri, o ayın sonundaki ACTIVE aboneliklerden MRR formülüyle hesaplanır
> - [ ] Verisi olmayan aylar 0 olarak gösterilir, grafik çökmez
> - [ ] Grafik yalnızca aktif kullanıcının firmasının verisini kullanır
> - [ ] Ay bazlı hesap fonksiyonu saf fonksiyondur ve birim testi vardır
>
> **Etiket:** should
> **Tahmini gün:** Gün 12
> ```
>
> ---
>
> ## 2. README.md
>
> ```markdown
> # AboneTakip
>
> ## Proje özeti
> AboneTakip, küçük yazılım firmaları için çok kiracılı (multi-tenant) bir abonelik takip SaaS'ıdır. Firmalar müşterilerini, planlarını ve aboneliklerini yönetir; MRR, churn, ARPU, LTV ve LTV/CAC metriklerini tek bir dashboardda izler. Her firma yalnızca kendi verisini görür.
>
> ## Teknoloji
> - Next.js (App Router) ve TypeScript
> - PostgreSQL (Neon) ve Prisma
> - Barındırma: Render (PaaS)
> - Gerçek zamanlı uyarılar: Server-Sent Events (SSE)
>
> ## Kurulum
> _Bu bölüm Gün 13'te doldurulacak._
>
> ## Canlı adres
> _Henüz yayında değil._
>
> ## Rol ve yetkiler
>
> | Yetki | manager | finance |
> |---|---|---|
> | Dashboard görüntüleme | ✅ | ✅ |
> | Müşteri, plan ve abonelik kayıtları | ✅ | ✅ |
> | Ayarlar (CAC dahil) | ✅ | ❌ |
> | Kullanıcı yönetimi | ✅ | ❌ |
>
> Rol kontrolü sunucu tarafında yapılır. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez.
>
> ## Dokümanlar
> - [Proje önerisi](docs/proje-onerisi.md)
> - [Mimari Karar Kaydı (ADR)](docs/ADR.md)
> - [AI talimat dosyası](CLAUDE.md)
> ```
>
> ---
>
> ## 3. GitHub'da yapılacaklar
>
> **A. Etiketleri oluştur**
> 1. Deponu aç, üstteki **Issues** sekmesine tıkla.
> 2. **Labels** düğmesine, ardından **New label**'a tıkla.
> 3. Adı `must` yaz, bir renk seç, **Create label**'a tıkla.
> 4. Aynısını `should` için tekrarla.
>
> **B. Issue'ları aç (7 kez tekrarla)**
> 1. **Issues** sekmesinde **New issue**'ya tıkla.
> 2. Kod bloğundaki ilk satırı (`# ` olmadan) **Title** alanına yaz.
> 3. Geri kalanını açıklama alanına yapıştır.
> 4. Sağdaki **Labels**'tan `must` veya `should`'u seç.
> 5. **Submit new issue**'ya tıkla.
>
> **C. Proje panosunu aç**
> 1. Deponda üstteki **Projects** sekmesine, ardından **New project**'e tıkla.
> 2. Şablon olarak **Board**'u seç. Bu şablonda Todo, In Progress ve Done sütunları hazır gelir.
> 3. Projeye bir ad ver (örneğin "AboneTakip") ve **Create project**'e tıkla.
> 4. Panonun en altındaki **+ Add item**'a tıkla, `#` yaz, çıkan listeden issue'ları tek tek seç.
> 5. Bütün issue'lar **Todo** sütununa düşer. Bir işe başladığında kartı **In Progress**'e sürükle.
>
> **D. README'yi commit et**
>
> Önce README.md içeriğini proje kökünde **yeni dosya** olarak kaydet (`AboneTakip/README.md`; dosya zaten varsa içeriğini tamamen bununla değiştir). Sonra Terminal'de proje klasöründeyken şunları sırayla çalıştır:
>
> ```zsh
> git status
> ```
> Değişen dosyaları gösterir. `.env` listede **görünmemeli**; görünürse dur ve bana yaz.
>
> ```zsh
> git add README.md
> ```
> Yalnızca README dosyasını commit'e hazırlar.
>
> ```zsh
> git commit -m "docs: README iskeleti ve proje belgeleri"
> ```
> Değişikliği açıklamasıyla birlikte kaydeder.
>
> ```zsh
> git push
> ```
> Kaydı GitHub'a gönderir.
>
> ---
>
> ## Doğrulama
> - MUST: 1, 2, 3, 4, 5 → **5 adet** ✓
> - SHOULD: 6, 7 → **2 adet** ✓
> - Toplam **7 issue**. Kapsama yeni madde eklenmedi. COULD maddeleri (CSV, plan kırılımı) issue'ya çevrilmedi.
>
> ## Varsayımlar ve emin olmadığım yerler
> 1. **Takvim:** Senin gün planını görmedim. Gün 2–14 dağılımını kendim varsaydım. Elinde bir takvim varsa günleri ona göre düzeltelim.
> 2. **docs/ dosya adları:** `docs/proje-onerisi.md` ve `docs/ADR.md` olarak varsaydım. Gerçek dosya adları farklıysa README'deki bağlantıları düzelt.
> 3. **"Riskli abonelik" tanımı:** CLAUDE.md'de bu kavram tanımlanmamış. Örneğin "yenileme tarihi 7 gün içinde olan" veya "hiç yenilenmemiş" gibi bir kural gerekiyor. Issue 6'ya "netleştirilecek" diye yazdım; senin karar vermen gerekiyor.
> 4. **MRR grafiği:** "Son 6 ay" ve "ay sonundaki aktif abonelikler" benim varsayımım.
> 5. **Kayıt akışı:** Kaydolan kişinin otomatik olarak yeni firma ve onun manager'ı olacağını varsaydım. Finance kullanıcısını ise manager'ın eklediğini düşündüm.
> 6. **GitHub ekranı:** Düğme adları GitHub arayüzü değiştikçe biraz farklı olabilir. Bir adımda düğmeyi bulamazsan ekranda ne gördüğünü yaz.


## Ana sohbet: Gün 1 uygulaması

_Sonuçlar ana sohbete getirilip adım adım uygulandı._

### Prompt 1 · 19 Eki 2026 11:52

_[yapıştırılan metin]_

````text
Bugün kod yazmıyoruz, yalnızca metin hazırlıyoruz: 7 issue ve README. Senin deponda hiçbir dosyayı ben değiştirmiyorum. Aşağıdakileri GitHub'a sen yapıştıracaksın.

**Kısa plan**
1. 5 MUST ve 2 SHOULD maddesini issue'ya çevirmek
2. Her issue'yu takvimde bir güne yerleştirmek (takvim aşağıdaki varsayıma dayanıyor)
3. README iskeletini yazmak
4. GitHub'da etiket, issue ve pano açma adımları
5. README'yi commit etmek

---

## 1. Issue listesi

| # | Başlık | Etiket | Tahmini gün |
|---|---|---|---|
| 1 | Kayıt, giriş ve roller | must | Gün 2–3 |
| 2 | Kiracı (tenant) izolasyonu | must | Gün 3–4 |
| 3 | Müşteri ve plan yönetimi | must | Gün 5–6 |
| 4 | Abonelik yaşam döngüsü | must | Gün 7–8 |
| 5 | KPI dashboard | must | Gün 9–10 |
| 6 | SSE ile iptal ve risk uyarısı | should | Gün 11 |
| 7 | Aylık MRR grafiği | should | Gün 12 |

Gün 13 yayın ve README'nin Kurulum bölümü, Gün 14 ise test ve sunum için ayrıldı.

---

### Issue 1

```markdown
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
```

### Issue 2

```markdown
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
```

### Issue 3

```markdown
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
```

### Issue 4

```markdown
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
```

### Issue 5

```markdown
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
```

### Issue 6

```markdown
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
```

### Issue 7

```markdown
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
```

---

## 2. README.md

```markdown
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
```

---

## 3. GitHub'da yapılacaklar

**A. Etiketleri oluştur**
1. Deponu aç, üstteki **Issues** sekmesine tıkla.
2. **Labels** düğmesine, ardından **New label**'a tıkla.
3. Adı `must` yaz, bir renk seç, **Create label**'a tıkla.
4. Aynısını `should` için tekrarla.

**B. Issue'ları aç (7 kez tekrarla)**
1. **Issues** sekmesinde **New issue**'ya tıkla.
2. Kod bloğundaki ilk satırı (`# ` olmadan) **Title** alanına yaz.
3. Geri kalanını açıklama alanına yapıştır.
4. Sağdaki **Labels**'tan `must` veya `should`'u seç.
5. **Submit new issue**'ya tıkla.

**C. Proje panosunu aç**
1. Deponda üstteki **Projects** sekmesine, ardından **New project**'e tıkla.
2. Şablon olarak **Board**'u seç. Bu şablonda Todo, In Progress ve Done sütunları hazır gelir.
3. Projeye bir ad ver (örneğin "AboneTakip") ve **Create project**'e tıkla.
4. Panonun en altındaki **+ Add item**'a tıkla, `#` yaz, çıkan listeden issue'ları tek tek seç.
5. Bütün issue'lar **Todo** sütununa düşer. Bir işe başladığında kartı **In Progress**'e sürükle.

**D. README'yi commit et**

Önce README.md içeriğini proje kökünde **yeni dosya** olarak kaydet (`AboneTakip/README.md`; dosya zaten varsa içeriğini tamamen bununla değiştir). Sonra Terminal'de proje klasöründeyken şunları sırayla çalıştır:

```zsh
git status
```
Değişen dosyaları gösterir. `.env` listede **görünmemeli**; görünürse dur ve bana yaz.

```zsh
git add README.md
```
Yalnızca README dosyasını commit'e hazırlar.

```zsh
git commit -m "docs: README iskeleti ve proje belgeleri"
```
Değişikliği açıklamasıyla birlikte kaydeder.

```zsh
git push
```
Kaydı GitHub'a gönderir.

---

## Doğrulama
- MUST: 1, 2, 3, 4, 5 → **5 adet** ✓
- SHOULD: 6, 7 → **2 adet** ✓
- Toplam **7 issue**. Kapsama yeni madde eklenmedi. COULD maddeleri (CSV, plan kırılımı) issue'ya çevrilmedi.

## Varsayımlar ve emin olmadığım yerler
1. **Takvim:** Senin gün planını görmedim. Gün 2–14 dağılımını kendim varsaydım. Elinde bir takvim varsa günleri ona göre düzeltelim.
2. **docs/ dosya adları:** `docs/proje-onerisi.md` ve `docs/ADR.md` olarak varsaydım. Gerçek dosya adları farklıysa README'deki bağlantıları düzelt.
3. **"Riskli abonelik" tanımı:** CLAUDE.md'de bu kavram tanımlanmamış. Örneğin "yenileme tarihi 7 gün içinde olan" veya "hiç yenilenmemiş" gibi bir kural gerekiyor. Issue 6'ya "netleştirilecek" diye yazdım; senin karar vermen gerekiyor.
4. **MRR grafiği:** "Son 6 ay" ve "ay sonundaki aktif abonelikler" benim varsayımım.
5. **Kayıt akışı:** Kaydolan kişinin otomatik olarak yeni firma ve onun manager'ı olacağını varsaydım. Finance kullanıcısını ise manager'ın eklediğini düşündüm.
6. **GitHub ekranı:** Düğme adları GitHub arayüzü değiştikçe biraz farklı olabilir. Bir adımda düğmeyi bulamazsan ekranda ne gördüğünü yaz.
````

### Claude cevabı 1 · 19 Eki 2026 11:54

> Bu, Gün 1 sohbetinin çıktısı, ben de incelemek için gönderdiğini varsaydım. Genel olarak iyi: 5 MUST + 2 SHOULD doğru, kabul kriterleri test edilebilir, kapsam dışına çıkılmamış. Ama sohbet `docs/` dosyalarını görmediği için planımızla çelişen yerler var. Önce bunları düzeltip kopyalamaya hazır bir sürüm hazırlıyorum.
> Gün 1 çıktısını planımıza göre düzeltip iki dosya hazırladım: `05_Gun1_Issues.md` (7 issue) ve `README.md`.
>
> **Düzelttiğim yerler**
> - **Gün aralıkları:** Sohbet planımızı görmediği için kendi takvimini varsaymıştı. Asıl plan: kayıt ve giriş Gün 3, müşteri ve plan Gün 4, abonelik Gün 5, dashboard Gün 8-9, SSE Gün 10, grafik Gün 11.
> - **README bağlantıları:** `docs/proje-onerisi.md` ve `docs/ADR.md` yanlıştı. Gerçek adlar `docs/01_Proje_Onerisi.md` ve `docs/02_ADR.md`. Diğer üç belge de eklendi.
> - **Riskli abonelik kuralı:** Sohbet "netleştirilecek" diye bırakmıştı. Planımızdaki kural eklendi: bitişine 7 günden az kalan, yenilenmemiş ACTIVE abonelikler dashboard'da listelenir. SSE yalnızca iptal olayını iletir.
> - **MRR grafiği:** 6 ay yerine planımızdaki 12 ay yapıldı.
> - **Issue 3:** Pasife alma yetkisi yalnızca manager'a ait. Bu kural eksikti, eklendi.
> - **Issue 4:** "Müşteri detay sayfası" kriteri kapsam dışı olduğu için çıkarıldı. Yerine abonelik listesi, tek işlemde (transaction) kayıt ve başka firmanın kimliğiyle abonelik açılamaması kuralı geldi.
> - **Issue 5:** Dört KPI kartı ve kısa özet olarak düzeltildi. Dersteki 50 müşteri örneği test kriteri oldu.
>
> **Şimdi yapman gerekenler**
> 1. `README.md` dosyasını indirip proje klasöründeki eski `README.md` üzerine kopyala (`~/Projeler/abonetakip/`).
> 2. GitHub'da `must` ve `should` etiketlerini oluştur, 7 issue'yu `05_Gun1_Issues.md` içinden yapıştırarak aç. Adımlar dosyanın sonunda.
> 3. Proje panosunu (Projects > Board) aç ve issue'ları ekle.
> 4. GitHub Desktop'ta Summary `docs: README iskeleti` yazıp **Commit to main**, ardından **Push origin** de. Sohbetteki Terminal komutlarını kullanmana gerek yok. `.env` değişiklik listesinde görünmemeli.
> 5. Bu çıktıyı `docs/03_Prompt_Gunlugu.md` en altındaki günlük tablosuna kısa bir notla ekle. Gün 1 bitti.
>
> Sonra yeni bir sohbet aç. Ortak Başlık'ın kısa hâlini ve `docs/04_14_Gunluk_Prompt_Plani.md` içindeki **Gün 2** promptunu yapıştır. Gün 2'de Prisma şeması, Neon bağlantısı ve Render'daki ilk deploy var, adımların sonunda Render hesabına dönmen gerekecek. Bir issue açarken veya pano kurarken ekranda takılırsan görüntüsünü gönder.

### Prompt 2 · 19 Eki 2026 11:56

````text
Şimdi yapman gerekenler

1. `README.md` dosyasını indirip proje klasöründeki eski `README.md` üzerine kopyala (`~/Projeler/abonetakip/`).
2. GitHub’da `must` ve `should` etiketlerini oluştur, 7 issue’yu `05_Gun1_Issues.md` içinden yapıştırarak aç. Adımlar dosyanın sonunda.
3. Proje panosunu (Projects > Board) aç ve issue’ları ekle.
4. GitHub Desktop’ta Summary `docs: README iskeleti` yazıp Commit to main, ardından Push origin de. Sohbetteki Terminal komutlarını kullanmana gerek yok. `.env` değişiklik listesinde görünmemeli.
5. Bu çıktıyı `docs/03_Prompt_Gunlugu.md` en altındaki günlük tablosuna kısa bir notla ekle. Gün 1 bitti.   nasıl yapacağımı bilmiyoruM adım adım ne yapmam gerektiğini anlat
````

### Claude cevabı 2 · 19 Eki 2026 11:57

> Her adımı ekrandaki düğme adlarıyla yazdım. Sırayla git, her adımın sonundaki **Kontrol** satırı tamamsa sonrakine geç.
>
> ## Adım 1: README dosyasını projeye koy
>
> 1. Bu sohbetteki `README.md` kartından dosyayı indir. Mac'te `Downloads` klasörüne iner.
> 2. VS Code'daki terminali aç (**Terminal > New Terminal**) ve `abonetakip %` yazdığını kontrol et.
> 3. Dosyanın indiğini doğrula:
>
> ```
> ls ~/Downloads | grep -i readme
> ```
>
>    Çıktıda `README.md` görmelisin. `README (1).md` gibi bir ad görürsen bana yaz.
> 4. Eski README'nin üzerine kopyala:
>
> ```
> cp ~/Downloads/README.md ~/Projeler/abonetakip/README.md
> ```
>
> **Kontrol:** VS Code'da sol listeden `README.md` dosyasını aç. En üstte `# AboneTakip` ve "Proje özeti" yazmalı. Hâlâ "Create Next App" yazıyorsa kopyalama olmamıştır, 4. adımı tekrarla.
>
> ## Adım 2: GitHub'da etiketleri oluştur
>
> 1. Tarayıcıda github.com'daki `abonetakip` deposunu aç.
> 2. Üstteki **Issues** sekmesine tıkla.
> 3. Sağ üstte **Labels** düğmesine tıkla.
> 4. Yeşil **New label** düğmesine tıkla.
> 5. **Label name** kutusuna `must` yaz, istediğin bir renk seç, **Create label**'a tıkla.
> 6. Aynısını `should` için tekrarla.
>
> **Kontrol:** Etiket listesinde `must` ve `should` görünüyor.
>
> ## Adım 3: 7 issue'yu aç
>
> **Hazırlık:** `05_Gun1_Issues.md` dosyasını indir ve VS Code'da aç (**File > Open File...** ile `Downloads` içinden seç). Dosya açılınca içinde `**Başlık:**` satırları ve ` ```markdown ` ile başlayan kod blokları görürsün.
>
> **Her issue için aynı 6 adımı yap:**
>
> 1. GitHub'da **Issues** sekmesinde yeşil **New issue** düğmesine tıkla.
> 2. Dosyada o issue'nun `**Başlık:**` satırındaki tırnak içindeki metni kopyala (örneğin `Kayıt, giriş ve roller`) ve **Title** kutusuna yapıştır.
> 3. Dosyada ` ```markdown ` satırından sonraki ilk satırdan başlayıp kapanış ` ``` ` satırından önceki son satıra kadar her şeyi seç ve kopyala. Seçmek için ilk satıra tıkla, son satıra gelince `Shift` basılıyken tıkla. Bu iki ` ``` ` satırının kendisini alma.
> 4. GitHub'da büyük açıklama kutusuna yapıştır (`Cmd + V`).
> 5. Sağdaki **Labels** bölümüne tıkla, tabloya göre `must` veya `should` seç, boş yere tıklayıp menüyü kapat.
> 6. Sağ alttaki yeşil **Create** düğmesine tıkla. Butonun adı bazen **Submit new issue** olabilir.
>
> **Hangi issue hangi etiket:**
>
> | Sıra | Title | Etiket |
> |---|---|---|
> | 1 | Kayıt, giriş ve roller | must |
> | 2 | Kiracı (tenant) izolasyonu | must |
> | 3 | Müşteri ve plan yönetimi | must |
> | 4 | Abonelik yaşam döngüsü | must |
> | 5 | KPI dashboard | must |
> | 6 | SSE ile iptal uyarısı ve riskli abonelik listesi | should |
> | 7 | Aylık MRR grafiği | should |
>
> **Kontrol:** Issues sekmesinde 7 açık issue görünüyor (5 `must`, 2 `should`).
>
> ## Adım 4: Proje panosunu aç
>
> 1. Deponun sayfasında üstteki **Projects** sekmesine tıkla. Sekme görünmüyorsa **...** menüsüne bak, orada olabilir.
> 2. **New project** (veya **Link a project > New project**) düğmesine tıkla.
> 3. Şablon seçiminde **Board**'u seç.
> 4. Proje adına `AboneTakip` yaz, **Create project**'e tıkla.
> 5. Açılan panoda **Todo** sütununun altındaki **+ Add item** düğmesine tıkla.
> 6. Kutuya `#` yaz. Depodaki issue'lar listelenir. Birini seç. Aynısını 7 issue için tekrarla.
>
> Bu adım zor gelirse alternatif: her issue sayfasını aç, sağdaki **Projects** bölümüne tıkla, `AboneTakip` panosunu seç.
>
> **Kontrol:** Panoda **Todo** sütununda 7 kart görünüyor.
>
> ## Adım 5: README'yi GitHub'a gönder
>
> 1. GitHub Desktop'ı aç. Sol tarafta değişen dosyalar listelenir, içinde `README.md` olmalı.
> 2. **Kontrol:** Listede `.env` olmamalı. Varsa dur ve bana yaz.
> 3. Sol altta **Summary** kutusuna şunu yaz: `docs: README iskeleti`
> 4. Mavi **Commit to main** düğmesine tıkla.
> 5. Üstte çıkan **Push origin** düğmesine tıkla.
>
> **Kontrol:** github.com'da deponun ana sayfasını yenile. Altta README görünüyor ve "AboneTakip" başlığıyla "Proje özeti" yazıyor.
>
> ## Adım 6: Prompt Günlüğü'ne Gün 1 notunu ekle
>
> 1. VS Code'da sol listeden `docs/03_Prompt_Gunlugu.md` dosyasını aç.
> 2. En alta in. "Proje boyunca ek kayıtlar" başlığının altındaki tabloda `| 1 | | | |` satırını bul.
> 3. O satırı silip yerine şunu yapıştır (tek satır):
>
> ```
> | 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
> ```
>
> 4. Kaydet (`Cmd + S`).
> 5. GitHub Desktop'a dön. Summary kutusuna `docs: Gün 1 prompt günlüğü notu` yaz, **Commit to main** ve ardından **Push origin** de.
>
> **Kontrol:** GitHub Desktop'ta değişiklik listesi boşaldı ve "No local changes" yazıyor.
>
> ## Bitince Gün 1 tamam
>
> - Depoda 7 issue ve dolu bir pano var
> - README ve günlük notu GitHub'da
> - `.env` hiçbir yerde görünmüyor
>
> Hangi adımda takılırsan hangi adım olduğunu ve ekran görüntüsünü gönder. Gün 1 bittiğinde yeni bir sohbette **Gün 2** promptuna geçeriz.

### Prompt 3 · 19 Eki 2026 11:59

````text
kullanici@bilgisayar abonetakip % ls ~/Downloads | grep -i readme
ls: /Users/kullanici/Downloads: Operation not permitted BÖYLE BİR ÇIKTI ALDIM
````

### Claude cevabı 3 · 19 Eki 2026 11:59

> Bu bir hata değil, macOS'un güvenlik izni. VS Code'un terminali `Downloads` klasörüne bakamıyor, daha önce kullandığın normal Terminal uygulamasının izni vardı. En kolay çözüm Finder ile elle kopyalamak, izin ayarına gerek yok.
>
> ## Çözüm: Finder ile kopyala
>
> 1. **Finder**'ı aç (Dock'taki mavi yüz simgesi).
> 2. Sol kenardaki **İndirilenler** (Downloads) klasörüne tıkla.
> 3. `README.md` dosyasını bul ve üzerine tek tıkla, sonra `Cmd + C` bas.
> 4. Projenin klasörüne git. Bunun en kolay yolu: `Cmd + Shift + H` ile ana klasöre gir, `Projeler` klasörünü aç, içindeki `abonetakip` klasörüne gir. Klasörün içinde `src`, `docs`, `package.json` gibi dosyalar görmelisin.
> 5. Boş bir yere tıkla ve `Cmd + V` bas.
> 6. "Bu konumda aynı adlı bir öğe zaten var" gibi bir soru çıkar. **Değiştir** (Replace) düğmesine tıkla.
>
> **Kontrol:** VS Code'da sol listeden `README.md` dosyasına tıkla. En üstte `# AboneTakip` ve "Proje özeti" yazmalı.
>
> ## Aynı sorunu `05_Gun1_Issues.md` için de çöz
>
> Bu dosyayı da VS Code'da açacağın için aynı izin sorunu çıkabilir. Finder ile `İndirilenler` klasöründen `05_Gun1_Issues.md` dosyasını kopyalayıp projedeki `docs` klasörünün içine yapıştır. Sonra VS Code'da `docs/05_Gun1_Issues.md` olarak açarsın. Bu dosya Adım 5'teki commit'te GitHub'a da gider, sorun değil, içinde gizli bilgi yok.
>
> ## İstersen kalıcı izin ver (isteğe bağlı)
>
> Bir daha bu hatayı görmemek için:
>
> 1. Sol üst Apple menüsü > **Sistem Ayarları**.
> 2. **Gizlilik ve Güvenlik** > **Dosyalar ve Klasörler**.
> 3. **Visual Studio Code** satırını bul, altındaki **İndirilenler Klasörü** (Downloads Folder) anahtarını aç.
> 4. VS Code'u `Cmd + Q` ile kapatıp yeniden aç.
>
> Bu izin şart değil, Finder yöntemi yeterli.
>
> Bitince **Adım 2** (GitHub'da etiketler) ile devam et. Takılırsan ne gördüğünü veya ekran görüntüsünü gönder.

### Prompt 4 · 19 Eki 2026 12:03

````text
```markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
TERMİNALDEN BU ÇIKTIYI ALDIM 
```
````

### Claude cevabı 4 · 19 Eki 2026 12:03

> Çıktı, Next.js'in kendi varsayılan README'si. Yani kopyalama henüz yapılmamış ya da "Değiştir" adımı çalışmamış, projedeki README hâlâ eski. Finder'ı atlayıp içeriği doğrudan VS Code'a yapıştıralım, bu en sağlam yol.
>
> **1. README'yi VS Code'da aç**
>
> VS Code'da sol dosya listesinde `README.md` dosyasına tıkla. İçinde "This is a Next.js project bootstrapped with..." yazıyor olmalı.
>
> **2. İçeriği değiştir**
>
> 1. Dosyanın içine tıkla ve `Cmd + A` ile hepsini seç.
> 2. `Delete` ile sil. Dosya boş kalmalı.
> 3. Aşağıdaki kod bloğunun sağ üstündeki **Kopyala** düğmesine bas (ya da içeriği elle seçip `Cmd + C` yap) ve dosyaya `Cmd + V` ile yapıştır.
>
> ```markdown
> # AboneTakip
>
> ## Proje özeti
> AboneTakip, küçük yazılım firmaları için çok kiracılı (multi-tenant) bir abonelik takip SaaS'ıdır. Firmalar müşterilerini, planlarını ve aboneliklerini yönetir; MRR, churn, LTV ve LTV/CAC metriklerini tek bir dashboardda izler. Her firma yalnızca kendi verisini görür.
>
> Sunucu Tabanlı Programlama dersi dönem projesidir (tek geliştirici, 2 hafta).
>
> ## Teknoloji
> - Next.js (App Router) ve TypeScript
> - PostgreSQL (Neon) ve Prisma
> - Barındırma: Render (PaaS), sürekli açık Node sunucusu
> - Gerçek zamanlı uyarılar: Server-Sent Events (SSE)
>
> ## Kurulum
> _Bu bölüm Gün 13'te doldurulacak._
>
> ## Canlı adres
> _Henüz yayında değil._
>
> ## Rol ve yetkiler
>
> | Yetki | manager | finance |
> |---|---|---|
> | Dashboard görüntüleme | ✅ | ✅ |
> | Müşteri, plan ve abonelik kayıtları (ekleme, düzenleme) | ✅ | ✅ |
> | Müşteri ve plan pasife alma | ✅ | ❌ |
> | Ayarlar (CAC dahil) | ✅ | ❌ |
> | Kullanıcı yönetimi | ✅ | ❌ |
>
> Rol kontrolü sunucu tarafında yapılır. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez.
>
> ## Kapsam (MoSCoW)
> - **MUST:** kayıt, giriş ve roller; müşteri ve plan yönetimi; abonelik yaşam döngüsü; KPI dashboard; kiracı izolasyonu
> - **SHOULD:** SSE ile iptal uyarısı, aylık MRR grafiği
> - **WON'T:** ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi, mikroservis
>
> ## Dokümanlar
> - [Proje önerisi](docs/01_Proje_Onerisi.md)
> - [Mimari Karar Kaydı (ADR)](docs/02_ADR.md)
> - [Prompt Günlüğü](docs/03_Prompt_Gunlugu.md)
> - [14 günlük prompt planı](docs/04_14_Gunluk_Prompt_Plani.md)
> - [Kurulum rehberi](docs/00_Kurulum_Rehberi.md)
> - [AI talimat dosyası](CLAUDE.md)
> ```
>
> 4. Kaydet (`Cmd + S`).
>
> **3. Kontrol**
>
> VS Code'daki terminalde (`abonetakip %` yazarken) şunu çalıştır:
>
> ```
> head -3 README.md
> ```
>
> Çıktı şöyle olmalı:
>
> ```
> # AboneTakip
>
> ## Proje özeti
> ```
>
> Hâlâ "This is a Next.js project" görüyorsan dosya kaydedilmemiş demektir. Dosyada `Cmd + S` yap ve komutu tekrar çalıştır.
>
> **4. Sonra devam et**
>
> GitHub Desktop'ı aç. Solda `README.md` değişen dosya olarak görünecek. Sırayla:
>
> 1. Listede `.env` olmadığını kontrol et.
> 2. Summary kutusuna `docs: README iskeleti` yaz.
> 3. **Commit to main** düğmesine bas.
> 4. **Push origin** düğmesine bas.
>
> Bunu etiket ve issue adımlarından önce yapmak daha rahat, çünkü README gönderildiğinde depoyu yenileyip sonucu hemen görebilirsin. Ardından **Adım 2** (GitHub'da `must` ve `should` etiketleri) ile devam et. Bir adımda takılırsan ekran görüntüsünü gönder.

### Prompt 5 · 19 Eki 2026 12:08

````text
BÖYLE OLDU VE VS DE DE README DOSYASININ ÜSTÜ SARI YAZILI VE YANINDA M HARFİ VAR
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 5 · 19 Eki 2026 12:09

> Bu, beklediğimiz görüntü. VS Code'da dosyanın yanındaki sarı **M**, "Modified" (değiştirildi) demek: README'yi değiştirdin ve henüz GitHub'a göndermedin. Commit edip gönderince kendiliğinden kaybolur. GitHub Desktop'taki diff de doğru: kırmızı satırlar Next.js'in eski metni, yeşil satırlar bizim yeni README (Kapsam ve Dokümanlar bölümleri görünüyor).
>
> **Şimdi yapılacaklar (GitHub Desktop'ta)**
>
> 1. Sol listede `README.md` satırının solundaki **kutucuğu** kontrol et. Boş görünüyorsa tıklayıp işaretle, içinde bir tik çıkmalı. İşaretsiz dosya commit'e girmez. Üstteki "1 changed file" kutucuğu da böylece dolar.
> 2. **Kontrol:** Listede başka dosya yok, özellikle `.env` yok. Şu an yalnızca `README.md` var, doğru.
> 3. Sol alttaki **Summary** kutusuna şunu yaz: `docs: README iskeleti`
> 4. Mavi **Commit to main** düğmesine tıkla. Summary boşken düğme soluk görünür, yazınca koyulaşır.
> 5. Üstte çıkan **Push origin** düğmesine tıkla.
>
> **Doğrula**
>
> github.com'daki `abonetakip` deposunu yenile. Sayfanın altında `# AboneTakip` ve "Proje özeti" görünmeli. VS Code'daki sarı **M** de kaybolur.
>
> Bitince **Adım 2**'ye (GitHub'da `must` ve `should` etiketleri) geç. Takılırsan ekran görüntüsünü gönder.

### Prompt 6 · 19 Eki 2026 12:12

````text
BÖYLE GÖZKÜYOR GİTHUB
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 6 · 19 Eki 2026 12:12

> Bu görüntü doğru. README güncellendi, commit sayısı 2 ve deponun altında "AboneTakip / Proje özeti" görünüyor. Dosya listesinde `.env` de yok, yani gizli bilgi sızmadı. Adım 1 ve 5 tamam.
>
> Sıradaki iş GitHub'da etiketler ve 7 issue.
>
> **Hazırlık: issue dosyasını projeye al**
>
> Daha önce söylediğim gibi `05_Gun1_Issues.md` dosyası `Downloads`'ta duruyor ve VS Code'un terminali oraya bakamıyor. Finder'dan kopyala:
>
> 1. Finder'da **İndirilenler**'e git, `05_Gun1_Issues.md` dosyasına tıkla ve `Cmd + C` yap.
> 2. `Cmd + Shift + H` ile ana klasöre gir, `Projeler > abonetakip > docs` klasörünü aç ve `Cmd + V` yap.
> 3. VS Code'da sol listeden `docs/05_Gun1_Issues.md` dosyasına tıkla, açılsın.
>
> **Etiketleri oluştur (tarayıcıda, açık olan depo sayfasında)**
>
> 1. Üstteki **Issues** sekmesine tıkla. Görünmüyorsa üstteki menüde **...** altına bak.
> 2. Sağ üstte **Labels** düğmesine, sonra yeşil **New label** düğmesine tıkla.
> 3. **Label name** kutusuna `must` yaz, bir renk seç, **Create label**'a tıkla.
> 4. Aynısını `should` için tekrarla.
>
> **Kontrol:** Etiket listesinde `must` ve `should` görünüyor.
>
> Sonra 7 issue'yu açmaya geç. Her issue için adımlar bir önceki mesajda (Adım 3) yazılı:
>
> 1. **Issues** sekmesinde **New issue**'ya tıkla.
> 2. Dosyadaki `**Başlık:**` satırında backtick işaretlerinin içindeki metni (örneğin `Kayıt, giriş ve roller`) **Title** kutusuna yapıştır.
> 3. ` ```markdown ` satırından sonraki ilk satırdan, kapanış ` ``` ` satırından önceki son satıra kadar olan kısmı seç, kopyala ve açıklama kutusuna yapıştır. ` ``` ` satırlarını kopyalama.
> 4. Sağdan **Labels**'tan `must` veya `should` seç.
> 5. Yeşil **Create** düğmesine tıkla.
>
> İlk issue'yu açtığında ekran görüntüsünü gönder. Açıklama kutusunda başlıklar ve kutucuklar düzgün görünüyorsa kalan altı issue'yu aynı şekilde açarsın, böylece ilkinde hata yaparsak 7 kez tekrarlamamış oluruz.

### Prompt 7 · 19 Eki 2026 12:14

````text
`05_Gun1_Issues.md BÖYLE BİR DOSYA YOK `
````

### Claude cevabı 7 · 19 Eki 2026 12:14

> Dosya `İndirilenler`'e inmemiş olabilir. Dosyayı yeniden gönderiyorum.
> `05_Gun1_Issues.md` dosyasını bu mesajla yeniden gönderdim. Kartın üzerindeki indirme simgesine veya **İndir** düğmesine bas.
>
> **İndirdiğini kontrol et**
>
> 1. Finder'da **İndirilenler** klasörünü aç.
> 2. En üstte `05_Gun1_Issues.md` görmelisin. Sağ üstteki arama kutusuna `Gun1` yazarak da bulabilirsin.
> 3. Dosya adının sonuna `(1)` eklenmiş olabilir (örneğin `05_Gun1_Issues (1).md`). Bu da olur, adı sonra düzeltiriz.
>
> **Projeye kopyala**
>
> 1. Dosyaya tek tıkla ve `Cmd + C` yap.
> 2. `Cmd + Shift + H` ile ana klasöre gir, `Projeler > abonetakip > docs` klasörünü aç ve `Cmd + V` yap.
> 3. VS Code'da sol listede `docs` klasörünü genişlet, `05_Gun1_Issues.md` dosyasını görüp tıkla.
>
> **Hâlâ indiremiyorsan:** Kart açılıyorsa içeriğin tamamını seçip kopyalayabilirsin. Bu durumda VS Code'da `docs` klasörüne sağ tıkla, **New File** de, adını `05_Gun1_Issues.md` yap, içeriği yapıştır ve `Cmd + S` ile kaydet.
>
> Dosya VS Code'da açılınca **Etiketler** adımına geç (Issues > Labels > New label ile `must` ve `should`). Takılırsan ekran görüntüsünü gönder.

### Prompt 8 · 19 Eki 2026 12:16

````text
VS CODE DA AÇILDI ŞİMDİ NE YAPIYORYZ
````

### Claude cevabı 8 · 19 Eki 2026 12:16

> Şimdi iki iş var: önce GitHub'da etiketleri oluşturacağız, sonra ilk issue'yu açacağız.
>
> ## 1. Etiketleri oluştur
>
> 1. Tarayıcıda `github.com/ozgesoganci1-bot/abonetakip` sayfasını aç.
> 2. Üstteki **Issues** sekmesine tıkla.
> 3. Sağ üstte **Labels** düğmesine, sonra yeşil **New label** düğmesine tıkla.
> 4. **Label name** kutusuna `must` yaz, istediğin bir rengi seç, **Create label**'a tıkla.
> 5. Aynısını `should` için tekrarla.
>
> **Kontrol:** Etiket listesinde `must` ve `should` görünüyor.
>
> ## 2. İlk issue'yu aç (Issue 1)
>
> VS Code'da `05_Gun1_Issues.md` dosyasında `## Issue 1` başlığını bul.
>
> 1. GitHub'da **Issues** sekmesinde yeşil **New issue** düğmesine tıkla.
> 2. VS Code'da `**Başlık:**` satırındaki backtick işaretlerinin içindeki metni seç ve kopyala: `Kayıt, giriş ve roller`. GitHub'daki **Title** kutusuna yapıştır.
> 3. VS Code'da ` ```markdown ` satırından sonraki ilk satıra (`## Açıklama`) tıkla. Fareyi kapanış ` ``` ` satırından önceki son satıra (`**Plandaki gün:** Gün 3`) kadar sürükle ya da son satıra `Shift` basılıyken tıkla. Seçtikten sonra `Cmd + C` yap. İki ` ``` ` satırını seçme.
> 4. GitHub'da büyük açıklama kutusuna yapıştır (`Cmd + V`).
> 5. Sağdaki **Labels** bölümüne tıkla, `must` seç, boş bir yere tıklayıp menüyü kapat.
> 6. Yeşil **Create** düğmesine tıkla.
>
> **Kontrol:** Issue sayfası açılır. Açıklamada başlıklar ve kabul kriterleri kutucuk (☐) olarak görünmeli.
>
> ## 3. Ekran görüntüsü gönder
>
> İlk issue'nun açıldıktan sonraki sayfasının ekran görüntüsünü gönder. Düzgün görünüyorsa kalan 6 issue'yu aynı adımlarla açarsın. İlkinde bir hata varsa 7 kez tekrarlamadan düzeltiriz.
>
> Kalan 6 issue'nun başlıkları ve etiketleri:
>
> | Sıra | Title | Etiket |
> |---|---|---|
> | 2 | Kiracı (tenant) izolasyonu | must |
> | 3 | Müşteri ve plan yönetimi | must |
> | 4 | Abonelik yaşam döngüsü | must |
> | 5 | KPI dashboard | must |
> | 6 | SSE ile iptal uyarısı ve riskli abonelik listesi | should |
> | 7 | Aylık MRR grafiği | should |

### Prompt 9 · 19 Eki 2026 12:26

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 9 · 19 Eki 2026 12:26

> İlk issue düzgün açılmış. Başlıklar, kabul kriterleri kutucuk (☐) olarak ve sağda `must` etiketi görünüyor. Aşağıdaki "Etiket" ve "Plandaki gün" satırları açıklamanın içinde kalıyor, zararı yok, diğer issue'larda da aynı kalsın.
>
> **Kalan 6 issue'yu aç**
>
> Her biri için aynı adımlar:
>
> 1. **Issues** sekmesinde **New issue**'ya tıkla.
> 2. VS Code'da `05_Gun1_Issues.md` dosyasında ilgili issue'nun `**Başlık:**` satırındaki backtick içindeki metni **Title**'a yapıştır.
> 3. ` ```markdown ` satırından sonraki ilk satırdan, kapanış ` ``` ` satırından önceki son satıra kadar olan kısmı seç, kopyala, açıklama kutusuna yapıştır. ` ``` ` satırlarını alma.
> 4. Sağdan **Labels** ile etiketi seç.
> 5. **Create** düğmesine bas.
>
> | Sıra | Dosyada bulacağın başlık | Title'a yazılacak metin | Etiket |
> |---|---|---|---|
> | 2 | `## Issue 2` | Kiracı (tenant) izolasyonu | must |
> | 3 | `## Issue 3` | Müşteri ve plan yönetimi | must |
> | 4 | `## Issue 4` | Abonelik yaşam döngüsü | must |
> | 5 | `## Issue 5` | KPI dashboard | must |
> | 6 | `## Issue 6` | SSE ile iptal uyarısı ve riskli abonelik listesi | should |
> | 7 | `## Issue 7` | Aylık MRR grafiği | should |
>
> Dikkat edilecek yerler:
>
> - **Her issue'da yalnızca kendi bloğunu kopyala.** Issue 2'nin bloğu başlık satırından sonra başlar, Issue 3'ün başlığından önce biter.
> - **Issue 6 ve 7'de etiket `should`.** Diğer beşinde `must`.
> - Bir issue'yu yanlış açarsan sorun değil. Sağ üstteki **Edit** ile düzeltebilir veya kapatıp yenisini açabilirsin.
>
> **Kontrol:** **Issues** sekmesinde 7 açık issue görünüyor. Sağdaki etiket filtresinde 5 `must` ve 2 `should` olmalı.
>
> Bitince bana ekran görüntüsüyle **Issues listesini** gönder, ardından proje panosunu (Projects > Board) kurup issue'ları panoya ekleriz.

### Prompt 10 · 19 Eki 2026 12:33

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 10 · 19 Eki 2026 12:33

> 7 issue açılmış ve etiketler doğru: 5 `must` ve 2 `should`. Başlıklar planla da uyumlu. Sırada proje panosu var.
>
> ## Proje panosunu kur
>
> 1. Sayfanın üstündeki menüde **Projects** sekmesine tıkla (Issues, Pull requests, Actions, **Projects**, Wiki...). Sol menüdeki **Projects** de aynı yere gider.
> 2. **New project** (veya **Link a project > New project**) düğmesine tıkla.
> 3. Şablon seçiminde **Board**'u seç.
> 4. Proje adına `AboneTakip` yaz ve **Create project**'e tıkla.
>
> **Kontrol:** Boş bir pano açıldı, sütunlarda **Todo**, **In Progress**, **Done** yazıyor.
>
> ## Issue'ları panoya ekle
>
> **Kolay yol (7'sini birden):**
>
> 1. Tekrar **Issues** sekmesine dön.
> 2. Listenin sol üstündeki **boş kutucuğa** tıkla. 7 issue'nun hepsi seçilir.
> 3. Üstte çıkan **Projects** menüsüne tıkla, `AboneTakip` seç.
>
> **Bu menü çıkmazsa (alternatif):**
>
> 1. Panoya dön, **Todo** sütununun altındaki **+ Add item** düğmesine tıkla.
> 2. `#` yaz, çıkan listeden issue'ları tek tek seç.
>
> **Kontrol:** Panoda **Todo** sütununda 7 kart görünüyor. İstersen `Kayıt, giriş ve roller` kartını **In Progress** sütununa sürükleyebilirsin, çünkü Gün 3'te onunla başlayacaksın. Şimdilik hepsi **Todo**'da kalabilir.
>
> ## Sonra: Gün 1'i kapat
>
> Panoyu kurunca iki iş kaldı:
>
> 1. **Prompt Günlüğü notu.** VS Code'da `docs/03_Prompt_Gunlugu.md` dosyasını aç, en alttaki tabloda `| 1 | | | |` satırını şu satırla değiştir:
>
> ```
> | 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
> ```
>
>    Kaydet (`Cmd + S`).
>
> 2. **Commit ve push.** GitHub Desktop'ta değişen dosyalar `docs/03_Prompt_Gunlugu.md` ve `docs/05_Gun1_Issues.md` olacak. `.env` olmadığını kontrol et, hepsi işaretliyken Summary kutusuna `docs: Gün 1 issue metinleri ve prompt günlüğü notu` yaz, **Commit to main** ve ardından **Push origin** de.
>
> Panoyu kurunca ekran görüntüsünü gönder. Hepsi tamamsa Gün 1 biter ve yeni bir sohbette **Gün 2**'ye (Prisma şeması ve Neon bağlantısı) geçeriz.

### Prompt 11 · 19 Eki 2026 12:36

````text
BÖYLE OLDU
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 11 · 19 Eki 2026 12:36

> Pano hazır. **Todo** sütununda 7 issue kartı görünüyor. Sağdaki "New timestamp fields available" kutusunu **Dismiss** ile kapatabilirsin, önemli bir şey değil.
>
> **Bir not:** Panonun yanındaki kilit simgesi panonun **özel** (private) olduğunu gösteriyor. Depo herkese açık ama pano yalnızca sen görüyorsun. Hocanın panoyu görmesini istiyorsan sağ üstteki **...** menüsünden **Settings** > **Visibility** bölümünde **Public** yapabilirsin. Hoca istemezse özel kalması sorun değil, issue'lar zaten depoda herkese açık.
>
> ## Gün 1'i kapat (2 iş kaldı)
>
> **1. Prompt Günlüğü notu**
>
> 1. VS Code'da `docs/03_Prompt_Gunlugu.md` dosyasını aç.
> 2. En alta in. "Proje boyunca ek kayıtlar" başlığının altındaki tabloda `| 1 | | | |` satırını bul ve şu satırla değiştir:
>
> ```
> | 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
> ```
>
> 3. Kaydet (`Cmd + S`).
>
> **2. Commit ve push**
>
> 1. GitHub Desktop'ı aç. Değişen dosyalar `docs/03_Prompt_Gunlugu.md` ve `docs/05_Gun1_Issues.md` olmalı.
> 2. Kontrol: `.env` yok ve hepsinin kutucuğu işaretli.
> 3. Summary kutusuna `docs: Gün 1 issue metinleri ve prompt günlüğü notu` yaz.
> 4. **Commit to main**, ardından **Push origin**.
>
> **Kontrol:** GitHub Desktop'ta "No local changes" yazıyor ve github.com'da `docs` klasörünün içinde `05_Gun1_Issues.md` görünüyor.
>
> ## Sırada: Gün 2
>
> Gün 1 bitti. Gün 2'de Prisma şemasını kurup Neon veritabanına bağlanacağız ve uygulamayı Render'da ilk kez yayına alacağız. Yeni bir sohbet aç, `docs/04_14_Gunluk_Prompt_Plani.md` dosyasından **Ortak Başlık'ın kısa hâlini** (sonuna `Gün 2 - Prisma şeması ve ilk deploy` yaz) ve **Gün 2 promptunu** yapıştır. Önce plan gelir, onaylarsan kod yazılır.
>
> Gün 2'de Neon bağlantı adresini sohbete yapıştırma, `.env` içinde kalsın.

### Prompt 12 · 19 Eki 2026 12:42

````text
YENİ GÜN 1 PROMPTUNDA BUNLAR VARDI BUNLARI YAPMAM GEREKİYOR MU GÜN 1 İÇİN
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 12 · 19 Eki 2026 12:42

> Hayır, bunları yapmana gerek yok. Bu `git status`, `git add`, `git commit` ve `git push` komutları, GitHub Desktop'ta zaten yaptığımız işlemin terminaldeki karşılığı:
>
> | Terminal komutu | GitHub Desktop'ta yaptığın |
> |---|---|
> | `git status` | Sol listede değişen dosyaları görmek |
> | `git add README.md` | Dosyanın kutucuğunu işaretlemek |
> | `git commit -m "..."` | **Commit to main** düğmesi |
> | `git push` | **Push origin** düğmesi |
>
> README'yi zaten bu yolla gönderdin. GitHub'da "docs: README iskeleti" commit'i ve güncel README görünüyordu. Aynı komutları terminalde tekrar çalıştırırsan yalnızca "nothing to commit" yazar, zararı yok ama gereği de yok. Terminal komutlarını sohbetten gelen metindeki gibi kopyalayıp çalıştırma, tek yöntem olarak GitHub Desktop'ta kal.
>
> **Gün 1'in durumu**
>
> - [x] 7 issue açıldı ve etiketlendi
> - [x] Proje panosu kuruldu, 7 kart **Todo**'da
> - [x] README güncellendi ve GitHub'a gönderildi
> - [ ] Prompt Günlüğü'ne Gün 1 notu ve `docs/05_Gun1_Issues.md` dosyasının commit edilmesi (yaptıysan işaretle)
>
> **Son maddeyi kontrol et**
>
> GitHub Desktop'ı aç:
> - **"No local changes"** yazıyorsa son madde de tamam, Gün 1 bitti.
> - Solda `docs/03_Prompt_Gunlugu.md` ve `docs/05_Gun1_Issues.md` görünüyorsa, günlük notunu eklediğinden emin ol, Summary kutusuna `docs: Gün 1 issue metinleri ve prompt günlüğü notu` yaz, **Commit to main** ve ardından **Push origin** de.
>
> Hepsi tamamsa yeni bir sohbette Gün 2'ye geçebilirsin. Yeni sohbette `Gün 1 - tamamlandı` demene gerek yok, `CLAUDE.md` kuralları proje talimatlarında zaten var.

### Prompt 13 · 19 Eki 2026 12:43

````text
Prompt Günlüğü’ne Gün 1 notu ve `docs/05_Gun1_Issues.md` dosyasının commit edilmesi (yaptıysan işaretle) BUNU NASIL YAPICAM
````

### Claude cevabı 13 · 19 Eki 2026 12:43

> İki parça: önce günlüğe not yazacaksın, sonra GitHub Desktop'ta commit edeceksin.
>
> ## Bölüm 1: Prompt Günlüğü'ne Gün 1 notu
>
> 1. VS Code'da sol listede `docs` klasörünü genişlet ve `03_Prompt_Gunlugu.md` dosyasına tıkla.
> 2. Dosyayı açınca `Cmd + F` bas (arama kutusu çıkar), kutuya `Proje boyunca` yaz ve Enter'a bas. Dosyanın en altındaki bölüme atlar.
> 3. Orada şöyle bir tablo görürsün:
>
> ```
> | Gün | Kullandığım prompt (özet) | Sonuç | Düzeltme gerekti mi? |
> |---|---|---|---|
> | 1 | | | |
> | 2 | | | |
> ```
>
> 4. `| 1 | | | |` satırının üzerine tıkla, satırın başına ve sonuna gidip tüm satırı seç (satırın başına tıkla, `Shift` basılıyken satırın sonuna tıkla).
> 5. Seçili satırın yerine aşağıdaki satırı yapıştır (önce kopyala: aşağıdaki kutunun sağ üstündeki **Kopyala** düğmesine bas veya içeriği seçip `Cmd + C` yap):
>
> ```
> | 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
> ```
>
> 6. Kaydet (`Cmd + S`).
>
> **Kontrol:** Tablodaki 1 numaralı satır artık dolu, `| 2 | | | |` satırı hâlâ boş.
>
> ## Bölüm 2: Commit ve push
>
> 1. GitHub Desktop'ı aç. Sol listede iki dosya görmelisin: `docs/03_Prompt_Gunlugu.md` ve `docs/05_Gun1_Issues.md`.
> 2. **Kontrol:** `.env` listede olmamalı. İki dosyanın kutucuğu da işaretli olmalı.
> 3. Sol alttaki **Summary** kutusuna şunu yaz: `docs: Gün 1 issue metinleri ve prompt günlüğü notu`
> 4. Mavi **Commit to main** düğmesine tıkla.
> 5. Üstte çıkan **Push origin** düğmesine tıkla.
>
> **Kontrol:** GitHub Desktop'ta "No local changes" yazıyor. github.com'da `docs` klasörünü aç, içinde `05_Gun1_Issues.md` görünüyor olmalı.
>
> Listede yalnızca bir dosya varsa veya hiç değişiklik görünmüyorsa, o dosyayı daha önce göndermişsindir ya da kaydetmeyi unutmuşsundur. Ekran görüntüsü gönder, birlikte bakarız.
>
> Bunlar bitince **Gün 1 tamamdır** ve yeni bir sohbette Gün 2'ye geçebilirsin.

### Prompt 14 · 19 Eki 2026 12:45

_[3 ekran görüntüsü eklendi]_

### Claude cevabı 14 · 19 Eki 2026 12:45

> Gün 1 tamam. Üç ekran görüntüsü de bunu doğruluyor:
> - GitHub Desktop'ta "No local changes" yazıyor
> - `docs` klasöründe `03_Prompt_Gunlugu.md` ve `05_Gun1_Issues.md` "docs: Gün 1 issue metinleri ve prompt günlüğü notu" commit'iyle görünüyor
> - Depoda 7 açık issue, panoda 7 kart var
>
> **Gün 1 sonucu**
> - [x] 7 issue (5 `must`, 2 `should`)
> - [x] Proje panosu
> - [x] README
> - [x] Prompt Günlüğü notu
> - [x] Tüm belgeler GitHub'da, `.env` yok
>
> ## Gün 2'ye geçiş
>
> Gün 2'de Prisma şemasını kurup Neon veritabanına bağlanacağız, tablolarını oluşturacağız ve uygulamayı Render'da ilk kez yayına alacağız. Başlamadan iki şeyi kontrol et:
>
> 1. **`.env` dosyası duruyor mu?** VS Code'da proje kökünde `.env` dosyası ve içinde `DATABASE_URL="postgresql://..."` satırı olmalı. Adreste `-pooler` geçmemeli. Dosya yoksa ya da adres boşsa söyle, Neon adımını birlikte tekrar yaparız.
> 2. **GitHub Desktop temiz mi?** "No local changes" yazıyor, sorun yok.
>
> **Yeni bir sohbet aç** (bu projede, `+ Yeni` ile) ve şunları yapıştır:
>
> 1. `docs/04_14_Gunluk_Prompt_Plani.md` dosyasında **"Ortak Başlık (kısa hâl)"** bölümünün kod bloğunu. En sondaki `[Gün X - konu]` yerine `Gün 2 - Prisma şeması ve ilk deploy` yaz.
> 2. Aynı mesajın devamına **Gün 2** bölümündeki promptu (kod bloğunun içi).
>
> Sohbet önce **planı** verir. Okuyup "onaylıyorum" yazınca adım adım kodu ve komutları verir. Gün 2 bu projenin en teknik günlerinden biri, bu yüzden bir adımda takılırsan terminaldeki hata metninin tamamını yapıştır, ekran görüntüsü de işe yarar.
>
> Gün 2 boyunca iki kuralı unutma: `DATABASE_URL` değerini hiçbir sohbete yapıştırma, ve her commit'ten önce GitHub Desktop'ta `.env`'nin listede **olmadığını** kontrol et.

