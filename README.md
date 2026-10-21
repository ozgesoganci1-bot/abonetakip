# AboneTakip

## Proje özeti
AboneTakip, küçük yazılım firmaları için çok kiracılı (multi-tenant) bir abonelik takip SaaS'ıdır. Firmalar müşterilerini, planlarını ve aboneliklerini yönetir; MRR, churn, LTV ve LTV/CAC metriklerini tek bir dashboardda izler. Her firma yalnızca kendi verisini görür.

Sunucu Tabanlı Programlama dersi dönem projesidir (tek geliştirici, 2 hafta).

## Teknoloji
- Next.js (App Router) ve TypeScript
- PostgreSQL (Neon) ve Prisma
- Barındırma: Render (PaaS), sürekli açık Node sunucusu
- Gerçek zamanlı uyarılar: Server-Sent Events (SSE)

## Kurulum
_Bu bölüm Gün 13'te doldurulacak._

## Canlı adres
https://abonetakip.onrender.com/

Not: Ücretsiz planda site 15 dakika kullanılmayınca uyur, ilk açılış yaklaşık 1 dakika sürebilir.

## Veritabanı geçişi
Prisma geçişleri (`npx prisma migrate dev`) Render'da değil, geliştiricinin kendi bilgisayarında çalıştırılır. Render derlemesi yalnızca `npx prisma generate` ve `npm run build` yapar. Bağlantı adresleri `DATABASE_URL` (havuzlu) ve `DIRECT_URL` (doğrudan) ortam değişkenlerinden okunur. Gerçek değerler repoda yer almaz, örnek için `.env.example` dosyasına bakın.

## Rol ve yetkiler

| Yetki | manager | finance |
|---|---|---|
| Dashboard görüntüleme | ✅ | ✅ |
| Müşteri, plan ve abonelik kayıtları (ekleme, düzenleme) | ✅ | ✅ |
| Müşteri ve plan pasife alma | ✅ | ❌ |
| Ayarlar (CAC dahil) | ✅ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ |

Rol kontrolü sunucu tarafında yapılır. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez.

## Giriş, kayıt ve oturum
- Kayıt: `/kayit` sayfasında firma ve ilk kullanıcı (yönetici) birlikte oluşturulur. Giriş: `/giris`. Oturumsuz kullanıcı panel sayfalarında otomatik olarak `/giris` sayfasına yönlendirilir.
- Oturum, imzalı ve httpOnly bir çerezde tutulur. Parolalar bcrypt ile özetlenir, düz metin saklanmaz.
- Panel sayfaları: Dashboard, Müşteriler, Planlar, Abonelikler (tüm rollere açık). Ayarlar ve Kullanıcılar yalnızca yöneticiye açıktır, finans kullanıcısı "Bu sayfaya erişim yetkiniz yok" mesajını görür. Sayfa içerikleri sonraki günlerde doldurulacak.
- Yerelde çalıştırmak için `.env` dosyasında üç değişken gerekir: `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`. Örnek için `.env.example` dosyasına bak. Gerçek değerler asla depoya yazılmaz.
- `SESSION_SECRET` için rastgele bir değer üretmek: `openssl rand -base64 32`. Üretilen değeri yalnızca `.env` dosyasına ve Render'daki ortam değişkenine koy.

## Müşteri ve plan yönetimi
- **Müşteriler** (`/musteriler`): ekleme, düzenleme ve pasife alma. E-posta isteğe bağlıdır. Doluysa firma içinde benzersizdir (pasif müşteriler dahil), başka firmada aynı e-posta olması sorun değildir.
- **Planlar** (`/planlar`): ad, aylık ya da yıllık aralık ve fiyat (tam sayı TL). Aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez.
- **Pasife alma:** kayıtlar silinmez. Yalnızca `manager` pasife alabilir. Aktif aboneliği olan müşteri ya da plan pasife alınamaz. Pasife alınan kayıt yeniden aktifleştirilemez.
- **Yetki:** `manager` ve `finance` müşteri ile plan ekleyip düzenleyebilir. Kontroller sunucuda yapılır.
- **Kiracı izolasyonu:** başka firmanın kaydına erişim denemesi "Kayıt bulunamadı" yanıtı verir.

## Kapsam (MoSCoW)
- **MUST:** kayıt, giriş ve roller; müşteri ve plan yönetimi; abonelik yaşam döngüsü; KPI dashboard; kiracı izolasyonu
- **SHOULD:** SSE ile iptal uyarısı, aylık MRR grafiği
- **WON'T:** ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi, mikroservis

## Dokümanlar
- [Proje önerisi](docs/01_Proje_Onerisi.md)
- [Mimari Karar Kaydı (ADR)](docs/02_ADR.md)
- [Prompt Günlüğü](docs/03_Prompt_Gunlugu.md)
- [14 günlük prompt planı](docs/04_14_Gunluk_Prompt_Plani.md)
- [Kurulum rehberi](docs/00_Kurulum_Rehberi.md)
- [AI talimat dosyası](CLAUDE.md) 