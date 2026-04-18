#!/usr/bin/env node

/**
 * Validate Questionnaire Consistency
 *
 * This script validates:
 * 1. Questionnaire templates are well-formed
 * 2. Question ordering is sequential with no gaps
 * 3. (Optional) Questionnaire items exist in item-deltas.json
 *
 * Usage: node scripts/validate-questionnaires.js [type]
 * Examples:
 *   node scripts/validate-questionnaires.js
 *   node scripts/validate-questionnaires.js essential
 */

const fs = require('fs');
const path = require('path');
const { getQuestionnaireTemplates } = require('../backend/data/questionnaire-templates');
const { validateQuestionnaire, getQuestionnaireMetadata } = require('../backend/utils/questionnaireUtils');

const typeFilter = process.argv[2];
const templates = getQuestionnaireTemplates();

console.log('🔍 Validating Questionnaires...\n');

const allValid = templates
  .filter(t => !typeFilter || t.type === typeFilter)
  .every(template => {
    const validation = validateQuestionnaire(template.type);
    const metadata = getQuestionnaireMetadata(template.type);

    console.log(`\n📋 ${template.type.toUpperCase()}`);
    console.log(`   Title: ${template.title}`);
    console.log(`   Questions: ${metadata.totalQuestions}`);
    console.log(`   Sections: ${Object.keys(metadata.sections).join(', ')}`);

    if (validation.isValid) {
      console.log(`   ✅ VALID`);
      return true;
    } else {
      console.log(`   ❌ INVALID`);
      validation.errors.forEach(err => console.log(`      ❌ ${err}`));
      return false;
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warn => console.log(`      ⚠️  ${warn}`));
    }
  });

console.log('\n' + '='.repeat(60));
if (allValid) {
  console.log('✅ All questionnaires are valid!');
  process.exit(0);
} else {
  console.log('❌ Some questionnaires have errors.');
  process.exit(1);
}
