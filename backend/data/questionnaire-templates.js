/**
 * Questionnaire Templates
 * Central source of truth for all questionnaire question data.
 * Used by the seed script to populate the database.
 */

function getQuestionnaireTemplates() {
  return [
    // ================= ESSENTIAL QUESTIONNAIRE 2 (31 questions) =================
    // Description: Comprehensive dating questionnaire recovering 22 relationship indices
    // with focus on behavior under stress, emotional regulation, conflict repair,
    // and compatibility. Optimized for matching with high predictive value.
    {
      type: 'essential',
      title: 'Essential Questionnaire 2',
      description: 'Understanding relationship patterns, communication, and compatibility',
      category: 'Essential',
      questions: [
        // ========== SECTION 1: BEHAVIORAL DYNAMICS (7 questions) ==========
        {
          text: 'When I sense my partner pulling away, I tend to:',
          type: 'single',
          options: [
            'Check in and try to understand',
            'Give them space but stay available',
            'Feel like something\'s wrong and react (chase / pull back)'
          ],
          required: true,
          order: 1,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'If my partner needs reassurance, I tend to …',
          type: 'single',
          options: [
            'Offer reassurance even if it takes effort',
            'Feel myself pulling back or getting drained',
            'Get reactive or defensive about it'
          ],
          required: true,
          order: 2,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'When things are stressful or uncertain, my mood usually …',
          type: 'single',
          options: [
            'Tends toward worry, tension, or feeling low',
            'Stays fairly steady',
            'Fluctuates quite a bit'
          ],
          required: true,
          order: 3,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'When I\'m very upset with someone, I tend to …',
          type: 'single',
          options: [
            'Stay engaged and try to work it out',
            'Pull back to settle myself first',
            'React strongly (push, vent, or seek reassurance)'
          ],
          required: true,
          order: 4,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'In a relationship, when I have a strong reaction, I tend to see it as …',
          type: 'single',
          options: [
            'Largely my own interpretation',
            'A mix of my perspective and my partner\'s actions',
            'My partner is causing me to feel a certain way'
          ],
          required: true,
          order: 5,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'When I\'m stressed, I usually want my partner to …',
          type: 'single',
          options: [
            'Be present and emotionally supportive',
            'Help me think it through or take action',
            'Give me space or distract me from it'
          ],
          required: true,
          order: 6,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'When I\'m really upset in a relationship, I tend to …',
          type: 'single',
          options: [
            'Notice my reaction and try to understand it',
            'Feel caught between my reaction and what my partner did',
            'Feel like my partner is the cause of it'
          ],
          required: true,
          order: 7,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: true,
          conditional: null
        },

        // ========== SECTION 1B: BEHAVIORAL DYNAMICS CONT. (2 additional questions) ==========
        {
          text: 'When I get emotionally overwhelmed, I usually …',
          type: 'single',
          options: [
            'Take a moment to settle myself before reacting',
            'Try to stay composed, but it\'s hard not to show it',
            'React strongly in the moment and deal with it afterward'
          ],
          required: true,
          order: 8,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'After being hurt in a relationship, I tend to …',
          type: 'single',
          options: [
            'Work through it and stay open',
            'Need time, but can reconnect',
            'Have a hard time seeing things the same way again'
          ],
          required: true,
          order: 9,
          section: 'Behavioral Dynamics',
          sectionDescription: 'How you respond in relationships',
          reversed: false,
          critical: true,
          conditional: null
        },

        // ========== SECTION 2: CONFLICT & REPAIR (4 questions) ==========
        {
          text: 'If there\'s a small disagreement, I usually …',
          type: 'single',
          options: [
            'Stay engaged and address it directly',
            'Take some space before dealing with it',
            'Let it go or distance myself from it'
          ],
          required: true,
          order: 10,
          section: 'Conflict & Repair',
          sectionDescription: 'How you navigate disagreements',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'When tension rises in a disagreement (one of us feels criticized or hurt), I tend to …',
          type: 'single',
          options: [
            'Try to see their view and take responsibility where I can',
            'Explain my side first, then come back to fix things',
            'Get defensive or point out what they did wrong'
          ],
          required: true,
          order: 11,
          section: 'Conflict & Repair',
          sectionDescription: 'How you navigate disagreements',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'After a conflict with a partner, I often …',
          type: 'single',
          options: [
            'Try to make up fairly quickly',
            'Need some time, but come back to it',
            'Step back and wait for them to bring it up'
          ],
          required: true,
          order: 12,
          section: 'Conflict & Repair',
          sectionDescription: 'How you navigate disagreements',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'If things still feel tense after a conflict, I usually …',
          type: 'single',
          options: [
            'Try to smooth things over, even if it\'s a bit uncomfortable',
            'Give it some time, then come back and reconnect',
            'Wait for the tension to pass, or for them to reach out first'
          ],
          required: true,
          order: 13,
          section: 'Conflict & Repair',
          sectionDescription: 'How you navigate disagreements',
          reversed: false,
          critical: true,
          conditional: null
        },

        // ========== SECTION 3: COMPATIBILITY & FRICTION (11 questions) ==========
        {
          text: 'If a partner wants more closeness than I do, I tend to …',
          type: 'single',
          options: [
            'Try to find a middle ground',
            'Go along with it, but feel trapped or annoyed',
            'Start to pull back or see them as too needy'
          ],
          required: true,
          order: 14,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'In a romantic relationship, I want to have …',
          type: 'single',
          options: [
            'A lot of connection and regular closeness',
            'A balance of closeness and independence',
            'Plenty of space and autonomy'
          ],
          required: true,
          order: 15,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'When something concerns me in a relationship, I\'m more likely to …',
          type: 'single',
          options: [
            'Point it out pretty directly',
            'Hint at it and hope it\'s picked up',
            'Wait to see if they notice on their own'
          ],
          required: true,
          order: 16,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'In relationships, I usually feel that a good partner should …',
          type: 'single',
          options: [
            'Understand most needs even if not everything is said',
            'Understand some things, but clear communication still matters',
            'Not be expected to know unless it\'s said directly'
          ],
          required: true,
          order: 17,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'If something about a partner\'s behavior feels ambiguous, I tend to …',
          type: 'single',
          options: [
            'Assume it\'s probably nothing and move on',
            'Notice it and want some clarity',
            'Read into it and feel unsettled'
          ],
          required: true,
          order: 18,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'If a partner suddenly seems less available or attentive than usual, I\'m most likely to …',
          type: 'single',
          options: [
            'Assume something else is probably going on and check in if needed',
            'Notice it and feel unsure until I understand why',
            'Feel unsettled and start wondering what it means about us'
          ],
          required: true,
          order: 19,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'When a relationship matters to me, I\'m more likely to …',
          type: 'single',
          options: [
            'Show it through consistent actions over time',
            'Feel it strongly, even if my actions aren\'t always consistent',
            'Step up in key moments, even if I\'m not steady day-to-day'
          ],
          required: true,
          order: 20,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'When life gets busy or stressful, I usually …',
          type: 'single',
          options: [
            'Keep showing up pretty consistently',
            'Try to stay connected, but I can become less responsive',
            'Focus on what\'s most urgent and circle back later'
          ],
          required: true,
          order: 21,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'When something is important to me in a relationship, I usually …',
          type: 'single',
          options: [
            'Say it clearly, even if it feels a bit uncomfortable',
            'Try to imply it or ease into it',
            'Assume they\'ll pick up on it without me saying much'
          ],
          required: true,
          order: 24,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'After a lot of closeness or time together, I usually …',
          type: 'single',
          options: [
            'Still feel comfortable staying connected',
            'Need a bit of space to recharge',
            'Start to feel overwhelmed or want distance'
          ],
          required: true,
          order: 23,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'In a relationship, when effort starts to feel uneven, I usually …',
          type: 'single',
          options: [
            'Try to match the level of effort I want to see',
            'Notice it, but adjust depending on the situation',
            'Feel frustrated if I\'m not getting the effort I expect'
          ],
          required: true,
          order: 22,
          section: 'Compatibility & Friction',
          sectionDescription: 'Intimacy, connection, and communication patterns',
          reversed: false,
          critical: false,
          conditional: null
        },

        // ========== SECTION 4: VALUES & ALIGNMENT (5 questions) ==========
        {
          text: 'Right now, I\'m dating mainly for …',
          type: 'single',
          options: [
            'Something meaningful and long-term',
            'Openness to either casual or serious, depending on fit',
            'Something more casual or short-term'
          ],
          required: true,
          order: 25,
          section: 'Values & Alignment',
          sectionDescription: 'Life goals, values, and relationship orientation',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'On major life choices (like kids, home base, or lifestyle), I tend to be …',
          type: 'single',
          options: [
            'Pretty clear about what I want',
            'Open, but within some limits',
            'Flexible and still figuring it out'
          ],
          required: true,
          order: 26,
          section: 'Values & Alignment',
          sectionDescription: 'Life goals, values, and relationship orientation',
          reversed: false,
          critical: true,
          conditional: null
        },
        {
          text: 'If someone I really like has a different timeline or level of certainty around major life decisions, I usually …',
          type: 'single',
          options: [
            'Need strong alignment fairly early to feel good about continuing',
            'Can keep exploring if the mismatch doesn\'t seem too big',
            'Am comfortable letting it stay open for quite a while'
          ],
          required: true,
          order: 29,
          section: 'Values & Alignment',
          sectionDescription: 'Life goals, values, and relationship orientation',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'In a long-term relationship, I usually want life to feel more …',
          type: 'single',
          options: [
            'Grounded and predictable',
            'Balanced between routine and novelty',
            'Fresh, stimulating, and changing'
          ],
          required: true,
          order: 28,
          section: 'Values & Alignment',
          sectionDescription: 'Life goals, values, and relationship orientation',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'After a relationship settles into a routine, I usually …',
          type: 'single',
          options: [
            'Like the steadiness and don\'t need much change',
            'Like some routine, but need occasional new experiences mixed in',
            'Start wanting more change, spontaneity, or intensity'
          ],
          required: true,
          order: 27,
          section: 'Values & Alignment',
          sectionDescription: 'Life goals, values, and relationship orientation',
          reversed: false,
          critical: false,
          conditional: null
        },

        // ========== SECTION 5: PERSONALITY & STABILITY (2 questions) ==========
        {
          text: 'People close to me would likely say I\'m …',
          type: 'single',
          options: [
            'Dependable and consistent',
            'Warm but a little unpredictable',
            'More spontaneous than consistent'
          ],
          required: true,
          order: 30,
          section: 'Personality & Stability',
          sectionDescription: 'How others perceive you',
          reversed: false,
          critical: false,
          conditional: null
        },
        {
          text: 'In close relationships, I tend to …',
          type: 'single',
          options: [
            'Say what I need while trying to keep things respectful',
            'Keep the peace even if I hold things in',
            'Push my point even if it creates tension'
          ],
          required: true,
          order: 31,
          section: 'Personality & Stability',
          sectionDescription: 'How others perceive you',
          reversed: false,
          critical: false,
          conditional: null
        },
      ],
    },
  ];
}

module.exports = { getQuestionnaireTemplates };
