---
name: document-decoder
description: Legge un documento finanziario (estratto conto, bolletta, proposta di mutuo) e traduce ogni voce in parole semplici, evidenziando costi, canoni e commissioni. Produce un confronto "prima/dopo" per ogni riga. Usare quando l'utente carica un documento che non capisce.
---

# document-decoder

## Overview
Il traduttore dei documenti. Per ogni voce mostra il testo originale e la spiegazione semplice,
con i costi messi in evidenza. **Non valuta se il documento conviene** (lo impedisce l'hook).

## Input
- `document`: PDF/immagine/testo (estratto conto, bolletta, mutuo)
- `tipo`: uno tra `estratto_conto | bolletta | mutuo`

## Processo
1. **Parsing** in un **subagent isolato** (documenti lunghi non inquinano il contesto principale).
2. Estrazione voci e importi.
3. Per le sigle finanziarie chiama `jargon-explainer`.
4. I calcoli (es. scomposizione della rata) vengono da `core/` — mai dall'LLM.

## Output
Lista `{voce_originale, spiegazione_semplice, costo_evidenziato}` → alimenta il before/after.

## Modello
Haiku per il parsing, Sonnet per la spiegazione.

> Stato: spec pronta — implementazione nella fase di sviluppo.
