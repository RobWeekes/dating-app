/**
 * Questionnaire Templates
 * Central source of truth for all questionnaire question data.
 * Used by the seed script to populate the database.
 */

function getQuestionnaireTemplates() {
  return [
    // ================= VALUES & LIFESTLE (X questions) =================
    // Description:
    {
      type: 'values',
      title: 'Values and Lifestyle',
      description: '',
      category: 'Values',
      questions: [
        // Section 1: Values & Life Goals
        // { text: 'What is your love language? (Select top 2)', type: 'multi', options: ['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'], required: true, order: 1, section: 'Love & Connection', sectionDescription: null, reversed: false, critical: false, conditional: null },

        // Section 2: Daily Lifestyle
        // { text: 'What is your love language? (Select top 2)', type: 'multi', options: ['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'], required: true, order: 1, section: 'Love & Connection', sectionDescription: null, reversed: false, critical: false, conditional: null },
      ],
    },

    // =============== EMOTIONAL FOUNDATION (X questions) ================
    // Description:
    {
      type: 'emotional',
      title: 'Emotional Foundation',
      description: '',
      category: 'Emotional',
      questions: [
        // Section 1: Attachment & Security
        // { text: 'In life, what matters most to me:', type: 'single', options: ['Personal growth and self-improvement', 'Close relationships and family', 'Making a difference in the world', 'Enjoying life and having fun', 'Security and stability'], required: true, order: 1, section: 'Core Values & Life Priorities', sectionDescription: null, reversed: false, critical: false, conditional: null },

        // Section 2: Temperament & Personality
        // { text: 'In life, what matters most to me:', type: 'single', options: ['Personal growth and self-improvement', 'Close relationships and family', 'Making a difference in the world', 'Enjoying life and having fun', 'Security and stability'], required: true, order: 1, section: 'Core Values & Life Priorities', sectionDescription: null, reversed: false, critical: false, conditional: null },
      ],
    },

    // ============ COMMUNICATION & COMMITMENT (X questions) =============
    // Description:
    {
      type: 'communication',
      title: 'Communication and Commitment',
      description: '',
      category: 'Communication',
      questions: [
        // Section 1: Communication & Conflict
        // { text: 'I am curious about many different things and enjoy exploring new ideas.', type: 'likert', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], required: true, order: 1, section: 'PERSONALITY (Big Five)', sectionDescription: 'Questions 1-10', reversed: false, critical: false, conditional: null },

        // Section 2: Commitment & Investment
        // { text: 'Which one matters MOST to you in your life?', type: 'single', options: ['Personal achievement and career success', 'Family relationships and close connections', 'Financial security and stability', 'Adventure and new experiences', 'Helping others and making a difference'], required: true, order: 11, section: 'CORE VALUES & LIFE PRIORITIES', sectionDescription: 'Questions 11-18', reversed: false, critical: false, conditional: null },
      ],
    },

    // =============== PASSION & PARTNERSHIP (18 questions) ===============
    // Description:
    {
      type: 'passion',
      title: 'Passion and Partnership',
      description: '',
      category: 'Passion',
      questions: [
        // Section 1: Intimacy & Affection
        // { text: 'When something is bothering me in a relationship, I typically:', type: 'single', options: ['Bring it up directly as soon as I notice', 'Wait for the right moment, then raise it calmly', 'Drop hints and hope my partner picks up on it', 'Keep it to myself unless it becomes a big issue', 'Vent to a friend first, then decide whether to bring it up'], required: true, order: 1, section: 'Communication Style', sectionDescription: 'How you express yourself', reversed: false, critical: false, conditional: null },

        // Section 2: Appreciation & Friendship
        // { text: 'During an argument with my partner, I tend to:', type: 'single', options: ['Stay engaged and want to resolve it right now', 'Stay calm and try to find a compromise', 'Get emotional or raise my voice, then calm down', 'Shut down and need space before I can talk', 'Avoid the argument entirely if possible'], required: true, order: 6, section: 'Conflict & Disagreements', sectionDescription: 'How you navigate friction', reversed: false, critical: false, conditional: null },
      ],
    },
  ];
}

module.exports = { getQuestionnaireTemplates };
