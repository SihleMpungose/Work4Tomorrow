import {classifyRequirements} from '../import/requirements.js';
// Fictional examples only. Figures are scenarios, not estimates of market pay.
export function sampleJobs(){
 const roles=[
  {id:'sample-retail-v1',title:'Retail Assistant · sample',employer:'Sample Retail Company (fictional)',salary:6500,deductions:250,hours:45,commute:40,fare:36,requiredMonths:0,duties:'Assist shoppers, explain products, process purchases and keep shelves organised.',essential:['Customer service','Cash handling'],preferred:['Communication','Stock control']},
  {id:'sample-call-centre-v1',title:'Customer Service Agent · sample',employer:'Sample Contact Centre (fictional)',salary:8500,deductions:500,hours:40,commute:80,fare:60,requiredMonths:6,duties:'Answer customer calls, resolve queries, record case notes and escalate unresolved complaints.',essential:['6 months of customer service experience','Communication','Computer literacy'],preferred:['Complaint handling']},
  {id:'sample-it-support-v1',title:'Junior IT Support Technician · sample',employer:'Sample Technology Company (fictional)',salary:11000,deductions:800,hours:40,commute:100,fare:80,requiredMonths:12,duties:'Diagnose computer and software faults, help users, document fixes and escalate specialist issues.',essential:['Troubleshooting computers and phones','Computer literacy','12 months of relevant technical support experience'],preferred:['Customer service','CompTIA A+ certification would be an advantage']}
 ];
 return roles.map(({essential,preferred,duties,...role})=>{
  const description='FICTIONAL SAMPLE — not an available vacancy. All figures, duties and requirements are illustrative.\nResponsibilities\n'+duties+'\nMinimum requirements\n'+essential.join('\n')+'\nPreferred skills\n'+preferred.join('\n')+'\nBenefits\nAsk about leave, benefits and the actual shift schedule before deciding.';
  return {...role,sample:true,sampleVersion:2,revision:1,location:'Johannesburg · illustrative',availability:'Open',application:'Not applied',closingDate:'',sourceURL:'',salaryBasis:'assumed',salaryMax:null,relevantMonths:null,days:5,transport:'fare',fareBasis:'return',parking:0,tolls:0,fixed:0,description,requirements:classifyRequirements([...essential,...preferred],description)};
 });
}
