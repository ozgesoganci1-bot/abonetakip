# Gün 1: 7 GitHub Issue (düzeltilmiş sürüm)

> Gün 1 sohbetinin çıktısı, 14 günlük planımıza göre düzeltildi. Değişenler: gün aralıkları, Issue 3 (pasife alma yetkisi), Issue 4 (kapsam dışı "müşteri detay sayfası" çıkarıldı, işlem bütünlüğü eklendi), Issue 5 (4 KPI kartı), Issue 6 (riskli abonelik kuralı netleşti), Issue 7 (12 ay).
> Kullanım: Her issue için **Başlık** satırını GitHub'daki Title alanına, kod bloğunun içini açıklama alanına yapıştır, etiketi seç.

## Özet tablo

| # | Başlık | Etiket | Plandaki gün |
|---|---|---|---|
| 1 | Kayıt, giriş ve roller | must | Gün 3 |
| 2 | Kiracı (tenant) izolasyonu | must | Gün 3 (yardımcı fonksiyon), Gün 6 (testler) |
| 3 | Müşteri ve plan yönetimi | must | Gün 4 |
| 4 | Abonelik yaşam döngüsü | must | Gün 5 |
| 5 | KPI dashboard | must | Gün 8-9 |
| 6 | SSE ile iptal uyarısı ve riskli abonelik listesi | should | Gün 10 |
| 7 | Aylık MRR grafiği | should | Gün 11 |

Gün 2 (veri modeli, Neon bağlantısı, ilk deploy) tüm issue'ların zeminidir, ayrı issue açılmaz. Gün 7 tampon, Gün 12 güvenlik gözden geçirme, Gün 13 README ve demo verisi, Gün 14 son deploy ve sunumdur.

---

## Issue 1

**Başlık:** `Kayıt, giriş ve roller`
**Etiket:** must

```markdown
## Açıklama
Bir yazılım firması sisteme kendi hesabını açabilmeli ve çalışanlarını rol ile ekleyebilmeli. Bu özellik olmadan diğer özelliklerin hiçbiri kime ait olduğunu bilemez. Roller, finans çalışanının ayarlara ve kullanıcı yönetimine dokunmasını engeller.

## Kabul kriterleri
- [ ] Kayıt formu tek seferde yeni bir firma (tenant) ve o firmanın `manager` kullanıcısını oluşturur
- [ ] Parolalar veritabanında bcrypt özeti olarak saklanır, düz metin parola bulunmaz
- [ ] Aynı e-posta ile ikinci kez kayıt olunamaz, parola en az 8 karakter olmalıdır
- [ ] Doğru e-posta ve parola ile giriş yapılınca korumalı ana sayfa açılır
- [ ] Yanlış girişte "E-posta veya parola hatalı" mesajı görünür ve oturum açılmaz
- [ ] Oturum çerezi httpOnly'dir
- [ ] Manager, kendi firmasına `finance` rolünde kullanıcı ekleyebilir
- [ ] Finance rolü kullanıcı yönetimi sayfasına girince 403 alır (sunucu tarafında kontrol edilir)
- [ ] Giriş yapmamış biri korumalı bir sayfaya girerse giriş sayfasına yönlendirilir
- [ ] Çıkış yapınca oturum kapanır

**Etiket:** must
**Plandaki gün:** Gün 3
```

## Issue 2

**Başlık:** `Kiracı (tenant) izolasyonu`
**Etiket:** must

```markdown
## Açıklama
Sistemi birden çok firma kullanır ve her firma yalnızca kendi verisini görmelidir. Tek bir unutulmuş filtre başka bir firmanın müşteri ve gelir bilgilerini açığa çıkarır. Bu yüzden izolasyon her sorguda ve tek bir merkezden uygulanır.

## Kabul kriterleri
- [ ] TENANTS dışındaki her tabloda `tenantId` alanı zorunludur
- [ ] Tenant filtresi tek bir merkezi yardımcı fonksiyondan uygulanır, sorgularda elle tekrar yazılmaz
- [ ] `tenantId` yalnızca oturumdan okunur; istekte (form, URL) gelen başka bir `tenantId` dikkate alınmaz
- [ ] A firmasının kullanıcısı B firmasına ait bir kaydın adresini açınca 404 ("bulunamadı") alır
- [ ] A firmasının kullanıcısı listelerde ve dashboardda yalnızca A firmasının kayıtlarını görür
- [ ] Otomatik test: iki farklı kiracıyla A, B'nin müşteri, plan ve aboneliğini göremez ve değiştiremez
- [ ] İki sahte firma ve her birinde manager ile finance kullanıcılarıyla yapılan elle test tablosu uygulandı

**Etiket:** must
**Plandaki gün:** Gün 3 (yardımcı fonksiyon), Gün 6 (testler)
```

## Issue 3

**Başlık:** `Müşteri ve plan yönetimi`
**Etiket:** must

```markdown
## Açıklama
Firma, abonelik sattığı müşterilerini ve fiyat planlarını sisteme girebilmelidir. Bunlar MRR ve churn hesabının temel verisidir. Kayıtlar silinmez, geçmiş metriklerin bozulmaması için pasife alınır.

## Kabul kriterleri
- [ ] Manager ve finance müşteri ekleyebilir, düzenleyebilir ve listeleyebilir (ad, e-posta)
- [ ] Manager ve finance plan ekleyebilir ve düzenleyebilir: ad, fiyat (TL, tam sayı, 0'dan büyük), aralık (MONTHLY veya YEARLY)
- [ ] Fiyat alanına ondalıklı, negatif veya boş değer girilince sunucu kaydı reddeder ve Türkçe hata mesajı gösterir
- [ ] Pasife alma işlemini yalnızca manager yapabilir; finance denerse sunucu reddeder
- [ ] Müşteri veya plan pasife alınınca kayıt veritabanında kalır (`isActive=false`), varsayılan listede gizlenir, "pasifleri göster" seçeneği vardır
- [ ] Pasif plan, yeni abonelik başlatma ekranındaki plan listesinde görünmez
- [ ] Aktif aboneliği olan müşteri veya plan pasife alınamaz (bu kontrol Gün 5'te abonelikler yazılınca tamamlanır)
- [ ] Tüm girdiler sunucu tarafında doğrulanır

**Etiket:** must
**Plandaki gün:** Gün 4 (kontrolün tamamlanması Gün 5)
```

## Issue 4

**Başlık:** `Abonelik yaşam döngüsü`
**Etiket:** must

```markdown
## Açıklama
Bir müşterinin aboneliği başlatılabilmeli, yenilenebilmeli ve iptal edilebilmelidir. Her değişiklik olay kaydı olarak tutulur; churn ve MRR geçmişi bu kayıtlardan hesaplanır. Kurallar, hatalı veya çift aboneliğin oluşmasını engeller.

## Kabul kriterleri
- [ ] Aktif bir müşteri ve aktif bir plan seçilerek abonelik başlatılır; durum ACTIVE olur, bitiş dönemi plan aralığına göre hesaplanır, SUBSCRIPTION_EVENTS tablosuna STARTED yazılır
- [ ] Zaten ACTIVE aboneliği olan müşteriye ikinci abonelik başlatılamaz, anlaşılır hata gösterilir
- [ ] ACTIVE abonelik yenilenince bitiş dönemi bir aralık ileri alınır ve RENEWED olayı yazılır
- [ ] Abonelik iptal edilince durum CANCELED olur, iptal tarihi yazılır ve CANCELED olayı yazılır
- [ ] CANCELED bir abonelik yenilenemez; "yeni abonelik başlatın" yönlendirmesi gösterilir
- [ ] İptal edilmiş müşteriye yeni abonelik başlatılabilir
- [ ] Abonelik ve olay kaydı tek işlemde (transaction) yapılır; biri başarısızsa ikisi de geri alınır
- [ ] Başka firmanın müşteri veya plan kimliğiyle abonelik açılamaz
- [ ] Abonelik listesi: müşteri adı, plan, durum, başlangıç, bitiş dönemi; duruma göre filtre
- [ ] Manager ve finance abonelik işlemlerini yapabilir

**Etiket:** must
**Plandaki gün:** Gün 5
```

## Issue 5

**Başlık:** `KPI dashboard`
**Etiket:** must

```markdown
## Açıklama
Firma sahibi abonelik işinin sağlığını tek ekranda görmelidir. MRR, churn, LTV ve LTV/CAC karar vermek için gereken temel göstergelerdir. Hesaplar doğru, test edilmiş ve sıfıra bölme gibi durumlarda anlaşılır olmalıdır.

## Kabul kriterleri
- [ ] Dashboard dört KPI kartı gösterir: MRR, aylık churn, LTV, LTV/CAC; altında kısa özet: aktif müşteri sayısı, bu ay yeni başlayan, bu ay iptal eden
- [ ] MRR, ACTIVE aboneliklerin aylık fiyat toplamıdır; yıllık planlar 12'ye bölünür
- [ ] Churn = ay içinde iptal edenler / ay başındaki aktif müşteriler
- [ ] Churn 0 veya aktif müşteri 0 olduğunda kartlarda "NaN" veya "Infinity" görünmez, "Hesaplanamadı (neden)" gibi açık bir mesaj görünür
- [ ] LTV/CAC 3 ve üzerindeyse "sağlıklı", altındaysa "dikkat" (renk ve metinle) gösterilir
- [ ] CAC değeri yalnızca manager tarafından ayarlar bölümünden girilir; finance dashboard'u görür ama ayarları değiştiremez (sunucu tarafında da reddedilir)
- [ ] Veri yokken "Henüz abonelik yok, ilk aboneliği ekleyin" mesajı görünür
- [ ] Hesap fonksiyonları saf fonksiyondur, birim testlidir; dersteki örnek test edilir (50 müşteri x 1.000 TL, churn %4, CAC 5.000 TL: MRR 50.000, ömür 25 ay, LTV 25.000, LTV/CAC 5)

**Etiket:** must
**Plandaki gün:** Gün 8 (hesap fonksiyonları ve testler), Gün 9 (dashboard)
```

## Issue 6

**Başlık:** `SSE ile iptal uyarısı ve riskli abonelik listesi`
**Etiket:** should

```markdown
## Açıklama
Bir müşteri aboneliğini iptal ettiğinde firma bunu sayfayı yenilemeden hemen görmelidir. Bilgi sunucudan istemciye tek yönlü aktığı için SSE kullanılır. Ayrıca bitişine yaklaşan abonelikler dashboard'da riskli olarak listelenir.

## Kabul kriterleri
- [ ] Bir abonelik iptal edilince aynı firmanın açık ekrandaki manager ve finance kullanıcıları sayfayı yenilemeden "[Müşteri adı] aboneliğini iptal etti" uyarısını görür
- [ ] Başka bir firmanın kullanıcıları bu uyarıyı görmez (iki tarayıcı penceresiyle test edilir)
- [ ] SSE uç noktası giriş yapmamış kullanıcıya kapalıdır
- [ ] Riskli abonelik: bitiş dönemine 7 günden az kalmış, henüz yenilenmemiş ACTIVE abonelikler dashboard'da "riskli" olarak listelenir (sayfa açılışında hesaplanır; SSE yalnızca iptal olayını canlı iletir)
- [ ] WebSocket, polling veya harici servis kullanılmaz
- [ ] Bağlantı kopup yeniden kurulduğunda sayfa hata vermez

**Etiket:** should
**Plandaki gün:** Gün 10
```

## Issue 7

**Başlık:** `Aylık MRR grafiği`
**Etiket:** should

```markdown
## Açıklama
Tek bir MRR sayısı bugünü gösterir ama gidişatı göstermez. Aylara göre MRR grafiği, büyümenin veya düşüşün ne zaman başladığını görmeyi sağlar. Veri, abonelik kayıtlarından hesaplanır.

## Kabul kriterleri
- [ ] Dashboard'da son 12 ayın MRR değerleri aylık grafik olarak görünür (Türkçe ay adları, TL değerleri)
- [ ] Her ayın değeri, o ayın son günündeki aktif aboneliklerden MRR formülüyle hesaplanır
- [ ] Verisi olmayan aylar 0 olarak gösterilir, grafik çökmez
- [ ] Grafiğin altında okunabilir bir özet cümle vardır (renge bağımlı olmadan anlaşılır)
- [ ] Grafik yalnızca aktif kullanıcının firmasının verisini kullanır; hesap sunucuda yapılır
- [ ] Ay bazlı hesap fonksiyonu saf fonksiyondur ve birim testi vardır

**Etiket:** should
**Plandaki gün:** Gün 11
```

---

## GitHub'da yapılacaklar (sırayla)

**A. Etiketler:** Depoda **Issues** > **Labels** > **New label**: `must`, sonra `should`.

**B. Issue'lar:** **Issues** > **New issue**. Başlığı Title'a yaz, kod bloğunun içini açıklamaya yapıştır, sağdan etiketi seç, **Submit new issue**. 7 kez tekrarla.

**C. Pano:** **Projects** > **New project** > **Board** şablonu > ad: `AboneTakip`. **+ Add item** ile `#` yazıp 7 issue'yu ekle. İşe başlayınca kartı **In Progress**'e, bitince **Done**'a sürükle.

**D. README:** Aynı klasördeki `README.md` dosyasını proje köküne koy (eskisinin üzerine yaz). Sonra GitHub Desktop'ta commit et: Summary `docs: README iskeleti`, **Commit to main**, **Push origin**.
