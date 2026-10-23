const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const base = require("node:path").resolve(__dirname, "..") + "/";
function el() {
  const classes = new Set();
  return {
    value: "",
    disabled: false,
    style: {},
    textContent: "",
    className: "",
    dataset: {},
    children: [],
    classList: {
      add: (x) => classes.add(x),
      remove: (x) => classes.delete(x),
      contains: (x) => classes.has(x),
    },
    addEventListener() {},
    appendChild(x) {
      this.children.push(x);
    },
    focus() {},
  };
}
function de() {
  let timers = [];
  let els = {};
  const c = {
    window: { GERMAN_WORDS: [] },
    localStorage: {
      getItem() {
        return null;
      },
    },
    Math: Object.create(Math),
    document: {
      getElementById: (id) => (els[id] ||= el()),
      createElement: el,
      querySelectorAll: () => [],
    },
    setTimeout: (f) => {
      timers.push(f);
      return timers.length;
    },
    clearTimeout: (i) => {
      timers[i - 1] = () => {};
    },
    feedbackEl: el(),
    answerInput: el(),
    submitBtn: el(),
    updateStats() {},
    updateSRS() {},
    newWord() {},
    init() {},
  };
  vm.createContext(c);
  for (const f of ["state", "matching", "answers-and-progress"])
    vm.runInContext(fs.readFileSync(base + "js/" + f + ".js", "utf8"), c);
  return { c, timers, els };
}
test("matching ignores a third click while an unmatched pair is shown", () => {
  const { c, timers } = de();
  const a = el(),
    b = el(),
    d = el();
  a.dataset.pairId = "0";
  b.dataset.pairId = "1";
  d.dataset.pairId = "0";
  vm.runInContext("matchingPairs=[{},{}]", c);
  c.handleCardClick(a);
  c.handleCardClick(b);
  c.handleCardClick(d);
  assert.equal(d.classList.contains("matched"), false);
  assert.doesNotThrow(() => timers[0]());
});
test("matching chooses eight distinct pairs even with repeated random draws", () => {
  const { c, els } = de();
  c.Math.random = () => 0;
  vm.runInContext(
    'filtered=Array.from({length:8},(_,i)=>({word_de:"DE"+i,word_en:"EN"+i}));setupMatchingGame();',
    c,
  );
  assert.equal(els["matching-grid"].children.length, 16);
});
test("submitting the same vocabulary question twice only scores it once", () => {
  const { c } = de();
  vm.runInContext('current={word_de:"Haus",word_en:"house"}', c);
  c.answerInput.value = "house";
  c.handleSubmit();
  c.handleSubmit();
  assert.equal(vm.runInContext("totalCount", c), 1);
});

for (const answer of ["thick", "fat", "thick/fat"]) {
  test(`accepts alternative translation: ${answer}`, () => {
    const { c } = de();
    vm.runInContext(
      'current={word_de:"dick",word_en:"thick/fat",word_en_plural:"thick/fat"}',
      c,
    );
    c.answerInput.value = answer;
    c.handleSubmit();
    assert.equal(vm.runInContext("correctCount", c), 1);
  });
}
