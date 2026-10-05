"""Calcoli finanziari deterministici (logica di dominio pura, nessun I/O).

Questa e' l'UNICA sede dei calcoli dell'app: skill e frontend non ricalcolano
nulla, usano questi risultati. "La matematica non e' mai allucinata."
"""
from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field

from . import categories as cat


def euro(x: float) -> float:
    """Arrotonda a 2 decimali (centesimi)."""
    return round(float(x) + 0.0, 2)


def pct(part: float, whole: float, ndigits: int = 1) -> float:
    """Percentuale di `part` su `whole`. Se whole<=0 restituisce 0.0."""
    if not whole:
        return 0.0
    return round(part / whole * 100, ndigits)


@dataclass
class BudgetResult:
    income: float
    total_spent: float
    saved: float
    needs_total: float
    extra_total: float
    by_category: list[dict] = field(default_factory=list)


def budget_breakdown(income: float, expenses: list[dict]) -> BudgetResult:
    """Dato il reddito e una lista di spese {category, amount}, calcola totali,
    percentuali sul reddito, suddivisione necessario/extra e risparmio.

    Garanzia di coerenza: la somma delle categorie == total_spent.
    """
    by_category: list[dict] = []
    needs_total = 0.0
    extra_total = 0.0
    total_spent = 0.0

    for e in expenses:
        key = e["category"]
        amount = euro(e["amount"])
        total_spent += amount
        ctype = cat.category_type(key)
        if ctype == cat.NEED:
            needs_total += amount
        else:
            extra_total += amount
        by_category.append({
            "key": key,
            "label": cat.label(key),
            "icon": cat.icon(key),
            "type": ctype,
            "amount": amount,
            "pct_income": pct(amount, income),
        })

    total_spent = euro(total_spent)
    by_category.sort(key=lambda c: c["amount"], reverse=True)
    return BudgetResult(
        income=euro(income),
        total_spent=total_spent,
        saved=euro(income - total_spent),
        needs_total=euro(needs_total),
        extra_total=euro(extra_total),
        by_category=by_category,
    )


def rule_50_30_20(result: BudgetResult) -> dict:
    """Confronta la ripartizione reale con lo schema di riferimento 50/30/20
    (necessario / extra / risparmio). Non e' un giudizio: solo un confronto.
    """
    income = result.income
    return {
        "needs": {"pct": pct(result.needs_total, income), "target": 50},
        "extra": {"pct": pct(result.extra_total, income), "target": 30},
        "saved": {"pct": pct(result.saved, income), "target": 20},
    }


def month_over_month_delta(current: float, previous: float) -> dict:
    """Variazione di una spesa rispetto al mese precedente."""
    current, previous = euro(current), euro(previous)
    delta_abs = euro(current - previous)
    return {
        "current": current,
        "previous": previous,
        "delta_abs": delta_abs,
        "delta_pct": pct(delta_abs, previous) if previous else 0.0,
        "increased": delta_abs > 0,
    }


def detect_recurring(transactions: list[dict]) -> dict:
    """Individua addebiti ricorrenti: stessa descrizione+importo presenti in
    piu' mesi distinti. Utile per far emergere gli abbonamenti.

    transactions: lista di {desc, amount, month}.
    """
    seen: dict[tuple, set] = defaultdict(set)
    amount_of: dict[tuple, float] = {}
    for t in transactions:
        k = (t["desc"].strip().lower(), euro(t["amount"]))
        seen[k].add(t["month"])
        amount_of[k] = euro(t["amount"])

    items = [
        {"desc": desc, "amount": amount_of[(desc, amt)]}
        for (desc, amt), months in seen.items()
        if len(months) >= 2
    ]
    items.sort(key=lambda i: i["amount"], reverse=True)
    monthly_total = euro(sum(i["amount"] for i in items))
    return {
        "items": items,
        "count": len(items),
        "monthly_total": monthly_total,
        "annual_total": euro(monthly_total * 12),
    }
