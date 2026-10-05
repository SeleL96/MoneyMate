"""Skill budget-analyzer — esecuzione deterministica.

Importa il motore `core/` (nessun calcolo qui), produce il risultato in JSON.
L'LLM poi SPIEGA questo risultato in linguaggio semplice.
Uso:  python agents/skills/budget-analyzer/scripts/run.py
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT))
sys.stdout.reconfigure(encoding="utf-8")

from core import finance_math as fm        # noqa: E402
from core.demo import giulia as data       # noqa: E402

b = fm.budget_breakdown(data.INCOME, data.EXPENSES)
out = {
    "income": b.income,
    "total_spent": b.total_spent,
    "saved": b.saved,
    "needs_total": b.needs_total,
    "extra_total": b.extra_total,
    "rule_50_30_20": fm.rule_50_30_20(b),
    "by_category": b.by_category,
}
print(json.dumps(out, ensure_ascii=False, indent=2))
