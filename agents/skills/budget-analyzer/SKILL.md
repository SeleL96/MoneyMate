---
name: budget-analyzer
description: Analizza il budget mensile a partire da entrate e spese categorizzate. Calcola totali, percentuali sul reddito, surplus/deficit e confronto con lo schema 50/30/20. Usare quando l'utente vuole capire dove vanno i suoi soldi o quanto può risparmiare.
---

# budget-analyzer

## Overview
Trasforma entrate e spese in un quadro chiaro del mese. **Non dà consigli**: fotografa la
situazione e la spiega.

## Input
- `income`: entrate mensili (numero)
- `expenses`: lista di `{categoria, importo}`

## Output (deterministico, da `core/`)
- totale speso, totale risparmiato, surplus/deficit
- percentuale di ogni categoria sul reddito
- confronto con lo schema di riferimento **50/30/20** (bisogni/sfizi/risparmio)
- categorie che superano la loro soglia di riferimento

## Logica
Nessun calcolo nella skill: chiama `core.budget_breakdown(income, expenses)`.
L'LLM (Sonnet) spiega il risultato in linguaggio semplice.

## Modello
Sonnet (spiegazione). Nessun numero generato dall'LLM.

> Stato: spec pronta — implementazione nella fase di sviluppo.
