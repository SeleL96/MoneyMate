#!/usr/bin/env python3
"""
compliance_guard.py — Hook UserPromptSubmit per Bussola.

Vincolo del Tema 02: VIETATO fornire raccomandazioni di investimento, consulenza
finanziaria personalizzata o indicazioni su cosa comprare/vendere/scegliere.

Questo hook e' DETERMINISTICO (non AI): intercetta la richiesta dell'utente prima
che l'agente lavori. Se rileva una richiesta di consiglio finanziario, inietta un
promemoria vincolante nel contesto, cosi' l'agente risponde con EDUCAZIONE anziche'
con un consiglio. "Hooks turn vibes into rules."

I/O (contratto Claude Code):
- stdin  : JSON con almeno { "prompt": "<testo utente>" }
- stdout : eventuale testo iniettato come contesto aggiuntivo
- exit 0 : prosegui (con o senza contesto iniettato)
"""
import sys
import json
import re

# Pattern di richieste di consiglio (intento "cosa devo fare col MIO denaro").
ADVICE_PATTERNS = [
    r"\bdevo (comprare|vendere|investire|firmare|scegliere|aprire|chiudere)\b",
    r"\bmi conviene\b",
    r"\b(e'|è) (un buon|una buona|conveniente|vantaggioso)\b",
    r"\bcosa (mi )?(conviene|consigli|consiglieresti)\b",
    r"\bquale (mutuo|conto|carta|fondo|azione|titolo|prestito|polizza) (scelgo|prendo|compro)\b",
    r"\bquanto dovrei (investire|risparmiare|spendere)\b",
    r"\b(dammi|voglio) un consiglio (finanziario|d'?investimento)\b",
]

GUARD_MESSAGE = (
    "[GUARDRAIL COMPLIANCE — Bussola]\n"
    "La richiesta dell'utente sembra chiedere un CONSIGLIO finanziario personalizzato "
    "(cosa comprare/vendere/scegliere o se qualcosa 'conviene').\n"
    "REGOLA NON NEGOZIABILE: non fornire raccomandazioni ne' valutazioni di convenienza.\n"
    "Rispondi invece EDUCANDO: spiega i concetti e i numeri rilevanti in parole semplici, "
    "mostra come leggerli, e chiarisci che la decisione spetta all'utente. "
    "Esempio: non 'questo mutuo conviene', ma 'ecco cosa significano TAN/TAEG/spread e "
    "come incidono sulla tua rata, cosi' puoi valutare tu'."
)


def main() -> int:
    raw = sys.stdin.read() if not sys.stdin.isatty() else ""
    prompt = ""
    if raw.strip():
        try:
            prompt = (json.loads(raw).get("prompt") or "")
        except json.JSONDecodeError:
            prompt = raw  # fallback: tratta lo stdin come testo grezzo
    text = prompt.lower()

    if any(re.search(p, text) for p in ADVICE_PATTERNS):
        # Inietta il promemoria nel contesto dell'agente (stdout) e prosegui.
        print(GUARD_MESSAGE)
    return 0


if __name__ == "__main__":
    sys.exit(main())
