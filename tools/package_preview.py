"""Build an offline-capable single-file preview and source ZIP from checked project files."""
import base64
import json
import re
import zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
assets = {name: base64.b64encode((ROOT/path).read_bytes()).decode() for name,path in {
 'mammoth':'vendor/mammoth/mammoth.browser.min.js',
 'pdf':'vendor/pdfjs/pdf.min.mjs',
 'pdfWorker':'vendor/pdfjs/pdf.worker.min.mjs',
}.items()}
worker = (ROOT/'src/import/extract-worker.js').read_text()
worker = worker.replace("'../../vendor/mammoth/mammoth.browser.min.js'", 'ASSETS.mammoth').replace("'../../vendor/pdfjs/pdf.min.mjs'", 'ASSETS.pdf').replace("new URL('../../vendor/pdfjs/pdf.worker.min.mjs',self.location.href).href", 'ASSETS.pdfWorker')
bootstrap = 'const ASSETS=Object.fromEntries(Object.entries('+json.dumps(assets)+').map(([k,v])=>[k,URL.createObjectURL(new Blob([Uint8Array.from(atob(v),c=>c.charCodeAt(0))],{type:"text/javascript"}))]));\n'
bootstrap += 'const IMPORT_WORKER_URL=URL.createObjectURL(new Blob(["const ASSETS="+JSON.stringify(ASSETS)+";\\n"+'+json.dumps(worker)+'],{type:"text/javascript"}));\n'
files=['src/domain/costs.js','src/domain/skills.js','src/domain/priorities.js','src/domain/salary.js','src/data/db.js','src/import/reader.js','src/import/field-suggestions.js','src/app.js']
code='\n'.join((ROOT/p).read_text() for p in files)
code=re.sub(r'^import .*?;\n','',code,flags=re.M)
code=re.sub(r'\bexport (?=(?:async )?function|const)','',code)
code=code.replace("new URL('./extract-worker.js',import.meta.url)",'IMPORT_WORKER_URL')
code=(bootstrap+code).replace('</script','<\\/script')
page=(ROOT/'index.html').read_text().replace('<link rel="stylesheet" href="styles/app.css">','<style>'+(ROOT/'styles/app.css').read_text()+'</style>').replace('<script type="module" src="src/app.js"></script>','<script type="module">'+code+'</script>')
(OUT/'work4tomorrow-preview.html').write_text(page)
with zipfile.ZipFile(OUT/'work4tomorrow-v0.3.1-profile-fix.zip','w',zipfile.ZIP_DEFLATED) as z:
 for folder in ['src','styles','vendor','fixtures','tools','tests','devpost']:
  for f in (ROOT/folder).rglob('*'):
   if f.is_file() and '__pycache__' not in f.parts and f.name!='learner-profile.md' and (folder!='devpost' or f.suffix=='.md'):z.write(f,'work4tomorrow/'+str(f.relative_to(ROOT)))
 for name in ['index.html','package.json','README.md','THIRD_PARTY_NOTICES.md','.gitignore']:z.write(ROOT/name,'work4tomorrow/'+name)
print('Built self-contained preview and document-import source ZIP.')
