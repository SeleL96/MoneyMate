---
name: jargon-explainer
description: Spiega in linguaggio semplice un termine finanziario (TAN, TAEG, spread, Euribor, rata, canone, commissione, inflazione, interesse) accompagnandolo con un esempio numerico concreto. Usare quando l'utente incontra una sigla o un termine che non conosce.
---

# jargon-explainer

## Overview
Il glossario vivo. Ogni termine è spiegato con una frase semplice **e** un esempio con numeri.

## Progressive disclosure
- La skill carica solo la metadata finché non serve.
- Le definizioni dettagliate stanno in `references/glossario.md` (caricato on-demand) →
  risparmio di token.

## Input
- `term`: il termine da spiegare
- `context` (opz.): i valori reali dal documento dell'utente, per un esempio calzante

## Output
- `definizione_semplice`
- `esempio_numerico` (calcolato da `core/` se servono conti)

## Esempio
`TAEG` → "È il costo totale vero del prestito in un anno, commissioni incluse. Se chiedi 1.000€
e a fine anno ne restituisci 1.048€, il TAEG è circa 4,8%."

## Modello
Sonnet.

> Stato: spec pronta — `references/glossario.md` da popolare in fase di sviluppo.
