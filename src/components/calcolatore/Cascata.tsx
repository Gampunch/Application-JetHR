import { useState } from "react";
import type { RigaScaglione, RisultatoCalcolo } from "@/lib/tax/calcolo";
import {
  CONTENUTI_DIDATTICI,
  comeSiCalcola,
  normaComunale,
  type VoceId,
} from "@/lib/tax/contenuti";
import { euro, percentuale } from "@/lib/tax/format";
import { BoxFormula, IconaInfo, LabelGruppo, Pannello } from "./ui";

type Props = {
  r: RisultatoCalcolo;
  approfondito: boolean;
};



function Scaglioni({ righe }: { righe: RigaScaglione[] }) {
  if (righe.length === 0) return null;
  return (
    <table className="tabular w-full text-sm">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-[var(--label)]">
          <th className="py-1 font-semibold">Da</th>
          <th className="py-1 font-semibold">A</th>
          <th className="py-1 text-right font-semibold">Quota tassata</th>
          <th className="py-1 text-right font-semibold">Aliquota</th>
          <th className="py-1 text-right font-semibold">Imposta</th>
        </tr>
      </thead>
      <tbody>
        {righe.map((s, i) => (
          <tr key={i} className="border-t border-[var(--hairline)]">
            <td className="py-1.5">{euro(s.da)}</td>
            <td className="py-1.5">{Number.isFinite(s.a) ? euro(s.a) : "oltre"}</td>
            <td className="py-1.5 text-right">{euro(s.quota)}</td>
            <td className="py-1.5 text-right">{percentuale(s.aliquota)}</td>
            <td className="py-1.5 text-right">{euro(s.imposta)}</td>
          </tr>
        ))}
        <tr className="border-t border-[var(--ink)]/20 font-semibold">
          <td className="py-1.5" colSpan={4}>
            Totale
          </td>
          <td className="py-1.5 text-right">
            {euro(righe.reduce((a, s) => a + s.imposta, 0))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

type RigaVoce = {
  id: VoceId;
  etichetta: string;
  importo: number;
  segno: "+" | "−" | null;
  regola: string;
  zero?: boolean;
  subtotale?: boolean;
  dettaglio?: RigaScaglione[];
};

export default function Cascata({ r, approfondito }: Props) {
  const [aperto, setAperto] = useState<VoceId | null>(null);

  const contributi: RigaVoce[] = [
    {
      id: "inps",
      etichetta: `INPS ${percentuale(0.0919)}`,
      importo: r.contributiOrdinari,
      segno: "−",
      regola: `Su ${euro(r.baseContributiva)} di base contributiva`,
    },
    {
      id: "inpsAggiuntivo",
      etichetta: "INPS 1% aggiuntivo",
      importo: r.contributiAggiuntivi,
      segno: "−",
      zero: r.contributiAggiuntivi === 0,
      regola:
        r.contributiAggiuntivi > 0
          ? `Sulla parte di RAL oltre ${euro(56224)}`
          : `Non dovuto: la RAL non supera ${euro(56224)}`,
    },
  ];

  const imposte: RigaVoce[] = [
    {
      id: "irpefLorda",
      etichetta: "IRPEF lorda",
      importo: r.irpefLorda,
      segno: "−",
      regola: "Progressiva per scaglioni sull'imponibile",
      dettaglio: r.dettaglioIrpef,
    },
    {
      id: "detrazioneLavoro",
      etichetta: "Detrazione lavoro dipendente",
      importo: r.detrazioneLavoro,
      segno: "+",
      zero: r.detrazioneLavoro === 0,
      regola:
        r.detrazioneLavoro > 0
          ? "Sconto d'imposta, decresce col reddito"
          : `Non spettante: imponibile oltre ${euro(50000)}`,
    },
    {
      id: "detrazioneCuneo",
      etichetta: "Ulteriore detrazione cuneo",
      importo: r.detrazioneCuneo,
      segno: "+",
      zero: r.detrazioneCuneo === 0,
      regola:
        r.detrazioneCuneo > 0
          ? "Detrazione d'imposta del taglio del cuneo"
          : `Non spettante: imponibile fuori dalla fascia ${euro(20000)}–${euro(40000)}`,
    },
    {
      id: "irpefNetta",
      etichetta: "IRPEF netta",
      importo: r.irpefNetta,
      segno: "−",
      subtotale: true,
      regola: "Lorda meno detrazioni, con pavimento a zero",
    },
    {
      id: "addizionaleRegionale",
      etichetta: "Addizionale regionale Lombardia",
      importo: r.addizionaleRegionale,
      segno: "−",
      regola: "A scaglioni sullo stesso imponibile",
      dettaglio: r.dettaglioAddizionaleRegionale,
    },
    {
      id: "addizionaleComunale",
      etichetta: `Addizionale comunale — ${r.comune.nome}`,
      importo: r.addizionaleComunale,
      segno: "−",
      zero: r.addizionaleComunale === 0,
      regola:
        r.addizionaleComunale > 0
          ? `Soglia di esenzione ${euro(r.comune.esenzioneFinoA)} superata: si paga sull'intero imponibile`
          : `Non dovuta: imponibile sotto la soglia di ${euro(r.comune.esenzioneFinoA)}`,
    },
  ];

  const esenti: RigaVoce[] = [
    {
      id: "sommaEsente",
      etichetta: "Somma esente cuneo fiscale",
      importo: r.sommaEsente,
      segno: "+",
      zero: r.sommaEsente === 0,
      regola:
        r.sommaEsente > 0
          ? `${percentuale(r.percentualeSommaEsente, 1)} dell'imponibile, non imponibile`
          : `Non spettante: imponibile oltre ${euro(20000)}`,
    },
    {
      id: "trattamento",
      etichetta: "Trattamento integrativo",
      importo: r.trattamento,
      segno: "+",
      zero: r.trattamento === 0,
      regola:
        r.trattamento > 0
          ? "Erogato in busta paga, non imponibile"
          : `Non spettante con questo imponibile`,
    },
  ];

  const contenuto = aperto ? CONTENUTI_DIDATTICI[aperto] : null;
  const dettaglioAperto =
    aperto === "irpefLorda"
      ? r.dettaglioIrpef
      : aperto === "addizionaleRegionale"
        ? r.dettaglioAddizionaleRegionale
        : null;

  function Riga({ v }: { v: RigaVoce }) {
    const grigio = v.zero;
    return (
      <div className="border-t border-[var(--hairline)] py-3 first:border-t-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <IconaInfo onClick={() => setAperto(v.id)} label={v.etichetta} />
            <span
              className={`text-[15px] ${v.subtotale ? "font-semibold" : ""} ${grigio ? "text-[var(--label)]" : ""}`}
            >
              {v.etichetta}
            </span>
          </div>
          <span
            className={`tabular shrink-0 text-[15px] ${v.subtotale ? "font-semibold" : ""} ${grigio ? "text-[var(--label)]" : ""}`}
          >
            {v.segno ? `${v.segno} ` : ""}
            {euro(Math.abs(v.importo))}
          </span>
        </div>
        <p className={`mt-1 pl-7 text-[13px] leading-5 text-[var(--label)]`}>{v.regola}</p>
        {v.dettaglio && approfondito ? (
          <div className="mt-2 overflow-x-auto pl-7">
            <Scaglioni righe={v.dettaglio} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <LabelGruppo>Punto di partenza</LabelGruppo>
        <div className="border-t border-[var(--hairline)] py-3 first:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <IconaInfo onClick={() => setAperto("ral")} label="RAL" />
              <span className="text-[15px] font-semibold">RAL</span>
            </div>
            <span className="tabular text-[15px] font-semibold">{euro(r.ral)}</span>
          </div>
          <p className="mt-1 pl-7 text-[13px] leading-5 text-[var(--label)]">
            {r.mensilita} mensilità · {r.giorni} giorni
          </p>
        </div>
      </div>

      <div>
        <LabelGruppo>Contributi</LabelGruppo>
        {contributi.map((v) => (
          <Riga key={v.id} v={v} />
        ))}
        <div className="mt-3 flex items-start justify-between gap-3 border-t border-[var(--ink)]/15 pt-3">
          <div className="flex items-start gap-2">
            <IconaInfo onClick={() => setAperto("imponibile")} label="Reddito imponibile" />
            <span className="text-[15px] font-semibold">Reddito imponibile fiscale</span>
          </div>
          <span className="tabular text-[15px] font-semibold">{euro(r.imponibile, true)}</span>
        </div>
      </div>

      <div>
        <LabelGruppo>Imposte</LabelGruppo>
        {imposte.map((v) => (
          <Riga key={v.id} v={v} />
        ))}
      </div>

      <div>
        <LabelGruppo>Somme esenti</LabelGruppo>
        {esenti.map((v) => (
          <Riga key={v.id} v={v} />
        ))}
      </div>

      <Pannello
        aperto={aperto !== null}
        onClose={() => setAperto(null)}
        titolo={contenuto?.titolo ?? ""}
      >
        {contenuto && aperto ? (
          <>
            {approfondito ? (
              <>
                <section>
                  <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--label)]">
                    Cos'è
                  </h4>
                  <p>{contenuto.cosE}</p>
                </section>
                <section>
                  <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--label)]">
                    Perché si applica
                  </h4>
                  <p>{contenuto.perche}</p>
                </section>
              </>
            ) : null}
            <section>
              {approfondito ? (
                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--label)]">
                  Come si calcola nel tuo caso
                </h4>
              ) : null}
              <BoxFormula>{comeSiCalcola(aperto, r)}</BoxFormula>
              {approfondito && dettaglioAperto ? (
                <div className="mt-3 overflow-x-auto">
                  <Scaglioni righe={dettaglioAperto} />
                </div>
              ) : null}
            </section>
            {approfondito && contenuto.nota ? (
              <section>
                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--label)]">
                  Nota
                </h4>
                <p>{contenuto.nota}</p>
              </section>
            ) : null}
            {approfondito && (contenuto.norma || aperto === "addizionaleComunale") ? (
              <section>
                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--label)]">
                  Norma di riferimento
                </h4>
                <p className="text-[var(--label)]">
                  {aperto === "addizionaleComunale"
                    ? normaComunale(r.comune.delibera)
                    : contenuto.norma}
                </p>
              </section>
            ) : null}
          </>
        ) : null}
      </Pannello>
    </div>
  );
}
