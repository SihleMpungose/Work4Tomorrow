// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
const requirementKey=value=>String(value||'').toLowerCase().replace(/^[•*–-]\s*/,'').replace(/\s+/g,' ').trim();
export function requirementPriority(text,context=''){
 const value=String(text||'');
 const optional=/\b(not (?:essential|required|mandatory|necessary)|no .{0,40} (?:required|necessary|needed)|optional|preferred|preferably|desirable|advantageous|added advantage|nice[- ]to[- ]have|a plus|an advantage|beneficial)\b/i.test(value);
 const required=/\b(must(?: have| possess| be)?|we require|mandatory|essential|required|compulsory|non[- ]negotiable|minimum|at least)\b/i.test(value.replace(/\bno .{0,40} (?:required|necessary|needed)\b/gi,'').replace(/\bnot (?:essential|required|mandatory|necessary)\b/gi,''));
 if(optional&&required)return {mandatory:false,priority:'unclear',priorityReason:'Mixed mandatory and preferred wording in this line. Split it or confirm the priority.'};
 if(optional)return {mandatory:false,priority:'preferred',priorityReason:'Advert wording: '+value};
 if(required)return {mandatory:true,priority:'mandatory',priorityReason:'Advert wording: '+value};
 if(/^(?:skills required|experience required|minimum|mandatory|essential|required|must[- ]have|compulsory)(?:\s+(?:requirements?|skills|qualifications?))?$/i.test(context))return {mandatory:true,priority:'mandatory',priorityReason:'Listed under “'+context+'”.'};
 if(/^(?:preferred|desirable|optional|nice[- ]to[- ]have)(?:\s+(?:requirements?|skills|qualifications?))?$/i.test(context))return {mandatory:false,priority:'preferred',priorityReason:'Listed under “'+context+'”.'};
 return {mandatory:false,priority:'unclear',priorityReason:'The advert does not clearly state whether this requirement is mandatory.'};
}
export function extractRequirements(text){
 let context='',collecting=false;const rows=[];
 for(const raw of String(text||'').split(/\r?\n/)){
  const line=raw.trim().replace(/^[•*–-]\s*/,'');if(!line)continue;
  const heading=line.replace(/\s*:\s*$/,'');
  if(/^(?:(?:minimum|mandatory|essential|required|preferred|desirable|optional|compulsory|must[- ]have|nice[- ]to[- ]have)(?:\s+(?:requirements?|skills|qualifications?))?|requirements?|qualifications?|skills(?: required)?|education|experience required)$/i.test(heading)){context=heading;collecting=true;continue;}
  const inline=line.match(/^((?:(?:minimum|mandatory|essential|required|preferred|desirable|optional)\s+)?(?:requirements?|skills|qualifications?))\s*:\s*(.+)$/i);
  if(inline){context=inline[1];collecting=true;for(const value of inline[2].split(/\s*;\s*/))rows.push({text:value,...requirementPriority(value,context),priorityOrigin:'advert'});continue;}
  if(/^(?:salary|pay|remuneration|location|job title|employer|closing date|working hours)\s*:/i.test(line)){context='';collecting=false;continue;}
  if(/^(?:responsibilities|duties|benefits|how to apply|application(?: process)?|job description|about(?: us| the role)?|salary|remuneration|location|working hours)\s*:?$/i.test(line)){context='';collecting=false;continue;}
  if(collecting||(/\b(?:must have|must possess|is required|are required|essential|mandatory|preferred|desirable|advantageous|nice[- ]to[- ]have)\b/i.test(line)&&! /^(?:salary|pay|location|job title|employer)\s*:/i.test(line)))for(const value of line.split(/\s*;\s*/))if(value)rows.push({text:value,...requirementPriority(value,context),priorityOrigin:'advert'});
 }
 return rows.slice(0,50);
}
export function classifyRequirements(requirements,source=''){
 const imported=extractRequirements(source);
 return requirements.map(text=>{
  const candidates=imported.filter(r=>requirementKey(r.text)===requirementKey(text));
  const priorities=new Set(candidates.map(r=>r.priority));
  const inferred=priorities.size>1?{mandatory:false,priority:'unclear',priorityReason:'Conflicting priorities for this requirement in the advert.'}:candidates[0]||requirementPriority(text);
  return {...inferred,text,priorityOrigin:'advert',status:'Needs clarification',evidence:''};
 });
}
