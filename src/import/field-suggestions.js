// Conservative hints only: user must inspect/edit and explicitly apply each field.
export function suggestFields(text) {
 const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const fields={};
 for(const [key,label]of [['title','job title|position'],['employer','employer|company'],['location','location']]){
  const match=lines.map(x=>x.match(new RegExp('^(?:'+label+')\\s*:\\s*(.+)$','i'))).find(Boolean);if(match)fields[key]=match[1];
 }
 return fields;
}
