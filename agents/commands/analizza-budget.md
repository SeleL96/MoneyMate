---
description: Analizza il budget del mese e segnala dove si sta spendendo di più
---

Analizza il budget mensile dell'utente usando le skill `budget-analyzer` e `spending-alerts`.

Passi:
1. Carica i dati di budget di $ARGUMENTS (o del mese corrente se non specificato).
2. Esegui `budget-analyzer` → quadro entrate/spese/risparmio.
3. Esegui `spending-alerts` → segnala le categorie in aumento o sopra soglia.
4. Spiega i risultati in linguaggio semplice, senza dare consigli su cosa tagliare.

Ricorda: mostra i numeri esatti calcolati da `core/`, non stimarli.
