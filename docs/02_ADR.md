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