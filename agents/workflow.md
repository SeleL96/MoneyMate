# Workflow agentico

## Il loop (Observe → Plan → Execute → Verify)

1. **Observe** — l'orchestratore legge lo stato: dati di budget dell'utente, documento caricato,
   profilo di alfabetizzazione (semplice/medio).
2. **Plan** — decide quale skill serve e con quale modello.
3. **Execute** — invoca la skill; lo script chiama `core/` e restituisce numeri + metadati.
4. **Verify** — controlla che i numeri siano coerenti (es. le categorie sommano al totale),
   poi genera la spiegazione in linguaggio semplice. Se incoerente, ripete.

## Esempi di flusso

### A) "Dove sono finiti i soldi questo mese?"
```
UserPromptSubmit → [hook compliance: ok, non è un consiglio]
Observe: budget del mese
Plan: budget-analyzer + spending-alerts (Haiku per gli alert)
Execute: core.budget_breakdown() + core.month_over_month_delta()
Verify: somma categorie == totale speso
Output: grafico + "Ristoranti è a 180€, +45% vs mese scorso" (spiegazione Sonnet)
```

### B) "Cosa significa questa riga del mutuo?"
```
Plan: document-decoder → SUBAGENT isolato (parsing del PDF lungo in contesto pulito)
Execute: subagent estrae le voci → jargon-explainer spiega TAN/TAEG/spread con esempio
Verify: i valori citati coincidono con quelli del documento
Output: before/after per ogni voce
```

### C) "Mi conviene firmare questo mutuo?"  ← richiesta vietata
```
UserPromptSubmit → [hook compliance: RILEVATO consiglio]
→ inietta guardrail → l'agente NON valuta la convenienza
Output: "Non posso dirti se conviene, ma ti spiego cosa incide sulla rata così decidi tu…"
```

## Efficienza dei token
- **Progressive disclosure**: la metadata delle skill è leggera; glossari e reference si
  caricano solo quando servono.
- **Subagent**: i documenti lunghi vengono processati in un contesto separato e tornano
  solo con il risultato sintetico → l'orchestratore resta pulito (anti context-rot).
- **Haiku** per i task ripetitivi riduce il costo per token.
