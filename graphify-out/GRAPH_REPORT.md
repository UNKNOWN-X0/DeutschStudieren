# Graph Report - DeutschStudieren  (2026-10-24)

## Corpus Check
- 30 files · ~106,332 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 119 nodes · 129 edges · 15 communities (10 shown, 5 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f70455f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DOM and Progress State
- Practice Page and Modes
- GitHub Pages Workflow
- Answer and Progress Flow
- Online Vocabulary API
- Node Test Harness
- Spaced Repetition
- Practice Session Management
- Multiple Choice Mode
- Shared Session State
- Matching Mode
- Q: How should DeutschStudieren's architecture and graph cover its full learning journey, state, external services, and deployment?
- Project instructions
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `init()` - 8 edges
2. `German vocabulary practice` - 6 edges
3. `German Word Practice page` - 6 edges
4. `Online topic-based vocabulary` - 5 edges
5. `steps` - 4 edges
6. `handleStart()` - 4 edges
7. `newWord()` - 4 edges
8. `fetchOnlineVocabulary()` - 4 edges
9. `Q: How should DeutschStudieren's architecture and graph cover its full learning journey, state, external services, and deployment?` - 4 edges
10. `build` - 3 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --indirect_call--> `newWord()`  [INFERRED]
  js/answers-and-progress.js → js/practice.js
- `init()` --indirect_call--> `handleStart()`  [INFERRED]
  js/setup.js → js/practice.js
- `init()` --indirect_call--> `handleSubmit()`  [INFERRED]
  js/setup.js → js/answers-and-progress.js
- `init()` --indirect_call--> `resetProgress()`  [INFERRED]
  js/setup.js → js/answers-and-progress.js
- `Practice progress view` --conceptually_related_to--> `Local browser progress storage`  [INFERRED]
  index.html → README.md

## Import Cycles
- None detected.

## Communities (15 total, 5 thin omitted)

### Community 0 - "DOM and Progress State"
Cohesion: 0.07
Nodes (28): accuracyEl, answerInput, categoryGroup, categorySelect, contextExampleEl, correctCountEl, directionSelect, feedbackEl (+20 more)

### Community 1 - "Practice Page and Modes"
Cohesion: 0.14
Nodes (16): Typed, multiple-choice, and matching answer interfaces, Translation direction and practice mode controls, German Word Practice page, Practice progress view, Accuracy, answer count, and streak display, Online topic search control, Vocabulary source and category controls, Bundled German vocabulary and example sentences (+8 more)

### Community 2 - "GitHub Pages Workflow"
Cohesion: 0.14
Nodes (13): runs-on, steps, jobs, build, name, branches, branches, name (+5 more)

### Community 3 - "Answer and Progress Flow"
Cohesion: 0.29
Nodes (8): handleSubmit(), resetProgress(), updateProgressDisplay(), hideProgressSection(), init(), populateCategories(), showProgressSection(), toggleSourceInputs()

### Community 4 - "Online Vocabulary API"
Cohesion: 0.48
Nodes (6): fetchOnlineVocabulary(), fetchRelatedWords(), showOnlineStatus(), translateSingleWord(), translateWordsToGerman(), worker()

### Community 6 - "Spaced Repetition"
Cohesion: 0.47
Nodes (4): getSRSWeight(), saveSRSData(), selectWordWithSRS(), updateSRS()

### Community 7 - "Practice Session Management"
Cohesion: 0.70
Nodes (4): handleStart(), newWord(), setupInputQuestion(), showModeSection()

### Community 8 - "Multiple Choice Mode"
Cohesion: 0.83
Nodes (3): generateMultipleChoiceOptions(), handleMultipleChoiceAnswer(), setupMultipleChoiceQuestion()

### Community 9 - "Shared Session State"
Cohesion: 0.50
Nodes (3): filtered, matchingPairs, usedWords

### Community 12 - "Q: How should DeutschStudieren's architecture and graph cover its full learning journey, state, external services, and deployment?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should DeutschStudieren's architecture and graph cover its full learning journey, state, external services, and deployment?, Source Nodes

## Knowledge Gaps
- **4 isolated node(s):** `Accuracy, answer count, and streak display`, `Datamuse related-word service`, `MyMemory translation service`, `Performance-weighted spaced repetition`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 59 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `init()` connect `Answer and Progress Flow` to `Practice Session Management`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `init()` (e.g. with `handleSubmit()` and `resetProgress()`) actually correct?**
  _`init()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Accuracy, answer count, and streak display`, `Datamuse related-word service`, `MyMemory translation service` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DOM and Progress State` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Practice Page and Modes` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Should `GitHub Pages Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._