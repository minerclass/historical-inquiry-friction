/* Out of Time 3D — page controller.
   Every action is an ordinary button, and the list of papers below the room
   does everything the 3D view does, so the game is playable by keyboard,
   by screen reader, and on devices without 3D. */
(function () {
  "use strict";
  const R = window.OOTRules;
  const $ = function (id) { return document.getElementById(id); };
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPower = params.get("low") === "1" ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);

  let S = null, scene = null, open = null;

  function listOnly() {
    scene = null;
    $("scene").hidden = true; $("walkbar").hidden = true; $("nogl").hidden = false;
    $("plan").open = true;
  }
  if (params.get("list") === "1" || !window.THREE) listOnly();
  else {
    scene = window.OOTScene.create($("scene"), { low: lowPower, reduced: reduced, onLost: listOnly, onFocus: showFocus, onRead: openReading });
    if (!scene) listOnly();
  }

  function announce(text) { $("announcer").textContent = ""; setTimeout(function () { $("announcer").textContent = text; }, 30); }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function step(id) {
    ["stepIntro", "stepRoom", "stepJudge", "stepDebrief"].forEach(function (s) { $(s).hidden = s !== id; });
    const h = $(id).querySelector("h1,h2:not(#readLabel)") || $(id).querySelector("p");
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  function inRoom() { return S && !$("stepRoom").hidden; }

  /* ---------- the room ---------- */
  function hud() {
    $("deskCount").textContent = S ? S.desk.length : 0;
    $("driftVal").textContent = S ? R.driftSoFar(S) : 0;
  }
  function showFocus(id) {
    $("readBtn").disabled = !id || !inRoom();
    $("focusNote").textContent = id && S ? R.item(S, id).label + (R.onDesk(S, id) ? " (on the table)" : "") : "Walk up to a paper to read it.";
  }
  function renderList() {
    const ul = $("itemList"); ul.textContent = "";
    if (!S) return;
    S.order.forEach(function (id) {
      const it = R.item(S, id), li = el("li"), b = el("button", "", "Read: " + it.label);
      b.type = "button";
      b.addEventListener("click", function () { if (!inRoom()) return; if (scene) scene.goTo(id); openReading(id); });
      li.appendChild(b);
      const bits = [];
      if (R.onDesk(S, id)) bits.push("on the table");
      else if (S.read[id]) bits.push("read");
      if (S.lantern[id]) bits.push(it.belongs ? "lantern: belongs here" : "lantern: does not belong here");
      li.appendChild(el("span", "state", bits.join(" · ")));
      ul.appendChild(li);
    });
  }
  function renderRoom() {
    hud(); renderList();
    const n = S.desk.length;
    $("roomPrompt").textContent = n === R.DESK
      ? "Three papers are on the table. Swap any you doubt, or sit down and judge."
      : "Carry three papers that could have been held here in " + S.scene.when + " to the cloth on the table. " + n + " of 3 so far.";
    $("judgeBtn").disabled = !R.ready(S);
    if (scene) { scene.setDesk(S.desk); showFocus(scene.focus()); }
    if (open) paintReading();
  }
  function openReading(id) {
    if (!inRoom() || !R.item(S, id)) return;
    open = id; R.read(S, id);
    paintReading(); renderList();
    $("reading").hidden = false;
    $("readLabel").tabIndex = -1; $("readLabel").focus({ preventScroll: false });
    announce(R.item(S, id).label + ". " + R.item(S, id).text);
  }
  function paintReading() {
    const it = R.item(S, open), on = R.onDesk(S, open), full = S.desk.length >= R.DESK;
    $("readLabel").textContent = it.label;
    $("readText").textContent = it.text;
    $("takeBtn").textContent = on ? "Take it off the table" : (full ? "The table is full" : "Carry it to the table");
    $("takeBtn").disabled = !on && full;
    const used = !!S.lantern[open];
    $("lanternBtn").textContent = used ? "Lantern already used here" : "Hold the lantern to it (+" + R.LANTERN_COST + " drift)";
    $("lanternBtn").disabled = used;
    $("lanternNote").hidden = !used;
    if (used) $("lanternNote").textContent = it.belongs
      ? "In the lantern's cold light nothing about this paper changes. It belongs to " + S.scene.when + "."
      : "In the lantern's cold light this paper does not belong to " + S.scene.when + ".";
  }
  function closeReading() { open = null; $("reading").hidden = true; if (scene) $("scene").focus({ preventScroll: true }); }

  $("takeBtn").addEventListener("click", function () {
    if (!open) return;
    const label = R.item(S, open).label;
    if (R.onDesk(S, open)) { R.putBack(S, open); announce(label + " put back."); }
    else if (R.take(S, open)) announce(label + " carried to the table. " + S.desk.length + " of 3.");
    renderRoom();
  });
  $("lanternBtn").addEventListener("click", function () {
    if (!open) return;
    const r = R.lantern(S, open);
    if (scene) scene.lantern(open, r.belongs);
    renderRoom();
    announce($("lanternNote").textContent + " Presentist drift is now " + R.driftSoFar(S) + ".");
  });
  $("closeBtn").addEventListener("click", closeReading);
  $("readBtn").addEventListener("click", function () { if (scene && scene.focus()) openReading(scene.focus()); });

  /* ---------- judging ---------- */
  $("judgeBtn").addEventListener("click", function () {
    if (!R.ready(S)) return;
    closeReading();
    $("question").textContent = S.scene.question;
    $("deskRecap").textContent = "On the table: " + S.desk.map(function (id) { return R.item(S, id).label; }).join("; ") + ".";
    const wrap = $("options"); wrap.textContent = "";
    S.judgments.forEach(function (jid, i) {
      const b = el("button"); b.type = "button";
      b.appendChild(el("kbd", "", String(i + 1)));
      b.appendChild(el("span", "", R.judgment(S, jid).text));
      b.addEventListener("click", function () { choose(jid); });
      wrap.appendChild(b);
    });
    step("stepJudge");
    announce(S.scene.question + " Three appraisals. Choose the one you can best defend from the table.");
  });
  $("backBtn").addEventListener("click", function () { step("stepRoom"); renderRoom(); });
  function choose(jid) {
    const j = R.judge(S, jid); if (!j) return;
    const r = R.result(S);
    $("verdictHead").textContent = r.head;
    $("verdictBody").textContent = r.body;
    $("judgeFeedback").textContent = "Your appraisal: " + j.feedback;
    $("fidelity").textContent = r.fidelity;
    $("drift").textContent = r.drift;
    $("driftVal").textContent = r.drift;
    $("lanternUsed").textContent = r.lantern + " of " + S.scene.items.length;
    $("whenHead").textContent = "In " + S.scene.when;
    const body = $("itemTable").tBodies[0]; body.textContent = "";
    S.scene.items.forEach(function (it) {
      const tr = el("tr"), on = R.onDesk(S, it.id);
      tr.appendChild(el("th", "", it.label)).scope = "row";
      tr.appendChild(el("td", on ? (it.belongs ? "ok" : "no") : "", on ? "On the table" : "Left"));
      tr.appendChild(el("td", it.belongs ? "ok" : "no", it.belongs ? "Belongs" : "Later: " + it.kind));
      tr.appendChild(el("td", "", it.note));
      body.appendChild(tr);
    });
    step("stepDebrief");
    announce("Debrief. " + r.head + ". " + r.body);
  }

  /* ---------- wiring ---------- */
  let sceneId = null;
  function start(id) {
    sceneId = id || sceneId || R.SCENES[0].id;
    S = R.newState(parseInt(params.get("seed"), 10) || (Date.now() & 0xffffff), sceneId);
    open = null; $("reading").hidden = true;
    $("whereWhen").textContent = S.scene.place + ", " + S.scene.date;
    $("roomSetup").textContent = S.scene.setup;
    $("stage").hidden = false;
    if (scene) { scene.resize(); scene.load(S.scene.id); }
    step("stepRoom"); renderRoom();
    if (scene) $("scene").focus({ preventScroll: true });
    announce(S.scene.place + ", " + S.scene.date + ". " + S.scene.setup + " Eight papers are in the room. Carry three to the table.");
  }
  function menu() {
    S = null; open = null;
    $("stage").hidden = true; $("whereWhen").textContent = "Four rooms";
    hud(); renderList(); step("stepIntro");
  }
  R.SCENES.forEach(function (sc) {
    const b = el("button"); b.type = "button";
    b.appendChild(el("span", "t", sc.title));
    b.appendChild(el("span", "w", sc.place + ", " + sc.date));
    b.appendChild(el("span", "d", sc.question));
    b.addEventListener("click", function () { start(sc.id); });
    $("rooms").appendChild(b);
  });
  $("replayBtn").addEventListener("click", function () { start(); });
  $("otherBtn").addEventListener("click", menu);
  document.querySelectorAll(".walkpad button[data-move]").forEach(function (b) {
    const name = b.dataset.move;
    b.addEventListener("pointerdown", function (e) { e.preventDefault(); if (scene) scene.hold(name, true); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (n) {
      b.addEventListener(n, function () { if (scene) scene.hold(name, false); });
    });
    b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    b.addEventListener("click", function (e) { if (e.detail === 0 && scene) scene.nudge(name); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
    if (inRoom()) {
      if ((e.key === "e" || e.key === "E") && scene && scene.focus()) openReading(scene.focus());
      else if (e.key === "Escape" && open) closeReading();
    } else if (!$("stepJudge").hidden && e.key >= "1" && e.key <= "3") {
      const jid = S.judgments[parseInt(e.key, 10) - 1];
      if (jid) choose(jid);
    }
  });
  hud();
  if (params.get("scene") && R.sceneById(params.get("scene")).id === params.get("scene")) start(params.get("scene"));
})();
