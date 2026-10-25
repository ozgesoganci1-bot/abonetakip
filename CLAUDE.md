# AboneTakip proje kuralları

> Bu dosya projenin AI talimat dosyasıdır (4. hafta, slayt 24). ADR'deki kararların AI'nın anlayacağı hâlidir.
> **Konum:** Proje kökünde `CLAUDE.md` olarak durur (hocanın istediği teslim: AI talimat dosyası). Claude sohbet arayüzü repodaki dosyaları kendiliğinden okumaz. Bu yüzden içeriği Claude **Project talimatlarına** (Project instructions) yapıştır ya da her yeni sohbetin ilk mesajı olarak gönder.
> Başka bir araca geçersen içerik aynı kalır, yalnızca dosya adı değişir (GitHub Copilot: `.github/copilot-instructions.md`, Cursor: `.cursor/rules`).

## Proje
- Ad: AboneTakip. Küçük yazılım firmaları için çok kiracılı abonelik, MRR ve churn takip SaaS'ı.
- Tek geliştirici, 2 hafta süre. GitHub ile entegre. Kapsam dışına çıkma.
- Geliştirici kod bilmeyen bir YBS öğrencisidir. Bu yüzden:
  - Açıklamaları Türkçe, sade ve adım adım yap.
  - Her dosya için tam dosya yolunu yaz ve "yeni dosya oluştur" ya da "dosyanın içeriğini tamamen şununla değiştir" diye açıkça söyle.
  - Terminal komutlarını tek tek ver, her birinin ne işe yaradığını bir cümleyle söyle.
  - Kodu parça parça değil, çalışır tam dosya olarak ver.
  - Kod yorumları Türkçe olsun.
- Geliştirme ortamı: MacBook Air M4 (macOS, Apple Silicon). Komutları macOS Terminal (zsh) için ver. Windows komutları verme. Kısayolları Mac tuşlarıyla yaz (Cmd, Option).

## Teknoloji
- Next.js (App Router), TypeScript, PostgreSQL, Prisma. Tek uygulama, tek veritabanı.
- Barındırma: Render (PaaS), sürekli açık Node sunucusu. Serverless ve edge kullanma.
- Veritabanı: Neon (PostgreSQL). Bağlantı adresi yalnızca `DATABASE_URL` ortam değişkeninden okunur. Neon'da doğrudan (direct) ve havuzlu (pooled) bağlantı adresi ayrımı vardır, Prisma geçişlerinde (migration) hangisinin gerektiğini sürüme göre kontrol et ve emin değilsen söyle.
- GitHub deposu herkese açıktır (public). Repoya hiçbir secret, gerçek kişi verisi veya `.env` içeriği girmemeli.
- Mikroservis, micro frontend, ek katman ve gereksiz kütüphane ekleme.
- Yeni bir paket eklemeden önce neden gerektiğini yaz. Var olduğundan emin olmadığın paketi önerme.
- Kullanılan Next.js ve Prisma sürümünü `package.json` dosyasından kontrol et. Sürüme uygun sözdizimi kullan, emin değilsen açıkça söyle.

## Kiracı (tenant) izolasyonu
- TENANTS dışındaki her tabloda `tenantId` zorunlu.
- Her sorgu aktif kullanıcının `tenantId` değeriyle filtrelenir.
- Tenant filtresi tek bir merkezi yardımcı fonksiyondan uygulanır. Sorgularda elle tekrar yazılmaz.
- `tenantId` hiçbir zaman istemciden (form, URL, istek gövdesi) alınmaz. Yalnızca oturumdan okunur.
- Bir firmanın kullanıcısı başka firmanın verisine hiçbir koşulda erişemez. Başka kiracının kaydına erişim denemesinde "bulunamadı" döndür.

## Roller
- `manager` (firma sahibi): dashboard, ayarlar (CAC dahil), kullanıcı yönetimi, tüm kayıtlar.
- `finance` (finans çalışanı): müşteri, plan ve abonelik kayıtları, dashboard görüntüleme. Ayarları ve kullanıcıları yönetemez.
- Rol kontrolü sunucu tarafında yapılır. Arayüzde bir düğmeyi gizlemek yetki kontrolü sayılmaz.

## İş kuralları
- Fiyatlar TL cinsinden tam sayıdır (kuruş yok). Tek para birimi: TL.
- Plan aralığı: aylık (MONTHLY) veya yıllık (YEARLY).
- Abonelik durumu: ACTIVE veya CANCELED.
- Bir müşterinin aynı anda yalnızca bir ACTIVE aboneliği olabilir.
- Olay türleri: STARTED, RENEWED, CANCELED. Her durum değişikliği SUBSCRIPTION_EVENTS tablosuna yazılır.
- Yenileme yalnızca ACTIVE abonelikte yapılır. İptal edilmiş abonelik yenilenmez, yeni abonelik başlatılır.
- Müşteri ve plan kayıtları silinmez, `isActive=false` ile pasife alınır.

## Metrik formülleri
- MRR = ACTIVE aboneliklerin aylık fiyat toplamı (yıllık planlar / 12).
- Churn (aylık) = ay içinde iptal edenler / ay başındaki aktif müşteriler.
- ARPU = MRR / aktif müşteri sayısı.
- Ortalama ömür = 1 / churn.
- LTV = ARPU x ortalama ömür.
- LTV/CAC (CAC tenant ayarından girilir). 3 ve üzeri sağlıklı kabul edilir.
- Sıfıra bölme durumlarını (churn 0, aktif müşteri 0) açıkça ele al ve ekranda anlaşılır göster.
- Hesap fonksiyonları saf fonksiyon olarak yazılır ve birim testi eklenir.

## Güvenlik
- Secret değerler (DATABASE_URL, oturum anahtarı vb.) yalnızca ortam değişkeninden okunur.
- `.env` dosyası asla repoya girmez. `.gitignore` kontrol edilir.
- Koda veya prompta gerçek parola, API anahtarı, gerçek müşteri verisi yazma. Yer tutucu kullan: `[DATABASE_URL]`.
- Parolalar bcrypt ile özetlenir (düz metin saklanmaz).
- Oturum çerezi httpOnly olmalıdır.
- Tüm kullanıcı girdileri sunucuda doğrulanır.
- Test ve demo verisi sahte ama gerçekçi olur.
- `.env.example` yalnızca yer tutucu içerir (`[NEON_POOLED_URL]`). Gerçek adres veya parola asla yazılmaz.
- Commit öncesi üç tarama yapılır, üçü de içerik basmaz. Dosyalar önce `git add` ile hazırlanır ve taramalar hazırlanan dosyalara bakar (`--cached` seçeneği desenden önce yazılır):
  1. Parola taraması: `git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"` (çıktı boş olmalı).
  2. Sunucu adı taraması: `git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"` (sonuç 0 olmalı). Belgelerdeki örnek adresler `ep-xxxx` biçiminde yazılır.
  3. Kişisel ad taraması: geliştiricinin adına ve soyadına ait desen aranır, GitHub kullanıcı adı çıkarıldıktan sonra sonuç 0 olmalıdır. Gerçek komut proje talimatlarındadır; belgelere ve `prompt_cevap` dosyalarına yazılan ad deseni [AD_DESENI] olarak maskelenir.
- Prompt günlüğüne (`prompt_cevap/`) yapıştırılan her içerik, yapıştırmadan önce maskelenir: `[DATABASE_URL]`, `[NEON_HOST]`, `[NEON_PAROLA]`.
- Terminal komutları `.env` içeriğini (parola dahil) ekrana basmamalı.
- Prisma geçişlerinde `migrate dev` her zaman `--create-only` ile çalıştırılır. `migration.sql` içinde `subscriptions_one_active_per_customer` dizinini silen bir `DROP INDEX` satırı varsa o satır silinir (bu dizin elle eklenmiştir, şemada yoktur).

## Gerçek zamanlı
- Uyarılar SSE ile sunucudan istemciye gönderilir. WebSocket ve polling kullanma.
- SSE kapsamı: iptal ve riskli abonelik uyarısı. Uyarı yalnızca ilgili kiracının manager ve finance kullanıcılarına gider.

## Kapsam (MoSCoW)
- MUST (5): kayıt/giriş/roller, müşteri ve plan yönetimi, abonelik yaşam döngüsü, KPI dashboard, kiracı izolasyonu.
- SHOULD: SSE uyarısı, aylık MRR grafiği.
- COULD: CSV dışa aktarma, plan bazlı kırılım.
- WON'T: ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi, mikroservis.
- Bu listenin dışında bir özellik önerme. Öneri gerekiyorsa önce sor.

## Çalışma biçimi
- Önce plan, sonra kod. Planı ben onaylamadan kod yazma.
- Önce veri akışını ve etkilenen tabloları açıkla, sonra kodu yaz.
- Yetki ve tenant kontrollerini ve olası hata durumlarını düşün.
- Küçük parçalarla ilerle. Tek seferde yalnızca istenen özelliği yaz.
- Mevcut kod yapısına uy. Yeni bir yapı icat etme. Gerekirse mevcut dosyanın içeriğini göstermemi iste.
- Cevabın sonunda yaptığın varsayımları listele ve emin olmadığın yeri belirt.
- Anlamadığın veya birden fazla yoruma açık bir noktada tahmin etme, bana sor.

## Çalışma düzeni (Git ve geliştirme)
- `main` dalına doğrudan push yapılmaz. Her iş için dal açılır, GitHub Desktop'ta Publish branch ve Create Pull Request kullanılır, Squash and merge ile birleştirilir. Sonra `git switch main`, `git pull` ve dal silinir (squash sonrası yerelde `git branch -D` gerekir).
- Commit terminalden atılır. Commit mesajının sonundaki ekler ardışık ve tek blokta en sonda yazılır: `Co-Authored-By: Claude <Model> <noreply@anthropic.com>` ve `Claude-Session: <oturum adresi>`. PR açıklaması "🤖 Generated with [Claude Code](https://claude.com/claude-code)" satırı, boş satır ve oturum adresi ile biter.
- `.env` canlı veritabanıdır, `.env.test` Neon `test` dalıdır. `npm run dev:test` uygulamayı test dalında açar (canlı koruması vardır). `npm run demo:veri -- <e-posta>` test firmasına demo veri yazar.
- `npm test` veritabanı istemez. `npm run test:db` test dalını kullanır.
- Demo kiracılar (Mavi Yazılım, Kuzey Teknoloji) yalnızca `@demo.example` kullanıcıları içerirse `seed:demo:canli` tarafından yenilenir. Bu firmalara başka e-posta uzantılı kullanıcı eklenmez.
- Yeni dosyalar terminalden `touch` ile boş açılır, içeriği geliştirici editöre yapıştırır. Küçük düzenlemeler `perl -pi -e` ile yapılır.
