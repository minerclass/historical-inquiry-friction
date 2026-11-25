/* Inquiry Quest: a six-episode pixel-art series for the NCSS and NSSLA 2026 decks.
   One 320x180 scene drawn at 6x onto a 1920x1080 canvas. Every frame is a pure
   function of time, so tools/render-video.swift can call render(seconds).

   The page sets window.EPISODE to one of: ncss1, ncss2, ncss3, nssla1, nssla2, nssla3,
   stages (a 30-second walk through five media environments), questions
   (28 seconds on the five technoskeptical questions), or the 26-second NCSS
   topic clips paths, moves, audit, provenance, seminar, past, and press.
   Characters: Pip (student), Ms. Vale (teacher), Dr. Lane (district leader),
   and the Skip Gate (generative AI offered as a shortcut).
   Everything here is an illustration of the framework, not study data. */
(function () {
  'use strict';
  var W = 320, H = 180, S = 6, GY = 120;
  var LEN = { stages: 30, questions: 28, paths: 26, moves: 26, audit: 26, provenance: 26, seminar: 26, past: 30, press: 28 }[window.EPISODE] || 20;
  // The NCSS set plays in an archive; the NSSLA set plays under a night sky.
  var ARCH = ['ncss1', 'ncss2', 'ncss3', 'paths', 'moves', 'audit', 'provenance', 'seminar', 'past', 'press'].indexOf(window.EPISODE) >= 0;
  var BG = ARCH ? '#221c2b' : '#101920';
  var cv = document.getElementById('c'), out = cv.getContext('2d');
  var off = document.createElement('canvas'); off.width = W; off.height = H;
  var g = off.getContext('2d');

  var C = {
    night: '#101920', sky: '#1f2c37', deep: '#18232d', slate: '#2e3c48', slate2: '#394957', line: '#4a5a66',
    mute: '#8fa0aa', paper: '#f3efe6', white: '#fffdf8', ink: '#17232d', rust: '#91462f', coral: '#d27a5c',
    peach: '#f0b48f', teal: '#2f6970', aqua: '#7fc4c9', gold: '#f5c86a', violet: '#9a7bd0', sand: '#e3dccd',
    brown: '#3a2414', wood: '#5b3d2a', leaf: '#35523f', leaf2: '#2b4334'
  };

  // ---------- helpers ----------
  var cl = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var pr = function (t, a, b) { return cl((t - a) / (b - a), 0, 1); };
  var ez = function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  var lp = function (a, b, x) { return a + (b - a) * x; };
  var hs = function (a, b, c) { var n = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return n - Math.floor(n); };
  function R(x, y, w, h, c, a) {
    if (w <= 0 || h <= 0) return;
    if (a != null) g.globalAlpha = a;
    g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    if (a != null) g.globalAlpha = 1;
  }
  function box(x, y, w, h, fill, edge) { R(x, y, w, h, edge); R(x + 1, y + 1, w - 2, h - 2, fill); }

  // ---------- 5x7 pixel font (variable width) ----------
  var F = {
    A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
    E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
    F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
    G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
    H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
    J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
    K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
    L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
    M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
    N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
    O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
    Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
    R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
    T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
    X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
    Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
    '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    '1': ['.#.', '##.', '.#.', '.#.', '.#.', '.#.', '###'],
    '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
    '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
    '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
    '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
    '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
    '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
    '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
    '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
    '.': ['.', '.', '.', '.', '.', '.', '#'],
    ',': ['..', '..', '..', '..', '..', '.#', '#.'],
    '!': ['#', '#', '#', '#', '#', '.', '#'],
    '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
    ':': ['.', '#', '.', '.', '.', '#', '.'],
    "'": ['#', '#', '.', '.', '.', '.', '.'],
    '-': ['....', '....', '....', '####', '....', '....', '....'],
    '+': ['...', '...', '.#.', '###', '.#.', '...', '...'],
    '/': ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....'],
    '>': ['#...', '.#..', '..#.', '...#', '..#.', '.#..', '#...'],
    '<': ['...#', '..#.', '.#..', '#...', '.#..', '..#.', '...#'],
    '(': ['.#', '#.', '#.', '#.', '#.', '#.', '.#'],
    ')': ['#.', '.#', '.#', '.#', '.#', '.#', '#.'],
    '·': ['.', '.', '.', '#', '.', '.', '.']
  };
  function tw(s, sc) {
    sc = sc || 1; s = String(s).toUpperCase(); var w = 0;
    for (var i = 0; i < s.length; i++) { var gl = F[s[i]]; w += ((gl ? gl[0].length : 3) + 1) * sc; }
    return w - sc;
  }
  function T(s, x, y, c, sc, al, a) {
    sc = sc || 1; s = String(s).toUpperCase();
    if (al === 'c') x -= tw(s, sc) / 2; else if (al === 'r') x -= tw(s, sc);
    x = Math.round(x); y = Math.round(y);
    if (a != null) g.globalAlpha = a;
    g.fillStyle = c;
    for (var i = 0; i < s.length; i++) {
      var gl = F[s[i]];
      if (!gl) { x += 4 * sc; continue; }
      for (var r = 0; r < 7; r++) for (var k = 0; k < gl[r].length; k++) if (gl[r][k] === '#') g.fillRect(x + k * sc, y + r * sc, sc, sc);
      x += (gl[0].length + 1) * sc;
    }
    if (a != null) g.globalAlpha = 1;
  }
  function wrap(s, maxW, sc) {
    var words = String(s).split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var tryLine = cur ? cur + ' ' + w : w;
      if (tw(tryLine, sc) > maxW && cur) { lines.push(cur); cur = w; } else cur = tryLine;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  // ---------- sprites ----------
  function spr(rows, pal, x, y, flip, a) {
    x = Math.round(x); y = Math.round(y);
    if (a != null) g.globalAlpha = a;
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r], n = row.length;
      for (var k = 0; k < n; k++) {
        var ch = row[flip ? n - 1 - k : k];
        if (ch !== '.') { g.fillStyle = pal[ch]; g.fillRect(x + k, y + r, 1, 1); }
      }
    }
    if (a != null) g.globalAlpha = 1;
  }
  var KID_TOP = [
    '...hhhhhh...', '..hhhhhhhh..', '..hhsssssh..', '..hssessesh.', '..ssssssss..', '...ssssss...',
    '..bttttttt..', '.bbttttttts.', '.bbtttttttt.', '.bbttttttt..', '..bttttttt..', '...pppppp...'
  ];
  var KID_LEGS = [
    ['...pp..pp...', '...pp..pp...', '...pp..pp...', '..ooo..ooo..'],
    ['...ppp.pp...', '..pp...pp...', '..pp....pp..', '.ooo....ooo.'],
    ['...pp.ppp...', '...pp..pp...', '....pp.pp...', '...ooo.ooo..']
  ];
  var ADULT_TOP = [
    '....hhhh....', '...hhhhhh...', '..hhhhhhhh..', '..hssssssh..', '..hsesseshh.', '..ssssssss..', '...ssssss...',
    '....ssss....', '..cccllccc..', '.cccclLcccc.', '.cccclLcccc.', '.sccclLcccs.', '..cccccccc..', '..cccccccc..'
  ];
  var ADULT_LEGS = [
    ['...pppppp...', '...pp..pp...', '...pp..pp...', '..ooo..ooo..'],
    ['...pppppp...', '..ppp..pp...', '..pp....pp..', '.ooo....ooo.'],
    ['...pppppp...', '...pp.ppp...', '....pp.pp...', '...ooo.ooo..']
  ];
  var PAL = {
    pip:  { h: C.brown, s: '#c48a66', e: C.ink, t: C.aqua, b: C.gold, p: '#34506b', o: C.ink },
    kid2: { h: '#17232d', s: '#8a5a3c', e: C.ink, t: C.coral, b: C.sand, p: '#4a5a66', o: C.ink },
    kid3: { h: '#b9773c', s: '#e0b08a', e: C.ink, t: '#7fa37a', b: C.peach, p: '#34506b', o: C.ink },
    vale: { h: '#2a1a10', s: '#a8704f', e: C.ink, c: C.rust, l: C.paper, L: C.teal, p: C.ink, o: '#0c1218' },
    lane: { h: '#c9c1b1', s: '#e0b08a', e: C.ink, c: '#34506b', l: C.paper, L: C.gold, p: '#22303b', o: '#0c1218' },
    board: { h: '#17232d', s: '#c48a66', e: C.ink, c: '#6b4a7a', l: C.paper, L: C.gold, p: '#22303b', o: '#0c1218' }
  };
  // draw fn() at k times scale with (0,0) at the point (x, fy); integer k keeps pixels square
  function at(x, fy, k, fn) { g.save(); g.translate(Math.round(x), Math.round(fy)); g.scale(k, k); fn(); g.restore(); }
  // person(kind, x, footY, {flip, walk, a, emote}); x is the center, footY the ground under the feet. Drawn at 2x.
  function person(kind, x, fy, o, t) {
    o = o || {};
    var kid = kind === 'pip' || kind === 'kid2' || kind === 'kid3';
    var top = kid ? KID_TOP : ADULT_TOP, legs = kid ? KID_LEGS : ADULT_LEGS;
    var f = o.walk ? 1 + (Math.floor(t * 8) % 2) : 0, bob = o.walk ? (Math.floor(t * 8) % 2) : 0;
    var hgt = top.length + 4, a = o.a == null ? 1 : o.a;
    if (a <= 0.01) return;
    at(x, fy, 2, function () {
      R(-5, 0, 10, 1, C.night, 0.35 * a);
      spr(top, PAL[kind], -6, -hgt - bob, o.flip, a);
      spr(legs[f], PAL[kind], -6, -hgt - bob + top.length, o.flip, a);
      if (kind === 'vale') R(o.flip ? -6 : 3, -hgt - bob - 1, 3, 3, PAL.vale.h, a);
    });
    if (o.emote) { var ey = fy - hgt * 2 - 13; box(x - 5, ey, 9, 11, C.white, C.ink); T(o.emote, x - 0.5, ey + 2, o.emoteColor || C.rust, 1, 'c'); }
  }

  // ---------- world ----------
  function hill(cx, base, h, c) { for (var i = 0; i < h; i++) R(cx - i * 2, base - h + i, i * 4 + 2, 1, c); }
  function archive(t) {
    R(0, 0, W, H, '#241f2e'); R(0, 14, W, 40, '#2d2536'); R(0, 54, W, 66, '#3a2c38');
    box(18, 26, 28, 54, '#1b2030', '#6a5062'); R(31, 27, 2, 52, '#6a5062'); R(19, 51, 26, 2, '#6a5062');
    R(36, 32, 6, 6, C.paper, 0.75 + 0.1 * Math.sin(t * 1.5));
    [66, 148, 232].forEach(function (x, k) {
      R(x, 34, 60, 86, '#2a2028'); R(x, 34, 60, 2, C.wood);
      for (var r = 0; r < 4; r++) {
        R(x, 52 + r * 18, 60, 2, C.wood);
        for (var b = 0; b < 9; b++) {
          var h = 9 + ((b * 7 + r * 5 + k * 3) % 6);
          R(x + 4 + b * 6, 52 + r * 18 - h, 4, h, ['#6f3324', '#2f6970', '#8a6412', '#4a5a66', '#5b3d2a'][(b + r + k) % 5], 0.75);
        }
      }
    });
  }
  function sky(t) {
    if (ARCH) return archive(t);
    R(0, 0, W, H, C.sky); R(0, 14, W, 34, C.deep); R(0, 48, W, 6, '#1b2832');
    for (var i = 0; i < 26; i++) {
      var x = (i * 53 + 11) % W, y = 17 + (i * 29) % 50;
      R(x, y, 1, 1, C.paper, 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 + i)));
    }
    hill(60, GY, 30, '#243340'); hill(150, GY, 42, '#22303c'); hill(250, GY, 26, '#243340');
  }
  function ground() {
    if (ARCH) {
      R(0, GY, W, 13, '#3b3340'); R(0, GY, W, 2, '#6a5a66');
      for (var q = 0; q < W; q += 16) R(q, GY + 2, 1, 11, '#2d2733');
      R(0, GY + 13, W, H, BG); return;
    }
    R(0, GY, W, 13, C.slate); R(0, GY, W, 2, C.line);
    for (var x = 0; x < W; x += 8) { R(x + 2, GY + 5, 2, 1, C.slate2); R(x + 6, GY + 9, 2, 1, C.slate2); }
    R(0, GY + 13, W, H, C.night);
  }
  function steps() {
    var body = ARCH ? '#4a3f50' : C.slate2, edge = ARCH ? '#7a6876' : C.line;
    R(176, 104, 48, 16, body); R(176, 104, 48, 2, edge);
    R(224, 88, 96, 32, body); R(224, 88, 96, 2, edge);
    for (var x = 180; x < 320; x += 12) { if (x < 224) R(x, 111, 5, 1, C.slate); else { R(x, 96, 5, 1, C.slate); R(x + 6, 108, 5, 1, C.slate); } }
  }
  function chest(x, fy, open, dim) {
    var a = dim ? 0.45 : 1;
    at(x, fy, 2, function () {
      if (!open) {
        R(-6, -9, 12, 9, C.ink, a); R(-5, -8, 10, 7, C.rust, a); R(-5, -8, 10, 2, C.coral, a); R(-1, -6, 2, 3, C.gold, a);
      } else {
        R(-6, -12, 12, 2, C.coral); R(-6, -7, 12, 7, C.ink); R(-5, -6, 10, 5, C.rust); R(-5, -9, 10, 2, C.night);
        R(-3, -21, 7, 8, C.ink); R(-2, -20, 5, 6, C.paper); R(-1, -18, 3, 1, C.mute); R(-1, -16, 3, 1, C.mute);
      }
    });
    if (!open && dim) T('?', x, fy - 30, C.mute, 1, 'c');
  }
  function scroll(x, y, a) { if (a <= 0.01) return; at(x, y, 2, function () { R(0, 0, 6, 7, C.ink, a); R(1, 1, 4, 5, C.paper, a); R(2, 3, 2, 1, C.mute, a); }); }
  function wall(x, fy, h) {
    var hh = Math.round(h / 2); if (hh < 1) return;
    at(x, fy, 2, function () {
      R(-6, -hh, 12, hh, C.rust); R(-7, -hh - 2, 14, 2, C.coral);
      for (var y = -hh + 4; y < 0; y += 5) { R(-6, y, 12, 1, '#6f3324'); R((y % 2 ? -2 : 1), y - 4, 1, 4, '#6f3324'); }
      if (hh > 14) { var m = -Math.round(hh / 2); R(-3, m - 3, 6, 6, C.ink); R(-2, m - 2, 4, 4, C.gold); R(-1, m - 1, 2, 2, C.ink); }
    });
  }
  function gate(x, fy, t, mode, a, noLabel) {
    if (a <= 0.01) return;
    var edge = mode === 'audit' ? C.aqua : C.violet;
    var cols = mode === 'audit' ? [C.teal, C.aqua, C.teal, C.deep] : [C.violet, C.aqua, C.gold, C.white, C.violet];
    var tick = Math.floor(t * (mode === 'audit' ? 3 : 9));
    at(x, fy, 2, function () {
      R(-8, -28, 16, 28, C.ink, a); R(-8, -28, 2, 28, edge, a); R(6, -28, 2, 28, edge, a); R(-8, -30, 16, 2, edge, a);
      g.globalAlpha = a;
      for (var yy = 0; yy < 27; yy++) for (var xx = 0; xx < 12; xx++) {
        g.fillStyle = cols[Math.floor(hs(xx, yy, tick) * cols.length)];
        g.fillRect(-6 + xx, -27 + yy, 1, 1);
      }
      g.globalAlpha = 1;
    });
    if (!noLabel) T(mode === 'audit' ? 'AUDIT' : 'SKIP>>', x, fy - 71, edge, 1, 'c', a);
  }
  function lantern(x, fy, lit, t, noLabel) {
    if (lit > 0) {
      var pulse = 1 + 0.08 * Math.sin(t * 5);
      [36, 25, 15].forEach(function (r, i) {
        r = r * pulse * lit;
        for (var j = -r; j <= r; j += 1) { var half = Math.round(Math.sqrt(Math.max(0, r * r - j * j))); R(x - half, fy - 30 + j, half * 2, 1, C.gold, 0.07 + i * 0.03); }
      });
    }
    R(x - 1, fy - 24, 3, 24, C.sand); R(x - 4, fy - 2, 9, 2, C.sand);
    R(x - 6, fy - 36, 13, 13, C.ink); R(x - 5, fy - 35, 11, 11, lit > 0.5 ? C.gold : C.slate); R(x - 7, fy - 38, 15, 2, C.sand);
    if (lit > 0.5) R(x - 2, fy - 33, 5, 7, C.white);
    if (!noLabel) T('ARGUMENT', Math.min(x, 294), fy - 50, lit > 0.5 ? C.gold : C.mute, 1, 'c');
  }
  function pad3(n) { n = Math.round(n); return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }
  function hud(o) {
    R(0, 0, W, 13, C.night); R(0, 13, W, 1, C.line);
    T(o.level, 6, 3, C.gold);
    if (o.mid != null) T(o.mid, 96, 3, C.paper);
    else { T('SOURCES ' + o.src + '/3', 78, 3, C.paper); T('XP ' + pad3(o.xp), 176, 3, C.aqua); }
    T(o.time, 314, 3, o.timeColor || C.peach, 1, 'r');
  }
  // dialogue box with a typewriter reveal
  function dialog(name, nameColor, text, t0, t1, t) {
    if (t < t0 || t >= t1) return;
    box(6, 133, 308, 45, C.night, C.paper); R(8, 135, 304, 41, C.night); box(7, 134, 306, 43, C.night, C.line);
    T(name, 13, 138, nameColor);
    var lines = wrap(text, 292), n = Math.floor((t - t0) * 30);
    lines.forEach(function (ln, i) {
      if (n <= 0) return;
      T(ln.slice(0, n), 13, 149 + i * 10, C.paper); n -= ln.length + 1;
    });
  }
  function bubble(cx, y, text, t0, t1, t, maxW) {
    if (t < t0 || t >= t1) return;
    var lines = wrap(text, maxW || 110), w = 0;
    lines.forEach(function (ln) { w = Math.max(w, tw(ln)); });
    w += 9; var h = lines.length * 10 + 5, x = cl(Math.round(cx - w / 2), 2, W - w - 2);
    box(x, y, w, h, C.white, C.ink); R(cx - 1, y + h, 3, 2, C.ink); R(cx, y + h, 1, 1, C.white); R(cx, y + h + 2, 1, 1, C.ink);
    var n = Math.floor((t - t0) * 30);
    lines.forEach(function (ln, i) { if (n > 0) { T(ln.slice(0, n), x + 5, y + 4 + i * 10, C.ink); n -= ln.length + 1; } });
  }
  function tagline(s, cx, y, c, t0, t1, t) { if (t >= t0 && t < t1) { var w = tw(s) + 8; R(cx - w / 2, y - 3, w, 13, C.night, 0.8); T(s, cx, y, c, 1, 'c'); } }
  function popup(s, x, y, t0, t, c) { var p = pr(t, t0, t0 + 0.9); if (p > 0 && p < 1) T(s, x, y - p * 10, c || C.gold, 1, 'c', 1 - p * p); }
  function panel(x, y, w, h) { box(x, y, w, h, C.night, C.paper); box(x + 1, y + 1, w - 2, h - 2, C.night, C.line); }

  // ---------- cards ----------
  function stars(t) { for (var i = 0; i < 40; i++) R((i * 71 + 5) % W, (i * 37 + 9) % H, 1, 1, C.paper, 0.15 + 0.3 * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.3))); }
  function titleCard(t, deck, level, name, cast) {
    R(0, 0, W, H, BG); stars(t);
    T(deck, 160, 20, C.aqua, 1, 'c');
    T('INQUIRY QUEST', 160, 36, C.gold, 3, 'c');
    R(60, 64, 200, 1, C.line);
    T(level, 160, 74, C.peach, 1, 'c');
    T(name, 160, 88, C.paper, 2, 'c');
    R(0, 150, W, 2, C.line);
    cast.forEach(function (k, i) { person(k, 160 - (cast.length - 1) * 22 + i * 44, 150, { walk: true }, t + i * 0.06); });
    if (Math.floor(t * 2.5) % 2 === 0) T('PRESS START', 160, 162, C.mute, 1, 'c');
  }
  function endCard(t, t0, lines, question) {
    var a = pr(t, t0, t0 + 0.4); if (a <= 0) return;
    g.globalAlpha = a; R(0, 0, W, H, BG); g.globalAlpha = 1;
    if (a < 1) return;
    stars(t);
    R(134, 20, 3, 12, C.gold); R(140, 20, 3, 12, C.gold); T('PAUSE', 150, 20, C.gold, 2);
    lines.forEach(function (ln, i) { T(ln, 160, 50 + i * 12, C.paper, 1, 'c', pr(t, t0 + 0.5 + i * 0.4, t0 + 0.8 + i * 0.4)); });
    var q = wrap(question, 296, 2), qy = 86 - (q.length - 1) * 4, qa = pr(t, t0 + 1.5, t0 + 1.9);
    q.forEach(function (ln, i) { T(ln, 160, qy + i * 19, C.aqua, 2, 'c', qa); });
    T('AN ILLUSTRATION OF THE FRAMEWORK. NOT STUDY DATA.', 160, 152, C.mute, 1, 'c');
    T('MICAH J. MINER · INQUIRY QUEST', 160, 164, C.line, 1, 'c');
  }

  // ---------- shared scenes ----------
  function level(t, lit, noLabel) { sky(t); ground(); steps(); lantern(302, 88, lit || 0, t, noLabel); }
  function hop(t, t0, dur, a, b) { var p = ez(pr(t, t0, t0 + dur)); return [lp(a[0], b[0], p), lp(a[1], b[1], p) - 20 * Math.sin(Math.PI * p)]; }

  function mapRoom(t, states, vals) {
    R(0, 0, W, H, '#222f3a'); R(0, 14, W, 4, '#1b2731');
    box(16, 30, 44, 38, C.night, C.wood);
    for (var i = 0; i < 9; i++) R(20 + (i * 17) % 36, 34 + (i * 11) % 30, 1, 1, C.paper, 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 + i)));
    R(37, 31, 2, 36, C.wood); R(17, 48, 42, 2, C.wood);
    R(0, GY, W, 13, C.wood); R(0, GY, W, 2, '#7a563c'); R(0, GY + 13, W, H, C.night);
    for (var x = 0; x < W; x += 20) R(x, GY + 2, 1, 11, '#4a3222');
    box(106, 20, 200, 88, C.sand, C.wood); R(108, 22, 196, 11, '#d3cab8');
    T('DISTRICT MAP', 206, 24, C.ink, 1, 'c');
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
      var k = r * 4 + c, nx = 113 + c * 47, ny = 37 + r * 22, st = states[k];
      var edge = st === 2 ? '#b8862a' : st === 1 ? C.violet : C.mute;
      box(nx, ny, 44, 19, st === 2 ? '#fff6dc' : C.white, edge); R(nx, ny, 44, 1, edge); R(nx, ny + 18, 44, 1, edge);
      if (st === 0) T('ROOM ' + (k + 1), nx + 22, ny + 6, C.mute, 1, 'c');
      else if (st === 1) { R(nx + 4, ny + 5, 5, 9, C.violet); R(nx + 5, ny + 6, 3, 8, C.aqua); T('XP 0', nx + 27, ny + 6, C.mute, 1, 'c'); }
      else { R(nx + 5, ny + 4, 4, 5, '#b8862a'); R(nx + 6, ny + 9, 2, 6, C.wood); T('XP ' + vals[k], nx + 27, ny + 6, C.teal, 1, 'c'); }
    }
  }

  // ---------- episodes ----------
  var EP = {};

  // NCSS 1: the gate offers a finished scroll; the lantern stays dark
  EP.ncss1 = function (t) {
    if (t < 2.6) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'LEVEL 1', 'THE SKIP GATE', ['pip', 'vale']);
    level(t, 0);
    var skipped = t >= 10.6;
    chest(146, GY, false, skipped); chest(204, 104, false, skipped); chest(250, 88, false, skipped);
    if (!skipped) { T('1', 146, GY - 30, C.gold, 1, 'c'); T('2', 204, 74, C.gold, 1, 'c'); T('3', 250, 58, C.gold, 1, 'c'); }
    gate(98, GY, t, 'skip', pr(t, 6.0, 6.6));
    person('vale', 18, GY, { emote: t >= 13.4 ? '?' : null }, t);
    if (t < 9.6) {
      var x = lp(48, 92, ez(pr(t, 7.2, 9.0)));
      person('pip', x, GY, { walk: t > 7.2 && t < 9.0, a: 1 - pr(t, 9.0, 9.6) }, t);
    } else if (t >= 10.6) {
      var a = pr(t, 10.6, 11.0);
      person('pip', 278, 88, { a: a }, t); scroll(286, 60, a);
    }
    var secs = Math.round(9 * pr(t, 9.6, 10.6));
    hud({ level: 'LEVEL 1', src: 0, xp: 0, time: 'TIME 0:0' + secs });
    dialog('MS. VALE', C.peach, 'QUEST: WHY DID THE REVOLUTION HAPPEN? GATHER THREE SOURCES AND LIGHT THE LANTERN.', 2.9, 6.1, t);
    dialog('SKIP GATE', C.violet, 'FINISHED SCROLL IN 9 SECONDS. NO SOURCES NEEDED.', 6.4, 10.6, t);
    if (t >= 11.0) {
      panel(40, 18, 176, 58);
      T('QUEST COMPLETE!', 128, 24, C.gold, 1, 'c');
      if (t >= 11.6) T('GRADE: A', 128, 36, C.paper, 1, 'c');
      if (t >= 12.3) T('SOURCES READ 0/3', 128, 48, C.coral, 1, 'c');
      if (t >= 13.0) T('XP GAINED +0', 128, 60, C.coral, 1, 'c');
    }
    dialog('MS. VALE', C.peach, 'THE SCROLL IS DONE. THE LANTERN IS STILL DARK.', 13.4, 15.4, t);
    endCard(t, 15.2, ['THE SCROLL LOOKS FINISHED.', 'THE LANTERN IS STILL DARK.'], 'WHAT DID PIP SKIP?');
  };

  // NCSS 2: one wall blocks access; one climb builds understanding
  EP.ncss2 = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'LEVEL 2', 'TWO WALLS', ['pip', 'vale']);
    level(t, 0);
    var h = 52 * (1 - ez(pr(t, 7.9, 8.7)));
    var s1 = t >= 9.6, s2 = t >= 12.5, s3 = t >= 13.4, src = (s1 ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0);
    gate(108, GY, t, t >= 11.7 ? 'audit' : 'skip', pr(t, 10.2, 10.7));
    wall(108, GY, h);
    chest(142, GY, s1); chest(212, 104, s2); chest(262, 88, s3);
    if (t >= 10.0 && t < 15) { R(177, 108, 46, 9, C.night, 0.7); T('LOYALIST', 200, 109, C.peach, 1, 'c'); R(240, 100, 44, 9, C.night, 0.7); T('PATRIOT', 262, 101, C.aqua, 1, 'c'); }
    // Ms. Vale
    var vx = t < 6.4 ? 18 : t < 7.4 ? lp(18, 50, ez(pr(t, 6.4, 7.4))) : t < 8.9 ? 50 : lp(50, 70, ez(pr(t, 8.9, 9.6)));
    person('vale', vx, GY, { walk: (t > 6.4 && t < 7.4) || (t > 8.9 && t < 9.6) }, t);
    if (t >= 7.4 && t < 7.9) { var kx = lp(62, 72, pr(t, 7.4, 7.9)); R(kx, GY - 24, 7, 2, C.gold); R(kx - 4, GY - 26, 5, 6, C.gold); R(kx - 2, GY - 24, 1, 2, C.ink); R(kx + 4, GY - 22, 1, 2, C.gold); }
    // Pip
    var px, py = GY, walking = false, emote = null, flip = false;
    if (t < 4.2) { px = lp(46, 82, ez(pr(t, 2.3, 4.2))); walking = t > 2.3; }
    else if (t < 8.9) { px = 82 - 6 * Math.sin(Math.PI * pr(t, 4.2, 4.6)); emote = t > 4.3 && t < 6.2 ? '!' : null; }
    else if (t < 9.6) { px = lp(82, 122, ez(pr(t, 8.9, 9.6))); walking = true; }
    else if (t < 10.0) { px = 122; }
    else if (t < 10.6) { px = lp(122, 160, ez(pr(t, 10.0, 10.6))); walking = true; }
    else if (t < 12.1) { px = 160; flip = t < 11.9; emote = t < 11.6 ? '?' : null; }
    else if (t < 12.5) { var a = hop(t, 12.1, 0.4, [160, GY], [190, 104]); px = a[0]; py = a[1]; }
    else if (t < 13.0) { px = 190; py = 104; }
    else if (t < 13.4) { var b = hop(t, 13.0, 0.4, [190, 104], [238, 88]); px = b[0]; py = b[1]; }
    else { px = lp(238, 282, ez(pr(t, 13.7, 14.5))); py = 88; walking = t > 13.7 && t < 14.5; }
    person('pip', px, py, { walk: walking, emote: emote, flip: flip }, t);
    popup('+20 XP', 142, GY - 46, 9.6, t); popup('+20 XP', 212, 58, 12.5, t); popup('+20 XP', 262, 42, 13.4, t);
    hud({ level: 'LEVEL 2', src: src, xp: src * 20, time: 'NO TIMER', timeColor: C.aqua });
    if (h > 4) T('DENSE 1765 TEXT', 108, 52, C.paper, 1, 'c');
    tagline('EXCLUSIONARY FRICTION', 108, 36, C.peach, 4.6, 7.9, t);
    tagline('BARRIER REMOVED', 108, 52, C.aqua, 8.7, 10.1, t);
    tagline('PRODUCTIVE FRICTION', 236, 24, C.aqua, 12.1, 15.2, t);
    dialog('PIP', C.aqua, "I CAN'T EVEN READ THIS ONE.", 4.4, 6.3, t);
    dialog('MS. VALE', C.peach, 'THAT WALL TEACHES NOTHING. TAKE THE GLOSSARY KEY. AI CAN OPEN DOORS.', 6.5, 9.9, t);
    dialog('SKIP GATE', C.violet, 'TWO SOURCES DISAGREE. I CAN SETTLE IT FOR YOU.', 10.2, 11.7, t);
    dialog('MS. VALE', C.peach, "DON'T SKIP IT. AUDIT IT. WHO IS MISSING FROM ITS ANSWER?", 11.7, 15.2, t);
    endCard(t, 15.0, ['ONE WALL BLOCKED PIP.', 'ONE CLIMB TAUGHT PIP.'], 'WHICH FRICTION WOULD YOU REMOVE?');
  };

  // NCSS 3: the defense lights the lantern
  EP.ncss3 = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'FINAL LEVEL', 'THE DEFENSE', ['pip', 'vale']);
    var lit = ez(pr(t, 8.2, 9.0));
    level(t, lit);
    gate(108, GY, t, 'audit', 1);
    chest(142, GY, true); chest(212, 104, true); chest(258, 88, true);
    person('vale', 68, GY, {}, t);
    person('kid2', 190, 104, { emote: t >= 8.6 && t < 10.5 ? '!' : null }, t);
    person('kid3', 236, 88, { emote: t >= 8.9 && t < 10.5 ? '!' : null }, t);
    person('pip', 284, 88, { flip: true }, t);
    [0, 1, 2].forEach(function (i) { var a = pr(t, 5.0 + i * 0.6, 5.3 + i * 0.6) * (1 - pr(t, 8.0, 8.3)); scroll(262 + i * 15, 24 - 4 * a, a); });
    var xp = Math.round(lp(60, 120, pr(t, 8.2, 9.2)));
    hud({ level: 'FINAL LEVEL', src: 3, xp: xp, time: 'NO TIMER', timeColor: C.aqua });
    bubble(180, 40, 'HOW DO YOU KNOW?', 2.5, 4.8, t, 110);
    dialog('PIP', C.aqua, 'THE LETTER AND THE PAMPHLET DISAGREE. I WEIGHED BOTH. HERE IS MY CLAIM.', 4.8, 8.2, t);
    if (t >= 9.3 && t < 14.9) {
      panel(6, 17, 206, 58);
      T('QUEST COMPLETE!', 109, 23, C.gold, 1, 'c');
      if (t >= 9.9) T('LEVEL 1: SCROLL, XP 0', 109, 35, C.coral, 1, 'c');
      if (t >= 10.5) T('LEVEL 3: ARGUMENT, XP 120', 109, 47, C.aqua, 1, 'c');
      if (t >= 11.1) T('SAME GRADE. DIFFERENT LEARNING.', 109, 61, C.paper, 1, 'c');
    }
    dialog('MS. VALE', C.peach, 'THE GATE STAYS. ITS JOB CHANGED: ACCESS, CHALLENGE, FEEDBACK, REFLECTION.', 11.8, 14.9, t);
    endCard(t, 14.8, ['AI SHOULD STRENGTHEN INQUIRY,', 'NOT QUIETLY REMOVE IT.'], 'WHAT WILL YOU KEEP DIFFICULT ON PURPOSE?');
  };

  // NSSLA 1: everyone wants a plan; every room finishes and nobody reads a source
  EP.nssla1 = function (t) {
    if (t < 2.2) return titleCard(t, 'NSSLA 2026', 'LEVEL 1', 'EVERYONE WANTS A PLAN', ['lane', 'vale']);
    var states = [], done = 0;
    for (var k = 0; k < 12; k++) { var on = t >= 7.8 + k * 0.3; states.push(on ? 1 : 0); if (on) done++; }
    mapRoom(t, states, []);
    var bx = lp(-14, 16, ez(pr(t, 2.4, 3.2)));
    person('board', bx, GY, { walk: t > 2.4 && t < 3.2 }, t);
    var vx = lp(-14, 46, ez(pr(t, 4.6, 5.6)));
    person('vale', vx, GY, { walk: t > 4.6 && t < 5.6 }, t);
    person('lane', 84, GY, { emote: t >= 11.4 && t < 14.9 ? '?' : null }, t);
    hud({ level: 'MAP ROOM', mid: 'QUESTS DONE ' + done + '/12', time: 'SOURCES READ 0', timeColor: done ? C.coral : C.peach });
    bubble(30, 42, 'WE NEED AN AI PLAN BY MONDAY!', 2.9, 5.2, t, 84);
    bubble(50, 42, 'CAN STUDENTS USE IT ON FRIDAY?', 5.6, 7.8, t, 84);
    dialog('MS. VALE', C.peach, 'EVERY ROOM FINISHED THE QUEST. NOBODY OPENED A SOURCE.', 8.0, 11.6, t);
    dialog('DR. LANE', C.gold, 'THE GRADES LOOK FINE. SO WHO BUILT THIS LEVEL?', 11.8, 15.2, t);
    endCard(t, 15.0, ['EVERY CLASSROOM PLAYS THE LEVEL', 'THE SYSTEM DESIGNS.'], 'WHERE DOES YOUR SYSTEM REWARD SPEED?');
  };

  // NSSLA 2: four signs, four directions; then the leader redraws the level
  var SIGNS = [
    { name: 'POLICY', a: ['GATE BANNED'], b: ['WHAT AI', 'IS FOR'], dir: 'l' },
    { name: 'LEARNING', a: ['USE THE GATE', 'FASTER'], b: ['JUDGE THE', 'SOURCES'], dir: 'r' },
    { name: 'ASSESSMENT', a: ['SCROLL ONLY'], b: ['SHOW THE', 'REASONING'], dir: 'd' },
    { name: 'MESSAGES', a: ['? ? ?'], b: ['WHY FRICTION', 'MATTERS'], dir: 'u' }
  ];
  function arrow(x, y, dir, c) {
    if (dir === 'd' || dir === 'u') {
      var s = dir === 'u' ? -1 : 1;
      R(x - 1, y - 4, 2, 8, c); R(x - 3, y + s * 2 - (s < 0 ? 1 : 0), 6, 1, c); R(x - 2, y + s * 3 - (s < 0 ? 1 : 0), 4, 1, c);
      return;
    }
    var d = dir === 'l' ? -1 : 1;
    R(x - 4, y - 1, 8, 2, c); R(x + d * 2 - (d < 0 ? 1 : 0), y - 3, 1, 6, c); R(x + d * 3 - (d < 0 ? 1 : 0), y - 2, 1, 4, c);
  }
  function sign(i, t, tFlip) {
    var sg = SIGNS[i], x = 2 + i * 80, k = pr(t, tFlip, tFlip + 0.5), after = k >= 0.5;
    var squash = Math.abs(1 - 2 * k), h = Math.max(2, Math.round(36 * squash)), y = 16 + (36 - h) / 2;
    var edge = after ? C.aqua : C.coral;
    box(x, y, 76, h, after ? '#16343a' : '#2a2226', edge);
    if (h < 34) return;
    T(sg.name, x + 4, y + 3, edge, 1);
    arrow(x + 69, y + 6, after ? 'r' : sg.dir, edge);
    R(x + 4, y + 12, 68, 1, edge, 0.5);
    var lines = after ? sg.b : sg.a;
    lines.forEach(function (ln, j) { T(ln, x + 38, y + (lines.length === 1 ? 20 : 15) + j * 10, C.paper, 1, 'c'); });
  }
  EP.nssla2 = function (t) {
    if (t < 2.2) return titleCard(t, 'NSSLA 2026', 'LEVEL 2', 'FOUR SIGNS', ['lane', 'vale', 'pip']);
    level(t, 0, true);
    var long = t >= 13.0, s1 = t >= 14.5, gone = !long && t >= 7.4;
    chest(146, GY, s1, gone); chest(204, 104, false, gone); chest(250, 88, false, gone);
    gate(98, GY, t, 'skip', long ? 0.3 : 1, true);
    for (var i = 0; i < 4; i++) sign(i, t, 9.8 + i * 0.9);
    person('vale', 14, GY, {}, t);
    person('lane', lp(-14, 40, ez(pr(t, 8.6, 9.6))), GY, { walk: t > 8.6 && t < 9.6 }, t);
    if (t < 6.6) {
      var x = t < 5.8 ? lp(40, 64, ez(pr(t, 2.4, 3.4))) : lp(64, 94, ez(pr(t, 5.8, 6.4)));
      person('pip', x, GY, { walk: (t > 2.4 && t < 3.4) || t > 5.8, emote: t > 3.5 && t < 5.7 ? '?' : null, a: 1 - pr(t, 6.2, 6.6) }, t);
    } else if (t >= 7.4 && t < 13.0) {
      var a = pr(t, 7.4, 7.8) * (1 - pr(t, 12.6, 13.0));
      person('pip', 278, 88, { a: a }, t); scroll(286, 60, a);
    } else if (t >= 13.0) {
      person('pip', lp(66, 124, ez(pr(t, 13.3, 14.5))), GY, { walk: t > 13.3 && t < 14.5, a: pr(t, 13.0, 13.3) }, t);
    }
    popup('+20 XP', 146, GY - 46, 14.5, t);
    var left = Math.max(0, 5 - Math.floor((t - 2.6) * 1.4)), flash = left <= 1 && Math.floor(t * 6) % 2 === 0;
    hud({ level: 'LEVEL 2', src: s1 ? 1 : 0, xp: s1 ? 20 : 0, time: long ? 'UNIT +1 WEEK' : 'ENDS IN 0:0' + left, timeColor: long ? C.aqua : (flash ? C.white : C.coral) });
    dialog('MS. VALE', C.peach, 'FOUR SIGNS, FOUR DIRECTIONS. AND THE UNIT ENDS FRIDAY.', 3.2, 6.6, t);
    dialog('MS. VALE', C.peach, 'THE CLOCK WINS. PIP TAKES THE GATE.', 6.8, 9.2, t);
    dialog('DR. LANE', C.gold, "LET'S REDRAW THE LEVEL. ONE SIGN AT A TIME.", 9.4, 13.0, t);
    dialog('MS. VALE', C.peach, 'NOW THERE IS ROOM FOR THE CLIMB.', 13.2, 15.2, t);
    endCard(t, 15.0, ['COHERENCE IS THE FRICTION.'], 'WHICH SIGN IN YOUR SYSTEM POINTS THE WRONG WAY?');
  };

  // NSSLA 3: the redrawn map makes room for the climb in every classroom
  EP.nssla3 = function (t) {
    if (t < 2.2) return titleCard(t, 'NSSLA 2026', 'FINAL LEVEL', 'ROOM FOR THE CLIMB', ['lane', 'vale', 'pip']);
    if (t < 8.2) {
      var states = [], vals = [], n = 0;
      for (var k = 0; k < 12; k++) {
        var p = pr(t, 2.8 + k * 0.35, 3.6 + k * 0.35); states.push(p > 0 ? 2 : 1); vals.push(Math.round(p * 6) * 20); if (p > 0) n++;
      }
      mapRoom(t, states, vals);
      person('vale', 40, GY, {}, t); person('lane', 84, GY, {}, t);
      hud({ level: 'MAP ROOM', mid: 'ROOMS CLIMBING ' + n + '/12', time: 'SOURCES READ ' + n * 3, timeColor: C.aqua });
      dialog('MS. VALE', C.peach, 'YOU GAVE US THE EXTRA WEEK. I HAD TIME FOR CONFERENCES.', 3.0, 6.0, t);
      dialog('DR. LANE', C.gold, 'POLICY, LEARNING, ASSESSMENT, MESSAGES: ONE DIRECTION.', 6.1, 8.2, t);
      R(0, 0, W, H, C.night, pr(t, 7.9, 8.2));
    } else {
      var lit = ez(pr(t, 8.8, 9.6));
      level(t, lit);
      gate(108, GY, t, 'audit', 1);
      chest(142, GY, true); chest(212, 104, true); chest(258, 88, true);
      person('lane', 36, GY, {}, t); person('vale', 68, GY, {}, t);
      person('kid2', 190, 104, { emote: t >= 9.2 && t < 11 ? '!' : null }, t); person('kid3', 236, 88, { emote: t >= 9.5 && t < 11 ? '!' : null }, t);
      person('pip', 284, 88, {}, t);
      hud({ level: 'FINAL LEVEL', src: 3, xp: Math.round(lp(60, 120, pr(t, 8.8, 9.8))), time: 'NO TIMER', timeColor: C.aqua });
      if (t >= 9.9 && t < 12.0) { panel(30, 18, 150, 46); T('QUEST COMPLETE!', 105, 24, C.gold, 1, 'c'); T('SOURCES 3/3', 105, 37, C.paper, 1, 'c'); T('XP +120', 105, 49, C.aqua, 1, 'c'); }
      if (t >= 12.0) {
        panel(6, 17, 222, 60);
        T('TAKE HOME: 3 ITEMS', 117, 23, C.gold, 1, 'c');
        ['ONE STEP THIS MONTH', 'ONE DOCUMENT TO REVISE', 'ONE FRICTION POINT TO STRENGTHEN'].forEach(function (ln, i) {
          if (t >= 12.4 + i * 0.6) { box(13, 35 + i * 13, 9, 11, C.gold, C.paper); T(String(i + 1), 17.5, 37 + i * 13, C.ink, 1, 'c'); T(ln, 27, 37 + i * 13, C.paper); }
        });
      }
      R(0, 0, W, H, C.night, 1 - pr(t, 8.2, 8.5));
    }
    endCard(t, 15.0, ['INFRASTRUCTURE FRICTION MAKES ROOM', 'FOR THE CLIMB IN EVERY CLASSROOM.'], 'WHAT WILL YOU KEEP DIFFICULT ON PURPOSE?');
  };

  // Five media environments: Ong's three, then the two proposed in this study.
  // Names and one-line ideas follow the public Echoes walk (minerclass/echoes).
  var WORLDS = [
    { name: 'PRIMARY ORALITY', who: 'ONG (1982)', idea: 'KNOWLEDGE LIVES IN MEMORY AND VOICE. IT RETURNS THROUGH PERFORMANCE.' },
    { name: 'LITERACY AND PRINT', who: 'ONG (1982)', idea: 'WRITING HOLDS THE WORD STILL. YOU CAN RETURN TO IT AND COMPARE.' },
    { name: 'SECONDARY ORALITY', who: 'ONG (1982)', idea: 'BROADCAST CARRIES A VOICE TO DISTANT LISTENERS, BUILT ON WRITING AND PRINT.' },
    { name: 'ALGORITHMIC SECONDARY ORALITY', who: 'MINER (PROPOSED)', idea: 'PEOPLE STILL WRITE THE WORDS. ALGORITHMS DECIDE WHOSE WORDS CIRCULATE.' },
    { name: 'TERTIARY ALGORITHMICITY', who: 'MINER (PROPOSED)', idea: 'ALGORITHMS NOW GENERATE THE WORDS. HUMAN AUTHORSHIP BECOMES OPTIONAL.' }
  ];
  function tree(x, h) {
    R(x - 2, GY - Math.round(h * 0.35), 4, Math.round(h * 0.35), C.wood);
    for (var k = 0; k < h * 0.7; k += 3) { var w = 3 + Math.round(k * 0.55); R(x - w, GY - h + k, w * 2, 3, k % 6 ? C.leaf : C.leaf2); }
  }
  function ring(cx, cy, r, c, a) {
    for (var d = 0; d < 360; d += 6) { var q = d * Math.PI / 180; R(cx + Math.cos(q) * r, cy + Math.sin(q) * r * 0.6, 1, 1, c, a); }
  }
  function card(x, y, w, boosted, a) {
    R(x, y, w, 9, boosted ? C.gold : C.line, a); R(x + 1, y + 1, w - 2, 7, boosted ? '#fff6dc' : C.paper, a);
    R(x + 3, y + 3, w - 8, 1, C.mute, a); R(x + 3, y + 5, w - 12, 1, C.mute, a);
  }
  function world(i, lt, t) {
    var px = lp(28, 132, ez(pr(lt, 0.3, 3.4))), walking = lt > 0.3 && lt < 3.4;
    if (i === 0) {            // the living grove
      sky(t); R(0, GY, W, 13, C.leaf2); R(0, GY, W, 2, C.leaf); R(0, GY + 13, W, H, C.night);
      [14, 60, 150, 286, 310].forEach(function (x, k) { tree(x, 58 + (k * 13) % 26); });
      R(204, GY - 3, 14, 3, C.wood);
      var f = Math.floor(t * 8) % 3; R(207, GY - 9 - f, 8, 6 + f, C.coral); R(209, GY - 12 - f, 4, 6, C.gold);
      R(196, GY - 26, 30, 26, C.gold, 0.06);
      person('kid2', 180, GY, {}, t); person('vale', 244, GY, { flip: true }, t);
      for (var k = 0; k < 3; k++) { var d = ((lt * 22 + k * 14) % 42); R(228 - d, GY - 30 - k * 2, 1, 7, C.peach, 1 - d / 42); }
    } else if (i === 1) {     // the garden of lasting marks
      R(0, 0, W, H, '#26384a'); R(0, 60, W, 30, '#3a4656'); R(0, 84, W, 36, '#4a4a56', 0.5);
      hill(80, GY, 34, '#2b3c4b'); hill(250, GY, 28, '#2b3c4b');
      R(0, GY, W, 13, '#5a6670'); R(0, GY, W, 2, C.mute); R(0, GY + 13, W, H, C.night);
      box(196, GY - 64, 34, 64, C.sand, C.ink); R(192, GY - 4, 42, 4, C.mute);
      var marks = Math.floor(pr(lt, 0.6, 3.6) * 9);
      for (var m = 0; m < marks; m++) R(201, GY - 58 + m * 6, 16 + (m * 7) % 9, 2, C.ink);
      R(262, GY - 22, 3, 22, C.wood); R(250, GY - 28, 28, 5, C.wood); R(252, GY - 33, 11, 6, C.paper); R(265, GY - 33, 11, 6, C.paper); R(263, GY - 33, 2, 6, C.mute);
      person('kid3', 292, GY, { flip: true }, t);
    } else if (i === 2) {     // the valley of distant voices
      sky(t); ground();
      R(196, GY - 76, 2, 76, C.sand); R(190, GY - 60, 14, 1, C.sand); R(192, GY - 44, 10, 1, C.sand); R(194, GY - 78, 6, 3, C.coral);
      for (var k2 = 0; k2 < 3; k2++) { var rr = (lt * 34 + k2 * 30) % 90; ring(197, GY - 76, rr, C.aqua, 1 - rr / 90); }
      [246, 272, 298].forEach(function (x, k) {
        R(x - 9, GY - 16, 18, 16, C.slate2); for (var q = 0; q < 6; q++) R(x - 9 + q * 2 - 2, GY - 17 - q, 22 - q * 4, 1, C.wood);
        R(x - 3, GY - 11, 6, 6, lt > 1.0 + k * 0.7 ? C.gold : C.night);
      });
      R(150, GY - 20, 2, 20, C.mute); R(147, GY - 25, 8, 6, C.ink);
    } else if (i === 3) {     // the river of attention
      R(0, 0, W, H, '#1c2030'); ground();
      person('kid2', 30, GY, {}, t); person('kid3', 60, GY, {}, t);
      box(170, 26, 110, 94, '#141826', C.violet); R(170, 26, 110, 11, C.violet); T('THE FEED', 225, 28, C.white, 1, 'c');
      for (var c = 0; c < 9; c++) {
        var boosted = c % 3 === 0, y = 112 - ((lt * (boosted ? 26 : 9) + c * 23) % 80);
        if (y > 39 && y < 110) card(boosted ? 176 : 190 + (c * 17) % 40, y, boosted ? 96 : 44, boosted, boosted ? 1 : 0.32);
      }
      for (var e = 0; e < 3; e++) { var q2 = (lt * 0.5 + e * 0.33) % 1; card(lp(70, 172, q2), GY - 40 - Math.sin(q2 * Math.PI) * 18, 14, false, 0.9); }
    } else {                  // the world that writes itself
      R(0, 0, W, H, '#15202a'); stars(t); ground();
      gate(216, GY, t, 'skip', 1, true);
      for (var s2 = 0; s2 < 10; s2++) {
        var q3 = (lt * 0.42 + s2 * 0.1) % 1, dir = s2 % 2 ? 1 : -1;
        scroll(216 + dir * q3 * (40 + s2 * 6) - 6, GY - 40 - Math.sin(q3 * Math.PI) * (30 + s2 * 3), 1 - q3 * 0.4);
      }
      var pile = Math.floor(pr(lt, 0.4, 4.2) * 9);
      for (var p2 = 0; p2 < pile; p2++) scroll(244 + (p2 % 5) * 13, GY - 14 - Math.floor(p2 / 5) * 12, 1);
      tagline('AUTHOR: ?', 216, 30, C.violet, 0, 99, lt > 1.2 ? 1 : -1);
    }
    person('pip', px, GY, { walk: walking, emote: i === 4 && lt > 3.5 ? '?' : null }, t);
    R(px - 2, GY - 44 - Math.round(Math.sin(t * 4) * 2), 4, 4, C.gold); R(px - 1, GY - 45 - Math.round(Math.sin(t * 4) * 2), 2, 6, C.gold);
  }
  EP.stages = function (t) {
    if (t < 2.4) return titleCard(t, 'ONG AND AFTER', 'THE BACKSTORY', 'FIVE STAGES OF THE WORD', ['pip']);
    var D = 4.4, i = Math.min(4, Math.floor((t - 2.4) / D)), lt = t - 2.4 - i * D, w = WORLDS[i], mine = i > 2;
    if (t < 24.4) {
      world(i, lt, t);
      R(0, 0, W, 13, C.night); R(0, 13, W, 1, C.line);
      T('STAGE ' + (i + 1) + ' OF 5', 6, 3, C.gold); T(w.who, 314, 3, mine ? C.violet : C.aqua, 1, 'r');
      for (var k = 0; k < 5; k++) R(8 + k * 62, k === i ? 16 : 17, 58, k === i ? 5 : 3, k > 2 ? C.violet : C.aqua, k <= i ? 1 : 0.25);
      box(6, 133, 308, 45, C.night, C.paper); R(8, 135, 304, 41, C.night); box(7, 134, 306, 43, C.night, C.line);
      T(w.name, 13, 138, mine ? C.violet : C.aqua);
      var lines = wrap(w.idea, 292), n = Math.floor((lt - 0.3) * 34);
      lines.forEach(function (ln, j) { if (n > 0) { T(ln.slice(0, n), 13, 150 + j * 10, C.paper); n -= ln.length + 1; } });
      R(0, 0, W, H, C.night, cl(Math.max(1 - lt / 0.25, (lt - (D - 0.25)) / 0.25), 0, 1));
    }
    endCard(t, 24.4, ['ONG NAMED THREE STAGES OF THE WORD.', 'THIS STUDY PROPOSES TWO MORE.'], 'WHICH STAGE ARE YOUR STUDENTS LEARNING IN?');
  };

  // The five technoskeptical questions, worded as on civicsoftechnology.org/curriculum,
  // each under a paraphrase of the Postman (1998) idea it was adapted from.
  var QS = [
    { idea: 'EVERY TECHNOLOGY IS A TRADE-OFF', q: 'WHAT DOES SOCIETY GIVE UP FOR THE BENEFITS OF THE TECHNOLOGY?' },
    { idea: 'THERE ARE WINNERS AND LOSERS', q: 'WHO IS HARMED AND WHO BENEFITS FROM THE TECHNOLOGY?' },
    { idea: 'EVERY TECHNOLOGY CARRIES AN IDEA', q: 'WHAT DOES THE TECHNOLOGY NEED?' },
    { idea: 'CHANGE IS ECOLOGICAL, NOT ADDITIVE', q: 'WHAT ARE THE UNINTENDED OR UNEXPECTED CHANGES CAUSED BY THE TECHNOLOGY?' },
    { idea: 'TECHNOLOGIES BECOME MYTHIC', q: 'WHY IS IT DIFFICULT TO IMAGINE OUR WORLD WITHOUT THE TECHNOLOGY?' }
  ];
  EP.questions = function (t) {
    if (t < 2.2) return titleCard(t, 'POSTMAN AND CIVICS OF TECHNOLOGY', 'BEFORE THE GATE OPENS', 'FIVE QUESTIONS', ['lane', 'vale']);
    var D = 4.0, i = Math.min(4, Math.floor((t - 2.2) / D)), lt = t - 2.2 - i * D, G = 176;
    if (t < 22.2) {
      sky(t); ground();
      if (i === 4) { [150, 206, 232, 300].forEach(function (x, k) { tree(x, Math.round((40 + k * 9) * ez(pr(lt, 0.3, 2.6)))); }); }
      gate(G, GY, t, 'skip', i === 4 ? lp(1, 0.4, pr(lt, 0.5, 2.8)) : 1, true);
      person('lane', 40, GY, { emote: lt > 0.4 && lt < 1.6 ? '?' : null }, t); person('vale', 80, GY, {}, t);
      if (i === 0) {          // a trade-off: something arrives, something dims
        lantern(286, GY, 1 - ez(pr(lt, 1.6, 3.0)), t, true);
        scroll(214, GY - 36 - 10 * pr(lt, 0.5, 1.2), pr(lt, 0.5, 0.9));
        tagline('+ A FINISHED SCROLL', 232, 40, C.aqua, 0.8, 9, lt); tagline('- THE PRACTICE', 270, 58, C.coral, 2.0, 9, lt);
      } else if (i === 1) {   // winners and losers
        person('kid2', 232, GY, { emote: lt > 1.0 ? '+' : null, emoteColor: C.teal }, t); person('pip', 264, GY, {}, t);
        person('kid3', 296, GY, { emote: lt > 1.8 ? '!' : null }, t);
        tagline('BENEFITS', 232, 54, C.aqua, 1.0, 9, lt); tagline('HARMED', 296, 54, C.coral, 1.8, 9, lt);
      } else if (i === 2) {   // what it needs flows in
        ['STUDENT DATA', 'ATTENTION', 'ALWAYS ONLINE'].forEach(function (wd, k) {
          var q2 = pr(lt, 0.5 + k * 0.7, 2.3 + k * 0.7);
          if (q2 > 0 && q2 < 1) T(wd, lp(268, G + 44, ez(q2)), 46 + k * 22, C.gold, 1, 'c', 1 - q2 * q2 * q2);
        });
        R(G + 16, GY - 30, Math.round(120 * pr(lt, 0.4, 1.2)), 1, C.violet, 0.6); R(G + 16, GY - 12, Math.round(120 * pr(lt, 0.6, 1.4)), 1, C.violet, 0.6);
      } else if (i === 3) {   // ecological change ripples outward
        for (var k3 = 0; k3 < 3; k3++) { var rr = (lt * 44 + k3 * 34) % 120; ring(G, GY - 30, rr, C.violet, 1 - rr / 120); }
        [224, 256, 288].forEach(function (x, k) { chest(x, GY, false, lt > 0.9 + k * 0.7); });
        tagline('NOBODY CHOSE THIS PART', 232, 40, C.peach, 2.4, 9, lt);
      } else {                // it starts to look like scenery
        tagline('WAS IT ALWAYS HERE?', G, 30, C.violet, 2.4, 9, lt);
      }
      R(0, 0, W, 13, C.night); R(0, 13, W, 1, C.line);
      T('QUESTION ' + (i + 1) + ' OF 5', 6, 3, C.gold); T('CIVICS OF TECHNOLOGY', 314, 3, C.aqua, 1, 'r');
      for (var k = 0; k < 5; k++) R(8 + k * 62, k === i ? 16 : 17, 58, k === i ? 5 : 3, C.gold, k <= i ? 1 : 0.25);
      box(6, 133, 308, 45, C.night, C.paper); R(8, 135, 304, 41, C.night); box(7, 134, 306, 43, C.night, C.line);
      T('POSTMAN: ' + QS[i].idea, 13, 138, C.peach);
      var lines = wrap(QS[i].q, 292), n = Math.floor((lt - 0.3) * 34);
      lines.forEach(function (ln, j) { if (n > 0) { T(ln.slice(0, n), 13, 150 + j * 10, C.paper); n -= ln.length + 1; } });
      R(0, 0, W, H, C.night, cl(Math.max(1 - lt / 0.25, (lt - (D - 0.25)) / 0.25), 0, 1));
    }
    endCard(t, 22.2, ['POSTMAN GAVE US FIVE IDEAS.', 'CIVICS OF TECHNOLOGY TURNED THEM INTO QUESTIONS.'], 'WHICH ONE HAS YOUR DISTRICT NEVER ASKED OUT LOUD?');
  };

  // ---------- NCSS topic clips ----------
  function cap(name, color, text, lt) {
    box(6, 133, 308, 45, C.night, C.paper); R(8, 135, 304, 41, C.night); box(7, 134, 306, 43, C.night, C.line);
    T(name, 13, 138, color);
    var lines = wrap(text, 292), n = Math.floor((lt - 0.3) * 34);
    lines.forEach(function (ln, j) { if (n > 0) { T(ln.slice(0, n), 13, 150 + j * 10, C.paper); n -= ln.length + 1; } });
  }
  function bar5(i, n, c) { for (var k = 0; k < n; k++) { var w = Math.floor(304 / n) - 4; R(8 + k * (w + 4), k === i ? 16 : 17, w, k === i ? 5 : 3, c, k <= i ? 1 : 0.25); } }
  function topline(left, right, rc) { R(0, 0, W, 13, C.night); R(0, 13, W, 1, C.line); T(left, 6, 3, C.gold); T(right, 314, 3, rc || C.aqua, 1, 'r'); }
  function cut(lt, D) { R(0, 0, W, H, C.night, cl(Math.max(1 - lt / 0.25, (lt - (D - 0.25)) / 0.25), 0, 1)); }
  function checklist(title, color, items, times, struck, lt) {
    panel(6, 18, 152, 60); T(title, 12, 23, color);
    items.forEach(function (it, k) {
      if (lt < times[k]) return;
      var y = 35 + k * 10;
      if (struck[k]) { T(it, 24, y, C.mute); R(22, y + 3, tw(it) + 4, 1, C.coral); R(12, y + 2, 7, 2, C.coral); }
      else { R(12, y + 3, 2, 2, C.aqua); R(14, y + 5, 2, 2, C.aqua); R(16, y + 3, 2, 2, C.aqua); R(18, y + 1, 2, 2, C.aqua); T(it, 24, y, C.paper); }
    });
  }

  // Two paths: the same finished scroll, reached with AI as an exit or as an entry (NCSS slide 5).
  EP.paths = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'SIDE QUEST', 'TWO PATHS', ['kid2', 'pip']);
    if (t < 10.2) {                                     // AI as exit
      var a = t - 2.2, gone = a >= 3.2;
      level(t, 0);
      chest(100, GY, false, gone); chest(212, 104, false, gone); chest(262, 88, false, gone);
      gate(150, GY, t, 'skip', 1, true);
      person('vale', 20, GY, {}, t);
      if (a < 2.8) person('kid2', lp(44, 142, ez(pr(a, 0.4, 2.2))), GY, { walk: a > 0.4 && a < 2.2, a: 1 - pr(a, 2.2, 2.8) }, t);
      else if (gone) { person('kid2', 284, 88, { a: pr(a, 3.2, 3.6) }, t); scroll(292, 60, pr(a, 3.2, 3.6)); }
      topline('PATH A', 'AI AS EXIT', C.coral);
      checklist('AI AS EXIT', C.coral, ['ENTERS THE PROMPT', 'READS SOURCES FIRST', 'DRAFTS A CLAIM', 'RECEIVES THE SCROLL'], [1.4, 3.8, 4.5, 5.2], [0, 1, 1, 0], a);
      cap('STUDENT A', C.coral, 'THE SCROLL ARRIVES BEFORE THE THINKING. THE LANTERN STAYS DARK.', a - 4.6);
      cut(a, 8);
    } else if (t < 20.2) {                              // AI as entry
      var b = t - 10.2, px, py = GY, walking = false;
      var o1 = b >= 1.5, o2 = b >= 5.9, o3 = b >= 7.1;
      level(t, ez(pr(b, 8.2, 9.0)));
      chest(100, GY, o1); chest(212, 104, o2); chest(262, 88, o3);
      gate(150, GY, t, 'audit', 1, true);
      person('vale', 20, GY, {}, t);
      if (b < 1.4) { px = lp(44, 78, ez(pr(b, 0.4, 1.4))); walking = b > 0.4; }
      else if (b < 3.0) px = 78;
      else if (b < 3.8) { px = lp(78, 124, ez(pr(b, 3.0, 3.8))); walking = true; }
      else if (b < 5.4) px = 124;
      else if (b < 5.8) { var h1 = hop(b, 5.4, 0.4, [124, GY], [190, 104]); px = h1[0]; py = h1[1]; }
      else if (b < 6.6) { px = 190; py = 104; }
      else if (b < 7.0) { var h2 = hop(b, 6.6, 0.4, [190, 104], [238, 88]); px = h2[0]; py = h2[1]; }
      else { px = lp(238, 284, ez(pr(b, 7.3, 8.1))); py = 88; walking = b > 7.3 && b < 8.1; }
      person('pip', px, py, { walk: walking, emote: b > 3.9 && b < 4.9 ? '?' : null }, t);
      if (b >= 2.2) scroll(px - 6, py - 50, pr(b, 2.2, 2.5));
      tagline('A RIVAL VIEW TO TEST', 232, 66, C.aqua, 4.0, 5.4, b);
      topline('PATH B', 'AI AS ENTRY', C.aqua);
      checklist('AI AS ENTRY', C.aqua, ['READS SOURCES FIRST', 'DRAFTS A CLAIM', 'TESTS A RIVAL VIEW', 'DEFENDS WITH EVIDENCE'], [1.6, 2.6, 4.4, 8.4], [0, 0, 0, 0], b);
      cap('STUDENT B', C.aqua, 'SOURCES FIRST. THEN AI AS A RIVAL TO TEST. THE LANTERN LIGHTS.', b - 0.4);
      cut(b, 10);
    }
    endCard(t, 20.2, ['TWO STUDENTS. THE SAME POLISHED SCROLL.', 'ONLY ONE LANTERN IS LIT.'], 'WHERE DOES AI ENTER YOUR ASSIGNMENT?');
  };

  // Four moves of historical inquiry, with the questions from NCSS slide 6.
  var MOVES = [
    { name: 'SOURCE', q: 'WHO MADE THIS, WHEN, WHY, AND FOR WHOM?' },
    { name: 'CONTEXTUALIZE', q: 'WHAT CONDITIONS SHAPED WHAT COULD BE SAID?' },
    { name: 'CORROBORATE', q: 'WHERE DO ACCOUNTS CONVERGE, CONFLICT, OR REMAIN SILENT?' },
    { name: 'ARGUE', q: 'WHAT CLAIM CAN THE EVIDENCE SUPPORT, AND WHAT REMAINS UNCERTAIN?' }
  ];
  function page(x, y, w, h, a) {
    R(x, y, w, h, C.ink, a); R(x + 1, y + 1, w - 2, h - 2, C.paper, a); R(x + 1, y + 1, w - 2, 7, C.sand, a);
    for (var k = 0; k * 7 + 14 < h - 6; k++) R(x + 5, y + 13 + k * 7, w - 10 - (k * 5) % 13, 2, C.mute, a);
  }
  EP.moves = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'TRAINING LEVEL', 'FOUR MOVES', ['pip', 'vale']);
    var D = 4.5, i = Math.min(3, Math.floor((t - 2.2) / D)), lt = t - 2.2 - i * D;
    if (t < 20.2) {
      sky(t); ground();
      person('vale', 22, GY, {}, t); person('pip', 70, GY, { emote: i === 3 && lt > 2.6 ? '!' : null }, t);
      page(112, 30, 72, 86, 1); R(118, GY - 4, 60, 4, C.wood);
      if (i === 0) {          // who made this, when, why, for whom
        var mx = 124 + 36 * (0.5 + 0.5 * Math.sin(lt * 1.6)), my = 50 + 34 * (0.5 + 0.5 * Math.sin(lt * 2.3 + 1));
        ring(mx, my, 9, C.gold, 1); ring(mx, my, 8, C.gold, 1); R(mx + 6, my + 5, 2, 2, C.gold); R(mx + 8, my + 7, 2, 2, C.gold); R(mx + 10, my + 9, 3, 3, C.wood);
        tagline('WHO MADE THIS?', 252, 34, C.gold, 0.6, 9, lt); tagline('WHEN?', 252, 54, C.gold, 1.4, 9, lt);
        tagline('WHY?', 252, 74, C.gold, 2.1, 9, lt); tagline('FOR WHOM?', 252, 94, C.gold, 2.8, 9, lt);
      } else if (i === 1) {   // the world around the document
        R(204, 84, 104, 2, C.sand);
        [['1763', 212], ['1765', 256], ['1776', 300]].forEach(function (d, k) {
          R(d[1], 80, 2, 10, k === 1 ? C.gold : C.sand); T(d[0], d[1] + 1, 94, k === 1 ? C.gold : C.mute, 1, 'c');
        });
        R(253, 70 - Math.round(Math.abs(Math.sin(lt * 4)) * 3), 8, 8, C.gold);
        tagline('THE WORLD AROUND IT', 256, 40, C.aqua, 0.8, 9, lt);
        R(184, 60, Math.round(22 * pr(lt, 0.6, 1.4)), 1, C.gold);
      } else if (i === 2) {   // compare accounts
        page(214, 36, 50, 66, pr(lt, 0.3, 0.8)); page(276, 44, 36, 50, 0.35 * pr(lt, 2.2, 2.8));
        [[52, C.aqua, 1.0], [66, C.coral, 1.7], [80, C.aqua, 2.4]].forEach(function (c) { if (lt > c[2]) R(184, c[0], 30, 2, c[1]); });
        tagline('AGREE', 239, 22, C.aqua, 1.0, 9, lt); tagline('CONFLICT', 239, 108, C.coral, 1.7, 9, lt); tagline('SILENT', 294, 30, C.mute, 2.6, 9, lt);
      } else {                // a claim the evidence can carry
        lantern(262, GY, ez(pr(lt, 1.6, 2.6)), t, true);
        scroll(64, GY - 54, pr(lt, 0.5, 0.9));
        tagline('CLAIM', 236, 30, C.gold, 0.8, 9, lt); tagline('+ EVIDENCE', 248, 46, C.aqua, 1.5, 9, lt); tagline('+ WHAT IS STILL UNCERTAIN', 236, 62, C.peach, 2.4, 9, lt);
      }
      topline('MOVE ' + (i + 1) + ' OF 4', 'HISTORICAL INQUIRY');
      bar5(i, 4, C.gold);
      cap(MOVES[i].name, C.gold, MOVES[i].q, lt);
      cut(lt, D);
    }
    endCard(t, 20.2, ['THE INQUIRY MOVES ARE THE CURRICULUM.'], 'WHICH MOVE DOES AI SKIP FIRST?');
  };

  // Algorithm audit: treat a smooth AI answer as a source (NCSS slide 18).
  var CLAIM = 'THE REVOLUTION HAPPENED BECAUSE COLONISTS WANTED FREEDOM FROM BRITISH TAXES AND CONTROL.';
  var AUDITS = [
    { name: 'OMISSION', color: 'gold', mark: 'COLONISTS', text: 'WHO OR WHAT DISAPPEARED? LOYALISTS. ENSLAVED PEOPLE. NATIVE NATIONS.' },
    { name: 'EVIDENCE', color: 'aqua', mark: 'BRITISH TAXES', text: 'WHAT WOULD PROVE IT? A TAX ACT. A PETITION. A PAMPHLET.' },
    { name: 'OVERCONFIDENCE', color: 'coral', mark: 'BECAUSE', text: 'WHERE IS IT TOO SMOOTH? ONE CAUSE, NO DOUBT, NO DISAGREEMENT.' }
  ];
  EP.audit = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'BOSS LEVEL', 'AUDIT THE ANSWER', ['pip', 'vale']);
    if (t < 19.4) {
      var intro = t < 6.2, k = intro ? -1 : Math.min(2, Math.floor((t - 6.2) / 4.4)), lt = intro ? t - 2.2 : t - 6.2 - k * 4.4;
      sky(t); ground();
      gate(44, GY, t, 'skip', 1, true);
      person('vale', 84, GY, {}, t); person('pip', 118, GY, { emote: k === 2 && lt > 1.2 ? '!' : null }, t);
      var pa = intro ? pr(lt, 0.5, 1.0) : 1;
      R(148, 20, 166, 62, C.ink, pa); R(149, 21, 164, 60, C.paper, pa); R(149, 21, 164, 9, C.sand, pa);
      T('AI SUMMARY', 154, 22, C.rust, 1, null, pa);
      var lines = wrap(CLAIM, 152), n = intro ? Math.floor((lt - 1.0) * 40) : 999;
      lines.forEach(function (ln, j) {
        for (var m = 0; m <= k; m++) {
          var at = ln.indexOf(AUDITS[m].mark);
          if (at >= 0 && (m < k || lt > 0.5)) R(154 + (at ? tw(ln.slice(0, at)) + 1 : 0) - 1, 32 + j * 9 - 1, tw(AUDITS[m].mark) + 2, 9, C[AUDITS[m].color], 0.55);
        }
        if (n > 0) { T(ln.slice(0, n), 154, 32 + j * 9, C.ink); n -= ln.length + 1; }
      });
      AUDITS.forEach(function (au, m) {
        var done = m < k || (m === k && lt > 3.2);
        box(152 + m * 54, 69, 50, 11, done ? C[au.color] : C.paper, done ? C.ink : C.mute);
        T(('MISSING,PROOF,TOO SURE').split(',')[m], 177 + m * 54, 71, done ? C.ink : C.mute, 1, 'c');
      });
      if (k === 0) [176, 220, 264].forEach(function (x, m) { person(['board', 'kid3', 'lane'][m], x, GY, { a: 0.32 * pr(lt, 0.8 + m * 0.6, 1.3 + m * 0.6) }, t); });
      if (k === 1) [180, 224, 268].forEach(function (x, m) { chest(x, GY, lt > 0.9 + m * 0.7); });
      if (k === 2) { var sh = lt > 0.6 && lt < 2.4 ? Math.round(Math.sin(lt * 30) * 1) : 0; tagline('ONE CAUSE?', 230 + sh, 100, C.coral, 0.6, 9, lt); }
      topline(intro ? 'THE ANSWER' : 'AUDIT ' + (k + 1) + ' OF 3', 'ALGORITHM AUDIT');
      if (!intro) bar5(k, 3, C.gold);
      if (intro) cap('SKIP GATE', C.violet, 'A CLEAN ANSWER IN 9 SECONDS. IT SOUNDS FINISHED.', lt - 0.8);
      else cap(AUDITS[k].name, C[AUDITS[k].color], AUDITS[k].text, lt);
      cut(lt, intro ? 4.0 : 4.4);
    }
    endCard(t, 19.4, ['A SMOOTH ANSWER IS A SOURCE.', 'AUDIT IT LIKE ONE.'], 'WHAT WOULD YOUR STUDENTS AUDIT FIRST?');
  };

  // Trace the source: one document met through search, a feed, and generation (NCSS slide 8).
  var ROUTES = [
    { name: 'SEARCH', color: 'aqua', text: 'STUDENTS CHOOSE AMONG SOURCES. THE TRAIL BACK IS VISIBLE.', marks: [1, 1, 1] },
    { name: 'FEEDS', color: 'violet', text: 'A PLATFORM CHOOSES WHAT IS VISIBLE. WHO LIFTED THIS ONE, AND WHY?', marks: [0, 1, 0] },
    { name: 'GENERATIVE AI', color: 'coral', text: 'THE SOURCE ITSELF IS SYNTHETIC. NO ARCHIVE, NO AUTHOR, NO DATE.', marks: [0, 0, 0] }
  ];
  EP.provenance = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'ARCHIVE LEVEL', 'TRACE THE SOURCE', ['pip', 'vale']);
    var D = 5.6, i = Math.min(2, Math.floor((t - 2.2) / D)), lt = t - 2.2 - i * D, r = ROUTES[i];
    if (t < 19.0) {
      sky(t); ground();
      person('vale', 20, GY, {}, t);
      if (i === 0) {          // three documents on a table; Pip chooses one
        R(96, GY - 14, 92, 4, C.wood); R(100, GY - 10, 3, 10, C.wood); R(181, GY - 10, 3, 10, C.wood);
        [104, 132, 160].forEach(function (x, k) { page(x, GY - 46, 22, 30, k === 1 || lt < 2.0 ? 1 : 0.4); });
        var mx = lt < 2.0 ? 115 + 28 * (0.5 + 0.5 * Math.sin(lt * 3)) : 143, my = GY - 30;
        ring(mx, my, 9, C.gold, 1); ring(mx, my, 8, C.gold, 1); R(mx + 6, my + 5, 2, 2, C.gold); R(mx + 8, my + 7, 3, 3, C.wood);
      } else if (i === 1) {   // the same letter arrives on a feed
        box(96, 24, 92, 92, '#141826', C.violet); R(96, 24, 92, 11, C.violet); T('THE FEED', 142, 26, C.white, 1, 'c');
        for (var c = 0; c < 8; c++) {
          var boosted = c % 4 === 0, y = 108 - ((lt * (boosted ? 22 : 8) + c * 21) % 70);
          if (y > 38 && y < 106) card(boosted ? 100 : 108 + (c * 13) % 30, y, boosted ? 84 : 40, boosted, boosted ? 1 : 0.3);
        }
      } else {                // the gate writes a letter that looks old
        gate(150, GY, t, 'skip', 1, true);
        var q = ez(pr(lt, 0.6, 1.8));
        page(lp(140, 96, q), lp(GY - 60, GY - 52, q) - Math.round(Math.sin(q * Math.PI) * 10), 26, 34, pr(lt, 0.5, 0.9));
        if (lt > 1.8) { R(112, GY - 26, 6, 6, C.gold); R(114, GY - 24, 2, 2, C.rust); }
        if (lt > 3.6) { box(84, GY - 74, 52, 13, C.coral, C.ink); T('TRACE IT', 110, GY - 71, C.ink, 1, 'c'); }
      }
      person('pip', 66, GY, { emote: i === 2 && lt > 2.4 ? '!' : (i === 1 && lt > 2.0 ? '?' : null) }, t);
      panel(204, 20, 110, 52); T('PROVENANCE', 259, 25, C.gold, 1, 'c');
      ['ARCHIVE', 'AUTHOR', 'DATE'].forEach(function (lab, k) {
        if (lt < 1.4 + k * 0.8) return;
        var y = 37 + k * 11;
        T(lab, 212, y, C.paper);
        if (r.marks[k]) { R(292, y + 3, 2, 2, C.aqua); R(294, y + 5, 2, 2, C.aqua); R(296, y + 3, 2, 2, C.aqua); R(298, y + 1, 2, 2, C.aqua); }
        else T('?', 296, y, C.coral, 1, 'c');
      });
      topline('ROUTE ' + (i + 1) + ' OF 3', 'WHERE DID THIS COME FROM?');
      bar5(i, 3, C.gold);
      cap(r.name, C[r.color], r.text, lt);
      cut(lt, D);
    }
    endCard(t, 19.0, ['WHEN THE SOURCE BECOMES SYNTHETIC,', 'VERIFICATION BECOMES A CIVIC PRACTICE.'], 'HOW WOULD YOUR STUDENTS TRACE IT?');
  };

  // The seminar: a contested question, a shortcut refused, and better reasons heard in common (NCSS slide 11).
  EP.seminar = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'TOWN HALL LEVEL', 'THE SEMINAR', ['kid2', 'pip', 'kid3']);
    if (t < 19.4) {
      var ph = t < 8.2 ? 0 : t < 14.2 ? 1 : 2, lt = t - [2.2, 8.2, 14.2][ph], heard = 0;
      sky(t); ground();
      lantern(252, GY, ph === 2 ? ez(pr(lt, 1.0, 2.0)) : 0, t, true);
      gate(294, GY, t, 'skip', ph === 0 ? pr(lt, 2.4, 3.0) : 0.25, true);
      person('vale', 26, GY, {}, t);
      var kids = [['kid2', 96], ['pip', 150], ['kid3', 204]];
      kids.forEach(function (k, n) {
        var said = ph === 1 ? lt > 1.2 + n * 1.4 : ph === 2;
        if (said) heard++;
        person(k[0], k[1], GY, { flip: n === 2, emote: ph === 0 && lt > 0.8 + n * 0.3 && lt < 2.6 ? '!' : null }, t);
        if (said) scroll(k[1] - 6, GY - 52 - (ph === 1 ? Math.round(4 * pr(lt, 1.2 + n * 1.4, 1.6 + n * 1.4)) : 4), 1);
      });
      box(52, 20, 216, 15, C.night, C.gold); T('WAS THE PROTEST JUSTIFIED?', 160, 24, C.gold, 1, 'c');
      if (ph === 0) {
        bubble(96, 50, 'YES!', 0.8, 2.6, lt, 60); bubble(204, 50, 'NO!', 1.2, 2.6, lt, 60);
        if (lt > 1.4 && lt < 2.6 && Math.floor(lt * 10) % 2) { R(146, 70, 3, 3, C.coral); R(152, 66, 3, 3, C.coral); R(158, 72, 3, 3, C.coral); }
      }
      if (ph === 2) ['CLAIM', 'SOURCE', 'LISTEN'].forEach(function (wd, n) {
        if (lt > 2.2 + n * 0.5) { box(85 + n * 52, 44, 46, 13, C.gold, C.ink); T(wd, 108 + n * 52, 47, C.ink, 1, 'c'); }
      });
      topline('THE SEMINAR', 'VOICES HEARD ' + heard + '/3', heard === 3 ? C.aqua : C.peach);
      bar5(ph, 3, C.gold);
      if (ph === 0) cap(lt < 2.8 ? 'THE ROOM' : 'SKIP GATE', lt < 2.8 ? C.peach : C.violet, lt < 2.8 ? 'TWO ANSWERS. NO REASONS YET.' : 'I CAN GIVE YOU THE ONE RIGHT ANSWER. NO ARGUMENT NEEDED.', lt < 2.8 ? lt - 0.6 : lt - 2.8);
      else if (ph === 1) cap('MS. VALE', C.peach, 'SLOW DOWN. MAKE A CLAIM, SHOW A SOURCE, THEN LISTEN.', lt);
      else cap('PIP', C.aqua, 'WE STILL DISAGREE. NOW WE KNOW WHY.', lt - 0.4);
      cut(lt, [6.0, 6.0, 5.2][ph]);
    }
    endCard(t, 19.4, ['TEACH STUDENTS HOW TO THINK,', 'NOT WHAT TO THINK.'], 'WHERE DO YOUR STUDENTS PRACTICE DISAGREEING WELL?');
  };

  // Meeting the past: the same five stages as slide 5 of the NCSS deck, told as how a student meets a source.
  var PAST = [
    { name: 'PRIMARY ORALITY', who: 'ONG (1982)', src: 'SOURCE: A PERSON YOU KNOW', text: 'THE PAST ARRIVES AS A STORY TOLD ALOUD.' },
    { name: 'LITERACY AND PRINT', who: 'ONG (1982)', src: 'SOURCE: AN AUTHOR AND A PRINTER', text: 'THE PAST ARRIVES AS A PAGE. YOU CAN REREAD IT AND COMPARE.' },
    { name: 'SECONDARY ORALITY', who: 'ONG (1982)', src: 'SOURCE: A STATION', text: 'THE PAST ARRIVES AS A BROADCAST. ONE VOICE, MANY LISTENERS.' },
    { name: 'ALGORITHMIC SECONDARY ORALITY', who: 'MINER (PROPOSED)', src: 'SOURCE: A RANKING', text: 'THE PAST ARRIVES RANKED. A SYSTEM CHOOSES WHICH VOICES CIRCULATE.' },
    { name: 'TERTIARY ALGORITHMICITY', who: 'MINER (PROPOSED)', src: 'SOURCE: ?', text: 'THE PAST ARRIVES GENERATED. HUMAN AUTHORSHIP BECOMES OPTIONAL.' }
  ];
  EP.past = function (t) {
    if (t < 2.4) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'THE LONG VIEW', 'MEETING THE PAST', ['pip', 'vale']);
    var D = 4.4, i = Math.min(4, Math.floor((t - 2.4) / D)), lt = t - 2.4 - i * D, w = PAST[i], mine = i > 2;
    if (t < 24.4) {
      sky(t); ground();
      if (i === 0) {
        person('vale', 196, GY, { flip: true }, t);
        for (var k = 0; k < 3; k++) { var d = ((lt * 24 + k * 16) % 48); R(176 - d, GY - 34 - k * 2, 1, 8, C.peach, 1 - d / 48); }
      } else if (i === 1) {
        page(168, GY - 74, 46, 58, 1); R(186, GY - 16, 10, 16, C.wood); R(174, GY - 18, 34, 4, C.wood);
      } else if (i === 2) {
        box(166, GY - 46, 52, 34, C.wood, C.ink); R(171, GY - 41, 26, 24, C.ink);
        for (var gk = 0; gk < 4; gk++) R(173, GY - 38 + gk * 5, 22, 2, C.mute);
        R(203, GY - 38, 10, 10, C.gold); R(207, GY - 34, 2, 2, C.ink); R(170, GY - 12, 4, 12, C.wood); R(210, GY - 12, 4, 12, C.wood);
        for (var rk = 0; rk < 3; rk++) { var rr = (lt * 30 + rk * 26) % 78; ring(192, GY - 52, rr, C.aqua, 1 - rr / 78); }
      } else if (i === 3) {
        box(150, 26, 92, 90, '#141826', C.violet); R(150, 26, 92, 11, C.violet); T('THE FEED', 196, 28, C.white, 1, 'c');
        for (var c = 0; c < 8; c++) {
          var boosted = c % 4 === 0, y = 108 - ((lt * (boosted ? 22 : 8) + c * 21) % 68);
          if (y > 40 && y < 106) card(boosted ? 154 : 162 + (c * 13) % 30, y, boosted ? 84 : 40, boosted, boosted ? 1 : 0.3);
        }
      } else {
        gate(196, GY, t, 'skip', 1, true);
        for (var s2 = 0; s2 < 8; s2++) { var q3 = (lt * 0.42 + s2 * 0.125) % 1, dir = s2 % 2 ? 1 : -1; scroll(196 + dir * q3 * (36 + s2 * 6) - 6, GY - 40 - Math.sin(q3 * Math.PI) * (28 + s2 * 3), 1 - q3 * 0.5); }
      }
      person('pip', 74, GY, { emote: i === 4 && lt > 2.6 ? '?' : null }, t);
      tagline(w.src, 210, i === 3 ? 122 : 34, i === 4 ? C.coral : C.gold, 1.6, 9, lt);
      topline('STAGE ' + (i + 1) + ' OF 5', w.who, mine ? C.violet : C.aqua);
      for (var b = 0; b < 5; b++) R(8 + b * 62, b === i ? 16 : 17, 58, b === i ? 5 : 3, b > 2 ? C.violet : C.aqua, b <= i ? 1 : 0.25);
      cap(w.name, mine ? C.violet : C.aqua, w.text, lt);
      cut(lt, D);
    }
    endCard(t, 24.4, ['EACH MEDIUM CHANGES HOW STUDENTS', 'MEET THE PAST.'], 'HOW DO YOUR STUDENTS MEET IT NOW?');
  };

  // Ask the press: each technoskeptical question asked of a printing press, then of the Skip Gate (NCSS five-questions slide).
  var THEN_NOW = [
    ['THE SCRIBE?', 'THE DRAFT?'], ['WHO COULD READ?', 'WHO BENEFITS?'], ['PAPER, TYPE, READERS', 'DATA, POWER, ATTENTION'],
    ['WHAT NOBODY PLANNED?', 'WHAT NOBODY CHOSE?'], ['BOOKS FEEL NATURAL', 'WILL THIS, TOO?']
  ];
  function printingPress(x, t, active) {
    var d = active ? Math.round(3 * (0.5 + 0.5 * Math.sin(t * 6))) : 0;
    R(x - 16, GY - 50, 32, 5, C.wood); R(x - 15, GY - 46, 4, 46, C.wood); R(x + 11, GY - 46, 4, 46, C.wood);
    R(x - 1, GY - 45, 3, 14 + d, C.mute); R(x - 10, GY - 31 + d, 20, 4, C.ink);
    R(x - 12, GY - 18, 24, 4, C.wood); R(x - 8, GY - 21, 16, 3, C.paper);
    R(x + 2, GY - 40, 16, 2, C.mute); R(x + 16, GY - 42, 3, 6, C.wood);
  }
  EP.press = function (t) {
    if (t < 2.2) return titleCard(t, 'TEACHING HISTORY AMONG ALGORITHMS', 'TIME TRAVEL LEVEL', 'ASK THE PRESS', ['pip', 'vale']);
    var D = 4.0, i = Math.min(4, Math.floor((t - 2.2) / D)), lt = t - 2.2 - i * D, now = lt >= 2.0;
    if (t < 22.2) {
      sky(t); ground();
      printingPress(84, t, !now); gate(236, GY, t, 'skip', now ? 1 : 0.45, true);
      if (!now) { var q = (lt * 0.9) % 1; R(98 + q * 26, GY - 26 - Math.sin(q * Math.PI) * 14, 9, 6, C.paper, 1 - q * 0.6); }
      else { var q2 = ((lt - 2) * 0.9) % 1; scroll(222 - q2 * 30, GY - 40 - Math.sin(q2 * Math.PI) * 14, 1 - q2 * 0.6); }
      person('vale', 30, GY, {}, t);
      person('pip', 160, GY, { flip: !now, emote: lt > 0.3 && lt < 1.1 ? '?' : null }, t);
      T('THEN', 84, 30, C.peach, 1, 'c', now ? 0.45 : 1); T('NOW', 236, 30, C.violet, 1, 'c', now ? 1 : 0.45);
      tagline(THEN_NOW[i][0], 84, 46, C.peach, 0.7, 9, lt); tagline(THEN_NOW[i][1], 236, 46, C.violet, 2.5, 9, lt);
      topline('QUESTION ' + (i + 1) + ' OF 5', 'THEN AND NOW');
      bar5(i, 5, C.gold);
      cap('QUESTION ' + (i + 1), C.gold, QS[i].q, lt);
      cut(lt, D);
    }
    endCard(t, 22.2, ['EVERY NEW MEDIUM DESERVED THESE QUESTIONS.', 'SO DOES THIS ONE.'], 'WHICH QUESTION WOULD YOUR STUDENTS ASK FIRST?');
  };

  // ---------- frame ----------
  window.render = function (t) {
    t = cl(t, 0, LEN);
    g.globalAlpha = 1;
    R(0, 0, W, H, BG);
    (EP[window.EPISODE] || EP.ncss1)(t);
    var fade = Math.max(1 - t / 0.35, pr(t, LEN - 0.4, LEN));
    if (fade > 0) R(0, 0, W, H, BG, cl(fade, 0, 1));
    out.imageSmoothingEnabled = false;
    out.drawImage(off, 0, 0, W * S, H * S);
  };
  render(location.hash ? parseFloat(location.hash.slice(1)) : 9.5);
})();
