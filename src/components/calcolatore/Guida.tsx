import { useState } from "react";
import { PASSI_GUIDA } from "@/lib/tax/contenuti";
import { BottonePrimario, BottoneSecondario, Pannello } from "./ui";

export default function Guida({ aperta, onClose }: { aperta: boolean; onClose: () => void }) {
  const [passo, setPasso] = useState(0);
  const p = PASSI_GUIDA[passo];

  function chiudi() {
    setPasso(0);
    onClose();
  }

  return (
    <Pannello aperto={aperta} onClose={chiudi} titolo={p.titolo}>
      <p>{p.testo}</p>
      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-sm text-[var(--label)]">
          Passo {passo + 1} di {PASSI_GUIDA.length}
        </span>
        <div className="flex gap-2">
          {passo > 0 ? (
            <BottoneSecondario onClick={() => setPasso(passo - 1)}>Indietro</BottoneSecondario>
          ) : (
            <BottoneSecondario onClick={chiudi}>Salta</BottoneSecondario>
          )}
          {passo < PASSI_GUIDA.length - 1 ? (
            <BottonePrimario onClick={() => setPasso(passo + 1)}>Avanti</BottonePrimario>
          ) : (
            <BottonePrimario onClick={chiudi}>Ho capito</BottonePrimario>
          )}
        </div>
      </div>
    </Pannello>
  );
}
