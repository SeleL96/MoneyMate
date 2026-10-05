"""MoneyMate — server locale.

Serve la dashboard (app/) e offre l'endpoint /api/chat.
- Se e' impostata la variabile d'ambiente ANTHROPIC_API_KEY, /api/chat risponde con
  Claude (API Messages), usando il system prompt di MoneyMate + il contesto del budget.
- Altrimenti (o in caso di errore) risponde {"mode":"fallback"} e il frontend usa il
  proprio motore a regole offline. Cosi' l'app funziona SEMPRE, con o senza key.

Nessuna dipendenza esterna (solo standard library). Avvio:
    python server/server.py            # porta 8000
    ANTHROPIC_API_KEY=sk-... python server/server.py   # con Claude reale
Variabili: ANTHROPIC_API_KEY (o ANTHROPIC_AUTH_TOKEN), ANTHROPIC_MODEL, PORT.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
import urllib.error
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_DIR = str(ROOT / "app")
PORT = int(os.environ.get("PORT", "8000"))
API_KEY = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN")
MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-opus-5-5")

SYSTEM_BASE = (
    "Sei MoneyMate, un assistente di EDUCAZIONE FINANZIARIA DI BASE (non un consulente), "
    "per persone con poca o nessuna alfabetizzazione finanziaria.\n"
    "MISSIONE: aiutare l'utente a CAPIRE le proprie finanze quotidiane (budget e documenti "
    "come bolletta, estratto conto, mutuo). SPIEGHI, NON CONSIGLI.\n"
    "REGOLE NON NEGOZIABILI:\n"
    "1) MAI consigli: non dire cosa comprare, vendere, scegliere, ne' se qualcosa 'conviene' "
    "o se firmare. Se te lo chiedono, spiega i concetti e i numeri rilevanti e chiarisci che "
    "la decisione spetta all'utente.\n"
    "2) MAI inventare numeri: usa solo i numeri presenti nel CONTESTO o nel messaggio; se un "
    "dato non c'e', dillo.\n"
    "3) Linguaggio SEMPLICE: frasi brevi, niente gergo non spiegato, esempi concreti.\n"
    "4) Tono gentile e non giudicante. Rispondi in italiano.\n"
    "Puoi spiegare l'impatto educativo di un costo sul budget (es. quanto pesa una rata), "
    "mostrando i numeri, senza dire se convenga."
)


def build_system(context: dict) -> str:
    parts = [SYSTEM_BASE]
    if context:
        b = context.get("budget")
        if b:
            parts.append(
                "\nCONTESTO BUDGET (numeri gia' calcolati, usali cosi' come sono):\n"
                f"- Entrate mensili: {b.get('income')} EUR\n"
                f"- Spese totali: {b.get('spent')} EUR\n"
                f"- Rimasto: {b.get('saved')} EUR\n"
                f"- Ripartizione categorie: {b.get('categories')}"
            )
        gl = context.get("glossary_terms")
        if gl:
            parts.append("\nTERMINI NOTI (glossario): " + ", ".join(gl))
        doc = context.get("document")
        if doc:
            parts.append("\nDOCUMENTO CARICATO DALL'UTENTE (testo):\n" + doc[:4000])
    return "\n".join(parts)


def call_claude(messages: list, context: dict) -> str:
    payload = {
        "model": MODEL,
        "max_tokens": 2048,
        "system": build_system(context),
        "messages": messages,
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    return "".join(
        blk.get("text", "") for blk in data.get("content", []) if blk.get("type") == "text"
    ).strip()


def sanitize_messages(raw: list) -> list:
    """Tiene solo user/assistant con testo; assicura che inizi con 'user'."""
    out = []
    for m in raw or []:
        role = m.get("role")
        content = (m.get("content") or "").strip()
        if role in ("user", "assistant") and content:
            out.append({"role": role, "content": content})
    while out and out[0]["role"] != "user":
        out.pop(0)
    return out[-20:]  # limita la storia


class Handler(SimpleHTTPRequestHandler):
    def _json(self, code: int, obj: dict):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):  # noqa: N802
        if self.path.rstrip("/") != "/api/chat":
            self.send_error(404); return
        try:
            n = int(self.headers.get("Content-Length", "0"))
            req = json.loads(self.rfile.read(n) or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._json(400, {"error": "bad request"}); return

        if not API_KEY:
            self._json(200, {"mode": "fallback"}); return
        messages = sanitize_messages(req.get("messages"))
        if not messages:
            self._json(200, {"mode": "fallback"}); return
        try:
            reply = call_claude(messages, req.get("context") or {})
            self._json(200, {"mode": "llm", "reply": reply})
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError, ValueError) as e:
            # Degrada con grazia: il frontend usera' il motore locale
            self._json(200, {"mode": "fallback", "error": str(e)})

    def log_message(self, *args):  # silenzia il log di default
        pass


def main():
    handler = partial(Handler, directory=APP_DIR)
    httpd = ThreadingHTTPServer(("", PORT), handler)
    mode = "Claude reale (" + MODEL + ")" if API_KEY else "fallback locale (nessuna API key)"
    print(f"MoneyMate su http://localhost:{PORT}  —  chat: {mode}")
    print("Premi Ctrl-C per fermare.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer fermato.")
        httpd.shutdown()


if __name__ == "__main__":
    sys.exit(main())
