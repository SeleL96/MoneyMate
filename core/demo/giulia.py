"""Dati di esempio (persona: Giulia). Solo dati, nessuna logica.

In produzione questi dati arriverebbero dalla banca / inserimento utente.
Qui servono a far girare il motore e a popolare la demo.
"""

MONTH = "Ottobre 2026"
INCOME = 1450.0

# Spese del mese corrente, per categoria (chiavi da core.categories)
EXPENSES = [
    {"category": "casa",       "amount": 620.0},
    {"category": "alimentari", "amount": 280.0},
    {"category": "ristoranti", "amount": 180.0},
    {"category": "svago",      "amount": 145.0},
    {"category": "trasporti",  "amount": 90.0},
    {"category": "salute",     "amount": 35.0},
    {"category": "altro",      "amount": 40.0},
]

# Spesa 'ristoranti' del mese precedente, per il confronto mese-su-mese
PREVIOUS = {"ristoranti": 124.0}

# Movimenti con mese, per rilevare addebiti ricorrenti (abbonamenti)
TRANSACTIONS = [
    {"desc": "Streaming TV", "amount": 12.99, "month": "2026-09"},
    {"desc": "Streaming TV", "amount": 12.99, "month": "2026-10"},
    {"desc": "Palestra",     "amount": 9.99,  "month": "2026-09"},
    {"desc": "Palestra",     "amount": 9.99,  "month": "2026-10"},
    {"desc": "Musica",       "amount": 4.99,  "month": "2026-09"},
    {"desc": "Musica",       "amount": 4.99,  "month": "2026-10"},
    {"desc": "Supermercato", "amount": 42.10, "month": "2026-10"},
]
