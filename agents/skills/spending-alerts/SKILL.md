---
name: spending-alerts
description: Genera alert proattivi sul budget applicando regole deterministiche — variazione di una categoria rispetto al mese precedente, peso eccessivo sul reddito, addebiti ricorrenti sospetti (abbonamenti). Usare quando si vuole segnalare all'utente dove sta spendendo di più.
---

# spending-alerts

## Overview
Il "coach che si accorge". Non è AI che indovina: sono **regole** che scattano su soglie, poi
l'agente le spiega con tono gentile e non giudicante.

## Regole (in `core/alerts.py`)
- **Delta mensile**: categoria +/- X% vs mese scorso (default 30%).
- **Peso sul reddito**: categoria oltre la sua quota di riferimento (es. Svago > 30%).
- **Ricorrenze**: stessi importi che si ripetono ogni mese → possibili abbonamenti.

## Output
Lista di alert `{tipo, categoria, valore, soglia, messaggio_base}`.
L'LLM trasforma `messaggio_base` in una frase empatica.

## Vincolo
Gli alert **descrivono**, non prescrivono. Niente "dovresti tagliare": solo "stai spendendo di più".

## Modello
Haiku per la formulazione; regole in codice.

> Stato: spec pronta — implementazione nella fase di sviluppo.
