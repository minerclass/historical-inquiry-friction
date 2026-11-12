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
    const h = $(id).querySelector("h1,h2:not(#readLabel)");
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
    $("focusNote").textContent = id && S ? R.item(id).label + (R.onDesk(S, id) ? " (on the desk)" : "") : "Walk up to a paper to read it.";
  }
  function renderList() {
    const ul = $("itemList"); ul.textContent = "";
    if (!S) return;
    S.order.forEach(function (id) {
      const it = R.item(id), li = el("li"), b = el("button", "", "Read: " + it.label);
      b.type = "button";
      b.addEventListener("click", function () { if (!inRoom()) return; if (scene) scene.goTo(id); openReading(id); });
      li.appendChild(b);
      const bits = [];
      if (R.onDesk(S, id)) bits.push("on the desk");
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
      ? "Three papers are on the desk. Swap any you doubt, or sit down and judge."
      : "Carry three papers this merchant could have held to the green cloth. " + n + " of 3 so far.";
    $("judgeBtn").disabled = !R.ready(S);
    if (scene) { scene.setDesk(S.desk); showFocus(scene.focus()); }
    if (open) paintReading();
  }
  function openReading(id) {
    if (!inRoom() || !R.item(id)) return;
    open = id; R.read(S, id);
    paintReading(); renderList();
    $("reading").hidden = false;
    $("readLabel").tabIndex = -1; $("readLabel").focus({ preventScroll: false });
    announce(R.item(id).label + ". " + R.item(id).text);
  }
  function paintReading() {
    const it = R.item(open), on = R.onDesk(S, open), full = S.desk.length >= R.DESK;
    $("readLabel").textContent = it.label;
    $("readText").textContent = it.text;
    $("takeBtn").textContent = on ? "Take it off the desk" : (full ? "The desk is full" : "Carry it to the desk");
    $("takeBtn").disabled = !on && full;
    const used = !!S.lantern[open];
    $("lanternBtn").textContent = used ? "Lantern already used here" : "Hold the lantern to it (+" + R.LANTERN_COST + " drift)";
    $("lanternBtn").disabled = used;
    $("lanternNote").hidden = !used;
    if (used) $("lanternNote").textContent = it.belongs
      ? "In the lantern's cold light nothing about this paper changes. It belongs to June 1774."
      : "In the lantern's cold light this paper does not belong to June 1774.";
  }
  function closeReading() { open = null; $("reading").hidden = true; if (scene) $("scene").focus({ preventScroll: true }); }

  $("takeBtn").addEventListener("click", function () {
    if (!open) return;
    const label = R.item(open).label;
    if (R.onDesk(S, open)) { R.putBack(S, open); announce(label + " put back."); }
    else if (R.take(S, open)) announce(label + " carried to the desk. " + S.desk.length + " of 3.");
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
    $("deskRecap").textContent = "On the desk: " + S.desk.map(function (id) { return R.item(id).label; }).join("; ") + ".";
    const wrap = $("options"); wrap.textContent = "";
    S.judgments.forEach(function (jid, i) {
      const b = el("button"); b.type = "button";
      b.appendChild(el("kbd", "", String(i + 1)));
      b.appendChild(el("span", "", R.judgment(jid).text));
      b.addEventListener("click", function () { choose(jid); });
      wrap.appendChild(b);
    });
    step("stepJudge");
    announce("Three appraisals. Choose the one you can best defend from the desk.");
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
    $("lanternUsed").textContent = r.lantern + " of " + R.SCENE.items.length;
    const body = $("itemTable").tBodies[0]; body.textContent = "";
    R.SCENE.items.forEach(function (it) {
      const tr = el("tr"), on = R.onDesk(S, it.id);
      tr.appendChild(el("th", "", it.label)).scope = "row";
      tr.appendChild(el("td", on ? (it.belongs ? "ok" : "no") : "", on ? "On the desk" : "Left"));
      tr.appendChild(el("td", it.belongs ? "ok" : "no", it.belongs ? "Belongs" : "Later: " + it.kind));
      tr.appendChild(el("td", "", it.note));
      body.appendChild(tr);
    });
    step("stepDebrief");
    announce("Debrief. " + r.head + ". " + r.body);
  }

  /* ---------- wiring ---------- */
  function start() {
    S = R.newState(parseInt(params.get("seed"), 10) || (Date.now() & 0xffffff));
    open = null; $("reading").hidden = true;
    if (scene) scene.reset();
    step("stepRoom"); renderRoom();
    if (scene) $("scene").focus({ preventScroll: true });
    announce("You are in the counting house. Eight papers are in the room. Carry three to the desk.");
  }
  $("startBtn").addEventListener("click", start);
  $("replayBtn").addEventListener("click", start);
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
})();
