# Bussola — Dashboard di Finanza Personale

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

## Cosa fa Bussola

- 📊 **Budget mensile**: visualizza entrate e spese per categoria, ti dice **dove puoi risparmiare**.
- 🔔 **Alert proattivi**: ti avvisa quando una categoria cresce o pesa troppo sul reddito.
- 📄 **Decodifica documenti**: traduce estratto conto, bolletta e mutuo in parole semplici,
  evidenziando costi e commissioni.
- 💬 **"Spiega questo numero"**: ogni cifra è cliccabile e spiegata passo-passo.

## Principio di design chiave

> **La matematica non è mai allucinata.**
> I calcoli li fa codice deterministico (le *skill*); l'agente AI si limita a **spiegare**.
> Un *hook* di compliance impedisce, per costruzione, qualsiasi consiglio finanziario
> (vincolo del tema: vietato raccomandare cosa comprare/vendere/scegliere).

## Struttura del repository

```
/
├── app/            # La dashboard (prototipo + sviluppo)
├── agents/         # La struttura agentica: skills, subagent, comandi, hook, workflow
├── presentation/   # Presentazione HTML (brand Accenture)
├── .claude/        # Configurazione harness Claude Code (settings, hook runnabili)
├── CLAUDE.md       # Memoria e regole di progetto
└── README.md
```

## Deliverable del tema (dove trovarli)

| Deliverable | Dove |
|---|---|
| **User Difficulty Statement** | `presentation/` + questo README |
| **Before / After Simplicity Evidence** | demo in `app/` (decodifica documenti + quiz) |
| **Risk & Clarity Note** | `agents/README.md` (sezione guardrail) |

---

🤖 Sviluppato con [Claude Code](https://claude.com/claude-code)
