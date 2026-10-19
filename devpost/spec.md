---
doc: spec
status: approved
---
# Work4Tomorrow — Technical Specification

Approved by the user · 18 October 2026. Implements the approved prd.md. Numerical details originally labelled proposals were approved with this blueprint; no application code has been built yet.

## How This Works, In Plain Language
The browser displays forms, reads the local documents the user selects, and lets the user correct their details. It saves confirmed profiles and jobs in IndexedDB: a small database belonging to this website in that browser. JavaScript turns the confirmed information into cost breakdowns, evidence checks and explained comparisons. Saved results contain their own copy of the inputs, so later edits cannot rewrite history.
HTML structures the screens, CSS supplies the calm blue presentation, and JavaScript handles behaviour. Python is a development and learning tool: it independently checks sample cost calculations. It is not required on a job seeker's phone and does not run an online server for private documents. Clearing browser data or changing the website address can make saved information unavailable; this is not cloud backup.

## The Core Journey Through the System
Implements prd.md > The Core Journey.
1. Open the app: load the saved profile, current job, jobs and comparison summaries from IndexedDB. First use offers profile creation; no online login.
2. Enter a profile or select a local CV: extraction produces untrusted text, a review form proposes fields, and the user corrects and confirms them before saving.
3. Add a job: manual entry, pasted text or local file follows the same review path. Source links are retained as references, not automatically fetched.
4. Select one to three opportunities, optionally including a separate current-job baseline. Choose rank or adjustable priority mode.
5. Review requirement-to-evidence suggestions. Confirm/correct matches; unresolved evidence remains visible. Run cost, hours, readiness, salary and comparison functions on these inputs.
6. Display factor explanations and advantages/disadvantages, conditional options and missing information. Save a snapshot only after a successful database transaction.
7. Reopen results. Revisions mark them changed; deleting a job moves affected snapshots to History while retaining their original data.

## Stack
Learner agreed: HTML, CSS, JavaScript and IndexedDB; Python for calculation checks and learning. Use browser ES modules and a small static project without a UI framework or build step. This makes the input-to-result code easier to trace; screen rendering and navigation are our responsibility.
Browser API documentation: https://developer.mozilla.org/en-US/docs/Web/HTML · https://developer.mozilla.org/en-US/docs/Web/CSS · https://developer.mozilla.org/en-US/docs/Web/JavaScript · https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
Proposed extraction dependencies: PDF.js for text-based PDFs (https://mozilla.github.io/pdf.js/) and Mammoth for DOCX text (https://github.com/mwilliamson/mammoth.js). TXT uses File.text() (https://developer.mozilla.org/en-US/docs/Web/API/Blob/text). Retrieve, inspect and pin maintained compatible releases during the first extraction build step; versions and browser performance have not yet been verified. Bundle local copies and licence notices rather than relying on runtime CDN requests.
Python 3, standard library only, for developer checks and local static serving: https://docs.python.org/3/library/http.server.html and https://docs.python.org/3/library/unittest.html.

## Where It Runs and How Someone Tries It
From the project root, run `python3 -m http.server 8000 --bind 127.0.0.1` (Windows: `py -m http.server 8000 --bind 127.0.0.1`). Open http://localhost:8000/ in the same browser and port each time. Do not open index.html directly as a file: modules and workers require an HTTP origin.
A phone does not need Python: it opens the eventual HTTPS static site. Hosting provider remains unchosen; a stable public HTTPS demo is recommended for direct phone testing but not treated as an agreed deployment. Before broad sharing, confirm the competition's current accessibility rules and chosen hosting. Required submission includes a public repository under SihleMpungose and a public short demo video; deployment does not replace either.
Baseline validation targets: current Android Chrome and desktop Chrome/Edge; check Firefox where available. No claim of tested compatibility yet. No API keys or online document-processing account required.

## Look and Feel
Implements prd.md > Look and Feel; Screens and Layout.
Use navy headings, medium/deep blue actions, pale blue backgrounds and white reading surfaces. Comfortable spacing, system fonts, visible keyboard focus, labelled inputs and readable text contrast. Calm, practical, hopeful copy. Mobile-first single-column forms; comparison cards stack on narrow screens, with factor-by-factor sections. Keep selection count and compare action accessible while scrolling.
Amber signals a known deadline within three calendar days; past dates get a distinct passed-date label. Unknown deadlines never imply urgency. Use local South African dates for closing-day comparisons. Availability remains user-controlled. No purely colour-based meanings.

## Components
### App Shell and Dashboard
Implements prd.md > Screens and Layout; Job Collection and Comparison Selection.
Hash navigation connects profile, jobs, results and History without server routing. Show profile summary, Add job, searchable current jobs, active saved comparisons. Fourth selection is blocked without clearing the first three. One selected = Evaluate job; two/three = Compare jobs. Empty states invite the next action; sample data is loaded only by an explicit labelled demo action.
### Profile and Current Job
Implements prd.md > Profile and Reusable Costs; Current Job Baseline; Comparison Factors and Working Hours.
Store skills, certificates, dated work/volunteer tasks, salary goals, travel defaults, preferred weekly hours and optional maximum. Current job has its own salary, deductions, schedule, costs, conditions and benefits, outside the three opportunity slots. Confirm duties before using them as evidence. Baseline shows raw deltas; it does not change opportunity score normalisation.
### Job Editor and Status Manager
Implements prd.md > Manage Job Status; Job Collection and Comparison Selection.
Validate editable title, employer, location, source URL, advert/offer type, salary basis/range, deductions, working hours, commute schedule, cost lines, requirements and closing date. Availability enum is Open/Closed; application enum is Not applied/Applied/Interview/Offer received/Accepted/Not selected. Persist independently, including after closing date. Confirm deletion. Do not remove jobs solely because a deadline passed.
### Local Document Reader and Review
Implements prd.md > Platform, Privacy and Core Input Boundary; States and Observable Acceptance Criteria.
Read TXT, DOCX and text-based PDF locally. Propose a 5 MiB file limit, 50 PDF pages and 100,000 extracted characters; bounded worker processing can be cancelled/terminated after 15 seconds. Limits are implementation safeguards to verify on representative devices, not safety guarantees. Check extension and expected file structure, handle archive expansion limits and reject unsupported/encrypted files with clear fallbacks. DOCX extraction uses raw text, not generated HTML. PDF scripts, attachments and embedded objects are not executed. Use textContent for extracted/user text. No instructions in a document become app commands.
Raw extraction remains a draft; do not auto-save assumed salary/qualification fields. Review and confirm numeric values, units, mandatory flags and source wording. Scanned PDFs or unsupported content explain the issue and offer paste/manual entry. Discard original file bytes after extraction; save only confirmed structured data and needed source excerpts. Do not send document contents to services or telemetry. Safe source links accept http/https only and open separately with noopener/noreferrer.
### Evidence Matcher
Implements prd.md > Skills Evidence and Gaps.
Combine normalised keywords, curated related terms, confirmed tasks, duration checks and exact/confirmed qualifications. Start with a small versioned retail/call-centre vocabulary; other roles allow manual mappings. Related terms and transferable skills produce suggestions, not verified credentials. Preserve the requirement text and evidence references for each mapping.
User reviews Supported, Partially supported, Not demonstrated or Needs clarification. Keep an additional distinction between no evidence supplied and confirmed unmet. Overlapping employment dates are merged for a relevant skill's duration instead of summed twice; dates alone do not establish which duties were performed. Qualification equivalence requires explicit confirmation; do not infer accreditation.
Mandatory readiness is separate: supported / confirmed gap / unresolved. Roles with mandatory gaps stay visible and conditional, never represented as verified eligible or high hiring probability.
### Cost and Schedule Engine
Implements prd.md > Transport Costs and Time Periods; Financial Comparison and Salary Scenarios.
Store currency in rand inputs, calculate with full precision and round displayed totals to cents. Reject negative/non-finite costs, impossible ranges and invalid schedules; allow negative money remaining as a meaningful result. Blank is null, explicit zero is known zero.
Petrol per commuting day = return km / 100 × L/100 km × rand/litre. Fare lines explicitly identify one-way versus return and required legs; double a one-way return-trip leg only once. Separate petrol, fares, parking, tolls and other costs. Prevent re-adding the same leg through a default and override: an override replaces that field/line.
Regular schedule: weekly variable cost = daily cost × commuting days/week; average monthly = weekly × 52/12. Monthly fixed costs are added once; weekly fixed lines multiply by 52/12. A specific month uses its entered commuting-day count for daily lines; weekly fixed lines use an explicitly labelled average conversion unless the user provides a month-specific amount. Do not fabricate a typical week from an irregular month. Show unavailable weekly breakdowns as unavailable.
Take-home = selected monthly gross − entered monthly payroll deductions. Remaining = take-home − all confirmed monthly work costs. Missing deductions or incomplete work costs keep the relevant output unknown. Explicitly confirm zero/no additional costs; do not assume omitted categories are zero. Salary ranges produce endpoint scenarios; retain the selected salary assumption visibly for scoring. A midpoint may be offered as an explicit user-confirmed scenario, never silently selected. Non-monthly pay requires supplied paid hours/period assumptions and review before conversion.
Weekly travel hours = return commute minutes × weekly commuting days / 60. Total weekly time = work hours + weekly travel hours when both are known. Current-job deltas require the same time/cost basis on both sides. Salary goals compare separately to gross and take-home; desired take-home is not a desired amount after work expenses.
### Priority Scoring and Results
Implements prd.md > Priorities and Explained Recommendations; Incomplete Comparisons; Comparison Factors and Working Hours.
Agreed weights: rank mode 4/3/2/1 divided by 10. Adjustable mode accepts 0–10 per factor, divides by the sum and rejects an all-zero configuration. A zero-weight factor remains visible but does not affect the score.
PROPOSED exact factor rules for review: skills evidence value 1 for supported, 0.5 for partial and 0 for confirmed unmet; requirements have equal weight here because mandatory readiness is shown separately. No-evidence/clarification items remain unresolved and make the skills score incomplete rather than a silent zero. With all requirements resolved, skills score = 100 × mean evidence value. No listed requirements means skills fit unknown, not 100.
Money and commute are relative to selected opportunities: if all values are known, money score = 100 × (remaining − minimum)/(maximum − minimum); commute score = 100 × (maximum − return commute minutes)/(maximum − minimum). Equal values receive the same neutral 50. Show actual rand/minute differences beside scores; these are relative comparison points, not absolute quality ratings. For a single job, show direct evaluation and goals, not a relative overall rank.
Working-hours score = max(0, 100 × (1 − abs(job hours − preferred hours)/preferred hours)). Preferred hours must be positive. Above a supplied maximum, score is 0 and a warning stays prominent. This formula favours the user's preferred hours, not always fewer hours. Missing preferred hours makes this factor unresolved.
For two/three opportunities with all positive-weight factors known: overall = sum(weight × factor score). Scores within one point of the top are proposed as a near-tie, labelled distinctly from exact equality. Explain each contribution and trade-off. Relative scores can change when the selected jobs change; display that limitation. A weighted winner with a mandatory gap is labelled conditional, not the best qualified role. Display stronger readiness alternatives alongside it.
If any selected positive-weight factor is unknown for any compared job, mark the whole comparison partial, show available results and suppress an overall winner; do not redistribute weights or rank only the jobs with complete data. Baseline gaps affect baseline deltas, not otherwise complete opportunity ranking. Snapshot the formula version, selection, weights and missing values.
### Salary Discussion Engine
Implements prd.md > Salary Suggestion Outputs.
Agreed: lower/middle/upper evidence bands, a discussion range and starting figure; mandatory gaps remain separate.
PROPOSED exact band rules: divide the advertised [L,U] into equal thirds. Lower = [L,L+(U−L)/3]; middle = [L+(U−L)/3,L+2(U−L)/3]; upper = [L+2(U−L)/3,U]. Starting figure is the selected band's midpoint; round display to rand without exceeding the original range. Example R6,000–R9,000 gives bands R6,000–R7,000 / R7,000–R8,000 / R8,000–R9,000 and starting figures R6,500 / R7,500 / R8,500.
Preferred-fit ratio uses confirmed preferred requirements (supported=1, partial=0.5, confirmed unmet=0). Relevant-experience ratio uses confirmed relevant months / explicitly requested months; no requested threshold means that signal is unavailable, not zero. Lower if available confirmed signals show preferred fit below 0.5 or experience below 1. Middle if preferred fit is at least 0.5 and experience meets the threshold. Upper requires preferred fit at least 0.8 and experience exceeds the stated threshold. With only one informative signal, do not select upper; middle/lower may be supported by that signal with limitations shown. If required evidence is unresolved, ask for clarification and withhold an evidence-based band; display the full advertised range. If neither signal is informative, provide no evidence-derived target instead of inventing one.
For fixed pay, show fixed amount and affordability. For missing pay, personal gross target = max(entered desired gross, entered desired take-home + explicitly assumed deductions) using only supplied goal terms. This is not market pay. Any reused deductions at a changed salary are explicitly labelled constant-deduction assumptions; let the user edit them. Do not reverse-calculate salary from desired money-after-costs because that goal was not requested. Scenario affordability and evidence positioning remain separate.
### Persistence, Snapshots and History
Implements prd.md > Saving, Changed Details and History; States and Observable Acceptance Criteria.
Use IndexedDB transactions; success appears only on transaction completion. Keep pending form data in memory on failure and show Not saved + Retry; memory is not a reload-proof backup. Handle unavailable database access without claiming persistence.
Compare saved source revisions to current ones on load; show Details changed—compare again. Snapshot payload never changes; recomputing creates a new snapshot. One delete transaction removes the current job and marks related comparisons historical using job-ID membership, retaining copies in their snapshots. This includes deletion of the current-job baseline if it was saved in a snapshot. History is separate from dashboard. Users can delete saved comparisons independently.

## Data Model
All durable records live in IndexedDB database work4tomorrow, schema version 1. UUID IDs, created/updated timestamps and numeric revision on editable records. Data migrations must preserve originals on failure.
- profile store: one profile, skills with evidence IDs, qualifications, dated experience/task evidence, salary goals, weekly-hours preferences, reusable cost defaults, optional current-job data and revision.
- jobs store: job details, availability/application enums, confirmed requirements/evidence mappings, salary basis, schedule/costs, assumptions, source excerpts/URL and revision. No fixed item cap; quotas can still prevent saves.
- comparisons store: immutable payload of profile/current-job copies, selected job copies, per-factor results, salary outputs, weights, assumptions, versions and timestamp; separate metadata holds historical marker and deleted source IDs.
In-memory only: active view, unsaved forms, selection (max three), parser progress, raw file bytes and temporary extraction text. Navigation away from an unsaved editor prompts a discard warning; explicit saves are required. IndexedDB restores saved records when reopening. No background sync or account password.

## File Structure
Annotated file mapping (planned, not existing app files):
- index.html — shell and entry module.
- styles/app.css — responsive blue design, focus and print styles.
- src/app.js — startup and hash navigation.
- src/views/{dashboard,profile,job-editor,review,results,history}.js — screen rendering/actions.
- src/data/{db,repository,snapshots}.js — transactions, revisions and saved copies.
- src/domain/{validation,costs,schedules,skills,priorities,salary}.js — pure input-to-result functions.
- src/import/{reader,extract-worker,field-suggestions}.js — local extraction and reviewable field suggestions.
- src/ui/{forms,format,feedback}.js — safe text rendering and accessible shared controls.
- src/data/skill-vocabulary.json — curated retail/call-centre terms with reasons/source notes.
- vendor/ — pinned parser bundles, workers and dependency licences, served locally.
- fixtures/{cost-cases,comparison-cases}.json — labelled synthetic inputs and expected outputs.
- tests/{domain,storage,imports}.test.js — meaningful rules, transactions and extraction fixtures.
- tools/check_costs.py — Python learning/check tool using the shared fixtures.
- tools/serve.py — optional documented static-development launcher if needed; standard http.server is sufficient.
- devpost/{scope,prd,spec}.md — canonical required planning; HTML visual companions.
- devpost/learner-profile.md — excluded from public commits.
- README.md, LICENSE, THIRD_PARTY_NOTICES.md, .gitignore — setup, project licence, attribution and private/generated exclusions.

## External Services and Dependencies
No runtime external API, paid service, authentication provider or remote database. No endpoint receives user documents. Browser File APIs feed local parser workers; IndexedDB stores structured records. Public site hosting would serve static files only and is a later explicit choice. Parser acquisition/licence/version and runtime behaviour must be verified during build; no claim of current package versions or security audit.
Use a restrictive same-origin policy where hosting permits; locally bundled assets, no inline document HTML and no injected executable markup. Do not include real CVs, names, phone numbers or salary records in public fixtures, screenshots or repository history.

## Important Failure Modes
- Unsupported, malformed, encrypted or scanned file; exceeded limits or cancelled parsing: retain form, show reason and offer paste/manual entry. Never silently produce a completed profile.
- Incomplete or ambiguous inputs: highlight exact fields; calculate only supported outputs and label assumptions. No forced winner or fabricated take-home.
- Quota, blocked database or transaction failure: Not saved, preserve current in-memory work, allow retry; do not overwrite working saved data with empty defaults.
- Saved source removed/changed: retain immutable snapshots and route to History or stale flag as appropriate.

## Verification and Build Slices
1. Shell + profile + job CRUD + IndexedDB: reload persistence, independent statuses, fourth-selection limit, unsaved navigation and injected write failures.
2. Cost/schedule functions: petrol 40/100×7×22 = R61.60/day; three days/week = R184.80/week and R800.80/average month; R300 fixed monthly parking gives R1,100.80. A specific 12-commute-day month is R739.20 petrol before fixed lines. Test return-fare handling, blanks versus zero and negative remaining income.
3. Evidence/readiness + factors + salary: overlap dates, transferable suggestions and confirmation; unknown vs confirmed unmet; mandatory gaps remain visible. Test weight sums, ties, incomplete scores, hours maximum, band boundaries and unchanged fixed salaries.
4. Save/reopen snapshots: edit source without rewriting results, delete job and verify History-only placement, baseline snapshots, stale formula versions and deletion transaction atomicity.
5. Local extraction: representative TXT/DOCX/text-PDF, wrong file signatures, malformed archive, limits/cancellation, scanned PDF and hostile text displayed literally. Confirm there are no document-content network requests. Browser/phone performance determines supported limits.
6. Retail vs call-centre synthetic demo + mobile accessibility: user review, comparison, salary guidance, save/reload, conditional option and History. No live outcomes or fake model behaviour. Python independently checks cost fixtures rather than merely copying JavaScript code.
All baseline tests run with synthetic data. During build add exact test commands to README. Standard Python checker command will be `python3 tools/check_costs.py`; browser tests will have an explicitly documented runner once implemented.

## What Was Simplified and Why
Same-device records remove account infrastructure. Local rules with inspectable evidence remove an online AI/API dependency; they offer fewer automatic suggestions outside initial roles. OCR, automatic link retrieval, automatic tax calculations, CV writing and cross-device sync remain deferred/stretch. These are agreed scope choices, not implemented capabilities. Do not mock the core comparison; label demo fixtures clearly.

## Decisions and Open Issues
Confirmed by learner: browser stack; Python checks; matching beyond keywords with user confirmation; initial retail/call-centre vocabulary; conditional mandatory-gap options; 4/3/2/1 or proportional weighting; partial comparisons; lower/middle/upper salary bands.
Proposals needing blueprint approval: exact factor normalisation, near-tie tolerance, evidence ratios and salary-third boundaries. Formula choices are transparent heuristics, not labour-market research. File limits are proposed implementation bounds subject to validation.
Learning topic raised by learner: wants Python alongside reading code for apps/games. Agreed investigation: trace petrol inputs through separate JavaScript/Python functions and change a fixture together; no observed coding exercise yet. No additional unfamiliar concept has been asserted on the learner's behalf.
The user approved this displayed technical plan on 18 October 2026. During build: verify dependencies/licences/browser performance; test parser feasibility early. Before publishing: check name conflicts, current competition rules, correct GitHub owner/commit identity, open-source licence choice and optional hosting. Do not upload the personal learner profile. No spec approval or deployment is implied by drafting this document.

## Opportunity Import Refinement
Implements prd.md > Approved Opportunity Import Refinement. src/import/link-reader.js performs opt-in direct CORS fetch with credentials omitted, no-referrer, a 10-second abort and 1 MiB page bound. Parse inert HTML/JobPosting JSON-LD locally. Never use scraped instructions as code, invent salary units or infer applicant experience from required experience. Explicit monthly pay only; ambiguous pay stays blank. Failed retrieval preserves current inputs and explains paste/document fallback. No online proxy or extraction backend. src/import/field-suggestions.js maps clear labels/sections into empty job form fields. Highlight routing confirms existing scalar replacements; textual requirements/description append.

## Competition Import Decision
Learner confirmed browser-only import for the competition. Keep document and paste fallbacks. Server retrieval, browser rendering and browser extension options are future development only. Prefer a specific selected advert; reject ambiguous pages rather than importing unrelated results or ads.
