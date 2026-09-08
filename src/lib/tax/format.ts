const euroFmt = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const euroFmt2 = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numFmt = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

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
  return `${n.toLocaleString("it-IT", { maximumFractionDigits: decimali })}%`;
}
