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

  /* Specchio di core.finance_math.month_over_month_delta */
  function monthDelta(current, previous) {
    var d = round2(current - previous);
    return { current: round2(current), previous: round2(previous), delta_abs: d,
      delta_pct: previous ? pct(d, previous) : 0.0, increased: d > 0 };
  }

  /* Specchio di core.finance_math.detect_recurring */
  function detectRecurring(transactions) {
    var seen = {}, amountOf = {};
    (transactions || []).forEach(function (t) {
      var k = t.desc.trim().toLowerCase() + "|" + round2(t.amount);
      (seen[k] = seen[k] || {})[t.month] = true;
      amountOf[k] = round2(t.amount);
    });
    var items = Object.keys(seen).filter(function (k) { return Object.keys(seen[k]).length >= 2; })
      .map(function (k) { return { desc: k.split("|")[0], amount: amountOf[k] }; });
    items.sort(function (a, b) { return b.amount - a.amount; });
    var monthly = round2(items.reduce(function (s, i) { return s + i.amount; }, 0));
    return { items: items, count: items.length, monthly_total: monthly, annual_total: round2(monthly * 12) };
  }

  /* Alert intelligenti: descrivono l'andamento, non prescrivono. opts={previous,transactions} */
  function buildAlerts(b, rule, opts) {
    opts = opts || {}; var a = [];
    var prev = opts.previous || {};

    // 1) Andamento mese su mese: categorie in forte aumento (>=30%)
    b.by_category.forEach(function (c) {
      if (prev[c.key] != null) {
        var d = monthDelta(c.amount, prev[c.key]);
        if (d.increased && d.delta_pct >= 30) {
          a.push({ level: "warn", icon: "trending", title: "Spesa in aumento",
            message: "<strong>" + c.label + "</strong> è a <strong>" + eurIt(c.amount) +
              " €</strong>: <strong>+" + pcIt(d.delta_pct) + "%</strong> rispetto ai " +
              eurIt(d.previous) + " € del mese scorso." });
        }
      }
    });

    // 2) Addebiti ricorrenti (abbonamenti)
    var rec = detectRecurring(opts.transactions);
    if (rec.count >= 1) {
      a.push({ level: "info", icon: "repeat", title: "Addebiti che si ripetono",
        message: "<strong>" + rec.count + " pagamenti uguali ogni mese</strong> (" +
          rec.items.map(function (i) { return eurIt(i.amount); }).join(" + ") +
          " €): possibili abbonamenti. In un anno: <strong>" + eurIt(rec.annual_total) + " €</strong>." });
    }

    // 3) Extra sopra il riferimento
    if (rule.extra.pct > rule.extra.target) {
      a.push({ level: "warn", icon: "info", title: "Extra sopra il riferimento",
        message: "Le spese <strong>extra</strong> pesano il <strong>" + pcIt(rule.extra.pct) +
          "%</strong> delle entrate: il riferimento 50/30/20 indica il 30%." });
    }

    // 4) Risparmio basso
    if (b.income > 0 && rule.saved.pct < rule.saved.target) {
      a.push({ level: "info", icon: "coins", title: "Risparmio del mese",
        message: "Questo mese metti da parte il <strong>" + pcIt(rule.saved.pct) +
          "%</strong> delle entrate (riferimento: 20%)." });
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
