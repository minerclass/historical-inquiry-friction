/* Out of Time 3D — the four rooms.
   Each room is data plus a build function that places boxes. Coordinates are
   metres: x runs from -W to W, z from -D to D, y is up. You start near the
   -x wall facing +x.

   homes:  where each paper starts. wall "x+" hangs on the -x wall facing in,
           "x-" on the +x wall, "z+" on the -z wall, "z-" on the +z wall;
           lean tips it back as if propped on a ledge.
   slots:  the three places on the table where chosen papers go.
   blocks: furniture you cannot walk through, as [minX, maxX, minZ, maxZ]. */
window.OOTRooms = (function () {
  "use strict";

  function legs(h, color, height, pts) { pts.forEach(function (p) { h.box(0.07, height, 0.07, color, p[0], height / 2, p[1]); }); }
  function candle(h, x, y, z) { h.box(0.04, 0.16, 0.04, 0xc79a3e, x, y + 0.08, z); h.box(0.03, 0.07, 0.03, h.lit(0xffd98a), x, y + 0.2, z); }

  const rooms = {};

  /* ---------- Boston counting house, June 1774 ---------- */
  rooms["boston-1774"] = {
    W: 4.5, D: 3.5, H: 3.2, bg: 0x1a1410,
    sky: 0xfff0dc, ground: 0x4a3524, hemi: 1.5, sun: [2, 3, 6], sunI: 1.5,
    lamp: { color: 0xffb060, pos: [-0.2, 1.25, 0.3], I: 5, dist: 5.5 },
    start: { x: -3.3, z: 0.2, yaw: 0 },
    homes: {
      notice: { p: [-4.42, 1.55, -1.5], wall: "x+" },
      covenant: { p: [-0.55, 0.81, 0.55], yaw: 0.25 },
      ledger: { p: [3.15, 1.13, -2.35], yaw: -0.2, book: true },
      neighbour: { p: [2.3, 1.0, 3.22], yaw: 1.2 },
      memo: { p: [-0.7, 1.31, -3.18], yaw: 0.5 },
      pamphlet: { p: [-3.15, 0.66, 2.55], yaw: -0.6, small: true },
      card: { p: [4.2, 1.42, 0.8], wall: "x-", lean: true, small: true },
      handbill: { p: [-2.6, 1.55, -3.42], wall: "z+" }
    },
    slots: [[0.45, 0.81, 0.55], [0.9, 0.81, 0.55], [1.35, 0.81, 0.55]],
    blocks: [[-1.1, 1.9, -0.05, 1.15], [2.5, 3.9, -2.9, -1.9], [-3.9, -2.5, 1.9, 3.2], [3.7, 4.5, 0.0, 1.6]],
    build: function (h) {
      const W = 4.5, D = 3.5, H = 3.2;
      h.shell({ floor: 0x6b4f35, line: 0x4a3523, wall: 0xd8cbb3, ceil: 0xd8cbb3, wainscot: 0x5a4330 });
      for (let x = -3; x <= 3; x += 2) h.box(0.22, 0.2, D * 2, 0x3b2a1d, x, H - 0.1, 0);
      h.box(0.06, 2.1, 1.0, 0x40291a, -W + 0.03, 1.05, 1.2);                       // door
      // window on the harbour side: idle masts, because the port is closed
      h.box(2.0, 1.5, 0.04, h.lit(0xdfe9ee), 2.35, 1.75, D - 0.02);
      h.box(2.0, 0.45, 0.05, h.lit(0x9fb4bd), 2.35, 1.22, D - 0.025);
      [[1.7, 1.1], [2.2, 1.35], [2.9, 0.95], [3.1, 1.2]].forEach(function (m) { h.box(0.03, m[1], 0.05, h.lit(0x3a3632), m[0], 1.3 + m[1] / 2, D - 0.03); });
      [1.33, 2.35, 3.37].forEach(function (x) { h.box(0.06, 1.56, 0.08, 0x40291a, x, 1.75, D - 0.04); });
      [0.98, 1.75, 2.52].forEach(function (y) { h.box(2.1, 0.06, 0.08, 0x40291a, 2.35, y, D - 0.04); });
      h.box(2.2, 0.06, 0.3, 0x6a4a2e, 2.35, 0.95, D - 0.15);
      // writing table with a green cloth
      h.box(2.6, 0.06, 1.0, 0x6a4a2e, 0.4, 0.77, 0.55);
      legs(h, 0x40291a, 0.74, [[-0.8, 0.15], [1.6, 0.15], [-0.8, 0.95], [1.6, 0.95]]);
      h.box(1.5, 0.012, 0.62, 0x2f4a3a, 0.9, 0.806, 0.55);
      candle(h, -0.2, 0.8, 0.2);
      h.box(0.45, 0.45, 0.45, 0x40291a, 0.4, 0.225, 1.5);
      // tall clerk's desk
      h.box(1.3, 0.06, 0.8, 0x6a4a2e, 3.2, 1.08, -2.4).rotation.x = -0.12;
      legs(h, 0x40291a, 1.05, [[2.62, -2.75], [3.78, -2.75], [2.62, -2.05], [3.78, -2.05]]);
      // shelves of ledgers
      [0.5, 1.28, 1.95].forEach(function (y) { h.box(3.6, 0.05, 0.34, 0x6a4a2e, 0.9, y, -D + 0.19); });
      [-0.9, 2.7].forEach(function (x) { h.box(0.06, 2.3, 0.34, 0x40291a, x, 1.15, -D + 0.19); });
      const spines = [0x6e2f2a, 0x2f4a3a, 0x3a3f5c, 0x7a5a2c];
      for (let i = 0; i < 16; i++) {
        const row = i % 2, x = -0.1 + (i >> 1) * 0.33 + (row ? 0.1 : 0);
        h.box(0.09 + (i % 3) * 0.03, 0.42 + (i % 4) * 0.05, 0.24, spines[i % 4], x, (row ? 2.2 : 0.75) + (i % 4) * 0.025, -D + 0.19);
      }
      // hearth
      h.box(0.5, 1.3, 1.6, 0x7a4636, W - 0.25, 0.65, 0.8);
      h.box(0.3, 0.7, 0.9, 0x24201d, W - 0.42, 0.4, 0.8);
      h.box(0.1, 0.12, 0.5, h.lit(0xff7a2e), W - 0.5, 0.14, 0.8);
      h.box(0.62, 0.08, 1.8, 0x6a4a2e, W - 0.31, 1.34, 0.8);
      // stock that cannot be shipped
      h.box(0.9, 0.6, 0.9, 0x6a4a2e, -3.15, 0.3, 2.55);
      h.box(0.7, 0.5, 0.7, 0x40291a, -3.4, 0.25, 1.6).rotation.y = 0.3;
      h.cyl(0.34, 0.3, 0.9, 0x6a4a2e, -2.4, 0.45, 2.9);
    }
  };

  /* ---------- Philadelphia lodging room, August 1787 ---------- */
  rooms["philadelphia-1787"] = {
    W: 3.6, D: 3.0, H: 2.9, bg: 0x15140f,
    sky: 0xf6ecd8, ground: 0x3d3122, hemi: 1.25, sun: [1, 3, 5], sunI: 0.8,
    lamp: { color: 0xffb060, pos: [0.0, 1.25, 0.1], I: 6, dist: 6 },
    start: { x: -2.7, z: 0.9, yaw: -0.15 },
    homes: {
      notes: { p: [0.0, 0.81, 0.3], yaw: 0.2 },
      committee: { p: [2.35, 0.63, -1.95], yaw: 0.9 },
      society: { p: [-2.6, 0.52, 2.3], yaw: -0.4 },
      home: { p: [-1.2, 1.44, -2.72], wall: "z+", lean: true },
      war: { p: [3.15, 0.84, 1.85], yaw: 1.3 },
      rights: { p: [-3.52, 1.5, -1.3], wall: "x+" },
      cotton: { p: [3.52, 1.5, 0.3], wall: "x-" },
      verdict: { p: [0.9, 1.03, 2.72], yaw: 0.3, small: true }
    },
    slots: [[0.55, 0.81, 0.3], [0.95, 0.81, 0.3], [1.35, 0.81, 0.3]],
    blocks: [[-0.4, 1.7, -0.2, 0.8], [1.4, 3.6, -3.0, -1.5], [-3.2, -2.0, 1.9, 2.8], [2.75, 3.6, 1.4, 2.3], [-2.0, -0.4, -3.0, -2.55]],
    build: function (h) {
      const W = 3.6, D = 3.0;
      h.shell({ floor: 0x7a5a3c, line: 0x5a4028, wall: 0xc9cfc6, ceil: 0xe2ddd0, wainscot: 0x8f9a94 });
      h.box(0.06, 2.0, 0.95, 0x4a3524, -W + 0.03, 1.0, 1.9);                        // door
      // shuttered window: the Convention sat with windows closed for secrecy
      h.box(1.5, 1.5, 0.04, h.lit(0xf4ecd0), 0.9, 1.8, D - 0.02);
      [0.52, 1.28].forEach(function (x) {
        h.box(0.72, 1.5, 0.05, 0x3f5a48, x, 1.8, D - 0.045);
        for (let y = 1.2; y < 2.5; y += 0.16) h.box(0.6, 0.02, 0.06, h.lit(0xe9dfb8), x, y, D - 0.05);
      });
      h.box(1.7, 0.06, 0.28, 0x6a4a2e, 0.9, 1.0, D - 0.14);
      // writing table
      h.box(2.0, 0.06, 0.9, 0x6a4a2e, 0.65, 0.77, 0.3);
      legs(h, 0x40291a, 0.74, [[-0.25, -0.05], [1.55, -0.05], [-0.25, 0.65], [1.55, 0.65]]);
      h.box(1.25, 0.012, 0.56, 0x2f4a3a, 0.95, 0.806, 0.3);
      candle(h, -0.2, 0.8, 0.0);
      h.box(0.05, 0.09, 0.05, 0x2a2420, 0.25, 0.85, 0.0);                           // inkwell
      h.box(0.42, 0.45, 0.42, 0x40291a, 0.6, 0.225, 1.2);                           // stool
      // bed
      h.box(2.0, 0.3, 1.2, 0x4a3524, 2.5, 0.3, -2.25);
      h.box(1.95, 0.14, 1.15, 0xe6dfcf, 2.5, 0.52, -2.25);
      h.box(1.2, 0.05, 1.17, 0x3f4f6e, 2.85, 0.6, -2.25);
      h.box(0.4, 0.1, 0.7, 0xf2ecde, 1.75, 0.63, -2.25);
      [[1.5, -2.85], [3.5, -2.85], [1.5, -1.65], [3.5, -1.65]].forEach(function (p) { h.box(0.08, 1.5, 0.08, 0x40291a, p[0], 0.75, p[1]); });
      // travelling trunk
      h.box(1.0, 0.5, 0.6, 0x5a3f28, -2.6, 0.25, 2.3);
      [-2.95, -2.25].forEach(function (x) { h.box(0.05, 0.52, 0.62, 0x24201d, x, 0.25, 2.3); });
      // washstand
      h.box(0.7, 0.8, 0.7, 0x6a4a2e, 3.2, 0.4, 1.85);
      h.cyl(0.2, 0.14, 0.1, 0xe6e2d8, 3.2, 0.86, 1.6);
      // small hearth and mantel
      h.box(1.4, 1.2, 0.4, 0x7a4636, -1.2, 0.6, -D + 0.2);
      h.box(0.8, 0.6, 0.3, 0x24201d, -1.2, 0.32, -D + 0.3);
      h.box(1.6, 0.08, 0.5, 0x6a4a2e, -1.2, 1.26, -D + 0.25);
      h.box(0.5, 0.9, 0.06, 0x2c2a33, -3.0, 1.5, -D + 0.05);                        // coat on a peg
    }
  };

  /* ---------- Manzanar barracks room, February 1943 ---------- */
  rooms["manzanar-1943"] = {
    W: 3.6, D: 3.0, H: 2.7, bg: 0x17130e,
    sky: 0xf3ead6, ground: 0x4b3f2c, hemi: 1.5, sun: [2, 3, 6], sunI: 1.2,
    lamp: { color: 0xfff0c8, pos: [0.2, 2.2, 0.2], I: 7, dist: 7 },
    start: { x: -2.7, z: 0.6, yaw: -0.1 },
    homes: {
      form: { p: [-0.15, 0.78, 0.2], yaw: 0.15 },
      parents: { p: [2.5, 0.6, -2.2], yaw: 1.0 },
      army: { p: [-3.52, 1.5, -1.0], wall: "x+" },
      block: { p: [-2.85, 0.78, 2.35], yaw: -0.5 },
      tule: { p: [0.6, 1.5, -2.92], wall: "z+" },
      record: { p: [-2.3, 1.03, -2.7], yaw: 0.4, small: true },
      redress: { p: [2.5, 0.6, 2.2], yaw: -1.1 },
      verdict: { p: [-0.8, 1.13, 2.74], yaw: 0.2, small: true }
    },
    slots: [[0.35, 0.78, 0.2], [0.72, 0.78, 0.2], [1.09, 0.78, 0.2]],
    blocks: [[-0.6, 1.5, -0.3, 0.7], [1.4, 3.6, -3.0, -1.7], [1.4, 3.6, 1.7, 3.0], [-3.4, -2.3, 1.9, 2.8], [-1.4, -0.5, -2.7, -1.8], [-2.9, -1.7, -3.0, -2.45]],
    build: function (h) {
      const W = 3.6, D = 3.0, H = 2.7;
      h.shell({ floor: 0x8a7a62, line: 0x6d5f4a, wall: 0xb89a6a, ceil: 0x9c8258 });
      // bare stud walls and open rafters
      for (let x = -3; x <= 3; x += 1.2) { h.box(0.06, H, 0.06, 0x9a7f52, x, H / 2, -D + 0.04); h.box(0.06, H, 0.06, 0x9a7f52, x, H / 2, D - 0.04); }
      for (let x = -3; x <= 3; x += 1.5) h.box(0.08, 0.14, D * 2, 0x8a7048, x, H - 0.07, 0);
      h.box(0.06, 1.95, 0.85, 0x8a7048, -W + 0.03, 0.98, 1.6);                      // door
      // window: desert floor and the Sierra beyond the wire
      h.box(1.4, 1.0, 0.04, h.lit(0xcfe0ea), -0.8, 1.65, D - 0.02);
      h.box(1.4, 0.3, 0.05, h.lit(0x7f8ea6), -0.8, 1.45, D - 0.025);
      [[-1.2, 0.36], [-0.85, 0.56], [-0.5, 0.44], [-0.28, 0.3]].forEach(function (m) {   // peaks, flattened cones
        h.cyl(0.001, 0.3, m[1], h.lit(0x7f8ea6), m[0], 1.58 + m[1] / 2, D - 0.027).scale.z = 0.05;
      });
      h.box(1.4, 0.2, 0.055, h.lit(0xc9b48a), -0.8, 1.25, D - 0.028);
      [1.36, 1.5].forEach(function (y) { h.box(1.4, 0.012, 0.06, h.lit(0x3a3632), -0.8, y, D - 0.03); });   // fence wire
      h.box(0.05, 1.05, 0.07, 0x8a7048, -0.8, 1.65, D - 0.04);
      h.box(1.5, 0.05, 0.2, 0x8a7048, -0.8, 1.1, D - 0.1);
      // table knocked together from scrap lumber, with a cloth
      h.box(1.9, 0.05, 0.9, 0xa88a5c, 0.45, 0.74, 0.2);
      legs(h, 0x8a7048, 0.71, [[-0.4, -0.15], [1.3, -0.15], [-0.4, 0.55], [1.3, 0.55]]);
      h.box(1.15, 0.012, 0.5, 0x34405a, 0.72, 0.772, 0.2);
      h.box(1.4, 0.05, 0.3, 0xa88a5c, 0.45, 0.42, 1.0);                              // bench
      legs(h, 0x8a7048, 0.4, [[-0.15, 1.0], [1.05, 1.0]]);
      // two army cots
      [-2.3, 2.3].forEach(function (z) {
        h.box(1.95, 0.05, 0.8, 0x2c2c2a, 2.5, 0.42, z);
        legs(h, 0x2c2c2a, 0.42, [[1.6, z - 0.35], [3.4, z - 0.35], [1.6, z + 0.35], [3.4, z + 0.35]]);
        h.box(1.9, 0.1, 0.78, 0x5a5f3c, 2.5, 0.5, z);
        h.box(0.35, 0.08, 0.55, 0xe6e0d0, 3.2, 0.59, z);
      });
      // stove and pipe
      h.cyl(0.3, 0.34, 0.8, 0x1f1d1b, -0.95, 0.45, -2.25);
      h.cyl(0.07, 0.07, 1.9, 0x1f1d1b, -0.95, 1.75, -2.25);
      h.box(0.5, 0.06, 0.5, 0x3a3632, -0.95, 0.03, -2.25);
      // suitcases: what a family was allowed to carry
      h.box(0.9, 0.45, 0.6, 0x6b4a32, -2.85, 0.225, 2.35);
      h.box(0.8, 0.3, 0.55, 0x4f5a4a, -2.85, 0.6, 2.35);
      // shelf made from a crate
      h.box(1.1, 0.5, 0.4, 0xa88a5c, -2.3, 0.75, -2.72);
      h.box(1.0, 0.4, 0.36, 0x7a6644, -2.3, 0.75, -2.7);
      h.cyl(0.06, 0.08, 0.2, 0x5b7a8c, -2.65, 1.1, -2.72);
      // bare bulb
      h.box(0.01, 0.4, 0.01, 0x1f1d1b, 0.2, 2.45, 0.2);
      h.box(0.09, 0.12, 0.09, h.lit(0xfff3c4), 0.2, 2.2, 0.2);
    }
  };

  /* ---------- Nashville church basement office, May 1961 ---------- */
  rooms["nashville-1961"] = {
    W: 4.2, D: 3.2, H: 2.6, bg: 0x121412,
    sky: 0xf2f5ff, ground: 0x4a4f48, hemi: 1.7, sun: [0, 4, 1], sunI: 0.9,
    lamp: { color: 0xf2f5ff, pos: [0.3, 2.3, 0.2], I: 6, dist: 8 },
    start: { x: -3.3, z: 0.7, yaw: -0.1 },
    homes: {
      news: { p: [-0.45, 0.78, 0.2], yaw: 0.2 },
      phone: { p: [-3.3, 0.79, 2.05], yaw: -0.3, small: true },
      wire: { p: [-4.12, 1.5, -1.2], wall: "x+" },
      letters: { p: [1.0, 0.49, -2.72], yaw: 0.4 },
      icc: { p: [-2.4, 1.5, -3.12], wall: "z+" },
      certain: { p: [3.3, 0.9, -1.55], yaw: -0.3 },
      title: { p: [-2.9, 0.44, -2.4], yaw: 0.7, small: true },
      verdict: { p: [4.04, 0.99, 0.6], wall: "x-", lean: true, small: true }
    },
    slots: [[0.5, 0.78, 0.2], [0.9, 0.78, 0.2], [1.3, 0.78, 0.2]],
    blocks: [[-1.0, 1.8, -0.3, 0.7], [0.0, 2.0, -3.2, -2.45], [2.8, 4.2, -2.9, -1.2], [-3.9, -2.7, 1.8, 2.9], [-3.3, -2.5, -2.8, -2.0]],
    build: function (h) {
      const W = 4.2, D = 3.2, H = 2.6;
      h.shell({ floor: 0x8b8f86, line: 0x767a72, wall: 0xb9c7b0, ceil: 0xe4e6e0, wainscot: 0x8fa08a });
      h.box(0.06, 2.0, 0.9, 0x5a4a38, -W + 0.03, 1.0, 1.9);                         // door
      // high basement windows, and strip lights
      [-1.8, 1.2].forEach(function (x) { h.box(1.4, 0.4, 0.04, h.lit(0xe6eef2), x, 2.2, D - 0.02); h.box(1.5, 0.05, 0.06, 0x6f7a6c, x, 1.98, D - 0.04); });
      [-1.6, 1.8].forEach(function (x) { h.box(1.4, 0.05, 0.22, h.lit(0xffffff), x, H - 0.04, 0.2); });
      h.cyl(0.05, 0.05, W * 2, 0x8a8f88, 0, H - 0.2, -2.0).rotation.z = Math.PI / 2;   // pipe
      // folding table with a telephone
      h.box(2.4, 0.04, 0.8, 0xb08d5c, 0.4, 0.74, 0.2);
      legs(h, 0x6f7478, 0.72, [[-0.7, -0.1], [1.5, -0.1], [-0.7, 0.5], [1.5, 0.5]]);
      h.box(1.25, 0.008, 0.5, 0x4a5a52, 0.9, 0.765, 0.2);
      h.box(0.22, 0.08, 0.2, 0x151515, -0.05, 0.8, -0.02);
      h.box(0.3, 0.04, 0.06, 0x151515, -0.05, 0.87, -0.02);
      // folding chairs along the wall
      [0.4, 1.0, 1.6].forEach(function (x) {
        h.box(0.42, 0.03, 0.4, 0x6f7478, x, 0.46, -2.75);
        h.box(0.42, 0.4, 0.03, 0x6f7478, x, 0.75, -2.95);
        legs(h, 0x4a4f52, 0.45, [[x - 0.18, -2.9], [x + 0.18, -2.9], [x - 0.18, -2.6], [x + 0.18, -2.6]]);
      });
      // mimeograph on a stand
      h.box(0.9, 0.85, 1.4, 0x7a8078, 3.4, 0.425, -2.05);
      h.box(0.55, 0.3, 0.5, 0x2e3436, 3.4, 1.0, -2.4);
      h.cyl(0.16, 0.16, 0.5, 0x4a5052, 3.4, 1.22, -2.4).rotation.x = Math.PI / 2;
      h.box(0.3, 0.14, 0.4, 0xeadfc6, 3.4, 0.92, -1.95);                             // stack of leaflets
      // chalkboard with the route
      h.box(0.05, 1.1, 2.2, 0x2f4a3a, W - 0.03, 1.6, 0.6);
      h.box(0.12, 0.04, 2.3, 0x6a4a2e, W - 0.08, 0.98, 0.6);
      [-0.2, 0.3, 0.8, 1.3].forEach(function (z, i) { h.box(0.06, 0.02, 0.32, h.lit(0xe8e8e0), W - 0.05, 1.9 - i * 0.16, z); });
      // wall map with the road south
      h.box(1.5, 1.0, 0.03, 0xe6e0cc, 0.6, 1.65, -D + 0.02);
      [[0.1, 1.95], [0.4, 1.8], [0.7, 1.62], [1.0, 1.42], [1.2, 1.25]].forEach(function (p) { h.box(0.2, 0.03, 0.035, h.lit(0xb5443a), p[0], p[1], -D + 0.025).rotation.z = -0.5; });
      // side table with a coffee urn
      h.box(1.0, 0.05, 0.9, 0xb08d5c, -3.3, 0.74, 2.35);
      legs(h, 0x6f7478, 0.72, [[-3.7, 2.0], [-2.9, 2.0], [-3.7, 2.7], [-2.9, 2.7]]);
      h.cyl(0.16, 0.16, 0.42, 0xb8bcc0, -3.45, 0.98, 2.6);
      // carton of leaflets
      h.box(0.6, 0.4, 0.5, 0xa88a5c, -2.9, 0.2, -2.4);
    }
  };

  return rooms;
})();
