"""Skill spending-alerts — regole deterministiche sugli alert di budget.

Le soglie e i calcoli vivono in `core/`; qui si applicano ai dati e si emette
l'elenco degli alert in JSON. L'LLM li trasforma in frasi empatiche.
Uso:  python agents/skills/spending-alerts/scripts/run.py
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT))
sys.stdout.reconfigure(encoding="utf-8")

from core import finance_math as fm        # noqa: E402
from core.demo import giulia as data       # noqa: E402

delta = fm.month_over_month_delta(180.0, data.PREVIOUS["ristoranti"])
recurring = fm.detect_recurring(data.TRANSACTIONS)

alerts = []
if delta["increased"] and delta["delta_pct"] >= 30:
    alerts.append({
        "type": "spesa_in_aumento", "categoria": "ristoranti",
        "delta_pct": delta["delta_pct"], "current": delta["current"], "previous": delta["previous"],
    })
if recurring["count"] >= 1:
    alerts.append({
        "type": "addebiti_ricorrenti", "count": recurring["count"],
        "monthly_total": recurring["monthly_total"], "annual_total": recurring["annual_total"],
        "items": recurring["items"],
    })

print(json.dumps({"alerts": alerts}, ensure_ascii=False, indent=2))
