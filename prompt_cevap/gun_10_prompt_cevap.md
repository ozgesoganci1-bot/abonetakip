# Gün 10: SSE ile iptal uyarısı ve riskli abonelik listesi

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 23 Eki 2026 – 24 Eki 2026 (Türkiye saati). **Kapsam:** 23 prompt ve 22 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Ad taramasının kendi arama deseni `[AD_DESENI]` olarak yazılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 10 promptu: SSE ile iptal uyarısı ve riskli abonelik listesi. Önce plan, onaydan sonra küçük commitler. Plan ve uygulama ayrı bir sohbette yapıldı |
| **Ne üretildi** | `sse-hub.ts` (kiracı başına bağlantı havuzu, `sse-hub.test.ts` 11 test), `/api/events` yolu, `UyariDinleyici.tsx`, `riskli-abonelikler.ts` (7 günden az kalan ACTIVE abonelikler) ve testleri, `abonelikIptal` içinde uyarı yayını, dashboard "Riskli abonelikler" kartı; `npm test` 75, `npm run test:db` 48 test; ADR Gün 10 bölümü |
| **Düzeltme gerekti mi** | Kısmen: (1) Kiracı başına 20 bağlantı sınırı, 15 dakikalık bağlantı ömrü ve 7 günlük risk kuralı (issue #6) plana sonradan eklendi; (2) AI ilk planında olmayan testler ve finans rolü hesaplarıyla elle test eklendi; (3) AI yanlışlıkla commit başlığında kesilme olduğunu ve macOS `sed` için `I` bayrağının çalışmadığını söyledi, ikisi de denenerek yanlış çıktı; (4) dashboard dosyasında girinti hataları terminalden düzeltildi; (5) canlıda bağlantı, başlıklar ve `: nabiz` doğrulandı, gerçek uyarı akışı canlı veritabanına yazmamak için denenmedi (test dalında denendi) |

## Gün 10 sohbeti (plan, onaylar, commitler ve test sonuçları)

_Plan ve uygulama bu sohbette yapıldı._

### Prompt 1 · 23 Eki 2026 11:44

````text
```markdown
[Rol] Next.js (App Router), TypeScript, PostgreSQL ve Prisma konusunda
deneyimli, çok kiracılı SaaS ürünleri geliştirmiş kıdemli bir geliştirici
olarak davran. Ben kod bilmeyen bir YBS öğrencisiyim. Açıklamaları Türkçe,
sade ve adım adım yap. Her dosya için tam dosya yolunu yaz ve "yeni dosya
oluştur" ya da "dosyanın içeriğini tamamen şununla değiştir" diye açıkça
söyle. Terminal komutlarını tek tek ver ve her birinin ne işe yaradığını
bir cümleyle söyle. Ortamım MacBook Air M4 (macOS, zsh).

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Tek geliştirici, 2 hafta, GitHub ile entegre.
Tek Next.js uygulaması, tek PostgreSQL veritabanı (Neon), Prisma. Render
(PaaS) üzerinde sürekli açık Node sunucusu. GitHub deposu herkese açık. Ortak tablolar ve tenant_id ile çok
kiracılı yapı. Roller: manager ve finance. Gerçek zamanlı uyarılar SSE ile.
Kapsam: MUST (kayıt/giriş/roller, müşteri ve plan yönetimi, abonelik yaşam
döngüsü, KPI dashboard, kiracı izolasyonu), SHOULD (SSE uyarısı, aylık MRR
grafiği). Ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi ve
mikroservis kapsam dışıdır.

[Kısıtlar - her zaman geçerli]
- Önce plan, ben onaylamadan kod yazma.
- Tenant filtresi tek merkezi fonksiyondan uygulanır. tenant_id istemciden
  alınmaz, oturumdan okunur.
- Secret değerler yalnızca ortam değişkeninden okunur.
- Gereksiz paket ekleme. Var olduğundan emin olmadığın paketi önerme.
- Kullandığım Next.js ve Prisma sürümünü package.json'dan kontrol et,
  gerekirse dosyayı bana göster dedirt.
- Kapsam dışına çıkma. Anlamadığın bir yerde tahmin etme, bana sor.
- Cevabın sonunda varsayımlarını listele ve emin olmadığın yerleri belirt.
```  ## Gün 10 • SSE uyarıları (SHOULD)

**Amaç:** İptal ve riskli abonelik uyarısını yenilemeden ekrana düşürmek.

```
[Görev] SSE ile gerçek zamanlı uyarı özelliğini yaz.

Uyarılar:
- Bir abonelik iptal edildiğinde ilgili kiracının açık oturumlarındaki
  manager ve finance kullanıcılarına "[Müşteri adı] aboneliğini iptal
  etti" uyarısı gider.
- Riskli abonelik: currentPeriodEnd tarihine 7 günden az kalmış ve
  henüz yenilenmemiş ACTIVE abonelikler dashboard'da "riskli" olarak
  listelenir. Bu liste sayfa açılışında hesaplanır, SSE zorunlu değil;
  SSE yalnızca iptal olayını canlı iletir.

[Kısıtlar]
- Uyarı yalnızca olayın ait olduğu kiracının kullanıcılarına gider.
  Başka kiracının uyarısı asla iletilmez (bunu ayrıca test et).
- SSE uç noktası giriş yapmamış kullanıcıya kapalıdır.
- Bağlantı kopunca tarayıcı otomatik yeniden bağlansın.
- Render'da ücretsiz servis uyuyabilir, bunun SSE'ye etkisini kısaca
  açıkla.
- WebSocket, polling, harici servis veya yeni paket ekleme. Önerin varsa
  önce gerekçeyle sor.
- Sunucu belleğinde bağlantı listesi tutuluyorsa, bunun tek sunucu
  süreciyle çalıştığını ve neden bu proje için yeterli olduğunu belirt.

[Format] 1) Olay akışını adım adım anlat: iptal tıklanır, ne olur, uyarı
nasıl ekrana düşer (onay bekle). 2) Dosyalar tam yollarıyla. 3) Elle test:
iki tarayıcı penceresiyle (biri aynı kiracı, biri farklı kiracı) deneme
adımları ve beklenen sonuç.

[Doğrulama] Tenant sızıntısı, yetkisiz bağlantı, kopan bağlantı ve çok
sayıda açık bağlantı durumlarını sırayla düşün. Varsayımlarını listele,
emin olmadığın yeri belirt.
```

**Bitiş kontrolü**
- [ ] Bir pencerede iptal edince diğer pencerede (aynı firma) uyarı anında görünüyor
- [ ] Farklı firmanın penceresinde uyarı **görünmüyor**
- [ ] Giriş yapmadan SSE adresi açılmıyor
- **Commit:** `feat: SSE ile iptal uyarısı ve riskli abonelik listesi`

> Süre yetmezse SSE'yi Gün 13 tamponuna ertele; MUST'lar bunsuz tamamdır.

---
```
````

### Claude cevabı 1 · 23 Eki 2026 11:45

> # Gün 10 • SSE uyarıları: Plan (kod yok, onayını bekliyorum)
>
> ## 1) Olay akışı: iptal tıklanınca ne olur?
>
> **Hazırlık (sayfa açıldığında):**
> 1. Giriş yapmış kullanıcının tarayıcısı, sunucuda `/api/events` adresine bir SSE bağlantısı açar. Bu, slayttaki "radyo frekansını açmak"tır.
> 2. Sunucu bu bağlantıyı kabul etmeden önce oturum çerezini okur. Oturum yoksa ya da rol `manager`/`finance` değilse bağlantıyı reddeder (401/403).
> 3. Kabul edilen bağlantı, sunucu belleğindeki bir listeye **oturumdan okunan `tenantId` altında** kaydedilir. Liste şu yapıdadır: `tenantId → o firmanın açık bağlantıları`.
> 4. Sunucu her 25 saniyede bir boş bir "kalp atışı" satırı gönderir. Bu, Render'ın ve tarayıcının boşta duran bağlantıyı kesmesini önlemek içindir.
>
> **İptal anı:**
>
> 5. Finance kullanıcısı "İptal et" düğmesine basar. Mevcut iptal işlemi (Gün 7–8'de yazdığımız) aynen çalışır: abonelik `CANCELED` olur ve `SUBSCRIPTION_EVENTS` tablosuna `CANCELED` olayı yazılır. Bu iki işlem tek bir veritabanı işleminin (transaction) içinde yapılır.
> 6. **Ancak işlem başarıyla bittikten sonra** sunucu `publish(tenantId, { müşteri adı })` fonksiyonunu çağırır. Buradaki `tenantId` yine oturumdan gelir, istemciden asla alınmaz. İşlem hata verirse uyarı gönderilmez, böylece "olmamış iptal" için uyarı çıkmaz.
> 7. `publish` yalnızca o `tenantId` altındaki bağlantılara mesaj yazar. Başka firmanın bağlantıları bu listede olmadığı için mesajı fiziksel olarak alamaz.
> 8. Tarayıcıdaki dinleyici bileşen mesajı alır ve ekranın üstünde "[Müşteri adı] aboneliğini iptal etti" bandını gösterir. Sayfa yenilenmez.
>
> **Kopma:**
>
> 9. Sekme kapanırsa sunucu bunu fark eder ve bağlantıyı listeden siler. Bağlantı ağdan dolayı koparsa tarayıcının `EventSource` özelliği **kendiliğinden** yeniden bağlanır. Bunun için ek kod gerekmez.
>
> **Riskli abonelikler (SSE yok):**
>
> 10. Dashboard açılırken sunucu, merkezi tenant fonksiyonu üzerinden şu kayıtları sorgular: `status = ACTIVE` ve `currentPeriodEnd` şimdi ile 7 gün sonrası arasında. Yenileme işlemi `currentPeriodEnd` tarihini ileri taşıdığı için yenilenmiş abonelik bu listeye zaten girmez.
>
> ## 2) Dosyalar (tahmini, mevcut koduna göre netleşecek)
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `src/lib/sse-hub.ts` | Yeni | Bellekteki bağlantı listesini tutar. `subscribe` ve `publish` fonksiyonlarını içerir. |
> | `src/app/api/events/route.ts` | Yeni | SSE uç noktası. Oturum ve rol kontrolü, kalp atışı ve kopunca temizlik burada yapılır. |
> | İptal işlemini yapan mevcut dosya | Değişecek | İşlem başarılı olduktan sonra `publish` çağrısı eklenecek. |
> | `src/components/AlertListener.tsx` | Yeni | Tarayıcı tarafında dinleyici ve uyarı bandı. |
> | Giriş sonrası layout dosyası | Değişecek | Dinleyiciyi tüm sayfalara ekler. |
> | Dashboard sayfası ve metrik/sorgu dosyası | Değişecek | Riskli abonelik listesi eklenecek. |
>
> Yeni paket eklenmeyecek. SSE, Next.js'in standart `Response` ve `ReadableStream` yapılarıyla ve tarayıcının yerleşik `EventSource` özelliğiyle yazılır.
>
> ## 3) Senin sorduğun açıklamalar (kısa)
>
> - **Bellekteki liste neden yeterli?** Uygulama Render'da tek bir Node süreci olarak çalışıyor. Tüm bağlantılar ve tüm iptaller aynı süreçten geçtiği için liste herkesi görür. İkinci bir sunucu açılsaydı, bir sunucudaki iptali diğerindeki kullanıcılar duymazdı. O durumda harici bir servis gerekirdi (WON'T kapsamında). Geliştirme ortamında Next.js dosyaları yeniden yüklediğinde listenin silinmemesi için listeyi `globalThis` üzerinde tutacağım.
> - **Render ücretsiz servis uyursa ne olur?** Ücretsiz servis bir süre istek almazsa uykuya geçer. Uyurken bütün SSE bağlantıları kopar. İlk ziyaretçi servisi uyandırınca tarayıcılar kendiliğinden yeniden bağlanır. **Uyku sırasında yapılmış bir iptalin canlı uyarısı kaybolur.** Bu kabul edilebilir, çünkü iptal veritabanında durur ve abonelik listesinde görünür. Açık bir SSE bağlantısının servisi uyanık tutup tutmadığından emin değilim; bunu Render'da deneyerek göreceğiz.
>
> ## 4) Elle test planı (kod sonrası ayrıntılı vereceğim)
>
> - **Pencere A:** Firma 1, manager (normal pencere).
> - **Pencere B:** Firma 1, finance (Chrome'da `Cmd + Shift + N` ile gizli pencere).
> - **Pencere C:** Firma 2, manager (Safari, ayrı oturum için).
>
> B'de iptal edildiğinde uyarı A'da görünmeli, C'de görünmemeli. Ayrıca çıkış yapılmış bir pencerede `/api/events` adresi açılmamalı.
>
> ## 5) Doğrulama düşünceleri
>
> - **Tenant sızıntısı:** Kayıt ve yayın sırasında `tenantId` yalnızca oturumdan okunur. Sorgu parametresi kabul edilmez.
> - **Yetkisiz bağlantı:** Oturum ve rol kontrolü, akış başlamadan önce sunucuda yapılır.
> - **Kopan bağlantı:** Hem kapanma sinyali hem de yazma hatası durumunda bağlantı listeden silinir ve kalp atışı zamanlayıcısı durdurulur. Aksi halde bellek sızıntısı olur.
> - **Çok sayıda bağlantı:** Her sekme bir bağlantı açar. Bu projenin ölçeğinde (birkaç firma, birkaç kullanıcı) sorun olmaz. Ancak tarayıcılar HTTP/1.1'de aynı siteye en fazla 6 bağlantı açar; çok sekme açılırsa sayfalar takılabilir.
> - **Rol değişirse:** Açık bağlantı, kullanıcı yeniden bağlanana kadar eski yetkiyle kalır. Bu proje için kabul edilebilir bir sınırlama.
>
> ## Onaydan önce senden istediklerim
>
> 1. `package.json` dosyasının içeriği (Next.js ve Prisma sürümü için).
> 2. Oturumu okuyan yardımcı dosya ve merkezi tenant fonksiyonunun bulunduğu dosya.
> 3. İptal işlemini yapan dosya (server action ya da API rotası).
> 4. Giriş sonrası sayfaları saran layout dosyası.
> 5. İki karar:
>    - Uyarı **tüm sayfalarda** mı görünsün (önerim bu), yoksa yalnızca dashboard'da mı?
>    - `currentPeriodEnd` tarihi **geçmiş** ama hâlâ ACTIVE olan abonelikler de riskli listesine girsin mi? Bence girmeli, çünkü daha da riskliler.
>
> Dosyalar maskeleme gerektirmez. Ancak `.env` içeriğini gönderme.
>
> **Varsayımlarım:** Kaynak dosyalar `src/` altında. Abonelikte `currentPeriodEnd` alanı var. İptal işlemi transaction kullanıyor. Render'da tek instance çalışıyor.
>
> **Emin olmadıklarım:** Render'ın boşta duran bağlantıları ne kadar sürede kestiği; açık SSE bağlantısının ücretsiz servisi uyanık tutup tutmadığı; senin Next.js sürümünde route dosyasında `export const dynamic = "force-dynamic"` ayarının gerekip gerekmediği. Bu sonuncusunu `package.json` dosyasını görünce netleştireceğim.

### Prompt 2 · 24 Eki 2026 08:22

````text
Planı onaylıyorum, şu eklemelerle:

1. Test: (a) sse-hub için veritabanı gerektirmeyen birim testleri (npm test): A firmasına yayınlanan mesaj B'nin bağlantısına gitmez, kopan bağlantı listeden silinir, boş firma temizlenir. (b) Riskli abonelik sorgusu için test:db testi: A'nın listesi B'nin kaydını içermez, yenilenmiş ve iptal edilmiş abonelik listeye girmez, süresi geçmiş ACTIVE abonelik girer. Test aracı node --test, Vitest önermeyeceksin. Yeni testleri package.json test ve test:db betiklerine ekleyeceğiz (mevcut betikleri tamamen değiştirmeyip yalnızca eklenen dosya adlarını göster).
2. Elle test yalnızca "npm run dev:test" ile Neon test dalında yapılacak. "npm run dev" canlı veritabanına bağlanır, hiçbir adımda kullanma.
3. Finance kullanıcısı: Kullanıcılar sayfası yer tutucu, finance kullanıcı eklenemiyor. Elle testte finance penceresi için nasıl bir kullanıcı gerektiğini söyle; ben test dalında elimde finance hesabı olup olmadığını kontrol edip cevap vereceğim. Benden onay almadan yeni betik veya kullanıcı oluşturma kodu yazma.
4. İptal işlemi Gün 4'te yazıldı (Gün 7-8 değil). Dosyasını göndereceğim.
5. Riskli abonelik kuralının (7 gün) kaynağı GitHub'daki #6 issue açıklaması olmalı. Kural orada nasılsa ona uyacağız; ben issue metnini sana getireceğim, 7 günü şimdilik varsayım olarak işaretle.
6. SSE yanıtında Content-Type: text/event-stream, Cache-Control: no-cache, no-transform ve proxy tamponlamasını kapatan başlık (X-Accel-Buffering: no) bulunsun.
7. Kararlar: uyarı tüm sayfalarda görünsün (panel layout). Süresi geçmiş ama hâlâ ACTIVE abonelikler riskli listede olsun, "Süresi geçmiş" diye ayrı etiketle.
8. Dosya oluştururken: dosyayı terminalden boş oluşturup (touch) kodu ben VS Code'a yapıştıracağım, uzun heredoc verme. package.json'ı tam dosya olarak değiştirtme, yalnızca betik satırlarına eklenen dosya adlarını söyle.
9. Commit trailer'ları: Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> ve Claude-Session satırı her commit mesajında olsun. Doğrudan git push yok, dal ve PR ile ilerleyeceğiz.
10. Commit öncesi taramaların üçüncüsü artık geniş: git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"  (sonuç 0 olmalı).

İstediğin dosyaları (package.json, auth ve tenant dosyaları, iptal işlemi, layout) ekliyorum. Issue #6'nın kabul kriterlerini kontrol ettim: riskli abonelik kuralı "bitiş dönemine 7 günden az kalmış, henüz yenilenmemiş ACTIVE abonelik". Koşul status = ACTIVE ve currentPeriodEnd < şimdi + 7 gün olsun (geçmiş tarihliler de buna girer, ayrı koşul yazma; yalnızca ekranda "Süresi geçmiş" etiketi için ayır). Ayrıca elle test planına şu kriterleri ekle: bağlantı kopup yeniden kurulunca sayfanın hata vermemesi, çıkış yapılmış pencerede /api/events'in reddetmesi, başka firmanın pencerelerinde uyarının görünmemesi. İstediğin dosyalar ekte (tek dosyada, her biri "=== DOSYA: yol ===" başlığıyla): package.json, prisma/schema.prisma, auth.ts, session.ts, tenant.ts, (panel)/layout.tsx, abonelikler/actions.ts, SatirIslemleri.tsx, abonelik-kontrol.ts, islem.ts, abonelikler/page.tsx. Finance kullanıcısı sorusu çözüldü: Neon test dalında A firmasında hem manager hem finance, B firmasında da manager ve finance hesabı hazır (Gün 6'dan kalma). Yeni kullanıcı betiği gerekmiyor. Planı bu dosyalara göre güncelle ve onay için tekrar sun, kod yazma.
````

_[ek dosya: gun10_dosyalar.txt]_

### Claude cevabı 2 · 24 Eki 2026 08:24

> # Gün 10 • SSE uyarıları: Güncellenmiş plan (kod yok, onayını bekliyorum)
>
> Gönderdiğin dosyalar planı netleştirdi. Kısa özet: mevcut yapıya iki yeni dosya, bir uç nokta ve bir istemci bileşeni ekleniyor; mevcut koddaki tek değişiklik iptal işlemine birkaç satır eklemek.
>
> ## 1) Olay akışı (dosyalara göre netleşmiş hâli)
>
> **Bağlantı kurulması**
> 1. `(panel)/layout.tsx` her panel sayfasında yeni `UyariDinleyici` bileşenini gösterir. Bileşen tarayıcıda `/api/events` adresine `EventSource` ile bağlanır. Çerez aynı site olduğu için kendiliğinden gönderilir.
> 2. `/api/events` uç noktası `getCurrentUser()` fonksiyonunu çağırır.
>    - `requireUser()` kullanılmaz, çünkü o fonksiyon giriş sayfasına yönlendirir. Bir API'nin yönlendirme yerine açık bir ret dönmesi gerekir.
>    - Kullanıcı yoksa yanıt **401** olur. Rolü `manager` veya `finance` değilse yanıt **403** olur. Şu an başka rol yok, ama bu kontrol savunma amaçlı açıkça yazılır.
>    - `tenantId` değeri, `auth.ts`'nin zaten yaptığı gibi veritabanından gelir. Çerezde ve URL'de yoktur.
> 3. Kontrol geçilirse yanıt akış olarak açılır. Başlıklar:
>    - `Content-Type: text/event-stream; charset=utf-8`
>    - `Cache-Control: no-cache, no-transform`
>    - `X-Accel-Buffering: no`
> 4. Bağlantı, sunucu belleğindeki listeye `tenantId` altında kaydedilir. Ardından her 25 saniyede bir kalp atışı satırı (`: nabiz`) gönderilir.
>
> **İptal anı (`abonelikler/actions.ts` → `abonelikIptal`)**
>
> 5. Mevcut `findFirst` sorgusuna müşteri adı eklenir: `customer: { select: { name: true } }`. Sorgu yine `getTenantDb()` üzerinden çalışır.
> 6. Transaction `true` dönerse, yani iptal gerçekten veritabanına yazıldıysa, `yayinla(kullanici.tenantId, { tur: "iptal", musteriAdi })` çağrılır.
>    - Bu çağrı kendi `try/catch` bloğu içindedir. Uyarı gönderilemese bile iptal başarılı sayılır ve kullanıcıya hata gösterilmez.
>    - Transaction `false` dönerse (çift tıklama) ya da hata verirse uyarı **gönderilmez**. Mevcut `status: "ACTIVE"` koşulu sayesinde çift tıklamada çift uyarı da oluşmaz.
> 7. Uyarı, iptali yapan kişinin kendi pencereleri dahil, o firmanın bütün açık bağlantılarına gider.
>
> **Ekrana düşmesi**
>
> 8. `UyariDinleyici` mesajı alır ve sayfanın üstünde kapatılabilir bir bant gösterir: "[Müşteri adı] aboneliğini iptal etti."
>    - Müşteri adı React ile metin olarak basılır, HTML olarak işlenmez. Böylece adın içine yazılmış bir betik çalışamaz.
>
> **Kopma ve yeniden bağlanma**
>
> 9. Sekme kapanınca bağlantı iki yolla listeden silinir: isteğin iptal sinyali ve yazma hatası. İkincisi yedek yoldur.
> 10. Ağ ya da sunucu kesintisinde `EventSource` kendiliğinden yeniden bağlanır.
> 11. Çıkış yapılmışsa yeniden bağlanma denemesi 401 alır ve tarayıcı denemeyi bırakır. Bileşen bu durumda hata fırlatmaz, sessizce durur.
>
> **Riskli abonelikler (issue #6)**
>
> 12. Dashboard açılışında sunucu şu sorguyu çalıştırır: `status = ACTIVE` ve `currentPeriodEnd < şimdi + 7 gün`, `currentPeriodEnd` tarihine göre artan sırada. Geçmiş tarihli kayıtlar bu tek koşula zaten girer, ayrı bir koşul yazılmaz.
> 13. Etiket ayrımı yalnızca ekran içindir:
>     - `currentPeriodEnd < şimdi` ise **"Süresi geçmiş"**.
>     - Değilse **"X gün kaldı"**.
>     - Sınır net: tam 7 gün kalmış kayıt listeye **girmez**, çünkü kural "7 günden az" diyor.
> 14. Yenileme `currentPeriodEnd` tarihini ileri taşıdığı için yenilenmiş abonelik listeye girmez. İptal edilmiş abonelik ise `status` koşuluna takılır.
> 15. "7 gün" değeri tek bir sabitte tutulur (`RISK_GUN = 7`). Yanındaki yorum issue #6'ya atıf yapar.
>
> ## 2) Dosyalar
>
> | Dosya | İşlem | Ne yapar |
> |---|---|---|
> | `src/lib/sse-hub.ts` | Yeni | Firma → bağlantılar listesi; `abone`, `yayinla` ve bağlantı sayısını veren fonksiyonlar. Next.js'e ve veritabanına **bağımlı değildir**, bu yüzden `node --test` ile doğrudan test edilir. Testler için yeni bir hub üreten fonksiyon da açılır. Uygulama, dev modda yeniden yüklemede silinmesin diye `globalThis` üzerindeki tek örneği kullanır. |
> | `src/lib/sse-hub.test.ts` | Yeni | Hub birim testleri (`npm test`). |
> | `src/app/api/events/route.ts` | Yeni | SSE uç noktası. |
> | `src/app/(panel)/UyariDinleyici.tsx` | Yeni | İstemci bileşeni ve uyarı bandı. `MenuBaglantisi` ile aynı klasörde durur. |
> | `src/app/(panel)/layout.tsx` | Değişecek | `<main>` içine `<UyariDinleyici />` eklenecek. |
> | `src/app/(panel)/abonelikler/actions.ts` | Değişecek | Yalnızca `abonelikIptal`: müşteri adının seçilmesi ve başarı sonrası yayın. Başlatma ve yenileme fonksiyonlarına dokunulmaz. |
> | `src/lib/riskli-abonelikler.ts` | Yeni | `riskliAbonelikler(db, simdi)`: parametre olarak `TenantDb` ve sabit bir "şimdi" alır, böylece test edilebilir. Saf `riskEtiketi(bitis, simdi)` fonksiyonu da bu dosyadadır. |
> | `src/lib/riskli-abonelikler.test.ts` | Yeni | `test:db` testi. |
> | Dashboard sayfası ve `dashboard-verisi.ts` | Değişecek | Riskli liste bölümü eklenecek. **Bu dosyaları henüz görmedim.** |
>
> Yeni paket yok. Ham SQL yok. Bütün sorgular `getTenantDb()` ya da `TenantDb` üzerinden yapılır.
>
> **package.json:** dosyanın tamamını değiştirmeyeceğiz. Mevcut betiklerin sonuna yalnızca şunlar eklenecek:
> - `test` betiğinin sonuna: `src/lib/sse-hub.test.ts`
> - `test:db` betiğinin sonuna: `src/lib/riskli-abonelikler.test.ts`
>
> ## 3) Otomatik testler (node --test)
>
> **(a) `sse-hub.test.ts`** (veritabanı yok; bağlantı yerine gelen mesajları bir diziye yazan sahte nesneler kullanılır)
> 1. A firmasına yayınlanan mesaj, A'nın bağlantılarına gider ve B'nin bağlantısına **gitmez**.
> 2. Aynı firmadaki iki bağlantının ikisi de mesajı alır.
> 3. Ayrılan bağlantı sonraki mesajı almaz ve listeden silinir.
> 4. Firmanın son bağlantısı da ayrılınca firma anahtarı listeden tamamen silinir.
> 5. Gönderim sırasında hata veren bir bağlantı listeden çıkarılır. Aynı firmadaki diğer bağlantılar mesajı almaya devam eder.
>
> **(b) `riskli-abonelikler.test.ts`** (Neon test dalında; sabit bir "şimdi" tarihiyle)
>
> | Kayıt | Beklenen |
> |---|---|
> | A, ACTIVE, bitişe 3 gün var | Listede, "3 gün kaldı" |
> | A, ACTIVE, bitiş 2 gün önce geçmiş | Listede, "Süresi geçmiş" |
> | A, ACTIVE, bitişe tam 7 gün var | **Listede değil** (sınır) |
> | A, ACTIVE, bitişe 30 gün var (yenilenmiş durumu) | Listede değil |
> | A, CANCELED, bitişe 3 gün var | Listede değil |
> | B, ACTIVE, bitişe 3 gün var | A'nın listesinde **yok** |
>
> Bu testi yazabilmek için mevcut test verisi yardımcılarının (`src/test-destek/veri.ts`) nasıl kullanıldığını görmem gerekiyor (aşağıda istiyorum).
>
> **Bir öneri, onayına bağlı:** `riskEtiketi` saf bir fonksiyon olduğu için veritabanı olmadan da test edilebilir. Bunu `npm test` kapsamına ayrı küçük bir dosya (`src/lib/riskli-etiket.test.ts`) olarak ekleyebilirim. İstemezsen etiket yalnızca yukarıdaki `test:db` testinde kontrol edilir.
>
> ## 4) Elle test planı (yalnızca `npm run dev:test`)
>
> `npm run dev` hiçbir adımda kullanılmayacak.
>
> **Pencereler:** Gün 6'dan kalan dört hesap kullanılacak. Her pencere ayrı bir çerez kutusunda açılır.
>
> | Pencere | Tarayıcı | Hesap |
> |---|---|---|
> | 1 | Chrome, normal pencere | A firması, manager |
> | 2 | Chrome, gizli pencere (`Cmd + Shift + N`) | A firması, finance |
> | 3 | Safari, normal pencere | B firması, manager |
> | 4 | Safari, özel pencere (`Cmd + Shift + N`) | B firması, finance |
>
> **Kontroller ve beklenen sonuçlar**
>
> 1. **Aynı firma:** Pencere 2'de bir aboneliği iptal et. Pencere 1 ve 2'de uyarı sayfa yenilenmeden görünmeli.
> 2. **Başka firma:** Aynı anda pencere 3 ve 4'te uyarı **görünmemeli**. Sonra tersini dene: pencere 3'te iptal et. Uyarı yalnızca 3 ve 4'te görünmeli, 1 ve 2'de görünmemeli.
> 3. **Başlıklar:** Pencere 1'de `Cmd + Option + I` ile geliştirici araçlarını aç ve Network sekmesinde `events` isteğine bak. Türü `eventsource` olmalı ve üç başlığın üçü de görünmeli.
> 4. **Çıkış yapılmış pencere:** Pencere 4'te çıkış yap ve adres çubuğuna `http://localhost:3000/api/events` yaz. Yanıt 401 olmalı, akış açılmamalı.
> 5. **Kopma ve yeniden bağlanma:** Terminalde `Control + C` ile sunucuyu durdur ve `npm run dev:test` ile yeniden başlat.
>    - Açık pencerelerde Next.js hata ekranı çıkmamalı.
>    - Sunucu ayağa kalktıktan sonra yeni bir iptal yap. Uyarı yine doğru pencerelere düşmeli.
>    - Aynı denemeyi DevTools'taki Network sekmesinde "Offline" seçip sonra geri alarak da yap.
> 6. **Riskli liste:** Dashboard'da riskli liste ve "Süresi geçmiş" etiketi görünmeli. Ancak bunun için test dalında bitişine 7 günden az kalmış bir abonelik olması gerekiyor. Arayüzden başlatılan abonelik bir ay ya da bir yıl sonra biteceği için listeye girmez. `demo:veri` betiği böyle kayıtlar üretiyor mu, bilmiyorum. Üretmiyorsa bu madde yalnızca `test:db` ile doğrulanır. Senin onayın olmadan yeni betik yazmayacağım.
>
> **Not:** Aynı tarayıcı profilinde çok sekme açma. HTTP/1.1'de tarayıcı bir siteye en fazla 6 bağlantı açar ve sayfalar takılabilir.
>
> ## 5) Dosya oluşturma ve commit
>
> **Dosya oluşturma:** Kod aşamasında her yeni dosya için önce `mkdir -p` ile klasörü, sonra `touch` ile boş dosyayı oluşturacağız. Ardından içeriği sen VS Code'a yapıştıracaksın.
> - zsh, parantezli yolları (`(panel)`) özel karakter olarak yorumlar. Bu yüzden bu yolları tırnak içinde vereceğim, örneğin `"src/app/(panel)/UyariDinleyici.tsx"`.
>
> **Dal ve PR:** Dal adı `gun10-sse`. `main` dalına doğrudan push yok. Dalı `git push -u origin gun10-sse` ile gönderip PR açacağız. Buna izin var mı, onayla.
>
> **Commit taramaları:** Commit öncesi üç tarama yapılacak. Üçüncüsünde bir sorun gördüm:
> - macOS'taki `sed`, `s///Ig` yazımındaki `I` bayrağını desteklemez ve hata verir.
> - `sed` hata verince borunun çıktısı boş olur, `grep -ic` de **0** yazar. Yani tarama hiçbir şeyi kontrol etmeden "temiz" görünür.
> - Önerim: `sed` yerine macOS'ta hazır gelen `perl` kullanmak: `perl -pe 's/ozgesoganci1-bot//gi'`. Taramanın geri kalanı aynı kalır.
> - Senin onayınla değiştireceğim. Ayrıca bu taramayı bir kez bilerek yakalanması gereken bir satırla deneyip gerçekten yakaladığını görelim.
> - `ö` ve `ğ` harflerinde büyük/küçük harf duyarsızlığı macOS `grep`'inde dil ayarına bağlı olabilir; bundan emin değilim.
>
> **Commit trailer'ları:**
> - Bu oturumdaki model **Claude Opus 5.5**, Sonnet 5.5 değil. Trailer'a hangisini yazalım? Önerim, bu günün commit'leri için `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
> - `Claude-Session:` satırına yazılacak değeri bilmiyorum. Önceki commit'lerde ne yazdığını göster ya da değeri ver.
>
> Commit mesajı: `feat: SSE ile iptal uyarısı ve riskli abonelik listesi`
>
> ## 6) Kod aşamasından önce görmem gerekenler
>
> 1. Dashboard sayfası (muhtemelen `src/app/(panel)/dashboard/page.tsx`) ve `src/lib/dashboard-verisi.ts`.
> 2. `src/lib/tenant.test.ts` (bir `test:db` örneği olarak) ve `src/test-destek/veri.ts`.
> 3. `src/test-destek/kancalar.mjs`: `@/` yollarının testlerde nasıl çözüldüğünü görmek için.
> 4. `next.config.ts`: `cacheComponents` açıksa route dosyasında `export const dynamic` kullanılamaz.
> 5. Varsa `src/proxy.ts` ya da `src/middleware.ts`: `/api/events` isteğini giriş sayfasına yönlendirip 401'i bozmasın.
>
> ## Varsayımlar
> - Render'da tek instance ve tek Node süreci çalışıyor.
> - Panelin tüm sayfaları `(panel)/layout.tsx` altında.
> - `dev:test`, Next'i `localhost:3000` adresinde açıyor.
> - Arayüzden başlatılan abonelikler riskli listeye girmez; bu davranış doğru.
>
> ## Emin olmadıklarım
> - **Sıkıştırma:** Next.js'in yerleşik sıkıştırması SSE akışını tamponlayabilir. `no-transform` başlığının bunu engellediğini düşünüyorum ama doğrulamadım. Elle testin 1. adımında uyarı gecikirse buraya bakacağız.
> - **İptal sinyali:** Next.js 16.4'te tarayıcı bağlantıyı kapatınca isteğin iptal sinyalinin her durumda tetiklendiğinden emin değilim. Bu yüzden yazma hatası yedek temizlik yolu olarak kalıyor.
> - **Render:** Boşta duran bağlantıları ne kadar sürede kestiği ve açık bir SSE bağlantısının ücretsiz servisi uyanık tutup tutmadığı. 25 saniyelik kalp atışı bunun için tahminî bir güvenlik payı.

### Prompt 3 · 24 Eki 2026 08:27

````text
Güncellenmiş planı onaylıyorum, şu cevaplarla:

1. riskli-etiket.test.ts (npm test) evet, ekle.
2. git push yok. Dalı GitHub Desktop ile Publish branch yapacağım. Terminalden yalnızca git switch -c gun10-sse kullanacağız.
3. sed taraması aynı kalıyor. Gün 9'da bu komut gerçekten bir kırıntıyı yakaladı (sonuç 1 çıktı), yani çalışıyor.
4. Trailer: modelin kendisini hangi olarak görüyorsan o. Claude-Session satırı önceki günlerle aynı. Hangi modeli yazacağını sen belirle ve bana söyle.
5. Elle test madde 6: yeni betik yazma. Riskli listeyi kod bittikten sonra Neon SQL Editor'de test dalında tek bir kaydı güncelleyerek kontrol edeceğiz. Bunu o aşamada tek komutla ve hangi dal olduğunu doğrulatarak yönlendir.
6. Plana ekle: firma başına bağlantı sayısı sınırı (öneri 20). Sınır aşılınca davranışı belirle ve sse-hub.test.ts'e test ekle.
7. Çıkış yapınca bağlantının kapanması (UyariDinleyici layout içinde, /giris'e gidince kaldırılır) ADR notu olarak yazılsın.

İstediğin dosyalar ekte. Planı son hâliyle tek mesajda özetle ve "kod aşamasına geçebilir miyim" diye onay iste, kod yazma.
````

_[ek dosya: gun10_dosyalar_2.txt]_

### Claude cevabı 3 · 24 Eki 2026 08:29

> # Gün 10 • SSE uyarıları: Son plan (kod yok)
>
> ## Cevaplarına göre netleşenler
>
> - **Tarama:** Haklısın, önceki uyarım yanlıştı. macOS'taki `sed`, FreeBSD kökenli olduğu için `I` bayrağını destekliyor. Ayrıca Gün 9'da sonucun 1 çıkması, `sed`'in gerçekten çıktı ürettiğini kanıtlıyor. Komut aynen kalıyor.
> - **Trailer:** Bu oturumdaki model Claude Opus 5.5. Bu yüzden `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` yazacağız. `Claude-Session:` satırını önceki günlerden aynen kopyalayacaksın.
> - **Dal:** Terminalden yalnızca `git switch -c gun10-sse` kullanılacak. Dalı GitHub Desktop'ta "Publish branch" ile yayınlayıp PR açacaksın.
> - **Ayar dosyaları:** `next.config.ts` içinde `cacheComponents` yok. Bu yüzden route dosyasında `export const dynamic = "force-dynamic"` güvenle kullanılabilir.
> - **Proxy dosyaları:** `proxy.ts` ve `middleware.ts` içerikleri boş geldi. Büyük olasılıkla bu dosyalar yok; o zaman `/api/events` isteğini yönlendirecek bir şey de yok. Kod aşamasının ilk adımında bunu `ls` ile doğrulayacağız.
>
> ## Olay akışı (özet)
>
> 1. `(panel)/layout.tsx` içindeki `UyariDinleyici`, `/api/events` adresine bağlanır.
>    - Layout sayfa geçişlerinde yeniden çizilmez, bu yüzden bağlantı sayfa değiştikçe kopmaz.
> 2. Uç nokta `getCurrentUser()` ile oturumu kontrol eder:
>    - Kullanıcı yoksa yanıt **401** olur.
>    - Rol uygun değilse yanıt **403** olur.
>    - Firmanın bağlantı sınırı doluysa yanıt **429** olur.
>    - Kontrol geçilirse akış açılır. Başlıklar: `Content-Type: text/event-stream; charset=utf-8`, `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`.
>    - Akışın ilk satırı `retry: 5000`'dir, yani tarayıcı koptuktan 5 saniye sonra yeniden bağlanmayı dener.
>    - Her 25 saniyede bir kalp atışı satırı gönderilir.
> 3. `abonelikIptal` mevcut sorguya müşteri adını ekler. İşlem başarıyla yazıldıktan sonra `yayinla(kullanici.tenantId, …)` çağrılır.
>    - Bu çağrı kendi `try/catch` bloğu içindedir. Uyarı gönderilemezse iptal yine başarılı sayılır.
>    - Çift tıklamada ikinci istek veritabanında hiçbir satırı değiştirmez, bu yüzden ikinci bir uyarı da gönderilmez.
> 4. Mesaj `event: iptal` türündedir ve verisi tek satırlık JSON'dur. `JSON.stringify` satır sonlarını kaçırır, bu yüzden SSE biçimi bozulmaz.
> 5. İstemci müşteri adını React ile metin olarak gösterir. Bant kapatılabilir; en yeni uyarı en üstte görünür ve en fazla 5 uyarı tutulur.
> 6. Uç nokta 401 veya 429 dönerse tarayıcı bağlantıyı kapatır. Bileşen bu durumda hata fırlatmaz, sessizce durur.
>
> ## Yeni: firma başına bağlantı sınırı (20)
>
> - **Sınır aşılırsa:** **Yeni** bağlantı reddedilir (429). Açık bağlantılara dokunulmaz.
> - **En eskiyi kapatmak neden olmaz:** Kapatılan sekme kendiliğinden yeniden bağlanır, bu da başka bir sekmeyi düşürür ve döngü oluşur.
> - **Sonuç:** 21. sekmede canlı uyarı gelmez. Sayfanın geri kalanı normal çalışır.
> - **Yarış durumu:** Sınır kontrolü ile listeye ekleme tek ve senkron bir adımdır. Node.js tek iş parçacıklı çalıştığı için iki istek aynı anda araya giremez.
> - **Testlerde:** Sınır, hub oluşturulurken parametre olarak verilir. Böylece testler küçük bir sınırla (ör. 2) da çalışabilir.
>
> ## Riskli abonelikler
>
> - **Sorgu:** `status = ACTIVE` ve `currentPeriodEnd < simdi + 7 gün` (issue #6). Sabit `RISK_GUN = 7`.
> - **Etiket:** `riskEtiketi(bitis, simdi)` saf bir fonksiyondur.
>   - Bitiş geçmişte ise **"Süresi geçmiş"**.
>   - Kalan süre 1 günden az ise **"1 günden az kaldı"**.
>   - Değilse **"X gün kaldı"**. X, tam gün sayısıdır ve aşağı yuvarlanır. Süre takvim günüyle değil, milisaniye farkıyla hesaplanır.
> - **Dashboard'da:** "Müşteri özeti" kartının altında yeni bir "Riskli abonelikler" kartı olacak. Kartta müşteri, plan, bitiş tarihi (Türkiye saati) ve etiket görünür.
>   - Liste boşsa "Riskli abonelik yok" yazar.
>   - Manager ve finance ikisi de görür.
>   - Veri `dashboardVerisiniGetir` içine değil, ayrı bir fonksiyona konur ve sayfada paralel çağrılır. `dashboard-verisi.ts` ve onun testi değişmez.
>
> ## Dosyalar
>
> | Dosya | İşlem |
> |---|---|
> | `src/lib/sse-hub.ts` | Yeni. Next.js'e ve veritabanına bağımlı değil. |
> | `src/lib/sse-hub.test.ts` | Yeni (`npm test`). |
> | `src/app/api/events/route.ts` | Yeni |
> | `src/app/(panel)/UyariDinleyici.tsx` | Yeni |
> | `src/app/(panel)/layout.tsx` | Değişecek: tek satırlık ekleme ve bir import. |
> | `src/app/(panel)/abonelikler/actions.ts` | Değişecek: yalnızca `abonelikIptal`. |
> | `src/lib/riskli-abonelikler.ts` | Yeni. `TenantDb` yalnızca tip olarak içe aktarılır (`import type`). |
> | `src/lib/riskli-etiket.test.ts` | Yeni (`npm test`). |
> | `src/lib/riskli-abonelikler.test.ts` | Yeni (`test:db`). |
> | `src/app/(panel)/dashboard/page.tsx` | Değişecek: yeni kart. |
> | `docs/02_ADR.md` | Değişecek: sonuna SSE bölümü eklenecek. |
>
> **package.json:** Mevcut betiklerin sonuna yalnızca dosya adları eklenecek:
> - `test` betiğinin sonuna: `src/lib/sse-hub.test.ts src/lib/riskli-etiket.test.ts`
> - `test:db` betiğinin sonuna: `src/lib/riskli-abonelikler.test.ts`
>
> ## Otomatik testler
>
> **`sse-hub.test.ts`**
> 1. A'ya yayınlanan mesaj B'nin bağlantısına gitmez.
> 2. Aynı firmadaki iki bağlantının ikisi de mesajı alır.
> 3. Ayrılan bağlantı sonraki mesajı almaz ve listeden silinir.
> 4. Firmanın son bağlantısı da ayrılınca firma anahtarı listeden silinir.
> 5. Gönderimde hata veren bağlantı listeden çıkarılır, diğerleri mesajı almaya devam eder.
> 6. **Sınır:** Sınıra kadar olan bağlantılar kabul edilir, bir fazlası reddedilir. Reddedilen bağlantı mesaj almaz.
> 7. **Sınır:** Bir bağlantı ayrılınca yeni bağlantı tekrar kabul edilir.
> 8. **Sınır:** A'nın sınırı dolu olsa da B'nin yeni bağlantısı kabul edilir.
>
> **`riskli-etiket.test.ts`**
> - Etiket sonuçları: süresi geçmiş, 1 günden az kaldı, 3 gün kaldı, 6 gün 23 saat → "6 gün kaldı".
>
> **`riskli-abonelikler.test.ts`**
> - `testFirmasiOlustur("a"/"b")` ile iki firma kurulur. Ek kayıtlar `dbA`/`dbB` üzerinden oluşturulur, ham `prisma` kullanılmaz.
> - Bir müşterinin aynı anda tek ACTIVE aboneliği olabildiği için her durum için yeni bir müşteri oluşturulur.
> - Testteki "şimdi" tek bir sabit andır.
>
> | Kayıt | Beklenen |
> |---|---|
> | A, bitişe 3 gün var | Listede |
> | A, bitiş 2 gün önce geçmiş | Listede, etiket "Süresi geçmiş" |
> | A, bitişe tam 7 gün var | Listede değil |
> | A'nın mevcut aboneliği (bitişe 30 gün var) | Listede değil |
> | A, bitişe 3 gün var ama sonra uygulamadaki `updateMany` biçimiyle yenilenmiş | Listede değil |
> | A, CANCELED, bitişe 3 gün var | Listede değil |
> | B, bitişe 3 gün var | A'nın listesinde yok, B'nin listesinde var (karşılaştırma) |
>
> Temizliği mevcut `testVerisiniTemizle` yapar, çünkü bütün kayıtları firma kimliğine göre siler. Ayrıca `kurallar.test.ts`'nin yeni dosyaları kabul ettiğini `npm test` çalıştırarak göreceğiz.
>
> ## ADR notu (`docs/02_ADR.md`, yeni bölüm)
>
> - **Bellekteki bağlantı listesi:** Tek Render sürecinde çalışır. İkinci bir instance açılırsa çalışmaz; o durumda harici bir servis gerekir, bu da kapsam dışıdır.
> - **Firma başına 20 bağlantı:** Sınır aşılınca yeni bağlantı reddedilir (429). En eskiyi kapatmamanın gerekçesi yeniden bağlanma döngüsüdür.
> - **Uyku ve kesinti:** Render uykudayken ya da yeniden başlarken yapılan iptallerin canlı uyarısı kaybolur. İptal kaydı veritabanında durduğu için veri kaybı yoktur.
> - **Çıkış:** Çıkış yapan kullanıcı `/giris` sayfasına gider. Bu sayfa `(panel)` layout'unun dışında olduğu için `UyariDinleyici` ekrandan kaldırılır ve bağlantı kapanır.
> - **Bilinen sınır:** Kullanıcı **başka bir sekmede** çıkış yaparsa, açık kalan sekmenin bağlantısı kopana kadar o firmanın uyarılarını almaya devam eder. Nedeni şu: oturum çerezi imzalı ama sunucuda tutulmuyor, bu yüzden sunucu çıkışı bilemiyor. Kullanıcı silinirse ya da rolü değişirse de aynı durum geçerli. Aşağıdaki öneri bu süreyi sınırlar.
>
> ## Elle test (yalnızca `npm run dev:test`)
>
> Dört pencere, Gün 6'dan kalan hesaplarla açılır:
>
> | Pencere | Tarayıcı | Hesap |
> |---|---|---|
> | 1 | Chrome, normal pencere | A, manager |
> | 2 | Chrome, gizli pencere | A, finance |
> | 3 | Safari, normal pencere | B, manager |
> | 4 | Safari, özel pencere | B, finance |
>
> Kontroller:
> 1. **Aynı firma:** Pencere 2'de iptal et. Uyarı pencere 1 ve 2'de görünmeli, 3 ve 4'te görünmemeli.
> 2. **Ters yön:** Pencere 3'te iptal et. Uyarı yalnızca 3 ve 4'te görünmeli.
> 3. **Başlıklar:** DevTools Network sekmesinde `events` isteğinin türü `eventsource` olmalı ve üç başlık görünmeli.
> 4. **Çıkış yapılmış pencere:** Pencere 4'te çıkış yap ve `http://localhost:3000/api/events` adresini aç. Yanıt 401 olmalı.
> 5. **Kopma ve yeniden bağlanma:** Sunucuyu `Control + C` ile durdurup yeniden başlat. Ayrıca DevTools'ta "Offline" seçip geri al. İki durumda da sayfada hata ekranı çıkmamalı ve yeni bir iptal uyarısı doğru pencerelere ulaşmalı.
> 6. **Riskli liste:** Kod bittikten sonra Neon SQL Editor'de, **test dalında olduğunu doğruladıktan sonra**, tek bir kaydı tek bir `UPDATE` komutuyla güncelleyeceğiz. Komutu o aşamada vereceğim.
>
> ## Kod sırası (her adım ayrı onayla)
>
> 1. `git switch -c gun10-sse` ile dalı oluştur. `ls` ile proxy ve middleware dosyalarının olup olmadığını kontrol et.
> 2. `sse-hub.ts` ve testini yaz, `npm test` çalıştır.
> 3. `route.ts` dosyasını yaz.
> 4. `actions.ts` dosyasına iptal yayınını ekle.
> 5. `UyariDinleyici.tsx` dosyasını yaz ve layout'a ekle.
> 6. Riskli abonelikler fonksiyonunu ve iki testini yaz, `npm test` ve `npm run test:db` çalıştır.
> 7. Dashboard kartını ekle.
> 8. ADR bölümünü ekle.
> 9. Elle testleri yap.
> 10. Üç taramayı çalıştır ve commit et (trailer'larla).
>
> Her yeni dosya önce `mkdir -p` ve `touch` ile boş oluşturulacak. Parantezli yollar tırnak içinde verilecek. İçeriği sen VS Code'a yapıştıracaksın.
>
> ## Varsayımlar
> - Render'da tek instance çalışıyor.
> - `/giris` sayfası `(panel)` grubunun dışında.
> - Kalp atışı aralığı 25 saniye.
>
> ## Emin olmadıklarım
> - Next.js'in sıkıştırmasının `no-transform` başlığına uyup uymadığı. Elle testin 1. adımında uyarı gecikirse buraya bakacağız.
> - Next 16.4'te tarayıcı bağlantıyı kapatınca isteğin iptal sinyalinin her durumda tetiklenip tetiklenmediği. Bu yüzden yazma hatası yedek temizlik yolu olarak kalıyor.
>
> ## Senden üç küçük şey
>
> 1. **Öneri (evet/hayır):** Bağlantıya azami ömür koyalım, örneğin 15 dakika. Sunucu 15 dakikada bir bağlantıyı kapatır, tarayıcı da güncel çerezle yeniden bağlanır. Çıkış yapılmış ya da silinmiş kullanıcı en geç 15 dakika içinde 401 alır. Yeni paket gerekmez, birkaç satırlık bir ektir ve ADR'deki bilinen sınırı daraltır.
> 2. `src/components/ui/Rozet.tsx` dosyasını gönder. "Süresi geçmiş" etiketi için kırmızı bir ton var mı bakacağım; yoksa sarı tonu simgeyle birlikte kullanacağım.
> 3. `docs/02_ADR.md` dosyasının son bölümünü gönder, ki yeni bölüm aynı biçimde yazılsın.
>
> **Kod aşamasına geçebilir miyim?** Onay verirsen 1. adımdan başlıyorum.

### Prompt 4 · 24 Eki 2026 08:33

````text
Son planı onaylıyorum, kod aşamasına geçebilirsin. Cevaplar ve eklemeler:

1. Bağlantıya azami ömür (15 dakika): evet. Yalnızca route.ts içinde olsun, sse-hub.ts ve testleri değişmesin. ADR'ye, yeniden bağlanma aralığında (retry 5 sn) kaçabilecek uyarı notunu ekle.
2. Rozet.tsx'i göndermiyorum. Tonlar: gri, indigo, yesil, kirmizi, sari (sari Gün 9'da eklendi). "Süresi geçmiş" kirmizi, "X gün kaldı" sari olsun. İkisinde de renk yanında simge ve metin olsun, anlam yalnızca renge bırakılmasın.
3. ADR'nin son bölümünü (Gün 9 kararları) biçim örneği olarak ekliyorum. Yeni bölüm aynı biçimde yazılsın: Durum, Sonuç, K10.x kararları, Test kapsamı, Elle test, Bilinen sınırlar, Süreç notları. Başlıktaki tarihi iş bittiğinde birlikte yazarız.
4. Commit: tek commit değil, küçük commit'ler: (a) sse-hub ve testi, (b) route.ts + actions.ts + UyariDinleyici + layout, (c) riskli abonelikler + testler + dashboard kartı, (d) ADR. Her commit öncesi üç tarama ve npm test / npm run test:db sonuçlarını göster.
5. package.json'a yalnızca dosya adı eklemeleri: tam dosya verme, hangi satırın sonuna ne eklendiğini ve perl komutunu ver.
6. Elle testten önce hatırlat: A ve B firmalarının test dalında en az 2'şer ACTIVE aboneliği olmalı, yoksa arayüzden oluşturacağım.
````

### Prompt 5 · 24 Eki 2026 08:33

_[ek dosya: adr_gun9_bolumu.txt]_

### Claude cevabı 4 · 24 Eki 2026 08:36

> Kod aşamasına başlıyoruz. Bu mesajda **Adım 1** (dal ve kontrol), **Adım 2** (`sse-hub` ve testi) ve **commit (a)** var. Sonuçları gönderdiğinde Adım 3'e (`route.ts`) geçeceğim.
>
> ---
>
> ## Adım 1 • Dal ve kontrol
>
> Önce GitHub Desktop'ta `main` dalındayken **Fetch origin** ve gerekiyorsa **Pull origin** yap. Böylece yeni dal güncel `main` üzerinden açılır. Sonra Terminal'de proje klasöründe şu komutları sırayla çalıştır.
>
> ```zsh
> git status
> ```
> Çalışma alanının temiz olduğunu gösterir. "nothing to commit, working tree clean" görmelisin.
>
> ```zsh
> git switch -c gun10-sse
> ```
> `gun10-sse` adlı yeni dalı açar ve o dala geçer.
>
> ```zsh
> ls -la src/proxy.ts src/middleware.ts
> ```
> Bu iki dosyanın var olup olmadığını gösterir. İki dosya için de "No such file or directory" bekliyorum. Dosyalardan biri varsa çıktıyı bana gönder ve Adım 3'ten önce bakalım.
>
> ---
>
> ## Adım 2 • `sse-hub.ts` ve testi
>
> ```zsh
> touch src/lib/sse-hub.ts src/lib/sse-hub.test.ts
> ```
> İki boş dosya oluşturur. `src/lib` klasörü zaten var.
>
> ### Yeni dosya oluştur: `src/lib/sse-hub.ts`
>
> Dosyayı VS Code'da aç ve içine aşağıdakini yapıştır.
>
> ```ts
> // SSE BAĞLANTI MERKEZİ (Gün 10)
> //
> // Açık SSE bağlantılarını firmaya (tenant) göre gruplar ve bir firmaya ait uyarıyı
> // YALNIZCA o firmanın bağlantılarına iletir.
> //
> // KİRACI İZOLASYONU: Liste "tenantId → bağlantılar" biçimindedir. Mesaj yalnızca
> // verilen tenantId'nin kümesine yazılır; başka firmanın bağlantısı bu kümede
> // olmadığı için mesajı alamaz. tenantId'yi çağıran taraf her zaman OTURUMDAN verir
> // (api/events/route.ts ve abonelikler/actions.ts), istemciden asla.
> //
> // BELLEKTE TUTULUR: Liste tek Render süreciyle çalışır (ADR, Gün 10). İkinci bir
> // sunucu süreci açılırsa birindeki iptali diğerindeki kullanıcılar duymaz.
> //
> // FİRMA BAŞINA SINIR: Bir firma en fazla FIRMA_BASINA_SINIR bağlantı açabilir.
> // Sınır doluysa YENİ bağlantı reddedilir, açık olanlara dokunulmaz. En eskiyi
> // kapatmak döngü yaratırdı: kapatılan sekme kendiliğinden yeniden bağlanır ve
> // başka bir sekmeyi düşürürdü.
> //
> // Bu dosya Next.js'e ve veritabanına bağlı değildir. Bu yüzden "npm test" ile
> // veritabanı olmadan test edilir (sse-hub.test.ts).
>
> // Bir firmanın aynı anda açık tutabileceği en fazla bağlantı (sekme) sayısı.
> export const FIRMA_BASINA_SINIR = 20;
>
> // Hub'ın bir bağlantıdan beklediği tek şey: metin gönderebilmek.
> // Bağlantı kapanmışsa gonder() hata fırlatır; hub bu bağlantıyı listeden çıkarır.
> export type Baglanti = {
>   gonder: (metin: string) => void;
> };
>
> // İstemciye iletilen uyarı. Şimdilik tek tür var: abonelik iptali.
> export type UyariOlayi = {
>   tur: "iptal";
>   musteriAdi: string;
> };
>
> // Abone olma sonucu. Sınır doluysa ok: false döner ve bağlantı eklenmez.
> export type AboneSonucu = { ok: true; ayril: () => void } | { ok: false };
>
> // Uyarıyı SSE biçimine çevirir:
> //   event: iptal
> //   data: {"musteriAdi":"..."}
> //   (boş satır: mesajın bittiğini gösterir)
> // JSON.stringify satır sonlarını "\n" diye kaçırır. Müşteri adında satır sonu
> // olsa bile "data:" satırı tek satır kalır ve SSE biçimi bozulmaz.
> export function sseMesaji(olay: UyariOlayi): string {
>   const { tur, ...veri } = olay;
>   return `event: ${tur}\ndata: ${JSON.stringify(veri)}\n\n`;
> }
>
> // Yeni bir hub üretir. Uygulama aşağıdaki tek örneği (sseHub) kullanır;
> // testler her seferinde temiz bir hub üretir ve isterse küçük bir sınır verir.
> export function hubOlustur(sinir: number = FIRMA_BASINA_SINIR) {
>   const firmalar = new Map<string, Set<Baglanti>>();
>
>   // Bağlantıyı listeden çıkarır. Firmanın son bağlantısıysa firma anahtarı da
>   // silinir (boş kümeler bellekte birikmesin diye).
>   function cikar(tenantId: string, baglanti: Baglanti): void {
>     const kume = firmalar.get(tenantId);
>     if (!kume) return;
>     kume.delete(baglanti);
>     if (kume.size === 0) firmalar.delete(tenantId);
>   }
>
>   // Bağlantıyı firmanın listesine ekler.
>   // Sınır kontrolü ve ekleme aynı senkron adımdadır. Node tek iş parçacığında
>   // çalıştığı için iki istek bu satırların arasına giremez.
>   function abone(tenantId: string, baglanti: Baglanti): AboneSonucu {
>     const mevcut = firmalar.get(tenantId);
>     if (mevcut && mevcut.size >= sinir) return { ok: false };
>
>     const kume = mevcut ?? new Set<Baglanti>();
>     kume.add(baglanti);
>     firmalar.set(tenantId, kume);
>
>     let ayrildi = false;
>     return {
>       ok: true,
>       // Birden fazla kez çağrılması zararsızdır (ör. hem tarayıcı kapanması
>       // hem 15 dakikalık ömrün dolması aynı anda olursa).
>       ayril: () => {
>         if (ayrildi) return;
>         ayrildi = true;
>         cikar(tenantId, baglanti);
>       },
>     };
>   }
>
>   // Uyarıyı yalnızca verilen firmanın bağlantılarına gönderir.
>   // Gönderimde hata veren (kapanmış) bağlantı listeden çıkarılır, diğerleri
>   // etkilenmez. Dönen değer: mesajın ulaştığı bağlantı sayısı.
>   function yayinla(tenantId: string, olay: UyariOlayi): number {
>     const kume = firmalar.get(tenantId);
>     if (!kume) return 0;
>
>     const metin = sseMesaji(olay);
>     let ulasan = 0;
>     // Kopya üzerinde dönülür: döngü sırasında bozuk bağlantı kümeden silinebilir.
>     for (const baglanti of [...kume]) {
>       try {
>         baglanti.gonder(metin);
>         ulasan++;
>       } catch {
>         cikar(tenantId, baglanti);
>       }
>     }
>     return ulasan;
>   }
>
>   // Firmanın açık bağlantı sayısı (testler ve kontrol için).
>   function baglantiSayisi(tenantId: string): number {
>     return firmalar.get(tenantId)?.size ?? 0;
>   }
>
>   // Listede en az bir bağlantısı olan firma sayısı (testler için).
>   function firmaSayisi(): number {
>     return firmalar.size;
>   }
>
>   return { abone, yayinla, baglantiSayisi, firmaSayisi };
> }
>
> export type SseHub = ReturnType<typeof hubOlustur>;
>
> // Uygulamanın kullandığı TEK hub örneği. globalThis üzerinde saklanır. İki nedeni var:
> // 1. Geliştirme modunda Next.js dosyaları yeniden yüklediğinde liste kaybolmaz.
> // 2. Route dosyası (api/events) ile sunucu işlemi (actions.ts) Next.js tarafından
> //    ayrı paketlerde derlenebilir. globalThis, ikisinin aynı listeyi görmesini sağlar.
> const depo = globalThis as typeof globalThis & { abonetakipSseHub?: SseHub };
> export const sseHub: SseHub = depo.abonetakipSseHub ?? hubOlustur();
> depo.abonetakipSseHub = sseHub;
> ```
>
> ### Yeni dosya oluştur: `src/lib/sse-hub.test.ts`
>
> ```ts
> // SSE BAĞLANTI MERKEZİ TESTLERİ (Gün 10)
> //
> // Veritabanı kullanılmaz: gerçek bağlantı yerine, gelen mesajları bir diziye
> // yazan sahte bağlantılar kullanılır. Her test kendi temiz hub'ını üretir.
> // Çalıştırmak için: npm test
>
> import { describe, test } from "node:test";
> import assert from "node:assert/strict";
> import {
>   FIRMA_BASINA_SINIR,
>   hubOlustur,
>   sseMesaji,
>   type AboneSonucu,
>   type Baglanti,
>   type UyariOlayi,
> } from "./sse-hub.ts";
>
> const OLAY: UyariOlayi = { tur: "iptal", musteriAdi: "Örnek Müşteri" };
>
> // Gelen mesajları biriktiren sahte bağlantı.
> function sahteBaglanti() {
>   const gelenler: string[] = [];
>   const baglanti: Baglanti = {
>     gonder: (metin) => {
>       gelenler.push(metin);
>     },
>   };
>   return { baglanti, gelenler };
> }
>
> // Kapanmış bağlantıyı taklit eder: her gönderimde hata fırlatır.
> function bozukBaglanti(): Baglanti {
>   return {
>     gonder: () => {
>       throw new Error("bağlantı kapalı");
>     },
>   };
> }
>
> // Bağlantının kabul edildiğini doğrular ve ayrılma fonksiyonunu döner.
> function kabulEdildi(sonuc: AboneSonucu): () => void {
>   if (!sonuc.ok) throw new Error("Bağlantı beklenmedik biçimde reddedildi.");
>   return sonuc.ayril;
> }
>
> describe("Kiracı izolasyonu", () => {
>   test("A firmasına yayınlanan mesaj B'nin bağlantısına gitmez", () => {
>     const hub = hubOlustur();
>     const a = sahteBaglanti();
>     const b = sahteBaglanti();
>     kabulEdildi(hub.abone("A", a.baglanti));
>     kabulEdildi(hub.abone("B", b.baglanti));
>
>     assert.equal(hub.yayinla("A", OLAY), 1);
>     assert.equal(a.gelenler.length, 1);
>     assert.equal(b.gelenler.length, 0, "B'nin bağlantısı A'nın uyarısını aldı.");
>   });
>
>   test("aynı firmadaki iki bağlantının ikisi de mesajı alır", () => {
>     const hub = hubOlustur();
>     const a1 = sahteBaglanti();
>     const a2 = sahteBaglanti();
>     kabulEdildi(hub.abone("A", a1.baglanti));
>     kabulEdildi(hub.abone("A", a2.baglanti));
>
>     assert.equal(hub.yayinla("A", OLAY), 2);
>     assert.deepEqual(a1.gelenler, [sseMesaji(OLAY)]);
>     assert.deepEqual(a2.gelenler, [sseMesaji(OLAY)]);
>   });
> });
>
> describe("Bağlantı yaşam döngüsü", () => {
>   test("ayrılan bağlantı sonraki mesajı almaz ve listeden silinir", () => {
>     const hub = hubOlustur();
>     const a1 = sahteBaglanti();
>     const a2 = sahteBaglanti();
>     const ayril = kabulEdildi(hub.abone("A", a1.baglanti));
>     kabulEdildi(hub.abone("A", a2.baglanti));
>
>     ayril();
>     assert.equal(hub.baglantiSayisi("A"), 1);
>
>     hub.yayinla("A", OLAY);
>     assert.equal(a1.gelenler.length, 0, "Ayrılan bağlantı mesaj aldı.");
>     assert.equal(a2.gelenler.length, 1);
>   });
>
>   test("firmanın son bağlantısı da ayrılınca firma listeden silinir", () => {
>     const hub = hubOlustur();
>     const ayril = kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     assert.equal(hub.firmaSayisi(), 1);
>
>     ayril();
>     assert.equal(hub.firmaSayisi(), 0);
>     assert.equal(hub.yayinla("A", OLAY), 0);
>   });
>
>   test("gönderimde hata veren bağlantı çıkarılır, diğerleri almaya devam eder", () => {
>     const hub = hubOlustur();
>     const a = sahteBaglanti();
>     kabulEdildi(hub.abone("A", bozukBaglanti()));
>     kabulEdildi(hub.abone("A", a.baglanti));
>
>     assert.equal(hub.yayinla("A", OLAY), 1);
>     assert.equal(hub.baglantiSayisi("A"), 1, "Bozuk bağlantı listeden çıkarılmadı.");
>
>     // İkinci yayında bozuk bağlantı artık denenmez.
>     assert.equal(hub.yayinla("A", OLAY), 1);
>     assert.equal(a.gelenler.length, 2);
>   });
>
>   test("ayrılma iki kez çağrılırsa başka bağlantıya zarar vermez", () => {
>     const hub = hubOlustur();
>     const a2 = sahteBaglanti();
>     const ayril = kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     kabulEdildi(hub.abone("A", a2.baglanti));
>
>     ayril();
>     ayril();
>     assert.equal(hub.baglantiSayisi("A"), 1);
>     hub.yayinla("A", OLAY);
>     assert.equal(a2.gelenler.length, 1);
>   });
> });
>
> describe("Firma başına bağlantı sınırı", () => {
>   test("sınıra kadar kabul edilir, fazlası reddedilir ve mesaj almaz", () => {
>     const hub = hubOlustur(2);
>     kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>
>     const fazla = sahteBaglanti();
>     assert.equal(hub.abone("A", fazla.baglanti).ok, false);
>     assert.equal(hub.baglantiSayisi("A"), 2);
>
>     assert.equal(hub.yayinla("A", OLAY), 2);
>     assert.equal(fazla.gelenler.length, 0, "Reddedilen bağlantı mesaj aldı.");
>   });
>
>   test("bir bağlantı ayrılınca yeni bağlantı tekrar kabul edilir", () => {
>     const hub = hubOlustur(2);
>     const ayril = kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, false);
>
>     ayril();
>     assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, true);
>     assert.equal(hub.baglantiSayisi("A"), 2);
>   });
>
>   test("A firmasının sınırı dolu olsa da B'nin bağlantısı kabul edilir", () => {
>     const hub = hubOlustur(2);
>     kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, false);
>
>     assert.equal(hub.abone("B", sahteBaglanti().baglanti).ok, true);
>   });
>
>   test("varsayılan sınır 20'dir", () => {
>     assert.equal(FIRMA_BASINA_SINIR, 20);
>     const hub = hubOlustur();
>     for (let i = 0; i < FIRMA_BASINA_SINIR; i++) {
>       kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
>     }
>     assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, false);
>   });
> });
>
> describe("Mesaj biçimi", () => {
>   test("SSE biçimindedir ve müşteri adındaki satır sonu biçimi bozmaz", () => {
>     assert.equal(
>       sseMesaji(OLAY),
>       'event: iptal\ndata: {"musteriAdi":"Örnek Müşteri"}\n\n'
>     );
>
>     // Satır sonu "\n" olarak kaçırılır: tek bir "data:" satırı kalır.
>     const metin = sseMesaji({ tur: "iptal", musteriAdi: "Satır 1\nSatır 2" });
>     assert.deepEqual(metin.split("\n"), [
>       "event: iptal",
>       'data: {"musteriAdi":"Satır 1\\nSatır 2"}',
>       "",
>       "",
>     ]);
>   });
> });
> ```
>
> **Plana göre küçük farklar:** Plandaki 8 teste iki test ekledim: "ayrılma iki kez çağrılırsa" ve "varsayılan sınır 20". Ayrıca bir "Mesaj biçimi" testi var. İlki, onayladığın 15 dakikalık ömür ile tarayıcı kapanmasının aynı anda olması durumunu güvenceye alır. Toplam **11 test** oldu. Fazla bulursan çıkarırım.
>
> ### `package.json`: `test` satırına dosya adı ekleme
>
> ```zsh
> perl -i -pe 's{src/test-destek/canli-koruma\.test\.ts"}{src/test-destek/canli-koruma.test.ts src/lib/sse-hub.test.ts"} if /^\s*"test":/' package.json
> ```
> Bu komut yalnızca `"test":` ile başlayan satırda, `canli-koruma.test.ts` dosya adının sonuna ` src/lib/sse-hub.test.ts` ekler. Değişiklik şöyle görünür:
>
> - Önce: `... src/test-destek/canli-koruma.test.ts",`
> - Sonra: `... src/test-destek/canli-koruma.test.ts src/lib/sse-hub.test.ts",`
>
> ```zsh
> git --no-pager diff package.json
> ```
> Değişikliği gösterir. Yalnızca `"test":` satırı değişmiş olmalı: bir satır kırmızı, bir satır yeşil.
>
> ### Testleri çalıştır
>
> ```zsh
> npm test
> ```
> Veritabanı gerektirmeyen testleri çalıştırır. Gün 9'da 59 testti; **70 test** ve `fail 0` bekliyorum.
>
> ```zsh
> npm run test:db
> ```
> Neon test dalındaki testleri çalıştırır. Bu adımda değişen bir şey yok; Gün 9'daki gibi **44 test** ve `fail 0` bekliyorum.
>
> ---
>
> ## Commit (a)
>
> **Önemli bir ayrıntı:** Üçüncü tarama `--cached` ile çalışır, yani Git'in hazırlık alanına (index) bakar. GitHub Desktop'ta kutucuk işaretlemek dosyayı bu alana commit anında koyar. Önceden işaretlemek yeterli olmaz. Yeni dosyalar hazırlık alanına girmeden yapılan tarama onları görmez ve "0" sonucu yanıltıcı olur. Bu yüzden dosyaları taramadan **önce** terminalden ekliyoruz. Bu push değildir, yalnızca hazırlıktır. Gün 9'da farklı bir yol izlediysen söyle, ona uyalım.
>
> ```zsh
> git add src/lib/sse-hub.ts src/lib/sse-hub.test.ts package.json
> ```
> Üç dosyayı commit'e hazırlar.
>
> ```zsh
> git status
> ```
> "Changes to be committed" altında yalnızca bu üç dosyayı görmelisin.
>
> **Tarama 1 (parola):**
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> Çıktı **boş** olmalı.
>
> **Tarama 2 (sunucu adı):**
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> Sonuç **0** olmalı.
>
> **Tarama 3 (kişi adı):**
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
> Sonuç **0** olmalı.
>
> **Commit:** GitHub Desktop'ta `gun10-sse` dalında olduğunu kontrol et ve iki alanı şöyle doldur.
>
> - **Summary:**
>   ```
>   feat: SSE bağlantı merkezi (sse-hub) ve birim testleri
>   ```
> - **Description:**
>   ```
>   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
>   Claude-Session: [önceki günlerdeki satırın aynısı]
>   ```
>
> Henüz **Publish branch** yapma. Dört commit bitince yayınlayalım; istersen her commit'ten sonra da yayınlayabilirsin, bu senin tercihin.
>
> ---
>
> **Bana gönder:** `ls` çıktısı, `npm test` ve `npm run test:db` sonuçlarının son satırları (`tests`, `pass`, `fail`) ve üç taramanın sonuçları. Ardından Adım 3'e (`route.ts`) geçeceğim.
>
> **Varsayımlar:** `tsconfig.json`, testlerdeki `.ts` uzantılı içe aktarmalara izin veriyor (`tenant.test.ts` de böyle yazılmış). `kurallar.test.ts` yeni dosyalara itiraz etmeyecek; `npm test` bunu gösterecek.
>
> **Emin olmadığım:** Next.js'in route dosyasını ve sunucu işlemini ayrı paketlerde derleyip derlemediği. `globalThis` kullanımı bu belirsizliği zararsız kılıyor, ama asıl kanıt elle testin 1. adımında uyarının diğer pencereye ulaşması olacak.

### Prompt 6 · 24 Eki 2026 08:37

````text
Üzerinde bulunulan dal: main
Dalınız "origin/main" ile güncel.

İşlenecek bir şey yok, çalışma ağacı temiz
kullanici@bilgisayar abonetakip % git switch -c gun10-sse
Yeni 'gun10-sse' dalına geçildi.
kullanici@bilgisayar abonetakip % ls -la src/proxy.ts src/middleware.ts
ls: src/middleware.ts: No such file or directory
ls: src/proxy.ts: No such file or directory
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 5 · 24 Eki 2026 08:37

> Adım 1 tamam: `gun10-sse` dalındasın ve `proxy.ts` ile `middleware.ts` yok. Yani `/api/events` isteğini araya girip yönlendirecek bir dosya bulunmuyor; uç nokta 401 ve 429 yanıtlarını doğrudan tarayıcıya dönebilir.
>
> Şimdi önceki mesajdaki **Adım 2** ile devam et:
>
> 1. `touch` ile iki boş dosyayı oluştur, sonra `sse-hub.ts` ve `sse-hub.test.ts` içeriklerini VS Code'a yapıştırıp kaydet (`Cmd + S`).
> 2. `perl` komutuyla `package.json`'daki `test` satırına dosya adını ekle ve `git --no-pager diff package.json` ile yalnızca o satırın değiştiğini kontrol et.
> 3. `npm test` (beklenen: 70 test, `fail 0`) ve `npm run test:db` (beklenen: 44 test, `fail 0`) komutlarını çalıştır.
> 4. Commit (a) bölümündeki `git add`, `git status` ve üç taramayı çalıştır. **Commit'i henüz yapma.**
>
> Bana şunları gönder:
> - `git --no-pager diff package.json` çıktısı
> - `npm test` ve `npm run test:db` için `tests`, `pass`, `fail` satırları (bir test başarısız olursa hata mesajının tamamı)
> - `git status` çıktısı
> - Üç taramanın sonuçları
>
> Hepsi beklendiği gibiyse GitHub Desktop'ta commit (a)'yı yapmanı söyleyeceğim, ardından Adım 3'e (`route.ts`) geçeceğiz.

### Prompt 7 · 24 Eki 2026 08:45

````text
Adım 1 ve 2 tamam, commit (a) atıldı. npm test 70/70, npm run test:db 44/44, üç tarama temiz. Adım 3'e (route.ts) geçebilirsin.
````

### Claude cevabı 6 · 24 Eki 2026 08:46

> # Adım 3 • `route.ts` (SSE uç noktası)
>
> Bu adım yalnızca bu dosyayı içeriyor. `actions.ts`, `UyariDinleyici.tsx` ve layout sonraki adımlarda geliyor. Commit (b) hepsi bittikten sonra atılacak, şimdilik commit yok.
>
> ```zsh
> mkdir -p src/app/api/events
> ```
> `api/events` klasörünü oluşturur.
>
> ```zsh
> touch src/app/api/events/route.ts
> ```
> Boş dosyayı oluşturur.
>
> ### Yeni dosya oluştur: `src/app/api/events/route.ts`
>
> ```ts
> // SSE UÇ NOKTASI (Gün 10): GET /api/events
> //
> // Giriş yapmış manager ve finance kullanıcılarının tarayıcısı bu adrese bağlanır
> // ve bağlantıyı açık tutar. Sunucu, kullanıcının firmasına ait uyarıları
> // (şimdilik abonelik iptali) bu bağlantıdan gönderir.
> //
> // KİRACI İZOLASYONU: tenantId yalnızca getCurrentUser() sonucundan, yani
> // veritabanından okunur. URL, sorgu parametresi veya çerezden alınmaz.
> //
> // YANIT KODLARI (bu uç nokta sayfa değil API'dir, bu yüzden requireUser()
> // kullanılmaz: o fonksiyon giriş sayfasına yönlendirir):
> //   401: giriş yapılmamış
> //   403: rol uygun değil
> //   429: firmanın bağlantı sınırı dolu (bkz. sse-hub.ts)
> // Tarayıcının EventSource nesnesi 200 dışındaki yanıtta yeniden bağlanmayı
> // bırakır. UyariDinleyici bu durumda sessizce durur.
> //
> // BAĞLANTI ÖMRÜ: Her bağlantı en fazla 15 dakika sürer, sonra sunucu kapatır.
> // Tarayıcı "retry" değeri kadar (5 sn) bekleyip güncel çerezle yeniden bağlanır.
> // Böylece çıkış yapmış ya da silinmiş kullanıcı en geç 15 dakika içinde 401 alır.
> // Bu 5 saniyelik aralıkta yapılan iptalin canlı uyarısı kaçabilir (ADR, Gün 10).
> // Bu ömür yalnızca bu dosyadadır; sse-hub.ts bilmez.
>
> import { getCurrentUser } from "@/lib/auth";
> import { sseHub, type Baglanti } from "@/lib/sse-hub";
>
> // Cevap her istekte yeniden üretilir, önbelleğe alınmaz.
> export const dynamic = "force-dynamic";
> // Prisma ve oturum kodu Node ister (edge kullanılmaz, ADR).
> export const runtime = "nodejs";
>
> const IZINLI_ROLLER = new Set<string>(["manager", "finance"]);
>
> // Tarayıcıya "koparsan 5 saniye sonra yeniden bağlan" der.
> const YENIDEN_BAGLANMA_MS = 5_000;
> // Boşta duran bağlantıyı proxy ve tarayıcı kesmesin diye gönderilen boş satır aralığı.
> const KALP_ATISI_MS = 25_000;
> // Bir bağlantının azami ömrü.
> const BAGLANTI_OMRU_MS = 15 * 60 * 1000;
>
> // Hata yanıtı: kısa düz metin, önbelleğe alınmaz.
> function hataYaniti(durum: number, mesaj: string): Response {
>   return new Response(mesaj, {
>     status: durum,
>     headers: {
>       "Content-Type": "text/plain; charset=utf-8",
>       "Cache-Control": "no-store",
>     },
>   });
> }
>
> export async function GET(request: Request): Promise<Response> {
>   const kullanici = await getCurrentUser();
>   if (!kullanici) {
>     return hataYaniti(401, "Giriş yapmanız gerekiyor.");
>   }
>   if (!IZINLI_ROLLER.has(kullanici.role)) {
>     return hataYaniti(403, "Bu uyarıları görme yetkiniz yok.");
>   }
>
>   const kodlayici = new TextEncoder();
>   let akis: ReadableStreamDefaultController<Uint8Array> | null = null;
>   let kapandi = false;
>   let kalpAtisi: ReturnType<typeof setInterval> | undefined;
>   let omurSayaci: ReturnType<typeof setTimeout> | undefined;
>   let listedenAyril: () => void = () => {};
>
>   // Her kapanış yolu (tarayıcı kapandı, yazma hatası, 15 dakika doldu) buraya gelir.
>   // Birden fazla kez çağrılması zararsızdır.
>   function temizle(): void {
>     if (kapandi) return;
>     kapandi = true;
>     clearInterval(kalpAtisi);
>     clearTimeout(omurSayaci);
>     listedenAyril();
>     try {
>       akis?.close();
>     } catch {
>       // Akış zaten kapanmış olabilir.
>     }
>   }
>
>   // Hub'ın bağlantıdan beklediği tek şey: metin gönderebilmek.
>   // Yazma hata verirse bağlantı kopmuştur: zamanlayıcılar durdurulur ve hata
>   // yukarı fırlatılır, hub da bağlantıyı listeden çıkarır (yedek temizlik yolu).
>   const baglanti: Baglanti = {
>     gonder: (metin) => {
>       if (!akis || kapandi) throw new Error("Bağlantı kapalı.");
>       try {
>         akis.enqueue(kodlayici.encode(metin));
>       } catch (hata) {
>         temizle();
>         throw hata;
>       }
>     },
>   };
>
>   // tenantId oturumdan gelir. Sınır doluysa yeni bağlantı reddedilir.
>   const sonuc = sseHub.abone(kullanici.tenantId, baglanti);
>   if (!sonuc.ok) {
>     return hataYaniti(429, "Bu firma için açık bağlantı sınırına ulaşıldı.");
>   }
>   listedenAyril = sonuc.ayril;
>
>   // Abone olma ile akışın kurulması arasında await yoktur: bu iki adımın arasına
>   // başka bir istek ya da yayın giremez.
>   const govde = new ReadableStream<Uint8Array>({
>     start(controller) {
>       akis = controller;
>       controller.enqueue(kodlayici.encode(`retry: ${YENIDEN_BAGLANMA_MS}\n\n`));
>       kalpAtisi = setInterval(() => {
>         try {
>           controller.enqueue(kodlayici.encode(": nabiz\n\n"));
>         } catch {
>           temizle();
>         }
>       }, KALP_ATISI_MS);
>       omurSayaci = setTimeout(temizle, BAGLANTI_OMRU_MS);
>     },
>     // Tarayıcı sekmeyi kapatınca ya da bağlantıyı bırakınca çağrılır.
>     cancel() {
>       temizle();
>     },
>   });
>
>   // İkinci temizlik yolu: isteğin iptal sinyali.
>   if (request.signal.aborted) {
>     temizle();
>   } else {
>     request.signal.addEventListener("abort", temizle, { once: true });
>   }
>
>   return new Response(govde, {
>     status: 200,
>     headers: {
>       "Content-Type": "text/event-stream; charset=utf-8",
>       "Cache-Control": "no-cache, no-transform",
>       "X-Accel-Buffering": "no",
>     },
>   });
> }
> ```
>
> ## Kontroller
>
> ```zsh
> npx tsc --noEmit
> ```
> TypeScript tip kontrolünü yapar, dosya üretmez. Hata çıkmamalı. `tsc` bu projede hazır geliyor (`typescript` devDependencies içinde).
>
> ```zsh
> npm run lint
> ```
> Kod stili kontrolü. Yeni uyarı ya da hata çıkmamalı.
>
> ```zsh
> npm test
> ```
> 70 test ve `fail 0` kalmalı. `kurallar.test.ts` yeni dosyayı kural dışı bulursa hata mesajının tamamını gönder.
>
> Şimdi uç noktanın giriş yapılmamış kullanıcıyı reddettiğini görelim. Terminal 1'de uygulamayı test dalıyla başlat (**`npm run dev` değil**):
>
> ```zsh
> npm run dev:test
> ```
> Uygulamayı `.env.test` ile, Neon test dalına bağlı başlatır. Canlı veritabanı koruması burada devreye girer.
>
> Terminal 2'de (yeni sekme: `Cmd + T`, proje klasöründe):
>
> ```zsh
> curl -i http://localhost:3000/api/events
> ```
> Adrese çerezsiz istek atar ve yanıt başlıklarını gösterir. `HTTP/1.1 401` ve `Giriş yapmanız gerekiyor.` bekliyorum. Bu isteğin bir çerezi olmadığı için veritabanına gitmeden reddedilmesi gerekir. Sonra Terminal 1'de `Control + C` ile uygulamayı durdur.
>
> Başarılı (200) bağlantıyı şimdi denemiyoruz. İptal yayını ve dinleyici bileşeni olmadan görecek bir şey yok. Onu elle testte yapacağız.
>
> ## Tasarım notları
>
> - **Tek `temizle()` fonksiyonu:** Tarayıcı kapanması, yazma hatası ve 15 dakikalık ömür aynı fonksiyona çıkar. Zamanlayıcılar ve listedeki kayıt birlikte temizlenir. Böylece bir yol çalışmasa bile bellekte sızıntı kalmaz.
> - **`retry: 5000` ilk satır:** Tarayıcı kopunca 5 saniye bekleyip yeniden bağlanır. 15 dakikalık ömür dolduğunda da aynı mekanizma çalışır. Bu aralıktaki iptallerin canlı uyarısı kaçabilir, ADR'ye yazacağız.
> - **429 ve yeniden bağlanma:** `EventSource`, 200 dışındaki yanıtta bağlantıyı kapatır ve yeniden denemez. 21. sekmede dinleyici bu yüzden sessizce durur, döngü oluşmaz.
> - **`Connection: keep-alive` başlığını eklemedim.** HTTP/2'de geçersizdir ve gerek yok. İstediğin üç başlık yerinde.
>
> ## Varsayımlar
>
> - `getCurrentUser()` route dosyasında da çalışır. `cookies()` ve `cache()` route handler'larda desteklenir ama bunu doğrulamadım. İlk gerçek kanıt elle testte gelecek.
> - `AktifKullanici.role` tipi `Role` olduğu için `Set<string>` ile karşılaştırma TypeScript'te sorun çıkarmaz. `tsc` bunu gösterecek.
>
> ## Emin olmadıklarım
>
> - Next.js'in `request.signal` ve `cancel()` yollarının her durumda tetiklenip tetiklenmediği. Bu yüzden yazma hatası ve 15 dakikalık ömür yedek olarak duruyor.
> - `getCurrentUser()` veritabanı hatası fırlatırsa Next.js 500 döner. İstemci bunu 200 dışı yanıt sayıp bırakır. Bilinçli olarak ayrıca yakalamadım.
>
> ## Bana gönder
>
> - `npx tsc --noEmit` ve `npm run lint` sonuçları (hata yoksa "temiz" yazman yeterli)
> - `npm test` son satırları (`tests`, `pass`, `fail`)
> - `curl -i` çıktısının ilk satırı ve gövdesi
>
> Hepsi beklendiği gibiyse **Adım 4**'e (`actions.ts` içindeki `abonelikIptal` değişikliği) geçeceğim.

### Prompt 8 · 24 Eki 2026 08:48

````text
kullanici@bilgisayar abonetakip % curl -i http://localhost:3000/api/events
HTTP/1.1 401 Unauthorized
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
cache-control: no-store
content-type: text/plain; charset=utf-8
Date: Sat, 24 Oct 2026 05:48:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
````

### Claude cevabı 7 · 24 Eki 2026 08:48

> `curl` sonucu beklendiği gibi. Yanıt **401** ve `content-type: text/plain`, `cache-control: no-store` başlıkları da yerinde. Çerezsiz istek veritabanına gitmeden reddedildi. `Connection: keep-alive` satırını Node kendisi ekliyor, bizim kodumuzdan gelmiyor.
>
> Henüz Adım 4'e geçmiyorum, çünkü üç şey eksik:
>
> 1. **Gövde:** Çıktıda başlıkların altında `Giriş yapmanız gerekiyor.` satırını göremedim. Muhtemelen kopyalarken kesildi. Terminalde başlıkların altına bakıp var olduğunu doğrular mısın?
> 2. **Tip ve stil kontrolleri:** `npx tsc --noEmit` ve `npm run lint` sonuçlarını göndermedin. Hata yoksa "temiz" yazman yeterli.
> 3. **Testler:** `npm test` son satırları (`tests`, `pass`, `fail`). `kurallar.test.ts` yeni `route.ts` dosyasına itiraz edebilir, bu yüzden bunu görmeden ilerlemek istemiyorum. Beklenen 70 test ve `fail 0`.
>
> Ayrıca Terminal 1'deki `npm run dev:test` hâlâ açıksa `Control + C` ile durdur.
>
> Üçü de temizse Adım 4'e (`actions.ts` içindeki `abonelikIptal` değişikliği) geçeceğim.

### Prompt 9 · 24 Eki 2026 08:48

````text
Last login: Thu Oct 22 23:39:13 on ttys001
kullanici@bilgisayar abonetakip % curl -i http://localhost:3000/api/events
HTTP/1.1 401 Unauthorized
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
cache-control: no-store
content-type: text/plain; charset=utf-8
Date: Sat, 24 Oct 2026 05:48:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

Giriş yapmanız gerekiyor.%                                                                                      kullanici@bilgisayar abonetakip %
````

### Claude cevabı 8 · 24 Eki 2026 08:48

> Gövde de doğru: `Giriş yapmanız gerekiyor.` görünüyor (sondaki `%` işareti zsh'nin "satır sonu yok" göstergesi, sorun değil). Yani uç nokta çerezsiz isteği 401 ile reddediyor.
>
> Hâlâ eksik olanlar (bunları göndermeden Adım 4'e geçmiyorum):
>
> 1. `npx tsc --noEmit` sonucu
> 2. `npm run lint` sonucu
> 3. `npm test` son satırları (`tests`, `pass`, `fail`). Beklenen: 70 test, `fail 0`. `kurallar.test.ts` yeni `route.ts` dosyasına itiraz edebileceği için bunu özellikle görmek istiyorum.
>
> Terminal 1'deki `npm run dev:test` açıksa `Control + C` ile durdur. `npm test` ve `tsc` için sunucunun çalışması gerekmiyor.
>
> Hata çıkarsa mesajın tamamını gönder, birlikte bakarız. Üçü de temizse **Adım 4**'e (`actions.ts` içindeki `abonelikIptal` değişikliği) geçeceğim.

### Prompt 10 · 24 Eki 2026 08:49

````text
HER ŞEY BEKLEDİĞİMİZ GİB
````

### Claude cevabı 9 · 24 Eki 2026 08:49

> Mesajın "GİBİ" kısmında kesilmiş görünüyor. `tsc`, `lint` ve `npm test` (70 test, `fail 0`) temiz çıktı diye okuyorum. Yanlışsa söyle, Adım 4'ü geri alırız.
>
> # Adım 4 • `abonelikIptal` içine yayın ekleme
>
> Yalnızca `src/app/(panel)/abonelikler/actions.ts` değişiyor ve yalnızca `abonelikIptal` fonksiyonuna dokunuyoruz. Başlatma ve yenileme olduğu gibi kalıyor. Dosyayı VS Code'da aç. Üç küçük değişiklik var, her birini `Cmd + F` ile bul ve değiştir.
>
> ### Değişiklik 1: import ekle
>
> Dosyanın en üstündeki import bloğunun sonunda şu satırlar var:
>
> ```ts
> import {
>   MESAJ,
>   formMetni,
>   tekrarEdenKayitMi,
>   type FormDurumu,
> } from "@/lib/islem";
> ```
>
> Bu bloğun **hemen altına** (boş satır bırakarak) şu satırı ekle:
>
> ```ts
> import { sseHub } from "@/lib/sse-hub";
> ```
>
> ### Değişiklik 2: müşteri adını da seç
>
> `abonelikIptal` içinde şu bloğu bul. Dosyada `select: { status: true },` yazan **tek** yer burasıdır:
>
> ```ts
>   const abonelik = await db.subscription.findFirst({
>     where: { id: kimlik.deger },
>     select: { status: true },
>   });
> ```
>
> Şununla değiştir:
>
> ```ts
>   const abonelik = await db.subscription.findFirst({
>     where: { id: kimlik.deger },
>     select: { status: true, customer: { select: { name: true } } },
>   });
> ```
>
> Sorgu yine `getTenantDb()` üzerinden çalışır. Müşteri adı, aboneliğin kendi firmasının müşterisinden gelir.
>
> ### Değişiklik 3: başarıdan sonra yayın
>
> Fonksiyonun en sonunda şu iki satırı bul. `"Abonelik iptal edildi."` metni dosyada bir kez geçer:
>
> ```ts
>   revalidatePath("/abonelikler");
>   return { durum: "basarili", mesaj: "Abonelik iptal edildi." };
> ```
>
> Şununla değiştir:
>
> ```ts
>   // İptal veritabanına yazıldı: aynı firmanın açık bağlantılarına canlı uyarı gider.
>   // tenantId OTURUMDAN gelir (kullanici). Buraya yalnızca işlem başarılıysa gelinir:
>   // çift tıklamada (iptalEdildi false) ve hatada yukarıda zaten return edilmiştir,
>   // bu yüzden uyarı iki kez gitmez ve olmamış iptal için çıkmaz.
>   // Uyarı gönderilemese bile iptal başarılıdır: hata yutulur, kullanıcıya gösterilmez.
>   try {
>     sseHub.yayinla(kullanici.tenantId, {
>       tur: "iptal",
>       musteriAdi: abonelik.customer.name,
>     });
>   } catch {
>     console.error("İptal uyarısı gönderilemedi.");
>   }
>
>   revalidatePath("/abonelikler");
>   return { durum: "basarili", mesaj: "Abonelik iptal edildi." };
> ```
>
> Kaydet (`Cmd + S`).
>
> ## Kontroller
>
> ```zsh
> git --no-pager diff src/app/\(panel\)/abonelikler/actions.ts
> ```
> Değişikliği gösterir. Yalnızca bir import satırı, `select` satırı ve yayın bloğu eklenmiş olmalı. Başka satır kırmızı ya da yeşil olmamalı. Parantezlerin önündeki `\` zsh için kaçış işaretidir.
>
> ```zsh
> npx tsc --noEmit
> ```
> Hata çıkmamalı. `abonelik.customer.name` tipinin tanındığını bu komut gösterir.
>
> ```zsh
> npm run lint
> ```
> Yeni uyarı çıkmamalı.
>
> ```zsh
> npm test
> ```
> 70 test ve `fail 0` kalmalı. `kurallar.test.ts` bu dosyada yeni bir `import` ya da kural ihlali görürse hata mesajının tamamını gönder.
>
> ## Tasarım notları
>
> - **Uyarı, `revalidatePath`'ten önce gider.** İkisi de başarılı iptalden sonra çalışır, sırası sonucu değiştirmez.
> - **İptali yapan kişi de uyarıyı görür**, çünkü kendi firmasının bağlantısı listede. Elle testte bunu göreceğiz.
> - **`tenantId` istemciden gelmez.** Kaynak `requireUser()` sonucudur, tıpkı olay kaydındaki `tenantId` gibi.
> - **Yeni otomatik test eklemiyorum.** Bu fonksiyon sunucu işlemi ve `next/cache` kullandığı için mevcut test düzeninde doğrudan çağrılmıyor. Bu bağlantıyı elle testin 1. ve 2. adımları kanıtlayacak. Hub'ın firma ayrımı zaten `sse-hub.test.ts` ile test edildi.
>
> **Varsayımlar:** `abonelik` değişkeni, iptalden sonra da erişilebilir durumda. Evet, aynı fonksiyon kapsamında tanımlı. Tek koşul, `abonelik` null ise yukarıda zaten return edilmiş olması, ki öyle.
>
> **Emin olmadığım:** `kurallar.test.ts` içindeki kuralların `@/lib/sse-hub` importuna nasıl tepki vereceği. `npm test` bunu gösterecek.
>
> ## Bana gönder
>
> - `git diff` çıktısı
> - `tsc` ve `lint` sonuçları ("temiz" yeterli)
> - `npm test` için `tests`, `pass`, `fail` satırları
>
> Temizse **Adım 5**'e (`UyariDinleyici.tsx` ve layout) geçeceğim.

### Prompt 11 · 24 Eki 2026 08:52

````text
ABONELİK İPTALİ İÇİN BU KISIMDA DEĞİŞİKLİK YAPICAM DİMİ
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 10 · 24 Eki 2026 08:53

> Hayır, ekranda **yenileme** fonksiyonu (`abonelikYenile`) açık. Satır 172'de `export async function abonelikYenile(` yazıyor, ve `select` içinde `currentPeriodEnd` ile `plan: { select: { interval: true } }` var. Burası değişmeyecek.
>
> Değişecek yer, aynı dosyada biraz aşağıdaki **`abonelikIptal`** fonksiyonu. Üstteki yol çubuğunda da `aboneliklptal` yazıyor ama içerik yenileme kısmını gösteriyor, o yüzden karışmış olabilir. Doğru yere şöyle gidebilirsin:
>
> 1. `Cmd + F` ile şunu ara: `export async function abonelikIptal`
> 2. Bu fonksiyonun içinde `select: { status: true },` satırını bul. Bu satır dosyada **bir kez** geçer (yenileme fonksiyonundaki `select` çok satırlı ve farklı).
> 3. O satırı şununla değiştir:
>    ```ts
>        select: { status: true, customer: { select: { name: true } } },
>    ```
>
> Üç değişikliğin yeri:
>
> - **Değişiklik 1 (import):** Dosyanın en üstü, `@/lib/islem` import bloğunun altı.
> - **Değişiklik 2 (`select`):** `abonelikIptal` içinde, az önce anlattığım satır.
> - **Değişiklik 3 (yayın bloğu):** Dosyanın en sonu, `"Abonelik iptal edildi."` yazan `return` satırı.
>
> Not: VS Code'da `actions.ts` sekmesinde beyaz bir nokta (●) var, yani kaydedilmemiş bir değişiklik duruyor. Ne değiştirdiğinden emin değilsem, `git --no-pager diff` ile bakalım. Yenileme bölümünde bir şeyi yanlışlıkla değiştirdiysen `Cmd + Z` ile geri al.
>
> Üç değişikliği yaptıktan sonra `git --no-pager diff src/app/\(panel\)/abonelikler/actions.ts` çıktısını gönder, birlikte kontrol edelim.

### Prompt 12 · 24 Eki 2026 08:59

````text
kullanici@bilgisayar abonetakip % 
^[[200~git --no-pager diff src/app/\(panel\)/abonelikler/actions.ts^[[201~
git --no-pager diff src/app/\(panel\)/abonelikler/actions.ts
diff --git a/src/app/(panel)/abonelikler/actions.ts b/src/app/(panel)/abonelikler/actions.ts
index c1acd98..1e42d0b 100644
--- a/src/app/(panel)/abonelikler/actions.ts
+++ b/src/app/(panel)/abonelikler/actions.ts
@@ -29,6 +29,7 @@ import {
   type FormDurumu,
 } from "@/lib/islem";
 
+import { sseHub } from "@/lib/sse-hub";
 const ZATEN_AKTIF =
   "Bu müşterinin zaten aktif bir aboneliği var. Önce onu iptal edin.";
 const DEGISMIS =
@@ -254,7 +255,7 @@ export async function abonelikIptal(
   const db = await getTenantDb();
   const abonelik = await db.subscription.findFirst({
     where: { id: kimlik.deger },
-    select: { status: true },
+    select: { status: true, customer: { select: { name: true } } },
   });
   if (!abonelik) {
     return { durum: "hata", mesaj: MESAJ.bulunamadi };
@@ -291,6 +292,20 @@ export async function abonelikIptal(
     return { durum: "hata", mesaj: MESAJ.beklenmeyen };
   }
 
+   // İptal veritabanına yazıldı: aynı firmanın açık bağlantılarına canlı uyarı gider.
+  // tenantId OTURUMDAN gelir (kullanici). Buraya yalnızca işlem başarılıysa gelinir:
+  // çift tıklamada (iptalEdildi false) ve hatada yukarıda zaten return edilmiştir,
+  // bu yüzden uyarı iki kez gitmez ve olmamış iptal için çıkmaz.
+  // Uyarı gönderilemese bile iptal başarılıdır: hata yutulur, kullanıcıya gösterilmez.
+  try {
+    sseHub.yayinla(kullanici.tenantId, {
+      tur: "iptal",
+      musteriAdi: abonelik.customer.name,
+    });
+  } catch {
+    console.error("İptal uyarısı gönderilemedi.");
+  }
+
   revalidatePath("/abonelikler");
   return { durum: "basarili", mesaj: "Abonelik iptal edildi." };
 }
\ No newline at end of file
kullanici@bilgisayar abonetakip % npx tsc --noEmit
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts src/lib/metrikler.test.ts src/lib/validation.test.ts src/lib/bicim.test.ts src/test-destek/canli-koruma.test.ts src/lib/sse-hub.test.ts

(node:81928) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/bicim.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tlMetni: binlik ayıracı nokta, kuruş yok (0.849333ms)
✔ yuzdeMetni: 1 ondalık, yüzde işareti önde (0.277ms)
✔ sayiMetni: en fazla 2 ondalık, gereksiz sıfır yok (0.171792ms)
✔ ayEtiketi: Türkçe ay adı ve yıl (0.135334ms)
(node:81929) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (5.424334ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.065791ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.044417ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.042417ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (0.042834ms)
✔ yıllık: bir yıl sonraya taşınır (0.0415ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.035791ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.03375ms)
(node:81930) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/metrikler.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5 (0.499959ms)
✔ ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir (0.717709ms)
✔ Gün 9 elle test senaryosu: 3 müşteri, 2 iptal, CAC 5.000 (0.111375ms)
✔ boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null (0.07ms)
✔ churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır (0.066208ms)
✔ ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz) (0.042333ms)
✔ CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni (0.055583ms)
✔ aktif müşteri 0: ARPU null (0.034791ms)
✔ yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83 (0.061042ms)
✔ ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil) (0.086042ms)
✔ churn 4 ondalığa yuvarlanır: 1/3 -> 0,3333 (ham değer yuvarlanmaz) (0.063458ms)
✔ tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil (0.044417ms)
✔ ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi (0.1555ms)
✔ 1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez (0.056042ms)
✔ tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir (0.044583ms)
✔ aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır (0.034042ms)
✔ ay içinde gelip aynı ay giden müşteri churn'e girmez (0.028542ms)
✔ ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir (0.030167ms)
✔ mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi' (0.1515ms)
✔ ayHareketi: Gün 9 senaryosu -> yeni 0, iptal 2; iptal / ay başı = churn (0.052041ms)
✔ ayHareketi: ders örneği -> yeni 2, iptal 2; iptal / ay başı = churn (0.087416ms)
✔ ayHareketi: plan değiştiren müşteri ne yeni ne iptal sayılır (0.034625ms)
✔ ayHareketi: ay içinde gelip aynı ay giden müşteri ne yeni ne iptal sayılır (0.026458ms)
✔ ayHareketi: boş liste -> yeni 0, iptal 0 (0.023ms)
✔ turkiyeAyi: ay, UTC'ye değil Türkiye saatine göre belirlenir (0.048125ms)
✔ ltvCacSaglikliMi: 3 ve üzeri sağlıklı, altı değil (0.021833ms)
(node:81931) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.460416ms)
✔ 7 gün sonra süresi dolar (0.068542ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.069708ms)
✔ imzası değiştirilen belirteç geçersizdir (0.053292ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.06275ms)
✔ biçimi bozuk belirteçler geçersizdir (0.055459ms)
(node:81932) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/sse-hub.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
▶ Kiracı izolasyonu
  ✔ A firmasına yayınlanan mesaj B'nin bağlantısına gitmez (0.326084ms)
  ✔ aynı firmadaki iki bağlantının ikisi de mesajı alır (0.318625ms)
✔ Kiracı izolasyonu (1.050958ms)
▶ Bağlantı yaşam döngüsü
  ✔ ayrılan bağlantı sonraki mesajı almaz ve listeden silinir (0.091708ms)
  ✔ firmanın son bağlantısı da ayrılınca firma listeden silinir (0.047584ms)
  ✔ gönderimde hata veren bağlantı çıkarılır, diğerleri almaya devam eder (0.057584ms)
  ✔ ayrılma iki kez çağrılırsa başka bağlantıya zarar vermez (0.050666ms)
✔ Bağlantı yaşam döngüsü (0.353333ms)
▶ Firma başına bağlantı sınırı
  ✔ sınıra kadar kabul edilir, fazlası reddedilir ve mesaj almaz (0.087ms)
  ✔ bir bağlantı ayrılınca yeni bağlantı tekrar kabul edilir (0.047708ms)
  ✔ A firmasının sınırı dolu olsa da B'nin bağlantısı kabul edilir (0.050416ms)
  ✔ varsayılan sınır 20'dir (0.062833ms)
✔ Firma başına bağlantı sınırı (0.358375ms)
▶ Mesaj biçimi
  ✔ SSE biçimindedir ve müşteri adındaki satır sonu biçimi bozmaz (0.059458ms)
✔ Mesaj biçimi (0.094292ms)
(node:81933) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/validation.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ fiyat: geçerli tam sayılar kabul edilir (0.507625ms)
✔ fiyat: 0 ve negatif reddedilir (mesaj değişmedi) (0.066834ms)
✔ fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi) (9.90225ms)
✔ CAC: 0 kabul edilir ('girilmedi' anlamında) (0.269166ms)
✔ CAC: geçerli tam sayılar kabul edilir (0.083416ms)
✔ CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir (0.079625ms)
✔ CAC: metin olmayan girdi (null, sayı) boş sayılır (0.048625ms)
(node:81934) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.336958ms)
✔ finance yönetici değildir (0.055375ms)
(node:81935) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/canli-koruma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ ucNoktaKimligi: havuzlu ve doğrudan adres AYNI sunucu sayılır (0.77825ms)
✔ ucNoktaKimligi: farklı dallar farklı sunucudur; okunamayan adres null (0.182667ms)
(node:81936) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (1.06ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (3.029792ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (2.929ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.931ms)
ℹ tests 70
ℹ suites 4
ℹ pass 70
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 233.09075
````

### Claude cevabı 11 · 24 Eki 2026 09:00

> Diff doğru ve `tsc`, `lint` ve `npm test` (70/70, `fail 0`) temiz. Yalnızca iki biçim düzeltmesi var, ikisi de görünüşle ilgili:
>
> 1. Import satırı `const ZATEN_AKTIF` satırına bitişik kalmış. Boş satır, import'un altına değil üstüne düşmüş.
> 2. Yayın bloğunun ilk yorum satırı bir boşluk fazla girintili.
>
> Düzeltmek için `actions.ts` dosyasında:
> - `import { sseHub } from "@/lib/sse-hub";` satırının **altına** boş bir satır ekle. Üstündeki boş satır kalabilir.
> - `   // İptal veritabanına yazıldı:` satırının başındaki boşlukları sil, diğer yorum satırlarıyla aynı hizada (2 boşluk) dursun.
>
> Dosya sonundaki "No newline at end of file" uyarısı bu değişikliğin parçası değil, önceki hâlinden kalma. Dokunmuyoruz.
>
> ---
>
> # Adım 5 • `UyariDinleyici.tsx` ve layout
>
> ```zsh
> touch "src/app/(panel)/UyariDinleyici.tsx"
> ```
> Boş bileşen dosyasını oluşturur. Yol tırnak içinde, çünkü zsh parantezleri özel karakter sayar.
>
> ### Yeni dosya oluştur: `src/app/(panel)/UyariDinleyici.tsx`
>
> ```tsx
> "use client";
>
> // CANLI UYARI DİNLEYİCİSİ (Gün 10)
> //
> // Panelin her sayfasında çalışır (layout içinde durur). Tarayıcıdan /api/events
> // adresine SSE bağlantısı açar ve gelen iptal uyarılarını sayfanın üstünde bant
> // olarak gösterir. Sayfa yenilenmez.
> //
> // YENİDEN BAĞLANMA: Ağ ya da sunucu kesilirse EventSource kendiliğinden yeniden
> // bağlanır (sunucu "retry: 5000" der). Bu bileşende ek kod gerekmez.
> //
> // SESSİZ DURMA: Uç nokta 401 (giriş yok), 403 veya 429 (bağlantı sınırı) dönerse
> // EventSource bağlantıyı kapatır ve bir daha denemez. Bu bileşen o durumda hata
> // göstermez, sessizce durur.
> //
> // ÇIKIŞ: Çıkış yapan kullanıcı /giris sayfasına gider. O sayfa (panel) layout'unun
> // dışında olduğu için bu bileşen kaldırılır ve bağlantı kapanır (ADR, Gün 10).
> //
> // GÜVENLİK: Müşteri adı React ile METİN olarak basılır, HTML olarak işlenmez.
>
> import { useEffect, useRef, useState } from "react";
>
> type Uyari = { id: number; musteriAdi: string };
>
> // Ekranda aynı anda en fazla bu kadar bant tutulur; en yeni üstte görünür.
> const EN_FAZLA_UYARI = 5;
>
> // Sunucudan gelen veriyi doğrular. Beklenmeyen biçim sessizce yok sayılır.
> function musteriAdiniOku(veri: string): string | null {
>   try {
>     const nesne: unknown = JSON.parse(veri);
>     if (
>       typeof nesne === "object" &&
>       nesne !== null &&
>       "musteriAdi" in nesne &&
>       typeof (nesne as { musteriAdi: unknown }).musteriAdi === "string"
>     ) {
>       return (nesne as { musteriAdi: string }).musteriAdi;
>     }
>   } catch {
>     // Bozuk veri: uyarı gösterilmez.
>   }
>   return null;
> }
>
> export default function UyariDinleyici() {
>   const [uyarilar, setUyarilar] = useState<Uyari[]>([]);
>   const sayac = useRef(0);
>
>   useEffect(() => {
>     const kaynak = new EventSource("/api/events");
>
>     kaynak.addEventListener("iptal", (olay) => {
>       const musteriAdi = musteriAdiniOku((olay as MessageEvent<string>).data);
>       if (!musteriAdi) return;
>       sayac.current += 1;
>       const yeni: Uyari = { id: sayac.current, musteriAdi };
>       setUyarilar((onceki) => [yeni, ...onceki].slice(0, EN_FAZLA_UYARI));
>     });
>
>     // Bilerek bir şey yapılmaz: bağlantı geçici koptuysa tarayıcı yeniden dener,
>     // kalıcı olarak reddedildiyse (401, 403, 429) kendisi kapatır.
>     kaynak.addEventListener("error", () => {});
>
>     // Sayfa değişince ya da bileşen kaldırılınca bağlantı kapatılır.
>     return () => kaynak.close();
>   }, []);
>
>   if (uyarilar.length === 0) return null;
>
>   return (
>     <div
>       className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-xl space-y-2 px-4 pt-4"
>       role="status"
>       aria-live="polite"
>     >
>       {uyarilar.map((uyari) => (
>         <div
>           key={uyari.id}
>           className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-md"
>         >
>           {/* Anlam yalnızca renge bırakılmaz: simge + metin */}
>           <span aria-hidden="true" className="font-bold">
>             ✕
>           </span>
>           <p className="min-w-0 flex-1 break-words">
>             <span className="font-semibold">{uyari.musteriAdi}</span> aboneliğini
>             iptal etti.
>           </p>
>           <button
>             type="button"
>             aria-label="Uyarıyı kapat"
>             className="rounded px-1 font-medium text-red-700 hover:text-red-900"
>             onClick={() =>
>               setUyarilar((onceki) => onceki.filter((u) => u.id !== uyari.id))
>             }
>           >
>             Kapat
>           </button>
>         </div>
>       ))}
>     </div>
>   );
> }
> ```
>
> ### `layout.tsx` değişikliği
>
> `src/app/(panel)/layout.tsx` dosyasında iki küçük değişiklik var.
>
> **1) Import:** Şu satırı bul:
>
> ```tsx
> import MenuBaglantisi from "./MenuBaglantisi";
> ```
>
> Altına şunu ekle:
>
> ```tsx
> import UyariDinleyici from "./UyariDinleyici";
> ```
>
> **2) Yerleştirme:** Şu satırı bul:
>
> ```tsx
>         <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
>           {children}
>         </main>
> ```
>
> Şöyle değiştir:
>
> ```tsx
>         <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
>           <UyariDinleyici />
>           {children}
>         </main>
> ```
>
> Bant `fixed` olduğu için sayfa düzenini kaydırmaz. Layout, sayfalar arası geçişte yeniden çizilmez, bu yüzden bağlantı sayfa değiştikçe kopmaz.
>
> ## Kontroller
>
> ```zsh
> git --no-pager diff "src/app/(panel)/layout.tsx"
> ```
> Yalnızca bir import ve bir `<UyariDinleyici />` satırı eklenmiş olmalı.
>
> ```zsh
> npx tsc --noEmit
> npm run lint
> npm test
> ```
> Üçü de temiz olmalı. `npm test` için 70 test ve `fail 0`. `kurallar.test.ts` yeni dosyaya itiraz ederse hata mesajının tamamını gönder.
>
> ## Notlar
>
> - **Tek `error` dinleyicisi boş:** Bilinçli. Hata ekranı çıkmaması ve "sessizce dur" kuralı için bir şey yapmamız gerekmiyor; satır, niyetin yorumla belgelenmesi için duruyor.
> - **React Strict Mode:** Geliştirme modunda bileşen iki kez bağlanıp ilkini kapatır. Sunucuda kısa süreli iki bağlantı görünebilir, ilki hemen temizlenir. Üretimde bu olmaz.
> - **Bant otomatik kaybolmaz:** Kullanıcı "Kapat"a basana kadar durur. İstersen birkaç saniye sonra kaybolacak şekilde değiştiririm, ama iptal uyarısının kaçırılmaması için şimdilik kalıcı bıraktım.
>
> **Varsayımlar:** `EventSource` tarayıcıda çerezi aynı site olduğu için kendiliğinden gönderir. Tailwind sınıfları (`red-50`, `red-200`, `red-800`) projede kullanılabilir.
>
> **Emin olmadığım:** Banner'ın mobil görünümü. Elle testte dar pencerede de bakacağız.
>
> ## Bana gönder
>
> - `git diff` çıktısı (layout)
> - `tsc` ve `lint` sonuçları ("temiz" yeterli)
> - `npm test` için `tests`, `pass`, `fail` satırları
>
> Temizse **commit (b)** hazırlığını (taramalar ve `git add`) vereceğim. Gerçek uçtan uca doğrulama Adım 9'daki elle testte yapılacak. Bu arada hatırlatma: elle testte A ve B firmalarının test dalında en az 2'şer ACTIVE aboneliği olmalı.

### Prompt 13 · 24 Eki 2026 09:02

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 12 · 24 Eki 2026 09:02

> Ekrandaki import düzeni doğru: 31. satır boş, 32. satırda `sseHub` import'u, 33. satır boş ve 34. satırda `const ZATEN_AKTIF` var. Bu düzeltme tamam.
>
> Sekmede hâlâ beyaz nokta (●) görünüyor, yani dosya kaydedilmemiş. `Cmd + S` ile kaydet. Arama kutusunu da `Esc` ile kapatabilirsin.
>
> Yapman gereken iki şey kaldı:
> 1. Dosyanın sonuna doğru, `// İptal veritabanına yazıldı:` yorum satırının başındaki fazla boşluğu sil. Diğer yorum satırlarıyla aynı hizada (2 boşluk) olmalı. Bu ekranda o bölüm görünmüyor, o yüzden kontrol edemedim.
> 2. `UyariDinleyici.tsx` dosyasını oluşturup içeriğini yapıştır ve `layout.tsx`'e iki değişikliği (import ve `<UyariDinleyici />`) yap. Önceki mesajdaki Adım 5'in devamı bu.
>
> **Bir düzeltmem var:** Commit trailer'ı için "bu oturumdaki model Claude Opus 5.5" demiştim. Şu an gördüğüm bilgiye göre bu sohbette seçili model **Claude Sonnet 5.5**. Opus demem büyük olasılıkla yanlıştı. Commit (a) `Co-Authored-By: Claude Opus 5.5` trailer'ıyla atıldıysa düzeltmek gerekir. Dal henüz yayınlanmadığı için güvenle düzeltilebilir:
> - GitHub Desktop'ta **History** sekmesine git, commit (a)'ya sağ tıkla ve **Amend commit...** seç. Bu seçenek yalnızca yayınlanmamış commit'lerde görünür. Açıklamadaki trailer'ı `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` olarak değiştir.
> - Bu sohbette modeli sen değiştirdiysen ya da (a)'yı Sonnet ile attığına eminsen, bu adım gerekmeyebilir. Hangi modelle çalıştığını sen daha iyi bilirsin, bu yüzden karar senin.
>
> Sonraki commit'lerde (b, c, d) `Claude Sonnet 5.5` yazacağız.
>
> Kaydedip `layout.tsx` değişikliğini yaptıktan sonra şunları gönder:
> - `git --no-pager diff "src/app/(panel)/layout.tsx"` çıktısı
> - `npx tsc --noEmit`, `npm run lint` sonuçları ("temiz" yeterli)
> - `npm test` için `tests`, `pass`, `fail` satırları
>
> Temizse commit (b) hazırlığını vereceğim.

### Prompt 14 · 24 Eki 2026 09:07

````text
henüz githubta commitleme yapmadım , adım 5 in test sonuçları beklenen gibi
````

### Claude cevabı 13 · 24 Eki 2026 09:08

> Önce commit (a)'nın trailer'ını kontrol edelim. (b) henüz atılmadığı için (a) en son commit ve kolayca düzeltilebilir.
>
> ```zsh
> git --no-pager log -1 --format=%B
> ```
> En son commit'in mesajını gösterir. `Co-Authored-By` satırında **Opus 5.5** yazıyorsa düzeltelim. Bu sohbette seçili model Sonnet 5.5, önceki "Opus" demem yanlıştı. GitHub Desktop'ta **Changes** sekmesinin altındaki commit bilgisinden ya da **History** sekmesinde commit'e sağ tıklayıp **Amend commit...** ile açıklamayı değiştirebilirsin. Yalnızca trailer satırı değişecek, dosyalar aynı kalacak. Zaten `Sonnet 5.5` yazıyorsa dokunma.
>
> ## Commit (b) hazırlığı
>
> ```zsh
> git add src/app/api/events/route.ts "src/app/(panel)/abonelikler/actions.ts" "src/app/(panel)/UyariDinleyici.tsx" "src/app/(panel)/layout.tsx"
> ```
> Dört dosyayı commit'e hazırlar.
>
> ```zsh
> git status
> ```
> "Changes to be committed" altında **yalnızca bu dört dosya** olmalı (`route.ts` yeni, diğer üçü değişmiş). Başka dosya görünüyorsa söyle.
>
> **Tarama 1 (parola):**
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> Çıktı **boş** olmalı.
>
> **Tarama 2 (sunucu adı):**
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> Sonuç **0** olmalı.
>
> **Tarama 3 (kişi adı):**
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
> Sonuç **0** olmalı.
>
> **Testler:**
> ```zsh
> npm test
> npm run test:db
> ```
> Beklenen: 70/70 ve 44/44, `fail 0`. Adım 5'te `npm test`'i zaten çalıştırdın; kod değişmediyse `test:db` yeterli.
>
> ## Commit (b) mesajı (GitHub Desktop)
>
> - **Summary:**
>   ```
>   feat: SSE uç noktası, iptal uyarısı yayını ve uyarı bandı
>   ```
> - **Description:**
>   ```
>   Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
>   Claude-Session: [önceki günlerdeki satırın aynısı]
>   ```
>
> Dal adının `gun10-sse` olduğunu ve altı dosya değil dört dosya seçili olduğunu kontrol et. **Publish branch** yine bekliyor.
>
> ## Bana gönder
> - `git log -1` çıktısındaki `Co-Authored-By` satırı
> - `git status` çıktısı
> - Üç taramanın sonuçları ve `test:db` son satırları
>
> Temizse **Adım 6**'ya (riskli abonelikler, iki test dosyası ve `package.json` satırları) geçeceğim.

### Prompt 15 · 24 Eki 2026 09:08

````text
eat: SSE bağlantı merkezi (sse-hub) ve birim testleri

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>

Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
````

### Claude cevabı 14 · 24 Eki 2026 09:08

> Commit (a) mesajı olması gerektiği gibi. Başındaki "eat:" büyük olasılıkla kopyalarken `f` harfinin kesilmesi.
>
> **Trailer için önceki önerimi geri alıyorum.** Bu konuşmada model değiştirilebiliyor. Commit (a)'nın kodunu yazan önceki yanıtlar kendini Opus 5.5 olarak tanıtmıştı, yani o trailer doğru olabilir. Şu anki yanıtlar Claude Sonnet 5.5 ile geliyor. Trailer, o commit'in kodunu yazan modeli göstermeli:
>
> - **Commit (a):** Amend gerekmiyor, olduğu gibi kalsın. O adımları Opus ile yaptıysan trailer doğrudur.
> - **Commit (b) ve sonrası:** Kodu yazan model Sonnet 5.5 ise `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` yaz. Modeli yeniden değiştirirsen trailer'ı ona göre güncelle.
>
> **Küçük bir biçim notu:** `git log` çıktında iki trailer satırı arasında boş satır var. Git'in trailer sayması ve GitHub'ın `Co-Authored-By` satırını tanıması için trailer'lar bitişik, aralarında boş satır olmadan durmalı. Commit (b)'nin Description alanına iki satırı alt alta, boş satır bırakmadan yaz:
>
> ```
> Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
> Claude-Session: [önceki günlerdeki satırın aynısı]
> ```
>
> Commit (a)'da bu boşluk GitHub'ın `Co-Authored-By` satırını okumasını engellerse yalnızca ortak yazar görünmez, kod etkilenmez. İstersen (a)'yı aynı yöntemle (History → Amend commit) bitişik hâle getirebilirsin, zorunlu değil.
>
> Commit (b) için hâlâ şunları bekliyorum:
> - `git status` çıktısı (yalnızca dört dosya hazırda olmalı)
> - Üç taramanın sonuçları
> - `npm run test:db` son satırları (`tests`, `pass`, `fail`)
>
> Temizse commit (b)'yi atabilirsin. Ardından **Adım 6**'ya (riskli abonelikler fonksiyonu, iki test dosyası ve `package.json` satırları) geçeriz.

### Prompt 16 · 24 Eki 2026 09:14

````text
commit (b) atıldı
````

### Claude cevabı 15 · 24 Eki 2026 09:16

> Commit (b) tamam. Taramaların ve `test:db` sonuçlarının çıktısını görmedim, "atıldı" demen yeterli.
>
> # Adım 6 • Riskli abonelikler ve testleri
>
> Bu adımda dashboard'a dokunmuyoruz, yalnızca fonksiyon, iki test dosyası ve `package.json` satırları var. Commit (c) dashboard kartı da bitince atılacak.
>
> ```zsh
> touch src/lib/riskli-abonelikler.ts src/lib/riskli-etiket.test.ts src/lib/riskli-abonelikler.test.ts
> ```
> Üç boş dosya oluşturur.
>
> ### Yeni dosya oluştur: `src/lib/riskli-abonelikler.ts`
>
> ```ts
> // RİSKLİ ABONELİKLER (Gün 10, issue #6)
> //
> // KURAL (issue #6 kabul kriteri): "bitiş dönemine 7 günden az kalmış, henüz
> // yenilenmemiş ACTIVE abonelik".
> //   Koşul: status = ACTIVE ve currentPeriodEnd < şimdi + 7 gün
> // Süresi geçmiş ama hâlâ ACTIVE olanlar bu tek koşula zaten girer, ayrı koşul
> // yoktur. Ayrım yalnızca ekrandaki etikettir (riskEtiketi).
> // Yenileme currentPeriodEnd'i ileri taşıdığı için yenilenmiş abonelik listeye
> // girmez. İptal edilmiş abonelik status koşuluna takılır.
> // Tam 7 gün kalmış abonelik listeye GİRMEZ ("7 günden az").
> //
> // Sorgu tenant filtresinden geçen db ile yapılır: başka firmanın kaydı gelmez.
> // db ve simdi parametre olarak alınır: uygulamada getTenantDb() ve şu an,
> // testlerde tenantaBagliDb() ve sabit bir an. Bu dosya Next.js'e bağlı değildir.
>
> import type { TenantDb } from "./tenant.ts";
>
> // Riskli sayılma eşiği (gün). issue #6'dan gelir, yalnızca burada tanımlıdır.
> export const RISK_GUN = 7;
>
> const GUN_MS = 24 * 60 * 60 * 1000;
>
> export type RiskEtiketiSonucu = {
>   metin: string;
>   // true: bitiş tarihi geçmiş (ekranda kırmızı); false: henüz geçmemiş (sarı).
>   gecmis: boolean;
> };
>
> // Bitiş tarihine göre ekranda gösterilecek etiket. Süre, takvim gününe göre değil
> // milisaniye farkına göre hesaplanır; tam gün sayısı aşağı yuvarlanır.
> export function riskEtiketi(bitis: Date, simdi: Date): RiskEtiketiSonucu {
>   const kalan = bitis.getTime() - simdi.getTime();
>   if (kalan < 0) return { metin: "Süresi geçmiş", gecmis: true };
>
>   const gun = Math.floor(kalan / GUN_MS);
>   if (gun < 1) return { metin: "1 günden az kaldı", gecmis: false };
>   return { metin: `${gun} gün kaldı`, gecmis: false };
> }
>
> export type RiskliAbonelik = {
>   id: string;
>   musteriAdi: string;
>   planAdi: string;
>   bitis: Date;
>   etiket: RiskEtiketiSonucu;
> };
>
> // Riskli abonelikleri bitişi en yakın olandan (süresi geçmişler en başta) sıralar.
> export async function riskliAbonelikler(
>   db: TenantDb,
>   simdi: Date = new Date()
> ): Promise<RiskliAbonelik[]> {
>   const sinir = new Date(simdi.getTime() + RISK_GUN * GUN_MS);
>
>   const kayitlar = await db.subscription.findMany({
>     where: { status: "ACTIVE", currentPeriodEnd: { lt: sinir } },
>     orderBy: { currentPeriodEnd: "asc" },
>     select: {
>       id: true,
>       currentPeriodEnd: true,
>       customer: { select: { name: true } },
>       plan: { select: { name: true } },
>     },
>   });
>
>   return kayitlar.map((k) => ({
>     id: k.id,
>     musteriAdi: k.customer.name,
>     planAdi: k.plan.name,
>     bitis: k.currentPeriodEnd,
>     etiket: riskEtiketi(k.currentPeriodEnd, simdi),
>   }));
> }
> ```
>
> ### Yeni dosya oluştur: `src/lib/riskli-etiket.test.ts`
>
> ```ts
> // RİSK ETİKETİ TESTLERİ (Gün 10)
> // Saf fonksiyon testi: veritabanı gerekmez. Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { riskEtiketi } from "./riskli-abonelikler.ts";
>
> const SIMDI = new Date("2026-10-24T09:00:00.000Z");
> const SAAT = 60 * 60 * 1000;
> const GUN = 24 * SAAT;
>
> function sonra(ms: number): Date {
>   return new Date(SIMDI.getTime() + ms);
> }
>
> test("bitiş geçmişte: 'Süresi geçmiş' ve gecmis true", () => {
>   assert.deepEqual(riskEtiketi(sonra(-2 * GUN), SIMDI), {
>     metin: "Süresi geçmiş",
>     gecmis: true,
>   });
>   // 1 milisaniye bile geçmişse süresi geçmiştir.
>   assert.equal(riskEtiketi(sonra(-1), SIMDI).metin, "Süresi geçmiş");
> });
>
> test("1 günden az kaldıysa '1 günden az kaldı' (bitiş tam şimdi dahil)", () => {
>   assert.deepEqual(riskEtiketi(sonra(0), SIMDI), {
>     metin: "1 günden az kaldı",
>     gecmis: false,
>   });
>   assert.equal(riskEtiketi(sonra(23 * SAAT), SIMDI).metin, "1 günden az kaldı");
> });
>
> test("tam 1 gün kaldıysa '1 gün kaldı'", () => {
>   assert.equal(riskEtiketi(sonra(GUN), SIMDI).metin, "1 gün kaldı");
> });
>
> test("3 gün kaldıysa '3 gün kaldı'", () => {
>   assert.deepEqual(riskEtiketi(sonra(3 * GUN), SIMDI), {
>     metin: "3 gün kaldı",
>     gecmis: false,
>   });
> });
>
> test("6 gün 23 saat kaldıysa aşağı yuvarlanır: '6 gün kaldı'", () => {
>   assert.equal(riskEtiketi(sonra(6 * GUN + 23 * SAAT), SIMDI).metin, "6 gün kaldı");
> });
> ```
>
> ### Yeni dosya oluştur: `src/lib/riskli-abonelikler.test.ts`
>
> ```ts
> // RİSKLİ ABONELİK SORGUSU TESTLERİ (Gün 10, issue #6)
> //
> // Veri: iki sahte firma (bkz. test-destek/veri.ts), testler bitince silinir.
> // Ek kayıtlar ham prisma ile değil dbA / dbB (tenant filtresi) üzerinden oluşturulur.
> // Bir müşterinin aynı anda tek ACTIVE aboneliği olabildiği için her durum için
> // yeni bir müşteri açılır.
> // "Şimdi" bir kez alınır ve bütün testlerde aynı değer kullanılır.
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import { riskliAbonelikler } from "./riskli-abonelikler.ts";
>
> const GUN = 24 * 60 * 60 * 1000;
>
> let A: TestFirmasi;
> let B: TestFirmasi;
> let dbA: TenantDb;
> let dbB: TenantDb;
> let SIMDI: Date;
>
> // Kayıt kimlikleri
> let a3Gun: string;
> let aGecmis: string;
> let a7Gun: string;
> let a7GunEksi1Ms: string;
> let aYenilenmis: string;
> let aIptal: string;
> let b3Gun: string;
>
> function sonra(ms: number): Date {
>   return new Date(SIMDI.getTime() + ms);
> }
>
> // Yeni müşteri ve onun aboneliğini oluşturur, abonelik kimliğini döner.
> async function aboneOlustur(
>   db: TenantDb,
>   firma: TestFirmasi,
>   ad: string,
>   bitis: Date,
>   durum: "ACTIVE" | "CANCELED" = "ACTIVE"
> ): Promise<string> {
>   const musteri = await db.customer.create({
>     data: { tenantId: firma.tenantId, name: `Test Risk ${ad}` },
>     select: { id: true },
>   });
>   const abonelik = await db.subscription.create({
>     data: {
>       tenantId: firma.tenantId,
>       customerId: musteri.id,
>       planId: firma.abonelikliPlanId,
>       status: durum,
>       currentPeriodEnd: bitis,
>       canceledAt: durum === "CANCELED" ? SIMDI : null,
>     },
>     select: { id: true },
>   });
>   return abonelik.id;
> }
>
> before(async () => {
>   SIMDI = new Date();
>   A = await testFirmasiOlustur("a");
>   B = await testFirmasiOlustur("b");
>   dbA = tenantaBagliDb(A.tenantId);
>   dbB = tenantaBagliDb(B.tenantId);
>
>   a3Gun = await aboneOlustur(dbA, A, "3 gün", sonra(3 * GUN));
>   aGecmis = await aboneOlustur(dbA, A, "geçmiş", sonra(-2 * GUN));
>   a7Gun = await aboneOlustur(dbA, A, "tam 7 gün", sonra(7 * GUN));
>   a7GunEksi1Ms = await aboneOlustur(dbA, A, "7 gün eksi 1 ms", sonra(7 * GUN - 1));
>   aIptal = await aboneOlustur(dbA, A, "iptal", sonra(3 * GUN), "CANCELED");
>
>   // Yenilenmiş: önce 3 gün kalmış, sonra uygulamadaki gibi (abonelikYenile)
>   // bitiş tarihi koşulda verilerek ileri taşınmış.
>   const eskiBitis = sonra(3 * GUN);
>   aYenilenmis = await aboneOlustur(dbA, A, "yenilenmiş", eskiBitis);
>   const yenilendi = await dbA.subscription.updateMany({
>     where: { id: aYenilenmis, status: "ACTIVE", currentPeriodEnd: eskiBitis },
>     data: { currentPeriodEnd: sonra(33 * GUN) },
>   });
>   assert.equal(yenilendi.count, 1, "Test verisi: yenileme uygulanamadı.");
>
>   b3Gun = await aboneOlustur(dbB, B, "B 3 gün", sonra(3 * GUN));
> });
>
> after(async () => {
>   try {
>     await testVerisiniTemizle();
>   } finally {
>     await baglantiyiKapat();
>   }
> });
>
> describe("Riskli abonelik listesi (issue #6)", () => {
>   test("bitişe 7 günden az kalan ve süresi geçmiş ACTIVE abonelikler girer; diğerleri girmez", async () => {
>     const idler = (await riskliAbonelikler(dbA, SIMDI)).map((r) => r.id);
>
>     assert.ok(idler.includes(a3Gun), "3 gün kalan abonelik listede olmalı.");
>     assert.ok(idler.includes(aGecmis), "Süresi geçmiş ACTIVE abonelik listede olmalı.");
>     assert.ok(idler.includes(a7GunEksi1Ms), "7 günden 1 ms az kalan listede olmalı.");
>
>     assert.ok(!idler.includes(a7Gun), "Tam 7 gün kalan listede OLMAMALI (sınır).");
>     assert.ok(!idler.includes(A.abonelikId), "30 gün kalan abonelik listede olmamalı.");
>     assert.ok(!idler.includes(aYenilenmis), "Yenilenmiş abonelik listede olmamalı.");
>     assert.ok(!idler.includes(aIptal), "İptal edilmiş abonelik listede olmamalı.");
>   });
>
>   test("süresi geçmiş kayıt 'Süresi geçmiş' etiketi alır ve listenin başında yer alır", async () => {
>     const liste = await riskliAbonelikler(dbA, SIMDI);
>
>     const gecmis = liste.find((r) => r.id === aGecmis);
>     assert.ok(gecmis);
>     assert.equal(gecmis.etiket.metin, "Süresi geçmiş");
>     assert.equal(gecmis.etiket.gecmis, true);
>
>     const uc = liste.find((r) => r.id === a3Gun);
>     assert.ok(uc);
>     assert.equal(uc.etiket.metin, "3 gün kaldı");
>     assert.equal(uc.etiket.gecmis, false);
>
>     // Bitişe göre artan sıra: geçmiş olan 3 günlükten önce gelir.
>     const idler = liste.map((r) => r.id);
>     assert.ok(idler.indexOf(aGecmis) < idler.indexOf(a3Gun));
>   });
>
>   test("A'nın listesinde B'nin kaydı yok, B'nin listesinde var", async () => {
>     const idlerA = (await riskliAbonelikler(dbA, SIMDI)).map((r) => r.id);
>     const idlerB = (await riskliAbonelikler(dbB, SIMDI)).map((r) => r.id);
>
>     assert.ok(!idlerA.includes(b3Gun), "A'nın listesinde B'nin kaydı var: tenant sızıntısı.");
>     assert.ok(idlerB.includes(b3Gun), "Karşılaştırma: B'nin kendi listesinde kaydı olmalı.");
>     assert.ok(!idlerB.includes(a3Gun), "B'nin listesinde A'nın kaydı var: tenant sızıntısı.");
>   });
>
>   test("müşteri ve plan adı kendi firmasının kaydından gelir", async () => {
>     const kayit = (await riskliAbonelikler(dbA, SIMDI)).find((r) => r.id === a3Gun);
>     assert.ok(kayit);
>     assert.equal(kayit.musteriAdi, "Test Risk 3 gün");
>     assert.equal(kayit.planAdi, "Test Abonelikli Plan");
>   });
> });
> ```
>
> ### `package.json`: yalnızca dosya adı ekleme
>
> `test` satırının sonuna `src/lib/riskli-etiket.test.ts`:
> ```zsh
> perl -i -pe 's{src/lib/sse-hub\.test\.ts"}{src/lib/sse-hub.test.ts src/lib/riskli-etiket.test.ts"} if /^\s*"test":/' package.json
> ```
>
> `test:db` satırının sonuna `src/lib/riskli-abonelikler.test.ts`:
> ```zsh
> perl -i -pe 's{src/lib/dashboard-verisi\.test\.ts"}{src/lib/dashboard-verisi.test.ts src/lib/riskli-abonelikler.test.ts"} if /^\s*"test:db":/' package.json
> ```
>
> ```zsh
> git --no-pager diff package.json
> ```
> İki satır değişmiş olmalı (`"test":` ve `"test:db":`), başka bir şey değil.
>
> ## Kontroller
>
> ```zsh
> npx tsc --noEmit
> npm run lint
> npm test
> npm run test:db
> ```
> Beklenen: `npm test` **75 test**, `npm run test:db` **48 test**, ikisinde de `fail 0`. Önceki sayılara (70 ve 44) 5 etiket ve 4 sorgu testi eklendi.
>
> ## Notlar
>
> - **"Şimdi" sabitliği:** Gerçek saati tek seferde alıp bütün testlerde kullanıyorum. Sabit bir tarih yazsaydım, her firmada otomatik oluşan "30 gün kalan" kayıt (gerçek saate göre kuruluyor) tarih ilerledikçe sorgunun penceresine kayabilirdi. Bu yöntemde sınır testleri her zaman geçerli.
> - **Sınır testleri:** "Tam 7 gün" listede olmamalı, "7 gün eksi 1 ms" olmalı. Kuralın "7 günden az" diyen kısmını bu ikisi birlikte doğruluyor.
> - **Etiket tonu:** `gecmis` alanı dashboard'da kırmızı (`true`) ve sarı (`false`) rozet seçimini belirleyecek.
>
> **Varsayımlar:** `db.customer.create` içinde `tenantId` yazmak gerekiyor (`tenant.test.ts` de öyle yapıyor). `canceledAt` alanı `null` kabul ediyor (şemada isteğe bağlı).
>
> **Emin olmadığım:** Veritabanında "müşteri başına tek ACTIVE abonelik" dizini var; her kayıt için ayrı müşteri açtığım için sorun olmamalı. Yenilenmiş kaydın hazırlığındaki `assert` bunu da yakalar.
>
> ## Bana gönder
> - `git diff package.json` çıktısı
> - `tsc` ve `lint` ("temiz" yeterli)
> - `npm test` ve `npm run test:db` için `tests`, `pass`, `fail` satırları (hata olursa mesajın tamamı)
>
> Temizse **Adım 7**'ye (dashboard kartı ve commit (c) hazırlığı) geçeceğim.

### Prompt 17 · 24 Eki 2026 09:22

````text
Adım 6 tamam: package.json'da yalnızca iki satır değişti, tsc ve lint temiz, npm test 75/75, npm run test:db 48/48 (fail 0). Adım 7'ye (dashboard kartı) geç. Commit (c) için dosya listesini ve tarama komutlarını Adım 7 sonunda ver.
````

### Claude cevabı 16 · 24 Eki 2026 09:22

> # Adım 7 • Dashboard kartı
>
> Değişen tek dosya `src/app/(panel)/dashboard/page.tsx`. Yeni dosya yok. `dashboard-verisi.ts` ve testi değişmiyor.
>
> Kart "Müşteri özeti" kartının altında görünecek. Boş durum (hiç abonelik yok) erken `return` ile döndüğü için orada kart gösterilmez, bu doğru.
>
> ## Değişiklik 1: import
>
> Dosyanın en üstünde şu satırı bul:
>
> ```tsx
> import { ltvCacSaglikliMi } from "@/lib/metrikler";
> ```
>
> Altına şunu ekle:
>
> ```tsx
> import { riskliAbonelikler } from "@/lib/riskli-abonelikler";
> ```
>
> Şu satırı da bul:
>
> ```tsx
> import KpiKarti from "./KpiKarti";
> ```
>
> Üstüne değil, **altına** bir şey eklemiyoruz. Rozet zaten import edilmiş (`Rozet`), `Kart` da öyle.
>
> ## Değişiklik 2: veriyi paralel çek
>
> Şu iki satırı bul:
>
> ```tsx
>   const db = await getTenantDb();
>   const veri = await dashboardVerisiniGetir(db);
> ```
>
> Şununla değiştir:
>
> ```tsx
>   const db = await getTenantDb();
>   // İki sorgu birbirine bağlı değil: paralel çalışır. İkisi de aynı tenant filtreli db'yi kullanır.
>   const [veri, riskliler] = await Promise.all([
>     dashboardVerisiniGetir(db),
>     riskliAbonelikler(db),
>   ]);
> ```
>
> ## Değişiklik 3: tarih biçimi sabiti
>
> `const linkSinifi = ...` tanımının **altına** ekle:
>
> ```tsx
> // Tarihler UTC saklanır, ekranda Türkiye saatine göre gösterilir.
> const TARIH = new Intl.DateTimeFormat("tr-TR", {
>   dateStyle: "medium",
>   timeZone: "Europe/Istanbul",
> });
> ```
>
> ## Değişiklik 4: kartı ekle
>
> Dosyanın sonunda "Müşteri özeti" kartının kapanışını bul (`</Kart>` ve hemen ardından `</div>` ile `);` ile fonksiyonun sonu gelir):
>
> ```tsx
>         <p className="mt-4 text-xs text-slate-500">
>           Sayılar müşteri bazlıdır: ay içinde plan değiştiren müşteri ne yeni ne iptal
>           sayılır.
>         </p>
>       </Kart>
>     </div>
>   );
> }
> ```
>
> Şununla değiştir:
>
> ```tsx
>         <p className="mt-4 text-xs text-slate-500">
>           Sayılar müşteri bazlıdır: ay içinde plan değiştiren müşteri ne yeni ne iptal
>           sayılır.
>         </p>
>       </Kart>
>
>       <Kart className="mt-4">
>         <h2 className="text-sm font-medium text-slate-600">
>           Riskli abonelikler ({riskliler.length})
>         </h2>
>         <p className="mt-1 text-xs text-slate-500">
>           Dönem bitişine 7 günden az kalmış ve henüz yenilenmemiş aktif abonelikler.
>         </p>
>
>         {riskliler.length === 0 ? (
>           <p className="mt-4 text-sm text-slate-600">Riskli abonelik yok.</p>
>         ) : (
>           <ul className="mt-4 divide-y divide-slate-100">
>             {riskliler.map((r) => (
>               <li
>                 key={r.id}
>                 className="flex flex-wrap items-center justify-between gap-2 py-3"
>               >
>                 <div className="min-w-0">
>                   <p className="truncate text-sm font-medium text-slate-900">
>                     {r.musteriAdi}
>                   </p>
>                   <p className="text-xs text-slate-500">
>                     {r.planAdi} · Dönem bitişi: {TARIH.format(r.bitis)}
>                   </p>
>                 </div>
>                 {/* Anlam yalnızca renge bırakılmaz: simge + metin */}
>                 {r.etiket.gecmis ? (
>                   <Rozet ton="kirmizi">
>                     <span aria-hidden="true">✕&nbsp;</span>
>                     {r.etiket.metin}
>                   </Rozet>
>                 ) : (
>                   <Rozet ton="sari">
>                     <span aria-hidden="true">!&nbsp;</span>
>                     {r.etiket.metin}
>                   </Rozet>
>                 )}
>               </li>
>             ))}
>           </ul>
>         )}
>       </Kart>
>     </div>
>   );
> }
> ```
>
> Kaydet (`Cmd + S`).
>
> ## Kontroller
>
> ```zsh
> git --no-pager diff "src/app/(panel)/dashboard/page.tsx"
> ```
> Yalnızca bir import, `Promise.all` bloğu, `TARIH` sabiti ve yeni kart eklenmiş olmalı.
>
> ```zsh
> npx tsc --noEmit
> npm run lint
> npm test
> npm run test:db
> ```
> Beklenen: 75/75 ve 48/48, `fail 0`. `tsc`, `Rozet` bileşeninin `kirmizi` tonunu kabul ettiğini de gösterir (senin söylediğine göre var).
>
> ## Commit (c) hazırlığı
>
> Dosya listesi (dokuz dosya):
>
> - `src/lib/riskli-abonelikler.ts`
> - `src/lib/riskli-etiket.test.ts`
> - `src/lib/riskli-abonelikler.test.ts`
> - `src/app/(panel)/dashboard/page.tsx`
> - `package.json`
>
> Yani **beş dosya** (dokuz değil, yanlış yazdım).
>
> ```zsh
> git add src/lib/riskli-abonelikler.ts src/lib/riskli-etiket.test.ts src/lib/riskli-abonelikler.test.ts "src/app/(panel)/dashboard/page.tsx" package.json
> ```
>
> ```zsh
> git status
> ```
> "Changes to be committed" altında yalnızca bu beş dosya olmalı.
>
> **Tarama 1 (parola):**
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> Çıktı **boş** olmalı.
>
> **Tarama 2 (sunucu adı):**
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> Sonuç **0** olmalı.
>
> **Tarama 3 (kişi adı):**
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
> Sonuç **0** olmalı.
>
> ## Commit (c) mesajı
>
> - **Summary:**
>   ```
>   feat: riskli abonelik listesi ve dashboard kartı (issue #6)
>   ```
> - **Description** (iki satır bitişik, boş satır yok):
>   ```
>   Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
>   Claude-Session: [önceki günlerdeki satırın aynısı]
>   ```
>
> ## Notlar
>
> - **Tek soru, iki rozet:** Süresi geçmiş kayıtlar kırmızı `✕`, kalanlar sarı `!` simgesiyle gösteriliyor.
> - **Sıralama:** Sorgu bitişe göre artan sıralıyor, süresi geçmişler en üstte.
> - **Yetki:** Kart manager ve finance için aynı. Sayfa zaten `requireUser()` ile korunuyor.
>
> **Varsayımlar:** `Rozet` bileşeni `children` kabul ediyor ve `ton="kirmizi"` geçerli. `Kart` bileşeni `className` alıyor (mevcut kodda öyle kullanılıyor).
>
> **Emin olmadığım:** Kartın küçük ekranda görünümü. Elle testte dar pencerede de bakacağız.
>
> ## Bana gönder
> - `git diff` çıktısı (dashboard)
> - `tsc`, `lint` ("temiz" yeterli), `npm test` ve `npm run test:db` için `tests`, `pass`, `fail`
> - `git status` ve üç taramanın sonucu
>
> Temizse commit (c)'yi atarsın, ardından **Adım 8**'e (ADR bölümü) geçeriz.

### Prompt 18 · 24 Eki 2026 09:23

````text
import KpiKarti from "./KpiKarti"; bu satır için ne yapacağımı anlamadım
````

### Claude cevabı 17 · 24 Eki 2026 09:23

> O satır için **hiçbir şey yapmayacaksın.** Yazım hatası yaptım, o paragrafı karıştırdım.
>
> `import KpiKarti from "./KpiKarti";` satırı dosyada olduğu gibi kalıyor. Dokunma, silme, yanına bir şey ekleme. `Rozet` ve `Kart` import'ları da zaten dosyada var, onlara da dokunmuyorsun.
>
> Değişiklik 1'de yapman gereken tek şey şu:
>
> 1. `import { ltvCacSaglikliMi } from "@/lib/metrikler";` satırını bul.
> 2. Hemen altına şu satırı ekle:
>    ```tsx
>    import { riskliAbonelikler } from "@/lib/riskli-abonelikler";
>    ```
>
> Sonuç şöyle görünmeli (diğer import'lar aynen kalıyor):
>
> ```tsx
> import { ltvCacSaglikliMi } from "@/lib/metrikler";
> import { riskliAbonelikler } from "@/lib/riskli-abonelikler";
> import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "@/lib/bicim";
> ```
>
> Bir de düzeltme: commit (c) için dosya listesinde "dokuz dosya" yazıp ardından beş dosya saymıştım. Doğrusu **beş dosya**, `git add` komutundaki liste de beşi içeriyor. Komut doğru.
>
> Değişiklik 2, 3 ve 4'e geçebilirsin. Bitince `git diff` çıktısını ve kontrol sonuçlarını gönder.

### Prompt 19 · 24 Eki 2026 09:28

````text
kullanici@bilgisayar abonetakip % git --no-pager diff "src/app/(panel)/dashboard/page.tsx"
diff --git a/src/app/(panel)/dashboard/page.tsx b/src/app/(panel)/dashboard/page.tsx
index 5a796b8..fd711e5 100644
--- a/src/app/(panel)/dashboard/page.tsx
+++ b/src/app/(panel)/dashboard/page.tsx
@@ -4,6 +4,7 @@ import { getTenantDb } from "@/lib/tenant";
 import { yoneticiMi } from "@/lib/yetki";
 import { dashboardVerisiniGetir } from "@/lib/dashboard-verisi";
 import { ltvCacSaglikliMi } from "@/lib/metrikler";
+import { riskliAbonelikler } from "@/lib/riskli-abonelikler";
 import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "@/lib/bicim";
 import SayfaBasligi from "@/components/ui/SayfaBasligi";
 import BosDurum from "@/components/ui/BosDurum";
@@ -19,13 +20,22 @@ import KpiKarti from "./KpiKarti";
 
 const linkSinifi =
   "font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900";
+  // Tarihler UTC saklanır, ekranda Türkiye saatine göre gösterilir.
+const TARIH = new Intl.DateTimeFormat("tr-TR", {
+  dateStyle: "medium",
+  timeZone: "Europe/Istanbul",
+});
 
 export default async function DashboardSayfasi() {
   // Layout da giriş kontrolü yapar, ama Next.js layout ile sayfayı birbirinden
   // bağımsız çalıştırır. Bu yüzden her sayfa kendi kontrolünü de yapar.
   const kullanici = await requireUser();
-  const db = await getTenantDb();
-  const veri = await dashboardVerisiniGetir(db);
+   const db = await getTenantDb();
+  // İki sorgu birbirine bağlı değil: paralel çalışır. İkisi de aynı tenant filtreli db'yi kullanır.
+  const [veri, riskliler] = await Promise.all([
+    dashboardVerisiniGetir(db),
+    riskliAbonelikler(db),
+  ]);
 
   const yonetici = yoneticiMi(kullanici.role);
   const donemAdi = ayEtiketi(veri.yil, veri.ay);
@@ -150,11 +160,54 @@ export default async function DashboardSayfasi() {
             </dd>
           </div>
         </dl>
-        <p className="mt-4 text-xs text-slate-500">
+                <p className="mt-4 text-xs text-slate-500">
           Sayılar müşteri bazlıdır: ay içinde plan değiştiren müşteri ne yeni ne iptal
           sayılır.
         </p>
       </Kart>
+
+      <Kart className="mt-4">
+        <h2 className="text-sm font-medium text-slate-600">
+          Riskli abonelikler ({riskliler.length})
+        </h2>
+        <p className="mt-1 text-xs text-slate-500">
+          Dönem bitişine 7 günden az kalmış ve henüz yenilenmemiş aktif abonelikler.
+        </p>
+
+        {riskliler.length === 0 ? (
+          <p className="mt-4 text-sm text-slate-600">Riskli abonelik yok.</p>
+        ) : (
+          <ul className="mt-4 divide-y divide-slate-100">
+            {riskliler.map((r) => (
+              <li
+                key={r.id}
+                className="flex flex-wrap items-center justify-between gap-2 py-3"
+              >
+                <div className="min-w-0">
+                  <p className="truncate text-sm font-medium text-slate-900">
+                    {r.musteriAdi}
+                  </p>
+                  <p className="text-xs text-slate-500">
+                    {r.planAdi} · Dönem bitişi: {TARIH.format(r.bitis)}
+                  </p>
+                </div>
+                {/* Anlam yalnızca renge bırakılmaz: simge + metin */}
+                {r.etiket.gecmis ? (
+                  <Rozet ton="kirmizi">
+                    <span aria-hidden="true">✕&nbsp;</span>
+                    {r.etiket.metin}
+                  </Rozet>
+                ) : (
+                  <Rozet ton="sari">
+                    <span aria-hidden="true">!&nbsp;</span>
+                    {r.etiket.metin}
+                  </Rozet>
+                )}
+              </li>
+            ))}
+          </ul>
+        )}
+      </Kart>
     </div>
   );
 }
\ No newline at end of file
````

### Claude cevabı 18 · 24 Eki 2026 09:28

> Diff mantıken doğru: import, `Promise.all`, `TARIH` sabiti ve yeni kart yerinde. Ama dört yerde girinti bozulmuş. Bunlar çalışmayı etkilemez, yine de commit'e girmesin diye düzeltelim (Prettier kullanmıyorsan VS Code kendiliğinden düzeltmez).
>
> ## Düzeltmeler (`src/app/(panel)/dashboard/page.tsx`)
>
> 1. **`TARIH` yorumu:** `  // Tarihler UTC saklanır...` satırının başında 2 boşluk var, sil. Ayrıca yorumun üstüne bir boş satır ekle:
>    ```tsx
>    const linkSinifi =
>      "font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900";
>
>    // Tarihler UTC saklanır, ekranda Türkiye saatine göre gösterilir.
>    const TARIH = new Intl.DateTimeFormat("tr-TR", {
>    ```
>
> 2. **`const db = await getTenantDb();`:** başında 3 boşluk var, olması gereken 2. Fazladan bir boşluğu sil.
>
> 3. **`<p className="mt-4 text-xs text-slate-500">`** (Müşteri özeti kartının altındaki not): başında 16 boşluk var, olması gereken 8. Bu satırı değiştirmemiş olmamız gerekiyordu; diff'te kırmızı/yeşil görünmesinin nedeni bu. Girintiyi eski hâline getir (8 boşluk).
>
> 4. Dosya sonundaki "No newline at end of file" önceki hâlinden kalma, dokunma.
>
> Kaydet (`Cmd + S`), sonra kontrol:
>
> ```zsh
> git --no-pager diff "src/app/(panel)/dashboard/page.tsx"
> ```
> Bu sefer yalnızca import, `TARIH` bloğu (boş satırıyla), `Promise.all` bloğu ve yeni kart satırları değişmiş olmalı. `<p className="mt-4 ...">` ve `const db` satırları diff'te **görünmemeli** (`const db` satırı kalırsa sorun yok, ama yalnızca `Promise.all` yorumuyla birlikte).
>
> ```zsh
> npx tsc --noEmit
> npm run lint
> npm test
> npm run test:db
> ```
> Beklenen: temiz, 75/75 ve 48/48, `fail 0`.
>
> Temizse commit (c) için önceki mesajdaki `git add` (beş dosya), `git status` ve üç tarama komutlarını çalıştır, sonuçları gönder. Sonra GitHub Desktop'ta commit (c)'yi at, ardından **Adım 8**'e (ADR) geçeriz.

### Prompt 20 · 24 Eki 2026 09:39

````text
Commit (c) atıldı (13fec04, 5 dosya). tsc, lint temiz, npm test 75/75, npm run test:db 48/48, üç tarama temiz. Adım 8'e (ADR bölümü) geç. ADR metnini kopyalarken yalnızca bloğun içindeki metni alacağım, dış çerçeveyi değil.
````

### Claude cevabı 19 · 24 Eki 2026 09:40

> # Adım 8 • ADR bölümü
>
> `docs/02_ADR.md` dosyasını aç, en sona git, bir boş satır bırak ve aşağıdaki bloğun içindeki metni yapıştır. Köşeli parantezli yerleri (`[TARİH]`, `[SONUÇ ...]`) bitirdiğimizde birlikte dolduracağız. Elle test henüz yapılmadığı için "Elle test" bölümü şimdilik taslak.
>
> ````markdown
> ## Gün 10 kararları ([TARİH]): SSE uyarıları ve riskli abonelik listesi
>
> **Durum:** Kod tamamlandı, `gun10-sse` dalında, PR bekliyor. [PR birleşince squash commit numarası yazılacak.]
> **Sonuç:** `npm test` 75 test, `npm run test:db` 48 test geçiyor; `npm run build` [sonuç yazılacak].
> Uyarılar ve riskli liste Neon test dalında elle kontrol edildi (aşağıda "Elle test").
>
> ### Kararlar
>
> **K10.1: Bağlantılar sunucu belleğinde, firmaya göre gruplanarak tutulur**
> - **Karar:** `src/lib/sse-hub.ts` "tenantId → açık bağlantılar" listesini bellekte tutar. Mesaj yalnızca
>   verilen firmanın kümesine yazılır; başka firmanın bağlantısı o kümede olmadığı için mesajı alamaz.
>   `tenantId` her zaman oturumdan gelir (`api/events/route.ts` ve `abonelikler/actions.ts`), istemciden asla.
>   Hub tek örnek olarak `globalThis` üzerinde saklanır: geliştirme modunda yeniden yüklemede liste silinmez ve
>   route ile sunucu işlemi aynı listeyi görür.
> - **Gerekçe:** Uygulama Render'da tek Node süreci olarak çalışır; bağlantıların ve iptallerin hepsi aynı
>   süreçten geçer. Harici servis (Redis, Pusher vb.) kapsam dışıdır (WON'T). Hub Next.js'e ve veritabanına
>   bağlı değildir, bu yüzden `npm test` ile veritabanı olmadan test edilir.
> - **Sınır:** İkinci bir sunucu süreci açılırsa birindeki iptali diğerindeki kullanıcılar duymaz. O durumda
>   harici bir servis gerekir.
>
> **K10.2: Firma başına en fazla 20 açık bağlantı; sınır dolunca YENİ bağlantı reddedilir**
> - **Karar:** `FIRMA_BASINA_SINIR = 20`. Sınır doluysa uç nokta 429 döner, açık bağlantılara dokunulmaz.
>   Sınır kontrolü ile listeye ekleme tek senkron adımdır; Node tek iş parçacıklı olduğu için iki istek araya giremez.
> - **Gerekçe:** En eski bağlantıyı kapatmak döngü yaratırdı: kapatılan sekme kendiliğinden yeniden bağlanır ve
>   başka bir sekmeyi düşürürdü. 429 alan tarayıcı yeniden denemeyi bırakır.
> - **Sonuç:** 21. sekmede canlı uyarı gelmez, sayfanın geri kalanı normal çalışır. Bir firmanın dolu sınırı
>   başka firmayı etkilemez.
>
> **K10.3: SSE uç noktası API gibi davranır: 401, 403, 429; başlıklar ve nabız**
> - **Karar:** `GET /api/events` oturumu `getCurrentUser()` ile okur (`requireUser()` kullanılmaz, çünkü o
>   giriş sayfasına yönlendirir). Giriş yoksa 401, rol `manager` veya `finance` değilse 403, sınır doluysa 429.
>   Başarılı yanıtın başlıkları: `Content-Type: text/event-stream; charset=utf-8`,
>   `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`. Akışın ilk satırı `retry: 5000`'dir;
>   her 25 saniyede bir boş nabız satırı gönderilir.
> - **Temizlik:** Tarayıcı kapanması, isteğin iptal sinyali, yazma hatası ve ömür dolması tek `temizle()`
>   fonksiyonuna çıkar (zamanlayıcılar durdurulur, bağlantı listeden silinir). Bir yol çalışmasa bile
>   diğerleri belleği temizler.
> - **Not:** `proxy.ts` ve `middleware.ts` yoktur; uç noktanın yanıtına araya giren bir katman yoktur.
>
> **K10.4: Bağlantı azami ömrü 15 dakika, yalnızca `route.ts` içinde**
> - **Karar:** Sunucu her bağlantıyı en geç 15 dakikada kapatır. Tarayıcı `retry` süresi (5 sn) sonra güncel
>   çerezle yeniden bağlanır. `sse-hub.ts` ve testleri bu ömrü bilmez.
> - **Gerekçe:** Oturum çerezi imzalıdır ama sunucuda tutulmaz; sunucu çıkışı bilemez. Ömür sınırı, çıkış
>   yapmış ya da silinmiş kullanıcının bağlantısının en geç 15 dakikada 401 almasını sağlar.
> - **Bedel:** Kapanma ile yeniden bağlanma arasındaki 5 saniyelik aralıkta yapılan iptalin canlı uyarısı
>   kaçabilir (bkz. Bilinen sınırlar).
>
> **K10.5: İptal uyarısı yalnızca iptal başarıyla yazıldıktan sonra gönderilir**
> - **Karar:** `abonelikIptal` içinde, transaction başarılı olduktan sonra `sseHub.yayinla(kullanici.tenantId, ...)`
>   çağrılır. Müşteri adı mevcut sorguya eklenir (`customer: { select: { name: true } }`), sorgu yine
>   `getTenantDb()` üzerindendir.
> - **Kurallar:** Çift tıklamada ikinci istek `updateMany` ile 0 satır etkiler ve fonksiyondan uyarı gönderilmeden
>   çıkılır; yani uyarı iki kez gitmez. Hatada da uyarı gitmez. Uyarı gönderilemese bile iptal başarılı sayılır:
>   yayın kendi `try/catch` bloğundadır, hata yutulur ve kullanıcıya gösterilmez.
> - **Kapsam:** Uyarı iptali yapan kişinin kendi pencerelerine de gider. Yalnızca ilgili firmanın açık bağlantılarına ulaşır.
>
> **K10.6: Uyarı bandı panelin her sayfasında görünür; çıkışta bağlantı kapanır**
> - **Karar:** `UyariDinleyici` bileşeni `(panel)/layout.tsx` içindedir. Layout sayfa geçişlerinde yeniden
>   çizilmediği için bağlantı sayfa değiştikçe kopmaz.
> - **Çıkış:** Çıkış yapan kullanıcı `/giris` sayfasına gider. Bu sayfa `(panel)` layout'unun dışında olduğu için
>   bileşen kaldırılır, `EventSource` kapatılır ve sunucudaki bağlantı listeden silinir.
> - **Güvenlik:** Müşteri adı React ile metin olarak basılır, HTML olarak işlenmez. Sunucudan gelen veri
>   doğrulanır; bozuk biçim sessizce yok sayılır. Ekranda en fazla 5 bant tutulur, en yenisi üstte.
> - **Hata davranışı:** Uç nokta 401, 403 veya 429 dönerse `EventSource` yeniden denemeyi bırakır; bileşen
>   hata göstermeden sessizce durur.
>
> **K10.7: Riskli abonelik kuralı issue #6'dan gelir; süresi geçmiş ACTIVE kayıtlar da listededir**
> - **Karar:** `src/lib/riskli-abonelikler.ts`: `status = ACTIVE` ve `currentPeriodEnd < şimdi + 7 gün`.
>   Süresi geçmiş ama hâlâ ACTIVE olanlar bu tek koşula girer, ayrı koşul yazılmaz. Tam 7 gün kalmış abonelik
>   "7 günden az" olmadığı için girmez. Eşik `RISK_GUN = 7` sabitidir, yalnızca bu dosyada tanımlıdır.
> - **Yenileme ve iptal:** Yenileme `currentPeriodEnd`'i ileri taşıdığı için yenilenmiş abonelik listeye girmez.
>   İptal edilmiş abonelik `status` koşuluna takılır.
> - **Etiket:** `riskEtiketi(bitis, simdi)` saf fonksiyondur: geçmişse "Süresi geçmiş", 1 günden azsa
>   "1 günden az kaldı", değilse "X gün kaldı" (milisaniye farkından hesaplanır, tam gün aşağı yuvarlanır).
> - **Dashboard:** Liste `dashboardVerisiniGetir` içine konmadı; sayfada ayrı fonksiyon olarak `Promise.all`
>   ile paralel çağrılır. `dashboard-verisi.ts` ve testi değişmedi. Liste sayfa açılışında hesaplanır, SSE
>   yalnızca iptal olayını canlı iletir. Manager ve finance aynı listeyi görür.
> - **Gösterim:** "Süresi geçmiş" kırmızı rozet ve `✕` simgesiyle, "X gün kaldı" sarı rozet ve `!` simgesiyle
>   gösterilir; anlam yalnızca renge bırakılmaz. Liste bitişi en yakın olandan sıralıdır.
>
> ### Test kapsamı
> - `sse-hub.test.ts` (11: firma ayrımı, aynı firmada iki bağlantı, ayrılma, boş firmanın silinmesi, bozuk
>   bağlantı, çift ayrılma, sınır ile üç sınır senaryosu, varsayılan sınır 20, mesaj biçimi) ve
>   `riskli-etiket.test.ts` (5: geçmiş, 1 günden az, 1 gün, 3 gün, 6 gün 23 saat): `npm test`
> - `riskli-abonelikler.test.ts` (4: dahil olanlar ve dışarıda kalanlar, 7 gün sınırı, etiket ve sıralama,
>   A ve B ayrımı, ad alanları): `npm run test:db`
> - Sabit "şimdi" yerine bir kez alınan gerçek saat kullanılır; her firmadaki 30 gün kalan kayıt kaymaz.
>
> ### Elle test (Neon test dalı)
> Pencereler: A manager (Chrome), A finance (Chrome gizli), B manager (Safari), B finance (Safari özel).
> - [SONUÇ: aynı firmada iptal, uyarı A'nın iki penceresinde görünüyor mu]
> - [SONUÇ: B pencerelerinde uyarı görünmüyor mu; ters yönde de]
> - [SONUÇ: `events` isteği türü `eventsource`, üç başlık görünüyor mu]
> - [SONUÇ: çıkış yapılmış pencerede `/api/events` 401 mi]
> - [SONUÇ: sunucu yeniden başlatma ve "Offline" denemesinde hata ekranı çıkmadı mı; yeni uyarı ulaştı mı]
> - [SONUÇ: Neon SQL Editor'de tek kaydın `currentPeriodEnd` değeri güncellenerek riskli liste ve "Süresi geçmiş" etiketi]
>
> ### Bilinen sınırlar
> - Tek sunucu süreci varsayılır (K10.1). İkinci instance açılırsa uyarılar yalnızca aynı süreçtekilere ulaşır.
> - Render uykudayken ya da yeniden başlarken yapılan iptallerin canlı uyarısı kaybolur. İptal kaydı
>   veritabanında durduğu için veri kaybı yoktur ve abonelik listesinde görünür. [Açık bir SSE bağlantısının
>   ücretsiz servisi uyanık tutup tutmadığı Render'da denenmedi.]
> - Her bağlantı 15 dakikada bir kapanıp yeniden bağlanır; kapanma ile bağlanma arasındaki aralıkta
>   (`retry: 5000`, yaklaşık 5 saniye) yapılan iptalin canlı uyarısı kaçabilir. Uyarı gelmese bile iptal
>   kaydedilir ve listede görünür.
> - Kullanıcı başka bir sekmede çıkış yaparsa, açık kalan sekmenin bağlantısı en geç 15 dakika boyunca
>   firmanın uyarılarını almaya devam eder. Kullanıcı silinirse ya da rolü değişirse de aynı süre geçerlidir.
>   Neden: oturum çerezi sunucuda tutulmuyor, sunucu çıkışı bilemiyor.
> - Firma başına 20 bağlantı sınırı dolunca ek sekmeler canlı uyarı almaz (K10.2).
> - HTTP/1.1'de tarayıcı bir siteye en fazla 6 bağlantı açar; aynı tarayıcıda çok sekme açılırsa sayfalar
>   takılabilir. Üretimde HTTP/2 kullanıldığı için beklenmez, geliştirmede dikkat edilmelidir.
> - `abonelikIptal` sunucu işlemi `next/cache` kullandığı için mevcut test düzeninde doğrudan çağrılmıyor;
>   yayının bağlanması elle testle doğrulanır. Hub'ın firma ayrımı otomatik testlidir.
> - Arayüz için otomatik ekran testi yoktur. Next.js'in sıkıştırmasının `no-transform` başlığına uyup
>   uymadığı elle testte uyarının gecikmesine bakılarak doğrulanır.
>
> ### Süreç notları
> - `package.json` için tam dosya yerine yalnızca betik satırlarının sonuna dosya adı eklendi
>   (`perl` ile, `git diff` ile doğrulandı).
> - Dosyalar terminalden boş oluşturuldu, kod VS Code'a yapıştırıldı. Yapıştırmada bozulan girintiler
>   commit öncesi `git diff` ile yakalandı ve düzeltildi.
> - Commit'ler dört parçaya bölündü: (a) hub ve testi, (b) uç nokta, iptal yayını, dinleyici ve layout,
>   (c) riskli abonelikler ve dashboard kartı, (d) bu ADR bölümü. Her commit öncesi üç tarama ve testler çalıştırıldı.
> - Elle test yalnızca `npm run dev:test` ile Neon test dalında yapıldı; `npm run dev` kullanılmadı.
> - Commit (a) trailer'ı Claude Opus 5.5, sonraki commit'ler Claude Sonnet 5.5 (sohbette model değişti).
> ````
>
> ## Ekledikten sonra
>
> ```zsh
> git --no-pager diff --stat
> ```
> Yalnızca `docs/02_ADR.md` değişmiş olmalı ve yalnızca satır eklenmiş olmalı (silinen satır yok).
>
> **Commit (d)'yi şimdi atma.** "Elle test" bölümünde boş yerler var. Adım 9'daki elle testten sonra onları dolduracağız, ardından `git add docs/02_ADR.md`, üç tarama ve commit (d).
>
> ## Üç düzeltme
>
> Metni yazarken `riskli-abonelikler.test.ts` için "4" test yazdım ama maddeleri beşe yakın sıraladım. Doğru sayı **4** (liste, etiket ve sıralama, A ve B ayrımı, ad alanları); "7 gün sınırı" ilk testin içinde. Bunu yapıştırdığın metinde şu satırla düzelt:
>
> ```
>   A ve B ayrımı, ad alanları): `npm run test:db`
> ```
> Önündeki "7 gün sınırı" ifadesini silmen yeterli. Ayrıca "Süreç notları"ndaki trailer satırında Opus/Sonnet bilgisi senin gerçek commit geçmişine uymuyorsa düzelt.
>
> ## Sıradaki: Adım 9 (elle test)
>
> Başlamadan önce:
> - A ve B firmalarının test dalında en az **2'şer ACTIVE aboneliği** olmalı (yoksa arayüzden oluştur).
> - Uygulama yalnızca `npm run dev:test` ile açılacak; `npm run dev` kullanma.
>
> Hazır olduğunda "Adım 9'a geç" yaz. Riskli liste için Neon SQL Editor komutunu o aşamada, hangi dalda olduğunu doğrulatarak vereceğim.

### Prompt 21 · 24 Eki 2026 09:43

````text
ADIM 9 A GEÇ
````

### Claude cevabı 20 · 24 Eki 2026 09:43

> # Adım 9: Elle test (yalnızca `npm run dev:test`)
>
> ## Başlamadan önce
>
> - A ve B firmalarının her birinde en az **2 ACTIVE abonelik** olmalı. Her firmada bir iptal yapacağız, A'daki kalan abonelik riskli liste testinde kullanılacak. Eksikse `npm run dev:test` açıkken arayüzden (Abonelikler sayfası) ekle.
> - Terminalde `npm run dev` **değil**, şunu çalıştır:
>
> ```zsh
> npm run dev:test
> ```
>
> Canlı veritabanı koruması başlangıçta çalışır. Hata verirse mesajı bana gönder.
>
> ## Pencereler
>
> | Pencere | Tarayıcı | Hesap |
> |---|---|---|
> | 1 | Chrome, normal | A, manager |
> | 2 | Chrome, gizli (`Cmd + Shift + N`) | A, finance |
> | 3 | Safari, normal | B, manager |
> | 4 | Safari, özel pencere (`Cmd + Shift + N`) | B, finance |
>
> Dördünde de giriş yap, **Abonelikler** sayfasını aç. Aynı tarayıcıda fazla sekme açma.
>
> ## Kontroller
>
> **1. Aynı firma.** Pencere 2'de bir aktif aboneliği **İptal et** (onay penceresinde Tamam). Pencere 1 ve 2'de sayfa yenilenmeden kırmızı "… aboneliğini iptal etti" bandı görünmeli. 3 ve 4'te **görünmemeli**.
>
> **2. Ters yön.** Pencere 3'te bir aboneliği iptal et. Bant yalnızca 3 ve 4'te görünmeli, 1 ve 2'de görünmemeli.
>
> **3. Başlıklar.** Pencere 1'de `Cmd + Option + I`, **Network** sekmesi, sayfayı yenile. `events` isteğine tıkla. Türü `eventsource` olmalı. Response Headers'ta `content-type: text/event-stream`, `cache-control: no-cache, no-transform` ve `x-accel-buffering: no` görünmeli.
>
> **4. Çıkış yapılmış pencere.** Pencere 4'te çıkış yap, adres çubuğuna `http://localhost:3000/api/events` yaz. Yanıt "Giriş yapmanız gerekiyor." olmalı. Network sekmesinde durum kodunu da bakabilirsin (401). Ayrıca çıkıştan sonra giriş sayfasında bant görünmemeli.
>
> **5. Kopma ve yeniden bağlanma.**
> - Terminalde `Control + C` ile sunucuyu durdur, 10 saniye bekle, `npm run dev:test` ile yeniden başlat. Pencere 1 ve 2'de hata ekranı çıkmamalı. Sunucu ayağa kalkınca pencere 1'de **sayfayı yenilemeden** bekle, sonra pencere 2'de bir iptal yap (bunun için A'da yeterli ACTIVE abonelik kalmış olmalı; kalmadıysa B'yi kullan, pencere 3 ve 4'te dene). Uyarı doğru pencerelere ulaşmalı.
> - Pencere 1'de DevTools Network'te **Offline** seç, birkaç saniye bekle, **No throttling**'e geri al. Sayfada hata çıkmamalı.
>
> **6. Bağlantı sınırı (isteğe bağlı).** Birim testi zaten var, elle denemeyi atlayabilirsin.
>
> ## Riskli liste (Neon SQL Editor, tek kayıt)
>
> Bu adım **test dalında** yapılacak. Canlıda yapılırsa gerçek veri bozulur, o yüzden iki aşamalı doğrulama yapıyoruz.
>
> **a) Dalı doğrula.** Neon konsolunda projeyi aç, üstteki dal seçicide **test dalının** seçili olduğunu gör (canlı dalın adı değil). Sonra **SQL Editor**'ı aç ve editörün de aynı dalda olduğunu kontrol et. Emin değilsen bana dal adlarını yaz.
>
> **b) Dalı veriyle doğrula** (yalnızca okur, bir şey değiştirmez):
>
> ```sql
> SELECT s.id, t.name AS firma, c.name AS musteri, s.status, s."currentPeriodEnd"
> FROM subscriptions s
> JOIN tenants t ON t.id = s."tenantId"
> JOIN customers c ON c.id = s."customerId"
> WHERE s.status = 'ACTIVE'
> ORDER BY t.name, c.name;
> ```
>
> Dönen firma adları senin **test** firmalarınsa devam et. Gerçek müşteri firmaları görürsen **dur** ve bana yaz.
>
> **c) Tek kaydı güncelle.** A firmasından, iptal etmediğin bir aboneliğin `id` değerini kopyala (tırnaklar içine yapıştır) ve çalıştır:
>
> ```sql
> UPDATE subscriptions
> SET "currentPeriodEnd" = (now() AT TIME ZONE 'utc') - interval '2 days'
> WHERE id = 'BURAYA_ID'
> RETURNING id, status, "currentPeriodEnd";
> ```
>
> Tek satır dönmeli. Sonra pencere 1'de **Dashboard**'u yenile: "Riskli abonelikler (1)" kartında kırmızı `✕ Süresi geçmiş` rozeti görünmeli. Pencere 3'te (B) aynı kayıt **görünmemeli**.
>
> İstersen sarı rozeti de görmek için aynı komutu `- interval '2 days'` yerine `+ interval '3 days'` ile çalıştır. Dashboard'da `! 2 gün kaldı` veya `3 gün kaldı` görmelisin (anlık saatten dolayı bir eksik de çıkabilir).
>
> ## Bana gönder
>
> Her madde için "oldu / olmadı" yeterli (1, 2, 3, 4, 5, riskli kırmızı, riskli sarı). Bir şey beklediğin gibi değilse tam olarak ne gördüğünü ve Terminal 1'deki hata satırlarını yaz. Hepsi geçerse ADR'nin "Elle test" boşluklarını birlikte dolduracağız, ardından commit (d).
>
> **Emin olmadıklarım:** Next.js'in sıkıştırması uyarıyı geciktirirse 1. maddede bant geç görünür (`no-transform` bunu engellemeli). Ayrıca tablo adlarını (`subscriptions`, `tenants`, `customers`) şemadaki `@@map` satırlarından aldım. Sorgu hata verirse hata mesajını gönder.

### Prompt 22 · 24 Eki 2026 09:48

````text
pencerelerde yapmam gereknelri canlı sitede mi yoksa yerel sitede mi yapmam gerekiyot
````

### Claude cevabı 21 · 24 Eki 2026 09:48

> **Yerel sitede**, yani kendi bilgisayarında çalışan uygulamada. Canlı site (Render) bu testlerde hiç kullanılmayacak.
>
> - Terminalde `npm run dev:test` çalışırken uygulama `http://localhost:3000` adresinde açılır. Dört pencerenin hepsinde bu adresi kullan (giriş sayfası: `http://localhost:3000/giris`).
> - Bu komut uygulamayı **Neon test dalına** bağlar. Yani iptal ettiğin abonelikler gerçek müşteri verisi değil, test verisi olur.
> - Render'daki canlı adresi hiçbir pencerede açma ve oraya giriş yapma. Zaten kodumuz henüz `main`'e birleşmedi, canlıda SSE de yok.
>
> Kısa kontrol: adres çubuğunda `localhost:3000` yazıyorsa doğru yerdesin.
>
> Not: A ve B hesaplarıyla giriş yaparken, Gün 6'dan kalan **test dalı** hesaplarını kullan (canlı sitedeki gerçek hesabını değil). Bu hesapların parolası test dalında tanımlı olanlar.

### Prompt 23 · 24 Eki 2026 10:06

````text
her şey olması gerektiği gibi
````

### Claude cevabı 22 · 24 Eki 2026 10:06

> Tüm maddeleri (1-5, kırmızı ve sarı riskli rozet) geçmiş sayıyorum. İsteğe bağlı 6. madde (bağlantı sınırı) atlandı, onu ADR'de belirteceğim. Atladığın ya da beklediğinden farklı çıkan bir madde olduysa söyle, metni ona göre düzeltirim. Önce terminaldeki `npm run dev:test`'i `Control + C` ile durdur.
>
> # Adım 10: ADR'yi tamamlama ve commit (d)
>
> ## 1) Başlık ve durum satırları
>
> `docs/02_ADR.md` içindeki yeni bölümde şu değişiklikleri yap.
>
> Başlık satırını şöyle yaz:
>
> ```
> ## Gün 10 kararları (24 Ekim 2026): SSE uyarıları ve riskli abonelik listesi
> ```
>
> "Sonuç" satırındaki `npm run build` kısmı için önce şunu çalıştır:
>
> ```zsh
> npm run build
> ```
> Üretim derlemesini yapar. Başarılıysa satırı `npm run build başarılı.` olarak yaz. Hata verirse mesajın tamamını gönder, devam etmeyelim.
>
> "Durum" satırında PR numarası ve squash commit numarası PR birleşince belli olacak. Şimdilik `[PR birleşince squash commit numarası yazılacak.]` olarak bırak.
>
> ## 2) "Elle test" bölümünü değiştir
>
> Köşeli parantezli altı satırı silip yerine şunları yaz:
>
> ```markdown
> - Aynı firmada iptal: A finance penceresinde yapılan iptalin uyarısı A'nın iki penceresinde sayfa yenilenmeden göründü.
> - Başka firma: B manager ve B finance pencerelerinde A'nın uyarısı görünmedi. Ters yönde (B'de iptal) A pencerelerinde görünmedi.
> - Başlıklar: `events` isteğinin türü `eventsource`; `text/event-stream`, `no-cache, no-transform` ve `no` değerli `x-accel-buffering` başlıkları göründü.
> - Çıkış yapılmış pencerede `/api/events` 401 ve "Giriş yapmanız gerekiyor." döndü; giriş sayfasında bant görünmedi.
> - Sunucu yeniden başlatma ve DevTools "Offline" denemesinde hata ekranı çıkmadı, bağlantı kendiliğinden yeniden kuruldu ve yeni iptal uyarısı doğru pencerelere ulaştı.
> - Riskli liste: Neon SQL Editor'de test dalı doğrulandıktan sonra tek aboneliğin `currentPeriodEnd` değeri 2 gün geriye alındı; dashboard'da "Riskli abonelikler (1)" ve kırmızı `✕ Süresi geçmiş` rozeti göründü, B firmasında görünmedi. Değer 3 gün ileriye alınınca sarı `! … gün kaldı` rozeti göründü.
> - Yapılmadı: 21. bağlantıyla 429 denemesi (birim testi var), Render'da uyku davranışı.
> ```
>
> ## 3) İki küçük düzeltme
>
> - "Test kapsamı"nda `riskli-abonelikler.test.ts` satırındaki "7 gün sınırı" ifadesini sil (4 test: liste, etiket ve sıralama, A ve B ayrımı, ad alanları).
> - "Süreç notları"ndaki trailer satırı gerçek geçmişine uyuyor mu bak: (a) Opus 5.5, (b) ve (c) Sonnet 5.5, (d) Sonnet 5.5 olacak. Farklıysa düzelt.
>
> ## 4) Kontrol ve commit (d)
>
> ```zsh
> git --no-pager diff --stat
> ```
> Yalnızca `docs/02_ADR.md` değişmiş olmalı, silinen satır olmamalı.
>
> ```zsh
> git add docs/02_ADR.md
> git status
> ```
> "Changes to be committed" altında yalnızca bu dosya olmalı.
>
> **Tarama 1:**
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> ```
> Çıktı **boş** olmalı.
>
> **Tarama 2:**
> ```zsh
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
> Sonuç **0** olmalı.
>
> **Tarama 3:**
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
> Sonuç **0** olmalı. ADR'ye kişi adı yazmadığımız için 0 bekliyorum.
>
> GitHub Desktop'ta:
>
> - **Summary:**
>   ```
>   docs: Gün 10 ADR bölümü (SSE uyarıları, riskli abonelikler)
>   ```
> - **Description** (iki satır bitişik):
>   ```
>   Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
>   Claude-Session: [önceki günlerdeki satırın aynısı]
>   ```
>
> ## 5) Yayınlama ve PR
>
> Commit (d)'den sonra GitHub Desktop'ta **Publish branch**, ardından **Create Pull Request**. PR açıklamasına şunları yazabilirsin:
>
> - Issue #6'yı kapatır (kabul kriteri: bitişe 7 günden az kalmış ACTIVE abonelikler).
> - Test sonuçları: `npm test` 75/75, `npm run test:db` 48/48, `npm run build` başarılı.
> - SSE tek sunucu süreci varsayar; ayrıntılar `docs/02_ADR.md` Gün 10 bölümünde.
>
> Birleştirmeyi (squash) sen yaparsın. Birleşince squash commit numarasını ADR'deki "Durum" satırına yazmak için küçük bir ek commit gerekir. Gün 9'da nasıl yaptıysan öyle ilerle.
>
> ## Bana gönder
> - `npm run build` sonucu (başarılı / hata)
> - `git status` ve üç taramanın sonucu
>
> **Emin olmadığım:** Render'daki canlı ortamda SSE'nin davranışı. Birleştirip yayına alındıktan sonra canlıda tek bir kısa kontrol (giriş yap, `/api/events` başlıklarına bak) yapmak iyi olur. İstersen o kontrolü de birlikte planlarız.

