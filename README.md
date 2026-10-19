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
_Henüz yayında değil._

## Rol ve yetkiler

| Yetki | manager | finance |
|---|---|---|
| Dashboard görüntüleme | ✅ | ✅ |
| Müşteri, plan ve abonelik kayıtları (ekleme, düzenleme) | ✅ | ✅ |
| Müşteri ve plan pasife alma | ✅ | ❌ |
| Ayarlar (CAC dahil) | ✅ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ |

Rol kontrolü sunucu tarafında yapılır. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez.

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