/* Out of Time 3D — the room engine.
   Builds whichever room is asked for from rooms.js, shows its papers, lets you
   walk and look, and reports which paper you are facing. It holds no game logic.
   Three.js r160 global build. No textures, shadows, or post-processing, and it
   only redraws when something moved. */
window.OOTScene = (function () {
  "use strict";
  const EYE = 1.62;

  function create(canvas, opts) {
    opts = opts || {};
    const T = window.THREE, ROOMS = window.OOTRooms;
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: !opts.low, powerPreference: "default" });
    } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.low ? 1 : 1.5));
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(68, 1, 0.05, 40);
    const hemi = new T.HemisphereLight(0xffffff, 0x444444, 1.5);
    const sun = new T.DirectionalLight(0xfff4e0, 1.5);
    const lamp = new T.PointLight(0xffb060, 5, 5.5);
    scene.add(hemi, sun);
    if (!opts.low) scene.add(lamp);
    const warm = { sky: new T.Color(), ground: new T.Color(), sunI: 1 };
    const COLD = { sky: new T.Color(0xa9cbff), ground: new T.Color(0x2c3a52) };

    /* ---- building helpers, shared by every room ---- */
    const cube = new T.BoxGeometry(1, 1, 1);
    const cache = {};
    function mat(c) { return cache[c] || (cache[c] = new T.MeshLambertMaterial({ color: c, flatShading: true })); }
    const litCache = {};
    function lit(c) { return litCache[c] || (litCache[c] = new T.MeshBasicMaterial({ color: c })); }
    let root = null, room = null;
    function box(w, hh, d, color, x, y, z) {
      const m = new T.Mesh(cube, typeof color === "number" ? mat(color) : color);
      m.scale.set(w, hh, d); m.position.set(x, y, z); root.add(m); return m;
    }
    function cyl(rt, rb, hh, color, x, y, z) {
      const m = new T.Mesh(new T.CylinderGeometry(rt, rb, hh, 12), typeof color === "number" ? mat(color) : color);
      m.position.set(x, y, z); root.add(m); return m;
    }
    function shell(c) {
      const W = room.W, D = room.D, H = room.H;
      box(W * 2, 0.1, D * 2, c.floor, 0, -0.05, 0);
      for (let z = -D + 0.5; z < D; z += 0.5) box(W * 2, 0.012, 0.03, c.line, 0, 0.004, z);
      box(W * 2, 0.1, D * 2, c.ceil, 0, H + 0.05, 0);
      [[0, -D - 0.05, W * 2, 0.1], [0, D + 0.05, W * 2, 0.1], [-W - 0.05, 0, 0.1, D * 2], [W + 0.05, 0, 0.1, D * 2]].forEach(function (w) {
        box(w[2], H, w[3], c.wall, w[0], H / 2, w[1]);
        if (c.wainscot) box(w[2] + (w[2] > 1 ? 0 : 0.04), 0.9, w[3] + (w[3] > 1 ? 0 : 0.04), c.wainscot, w[0] * 0.995, 0.45, w[1] * 0.995);
      });
    }
    const helpers = { box: box, cyl: cyl, lit: lit, shell: shell };

    /* ---- papers ---- */
    let papers = {};
    const INK = 0x2a2420;
    function makePaper(id, home) {
      const g = new T.Group();
      const paper = new T.MeshLambertMaterial({ color: 0xeadfc6, flatShading: true, emissive: 0x000000 });
      const s = home.small ? 0.7 : 1;
      const add = function (w, hh, d, m, x, y, z) { const b = new T.Mesh(cube, m); b.scale.set(w, hh, d); b.position.set(x, y, z); g.add(b); };
      if (home.book) {
        add(0.62, 0.05, 0.44, mat(0x7a5a2c), 0, 0, 0);
        add(0.28, 0.02, 0.4, paper, -0.15, 0.035, 0); add(0.28, 0.02, 0.4, paper, 0.15, 0.035, 0);
        for (let i = 0; i < 5; i++) { add(0.2, 0.004, 0.012, mat(INK), -0.15, 0.047, -0.14 + i * 0.07); add(0.2, 0.004, 0.012, mat(INK), 0.15, 0.047, -0.14 + i * 0.07); }
      } else {
        add(0.3 * s, 0.012, 0.42 * s, paper, 0, 0, 0);
        for (let i = 0; i < 6; i++) add((i === 0 ? 0.16 : 0.22) * s, 0.004, 0.014 * s, mat(INK), 0, 0.009, (-0.15 + i * 0.058) * s);
      }
      g.rotation.order = "YXZ";   // stand the sheet up first, then turn it to face into the room
      root.add(g);
      papers[id] = { group: g, mat: paper, home: home, glow: 0, glowColor: new T.Color(0x000000) };
      placeHome(id);
    }
    function placeHome(id) {
      const p = papers[id], h = p.home, g = p.group, up = Math.PI / 2 - (h.lean ? 0.22 : 0);
      g.position.fromArray(h.p); g.rotation.set(0, h.yaw || 0, 0);
      if (h.wall === "z+") g.rotation.set(up, 0, 0);
      else if (h.wall === "z-") g.rotation.set(up, Math.PI, 0);
      else if (h.wall === "x+") g.rotation.set(up, Math.PI / 2, 0);
      else if (h.wall === "x-") g.rotation.set(up, -Math.PI / 2, 0);
    }
    function setDesk(ids) {
      Object.keys(papers).forEach(function (id) {
        const slot = ids.indexOf(id);
        if (slot === -1) placeHome(id);
        else { const g = papers[id].group; g.position.fromArray(room.slots[slot]); g.rotation.set(0, 0.08 * (slot - 1), 0); }
      });
      dirty = true; refocus();
    }

    /* ---- load a room ---- */
    function load(id) {
      if (root) {
        root.traverse(function (o) { if (o.geometry && o.geometry !== cube) o.geometry.dispose(); });
        Object.keys(papers).forEach(function (k) { papers[k].mat.dispose(); });
        scene.remove(root);
      }
      room = ROOMS[id]; root = new T.Group(); scene.add(root); papers = {}; focus = null;
      scene.background = new T.Color(room.bg);
      warm.sky.setHex(room.sky); warm.ground.setHex(room.ground); warm.sunI = room.sunI;
      hemi.color.copy(warm.sky); hemi.groundColor.copy(warm.ground); hemi.intensity = room.hemi;
      sun.position.fromArray(room.sun); sun.intensity = room.sunI;
      lamp.color.setHex(room.lamp.color); lamp.position.fromArray(room.lamp.pos);
      lamp.intensity = room.lamp.I; lamp.distance = room.lamp.dist;
      room.build(helpers);
      Object.keys(room.homes).forEach(function (pid) { makePaper(pid, room.homes[pid]); });
      flare = 0; reset();
    }

    /* ---- walking ---- */
    const me = { x: 0, z: 0, yaw: 0, pitch: -0.08 };
    const held = { forward: false, back: false, left: false, right: false };
    const KEYS = { w: "forward", s: "back", a: "left", d: "right", ArrowUp: "forward", ArrowDown: "back", ArrowLeft: "left", ArrowRight: "right" };
    let dirty = true, reduced = !!opts.reduced, focus = null, flare = 0;
    function blocked(x, z) {
      if (Math.abs(x) > room.W - 0.35 || Math.abs(z) > room.D - 0.35) return true;
      for (let i = 0; i < room.blocks.length; i++) {
        const b = room.blocks[i];
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
        if (focus && papers[focus]) papers[focus].mat.emissive.setHex(0x000000);
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
      [1.25, 1.6, 0.95].some(function (r) {
        for (let a = 0; a < 16; a++) {
          const ang = a / 16 * Math.PI * 2, x = t.x + Math.cos(ang) * r, z = t.z + Math.sin(ang) * r;
          if (blocked(x, z)) continue;
          const d = (x - me.x) * (x - me.x) + (z - me.z) * (z - me.z);
          if (d < bestD) { bestD = d; best = [x, z]; }
        }
        return !!best;
      });
      if (best) { me.x = best[0]; me.z = best[1]; }
      me.yaw = Math.atan2(t.z - me.z, t.x - me.x);
      const flat = Math.sqrt((t.x - me.x) * (t.x - me.x) + (t.z - me.z) * (t.z - me.z));
      me.pitch = Math.max(-0.9, Math.min(0.3, Math.atan2(t.y - EYE, flat)));
      place();
    }
    function reset() {
      held.forward = held.back = held.left = held.right = false;
      me.x = room.start.x; me.z = room.start.z; me.yaw = room.start.yaw; me.pitch = -0.08;
      setDesk([]); place();
    }

    /* ---- the hindsight lantern: cold light, and the paper shows what it is ---- */
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
        hemi.color.copy(warm.sky).lerp(COLD.sky, k); hemi.groundColor.copy(warm.ground).lerp(COLD.ground, k);
        sun.intensity = warm.sunI * (1 - 0.7 * k); dirty = true;
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
      if (!drag || !room) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      me.yaw -= dx * 0.005; me.pitch += dy * 0.005; drag.x = e.clientX; drag.y = e.clientY; place();
    });
    canvas.addEventListener("pointerup", function (e) {
      const wasClick = drag && drag.moved < 6; drag = null;
      if (!wasClick || !opts.onRead || !room) return;
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
      if (room) { step(dt); stepLantern(dt); }
      if (dirty && !lost && room) { renderer.render(scene, camera); dirty = false; }
      requestAnimationFrame(loop);
    }
    resize();
    requestAnimationFrame(loop);

    return {
      load: load,
      setDesk: setDesk,
      goTo: goTo,
      lantern: lantern,
      focus: function () { return focus; },
      hold: function (name, on) { if (name in held) held[name] = !!on; },
      nudge: nudge,
      reset: reset,
      resize: resize,
      stats: function () { return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }; }
    };
  }
  return { create: create };
})();
