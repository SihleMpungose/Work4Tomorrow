"""Build an offline-capable single-file preview and source ZIP from checked project files."""
import base64
import json
import re
import zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
# Opaque Android content:// pages cannot share parent-created blob URLs with workers.
# Put the DOCX library inside the worker itself and use self-contained data modules
# for PDF.js. No parser script needs a sibling file or a parent blob origin.
mammoth = (ROOT/'vendor/mammoth/mammoth.browser.min.js').read_text()
pdf_data = 'data:text/javascript;base64,'+base64.b64encode((ROOT/'vendor/pdfjs/pdf.min.mjs').read_bytes()).decode()
pdf_worker_data = 'data:text/javascript;base64,'+base64.b64encode((ROOT/'vendor/pdfjs/pdf.worker.min.mjs').read_bytes()).decode()
worker = (ROOT/'src/import/extract-worker.js').read_text()
worker = worker.replace("importScripts('../../vendor/mammoth/mammoth.browser.min.js');", '')
worker = worker.replace("'../../vendor/pdfjs/pdf.min.mjs'", json.dumps(pdf_data))
worker = worker.replace("new URL('../../vendor/pdfjs/pdf.worker.min.mjs',self.location.href).href", json.dumps(pdf_worker_data))
bootstrap = 'const IMPORT_WORKER_URL=URL.createObjectURL(new Blob(['+json.dumps(mammoth+';\n'+worker)+'],{type:"text/javascript"}));\n'
files=['src/domain/costs.js','src/domain/skills.js','src/domain/priorities.js','src/domain/salary.js','src/domain/snapshots.js','src/data/db.js','src/data/sample-jobs.js','src/import/reader.js','src/import/field-suggestions.js','src/import/link-reader.js','src/app.js']
code='\n'.join((ROOT/p).read_text() for p in files)
code=re.sub(r'^import .*?;\n','',code,flags=re.M)
code=re.sub(r'\bexport (?=(?:async )?function|const)','',code)
code=code.replace("new URL('./extract-worker.js',import.meta.url)",'IMPORT_WORKER_URL')
code=(bootstrap+code).replace('</script','<\\/script')
shell=ROOT/('source-index.html' if (ROOT/'source-index.html').exists() else 'index.html')
page=shell.read_text().replace('<link rel="stylesheet" href="styles/app.css">','<style>'+(ROOT/'styles/app.css').read_text()+'</style>').replace('<script type="module" src="src/app.js"></script>','<script>(()=>{'+code+'\n})();</script>')
(OUT/'work4tomorrow-preview.html').write_text(page)
with zipfile.ZipFile(OUT/'work4tomorrow-v0.5.1-mobile-fix.zip','w',zipfile.ZIP_DEFLATED) as z:
 for folder in ['src','styles','vendor','fixtures','tools','tests','devpost']:
  for f in (ROOT/folder).rglob('*'):
   if f.is_file() and '__pycache__' not in f.parts and f.name!='learner-profile.md' and (folder!='devpost' or f.suffix=='.md'):z.write(f,'work4tomorrow/'+str(f.relative_to(ROOT)))
 for name in ['package.json','README.md','THIRD_PARTY_NOTICES.md','.gitignore']:z.write(ROOT/name,'work4tomorrow/'+name)
 # The archive entry opens directly on phones; keep the modular shell for developers.
 z.writestr('work4tomorrow/index.html',page)
 z.write(shell,'work4tomorrow/source-index.html')
with zipfile.ZipFile(OUT/'work4tomorrow-mobile-v0.5.1.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('Work4Tomorrow.html',page)
 z.writestr('OPEN-FIRST.txt','Extract this ZIP, then open Work4Tomorrow.html with Chrome. Android file viewers may disable scripts; choose Open with Chrome. The full app and document readers are inside the HTML. For consistent saving across sessions, use the same browser and file location.\n')
print('Built standalone mobile preview, mobile ZIP and source ZIP.')
