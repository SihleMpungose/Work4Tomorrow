# Import fixes QA — v0.6.3 — 25 October 2026

Implemented after owner review of the defect-fix proposal. Free browser-only architecture, Open Horizon branding, GPL-3.0-only and original competition planning documents are preserved. No hosted proxy or AI service was added.

## Fixes and verified outcomes

| Reported problem | Change | Verification |
|---|---|---|
| 2–3 years read incorrectly | Save 24-month minimum, 36-month upper bound and original wording for review | Unit cases for hyphen/en/em/to; saved browser result displayed 24–36 months |
| Diploma duration becomes work experience | Only explicit work-experience wording or experience headings qualify; optional/conflicting thresholds unresolved | Unit checks: 3-year diploma alone blank; diploma plus 2 years relevant experience gives 24 |
| Shared currency salary range loses maximum | Both monthly ZAR bounds extracted; reversed ranges rejected; annual units remain unknown | Unit checks for all separators: 8000–12000; reversed/annual blank |
| Reload opens another job | Job edit/evaluation routes include exact ID; unavailable IDs show recovery | Browser: saved two synthetic jobs; older job survived reload; missing ID showed unavailable screen |
| Structured skill arrays lost | Accept text, arrays and named objects; exact duplicates removed | Browser module harness: three input shapes passed; SQL retained once, priority unclear |
| Closing date missing/incorrect | Validate ISO/calendar/month-name dates; ambiguous numeric dates require confirmation | Unit date cases and browser explicit 01/11 choice; closing field stayed blank before choice |
| Import mixes jobs or carries evidence | Start new / Fill empty / Review replacements; current/proposed values; source replacement resets assessments | Browser: kept old title with fill-empty, started separate new job, replacement cleared prior SQL evidence; normal deductions edit retained evidence |
| Link failures leave no next step | Best-effort explanation and visible paste/upload buttons after failure | Browser failed example.com link showed fallback; accessible public sample TXT link succeeded |

## Checks performed

- `node --test tests/*.test.mjs`: eight suites passed, including new import-defects regressions.
- `python3 tools/check_costs.py`: four cost cases passed.
- JavaScript syntax check passed; standalone/mobile/source packaging completed.
- Managed Chrome preview: profile save, job save/reload, evidence review save, explicit replacements, fill empty, start new, missing route and successful/failed links checked using synthetic data.
- `tests/import-structured.html`: all three structured-data cases passed in the browser.
- Full standalone HTML rendered and read the local TXT fixture through its bundled worker successfully. Existing document parsers were not changed; DOCX/PDF were not re-run for this patch.
- Local HTTP preview exposed unavailable `crypto.randomUUID`; record IDs now use a crypto.getRandomValues UUID fallback. Production HTTPS continues to use randomUUID.

## Limits and submission status

External job sites can still deny direct browser requests, require login, render jobs dynamically or omit fields. No claim that Capitec/Lever/Indeed imports now succeed; the earlier observed access failures remain a limitation. Paste/upload are supported alternatives. Extraction is conservative and requires review, not a universal job parser. No physical-phone check was performed in this patch. User data remains browser-local; existing records are not silently rewritten. Re-import or manually correct affected older records.

The initial public deployment is documented separately. This patch preserves the public source, scope/PRD/spec and licences. Final learner review, competition submission description and public demonstration video still require completion; this QA record does not assert submission eligibility or completion.
