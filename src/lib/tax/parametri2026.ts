export type Scaglione = { fino: number; aliquota: number };

export type Comune = {
  nome: string;
  aliquota: number;
  esenzioneFinoA: number;
  delibera: string;
  default?: boolean;
};

export const PARAMETRI_2026 = {
  annoImposta: 2026,

  // INPS circ. n. 6 del 30/01/2026
  inps: {
    aliquota: 0.0919, // IVS a carico dipendente, impiegato settore privato. Varia con CCNL e qualifica.
    aliquotaAggiuntiva: 0.01,
    primaFascia: 56224,
    massimale: 122295,
  },

  // Art. 11 TUIR, mod. art. 1 c.3 L. 199/2025
  // ATTENZIONE: secondo scaglione 33%, NON 35%. Il 35% era 2024-2025.
  irpef: [
    { fino: 28000, aliquota: 0.23 },
    { fino: 50000, aliquota: 0.33 },
    { fino: Infinity, aliquota: 0.43 },
  ] as Scaglione[],

  // Art. 13 c.1 TUIR
  detrazioneLavoro: {
    fascia1: { limite: 15000, importo: 1955, minimoGarantito: 690 },
    fascia2: { limite: 28000, base: 1910, variabile: 1190, divisore: 13000 },
    fascia3: { limite: 50000, base: 1910, divisore: 22000 },
  },

  // Art. 1 c.4 L. 207/2024 — somma NON imponibile, NON e' una detrazione
  sommaEsente: [
    { redditoFinoA: 8500, percentuale: 0.071 },
    { redditoFinoA: 15000, percentuale: 0.053 },
    { redditoFinoA: 20000, percentuale: 0.048 },
  ],

  // Art. 1 c.6 L. 207/2024 — ulteriore detrazione d'imposta
  detrazioneCuneo: {
    da: 20000,
    fissaFinoA: 32000,
    importoFisso: 1000,
    azzeraA: 40000,
    divisore: 8000,
  },

  // DL 3/2020 — trattamento integrativo
  trattamentoIntegrativo: {
    importoMax: 1200,
    limiteFascia1: 15000,
    correttivo: 75,
    limiteFascia2: 28000,
  },

  // Addizionale regionale Lombardia, a scaglioni
  addizionaleRegionale: [
    { fino: 15000, aliquota: 0.0123 },
    { fino: 28000, aliquota: 0.0158 },
    { fino: 50000, aliquota: 0.0172 },
    { fino: Infinity, aliquota: 0.0173 },
  ] as Scaglione[],

  // Solo comuni con delibera verificata su portale MEF.
  // "esenzioneFinoA" e' una SOGLIA, non una franchigia: superata, si paga sull'INTERO imponibile.
  comuni: [
    {
      nome: "San Rocco al Porto (LO)",
      aliquota: 0.008,
      esenzioneFinoA: 12000,
      delibera: "n. 6 del 28/01/2025, pubbl. MEF 10/02/2025",
      default: true,
    },
    {
      nome: "Milano (MI)",
      aliquota: 0.008,
      esenzioneFinoA: 23000,
      delibera: "n. 46 del 28/09/2020, confermata e pubbl. MEF 20/12/2025",
    },
  ] as Comune[],
} as const;

export const COMUNE_DEFAULT: Comune = PARAMETRI_2026.comuni.find((c) => c.default)!;
