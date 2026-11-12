/* Out of Time 3D — rules and content.
   Pure logic with no DOM and no Three.js, so the 3D room and the text list
   run from the same state and the rules can be tested alone.

   Four scenes, each a room at one moment. Eight papers are in each room.
   Four belong to that moment. Four carry knowledge, words, or verdicts from
   later. Nothing on a paper says which kind it is. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.OOTRules = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DESK = 3;            // papers the player carries to the desk
  const LANTERN_COST = 8;    // presentist drift for each paper checked by lantern

  const BOSTON = {
    id: "boston-1774", title: "The merchant", when: "June 1774", actor: "this merchant",
    place: "Boston", date: "late June 1774",
    setup: "You keep a counting house near the wharves. A paper has been left on your table for your signature.",
    question: "How should we appraise this merchant's hesitation to sign?",
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
      { id: "excuse", type: "onesided",
        text: "The hesitation needs no explaining: the covenant was mob coercion, and refusing it was the only sensible course.",
        feedback: "This drops the other half of what he knew. The port was closed by Parliament, the grievance was real to his neighbours, and standing with them mattered to his trade." }
    ]
  };


  const PHILADELPHIA = {
    id: "philadelphia-1787", title: "The delegate", when: "August 1787", actor: "this delegate",
    place: "Philadelphia", date: "late August 1787",
    setup: "You are in a Northern delegate's rented room. The Convention sits behind closed doors a few streets away, and this week it is bargaining over the slave trade.",
    question: "How should we appraise this delegate's vote to accept the bargain protecting the slave trade?",
    items: [
      { id: "notes", belongs: true, label: "Notes of this week's debate",
        text: "South Carolina and Georgia say plainly that their states will not accept the plan if the importing of slaves is forbidden. Connecticut answers that each state should judge for itself.",
        note: "A paraphrase of the August 1787 debate as Madison recorded it. Delegates from the lower South said their states would not join without the trade, and some New Englanders urged leaving it alone." },
      { id: "committee", belongs: true, label: "Committee proposal, with pencil marks",
        text: "The legislature shall not prohibit the importation of such persons as the several states think proper to admit, before a year to be fixed. The word slave appears nowhere in it.",
        note: "The clause as adopted barred Congress from ending the trade before 1808 and avoided the word \"slave\". The three-fifths count had been agreed in July." },
      { id: "society", belongs: true, label: "Printed address from a Philadelphia society",
        text: "The Pennsylvania society for promoting the abolition of slavery asks the Convention to put an end to the trade in men.",
        note: "The society, with Benjamin Franklin as its president, drew up such a petition in June 1787. There is no evidence it was presented. Opposition to slavery was organised in this very city, and it did not have the votes." },
      { id: "home", belongs: true, label: "Letter from home",
        text: "Congress cannot raise a dollar or pay what it owes the army. After last winter's rising in Massachusetts, men here say that if this Convention fails there will be no union left to mend.",
        note: "A composite. The weakness of the Confederation and the shock of Shays' Rebellion in 1786 and 1787 made the collapse of the union a live fear, not a debating point." },
      { id: "war", belongs: false, kind: "hindsight", label: "Unsigned memorandum",
        text: "Everyone knows where this bargain leads: a war between North and South within a lifetime. Better to break the union now.",
        note: "Hindsight. Some delegates warned of a reckoning in general terms, but no one in 1787 knew of a war in 1861, and some expected slavery to decline on its own." },
      { id: "rights", belongs: false, kind: "later idea", label: "Handbill with a bold heading",
        text: "The clause is a landmark for universal human rights: it sets the date on which the trade will end.",
        note: "\"Universal human rights\" is a later frame, and the clause set no end date. It only barred Congress from acting for twenty years. No one at the time defended it as a victory for rights." },
      { id: "cotton", belongs: false, kind: "later event", label: "Letter from a Georgia correspondent",
        text: "Since the new engine for cleaning cotton, upland planters cannot get hands enough, and the price of slaves rises every season.",
        note: "The cotton gin dates from 1793. In 1787 the cotton boom that entrenched slavery had not begun, which is one reason a delegate could believe the institution would fade." },
      { id: "verdict", belongs: false, kind: "present-day verdict", label: "Card left on the windowsill",
        text: "They were simply evil men, and there is nothing further to explain.",
        note: "A verdict that ends inquiry. The wrong was named at the time, on the Convention floor and by the society across town. Explaining why men who saw it still bargained is the historian's work, and it is not the same as excusing them." }
    ],
    judgments: [
      { id: "bind", type: "sound",
        text: "The vote was a choice inside a real bind: a union that protected a trade many delegates called wrong, or the risk of no union at all. It can be explained without being excused.",
        feedback: "This holds the moral weight and the political constraint together. Understanding why delegates bargained is different from endorsing the bargain." },
      { id: "foresee", type: "presentist",
        text: "The vote was indefensible on its face: knowing what slavery would become and the war it would bring, any honest delegate would have let the union fail.",
        feedback: "This reasons from the cotton boom and the Civil War, neither of which a delegate could see in 1787." },
      { id: "normal", type: "onesided",
        text: "The vote needs no moral comment: slavery was normal then, so the delegates did nothing questionable by the standards of their day.",
        feedback: "The standards of the day included loud opposition. A petition against the trade was drafted in this city that summer, and delegates condemned the trade on the floor. Context is not relativism." }
    ]
  };

  const MANZANAR = {
    id: "manzanar-1943", title: "The questionnaire", when: "February 1943", actor: "this young man",
    place: "Manzanar, California", date: "February 1943",
    setup: "You are in one family's room in a barracks at Manzanar, a government camp in the California desert where Japanese Americans have been confined since 1942. This week every adult must fill in a questionnaire.",
    question: "How should we appraise this young man's choice between answering yes and answering no to questions 27 and 28?",
    items: [
      { id: "form", belongs: true, label: "The form on the table",
        text: "27. Are you willing to serve in the armed forces of the United States on combat duty, wherever ordered? 28. Will you swear unqualified allegiance to the United States and forswear any allegiance to the Japanese emperor?",
        note: "A close paraphrase of questions 27 and 28 on the form given to draft-age men in February 1943." },
      { id: "parents", belongs: true, label: "Note in your sister's hand",
        text: "Father and Mother cannot become citizens here; the law forbids it. If they forswear Japan they belong to no country at all. And if we answer differently from them, will we be split up?",
        note: "Immigrants from Japan were barred from naturalisation, so question 28 as first worded asked them to give up their only citizenship. The wording for them was revised partway through. Fear of family separation was widespread." },
      { id: "army", belongs: true, label: "Army notice from the mess hall board",
        text: "The War Department is forming a combat team of American citizens of Japanese ancestry. Volunteers are being accepted now.",
        note: "The combat team was announced at the start of February 1943. The questionnaire and the call for volunteers arrived together, so a yes on question 27 read as enlisting from behind barbed wire." },
      { id: "block", belongs: true, label: "Notes from last night's block meeting",
        text: "The block is split. Some say answer yes and get out of here. Some say no until our rights are given back. Nobody can tell us what a no will bring.",
        note: "A composite. Meetings in the camps were angry and divided, and officials could not or would not say what the answers would lead to." },
      { id: "tule", belongs: false, kind: "later event", label: "Typed transfer notice",
        text: "Persons answering no to question 28 are assigned to the segregation center at Tule Lake.",
        note: "The segregation policy came in July 1943, five months later. In February no one filling in the form knew what a no would cost, which is part of what made the choice so hard." },
      { id: "record", belongs: false, kind: "later event", label: "Newspaper clipping",
        text: "The Japanese American combat team is among the most decorated units in the Army. Its record has settled the loyalty question for good.",
        note: "The unit was only being formed in February 1943. Its record lay in the future and could not reassure anyone deciding that week." },
      { id: "redress", belongs: false, kind: "hindsight", label: "Letter on government letterhead",
        text: "The United States acknowledges that the confinement was a grave injustice and is paying redress to each surviving person.",
        note: "The apology and redress came in 1988. In 1943 people in the camps had no assurance of release, let alone of acknowledgment." },
      { id: "verdict", belongs: false, kind: "present-day verdict", label: "Card tucked in the window frame",
        text: "There was one honourable answer, and everyone who gave the other one was a coward.",
        note: "A verdict that sorts people from a safe distance. Both answers were given by people trying to protect family, dignity, and a future under coercion." }
    ],
    judgments: [
      { id: "both", type: "sound",
        text: "Both answers were reasoned responses to coercion. Yes and no were different ways of protecting family and dignity when the cost of either could not be known.",
        feedback: "This keeps the constraint in view: citizens confined without trial, asked to prove loyalty, with consequences no one would spell out." },
      { id: "legitimise", type: "presentist",
        text: "Yes was the wrong answer: the camps are now recognised as unjust, so anyone who cooperated was helping to legitimise them.",
        feedback: "This grades a 1943 choice by a judgment the country reached decades later, and overlooks what a yes was for: getting a family out." },
      { id: "precaution", type: "onesided",
        text: "The form was a reasonable wartime precaution, and a no simply showed where a person's loyalty lay.",
        feedback: "This takes the government's reading of the answers as the only one. A no was often a protest against confinement or a refusal to be separated from parents, not a statement about Japan." }
    ]
  };

  const NASHVILLE = {
    id: "nashville-1961", title: "The organisers", when: "May 1961", actor: "the students",
    place: "Nashville, Tennessee", date: "mid-May 1961",
    setup: "You are in a church basement office used by the Nashville student movement. Two days ago a bus carrying Freedom Riders was burned outside Anniston, Alabama, and riders were beaten in Birmingham. The first ride has stopped.",
    question: "How should we appraise the students' decision to send new riders into Alabama?",
    items: [
      { id: "news", belongs: true, label: "Monday's front page",
        text: "Bus burned outside Anniston. Riders beaten at the Birmingham terminal. Police were slow to arrive.",
        note: "The attacks were on Sunday, May 14, 1961. That the police delay in Birmingham had been arranged came out later; the delay itself was reported at once." },
      { id: "phone", belongs: true, label: "Telephone message slip",
        text: "Justice Department called from Washington. Says call it off. Says someone is going to be killed.",
        note: "A Justice Department aide phoned the Nashville students to stop them. Diane Nash answered that the riders had already signed their wills." },
      { id: "wire", belongs: true, label: "Wire about the first riders",
        text: "No driver will take the first group on. They are flying out to New Orleans. The ride is over unless someone picks it up.",
        note: "The original riders, organised by the Congress of Racial Equality, ended their ride by air after no bus driver would carry them further." },
      { id: "letters", belongs: true, label: "Sealed envelopes left with you",
        text: "Each is addressed in a different hand, and each says the same thing on the back: to be mailed if I do not come back.",
        note: "Volunteers wrote wills and farewell letters before leaving. They judged that some of them might be killed, and argued that if violence stopped this ride it would be used to stop everything after it." },
      { id: "icc", belongs: false, kind: "later event", label: "Printed terminal notice",
        text: "By order of the Interstate Commerce Commission, waiting rooms and lunch counters serving interstate passengers may not be segregated.",
        note: "The ICC issued its order in September 1961 and it took effect that November. In May, court rulings against segregated travel already existed and were going unenforced, which was the point of the rides." },
      { id: "certain", belongs: false, kind: "hindsight", label: "Typed memo",
        text: "These rides are the turning point. Washington will have to step in and the signs will come down, so the risk to the riders is small.",
        note: "Hindsight. Federal protection had been refused so far, and no one knew the government would act. The riders' own letters show how large they judged the risk to be." },
      { id: "title", belongs: false, kind: "later event", label: "Clipping about one of the riders",
        text: "Congressman John Lewis recalls the day he boarded the bus in Nashville.",
        note: "John Lewis was a 21-year-old student in 1961 and was elected to Congress in 1986. A rider's later standing says nothing about what he could count on that week." },
      { id: "verdict", belongs: false, kind: "present-day verdict", label: "Index card on the chalk ledge",
        text: "Anyone who asked for a pause was a traitor to the cause.",
        note: "A verdict, not an analysis. People who urged delay included movement veterans who felt responsible for the lives of young volunteers." }
    ],
    judgments: [
      { id: "escalate", type: "sound",
        text: "The decision was a calculated escalation: accepting grave danger to the riders so that violence would not be seen to work, and to press a reluctant federal government to act.",
        feedback: "This keeps both the danger and the reasoning in view, and treats the outcome as unknown, as it was in that room." },
      { id: "easy", type: "presentist",
        text: "The decision was an easy one: the rides were bound to succeed, so sending more riders took little risk.",
        feedback: "This reads the ending back into the choice. The people in the room were holding sealed farewell letters." },
      { id: "reckless", type: "onesided",
        text: "The decision was reckless: the courts had already ruled, and patience would have done the work without risking young lives.",
        feedback: "The rulings existed and were not being enforced. Leaving that out makes waiting look safer and more effective than anyone then had reason to believe." }
    ]
  };

  const SCENES = [BOSTON, PHILADELPHIA, MANZANAR, NASHVILLE];
  function sceneById(id) { return SCENES.filter(function (x) { return x.id === id; })[0] || SCENES[0]; }

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

  function newState(seed, sceneId) {
    const rand = rng(seed), SCENE = sceneById(sceneId);
    return {
      seed: seed, scene: SCENE,
      order: shuffled(SCENE.items.map(function (i) { return i.id; }), rand),
      judgments: shuffled(SCENE.judgments.map(function (j) { return j.id; }), rand),
      read: {}, desk: [], lantern: {}, judged: null
    };
  }
  function item(s, id) { return s.scene.items.filter(function (i) { return i.id === id; })[0]; }
  function judgment(s, id) { return s.scene.judgments.filter(function (j) { return j.id === id; })[0]; }

  function read(s, id) { s.read[id] = true; return item(s, id); }
  function onDesk(s, id) { return s.desk.indexOf(id) !== -1; }
  function take(s, id) {
    if (onDesk(s, id) || s.desk.length >= DESK || !item(s, id)) return false;
    s.desk.push(id); return true;
  }
  function putBack(s, id) {
    const i = s.desk.indexOf(id);
    if (i === -1) return false;
    s.desk.splice(i, 1); return true;
  }
  /* The lantern shows whether a paper belongs. Each new paper checked costs drift. */
  function lantern(s, id) {
    const it = item(s, id);
    const fresh = !s.lantern[id];
    s.lantern[id] = true;
    return { belongs: it.belongs, cost: fresh ? LANTERN_COST : 0 };
  }
  function lanternCount(s) { return Object.keys(s.lantern).length; }
  function driftSoFar(s) { return Math.min(100, lanternCount(s) * LANTERN_COST); }
  function ready(s) { return s.desk.length === DESK; }
  function judge(s, id) { if (!ready(s) || !judgment(s, id)) return null; s.judged = id; return judgment(s, id); }

  function result(s) {
    const good = s.desk.filter(function (id) { return item(s, id).belongs; }).length;
    const bad = s.desk.length - good;
    const j = s.judged ? judgment(s.judged && s, s.judged) : null;
    const when = s.scene.when, year = when.split(" ").pop(), actor = s.scene.actor;
    const sound = !!j && j.type === "sound";
    const fidelity = Math.max(0, Math.min(100, 50 + 12 * good - 10 * bad + (sound ? 14 : 0)));
    const drift = Math.min(100, lanternCount(s) * LANTERN_COST + 20 * bad +
      (j && j.type === "presentist" ? 25 : 0) + (j && j.type === "onesided" ? 15 : 0));
    let head, body;
    if (sound && bad === 0 && drift < 25) {
      head = "You judged " + year + " from inside " + year;
      body = "Every paper on the table was one that could have been held in " + when + ", and the appraisal rests on them.";
    } else if (sound && bad === 0) {
      head = "A sound appraisal, found by lantern light";
      body = "The table was right and so was the appraisal. The lantern did much of the sorting, and the lantern is hindsight.";
    } else if (sound) {
      head = "A fair appraisal standing on borrowed knowledge";
      body = "The appraisal holds, but " + (bad === 1 ? "one paper" : bad + " papers") + " on the table came from later. A conclusion can be right while its evidence is out of time.";
    } else if (j && j.type === "presentist") {
      head = "Judged from the present";
      body = "The appraisal measures " + actor + " against an ending no one in " + when + " could see.";
    } else {
      head = "Half of the room left out";
      body = "The appraisal explains the choice with only part of what was known in " + when + ". Context means all of it, including the parts that cut against a tidy answer.";
    }
    return { fidelity: fidelity, drift: drift, good: good, bad: bad, lantern: lanternCount(s), sound: sound, head: head, body: body };
  }

  return {
    SCENES: SCENES, sceneById: sceneById, DESK: DESK, LANTERN_COST: LANTERN_COST,
    newState: newState, item: item, judgment: judgment, read: read, onDesk: onDesk,
    take: take, putBack: putBack, lantern: lantern, driftSoFar: driftSoFar,
    ready: ready, judge: judge, result: result
  };
});
