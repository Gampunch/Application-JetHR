import { PARAMETRI_2026, COMUNE_DEFAULT, type Comune, type Scaglione } from "./parametri2026";

export type RigaScaglione = {
  da: number;
  a: number;
  quota: number;
  aliquota: number;
  imposta: number;
};

export type Progressiva = { totale: number; dettaglio: RigaScaglione[] };

export function progressiva(base: number, scaglioni: Scaglione[]): Progressiva {
  let residuo = base;
  let precedente = 0;
  let totale = 0;
  const dettaglio: RigaScaglione[] = [];

  for (const { fino, aliquota } of scaglioni) {
    if (residuo <= 0) break;
    const quota = Math.min(residuo, fino - precedente);
    dettaglio.push({ da: precedente, a: fino, quota, aliquota, imposta: quota * aliquota });
    totale += quota * aliquota;
    residuo -= quota;
    precedente = fino;
  }

  return { totale, dettaglio };
}

export type InputCalcolo = {
  ral: number;
  mensilita?: number;
  giorni?: number;
  comune?: Comune;
};

export type RisultatoCalcolo = {
  ral: number;
  mensilita: number;
  giorni: number;
  q: number;
  comune: Comune;
  baseContributiva: number;
  eccedenzaPrimaFascia: number;
  contributiOrdinari: number;
  contributiAggiuntivi: number;
  contributi: number;
  imponibile: number;
  irpefLorda: number;
  dettaglioIrpef: RigaScaglione[];
  detrazioneLavoro: number;
  detrazioneCuneo: number;
  sommaEsente: number;
  percentualeSommaEsente: number;
  irpefNetta: number;
  trattamento: number;
  addizionaleRegionale: number;
  dettaglioAddizionaleRegionale: RigaScaglione[];
  addizionaleComunale: number;
  sommeEsenti: number;
  nettoAnnuo: number;
  nettoMensile: number;
  prelievo: number;
};

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function calcola(input: InputCalcolo): RisultatoCalcolo {
  const P = PARAMETRI_2026;
  const ral = num(input.ral);
  const mensilita = num(input.mensilita) || 14;
  const giorni = num(input.giorni) || 365;
  const comune = input.comune ?? COMUNE_DEFAULT;
  const q = Math.min(giorni, 365) / 365;

  // 1 — Contributi previdenziali
  const baseContributiva = Math.min(ral, P.inps.massimale);
  const eccedenzaPrimaFascia = Math.max(0, baseContributiva - P.inps.primaFascia);
  const contributiOrdinari = baseContributiva * P.inps.aliquota;
  const contributiAggiuntivi = eccedenzaPrimaFascia * P.inps.aliquotaAggiuntiva;
  const contributi = contributiOrdinari + contributiAggiuntivi;

  // 2 — Reddito imponibile
  const imponibile = ral - contributi;

  // 3 — IRPEF lorda
  const irpef = progressiva(imponibile, P.irpef as unknown as Scaglione[]);

  // 4 — Detrazione lavoro dipendente
  const d = P.detrazioneLavoro;
  let detrazioneLavoro = 0;
  if (ral > 0) {
    if (imponibile <= d.fascia1.limite) {
      detrazioneLavoro = Math.max(d.fascia1.importo * q, d.fascia1.minimoGarantito);
    } else if (imponibile <= d.fascia2.limite) {
      detrazioneLavoro =
        (d.fascia2.base +
          (d.fascia2.variabile * (d.fascia2.limite - imponibile)) / d.fascia2.divisore) *
        q;
    } else if (imponibile <= d.fascia3.limite) {
      detrazioneLavoro = ((d.fascia3.base * (d.fascia3.limite - imponibile)) / d.fascia3.divisore) * q;
    }
  }

  // 5 — Ulteriore detrazione cuneo
  const c = P.detrazioneCuneo;
  let detrazioneCuneo = 0;
  if (imponibile > c.da && imponibile <= c.fissaFinoA) {
    detrazioneCuneo = c.importoFisso * q;
  } else if (imponibile > c.fissaFinoA && imponibile <= c.azzeraA) {
    detrazioneCuneo = ((c.importoFisso * (c.azzeraA - imponibile)) / c.divisore) * q;
  }

  // 6 — Somma esente cuneo
  let percentualeSommaEsente = 0;
  if (ral > 0 && imponibile <= c.da) {
    const fascia = P.sommaEsente.find((f) => imponibile <= f.redditoFinoA) ?? P.sommaEsente[2];
    percentualeSommaEsente = fascia.percentuale;
  }
  const sommaEsente = imponibile > 0 ? imponibile * percentualeSommaEsente : 0;

  // 7 — IRPEF netta
  const irpefNetta = Math.max(0, irpef.totale - detrazioneLavoro - detrazioneCuneo);

  // 8 — Trattamento integrativo
  const t = P.trattamentoIntegrativo;
  let trattamento = 0;
  if (ral > 0) {
    if (imponibile <= t.limiteFascia1) {
      trattamento = irpef.totale > detrazioneLavoro - t.correttivo * q ? t.importoMax * q : 0;
    } else if (imponibile <= t.limiteFascia2) {
      trattamento = Math.max(0, Math.min(t.importoMax * q, detrazioneLavoro - irpef.totale));
    }
  }

  // 9 — Addizionali locali
  const reg = progressiva(imponibile, P.addizionaleRegionale as unknown as Scaglione[]);
  const addizionaleComunale =
    imponibile > comune.esenzioneFinoA ? imponibile * comune.aliquota : 0;

  // 10 — Netto
  const sommeEsenti = trattamento + sommaEsente;
  const nettoAnnuo =
    ral - contributi - irpefNetta - reg.totale - addizionaleComunale + trattamento + sommaEsente;
  const nettoMensile = mensilita > 0 ? nettoAnnuo / mensilita : 0;
  const prelievo = ral > 0 ? (ral - nettoAnnuo) / ral : 0;

  return {
    ral,
    mensilita,
    giorni,
    q,
    comune,
    baseContributiva,
    eccedenzaPrimaFascia,
    contributiOrdinari,
    contributiAggiuntivi,
    contributi,
    imponibile,
    irpefLorda: irpef.totale,
    dettaglioIrpef: irpef.dettaglio,
    detrazioneLavoro,
    detrazioneCuneo,
    sommaEsente,
    percentualeSommaEsente,
    irpefNetta,
    trattamento,
    addizionaleRegionale: reg.totale,
    dettaglioAddizionaleRegionale: reg.dettaglio,
    addizionaleComunale,
    sommeEsenti,
    nettoAnnuo,
    nettoMensile,
    prelievo,
  };
}
