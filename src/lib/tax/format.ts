// Formattazione italiana: punto per le migliaia, virgola per i decimali.
// Si usa la locale de-DE, identica nelle convenzioni ma che raggruppa
// sempre anche i numeri di quattro cifre (2.757 € e non 2757 €).
const LOCALE_NUMERI = "de-DE";

const euroFmt = new Intl.NumberFormat(LOCALE_NUMERI, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const euroFmt2 = new Intl.NumberFormat(LOCALE_NUMERI, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numFmt = new Intl.NumberFormat(LOCALE_NUMERI, { maximumFractionDigits: 0 });

export function euro(v: number, decimali = false): string {
  const n = Number.isFinite(v) ? v : 0;
  return decimali ? euroFmt2.format(n) : euroFmt.format(n);
}

export function numero(v: number): string {
  return numFmt.format(Number.isFinite(v) ? v : 0);
}

export function segnato(v: number, segno: "+" | "−"): string {
  return `${segno} ${euro(Math.abs(v))}`;
}

export function percentuale(v: number, decimali = 2): string {
  const n = (Number.isFinite(v) ? v : 0) * 100;
  return `${n.toLocaleString(LOCALE_NUMERI, { maximumFractionDigits: decimali })}%`;
}
