// Conservative field suggestions. Unknown salary units and applicant experience stay unknown.
export function importNumber(value){
 const text=String(value).trim().replace(/^(?:R|ZAR)\s*/i,'').replace(/\s+/g,'');
 if(!/^[0-9]+(?:[,.][0-9]+)*$/.test(text))return null;
 const normalized=/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(text)?text.replace(/,/g,''):text.replace(',','.');
 const number=Number(normalized);return Number.isFinite(number)&&number>=0?number:null;
}
export function suggestFields(text) {
 const lines=String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean),fields={};
 for(const [key,label]of [['title','job title|position|role'],['employer','employer|company'],['location','location|based in']]){
  const match=lines.map(x=>x.match(new RegExp('^(?:'+label+')\\s*:\\s*(.+)$','i'))).find(Boolean);if(match)fields[key]=match[1];
 }
 const salaryLine=lines.find(x=>/^(salary|pay|remuneration)\s*:/i.test(x)&&/(?:per\s*month|monthly|p\.?m\.?\b|\/month)/i.test(x)&&!/annual|year|hour|week/i.test(x));
 if(salaryLine){const amounts=[...salaryLine.matchAll(/(?:R|ZAR)\s*([0-9][0-9 ,]*(?:\.[0-9]{1,2})?)/gi)].map(x=>importNumber(x[1].trim())).filter(x=>x!=null);if(amounts.length){fields.salary=amounts[0];if(amounts.length>1&&amounts[1]>=amounts[0])fields.salaryMax=amounts[1];}}
 const hours=lines.map(x=>x.match(/(?:working hours\s*:\s*)?(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:per\s*week|weekly|\/week)/i)).find(Boolean);if(hours&&Number(hours[1])<=168)fields.hours=Number(hours[1]);
 const experience=lines.map(x=>x.match(/(?:minimum|required|at least)\s*(\d+(?:\.\d+)?)\s*(years?|months?)(?:\s+(?:of\s+)?(?:relevant\s+)?experience)?/i)||x.match(/(\d+(?:\.\d+)?)\s*(years?|months?)\s+(?:of\s+)?(?:relevant\s+)?experience/i)).find(Boolean);if(experience)fields.requiredMonths=Number(experience[1])*(experience[2].toLowerCase().startsWith('year')?12:1);
 let collecting=false;const requirements=[];
 for(const line of lines){if(/^(?:requirements?|minimum requirements?|qualifications?|skills(?: required)?|education|experience required)\s*:?$/i.test(line)){collecting=true;continue;}if(/^(?:responsibilities|duties|benefits|how to apply|application(?: process)?|job description|about(?: us| the role)?)\s*:?$/i.test(line)){collecting=false;continue;}if(collecting)requirements.push(line.replace(/^[•*–-]\s*/,''));}
 if(requirements.length)fields.requirements=requirements.slice(0,50).join('\n');
 if(lines.length)fields.description=String(text).trim().slice(0,12000);
 return fields;
}

export function suggestProfileFields(text) {
 const lines=String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean),result={};
 const sections={evidence:[],experience:[],certificates:[],qualifications:[]};let section=null;
 const headings=[['evidence',/^(?:key |core |technical |personal )?skills(?: and (?:abilities|competencies))?$/i],['experience',/^(?:(?:work|working|professional|employment) (?:experience|history)|experience)$/i],['certificates',/^(?:certifications?|certificates?|training|courses)(?: and training)?$/i],['qualifications',/^(?:education|qualifications?|academic (?:history|qualifications)|education and qualifications)$/i]];
 for(const line of lines){
  const named=line.match(/^(?:first name|given name|full name|name)\s*:\s*(.+)$/i);
  if(named){result.name=named[1].trim().split(/\s+/)[0];section=null;continue;}
  const clean=line.replace(/[:\s]+$/,'');const heading=headings.find(([,re])=>re.test(clean));
  if(heading){section=heading[0];continue;}
  const labelled=line.match(/^([^:]{2,50}):\s*(.+)$/);
  if(labelled){const group=headings.find(([,re])=>re.test(labelled[1].trim()));if(group){section=group[0];sections[section].push(labelled[2]);continue;}}
  if(/^(?:references?|contact(?: details)?|personal (?:details|information)|profile|summary|objective|interests?|languages?)\s*:?$/i.test(line)){section=null;continue;}
  if(section)sections[section].push(line.replace(/^[•*-]\s*/,''));
 }
 if(!result.name){const first=lines.find(x=>!/^(?:curriculum vitae|cv|resume|résumé)$/i.test(x));if(first&&/^[\p{L}][\p{L}'’-]+(?:\s+[\p{L}][\p{L}'’-]+){1,3}$/u.test(first)&&!headings.some(([,re])=>re.test(first))&&!/experience|skills|profile|contact|curriculum|education|qualifications|resume/i.test(first))result.name=first.split(/\s+/)[0];}
 for(const [key,values]of Object.entries(sections))if(values.length)result[key]=values.join('\n');
 return result;
}
