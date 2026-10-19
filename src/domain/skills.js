export const statuses = ['Needs clarification','Supported','Partially supported','Not demonstrated','Confirmed unmet'];
// Curated relationships suggest evidence; they never certify competence.
const normalise = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const has = (text, phrase) => (' '+text+' ').includes(' '+normalise(phrase)+' ');
const concepts = [
 {name:'customer service',terms:['customer service','customer care','customer support','client service','serving customers','helping customers','customer complaints']},
 {name:'cash handling',terms:['cash handling','till operator','cashier','point of sale','pos']},
 {name:'communication',terms:['communication','communicating','telephone communication','customer communication']},
 {name:'computer literacy',terms:['computer literacy','computer skills','basic computer','ms office','microsoft office']},
 {name:'troubleshooting',terms:['troubleshooting','trouble shooting','technical support','fault finding','fault diagnosis','diagnosing faults','diagnosing problems'],related:text=> /\b(fix|fixing|fixed|repair|repairing|repaired|diagnose|diagnosing)\b/.test(text)&&/\b(pc|pcs|computer|computers|phone|phones|laptop|laptops|hardware|software)\b/.test(text),reason:'Fixing or repairing computers/phones is related to diagnosing and resolving technical faults. Confirm the role’s specific systems and depth of troubleshooting.'}
];
export function matchEvidence(requirement, profile = {}) {
 const text=normalise(requirement);
 const lines=[...String(profile.evidence||'').split(/\n|;/),...String(profile.certificates||'').split(/\n|;/)].map(x=>x.trim()).filter(Boolean);
 const requiredConcepts=concepts.filter(c=>c.terms.some(t=>has(text,t)));
 const results=[];
 for(const evidence of [...new Set(lines)]){
  const line=normalise(evidence);
  // Do not suggest explicitly denied skills as positive supporting evidence.
  if(/\b(no|not|never|without|lack|lacking|cannot|cant|dont|doesnt)\b/.test(line))continue;
  const direct=requiredConcepts.find(c=>c.terms.some(t=>has(text,t)&&has(line,t)));
  if(direct){results.push({evidence,kind:'Direct skill match',reason:`Both the requirement and your profile mention ${direct.name}. This does not establish the required duration or qualification.`});continue;}
  const related=requiredConcepts.find(c=>c.terms.some(t=>has(line,t))||c.related?.(line));
  if(related){results.push({evidence,kind:'Related experience',reason:related.reason||`Your supplied experience relates to ${related.name}; confirm that the actual duties meet this requirement.`});continue;}
  if(text.length>3&&(has(line,text)||has(text,line)&&line.split(' ').length>=2)){results.push({evidence,kind:'Matching wording',reason:'The requirement and your supplied evidence share wording. Review context before confirming.'});}
 }
 return results;
}
export function suggestEvidence(requirement,profile){return matchEvidence(requirement,profile).map(m=>m.evidence);}
export function readiness(requirements) {
 if (!requirements.length) return 'Requirements not entered';
 const mandatory=requirements.filter(r=>r.mandatory);
 if (mandatory.some(r=>r.status==='Confirmed unmet')) return 'Conditional: mandatory requirement gap';
 if (mandatory.some(r=>r.status!=='Supported')) return 'Mandatory requirements need review';
 return mandatory.length ? 'Mandatory requirements supported by your review' : 'No mandatory requirements specified';
}
