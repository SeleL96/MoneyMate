@echo off
rem ============================================================
rem  MoneyMate - launcher
rem  Doppio clic per aprire la dashboard nel browser.
rem  Avvia il server locale (con endpoint chat) e apre http://localhost:8000
rem
rem  CHAT CON CLAUDE REALE (facoltativo): imposta la tua API key prima di avviare, es.
rem    set ANTHROPIC_API_KEY=sk-ant-...
rem  Senza key la chat funziona comunque in modalita' offline (motore locale).
rem ============================================================
title Avvia MoneyMate
cd /d "%~dp0"

rem Avvia il server in una finestra dedicata (minimizzata)
start "MoneyMate server" /min cmd /k python server\server.py

rem Attende che il server sia pronto, poi apre il browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000"

rem Per FERMARE la dashboard: chiudi la finestra "MoneyMate server".
exit
