// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
export const statuses = ['Needs clarification','Supported','Partially supported','Not demonstrated','Confirmed unmet'];
// Interpret saved evidence only. Document extraction and profile fields are untouched.
const normalise = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const has = (text, phrase) => (' '+text+' ').includes(' '+normalise(phrase)+' ');
const action = /\b(help(?:ed|ing)?|assist(?:ed|ing)?|resolv(?:e|ed|ing)|fix(?:ed|ing)?|handl(?:e|ed|ing)|answer(?:ed|ing)?|deal(?:t|ing)?|support(?:ed|ing)?)\b/;
const people = /\b(clients?|customers?|callers?)\b/;
const repair = /\b(fix(?:ed|ing)?|repair(?:ed|ing)?|diagnos(?:e|ed|ing)|resolv(?:e|ed|ing)|troubleshoot(?:ing)?)\b/;
const device = /\b(pcs?|computers?|phones?|laptops?|hardware|software|printers?)\b/;
const concepts = [
 {name:'customer service',terms:['customer service','customer care','customer support','client service','serving customers','helping customers','customer complaints'],duty:t=>action.test(t)&&people.test(t),why:'Helping clients or resolving their issues is related to customer service. Clarify the issue, your actions and the outcome.'},
 {name:'complaint handling',terms:['complaint handling','complaints handling','complaint resolution','handling complaints'],duty:t=>action.test(t)&&/\b(complaints?|refunds?|dissatisfied)\b/.test(t)&&people.test(t),why:'Handling customer complaints or refunds suggests complaint resolution experience.'},
 {name:'cash handling',terms:['cash handling','till operator','cashier','point of sale','pos'],duty:t=>/\b(process(?:ed|ing)?|count(?:ed|ing)?|balanc(?:e|ed|ing)|operat(?:e|ed|ing)|handl(?:e|ed|ing))\b/.test(t)&&/\b(cash|till|payments|register)\b/.test(t),why:'Processing payments or operating a till suggests cash handling; confirm responsibility for cash and accuracy.'},
 {name:'communication',terms:['communication','communicating','telephone communication','customer communication'],duty:t=>/\b(explain(?:ed|ing)?|answer(?:ed|ing)?|respond(?:ed|ing)?|communicat(?:e|ed|ing))\b/.test(t)&&/\b(customers?|clients?|calls?|emails?|colleagues?|instructions|queries)\b/.test(t),why:'Explaining information or answering enquiries suggests communication skills.'},
 {name:'computer literacy',terms:['computer literacy','computer skills','basic computer','ms office','microsoft office'],duty:t=>/\b(us(?:e|ed|ing)|creat(?:e|ed|ing)|updat(?:e|ed|ing)|enter(?:ed|ing)?)\b/.test(t)&&/\b(spreadsheets?|excel|word|outlook|emails?|computer|computers|database)\b/.test(t),why:'Using office software or entering records on a computer suggests computer literacy; confirm the tools and level required.'},
 {name:'troubleshooting',terms:['troubleshooting','trouble shooting','technical support','fault finding','fault diagnosis','diagnosing faults','diagnosing problems'],duty:t=>repair.test(t)&&device.test(t),why:'Fixing or repairing computers/phones is related to diagnosing and resolving technical faults. Confirm the role’s specific systems and depth of troubleshooting.'},
 {name:'problem solving',terms:['problem solving','problem resolution','resolving problems','solve problems'],duty:t=>repair.test(t)&&(/\b(issues?|problems?|faults?)\b/.test(t)||device.test(t)),why:'Resolving issues suggests problem solving. Clarify how you identified the cause and chose a solution.'},
 {name:'staff training',terms:['staff training','training staff','mentoring','onboarding staff'],duty:t=>/\b(train(?:ed|ing)?|teach(?:ing)?|taught|show(?:ed|ing)?|coach(?:ed|ing)?)\b/.test(t)&&/\b(staff|colleagues?|employees?|team members?)\b/.test(t),why:'Teaching staff how to perform a task suggests practical training experience; it does not establish a formal training qualification.'},
 {name:'stock control',terms:['stock control','inventory management','stock management','inventory control'],duty:t=>/\b(count(?:ed|ing)?|track(?:ed|ing)?|check(?:ed|ing)?|replenish(?:ed|ing)?|monitor(?:ed|ing)?)\b/.test(t)&&/\b(stock|inventory|supplies)\b/.test(t),why:'Counting or monitoring stock suggests practical inventory experience.'},
 {name:'data entry',terms:['data entry','capturing data','data capturing'],duty:t=>/\b(enter(?:ed|ing)?|captur(?:e|ed|ing)|updat(?:e|ed|ing)|record(?:ed|ing)?)\b/.test(t)&&/\b(records?|data|database|spreadsheets?|details)\b/.test(t),why:'Entering or updating records suggests data entry experience; confirm accuracy, volume and tools.'}
];
const denied = t => /\b(no|not|never|without|lack|lacking|cannot|cant|dont|doesnt|havent|hasnt|unable)\b/.test(t);
const hypothetical = t => /\b(want to|wish to|would like|hope to|interested in|willing to|learning to|plan to|aim to)\b/.test(t);
function profileClauses(profile){
 return ['evidence','experience','certificates','qualifications'].flatMap(field=>String(profile[field]||'').split(/\n|;|[.!?](?:\s|$)|\bbut\b/i).map(evidence=>({source:field,evidence:evidence.trim()}))).filter(x=>x.evidence);
}
export function matchEvidence(requirement, profile = {}) {
 const text=normalise(requirement),requiredConcepts=concepts.filter(c=>c.terms.some(t=>has(text,t))),results=[];
 const formal=/\b(certificate|certification|certified|degree|diploma|licen[sc]e|matric)\b/.test(text);
 const limited=/\b(\d+|years?|months?|advanced|expert|senior)\b/.test(text);
 const seen=new Set();
 for(const {evidence,source} of profileClauses(profile)){
  const line=normalise(evidence);if(seen.has(line)||denied(line)||hypothetical(line))continue;seen.add(line);
  // Practical duties never stand in for a formal credential.
  if(formal){if(has(line,text))results.push({evidence,source,kind:'Matching wording',skills:[],strength:'Review required',reason:'Matching credential wording only. Confirm the exact award, issuer and completion status.'});continue;}
  const matches=requiredConcepts.filter(c=>c.terms.some(t=>has(line,t))||line.split(/\band\b/).some(clause=>c.duty?.(clause)));
  if(matches.length){
   const direct=matches.some(c=>c.terms.some(t=>has(text,t)&&has(line,t)));
   const inferred=matches.filter(c=>!c.terms.some(t=>has(line,t)));
   results.push({evidence,source,kind:direct?'Direct skill match':'Related experience',skills:matches.map(c=>c.name),strength:inferred.length?'Suggested from duties':'Explicit skill wording',reason:matches.map(c=>inferred.includes(c)?c.why:`Your supplied wording relates to ${c.name}.`).join(' ')+(limited?' Required level or duration still needs verification.':'')+' This is a suggestion, not confirmed support for the whole requirement.'});
  }else if(text.length>3&&(has(line,text)||(has(text,line)&&line.split(' ').length>=2))){results.push({evidence,source,kind:'Matching wording',skills:[],strength:'Review required',reason:'Shared wording only. Check context, scope and any required duration before confirming.'});}
 }
 return results;
}
export function suggestEvidence(requirement,profile){return matchEvidence(requirement,profile).map(m=>m.evidence);}
export function requirementReport(job,profile={}){
 const requirements=(job.requirements||[]).map(r=>({...r,matches:matchEvidence(r.text,profile)}));
 return {requirements,total:requirements.length,supported:requirements.filter(r=>r.status==='Supported').length,partial:requirements.filter(r=>r.status==='Partially supported').length,unmet:requirements.filter(r=>r.status==='Confirmed unmet').length,unresolved:requirements.filter(r=>!['Supported','Partially supported','Confirmed unmet'].includes(r.status)).length,mandatoryOpen:requirements.filter(r=>r.mandatory&&r.status!=='Supported').length,suggested:requirements.filter(r=>r.matches.length&&r.status!=='Supported').length};
}
export function readiness(requirements) {
 if (!requirements.length) return 'Requirements not entered';
 const mandatory=requirements.filter(r=>r.mandatory);
 if (mandatory.some(r=>r.status==='Confirmed unmet')) return 'Conditional: mandatory requirement gap';
 if (mandatory.some(r=>r.status!=='Supported')) return 'Mandatory requirements need review';
 return mandatory.length ? 'Mandatory requirements supported by your review' : 'No mandatory requirements specified';
}
