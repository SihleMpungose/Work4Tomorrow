import assert from 'node:assert/strict';
import {matchEvidence,requirementReport} from '../src/domain/skills.js';
import {compareJobs,weightsFor} from '../src/domain/priorities.js';
const fixtures=[
 ['Customer Service','fixing client issues','customer service'],
 ['Problem solving','fixing client issues','problem solving'],
 ['Complaint handling','Helped customers with refunds and complaints','complaint handling'],
 ['Troubleshooting','Fixed PCs and phones','troubleshooting'],
 ['Staff training','Showed new staff how to use the till','staff training'],
 ['Cash handling','Processed payments at the till','cash handling'],
 ['Computer literacy','Used Excel spreadsheets to update customer records','computer literacy'],
 ['Data entry','Entered customer details into a database','data entry'],
 ['Stock control','Counted stock every morning','stock control'],
 ['Communication','Answered customer calls and explained instructions','communication']
];
for(const [requirement,evidence,skill] of fixtures){const result=matchEvidence(requirement,{experience:evidence});assert(result.some(x=>x.skills.includes(skill)),requirement+': '+evidence);assert.equal(result[0].source,'experience');assert.equal(result[0].evidence,evidence);}
for(const evidence of ['I have no customer service experience','I never helped customers','I want to help customers','I am willing to help customers','I am learning to help customers','I enjoy selling phones'])assert.equal(matchEvidence(evidence.includes('phones')?'Troubleshooting':'Customer service',{evidence}).length,0,evidence);
assert.equal(matchEvidence('Network administration',{experience:'Fixed PCs and phones'}).length,0);
assert.equal(matchEvidence('Customer service certificate',{experience:'Helped clients with complaints'}).length,0);
assert.equal(matchEvidence('Cash handling',{experience:'Handled stock issues for clients'}).length,0);
assert.equal(matchEvidence('Troubleshooting',{experience:'Fixed recipes and sold laptops'}).length,0);
const duration=matchEvidence('3 years of customer service',{experience:'fixing client issues'});assert(duration[0].reason.includes('duration'));
const profile={evidence:'fixing client issues',experience:'Fixed PCs and phones',qualifications:'Matric'},job={id:'a',requirements:[{text:'Customer service',status:'Needs clarification',mandatory:true},{text:'Troubleshooting',status:'Supported',mandatory:false,evidence:'Fixed PCs'}],salary:8000,deductions:0,transport:'none',parking:0,tolls:0,fixed:0,days:5,hours:40,commute:30};
const before=structuredClone({profile,job}),report=requirementReport(job,profile);assert.equal(report.supported,1);assert.equal(report.unresolved,1);assert.equal(report.mandatoryOpen,1);assert.equal(report.suggested,1);
const result=compareJobs([job,{...job,id:'b',salary:9000}],profile,weightsFor('rank',{skills:1,money:2,commute:3,hours:4}));assert.equal(result.rows[0].values.skills,null);assert.equal(result.leaders.length,0);assert.equal(result.rows[0].skillsReport.requirements[0].matches[0].evidence,'fixing client issues');assert.deepEqual({profile,job},before);
console.log('PASS duty inference, provenance, unsupported claims, qualification and duration boundaries, comparisons and unchanged inputs');
