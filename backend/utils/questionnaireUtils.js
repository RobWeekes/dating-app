/**
 * Questionnaire Utilities
 * Provides computed metadata from questionnaire templates
 * Single source of truth: questionnaire-templates.js
 */

const { getQuestionnaireTemplates } = require('../data/questionnaire-templates');

/**
 * Get questionnaire template by type
 * @param {string} type - Questionnaire type (e.g., 'essential2')
 * @returns {object|null} - Questionnaire template or null if not found
 */
function getQuestionnaireByType(type) {
  const templates = getQuestionnaireTemplates();
  return templates.find(q => q.type === type) || null;
}

/**
 * Get questionnaire metadata (computed from template)
 * @param {string} type - Questionnaire type
 * @returns {object} - Metadata with computed question count
 */
function getQuestionnaireMetadata(type) {
  const questionnaire = getQuestionnaireByType(type);
  if (!questionnaire) {
    return null;
  }

  // Count questions per section
  const sectionCounts = {};
  questionnaire.questions.forEach(q => {
    const section = q.section || 'General';
    sectionCounts[section] = (sectionCounts[section] || 0) + 1;
  });

  return {
    type: questionnaire.type,
    title: questionnaire.title,
    description: questionnaire.description,
    category: questionnaire.category,
    totalQuestions: questionnaire.questions.length,
    sections: sectionCounts,
    questionList: questionnaire.questions.map(q => ({
      id: q.text, // Using text as id for now
      order: q.order,
      text: q.text,
      section: q.section,
      critical: q.critical,
      required: q.required
    }))
  };
}

/**
 * Validate questionnaire consistency
 * Checks for gaps in ordering, missing sections, etc.
 * @param {string} type - Questionnaire type
 * @returns {object} - Validation result { isValid, errors, warnings }
 */
function validateQuestionnaire(type) {
  const questionnaire = getQuestionnaireByType(type);
  if (!questionnaire) {
    return { isValid: false, errors: [`Questionnaire type "${type}" not found`] };
  }

  const errors = [];
  const warnings = [];
  const questions = questionnaire.questions;

  // Check total count is reasonable
  if (questions.length === 0) {
    errors.push('Questionnaire has no questions');
  }

  // Check for duplicate orders
  const orders = questions.map(q => q.order);
  const duplicates = orders.filter((o, i) => orders.indexOf(o) !== i);
  if (duplicates.length > 0) {
    errors.push(`Duplicate question orders: ${[...new Set(duplicates)].join(', ')}`);
  }

  // Check for sequential ordering (1, 2, 3, ...)
  const sortedOrders = [...new Set(orders)].sort((a, b) => a - b);
  for (let i = 0; i < sortedOrders.length; i++) {
    if (sortedOrders[i] !== i + 1) {
      errors.push(`Question ordering gap: expected ${i + 1}, found ${sortedOrders[i]}`);
      break;
    }
  }

  // Check for required fields
  questions.forEach((q, idx) => {
    if (!q.text) errors.push(`Question ${idx + 1} missing text`);
    if (!q.section) warnings.push(`Question ${idx + 1} (${q.text?.substring(0, 30)}) missing section`);
    if (!Array.isArray(q.options)) errors.push(`Question ${idx + 1} has no options`);
    if (q.required === undefined) warnings.push(`Question ${idx + 1} (${q.text?.substring(0, 30)}) missing required flag`);
  });

  return {
    isValid: errors.length === 0,
    totalQuestions: questions.length,
    errors,
    warnings
  };
}

module.exports = {
  getQuestionnaireByType,
  getQuestionnaireMetadata,
  validateQuestionnaire
};
