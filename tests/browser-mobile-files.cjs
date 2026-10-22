const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--no-zygote']});
 for(const mode of ['file','opaque']){
  const ctx=await b.newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true}),p=await ctx.newPage(),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});let f=p;
  if(mode==='file')await p.goto('file://'+path.resolve(process.env.W4T_LOCAL_HTML||'output/work4tomorrow-preview.html'));
  else{await p.goto('http://127.0.0.1:8000/README.md');requests.length=0;await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:800px"></iframe>');await p.locator('iframe').evaluate((x,html)=>x.srcdoc=html,fs.readFileSync('output/work4tomorrow-preview.html','utf8'));f=p.frameLocator('iframe');}
  await f.getByRole('heading',{name:'Create your profile',exact:true}).waitFor();assert.equal(await f.locator('#cancel-import').isVisible(),false);
  for(const name of ['sample-job.txt','sample-job.docx','sample-job.pdf']){
   await f.locator('#import-file').setInputFiles('fixtures/documents/'+name);await f.locator('#read-file').click();await f.getByText('Text extracted.',{exact:false}).waitFor({timeout:20000});
   assert((await f.locator('#import-text').inputValue()).includes('Customer service'),name);assert.equal(await f.locator('#cancel-import').isVisible(),false);console.log('PASS '+mode+' offline extraction: '+name);
  }
  await f.locator('#import-file').setInputFiles('fixtures/documents/invalid.docx');await f.locator('#read-file').click();await f.getByText('This is not a supported DOCX archive.',{exact:true}).waitFor();assert.equal(await f.locator('#read-file').isEnabled(),true);assert.equal(await f.locator('#cancel-import').isVisible(),false);
  await f.locator('#name').fill('Mobile');await f.getByRole('button',{name:'Save profile',exact:true}).click();
  if(mode==='file'){await f.getByRole('heading',{name:'Your next move, Mobile.',exact:true}).waitFor();await p.reload();await f.getByRole('heading',{name:'Your next move, Mobile.',exact:true}).waitFor();}
  else await f.locator('#profile-save-status').getByText('Not saved.',{exact:false}).waitFor();
  assert.equal(await f.locator('body').evaluate(x=>x.scrollWidth>x.ownerDocument.defaultView.innerWidth),false);assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);await ctx.close();
 }
 await b.close();console.log('PASS local file + opaque-origin app boot, styled mobile layout, no external dependencies, storage handling and malformed file recovery');
})().catch(e=>{console.error(e);process.exit(1)});
