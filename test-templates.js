const templates = require('./backend/data/questionnaire-templates.js');
const t = templates.getQuestionnaireTemplates();
console.log('✓ Templates loaded successfully');
console.log('✓ Total questionnaires:', t.length);
const essential2 = t.find(q => q.type === 'essential2');
console.log('✓ Essential Questionnaire 2 found:', !!essential2);
console.log('✓ Questions in Essential 2:', essential2.questions.length);
console.log('\n✓ Sections:');
const sections = new Set(essential2.questions.map(q => q.section));
sections.forEach(s => {
  const count = essential2.questions.filter(q => q.section === s).length;
  console.log(`  • ${s}: ${count} questions`);
});
