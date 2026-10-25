// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
export function salaryGuide(job,profile={}){
 const low=job.salary,high=job.salaryMax;
 if(low==null){const targets=[profile.gross,profile.takeHome!=null&&job.deductions!=null?profile.takeHome+job.deductions:null].filter(v=>v!=null);return {kind:'Personal target',target:targets.length?Math.max(...targets):null,reason:'Based only on your income goals and any entered constant deductions, not market pay.'};}
 if(job.salaryBasis==='assumed')return {kind:'Salary scenario',target:low,reason:'Your assumption; no employer salary recommendation can be inferred.'};
 if(high==null||high===low)return {kind:'Fixed advertised salary',target:low,reason:'Affordability can be evaluated; employer flexibility is unknown.'};
 const preferred=(job.requirements||[]).filter(r=>!r.mandatory);
 if(preferred.some(r=>!['Supported','Partially supported','Confirmed unmet'].includes(r.status)))return {kind:'Clarify evidence',reason:'Preferred requirements have unresolved evidence. Review before selecting a discussion band.'};
 const fit=preferred.length?preferred.reduce((s,r)=>s+({'Supported':1,'Partially supported':.5,'Confirmed unmet':0}[r.status]),0)/preferred.length:null;
 const experience=job.requiredMonths>0&&job.relevantMonths!=null?job.relevantMonths/job.requiredMonths:null;
 if(fit==null&&experience==null)return {kind:'Insufficient evidence',reason:'No assessed preferred requirements or explicit relevant-experience threshold. Advertised range only.'};
 const band=(fit!=null&&fit<.5)||(experience!=null&&experience<1)?0:fit!=null&&experience!=null&&fit>=.8&&experience>1?2:1;
 const step=(high-low)/3;return {kind:['Lower discussion band','Middle discussion band','Upper discussion band'][band],low:low+step*band,high:low+step*(band+1),target:low+step*(band+.5),reason:`Confirmed preferred fit: ${fit==null?'not available':Math.round(fit*100)+'%'}. Relevant experience: ${experience==null?'no assessed threshold':job.relevantMonths+' / '+job.requiredMonths+' required months'}. Transparent rule, not an employer prediction. Mandatory gaps remain separate.`};
}
