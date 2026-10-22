# Prompt Günlüğü • AboneTakip

> 4. hafta, Blok 6 etkinliği: bir promptu üç turda iyileştirme.
> **Kural:** "Çıktı özeti" ve "Değerlendirme" alanlarını yapay zekâyı gerçekten çalıştırdıktan sonra kendi gözlemlerinle doldur. Promptları ve çıktıları aynen sakla, sonradan düzeltme.
> **Görev:** AboneTakip için veri modeli ve merkezi tenant filtre yardımcısı (proje takviminde Gün 2 ve 3).
> **Tam kayıt:** Promptların ve yapay zekâ cevaplarının günlere göre tam metni için [prompt_cevap](../prompt_cevap/README.md) klasörüne bakın.

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
| 3 | Gün 3 promptu: kayıt, giriş, roller ve merkezi tenant filtresi için plan istendi. Plan ayrı bir sohbette onaylandı, kod bu sohbette parça parça üretildi | İmzalı çerezle oturum, bcrypt ile parola, kayıt/giriş sayfaları, panel iskeleti ve merkezi tenant filtresi üretildi | Evet: dosya yolları hatalıydı (db.ts, auth.ts ve tenant.ts yanlış klasöre açılmıştı, taşındı), tsc ile doğrulandı. Prisma Studio hata verdi, kontroller Neon SQL Editor ile yapıldı. 8 manuel test ve canlıda kayıt testi geçti |
| 3b | Arayüzü profesyonelleştirme fikri soruldu. Plan sohbette yazıldı ve onaylandı (sol kenar menü, yumuşak indigo, ek paket yok), kod 4 parçada üretildi | Ortak arayüz bileşenleri, kenar menülü panel yerleşimi, yeni giriş/kayıt ve panel sayfaları üretildi | Evet: Tailwind 4 ve Geist kullanımı kontrol edildi, mevcut dosyaların içeriği gösterilip alan adları korundu. Geliştirme modunda pg sslmode uyarısı çıktı, zararsız bulunup Gün 12e ertelendi. tsc, build, finance rol testi ve canlı kontrol geçti |
| 4 | Gün 4 promptu: müşteri ve plan yönetimi için plan ve kod istendi. Plan ve kod ayrı bir sohbette üretildi, bu sohbette adım adım uygulatıldı | Müşteri/plan ekleme, düzenleme ve pasife alma, sunucu tarafı doğrulama, firma bazında benzersiz e-posta (`@@unique([tenantId, email])`), plan fiyatı kontrolleri ve "Kayıt bulunamadı" sayfası üretildi | Evet: plandaki yinelenen doğrulama yerine mevcut `validation.ts` yeniden kullanıldı, `abonelik-kontrol.ts` ham `prisma` yerine `getTenantDb()` kullanacak şekilde düzeltildi. ESLint `react/no-unescaped-entities` hatası `&apos;` ile giderildi. Migration'daki `DROP INDEX` kontrolü yapıldı. Fiyat, e-posta tekrarı, pasife alma ve tenant izolasyonu (URL ve gizli alan oynama) testleri geçti, canlıda ekleme/listeleme çalıştı |
| 5 | Gün 5 promptu: abonelik yaşam döngüsü ve olay kaydı. Önce durum geçiş tablosu ve veri akışı planı sunuldu, onaylandıktan sonra dosyalar adım adım üretildi | `currentPeriodEnd` sütunu için migration, dönem hesabı (saf fonksiyon ve 8 birim testi), başlat/yenile/iptal işlemleri (abonelik ve olay tek transaction'da), abonelik listesi ve formu üretildi | Evet: promptta `currentPeriodEnd` isteniyordu ama şemada yoktu, plan aşamasında fark edilip migration eklendi. Projede test aracı yoktu, yeni paket eklenmeden Node'un yerleşik `node --test` aracı ve `allowImportingTsExtensions` ayarı kullanıldı. Çift tıklamaya karşı koşullu güncelleme (`updateMany` ile durum ve bitiş koşulu) yazıldı. İlk tenant izolasyonu denemesinde (D1) gizli alan değiştirilemediği için kendi aboneliği yenilenmişti, Console ile tekrarlanıp doğrulandı. Geçerli/geçersiz geçiş testleri, Gün 4 kilitleri ve 3 izolasyon senaryosu geçti, canlıda başlat ve yenile çalıştı |
| 6 | Gün 6 promptu: kiracı izolasyonu ve rol testleri. İki firma ve iki rolle otomatik testler, elle test tablosu ve finance yetki listesi istendi. Plan ve uygulama ayrı bir sohbette yapıldı | Neon test dalı ve `.env.test`; `node --test` çözümleme kancası ve duman testi; `yetki.ts` ve `pasife-alma.ts` çekirdeği; `veri.ts` test verisi yardımcısı; `tenant.test.ts` (21), `pasife-alma.test.ts` (9), `session.test.ts` (6), `kurallar.test.ts` (4) testleri; `test` ve `test:db` betikleri; `tenant.ts` beyaz liste düzeltmesi; 12 adımlık elle test tablosu; ADR Gün 6 bölümü | Evet: (1) AI Vitest önerdi, ADR'deki "ek paket yok" kararı hatırlatılınca `node --test` ve tek çözümleme kancasıyla ilerlendi; (2) AI'nın ilk planında rol kontrolü sunucu işleminde kalıyordu, otomatik test edilemeyeceği fark edilince pasife alma mantığı çekirdeğe ayrıldı (davranış ve mesajlar aynı, ayrı commit); (3) 11. test, kaydın `tenant: { connect }` ile başka firmaya taşınabildiğini gösterdi, kara liste yerine beyaz liste ile düzeltildi, 3 ek test eklendi; (4) `.env.test.example` dosyasına yer tutucu yerine gerçek adres yazıldı, commit öncesi `git grep` yakaladı, dosya düzeltildi ve veritabanı parolası test ile canlıda yenilendi; (5) ilk commit'ler dal açılmadan doğrudan main'e push edildi, bundan sonra her değişiklik dal ve PR ile giriyor |
