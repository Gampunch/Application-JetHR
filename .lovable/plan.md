# Calcolatore RAL → netto 2026 (stile Jet HR)

Il documento allegato diventa il riferimento vincolante: parametri, sequenza di calcolo, testi e design vengono usati così come sono, senza ricalcoli né riscritture.

## Cosa vedrà l'utente

Una pagina unica, due colonne su desktop e righe impilate su mobile:

1. Intestazione con titolo, anno d'imposta e le ipotesi del caso (impiegato, settore privato, nessun carico familiare).
2. Input: RAL in evidenza, mensilità, giorni lavorati, comune (San Rocco al Porto predefinito, Milano, oppure aliquota e soglia inserite a mano).
3. Cascata dei calcoli in gruppi (CONTRIBUTI, IMPOSTE, SOMME ESENTI), con la regola applicata sotto ogni voce, le voci a zero visibili in grigio e un'icona "i" che apre il pannello di approfondimento.
4. Risultato: netto annuo, netto mensile, prelievo sul lordo.
5. Confronto fra due RAL e calcolo inverso dal netto mensile desiderato (mostrando sempre anche il netto effettivamente ottenuto).
6. Sezione con i quattro concetti trasversali e i limiti del calcolo.
7. Percorso guidato in sette passi alla prima visita, saltabile e riavviabile.
8. Interruttore Sintetico / Approfondito, con Sintetico come impostazione iniziale.

Nessun dato viene salvato o inviato: niente memoria del browser, niente statistiche.

## Testi

I testi dei pannelli vengono copiati alla lettera dal documento in un file separato, con i valori dell'utente inseriti dentro le formule. Ogni aliquota, soglia e importo nei testi arriva dai parametri, mai scritto a mano.

## Dettagli tecnici

- `src/lib/tax/parametri2026.ts` — `PARAMETRI_2026` trascritto identico dalla sezione A.
- `src/lib/tax/calcolo.ts` — funzione pura `calcola(input)` che segue la sequenza della sezione B nell'ordine dato: contributi con massimale, imponibile, `progressiva()` riusata per IRPEF e addizionale regionale, detrazione lavoro, detrazione cuneo, somma esente (sommata al netto, non all'imposta), IRPEF netta con pavimento a zero, trattamento integrativo (senza la detrazione cuneo fra le qualificate), addizionali locali con l'esenzione comunale come soglia, netto e prelievo. Restituisce tutti gli intermedi e il dettaglio scaglioni.
- `src/lib/tax/inverso.ts` — ricerca binaria 0–500.000, 80 iterazioni.
- `src/lib/tax/contenuti.ts` — `CONTENUTI_DIDATTICI` con i testi della sezione C verbatim e i segnaposto `{...}`.
- Casi limite: input vuoto o non numerico = 0, nessun NaN a schermo, nessuna divisione per zero.
- Test con vitest sui 12 valori attesi della tabella RAL, sui 5 risultati del calcolo inverso e sulle tre discontinuità.
- Design: token in `src/styles.css` (`--ink #11150A`, bordo `#E5E7EB`, verde salvia, giallo-lime, grigi), font Wix Madefor Display/Text caricati via `<link>` nella radice, cifre tabulari sulla colonna importi, raggi in gerarchia (24/16/12–16/8 px), segni + e − espliciti.
- Pagina costruita su `src/routes/index.tsx`, con titolo e descrizione propri.
- Il documento viene salvato nella memoria di progetto come regola permanente.
