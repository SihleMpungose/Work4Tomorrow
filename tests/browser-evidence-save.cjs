const assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--no-zygote']});
 for(const preview of [false,true]){
  const ctx=await b.newContext({viewport:{width:390,height:844}}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:8000/README.md');
  await p.evaluate(async()=>{const {saveRecord}=await import('/src/data/db.js');await saveRecord('profile',{id:'primary',name:'Demo',evidence:'Customer service experience',revision:1});await saveRecord('jobs',{id:'review',revision:1,title:'Review test',salary:8000,deductions:0,transport:'none',parking:0,tolls:0,days:5,fixed:0,requirements:[{text:'Customer service',mandatory:false,status:'Needs clarification',evidence:''},{text:'Troubleshooting',mandatory:true,status:'Needs clarification',evidence:''}]});});
  let f=p;
  if(preview){await p.setContent('<iframe src="/output/work4tomorrow-preview.html#results" sandbox="allow-scripts allow-same-origin" style="width:390px;height:844px"></iframe>');f=p.frameLocator('iframe');}else await p.goto('http://127.0.0.1:8000/#results');
  const saved=()=>p.evaluate(async()=>{const {allRecords}=await import('/src/data/db.js');return (await allRecords('jobs')).find(j=>j.id==='review');});
  const status=f.locator('#evidence-save-status'),button=f.getByRole('button',{name:'Save evidence review',exact:true});
  await f.locator('#status-0').selectOption('Supported');await button.click();
  await status.getByText('Evidence not saved.',{exact:false}).waitFor();assert.equal((await saved()).revision,1);assert.equal(await f.locator('#evidence-0').evaluate(x=>x===x.ownerDocument.activeElement),true);
  await f.locator('#evidence-0').fill('Handled customer enquiries in retail.');await f.locator('[name="mandatory-0"]').check();await f.locator('#status-1').selectOption('Confirmed unmet');await f.locator('#evidence-1').fill('I have not performed technical troubleshooting.');
  await button.evaluate(x=>x.ownerDocument.defaultView.__W4T_TEST_FAIL_SAVE__=true);await button.click();await status.getByText('Not saved.',{exact:false}).waitFor();assert.equal((await saved()).revision,1);assert.equal(await f.locator('#evidence-0').inputValue(),'Handled customer enquiries in retail.');assert.equal(await button.isEnabled(),true);
  await button.evaluate(x=>x.ownerDocument.defaultView.__W4T_TEST_FAIL_SAVE__=false);await button.click();await status.getByText('Evidence review saved.',{exact:true}).waitFor();
  let job=await saved();assert.equal(job.revision,2);assert.equal(job.requirements[0].status,'Supported');assert.equal(job.requirements[0].mandatory,true);assert.equal(job.requirements[1].status,'Confirmed unmet');assert.equal(job.requirements[1].evidence,'I have not performed technical troubleshooting.');assert(job.updatedAt);
  if(preview)await p.locator('iframe').evaluate(x=>x.src=x.src);else await p.reload();
  await f.locator('#status-0').waitFor();assert.equal(await f.locator('#status-0').inputValue(),'Supported');assert.equal(await f.locator('#evidence-0').inputValue(),'Handled customer enquiries in retail.');assert.equal(await f.locator('[name="mandatory-0"]').isChecked(),true);
  await f.locator('#status-0').selectOption('Needs clarification');await f.locator('#evidence-0').fill('');await button.click();await status.getByText('Evidence review saved.',{exact:true}).waitFor();assert.equal((await saved()).requirements[0].evidence,'');assert.equal((await saved()).revision,3);
  assert.deepEqual(errors,[]);await ctx.close();console.log('PASS evidence save: validation beside button, failure/retry, all assessments and flags, persistence and clearing evidence ('+(preview?'sandbox preview':'source')+')');
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
