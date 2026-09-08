# Calcolatore RAL → netto 2026

Applicazione web per stimare la retribuzione netta annua e mensile di un lavoratore dipendente italiano per l'anno d'imposta 2026. Il calcolo segue la normativa fiscale e contributiva in vigore e mostra tutte le trattenute voce per voce, con la regola applicata nel caso specifico.

## Cosa fa il progetto

- Calcola il netto a partire dalla RAL lorda.
- Mostra la cascata completa dei calcoli: contributi INPS, imponibile fiscale, IRPEF lorda, detrazioni, addizionali regionali e comunali, trattamento integrativo e somme esenti.
- Permette il calcolo inverso: data una retribuzione netta mensile desiderata, trova la RAL necessaria.
- Offre una modalità Sintetica (numeri e formule) e una Approfondita (definizione, perché si applica, formula e norma di riferimento).
- Non salva né trasmette alcun dato: tutto rimane in memoria durante la sessione.

## Caso modellato

Il calcolo si riferisce al caso base di un impiegato del settore privato, tempo indeterminato, residente o dipendente presso il comune di **San Rocco al Porto (LO)**, senza familiari a carico, senza altri redditi e senza agevolazioni particolari.

Valori predefiniti:

- **Mensilità:** 14
- **Giorni lavorati nell'anno:** 365
- **Comune:** San Rocco al Porto (LO)

È possibile modificare RAL, mensilità, giorni e comune (Milano o inserimento manuale di aliquota e soglia).

## Parametri e norme di riferimento

I valori numerici sono definiti in `src/lib/tax/parametri2026.ts` e verificati sulle fonti primarie indicate.

| Parametro | Valore | Norma di riferimento |
| --- | --- | --- |
| Anno d'imposta | 2026 | — |
| **Contributi INPS** | | |
| Aliquota IVS dipendente | 9,19% | INPS circ. n. 6 del 30/01/2026 |
| Aliquota aggiuntiva oltre prima fascia | 1% | INPS circ. n. 6 del 30/01/2026 |
| Prima fascia contributiva | 56.224 € | INPS circ. n. 6 del 30/01/2026 |
| Massimale contributivo | 122.295 € | INPS circ. n. 6 del 30/01/2026 |
| **IRPEF** | | |
| Primo scaglione | 23% fino a 28.000 € | Art. 11 TUIR, mod. art. 1 c.3 L. 199/2025 |
| Secondo scaglione | 33% da 28.001 € a 50.000 € | Art. 11 TUIR, mod. art. 1 c.3 L. 199/2025 |
| Terzo scaglione | 43% oltre 50.000 € | Art. 11 TUIR, mod. art. 1 c.3 L. 199/2025 |
| **Detrazione lavoro dipendente** | | |
| Fascia 1 | fino a 15.000 € | Art. 13 c.1 TUIR |
| Fascia 2 | da 15.001 € a 28.000 € | Art. 13 c.1 TUIR |
| Fascia 3 | da 28.001 € a 50.000 € | Art. 13 c.1 TUIR |
| **Somma esente** | 7,1% / 5,3% / 4,8% a seconda del reddito | Art. 1 c.4 L. 207/2024 |
| **Detrazione cuneo fiscale** | 1.000 € fino a 32.000 €, poi decrescente fino a 40.000 € | Art. 1 c.6 L. 207/2024 |
| **Trattamento integrativo** | fino a 1.200 € | DL 3/2020 |
| **Addizionale regionale Lombardia** | 1,23% / 1,58% / 1,72% / 1,73% a scaglioni | Addizionale regionale Lombardia |
| **Addizionale comunale** | | |
| San Rocco al Porto (LO) | 0,80%, esenzione fino a 12.000 € | Delibera n. 6 del 28/01/2025, pubbl. MEF 10/02/2025 |
| Milano (MI) | 0,80%, esenzione fino a 23.000 € | Delibera n. 46 del 28/09/2020, confermata e pubbl. MEF 20/12/2025 |

> **Nota sull'addizionale comunale:** `esenzioneFinoA` è una **soglia**, non una franchigia. Se l'imponibile supera la soglia, l'aliquota si applica sull'**intero** imponibile.

## Come eseguire i test

Il progetto usa [Vitest](https://vitest.dev/). Per eseguire la suite completa:

```sh
bunx vitest run
```

La suite include:

- 12 casi della tabella RAL → netto per San Rocco al Porto, 365 giorni, 14 mensilità;
- 5 calcoli inversi da netto mensile a RAL;
- verifica delle tre discontinuità note;
- un caso con giorni parziali (180 giorni) per controllare il riproporzionamento delle detrazioni;
- casi limite (RAL 0, massimale INPS, input non numerico).

## Tre discontinuità note

Il netto non è monotòno rispetto alla RAL: in tre punti specifici la retribuzione netta scende all'aumentare del reddito lordo. Questi salti sono dovuti alla norma, non a bug del calcolatore.

1. **RAL ~9.370 €** (imponibile ~8.500 €): il netto scende di circa **146 €** perché la somma esente passa dal 7,1% al 5,3%.
2. **RAL ~13.220 €** (imponibile ~12.000 €): il netto scende di circa **89 €** perché scatta l'addizionale comunale sull'intero imponibile.
3. **RAL ~16.520 €** (imponibile ~15.000 €): il netto scende di circa **123 €** perché la somma esente passa al 4,8%, cambia la formula della detrazione lavoro e si perde il trattamento integrativo.

Con il comune di Milano la seconda discontinuità si sposta a circa **RAL 25.350 €** a causa della soglia comunale più alta.

## Limiti del calcolo

Il calcolatore fornisce una stima indicativa basata sul caso standard. Non tiene conto di:

- altri redditi del lavoratore;
- familiari a carico;
- agevolazioni, esenzioni o detrazioni aggiuntive (es. bonus ristrutturazioni, spese sanitarie, ecc.);
- trattenute sindacali, assicurative o altre ritenute specifiche del contratto;
- variazioni di CCNL o qualifica che modificano l'aliquota contributiva IVS;
- differenze tra anno di competenza e anno di pagamento;
- eventuali conguagli o rateizzazioni a fine anno.

Il risultato è quindi da intendersi come una simulazione del caso modellato, non come una certificazione fiscale.
