import { PARAMETRI_2026 as P } from "./parametri2026";
import type { RisultatoCalcolo } from "./calcolo";
import { euro, numero, percentuale } from "./format";

export type VoceId =
  | "ral"
  | "inps"
  | "inpsAggiuntivo"
  | "imponibile"
  | "irpefLorda"
  | "detrazioneLavoro"
  | "detrazioneCuneo"
  | "irpefNetta"
  | "addizionaleRegionale"
  | "addizionaleComunale"
  | "sommaEsente"
  | "trattamento"
  | "netto";

export type Contenuto = {
  titolo: string;
  cosE: string;
  perche: string;
  norma?: string;
  nota?: string;
};

/** Testi copiati alla lettera dal contesto di progetto. */
export const CONTENUTI_DIDATTICI: Record<VoceId, Contenuto> = {
  ral: {
    titolo: "RAL — Retribuzione annua lorda",
    cosE: "Il totale annuo che risulta dal contratto, prima di qualsiasi trattenuta. Non è quello che costa l'azienda: i contributi a carico del datore di lavoro e il TFR sono in aggiunta e non compaiono qui.",
    perche:
      "È il punto di partenza: tutte le trattenute si calcolano a cascata da questo valore.",
  },
  inps: {
    titolo: `INPS ${percentuale(P.inps.aliquota)}`,
    cosE: "La quota di contributi previdenziali a carico del lavoratore, trattenuta dal datore di lavoro e versata all'INPS. Finanzia la tua pensione futura.",
    perche:
      "Sono contributi obbligatori. Sono anche deducibili: si sottraggono dal reddito prima di calcolare l'IRPEF, quindi ridurre il reddito su cui paghi le tasse è un loro effetto secondario.",
    norma:
      "Aliquota FPLD per impiegati del settore privato. Varia con CCNL, qualifica e dimensione aziendale: per dirigenti e apprendisti è diversa.",
  },
  inpsAggiuntivo: {
    titolo: `INPS ${percentuale(P.inps.aliquotaAggiuntiva, 0)} aggiuntivo`,
    cosE: "Un contributo aggiuntivo che si applica solo alla parte di retribuzione che supera una certa soglia.",
    perche:
      "Ha funzione solidaristica: chi guadagna sopra la prima fascia di retribuzione pensionabile versa un punto percentuale in più su quella parte.",
    norma: `Art. 3-ter DL 384/1992. Soglia ${P.annoImposta}: INPS circolare n. 6 del 30/01/${P.annoImposta}.`,
  },
  imponibile: {
    titolo: "Reddito imponibile fiscale",
    cosE: "Il reddito su cui si calcolano l'IRPEF e le addizionali. Non coincide con la RAL.",
    perche: `I contributi previdenziali sono deducibili, quindi si tolgono dal lordo prima del calcolo dell'imposta. È il motivo per cui le soglie fiscali (${numero(P.irpef[0]!.fino)}, ${numero(P.irpef[1]!.fino)}, le fasce del cuneo) vanno confrontate con questo valore e non con la RAL: con ${euro(28000)} di RAL l'imponibile è circa ${euro(25400)}, quindi si resta interamente nel primo scaglione.`,
    nota: "Vale come reddito complessivo solo perché questo calcolo assume che tu non abbia altri redditi. Con redditi da locazione o un secondo lavoro il valore cambia e le detrazioni si riducono.",
  },
  irpefLorda: {
    titolo: "IRPEF lorda",
    cosE: "L'imposta sul reddito prima di sottrarre le detrazioni.",
    perche:
      "È progressiva per scaglioni: ogni aliquota colpisce solo la parte di reddito compresa nel proprio scaglione, non tutto il reddito. È l'errore di lettura più comune: \u201Csono passato di scaglione\u201D non significa quasi mai che si paga di più su tutto.",
    norma: `Art. 11 TUIR, modificato dall'art. 1 c. 3 della L. 199/2025. Dal ${P.annoImposta} il secondo scaglione è sceso dal 35% al ${percentuale(P.irpef[1]!.aliquota, 0)}.`,
  },
  detrazioneLavoro: {
    titolo: "Detrazione per lavoro dipendente",
    cosE: `Uno sconto sull'imposta riconosciuto a chi ha redditi da lavoro dipendente. Diminuisce al crescere del reddito e si azzera sopra i ${euro(P.detrazioneLavoro.fascia3.limite)}.`,
    perche:
      "Riduce il peso dell'IRPEF sui redditi da lavoro. Attenzione alla differenza: una detrazione si sottrae dall'imposta, una deduzione dal reddito. Mille euro di detrazione valgono sempre mille euro; mille euro di deduzione valgono quanto la tua aliquota marginale.",
    norma: "Art. 13 comma 1 TUIR.",
  },
  detrazioneCuneo: {
    titolo: "Ulteriore detrazione cuneo fiscale",
    cosE: `Una detrazione aggiuntiva introdotta per ridurre il peso fiscale sui redditi medi. Vale ${euro(P.detrazioneCuneo.importoFisso)} fissi fino a ${euro(P.detrazioneCuneo.fissaFinoA)} di reddito, poi cala fino ad azzerarsi a ${euro(P.detrazioneCuneo.azzeraA)}.`,
    perche: `È una delle due forme del taglio del cuneo fiscale. Sotto i ${euro(P.detrazioneCuneo.da)} di reddito il beneficio non è una detrazione ma una somma esente da imposta, che trovi più in basso nel prospetto. Sono due strumenti diversi che si escludono a vicenda.`,
    norma: `Art. 1 comma 6 L. 207/2024, confermato per il ${P.annoImposta}.`,
  },
  irpefNetta: {
    titolo: "IRPEF netta",
    cosE: "L'imposta effettivamente dovuta, dopo aver sottratto le detrazioni.",
    perche:
      "Le detrazioni riducono l'imposta ma non possono generare un credito: se superano l'imposta lorda, l'IRPEF netta si ferma a zero e la parte eccedente si perde. È la ragione per cui, sui redditi molto bassi, aumentare le detrazioni non aumenta il netto.",
  },
  addizionaleRegionale: {
    titolo: "Addizionale regionale",
    cosE: "Un'imposta della Regione di residenza, calcolata sullo stesso imponibile dell'IRPEF nazionale.",
    perche:
      "Le Regioni possono fissare la propria aliquota entro limiti di legge, con un'aliquota unica o a scaglioni. La Lombardia usa gli scaglioni ed è fra le più basse d'Italia.",
    norma:
      "Aliquote deliberate dalla Regione Lombardia, portale del federalismo fiscale (MEF).",
  },
  addizionaleComunale: {
    titolo: "Addizionale comunale",
    cosE: "Un'imposta del Comune di residenza, sullo stesso imponibile.",
    perche:
      "Ogni Comune delibera la propria aliquota e può fissare una soglia di esenzione. Il punto da capire: nella maggior parte dei casi, e in questo, si tratta di una soglia e non di una franchigia. Sotto la soglia non si paga nulla; superata anche di un euro, si paga sull'intero imponibile e non sulla sola eccedenza. È il motivo per cui, appena superata la soglia, il netto fa un salto all'indietro.",
  },
  sommaEsente: {
    titolo: "Somma esente cuneo fiscale",
    cosE: "Una somma che il datore di lavoro eroga in busta paga e che non concorre a formare il reddito imponibile: arriva netta, senza passare dalle imposte.",
    perche: `È l'altra forma del taglio del cuneo, quella per i redditi fino a ${euro(P.detrazioneCuneo.da)}. Non è una detrazione: non riduce l'imposta, si aggiunge al netto. La percentuale dipende dalla fascia di reddito e scende al crescere del reddito, il che crea due punti in cui guadagnare qualcosa in più di lordo può far diminuire il netto.`,
    norma:
      "Art. 1 comma 4 L. 207/2024. Circolare Agenzia delle Entrate n. 4/2025 per la base di applicazione.",
  },
  trattamento: {
    titolo: "Trattamento integrativo",
    cosE: `Una somma fino a ${euro(P.trattamentoIntegrativo.importoMax)} annui, erogata in busta paga ai redditi più bassi. È il successore del cosiddetto bonus Renzi.`,
    perche: `Fino a ${euro(P.trattamentoIntegrativo.limiteFascia1)} di reddito spetta per intero, ma solo se l'imposta lorda supera la detrazione da lavoro diminuita di ${euro(P.trattamentoIntegrativo.correttivo)}: è una verifica di capienza che serve a non escludere chi ne aveva diritto prima che la detrazione salisse da ${euro(1880)} a ${euro(P.detrazioneLavoro.fascia1.importo)}. Fra ${numero(P.trattamentoIntegrativo.limiteFascia1 + 1)} e ${euro(P.trattamentoIntegrativo.limiteFascia2)} spetta solo in caso di incapienza, cioè se le detrazioni superano l'imposta: senza familiari a carico né mutuo, quasi mai.`,
    norma: "DL 3/2020 art. 1.",
  },
  netto: {
    titolo: "Netto annuo e netto mensile",
    cosE: "Quello che resta dopo tutte le trattenute, più le somme esenti e integrative.",
    perche:
      "Il netto mensile qui è una media: il netto annuo diviso il numero di mensilità. Il cedolino reale sarà diverso, perché tredicesima e quattordicesima non scontano detrazioni né addizionali. Le mensilità ordinarie risultano quindi un po' più basse di questa media, e quelle aggiuntive più alte. Anche le addizionali, nella realtà, si trattengono in rate su un arco di undici mesi dell'anno successivo, mentre qui sono calcolate per competenza.",
  },
};

export const CONCETTI = [
  {
    titolo: "Deduzione o detrazione?",
    testo: `Una deduzione si sottrae dal reddito prima di calcolare l'imposta: ${euro(1000)} di deduzione ti fanno risparmiare quanto la tua aliquota marginale, cioè ${numero(1000 * P.irpef[0]!.aliquota)}, ${numero(1000 * P.irpef[1]!.aliquota)} o ${euro(1000 * P.irpef[2]!.aliquota)}. Una detrazione si sottrae dall'imposta già calcolata: ${euro(1000)} di detrazione valgono sempre ${euro(1000)}, ma solo fino a capienza. I contributi INPS sono deduzioni; le detrazioni da lavoro e del cuneo sono detrazioni.`,
  },
  {
    titolo: "Soglia o franchigia?",
    testo:
      "Con una franchigia si paga solo sulla parte eccedente. Con una soglia, superarla di un euro rende dovuta l'imposta sull'intero importo. L'esenzione dell'addizionale comunale è una soglia, e questo produce un salto secco nel netto appena la si supera.",
  },
  {
    titolo: "Aliquota marginale e aliquota media.",
    testo:
      "La marginale è quella che si applica all'ultimo euro guadagnato, la media è il rapporto fra imposta totale e reddito. Sono sempre diverse in un sistema progressivo, e la seconda è sempre più bassa della prima. Quando si valuta un aumento, quella che conta è la marginale.",
  },
  {
    titolo: "Perché guadagnare di più può far scendere il netto.",
    testo:
      "Diverse agevolazioni usano soglie secche invece di transizioni graduali: superarle fa perdere il beneficio per intero. In questo calcolo succede in tre punti, ed è una caratteristica della norma, non un errore di calcolo. La funzione di confronto fra due RAL serve proprio a renderli visibili.",
  },
];

/** "Come si calcola nel tuo caso", con i numeri dell'utente dentro. */
export function comeSiCalcola(voce: VoceId, r: RisultatoCalcolo): string {
  const giorniNota =
    r.giorni < 365
      ? ` Riproporzionata a ${numero(r.giorni)} giorni di lavoro sui 365 dell'anno.`
      : "";

  switch (voce) {
    case "ral":
      return `È il dato che hai inserito: ${euro(r.ral)}.`;
    case "inps":
      return `${euro(r.ral)} × ${percentuale(P.inps.aliquota)} = ${euro(r.contributiOrdinari)}.`;
    case "inpsAggiuntivo":
      return r.eccedenzaPrimaFascia > 0
        ? `La parte di RAL che supera ${euro(P.inps.primaFascia)} è ${euro(r.eccedenzaPrimaFascia)}. Su questa: ${euro(r.eccedenzaPrimaFascia)} × ${percentuale(P.inps.aliquotaAggiuntiva, 0)} = ${euro(r.contributiAggiuntivi)}.`
        : `Non dovuto: la tua RAL non supera ${euro(P.inps.primaFascia)}.`;
    case "imponibile":
      return `${euro(r.ral)} − ${euro(r.contributi)} = ${euro(r.imponibile)}.`;
    case "irpefLorda":
      return `Dettaglio per scaglione qui sotto, totale ${euro(r.irpefLorda)}.`;
    case "detrazioneLavoro": {
      const d = P.detrazioneLavoro;
      if (r.imponibile <= d.fascia1.limite)
        return `Il maggiore fra ${euro(d.fascia1.importo)} riproporzionati e il minimo garantito di ${euro(d.fascia1.minimoGarantito)} = ${euro(r.detrazioneLavoro)}.${giorniNota}`;
      if (r.imponibile <= d.fascia2.limite)
        return `${numero(d.fascia2.base)} + ${numero(d.fascia2.variabile)} × (${numero(d.fascia2.limite)} − ${euro(r.imponibile)}) / ${numero(d.fascia2.divisore)} = ${euro(r.detrazioneLavoro)}.${giorniNota}`;
      if (r.imponibile <= d.fascia3.limite)
        return `${numero(d.fascia3.base)} × (${numero(d.fascia3.limite)} − ${euro(r.imponibile)}) / ${numero(d.fascia3.divisore)} = ${euro(r.detrazioneLavoro)}.${giorniNota}`;
      return `Non spettante: il tuo imponibile di ${euro(r.imponibile)} supera ${euro(d.fascia3.limite)}.`;
    }
    case "detrazioneCuneo": {
      const c = P.detrazioneCuneo;
      if (r.imponibile > c.da && r.imponibile <= c.fissaFinoA)
        return `Il tuo imponibile di ${euro(r.imponibile)} rientra fra ${numero(c.da)} e ${euro(c.fissaFinoA)}: spettano ${euro(c.importoFisso)} pieni.${giorniNota}`;
      if (r.imponibile > c.fissaFinoA && r.imponibile <= c.azzeraA)
        return `${numero(c.importoFisso)} × (${numero(c.azzeraA)} − ${euro(r.imponibile)}) / ${numero(c.divisore)} = ${euro(r.detrazioneCuneo)}.${giorniNota}`;
      return `Non spettante: il tuo imponibile di ${euro(r.imponibile)} è fuori dalla fascia ${numero(c.da)}–${euro(c.azzeraA)}.`;
    }
    case "irpefNetta":
      return `${euro(r.irpefLorda)} − ${euro(r.detrazioneLavoro)} − ${euro(r.detrazioneCuneo)} = ${euro(r.irpefNetta)}.`;
    case "addizionaleRegionale":
      return `Dettaglio per scaglione qui sotto, totale ${euro(r.addizionaleRegionale)}.`;
    case "addizionaleComunale":
      return r.addizionaleComunale > 0
        ? `Il tuo imponibile di ${euro(r.imponibile)} supera la soglia di esenzione di ${euro(r.comune.esenzioneFinoA)}: ${euro(r.imponibile)} × ${percentuale(r.comune.aliquota)} = ${euro(r.addizionaleComunale)}.`
        : `Non dovuta: il tuo imponibile di ${euro(r.imponibile)} non supera la soglia di esenzione di ${euro(r.comune.esenzioneFinoA)}.`;
    case "sommaEsente":
      return r.sommaEsente > 0
        ? `Il tuo imponibile di ${euro(r.imponibile)} rientra nella fascia con percentuale ${percentuale(r.percentualeSommaEsente, 1)}: ${euro(r.imponibile)} × ${percentuale(r.percentualeSommaEsente, 1)} = ${euro(r.sommaEsente)}.`
        : `Non spettante: il tuo imponibile supera i ${euro(P.detrazioneCuneo.da)}. Al suo posto ti spetta l'ulteriore detrazione, che trovi più in alto.`;
    case "trattamento": {
      const t = P.trattamentoIntegrativo;
      if (r.imponibile > t.limiteFascia2)
        return `Non spettante: il tuo imponibile supera i ${euro(t.limiteFascia2)}.`;
      if (r.trattamento <= 0)
        return `Non spettante: l'imposta lorda non supera la detrazione ridotta di ${euro(t.correttivo)}.`;
      if (r.imponibile <= t.limiteFascia1)
        return `Spettante per intero: l'imposta lorda di ${euro(r.irpefLorda)} supera la detrazione ridotta di ${euro(t.correttivo)}.`;
      return `Spettante per la differenza fra detrazioni e imposta lorda: ${euro(r.trattamento)}.`;
    }
    case "netto":
      return `${euro(r.ral)} − ${euro(r.contributi)} − ${euro(r.irpefNetta)} − ${euro(r.addizionaleRegionale)} − ${euro(r.addizionaleComunale)} + ${euro(r.sommeEsenti)} = ${euro(r.nettoAnnuo)}, diviso ${numero(r.mensilita)} mensilità = ${euro(r.nettoMensile)}.`;
  }
}

export function normaComunale(delibera: string): string {
  return `Delibera comunale ${delibera}, depositata sul portale del federalismo fiscale (MEF).`;
}

export const PASSI_GUIDA = [
  {
    titolo: "1 — Dal lordo all'imponibile",
    testo:
      "I contributi INPS a tuo carico si tolgono dalla RAL prima di ogni imposta: sono deducibili. Il reddito su cui si calcolano IRPEF e addizionali è quindi più basso della RAL.",
  },
  {
    titolo: "2 — L'IRPEF a scaglioni",
    testo:
      "Ogni aliquota colpisce solo la parte di reddito che ricade nel proprio scaglione, mai tutto il reddito.",
  },
  {
    titolo: "3 — Le detrazioni",
    testo:
      "Si sottraggono dall'imposta già calcolata, non dal reddito, e non possono generare un credito: l'imposta si ferma a zero.",
  },
  {
    titolo: "4 — Il cuneo fiscale",
    testo:
      "Due strumenti alternativi: sotto i 20.000 € di imponibile una somma esente che si aggiunge al netto, sopra una detrazione d'imposta fino a 1.000 €.",
  },
  {
    titolo: "5 — Le addizionali locali",
    testo:
      "Regione e Comune tassano lo stesso imponibile. L'esenzione comunale è una soglia: superata, si paga sull'intero imponibile.",
  },
  {
    titolo: "6 — Dal netto fiscale al netto in busta",
    testo:
      "Al netto fiscale si sommano trattamento integrativo e somma esente, poi si divide per le mensilità: è una media, non il cedolino reale.",
  },
  {
    titolo: "7 — I limiti",
    testo:
      "Il calcolo assume un solo reddito, nessun familiare a carico e nessuna agevolazione. Cambiando queste ipotesi cambiano detrazioni e risultato.",
  },
];
