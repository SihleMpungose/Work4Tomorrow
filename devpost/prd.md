---
doc: prd
status: approved
---
# Work4Tomorrow — Product Requirements

Compare opportunities. Plan your next move.

Approved consolidated requirements · 18 October 2026. Approved by the user on 18 October 2026; technical formulas and implementation choices remain for 4-spec.

## The Core Journey
Source: scope.md > The Core Loop; What Working Looks Like.
1. Open the app and create a reusable profile or reopen the existing on-device profile.
2. Enter skills, certifications, desired gross salary and desired take-home pay. Optionally upload a CV and set editable default transport costs.
3. Add jobs manually, by pasting text, or through local TXT, DOCX and text-based PDF extraction; review and correct captured details. Save a source link where supplied. Screenshot/scanned-PDF OCR and automatic link retrieval are stretch goals.
4. Select one job to evaluate, or two to three prospective jobs to compare. Optionally include the current job as a separate baseline. Choose the factors that matter most.
5. Inspect skills evidence, gaps, financial trade-offs, advantages, disadvantages and explained job and salary recommendations.
6. Save and reopen comparisons. Manage jobs and application progress. Historical comparisons involving deleted jobs remain in History, away from the dashboard.

## Screens and Layout
Source: scope.md > The POC Boundary.
Profile creation/editing; dashboard; add/review/edit job details; comparison results; separate History section. Manage job can be an action within the job details surface.
Dashboard order on mobile: profile summary, prominent Add job action, searchable job collection, active saved comparisons. Keep comparison action visible while selecting. Job cards show title, employer, location, supplied salary and known closing date. Actions: view/edit, select and delete. Profile summary offers Edit profile and highlights information missing for a comparison.

## Look and Feel
Shades of blue; professional, attractive, hopeful and calm. Avoid routine urgency. Emphasise a known closing deadline when within three days. Unknown dates must not trigger urgency. Product name: Work4Tomorrow. Tagline: Compare opportunities. Plan your next move. Typography and final app layout remain implementation/design decisions; this planning companion is not the working app. Naming-conflict checks remain outstanding.

## Profile and Reusable Costs
Source: scope.md > What Working Looks Like.
Save skills, certifications, desired gross salary, desired take-home pay and optional default transport costs. Optional CV upload supports profile entry; extracted information must be reviewable and editable. Default travel costs can be overridden for each job. Reopening the app on the same device restores saved information. No online login is required for the competition version.

## Job Collection and Comparison Selection
Source: scope.md > The POC Boundary.
No fixed saved-job count cap; device storage limits still apply. Users can edit and delete jobs. Selection is limited to three without clearing previous selections. Show a visible selected count. One selected: Evaluate job. Two or three: Compare jobs. Missing salary is labelled Not provided. A known passed closing date is flagged separately, not silently substituted for availability.

## Manage Job Status
Each job has exactly one availability status: Open or Closed. Separately, application progress is Not applied, Applied, Interview, Offer received, Accepted or Not selected. Availability and progress coexist independently. Users can update progress after a closing date or when Closed; Closed + Interview and Closed + Applied are valid. Open + Closed is invalid.

## Skills Evidence and Gaps
Source: scope.md > The Unique Kernel.
Compare requirements against user-supplied evidence: supported, partially supported, not demonstrated, or needs clarification. Distinguish mandatory requirements from preferences. Highlight missing qualifications, skills, experience or evidence and suggest what to add or develop based on the advert. Not demonstrated must not automatically mean the person lacks the skill. Never invent profile evidence. A stronger requirements match is not a probability of being hired.

## Financial Comparison and Salary Scenarios
Source: scope.md > The Unique Kernel.
Keep gross salary, take-home pay and money remaining after entered work costs distinct. Compare supplied salary ranges and commute costs/time with the user targets. Unknown deductions make take-home estimates clearly labelled or unavailable. Missing salary can be explored using a user-entered assumption, labelled as a scenario throughout results and saved records. Missing costs are unknown, not automatically zero. Users enter expected payroll deductions manually; until provided, take-home pay and money remaining after deductions are unknown. Explicit zero is distinct from blank. Automatic tax calculation is a stretch goal only after the core is complete and tested. Within an advertised range, demonstrated relevant experience and meeting or exceeding preferred requirements support a higher discussion target; less relevant experience or fewer preferred matches support a conservative target. Missing evidence prompts clarification before lowering a target. Explain the basis, distinguish mandatory gaps and show affordability separately. The exact transparent calculation will be defined in the technical plan; the target is not an employer offer or market valuation.

## Priorities and Explained Recommendations
Users choose their priorities. Show every role’s advantages and disadvantages, supported requirements and material gaps, even if a different factor leads the recommendation. Explain why the preferred role suits those priorities and provide a salary discussion target with its basis and uncertainty. A higher-paying role with an unmet mandatory requirement must display that gap prominently; a lower-paying stronger match must display the financial downside. Distinguish pursuing an advertised role from accepting a confirmed offer. Provide two alternative modes: rank factors, or adjust each factor’s importance. Clearly show the active mode and save it with results. Equal outcomes show a tie and explain both jobs’ strengths and disadvantages; users can change priorities and compare again. Never force a winner when information is insufficient.

## Saving, Changed Details and History
Source: scope.md > The Core Loop.
Save comparison snapshots containing the information used at that time. Later profile or job edits must not silently rewrite them; flag active results Details changed—compare again. Deleting a job preserves prior snapshots. Comparisons containing deleted jobs are historical, clearly label deleted jobs and appear only in separate History, never on the dashboard. Historical comparisons remain readable.

## States and Observable Acceptance Criteria
First use: explain that the user should create a profile and add a first job.
Empty dashboard: invite Add your first job; do not show invented jobs or results.
Selection: selecting a fourth job is prevented with an explanation and preserves the existing three.
Status: Closed + Interview survives save and reopening; Open + Closed cannot be stored.
Salary scenario: user assumption stays visibly labelled after saving and reopening.
Persistence: a saved profile, job and comparison remain after reopening on the same device.
History: deleting a job removes it from current collection and moves affected comparisons away from dashboard into History while preserving readable snapshots.
Changed data: editing a compared job flags the active saved comparison without rewriting its original figures.
Inputs: core local extraction supports TXT, DOCX and text-based PDF. Screenshot/scanned-PDF OCR (JPG/PNG) and automatic link retrieval are stretch goals. Links can be retained as references; pasted text and manual entry always provide a path forward. Legacy DOC is not committed support. Extracted details must be reviewable before saving. Treat text as data, never executable content; validate types and bound file size/processing.
Deletion: ask for confirmation before deleting a saved job.
Storage failure: keep the current work on screen, show Not saved and provide retry; never claim success or discard existing saved data on a failed write.

## Product Decisions
Nationwide South African early-career audience; retail vs call centre demonstration. Same-device saving is sufficient. Save any number of jobs subject to storage, compare at most three. Users choose priorities and see trade-offs. Capture desired gross and take-home pay. Permit labelled hypothetical salaries. Independent availability/application states. Preserve historical snapshots separately from dashboard. Visual planning reviews in HTML. Public project must use GitHub SihleMpungose.

## What We Are Building
The profile-to-job-to-comparison-to-save loop, manual/pasted entry and local TXT/DOCX/text-PDF extraction with reviewed details, dashboard, job management, user priorities, explained skills and money comparisons, salary discussion target, snapshots and separate History. This is a competition proof of concept; extraction breadth is not yet a verified capability.

## Deferred and Non-Goals
Online accounts and cross-device sync are deferred: user confirmed same-device saving. CV creation or editing based on job/profile information is a future update. No employer-side recruitment, job applications sent by the app, guaranteed hiring probability, invented qualifications, or unsupported market-salary claims. No ride-safety functionality. An arbitrary universal ability to read every job website is not promised.

## Remaining Technical Planning Items
Define exact priority scoring, tie tolerance, missing-data handling, working-hours preference scoring and salary target formulas in 4-spec. Rules must be transparent and reviewable; no calculations have yet been implemented or validated.
Choose local storage, parsing libraries, size/processing limits, browser support, safe text rendering and recovery behaviour. Verify extraction feasibility with representative files before claiming support. Clearing browser data can remove saved records; same-device persistence is not cross-device backup.
The consolidated product document is approved; proceed to technical planning. Naming-conflict checks are still outstanding.

## Updated Product Decisions
Two priority modes: ranking or adjustable importance. Ties show trade-offs without a forced winner.
Manual expected deductions for the core build; automatic tax calculations are optional after core validation.
Salary discussion targets reflect demonstrated experience and preferred requirements in either direction, with visible reasoning and clarification for missing evidence.
Core extraction: TXT, DOCX, text-based PDF. OCR and automatic link retrieval are stretch goals. Link/file failure permits pasted text or manual details.
Confirm deletion; keep unsaved work visible and offer retry when device storage fails.

## Transport Costs and Time Periods
Source: scope.md > The Unique Kernel; The POC Boundary. The learner expanded taxi-only defaults to transport costs generally.
Support public transport fares and multiple journey legs, private-car petrol, parking, tolls and mixed transport journeys. Save defaults and allow job-specific overrides. Clearly distinguish one-way and return fares; do not double a return fare or count overlapping legs twice.
Calculate petrol from user-entered return distance in kilometres, consumption in litres per 100 kilometres, and editable price per litre: cost per commuting day = return_km / 100 × litres_per_100km × price_per_litre. Do not claim the entered price is current or automatically fetched.
Display daily, weekly and monthly cost breakdowns using the entered work/commuting schedule; do not assume five commuting days per week. Explain the time-period assumptions and distinguish recurring fixed costs from per-commute costs. For a regular schedule: weekly variable cost = per-commuting-day cost × commuting days per week; average monthly variable cost = weekly cost × 52 / 12. Label this an average month. Users with irregular schedules can enter commuting days for a specific month. Monthly fixed costs are added once, not multiplied again. Show the schedule and method used; different cost frequencies remain separate line items.
Acceptance: 40 return km, 7 L/100 km and R22/L produces R61.60 petrol per commuting day. Parking and tolls appear separately. Changing commuting days updates period totals; missing inputs show incomplete costs rather than zero. The figures in this example are illustrative.

## Current Job Baseline
An optional current job sits outside the limit of three prospective jobs. Capture current salary, expected deductions, work costs, return commuting time, working hours, benefits, employment conditions and confirmed duties/experience. Users without employment can skip this section.
Compare staying against moving: show changes in money remaining, working and commuting time, and known gains/losses in conditions. Do not infer missing baseline figures or automatically convert a job title into skills evidence. Current-job duties support the profile only when confirmed by the user. Benefits and conditions are explicit trade-offs; they are not automatically scored as cash or weighted factors.

## Comparison Factors and Working Hours
Four selectable factors: skills fit, money remaining after work costs, commuting time and weekly working hours. Users can rank them or adjust their importance; save the active mode and preferences with each snapshot.
Capture preferred weekly working hours and an optional maximum acceptable limit. Do not assume fewer hours are always better. Highlight jobs above the user's stated maximum. Show working hours and return commuting time separately, plus total weekly time committed when the necessary inputs are known. Unknown hours stay unknown. Avoid obscuring mandatory requirement gaps through weighting.

## Incomplete Comparisons
Calculate only what the supplied information supports. Missing salary, deductions, costs, requirements or hours are unknown, never zero. Explicit zero is valid where appropriate and distinct from blank. If a selected factor cannot be assessed fairly across the selected jobs, label the comparison partial, explain the missing evidence and avoid a confident overall winner. Show supported factor results and trade-offs. Users can supply visibly labelled assumptions and compare again; preserve assumptions in snapshots.

## Salary Suggestion Outputs
Provide both a suggested discussion range and a single starting figure within the advertised range, supported by confirmed relevant experience and preferred requirements. Explain evidence for a higher or more conservative position; clarify missing evidence rather than treating it as lack of ability. These outputs are discussion guides, not a market valuation, hiring probability or predicted offer.
For a fixed salary, display the stated amount and affordability; do not invent employer flexibility. If pay is absent, calculate a personal income target or labelled scenario, not an unsupported market salary. Show affordability separately from evidence-based positioning. Manual deductions may change at different gross salaries: a scenario must make any reused deduction assumption visible and editable.

## Platform, Privacy and Core Input Boundary
Competition platform: mobile-friendly web app usable on phones and computers, without an app-store installation. Same browser and device persistence; no online account or cross-device access. Process core documents locally, without uploading CV/job contents to an online extraction service.
Manual entry and pasted text are the first dependable path. Local TXT, DOCX and text-based PDF extraction is core, always followed by correction and confirmation. Extracted text is not automatically accurate structured job data. Save source links but do not promise to fetch websites. Local OCR for screenshots/scanned PDFs and automatic link reading are optional only after the complete core is tested. Legacy DOC remains uncommitted; offer conversion or manual entry. Automatic tax calculations are also stretch work, never required to complete the core flow.

## Additional Acceptance Scenarios
- Three prospective jobs plus an optional current-job baseline can be evaluated without treating the baseline as a fourth selection.
- A role above the maximum weekly hours displays that concern even when another factor ranks it highly.
- Missing deductions keep take-home and remaining-after-work-costs unknown; explicit zero deductions permit calculation.
- A partial comparison explains missing selected factors and does not force an overall winner.
- Regular-schedule costs use 52/12 for an average month; a specific-month schedule uses its entered commuting days. Fixed monthly costs are counted once.
- Salary-range results display both the discussion band and starting figure, evidence and deduction assumptions; missing pay remains a personal target/scenario.
- Local document extraction can be reviewed and corrected; unsupported/scanned/failed files offer pasted text and manual entry.

## Review Gate
This is a planning document, not a working application. User approved this consolidated document on 18 October 2026. Technical planning is the next stage. The required scope.md, prd.md and subsequent spec.md must remain part of the eventual public project. Learner profile is excluded from public commits by default.

## Approved Opportunity Import Refinement
The learner requested direct job-link import, automatic reviewable job-field suggestions from read documents and a highlighted-text destination chooser on Add an Opportunity. Direct browser import may fail on blocked or login/script-rendered pages; manual/paste/document fallbacks remain. Preserve existing fields unless the user explicitly replaces them.
