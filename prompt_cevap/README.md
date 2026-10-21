# Yapay zekâ konuşmaları: prompt ve cevaplar

Bu klasör, AboneTakip projesini geliştirirken yapay zekâya yazdığım promptları ve yapay zekânın verdiği cevapları gün gün içerir. Her gün için ayrı bir dosya vardır.

**Araç:** Claude (claude.ai). Konuşmalar "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" adlı Project içinde yapıldı. Proje kuralları (`CLAUDE.md`) Project talimatlarına yüklüdür.

## Dosyalar

| Gün | Konu | Dosya |
|---|---|---|
| 1 | Planlama, issue'lar ve README | [gun_1_prompt_cevap.md](gun_1_prompt_cevap.md) |
| 2 | Prisma şeması ve ilk deploy | [gun_2_prompt_cevap.md](gun_2_prompt_cevap.md) |

Gün 3 ve sonrası çalışma ilerledikçe bu klasöre eklenecektir.

## Her dosya nasıl okunur

1. **Prompt:** yapay zekâya yazdığım metin, olduğu gibi.
2. **Yapay zekânın cevabı, okunaklı görünüm:** cevabın başlık, tablo ve kod blokları ile düzenli hâli. Cümleler aynıdır. Sohbet kopyalanırken kaybolan kod bloğu işaretleri ve tablolar yeniden kurulmuştur.
3. **Yapay zekânın cevabı, ham metin:** aynı cevabın hiç düzenlenmemiş hâli ("tıkla aç" bölümünün içinde).
4. **Sonuç:** o gün ne istendi, ne üretildi, ne düzeltildi. Bu bölümü ben yazdım, yapay zekâ cevabı değildir.

Bir sohbetin ortasında kendi mesajlarım (terminal çıktıları, onaylar) varsa ayrı bölüm olarak gösterilmiştir.

## Gizlilik ve düzenleme

- Depo herkese açık olduğu için dosyalar yayından önce gizli bilgi kalıplarına (veritabanı adresi, parola, anahtar) karşı taranmıştır. Gerçek bir adres veya parola bulunmaz.
- Terminal çıktılarındaki Mac kullanıcı adı gizlenmiştir (`kullanici@bilgisayar`, `/Users/kullanici/`). Başka hiçbir yerde metne dokunulmamıştır.
- Ekran görüntüleri metin olmadığı için dosyalara alınmamıştır.

## İlgili belgeler

- [Prompt Günlüğü](../docs/03_Prompt_Gunlugu.md): promptların kısa özeti ve her günün değerlendirmesi
- [14 günlük prompt planı](../docs/04_14_Gunluk_Prompt_Plani.md): her gün için hazırlanan prompt şablonları
