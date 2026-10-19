// Conservative hints only: user must inspect/edit and explicitly apply each field.
export function suggestFields(text) {
 const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const fields={};
 for(const [key,label]of [['title','job title|position'],['employer','employer|company'],['location','location']]){
  const match=lines.map(x=>x.match(new RegExp('^(?:'+label+')\\s*:\\s*(.+)$','i'))).find(Boolean);if(match)fields[key]=match[1];
 }
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
