/* calc.js — calcoli di budget lato client.
 *
 * NOTA ARCHITETTURALE: queste formule sono lo specchio di core/finance_math.py,
 * che resta la fonte autorevole (validata dai test in tests/). Una web-app statica
 * non puo' eseguire Python nel browser: per l'interattivita' (l'utente imposta il
 * budget e inserisce le spese) le stesse formule sono replicate qui in forma minima.
 * Se cambi una formula, aggiornala in ENTRAMBI i file.
 *
 * Il catalogo delle categorie (tipo necessario/extra, etichetta, icona) arriva da
 * window.MM_DATA.categories, generato da core/categories.py: unica fonte per quello.
 */
(function (global) {
  function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }
  function pct(part, whole, nd) {
    if (!whole) return 0.0;
    var f = Math.pow(10, nd == null ? 1 : nd);
    return Math.round(part / whole * 100 * f) / f;
  }

  function catMeta(key) {
    var cats = (global.MM_DATA && global.MM_DATA.categories) || [];
    for (var i = 0; i < cats.length; i++) if (cats[i].key === key) return cats[i];
    return { key: key, label: key, icon: "receipt", type: "extra" };
  }

  /* Specchio di core.finance_math.budget_breakdown */
  function budgetBreakdown(income, expenses) {
    var byCategory = [], needs = 0, extra = 0, total = 0;
    // aggrega per categoria (una riga per categoria, anche con piu' spese)
    var sums = {};
    expenses.forEach(function (e) {
      sums[e.category] = round2((sums[e.category] || 0) + Number(e.amount));
    });
    Object.keys(sums).forEach(function (key) {
      var amount = sums[key], m = catMeta(key);
      total = round2(total + amount);
      if (m.type === "need") needs = round2(needs + amount); else extra = round2(extra + amount);
      byCategory.push({ key: key, label: m.label, icon: m.icon, type: m.type,
        amount: amount, pct_income: pct(amount, income) });
    });
    byCategory.sort(function (a, b) { return b.amount - a.amount; });
    return { income: round2(income), total_spent: total, saved: round2(income - total),
      needs_total: needs, extra_total: extra, by_category: byCategory };
  }

  /* Specchio di core.finance_math.rule_50_30_20 */
  function rule503020(b) {
    return {
      needs: { pct: pct(b.needs_total, b.income), target: 50 },
      extra: { pct: pct(b.extra_total, b.income), target: 30 },
      saved: { pct: pct(b.saved, b.income), target: 20 }
    };
  }

  /* Alert deterministici dai dati correnti (descrivono, non prescrivono) */
  function buildAlerts(b, rule) {
    var a = [];
    if (rule.extra.pct > rule.extra.target) {
      a.push({ level: "warn", icon: "trending", title: "Extra sopra il riferimento",
        message: "Le spese <strong>extra</strong> pesano il <strong>" + pcIt(rule.extra.pct) +
          "%</strong> delle entrate: il riferimento 50/30/20 indica il 30%." });
    }
    if (b.income > 0 && rule.saved.pct < rule.saved.target) {
      a.push({ level: "info", icon: "coins", title: "Risparmio del mese",
        message: "Questo mese metti da parte il <strong>" + pcIt(rule.saved.pct) +
          "%</strong> delle entrate (riferimento: 20%)." });
    }
    var top = b.by_category[0];
    if (top && top.pct_income >= 35) {
      a.push({ level: "info", icon: "info", title: "Categoria più pesante",
        message: "<strong>" + top.label + "</strong> da sola vale il <strong>" +
          pcIt(top.pct_income) + "%</strong> delle tue entrate." });
    }
    return a;
  }

  function eurIt(x) {
    var neg = x < 0; x = Math.abs(x);
    var p = x.toFixed(2).split(".");
    var i = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "-" : "") + i + (p[1] === "00" ? "" : ("," + p[1]));
  }
  function pcIt(x) { return ("" + x).replace(".", ","); }

  global.MMCalc = {
    budgetBreakdown: budgetBreakdown, rule503020: rule503020, buildAlerts: buildAlerts,
    eur: eurIt, pc: pcIt, round2: round2, pct: pct
  };
})(window);
