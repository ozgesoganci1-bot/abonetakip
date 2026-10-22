# Mimari Karar Kaydı (ADR) • AboneTakip

> Şablon: 3. haftadaki **Mimari Karar Kartı** (dört karar, her biri için bir cümlelik gerekçe). 4. haftanın isteği doğrultusunda **değişen kararların nedeni** ayrıca yazılmıştır.
> Senaryo: **C (Stok takip SaaS'ı vakasının yapısı)** esas alındı. Ürün alanı abonelik takibi olarak uyarlandı, mimari kararların mantığı aynı kaldı.

## 1. Mimari Karar Kartı

| # | Karar | Seçim | Gerekçe (tek cümle) | Reddedilen seçenek |
|---|---|---|---|---|
| 1 | Servis modeli | **PaaS (Render)** | Kod GitHub'dan alınıp derlenir ve yayınlanır, işletim sistemi ve çalışma ortamı yönetimi bende değildir, tek kişilik ekip için en düşük yönetim yüküdür. | IaaS: işletim sistemi, güncelleme ve yedekleme yükü fazla. Hazır SaaS: kendi ürünümüzü geliştiriyoruz. |
| 2 | Barındırma | **Klasik, sürekli açık Node sunucusu (Render web servisi)** | SSE açık bir bağlantı gerektirir ve serverless kalıcı bağlantıda zorlanır. | Serverless, edge |
| 3 | Kiracı yapısı | **Çok kiracılı, ortak tablolar + `tenant_id`** | Dönem projesi ölçeğinde yeterli, en düşük maliyetli ve en kolay yönetilen yaklaşımdır. Güvenlik kodun doğruluğuna bağlı olduğu için filtre tek merkezden uygulanır. | Ayrı veritabanı, ayrı şema: yönetimi ağır |
| 4 | Gerçek zamanlı ihtiyaç | **SSE** | Uyarı yalnızca sunucudan istemciye akar, tek yönlü olduğu için WebSocket gereksiz karmaşıktır. | WebSocket, polling |

## 2. Değişen kararlar ve nedenleri

| Karar | 3. hafta C senaryosu | Güncel ADR | Durum |
|---|---|---|---|
| Servis modeli | PaaS | PaaS (Render) | Değişmedi |
| Kiracı yapısı | Ortak tablolar + `tenant_id` | Aynı | Değişmedi |
| Gerçek zamanlı | SSE | SSE | Değişmedi |
| **Barındırma** | **Serverless API rotaları** | **Sürekli açık Node sunucusu** | **Değişti** |

**Barındırma kararının değişme nedeni:** SSE açık bir bağlantı gerektirir. 3. haftada serverless fonksiyonun işi bitince kapandığı ve kalıcı bağlantıda zorlandığı belirtilmişti. Serverless API rotaları ile SSE kararı birbiriyle çelişir. Çelişkiyi çözmek için SSE korundu, barındırma sürekli açık sunucuya çevrildi.

**Reddedilen alternatif:** Serverless'ı korumak mümkündü, ancak o zaman SSE yerine Supabase Realtime gibi hazır bir gerçek zamanlı servis gerekirdi. Bu, projeye ek bir dış bağımlılık ve sağlayıcıya bağımlılık (vendor lock-in) riski getirirdi.

## 3. Ek kararlar

| Konu | Karar | Gerekçe |
|---|---|---|
| Veritabanı ve ORM | PostgreSQL (**Neon**) + Prisma | Dersin yığını (PostgreSQL). Prisma TypeScript ile tip güvenliği sağlar ve şemayı okunur tutar. Veritabanı, Render'ın ücretsiz veritabanı 30 günde sona erdiği için Neon'da barındırılır (Neon ücretsiz planı süresizdir, 2026 kaynaklarına göre). |
| Uygulama çatısı | Next.js (App Router) + TypeScript | Dersin yığını (7. hafta). Tek uygulamada hem arayüz hem sunucu kodu. |
| Kimlik doğrulama | E-posta/parola, bcryptjs, httpOnly oturum çerezi | Basit ve dersin kapsamına uygun. |
| Secret yönetimi | Yalnızca ortam değişkeni | 2. hafta ilkesi: secret koda ve prompta girmez. |
| Fiyat gösterimi | TL cinsinden tam sayı | Kuruş hesabı karmaşıklık getirir, MVP için gerekmez. |
| Abonelik kuralı | Müşteri başına aynı anda tek ACTIVE abonelik | Churn hesabını (müşteri = abonelik) sadeleştirir. |
| Depo görünürlüğü | GitHub'da herkese açık (public) | Hoca ve sınıf erişimi kolay. Bu yüzden secret hiçbir zaman repoya girmez, `.env` `.gitignore`'dadır, demo verisi sahtedir. |
| Silme politikası | Müşteri ve plan silinmez, `isActive=false` yapılır | Geçmiş abonelik ve metrik kayıtları bozulmaz. |
| Kullanılmayanlar | Mikroservis, micro frontend | 3. haftada 4 kişilik bir ekip için bile aşırı mühendislik olarak işaretlendi. Tek kişilik, 2 haftalık proje için karmaşıklık ekler, fayda getirmez. |

## 4. Bilinen riskler ve sınırlar

- **Render ücretsiz web servisi (2026 kaynaklarına göre, Render dokümantasyonundan doğrulanmalı):** 15 dakika trafik almazsa uyur, ilk istek yaklaşık 1 dakika sürebilir. Sunum öncesi siteyi önceden açıp ısıt.
- **Neon ücretsiz veritabanı (2026 kaynaklarına göre, Neon dokümantasyonundan doğrulanmalı):** Süresizdir ama 5 dakika kullanılmazsa işlemcisi uyur, uyandıktan sonraki ilk sorgu yavaş olabilir. Depolama sınırı küçüktür (0,5-1 GB), bu proje için yeterlidir.
- **İki ayrı sağlayıcı:** Web uygulaması Render'da, veritabanı Neon'dadır. İki hesap ve iki ayrı panel yönetilir. Bağlantı adresi yalnızca ortam değişkeninde (`DATABASE_URL`) tutulur, Render ve yerel `.env` içinde ayrı ayrı tanımlanır.
- **Herkese açık depo:** Sızan bir secret herkes tarafından görülebilir. Her commit öncesi `.env` kontrolü yapılır, Gün 12'de repo ve geçmiş taranır.
- **Kiracı izolasyonu kodun sorumluluğundadır** (3. hafta, slayt 23 ve 24). Bu yüzden merkezi filtre, iki firmalı test ve güvenlik gözden geçirmesi planlandı.
- **Hesaplama doğruluğu:** Metrikler dersteki basitleştirilmiş formüllerdir. Kâr marjı ve indirimler dahil değildir.
- **AI çıktısı doğrulaması:** Üretilen kod okunup anlaşılmadan projeye alınmaz (4. hafta, slayt 30).

## 5. Değişiklik geçmişi

| Tarih | Değişiklik | Neden |
|---|---|---|
| [Tarih] | İlk sürüm | Proje başlangıcı |
| [Tarih] | Veritabanı Render PostgreSQL yerine **Neon PostgreSQL** olarak değiştirildi | Render'ın ücretsiz veritabanı 30 günde sona eriyor, sunum tarihi belirsiz. Neon ücretsiz planı süresiz. Servis modeli (PaaS) ve barındırma kararı değişmedi. |
| [Tarih] | Depo görünürlüğü herkese açık (public) yapıldı | Erişim kolaylığı. Secret güvenliği kuralları sıkılaştırıldı. |

## Gün 2 kararları (veri modeli ve ilk yayın)

- **Veritabanı:** Neon PostgreSQL, Frankfurt bölgesi. İki bağlantı adresi kullanılır: `DATABASE_URL` (havuzlu, uygulama için) ve `DIRECT_URL` (doğrudan, Prisma geçişleri için).
- **Geçişlerin çalıştırıldığı yer:** Geliştiricinin kendi bilgisayarı. Render derlemesi yalnızca `prisma generate` çalıştırır. Gerekçe: üretim veritabanına derleme sırasında otomatik değişiklik yapılmaz, geçişler kontrollü uygulanır.
- **Kiracı tutarlılığı:** Müşteri, plan, abonelik ve olay tablolarındaki ilişkiler `(id, tenantId)` bileşik anahtarıyla kurulur. Bir kaydın başka firmanın kaydına bağlanması veritabanı seviyesinde engellenir.
- **Tek aktif abonelik kuralı:** `subscriptions_one_active_per_customer` kısmi benzersiz dizini (yalnızca `status = 'ACTIVE'` satırlarında `customerId` benzersiz) `migration.sql` dosyasına elle eklendi. Prisma şeması bu dizini ifade edemediği için sonraki geçişlerde silinmesi önerilebilir. Bu yüzden geçişler her zaman `--create-only` ile oluşturulur ve `DROP INDEX` satırı kontrol edilir.
- **Yayın:** Render Web Service (Free, Frankfurt), adres: https://abonetakip.onrender.com/
- **Güvenlik olayı ve ders:** `.env.example` dosyasına yanlışlıkla gerçek bağlantı adresi yazıldı ve herkese açık depoya gönderildi. Neon parolası değiştirilerek sızıntı etkisiz hâle getirildi, dosya yer tutucularla düzeltildi. Kural: `.env.example` yalnızca yer tutucu içerir, commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol edilir.

## Gün 3 kararları (20 Ekim 2026)

### Oturum: imzalı çerez, ek paket yok
- Karar: Oturum, Node `crypto` ile HMAC-SHA256 imzalı, httpOnly bir çerezde tutulur. Çerezde yalnızca kullanıcı kimliği ve bitiş zamanı vardır. `tenantId` ve rol her istekte veritabanından okunur.
- Neden: Ek paket gerekmez (gereksiz kütüphane eklememe kuralı). Rol değişikliği çerez yenilenmeden anında geçerli olur (Test 8'de doğrulandı).
- Bilinen sınır: Çıkış yapınca çerez silinir ama sunucuda geçersiz kılma listesi yoktur. Kapsam dışı bırakıldı.

### Koruma: middleware yok
- Karar: Panel `layout.tsx` oturumsuz kullanıcıyı `/giris` sayfasına yönlendirir. Her sayfa kendi oturum ve rol kontrolünü de yapar.
- Neden: Next.js layout ve sayfayı birbirinden bağımsız çalıştırır, tek bir kontrole güvenmek yetmez. Edge/middleware kullanmama kuralına da uyar.

### Kiracı izolasyonu: merkezi `getTenantDb()`
- Karar: Prisma client extension ile tüm sorgulara `tenantId` zorla eklenir. Ham `prisma` nesnesi yalnızca `src/lib/db.ts`, `src/lib/auth.ts` ve `src/lib/tenant.ts` içinde kullanılır.
- Neden: Filtre tek yerden uygulanır, sorgularda elle tekrar yazılmaz. Bilinmeyen işlem türleri hata fırlatır.
- Test: İzolasyon testleri Gün 6'da yapılacak.

### Kimlik doğrulama
- Parolalar bcryptjs (maliyet 12) ile özetlenir, 8-72 bayt arası olmalıdır.
- E-posta tüm sistemde benzersizdir. Yanlış girişte tek bir genel mesaj verilir ("E-posta veya parola hatalı.").
- Kayıtta firma ve ilk kullanıcı (manager) tek işlemde oluşturulur.

### Paketler
- `bcryptjs`: parola özeti. Kendi tip tanımlarıyla gelir.
- `@prisma/adapter-pg`: Prisma 7 sürücü adaptörü gerektirir.

### Bilinen açık
- `npm audit` 5 yüksek uyarı veriyor. `npm audit fix --force` çalıştırılmadı, Gün 12'de incelenecek.

## Arayüz kararları (20 Ekim 2026)

### Yerleşim ve renk
- Karar: Masaüstünde sol kenar menü, küçük ekranda üstte yatay menü. Renkler yumuşak indigo ve gri tonları (`slate`), karanlık mod yok.
- Neden: Kurumsal ve göz yormayan bir görünüm. Karanlık mod kapsam dışı olduğu için `globals.css` içinden kaldırıldı.
- Küçük ekran menüsü ek JavaScript gerektirmez: iki ayrı menü çizilir, ekran boyutuna göre biri CSS ile gizlenir.

### Ortak bileşenler, ek paket yok
- Karar: `src/components/ui` altında `Dugme`, `Kart`, `FormAlani`, `SayfaBasligi`, `BosDurum` ve `Rozet` bileşenleri. Yeni sayfalar bunları kullanır.
- Neden: Her sayfada stili tekrar yazmamak. Tailwind 4 sınıfları yeterli, ikon ya da arayüz kütüphanesi eklenmedi.

### Değişmeyenler
- Sunucu kodu ve yetki kontrolleri aynı kaldı. Menüde bir bağlantıyı gizlemek yetki kontrolü sayılmaz, her sayfa kendi kontrolünü yapar.

### Bilinen açıklar
- Geliştirme modunda `pg` kütüphanesi Neon adresindeki `sslmode=require` için uyarı veriyor. Çalışmayı etkilemiyor. Gün 12'de `sslmode=verify-full` ile test edilecek.
- Ev klasöründe yanlışlıkla kalmış bir `package-lock.json` Next.js uyarısına yol açıyordu. 20 Ekim günü `~/_eski_npm` klasörüne taşınarak çözüldü.

## Gün 4 kararları (21 Ekim 2026)

### E-posta benzersizliği firma bazında
- Karar: `Customer` tablosunda `@@unique([tenantId, email])`. E-postalar küçük harfe çevrilip kırpılarak kaydedilir. E-posta isteğe bağlıdır, boş e-postalı birden fazla müşteri olabilir. Ek olarak uygulamada önceden kontrol yapılır ve pasif müşteriler de bu kontrole dahildir.
- Neden: Aynı e-posta farklı firmalarda bulunabilir, firmalar birbirinden bağımsızdır. Veritabanı kuralı, iki isteğin aynı anda gelmesi durumunda da tekrarı engeller. Başka firmada aynı e-posta olup olmadığı bilgisi hiçbir zaman gösterilmez.

### Kayıt bulunamadı yanıtı
- Karar: Başka firmanın ya da var olmayan bir kayda erişim denemesi "Kayıt bulunamadı" sayfası (`notFound()`) ya da "Kayıt bulunamadı." mesajı döndürür. Güncelleme ve pasife alma `updateMany` ile yapılır, başka firmanın kimliği 0 satır etkiler.
- Neden: "Yetkin yok" demek kaydın var olduğunu ele verir. Tek tip yanıt bilgi sızdırmaz.

### Pasife alma kuralları
- Karar: Müşteri ve plan silinmez, `isActive=false` olur. Pasife alma yalnızca `manager` yapabilir. Aktif aboneliği olan müşteri ya da plan pasife alınamaz. Pasife alınan kayıt yeniden aktifleştirilemez.
- Neden: Geçmiş abonelik ve metrik verisi korunur. Yeniden aktifleştirme bu hafta kapsam dışı, gerekirse sonra eklenir.

### Plan fiyat ve aralık kilidi
- Karar: Fiyat pozitif tam sayı TL, en çok 10.000.000. Nokta ve virgül kabul edilmez. Planın aktif aboneliği varsa fiyat ve aralık değiştirilemez, yalnızca ad değişir.
- Neden: Aktif abonelerin fiyatı sessizce değişirse MRR hesabı bozulur.

### Doğrulama ve yetki
- Karar: Tüm girdiler sunucuda `src/lib/validation.ts` içindeki saf fonksiyonlarla doğrulanır, alan bazlı hata mesajı döner. Her sunucu eylemi kendi yetki kontrolünü yapar, düğmeyi gizlemek yetki sayılmaz. `tenantId` yalnızca oturumdan okunur.
- Neden: Gün 3'teki kurallarla aynı. Ek paket eklenmedi.

### Bilinen açıklar
- Pasife alma ve plan fiyat kilidi "önce kontrol, sonra güncelleme" iki adımıdır. Abonelik başlatmayla aynı anda gelirse küçük bir yarış penceresi vardır. Gün 5'te abonelik başlatılırken kapatılacak, not `src/lib/abonelik-kontrol.ts` içinde.
- Abonelik başlatılırken müşteri ve planın `isActive` olduğu Gün 5'te kontrol edilecek.

## Gün 5 kararları (21 Ekim 2026)

### Abonelik durum geçişleri
- Karar: Başlat (abonelik yok, ACTIVE olur, olay STARTED), Yenile (yalnızca ACTIVE, dönem bir aralık ileri, olay RENEWED), İptal (yalnızca ACTIVE, CANCELED olur, olay CANCELED). İptal edilen abonelik yenilenemez, müşteri için yeni abonelik (yeni kayıt) başlatılır. `manager` ve `finance` üç işlemi de yapabilir.
- Neden: Durum geçmişi bozulmasın, MRR ve churn olaylardan güvenilir hesaplanabilsin.

### Abonelik ve olay kaydı tek işlemde
- Karar: Abonelik kaydı ile olay kaydı aynı veritabanı işleminde (transaction) yazılır, biri başarısız olursa ikisi de geri alınır. İşlem `getTenantDb()` üzerinden yapıldığı için tenant filtresi işlem içinde de uygulanır (testlerle doğrulandı).
- Neden: Olay kaydı olmayan durum değişikliği ya da durum değişmeyen olay kaydı tutarsızlık yaratır.

### Çift tıklama ve çakışma
- Karar: Başlatmada `subscriptions_one_active_per_customer` dizini ikinci aktif aboneliği engeller, hata yakalanıp anlaşılır mesaj verilir. İptalde güncelleme koşuluna `status = ACTIVE`, yenilemede ek olarak okunan `currentPeriodEnd` değeri eklenir. Aynı anda gelen iki istekten yalnızca biri uygulanır, ikincisi 0 satır etkiler ve olay yazılmaz.
- Neden: Çift tıklama ya da iki sekmeden gelen aynı işlem, ikinci bir yenileme veya iptal olayı üretmemeli.

### Dönem hesabı
- Karar: `src/lib/donem.ts` saf fonksiyon, UTC'ye göre çalışır. Ay sonu taşmaz (31 Ocak + 1 ay = 28 Şubat, artık yılda 29 Şubat). Yenilemede yeni bitiş mevcut bitişten hesaplanır.
- Sınır: Ay sonu kısaltması olduysa sonraki dönemler kısalan günden sürer (31 Ocak, 28 Şubat, 28 Mart). Kabul edilmiş bir basitleştirmedir.
- Neden: JavaScript'in `setMonth` işlemi 31 Ocak + 1 ay için 3 Mart verir, müşteriye fazladan gün tanır.

### Birim testi: ek paket yok
- Karar: Yeni paket eklenmedi. Node'un yerleşik test aracı kullanılır (`node --test src/lib/donem.test.ts`, 8 test). `.ts` uzantılı içe aktarma için `tsconfig.json` içine `allowImportingTsExtensions: true` eklendi (`noEmit` açık olduğu için yalnızca tür kontrolü yapılır).
- Neden: Proje kuralı gereksiz paket eklememek. Gün 7 metrik hesapları da aynı yöntemle test edilecek.

### Şema değişikliği
- Karar: `subscriptions.currentPeriodEnd` (zorunlu, tarih) eklendi. Migration yerelde `--create-only` ile oluşturuldu, içinde yalnızca `ADD COLUMN` var, `DROP INDEX` satırı yok. `migrate deploy` ile Neon'a uygulandı.

### Bilinen açıklar
- Pasife alma ile abonelik başlatma tam aynı anda gelirse küçük bir yarış penceresi kalır. Tamamen kapatmak satır kilidi gerektirir, o da ham SQL demektir ve projede ham SQL yasaktır. Bilinçli olarak kabul edildi.
- Render ücretsiz örneği boşta kapanabilir, ilk başlatma ara sıra takılabilir. Çözüm: Manual Deploy ile son commit'i yeniden dağıtmak.
- Test sırasında açılan sahte hesaplar (`burak.b` ve `can.c`) ile verileri veritabanında duruyor. Gün 14 temizlik listesinde.

## Gün 6 kararları (22 Ekim 2026): kiracı izolasyonu ve rol testleri

**Durum:** Tamamlandı. PR'lar birleşti (son PR: #25), canlı çalışıyor.
**Sonuç:** 20 birim testi (`npm test`), 33 veritabanı testi (`npm run test:db`),
12 adımlık elle test. Testler bir izolasyon açığı buldu, açık aynı gün düzeltildi.

### Kararlar

**K6.1: Veritabanı testleri Neon'da ayrı bir "test" dalında çalışır (Yol B)**
- **Seçenekler:** (A) Canlı veritabanında "test-" etiketli veri üretip silmek,
  (B) Neon'da canlının kopyası olan ayrı bir dal.
- **Karar:** B. Testler `.env.test` dosyasındaki test dalı adresleriyle çalışır.
- **Gerekçe:** A'da hatalı bir silme sorgusu ya da yarıda kalan bir test canlı veriyi
  ve dashboard metriklerini bozabilirdi. B'de testler canlı veriye fiziksel olarak
  dokunamaz. Neon dalı ek maliyetsiz ve ek paketsiz.
- **Doğrulama:** Kurulumda iki kontrol yapıldı. Adreslerdeki uç nokta kimliği
  parolasız yazdırıldı ve `prisma migrate status` çıktısındaki sunucu adı Neon
  panelindeki test dalıyla karşılaştırıldı.
- **Dikkat:** `prisma.config.ts` dosyası `.env` dosyasını da yükler. `.env.test`
  içinde bir değişken eksik kalırsa değer canlı `.env` dosyasından gelir. Bu yüzden
  migration komutlarından önce iki kontrol de yapılır.

**K6.2: Test aracı Node'un yerleşik `node --test` aracıdır (Vitest değil)**
- **Gerekçe:** Gün 5 ADR kararı "birim testi: ek paket yok" ile uyumlu. Node v26
  TypeScript dosyalarını doğrudan çalıştırabiliyor.
- **Bedeli:** Next.js'in uzantısız içe aktarmaları ve `@/` kısaltması için
  `src/test-destek/kancalar.mjs` adında küçük bir çözümleme kancası yazıldı. Kanca
  Node'un yerleşik `node:module` özelliğini kullanır, yalnızca testlerde yüklenir.
  `.ts` değil `.mjs` dosyasıdır, böylece `npm run build` tip kontrolüne girmez.
- **Önceden konan sınır:** Duman testi birden fazla geçici çözüm gerektirseydi
  Vitest yeniden değerlendirilecekti. Tek kanca yetti.
- **Bilinen uyarılar (zararsız):** `MODULE_TYPELESS_PACKAGE_JSON` uyarısı çıkar.
  `package.json` dosyasına `"type": "module"` eklenmedi, çünkü Next.js
  yapılandırmasını etkileyebilir.

**K6.3: Pasife alma mantığı test edilebilir bir çekirdeğe ayrıldı**
- **Sorun:** Rol kontrolü (`requireManager`) oturumu çerezden okuyordu ve çerez
  yalnızca Next.js isteği içinde vardır. Rol kontrolü sunucu işleminin içinde
  kaldığı sürece "finance pasife alamaz" kuralı otomatik test edilemezdi.
- **Karar:**
  - `src/lib/yetki.ts`: saf rol fonksiyonu `yoneticiMi(rol)`. `requireManager`
    artık bunu kullanır.
  - `src/lib/pasife-alma.ts`: `musteriPasifeAlCekirdek` ve `planPasifeAlCekirdek`.
    Kullanıcıyı ve veritabanı nesnesini parametre olarak alırlar. Rol kontrolü,
    kimlik kontrolü, aktif abonelik kontrolü ve güncelleme buradadır.
  - `musteriler/actions.ts` ve `planlar/actions.ts` içindeki pasife alma işlemleri
    artık yalnızca oturumu okur (`requireUser`, `getTenantDb`), çekirdeği çağırır
    ve sayfaları yeniler.
  - `abonelik-kontrol.ts`: `aktifAbonelikVarMi` fonksiyonuna isteğe bağlı `db`
    parametresi eklendi. Mevcut çağrılar değişmedi.
- **Korunan kurallar:** Mesajlar ve kontrol sırası Gün 4–5 ile birebir aynı. Uygulamada
  parametreler her zaman oturumdan gelir, tenantId formdan alınmaz. Ekleme, güncelleme
  ve abonelik işlemlerine dokunulmadı. Ayrı commit olarak yapıldı ve build ile tarayıcı
  denemesinden geçtikten sonra testlere geçildi.

**K6.4: Test verisi için ham `prisma` istisnası (`src/test-destek/veri.ts`)**
- **Neden:** Firma (Tenant) ekleme ve silme, tenant filtresinden bilerek geçemez.
  Test firmalarını oluşturmak ve silmek için ham `prisma` gerekir.
- **Güvenceler:**
  1. `TEST_VERITABANI=evet` işareti yoksa dosya veritabanına bağlanmadan durur. İşaret
     yalnızca `.env.test` içinde vardır. Testler `.env` dosyasını hiç yüklemez.
  2. Silme yalnızca o çalışmada oluşturulan firma kimlikleriyle yapılır ve firma
     adının o çalışmanın etiketiyle (`test-xxxxxxxx`) başlaması gerekir. Joker silme
     yoktur.
  3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.
- **Denetim:** `kurallar.test.ts` ham `prisma` kullanımına yalnızca `db.ts`, `auth.ts`,
  `tenant.ts` ve `veri.ts` dosyalarında izin verir. Ham SQL'in hiçbir yerde olmadığını
  da kontrol eder.

**K6.5: Main'e doğrudan push yapılmaz, her değişiklik PR ile girer**
- **Olay:** Gün 6'nın ilk commit'leri (çözümleme kancası, duman testi, pasife alma
  çekirdeği) dal açılmadan doğrudan main'e push edildi. Commit'ler build ve testlerden
  geçmişti, canlıda sorun çıkmadı. Ama gözden geçirme adımı atlanmış oldu.
- **Kural:** Her iş ayrı bir dalda yapılır. Commit'ler yerelde hazırlanır. Push ve PR
  GitHub Desktop ile açılır. Main'e yalnızca birleştirilen PR'lar girer.
- **Commit öncesi kontrol:** `git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"`. Eski
  `neon.tech|npg_` araması dokümanlarda çok fazla zararsız sonuç döndürüyordu ve
  gerçek bir sızıntıyı gözden kaçırmayı kolaylaştırıyordu. `CLAUDE.md` Gün 14'te
  güncellenecek.

**K6.6: Elle testler test dalıyla çalışan geliştirme sunucusunda yapılır**
- **Komut:** `(set -a; source .env.test; set +a; npx next dev)`. Değerler yalnızca
  geçici alt kabukta yaşar, ekrana ve komut geçmişine yazılmaz. `node --env-file` bu
  iş için kullanılamaz, çünkü `next dev` alt sürece bu ayarın aktarılmasına izin vermez.
- **Doğrulama:** İlk kayıttan sonra yeni firmanın Neon'da test dalında görünüp
  production'da görünmediği kontrol edildi.
- **Finance hesapları:** Kullanıcı yönetimi henüz olmadığı için hesaplar uygulamanın
  kayıt sayfasıyla açıldı (parolalar bcrypt ile özetlendi). Ardından Neon SQL Editor'da,
  yalnızca test dalında, `UPDATE` ile finance rolüne çevrilip A ve B firmalarına taşındı.

### Güvenlik olayı: Test dalı adresi örnek dosyaya yazıldı

- **Ne oldu:** `.env.test.example` dosyasına yer tutucular yerine test dalının gerçek
  adresleri ve parolası yazıldı. Commit öncesi `git grep` kontrolü bunu yakaladı.
  Dosya commit edilmedi, GitHub'a gitmedi. Ancak parola sohbete ve terminal ekranına
  düştü.
- **Etkisi:** Test dalı production'dan kopyalandığı için veritabanı sahibi kullanıcının
  parolası büyük ihtimalle production ile aynıydı.
- **Alınan önlem:**
  - Dosya commit hazırlığından çıkarıldı ve yer tutucularla düzeltildi.
  - Veritabanı sahibi kullanıcının parolası hem test hem production dalında yenilendi.
  - Render ortam değişkenleri ve yerel `.env` / `.env.test` dosyaları güncellendi.
  - Canlıda giriş ve listeleme doğrulandı. `SESSION_SECRET` sızmadığı için değiştirilmedi.
- **Ders:** Gün 2'deki olayla aynı tür hata. Commit öncesi kontrol işe yaradı. Kontrol
  komutu daha kesin hâle getirildi (K6.5).

### Bilinen açıklar ve alınan önlemler

**Açık 1: Kayıt ilişki alanı üzerinden başka firmaya taşınabiliyordu (düzeltildi)**
- **Ne bulundu:** Tenant filtresi yalnızca `data.tenantId` alanını engelliyordu. Prisma'da
  aynı değişiklik ilişki üzerinden de yazılabiliyor:
  `customer.update({ data: { tenant: { connect: { id: "B" } } } })`. Bu sorgu A
  firmasının müşterisini B firmasına taşıdı. İzolasyon testlerinden biri (11. test)
  bunu yakaladı.
- **Bugünkü risk (düzeltme öncesi):** Düşüktü. Hiçbir sunucu işlemi bu yazımı
  kullanmıyordu ve form verisi doğrudan `data` içine konmuyordu. Ancak kiracı
  izolasyonu MUST olduğu için aynı gün düzeltildi.
- **Ne yapıldı:** `src/lib/tenant.ts` içine beyaz liste eklendi.
  - Ekleme ve güncellemede (create, createMany, update, updateMany, upsert) yalnızca
    tablonun kendi sütunları yazılabilir. Sütun listeleri Prisma'nın şemadan ürettiği
    koddan okunur.
  - İlişki alanları ve altlarındaki bütün iç içe yazımlar (connect, create,
    connectOrCreate) en üst düzeyde reddedilir.
  - Güncellemede `id` ve `tenantId` değiştirilemez.
  - Tanınmayan tablo veya işlemde filtre durdurur (fail-closed).
  - Kara liste yerine beyaz liste seçildi: kara liste yalnızca bilinen anahtarları
    engeller, beyaz liste şemaya eklenecek yeni ilişkileri de kendiliğinden kapsar.
- **Kanıt:** `tenant.test.ts` (21 test). Açığı bulan test düzeltmeden önce başarısız,
  sonra başarılı. İlişki alanıyla güncelleme, ekleme ve iç içe yazma için ayrı testler
  eklendi. Düzeltme sonrası build, birim testleri, veritabanı testleri ve tarayıcıda
  9 işlemlik deneme (müşteri, plan, abonelik başlat, yenile, iptal) geçti.
- **Neyi kapsamıyor:**
  - Ham `prisma` kullanan dosyalar (`auth.ts`, `test-destek/veri.ts`) filtreden geçmez.
    Hangi dosyaların ham `prisma` kullanabileceği `kurallar.test.ts` ile denetlenir.
  - Koruma uygulama katmanındadır. Müşteri, plan ve kullanıcı tablolarında
    veritabanı düzeyinde ikinci bir savunma hattı yoktur. Abonelik ve olay tabloları
    bileşik anahtarlarla korunur.
  - Beyaz liste Prisma'nın iç dosya yoluna (`generated/prisma/internal/prismaNamespace`)
    bağlıdır. Prisma güncellenince yol değişebilir. Değişirse tip kontrolü ve testler
    bunu yakalar.

**Açık 2: Firma güncellemesi başka firma kimliğiyle istenince kendi firmaya uygulanıyor (açık, issue)**
- `tenant.update({ where: { id: B } })` hata vermiyor. Filtre kimliği oturumdaki
  firmayla değiştirdiği için güncelleme A'nın kendi kaydına uygulanıyor. B etkilenmiyor,
  yani sızıntı yok, ama davranış yanıltıcı. Ayarlar (CAC) sayfası yazılırken ele alınacak.

**İleride değerlendirilecek önlemler**
- **Gün 12, `tenantId` değiştirilemez tetikleyicisi:** PostgreSQL tetikleyicisi ile
  customers, plans, users, subscriptions ve subscription_events tablolarında `tenantId`
  güncellemesi reddedilir. Böylece uygulama kodu ne yaparsa yapsın kayıt başka firmaya
  taşınamaz. SQL migration dosyasına elle yazılır. Prisma'nın sonraki migration'larda
  bu tetikleyiciyi silmeye çalışıp çalışmadığı kontrol edilmelidir. Row Level Security
  (RLS) bağlantı havuzuyla birlikte 2 haftalık kapsam için ağır bulundu.
- **SSL modu:** PostgreSQL sürücüsü (`pg`) `sslmode=require` için gelecekteki bir
  sürümde daha zayıf davranışa geçileceğini bildiriyor. Bugün en sıkı mod
  (`verify-full`) uygulanıyor. Bağlantı adreslerinin ileride açıkça
  `sslmode=verify-full` ile güncellenmesi değerlendirilecek.

### Doğrulanan güvenceler

| Güvence | Kanıt |
|---|---|
| A firması B'nin müşteri, plan ve aboneliklerini listeleyemez, bulamaz, güncelleyemez, pasife alamaz | `tenant.test.ts` |
| Tenant filtresi `$transaction` içindeki sorgulara da uygulanır | `tenant.test.ts` (iptal ve yenileme) |
| Başka firmanın müşterisi ve planıyla abonelik açmak, aboneliğine olay yazmak veritabanında reddedilir (bileşik anahtarlar) | `tenant.test.ts` |
| Eklerken gönderilen başka tenantId yok sayılır | `tenant.test.ts` |
| İlişki alanıyla yazma ve iç içe yazma reddedilir | `tenant.test.ts` |
| finance müşteriyi ve planı pasife alamaz, kayıt değişmez: **doğrulandı** | `pasife-alma.test.ts` (9 test) |
| Gün 5 kuralı korunur: aktif aboneliği olan kayıt pasife alınamaz | `pasife-alma.test.ts` |
| Oturum çerezi değiştirilirse (kullanıcı kimliği, imza, anahtar) geçersiz sayılır, süresi dolar | `session.test.ts` (6 test) |
| Ham `prisma` yalnızca izinli dosyalarda, ham SQL hiçbir yerde | `kurallar.test.ts` (4 test) |

**Test sayıları:**
- `npm test`: 20 test (dönem 8, rol kuralı 2, oturum 6, statik kural 4)
- `npm run test:db`: 33 test (duman 3, izolasyon 21, rol 9)

**Testlerin garanti etmedikleri:**
- Yalnızca test edilen fonksiyonları kapsar. Yeni yazılan bir sorgunun filtreden
  geçtiğini `kurallar.test.ts` dolaylı olarak denetler, ama yeni bir iş kuralını test etmez.
- Sunucu işlemlerindeki oturum okuma satırı (`requireUser`, `getTenantDb`) otomatik
  test edilmez. Elle testle kapsanır.
- Dashboard metrikleri ve SSE uyarıları henüz yazılmadığı için izolasyonları test
  edilmedi. İlgili günlerde eklenecek.

### Elle test özeti (test dalı, 2 firma, 4 kullanıcı): 12/12 geçti

- A firmasının yöneticisi ve finans kullanıcısı, B'nin müşteri ve plan sayfalarını
  adres çubuğuna kimlik yazarak açamadı ("Bulunamadı"). Ters yönde de (B → A) aynı.
- Listelerde yalnızca kendi firmasının kayıtları göründü.
- Finance kullanıcısına Ayarlar ve Kullanıcılar menüde görünmedi. Adres çubuğuyla
  doğrudan gidildiğinde "Bu sayfaya erişim yetkiniz yok" mesajı çıktı.
- Pasife alma düğmesi finance kullanıcısına müşteri ve plan sayfalarında hiç görünmedi.
  Sunucu tarafındaki kontrol otomatik rol testleriyle doğrulandı.
- Finance kullanıcısı müşteri ekleyip güncelleyebildi (kendisine açık işlemler).
- Çıkış yapıldıktan sonra korumalı sayfaya gidilince giriş sayfasına yönlendirildi.

**Sonradan eklenecekler:**
- CAC ayarı ve kullanıcı yönetimi (manager)
- Dashboard metrik izolasyonu
- SSE uyarısının yalnızca ilgili firmaya gitmesi
- Aylık MRR grafiği

## Gün 7 kararları (22 Ekim 2026): Hafta 1 inceleme turu

### Durum

Hafta 1 kodu, yapay zekâ ile bir inceleme turundan geçirildi. İncelenen alanlar: kimlik doğrulama ve oturum, merkezi tenant filtresi, müşteri, plan ve abonelik işlemleri, şema, `.gitignore` ve `.env.example`. Gün 6'da kapatılan açık (`tenant: { connect }` ile kaydın başka firmaya taşınması) ve issue #24 yeniden bulgu sayılmadı.

İncelemede yalnızca gösterilen dosyalar değerlendirildi. Gösterilmeyen dosyalar için bulgu yazılmadı: liste sayfaları, dashboard, form bileşenleri, `prisma.config.ts`.

### Sonuç

**Yüksek öncelikli bulgu çıkmadı.** Toplam 13 bulgu var: 2 orta, 11 düşük. Kiracı filtresi, sunucu tarafı rol kontrolü, girdi doğrulama ve çift tıklama koruması incelenen bütün işlemlerde doğru kurulmuş.

| No | Sınıf | Bulgu | Öncelik | Karar |
|---|---|---|---|---|
| G1 | Güvenlik | Girişte deneme sınırı yok | Orta | Ertelendi: Gün 12 (güvenlik günü) |
| G2 | Güvenlik | Oturum sunucu tarafında iptal edilemiyor | Düşük | Bilinen sınır |
| G3 | Güvenlik | Ham SQL ve ham `prisma` yasağı yalnızca yorumda | Düşük | Kapandı: `kurallar.test.ts` zaten denetliyor (Gün 6) |
| G4 | Güvenlik | Kayıt formu e-postanın kayıtlı olduğunu söylüyor | Düşük | Bilinen sınır |
| D1 | Doğruluk | Abonelik başlarken fiyat saklanmıyor | Orta | Ertelendi: MRR grafiğinden önce karara bağlanacak |
| D2 | Doğruluk | Merkezi filtre müşteri, plan ve abonelik silmeye izin veriyordu | Düşük | Yapıldı (K7.1) |
| D3 | Doğruluk | Plan fiyat kilidi "önce kontrol et, sonra güncelle" biçiminde | Düşük | Bilinen sınır |
| D4 | Doğruluk | Dönem hesabı UTC'ye, gösterim Türkiye saatine göre | Düşük | Ertelendi: dashboard gününde karara bağlanacak |
| O1 | Okunabilirlik | `tekrarEdenKayitMi` iki yerde ayrı ayrı yazılmış | Düşük | Yapıldı (K7.2) |
| O2 | Okunabilirlik | Eskimiş açıklama yorumları | Düşük | Yapıldı (K7.3) |
| O3 | Okunabilirlik | Kodda "Gün X" geçmiş notları | Düşük | Şimdilik yapılmayacak |
| O4 | Okunabilirlik | `.gitignore` tekrarı ve yanıltıcı yorum | Düşük | Yapıldı (K7.4) |
| O5 | Okunabilirlik | Hata loglarında hiçbir ayrıntı yok | Düşük | Şimdilik yapılmayacak |

Ayrıca doğrulananlar:
- Tenant filtresi `$transaction` içinde de çalışıyor. Bunu `tenant.test.ts` dosyasındaki iptal ve yenileme testi gösteriyor (Gün 6).
- `subscriptions_one_active_per_customer` dizini init geçişinde (`20261019164502_init`) `CREATE UNIQUE INDEX` ile oluşturuluyor. Sonraki geçişlerde bu dizini silen bir `DROP INDEX` yok.

Bu inceleme sırasında bir de güvenlik olayı bulundu (aşağıda ayrıca anlatılıyor).

Testler: `npm test` 20/20, `npm run test:db` 36/36 (yeni silme koruması testleri dahil), `npx tsc --noEmit` temiz.

Commit'ler (`gun7-inceleme-duzeltmeleri` dalı):
- `5516060` fix(tenant): müşteri, plan ve abonelik tablolarında silmeyi engelle
- `5164021` fix(guvenlik): prompt günlüğündeki gerçek Neon adresini maskele
- `c959d4f` refactor: tekrarEdenKayitMi tek yerde
- `d93f006` docs: eskimiş yorumları güncelle
- `69e11e3` chore: .gitignore tekrarını temizle
- `62b97a8` docs: commit öncesi gizli bilgi taramasını güncelle

### Kararlar

**K7.1 Silme koruması merkezi filtrede (D2).** `src/lib/tenant.ts`, `Customer`, `Plan`, `Subscription` ve `SubscriptionEvent` tablolarında `delete` ve `deleteMany` işlemlerini veritabanına gitmeden reddeder. Hata mesajı tabloya göre değişir:
- Müşteri ve plan: "kayıtlar silinmez, pasife alınır".
- Abonelik: "abonelikler silinmez, iptal edilir".
- Olay kayıtları: "olay kayıtları silinmez".

`User` tablosunda silme serbest bırakıldı, çünkü kullanıcı yönetimi henüz tasarlanmadı. `Tenant` tablosu zaten korunuyordu. Test verisi temizliği (`src/test-destek/veri.ts`) ham `prisma` ile yapıldığı için bu korumadan etkilenmez. `tenant.test.ts` dosyasına 3 test eklendi: dört tabloda `deleteMany` reddi, `delete` reddi (iki testte de kayıtların yerinde kaldığı kontrol ediliyor) ve `User` tablosunda silmenin engellenmediği.

**K7.2 `tekrarEdenKayitMi` tek tanım (O1).** Fonksiyon yalnızca `src/lib/islem.ts` içinde tanımlı. `src/lib/auth.ts` onu buradan içe aktarır. Davranış değişmedi.

**K7.3 Yorumlar güncellendi (O2).** `src/lib/db.ts` yorumu, ham `prisma` kullanabilen dosyaları nedenleriyle birlikte listeliyor. `src/test-destek/veri.ts` istisnası (Gün 6) eklendi ve kuralın `kurallar.test.ts` tarafından denetlendiği belirtildi. `src/lib/validation.ts` yorumu, dosyanın kapsadığı bütün formları sayıyor. Yalnızca yorumlar değişti.

**K7.4 `.gitignore` sadeleştirildi (O4).** Şablondan kalan yanıltıcı yorum ("can opt-in for committing") ve tekrar eden `.env*` satırı silindi. Ortam dosyası kuralları tek blokta toplandı: önce `.env*`, sonra `!.env.example` ve `!.env.test.example` istisnaları. `git check-ignore` ve `git ls-files` ile doğrulandı: repoda yalnızca iki örnek dosya kayıtlı.

**K7.5 Commit öncesi gizli bilgi taraması değişti.** Gün 6'daki daraltılmış tarama (yalnızca `npg_…` araması) Neon sunucu adlarını ve eski biçimli parolaları yakalamıyordu. Aşağıdaki güvenlik olayındaki satırı da yakalamadı. Yeni kural iki taramadan oluşuyor ve ikisi de satır içeriğini ekrana basmıyor:
- Parola: `git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"`. Çıktı boş olmalı.
- Sunucu adı: `git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"`. Sonuç 0 olmalı.

Belgelerdeki örnek adresler `ep-xxxx` biçiminde yazılır. Daha geniş bir kalıp (`ep-[a-z0-9-]+`) denendi ama `package-lock.json` içindeki paket adlarında (`deep-equal`, `deep-is`) yanlış alarm verdi. Bu yüzden sunucu adı ile `neon.tech` aynı eşleşmede aranıyor. Kural `CLAUDE.md` dosyasına ve Claude Project talimatlarına işlendi.

**K7.6 Prompt günlüğü maskeleme kuralı.** `prompt_cevap/` klasörüne yapıştırılan her içerik, yapıştırmadan önce maskelenir: `[DATABASE_URL]`, `[NEON_HOST]`, `[NEON_PAROLA]`. Kural `CLAUDE.md` dosyasına işlendi.

### Güvenlik olayı ve ders

- **Ne oldu:** `prompt_cevap/gun_0_prompt_cevap.md` dosyasında maskelenmemiş bir `DATABASE_URL` satırı bulundu. Satırda gerçek bir Neon sunucu adı vardı ve bu satır herkese açık depoya gönderilmişti. Satır, bu inceleme turundaki genel tarama sırasında fark edildi. İçeriği hiçbir sohbete ya da dosyaya kopyalanmadı, yalnızca sayı veren komutlarla incelendi.
- **Yapılanlar:**
  1. Neon parolası değiştirildi. Yeni adres yalnızca yerel `.env` dosyasına ve Render'daki ortam değişkenlerine yazıldı.
  2. Satır `[DATABASE_URL]` ile maskelendi (`5164021`).
  3. Depo genelinde tarama tekrarlandı: başka gerçek adres yok. `gun_2_prompt_cevap.md` dosyasındaki eşleşmelerin hepsi `ep-xxxx` biçiminde uydurma örnekler.
  4. Parola değişikliğinden sonra `npm run test:db` çalıştırıldı ve canlı sitede giriş denendi, ikisi de çalışıyor.
- **Bilinen sınır:** Eski adres git geçmişindeki commit'lerde kalmaya devam ediyor. Parola değiştirildiği için bu adres artık bağlantı için kullanılamaz. Geçmişi yeniden yazmak için ek araç gerekir, bu da şu an gerekli görülmedi.
- **Ders:** Gün 2'deki olaydan sonra yalnızca `.env.example` dosyası kontrol altına alınmıştı. Prompt günlükleri de aynı risk taşıyor. Tarama, depodaki her dosyayı kapsamalı ve hem parolayı hem sunucu adını aramalı (K7.5, K7.6).

### Bilinen sınırlar

- **G2. Oturum sunucu tarafında iptal edilemiyor.** Çerez imzalı ve 7 gün geçerli. Çıkış yalnızca tarayıcıdaki çerezi siliyor. Kopyalanmış bir çerez süresi dolana kadar çalışır. İleride parola değiştirme eklenirse eski oturumlar yine düşmez. Kod çözümü (kullanıcıya oturum sürüm numarası) şema değişikliği gerektirdiği için şimdilik yapılmadı.
- **G4. Kayıt formu e-postanın kayıtlı olduğunu söylüyor.** Giriş formu e-postanın kayıtlı olup olmadığını gizliyor (tek tip hata ve süre eşitleme). Kayıt formu ise "Bu e-posta adresiyle zaten bir hesap var" diyor. Düzgün çözüm e-posta doğrulaması gerektirir ve e-posta kapsam dışında (WON'T). Bilinçli olarak kabul edildi.
- **D3. Plan fiyat güncellemesi penceresi.** `planGuncelle` önce aktif abonelik sayıyor, ardından ayrı bir adımda güncelliyor. Fiyat değişikliğiyle aynı anda o plana abonelik başlatılırsa, abonelik eski fiyatı görerek başlayabilir. Tam çözüm satır kilidi (`SELECT ... FOR UPDATE`) gerektirir, bu da ham SQL demek ve ham SQL projede yasak. Pasife alma için daha önce kabul edilen pencerenin aynısı.

### İleride değerlendirilecekler

- **G1. Giriş deneme sınırı:** Gün 12 (güvenlik günü). Tek Render sunucusunda bellek içi sayaç, yeni paket olmadan.
- **D1. Abonelikte fiyat saklamak:** MRR grafiğinden önce karara bağlanacak. İki seçenek var:
  - abonelik başlarken aylık fiyatı saklayan bir sütun eklemek (şema değişikliği),
  - "geçmiş MRR planın bugünkü fiyatıyla hesaplanır" sınırını kabul etmek.
- **D4. Ay sınırı UTC mi Türkiye saati mi:** Dashboard gününde karara bağlanacak. Aynı karar dönem gösterimini ve "ay içinde iptal edenler" hesabını birlikte etkiler. Bugünkü durum: dönem hesabı UTC'ye göre. Ayın 29-31'inde Türkiye saatiyle 00:00-03:00 arasında başlayan aboneliklerde gösterilen dönem sonu 1 gün kayabilir.
- **O3 ve O5:** Şimdilik yapılmayacak. "Gün X" notlarının koddan temizlenmesi ve hata loglarına hata kodu eklenmesi.
- **Issue #24:** Firma tablosunun okuma işlemleri de aynı davranışı gösteriyor. Başka bir firma kimliği istense de sessizce kullanıcının kendi firmasını döndürüyor. Issue'ya not düşüldü, Ayarlar sayfasıyla birlikte ele alınacak.

## Gün 8 kararları (22 Ekim 2026): metrik hesaplama fonksiyonları

**Durum:** Kod tamamlandı (`src/lib/metrikler.ts`, `src/lib/metrikler.test.ts`).
**Sonuç:** `npm test` 37 test geçiyor (20 eski, 17 yeni). `npm run build`, `npm run lint`
temiz. Dashboard ekranı henüz yok, bu gün yalnızca hesap katmanı yazıldı.

### Kararlar

**K8.1: Hesap fonksiyonları saf fonksiyondur ve kiracı bilgisini hiç görmez**
- **Karar:** Fonksiyonlar veritabanına, oturuma ve `getTenantDb()` fonksiyonuna
  dokunmaz. Girdi olarak düz veri (fiyat, aralık, durum, başlangıç ve iptal tarihi)
  alırlar. `metrikler.ts` yalnızca `donem.ts` dosyasından bir tür içe aktarır.
- **Gerekçe:** Kiracı filtresi tek yerde, verinin okunduğu adımda uygulanır
  (`getTenantDb()`). Hesap katmanı kiracı bilgisini görmediği için izolasyonu
  bozamaz ve testleri veritabanı olmadan çalışır.
- **Dashboard günü için kural:** Abonelikler `getTenantDb()` ile okunacak, düz veriye
  çevrilip bu fonksiyonlara verilecek.

**K8.2: Test aracı `node --test`, yeni paket eklenmedi**
- **Gerekçe:** Gün 5 ve Gün 6 kararları geçerli ("ek paket yok", tek çözümleme
  kancası). Yeni test dosyası yalnızca `package.json` içindeki `test` betiğine eklendi.
- **Not:** Plan aşamasında yapay zekâ yine Vitest önerdi. Karar bu ADR'den
  hatırlatılarak düzeltildi (Gün 6'daki durumun tekrarı).

**K8.3: Churn müşteri bazlı hesaplanır**
- **Karar:** "Ay içinde iptal eden" = ay başında aktif olup ay sonunda hiç ACTIVE
  aboneliği kalmayan müşteri. Pay ve payda müşteri sayısıdır, abonelik sayısı değil.
- **Sonuçları:** Ay içinde gelip aynı ay giden müşteri sayılmaz (paydada yok). Aynı ay
  içinde iptal edip yeni abonelik başlatan müşteri (plan değişikliği) churn sayılmaz,
  çünkü müşteri kaybedilmemiştir.
- **Gerekçe:** Proje kuralındaki "ay içinde iptal edenler" ifadesi abonelik bazlı da
  okunabilirdi. Abonelik bazlı sayımda plan değişikliği churn'ü şişirir ve oran
  %100'ün üstüne çıkabilir. Bu bir yorum kararıdır, kuralın amacına uygundur.
- **Dashboard günü için açık nokta:** İçinde bulunulan yarım ay için mi, son tamamlanan
  ay için mi churn gösterileceği o gün kararlaştırılacak. Fonksiyon herhangi bir aralık
  alır.

**K8.4: Ay sınırları Türkiye saatine (UTC+3) göre hesaplanır (D4 kapandı)**
- **Gerekçe:** Veritabanı tarihleri UTC tutar. Türkiye'de yaz saati uygulaması yok,
  bu yüzden sabit +3 saat yeterli ve basittir. Aksi halde 1 Kasım 01:00 (TR) gibi bir
  iptal Ekim ayına yazılırdı.
- **Testler:** Test tarihleri `+03:00` ile yazıldı.
- **Ay geçişi:** Ay başı olarak ay başlangıcından 1 milisaniye önceki an kullanılır. Böylece ayın ilk günü 00:00 (TR) anında yapılan bir iptal yeni ayın churn değerine girer, hiçbir iptal iki aya birden ya da hiçbir aya yazılmaz.

**K8.5: Sıfıra bölme ve belirsiz durumlarda `null` döner, `0` ya da `Infinity` değil**
- **Gerekçe:** "LTV = 0 TL" yöneticiye "müşteri değersiz" mesajı verir, `Infinity`
  ekranda anlamsızdır ve JSON'a çevrilemez. `null` "hesaplanamadı" demektir.
- **İstisna:** Abonelik listesi boşken MRR `0` döner. MRR'nin 0 olması gerçek bir
  değerdir.
- **Zincirleme:** Churn hesaplanamazsa ömür, LTV ve LTV/CAC de hesaplanamaz. Özet
  fonksiyonu her `null` için ekranda gösterilebilecek bir neden metni verir.

**K8.6: Yuvarlama yalnızca iki çıktı fonksiyonunda yapılır (`metrikOzeti`, `mrrGecmisi`)**
- **Karar:** İç hesaplarda yuvarlama yok (yıllık 1.000 TL plan aylık 83,333... olarak
  taşınır). Para değerleri en yakın tam TL'ye, oranlar 2 ondalığa, ömür 1 ondalığa
  yuvarlanır.
- **Gerekçe:** Ara adımlarda yuvarlama hatayı biriktirir. Fiyatlar tam sayı TL kuralı
  (proje kuralları) yıllık planın aylığa bölünmesinde bozulur, bu yüzden toplam
  üzerinde bir kez yuvarlanır.

### Test kapsamı
Dersteki örnek iki biçimde sınanır: doğrudan formülle (ARPU 1.000, churn 0,04,
CAC 5.000 gibi değerlerle ömür 25, LTV 25.000, LTV/CAC 5) ve gerçekçi veriyle
(50 müşteri, 2 iptal, 2 yeni müşteri, MRR 50.000, churn %4). Ayrıca sıfıra bölme
durumları, tam sınır tarihleri, aynı müşterinin birden çok kaydı ve ay içinde
başlayıp biten müşteri sınanır.

### Bilinen sınırlar
- **Churn gösterim hassasiyeti:** Özet fonksiyonu churn değerini 2 ondalığa yuvarlar (0,04 = %4), yani ekranda tam yüzde görünür (örneğin %3,5 değeri %4 olur). LTV ve ömür yuvarlanmamış churn değerinden hesaplandığı için etkilenmez. Dashboard gününde gerekirse 4 ondalığa çıkarılacak.
- **Fiyat kopyası yok (D1):** Abonelik kaydı başlangıç fiyatını saklamıyorsa plan
  fiyatı değiştiğinde geçmiş MRR de değişir. Güncel MRR etkilenmez. Karar (abonelikte
  fiyat kopyası tutmak) aylık MRR grafiği gününde verilecek. Bu gün şemaya dokunulmadı.
- **Girdi doğrulaması yok:** Hesap fonksiyonları negatif fiyat gibi bozuk girdiyi
  kontrol etmez. Girdiler sunucuda doğrulanmış (Gün 4) kayıtlardan gelir.
- **Yenileme:** Hesap, yenilemenin başlangıç tarihini değiştirmediği varsayımına
  dayanır (`RENEWED` olayı yalnızca olay tablosuna yazılır).

### Süreç notu (Gün 7)
Gün 7'de altı commit dal açılıp PR olmadan doğrudan `main`'e itildi (yeni sohbet
"birleştir ve it" diye yönlendirmişti). Proje kuralı PR zorunluluğudur. İçerik
taramaları ve geçmiş taraması temiz çıktı. Bundan sonra her değişiklik dal ve PR ile
girecek.

### Geçmişte kalan eski adres (Gün 2)
Geçmiş taraması, Gün 2'ye ait iki eski commit'te (`.env.example` içinde gerçek adres)
eski veritabanı bilgisinin durduğunu gösterdi. Geçmiş yeniden yazılmadı. Gün 6'da
parola yenilendi, bu yenilemenin eski parolayı geçersiz kıldığı Gün 14'te Neon
panelinden bir kez daha doğrulanacak.

### Gün 9 ve sonrası için notlar
- Dashboard ekranı: metrikler `getTenantDb()` ile okunan veriden bu fonksiyonlarla
  hesaplanacak, `null` değerler neden metniyle gösterilecek.
- CAC değeri firma ayarlarından gelecek (issue #24 ile birlikte Ayarlar sayfası).

## Gün 9 kararları (22 Ekim 2026): KPI dashboard ve CAC ayarı

**Durum:** Kod tamamlandı ve `main`'e birleşti (squash commit `86bf98d`). Render'da yayında.
**Sonuç:** `npm test` 59 test, `npm run test:db` 44 test geçiyor; `npm run build` başarılı.
Dashboard ve Ayarlar ekranları Neon test dalında elle kontrol edildi (aşağıda "Elle test").

### Kararlar

**K9.1: Dashboard sayıları abonelik kayıtlarından hesaplanır, olay tablosundan değil**
- **Karar:** `src/lib/dashboard-verisi.ts` abonelikleri plan bilgisiyle birlikte `getTenantDb()`
  üzerinden okur, düz veriye çevirir ve Gün 8'deki `metrikOzeti` ile `ayHareketi`
  fonksiyonlarını çağırır. Sayfada ve bu dosyada formül yoktur.
- **Gerekçe:** Gün 8 fonksiyonları zaten `startedAt` ve `canceledAt` ile çalışır. Tek kaynak
  kullanmak, olay tablosu ile abonelik tablosunun birbirinden sapma riskini ortadan kaldırır.
  Kiracı filtresi tek yerde, okuma adımında uygulanır.

**K9.2: Churn 4 ondalıkla tutulur, ekranda yüzde olarak 1 ondalıkla gösterilir**
- **Karar:** `metrikOzeti` churn'ü 4 ondalığa yuvarlar (2/3 → 0,6667), ekranda `%66,7` görünür.
  Ömür, LTV ve LTV/CAC yuvarlanmış değerden değil HAM churn'den hesaplanır.
- **Gerekçe:** 2 ondalık olsaydı 0,67 → `%67,0` görünürdü; ekran ile elle hesap arasında fark çıkardı.
  Ekran biçimleri `src/lib/bicim.ts` içindedir (yerleşik `Intl`, ek paket yok).

**K9.3: Ay hareketi (yeni / iptal) müşteri bazlıdır ve churn ile aynı mantığı kullanır**
- **Karar:** `ayHareketi`: iptal = ay başında aktif olup ay sonunda hiç aktif aboneliği kalmayan
  müşteri (churn'ün payıyla birebir aynıdır). Yeni = ay başında aktif olmayıp ay sonunda aktif olan müşteri.
- **Sonuç:** Plan değiştiren müşteri ne yeni ne iptal sayılır. Ay içinde gelip giden müşteri de sayılmaz.

**K9.4: "Bu ay" Türkiye saatine göre, ay başından bugüne**
- **Karar:** `turkiyeAyi(an)` ayı UTC+3 farkıyla bulur ve `ayAraligi`'na verir.
- **Gerekçe:** Render sunucusu UTC çalışır; gece 00:00-03:00 arasında UTC hâlâ önceki aydadır.

**K9.5: CAC ayarı Ayarlar sayfasında, yalnızca manager, sunucuda doğrulanır**
- **Karar:** Form `src/app/(panel)/ayarlar/` altındadır. Asıl mantık `src/lib/cac-ayari.ts`
  içindeki `cacKaydetCekirdek` fonksiyonundadır (`pasife-alma.ts` ile aynı yapı: kullanıcı ve
  `db` parametre olarak verilir, testlerden doğrudan çağrılır). Sunucu işlemi yalnızca oturumu
  okur, çekirdeği çağırır ve sayfaları yeniler.
- **Kurallar:** Rol kontrolü sunucuda yapılır, finance hiçbir sorgu yapılmadan durdurulur.
  `tenantId` formdan alınmaz; hangi firmanın güncelleneceğini yalnızca `db` belirler.
  `tenant.ts` ayrıca Tenant güncellemesinde `id` koşulunu oturumdaki değerle ezer.
  CAC tam sayı TL olmalıdır, üst sınır 10.000.000. **0 = "CAC girilmedi"** anlamına gelir ve
  LTV/CAC hesaplanmaz.
- **Doğrulama:** Fiyat ve CAC ortak `tamSayiTlCoz` yardımcısını kullanır; fiyat hata mesajları
  değişmedi.

**K9.6: LTV/CAC etiketi 3 eşiğiyle ve simge + metin olarak gösterilir**
- **Karar:** 3 ve üzeri "Sağlıklı", altı "Dikkat" (`ltvCacSaglikliMi`). Karşılaştırma ekranda
  gösterilen (2 ondalıklı) değerle yapılır, böylece sayı ile etiket tutarlı kalır. Anlam yalnızca
  renge bırakılmaz: rozette simge ve metin vardır (yeni sarı ton).
- **CAC eksikse:** LTV hesaplandığı hâlde LTV/CAC yoksa neden "CAC girilmedi"dir. Manager'a
  Ayarlar bağlantısı gösterilir; finance'a "Firma yöneticisi Ayarlar'dan girebilir" yazılır.

**K9.7: Elle test yalnızca Neon test dalında, canlı veritabanı koruması ile**
- **Sorun:** `.env` canlı veritabanıdır. `npm run dev` canlı veriye bağlanır ve `next dev`,
  `.env.test`'te eksik olan değişkeni `.env`'den tamamlar.
- **Karar:** `npm run dev:test` uygulamayı `.env.test` ile başlatır, `npm run demo:veri -- <e-posta>`
  test dalındaki mevcut bir firmaya sahte demo verisini ekler. İkisi de başlamadan önce
  `src/test-destek/canli-koruma.ts` kontrolünü yapar: `TEST_VERITABANI=evet` olmalı ve
  `DATABASE_URL` canlı adresle AYNI Neon sunucusunu göstermemeli (havuzlu `-pooler` ve doğrudan
  adres aynı sunucu sayılır). Adres okunamazsa "izin ver" değil "durdur" denir. Hiçbir adres,
  parola veya sunucu adı ekrana yazılmaz.
- **Demo betiği:** Firma veya kullanıcı oluşturmaz, parola yazmaz, CAC'ye dokunmaz. Aboneliği olan
  firmaya hiçbir şey yazmaz (ikinci çalıştırma engellenir). Kayıtlar tek işlemde yazılır.
- **Not:** `canli-koruma.ts` onaylı planda yoktu; yeni sohbet ekledi, bu sohbette incelenip kabul edildi.

### Test kapsamı
- `bicim.test.ts` (4), `validation.test.ts` (7), `canli-koruma.test.ts` (2), `metrikler.test.ts`
  (Gün 9 senaryosu, churn yuvarlama, `ayHareketi`, `turkiyeAyi`, `ltvCacSaglikliMi`): `npm test`
- `cac-ayari.test.ts` (5: finance reddi, geçersiz girdiler, başarı, sıfırlama, kiracı bağımsızlığı) ve
  `dashboard-verisi.test.ts` (3: yalnızca kendi firmanın aboneliği, yeni/iptal sayımı, CAC firmaya özel): `npm run test:db`

### Elle test (Neon test dalı)
Senaryo: A aylık 1.000 TL kalıyor; B yıllık 12.000 TL ve C aylık 500 TL bu ay iptal; CAC 5.000.
- CAC girilmeden: MRR 1.000 TL, churn %66,7, LTV 1.500 TL (ARPU 1.000 TL × ömür 1,5 ay),
  LTV/CAC "—" ve "CAC girilmedi" bağlantısı, aktif 1 / yeni 0 / iptal 2.
- `12,5` yazınca alan hatası, kayıt yok. `5000` yazınca "CAC 5.000 TL olarak kaydedildi."
- CAC 5.000 sonrası LTV/CAC 0,3 ve sarı "! Dikkat (3'ün altında)".
- Demo betiği aynı firmada ikinci kez çalıştırılınca "Bu firmada zaten abonelik var" ile durdu.

### Bilinen sınırlar
- Finance rolü tarayıcıda elle denenmedi: Kullanıcılar sayfası henüz yer tutucu, finance kullanıcı
  eklenemiyor. Kural `cac-ayari.test.ts` ile otomatik test edilir.
- Ayın ilk günlerinde ay başında aktif müşteri olmayabilir; churn bu durumda "hesaplanamadı" gösterilir (null).
- Firmanın bütün abonelikleri belleğe okunur. Küçük firmalar için yeterlidir.
- Dashboard hesabı güncel plan fiyatını okur (fiyat kopyası yok, Gün 8 D1). Aylık MRR grafiği
  gününde (#7) karara bağlanacak.
- Arayüz için otomatik ekran testi yoktur; ekranlar elle kontrol edildi.
- Issue #24 (Tenant güncellemesinde başka kimlik verilince kendi firmaya uygulanması) çözülmedi;
  davranış `tenant.test.ts` ile belgelidir ve CAC formu bundan etkilenmez (kimlik formdan gelmez).
- pg SSL modu uyarısı Gün 12'de ele alınacak.

### Süreç notları
- Yeni sohbet `package.json` için tam dosya önerdi ve içine var olmayan `@tailwindcss/turbopack`
  bağımlılığını yazmıştı (Tailwind 4 `@tailwindcss/postcss` kullanır). Dosya reddedildi,
  yalnızca iki betik satırı (`dev:test`, `demo:veri`) ve test listeleri elle eklendi.
- Dosyalar terminalden boş oluşturuldu ve kod VS Code'a yapıştırıldı; uzun yapıştırmalar kesilmesin diye.