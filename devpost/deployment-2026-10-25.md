# Work4Tomorrow deployment — 25 October 2026

Status: confirmed live, not a submission announcement.

- Live app: https://sihlempungose.github.io/Work4Tomorrow/
- Host: GitHub Pages using its free default domain; HTTPS enforced.
- Publishing source: main branch, / (root).
- App version: 0.6.2 Open Horizon, GPL-3.0-only.
- Initial deployed source: 65e885f3954f1fca53ef8bde1485653d0a8c56a5.
- Successful Pages build/deployment: https://github.com/SihleMpungose/Work4Tomorrow/actions/runs/40188500559 .

## Verification
The public site rendered the current branding and version. Using synthetic data in the browser, profile save and reload persisted correctly; all three fictional sample jobs loaded and survived reload; three opportunities were selected, comparison trade-offs rendered and Save this comparison reported success. Before deployment, the same project also passed profile persistence and TXT/DOCX/PDF import checks under the /Work4Tomorrow/ path, plus prior responsive layout checks. Those import/mobile checks were local preflight, not physical-phone live testing. No real CVs or personal profile data were uploaded.

## Storage and release boundaries
Hosting serves static files. User records remain in IndexedDB on each browser/device; hosting does not add accounts or cross-device sync. Existing local-file/preview records do not automatically migrate to this HTTPS origin. Main-branch pushes trigger new Pages builds; verify the run before announcing an update. Competition planning documents, GPL licence and third-party notices remain available. Final learner review, submission description/video and vendor-notice audit remain separate outstanding items.
