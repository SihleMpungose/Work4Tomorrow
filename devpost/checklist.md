---
doc: checklist
status: approved
---
# Work4Tomorrow — Build Checklist

Build mode: fast with focused learning pauses, agreed by the learner to balance the deadline and learning. Build order approved. Explain one useful code path at planned hands-on checkpoints; retain every mechanical verification and commit.

## Slices

- [x] **1. Evaluate a manually entered job against your profile and costs**
  Becomes usable: A mobile-friendly blue app where a saved profile and one manually entered job produce evidence checks, daily/weekly/monthly costs and an explained single-job evaluation, surviving a reload.
  Why now: Proves the unique skills-plus-real-cost kernel immediately, including the real persistence path; avoids building a generic dashboard before useful results exist.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Skills Evidence and Gaps`, `prd.md > Transport Costs and Time Periods`, `prd.md > Incomplete Comparisons`
  Spec ref: `spec.md > App Shell and Dashboard`, `spec.md > Profile and Current Job`, `spec.md > Evidence Matcher`, `spec.md > Cost and Schedule Engine`, `spec.md > Persistence, Snapshots and History`
  Build: Bootstrap the static HTML/CSS/JS project and documented local server. Implement profile and manual job editing, confirmed requirement/evidence mappings, basic retail/call-centre suggestions, cost schedule and single-job results. Save records with IndexedDB transactions and show unsaved failures. Include Python cost checker and shared synthetic fixtures. Exclude private learner context and credentials from Git.
  Verify (mechanical): Run the documented server and use a real browser to create/reload a profile and job; verify result rendering and no runtime errors. Run domain checks for petrol R61.60/day, R800.80/average month, fixed costs counted once, blank versus zero deductions and unsupported evidence. Run Python checker against shared cost fixtures. Inject a failed save and confirm the form remains visible with Not saved.
  Learner check: Open the running app, enter a profile and retail job, inspect skills and costs, reload to confirm saving, and report anything confusing or visually wrong.
  Commit: `Build persistent single-job skills and cost evaluation`

- [x] **2. Import local job or CV text and correct it before saving**
  Becomes usable: TXT, DOCX and text-based PDF can fill a review screen; the user confirms extracted job/profile details before saving and evaluating them.
  Why now: Tests the main dependency and device-performance risk early, while manual entry already offers a working fallback.
  PRD ref: `prd.md > Platform, Privacy and Core Input Boundary`, `prd.md > States and Observable Acceptance Criteria`
  Spec ref: `spec.md > Local Document Reader and Review`, `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes`
  Build: Verify, pin and bundle maintained local parser versions and licence notices. Add bounded worker extraction, cancellation, field suggestions and review. Preserve safe source links. Enforce limits and safe text display; provide paste/manual fallbacks. Do not add OCR, online extraction or automatic link retrieval.
  Verify (mechanical): Import representative TXT/DOCX/text-PDF fixtures; compare extracted text and confirmed fields. Test malformed, encrypted/scanned and oversized inputs, cancellation and literal rendering of hostile markup. Observe browser requests to confirm no document-content uploads; verify dependency/worker paths are local.
  Learner check: Try a non-sensitive sample document, correct a suggested field and save it. Try an unsupported file and confirm you can continue manually.
  Commit: `Add reviewed local document extraction`

- [x] **3. Compare up to three opportunities with current-job context and salary guidance**
  Becomes usable: Select one to three jobs, optionally compare staying in the current job, choose priorities and inspect financial/time trade-offs, conditional readiness and salary bands.
  Why now: Builds the full decision workflow on verified evidence, costs and inputs rather than hiding uncertain data behind a ranking.
  PRD ref: `prd.md > Priorities and Explained Recommendations`, `prd.md > Comparison Factors and Working Hours`, `prd.md > Current Job Baseline`, `prd.md > Salary Suggestion Outputs`
  Spec ref: `spec.md > Priority Scoring and Results`, `spec.md > Salary Discussion Engine`, `spec.md > Evidence Matcher`, `spec.md > Cost and Schedule Engine`
  Build: Add selection counter, fourth-selection prevention, rank and adjustable weighting, four-factor scores, current-job deltas, mandatory-gap conditional labels, partial comparisons, ties and explained salary thirds/midpoints. Keep scenario assumptions visible and salary deductions editable.
  Verify (mechanical): Check weight normalisation, all-zero rejection, neutral equal values, near-ties, missing positive-weight factors, preferred/max hours, baseline outside the three-job cap and confirmed mandatory gaps. Check salary thirds at R6,000–R9,000, unresolved evidence, missing salary and fixed salary. Browser-run retail versus call centre and a third job with a baseline, then remove a factor input and confirm no overall winner appears.
  Learner check: Compare retail and call centre, change priorities and inspect the reason for any change. Add a current job, attempt a fourth prospective selection, and check that missing information and mandatory gaps remain clear.
  Commit: `Add explained multi-job priorities baseline and salary guidance`

- [x] **4. Manage applications and preserve saved comparisons in History**
  Becomes usable: A searchable job collection, independent availability/application statuses and immutable saved comparisons remain useful after edits and deletions.
  Why now: Completes returning-user continuity after the actual comparison outputs are established.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Manage Job Status`, `prd.md > Saving, Changed Details and History`
  Spec ref: `spec.md > Job Editor and Status Manager`, `spec.md > Persistence, Snapshots and History`, `spec.md > Data Model`
  Build: Finish dashboard collection/search, independent statuses, closing-date labels, saved snapshots with input/formula versions, stale-result flags, deletion confirmation, History-only deleted-job records and independent comparison deletion. Finish relevant keyboard/mobile accessibility and unsaved-navigation checks.
  Verify (mechanical): Save/reopen a comparison, edit the source and verify original figures plus a changed flag. Delete a source job and verify atomic routing to History without snapshot loss or dashboard display. Check Closed + Interview after reload, date warnings, cancellation of deletion, current-job baseline removal, failed transactions and mobile layouts.
  Learner check: Set Closed + Interview, save a comparison, edit and then delete a compared job. Reopen History and check the original results remain readable while the dashboard shows current work.
  Commit: `Complete application tracking and historical comparison snapshots`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1; adjust presentation and clarity before remaining screens grow.
- [ ] Integrated comparison explored — after slice 3; inspect the core recommendation and salary logic with learner-entered values.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 4 and integrated verification.

Learn mode adds a learner check after every verified slice; fast mode retains the checkpoints above. Feedback and fixes must be recorded before checking a checkpoint complete.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

Run the complete profile → import/review → compare → save/reopen → manage → History journey with synthetic data. Have the learner explore freely; record agreed fixes below as unchecked tasks, then verify, commit and obtain a retry before completion. No review outcome is assumed yet.

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Not performed; plan to trace a petrol input through form, JavaScript cost function and displayed result, then compare the independent Python check.
Route and stops: Actual symbols and file locations will be recorded after implementation.
Edit outcome: Optional small fixture/input change will be offered; not attempted.
Reflection: Not offered yet; personal response stays in ignored learner profile.
Activity mode: Planned live app and editor; adjust only if the learner's environment requires an explicit static fallback.

## Revisions

- Slice 1 implementation exists and domain/Python checks pass, but browser verification is blocked: no Chromium binary is installed; full and headless downloads return invalid archives, and system dependency installation is unavailable. The slice remains unchecked and uncommitted pending real browser verification and early hands-on feedback. No application features were cut.

- Early learner feedback: replaced horizontal mobile tabs with an accessible expandable menu and improved direct/related skills suggestions, including PC/phone repair → troubleshooting. Regression checks pass; browser runtime verification remains pending.

- Browser verification recovered using a Chromium binary from the npm distribution and bundled software rendering. Real-browser checks pass for profile-first onboarding, mobile menu, direct/related matches, costs, persistence and injected failed-save retry. User-approved early feedback is implemented. The previous browser blocker is resolved.

- Local document import verified in Chromium for TXT/DOCX/text-based PDF and self-contained preview. Review/apply updates form fields without saving; scan/malformed/oversized/unsupported fallbacks and local-only requests pass. Fixed internal worker-message routing discovered during PDF integration. Add-new-job navigation now opens a fresh editor rather than editing the latest saved job.

- Three-job comparison verified in Chromium: fourth selection preserves the first three, current job stays outside selection, priority changes affect leadership, salary bands are explained and missing financial data suppresses overall winners. Integrated learner checkpoint is pending; slice 4 has not started.

- Learner-reported profile save/import feedback: visible local validation and save/retry feedback; CV section/name suggestions into empty fields; separate skills/experience/training/education fields; highlighted-text destination chooser preserving existing content. Chromium save, failure/retry, import mapping and reload regression pass.

- Reproduced silent save in a sandboxed HTML preview with native forms disabled. Profile save now uses an explicit button action, commits storage before directly rendering Dashboard, and survives iframe reload. Native-submit controls elsewhere use explicit app dispatch as well. Sandboxed-preview regression passes.

- Learner-directed opportunity import refinement implemented: opt-in direct link access with blocked-site fallback, document/paste field suggestions and highlighted-text job-field chooser. Source and standalone-preview browser tests pass for matching fields, JSON-LD salary, preserved values and inert remote content.

- Browser-only import retained for competition; online retrieval/rendering/extension paths are future work. Selected Indeed search links normalise to a specific job URL; page parsing now requires structured JobPosting data or an identifiable job-description region instead of scraping page-wide content. CORS restrictions remain visible fallbacks.
- Slice 4 verified in Chromium: independent availability/application states, closing dates, searchable collection, saved immutable input/results/salary guidance, revision flags, confirmed/cancelled/failed deletion, historical-only routing and reload. In-page confirmations work without native pop-up permission. Final hands-on review and learning wrap-up are still pending; no ship approval claimed.
