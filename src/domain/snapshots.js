import {salaryGuide} from './salary.js';
export const FORMULA_VERSION='w4t-1';
export function createSnapshot(jobs,profile,mode,values,weights,result){return {id:crypto.randomUUID(),createdAt:new Date().toISOString(),historical:false,deletedIds:[],payload:structuredClone({formulaVersion:FORMULA_VERSION,jobs,profile,mode,values,weights,result,salaryGuides:Object.fromEntries(jobs.map(job=>[job.id,salaryGuide(job,profile)]))})};}
export function snapshotChanged(item,profile,jobs){return item.payload.formulaVersion!==FORMULA_VERSION||(item.payload.profile.revision||0)!==(profile.revision||0)||item.payload.jobs.some(old=>!jobs.some(job=>job.id===old.id&&(job.revision||0)===(old.revision||0)));}
export function closingDateLabel(value,now=new Date()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return '';
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now),p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 const days=Math.round((Date.parse(value+'T00:00:00Z')-Date.parse(p.year+'-'+p.month+'-'+p.day+'T00:00:00Z'))/86400000);
 if(days<0)return 'Closing date passed · review availability';if(days===0)return 'Closes today';if(days<=3)return 'Closes in '+days+' day'+(days===1?'':'s');return 'Closes '+value;
}
