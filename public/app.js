/* Lake — all interaction. No libraries. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var C = {
    lake: 'Lake: your shared goal as a lake. Tap +$25, +$100 or +$250 to drop money in and watch the water rise. Switch between Kyoto, Home and Baby at the top.',
    goals: 'Goals: every dream you are saving for, each with its own progress. Tap a goal to open its lake.',
    together: 'Together: what each of you has added this month, plus love notes. Tap a note to send it to your partner.',
    bills: 'Bills: your regular payments in one calm list. Flip a switch to turn autopay on or off.',
    insights: 'Insights: the date you will reach your goal at your current pace, and your last six months of saving.'
  };
  var cp = document.getElementById('cap');
  window.onLakeGo = function (v) { cp.textContent = C[v]; };

  var h = document.querySelector('.rh');
  function rp(x, y) {
    var s = document.createElement('span');
    s.className = 'rp';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    h.appendChild(s);
    setTimeout(function () { s.remove(); }, 2500);
  }
  if (h && !reduce) {
    var last = 0;
    h.addEventListener('pointermove', function (e) {
      var t = Date.now();
      if (t - last > 150) {
        last = t;
        var r = h.getBoundingClientRect();
        rp(e.clientX - r.left, e.clientY - r.top);
      }
    });
    h.addEventListener('pointerdown', function (e) {
      var r = h.getBoundingClientRect();
      rp(e.clientX - r.left, e.clientY - r.top);
    });
    setInterval(function () {
      rp(Math.random() * h.clientWidth, Math.random() * h.clientHeight);
    }, 1700);
  }
})();

(function () {
  'use strict';
  var P = document.querySelector('.phone');
  if (!P) return;

  var G = {
    japan: { n: 'Kyoto', f: 'Kyoto in spring', t: 6000, s: 3720, m: 520, i: 'plane' },
    home: { n: 'Home', f: 'Our first home', t: 40000, s: 9800, m: 900, i: 'home' },
    baby: { n: 'Baby', f: 'Welcoming baby', t: 8000, s: 7650, m: 300, i: 'smile' }
  };
  var k = 'japan', who = 'You', tot = { You: 420, Maya: 380 },
      notes = [['Maya', 'for the ramen night'], ['You', 'proud of us']],
      bills = [['Rent', 'home', '1st', 1], ['Internet', 'wave', '7th', 1], ['Insurance', 'shield', '15th', 0]];

  function $(i) { return P.querySelector('#' + i); }
  function fm(n) { return '$' + n.toLocaleString('en-US'); }
  function pc(g) { return Math.min(100, Math.round(g.s / g.t * 100)); }
  function ic(n) { return '<svg class="i"><use href="#i-' + n + '"/></svg>'; }
  function ea(s, f) { [].forEach.call(P.querySelectorAll(s), f); }

  function go(v) {
    if (window.onLakeGo) onLakeGo(v);
    ea('.v', function (e) { e.classList.toggle('on', e.dataset.v === v); });
    ea('#pTabs button', function (b) { b.setAttribute('aria-pressed', b.dataset.v === v); });
    [].forEach.call(document.querySelectorAll('[data-go]'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.go === v);
    });
  }

  function R() {
    var g = G[k], p = pc(g);
    $('pT').textContent = g.f;
    $('pP').textContent = p + '%';
    $('pA').textContent = fm(Math.min(g.s, g.t)) + ' of ' + fm(g.t);
    $('pM').textContent = p >= 100 ? 'Your lake is full. Time to go.'
      : p >= 80 ? 'Almost there. No rush.'
      : p >= 40 ? 'The water is rising.' : 'A quiet start. Every drop counts.';
    $('pW').style.transform = 'translateY(' + ((100 - p) * .82) + '%)';
    ea('#pSeg button', function (b) { b.setAttribute('aria-pressed', b.dataset.k === k); });
    $('pG').innerHTML = Object.keys(G).map(function (x) {
      var h = G[x], q = pc(h);
      return '<button class="gl gr" data-k="' + x + '"><span class="gi">' + ic(h.i) +
        '</span><span class="gt"><b>' + h.f + '</b><span class="pb"><i style="width:' + q +
        '%"></i></span></span><em>' + q + '%</em></button>';
    }).join('');
    ea('#pG button', function (b) {
      b.onclick = function () { k = b.dataset.k; R(); go('lake'); };
    });
    $('pTot').textContent = fm(tot.You + tot.Maya);
    $('pN').innerHTML = notes.slice(0, 3).map(function (n) {
      return '<div class="gl nt"><b>' + n[0] + '</b> ' + n[1] + '</div>';
    }).join('');
    var mo = Math.max(1, Math.ceil((g.t - g.s) / g.m)), d = new Date();
    d.setMonth(d.getMonth() + mo);
    $('pDs').textContent = 'At this pace, ' + g.n + ' is';
    $('pD').textContent = p >= 100 ? 'Today'
      : d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  function RB() {
    $('pB').innerHTML = bills.map(function (b, i) {
      return '<div class="gl bl"><span class="gi">' + ic(b[1]) + '</span><span>' + b[0] +
        '<br><small>' + b[2] + ' · ' + (b[3] ? 'Auto' : 'Manual') + '</small></span>' +
        '<button class="sw" data-i="' + i + '" aria-pressed="' + (b[3] ? 'true' : 'false') +
        '" aria-label="Autopay for ' + b[0] + '"></button></div>';
    }).join('');
    ea('.sw', function (s) {
      s.onclick = function () { bills[s.dataset.i][3] ^= 1; RB(); };
    });
  }

  [['japan', 'Kyoto'], ['home', 'Home'], ['baby', 'Baby']].forEach(function (x) {
    var b = document.createElement('button');
    b.textContent = x[1];
    b.dataset.k = x[0];
    b.onclick = function () { k = x[0]; $('pL').innerHTML = ''; R(); };
    $('pSeg').appendChild(b);
  });
  ['You', 'Maya'].forEach(function (w) {
    var b = document.createElement('button');
    b.textContent = w;
    b.setAttribute('aria-pressed', w === who);
    b.onclick = function () {
      who = w;
      ea('#pWho button', function (x) { x.setAttribute('aria-pressed', x.textContent === w); });
    };
    $('pWho').appendChild(b);
  });
  [25, 100, 250].forEach(function (a) {
    var b = document.createElement('button');
    b.textContent = '+ $' + a;
    b.onclick = function () {
      G[k].s += a;
      tot[who] += a;
      var li = document.createElement('li');
      li.className = 'gl';
      li.innerHTML = '<span>' + who + ' added $' + a + '</span><span style="opacity:.55">just now</span>';
      $('pL').prepend(li);
      while ($('pL').children.length > 2) $('pL').lastChild.remove();
      R();
    };
    $('pAdd').appendChild(b);
  });
  ['♥ love', 'Proud of us', 'Almost there'].forEach(function (t) {
    var b = document.createElement('button');
    b.textContent = t;
    b.onclick = function () { notes.unshift([who, t.replace('♥ ', '')]); R(); };
    $('pC').appendChild(b);
  });
  [['lake', 'drop', 'Lake'], ['goals', 'target', 'Goals'], ['together', 'heart', 'Us'],
   ['bills', 'receipt', 'Bills'], ['insights', 'chart', 'Insights']].forEach(function (t) {
    var b = document.createElement('button');
    b.dataset.v = t[0];
    b.setAttribute('aria-pressed', t[0] === 'lake');
    b.innerHTML = ic(t[1]) + t[2];
    b.onclick = function () { go(t[0]); };
    $('pTabs').appendChild(b);
  });
  var m = [38, 52, 46, 68, 60, 82], M = 'JFMAMJJASOND', n = new Date().getMonth();
  $('pBars').innerHTML = m.map(function (h, i) {
    return '<div><i style="height:' + h + '%"></i>' + M[(n - 5 + i + 12) % 12] + '</div>';
  }).join('');

  R(); RB(); go('lake');
  window.LP = { go: go };
})();

(function () {
  'use strict';
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .15 }) : null;
  document.querySelectorAll('[data-r]').forEach(function (e) {
    io ? io.observe(e) : e.classList.add('in');
  });

  [].forEach.call(document.querySelectorAll('[data-go]'), function (b) {
    b.onclick = function () { window.LP.go(b.dataset.go); };
  });

  var f = document.getElementById('f');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = f.querySelector('input[type=email]');
      var honeypot = f.querySelector('[name=website]');
      var thx = document.getElementById('thx');
      if (!email.checkValidity() || !email.value.trim()) { email.reportValidity(); return; }
      if (honeypot.value) return;
      var btn = f.querySelector('button[type=submit]');
      btn.disabled = true;
      fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), website: honeypot.value })
      }).then(function (r) {
        if (!r.ok) throw new Error('request failed');
        return r.json();
      }).then(function () {
        thx.textContent = 'Thank you. We’ll write to you softly.';
        f.reset();
      }).catch(function () {
        thx.textContent = 'Something went quiet. Please try again.';
      }).finally(function () { btn.disabled = false; });
    });
  }
})();
