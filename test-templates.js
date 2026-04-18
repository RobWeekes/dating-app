const templates = require('./backend/data/questionnaire-templates.js');
const t = templates.getQuestionnaireTemplates();
console.log('✓ Templates loaded successfully');
console.log('✓ Total questionnaires:', t.length);
const essential = t.find(q => q.type === 'essential');
console.log('✓ Essential Questionnaire found:', !!essential);
console.log('✓ Questions in Essential:', essential.questions.length);
console.log('\n✓ Sections:');
const sections = new Set(essential.questions.map(q => q.section));
sections.forEach(s => {
  const count = essential.questions.filter(q => q.section === s).length;
  console.log(`  • ${s}: ${count} questions`);
});
