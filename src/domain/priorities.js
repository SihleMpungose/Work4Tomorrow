import {requirementReport} from './skills.js';
import {evaluateCosts} from './costs.js';
export const factors=['skills','money','commute','hours'];
export function weightsFor(mode,values){
 if(factors.some(k=>!Number.isFinite(values[k])||values[k]<0||values[k]>10))throw Error('Importance must be between 0 and 10.');
 if(mode==='rank'&&(new Set(Object.values(values)).size!==4||factors.some(k=>![1,2,3,4].includes(values[k]))))throw Error('Give each factor a different rank from 1 to 4.');
 const raw=Object.fromEntries(factors.map(k=>[k,mode==='rank'?5-values[k]:values[k]]));const total=Object.values(raw).reduce((a,b)=>a+b,0);if(!total)throw Error('Choose at least one factor with importance above zero.');return Object.fromEntries(factors.map(k=>[k,raw[k]/total]));
}
export function skillScore(job){const req=job.requirements||[];if(!req.length||req.some(r=>!['Supported','Partially supported','Confirmed unmet'].includes(r.status)))return null;return req.reduce((s,r)=>s+({'Supported':1,'Partially supported':.5,'Confirmed unmet':0}[r.status]),0)/req.length*100;}
export function hoursScore(hours,profile){if(hours==null||!(profile.preferredHours>0))return null;if(profile.maxHours!=null&&hours>profile.maxHours)return 0;return Math.max(0,100*(1-Math.abs(hours-profile.preferredHours)/profile.preferredHours));}
export function compareJobs(jobs,profile,weights){
 const rows=jobs.map(job=>({job,skillsReport:requirementReport(job,profile),costs:evaluateCosts(job),values:{skills:skillScore(job),money:evaluateCosts(job).remaining,commute:job.commute??null,hours:hoursScore(job.hours,profile)}}));
 for(const k of ['money','commute']){const known=rows.map(r=>r.values[k]).filter(v=>v!=null);const min=Math.min(...known),max=Math.max(...known);for(const r of rows){const value=r.values[k];r.values[k]=value==null?null:max===min?50:100*(k==='money'?(value-min)/(max-min):(max-value)/(max-min));}}
 const missing=factors.filter(k=>weights[k]>0&&rows.some(r=>r.values[k]==null));
 for(const r of rows){r.score=missing.length||rows.length<2?null:factors.reduce((s,k)=>s+(weights[k]===0?0:r.values[k]*weights[k]),0);r.conditional=(r.job.requirements||[]).some(q=>q.mandatory&&q.status!=='Supported');}
 const top=missing.length?null:Math.max(...rows.map(r=>r.score??-Infinity));return {rows,missing,leaders:top==null?[]:rows.filter(r=>r.score!=null&&top-r.score<=1).map(r=>r.job.id)};
}
