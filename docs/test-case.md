# Test case — MoneyMate

Casi di test per la demo: **caricamento documenti + spiegazione** e **alert di spese**.

## Precondizioni
1. Avvia l'app: doppio clic su `Avvia-MoneyMate.bat` → si apre `http://localhost:8000`.
2. Login: inserisci un nome utente qualsiasi (es. `giulia`), premi **Accedi**.
   (La password è dimostrativa, non viene verificata.)

I documenti di esempio da caricare sono in `app/assets/esempi/`.

---

## TC1 — Caricamento documento + spiegazione (chat)

**Obiettivo:** verificare che la chat legga un documento e spieghi le voci in parole semplici.

| # | Passo | Risultato atteso |
|---|-------|------------------|
| 1 | Vai su **Capire i documenti** (menu laterale) | Si apre la chat con il messaggio di benvenuto |
| 2 | Clicca **Carica il tuo** (o la graffetta) e scegli `bolletta-esempio.txt` | Appare il messaggio "📎 Ho caricato «bolletta-esempio.txt»" |
| 3 | Attendi la risposta | MoneyMate elenca e spiega: **Quota fissa, Oneri di sistema, IVA, Accise** |
| 4 | Scrivi: `cosa sono gli oneri di sistema?` | Risposta con definizione **+ esempio** |
| 5 | Scrivi: `mi conviene pagarla?` | **Guardrail**: "Non posso dirti se conviene… io spiego soltanto" |

**Varianti** (stesso flusso, altri file):
- `estratto-conto-esempio.txt` → riconosce **Canone, Commissione di prelievo, Commissione bonifico, Imposta di bollo**.
- `mutuo-esempio.txt` → riconosce **TAN, Euribor, Spread, TAEG, Rata, Commissione di istruttoria**.

**Esito positivo:** le voci presenti nel documento vengono riconosciute e spiegate; nessuna richiesta di consiglio riceve un consiglio.

---

## TC2 — Alert intelligenti sulle spese (dashboard)

**Obiettivo:** verificare che compaiano gli alert di andamento.

### TC2a — Scenario di esempio (dati pre-caricati)
| # | Passo | Risultato atteso |
|---|-------|------------------|
| 1 | Dalla **Dashboard** (o da *Le mie spese*) clicca **Prova con dati di esempio** | La dashboard si popola con il profilo di Giulia |
| 2 | Guarda la zona **Alert** (sotto le 3 card) | Compaiono 3 avvisi: |
|   |   | 📈 **Spesa in aumento** — *Ristoranti e bar è a 180 €: +45,2% rispetto ai 124 € del mese scorso* |
|   |   | 🔁 **Addebiti che si ripetono** — *3 pagamenti uguali ogni mese (12,99 + 9,99 + 4,99 €): possibili abbonamenti. In un anno: 335,64 €* |
|   |   | 🐖 **Risparmio del mese** — *metti da parte il 4,1% delle entrate (riferimento: 20%)* |

### TC2b — Trigger manuale (alert "Extra sopra il riferimento")
| # | Passo | Risultato atteso |
|---|-------|------------------|
| 1 | Vai su **Le mie spese** |  |
| 2 | Imposta **Entrate mensili** = `1000` → **Salva** |  |
| 3 | Aggiungi spesa: categoria **Ristoranti e bar**, importo `400` → **Aggiungi spesa** |  |
| 4 | Torna in **Dashboard** | Alert **"Extra sopra il riferimento"**: gli extra pesano il 40% (riferimento 30%) |

**Esito positivo:** gli alert riflettono i numeri calcolati dal motore (nessun numero inventato).

---

## TC3 — Impatto di un documento sul budget (chat)

**Obiettivo:** verificare che, caricando un documento con un costo ricorrente, la chat ne
mostri l'impatto sul budget (educativo, senza consigli).

| # | Passo | Risultato atteso |
|---|-------|------------------|
| 1 | Dashboard → **Prova con dati di esempio** (imposta entrate 1.450 €) | Budget popolato |
| 2 | **Capire i documenti** → **Carica il tuo** → `mutuo-esempio.txt` | Spiega le voci, poi aggiunge un messaggio **"💡 Impatto sul tuo budget"** |
| 3 | Leggi il messaggio di impatto | *La rata (548 €/mese) è il 37,8% delle entrate; oggi restano 60 €; mancano **488 €/mese** da liberare.* Con nota educativa (rata sostenibile ~30-35%) e "la scelta sta a te" |
| 4 | Scrivi `quanto devo risparmiare per permettermi il mutuo?` | Ripropone l'analisi d'impatto (stessi numeri) |
| 5 | Scrivi `mi conviene?` | **Guardrail**: nessun consiglio |

**Esito positivo:** l'impatto è calcolato sui numeri reali del budget; nessuna raccomandazione.

---

## Note
- I dati restano nel browser (localStorage). Per ripartire da zero: pulsante **Esci**, oppure
  svuota i dati del sito dal browser.
- I numeri degli alert provengono da `core/` (Python, testato) tramite `calc.js`.
