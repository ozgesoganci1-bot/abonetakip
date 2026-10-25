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

- **Render ücretsiz web servisi (25 Ekim 2026'da [Render dokümanından](https://render.com/docs/free) doğrulandı):** 15 dakika gelen trafik almazsa uyur, sonraki ilk istekte uyanması yaklaşık 1 dakika sürer. İnceleme öncesi siteyi açıp ısıt.
- **Neon ücretsiz veritabanı:** 5 dakika boşta kalınca durur, ücretsiz planda bu kapatılamaz ve birkaç yüz milisaniyede yeniden başlar (25 Ekim 2026'da [Neon dokümanından](https://neon.com/docs/introduction/scale-to-zero) doğrulandı). Süresiz olması ve depolama sınırı (0,5-1 GB) doğrulanmadı; bu proje için yeterli kabul edildi.
- **İki ayrı sağlayıcı:** Web uygulaması Render'da, veritabanı Neon'dadır. İki hesap ve iki ayrı panel yönetilir. Bağlantı adresleri yalnızca ortam değişkenlerinde tutulur: `DATABASE_URL` (havuzlu) ve `DIRECT_URL` (doğrudan). Render ve yerel `.env` içinde ayrı ayrı tanımlanır. Testler ve demo betikleri `.env.test` ile Neon test dalını kullanır (Gün 6).
- **Herkese açık depo:** Sızan bir secret herkes tarafından görülebilir. Her commit öncesi `.env` kontrolü yapılır, Gün 12'de repo ve geçmiş tarandı; sonuç "Gün 12 kararları" bölümünde (Secret taraması).
- **Kiracı izolasyonu kodun sorumluluğundadır** (3. hafta, slayt 23 ve 24). Bu yüzden merkezi filtre, iki firmalı test ve güvenlik gözden geçirmesi planlandı.
- **Hesaplama doğruluğu:** Metrikler dersteki basitleştirilmiş formüllerdir. Kâr marjı ve indirimler dahil değildir.
- **AI çıktısı doğrulaması:** Üretilen kod okunup anlaşılmadan projeye alınmaz (4. hafta, slayt 30).

## 5. Değişiklik geçmişi

| Tarih | Değişiklik | Neden |
|---|---|---|
| 18 Ekim 2026 | İlk sürüm | Proje başlangıcı |
| 18 Ekim 2026 |Veritabanı Render PostgreSQL yerine **Neon PostgreSQL** olarak değiştirildi | Render'ın ücretsiz veritabanı 30 günde sona eriyor, sunum tarihi belirsiz. Neon ücretsiz planı süresiz. Servis modeli (PaaS) ve barındırma kararı değişmedi. |
| 18 Ekim 2026 | Depo görünürlüğü herkese açık (public) yapıldı | Erişim kolaylığı. Secret güvenliği kuralları sıkılaştırıldı. |
| 24 Ekim 2026 | Gün 12 güvenlik gözden geçirmesi: giriş deneme sınırı, firma tablosu kimlik kuralı (issue #24), güvenlik başlıkları, `DATABASE_URL` için `sslmode=verify-full`, `fast-uri` güncellemesi; tetikleyici bilinçli olarak yapılmadı | Dokuz maddelik güvenlik kontrol listesi; ayrıntı ve bilinen sınırlar Gün 12 bölümünde |


**Not (25 Ekim 2026):** İlk üç satır, ADR'nin depoya ilk girdiği commit'te (`0e809a1`, 18 Ekim 2026) zaten
vardı. Bu satırların ayrı karar tarihleri kaydedilmediği için tarih olarak ADR'nin depoya girdiği gün yazıldı.
GitHub güvenlik kaydında deponun oluşturulma tarihi (`repo.create`) 18 Ekim 2026'dır, görünürlük değişikliği
(`repo.access`) kaydı yoktur.

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
- `package.json` için sohbet tam dosya önerdi. Ana sohbette bağımlılık listesi şüpheli bulundu, kontrolde gerçek dosyayla aynı çıktı. Yine de tam dosya yapıştırmak yerine yalnızca betik satırları (`dev:test`, `demo:veri`) ve test listeleri elle eklendi.
- Dosyalar terminalden boş oluşturuldu ve kod VS Code'a yapıştırıldı; uzun yapıştırmalar kesilmesin diye.
## Gün 10 kararları (24 Ekim 2026): SSE uyarıları ve riskli abonelik listesi

**Durum:** Kod tamamlandı ve birleşti (PR #35, squash commit `5f9a45e`), Render üzerinde yayında. Canlıda doğrulandı: oturumsuz istek 401 döner; oturumlu istek `text/event-stream` ile açık kalır, `retry: 5000` ve yaklaşık 25 saniyede bir `: nabiz` gelir. `x-accel-buffering` başlığı canlıda yanıtta görünmüyor (ara katman tüketiyor olabilir), akış tamponlanmıyor. Canlıda gerçek uyarı akışı (iptal, ardından bildirim) denenmedi, çünkü canlı veritabanına yazmayı gerektirirdi.
**Sonuç:** `npm test` 75 test, `npm run test:db` 48 test geçiyor; `npm run build` yerel sonucu o gün kaydedilmedi; birleşmeden sonraki Render dağıtımı (Auto-Deploy, `npm run build` dahil) 24 Ekim 2026 10:16'da başarıyla tamamlandı (Render Events).
Uyarılar ve riskli liste Neon test dalında elle kontrol edildi (aşağıda "Elle test").

### Kararlar

**K10.1: Bağlantılar sunucu belleğinde, firmaya göre gruplanarak tutulur**
- **Karar:** `src/lib/sse-hub.ts` "tenantId → açık bağlantılar" listesini bellekte tutar. Mesaj yalnızca
  verilen firmanın kümesine yazılır; başka firmanın bağlantısı o kümede olmadığı için mesajı alamaz.
  `tenantId` her zaman oturumdan gelir (`api/events/route.ts` ve `abonelikler/actions.ts`), istemciden asla.
  Hub tek örnek olarak `globalThis` üzerinde saklanır: geliştirme modunda yeniden yüklemede liste silinmez ve
  route ile sunucu işlemi aynı listeyi görür.
- **Gerekçe:** Uygulama Render'da tek Node süreci olarak çalışır; bağlantıların ve iptallerin hepsi aynı
  süreçten geçer. Harici servis (Redis, Pusher vb.) kapsam dışıdır (WON'T). Hub Next.js'e ve veritabanına
  bağlı değildir, bu yüzden `npm test` ile veritabanı olmadan test edilir.
- **Sınır:** İkinci bir sunucu süreci açılırsa birindeki iptali diğerindeki kullanıcılar duymaz. O durumda
  harici bir servis gerekir.

**K10.2: Firma başına en fazla 20 açık bağlantı; sınır dolunca YENİ bağlantı reddedilir**
- **Karar:** `FIRMA_BASINA_SINIR = 20`. Sınır doluysa uç nokta 429 döner, açık bağlantılara dokunulmaz.
  Sınır kontrolü ile listeye ekleme tek senkron adımdır; Node tek iş parçacıklı olduğu için iki istek araya giremez.
- **Gerekçe:** En eski bağlantıyı kapatmak döngü yaratırdı: kapatılan sekme kendiliğinden yeniden bağlanır ve
  başka bir sekmeyi düşürürdü. 429 alan tarayıcı yeniden denemeyi bırakır.
- **Sonuç:** 21. sekmede canlı uyarı gelmez, sayfanın geri kalanı normal çalışır. Bir firmanın dolu sınırı
  başka firmayı etkilemez.

**K10.3: SSE uç noktası API gibi davranır: 401, 403, 429; başlıklar ve nabız**
- **Karar:** `GET /api/events` oturumu `getCurrentUser()` ile okur (`requireUser()` kullanılmaz, çünkü o
  giriş sayfasına yönlendirir). Giriş yoksa 401, rol `manager` veya `finance` değilse 403, sınır doluysa 429.
  Başarılı yanıtın başlıkları: `Content-Type: text/event-stream; charset=utf-8`,
  `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`. Akışın ilk satırı `retry: 5000`'dir;
  her 25 saniyede bir boş nabız satırı gönderilir.
- **Temizlik:** Tarayıcı kapanması, isteğin iptal sinyali, yazma hatası ve ömür dolması tek `temizle()`
  fonksiyonuna çıkar (zamanlayıcılar durdurulur, bağlantı listeden silinir). Bir yol çalışmasa bile
  diğerleri belleği temizler.
- **Not:** `proxy.ts` ve `middleware.ts` yoktur; uç noktanın yanıtına araya giren bir katman yoktur.

**K10.4: Bağlantı azami ömrü 15 dakika, yalnızca `route.ts` içinde**
- **Karar:** Sunucu her bağlantıyı en geç 15 dakikada kapatır. Tarayıcı `retry` süresi (5 sn) sonra güncel
  çerezle yeniden bağlanır. `sse-hub.ts` ve testleri bu ömrü bilmez.
- **Gerekçe:** Oturum çerezi imzalıdır ama sunucuda tutulmaz; sunucu çıkışı bilemez. Ömür sınırı, çıkış
  yapmış ya da silinmiş kullanıcının bağlantısının en geç 15 dakikada 401 almasını sağlar.
- **Bedel:** Kapanma ile yeniden bağlanma arasındaki 5 saniyelik aralıkta yapılan iptalin canlı uyarısı
  kaçabilir (bkz. Bilinen sınırlar).

**K10.5: İptal uyarısı yalnızca iptal başarıyla yazıldıktan sonra gönderilir**
- **Karar:** `abonelikIptal` içinde, transaction başarılı olduktan sonra `sseHub.yayinla(kullanici.tenantId, ...)`
  çağrılır. Müşteri adı mevcut sorguya eklenir (`customer: { select: { name: true } }`), sorgu yine
  `getTenantDb()` üzerindendir.
- **Kurallar:** Çift tıklamada ikinci istek `updateMany` ile 0 satır etkiler ve fonksiyondan uyarı gönderilmeden
  çıkılır; yani uyarı iki kez gitmez. Hatada da uyarı gitmez. Uyarı gönderilemese bile iptal başarılı sayılır:
  yayın kendi `try/catch` bloğundadır, hata yutulur ve kullanıcıya gösterilmez.
- **Kapsam:** Uyarı iptali yapan kişinin kendi pencerelerine de gider. Yalnızca ilgili firmanın açık bağlantılarına ulaşır.

**K10.6: Uyarı bandı panelin her sayfasında görünür; çıkışta bağlantı kapanır**
- **Karar:** `UyariDinleyici` bileşeni `(panel)/layout.tsx` içindedir. Layout sayfa geçişlerinde yeniden
  çizilmediği için bağlantı sayfa değiştikçe kopmaz.
- **Çıkış:** Çıkış yapan kullanıcı `/giris` sayfasına gider. Bu sayfa `(panel)` layout'unun dışında olduğu için
  bileşen kaldırılır, `EventSource` kapatılır ve sunucudaki bağlantı listeden silinir.
- **Güvenlik:** Müşteri adı React ile metin olarak basılır, HTML olarak işlenmez. Sunucudan gelen veri
  doğrulanır; bozuk biçim sessizce yok sayılır. Ekranda en fazla 5 bant tutulur, en yenisi üstte.
- **Hata davranışı:** Uç nokta 401, 403 veya 429 dönerse `EventSource` yeniden denemeyi bırakır; bileşen
  hata göstermeden sessizce durur.

**K10.7: Riskli abonelik kuralı issue #6'dan gelir; süresi geçmiş ACTIVE kayıtlar da listededir**
- **Karar:** `src/lib/riskli-abonelikler.ts`: `status = ACTIVE` ve `currentPeriodEnd < şimdi + 7 gün`.
  Süresi geçmiş ama hâlâ ACTIVE olanlar bu tek koşula girer, ayrı koşul yazılmaz. Tam 7 gün kalmış abonelik
  "7 günden az" olmadığı için girmez. Eşik `RISK_GUN = 7` sabitidir, yalnızca bu dosyada tanımlıdır.
- **Yenileme ve iptal:** Yenileme `currentPeriodEnd`'i ileri taşıdığı için yenilenmiş abonelik listeye girmez.
  İptal edilmiş abonelik `status` koşuluna takılır.
- **Etiket:** `riskEtiketi(bitis, simdi)` saf fonksiyondur: geçmişse "Süresi geçmiş", 1 günden azsa
  "1 günden az kaldı", değilse "X gün kaldı" (milisaniye farkından hesaplanır, tam gün aşağı yuvarlanır).
- **Dashboard:** Liste `dashboardVerisiniGetir` içine konmadı; sayfada ayrı fonksiyon olarak `Promise.all`
  ile paralel çağrılır. `dashboard-verisi.ts` ve testi değişmedi. Liste sayfa açılışında hesaplanır, SSE
  yalnızca iptal olayını canlı iletir. Manager ve finance aynı listeyi görür.
- **Gösterim:** "Süresi geçmiş" kırmızı rozet ve `✕` simgesiyle, "X gün kaldı" sarı rozet ve `!` simgesiyle
  gösterilir; anlam yalnızca renge bırakılmaz. Liste bitişi en yakın olandan sıralıdır.

### Test kapsamı
- `sse-hub.test.ts` (11: firma ayrımı, aynı firmada iki bağlantı, ayrılma, boş firmanın silinmesi, bozuk
  bağlantı, çift ayrılma, sınır ile üç sınır senaryosu, varsayılan sınır 20, mesaj biçimi) ve
  `riskli-etiket.test.ts` (5: geçmiş, 1 günden az, 1 gün, 3 gün, 6 gün 23 saat): `npm test`
- `riskli-abonelikler.test.ts` (4: liste (dahil olanlar, dışarıda kalanlar ve 7 gün sınırı), etiket ve sıralama,
  A ve B ayrımı, ad alanları): `npm run test:db`
- Sabit "şimdi" yerine bir kez alınan gerçek saat kullanılır; her firmadaki 30 gün kalan kayıt kaymaz.

### Elle test (Neon test dalı)
Pencereler: A manager (Chrome), A finance (Chrome gizli), B manager (Safari), B finance (Safari özel).
- Aynı firmada iptal, uyarı A'nın iki penceresinde görünüyor mu: ayrıntılı sonuç kaydedilmedi.
- B pencerelerinde uyarı görünmüyor mu, ters yönde de: ayrıntılı sonuç kaydedilmedi.
- `events` isteği türü `eventsource`, üç başlık görünüyor mu: ayrıntılı sonuç kaydedilmedi.
- Çıkış yapılmış pencerede `/api/events` 401 mi: ayrıntılı sonuç kaydedilmedi.
- Sunucu yeniden başlatma ve "Offline" denemesinde hata ekranı çıkmadı mı, yeni uyarı ulaştı mı: ayrıntılı sonuç kaydedilmedi.
- Neon SQL Editor'de tek kaydın `currentPeriodEnd` değeri güncellenerek riskli liste ve "Süresi geçmiş" etiketi: ayrıntılı sonuç kaydedilmedi.

**Not (25 Ekim 2026):** Gün 10 sohbetinde bu adımlar için madde bazında sonuç yazılmadı. Geliştirici
yalnızca genel bir onay verdi ("her şey olması gerektiği gibi", 24 Ekim 2026 10:06). Yapay zekânın bu
onaydan sonra hazırladığı ayrıntılı sonuç taslağı geliştiricinin gözlemi olmadığı için kullanılmadı;
sonuçlar sonradan tahminle doldurulmadı.

### Bilinen sınırlar
- Tek sunucu süreci varsayılır (K10.1). İkinci instance açılırsa uyarılar yalnızca aynı süreçtekilere ulaşır.
- Render uykudayken ya da yeniden başlarken yapılan iptallerin canlı uyarısı kaybolur. İptal kaydı
  veritabanında durduğu için veri kaybı yoktur ve abonelik listesinde görünür. Açık bir SSE bağlantısının
  ücretsiz servisi uyanık tutup tutmadığı Render'da denenmedi.
- Her bağlantı 15 dakikada bir kapanıp yeniden bağlanır; kapanma ile bağlanma arasındaki aralıkta
  (`retry: 5000`, yaklaşık 5 saniye) yapılan iptalin canlı uyarısı kaçabilir. Uyarı gelmese bile iptal
  kaydedilir ve listede görünür.
- Kullanıcı başka bir sekmede çıkış yaparsa, açık kalan sekmenin bağlantısı en geç 15 dakika boyunca
  firmanın uyarılarını almaya devam eder. Kullanıcı silinirse ya da rolü değişirse de aynı süre geçerlidir.
  Neden: oturum çerezi sunucuda tutulmuyor, sunucu çıkışı bilemiyor.
- Firma başına 20 bağlantı sınırı dolunca ek sekmeler canlı uyarı almaz (K10.2).
- HTTP/1.1'de tarayıcı bir siteye en fazla 6 bağlantı açar; aynı tarayıcıda çok sekme açılırsa sayfalar
  takılabilir. Üretimde HTTP/2 kullanıldığı için beklenmez, geliştirmede dikkat edilmelidir.
- `abonelikIptal` sunucu işlemi `next/cache` kullandığı için mevcut test düzeninde doğrudan çağrılmıyor;
  yayının bağlanması elle testle doğrulanır. Hub'ın firma ayrımı otomatik testlidir.
- Arayüz için otomatik ekran testi yoktur. Next.js'in sıkıştırmasının `no-transform` başlığına uyup
  uymadığı elle testte uyarının gecikmesine bakılarak doğrulanır.

### Süreç notları
- `package.json` için tam dosya yerine yalnızca betik satırlarının sonuna dosya adı eklendi
  (`perl` ile, `git diff` ile doğrulandı).
- Dosyalar terminalden boş oluşturuldu, kod VS Code'a yapıştırıldı. Yapıştırmada bozulan girintiler
  commit öncesi `git diff` ile yakalandı ve düzeltildi.
- Commit'ler dört parçaya bölündü: (a) hub ve testi, (b) uç nokta, iptal yayını, dinleyici ve layout,
  (c) riskli abonelikler ve dashboard kartı, (d) bu ADR bölümü. Her commit öncesi üç tarama ve testler çalıştırıldı.
- Elle test yalnızca `npm run dev:test` ile Neon test dalında yapıldı; `npm run dev` kullanılmadı.
- Commit (a) trailer'ı Claude Opus 5.5, sonraki commit'ler Claude Sonnet 5.5 (sohbette model değişti).

## Gün 11 kararları (24 Ekim 2026): aylık MRR grafiği (Parça A)

**Durum:** Gün 11 iki parçaya bölündü (K11.6).
- Parça A (aylık MRR grafiği): birleşti, PR #37, squash commit `344b753`, canlıda doğrulandı.
- Parça B (boş durum, hata ve yüklenme ekranları, form mesajları): dal
  `gun11b-bos-hata-ekranlari`, beş commit (`c2cec85`, `1710934`, `c991cae`, `791e55e` ve bu
  ADR commit'i), tek PR.

**Sonuç:** Her iki parçada `npm test`, `npm run test:db`, `npm run lint`, `npm run build`
temiz. Test dalında elle sınandı (Parça A ve Parça B tabloları).

### Kararlar

**K11.1: Plan fiyatı ve aralığı, plana bağlı HERHANGİ bir abonelik varsa kilitlenir (D1 kapandı)**
- **Durum öncesi:** Abonelikte fiyat kopyası yoktur; geçmiş MRR planın bugünkü fiyatıyla
  hesaplanır (Gün 8, D1). Gün 8'deki kilit yalnızca **aktif** abonelik içindi. Bütün
  abonelikleri iptal edilmiş bir planın fiyatı değiştirilebiliyordu; o abonelikler geçmişte
  aktif olduğu için grafikte o aylar da değişirdi.
- **Değerlendirilen seçenekler:**
  - A. Abonelikte fiyat ve aralık kopyası (şema değişikliği ve migration): geçmiş her zaman
    doğru, ama 2 haftalık projede şema değişikliği riski ve kapsamı büyük.
  - B. Kilidi genişletmek (seçildi): aboneliği olan (iptal edilmişler dahil) planın fiyatı ve
    aralığı değiştirilemez. Fiyat değişikliği = yeni plan oluşturup eskisini pasife almak.
  - C. Kabul edip grafiğe not düşmek: grafik yanlış bilgi gösterebilir.
- **Gerekçe:** B şema değişikliği gerektirmez, geçmişi korur ve "kayıt silinmez, pasife
  alınır" kuralıyla uyumludur.
- **Uygulama:** `abonelik-kontrol.ts` içine `abonelikVarMi` eklendi (durum filtresi yok).
  `planGuncelle` (sunucu, asıl engel) ve plan detay sayfası (salt okunur alanlar) bu
  fonksiyonu kullanır. `aktifAbonelikVarMi` değişmedi; pasife almada doğru kural
  "aktif abonelik"tir. Ad değişikliği serbest.
- **Bilinen sınır:** Bu karardan önce yalnızca iptal edilmiş aboneliği olan bir planın fiyatı
  değiştirildiyse ilgili geçmiş aylar zaten etkilenmiş olabilir. Fiyat geçmişi tutulmadığı
  için geriye dönük tespit edilemez. Kontrol ile güncelleme iki adım olduğundan pasife
  almadaki "aynı anda gelen istek" penceresi burada da vardır (ham SQL yasağı, kabul edildi).

**K11.2: MRR kartı değiştirilmedi; grafiğin son noktasıyla eşitliği testle sabitlendi**
- **Fark:** Kart (`mrrHesapla`) `status = ACTIVE` olanları toplar. Grafik (`tarihtekiMrr`)
  `startedAt` ve `canceledAt` tarihlerine bakar.
- **Neden eşit:** Uygulamada `startedAt` başlatma anında sunucu saatiyle yazılır (gelecek
  tarih mümkün değil). İptalde `status` ve `canceledAt` aynı güncellemede yazılır.
- **Karar:** Kart, Gün 9 davranışını (ARPU ve aktif müşteri ile aynı kural) korumak için
  değiştirilmedi. `dashboard-verisi.ts` kart ve grafiği aynı abonelik listesi ve aynı
  `simdi` ile hesaplar. Eşitlik `metrikler.test.ts` (Gün 11 senaryosu) ve
  `dashboard-verisi.test.ts` içinde testle sabitlendi.
- **Dikkat:** Veritabanına uygulama dışından (elle SQL) `status` ile `canceledAt` birbirinden
  bağımsız yazılırsa eşitlik bozulabilir.

**K11.3: Ay sınırı için yeni fonksiyon yazılmadı; yalnızca `sonAylar` eklendi**
- Ay sınırı anları (`ayAraligi`, `ayinSonAni`) ve geçmiş MRR (`mrrGecmisi`) Gün 8'de yazılmış
  ve testliydi; aynen kullanıldı.
- `sonAylar(simdi, adet)` yeni: `turkiyeAyi` yalnızca bulunulan ayı verir; Ocak'tan önceki
  yılın Aralık ayına geçen bir liste yoktu. Her ay tek sıra numarasına çevrilip geriye
  sayılır, yıl geçişi ayrıca ele alınmaz. Testleri: yıl geçişi, gece 00:30 (TR), adet 1 ve 0.

**K11.4: Grafik paketsiz, sunucuda çizilen SVG (Server Component)**
- **Gerekçe:** 12 çubuk ve iki eksen için paket gerekmez; tarayıcıya JavaScript gitmez; hesap
  sunucuda kalır. Paket gerekseydi Recharts düşünülürdü, ama istemcide çalıştığı için
  önerilmedi.
- **Yapı:** Hesap gerektiren parçalar test edilebilsin diye `src/lib/mrr-grafigi.ts`
  içindedir (eksen üst sınırı: 1, 2, 2,5, 5, 10 katları, en az 100; özet cümle). Bileşen
  (`dashboard/MrrGrafigi.tsx`) yalnızca çizer.
- **Erişilebilirlik:** Her ayın SVG `<title>` etiketi fareyle değeri gösterir (MRR 0 olan
  ayda da). Ekran okuyucu grafiği özet cümleyle okur. Değerler açılır tabloda da verilir.
  "Bu ay" renkle birlikte eksen altındaki yazıyla belirtilir. Dar ekranda grafik yana
  kaydırılır.
- **Biçim:** Alt eksende kısa ay (`kisaAyEtiketi`: "Eki 26"); yıl `Intl`'e bırakılmadı,
  elle iki hane yazılır. İpucu, tablo ve özet cümlede uzun ay adı kullanılır. Özet cümlede
  ekler yalnızca "TL"ye gelir (ay adlarında ek uyumu yıla göre değişir).

**K11.5: Geçmiş tarihli demo verisi (`demo:gecmis`) ve ortak yardımcı**
- `donemleriIlerlet`, `demo-verisi.ts`'ten `src/test-destek/donem-ilerlet.ts`'e taşındı
  (içe aktarılınca betik çalıştığı için). `demo:veri`'nin davranışının değişmediği yeni
  bir test firmasında denendi: çıktı ve dashboard aynı, ikinci çalıştırma reddedildi.
- `demo:gecmis` aynı güvenceleri taşır (canlı koruması veritabanı yüklenmeden önce, var
  olan firmaya yazma, aboneliği olan firmada durma, tek işlem, tenant filtresi). Tarihler
  çalıştırıldığı aya göre kayar. Beklenen değerler kodla değil, elle hesaplanmış sabit
  listeyle ekrana yazılır.

**K11.6: Gün 11 iki PR'a bölündü**
- Parça A: grafik ve geçmiş MRR hesabı (bu bölüm). Parça B: boş durum, hata sayfaları
  (404, genel hata, yetkisiz), yüklenme ekranları ve form mesajları.
- **Gerekçe:** Küçük ve gözden geçirilebilir PR'lar; grafik ile hata ekranları birbirine
  bağlı değil.

### Elle sınama (test dalı)

| Durum | Sonuç |
|---|---|
| Kilit: yalnızca iptal edilmiş aboneliği olan plan | Fiyat ve aralık salt okunur, ad değiştirilebilir |
| Kilit: aboneliği olmayan yeni plan | Fiyat değiştirilebilir |
| Gün 9 demo firması | Eylül 2.500 TL, Ekim (bu ay) 1.000 TL = MRR kartı |
| Geçmiş MRR firması (`demo:gecmis`) | 12 ay elle hesaplanan listeyle aynı; Mayıs 2026 = 4.583 TL; Ekim 2.083 TL = MRR kartı |
| 12 aydan eski veri, yıllık plan, ay içinde iptal, ay sınırları | Beklenen aylara düştü (Nisan'da D yok, Ağustos'ta E var) |
| Kiracı ayrımı | Bir firmanın grafiğinde diğer firmanın verisi görünmedi |
| İpucu | MRR 0 olan ayda da değer gösterdi |
| Canlı koruması | `.env.test` olmadan betik veritabanına bağlanmadan durdu |

**Elle hesap (Mayıs 2026):** 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33 → 4.583 TL.

### Bilinen sınırlar
- K11.1'deki geriye dönük fiyat değişikliği sınırı.
- `dashboard-verisi.test.ts` MRR geçmişi testinde "şimdi" 1 dakika ileri alınır (saat farkı
  için). Test ayın son dakikasında çalışırsa kalabilir; yeniden çalıştırmak yeterli.
- Grafik her zaman son 12 ayı gösterir; dönem seçimi kapsam dışıdır.
- Terminaldeki modül türü ve SSL modu uyarıları önceki günlerden beri vardır; bu dalda
  dokunulmadı.

### Parça B için notlar
- Dashboard'un boş durumu Gün 9'da vardır; grafik hiç abonelik olmayan firmada çizilmez.
- Plan detay sayfası ve abonelik işlemleri "bulunamadı" için zaten `notFound()` ve
  `MESAJ.bulunamadi` kullanıyor; Parça B bunları ortak 404 ve mesaj bileşenleriyle
  tutarlı hâle getirecek.

### Parça B kararları: boş durum, hata ve yüklenme ekranları, form mesajları

**K11.7: 404 iki katmanlıdır; başka kiracının kaydı "bulunamadı"dır**
- **Panel içi:** Mevcut `src/app/(panel)/not-found.tsx` kullanıldı ("Kayıt bulunamadı").
  Geçersiz kimlik, var olmayan kayıt ve başka firmanın kaydı aynı ekranı alır; müşteri ve
  plan detay sayfaları zaten `notFound()` çağırıyordu, değişmedi. Yalnızca bağlantı metnindeki
  boşluk düzeltildi.
- **Kök:** Yeni `src/app/not-found.tsx`. Var olmayan adreslerde Next.js'in İngilizce sayfası
  yerine Türkçe "Sayfa bulunamadı". Oturum ve veri okumaz; ana sayfaya bağlantı verir.

**K11.8: Yetkisiz erişim sayfa içinde `YetkiYok` ile gösterilir**
- Ayarlar ve Kullanıcılar sayfaları rolü `requireManager()` ile **sunucuda ve sorgulardan
  önce** kontrol ediyordu; değişmedi. Finance kullanıcısında `getTenantDb()` hiç çalışmaz.
- `YetkiYok`'a "firma yöneticinize başvurun" cümlesi ve Dashboard bağlantısı eklendi.
- **Değerlendirilen:** Next.js `forbidden()` (deneysel ayar gerektiriyor) ve ayrı `/yetkisiz`
  sayfası (yeni rota ve yönlendirme). İkisi de kapsamı büyüttüğü için seçilmedi.
- **Bilinen sınır:** Yetkisiz sayfa HTTP 200 döner, 403 değil. Sunucu işlemleri (CAC kaydetme,
  pasife alma) kendi içinde ayrıca rol kontrolü yapar ve `MESAJ.yetkiYok` döner.

**K11.9: Genel hata ekranları ayrıntı göstermez**
- **Panel:** Yeni `src/app/(panel)/error.tsx`. Sol menü yerinde kalır; "Bir şeyler ters gitti",
  `MESAJ.beklenmeyen` ve varsa Next.js'in kısa hata kodu (digest) gösterilir. Hata mesajı ve
  yığın izi yazılmaz (adres, sorgu veya veri sızabilir). "Tekrar dene" önce sayfa verisini
  sunucudan yeniden ister (`router.refresh`), sonra ekranı sıfırlar (`reset`).
- **Kök:** Yeni `src/app/global-error.tsx`. Kök yerleşim çökerse görünür; kendi `<html lang="tr">`
  etiketi ve yalnızca satır içi stil (genel stiller yüklenmemiş olabilir), "Sayfayı yenile".
  Elle denenmedi (kök yerleşimi bilerek bozmak gerekir); derleme ve tür denetimiyle doğrulandı.

**K11.10: Panel için tek yüklenme ekranı; ölçülen durum kodu**
- Yeni `src/app/(panel)/loading.tsx`: başlık ve kart iskeleti, görünür "Yükleniyor…"
  (`role="status"`), hareket azaltma tercihine uyar. Sayfa başına ayrı dosya yok.
- **Ölçüm** (Chrome Network, belge isteğinin durum kodu):

| Adres | Ölçüm 1 (kod değişmeden) | Ölçüm 2 (`loading.tsx` ile) |
|---|---|---|
| Oturumsuz `/dashboard` | 307 → `/giris` 200 | 307 → `/giris` 200 |
| `/musteriler/abc` (geçersiz kimlik) | 404 | 200 |
| Başka kiracının plan adresi | 404 | 200 |
| `/olmayan-sayfa` | 404 (İngilizce) | 404 (Türkçe) |

- **Bilinen sınır:** `loading.tsx` sayfayı akışla gönderdiği için, panel içinde `notFound()`
  çağrılan sayfalar 404 ekranını gösterir ama yanıt kodu 200'dür. Var olmayan kayıt ile başka
  firmanın kaydı **aynı kodu ve aynı ekranı** aldığı için kaydın varlığı sızmaz. Panel sayfaları
  giriş gerektirdiği için arama motorlarına açık değildir.
- **Canlı doğrulama (Render, `e81971b`):** `/olmayan-sayfa` 404, oturum açıkken `/musteriler/abc` 200 döndü. Sonuçlar geliştirme ölçümüyle aynıdır.
- **Değerlendirilen:** `loading.tsx`'i yalnızca Dashboard ve Abonelikler'e koymak (detay
  sayfaları 404 kalırdı). Tutarlı yüklenme ekranı tercih edildi; sınır kabul edildi.

**K11.11: Boş durum başlıkları gerçeği söyler**
- Ortak `BosDurum` bileşeni zaten Dashboard, Müşteriler, Planlar ve Abonelikler'de vardı.
- Müşteriler ve Planlar: varsayılan görünümde (yalnızca aktifler) başlık "Henüz … yok" yerine
  "Aktif … yok" ve "Pasifleri göster" ipucu. Bütün kayıtları pasif olan firmada "henüz yok"
  yanlış bilgi veriyordu. Ek sorgu yok.
- Abonelikler: filtre seçiliyken "Bu filtrede abonelik yok".

**K11.12: Form mesajlarında yalnızca tutarsız olanlar değişti**

| Dosya | Değişti mi? | Neden |
|---|---|---|
| `IslemMesaji.tsx` | Evet | Başarıda ✓, hatada ! simgesi (`aria-hidden`); anlam yalnızca renge bırakılmaz |
| `abonelikler/BaslatFormu.tsx` | Evet | Seçim kutusu hataları ekran okuyucuya duyurulmuyor ve kutuya bağlı değildi; `PlanFormu` ile aynı yapı (`role="alert"`, `aria-describedby`). Metinler aynı |
| `(auth)/actions.ts`, `GirisFormu.tsx`, `KayitFormu.tsx` | Evet | Kendi mesaj türü ve kutusu vardı; tarayıcı doğrulaması açıktı (sunucunun Türkçe mesajı görünmüyordu); hatada e-posta siliniyordu. Ortak `FormDurumu`, `IslemMesaji` ve `noValidate`'e geçildi; e-posta (kayıtta firma adı ve ad soyad) korunur, **parola hiçbir zaman geri gönderilmez**. Mesaj metinleri ve doğrulama kuralları değişmedi |
| `MusteriFormu`, `PlanFormu`, `CacFormu`, iki `PasifeAlDugmesi`, `SatirIslemleri` | Hayır | Zaten ortak yapıda ve tutarlı |

**K11.13: Kök yerleşim Türkçe**
- `src/app/layout.tsx`: `lang="en"` → `lang="tr"`, sekme başlığı "Create Next App" →
  "AboneTakip", Türkçe açıklama. Ekran okuyucular Türkçe metni doğru dilde okur.

### Parça B elle sınama (test dalı)

| Durum | Sonuç |
|---|---|
| Boş hesap (yeni firma) | Dashboard, Müşteriler, Planlar, Abonelikler boş durumları doğru; Abonelikler "önce bir müşteri ve bir plan ekleyin" |
| Tek müşteri pasife alındı | Varsayılan görünümde "Aktif müşteri yok" ve ipucu; "Pasifleri göster" ile listede |
| Var olmayan adres | Türkçe kök 404 |
| Geçersiz kimlik ve başka kiracının kimliği | Aynı "Kayıt bulunamadı" ekranı ve aynı kod (K11.10) |
| Finance → Ayarlar, Kullanıcılar | `YetkiYok`; menüde iki sayfa yok; CAC görünmez |
| Yavaş bağlantı (Slow 4G) | Menü yerinde, yüklenme iskeleti |
| Wi-Fi kapalıyken sayfa geçişi | Türkçe hata ekranı, ayrıntı yok; Wi-Fi açılınca "Tekrar dene" çalıştı |
| Panel formları | Başarıda ✓, hatada !; abonelik formunda seçim kutusu hataları duyuruluyor |
| Giriş: yanlış parola, boş form | Türkçe mesaj, tarayıcı balonu yok, e-posta korunur, parola boş |
| Giriş: manager ve finance | İkisi de Dashboard'a düşer; rozet ve menü role göre doğru |
| Çıkış | Giriş sayfasına döner |
| Kayıt: kısa parola, bozuk e-posta, var olan e-posta | Sunucunun Türkçe mesajı; firma adı, ad soyad, e-posta korunur |
| Kayıt: yeni firma | Dashboard, rozet Yönetici, boş durum |

### Parça B bilinen sınırları ve notlar
- Yetkisiz sayfa ve `loading.tsx` sonrası panel 404'leri HTTP 200 döner (K11.8, K11.10).
- `global-error.tsx` elle denenmedi (K11.9).
- Yeni açılmış (hiç müşterisi olmayan) firmada da başlık "Aktif müşteri yok" görünür; ek sorgu
  yapmamak için kabul edildi.
- Fiyat biçimleme tekrarı: `planlar/page.tsx` (`tlBicimle`), `abonelikler/page.tsx` ve
  `BaslatFormu.tsx` (`toLocaleString`) `bicim.tlMetni` ile aynı işi yapıyor; ayrı bir
  temizlikte birleştirilecek.
- **Geliştirme notu:** `npm run dev:test` yeniden başlatılırken açık kalan panel sekmeleri
  kendini sürekli yenileyebilir. Sunucuyu yeniden başlatmadan önce `localhost:3000` sekmeleri
  kapatılır.
- Kullanıcılar sayfası hâlâ yer tutucu; finance denemeleri test dalında önceden açılmış finance
  kullanıcılarıyla yapıldı.

## Gün 12 kararları (24 Ekim 2026): güvenlik gözden geçirme

**Durum:** Gözden geçirme tamamlandı; bulgular düzeltildi ya da gerekçesiyle bilinen sınır olarak kapatıldı.
- PR #40 (squash commit `449afbb`): giriş deneme sınırı (B1). Test dalında elle ve canlıda doğrulandı.
- PR #41 (squash commit `8ade6c3`, başlık "fix: güvenlik gözden geçirme düzeltmeleri"): firma tablosu
  kimlik kuralı (B6, issue #24 kapandı), güvenlik başlıkları (B10), `npm audit fix` (B12). Dalda üç ayrı
  commit vardı. Test dalında elle ve canlıda doğrulandı.
- B8 yalnızca ortam değişkenlerinde yapıldı (`.env`, `.env.test`, Render); depoda değişiklik yok.

**Sonuç:** `npm test` 105 test, `npm run test:db` 57 test, hepsi geçiyor. `npm run lint` ve
`npm run build` temiz. `npm audit --omit=dev` 0 açık.

### Yöntem

Gözden geçirme dokuz maddelik kontrol listesiyle yapıldı: kiracı izolasyonu, yetki, kimlik doğrulama,
girdi doğrulama, secret yönetimi, SSE, hata mesajları, giriş denemesi, bağımlılıklar. Kod depodan okundu;
uygulamadaki bütün veritabanı sorguları (15 dosya) tek tek incelendi. Önce yalnızca bulgu raporu
çıkarıldı, düzeltmeler onaydan sonra parça parça yapıldı.

### Bulgu tablosu

| No | Madde | Bulgu | Risk | Karar |
|---|---|---|---|---|
| B1 | 8 | Giriş ve kayıtta deneme sınırı yok (Gün 7, G1) | Orta | Düzeltildi: giriş için (K12.1). Kayıt sınırı yok (K12.6) |
| B2 | 3 | Oturum çerezi çıkışta sunucuda iptal edilmiyor, 7 gün geçerli (Gün 7, G2) | Düşük | Bilinen sınır (K12.6) |
| B3 | 6 | Çıkış yapılan sekmenin SSE bağlantısı en fazla 15 dakika açık kalabiliyor | Düşük | Bilinen sınır (K12.6) |
| B4 | 6 | SSE hub tek süreçte, bellekte | Düşük | Bilinen sınır (K12.6) |
| B5 | 6 | SSE'de toplam bağlantı üst sınırı yok, yalnızca firma başına 20 | Düşük | Bilinen sınır (K12.6) |
| B6 | 1 | Firma tablosunda başka kimlik istenince sessizce kendi firma dönüyor (issue #24) | Düşük | Düzeltildi (K12.2) |
| B7 | 1 | Veritabanı düzeyinde "tenantId değiştirilemez" tetikleyicisi yok | Düşük | Bilinçli olarak yapılmadı (K12.7) |
| B8 | 5 | `pg` sürücüsünün `sslmode` uyarısı (ileride daha zayıf TLS davranışı) | Düşük | Düzeltildi (K12.4) |
| B9 | 5 | Gün 2 sızıntısı iki eski uzak dalda duruyor (parola yenilenmiş) | Düşük (kalan) | Bilinen sınır (K12.6) |
| B10 | 3 | Güvenlik başlıkları yok, `X-Powered-By` gönderiliyor | Düşük | Düzeltildi (K12.3) |
| B11 | 3 | Kayıt formu e-postanın kayıtlı olduğunu söylüyor (Gün 7, G4) | Düşük | Bilinen sınır (K12.6) |
| B12 | 9 | `fast-uri` 3.0.0–3.1.8 bilinen açık (dolaylı bağımlılık) | Düşük (npm audit: orta) | Düzeltildi (K12.5) |

Bulgu çıkmayan maddeler: yetki (rol kontrolleri sunucuda ve sorgulardan önce), girdi doğrulama (bütün
sunucu işlemleri `validation.ts` kullanıyor, URL kimlikleri ve sorgu parametreleri beyaz listeyle
kontrol ediliyor), hata mesajları (`catch` blokları sabit metin logluyor, hata ekranları yalnızca kısa
kod gösteriyor). Yüksek risk bulgusu çıkmadı.

### Kararlar

**K12.1: Giriş deneme sınırı, e-posta başına (B1)**
- **Karar:** Yeni `src/lib/giris-siniri.ts`. Aynı e-postaya 15 dakika içinde en fazla 5 deneme; 6.
  deneme ve sonrası 15 dakika reddedilir. Anahtar küçük harfe çevrilmiş e-postadır. Sayaç bellekte,
  tek örnek `globalThis` üzerinde (sse-hub.ts ile aynı yöntem). Yeni paket yok.
- **Sayma sırası:** Deneme, parola kontrolünden ÖNCE ve aynı senkron adımda sayılır. Böylece aynı anda
  gelen çok sayıda istek, bcrypt beklenirken sınırı aşamaz. Blok sırasında veritabanı sorgusu ve bcrypt
  hiç çalışmaz (işlemci de korunur). Blok sırasında doğru parola da reddedilir. Başarılı girişte sayaç
  silinir.
- **Cevap:** Sayaç e-postanın kayıtlı olup olmadığına bakmaz. Kayıtlı ve kayıtsız e-posta aynı sayıda
  denemeden sonra aynı mesajı alır ("Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar
  deneyin."); cevap e-postanın varlığını ele vermez. Bloktan önceki mesaj değişmedi.
- **Bellek:** Arka planda zamanlayıcı yok. Süresi dolmuş kayıt, o e-posta yeniden denendiğinde silinir.
  Liste 10.000 kayda ulaşınca önce süresi dolmuş kayıtlar, gerekirse en eski kayıtlar silinir.
- **IP başına sınır yok:** Render'ın `X-Forwarded-For` başlığını nasıl yazdığı resmi dokümanda yok;
  bulunabilen tek bilgi 2021 tarihli bir özellik isteğindeki çalışan cevabı ve istemcinin başlığı
  sahteleyebildiğine dair bir kullanıcı gözlemi. Canlı yanıtta Cloudflare başlıkları (`server: cloudflare`,
  `cf-ray`) görüldü, ama Cloudflare'in istemci IP başlıkları da Render dokümanında yok.
- **Kayıt sınırı yok:** E-posta başına sınır kayıtta anlamsız, IP güvenilir değil. Sunucu geneli bir kayıt
  sınırı (B seçeneği) gerçek kullanıcıları da durdurabileceği için seçilmedi (bkz. Bilinen sınırlar).

**K12.2: Firma tablosunda kimlik ezilmez, AND ile uygulanır (B6, issue #24)**
- **Karar:** `src/lib/tenant.ts` içinde yeni `firmaKosulu()`. Firma (Tenant) tablosunda `where` içinde
  bir `id` verilirse artık oturumdaki firma kimliğiyle ezilmez; ikisi `AND` içinde birlikte uygulanır.
  Başka firmanın kimliği istenirse sonuç veritabanının doğal "bulunamadı" cevabıdır: okumada `null`,
  boş liste ya da 0, `...OrThrow` ve `update`'te hata. Eskiden istek sessizce kullanıcının kendi
  firmasına uygulanıyordu (sızıntı yoktu ama yanıltıcıydı).
- **Nesne biçimli kimlik:** `{ in: [...] }`, `{ equals: ... }`, `{ not: ... }` de aynı kuralla
  `AND` içine girer. `{ in: [A, B] }` yalnızca A'yı, `{ not: A }` hiçbir kaydı bulmaz. Koşulda önceden
  `AND` varsa (tek nesne ya da liste) korunur.
- **Etkilenmeyen akışlar:** Uygulamadaki dört Firma tablosu çağrısı ya kimlik vermiyor ya da bir satır
  önce aynı filtreden okunan kendi kimliğini veriyor (`cac-ayari.ts`). Ham `prisma` kullanan iki çağrı
  (`auth.ts`) filtre dışında. Ayarlar sayfasında CAC kaydetme test dalında elle denendi.
- **Testler:** `tenant.test.ts` "Firma tablosu" bölümü: eski davranışı belgeleyen test yeni davranışa
  göre güncellendi; okuma, `...OrThrow`, kendi kimliğiyle güncelleme, nesne biçimli kimlik ve korunan
  `AND` için testler eklendi.

**K12.3: Güvenlik başlıkları (B10)**
- **Karar:** `next.config.ts` içinde `headers()` ile bütün yollara (`/:path*`) beş başlık:

| Başlık | Değer |
|---|---|
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` | `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

- **`X-Powered-By`:** `poweredByHeader: false` ile kapatıldı.
- **Tam CSP yok:** CSP'de bilerek yalnızca `frame-ancestors` var. Betik ve bağlantı kuralları Next.js'in
  satır içi betiklerini ve geliştirme modunun anında yenileme (HMR) bağlantısını bozabilir; nonce gibi ek
  iş ister. 2 haftalık kapsam için ağır bulundu.
- **HSTS yok:** Bilerek eklenmedi. Yanlış bir değer geri alınması zor bir tarayıcı kaydı bırakır. Canlı
  yanıtta Render'ın da `Strict-Transport-Security` göndermediği görüldü.
- **SSE ve HMR:** Eklenen başlıklar SSE yanıtının kendi `Content-Type` ve `Cache-Control` başlıklarıyla
  çakışmaz; elle denemede canlı uyarı bandı ve HMR çalıştı.
- **Test:** Yeni `src/test-destek/guvenlik-basliklari.test.ts` (`npm test`): `next.config.ts`'yi okur,
  beş başlığı, değerlerini, `poweredByHeader`'ı ve HSTS'in olmadığını denetler.

**K12.4: Veritabanı TLS: `DATABASE_URL` için `sslmode=verify-full` (B8)**
- **Karar:** `DATABASE_URL` üç yerde (`.env`, `.env.test`, Render ortam değişkenleri) `sslmode=require`
  yerine `sslmode=verify-full`. `channel_binding=require` değişmedi.
- **Gerekçe:** Uyarıyı uygulamanın kullandığı `pg` sürücüsü veriyor ve yalnızca `DATABASE_URL`'i
  kullanıyor (`src/lib/db.ts`). Bugünkü bağlantı zaten bu düzeyde doğrulanıyordu; değişiklik bunu açıkça
  yazıyor, böylece `pg` 9 sürümünde daha zayıf davranışa düşülmez. Neon dokümanı `verify-full`'u
  öneriyor; Neon'un sertifikası sistemin ve Node.js'in güvendiği bir kök sertifikaya dayanıyor.
- **`DIRECT_URL` değişmedi (`sslmode=require`):** Geçişler `DIRECT_URL` ile ve `pg`'den ayrı bir Prisma
  aracıyla çalışıyor (`prisma.config.ts`). Prisma 7 dokümanı PostgreSQL adresi için yalnızca `prefer`,
  `disable` ve `require` değerlerini listeliyor. Render build komutu yalnızca `npx prisma generate`;
  canlıda geçiş çalışmıyor ve `generate` veritabanına bağlanmıyor.
- **Doğrulama:** Adresler hiçbir komutla ekrana basılmadı; değişiklik `grep -c` ile sayarak ve yedekle
  `diff` satır sayısı karşılaştırılarak doğrulandı. Kurulu `pg-connection-string` 2.14.1 kodu uyarıyı
  yalnızca `verify-full` olmayan değerler için veriyor.

**K12.5: Bağımlılık açığı (B12)**
- **Karar:** `npm audit fix` (`--force` olmadan). Yalnızca `package-lock.json` değişti; `fast-uri`
  3.1.8 → 3.1.9. `ajv` ve başka hiçbir paketin sürümü değişmedi.
- **Bağlam:** Yol `prisma > @prisma/dev > @prisma/streams-local > ajv > fast-uri`; Prisma geliştirme
  aracı, web uygulamasının koduna girmiyor. `npm audit` "orta" dese de bu yüzden düşük derecelendirildi.
  Düzeltmeden sonra `npm audit --omit=dev` 0 açık.
- **Bağımlılık listesi:** 6 bağımlılık ve 10 geliştirme bağımlılığının hepsi kodda kullanılıyor ve
  `package-lock.json` içinde `registry.npmjs.org` adresinden geliyor.

**K12.6: Bilinen sınır olarak kabul edilenler**
- **B2, oturum iptali:** Çıkış yalnızca tarayıcıdaki çerezi siler; çerezin kopyası 7 gün geçerli kalır.
  Çerez `httpOnly`, `sameSite: lax`, üretimde `secure`; kodda XSS yolu bulunmadı. Sunucu tarafı iptal
  (kullanıcıda oturum sürümü sütunu) geçiş dosyası gerektirdiği için yapılmadı.
- **B3, SSE ve çıkış:** Başka sekmeden çıkış yapılınca açık sekme en fazla 15 dakika daha firmanın
  uyarılarını (müşteri adı) alır (K10.4). B2'ye bağlı.
- **B4, SSE tek süreç:** Render'da sunucu sayısı 1'de tutulur (K10.1).
- **B5, SSE toplam sınır:** Firma başına 20 bağlantı sınırı var, sunucu geneli sınır yok. Kayıt sınırı
  olmadığı için çok sayıda firma açılıp bağlantı tutulabilir.
- **B9, eski dallar:** Gün 2 sızıntısı `feat/gun-02-veri-modeli` ve `fix/env-yer-tutucu` uzak dallarında
  duruyor. Parola yenilendiği için adres bağlantıda kullanılamaz; kalan bilgi eski sunucu adıdır. Geçmişi
  yeniden yazmak gerekli görülmedi.
- **B11, kayıtta e-posta varlığı:** E-posta doğrulaması olmadan kapatmak kullanıcıyı şaşırtır. Giriş
  tarafı bunu gizliyor.
- **Kayıt sınırı:** K12.1.
- **Diğer tablolarda `tenantId` ezilmesi:** Customer, Plan, Subscription, SubscriptionEvent ve User
  tablolarında `where` içine yazılan `tenantId` hâlâ oturumdakiyle ezilir (K12.2'deki kural yalnızca
  Firma tablosunda). Sızıntı yok; uygulama kodunda `where` içinde `tenantId` hiç geçmiyor (tarandı).

**K12.7: Veritabanı tetikleyicisi bilinçli olarak yapılmadı (B7)**
- Gün 6'da "Gün 12, `tenantId` değiştirilemez tetikleyicisi" olarak planlanmıştı; Gün 12'de bilinçli
  olarak yapılmadı ve bilinen sınır olarak kapatıldı.
- **Gerekçe:** Uygulama içi koruma (`tenant.ts` beyaz listesi, `tenantId` ve `id` güncelleme yasağı,
  ilişki alanı yasağı) otomatik testlerle doğrulanmış durumda. Abonelik ve olay tabloları ayrıca bileşik
  anahtarlarla veritabanında korunuyor. Tetikleyici, canlı veritabanına elle yazılmış bir geçiş
  gerektirir; bunun riski (Prisma'nın sonraki geçişlerde tetikleyiciyi silmeye çalışması, canlıda geri
  alma) kalan faydadan büyük bulundu.
- **Sınır:** Müşteri, plan ve kullanıcı tablolarında veritabanı düzeyinde ikinci savunma hattı yok.

### Secret taraması (madde 5)

| Kontrol | Sonuç |
|---|---|
| Git geçmişinde adı `.env` içeren dosyalar | Yalnızca `.env.example` ve `.env.test.example` |
| `.env` ve `.env.test` | `.gitignore` içindeki `.env*` kuralıyla yok sayılıyor |
| GitHub "Go to file" ile `.env` araması | Yalnızca iki örnek dosya |
| Mevcut dosyalarda parola ve Neon sunucu adı taraması | Boş ve 0 |
| Git geçmişinde parola ve sunucu adı taraması | Yalnızca iki eski uzak dalda (B9); bugünkü canlı ve test parolaları geçmişte hiç geçmiyor |
| `main` dalı | Temiz |

### Önceki kayıtların durumu

| Kayıt | Durum |
|---|---|
| Gün 6, "İleride: Gün 12, tenantId değiştirilemez tetikleyicisi" | Bilinçli olarak yapılmadı (K12.7) |
| Gün 6, "İleride: SSL modu" | Kapandı (K12.4) |
| Gün 6, "Açık 2" ve issue #24 (Gün 9 ve 11 notları dahil) | Kapandı (K12.2) |
| Gün 7, G1 "Girişte deneme sınırı yok, Gün 12'ye ertelendi" | Kapandı (K12.1) |
| Gün 7, G2 ve G4 | Bilinen sınır olarak kaldı (K12.6, B2 ve B11) |
| Gün 4 ve 11, "pg sslmode uyarısı, Gün 12'de ele alınacak" | Kapandı (K12.4) |

### Test kapsamı

| Dosya | Komut | Ne denetler |
|---|---|---|
| `src/lib/giris-siniri.test.ts` (yeni) | `npm test` | 5 deneme ve blok, blok süresi, blokun uzamaması, pencerenin sıfırlanması, başarılı girişin sayacı silmesi, blok sırasında başarının bloğu kaldırmaması, e-postaların birbirinden ayrı olması, büyük/küçük harf, bellek temizliği ve üst sınır |
| `src/lib/giris.test.ts` (yeni) | `npm run test:db` | Kayıtlı ve kayıtsız e-postaya her denemede aynı cevap, 6. denemede blok mesajı, büyük harfle yazılan e-postanın aynı blokta kalması |
| `src/lib/tenant.test.ts` (güncellendi) | `npm run test:db` | K12.2 |
| `src/test-destek/guvenlik-basliklari.test.ts` (yeni) | `npm test` | K12.3 |

`giris.test.ts` başlamadan önce `canli-koruma.ts` ile test dalında olduğunu denetler.

### Elle test

| Durum | Ortam | Sonuç |
|---|---|---|
| Aynı e-postaya 5 yanlış, 6. deneme | Test dalı ve canlı | 5 kez "E-posta veya parola hatalı.", 6.'da blok mesajı |
| Blok sırasında doğru parola, büyük harfle e-posta | Test dalı | Blok mesajı |
| Kayıtsız e-postayla aynı deneme | Test dalı | Mesajlar ve sıraları aynı |
| Sunucu yeniden başlatılınca doğru parola | Test dalı | Giriş yapıldı (sayaç bellekte) |
| `/giris` ve `/api/events` (oturumsuz) başlıkları, `curl` | Yerel | Beş başlık var, `X-Powered-By` yok; `/api/events` 401 |
| `/giris` başlıkları, `curl` | Canlı | Beş başlık var, `X-Powered-By` yok, HSTS yok, 200 |
| Ayarlar'da CAC kaydetme | Test dalı | Kaydedildi, sayfa yenilenince değer kaldı, LTV/CAC hesaplandı |
| Abonelik iptali ve canlı uyarı bandı | Test dalı | Bant geldi (SSE çalışıyor) |
| Dosya kaydedince sayfanın yenilenmesi | Test dalı | Çalıştı (HMR) |
| `npm run test:db` sonrası `SECURITY WARNING` sayısı | Test dalı | 0 |
| `npm run dev:test` ve `npm run dev` ile giriş ve Dashboard | Test dalı ve canlı veritabanı (yalnızca okuma) | `SECURITY WARNING` yok |
| B8 sonrası Render günlüğü ve canlı site | Canlı | `SECURITY WARNING` yok, `/giris` 200 |

`npm run dev:test`'te uyarının çıkmaması, uygulamanın `.env.test` adresini (test dalını) kullandığını da
gösterdi: o sırada canlı `.env` hâlâ `sslmode=require` içeriyordu ve kullanılsaydı uyarı çıkardı.

### Bilinen sınırlar
- Giriş sayacı tek Render sürecinin belleğinde: sunucu yeniden başlarsa sıfırlanır, ikinci bir sunucu
  açılırsa her biri ayrı sayar.
- Başkası bir kullanıcının e-postasıyla 6 yanlış deneme yaparsa o kullanıcı 15 dakika giriş yapamaz.
- IP başına giriş sınırı ve kayıt sınırı yok (K12.1). Biri sürekli yeni e-postalarla bcrypt'i
  çalıştırabilir.
- Tam CSP ve HSTS yok (K12.3).
- `DIRECT_URL` `sslmode=require` ile kalıyor (K12.4).
- K12.6 ve K12.7'deki kabul edilen sınırlar.
- Terminaldeki `MODULE_TYPELESS_PACKAGE_JSON` uyarısına (`dev-test.ts`) dokunulmadı; `package.json`'a
  `"type": "module"` eklemek Next.js'in davranışını etkileyebilir.

### Süreç notları
- Gözden geçirme önce yalnızca rapor olarak yapıldı; her parça için plan, onay, sonra tek tek adımlar.
- `package.json`'da yalnızca test satırlarına dosya adı eklendi (`perl` ile, `git diff` ile
  doğrulandı). B12'de `package.json` değişseydi durulacaktı; değişmedi.
- Terminal'de Cmd+F araması ekranın bütün geçmişini taradığı için iki kez yanıltıcı sonuç verdi (eski bir
  uyarı satırı ve `Content-Security-Policy` satırı). Uyarı kontrolleri bundan sonra çıktıyı
  `grep -c "SECURITY WARNING"` ile sayarak ya da ekran Cmd+K ile temizlendikten sonra yapıldı.
- Uzun bir test dosyasının yapıştırmada kesildiğinden şüphelenildi; commit'teki dosya `git show` ile
  kontrol edildi ve tam çıktı. `wc -l` 454/455 farkı dosya sonundaki satır sonu karakterinden.
- Canlı `curl` denemesinde adres yapıştırılırken bozuldu; Render servis adı bir değişkene konarak
  çözüldü. Render adresi bu belgede yazılmaz.
- Commit ekleri: Claude Opus 5.5.

## Gün 13 kararları (25 Ekim 2026): demo verisi (seed), README ve belgeler

**Durum:** Seed ve README birleşti: PR #44 (main `3d485f3`). Dalda iki commit vardı: seed (`aebe2d5`) ve
README. `npm run seed:demo` test dalında iki kez çalıştırıldı (ilk kurulum ve yeniden kurulum, sayılar aynı,
kontrol özeti TAMAM). `npm run seed:demo:canli` canlıda çalıştırıldı: kontrol özeti TAMAM, iki demo kiracı
tarayıcıda doğrulandı. Belge güncellemeleri (bu bölüm, kurulum rehberi, Prompt Günlüğü, README'deki SSE
cümlesi) ayrı bir PR ile girdi.
**Sonuç:** `npm test` 191 test geçiyor (86'sı yeni demo senaryosu testi). `npx tsc --noEmit` temiz.
`npm run build` Gün 13 dalında başarılı. `kurallar.test.ts` değiştirilmedi ve geçiyor.

### Kararlar

**K13.1: Demo senaryosu saf bir dosyada hesaplanır ve tekrarlanabilir**
- **Karar:** `src/test-destek/demo-kurulum.ts` iki kiracının ("Mavi Yazılım", "Kuzey Teknoloji") verisini
  hesaplar, veritabanına dokunmaz. Rastgele seçimler sabit tohumlu küçük bir sayı üreteciyle yapılır (ek
  paket yok). Tarihler çalıştırma anına göre kaydırılır (`gecmis-mrr-verisi.ts` ile aynı yaklaşım).
- **İçerik:** Her kiracıda bir manager ve bir finance kullanıcısı, 3 plan (2 aylık, 1 yıllık) ve 18 müşteri
  vardır. Abonelikler son 12 aya yayılır: başlayanlar, yenilenenler, iptal edenler, iptal edip başka planla
  dönen bir müşteri ve 2 pasif müşteri. CAC: Mavi 4.000 TL, Kuzey 9.000 TL. Böylece biri "sağlıklı", öteki
  "Dikkat" gösterir.
- **Bilinçli seçimler:**
  - Bu ay en az bir iptal vardır: churn 0 olmaz, LTV ve LTV/CAC boş görünmez.
  - Dönem bitişine 1-6 gün kalan tam 3 riskli abonelik vardır. Diğer aboneliklerin dönem sonu en az 8 gün
    uzaktadır.
  - Son 12 ayın ortalama churn'ü %3-6 aralığındadır.
  - Ayın ilk 2 saatinde betik çalışmaz, çünkü bu ayın iptali ay içine sığmaz.
- **Test:** `demo-kurulum.test.ts` (`npm test`) senaryoyu yılın farklı anlarında üretip kontrol eder:
  - ay ortaları, ay sonları, yıl geçişi ve artık yıl denenir
  - gelecek tarihli kayıt yoktur
  - bir müşterinin aynı anda tek aktif aboneliği vardır
  - pasif müşterinin aktif aboneliği yoktur
  - churn aralığı tutar ve bu ay churn 0'dan büyüktür
  - tam 3 riskli abonelik vardır
  - aynı an için aynı veri üretilir
  - demo parolası kayıt formundaki parola kuralına uyar

**K13.2: Seed, ham Prisma istemcisini kendi bağlantısıyla kullanır (istisna)**
- **Karar:** `src/test-destek/seed-demo.ts` kendi `PrismaClient`'ını `@prisma/adapter-pg` ve `DATABASE_URL`
  ile kurar.
- **Neden:** `tenant.ts` firma oluşturmayı ve müşteri, plan, abonelik, olay silmeyi bilerek engeller. İlk
  plandaki `tenantaBagliDb` ile silme bu yüzden çalışmazdı. `tenant.ts`, `veri.ts`, `canli-koruma.ts` ve
  `db.ts` değiştirilmedi; korumaları zayıflatılmadı. `veri.ts` kullanılmadı, çünkü `TEST_VERITABANI=evet`
  ister ve canlı moda izin vermez.
- **Sınır:** Her silme yalnızca K13.3 ile doğrulanmış demo kiracının kimliğiyle, açık `where: { tenantId }`
  koşuluyla yapılır. Joker silme yoktur. Bu bir yönetici betiğidir: `tenantId` istemciden gelmez. İstisna,
  dosyanın başında yorumla yazılıdır.

**K13.3: Demo kiracı tanıma kuralı**
- **Karar:** İki koşul birlikte sağlanmalıdır:
  1. Firma adı birebir "Mavi Yazılım" ya da "Kuzey Teknoloji".
  2. Firmanın en az bir kullanıcısı var ve bütün kullanıcıları `@demo.example` uzantılı.
- **Durma durumları:** Betik o kiracıya dokunmadan durur:
  - aynı adla birden fazla firma varsa
  - adı tutan ama demo olmayan bir firma varsa
  - demo e-postalarından biri başka bir firmada kayıtlıysa
- **Neden şema değişikliği yok:** `.example`, belgeler için ayrılmış bir alan adıdır (RFC 2606) ve gerçek bir
  kişiye ait olamaz. Bu yüzden `isDemo` gibi bir sütun eklenmedi.
- **Yeniden kurulum:** Firma satırı korunur, kimliği değişmez; yalnızca CAC güncellenir. Kayıtlar olaylardan
  kullanıcılara doğru silinip yeniden yazılır. Her kiracı ayrı bir transaction içinde kurulur (zaman aşımı
  60 saniye).

**K13.4: Canlıya yazma iki adımlı onayla**
- `npm run seed:demo`: `.env.test` ile çalışır. Mevcut `canli-koruma.ts` kontrolü aynen uygulanır.
- `npm run seed:demo:canli`: `.env` ve `--canli` ile çalışır. Ek koşullar:
  - `TEST_VERITABANI=evet` yüklü olmamalı (yanlışlıkla `seed:demo -- --canli` yazılmasına karşı)
  - terminal etkileşimli olmalı
  - kullanıcı `evet` yazmalı
- Koşullardan biri eksikse ya da bilinmeyen bir seçenek verilmişse betik veritabanına bağlanmadan durur.

**K13.5: Kiracıların karışmadığını betiğin kendi kontrol özeti doğrular**
- Kurulumdan sonra kiracı başına sayılar ve dashboard'daki metrikler yazdırılır. Metrikler aynı
  `metrikler.ts` fonksiyonlarıyla hesaplanır.
- **Kiracılar arası kontrol:** Kayıtların sahibi tenant filtresi olmadan, yalnızca kimlikle okunur. Beş sayı
  tutulur:
  - başka kiracının müşterisine bağlı abonelik
  - başka kiracının planına bağlı abonelik
  - başka kiracının aboneliğine bağlı olay
  - demo olmayan firmalardaki `@demo.example` kullanıcısı
  - demo firmalardaki demo olmayan kullanıcı
- Hepsi 0 ise "TAMAM" yazar; değilse "HATA" yazar ve çıkış kodu 1 olur. Bileşik anahtarlar bu durumları
  veritabanında zaten engeller; kontrol ek bir güvencedir.
- Ekrana hiçbir adres yazılmaz; yalnızca sahte e-postalar ve sayılar görünür. Hata durumunda yalnızca Prisma
  hata kodu yazılır.

**K13.6: Ortak yazma mantığı ertelendi**
- `demo-verisi.ts` ve `gecmis-mrr-verisi.ts` içindeki tekrar eden yazma döngüsünün ortak bir dosyaya
  çıkarılması planlanmıştı. Bu iş Gün 14'e ya da sonraya ertelendi. Eski iki betiğe dokunulmadı. Seed yalnızca
  `donem-ilerlet.ts`'i onlarla paylaşır.
- **Neden:** Değişiklik eski betiklerde gerileme riski taşır ve elle karşılaştırma gerektirir.

**K13.7: README**
- **İçerik:** Kurulum, demo hesaplar, rol tablosu, metrik formülleri, mimari özet, test ve demo komutları,
  bilinen sınırlar. Demo parolası herkese açık README'dedir; bozulursa `seed:demo:canli` ile sıfırlanır.
- **Tarihe bağlı rakamlar:** Kesin rakam yazılmadı, yalnızca yaklaşık beklenti verildi.
- **Doğrulanan süreler:** Render uyku ve Neon uyanma süreleri 25 Ekim 2026'da resmi dokümandan doğrulanıp
  kaynağıyla yazıldı. Aynı bilgi Bölüm 4'e ve kurulum rehberine de işlendi.
- **Test dalı:** Neon'da canlı dalın kopyası olarak açılır; README'ye yeni bir komut eklenmedi.
- **İnceleme:** İnceleme için çalıştırılması gereken tek test komutu `npm test`'tir.

### Elle test

| Durum | Ortam | Sonuç |
|---|---|---|
| `seed:demo` ilk çalıştırma | Test dalı | İki kiracı ilk kez kuruldu, kontrol özeti TAMAM |
| `seed:demo` ikinci çalıştırma | Test dalı | Silinip yeniden kuruldu, sayılar aynı, TAMAM |
| Mavi ve Kuzey manager ile dashboard, finance hesabı | Test dalı | Beklendiği gibi |
| `seed:demo:canli`, `evet` onayı | Canlı | İki demo kiracı kuruldu, kontrol özeti TAMAM, tarayıcıda doğrulandı |

### Bilinen sınırlar
- **Tarihe bağlı veri:** Riskli liste yaklaşık 7 gün sonra boşalır. Yeni ayda henüz iptal yoksa churn 0 olur
  ve LTV "hesaplanamadı" görünür. Seed yeniden çalıştırılınca ikisi de düzelir.
- **Herkese açık demo hesaplar:** Veri bozulabilir ya da parola değiştirilebilir. Giriş sınırı nedeniyle bir
  hesap 15 dakika kilitlenebilir (K12.1).
- **Kiracılar ayrı transaction'larda:** Biri kurulup öteki durursa ilki yazılmış kalır. Betik bu durumu
  ekrana yazar.
- **Oturumlar:** Yeniden kurulumda demo kullanıcılar silinip yeniden yaratıldığı için açık oturumları
  geçersizleşir.
- **Tekrar eden kod:** Ortak yazma mantığının tekrarı sürüyor (K13.6).

### Süreç notları
- **Plan:** İki turda kesinleşti: (a)-(e) kararları ve dört ek istek (CAC, riskli abonelikler, bilinen
  sınırlar, kontrol özeti).
- **Doğrulama:** Seed, tarayıcıdan önce kendi kontrol özetiyle doğrulandı.
- **README düzeltmeleri:**
  - AI'nın önerdiği `npx dotenv` komutu çıkarıldı; `dotenv` paketinin terminal komutu yok.
  - Node sürüm ifadesi, doğrulanan ve doğrulanmayan kısım olarak ayrıldı.
  - "Sunumdan önce" yerine "İncelemeden önce" yazıldı.
  - Pasife alma iddiaları ADR ve koddan doğrulandı.
  - "İptal ve riskli abonelik uyarıları SSE ile gönderilir" cümlesi K10.7'ye göre düzeltildi: SSE yalnızca
    iptali iletir, riskli abonelikler dashboard'da liste olarak gösterilir.
- **Commit ekleri:** Claude Opus 5.5. Commit komutunda iki ek satır yapışık yazılmıştı; PR açıklamasında
  ekler yanlış yerdeydi. İkisi de düzeltildi.

  ## Gün 14 kararları (25 Ekim 2026): kullanıcı yönetimi

**Durum:** Gün 1 issue #1 (MUST: kayıt, giriş, roller) firma sahibinin çalışanlarını rol ile ekleyebilmesini
istiyordu, ancak Kullanıcılar sayfası o güne kadar yer tutucuydu. Gün 6, Gün 9 ve Gün 11 bölümlerindeki
"yer tutucu" ifadeleri o günlerin durumudur, değiştirilmedi. Gün 14'te sayfa dolduruldu. Değişiklik
`gun14-kullanici-yonetimi` dalında, tek PR ile girer.
**Sonuç:** `npm test` 197 test (6 yeni), `npm run test:db` 64 test (7 yeni) geçiyor, kalan 0.
`npx tsc --noEmit` ve `npm run lint` temiz, `npm run build` başarılı (`/kullanicilar` dinamik rota).
Şema değişikliği ve yeni paket yok.

### Kararlar

**K14.1: Yalnızca finans kullanıcısı eklenir**
- **Karar:** Manager, Kullanıcılar sayfasında firmasının kullanıcılarını (ad soyad, e-posta, rol, eklenme
  tarihi) görür ve yeni kullanıcı ekler. Eklenen kullanıcının rolü her zaman `finance`'tır. Formda rol alanı
  yoktur, rolü sunucu yazar; formdan yalnızca ad soyad, e-posta ve parola okunur.
- **Neden:** Silme ve rol değiştirme kapsam dışı olduğu için yanlışlıkla eklenen bir manager geri alınamazdı.
  Firmanın tek manager'ı kayıt olan kişidir.
- **Yetki:** Sayfa `requireManager()` ile korunur, finance "yetkiniz yok" ekranını görür. Ekleme işlemi rolü
  sunucuda ayrıca kontrol eder (`kullaniciEkleCekirdek`); sayfayı gizlemek yetki sayılmaz.
- **Oturum:** Yeni kullanıcı için oturum açılmaz, manager kendi oturumunda kalır.

**K14.2: E-posta benzersizliği veritabanı kısıtıyla sağlanır**
- Kullanıcı e-postası bütün sistemde benzersizdir (`email @unique`). Müşteri e-postasından farklı olarak firma
  bazında değildir (Gün 4).
- Önceden arama yapılmaz: `getTenantDb()` aramaya kendi firmanın filtresini eklediği için başka firmadaki
  kaydı görmezdi. Ekleme denenir, tekrar eden kayıt hatası (P2002) `tekrarEdenKayitMi()` ile yakalanır ve
  kayıt formundaki mesaj ("Bu e-posta adresiyle zaten bir hesap var.") e-posta alanında gösterilir.
- E-posta kayıttaki gibi hazırlanır: kırpılır ve küçük harfe çevrilir (`epostaDogrula`).

**K14.3: Girdi ve parola kuralları kayıtla aynı**
- `kullaniciGirdisiniDogrula()` (`validation.ts`) kayıttaki kuralları kullanır: ad soyad 2-100 karakter,
  parola en az 8 karakter ve en çok 72 bayt. Kayıttan farkı, müşteri formu gibi bütün alan hatalarını
  birlikte döndürmesidir.
- Parola `auth.ts` içindeki yeni `parolaOzetle()` ile bcrypt'le özetlenir. Kayıt da artık aynı fonksiyonu
  kullanır, bcrypt maliyeti tek yerde kalır. Kayıt akışının davranışı değişmedi (`giris.test.ts` ve elle
  test).
- Parola hata durumunda forma geri gönderilmez ve loglanmaz. Beklenmeyen hatada log satırı sabit bir metindir.

**K14.4: Mevcut yapıya uyuldu**
- `tenant.ts` ve şema değişmedi. User tablosuna ekleme, kiracı filtresinin yazma beyaz listesinden geçer;
  `tenantId` oturumdaki değerle ezilir.
- Çekirdek ve test deseni `cac-ayari.ts` ile aynıdır: `src/lib/kullanici-yonetimi.ts`
  (`kullanicilariListele`, `kullaniciEkleCekirdek`). Sunucu işlemi yalnızca oturumu okur. Liste parola
  özetini hiç seçmez.
- Eklenme tarihi `bicim.ts` içindeki yeni `tarihMetni()` ile Türkiye saatine göre gösterilir (Render
  sunucusu UTC'de çalışır).
- `package.json`'da yalnızca `test:db` listesine yeni test dosyası eklendi.

**K14.5: Test kapsamı**
- `npm test`: `validation.test.ts` (5 yeni) ve `bicim.test.ts` (1 yeni).
- `npm run test:db`: `kullanici-yonetimi.test.ts` (7 test)
  - finance kullanıcı ekleyemez
  - geçersiz girdi alan hatası verir, parola geri dönmez
  - başarılı eklemede rol finance, firma A, e-posta küçük harf, parola bcrypt özeti
  - yeni kullanıcı A'nın listesinde görünür, B'ninkinde görünmez; listede parola özeti yoktur
  - aynı firmadaki ve başka firmadaki e-posta aynı mesajla reddedilir
  - firmayı kullanıcı nesnesindeki `tenantId` değil, `db` belirler

### Elle test
Test dalında, iki yeni firma ve sahte `@example.com` hesaplarıyla 13 adımın hepsi beklenen sonucu verdi.

### Bilinen sınırlar
- **Kapsam dışı:** Davet e-postası (e-posta bildirimi WON'T), parola sıfırlama, kullanıcı silme, rol
  değiştirme, pasife alma.
- **Parola:** Parolayı yalnızca yönetici belirler ve kullanıcıya kendisi iletir. Parola değiştirme akışı
  yoktur.
- **İkinci yönetici yok:** Firmaya manager eklenemez (K14.1).
- **Üst sınır yok:** Kullanıcı sayısı için üst sınır, ekleme işlemi için hız sınırı yoktur (kayıt sınırı
  olmamasıyla aynı, Gün 12).
- **B11 kullanıcı eklemede de geçerli:** Mesaj, e-postanın başka bir firmada kayıtlı olduğunu belli eder.
  Kayıt formu aynı bilgiyi zaten verdiği için belirsiz bir mesaj sızıntıyı kapatmazdı, yöneticiyi yanıltırdı.
- **Demo firmaya demo olmayan kullanıcı:** Canlı demo hesaplar herkese açıktır. Biri demo firmaya
  `@demo.example` dışında bir e-postayla kullanıcı eklerse seed o firmayı demo saymaz ve dokunmadan durur
  (K13.3: bütün kullanıcılar `@demo.example` olmalı). Arayüzde silme olmadığı için eklenen kullanıcı Neon'da
  e-posta ve tarih şartıyla silinir, ardından `seed:demo:canli` çalıştırılır. README'de denerken
  `@demo.example` kullanılması rica edildi.

### Süreç notları
- **Plan:** Gün 14 şablonu sunum hazırlığı istiyordu. Proje sunumsuz, depo, belgeler ve canlı uygulama
  üzerinden incelendiği için sunum akışı yerine README'ye kısa bir "İnceleme için" bölümü eklendi. Kullanıcı
  yönetimi temizlik işlerinden önce yapıldı.
- **Önce mevcut dosyalar:** E-posta kuralı ve User tablosundaki yazma kuralları tahmin edilmedi. `tenant.ts`,
  `auth.ts`, kayıt akışı, şema ve ayarlar sayfası gösterildikten sonra plan kesinleşti. Her parçadan sonra
  testler çalıştırıldı.
- **Neon test dalı temizliği:** Elle test hesapları test dalından silindi. Test dalında önceki günlerden
  (22 Ekim) kalma elle test kayıtları ve aynı adlı eski bir firma vardır, bilerek silinmedi. AI'nın önerdiği
  temizlik sorgusu ad desenine bağlıydı ve bu eski kayıtları da silerdi. Sorgu tam e-posta adreslerine ve
  `createdAt >= 2026-10-25` şartına bağlanarak çalıştırıldı: 3 kullanıcı ve 2 firma silindi, son kontrol
  0 / 0 / 1 (eski firma yerinde).
- **Dal kontrolü:** Neon SQL Editor ilk açılışta canlı dalda (Default) açıktı. Orada yalnızca bir SELECT
  çalıştı (0 satır), hemen test dalına geçildi. Silme sorgularından önce dal seçicisi kontrol edilir.
- **Test sayısı:** AI `test:db` için 65 test bekledi. Dosyada 7 test vardır, doğrusu 64.