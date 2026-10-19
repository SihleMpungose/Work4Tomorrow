# Work4Tomorrow
Compare opportunities. Plan your next move.

A new competition project for early-career job seekers across South Africa. Currently implements **slice 1**: a reusable local profile, manually entered jobs, reviewed skills evidence, and a single-job cost evaluation. Later checklist slices are not implemented yet.

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
Data stays in IndexedDB on the same device/browser; no server receives it. Clearing site data removes it. Use synthetic data when demonstrating. Job collection deletion, statuses, import, multi-job ranking, current-job baseline, snapshots and History arrive in later slices. The first slice uses regular weekly commuting schedules and a combined fare or petrol; it does not yet handle mixed separate legs. No guaranteed hiring outcomes, tax estimate or market salary estimate. Personal learner profile is excluded from Git. Development repository: https://github.com/SihleMpungose/Work4Tomorrow . An open-source licence must be chosen before competition submission.

## Planning
`devpost/scope.md`, `prd.md`, `spec.md` are approved; `checklist.md` records implementation and learner review progress. Public repository is intended for SihleMpungose, not AfrikaBrothers.
