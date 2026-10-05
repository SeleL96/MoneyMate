/* app.js — logica SPA di MoneyMate (client-side).
 * Persistenza: localStorage. Calcoli: calc.js (specchio di core/). Dati: data.js.
 */
(function () {
  "use strict";
  var D = window.MM_DATA, C = window.MMCalc;
  var eur = C.eur, pc = C.pc;

  /* ---------- icone ---------- */
  var IC = {
    home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/>',
    cart:'<circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 4h2l2.3 11a1 1 0 0 0 1 .8h8.3a1 1 0 0 0 1-.8L19 8H6"/>',
    food:'<path d="M6 3v7a2 2 0 0 0 4 0V3"/><path d="M8 10v11"/><path d="M17 3c-1.5 1-2.5 3-2.5 6 0 2 1 3 2.5 3v9"/>',
    film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>',
    bus:'<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M4 11h16M8 16v2M16 16v2"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/>',
    health:'<path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5c0 5-7 9.5-7 9.5z"/>',
    receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    wallet:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 14h2"/>',
    bag:'<path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    coins:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    trending:'<path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    chat:'<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>',
    bot:'<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M8 13h.01M16 13h.01M9 17h6"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    wallet2:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h3"/>'
  };
  function svg(p){ return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>'; }
  function $(id){ return document.getElementById(id); }
  var MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  function monthLabel(){ var d=new Date(); var m=MESI[d.getMonth()]; return m.charAt(0).toUpperCase()+m.slice(1)+" "+d.getFullYear(); }

  var DETAILS = {
    casa:"Affitto, luce, gas e acqua.", alimentari:"Supermercato e generi alimentari.",
    ristoranti:"Pranzi fuori, cene, caffè e aperitivi.", svago:"Streaming, palestra, uscite.",
    trasporti:"Benzina, mezzi pubblici.", salute:"Farmacia, visite.", altro:"Spese varie non classificate."
  };

  /* ---------- stato ---------- */
  var DEFAULT = { user:null, income:null, expenses:[], previous:{}, transactions:[] };
  var state = load();
  var level = "simple";
  var currentDoc = "mutuo";
  var cur = { b:null, rule:null };  // ultimo calcolo, per il modale "Spiega"

  function load(){ try{ return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem("mm_state")||"{}")); }catch(e){ return Object.assign({}, DEFAULT); } }
  function save(){ localStorage.setItem("mm_state", JSON.stringify(state)); }

  /* ---------- auth ---------- */
  function login(){
    var name = ($("u").value||"").trim() || "Utente";
    state.user = name; save(); showApp();
  }
  function logout(){ state.user=null; save(); $("app").classList.add("hidden"); $("login").classList.remove("hidden"); $("u").focus(); }
  function showApp(){
    $("login").classList.add("hidden"); $("app").classList.remove("hidden");
    var n = state.user||"Utente";
    $("sb-av").textContent = n.charAt(0).toUpperCase();
    $("sb-who").innerHTML = n.charAt(0).toUpperCase()+n.slice(1)+"<small>Account demo</small>";
    $("dash-greet").textContent = "Ciao "+(n.charAt(0).toUpperCase()+n.slice(1))+"!";
    renderCatSelect(); renderDashboard(); renderExpenseList(); loadDoc("mutuo", document.querySelector('.doc-pill[aria-pressed="true"]'));
    showView("dashboard");
  }
  function showView(name){
    ["dashboard","spese","documenti"].forEach(function(v){ $("view-"+v).classList.toggle("hidden", v!==name); });
    document.querySelectorAll(".sb-nav button").forEach(function(b){
      if(b.getAttribute("data-view")===name) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
    });
  }
  function setLevel(l){ level=l; $("lvl-simple").setAttribute("aria-pressed",l==="simple"); $("lvl-detail").setAttribute("aria-pressed",l==="detail"); }

  /* ---------- DASHBOARD ---------- */
  function renderDashboard(){
    var body = $("dash-body");
    if(state.income==null){
      body.innerHTML =
        '<div class="empty"><div class="big-ic">'+svg(IC.wallet)+'</div>'+
        '<h3>Imposta il tuo budget per iniziare</h3>'+
        '<p>Dicci quanto entra ogni mese: da lì ti mostriamo dove vanno i soldi, con grafici e avvisi semplici da capire.</p>'+
        '<div class="actions">'+
          '<button class="btn btn--primary" onclick="MM.openIncomeModal()">'+svg('<path d="M12 5v14M5 12h14"/>')+'Imposta il tuo budget</button>'+
          '<button class="btn btn--secondary" onclick="MM.loadDemo()">Prova con dati di esempio</button>'+
        '</div></div>';
      return;
    }
    var b = C.budgetBreakdown(state.income, state.expenses);
    var rule = C.rule503020(b);
    var alerts = C.buildAlerts(b, rule, { previous: state.previous, transactions: state.transactions });
    cur.b = b; cur.rule = rule;

    var html = '<div class="hero"><div class="m">'+monthLabel()+' · Riepilogo</div><h2>Ogni spesa ha senso con MoneyMate</h2></div>';
    // summary
    var S=[{ic:"wallet",k:"Entrate",v:b.income,sub:"Le tue entrate del mese",key:"entrate"},
           {ic:"bag",k:"Spese",v:b.total_spent,sub:"Tutto quello che hai speso",key:"spese"},
           {ic:"coins",k:"Rimasto",v:b.saved,sub:"Entrate meno spese",key:"rimasto"}];
    html += '<div class="grid3">'+S.map(function(c){
      return '<div class="card stat"><div class="top"><span class="chip-ic">'+svg(IC[c.ic])+'</span><span class="k">'+c.k+'</span></div>'+
        '<div class="v">'+eur(c.v)+' €</div><div class="sub">'+c.sub+'</div>'+
        '<button class="btn btn--secondary btn--sm" style="margin-top:12px" onclick="MM.explain(\''+c.key+'\')">'+svg(IC.chat)+'Spiega</button></div>';
    }).join("")+'</div>';

    // --- blocco ALERT (intelligenti, in alto) ---
    var alertsHtml = "";
    if(alerts.length){
      alertsHtml = '<div class="alerts" aria-live="polite">'+alerts.map(function(a){
        return '<div class="alert '+a.level+'"><span class="chip-ic">'+svg(IC[a.icon]||IC.info)+'</span><span class="t"><span class="lab">'+a.title+'</span>'+a.message+'</span></div>';
      }).join("")+'</div>';
    }

    // --- blocco 50/30/20 ---
    var ruleHtml = '<h2 class="section-h">Un modo semplice per leggere il budget: 50 / 30 / 20</h2>'+
      '<p class="caption">Uno schema di riferimento (non una regola): metà alle cose necessarie, un terzo agli extra, il resto da parte.</p>'+
      '<div class="card"><div class="rule">'+
      [{l:"Necessario",d:rule.needs,c:"var(--verde)"},{l:"Extra",d:rule.extra,c:"var(--giallo)"},{l:"Da parte",d:rule.saved,c:"var(--info)"}].map(function(x){
        return '<div class="b"><div class="big" style="color:'+x.c+'">'+pc(x.d.pct)+'%</div><div class="cmp">'+x.l+'<br><span style="color:var(--slate500)">riferimento: '+x.d.target+'%</span></div></div>';
      }).join("")+'</div>'+
      '<button class="btn btn--secondary btn--sm" style="margin-top:16px" onclick="MM.explain(\'rule\')">'+svg(IC.info)+'Spiega questo schema</button></div>';

    // --- blocco CATEGORIE (lista spese) ---
    var catsHtml;
    if(b.by_category.length){
      catsHtml = '<p class="caption" style="margin-top:28px">Tocca una categoria per capire cosa contiene. Le barre mostrano il peso sulle tue entrate.</p><ul class="cats">';
      var max = Math.max.apply(null, b.by_category.map(function(c){return c.amount;}));
      catsHtml += b.by_category.map(function(c,i){
        var w=Math.round(c.amount/max*100);
        var tag=c.type==="need"?'<span class="tag need">Necessario</span>':'<span class="tag extra">Extra</span>';
        return '<li class="cat" tabindex="0" role="button" aria-label="'+c.label+', '+eur(c.amount)+' euro, '+pc(c.pct_income)+'% delle entrate" '+
          'onclick="MM.explainCat('+i+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();MM.explainCat('+i+')}">'+
          '<span class="chip-ic">'+svg(IC[c.icon]||IC.receipt)+'</span><span class="name">'+c.label+' '+tag+'</span>'+
          '<span class="amount">'+eur(c.amount)+' €</span><span class="barwrap"><span class="bar" style="width:'+w+'%"></span></span>'+
          '<span class="pct">'+pc(c.pct_income)+'% delle tue entrate</span></li>';
      }).join("")+'</ul>';
    } else {
      catsHtml = '<div class="empty" style="margin-top:22px"><div class="big-ic">'+svg(IC.cart)+'</div><h3>Ancora nessuna spesa</h3>'+
        '<p>Aggiungi le tue spese per vedere dove vanno i soldi.</p>'+
        '<div class="actions"><button class="btn btn--primary" onclick="MM.showView(\'spese\')">Vai a Le mie spese</button></div></div>';
    }

    // ordine finale: riepilogo → alert → 50/30/20 → lista spese
    body.innerHTML = html + alertsHtml + ruleHtml + catsHtml;
  }

  /* ---------- income / budget setup ---------- */
  function setIncome(v){ var n=parseFloat(v); if(isNaN(n)||n<0){ return false; } state.income=C.round2(n); save(); renderDashboard(); renderExpenseList(); return true; }
  function openIncomeModal(){
    openModal("Imposta il tuo budget",
      '<p>Quanto entra ogni mese (stipendio o altre entrate)?</p>'+
      '<div class="field" style="margin-top:12px"><label for="m-income">Entrate mensili (€)</label>'+
      '<input id="m-income" type="number" min="0" step="0.01" placeholder="es. 1450" /></div>',
      '<button class="btn btn--primary" onclick="MM.confirmIncome()">Salva</button>'+
      '<button class="btn btn--neutral" onclick="MM.closeModal()">Annulla</button>');
    setTimeout(function(){ var el=$("m-income"); if(el) el.focus(); },30);
  }
  function confirmIncome(){ var el=$("m-income"); if(setIncome(el.value)){ closeModal(); showView("dashboard"); } else { el.focus(); } }
  function saveIncomeFromField(){ var el=$("e-income"); if(setIncome(el.value)){ toast("Entrate aggiornate"); } }

  /* ---------- SPESE ---------- */
  function renderCatSelect(){
    $("e-cat").innerHTML = D.categories.map(function(c){ return '<option value="'+c.key+'">'+c.label+(c.type==="need"?" (necessario)":" (extra)")+'</option>'; }).join("");
  }
  function addExpense(){
    var cat=$("e-cat").value, desc=($("e-desc").value||"").trim(), amt=parseFloat($("e-amt").value);
    if(isNaN(amt)||amt<=0){ $("e-amt").focus(); return; }
    if(state.income==null){ state.income=0; } // consenti spese anche senza entrate impostate
    state.expenses.push({ id:Date.now(), category:cat, desc:desc, amount:C.round2(amt) });
    save(); $("e-desc").value=""; $("e-amt").value=""; renderExpenseList(); renderDashboard();
  }
  function deleteExpense(id){ state.expenses=state.expenses.filter(function(e){return e.id!==id;}); save(); renderExpenseList(); renderDashboard(); }
  function renderExpenseList(){
    if($("e-income")) $("e-income").value = state.income==null?"":state.income;
    var list=$("exp-list"), tot=$("exp-total");
    if(!state.expenses.length){ list.innerHTML='<li class="exp-empty">Nessuna spesa inserita. Aggiungine una qui a sinistra, oppure carica i dati di esempio.</li>'; tot.textContent=""; return; }
    var meta={}; D.categories.forEach(function(c){ meta[c.key]=c; });
    var total=0;
    list.innerHTML = state.expenses.slice().reverse().map(function(e){
      var m=meta[e.category]||{label:e.category,icon:"receipt"}; total+=e.amount;
      return '<li class="exp-item"><span class="chip-ic">'+svg(IC[m.icon]||IC.receipt)+'</span>'+
        '<span class="d"><b>'+m.label+'</b><small>'+(e.desc?e.desc:"—")+'</small></span>'+
        '<span class="amt">'+eur(e.amount)+' €</span>'+
        '<button class="btn btn--neutral btn--sm icon-only" aria-label="Elimina spesa" onclick="MM.deleteExpense('+e.id+')">'+svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>')+'</button></li>';
    }).join("");
    tot.textContent = "Totale: "+eur(C.round2(total))+" €";
  }
  function loadDemo(){
    var seed=D.demo_seed; state.income=seed.income;
    state.expenses=seed.expenses.map(function(e,i){ return { id:Date.now()+i, category:e.category, amount:e.amount, desc:e.desc||"" }; });
    state.previous = seed.previous || {};
    state.transactions = seed.transactions || [];
    save(); renderDashboard(); renderExpenseList(); showView("dashboard");
  }

  /* ---------- MODALE spiegazioni ---------- */
  var lastFocus=null;
  function openModal(title, body, actions){
    lastFocus=document.activeElement;
    $("modal-title").innerHTML=title; $("modal-body").innerHTML=body; $("modal-actions").innerHTML=actions||"";
    $("modal").classList.add("open");
    var f=$("modal").querySelector(".btn"); if(f) f.focus();
  }
  function closeModal(){ $("modal").classList.remove("open"); if(lastFocus) lastFocus.focus(); }
  function explainBox(title, body, how){
    var h = how?'<div class="how"><strong>Come l\'abbiamo calcolato:</strong> '+how+'</div>':'';
    openModal(title, '<p>'+body+'</p>'+h+'<p class="note">Questo numero è calcolato dai tuoi dati, non stimato. MoneyMate spiega, non consiglia.</p>',
      '<button class="btn btn--primary" onclick="MM.closeModal()">Ho capito</button><button class="btn btn--neutral" onclick="MM.closeModal()">Chiudi</button>');
  }
  function explain(key){
    var b=cur.b, r=cur.rule, I=eur(b.income), SP=eur(b.total_spent), SA=eur(b.saved);
    var txt={
      simple:{
        entrate:["Le tue entrate","È quanto entra questo mese: <strong>"+I+" €</strong>. È il punto di partenza: tutto quello che spendi parte da qui.","Lo imposti tu nella sezione Le mie spese."],
        spese:["Le tue spese","È la somma di tutto quello che hai speso: <strong>"+SP+" €</strong>.","Somma di tutte le spese che hai inserito."],
        rimasto:["Quanto è rimasto","Quello che ti resta dopo aver pagato tutto: <strong>"+SA+" €</strong>. Sono i soldi che puoi mettere da parte.","Entrate − Spese = "+I+" − "+SP+" = "+SA+" €."],
        rule:["Lo schema 50 / 30 / 20","Un modo semplice per dividere lo stipendio: metà alle cose <strong>necessarie</strong>, un terzo agli <strong>extra</strong>, il resto <strong>da parte</strong>. È solo un riferimento.","Le categorie sono divise in necessario/extra e rapportate alle entrate."]
      },
      detail:{
        entrate:["Le tue entrate","Reddito disponibile del mese: <strong>"+I+" €</strong>. È la base su cui si misura ogni spesa in percentuale.","Valore impostato dall'utente."],
        spese:["Le tue spese","Totale uscite: <strong>"+SP+" €</strong>.","Σ degli importi per categoria (stesse formule di core.budget_breakdown)."],
        rimasto:["Il saldo del mese","Saldo = Entrate − Spese = <strong>"+SA+" €</strong> ("+pc(r.saved.pct)+"% delle entrate).","surplus = "+I+" − "+SP+" = "+SA+" €."],
        rule:["Lo schema 50 / 30 / 20","Framework 50/30/20. I tuoi valori: <strong>"+pc(r.needs.pct)+"% / "+pc(r.extra.pct)+"% / "+pc(r.saved.pct)+"%</strong>.","rule_50_30_20() rapporta ciascun gruppo al reddito."]
      }
    }[level][key];
    explainBox(txt[0], txt[1], txt[2]);
  }
  function explainCat(i){
    var c=cur.b.by_category[i];
    var kind=c.type==="need"?"una spesa <strong>necessaria</strong>":"una spesa <strong>extra</strong>";
    explainBox('<span class="chip-ic">'+svg(IC[c.icon]||IC.receipt)+'</span> '+c.label,
      (DETAILS[c.key]||"")+" Questo mese: <strong>"+eur(c.amount)+" €</strong> ("+pc(c.pct_income)+"% delle entrate). È "+kind+".",
      eur(c.amount)+" € ÷ "+eur(cur.b.income)+" € × 100 = "+pc(c.pct_income)+"%.");
  }

  /* ---------- CHAT ---------- */
  var DOC_GREETING={
    mutuo:"Ho qui la tua <strong>proposta di mutuo</strong>. Chiedimi cosa significa una qualsiasi parola o riga, ad esempio «cosa vuol dire TAEG?».",
    bolletta:"Ho qui la tua <strong>bolletta</strong>. Chiedimi il significato di una voce, ad esempio «cos'è la quota fissa?».",
    conto:"Ho qui il tuo <strong>estratto conto</strong>. Chiedimi di una voce, ad esempio «cos'è l'imposta di bollo?»."
  };
  var SUGGEST={
    mutuo:["Cos'è il TAEG?","Cosa vuol dire spread?","Cos'è la commissione istruttoria?","Mi conviene questo mutuo?"],
    bolletta:["Cos'è la quota fissa?","Cosa sono gli oneri di sistema?","Perché pago l'IVA?"],
    conto:["Cos'è l'imposta di bollo?","Perché pago il canone?","Cos'è la commissione bonifico?"]
  };
  var ADVICE=[/mi conviene/,/devo (firmar|comprar|vender|scegli|aprir|chiuder)/,/\b(è|e') (un buon|conveniente|vantaggios)/,/cosa mi conviene/,/quale (scelgo|prendo)/];
  var GUARD="Non posso dirti se <strong>conviene</strong> o se firmare: sarebbe un consiglio, e io spiego soltanto. Però posso aiutarti a decidere da sola: dimmi quali voci vuoi capire (TAN, TAEG, spread, rata…) e ti spiego come incidono sul costo.";
  function bubble(who,html){ return '<div class="msg '+(who==="bot"?"bot":"me")+'"><span class="av">'+svg(who==="bot"?IC.bot:IC.user)+'</span><span class="bubble">'+html+'</span></div>'; }
  function renderSuggest(){ $("suggest").innerHTML=(SUGGEST[currentDoc]||[]).map(function(s){ return '<button type="button" onclick="MM.ask(this.textContent)">'+s+'</button>'; }).join(""); }
  function loadDoc(type,btn){ currentDoc=type; if(btn){ btn.parentNode.querySelectorAll(".doc-pill").forEach(function(b){ b.setAttribute("aria-pressed",b===btn); }); } $("thread").innerHTML=bubble("bot","Ciao! "+DOC_GREETING[type]); renderSuggest(); }
  function botAnswer(text){
    var t=text.toLowerCase();
    if(ADVICE.some(function(r){return r.test(t);})) return GUARD;
    var hit=(D.glossary||[]).find(function(e){ return e.aliases.some(function(a){ return t.indexOf(a)>=0; }); });
    if(hit) return "<strong>"+hit.term+"</strong> — "+hit.definizione+" <em>Esempio:</em> "+hit.esempio;
    return "Non ho trovato questa parola nel documento. Prova a scrivermi il termine esatto che vedi (es. «spread», «canone», «TAEG») e te lo spiego subito.";
  }
  function pushMsg(who,html){ var th=$("thread"); th.insertAdjacentHTML("beforeend",bubble(who,html)); th.scrollTop=th.scrollHeight; }
  function ask(text){ if(!text||!text.trim())return; pushMsg("me",text.replace(/</g,"&lt;")); setTimeout(function(){ pushMsg("bot",botAnswer(text)); },250); }
  function sendMsg(){ var inp=$("chatInput"); ask(inp.value); inp.value=""; inp.focus(); }
  function onFile(input){
    var f = input.files && input.files[0]; if(!f) return; input.value="";
    var name=f.name;
    if(!/\.(txt|csv)$/i.test(name) && (f.type||"").indexOf("text")<0){
      pushMsg("me","📎 "+name);
      pushMsg("bot","Per ora leggo documenti di testo (.txt). Il supporto per PDF e foto arriva in fase di sviluppo. Intanto scrivimi la voce che non capisci e te la spiego.");
      return;
    }
    var r=new FileReader();
    r.onload=function(){
      var low=String(r.result||"").toLowerCase();
      pushMsg("me","📎 Ho caricato «"+name+"»");
      var found=(D.glossary||[]).filter(function(e){ return e.aliases.some(function(a){ return low.indexOf(a)>=0; }); });
      if(!found.length){ pushMsg("bot","Ho letto il documento ma non ho riconosciuto voci note. Scrivimi una parola che vedi e te la spiego."); return; }
      pushMsg("bot","Ho letto «"+name+"». Ecco le voci che ho riconosciuto e cosa significano:<ul style=\"margin:8px 0 0;padding-left:18px\">"+
        found.map(function(e){ return "<li style=\"margin-bottom:6px\"><strong>"+e.term+"</strong>: "+e.definizione+"</li>"; }).join("")+
        "</ul>Chiedimi pure di una voce specifica per un esempio con numeri.");
    };
    r.readAsText(f);
  }

  /* ---------- util ---------- */
  function toast(msg){
    var t=document.createElement("div"); t.textContent=msg;
    t.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:10px 18px;border-radius:999px;font-size:14px;z-index:300;box-shadow:var(--ombra-card)";
    document.body.appendChild(t); setTimeout(function(){ t.remove(); },1800);
  }

  document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeModal(); });

  /* ---------- init ---------- */
  function init(){ if(state.user){ showApp(); } else { $("login").classList.remove("hidden"); } }

  window.MM = {
    login:login, logout:logout, showView:showView, setLevel:setLevel,
    openIncomeModal:openIncomeModal, confirmIncome:confirmIncome, saveIncomeFromField:saveIncomeFromField,
    addExpense:addExpense, deleteExpense:deleteExpense, loadDemo:loadDemo,
    explain:explain, explainCat:explainCat, closeModal:closeModal,
    loadDoc:loadDoc, ask:ask, sendMsg:sendMsg, onFile:onFile
  };
  init();
})();
