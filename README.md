# Work4Tomorrow

**v0.6.2 · Open Horizon** — browser-only competition proof of concept.

![Work4Tomorrow Open Horizon logo](assets/logo.svg)
Compare opportunities. Plan your next move.

A new competition project for early-career job seekers across South Africa. Implements **slices 1–4 for review**: a reusable local profile, job collection, reviewed skills evidence, single-job cost evaluation and comparisons of one to three opportunities. Local TXT/DOCX/text-PDF import now includes a review-and-apply step. Multi-job priorities, current-job context and salary guidance are available. Saved snapshots, source-change flags, independent statuses and History are available. Final hands-on review remains pending.

## Run
Requires Python 3 for local serving only; modern browser with IndexedDB. No paid services or API keys.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```
Windows: `py -m http.server 8000 --bind 127.0.0.1`. Open http://localhost:8000/ . Keep the same browser/site address and port to access saved records. Use the HTTP address for the modular repository entry; standalone downloads can be opened directly. A phone will use the eventual HTTPS hosted page without installing Python; hosting is not configured yet.

## Check
```sh
node tests/domain.test.mjs
python3 tools/check_costs.py
```
The Python tool provides an independent calculation example for learning. App calculations run in JavaScript.

## Try the first working flow
Create a profile with a genuine example duty and salary goals. Add a job, a fixed salary or labelled assumption, deductions and travel costs. Explicitly enter zero for parking/tolls/other costs if none. Save, review each requirement and supporting evidence, then inspect money remaining. Reload to check persistence. Blank deductions or costs remain unknown.

## Privacy and current limits
Data stays in IndexedDB on the same device/browser; no server receives it. Clearing site data removes it. Use synthetic data when demonstrating. Job collection deletion, statuses, snapshots and History are implemented. The first slice uses regular weekly commuting schedules and a combined fare or petrol; it does not yet handle mixed separate legs. No guaranteed hiring outcomes, tax estimate or market salary estimate. Personal learner profile is excluded from Git. Development repository: https://github.com/SihleMpungose/Work4Tomorrow . Project-authored work is licensed under GPL-3.0-only; see `LICENSE` and `COPYRIGHT`.

## Planning
`devpost/scope.md`, `prd.md`, `spec.md` are approved; `checklist.md` records implementation and learner review progress. Public repository is intended for SihleMpungose, not AfrikaBrothers.

## Document import
Choose a local TXT, DOCX or text-based PDF (5 MiB, 50 PDF pages, 100,000 characters; 15-second cancelable worker). Review extracted text, highlight genuine skill/task text or job requirements, then apply to the form. Clearly labelled job title/company/location can be proposed; salary is never invented. Apply does not save. Original files are not stored; structured details and explicitly selected excerpts are saved only with Save. Source links are optional references. Direct link import fetches only after an explicit user action and may be blocked by browser CORS restrictions. Scans/images, encrypted files and malformed archives offer paste/manual fallback.

Parser versions and licences are in THIRD_PARTY_NOTICES.md. Browser import/regression scripts use Playwright as a developer-only tool. With a local server running and Playwright available, run `node tests/browser-first-slice.cjs` and `node tests/browser-imports.cjs`. Set CHROMIUM_PATH if using a separate Chromium binary. No browser testing dependency is needed to run the app.

Build a self-contained preview/source ZIP with `python3 tools/package_preview.py`. Preview resources are embedded; this avoids runtime CDN downloads.

Comparison checks: `node tests/comparison.test.mjs` and, with the server and Playwright, `node tests/browser-comparison.cjs`. Rankings are transparent relative heuristics, not hiring probabilities or market salary estimates. Salary-range financial results explicitly use the minimum; changing deductions is a user assumption. Current-job costs use an entered monthly total and do not consume an opportunity slot.

Profile import now suggests empty name, skills, experience, certifications and education fields from clear CV labels/headings. Existing entries are never silently overwritten. Highlighted text opens a destination chooser before applying; review and save remain separate. Unrecognised layouts can be corrected manually. Save validation and storage failures are visible next to the profile save control. Regression checks: `node tests/profile-import.test.mjs` and `node tests/browser-profile.cjs`.

The Save profile action runs without native form navigation, including previews that disallow form submissions. A confirmed database transaction is followed by direct dashboard rendering. Sandboxed preview regression: `node tests/browser-preview-save.cjs`.

Add an Opportunity imports now suggest empty title/employer/location/description/requirements fields and explicit monthly salary ranges, weekly hours and required experience. Highlighted text opens a job-field chooser; existing scalar values require replacement confirmation. Applicant experience, payroll deductions and travel costs are never inferred from the advert. Direct link import is opt-in and uses browser CORS fetch without profile data, cookies or a proxy. Pages with JobPosting JSON-LD can expose structured fields; login/blocked/script-rendered pages may require pasted text or a document. A successful import is not a saved job.

## Saved comparisons and History
Save results from Compare jobs, then reopen from Overview. Profile/job edits flag old results without rewriting figures; Compare again uses current records. Deleting a job archives its related snapshots into History only. Open/Closed availability is separate from application progress, even after a closing date. Current-job removal archives snapshots that used that baseline. Deletion requires in-page confirmation and is atomic with archive updates. Browser tests: `node tests/browser-history.cjs`; unit tests: `node tests/snapshots.test.mjs`. Browser-only import remains the competition strategy. Future online importer/rendering/extension work is not implemented.

### Sample jobs
After saving your profile, choose **Load sample jobs** on Overview to add three fictional retail, customer service and IT support roles. All salaries, deductions, schedules and travel costs are illustrative assumptions, not market data or live vacancies. Requirement assessments start at **Needs clarification**. Repeated loading preserves existing jobs and edits; deleted sample jobs can be loaded again. Samples remain labelled when edited, evaluated or saved in comparisons.

### Skills matching and comparisons (v0.5)
Matching reads saved profile evidence, experience, training and education. Curated rules recognise duties such as resolving client issues, repairing devices, processing payments and training colleagues. Every suggestion shows its source and explanation. Suggestions never overwrite profile fields or automatically confirm requirements; qualifications, duration and technical depth still require review. This is a local rule-based matcher, not a general language model, so unusual wording may need manual review.

The comparison includes a side-by-side table, requirement-level evidence reports, unresolved mandatory requirements and direct money/time trade-offs. Scores still use reviewed assessments only. Saved comparisons retain their original evidence reports; older snapshots remain readable. Document reading and profile prepopulation are unchanged.

### Opening on an Android phone (v0.6.0)
Use `work4tomorrow-mobile-v0.6.2.zip`: extract it first, then open **Work4Tomorrow.html** with Chrome. Avoid the ZIP viewer or a document preview that disables scripts. The HTML contains its styles, app code, DOCX parser and PDF parser. Document reading stays local, including when the browser gives the file an opaque origin. Some Android file providers restrict browser storage: if saving is blocked, the app reports that limitation; keep using the same browser/file location or serve the project over HTTP(S) for a stable origin.

The packaged source ZIP has a standalone **index.html** for direct opening. In this repository, **index.html** and **source-index.html** are modular entries; serve them with a local HTTP server when editing source code. Run `python3 tools/package_preview.py` to regenerate the standalone downloads after edits. The builder selects source-index.html when present, so rebuilding an extracted release includes your changes.

### Reviewing additional CV entries (v0.6.0)
Combined headings such as CERTIFICATIONS & DEVELOPMENT now start a separate certification section, including pipe-separated awards. CV entries still populate empty fields. Existing fields are preserved and additional entries appear in a review checklist: select entries, choose Add selected entries to profile, then save. Repeated imports and repeated clicks avoid exact duplicate entries. Previously misplaced text is preserved for manual correction rather than silently deleted.

### Opportunity workspace and requirement priorities (v0.6.0)
Job cards show salary source, remaining money, status and requirement-review needs, with search/filters and a comparison selection tray. Expanded fictional samples include duties, mandatory and preferred requirements; existing sample records are preserved (delete an older sample and load again to refresh it).

Job document, pasted-text and link imports detect explicit wording and scoped headings such as Minimum requirements, Essential skills and Preferred skills. Each new requirement stores the detected priority and its explanation. Generic or contradictory wording remains unclear; optional wording overrides a mandatory section heading. Users can change the mandatory checkbox, and saved overrides survive job edits. Existing requirements retain their saved reviews. Profile import is unchanged.

### Compass UI and appearance (v0.6.0)
Copper & Ink styling uses a warm canvas, ink typography, copper actions and subdued evidence panels. New users see the app’s purpose and three-step journey above profile creation. Overview directs users to add, select or compare jobs, with evidence-review guidance. Profile sections are numbered. Comparison cards and the table are alternate views.

Accessibility & appearance is available before profile creation. It includes light/dark/device themes, three text sizes, colour-vision palette choices, high contrast and reduced motion. Settings apply immediately and persist locally where storage permits. Keyboard focus, a skip link, current navigation labels, native form labels and text/symbol statuses support navigation without relying on colour. Device reduced-motion settings are respected. Tested core text-colour pairs meet 4.5:1 across light/dark palettes; this is not a complete accessibility audit or certification.

`output/work4tomorrow-ui-preview.html` is a lightweight interactive UI preview for embedded viewers. It supports TXT/pasted input; PDF and DOCX are supported by the full mobile ZIP and standalone index.html. The full file remains `output/work4tomorrow-preview.html`.

### Brand and typography (v0.6.1)
Shared original W/forward-path vector mark in the desktop/mobile shell and browser icon. Exported SVG wordmark and 32/180/192/512px PNG icons are in assets. Shared text scale: body/controls 16px, supporting text 14px, section headings 22px at the default setting. Larger text settings scale these values. Copper & Ink, dark mode and accessibility palettes remain available.

Hosting preparation: see devpost/hosting.md. No deployment or public URL is claimed by this package.

### Open Horizon identity (v0.6.2)
Option 1 selected by the owner. Refined as editable SVG geometry: unequal doorway pillars, copper horizon and curved path. The same symbol is embedded in the mobile and desktop navigation, standalone previews and favicon. Symbol colours follow all appearance settings, including high contrast. Light, dark and monochrome symbols/wordmarks plus raster app icons are in assets. The logo wordmark uses system fonts; app wordmarks remain real accessible text. Icons are embedded into standalone downloads. `assets/brand-preview.html` shows all variants. No external fonts or image services are needed. Existing IndexedDB databases, appearance keys and saved comparisons are unchanged. This source update does not deploy a hosted site. See `devpost/repository-update-2026-10-25.md` for validation and submission status.

## Competition review status
The public repository retains the Skill Pack planning documents in `devpost/scope.md`, `devpost/prd.md` and `devpost/spec.md`, plus the build checklist. The update preserves their history and does not mark pending learner review as completed. GPLv3 was selected by the owner on 25 October 2026; the final submission description and public YouTube/Vimeo video under three minutes still require confirmation. Official rules: https://learn-ai-basics.devpost.com/rules . Deadline: 26 October 2026 at 23:00 South Africa time.

## AI assistance and included work
The project was developed with AI coding assistance. The Open Horizon logo direction was explored with AI-generated concepts, selected by the owner and refined into editable SVG geometry. Generated concepts are not a trademark-clearance claim. The app itself uses local, inspectable matching rules and does not call an AI service. Bundled Mammoth and PDF.js parsers are pre-existing third-party libraries; their versions, licences and source links are recorded in `THIRD_PARTY_NOTICES.md` and `vendor/`. Synthetic sample jobs and document fixtures are for demonstration; they are not live vacancies or market salary data.

## Rebuild and verify
Run `python3 tools/package_preview.py` to generate standalone HTML, mobile ZIP and source ZIP in ignored `output/`. The builder preserves the modular repository entry. Run all seven unit suites with `for f in tests/*.test.mjs; do node "$f" || exit 1; done`, then `python3 tools/check_costs.py`. Browser scripts require a running local HTTP server plus Playwright/Chromium as developer tools.

## Licence
Copyright (C) 2026 Sihle Mpungose. Project-authored code, documentation and assets are licensed under **GNU GPL version 3 only** (`GPL-3.0-only`), unless otherwise stated. See [LICENSE](LICENSE) for the unmodified full licence and [COPYRIGHT](COPYRIGHT) for the project notice. Commercial redistribution is allowed subject to GPLv3, including corresponding-source obligations. This licence does not prohibit resale. The app exposes Licence & source in its footer, including the full GPL text offline.

Third-party components retain their original licences and notices. The source package includes the editable project, scripts and bundled components; the mobile ZIP includes GPL and third-party notices and points to the matching source ZIP and public repository. Keep the corresponding source available alongside distributed builds. No hosting or submission-ready status is implied by licensing.
