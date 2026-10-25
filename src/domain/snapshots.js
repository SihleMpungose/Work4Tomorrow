// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
import {salaryGuide} from './salary.js';
// Record IDs are local identifiers, including in offline/file and HTTP previews.
export function recordId(){if(typeof crypto.randomUUID==='function')return crypto.randomUUID();const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const h=[...bytes].map(x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}
export const FORMULA_VERSION='w4t-2-evidence';
export function createSnapshot(jobs,profile,mode,values,weights,result){return {id:recordId(),createdAt:new Date().toISOString(),historical:false,deletedIds:[],payload:structuredClone({formulaVersion:FORMULA_VERSION,jobs,profile,mode,values,weights,result,salaryGuides:Object.fromEntries(jobs.map(job=>[job.id,salaryGuide(job,profile)]))})};}
export function snapshotChanged(item,profile,jobs){return item.payload.formulaVersion!==FORMULA_VERSION||(item.payload.profile.revision||0)!==(profile.revision||0)||item.payload.jobs.some(old=>!jobs.some(job=>job.id===old.id&&(job.revision||0)===(old.revision||0)));}
export function closingDateLabel(value,now=new Date()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return '';
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now),p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 const days=Math.round((Date.parse(value+'T00:00:00Z')-Date.parse(p.year+'-'+p.month+'-'+p.day+'T00:00:00Z'))/86400000);
 if(days<0)return 'Closing date passed · review availability';if(days===0)return 'Closes today';if(days<=3)return 'Closes in '+days+' day'+(days===1?'':'s');return 'Closes '+value;
}
