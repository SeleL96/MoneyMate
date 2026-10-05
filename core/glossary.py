"""Glossario finanziario (single source of truth).

Usato sia dalla skill `jargon-explainer` sia dalla chat del frontend, cosi' la
spiegazione di un termine e' una sola, coerente ovunque. Nessun I/O.
"""
from __future__ import annotations

# chiave canonica -> {term, aliases, definizione, esempio}
GLOSSARY: dict[str, dict] = {
    "taeg": {
        "term": "TAEG",
        "aliases": ["taeg"],
        "definizione": "Il costo totale vero del prestito in un anno, commissioni incluse. E' il numero piu' importante per capire quanto paghi davvero.",
        "esempio": "Chiedi 1.000 € e a fine anno ne restituisci 1.048 € → TAEG ≈ 4,8%.",
    },
    "tan": {
        "term": "TAN",
        "aliases": ["tan"],
        "definizione": "Il tasso 'base' annuo, senza le spese extra. Da solo non dice quanto costa davvero il prestito: per quello guarda il TAEG.",
        "esempio": "TAN 3,10% indica solo gli interessi 'puri', senza commissioni e spese.",
    },
    "spread": {
        "term": "Spread",
        "aliases": ["spread"],
        "definizione": "La parte di guadagno fissa della banca, che si somma all'indice di mercato (Euribor).",
        "esempio": "Euribor 2% + spread 1,5% = tasso 3,5%.",
    },
    "euribor": {
        "term": "Euribor",
        "aliases": ["euribor"],
        "definizione": "Un indice di mercato che puo' salire o scendere nel tempo: e' la parte 'variabile' del tasso di un mutuo a tasso variabile.",
        "esempio": "Se l'Euribor sale, la tua rata a tasso variabile puo' aumentare.",
    },
    "rata": {
        "term": "Rata",
        "aliases": ["rata"],
        "definizione": "Quanto paghi ogni mese. Si compone di una parte di capitale (il prestito che restituisci) e una di interessi (il costo del prestito).",
        "esempio": "Rata 548 €/mese per 25 anni.",
    },
    "istruttoria": {
        "term": "Commissione di istruttoria",
        "aliases": ["istruttoria", "commissione istruttoria"],
        "definizione": "Una spesa una tantum per aprire e valutare la pratica del mutuo: la paghi una volta sola, all'inizio.",
        "esempio": "Commissione istruttoria 350 €, pagata solo alla stipula.",
    },
    "quota_fissa": {
        "term": "Quota fissa",
        "aliases": ["quota fissa"],
        "definizione": "La paghi sempre, anche se non consumi nulla: e' il costo di avere il contratto attivo.",
        "esempio": "Quota fissa 8,50 €/mese sulla bolletta della luce.",
    },
    "oneri": {
        "term": "Oneri di sistema",
        "aliases": ["oneri", "oneri di sistema"],
        "definizione": "Costi generali del sistema elettrico nazionale, uguali per tutti: non dipendono dal tuo fornitore.",
        "esempio": "Gli oneri di sistema compaiono in ogni bolletta elettrica.",
    },
    "iva": {
        "term": "IVA",
        "aliases": ["iva"],
        "definizione": "Un'imposta sui consumi. In bolletta si calcola anche sulle altre voci, quindi aumenta il totale.",
        "esempio": "IVA 10% o 22% applicata alle voci della bolletta.",
    },
    "accise": {
        "term": "Accise",
        "aliases": ["accise", "accisa"],
        "definizione": "Tasse sul consumo di energia, incassate dallo Stato.",
        "esempio": "Le accise crescono con i kWh consumati.",
    },
    "bollo": {
        "term": "Imposta di bollo",
        "aliases": ["bollo", "imposta di bollo"],
        "definizione": "Una tassa dello Stato sul conto, dovuta se la giacenza media supera 5.000 €.",
        "esempio": "Imposta di bollo 34,20 € l'anno sul conto corrente.",
    },
    "canone": {
        "term": "Canone",
        "aliases": ["canone"],
        "definizione": "Il costo fisso per tenere aperto il conto, a prescindere da quanto lo usi.",
        "esempio": "Canone 2,00 €/mese = 24 € l'anno.",
    },
    "bonifico": {
        "term": "Commissione bonifico",
        "aliases": ["bonifico"],
        "definizione": "Il costo per ogni bonifico inviato. Spesso online e' gratuito, allo sportello si paga.",
        "esempio": "Bonifico allo sportello 1,00 € a operazione.",
    },
    "prelievo": {
        "term": "Commissione di prelievo",
        "aliases": ["prelievo", "atm"],
        "definizione": "Si paga prelevando da sportelli di altre banche. Dai bancomat della tua banca di solito e' gratis.",
        "esempio": "Prelievo ATM altra banca 2,50 €.",
    },
}


def lookup(text: str) -> dict | None:
    """Cerca nel testo un termine del glossario (match per alias)."""
    t = text.lower()
    for entry in GLOSSARY.values():
        if any(alias in t for alias in entry["aliases"]):
            return entry
    return None
