import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { calcola } from "@/lib/tax/calcolo";
import { CONCETTI } from "@/lib/tax/contenuti";
import { euro, percentuale } from "@/lib/tax/format";
import { COMUNE_DEFAULT, PARAMETRI_2026 as P, type Comune } from "@/lib/tax/parametri2026";
import Cascata from "@/components/calcolatore/Cascata";
import ConfrontoInverso from "@/components/calcolatore/ConfrontoInverso";
import Guida from "@/components/calcolatore/Guida";
import {
  BottonePrimario,
  BottoneSecondario,
  Callout,
  CampoEuro,
  LabelGruppo,
} from "@/components/calcolatore/ui";

const TITOLO = `Calcolatore RAL netto ${P.annoImposta}`;
const DESCRIZIONE = `Dalla RAL al netto in busta paga per l'anno d'imposta ${P.annoImposta}: contributi INPS, IRPEF a scaglioni, detrazioni, taglio del cuneo e addizionali locali, voce per voce.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${TITOLO} — dal lordo al netto, voce per voce` },
      { name: "description", content: DESCRIZIONE },
      { property: "og:title", content: TITOLO },
      { property: "og:description", content: DESCRIZIONE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function numIt(v: string): number {
  const x = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(x) && x > 0 ? x : 0;
}

function Index() {
  const [ral, setRal] = useState("30000");
  const [mensilita, setMensilita] = useState("14");
  const [giorni, setGiorni] = useState("365");
  const [comuneScelto, setComuneScelto] = useState<string>(COMUNE_DEFAULT.nome);
  const [aliquotaManuale, setAliquotaManuale] = useState("0,80");
  const [sogliaManuale, setSogliaManuale] = useState("0");
  const [approfondito, setApprofondito] = useState(false);
  const [guida, setGuida] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setGuida(true);
  }, []);

  const comune: Comune = useMemo(() => {
    if (comuneScelto === "manuale") {
      return {
        nome: "Comune inserito a mano",
        aliquota: (Number(aliquotaManuale.replace(",", ".")) || 0) / 100,
        esenzioneFinoA: numIt(sogliaManuale),
        delibera: "inserita manualmente, non verificata",
      };
    }
    return P.comuni.find((c) => c.nome === comuneScelto) ?? COMUNE_DEFAULT;
  }, [comuneScelto, aliquotaManuale, sogliaManuale]);

  const r = useMemo(
    () =>
      calcola({
        ral: numIt(ral),
        mensilita: numIt(mensilita) || 14,
        giorni: numIt(giorni) || 365,
        comune,
      }),
    [ral, mensilita, giorni, comune, tick],
  );

  function ricalcola() {
    setTick((t) => t + 1);
    document.getElementById("risultato")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--sage)] px-3 py-1 text-xs font-semibold text-[var(--sage-ink)]">
          Anno d'imposta {P.annoImposta}
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Calcolatore RAL → netto
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--label)]">
          Ogni trattenuta spiegata voce per voce, con i tuoi numeri dentro
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <BottonePrimario onClick={() => setGuida(true)}>
            Come funziona il calcolo
          </BottonePrimario>
          <div>
            <div className="inline-flex rounded-[8px] border border-[var(--hairline)] p-0.5">
              <button
                type="button"
                onClick={() => setApprofondito(false)}
                className={`rounded-[6px] px-3 py-1.5 text-sm ${!approfondito ? "bg-[var(--ink)] text-white" : "text-[var(--label)]"}`}
              >
                Sintetico
              </button>
              <button
                type="button"
                onClick={() => setApprofondito(true)}
                className={`rounded-[6px] px-3 py-1.5 text-sm ${approfondito ? "bg-[var(--ink)] text-white" : "text-[var(--label)]"}`}
              >
                Approfondito
              </button>
            </div>
            <p className="mt-1 text-[13px] leading-5 text-[var(--label)]">
              Approfondito aggiunge il perché della regola e la norma di riferimento
            </p>
          </div>
        </div>
      </header>


      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <section className="h-fit rounded-[24px] border border-[var(--hairline)] p-6">
          <LabelGruppo>I tuoi dati</LabelGruppo>
          <div className="space-y-4">
            <CampoEuro id="ral" label="RAL — retribuzione annua lorda" value={ral} onChange={setRal} grande />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mensilita" className="mb-1.5 block text-sm font-medium text-[var(--label)]">
                  Mensilità
                </label>
                <input
                  id="mensilita"
                  inputMode="numeric"
                  value={mensilita}
                  onChange={(e) => setMensilita(e.target.value)}
                  className="tabular w-full rounded-[8px] border border-[var(--hairline)] px-3 py-2 outline-none focus:border-[var(--ink)]"
                />
              </div>
              <div>
                <label htmlFor="giorni" className="mb-1.5 block text-sm font-medium text-[var(--label)]">
                  Giorni lavorati
                </label>
                <input
                  id="giorni"
                  inputMode="numeric"
                  value={giorni}
                  onChange={(e) => setGiorni(e.target.value)}
                  className="tabular w-full rounded-[8px] border border-[var(--hairline)] px-3 py-2 outline-none focus:border-[var(--ink)]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="comune" className="mb-1.5 block text-sm font-medium text-[var(--label)]">
                Comune di residenza
              </label>
              <select
                id="comune"
                value={comuneScelto}
                onChange={(e) => setComuneScelto(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 outline-none focus:border-[var(--ink)]"
              >
                {P.comuni.map((c) => (
                  <option key={c.nome} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
                <option value="manuale">Altro comune — inserisco i dati</option>
              </select>
            </div>
            {comuneScelto === "manuale" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="aliq" className="mb-1.5 block text-sm font-medium text-[var(--label)]">
                    Aliquota %
                  </label>
                  <input
                    id="aliq"
                    inputMode="decimal"
                    value={aliquotaManuale}
                    onChange={(e) => setAliquotaManuale(e.target.value)}
                    className="tabular w-full rounded-[8px] border border-[var(--hairline)] px-3 py-2 outline-none focus:border-[var(--ink)]"
                  />
                </div>
                <div>
                  <label htmlFor="soglia" className="mb-1.5 block text-sm font-medium text-[var(--label)]">
                    Soglia esenzione €
                  </label>
                  <input
                    id="soglia"
                    inputMode="decimal"
                    value={sogliaManuale}
                    onChange={(e) => setSogliaManuale(e.target.value)}
                    className="tabular w-full rounded-[8px] border border-[var(--hairline)] px-3 py-2 outline-none focus:border-[var(--ink)]"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[13px] leading-5 text-[var(--label)]">
                Aliquota {percentuale(comune.aliquota)}, esenzione fino a{" "}
                {euro(comune.esenzioneFinoA)}. Delibera {comune.delibera}.
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={ricalcola}
                className="rounded-[8px] bg-[var(--ink)] px-6 py-2.5 text-[15px] font-semibold text-[var(--surface)]"
              >
                Calcola
              </button>
              <span className="text-[13px] leading-5 text-[var(--label)]">
                Il calcolo si aggiorna anche a ogni modifica.
              </span>
            </div>

            <p className="text-[13px] leading-5 text-[var(--label)]">
              Nessun dato viene salvato o inviato.
            </p>
          </div>
        </section>

        <section id="risultato" className="scroll-mt-6 rounded-[24px] border border-[var(--hairline)] p-6">
          <div className="mb-6 grid gap-4 rounded-[16px] bg-[var(--sage)] p-5 sm:grid-cols-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--sage-ink)]">
                Netto annuo
              </div>
              <div className="tabular font-display text-3xl font-extrabold">
                {euro(r.nettoAnnuo)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--sage-ink)]">
                Netto mensile su {r.mensilita}
              </div>
              <div className="tabular font-display text-3xl font-extrabold">
                {euro(r.nettoMensile)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--sage-ink)]">
                Prelievo sul lordo
              </div>
              <div className="tabular font-display text-3xl font-extrabold">
                {percentuale(r.prelievo, 1)}
              </div>
            </div>
          </div>

          <Cascata r={r} approfondito={approfondito} />
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-display mb-4 text-2xl font-bold">Confronto e calcolo inverso</h2>
        <ConfrontoInverso
          mensilita={r.mensilita}
          giorni={r.giorni}
          comune={comune}
          ralCorrente={r.ral}
        />
      </section>

      <section className="mt-10 rounded-[24px] border border-[var(--hairline)] p-6">
        <h2 className="font-display mb-4 text-2xl font-bold">Quattro concetti da tenere a mente</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CONCETTI.map((c) => (
            <div key={c.titolo} className="rounded-[16px] bg-[var(--soft)] p-5">
              <h3 className="mb-1 text-[15px] font-semibold">{c.titolo}</h3>
              <p className="text-sm leading-6 text-[var(--label)]">{c.testo}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display mb-4 text-2xl font-bold">Limiti del calcolo</h2>
        <div className="space-y-3">
          <Callout>
            Il netto mensile è una media: il cedolino reale differisce, perché tredicesima
            e quattordicesima non scontano detrazioni né addizionali, e le addizionali si
            trattengono a rate nell'anno successivo.
          </Callout>
          <Callout>
            Il calcolo assume nessun familiare a carico, nessun altro reddito e nessuna
            agevolazione. L'aliquota INPS è quella dell'impiegato del settore privato:
            dirigenti e apprendisti hanno aliquote diverse.
          </Callout>
          <Callout>
            Il netto non cresce sempre insieme al lordo: in tre punti scende, perché
            alcune agevolazioni usano soglie secche. È la norma, non un errore di calcolo.
          </Callout>
        </div>
        <p className="mt-6 text-[13px] text-[var(--label)]">
          Anno d'imposta {P.annoImposta}. Nessuna persistenza dei dati inseriti.
        </p>
      </section>

      <Guida aperta={guida} onClose={() => setGuida(false)} />
    </main>
  );
}
