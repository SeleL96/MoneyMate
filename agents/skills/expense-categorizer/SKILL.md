---
name: expense-categorizer
description: Classifica transazioni bancarie grezze (descrizione + importo) in categorie di spesa comprensibili (es. Spesa alimentare, Trasporti, Casa, Svago) e traduce il gergo bancario in parole semplici. Usare quando l'utente carica un elenco movimenti o un estratto conto da organizzare.
---

# expense-categorizer

## Overview
Prende movimenti illeggibili ("POS 23/04 PAGOBANCOMAT XY SRL") e li assegna a una categoria
chiara, spiegando cosa sono.

## Input
- `transactions`: lista di `{descrizione, importo, data}`

## Output
- ogni transazione con `categoria` assegnata e `descrizione_semplice`
- raggruppamento per categoria (passato poi a `budget-analyzer`)

## Logica
Task di **classificazione** → modello **Haiku** (veloce, economico, ad alto volume).
Le categorie sono un set chiuso definito in `core/categories.py` per coerenza.

## Modello
Haiku.

> Stato: spec pronta — implementazione nella fase di sviluppo.
