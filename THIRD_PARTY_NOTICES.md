# Third-party components

All application document processing runs locally. No parser code is fetched at runtime from a CDN.

- Mammoth **1.13.0**, BSD-2-Clause, browser bundle from the npm distribution. Source/documentation: https://github.com/mwilliamson/mammoth.js . Licence: `vendor/mammoth/LICENSE`. Uses `extractRawText`, never document-to-HTML conversion. Bundled upstream dependencies remain subject to their licences; release audit pending.
- PDF.js / pdfjs-dist **5.6.205**, Apache-2.0, browser module and worker from the runtime npm distribution. Source/documentation: https://mozilla.github.io/pdf.js/ . Licence: `vendor/pdfjs/LICENSE`.

Versions are pinned by checked-in files. No claim of a complete security audit. Original document bytes are not retained by this app after extraction. Sample fixtures are generated synthetic documents.
