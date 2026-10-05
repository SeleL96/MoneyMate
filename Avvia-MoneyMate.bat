@echo off
rem ============================================================
rem  MoneyMate - launcher
rem  Doppio clic su questo file per aprire la dashboard nel browser.
rem  Avvia un piccolo server locale e apre http://localhost:8000
rem ============================================================
title Avvia MoneyMate
cd /d "%~dp0app"

rem Avvia il server in una finestra dedicata (minimizzata)
start "MoneyMate server" /min cmd /k python -m http.server 8000

rem Attende che il server sia pronto, poi apre il browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000"

rem Per FERMARE la dashboard: chiudi la finestra "MoneyMate server".
exit
