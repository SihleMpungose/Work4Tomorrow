const assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--no-zygote']});
 for(const preview of [false,true]){
  const ctx=await b.newContext({viewport:{width:390,height:844}}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));
  await p.goto('http://127.0.0.1:8000/'+(preview?'README.md':''));
  let f=p;
  if(preview){await p.setContent('<iframe src="/output/work4tomorrow-preview.html" sandbox="allow-scripts allow-same-origin"></iframe>');f=p.frameLocator('iframe');}
  await f.locator('#name').fill('Demo');await f.getByRole('button',{name:'Save profile',exact:true}).click();
  await f.locator('#load-sample-jobs').evaluate(x=>x.ownerDocument.defaultView.__W4T_TEST_FAIL_SAVE__=true);await f.locator('#load-sample-jobs').click();await f.getByText('Sample jobs were not loaded.',{exact:false}).waitFor();assert.equal(await f.locator('[data-edit]').count(),0);await f.locator('#load-sample-jobs').evaluate(x=>x.ownerDocument.defaultView.__W4T_TEST_FAIL_SAVE__=false);await f.locator('#load-sample-jobs').click();await f.locator('[data-edit]').nth(2).waitFor();
  await f.locator('[data-edit="sample-it-support-v1"]').click();await f.locator('#salary').fill('12345');await f.getByRole('button',{name:'Save job & review evidence'}).click();
  await f.getByText('Fictional sample.',{exact:true}).waitFor();
  // Shared origin allows inspecting persisted values even inside the preview sandbox.
  const records=()=>p.evaluate(async()=>{const {allRecords}=await import('/src/data/db.js');return allRecords('jobs');});
  let rows=await records();assert.equal(rows.length,3);assert.equal(rows.find(x=>x.id==='sample-it-support-v1').salary,12345);assert(rows.every(x=>x.sample&&x.requirements.every(r=>r.status==='Needs clarification'&&!r.evidence)));
  if(preview)await p.locator('iframe').evaluate(x=>x.contentWindow.location.hash='dashboard');else await p.goto('http://127.0.0.1:8000/#dashboard');
  await f.locator('#load-sample-jobs').click();await f.getByText('Sample jobs are already loaded.',{exact:false}).waitFor();
  rows=await records();assert.equal(rows.length,3);assert.equal(rows.find(x=>x.id==='sample-it-support-v1').salary,12345);
  await p.evaluate(async()=>{const {saveRecord}=await import('/src/data/db.js');await saveRecord('jobs',{id:'personal',title:'My real saved job',revision:1,requirements:[]});});
  if(preview)await p.locator('iframe').evaluate(x=>x.src=x.src);else await p.reload();
  await f.locator('#load-sample-jobs').click();await f.getByText('Sample jobs are already loaded.',{exact:false}).waitFor();assert.equal((await records()).length,4);
  assert.deepEqual(errors,[]);await ctx.close();console.log('PASS sample loading, repeat load, saved edits, existing records, unreviewed evidence: '+(preview?'sandbox preview':'source'));
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
