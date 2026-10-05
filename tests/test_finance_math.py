"""Test del motore deterministico core/. Garantiscono che i numeri siano esatti."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import finance_math as fm  # noqa: E402
from core.demo import giulia as data  # noqa: E402


def test_pct_zero_whole():
    assert fm.pct(10, 0) == 0.0


def test_pct_basic():
    assert fm.pct(180, 1450) == 12.4


def test_budget_sum_equals_total():
    b = fm.budget_breakdown(data.INCOME, data.EXPENSES)
    assert b.total_spent == 1390.0
    assert round(sum(c["amount"] for c in b.by_category), 2) == b.total_spent


def test_budget_saved():
    b = fm.budget_breakdown(data.INCOME, data.EXPENSES)
    assert b.saved == 60.0


def test_needs_and_extra_split():
    b = fm.budget_breakdown(data.INCOME, data.EXPENSES)
    # necessario: casa 620 + alimentari 280 + trasporti 90 + salute 35 = 1025
    assert b.needs_total == 1025.0
    # extra: ristoranti 180 + svago 145 + altro 40 = 365
    assert b.extra_total == 365.0


def test_rule_50_30_20():
    b = fm.budget_breakdown(data.INCOME, data.EXPENSES)
    r = fm.rule_50_30_20(b)
    assert r["needs"]["pct"] == 70.7
    assert r["extra"]["pct"] == 25.2
    assert r["saved"]["pct"] == 4.1


def test_month_over_month_delta():
    d = fm.month_over_month_delta(180, 124)
    assert d["delta_abs"] == 56.0
    assert d["delta_pct"] == 45.2
    assert d["increased"] is True


def test_detect_recurring():
    rec = fm.detect_recurring(data.TRANSACTIONS)
    assert rec["count"] == 3
    assert rec["monthly_total"] == 27.97
    assert rec["annual_total"] == 335.64
