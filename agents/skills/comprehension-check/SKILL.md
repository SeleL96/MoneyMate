---
name: comprehension-check
description: Genera un micro-quiz adattivo per misurare la comprensione dell'utente prima e dopo l'uso di Bussola, valuta le risposte e adatta la difficoltà. Fornisce la metrica di miglioramento richiesta dal tema. Usare per il test pre/post o per rinforzare un concetto.
---

# comprehension-check

## Overview
Misura il **miglioramento tangibile** richiesto dal tema. Stessa domanda prima e dopo:
la differenza di punteggio è la prova che l'utente ha capito.

## Input
- `topic`: argomento (es. "commissioni del conto", "rata del mutuo")
- `level`: livello corrente dell'utente (`base | medio`)
- `phase`: `pre | post`

## Output
- domande con risposte valutate
- `score` e `delta` pre→post
- `level` aggiornato (adattività)

## Capability agentica
- **Valutazione della comprensione** + **percorso adattivo**: se l'utente sbaglia, abbassa il
  livello e rispiega; se risponde bene, alza la difficoltà.

## Modello
Haiku (generazione e correzione del quiz).

> Stato: spec pronta — implementazione nella fase di sviluppo.
