"""Insieme chiuso delle categorie di spesa (single source of truth).

Logica di dominio pura: nessun I/O. Serve a classificare le spese in
'necessario' / 'extra' in modo coerente in tutta l'app e in tutte le skill.
"""
from __future__ import annotations

NEED = "need"
EXTRA = "extra"

# chiave -> (etichetta leggibile, nome icona outline, tipo)
CATEGORIES: dict[str, dict] = {
    "casa":        {"label": "Casa e bollette",    "icon": "home",    "type": NEED},
    "alimentari":  {"label": "Spesa alimentare",   "icon": "cart",    "type": NEED},
    "trasporti":   {"label": "Trasporti",          "icon": "bus",     "type": NEED},
    "salute":      {"label": "Salute",             "icon": "health",  "type": NEED},
    "ristoranti":  {"label": "Ristoranti e bar",   "icon": "food",    "type": EXTRA},
    "svago":       {"label": "Abbonamenti e svago","icon": "film",    "type": EXTRA},
    "altro":       {"label": "Altro",              "icon": "receipt", "type": EXTRA},
}


def category_type(key: str) -> str:
    """Restituisce 'need' o 'extra' per una categoria; default 'extra'."""
    return CATEGORIES.get(key, {}).get("type", EXTRA)


def label(key: str) -> str:
    return CATEGORIES.get(key, {}).get("label", key.capitalize())


def icon(key: str) -> str:
    return CATEGORIES.get(key, {}).get("icon", "receipt")
