# Struttura agentica di MoneyMate

Questa cartella documenta **come MoneyMate usa Claude in modo agentico**, seguendo le best
practice ufficiali: skill con *progressive disclosure*, subagent a contesto isolato, hook
deterministici come guardrail, routing dei modelli per efficienza di token.

```
agents/
├── README.md        # questo file: l'architettura
├── workflow.md      # il loop agentico e il routing dei modelli
├── skills/          # le capability (HOW) — calcoli deterministici + spiegazione
├── subagents/       # agenti specializzati a contesto isolato (WHO)
├── commands/        # slash command riutilizzabili
├── hooks/           # guardrail deterministici (compliance)
└── prompts/         # prompt di sistema dell'orchestratore
```

> **Nota harness:** le versioni *runnabili* vivono sotto `.claude/` (ciò che Claude Code
> legge: `settings.json`, `hooks/`). Questa cartella è la vista di consegna dell'architettura.

---

## Principio architetturale: separare CALCOLO e SPIEGAZIONE

```
Utente ──> Orchestratore (Sonnet) ── loop: Observe → Plan → Execute → Verify
                │
                │  1. sceglie la skill giusta (progressive disclosure: carica solo quella)
                ├──> SKILL ──> script Python ──> core/ (logica pura, calcolo deterministico)
                │                                   └─ i NUMERI escono da qui, mai dall'LLM
                │  2. l'LLM riceve i numeri e li SPIEGA in parole semplici
                │
                ├──> SUBAGENT isolato per parsing documenti lunghi (contesto pulito)
                │
                └──> HOOK compliance intercetta ogni richiesta di consiglio → la blocca
```

- **`core/` = unica fonte della logica di calcolo** (clean architecture, zero duplicazioni).
- **Le skill non calcolano a mano**: importano `core/` e formattano. Fine.
- **L'LLM non inventa numeri**: riceve risultati già calcolati e produce solo linguaggio.

## Le skill (vedi `skills/` per i dettagli)

| Skill | Capability | Modello |
|---|---|---|
| `budget-analyzer` | entrate+spese → %, surplus/deficit, confronto 50/30/20 | Sonnet |
| `expense-categorizer` | classifica transazioni grezze, traduce il gergo bancario | Haiku |
| `spending-alerts` | regole deterministiche → alert "stai spendendo di più su X" | Haiku |
| `document-decoder` | estratto conto / bolletta / mutuo → parole semplici, costi evidenziati | Haiku→Sonnet |
| `jargon-explainer` | TAN, TAEG, spread, rata… spiegati con esempio numerico | Sonnet |
| `comprehension-check` | quiz pre/post → misura il miglioramento (deliverable) | Haiku |

## Routing dei modelli (efficienza)
Regola della PPT: *parti da Sonnet, Haiku quando contano volume e velocità*.
- **Haiku**: categorizzazione, alert, quiz (task ben definiti, ad alto volume).
- **Sonnet**: orchestrazione e spiegazioni (ragionamento + scrittura).

---

## Risk & Clarity Note (Deliverable 03)

- **Cosa semplifichiamo**: il *linguaggio* e le *sigle*. Niente di più.
- **Cosa NON alteriamo**: i **numeri**. Sono calcolati da `core/` e mostrati esatti; l'LLM non li tocca.
- **Come evitiamo consigli e ambiguità**: l'hook `compliance-guard` (deterministico, non AI)
  intercetta richieste tipo *"mi conviene questo mutuo?"* e reindirizza alla spiegazione dei
  concetti. Il sistema **non può** dare un consiglio finanziario: è impedito per costruzione.
