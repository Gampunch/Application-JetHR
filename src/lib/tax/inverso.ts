import { calcola } from "./calcolo";
import { COMUNE_DEFAULT, type Comune } from "./parametri2026";

export type RisultatoInverso = {
  ral: number;
  nettoAnnuoOttenuto: number;
  nettoMensileOttenuto: number;
  target: number;
  scarto: number;
};

export function inverso(
  nettoMensileTarget: number,
  mensilita = 14,
  giorni = 365,
  comune: Comune = COMUNE_DEFAULT,
): RisultatoInverso {
  const target = (Number(nettoMensileTarget) || 0) * mensilita;
  let lo = 0;
  let hi = 500000;

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (calcola({ ral: mid, mensilita, giorni, comune }).nettoAnnuo < target) lo = mid;
    else hi = mid;
  }

  const ral = (lo + hi) / 2;
  const r = calcola({ ral, mensilita, giorni, comune });

  return {
    ral,
    nettoAnnuoOttenuto: r.nettoAnnuo,
    nettoMensileOttenuto: r.nettoMensile,
    target,
    scarto: r.nettoAnnuo - target,
  };
}
