# Yapay zekâ konuşmaları: prompt ve cevaplar

Bu klasör, AboneTakip projesini geliştirirken yapay zekâya yazdığım promptları ve yapay zekânın verdiği cevapları gün gün içerir. Her gün için ayrı bir dosya vardır.

**Araç:** Claude (claude.ai). Konuşmalar "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" adlı Project içinde yapıldı. Proje kuralları (`CLAUDE.md`) Project talimatlarına yüklüdür.

## Dosyalar

| Gün | Konu | Dosya |
|---|---|---|
| 0 | Hazırlık: proje fikri, kapsam, belge taslakları ve kurulum | [gun_0_prompt_cevap.md](gun_0_prompt_cevap.md) |
| 1 | Planlama, issue'lar ve README | [gun_1_prompt_cevap.md](gun_1_prompt_cevap.md) |
| 2 | Prisma şeması ve ilk deploy | [gun_2_prompt_cevap.md](gun_2_prompt_cevap.md) |
| 3 | Kayıt, giriş, roller ve merkezi tenant filtresi | [gun_3_prompt_cevap.md](gun_3_prompt_cevap.md) |
| 3b | Arayüzü profesyonelleştirme | [gun_3b_prompt_cevap.md](gun_3b_prompt_cevap.md) |
| 4 | Müşteri ve plan yönetimi | [gun_4_prompt_cevap.md](gun_4_prompt_cevap.md) |
| 5 | Abonelik yaşam döngüsü ve olay kaydı | [gun_5_prompt_cevap.md](gun_5_prompt_cevap.md) |
| 6 | Kiracı izolasyonu ve rol testleri | [gun_6_prompt_cevap.md](gun_6_prompt_cevap.md) |
| 7 | Hafta 1 inceleme turu, hata düzeltme ve kod anlama | [gun_7_prompt_cevap.md](gun_7_prompt_cevap.md) |
| 8 | Metrik hesaplama fonksiyonları | [gun_8_prompt_cevap.md](gun_8_prompt_cevap.md) |

Sonraki günler çalışma ilerledikçe bu klasöre eklenecektir.

## Her dosya nasıl okunur

- **Prompt:** benim yazdığım metin, kutu içinde ve olduğu gibi.
- **Claude cevabı:** girintili (`>` ile başlayan) alan. Başlıklar, tablolar ve kod blokları Claude'un yazdığı orijinal Markdown'dır.
- Bir günün işi birden çok sohbette yapıldıysa (örneğin plan ayrı bir sohbette, uygulama ana sohbette) dosyada her sohbet ayrı bölümdür.
- **Bu günün özeti:** her dosyanın başında, o gün ne istendi, ne üretildi, ne düzeltildi. Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı [Prompt Günlüğü](../docs/03_Prompt_Gunlugu.md)'dür.
- Sohbetlerde kısa tepkiler ("böyle oldu", "tamam", "çıktı yok") ve günlük konuşma ifadeleri bulunur. Bunlar gerçek çalışma akışının parçası olduğu için olduğu gibi bırakılmıştır.

## Kapsam ve düzenleme

- Dosyalar, claude.ai'daki "Verileri dışa aktar" özelliğiyle alınan sohbet kaydından üretilmiştir. Metinler düzeltilmemiştir.
- Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü eklendi]` satırı olarak işaretlenmiştir.
- Depo herkese açık olduğu için dosyalar yayından önce gizli bilgi kalıplarına (veritabanı adresi, parola, anahtar) karşı taranmıştır.
- Yalnızca tamamen selamlaşma olan 3 mesaj çifti (teşekkür, iyi geceler, görüşürüz) çıkarılmış, yerlerine `[selamlaşma mesajı ve cevabı çıkarıldı]` notu konmuştur (Gün 3b'de 2, Gün 4'te 1). İşle ilgili hiçbir mesaj çıkarılmamıştır.
- Maskelenenler: Mac kullanıcı adı ve bilgisayar adı (`kullanici`, `bilgisayar`), okul adı kısaltması (`[okul]`), gerçek Neon sunucu adı (`[NEON_HOST]`) ve sohbete yapıştırılan bir parola parçası (`[NEON_PAROLA]`). Başka hiçbir yerde metne dokunulmamıştır.
- Gün 2'de gerçek bir veritabanı adresinin yanlışlıkla `.env.example` dosyasına girmesi olayı yaşandı. Parola yenilendi, kural projeye eklendi (ayrıntı: [ADR](../docs/02_ADR.md)).
- Gün 6 ve Gün 7'de de küçük güvenlik olayları yaşandı: test dalının adresi `.env.test.example` dosyasına girdi (commit öncesi tarama yakaladı, commit edilmedi) ve bir kayıt dosyasında maskelenmemiş bir adres bulundu (maskelendi). Parola yenilendi. Ayrıntılar: [ADR](../docs/02_ADR.md).
- Gün 6, 7 ve 8 ayrı sohbetlerde yürütüldü. Ana sohbetteki yönlendirme ve inceleme mesajları bu dosyalara dahil değildir. Gün 7 dosyasında sistemin kendiliğinden eklediği "devam et" mesajı, ben yazmadığım için köşeli parantezli bir notla işaretlenmiştir.

## İlgili belgeler

- [Prompt Günlüğü](../docs/03_Prompt_Gunlugu.md): promptların kısa özeti ve her günün değerlendirmesi
- [14 günlük prompt planı](../docs/04_14_Gunluk_Prompt_Plani.md): her gün için hazırlanan prompt şablonları
