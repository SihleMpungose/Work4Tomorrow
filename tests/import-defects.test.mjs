import assert from 'node:assert/strict';
import {suggestJobImport,closingDateSuggestion} from '../src/import/field-suggestions.js';
for(const separator of ['-','–','—','to']) {
 const {fields,experienceRange}=suggestJobImport(`Salary: R8,000 ${separator} 12,000 per month\n2 ${separator} 3 years experience`);
 assert.equal(fields.salary,8000);assert.equal(fields.salaryMax,12000);assert.equal(fields.requiredMonths,24);assert.equal(experienceRange.maxMonths,36);
}
for(const text of ['Minimum 3 years diploma','Three year degree','Preferred\n3 years experience','Up to 3 years experience','2 years experience\n5 years experience'])assert.equal(suggestJobImport(text).fields.requiredMonths,undefined,text);
assert.equal(suggestJobImport('Minimum 3 years diploma plus 2 years relevant work experience').fields.requiredMonths,24);
assert.equal(suggestJobImport('Experience required: 2–3 years').fields.requiredMonths,24);
for(const text of ['Salary: R12,000–8,000 per month','Salary: R120,000 per year'])assert.equal(suggestJobImport(text).fields.salary,undefined);
assert.equal(closingDateSuggestion('2026-11-05T23:59:00+02:00').date,'2026-11-05');
assert.equal(closingDateSuggestion('5 november 2026').date,'2026-11-05');
assert.equal(closingDateSuggestion('13/11/2026').date,'2026-11-13');
assert.deepEqual(closingDateSuggestion('01/11/2026').choices,['2026-11-01','2026-01-11']);
for(const date of ['31 February 2026','2026-02-30','2026-11-05T99:99:00Z','1 novemberjunk 2026'])assert.equal(closingDateSuggestion(date).date,undefined);
console.log('PASS shared-currency ranges, experience boundaries, qualification duration, optional/ambiguous experience and closing dates');
