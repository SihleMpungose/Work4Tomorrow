const assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--no-zygote']});
for(const url of ['http://127.0.0.1:8000/','file://'+process.cwd()+'/output/work4tomorrow-preview.html']){
const ctx=await b.newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
await p.locator('#name').fill('Existing');await p.locator('#evidence').fill('I handle customer queries.\nI fix computers and laptops');await p.locator('#certificates').fill('Existing training');
const cv='Name: Different Name\nEducation\nDiploma in IT Management, Rosebank College\n2017\nCERTIFICATIONS & DEVELOPMENT\nCompTIA Security+ (2021) | CompTIA Cloud+ (2021) | ISTQB Foundation\nSKILLS\nCustomer service\nNetwork monitoring';
await p.locator('#import-file').setInputFiles({name:'cv.txt',mimeType:'text/plain',buffer:Buffer.from(cv)});await p.locator('#read-file').click();await p.getByText('Review additional CV entries below.',{exact:false}).waitFor();
assert.equal(await p.locator('#qualifications').inputValue(),'Diploma in IT Management, Rosebank College\n2017');assert.equal(await p.locator('#certificates').inputValue(),'Existing training');assert.equal(await p.locator('#name').inputValue(),'Existing');assert.equal(await p.locator('#evidence').inputValue(),'I handle customer queries.\nI fix computers and laptops');
const panel=p.locator('#profile-import-suggestions');assert.equal(await panel.locator('input[type=checkbox]').count(),5);await panel.locator('label').filter({hasText:'Network monitoring'}).locator('input').uncheck();await p.locator('#append-profile-entries').click();
assert.equal(await p.locator('#evidence').inputValue(),'I handle customer queries.\nI fix computers and laptops\nCustomer service');assert.equal(await p.locator('#certificates').inputValue(),'Existing training\nCompTIA Security+ (2021)\nCompTIA Cloud+ (2021)\nISTQB Foundation');
await p.locator('#append-profile-entries').click();assert.equal((await p.locator('#certificates').inputValue()).split('CompTIA Security+').length,2);
await p.locator('#suggest-profile').click();assert.equal(await panel.locator('input[type=checkbox]').count(),1);await p.locator('#append-profile-entries').click();assert((await p.locator('#evidence').inputValue()).endsWith('Network monitoring'));await p.locator('#suggest-profile').click();assert.equal(await panel.isVisible(),false);
await p.getByRole('button',{name:'Save profile',exact:true}).click();await p.getByRole('heading',{name:'Your next move, Existing.'}).waitFor();await p.reload();await p.getByRole('heading',{name:'Your next move, Existing.'}).waitFor();
assert.deepEqual(errors,[]);await ctx.close();console.log('PASS CV certificate routing, preserving manual skills, selective append, repeat imports and saving: '+url);
}await b.close();})().catch(e=>{console.error(e);process.exit(1)});
