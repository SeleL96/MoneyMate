# Hook: compliance-guard

**Tipo:** `UserPromptSubmit` · **Natura:** deterministico (non AI) · **Runnable:** `.claude/hooks/compliance_guard.py`

## Scopo
Far rispettare il vincolo del Tema 02: **vietato dare consigli finanziari, raccomandazioni di
investimento o indicazioni su cosa comprare/vendere/scegliere**.

## Come funziona
1. Intercetta il prompt dell'utente prima che l'agente lavori.
2. Confronta il testo con pattern di "richiesta di consiglio"
   (es. *"mi conviene…"*, *"devo comprare/vendere/firmare…"*, *"quale scelgo…"*).
3. Se rileva un intento di consiglio, **inietta un promemoria vincolante** nel contesto:
   l'agente risponde educando (spiega concetti e numeri) invece di consigliare.

## Perché è importante per la demo
Trasforma un vincolo del tema in una **feature architetturale**: MoneyMate *non può* violare la
regola, perché il guardrail è deterministico e indipendente dall'LLM.
*"Hooks turn vibes into rules."*

## Test rapido
Input: "Mi conviene questo mutuo?" → l'hook scatta → l'agente spiega TAN/TAEG/rata e chiarisce
che la decisione spetta all'utente, senza giudicare la convenienza.
