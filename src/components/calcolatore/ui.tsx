import { useEffect, type ReactNode } from "react";

export function LabelGruppo({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--label)]">
      {children}
    </div>
  );
}

export function IconaInfo({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Approfondisci: ${label}`}
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--soft)] text-[11px] font-semibold italic text-[var(--label)] transition-colors hover:bg-[var(--sage)] hover:text-[var(--sage-ink)]"
    >
      i
    </button>
  );
}

export function BoxFormula({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[14px] bg-[var(--soft)] px-4 py-3 text-sm leading-6">
      <span className="mr-2">💡</span>
      <span className="tabular">{children}</span>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[14px] bg-[var(--lime)] px-4 py-3 text-sm leading-6 text-[var(--lime-ink)]">
      {children}
    </div>
  );
}

export function Pannello({
  aperto,
  onClose,
  titolo,
  children,
}: {
  aperto: boolean;
  onClose: () => void;
  titolo: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!aperto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aperto, onClose]);

  if (!aperto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titolo}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] bg-[var(--surface)] p-6 shadow-xl sm:max-w-lg sm:rounded-[24px]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold leading-7">{titolo}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="rounded-[8px] border border-[var(--hairline)] px-2.5 py-1 text-sm text-[var(--label)] hover:bg-[var(--soft)]"
          >
            Chiudi
          </button>
        </div>
        <div className="space-y-4 text-[15px] leading-6">{children}</div>
      </div>
    </div>
  );
}

export function BottonePrimario(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`rounded-[8px] bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 ${className}`}
    />
  );
}

export function BottoneSecondario(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`rounded-[8px] border border-[var(--hairline)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--soft)] ${className}`}
    />
  );
}

export function CampoEuro({
  id,
  label,
  value,
  onChange,
  grande = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  grande?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--label)]">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-[8px] border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 focus-within:border-[var(--ink)]">
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--soft)] text-sm text-[var(--label)]">
          €
        </span>
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`tabular w-full bg-transparent outline-none ${grande ? "font-display text-3xl font-bold" : "text-base"}`}
        />
      </div>
    </div>
  );
}
