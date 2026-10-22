import assert from 'node:assert/strict';
import {requirementPriority,extractRequirements,classifyRequirements} from '../src/import/requirements.js';
import {suggestFields} from '../src/import/field-suggestions.js';
import {sampleJobs} from '../src/data/sample-jobs.js';
for(const text of ['Must have customer service experience','Matric is required','Essential: computer literacy','Minimum 2 years troubleshooting','We require a driving licence'])assert.equal(requirementPriority(text).mandatory,true,text);
for(const text of ['Customer service preferred','Excel would be an advantage','Experience not required','No experience required','No experience needed','Optional certification']){assert.equal(requirementPriority(text).mandatory,false,text);assert.equal(requirementPriority(text).priority,'preferred',text);}
assert.equal(requirementPriority('Must have customer service and Excel preferred').priority,'unclear');assert.equal(requirementPriority('Customer service').priority,'unclear');
const source='Job title: Support agent\nMinimum requirements\nCustomer service\nComputer literacy\nPreferred skills\nExcel\nTroubleshooting not essential\nDuties\nAnswer calls';
assert.equal(suggestFields(source).requirements,'Customer service\nComputer literacy\nExcel\nTroubleshooting not essential');
const rows=classifyRequirements(suggestFields(source).requirements.split('\n'),source);assert.deepEqual(rows.map(r=>r.mandatory),[true,true,false,false]);assert(rows[0].priorityReason.includes('Minimum requirements'));assert(rows.every(r=>r.status==='Needs clarification'&&r.evidence===''));
assert.equal(extractRequirements('Must have customer service experience')[0].mandatory,true);
assert.equal(classifyRequirements(['Excel'],'Essential skills\nExcel\nPreferred skills\nExcel')[0].priority,'unclear');
assert.equal(extractRequirements('Minimum requirements: Matric; Computer literacy')[1].mandatory,true);
for(const job of sampleJobs()){assert(job.requirements.some(r=>r.mandatory));assert(job.requirements.some(r=>r.priority==='preferred'));assert(job.description.includes('Responsibilities'));assert.equal(job.salaryBasis,'assumed');}
console.log('PASS mandatory/preferred/ambiguous cues, heading scope, negative wording, source provenance and expanded sample jobs');
