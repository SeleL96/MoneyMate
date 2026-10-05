# MoneyMate — Dashboard di Finanza Personale

> Un cruscotto che **spiega** le tue finanze quotidiane in parole semplici, senza mai dare consigli.
> Pensato per chi parte da zero di educazione finanziaria.

**Hackathon Hagenthon · Accenture Application Engineering — Tema 02: Inclusione Finanziaria**

---

## Il problema (chi aiutiamo)

**Giulia, 34 anni, lavoratrice part-time, nessuna educazione finanziaria.**
Si blocca in due momenti:

1. **A fine mese** → non capisce dove siano finiti i soldi.
2. **Davanti ai documenti** → estratto conto, bolletta e proposta di mutuo pieni di sigle
   (TAN, TAEG, spread, canone, "commissione gestione") che non capisce.

## Cosa fa MoneyMate

- 📊 **Budget mensile**: visualizza entrate e spese per categoria, ti dice **dove puoi risparmiare**.
- 🔔 **Alert proattivi**: ti avvisa quando una categoria cresce o pesa troppo sul reddito.
- 📄 **Decodifica documenti**: traduce estratto conto, bolletta e mutuo in parole semplici,
  evidenziando costi e commissioni.
- 💬 **"Spiega questo numero"**: ogni cifra è cliccabile e spiegata passo-passo.

## Come si usa (app)

1. **Login** (dimostrativo: qualsiasi nome utente, la password non viene verificata).
2. Alla prima apertura la dashboard chiede di **impostare il budget** (entrate mensili) —
   oppure "Prova con dati di esempio".
3. **Le mie spese**: inserisci e monitori le spese per categoria; totali e grafici si
   aggiornano in tempo reale.
4. **Capire i documenti**: chat per chiedere il significato di sigle e voci (con guardrail
   anti-consigli). I dati restano nel tuo browser (localStorage).

## Principio di design chiave

> **La matematica non è mai allucinata.**
> I calcoli li fa codice deterministico (le *skill*); l'agente AI si limita a **spiegare**.
> Un *hook* di compliance impedisce, per costruzione, qualsiasi consiglio finanziario
> (vincolo del tema: vietato raccomandare cosa comprare/vendere/scegliere).

## Struttura del repository

```
/
├── app/                # La dashboard web (SPA): index.html, styles.css, app.js,
│                       #   calc.js (specchio di core/), data.js (generato), assets/logo.svg
├── core/               # Motore deterministico: calcoli puri, NIENTE I/O (single source)
│   ├── finance_math.py #   budget, %, delta mese, ricorrenze
│   ├── categories.py   #   categorie (necessario/extra)
│   ├── glossary.py     #   glossario termini (usato anche dalla chat)
│   └── demo/giulia.py  #   dati di esempio
├── agents/             # Struttura agentica: skills (con scripts), subagent, comandi, hook, workflow
├── scripts/            # build_app_data.py → esegue core/ e genera app/data.js
├── tests/              # test del motore (pytest)
├── presentation/       # Presentazione HTML (brand Accenture)
├── .claude/            # Harness Claude Code (settings + hook runnabili)
├── CLAUDE.md           # Memoria e regole di progetto
└── README.md
```

## Come eseguire

```bash
# 1) Genera i dati della dashboard eseguendo il motore deterministico
python scripts/build_app_data.py

# 2) Esegui i test del motore (i numeri devono essere esatti)
python -m pytest tests/ -q

# 3) Avvia la dashboard (serve l'app + chat) e apri http://localhost:8000
python server/server.py
```

### Chat: Claude reale (facoltativo)
La chat "Capire i documenti" funziona **offline** con un motore a regole. Per farla diventare
una **vera conversazione con Claude**, imposta una API key prima di avviare il server:

```bash
set ANTHROPIC_API_KEY=sk-ant-...     # Windows (PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-...")
python server/server.py
```

Opzionale: `ANTHROPIC_MODEL` (default `claude-opus-5-5`; per una chat più rapida/economica
`claude-haiku-4-5`). Senza key, la chat ripiega automaticamente sul motore locale.

Provare una skill in isolamento:

```bash
python agents/skills/budget-analyzer/scripts/run.py
python agents/skills/spending-alerts/scripts/run.py
python agents/skills/jargon-explainer/scripts/run.py "TAEG"
```

## Deliverable del tema (dove trovarli)

| Deliverable | Dove |
|---|---|
| **User Difficulty Statement** | `presentation/` + questo README |
| **Before / After Simplicity Evidence** | demo in `app/` (decodifica documenti + quiz) |
| **Risk & Clarity Note** | `agents/README.md` (sezione guardrail) |

---

🤖 Sviluppato con [Claude Code](https://claude.com/claude-code)
