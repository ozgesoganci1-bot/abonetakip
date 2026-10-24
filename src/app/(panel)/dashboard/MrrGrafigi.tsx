import Kart from "@/components/ui/Kart";
import type { MrrNoktasi } from "@/lib/metrikler";
import { ayEtiketi, kisaAyEtiketi, tlMetni } from "@/lib/bicim";
import { eksenDegerleri, eksenUstSiniri, grafikOzeti } from "@/lib/mrr-grafigi";

// AYLIK MRR GRAFİĞİ (Gün 11)
//
// Server Component: tarayıcıya JavaScript gönderilmez ("use client" yok).
// Bu bileşende HESAP YOKTUR. Noktalar dashboard-verisi.ts -> metrikler.ts (mrrGecmisi)
// zincirinden hazır gelir; eksen ve özet cümle mrr-grafigi.ts'den alınır.
// Ek paket yok: grafik elle yazılmış SVG'dir (ADR K11.4).
//
// Erişilebilirlik:
//   - Her ayın <title> etiketi fareyle üzerine gelince değeri gösterir (tarayıcı ipucu).
//   - Ekran okuyucu grafiği alttaki özet cümleyle okur (aria-labelledby).
//   - Değerler açılır bir tabloda da verilir.
//   - "Bu ay" yalnızca renkle değil, eksen altındaki yazıyla da belirtilir.
//
// Son nokta her zaman bu aydır (dashboard-verisi.ts, sonAylar). Değeri "bugüne kadar"dır
// ve MRR kartıyla aynıdır.

// SVG çizim alanı (viewBox birimleri). Grafik kartın genişliğine göre ölçeklenir.
const GENISLIK = 720;
const YUKSEKLIK = 280;
const SOL_BOSLUK = 76; // sol eksendeki TL yazıları için
const SAG_BOSLUK = 8;
const UST_BOSLUK = 12;
const ALT_BOSLUK = 48; // ay adı ve "bu ay" yazısı için
const CIZIM_GENISLIGI = GENISLIK - SOL_BOSLUK - SAG_BOSLUK;
const CIZIM_YUKSEKLIGI = YUKSEKLIK - UST_BOSLUK - ALT_BOSLUK;
const TABAN_Y = UST_BOSLUK + CIZIM_YUKSEKLIGI; // 0 TL çizgisinin yeri

// Sayfada tek grafik olduğu için sabit kimlik yeterli.
const OZET_KIMLIGI = "mrr-grafigi-ozet";

type Props = { noktalar: MrrNoktasi[] };

export default function MrrGrafigi({ noktalar }: Props) {
  const ozet = grafikOzeti(noktalar);
  const ustSinir = eksenUstSiniri(Math.max(0, ...noktalar.map((n) => n.mrr)));
  const sonIndeks = noktalar.length - 1;

  // Bir TL değerinin SVG'deki dikey konumu (üst sınır en üstte, 0 en altta).
  const yKonumu = (deger: number) =>
    UST_BOSLUK + CIZIM_YUKSEKLIGI * (1 - deger / ustSinir);

  // Her ayın yatay payı ve çubuğun bu payın içindeki genişliği.
  const dilim = noktalar.length > 0 ? CIZIM_GENISLIGI / noktalar.length : 0;
  const cubukGenisligi = dilim * 0.6;

  return (
    <Kart className="mt-4">
      <h2 className="text-sm font-medium text-slate-600">
        Aylık MRR (son {noktalar.length} ay)
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Her ayın son günündeki MRR. Bu ay için bugünkü değer gösterilir. Değeri görmek
        için çubuğun üzerine gelin.
      </p>

      {noktalar.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{ozet}</p>
      ) : (
        <>
          <figure className="mt-4">
            {/* Dar ekranda grafik küçülüp okunaksız olmasın: yana kaydırılır */}
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${GENISLIK} ${YUKSEKLIK}`}
                role="img"
                aria-labelledby={OZET_KIMLIGI}
                className="h-auto w-full min-w-[560px]"
              >
                {/* Yatay çizgiler ve sol eksen (TL) */}
                {eksenDegerleri(ustSinir).map((deger) => (
                  <g key={deger}>
                    <line
                      x1={SOL_BOSLUK}
                      x2={GENISLIK - SAG_BOSLUK}
                      y1={yKonumu(deger)}
                      y2={yKonumu(deger)}
                      strokeDasharray={deger === 0 ? undefined : "4 4"}
                      className={deger === 0 ? "stroke-slate-300" : "stroke-slate-200"}
                    />
                    <text
                      x={SOL_BOSLUK - 8}
                      y={yKonumu(deger) + 4}
                      textAnchor="end"
                      fontSize={11}
                      className="fill-slate-500"
                    >
                      {tlMetni(deger)}
                    </text>
                  </g>
                ))}

                {/* Aylar: her ay bir grup. İpucu (title) bütün gruba uygulanır. */}
                {noktalar.map((nokta, i) => {
                  const buAy = i === sonIndeks;
                  const dilimBasi = SOL_BOSLUK + dilim * i;
                  const ortaX = dilimBasi + dilim / 2;
                  const cubukUstu = yKonumu(nokta.mrr);
                  const ipucu = `${ayEtiketi(nokta.yil, nokta.ay)}${
                    buAy ? " (bu ay)" : ""
                  }: ${tlMetni(nokta.mrr)}`;

                  return (
                    <g key={`${nokta.yil}-${nokta.ay}`} className="group">
                      <title>{ipucu}</title>
                      {/* Görünmez alan: MRR 0 olan ayda da üzerine gelince değer görünsün */}
                      <rect
                        x={dilimBasi}
                        y={UST_BOSLUK}
                        width={dilim}
                        height={CIZIM_YUKSEKLIGI}
                        className="fill-transparent"
                      />
                      <rect
                        x={ortaX - cubukGenisligi / 2}
                        y={cubukUstu}
                        width={cubukGenisligi}
                        height={TABAN_Y - cubukUstu}
                        rx={3}
                        className={
                          buAy
                            ? "fill-indigo-300 group-hover:fill-indigo-500"
                            : "fill-indigo-500 group-hover:fill-indigo-700"
                        }
                      />
                      <text
                        x={ortaX}
                        y={TABAN_Y + 18}
                        textAnchor="middle"
                        fontSize={12}
                        className="fill-slate-600"
                      >
                        {kisaAyEtiketi(nokta.yil, nokta.ay)}
                      </text>
                      {buAy && (
                        <text
                          x={ortaX}
                          y={TABAN_Y + 34}
                          textAnchor="middle"
                          fontSize={11}
                          className="fill-slate-500"
                        >
                          bu ay
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <figcaption id={OZET_KIMLIGI} className="mt-3 text-sm text-slate-700">
              {ozet}
            </figcaption>
          </figure>

          {/* Metin alternatifi: bütün değerler tablo olarak */}
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-medium text-indigo-700 hover:text-indigo-900">
              Değerleri tablo olarak göster
            </summary>
            <table className="mt-3 w-full max-w-sm text-left">
              <caption className="sr-only">Aylık MRR, son {noktalar.length} ay</caption>
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th scope="col" className="py-2 font-medium">
                    Ay
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    MRR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {noktalar.map((nokta, i) => (
                  <tr key={`${nokta.yil}-${nokta.ay}`}>
                    <th scope="row" className="py-2 font-normal text-slate-700">
                      {ayEtiketi(nokta.yil, nokta.ay)}
                      {i === sonIndeks ? " (bu ay)" : ""}
                    </th>
                    <td className="py-2 text-right tabular-nums text-slate-900">
                      {tlMetni(nokta.mrr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </Kart>
  );
}