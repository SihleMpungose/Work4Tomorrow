# Free hosting decision — 25 October 2026

**Confirmed live:** https://sihlempungose.github.io/Work4Tomorrow/
GitHub Pages publishes `main` from `/ (root)` with HTTPS enforced. First successful deployment: https://github.com/SihleMpungose/Work4Tomorrow/actions/runs/40188500559 .
Selected: GitHub Pages for the competition proof of concept, using the existing SihleMpungose/Work4Tomorrow public repository. No custom domain, server, database, subscriptions or API keys are needed. Static client code and bundled parsers fit this route. For later commercial SaaS use, reassess hosting: GitHub Pages restricts primarily commercial SaaS/transaction sites. Cloudflare Pages Free is an alternative (500 builds/month, 25 MiB/asset).

Official rules checked: https://learn-ai-basics.devpost.com/rules
They do not prescribe a hosting vendor. They require a working end-to-end proof of concept; public GitHub/GitLab/Bitbucket repository with source/assets/run instructions; scope.md, prd.md and spec.md generated using the Skill Pack; text description; public YouTube/Vimeo demo under three minutes. The repository should include a detectable open-source licence. Do not claim final compliance: GPLv3 has been selected; learning/submission checks remain outstanding.
Deadline: 26 October 2026 at 17:00 EDT = 23:00 South Africa time.

## Deployment steps
1. Push reviewed source and generated index.html to the existing repository, preserving history.
2. Repository Settings → Pages → Deploy from a branch; select the actual source branch and /(root). The package root must be the repository root, not a nested work4tomorrow folder. Include .nojekyll.
3. Use the URL returned by GitHub; intended URL is https://sihlempungose.github.io/Work4Tomorrow/ and deployment has now succeeded.
4. Verify HTTPS, icon, all tabs, local document imports, profile/job save/reload and comparisons on desktop and phone. Test under the /Work4Tomorrow/ path.
5. Use synthetic information for the judging demo. Do not commit CVs or learner-profile.md. Browser IndexedDB remains on the user's device; hosting does not sync it. Changing host will not transfer existing local records.

References: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits and https://developers.cloudflare.com/pages/platform/limits/

Status: deployed and browser-verified on 25 October 2026. Future pushes to main trigger Pages builds. Keep the app free and accessible during judging. Read deployment-2026-10-25.md for the verification scope.
