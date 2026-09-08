import { useMemo, useState } from "react";
import { calcola } from "@/lib/tax/calcolo";
import { inverso } from "@/lib/tax/inverso";
import type { Comune } from "@/lib/tax/parametri2026";
import { euro, percentuale } from "@/lib/tax/format";
import { BottoneSecondario, Callout, CampoEuro, LabelGruppo } from "./ui";

function n(v: string): number {
  const x = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(x) && x > 0 ? x : 0;
}

export default function ConfrontoInverso({
  mensilita,
  giorni,
  comune,
  ralCorrente,
}: {
  mensilita: number;
  giorni: number;
  comune: Comune;
  ralCorrente: number;
}) {
  const [ralA, setRalA] = useState(String(Math.round(ralCorrente) || 30000));
  const [ralB, setRalB] = useState("35000");
  const [nettoTarget, setNettoTarget] = useState("2000");

  const a = useMemo(
    () => calcola({ ral: n(ralA), mensilita, giorni, comune }),
    [ralA, mensilita, giorni, comune],
  );
  const b = useMemo(
    () => calcola({ ral: n(ralB), mensilita, giorni, comune }),
    [ralB, mensilita, giorni, comune],
  );
  const inv = useMemo(
    () => inverso(n(nettoTarget), mensilita, giorni, comune),
    [nettoTarget, mensilita, giorni, comune],
  );

  const deltaRal = b.ral - a.ral;
  const deltaNetto = b.nettoAnnuo - a.nettoAnnuo;
  const trattenuto = deltaRal !== 0 ? 1 - deltaNetto / deltaRal : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[16px] border border-[var(--hairline)] p-5">
        <LabelGruppo>Confronto fra due RAL</LabelGruppo>
        <div className="grid gap-3 sm:grid-cols-2">
          <CampoEuro id="ral-a" label="RAL A" value={ralA} onChange={setRalA} />
          <CampoEuro id="ral-b" label="RAL B" value={ralB} onChange={setRalB} />
        </div>
        <table className="tabular mt-4 w-full text-sm">
          <tbody>
            {[
              ["Netto annuo", a.nettoAnnuo, b.nettoAnnuo],
              ["Netto mensile", a.nettoMensile, b.nettoMensile],
            ].map(([label, va, vb]) => (
              <tr key={String(label)} className="border-t border-[var(--hairline)]">
                <td className="py-2 text-[var(--label)]">{label as string}</td>
                <td className="py-2 text-right">{euro(va as number)}</td>
                <td className="py-2 text-right">{euro(vb as number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          {deltaRal !== 0 ? (
            <Callout>
              {deltaNetto < 0 ? (
                <>
                  Con {euro(Math.abs(deltaRal))} di lordo in{" "}
                  {deltaRal > 0 ? "più" : "meno"} il netto annuo{" "}
                  <strong>diminuisce</strong> di {euro(Math.abs(deltaNetto))}. Non è un
                  errore: è una delle soglie secche della norma.
                </>
              ) : (
                <>
                  Di {euro(Math.abs(deltaRal))} di lordo in più ne arrivano{" "}
                  {euro(Math.abs(deltaNetto))} netti: trattenuto il{" "}
                  {percentuale(trattenuto, 1)}.
                </>
              )}
            </Callout>
          ) : null}
        </div>
      </section>

      <section className="rounded-[16px] border border-[var(--hairline)] p-5">
        <LabelGruppo>Calcolo inverso</LabelGruppo>
        <CampoEuro
          id="netto-target"
          label="Netto mensile desiderato"
          value={nettoTarget}
          onChange={setNettoTarget}
        />
        <div className="mt-4 space-y-1">
          <div className="text-sm text-[var(--label)]">RAL necessaria</div>
          <div className="tabular font-display text-3xl font-bold">{euro(inv.ral)}</div>
        </div>
        <p className="tabular mt-3 text-sm text-[var(--label)]">
          Netto effettivamente ottenuto: {euro(inv.nettoMensileOttenuto)} al mese ·{" "}
          {euro(inv.nettoAnnuoOttenuto)} l'anno
          {Math.abs(inv.scarto) >= 1
            ? ` (scarto ${inv.scarto > 0 ? "+" : "−"} ${euro(Math.abs(inv.scarto))} sull'anno)`
            : ""}
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1500, 1800, 2000, 2500, 3000].map((v) => (
            <BottoneSecondario key={v} onClick={() => setNettoTarget(String(v))}>
              {euro(v)}
            </BottoneSecondario>
          ))}
        </div>
      </section>
    </div>
  );
}
