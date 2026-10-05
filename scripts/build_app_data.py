"""Genera app/data.js eseguendo il motore `core/` sui dati di esempio.

Clean architecture: la logica di calcolo vive SOLO in core/. Questo script la
esegue una volta e scrive i risultati; il frontend si limita a mostrarli.
Esegui:  python scripts/build_app_data.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import finance_math as fm            # noqa: E402
from core.categories import CATEGORIES         # noqa: E402
from core.glossary import GLOSSARY             # noqa: E402
from core.demo import giulia as data           # noqa: E402


def fmt_eur(x: float) -> str:
    """Formatta un importo in stile italiano: 1.450 ; 335,64 ; 27,97."""
    s = f"{x:,.2f}"                     # 1,450.00  (stile US)
    s = s.replace(",", "§").replace(".", ",").replace("§", ".")
    return s[:-3] if s.endswith(",00") else s


def fmt_pct(x: float) -> str:
    """Percentuale in stile italiano, senza zeri finali inutili: 45.2 -> 45,2."""
    return (f"{x:g}").replace(".", ",")


def build() -> dict:
    budget = fm.budget_breakdown(data.INCOME, data.EXPENSES)
    rule = fm.rule_50_30_20(budget)

    # Alert 1: variazione 'ristoranti' mese su mese
    rist = next(c for c in budget.by_category if c["key"] == "ristoranti")
    delta = fm.month_over_month_delta(rist["amount"], data.PREVIOUS["ristoranti"])

    # Alert 2: addebiti ricorrenti (abbonamenti)
    rec = fm.detect_recurring(data.TRANSACTIONS)

    alerts = [
        {
            "level": "warn", "icon": "trending", "title": "Spesa in aumento",
            "message": (
                f"<strong>Ristoranti e bar</strong> è a <strong>{fmt_eur(delta['current'])} €</strong>: "
                f"<strong>+{fmt_pct(delta['delta_pct'])}%</strong> rispetto ai "
                f"{fmt_eur(delta['previous'])} € del mese scorso."
            ),
        },
        {
            "level": "info", "icon": "repeat", "title": "Addebiti che si ripetono",
            "message": (
                f"<strong>{rec['count']} pagamenti uguali ogni mese</strong> ("
                + " + ".join(fmt_eur(i["amount"]) for i in rec["items"])
                + f" €): possibili abbonamenti. In un anno: <strong>{fmt_eur(rec['annual_total'])} €</strong>."
            ),
        },
    ]

    glossary = [
        {"term": e["term"], "aliases": e["aliases"],
         "definizione": e["definizione"], "esempio": e["esempio"]}
        for e in GLOSSARY.values()
    ]

    # Catalogo categorie (single source) per i form di inserimento spese
    catalog = [
        {"key": k, "label": v["label"], "icon": v["icon"], "type": v["type"]}
        for k, v in CATEGORIES.items()
    ]

    # Seed dimostrativo: l'utente puo' caricarlo per vedere la dashboard popolata
    demo_seed = {
        "month": data.MONTH,
        "income": data.INCOME,
        "expenses": [dict(e) for e in data.EXPENSES],
    }

    return {
        "brand": {"name": "MoneyMate", "slogan": "Ogni spesa ha senso con MoneyMate"},
        "categories": catalog,
        "glossary": glossary,
        "demo_seed": demo_seed,
        # anteprima precalcolata (riferimento/QA): non usata a runtime dall'app
        "_preview": {
            "summary": {"income": budget.income, "spent": budget.total_spent, "saved": budget.saved},
            "rule": rule,
            "alerts": alerts,
        },
    }


def main() -> None:
    payload = build()
    out = ROOT / "app" / "data.js"
    out.write_text(
        "// GENERATO da scripts/build_app_data.py — non modificare a mano.\n"
        "// I numeri provengono dal motore deterministico core/.\n"
        "window.MM_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Scritto {out} ({out.stat().st_size} byte)")


if __name__ == "__main__":
    main()
