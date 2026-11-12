/* Out of Time 3D — the room.
   A Boston counting house, drawn from boxes. It holds no game logic: it shows
   papers where they are, lets you walk and look, and reports which paper you
   are facing. Three.js r160 global build. No textures, shadows, or post-processing,
   and it only redraws when something moved. */
window.OOTScene = (function () {
  "use strict";
  const W = 4.5, D = 3.5, H = 3.2, EYE = 1.62;

  /* where each paper starts: position, and whether it hangs on a wall */
  const HOMES = {
    notice:    { p: [-4.42, 1.55, -1.5], wall: "x+" },
    covenant:  { p: [-0.55, 0.81, 0.55], yaw: 0.25 },
    ledger:    { p: [3.15, 1.13, -2.35], yaw: -0.2, book: true },
    neighbour: { p: [2.3, 1.0, 3.22], yaw: 1.2 },
    memo:      { p: [-0.7, 1.31, -3.18], yaw: 0.5 },
    pamphlet:  { p: [-3.15, 0.66, 2.55], yaw: -0.6, small: true },
    card:      { p: [4.2, 1.42, 0.8], wall: "x-", small: true },
    handbill:  { p: [-2.6, 1.55, -3.42], wall: "z+" }
  };
  const SLOTS = [[0.45, 0.81, 0.55], [0.9, 0.81, 0.55], [1.35, 0.81, 0.55]];
  /* furniture you cannot walk through: [minX, maxX, minZ, maxZ] */
  const BLOCKS = [[-1.1, 1.9, -0.05, 1.15], [2.5, 3.9, -2.9, -1.9], [-3.9, -2.5, 1.9, 3.2], [3.7, 4.5, 0.0, 1.6]];

  function create(canvas, opts) {
    opts = opts || {};
    const T = window.THREE;
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: !opts.low, powerPreference: "default" });
    } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.low ? 1 : 1.5));
    const scene = new T.Scene();
    scene.background = new T.Color(0x1a1410);
    const camera = new T.PerspectiveCamera(68, 1, 0.05, 40);

    const hemi = new T.HemisphereLight(0xfff0dc, 0x4a3524, 1.5);
    const sun = new T.DirectionalLight(0xfff4e0, 1.5);
    sun.position.set(2, 3, 6);
    scene.add(hemi, sun);
    if (!opts.low) {
      const candle = new T.PointLight(0xffb060, 5, 5.5);
      candle.position.set(-0.2, 1.25, 0.3); scene.add(candle);
    }
    const WARM = { sky: new T.Color(0xfff0dc), ground: new T.Color(0x4a3524) };
    const COLD = { sky: new T.Color(0xa9cbff), ground: new T.Color(0x2c3a52) };

    const mat = function (c) { return new T.MeshLambertMaterial({ color: c, flatShading: true }); };
    const M = {
      floor: mat(0x6b4f35), floorLine: mat(0x4a3523), wall: mat(0xd8cbb3), wains: mat(0x5a4330),
      beam: mat(0x3b2a1d), wood: mat(0x6a4a2e), woodDark: mat(0x40291a), baize: mat(0x2f4a3a),
      brick: mat(0x7a4636), iron: mat(0x24201d), brass: mat(0xc79a3e), ink: mat(0x2a2420),
      glass: new T.MeshBasicMaterial({ color: 0xdfe9ee }), sea: new T.MeshBasicMaterial({ color: 0x9fb4bd }),
      mast: new T.MeshBasicMaterial({ color: 0x3a3632 }), ember: new T.MeshBasicMaterial({ color: 0xff7a2e }),
      flame: new T.MeshBasicMaterial({ color: 0xffd98a }), books: [mat(0x6e2f2a), mat(0x2f4a3a), mat(0x3a3f5c), mat(0x7a5a2c)]
    };
    const cube = new T.BoxGeometry(1, 1, 1);
    function box(parent, w, h, d, material, x, y, z) {
      const m = new T.Mesh(cube, material);
      m.scale.set(w, h, d); m.position.set(x, y, z); parent.add(m); return m;
    }

    /* ---- shell ---- */
    box(scene, W * 2, 0.1, D * 2, M.floor, 0, -0.05, 0);
    for (let z = -D + 0.5; z < D; z += 0.5) box(scene, W * 2, 0.012, 0.03, M.floorLine, 0, 0.004, z);
    box(scene, W * 2, 0.1, D * 2, M.wall, 0, H + 0.05, 0);
    [[0, -D - 0.05, W * 2, 0.1], [0, D + 0.05, W * 2, 0.1], [-W - 0.05, 0, 0.1, D * 2], [W + 0.05, 0, 0.1, D * 2]].forEach(function (w) {
      box(scene, w[2], H, w[3], M.wall, w[0], H / 2, w[1]);
      box(scene, w[2] + (w[2] > 1 ? 0 : 0.04), 0.9, w[3] + (w[3] > 1 ? 0 : 0.04), M.wains, w[0] * 0.995, 0.45, w[1] * 0.995);
    });
    for (let x = -3; x <= 3; x += 2) box(scene, 0.22, 0.2, D * 2, M.beam, x, H - 0.1, 0);
    // door, on the wall behind where you start
    box(scene, 0.06, 2.1, 1.0, M.woodDark, -W + 0.03, 1.05, 1.2);
    box(scene, 0.05, 0.06, 0.06, M.brass, -W + 0.08, 1.05, 0.85);
    // window on the harbour side: idle masts, because the port is closed
    box(scene, 2.0, 1.5, 0.04, M.glass, 2.35, 1.75, D - 0.02);
    box(scene, 2.0, 0.45, 0.05, M.sea, 2.35, 1.22, D - 0.025);
    [[1.7, 1.1], [2.2, 1.35], [2.9, 0.95], [3.1, 1.2]].forEach(function (m) { box(scene, 0.03, m[1], 0.05, M.mast, m[0], 1.3 + m[1] / 2, D - 0.03); });
    [1.33, 2.35, 3.37].forEach(function (x) { box(scene, 0.06, 1.56, 0.08, M.woodDark, x, 1.75, D - 0.04); });
    [0.98, 1.75, 2.52].forEach(function (y) { box(scene, 2.1, 0.06, 0.08, M.woodDark, 2.35, y, D - 0.04); });
    box(scene, 2.2, 0.06, 0.3, M.wood, 2.35, 0.95, D - 0.15);

    /* ---- furniture ---- */
    // writing table with a green cloth where chosen papers go
    box(scene, 2.6, 0.06, 1.0, M.wood, 0.4, 0.77, 0.55);
    [[-0.8, 0.15], [1.6, 0.15], [-0.8, 0.95], [1.6, 0.95]].forEach(function (l) { box(scene, 0.08, 0.74, 0.08, M.woodDark, l[0], 0.37, l[1]); });
    box(scene, 1.5, 0.012, 0.62, M.baize, 0.9, 0.806, 0.55);
    box(scene, 0.04, 0.16, 0.04, M.brass, -0.2, 0.88, 0.2);
    box(scene, 0.03, 0.07, 0.03, M.flame, -0.2, 1.0, 0.2);
    box(scene, 0.45, 0.45, 0.45, M.woodDark, 0.4, 0.225, 1.5);   // stool
    // tall clerk's desk
    box(scene, 1.3, 0.06, 0.8, M.wood, 3.2, 1.08, -2.4).rotation.x = -0.12;
    [[2.62, -2.75], [3.78, -2.75], [2.62, -2.05], [3.78, -2.05]].forEach(function (l) { box(scene, 0.07, 1.05, 0.07, M.woodDark, l[0], 0.52, l[1]); });
    box(scene, 0.04, 0.1, 0.04, M.ink, 3.7, 1.12, -2.7);
    // shelves of ledgers
    [0.5, 1.28, 1.95].forEach(function (y) { box(scene, 3.6, 0.05, 0.34, M.wood, 0.9, y, -D + 0.19); });
    [-0.9, 2.7].forEach(function (x) { box(scene, 0.06, 2.3, 0.34, M.woodDark, x, 1.15, -D + 0.19); });
    for (let i = 0; i < 16; i++) {
      const row = i % 2, x = -0.1 + (i >> 1) * 0.33 + (row ? 0.1 : 0);
      box(scene, 0.09 + (i % 3) * 0.03, 0.42 + (i % 4) * 0.05, 0.24, M.books[i % 4], x, (row ? 2.2 : 0.75) + (i % 4) * 0.025, -D + 0.19);
    }
    // hearth
    box(scene, 0.5, 1.3, 1.6, M.brick, W - 0.25, 0.65, 0.8);
    box(scene, 0.3, 0.7, 0.9, M.iron, W - 0.42, 0.4, 0.8);
    box(scene, 0.1, 0.12, 0.5, M.ember, W - 0.5, 0.14, 0.8);
    box(scene, 0.62, 0.08, 1.8, M.wood, W - 0.31, 1.34, 0.8);
    // crates and a barrel, stock that cannot be shipped
    box(scene, 0.9, 0.6, 0.9, M.wood, -3.15, 0.3, 2.55);
    box(scene, 0.7, 0.5, 0.7, M.woodDark, -3.4, 0.25, 1.6).rotation.y = 0.3;
    const barrel = new T.Mesh(new T.CylinderGeometry(0.34, 0.3, 0.9, 10), M.wood);
    barrel.position.set(-2.4, 0.45, 2.9); scene.add(barrel);

    /* ---- papers ---- */
    const papers = {};
    function makePaper(id, home) {
      const g = new T.Group();
      const paper = new T.MeshLambertMaterial({ color: 0xeadfc6, flatShading: true, emissive: 0x000000 });
      const s = home.small ? 0.7 : 1;
      if (home.book) {
        box(g, 0.62, 0.05, 0.44, M.books[3], 0, 0, 0);
        box(g, 0.28, 0.02, 0.4, paper, -0.15, 0.035, 0); box(g, 0.28, 0.02, 0.4, paper, 0.15, 0.035, 0);
        for (let i = 0; i < 5; i++) { box(g, 0.2, 0.004, 0.012, M.ink, -0.15, 0.047, -0.14 + i * 0.07); box(g, 0.2, 0.004, 0.012, M.ink, 0.15, 0.047, -0.14 + i * 0.07); }
      } else {
        box(g, 0.3 * s, 0.012, 0.42 * s, paper, 0, 0, 0);
        for (let i = 0; i < 6; i++) box(g, (i === 0 ? 0.16 : 0.22) * s, 0.004, 0.014 * s, M.ink, 0, 0.009, (-0.15 + i * 0.058) * s);
      }
      scene.add(g);
      papers[id] = { group: g, mat: paper, home: home, glow: 0, glowColor: new T.Color(0x000000) };
      placeHome(id);
    }
    function placeHome(id) {
      const p = papers[id], h = p.home, g = p.group;
      g.rotation.order = "YXZ";   // stand the sheet up first, then turn it to face into the room
      g.position.fromArray(h.p); g.rotation.set(0, h.yaw || 0, 0);
      if (h.wall === "z+") g.rotation.set(Math.PI / 2, 0, 0);
      else if (h.wall === "x+") g.rotation.set(Math.PI / 2, Math.PI / 2, 0);
      else if (h.wall === "x-") g.rotation.set(Math.PI / 2 - 0.22, -Math.PI / 2, 0);   // leans on the mantel
    }
    Object.keys(HOMES).forEach(function (id) { makePaper(id, HOMES[id]); });

    function setDesk(ids) {
      Object.keys(papers).forEach(function (id) {
        const slot = ids.indexOf(id);
        if (slot === -1) placeHome(id);
        else { const g = papers[id].group; g.position.fromArray(SLOTS[slot]); g.rotation.set(0, 0.08 * (slot - 1), 0); }
      });
      dirty = true; refocus();
    }

    /* ---- walking ---- */
    const me = { x: -3.3, z: 0.2, yaw: 0, pitch: -0.08 };
    const held = { forward: false, back: false, left: false, right: false };
    const KEYS = { w: "forward", s: "back", a: "left", d: "right", ArrowUp: "forward", ArrowDown: "back", ArrowLeft: "left", ArrowRight: "right" };
    let dirty = true, reduced = !!opts.reduced, focus = null;
    function blocked(x, z) {
      if (Math.abs(x) > W - 0.35 || Math.abs(z) > D - 0.35) return true;
      for (let i = 0; i < BLOCKS.length; i++) {
        const b = BLOCKS[i];
        if (x > b[0] - 0.3 && x < b[1] + 0.3 && z > b[2] - 0.3 && z < b[3] + 0.3) return true;
      }
      return false;
    }
    function moveBy(dx, dz) {
      if (!blocked(me.x + dx, me.z)) me.x += dx;
      if (!blocked(me.x, me.z + dz)) me.z += dz;
    }
    function place() {
      me.pitch = Math.max(-1.2, Math.min(1.2, me.pitch));
      camera.position.set(me.x, EYE, me.z);
      const cp = Math.cos(me.pitch);
      camera.lookAt(me.x + Math.cos(me.yaw) * cp, EYE + Math.sin(me.pitch), me.z + Math.sin(me.yaw) * cp);
      dirty = true; refocus();
    }
    /* the paper you are facing, if one is within reach */
    function refocus() {
      let best = null, bestScore = 0.55;
      const fx = Math.cos(me.yaw), fz = Math.sin(me.yaw);
      Object.keys(papers).forEach(function (id) {
        const p = papers[id].group.position, dx = p.x - me.x, dz = p.z - me.z, dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 2.6) return;
        const facing = dist < 0.4 ? 1 : (dx * fx + dz * fz) / dist;
        const score = facing - dist * 0.08;
        if (score > bestScore) { bestScore = score; best = id; }
      });
      if (best !== focus) {
        if (focus) papers[focus].mat.emissive.setHex(0x000000);
        focus = best;
        if (opts.onFocus) opts.onFocus(focus);
      }
      if (focus && papers[focus].glow <= 0) papers[focus].mat.emissive.setHex(0x4a3410);
    }
    function step(dt) {
      const turn = (held.right ? 1 : 0) - (held.left ? 1 : 0), go = (held.forward ? 1 : 0) - (held.back ? 1 : 0);
      if (!turn && !go) return;
      me.yaw += turn * 1.8 * dt;
      moveBy(Math.cos(me.yaw) * go * 2.6 * dt, Math.sin(me.yaw) * go * 2.6 * dt);
      place();
    }
    function nudge(name) {
      if (name === "left") me.yaw -= 0.3; else if (name === "right") me.yaw += 0.3;
      else { const m = name === "forward" ? 0.7 : -0.7; moveBy(Math.cos(me.yaw) * m, Math.sin(me.yaw) * m); }
      place();
    }
    /* stand in front of a paper and face it (used by the list of papers) */
    function goTo(id) {
      const p = papers[id]; if (!p) return;
      const t = p.group.position;
      let best = null, bestD = 1e9;
      for (let a = 0; a < 16; a++) {
        const ang = a / 16 * Math.PI * 2, x = t.x + Math.cos(ang) * 1.25, z = t.z + Math.sin(ang) * 1.25;
        if (blocked(x, z)) continue;
        const d = (x - me.x) * (x - me.x) + (z - me.z) * (z - me.z);
        if (d < bestD) { bestD = d; best = [x, z]; }
      }
      if (best) { me.x = best[0]; me.z = best[1]; }
      me.yaw = Math.atan2(t.z - me.z, t.x - me.x);
      me.pitch = Math.max(-0.9, Math.min(0.3, Math.atan2(t.y - EYE, 1.25)));
      place();
    }

    /* ---- the hindsight lantern: cold light, and the paper shows what it is ---- */
    let flare = 0;
    function lantern(id, belongs) {
      const p = papers[id]; if (!p) return;
      p.glowColor.setHex(belongs ? 0x2d6f66 : 0xb5443a);
      p.glow = reduced ? 2.2 : 2.6; flare = reduced ? 0 : 1.6;
      p.mat.emissive.copy(p.glowColor); dirty = true;
    }
    function stepLantern(dt) {
      if (flare > 0) {
        flare = Math.max(0, flare - dt);
        const k = Math.sin(Math.min(1, flare / 1.6) * Math.PI);
        hemi.color.copy(WARM.sky).lerp(COLD.sky, k); hemi.groundColor.copy(WARM.ground).lerp(COLD.ground, k);
        sun.intensity = 1.5 - k; dirty = true;
      }
      Object.keys(papers).forEach(function (id) {
        const p = papers[id];
        if (p.glow > 0) {
          p.glow -= dt;
          if (p.glow <= 0) { p.mat.emissive.setHex(id === focus ? 0x4a3410 : 0x000000); dirty = true; }
        }
      });
    }

    /* ---- input ---- */
    let drag = null;
    const ray = new T.Raycaster(), ndc = new T.Vector2();
    canvas.addEventListener("pointerdown", function (e) {
      drag = { x: e.clientX, y: e.clientY, moved: 0 };
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      me.yaw -= dx * 0.005; me.pitch += dy * 0.005; drag.x = e.clientX; drag.y = e.clientY; place();
    });
    canvas.addEventListener("pointerup", function (e) {
      const wasClick = drag && drag.moved < 6; drag = null;
      if (!wasClick || !opts.onRead) return;
      const r = canvas.getBoundingClientRect();
      ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera); ray.far = 4.5;
      let hit = null, hitD = 1e9;
      Object.keys(papers).forEach(function (id) {
        const h = ray.intersectObject(papers[id].group, true)[0];
        if (h && h.distance < hitD) { hitD = h.distance; hit = id; }
      });
      if (hit) opts.onRead(hit); else if (focus) opts.onRead(focus);
    });
    canvas.addEventListener("pointercancel", function () { drag = null; });
    canvas.addEventListener("keydown", function (e) {
      const name = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (name) { held[name] = true; e.preventDefault(); }
    });
    window.addEventListener("keyup", function (e) {
      const name = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (name) held[name] = false;
    });
    window.addEventListener("blur", function () { held.forward = held.back = held.left = held.right = false; });

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.fov = w / h < 1 ? 80 : 68;
      camera.updateProjectionMatrix(); dirty = true;
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    window.addEventListener("resize", resize);

    let last = performance.now(), lost = false;
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); lost = true; if (opts.onLost) opts.onLost(); });
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      step(dt); stepLantern(dt);
      if (dirty && !lost) { renderer.render(scene, camera); dirty = false; }
      requestAnimationFrame(loop);
    }
    resize(); place();
    requestAnimationFrame(loop);

    return {
      setDesk: setDesk,
      goTo: goTo,
      lantern: lantern,
      focus: function () { return focus; },
      hold: function (name, on) { if (name in held) held[name] = !!on; },
      nudge: nudge,
      reset: function () { me.x = -3.3; me.z = 0.2; me.yaw = 0; me.pitch = -0.08; setDesk([]); place(); },
      stats: function () { return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }; }
    };
  }
  return { create: create };
})();
