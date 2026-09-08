import { describe, it, expect } from "vitest";
import { calcola } from "./calcolo";
import { inverso } from "./inverso";
import { PARAMETRI_2026 } from "./parametri2026";

const MILANO = PARAMETRI_2026.comuni[1]!;

type Attesa = {
  ral: number;
  imponibile: number;
  irpefNetta: number;
  addReg: number;
  addCom: number;
  esenti: number;
  nettoAnnuo: number;
  nettoMensile: number;
};

const ATTESI: Attesa[] = [
  { ral: 15000, imponibile: 13622, irpefNetta: 1178, addReg: 168, addCom: 109, esenti: 1922, nettoAnnuo: 14089, nettoMensile: 1006 },
  { ral: 20000, imponibile: 18162, irpefNetta: 1367, addReg: 234, addCom: 145, esenti: 872, nettoAnnuo: 17287, nettoMensile: 1235 },
  { ral: 25000, imponibile: 22702, irpefNetta: 1827, addReg: 306, addCom: 182, esenti: 0, nettoAnnuo: 20388, nettoMensile: 1456 },
  { ral: 28000, imponibile: 25427, irpefNetta: 2703, addReg: 349, addCom: 203, esenti: 0, nettoAnnuo: 22172, nettoMensile: 1584 },
  { ral: 30000, imponibile: 27243, irpefNetta: 3287, addReg: 378, addCom: 218, esenti: 0, nettoAnnuo: 23361, nettoMensile: 1669 },
  { ral: 35000, imponibile: 31784, irpefNetta: 5107, addReg: 455, addCom: 254, esenti: 0, nettoAnnuo: 25967, nettoMensile: 1855 },
  { ral: 40000, imponibile: 36324, irpefNetta: 7540, addReg: 533, addCom: 291, esenti: 0, nettoAnnuo: 27960, nettoMensile: 1997 },
  { ral: 45000, imponibile: 40864, irpefNetta: 9892, addReg: 611, addCom: 327, esenti: 0, nettoAnnuo: 30034, nettoMensile: 2145 },
  { ral: 50000, imponibile: 45405, irpefNetta: 11785, addReg: 689, addCom: 363, esenti: 0, nettoAnnuo: 32568, nettoMensile: 2326 },
  { ral: 60000, imponibile: 54448, irpefNetta: 15613, addReg: 845, addCom: 436, esenti: 0, nettoAnnuo: 37555, nettoMensile: 2682 },
  { ral: 80000, imponibile: 72410, irpefNetta: 23336, addReg: 1156, addCom: 579, esenti: 0, nettoAnnuo: 47339, nettoMensile: 3381 },
  { ral: 150000, imponibile: 138100, irpefNetta: 51583, addReg: 2292, addCom: 1105, esenti: 0, nettoAnnuo: 83120, nettoMensile: 5937 },
];

describe("tabella dei risultati attesi — San Rocco al Porto, 365 gg, 14 mensilita", () => {
  for (const a of ATTESI) {
    it(`RAL ${a.ral}`, () => {
      const r = calcola({ ral: a.ral });
      const got = {
        imponibile: Math.round(r.imponibile),
        irpefNetta: Math.round(r.irpefNetta),
        addReg: Math.round(r.addizionaleRegionale),
        addCom: Math.round(r.addizionaleComunale),
        esenti: Math.round(r.sommeEsenti),
        nettoAnnuo: Math.round(r.nettoAnnuo),
        nettoMensile: Math.round(r.nettoMensile),
      };
      console.log(
        `RAL ${a.ral}: imponibile ${got.imponibile}/${a.imponibile} · irpefNetta ${got.irpefNetta}/${a.irpefNetta} · addReg ${got.addReg}/${a.addReg} · addCom ${got.addCom}/${a.addCom} · esenti ${got.esenti}/${a.esenti} · netto ${got.nettoAnnuo}/${a.nettoAnnuo} · mensile ${got.nettoMensile}/${a.nettoMensile}`,
      );
      expect(got.imponibile).toBeCloseTo(a.imponibile, -0.5);
      expect(Math.abs(got.imponibile - a.imponibile)).toBeLessThanOrEqual(1);
      expect(Math.abs(got.irpefNetta - a.irpefNetta)).toBeLessThanOrEqual(1);
      expect(Math.abs(got.addReg - a.addReg)).toBeLessThanOrEqual(1);
      expect(Math.abs(got.addCom - a.addCom)).toBeLessThanOrEqual(1);
      expect(Math.abs(got.esenti - a.esenti)).toBeLessThanOrEqual(1);
      expect(Math.abs(got.nettoAnnuo - a.nettoAnnuo)).toBeLessThanOrEqual(1);
      expect(Math.abs(got.nettoMensile - a.nettoMensile)).toBeLessThanOrEqual(1);
    });
  }
});

describe("calcolo inverso", () => {
  const casi: Array<[number, number]> = [
    [1500, 26029],
    [1800, 33486],
    [2000, 40101],
    [2500, 54800],
    [3000, 69087],
  ];
  for (const [netto, ralAttesa] of casi) {
    it(`${netto} EUR/mese`, () => {
      const r = inverso(netto);
      console.log(`inverso ${netto}: RAL ${Math.round(r.ral)}/${ralAttesa}`);
      expect(Math.abs(Math.round(r.ral) - ralAttesa)).toBeLessThanOrEqual(1);
    });
  }
});

describe("discontinuita attese — esattamente tre", () => {
  it("il netto scende in tre punti fra 5.000 e 60.000 di RAL", () => {
    const punti: Array<{ ral: number; delta: number }> = [];
    let prec = calcola({ ral: 5000 }).nettoAnnuo;
    for (let ral = 5001; ral <= 60000; ral++) {
      const netto = calcola({ ral }).nettoAnnuo;
      if (netto < prec - 1) punti.push({ ral, delta: netto - prec });
      prec = netto;
    }
    console.log("discontinuita:", punti.map((p) => `RAL ${p.ral} ${Math.round(p.delta)} EUR`).join(" · "));
    expect(punti.length).toBe(3);
    expect(punti[0]!.ral).toBeGreaterThan(9300);
    expect(punti[0]!.ral).toBeLessThan(9450);
    expect(punti[1]!.ral).toBeGreaterThan(13150);
    expect(punti[1]!.ral).toBeLessThan(13300);
    expect(punti[2]!.ral).toBeGreaterThan(16450);
    expect(punti[2]!.ral).toBeLessThan(16600);
  });

  it("con Milano la soglia comunale si sposta a ~25.350", () => {
    let prec = calcola({ ral: 24000, comune: MILANO }).nettoAnnuo;
    let trovata = 0;
    for (let ral = 24001; ral <= 27000; ral++) {
      const netto = calcola({ ral, comune: MILANO }).nettoAnnuo;
      if (netto < prec - 1) trovata = ral;
      prec = netto;
    }
    console.log("discontinuita Milano a RAL", trovata);
    expect(trovata).toBeGreaterThan(25250);
    expect(trovata).toBeLessThan(25450);
  });
});

describe("casi limite", () => {
  it("ral = 0 non produce NaN", () => {
    const r = calcola({ ral: 0 });
    for (const v of Object.values(r)) {
      if (typeof v === "number") expect(Number.isNaN(v)).toBe(false);
    }
    expect(r.nettoAnnuo).toBe(0);
    expect(r.prelievo).toBe(0);
  });

  it("sopra il massimale i contributi si congelano", () => {
    const r = calcola({ ral: 200000 });
    const m = PARAMETRI_2026.inps.massimale;
    expect(r.contributi).toBeCloseTo(
      m * PARAMETRI_2026.inps.aliquota + (m - PARAMETRI_2026.inps.primaFascia) * 0.01,
      6,
    );
  });

  it("input non numerico vale zero", () => {
    const r = calcola({ ral: Number("abc") });
    expect(r.nettoAnnuo).toBe(0);
  });
});
