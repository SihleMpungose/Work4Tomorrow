// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
import {extractRequirements} from './requirements.js';
// Conservative field suggestions. Unknown salary units and applicant experience stay unknown.
export function importNumber(value){
 const text=String(value).trim().replace(/^(?:R|ZAR)\s*/i,'').replace(/\s+/g,'');
 if(!/^[0-9]+(?:[,.][0-9]+)*$/.test(text))return null;
 const normalized=/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(text)?text.replace(/,/g,''):text.replace(',','.');
 const number=Number(normalized);return Number.isFinite(number)&&number>=0?number:null;
}
// Dates are suggestions; ambiguous numeric dates require an explicit choice.
export function closingDateSuggestion(value){
 const raw=String(value||'').trim(),valid=date=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date+'T00:00:00Z'))&&new Date(date+'T00:00:00Z').toISOString().slice(0,10)===date;
 const iso=raw.match(/^(\d{4}-\d{2}-\d{2})(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/);
 if(iso&&valid(iso[1])&&(!raw.includes('T')||!Number.isNaN(Date.parse(raw))))return {date:iso[1],raw};
 const numeric=raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
 if(numeric){const [,a,b,y]=numeric,make=(m,d)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const choices=[...new Set([make(b,a),make(a,b)].filter(valid))];if(choices.length===1)return {date:choices[0],raw};if(choices.length===2)return {choices,raw,note:`Closing date “${raw}” is ambiguous. Choose its interpretation or enter the date manually.`};}
 const named=raw.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i)||raw.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);
 if(named){const day=/^\d/.test(named[1])?named[1]:named[2],word=/^\d/.test(named[1])?named[2]:named[1],month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf((/^(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)$/i.test(word)?word.slice(0,3).toLowerCase():''))+1;const date=`${named[3]}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;if(month&&valid(date))return {date,raw};}
 return {raw,note:raw?`Closing date “${raw}” could not be validated. Enter it manually if known.`:''};
}
export function experienceSuggestion(text){
 const candidates=[],notes=[];let experienceSection=false,optionalSection=false;
 const pattern=/\b(\d+(?:\.\d+)?)(?:\s*(?:[-–—]|to)\s*(\d+(?:\.\d+)?))?\s*(years?|months?)[’']?\s*(?:of\s+)?((?:[a-z]+[\s-]+){0,6})experience\b/gi;
 for(const raw of String(text).split(/\r?\n/)){
  const line=raw.trim();if(/^(?:preferred|desirable|optional|nice[- ]to[- ]have)(?:\s+(?:skills|requirements|experience|qualifications))?\s*:?$/i.test(line)){optionalSection=true;experienceSection=/experience/i.test(line);continue;}if(/^(?:required|mandatory|essential|minimum)(?:\s+(?:skills|requirements|experience|qualifications))?\s*:?$/i.test(line))optionalSection=false;if(/^(?:(?:relevant|work|required|minimum)\s+)?experience(?:\s+required)?\s*:?$/i.test(line)){experienceSection=true;continue;}
  if(/^(?:qualifications?|education|skills|duties|responsibilities|preferred skills|minimum requirements)\s*:?$/i.test(line)){experienceSection=false;continue;}
  const matches=[...line.matchAll(pattern)];
  if(!matches.length&&(experienceSection||/^experience(?:\s+required)?\s*:/i.test(line))){const m=line.replace(/^experience(?:\s+required)?\s*:\s*/i,'').match(/^(?:(?:minimum|at least|required)\s*:?[\s]*)?(\d+(?:\.\d+)?)(?:\s*(?:[-–—]|to)\s*(\d+(?:\.\d+)?))?\s*(years?|months?)\s*$/i);if(m)matches.push(m);}
  for(const m of matches){if(/diploma|degree|study|studies|course|education|qualification/i.test(m[4]||''))continue;
   if(optionalSection||/\b(?:preferred|desirable|advantage|optional|not required|no experience|up to|maximum)\b/i.test(line)){notes.push(`Experience wording needs review: “${line}”. No required minimum was inferred.`);continue;}
   const factor=m[3].toLowerCase().startsWith('year')?12:1,min=Number(m[1])*factor,max=m[2]?Number(m[2])*factor:min;
   if(min>max){notes.push(`Experience range is reversed: “${line}”. Enter the required minimum manually.`);continue;}
   candidates.push({minMonths:min,maxMonths:max,source:line});
  }
 }
 const unique=[...new Map(candidates.map(c=>[c.minMonths+':'+c.maxMonths,c])).values()];
 if(unique.length>1)return {notes:[...notes,'Different experience thresholds appear in this advert. Confirm the relevant minimum manually.']};
 return {range:unique[0],notes};
}
export function suggestJobImport(text){
 const lines=String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean),fields={},notes=[];
 for(const [key,label]of [['title','job title|position|role'],['employer','employer|company'],['location','location|based in']]){
  const match=lines.map(x=>x.match(new RegExp('^(?:'+label+')\\s*:\\s*(.+)$','i'))).find(Boolean);if(match)fields[key]=match[1];
 }
 const salaryLine=lines.find(x=>/^(salary|pay|remuneration)\s*:/i.test(x));
 if(salaryLine){
  if(/(?:per\s*month|monthly|p\.?m\.?\b|\/month)/i.test(salaryLine)&&!/annual|year|hour|week/i.test(salaryLine)){
   const amount='([0-9][0-9 ,]*(?:\\.[0-9]{1,2})?)',re=new RegExp('(?:R|ZAR)\\s*'+amount+'(?:\\s*(?:[-–—]|to)\\s*(?:(?:R|ZAR)\\s*)?'+amount+')?\\s*(?:per\\s*month|monthly|p\\.?m\\.?\\b|/month)','i'),m=salaryLine.match(re);
   if(m){const lo=importNumber(m[1]),hi=m[2]?importNumber(m[2]):null;if(lo!=null&&(hi==null||hi>=lo)){fields.salary=lo;if(hi!=null)fields.salaryMax=hi;}else notes.push('Salary range is invalid or reversed. Confirm both monthly amounts manually.');}
   else notes.push('Monthly salary wording could not be confidently read. Confirm the currency and range manually.');
  }else notes.push('Salary period or amount is not supported for automatic monthly import. Review it manually; no conversion was assumed.');
 }
 const hours=lines.map(x=>x.match(/(?:working hours\s*:\s*)?(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:per\s*week|weekly|\/week)/i)).find(Boolean);if(hours&&Number(hours[1])<=168)fields.hours=Number(hours[1]);
 const experience=experienceSuggestion(text);notes.push(...experience.notes);if(experience.range){fields.requiredMonths=experience.range.minMonths;notes.push(`Experience: “${experience.range.source}” → ${experience.range.minMonths}${experience.range.maxMonths!==experience.range.minMonths?'–'+experience.range.maxMonths:''} months. Suggested minimum: ${experience.range.minMonths} months; review before saving.`);}
 const requirements=extractRequirements(text);if(requirements.length)fields.requirements=[...new Set(requirements.map(r=>r.text))].join('\n');
 const dateLine=lines.map(x=>x.match(/^(?:closing date|application deadline|valid through)\s*:\s*(.+)$/i)).find(Boolean);let closingDate;
 if(dateLine){closingDate=closingDateSuggestion(dateLine[1]);if(closingDate.date)fields.closingDate=closingDate.date;if(closingDate.note)notes.push(closingDate.note);}
 if(lines.length)fields.description=String(text).trim().slice(0,12000);
 return {fields,notes,experienceRange:experience.range,closingDate};
}
export function suggestFields(text){return suggestJobImport(text).fields;}

export function suggestProfileFields(text) {
 const lines=String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean),result={};
 const sections={evidence:[],experience:[],certificates:[],qualifications:[]};let section=null;
 const headings=[['evidence',/^(?:(?:key|core|technical|personal|professional) )?skills(?: and (?:abilities|competencies|expertise))?$/i],['experience',/^(?:(?:work|working|professional|employment) (?:experience|history)|experience)$/i],['certificates',/^(?:professional )?(?:certifications?|certificates?|training|courses)(?: and (?:(?:professional )?development|training|courses|certifications?|certificates?))?$/i],['qualifications',/^(?:education|qualifications?|academic (?:history|qualifications)|education and qualifications)$/i]];
 for(const line of lines){
  const named=line.match(/^(?:first name|given name|full name|name)\s*:\s*(.+)$/i);
  if(named){result.name=named[1].trim().split(/\s+/)[0];section=null;continue;}
  const clean=line.replace(/^[•*–-]\s*/,'').replace(/\s*&\s*/g,' and ').replace(/[:\s]+$/,'').replace(/\s+/g,' ');const heading=headings.find(([,re])=>re.test(clean));
  if(heading){section=heading[0];continue;}
  const labelled=line.match(/^([^:]{2,50}):\s*(.+)$/);
  if(labelled){const group=headings.find(([,re])=>re.test(labelled[1].trim().replace(/\s*&\s*/g,' and ')));if(group){section=group[0];sections[section].push(labelled[2]);continue;}}
  if(/^(?:references?|contact(?: details)?|personal (?:details|information)|profile|summary|objective|interests?|languages?)\s*:?$/i.test(line)){section=null;continue;}
  if(section){const value=line.replace(/^[•*–-]\s*/,'');sections[section].push(value);}
 }
 if(!result.name){const first=lines.find(x=>!/^(?:curriculum vitae|cv|resume|résumé)$/i.test(x));if(first&&/^[\p{L}][\p{L}'’-]+(?:\s+[\p{L}][\p{L}'’-]+){1,3}$/u.test(first)&&!headings.some(([,re])=>re.test(first.replace(/\s*&\s*/g,' and ')))&&!/experience|skills|profile|contact|curriculum|education|qualifications|certifications|certificates|training|resume/i.test(first))result.name=first.split(/\s+/)[0];}
 for(const [key,values]of Object.entries(sections))if(values.length)result[key]=(key==='certificates'?values.flatMap(value=>value.split(/\s*\|\s*/)).filter(Boolean):values).join('\n');
 return result;
}

// Compare literal CV entries with existing text; never replace a user's wording.
export function additionalProfileEntries(existing,incoming){
 const key=value=>value.normalize('NFKC').toLowerCase().replace(/^[•*–-]\s*/,'').replace(/[^\p{L}\p{N}+#]+/gu,' ').trim();
 const known=new Set(String(existing||'').split(/\r?\n|\s*\|\s*/).map(key));
 return String(incoming||'').split(/\r?\n|\s*\|\s*/).map(x=>x.trim()).filter(value=>{const normalized=key(value);if(!normalized||known.has(normalized))return false;known.add(normalized);return true;});
}
