"""Skill jargon-explainer — spiega un termine finanziario dal glossario core.

Uso:  python agents/skills/jargon-explainer/scripts/run.py "TAEG"
Il glossario e' in core/glossary.py (single source, usato anche dalla chat).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT))
sys.stdout.reconfigure(encoding="utf-8")  # glossario contiene simboli non-ASCII (→, €)

from core.glossary import lookup, GLOSSARY   # noqa: E402

query = " ".join(sys.argv[1:]).strip() or "TAEG"
entry = lookup(query)

if entry:
    print(json.dumps({
        "term": entry["term"],
        "definizione": entry["definizione"],
        "esempio": entry["esempio"],
    }, ensure_ascii=False, indent=2))
else:
    disponibili = sorted(e["term"] for e in GLOSSARY.values())
    print(json.dumps({"errore": f"Termine '{query}' non nel glossario",
                      "disponibili": disponibili}, ensure_ascii=False, indent=2))
