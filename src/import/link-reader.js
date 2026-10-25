// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
// Direct browser requests only: no proxy, login cookies or local CV data sent.
export function jobLinkURL(value){
 let url;try{url=new URL(value);}catch{throw Error('Enter a complete http or https job link.');}
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('Use a public http or https job link without embedded login details.');
 if(/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/i.test(url.hostname))throw Error('Use a public job website link.');
 if(/(^|\.)indeed\.com$/i.test(url.hostname)){const key=url.searchParams.get('jk')||url.searchParams.get('vjk');if(key&&/^[a-z0-9]+$/i.test(key)){url.pathname='/viewjob';url.search='';url.searchParams.set('jk',key);url.hash='';}}
 return url;
}
function plainHTML(value){const doc=new DOMParser().parseFromString(String(value),'text/html');for(const node of doc.querySelectorAll('script,style,iframe,object,embed,nav,footer,header,aside,[role=navigation],[role=banner],[role=contentinfo],.advertisement,.ads,.cookie-banner'))node.remove();for(const node of doc.querySelectorAll('p,div,li,section,article,h1,h2,h3,h4,br,tr'))node.append('\n');return (doc.body.textContent||'').replace(/[\t ]+/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join('\n');}
export function jobTextFromHTML(html,sourceURL=''){
 const doc=new DOMParser().parseFromString(html,'text/html');let job=null;const candidates=[];
 function inspect(value,depth=0){if(!value||typeof value!=='object'||depth>8)return;if(Array.isArray(value)){for(const item of value.slice(0,100))inspect(item,depth+1);return;}const type=value['@type'];if(type==='JobPosting'||Array.isArray(type)&&type.includes('JobPosting')){candidates.push(value);return;}if(value['@graph'])inspect(value['@graph'],depth+1);}
 for(const node of doc.querySelectorAll('script[type="application/ld+json"]')){try{inspect(JSON.parse(node.textContent));}catch{}}
 if(candidates.length===1)job=candidates[0];else if(candidates.length>1){const key=sourceURL?new URL(sourceURL).searchParams.get('jk'):null;job=key?candidates.find(item=>String(item.identifier?.value||item.identifier||'').includes(key)||String(item.url||'').includes(key)):null;if(!job)throw Error('This page contains multiple jobs. Use the link to one specific advert.');}
 if(job){const lines=[];if(typeof job.title==='string')lines.push('Job title: '+job.title);if(typeof job.hiringOrganization?.name==='string')lines.push('Employer: '+job.hiringOrganization.name);const location=Array.isArray(job.jobLocation)?job.jobLocation[0]:job.jobLocation;const address=location?.address;if(address){const loc=[address.addressLocality,address.addressRegion,address.addressCountry].filter(x=>typeof x==='string').join(', ');if(loc)lines.push('Location: '+loc);}
 const pay=job.baseSalary,amount=pay?.value;if(pay?.currency==='ZAR'&&amount?.unitText==='MONTH'){const lo=amount.minValue??amount.value,hi=amount.maxValue;if(Number.isFinite(lo))lines.push('Salary: R'+lo+(Number.isFinite(hi)?' - R'+hi:'')+' per month');}
 if(typeof job.description==='string')lines.push('Job description:\n'+plainHTML(job.description));if(typeof job.qualifications==='string')lines.push('Qualifications:\n'+plainHTML(job.qualifications));if(typeof job.skills==='string')lines.push('Requirements:\n'+plainHTML(job.skills));return lines.join('\n');}
 const content=doc.querySelector('#jobDescriptionText,[data-testid="job-description"],[itemprop="description"],[data-job-description]');if(!content)throw Error('A single job advert could not be isolated from this page. Use a specific advert link, document or pasted job text.');const title=doc.querySelector('h1,[data-testid="jobsearch-JobInfoHeader-title"]')?.textContent?.trim();const employer=doc.querySelector('[data-testid="inlineHeader-companyName"],[itemprop="hiringOrganization"]')?.textContent?.trim();const location=doc.querySelector('[data-testid="inlineHeader-companyLocation"],[itemprop="jobLocation"]')?.textContent?.trim();return [title?'Job title: '+title:'',employer?'Employer: '+employer:'',location?'Location: '+location:'','Job description:',plainHTML(content.innerHTML)].filter(Boolean).join('\n');
}
export async function readJobLink(value,{signal}={}){
 const url=jobLinkURL(value);const controller=new AbortController();const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});const timeout=setTimeout(abort,10000);
 try{
  const response=await fetch(url.href,{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,headers:{Accept:'text/html,text/plain'}});
  if(!response.ok)throw Error('Website returned '+response.status+'.');
  if(Number(response.headers.get('content-length'))>1024*1024)throw Error('Page is too large to import.');
  const type=(response.headers.get('content-type')||'').toLowerCase();if(!/text\/html|text\/plain|application\/xhtml/.test(type))throw Error('This link is not a readable web page. Download the document and use Read document instead.');
  const reader=response.body.getReader();const chunks=[];let total=0;while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>1024*1024){await reader.cancel();throw Error('Page is too large to import.');}chunks.push(value);}
  const buffer=new Uint8Array(total);let offset=0;for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.length;}const raw=new TextDecoder().decode(buffer);const text=type.includes('text/plain')?raw:jobTextFromHTML(raw,url.href);
  if(!text.trim())throw Error('No job text found.');if(text.length>100000)throw Error('Job text is too long.');return {text:text.trim(),url:url.href};
 }catch(error){if(error.name==='AbortError')throw Error('Link import cancelled or timed out. Paste the advert or upload a document to continue.');throw Error('Could not read this link. The site may block browser access, require login, or use scripts to display the advert. Paste the advert or upload a document. '+(error instanceof TypeError?'':error.message));}
 finally{clearTimeout(timeout);signal?.removeEventListener('abort',abort);}
}
