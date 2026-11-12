/* Out of Time 3D — rules and content.
   Pure logic with no DOM and no Three.js, so the 3D room and the text list
   run from the same state and the rules can be tested alone.

   One scene so far: a Boston counting house, late June 1774. Eight papers
   are in the room. Four belong to that moment. Four carry knowledge, words,
   or verdicts from later. Nothing on a paper says which kind it is. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.OOTRules = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DESK = 3;            // papers the player carries to the desk
  const LANTERN_COST = 8;    // presentist drift for each paper checked by lantern

  const SCENE = {
    id: "boston-1774",
    place: "Boston", date: "late June 1774",
    setup: "You keep a counting house near the wharves. A paper has been left on your table for your signature.",
    question: "A historian's question, not the merchant's: how should we appraise this merchant's hesitation to sign?",
    items: [
      { id: "notice", belongs: true, label: "Printed notice by the door",
        text: "By Act of Parliament: from the first day of June no goods are to be landed or shipped at the port of Boston, food and fuel brought along the coast excepted.",
        note: "The Boston Port Act took effect on June 1, 1774. Trade through the harbour stopped. This is the emergency the merchant is living in." },
      { id: "covenant", belongs: true, label: "Paper left for your signature",
        text: "We the subscribers agree to suspend all commercial dealing with Great Britain, to buy no British goods after the last day of August, and to break off dealing with any who refuse to sign.",
        note: "A paraphrase of the Solemn League and Covenant, which Boston's committee of correspondence approved in early June 1774. It asked signers to isolate those who would not sign." },
      { id: "ledger", belongs: true, label: "Your ledger, open at this month",
        text: "Owing to two London houses for goods taken on credit: more than a year's profit. Warehouse stock unsold. Three clerks and a household to keep.",
        note: "A composite, written for this game. A merchant's first knowledge was his own books: debts abroad, stock he could not move, and people who depended on him." },
      { id: "neighbour", belongs: true, label: "Note from a neighbour",
        text: "They have printed a list of those who protested the covenant, and my name is on it. Two customers have taken their trade elsewhere this week.",
        note: "A composite. Boston printers did publish a list of people who protested the covenant. Refusing had a visible cost in standing and custom." },
      { id: "memo", belongs: false, kind: "hindsight", label: "Memorandum in a confident hand",
        text: "Sign. The colonies are bound for independence and a nation of their own, so whatever is lost now will be made good.",
        note: "Hindsight. In mid-1774 the public argument was about restoring rights within the empire. Almost no one could see independence coming, so no one could count on it to repay a loss." },
      { id: "pamphlet", belongs: false, kind: "later idea", label: "Pamphlet with a bold title",
        text: "Non-importation is nonviolent resistance: a peaceful campaign of civil disobedience that persuades by moral example.",
        note: "Later words and a later idea. In 1774 the boycotts were enforced by committees, public naming, and sometimes crowds. Reading them as principled nonviolence imports a framework that came afterward." },
      { id: "card", belongs: false, kind: "present-day verdict", label: "Card propped on the mantel",
        text: "There is a right side of history here, and anyone who hesitates has chosen the wrong one.",
        note: "A verdict from the present. \"The right side of history\" sorts people by how things later turned out, which is exactly what the merchant could not know." },
      { id: "handbill", belongs: false, kind: "later event", label: "Black-bordered handbill",
        text: "In memory of our countrymen killed by the King's troops at Lexington and Concord.",
        note: "A later event. The fighting at Lexington and Concord was in April 1775, ten months after this room. In June 1774 no one had been killed in battle." }
    ],
    judgments: [
      { id: "calc", type: "sound",
        text: "The hesitation was a reasonable calculation between two real dangers: ruin if he signed, and loss of standing and custom if he refused.",
        feedback: "This appraisal rests on what pressed on the merchant in June 1774, and treats the outcome as unknown, as it was to him." },
      { id: "condemn", type: "presentist",
        text: "The hesitation was a failure of nerve: a true patriot would have put the coming independence above his own wealth.",
        feedback: "This assumes the merchant knew where events were heading. It judges him by an ending he could not see, and passes over debts and dependants he could." },
      { id: "excuse", type: "excuse",
        text: "The hesitation needs no explaining: the covenant was mob coercion, and refusing it was the only sensible course.",
        feedback: "This drops the other half of what he knew. The port was closed by Parliament, the grievance was real to his neighbours, and standing with them mattered to his trade." }
    ]
  };

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffled(list, rand) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function newState(seed) {
    const rand = rng(seed);
    return {
      seed: seed,
      order: shuffled(SCENE.items.map(function (i) { return i.id; }), rand),
      judgments: shuffled(SCENE.judgments.map(function (j) { return j.id; }), rand),
      read: {}, desk: [], lantern: {}, judged: null
    };
  }
  function item(id) { return SCENE.items.filter(function (i) { return i.id === id; })[0]; }
  function judgment(id) { return SCENE.judgments.filter(function (j) { return j.id === id; })[0]; }

  function read(s, id) { s.read[id] = true; return item(id); }
  function onDesk(s, id) { return s.desk.indexOf(id) !== -1; }
  function take(s, id) {
    if (onDesk(s, id) || s.desk.length >= DESK || !item(id)) return false;
    s.desk.push(id); return true;
  }
  function putBack(s, id) {
    const i = s.desk.indexOf(id);
    if (i === -1) return false;
    s.desk.splice(i, 1); return true;
  }
  /* The lantern shows whether a paper belongs. Each new paper checked costs drift. */
  function lantern(s, id) {
    const it = item(id);
    const fresh = !s.lantern[id];
    s.lantern[id] = true;
    return { belongs: it.belongs, cost: fresh ? LANTERN_COST : 0 };
  }
  function lanternCount(s) { return Object.keys(s.lantern).length; }
  function driftSoFar(s) { return Math.min(100, lanternCount(s) * LANTERN_COST); }
  function ready(s) { return s.desk.length === DESK; }
  function judge(s, id) { if (!ready(s) || !judgment(id)) return null; s.judged = id; return judgment(id); }

  function result(s) {
    const good = s.desk.filter(function (id) { return item(id).belongs; }).length;
    const bad = s.desk.length - good;
    const j = s.judged ? judgment(s.judged) : null;
    const sound = !!j && j.type === "sound";
    const fidelity = Math.max(0, Math.min(100, 50 + 12 * good - 10 * bad + (sound ? 14 : 0)));
    const drift = Math.min(100, lanternCount(s) * LANTERN_COST + 20 * bad +
      (j && j.type === "presentist" ? 25 : 0) + (j && j.type === "excuse" ? 15 : 0));
    let head, body;
    if (sound && bad === 0 && drift < 25) {
      head = "You judged 1774 from inside 1774";
      body = "Every paper on the desk was one the merchant could have held, and the appraisal rests on them.";
    } else if (sound && bad === 0) {
      head = "A sound appraisal, found by lantern light";
      body = "The desk was right and so was the appraisal. The lantern did much of the sorting, and the lantern is hindsight.";
    } else if (sound) {
      head = "A fair appraisal standing on borrowed knowledge";
      body = "The appraisal holds, but " + (bad === 1 ? "one paper" : bad + " papers") + " on the desk came from later. A conclusion can be right while its evidence is out of time.";
    } else if (j && j.type === "presentist") {
      head = "Judged from the present";
      body = "The appraisal measures the merchant against an ending he could not see.";
    } else {
      head = "Understanding slid into excuse";
      body = "Contextualizing a choice is not the same as clearing it. The appraisal left out half of what the merchant knew.";
    }
    return { fidelity: fidelity, drift: drift, good: good, bad: bad, lantern: lanternCount(s), sound: sound, head: head, body: body };
  }

  return {
    SCENE: SCENE, DESK: DESK, LANTERN_COST: LANTERN_COST,
    newState: newState, item: item, judgment: judgment, read: read, onDesk: onDesk,
    take: take, putBack: putBack, lantern: lantern, driftSoFar: driftSoFar,
    ready: ready, judge: judge, result: result
  };
});
