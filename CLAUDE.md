# Bussola — Memoria di progetto

## Snapshot
Dashboard di **educazione finanziaria** (non consulenza) per utenti con bassa alfabetizzazione
finanziaria. Tema 02 Hagenthon. Due funzioni: **budget mensile con alert** e **decodifica documenti**
(estratto conto / bolletta / mutuo).

## Stack
- `app/` : frontend accessibile (HTML/CSS/JS vanilla nel prototipo; da valutare React in sviluppo).
- `agents/` : struttura agentica (skills in Markdown + script Python per i calcoli deterministici).
- Modelli: **Haiku** per classificazione/estrazione, **Sonnet** come orchestratore/spiegazione.

## Architettura (clean architecture)
- **`core/` = logica di dominio pura, NIENTE I/O.** Tutti i calcoli finanziari vivono qui una sola
  volta (budget, %, delta mese su mese, scomposizione rata/ammortamento). Zero duplicazioni.
- Le **skill** sono wrapper sottili che importano `core/` e formattano l'output.
- Le **spiegazioni** in linguaggio naturale sono l'unico compito dell'LLM.

## Regole NON negoziabili (vincoli del tema)
- ❌ **Mai consigli finanziari**: vietato dire cosa comprare, vendere, scegliere, o se un mutuo
  "conviene". L'hook `compliance-guard` blocca queste richieste e reindirizza all'educazione.
- ❌ **Mai alterare i numeri**: le cifre mostrate all'utente sono quelle esatte calcolate da `core/`,
  mai inventate o arrotondate dall'LLM.
- ✅ **Semplificare senza tradire**: il significato delle informazioni originali non cambia.
- ✅ **Accessibilità prima di tutto**: alto contrasto, testo grande, linguaggio semplice, WCAG.

## Efficienza token (context engineering)
- Skill con **progressive disclosure**: metadati leggeri sempre, dettagli/glossari on-demand.
- **Subagent isolati** per il parsing di documenti lunghi → non inquinano il contesto principale.
- Haiku per i task ad alto volume; glossario cacheable.

## Don't
- Non mettere logica di calcolo nelle skill o nel frontend: va in `core/`.
- Non far generare numeri all'LLM.
- Non usare gergo finanziario nell'interfaccia senza spiegarlo.
