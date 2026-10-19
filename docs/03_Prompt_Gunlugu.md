# Prompt Günlüğü • AboneTakip

> 4. hafta, Blok 6 etkinliği: bir promptu üç turda iyileştirme.
> **Kural:** "Çıktı özeti" ve "Değerlendirme" alanlarını yapay zekâyı gerçekten çalıştırdıktan sonra kendi gözlemlerinle doldur. Promptları ve çıktıları aynen sakla, sonradan düzeltme.
> **Görev:** AboneTakip için veri modeli ve merkezi tenant filtre yardımcısı (proje takviminde Gün 2 ve 3).

**Kullanılan araç ve model:** [örn. Claude, sürüm]
**Tarih:** [Tarih]

---

## Başlangıç promptu

```
Bana bir abonelik takip uygulaması yap.
```

**Gözlenecekler:** Model çok kiracılı yapıyı kendiliğinden kurdu mu? Hangi teknolojiyi varsaydı? Rol ve yetki var mı? Metrik formülleri var mı?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]

---

## Tur 1: Rol ve bağlam ekleme

**Eklenen bileşenler:** Rol, Bağlam

```
[Rol] Next.js, TypeScript ve PostgreSQL konusunda deneyimli, çok kiracılı
SaaS ürünleri geliştirmiş kıdemli bir yazılım geliştiricisi olarak davran.
Açıklamaları Türkçe yap.

[Bağlam] Küçük yazılım firmalarının müşteri aboneliklerini ve gelirini takip
etmesini sağlayan "AboneTakip" adlı bir SaaS ürünü geliştiriyorum. Ürünü
kullanan her firma bir kiracıdır ve yalnızca kendi verisini görmelidir.
Kullanıcı rolleri: manager (firma sahibi) ve finance (finans çalışanı).
Ürün; müşteri, plan ve abonelik kayıtlarını tutacak, MRR, churn, LTV ve
LTV/CAC metriklerini gösterecek. Tek geliştiriciyim ve 2 haftam var.

[Görev] Bu ürün için veri modelini tasarla.
```

**Gözlenecekler:** `tenant_id` tüm tablolarda var mı? Roller modelde yer aldı mı? Gereksiz tablo veya mikroservis önerisi geldi mi?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]

---

## Tur 2: Kısıt ve format ekleme

**Eklenen bileşenler:** Kısıtlar, Çıktı formatı (görev somutlaştırıldı)

```
[Rol] Next.js, TypeScript ve PostgreSQL konusunda deneyimli, çok kiracılı
SaaS ürünleri geliştirmiş kıdemli bir yazılım geliştiricisi olarak davran.
Açıklamaları Türkçe yap.

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Her müşteri firma bir kiracıdır. Roller: manager
ve finance. Tek geliştirici, 2 hafta süre. Tek Next.js uygulaması ve tek
PostgreSQL veritabanı kullanılacak. Kiracı ayrımı ortak tablolar ve
tenant_id ile yapılacak.

[Görev] Prisma ile veri şemasını tasarla. Tablolar: TENANTS, USERS,
CUSTOMERS, PLANS, SUBSCRIPTIONS, SUBSCRIPTION_EVENTS. Ardından aktif
kullanıcının tenant_id değerini her sorguya uygulayan merkezi bir
yardımcı fonksiyon yaz.

[Kısıtlar]
- TENANTS dışındaki her tabloda tenant_id zorunlu olsun.
- Tenant filtresi tek bir yardımcı fonksiyondan uygulansın, sorgularda
  elle tekrar yazılmasın.
- Bir firmanın kullanıcısı başka firmanın verisine hiçbir koşulda erişemesin.
- Mikroservis, ek katman veya gereksiz kütüphane ekleme.
- Para birimi tek (TL), ödeme entegrasyonu yok.
- Secret değerler koda yazılmasın, ortam değişkeninden okunsun.

[Format] Önce veri modelini ve tablo ilişkilerini kısaca açıkla, sonra
Prisma şemasını yaz, sonra yardımcı fonksiyonu yaz, en sonda tenant
izolasyonunu doğrulayacak üç test senaryosu öner.
```

**Gözlenecekler:** Çıktı istenen sırayı izledi mi? Kısıtlar ihlal edildi mi? Tenant yardımcısı gerçekten merkezi mi?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]

---

## Tur 3: Doğrulama ekleme

**Eklenen bileşen:** Doğrulama (altı bileşenin hepsi)

```
[Rol] Next.js, TypeScript ve PostgreSQL konusunda deneyimli, çok kiracılı
SaaS ürünleri geliştirmiş kıdemli bir yazılım geliştiricisi olarak davran.
Açıklamaları Türkçe yap.

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Her müşteri firma bir kiracıdır. Roller: manager
ve finance. Tek geliştirici, 2 hafta süre. Tek Next.js uygulaması ve tek
PostgreSQL veritabanı. Kiracı ayrımı ortak tablolar ve tenant_id ile.
Metrik tanımlarım: MRR = aktif aboneliklerin aylık fiyat toplamı (yıllık
planlar 12'ye bölünür); churn = dönemde iptal edenler / dönem başındaki
aktif müşteriler.

[Görev] Prisma ile veri şemasını tasarla. Tablolar: TENANTS, USERS,
CUSTOMERS, PLANS, SUBSCRIPTIONS, SUBSCRIPTION_EVENTS. Ardından aktif
kullanıcının tenant_id değerini her sorguya uygulayan merkezi bir
yardımcı fonksiyon yaz.

[Kısıtlar]
- TENANTS dışındaki her tabloda tenant_id zorunlu olsun.
- Tenant filtresi tek bir yardımcı fonksiyondan uygulansın.
- Bir firmanın kullanıcısı başka firmanın verisine hiçbir koşulda erişemesin.
- Mikroservis, ek katman veya gereksiz kütüphane ekleme.
- Para birimi tek (TL), ödeme entegrasyonu yok.
- Secret değerler koda yazılmasın, ortam değişkeninden okunsun.

[Format] Önce veri modelini ve ilişkileri açıkla, sonra Prisma şemasını,
sonra yardımcı fonksiyonu yaz, en sonda tenant izolasyonunu doğrulayacak
üç test senaryosu öner.

[Doğrulama] Kodu yazmadan önce sırayla şunları düşün: (1) Hangi tablolar
etkilenir? (2) Hangi yetki ve tenant kontrolleri gerekir? (3) Hangi hata
durumları oluşabilir? Ardından yaptığın varsayımları listele. Emin
olmadığın bir Prisma sürümü, sözdizimi veya kütüphane bilgisi varsa
açıkça belirt. Var olduğundan emin olmadığın paket önerme.
```

**Gözlenecekler:** Varsayımlar listelendi mi? Emin olunmayan noktalar (örn. Prisma sürümüne bağlı sözdizimi) belirtildi mi? Yetki ve hata durumları cevaba yansıdı mı? Önerilen paketler gerçekten var mı (npmjs.com'da kontrol et)?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]

---

## Tur sonrası doğrulama kontrol listesi (4. hafta, slayt 30)

Her tur çıktısı için işaretle:

| Soru | Başlangıç | Tur 1 | Tur 2 | Tur 3 |
|---|---|---|---|---|
| Her satırı açıklayabiliyorum | [ ] | [ ] | [ ] | [ ] |
| Modelin varsayımları doğru | [ ] | [ ] | [ ] | [ ] |
| Önerilen paketler gerçekten var | [ ] | [ ] | [ ] | [ ] |
| Yetki ve tenant kontrolleri yerinde | [ ] | [ ] | [ ] | [ ] |
| Çalıştırıp test ettim | [ ] | [ ] | [ ] | [ ] |
| Prompt Günlüğüne kaydettim | [ ] | [ ] | [ ] | [ ] |

## Sonuç notları

- **Hangi turda çıktı en çok değişti?** [doldur]
- **Hangi bileşen (rol, bağlam, kısıt, format, doğrulama) en fazla fark yarattı?** [doldur]
- **Çıktıdaki hangi varsayım benim için yanlıştı?** [doldur]
- **Zero shot, few shot ve chain of thought'tan hangisini kullandım?** (Tur 3'teki "önce şunları düşün" kısmı chain of thought'tur.) [doldur]

## Proje boyunca ek kayıtlar

Her günün promptu ve çıktısı için aşağıya kısa kayıt ekle (ayrıntı `04_14_Gunluk_Prompt_Plani.md` dosyasında).

| 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
| 2 | Gün 2 promptu: Prisma şeması, Neon bağlantısı ve ilk deploy istendi | Prisma 7 şeması, geçiş adımları ve Render kurulumu üretildi | Evet: dosya yolu `~/Projeler/abonetakip`, git adımları GitHub Desktop'a uyarlandı, README/ADR dosya adları düzeltildi. Süreçte `.env.example` içine yanlışlıkla gerçek adres girdi, fark edilip Neon parolası yenilendi |