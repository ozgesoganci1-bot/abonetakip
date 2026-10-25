# Çalışma Ortamı Kurulum Rehberi (MacBook Air M4 / macOS)

> Bu rehber kod bilgisi olmadan, adım adım ilerlemen için yazıldı. Her adımın sonunda **Kontrol** satırı var. Kontrol geçmeden sonraki adıma geçme.
> Takıldığın yerde ekranın görüntüsünü ve çıkan hata metninin **tamamını** AI'ya ver (bkz. Bölüm 12, hata şablonu).

## Önce bilmen gerekenler

- **Terminal:** Bilgisayara yazıyla komut verdiğin pencere. Komutları kopyalayıp yapıştırır, Enter'a basarsın. Açmak için: `Cmd + Boşluk`, "Terminal" yaz, Enter.
- **Klasör (dizin):** Dosyaların durduğu yer. Projemizin klasörü `~/Projeler/abonetakip` olacak. `~` işareti senin kullanıcı klasörünü (Home) temsil eder.
- **Repo (depo):** GitHub'daki proje klasörünün adı.
- **Commit:** Değişikliklerin kayıt noktası. **Push:** Bu kaydı GitHub'a göndermek.
- **`.env` dosyası:** Gizli bilgilerin (veritabanı adresi gibi) durduğu dosya. GitHub'a **asla** gönderilmez.
- Komutlardaki `$` işareti terminali gösterir, **yazma**. Sadece sonrasındaki kısmı yaz.

---

## 1. Hesapları aç (tarayıcıda)

1. **GitHub:** https://github.com adresinden hesap aç. Kullanıcı adını sade seç, çünkü proje adresinde görünecek.
2. **Render (web uygulaması için):** https://render.com adresine git, **"Sign in with GitHub"** ile giriş yap.
   - Render ücretsiz katmanı kredi kartı istemeden kullanılabiliyor (2026 kaynaklarına göre). Kart istenirse dur ve bana yaz.
3. **Neon (veritabanı için):** https://neon.com adresine git, **GitHub ile** kayıt ol.
   - Neon ücretsiz planı süresiz ve kart istemiyor (2026 kaynaklarına göre). Kart istenirse dur ve bana yaz.

> **Neden iki ayrı hizmet?** Render'ın ücretsiz veritabanı 30 gün sonra sona eriyor. Neon'un ücretsiz planı süresiz olduğu için veritabanı Neon'da, web uygulaması Render'da çalışacak. Bu karar ADR'de yazılı.

**Kontrol:** Her iki sitede de giriş yapmış durumdasın.

## 2. Programları kur

Sırayla kur. Hepsi Apple Silicon (M4) ile uyumludur.

### 2.1 Visual Studio Code (kod editörü)
1. https://code.visualstudio.com adresinden macOS sürümünü indir (Apple Silicon / Universal).
2. İnen dosyayı aç, `Visual Studio Code` uygulamasını **Applications (Uygulamalar)** klasörüne sürükle.
3. Uygulamayı aç. İlk açılışta "indirilen uygulama" uyarısı çıkarsa **Aç**'a bas.

### 2.2 Node.js (projenin çalışması için gerekli altyapı)
1. https://nodejs.org adresinden **LTS** yazan sürümü indir (macOS Installer, `.pkg`).
2. Kurulum sihirbazında hep **Devam** de.
3. Terminal'i **kapatıp yeniden aç**, sonra şunu yaz:

```
node -v
npm -v
```

**Kontrol:** İkisi de bir sürüm numarası gösteriyor. Proje Node v26.11.1 ile geliştirildi ve denendi; testler TypeScript dosyalarını doğrudan çalıştırdığı için 22.18 veya daha yeni bir sürüm gerekir. "command not found" yazarsa Terminal'i kapat-aç, olmazsa dur ve bana yaz.

### 2.3 Git (sürüm kaydı aracı)
Terminal'e şunu yaz:

```
git --version
```

- Sürüm numarası görürsen tamam.
- "Command Line Developer Tools gerekli" penceresi çıkarsa **Yükle**'ye bas, bitmesini bekle (birkaç dakika sürebilir), sonra komutu tekrar çalıştır.

### 2.4 GitHub Desktop (Git'i butonlarla kullanmak için)
1. https://desktop.github.com adresinden **Apple Silicon** sürümünü indir.
2. Applications'a sürükle, aç, **Sign in to GitHub.com** ile giriş yap.

**Kontrol:** VS Code, Node, Git ve GitHub Desktop açılıyor ve çalışıyor.

## 3. GitHub'da depoyu oluştur

1. https://github.com/new adresine git.
2. **Repository name:** `abonetakip`
3. **Public** (herkese açık) seç. Depo herkese açık olacağı için **hiçbir gizli bilgi** (parola, veritabanı adresi) depoya girmemeli. Bunu Bölüm 7 ve Bölüm 9'daki kontrollerle sağlıyoruz.
4. **Hiçbir kutuyu işaretleme:** README ekleme, .gitignore ekleme, license ekleme. Depo **boş** olmalı. (Bunu Next.js kurulumunda çakışma çıkmasın diye yapıyoruz.)
5. **Create repository**'ye bas.

**Kontrol:** "Quick setup" sayfasını görüyorsun ve depo boş.

> Hocanın depoyu nasıl göreceğini öğren: kullanıcı adını collaborator olarak mı ekleyeceksin, yoksa bağlantıyı mı göndereceksin? Bu bilgiyi teslimden önce netleştir.

## 4. Depoyu bilgisayara indir (clone)

1. Önce Finder'da **Home klasöründe** `Projeler` adında bir klasör oluştur. (Masaüstü ve Belgeler klasörlerini kullanma, iCloud senkronizasyonu dosyaları bozabilir. Klasör adında Türkçe karakter ve boşluk kullanma.)
2. GitHub Desktop'ta `File > Clone Repository` seç.
3. Listeden `abonetakip` deposunu seç.
4. **Local Path** alanını `/Users/<kullanıcı-adın>/Projeler/abonetakip` olarak ayarla.
5. **Clone**'a bas.

**Kontrol:** Finder'da `Projeler/abonetakip` klasörü var.

## 5. Klasörü VS Code'da aç

1. VS Code'da `File > Open Folder` seç ve `Projeler/abonetakip` klasörünü aç. "Güveniyor musun" sorusuna **Yes, I trust** de.
2. Terminal'i VS Code içinde aç: üst menüden **Terminal > New Terminal**. (Kısayol klavyene göre değişebilir, menüyü kullan.)
3. Alt kısımda açılan terminal zaten proje klasöründedir. Doğrulamak için:

```
pwd
```

**Kontrol:** Çıktı `/Users/<kullanıcı-adın>/Projeler/abonetakip` ile bitiyor.

## 6. Next.js uygulamasını oluştur

Terminal'e şunu yaz (sonundaki **nokta** önemli, "bu klasöre kur" demek):

```
npx create-next-app@latest .
```

Sorular çıkacak. Sürüme göre sorular biraz değişebilir. Aşağıdaki cevapları ver, emin olmadığın bir soruda dur ve bana sor:

| Soru | Cevap |
|---|---|
| TypeScript? | **Yes** |
| ESLint? | **Yes** |
| Tailwind CSS? | **Yes** |
| `src/` directory? | **Yes** |
| App Router? | **Yes** |
| Customize import alias? | **No** (varsayılan) |
| Başka sorular (Turbopack, React Compiler vb.) | Varsayılanı bırak, Enter |

Kurulum bitince uygulamayı çalıştır:

```
npm run dev
```

Tarayıcıda http://localhost:3000 adresini aç. Next.js karşılama sayfasını görmelisin. Durdurmak için terminalde `Control + C`.

**Kontrol:** Karşılama sayfası açılıyor.

## 7. `.env` güvenliğini kontrol et

1. VS Code'da sol listeden `.gitignore` dosyasını aç.
2. İçinde `.env*` veya `.env` yazan bir satır olduğunu doğrula.
3. Yoksa dosyanın en altına yeni satıra `.env` yaz ve kaydet (`Cmd + S`).

**Kontrol:** `.gitignore` içinde `.env` satırı var.

## 8. Talimat dosyası ve belgeleri projeye koy

1. Proje klasöründe (Finder'da veya VS Code'da) `docs` adında bir klasör oluştur.
2. İndirdiğin dosyaları şöyle yerleştir:

| Dosya | Nereye |
|---|---|
| `CLAUDE.md` | Proje kökü (`abonetakip/CLAUDE.md`) |
| `02_ADR.md`, `03_Prompt_Gunlugu.md`, `04_14_Gunluk_Prompt_Plani.md`, `00_Kurulum_Rehberi.md` | `docs/` klasörü |

3. Dosyaları VS Code içinden de ekleyebilirsin: sol dosya listesinde boş yere sağ tık > **New File** / **New Folder**, ardından içeriği yapıştırıp `Cmd + S` ile kaydet.
4. `CLAUDE.md` içeriğini ayrıca Claude'daki bu projenin **talimatlarına** (Project instructions) yapıştır. Böylece her yeni sohbet kuralları baştan bilir.

## 9. İlk commit ve push (GitHub Desktop ile)

1. GitHub Desktop'ı aç. Sol tarafta değişen dosyaların listesi görünür.
2. **Kontrol et:** Listede `.env` dosyası **olmamalı**. Depo herkese açık olduğu için bu kontrol her commit'te zorunlu. Varsa dur ve bana yaz.
3. Sol altta **Summary** kutusuna yaz: `chore: Next.js kurulumu ve proje belgeleri`
4. **Commit to main** butonuna bas.
5. Üstte **Push origin** butonuna bas.

**Kontrol:** github.com'da depoyu yenilediğinde dosyalar görünüyor.

## 10. Neon'da veritabanı oluştur

1. https://console.neon.tech adresinde Neon hesabınla giriş yap, **Create project** (veya New project) de.
2. **Project name:** `abonetakip`. **Postgres version:** varsayılanı bırak. **Region:** Avrupa'ya yakın olanı seç (Frankfurt varsa onu). Render'daki web servisini de aynı bölgeye kuracağız, bu hızı artırır.
3. **Create** de, proje hazır olunca **Connect** (veya Connection details) bölümünü aç.
4. Bağlantı adreslerini (connection string) kopyala. İki adres gerekir:
   - **Pooled connection** (havuzlu bağlantı): adresin içinde `-pooler` yazar. Uygulama bunu kullanır.
   - **Direct connection** (doğrudan bağlantı): adresin içinde `-pooler` yazmaz. Prisma'nın veritabanı geçişleri (migration) bunu kullanır.
5. Proje kökünde örnek dosyayı kopyalayarak `.env` dosyasını oluştur:

```
cp .env.example .env
```

   Dosyayı VS Code'da aç ve yer tutucuların yerine üç değeri yaz:
   - `DATABASE_URL`: havuzlu adres (`-pooler` içerir)
   - `DIRECT_URL`: doğrudan adres
   - `SESSION_SECRET`: oturum anahtarı. Terminalde `openssl rand -base64 32` komutuyla üret.

6. Kaydet (`Cmd + S`). **Bu adresi kimseyle, hiçbir AI sohbetine ve GitHub'a yapıştırma.** Depo herkese açık olduğu için bir kez bile sızarsa herkes veritabanına ulaşabilir. Sızarsa Neon panelinden parolayı hemen yenile.

> **Ücretsiz plan notları (uyku ve uyanma süreleri 25 Ekim 2026'da resmi belgelerden teyit edildi):**
> - Neon veritabanı süresizdir, 30 günlük bir sona erme yoktur. Depolama sınırı 0,5 GB veya 1 GB civarındadır, projemiz için fazlasıyla yeter. (Bu madde teyit edilmedi.)
> - Neon, 5 dakika kullanılmazsa veritabanını durdurur; ücretsiz planda bu kapatılamaz. Sonraki sorguda birkaç yüz milisaniye içinde yeniden başlar. Sorun değil, hata değildir. Kaynak: [Neon, Scale to Zero](https://neon.com/docs/introduction/scale-to-zero)
> - Render ücretsiz web servisi 15 dakika trafik almazsa uyur, ilk istek yaklaşık 1 dakika sürebilir. İncelemeden önce siteyi açıp ısıt. Kaynak: [Render, Deploy for Free](https://render.com/docs/free)
> - `.env` canlı veritabanıdır. Testler ve demo betikleri için Neon'da canlı dalın kopyası olarak ayrı bir test dalı açılır ve adresleri `.env.test` dosyasına yazılır (Gün 6). `npm run dev:test` uygulamayı bu dalda açar.

## 11. Yapay zekâ aracı: Claude (sohbet) + VS Code

Çalışma biçimi: Kodu **Claude sohbetinde** ben yazarım, sen VS Code'da dosyalara **kopyalayıp yapıştırırsın**, çalıştırıp sonucu bana bildirirsin. Ek bir yapay zekâ eklentisi kurmana gerek yok.

**Önemli:** Claude sohbeti bilgisayarındaki dosyaları göremez. Bu yüzden benim bilmem gereken dosyaları sen göstermelisin (aşağıdaki "Dosya paylaşma" bölümü).

### Kodu projeye alma (her seferinde aynı)
1. Claude'un verdiği dosya yolunu oku (örn. `src/lib/tenant.ts`).
2. VS Code'da sol dosya listesinde ilgili klasöre sağ tık > **New File**, dosya adını yaz (klasör yoksa `src/lib/tenant.ts` yazman klasörü de oluşturur).
3. Claude'un verdiği kod bloğunun sağ üstündeki **Copy** düğmesine bas, dosyaya yapıştır (`Cmd + V`), kaydet (`Cmd + S`).
4. "Dosyanın içeriğini tamamen şununla değiştir" dediyse: dosyayı aç, `Cmd + A` ile hepsini seç, yapıştır.
5. Terminal komutlarını VS Code terminaline yapıştırıp Enter'a bas. `sudo` içeren bir komut gelirse çalıştırma ve bana sor.
6. Bir hata çıkarsa **Hata şablonunu** (Bölüm 12) doldurup bana gönder.

### Dosya paylaşma (Claude'un kodunu görmesi için)
- Küçük dosya: VS Code'da aç, `Cmd + A`, `Cmd + C`, sohbete yapıştır. Başına dosya yolunu yaz.
- Çok dosya: Sohbete dosyaları ekleyebilirsin (ataç simgesi), veya `package.json`, `schema.prisma` gibi önemli dosyaları yapıştırabilirsin.
- **Asla paylaşma:** `.env` dosyasının içeriği. Gerekirse `DATABASE_URL="[DATABASE_URL]"` gibi yer tutucu yaz.

### Sohbet düzeni
- Her gün için **yeni bir sohbet** aç (sohbet uzadıkça eski hatalar yeni cevapları etkiler). Sohbet uzayıp dağılırsa Yardımcı Prompt D ile özet çıkarıp yeni sohbete yapıştır.
- `CLAUDE.md` içeriği Project talimatlarında olduğu için Ortak Başlık'ın kısa hâlini yapıştırman yeter.
- Hangi dosyada neyin durduğunu unutmamak için günün sonunda Yardımcı Prompt D'yi çalıştır ve çıktıyı `docs/` içinde bir not olarak sakla.

**Kurallar:** **Planı onaylamadan kod yazdırma** ve **anlamadığın kodu projeye alma** (4. hafta, slayt 28 ve 30).

## 12. Günlük çalışma düzeni (her gün aynı)

1. GitHub Desktop'ı aç. Üstte **Fetch origin** / **Pull origin** varsa bas (güncel kal).
2. **Yeni dal (branch) aç:** `Branch > New Branch`, adı örn. `feat/gun-04-musteri-plan`. **Create Branch**.
3. Günün promptunu Claude'a (sohbette) ver. Önce planı onayla, sonra Claude'un verdiği dosyaları VS Code'da oluşturup içeriklerini yapıştır (Bölüm 11'deki "Kodu projeye alma" adımları).
4. Uygulamayı çalıştır: VS Code terminalinde `npm run dev`, tarayıcıda dene.
5. Değişen dosyaları terminalde `git add` ile hazırla ve commit öncesi üç taramayı yap (komutlar `CLAUDE.md` içinde). Commit'i terminalden at; ekler mesajın en sonunda tek blok olur.
6. GitHub Desktop'ta **Publish branch** (ilk sefer) veya **Push origin** bas.
7. **Create Pull Request** butonuna bas. Tarayıcıda GitHub açılır. **Create pull request** ve ardından **Squash and merge** de.
8. Terminalde `git switch main` ve ardından `git pull` çalıştır.

### Hata şablonu (AI'ya yapıştırılacak)

```
Ne yapmaya çalışıyordum: [örn. npm run dev çalıştırdım]
Ne oldu: [örn. kırmızı hata çıktı]
Hata mesajının tamamı:
[terminaldeki metni olduğu gibi yapıştır; gizli adresleri [DATABASE_URL] ile değiştir]
İlgili dosya: [dosya yolu ve içeriği]
Beklediğim sonuç: [örn. sayfanın açılması]
İstek: Önce olası nedenleri sırala, sonra en olası olanı düzeltmek için adımları ver.
```

## 13. Sık karşılaşılan sorunlar (macOS)

| Belirti | Çözüm |
|---|---|
| `command not found: node` | Terminal'i kapatıp aç. Olmazsa Node'u yeniden kur. |
| `Port 3000 is already in use` | Önceki `npm run dev` hâlâ açık. Eski terminalde `Control + C` bas ya da Next'in önerdiği başka portu kullan. |
| `EACCES` / izin hatası | `sudo` ile **çalıştırma**. Hata metnini AI'ya ver. |
| Git kullanıcı bilgisi istiyor | GitHub Desktop ile commit yap, otomatik halleder. |
| Push reddedildi | Önce **Pull origin** bas, sonra tekrar dene. |
| Site Render'da açılmıyor | Ücretsiz servis uyuyor olabilir, 1-2 dakika bekle. |
| Veritabanı ilk sorguda yavaş | Neon uyuyordu, uyanıyor. Bir an bekle, tekrar dene. |
| Prisma geçişinde (migration) bağlantı hatası | Havuzlu (`-pooler`) adres kullanıyor olabilirsin. Direct adresi dene ya da hata metnini AI'ya ver. |

## 14. Kurulum bitti mi? Son kontrol listesi

- [ ] GitHub, Render ve Neon hesapları açık
- [ ] VS Code, Node, Git, GitHub Desktop kurulu
- [ ] Boş **herkese açık (Public)** `abonetakip` deposu oluşturuldu ve `~/Projeler/abonetakip` içine indirildi
- [ ] `npm run dev` ile karşılama sayfası açıldı
- [ ] `.gitignore` içinde `.env` var
- [ ] `CLAUDE.md` ve `docs/` yerleştirildi, `CLAUDE.md` içeriği Claude proje talimatlarına da yapıştırıldı, ilk push yapıldı
- [ ] Neon veritabanı oluşturuldu, `DATABASE_URL` yalnızca yerel `.env` içinde
- [ ] Günlük çalışma düzenini anladım

Hepsi işaretliyse **Gün 1** promptuna geç: `docs/04_14_Gunluk_Prompt_Plani.md`.
