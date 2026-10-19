# Work4Tomorrow
Compare opportunities. Plan your next move.

A new competition project for early-career job seekers across South Africa. Currently implements **slices 1–3**: a reusable local profile, manually entered jobs, reviewed skills evidence, and a single-job cost evaluation. Local TXT/DOCX/text-PDF import now includes a review-and-apply step. Multi-job priorities, current-job context and salary guidance are available. Snapshot/History implementation remains pending.

## Run
Requires Python 3 for local serving only; modern browser with IndexedDB. No paid services or API keys.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```
Windows: `py -m http.server 8000 --bind 127.0.0.1`. Open http://localhost:8000/ . Keep the same browser/site address and port to access saved records. Do not open the HTML as a file. A phone will use the eventual HTTPS hosted page without installing Python; hosting is not configured yet.

## Check
```sh
node tests/domain.test.mjs
python3 tools/check_costs.py
```
The Python tool provides an independent calculation example for learning. App calculations run in JavaScript.

## Try the first working flow
Create a profile with a genuine example duty and salary goals. Add a job, a fixed salary or labelled assumption, deductions and travel costs. Explicitly enter zero for parking/tolls/other costs if none. Save, review each requirement and supporting evidence, then inspect money remaining. Reload to check persistence. Blank deductions or costs remain unknown.

## Privacy and current limits
Data stays in IndexedDB on the same device/browser; no server receives it. Clearing site data removes it. Use synthetic data when demonstrating. Job collection deletion, statuses, snapshots and History arrive in the final slice. The first slice uses regular weekly commuting schedules and a combined fare or petrol; it does not yet handle mixed separate legs. No guaranteed hiring outcomes, tax estimate or market salary estimate. Personal learner profile is excluded from Git. Development repository: https://github.com/SihleMpungose/Work4Tomorrow . An open-source licence must be chosen before competition submission.

## Planning
`devpost/scope.md`, `prd.md`, `spec.md` are approved; `checklist.md` records implementation and learner review progress. Public repository is intended for SihleMpungose.

## Document import
Choose a local TXT, DOCX or text-based PDF (5 MiB, 50 PDF pages, 100,000 characters; 15-second cancelable worker). Review extracted text, highlight genuine skill/task text or job requirements, then apply to the form. Clearly labelled job title/company/location can be proposed; salary is never invented. Apply does not save. Original files are not stored; structured details and explicitly selected excerpts are saved only with Save. Source links are optional references and are not fetched. Scans/images, encrypted files and malformed archives offer paste/manual fallback.

Parser versions and licences are in THIRD_PARTY_NOTICES.md. Browser import/regression scripts use Playwright as a developer-only tool. With a local server running and Playwright available, run `node tests/browser-first-slice.cjs` and `node tests/browser-imports.cjs`. Set CHROMIUM_PATH if using a separate Chromium binary. No browser testing dependency is needed to run the app.

Build a self-contained preview/source ZIP with `python3 tools/package_preview.py`. Preview resources are embedded; this avoids runtime CDN downloads.

Comparison checks: `node tests/comparison.test.mjs` and, with the server and Playwright, `node tests/browser-comparison.cjs`. Rankings are transparent relative heuristics, not hiring probabilities or market salary estimates. Salary-range financial results explicitly use the minimum; changing deductions is a user assumption. Current-job costs use an entered monthly total and do not consume an opportunity slot.

Profile import now suggests empty name, skills, experience, certifications and education fields from clear CV labels/headings. Existing entries are never silently overwritten. Highlighted text opens a destination chooser before applying; review and save remain separate. Unrecognised layouts can be corrected manually. Save validation and storage failures are visible next to the profile save control. Regression checks: `node tests/profile-import.test.mjs` and `node tests/browser-profile.cjs`.

The Save profile action runs without native form navigation, including previews that disallow form submissions. A confirmed database transaction is followed by direct dashboard rendering. Sandboxed preview regression: `node tests/browser-preview-save.cjs`.

Add an Opportunity imports now suggest empty title/employer/location/description/requirements fields and explicit monthly salary ranges, weekly hours and required experience. Highlighted text opens a job-field chooser; existing scalar values require replacement confirmation. Applicant experience, payroll deductions and travel costs are never inferred from the advert. Direct link import is opt-in and uses browser CORS fetch without profile data, cookies or a proxy. Pages with JobPosting JSON-LD can expose structured fields; login/blocked/script-rendered pages may require pasted text or a document. A successful import is not a saved job.
