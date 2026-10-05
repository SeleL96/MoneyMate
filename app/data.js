// GENERATO da scripts/build_app_data.py — non modificare a mano.
// I numeri provengono dal motore deterministico core/.
window.MM_DATA = {
  "brand": {
    "name": "MoneyMate",
    "slogan": "Ogni spesa ha senso con MoneyMate"
  },
  "categories": [
    {
      "key": "casa",
      "label": "Casa e bollette",
      "icon": "home",
      "type": "need"
    },
    {
      "key": "alimentari",
      "label": "Spesa alimentare",
      "icon": "cart",
      "type": "need"
    },
    {
      "key": "trasporti",
      "label": "Trasporti",
      "icon": "bus",
      "type": "need"
    },
    {
      "key": "salute",
      "label": "Salute",
      "icon": "health",
      "type": "need"
    },
    {
      "key": "ristoranti",
      "label": "Ristoranti e bar",
      "icon": "food",
      "type": "extra"
    },
    {
      "key": "svago",
      "label": "Abbonamenti e svago",
      "icon": "film",
      "type": "extra"
    },
    {
      "key": "altro",
      "label": "Altro",
      "icon": "receipt",
      "type": "extra"
    }
  ],
  "glossary": [
    {
      "term": "TAEG",
      "aliases": [
        "taeg"
      ],
      "definizione": "Il costo totale vero del prestito in un anno, commissioni incluse. E' il numero piu' importante per capire quanto paghi davvero.",
      "esempio": "Chiedi 1.000 € e a fine anno ne restituisci 1.048 € → TAEG ≈ 4,8%."
    },
    {
      "term": "TAN",
      "aliases": [
        "tan"
      ],
      "definizione": "Il tasso 'base' annuo, senza le spese extra. Da solo non dice quanto costa davvero il prestito: per quello guarda il TAEG.",
      "esempio": "TAN 3,10% indica solo gli interessi 'puri', senza commissioni e spese."
    },
    {
      "term": "Spread",
      "aliases": [
        "spread"
      ],
      "definizione": "La parte di guadagno fissa della banca, che si somma all'indice di mercato (Euribor).",
      "esempio": "Euribor 2% + spread 1,5% = tasso 3,5%."
    },
    {
      "term": "Euribor",
      "aliases": [
        "euribor"
      ],
      "definizione": "Un indice di mercato che puo' salire o scendere nel tempo: e' la parte 'variabile' del tasso di un mutuo a tasso variabile.",
      "esempio": "Se l'Euribor sale, la tua rata a tasso variabile puo' aumentare."
    },
    {
      "term": "Rata",
      "aliases": [
        "rata"
      ],
      "definizione": "Quanto paghi ogni mese. Si compone di una parte di capitale (il prestito che restituisci) e una di interessi (il costo del prestito).",
      "esempio": "Rata 548 €/mese per 25 anni."
    },
    {
      "term": "Commissione di istruttoria",
      "aliases": [
        "istruttoria",
        "commissione istruttoria"
      ],
      "definizione": "Una spesa una tantum per aprire e valutare la pratica del mutuo: la paghi una volta sola, all'inizio.",
      "esempio": "Commissione istruttoria 350 €, pagata solo alla stipula."
    },
    {
      "term": "Quota fissa",
      "aliases": [
        "quota fissa"
      ],
      "definizione": "La paghi sempre, anche se non consumi nulla: e' il costo di avere il contratto attivo.",
      "esempio": "Quota fissa 8,50 €/mese sulla bolletta della luce."
    },
    {
      "term": "Oneri di sistema",
      "aliases": [
        "oneri",
        "oneri di sistema"
      ],
      "definizione": "Costi generali del sistema elettrico nazionale, uguali per tutti: non dipendono dal tuo fornitore.",
      "esempio": "Gli oneri di sistema compaiono in ogni bolletta elettrica."
    },
    {
      "term": "IVA",
      "aliases": [
        "iva"
      ],
      "definizione": "Un'imposta sui consumi. In bolletta si calcola anche sulle altre voci, quindi aumenta il totale.",
      "esempio": "IVA 10% o 22% applicata alle voci della bolletta."
    },
    {
      "term": "Accise",
      "aliases": [
        "accise",
        "accisa"
      ],
      "definizione": "Tasse sul consumo di energia, incassate dallo Stato.",
      "esempio": "Le accise crescono con i kWh consumati."
    },
    {
      "term": "Imposta di bollo",
      "aliases": [
        "bollo",
        "imposta di bollo"
      ],
      "definizione": "Una tassa dello Stato sul conto, dovuta se la giacenza media supera 5.000 €.",
      "esempio": "Imposta di bollo 34,20 € l'anno sul conto corrente."
    },
    {
      "term": "Canone",
      "aliases": [
        "canone"
      ],
      "definizione": "Il costo fisso per tenere aperto il conto, a prescindere da quanto lo usi.",
      "esempio": "Canone 2,00 €/mese = 24 € l'anno."
    },
    {
      "term": "Commissione bonifico",
      "aliases": [
        "bonifico"
      ],
      "definizione": "Il costo per ogni bonifico inviato. Spesso online e' gratuito, allo sportello si paga.",
      "esempio": "Bonifico allo sportello 1,00 € a operazione."
    },
    {
      "term": "Commissione di prelievo",
      "aliases": [
        "prelievo",
        "atm"
      ],
      "definizione": "Si paga prelevando da sportelli di altre banche. Dai bancomat della tua banca di solito e' gratis.",
      "esempio": "Prelievo ATM altra banca 2,50 €."
    }
  ],
  "demo_seed": {
    "month": "Ottobre 2026",
    "income": 1450.0,
    "expenses": [
      {
        "category": "casa",
        "amount": 620.0
      },
      {
        "category": "alimentari",
        "amount": 280.0
      },
      {
        "category": "ristoranti",
        "amount": 180.0
      },
      {
        "category": "svago",
        "amount": 145.0
      },
      {
        "category": "trasporti",
        "amount": 90.0
      },
      {
        "category": "salute",
        "amount": 35.0
      },
      {
        "category": "altro",
        "amount": 40.0
      }
    ],
    "previous": {
      "ristoranti": 124.0
    },
    "transactions": [
      {
        "desc": "Streaming TV",
        "amount": 12.99,
        "month": "2026-09"
      },
      {
        "desc": "Streaming TV",
        "amount": 12.99,
        "month": "2026-10"
      },
      {
        "desc": "Palestra",
        "amount": 9.99,
        "month": "2026-09"
      },
      {
        "desc": "Palestra",
        "amount": 9.99,
        "month": "2026-10"
      },
      {
        "desc": "Musica",
        "amount": 4.99,
        "month": "2026-09"
      },
      {
        "desc": "Musica",
        "amount": 4.99,
        "month": "2026-10"
      },
      {
        "desc": "Supermercato",
        "amount": 42.1,
        "month": "2026-10"
      }
    ]
  },
  "_preview": {
    "summary": {
      "income": 1450.0,
      "spent": 1390.0,
      "saved": 60.0
    },
    "rule": {
      "needs": {
        "pct": 70.7,
        "target": 50
      },
      "extra": {
        "pct": 25.2,
        "target": 30
      },
      "saved": {
        "pct": 4.1,
        "target": 20
      }
    },
    "alerts": [
      {
        "level": "warn",
        "icon": "trending",
        "title": "Spesa in aumento",
        "message": "<strong>Ristoranti e bar</strong> è a <strong>180 €</strong>: <strong>+45,2%</strong> rispetto ai 124 € del mese scorso."
      },
      {
        "level": "info",
        "icon": "repeat",
        "title": "Addebiti che si ripetono",
        "message": "<strong>3 pagamenti uguali ogni mese</strong> (12,99 + 9,99 + 4,99 €): possibili abbonamenti. In un anno: <strong>335,64 €</strong>."
      }
    ]
  }
};
