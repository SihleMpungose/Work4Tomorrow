// Synthetic fixtures for exploring comparisons; never real vacancies or market estimates.
export function sampleJobs(){
 const sampleRoles=[
  {id:'sample-retail-v1',title:'Retail Assistant · sample',employer:'Sample Retail Company (fictional)',salary:6500,deductions:250,hours:45,commute:40,fare:36,requiredMonths:0,requirements:['Customer service','Cash handling','Communication']},
  {id:'sample-call-centre-v1',title:'Customer Service Agent · sample',employer:'Sample Contact Centre (fictional)',salary:8500,deductions:500,hours:40,commute:80,fare:60,requiredMonths:6,requirements:['Customer service','Communication','Computer literacy']},
  {id:'sample-it-support-v1',title:'Junior IT Support Technician · sample',employer:'Sample Technology Company (fictional)',salary:11000,deductions:800,hours:40,commute:100,fare:80,requiredMonths:12,requirements:['Troubleshooting computers and phones','Customer service','Computer literacy']}
 ];
 return sampleRoles.map(role=>({...role,sample:true,revision:1,location:'Johannesburg · illustrative',availability:'Open',application:'Not applied',closingDate:'',sourceURL:'',salaryBasis:'assumed',salaryMax:null,relevantMonths:null,days:5,transport:'fare',fareBasis:'return',parking:0,tolls:0,fixed:0,description:'FICTIONAL SAMPLE: Practice comparing skills, working hours and monthly costs. All figures and duties are illustrative; this is not an available vacancy. Edit the assumptions to explore scenarios. Review your genuine evidence before confirming any requirement.',requirements:role.requirements.map(text=>({text,mandatory:false,status:'Needs clarification',evidence:''}))}));
}
