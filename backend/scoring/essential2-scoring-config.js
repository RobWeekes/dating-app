/**
 * Essential Questionnaire 2 - Scoring Configuration
 *
 * Maps 29 questions to 20 relationship compatibility indices.
 * Each question contribution is weighted by the formula:
 *   index_score = sigmoid(Σ(weight_i * response_delta_i))
 *
 * Indices (20 total):
 *   1. AA  - Attachment Anxiety
 *   2. AV  - Attachment Avoidance
 *   3. ER  - Emotional Regulation
 *   4. RS  - Responsiveness
 *   5. ER2 - Emotional Responsibility
 *   6. CE  - Conflict Engagement
 *   7. CR  - Conflict Repair Ability
 *   8. NC  - Negative Conflict Style
 *   9. CA  - Closeness–Autonomy Preference
 *  10. CT  - Closeness Tolerance
 *  11. CD  - Communication Directness
 *  12. MR  - Mind-Reading Expectation
 *  13. JS  - Jealousy / Threat Sensitivity
 *  14. EN  - Effort & Investment Norms
 *  15. LT  - Long-Term Orientation
 *  16. LS  - Life Structure Alignment
 *  17. NS  - Novelty vs Stability Preference
 *  18. ES  - Emotional Stability
 *  19. CO  - Conscientiousness / Reliability
 *  20. AG  - Assertiveness–Agreeableness Balance
 */

const INDICES = {
  AA: { id: 'AA', name: 'Attachment Anxiety', weight: 'critical' },
  AV: { id: 'AV', name: 'Attachment Avoidance', weight: 'critical' },
  ER: { id: 'ER', name: 'Emotional Regulation', weight: 'critical' },
  RS: { id: 'RS', name: 'Responsiveness', weight: 'high' },
  ER2: { id: 'ER2', name: 'Emotional Responsibility', weight: 'high' },
  CE: { id: 'CE', name: 'Conflict Engagement', weight: 'critical' },
  CR: { id: 'CR', name: 'Conflict Repair Ability', weight: 'critical' },
  NC: { id: 'NC', name: 'Negative Conflict Style', weight: 'critical' },
  CA: { id: 'CA', name: 'Closeness–Autonomy Preference', weight: 'high' },
  CT: { id: 'CT', name: 'Closeness Tolerance', weight: 'high' },
  CD: { id: 'CD', name: 'Communication Directness', weight: 'high' },
  MR: { id: 'MR', name: 'Mind-Reading Expectation', weight: 'high' },
  JS: { id: 'JS', name: 'Jealousy / Threat Sensitivity', weight: 'high' },
  EN: { id: 'EN', name: 'Effort & Investment Norms', weight: 'high' },
  LT: { id: 'LT', name: 'Long-Term Orientation', weight: 'critical' },
  LS: { id: 'LS', name: 'Life Structure Alignment', weight: 'critical' },
  NS: { id: 'NS', name: 'Novelty vs Stability Preference', weight: 'high' },
  ES: { id: 'ES', name: 'Emotional Stability', weight: 'critical' },
  CO: { id: 'CO', name: 'Conscientiousness / Reliability', weight: 'high' },
  AG: { id: 'AG', name: 'Assertiveness–Agreeableness Balance', weight: 'high' }
};

/**
 * Question-to-Index Mapping
 * Each question maps to one or more indices with contribution weights
 *
 * Weight meanings:
 *   - strong (1.0): primary source for this index
 *   - medium (0.6): secondary signal, useful but not primary
 *   - weak (0.3): tertiary signal for multi-index questions
 */
const QUESTION_INDEX_MAPPINGS = {
  // ========== SECTION 1: BEHAVIORAL DYNAMICS (7 questions) ==========

  1: {
    text: 'When I sense my partner pulling away, I tend to:',
    section: 'Behavioral Dynamics',
    critical: true,
    indices: {
      AA: { weight: 'strong', direction: 1 }, // Q1.1 C = high AA
      AV: { weight: 'strong', direction: 1 }, // Q1.1 B = high AV
      ER: { weight: 'medium', direction: 1 }, // Regulation under stress
      CE: { weight: 'medium', direction: 1 }  // Engagement tendency
    },
    responseMapping: {
      // Option A (Check in and try to understand) → secure attachment
      'Check in and try to understand': { AA: -0.4, AV: -0.4, ER: 0.3, CE: 0.2 },
      // Option B (Give them space but stay available) → balanced avoidance
      'Give them space but stay available': { AA: -0.2, AV: 0.2, ER: 0.1, CE: -0.1 },
      // Option C (Feel like something's wrong and react) → anxious/negative
      'Feel like something\'s wrong and react (chase / pull back)': { AA: 0.5, AV: 0.3, ER: -0.3, CE: 0.3 }
    }
  },

  2: {
    text: 'If my partner needs reassurance, I tend to …',
    section: 'Behavioral Dynamics',
    critical: false,
    indices: {
      AA: { weight: 'weak', direction: 1 },
      AV: { weight: 'strong', direction: 1 },
      RS: { weight: 'strong', direction: 1 },
      NC: { weight: 'medium', direction: 1 },
      EN: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Offer reassurance even if it takes effort': { AA: -0.3, AV: -0.4, RS: 0.5, NC: -0.2, EN: 0.3 },
      'Feel myself pulling back or getting drained': { AA: 0.2, AV: 0.4, RS: -0.3, NC: 0.1, EN: -0.2 },
      'Get reactive or defensive about it': { AA: 0.4, AV: 0.2, RS: -0.4, NC: 0.4, EN: -0.3 }
    }
  },

  3: {
    text: 'When things are stressful or uncertain, my mood usually …',
    section: 'Behavioral Dynamics',
    critical: true,
    indices: {
      ER: { weight: 'strong', direction: 1 },
      ES: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Tends toward worry, tension, or feeling low': { ER: -0.5, ES: -0.5 },
      'Stays fairly steady': { ER: 0.5, ES: 0.5 },
      'Fluctuates quite a bit': { ER: 0.0, ES: -0.3 }
    }
  },

  4: {
    text: 'When I\'m very upset with someone, I tend to …',
    section: 'Behavioral Dynamics',
    critical: true,
    indices: {
      AA: { weight: 'strong', direction: 1 },
      AV: { weight: 'strong', direction: 1 },
      ER: { weight: 'strong', direction: 1 },
      CE: { weight: 'medium', direction: 1 },
      NC: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Stay engaged and try to work it out': { AA: -0.3, AV: -0.4, ER: 0.4, CE: 0.3, NC: -0.4 },
      'Pull back to settle myself first': { AA: 0.1, AV: 0.3, ER: 0.2, CE: -0.2, NC: -0.1 },
      'React strongly (push, vent, or seek reassurance)': { AA: 0.5, AV: -0.2, ER: -0.4, CE: 0.2, NC: 0.5 }
    }
  },

  5: {
    text: 'In a relationship, when I have a strong reaction, I tend to see it as …',
    section: 'Behavioral Dynamics',
    critical: false,
    indices: {
      ER2: { weight: 'strong', direction: 1 },
      NC: { weight: 'medium', direction: 1 },
      AG: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Largely my own interpretation': { ER2: 0.4, NC: -0.3, AG: 0.2 },
      'A mix of my perspective and my partner\'s actions': { ER2: 0.2, NC: 0.0, AG: 0.1 },
      'My partner is causing me to feel a certain way': { ER2: -0.5, NC: 0.4, AG: -0.3 }
    }
  },

  6: {
    text: 'When I\'m stressed, I usually want my partner to …',
    section: 'Behavioral Dynamics',
    critical: false,
    indices: {
      AV: { weight: 'strong', direction: 1 },
      ER: { weight: 'medium', direction: 1 },
      RS: { weight: 'medium', direction: 1 },
      CA: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Be present and emotionally supportive': { AV: -0.4, ER: 0.2, RS: 0.3, CA: 0.2 },
      'Help me think it through or take action': { AV: -0.1, ER: 0.1, RS: 0.2, CA: -0.2 },
      'Give me space or distract me from it': { AV: 0.4, ER: -0.1, RS: -0.2, CA: -0.3 }
    }
  },

  7: {
    text: 'When I\'m really upset in a relationship, I tend to …',
    section: 'Behavioral Dynamics',
    critical: true,
    indices: {
      ER2: { weight: 'strong', direction: 1 },
      NC: { weight: 'medium', direction: 1 },
      ER: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Notice my reaction and try to understand it': { ER2: 0.5, NC: -0.3, ER: 0.3 },
      'Feel caught between my reaction and what my partner did': { ER2: 0.2, NC: 0.1, ER: 0.0 },
      'Feel like my partner is the cause of it': { ER2: -0.5, NC: 0.4, ER: -0.2 }
    }
  },

  // ========== SECTION 2: CONFLICT & REPAIR (4 questions) ==========

  8: {
    text: 'If there\'s a small disagreement, I usually …',
    section: 'Conflict & Repair',
    critical: true,
    indices: {
      AV: { weight: 'strong', direction: 1 },
      CE: { weight: 'strong', direction: 1 },
      ER: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Stay engaged and address it directly': { AV: -0.4, CE: 0.4, ER: 0.2 },
      'Take some space before dealing with it': { AV: 0.2, CE: 0.0, ER: 0.1 },
      'Let it go or distance myself from it': { AV: 0.5, CE: -0.4, ER: 0.0 }
    }
  },

  9: {
    text: 'When tension rises in a disagreement (one of us feels criticized or hurt), I tend to …',
    section: 'Conflict & Repair',
    critical: true,
    indices: {
      CR: { weight: 'strong', direction: 1 },
      NC: { weight: 'strong', direction: 1 },
      ER2: { weight: 'strong', direction: 1 },
      AG: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Try to see their view and take responsibility where I can': { CR: 0.5, NC: -0.4, ER2: 0.5, AG: 0.3 },
      'Explain my side first, then come back to fix things': { CR: 0.2, NC: 0.0, ER2: 0.1, AG: 0.1 },
      'Get defensive or point out what they did wrong': { CR: -0.5, NC: 0.5, ER2: -0.4, AG: -0.3 }
    }
  },

  10: {
    text: 'After a conflict with a partner, I often …',
    section: 'Conflict & Repair',
    critical: true,
    indices: {
      CR: { weight: 'strong', direction: 1 },
      AV: { weight: 'strong', direction: 1 },
      RS: { weight: 'medium', direction: 1 },
      CO: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Try to make up fairly quickly': { CR: 0.5, AV: -0.3, RS: 0.4, CO: 0.3 },
      'Need some time, but come back to it': { CR: 0.3, AV: 0.1, RS: 0.2, CO: 0.2 },
      'Step back and wait for them to bring it up': { CR: -0.4, AV: 0.4, RS: -0.3, CO: -0.2 }
    }
  },

  11: {
    text: 'If things still feel tense after a conflict, I usually …',
    section: 'Conflict & Repair',
    critical: true,
    indices: {
      CR: { weight: 'strong', direction: 1 },
      RS: { weight: 'medium', direction: 1 },
      AV: { weight: 'medium', direction: 1 },
      ER: { weight: 'weak', direction: 1 }
    },
    responseMapping: {
      'Try to smooth things over, even if it\'s a bit uncomfortable': { CR: 0.4, RS: 0.3, AV: -0.2, ER: 0.1 },
      'Give it some time, then come back and reconnect': { CR: 0.3, RS: 0.2, AV: 0.1, ER: 0.2 },
      'Wait for the tension to pass, or for them to reach out first': { CR: -0.3, RS: -0.3, AV: 0.3, ER: -0.1 }
    }
  },

  // ========== SECTION 3: COMPATIBILITY & FRICTION (11 questions) ==========

  12: {
    text: 'If a partner wants more closeness than I do, I tend to …',
    section: 'Compatibility & Friction',
    critical: true,
    indices: {
      AV: { weight: 'strong', direction: 1 },
      CA: { weight: 'strong', direction: 1 },
      CT: { weight: 'strong', direction: 1 },
      EN: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Try to find a middle ground': { AV: -0.3, CA: 0.2, CT: 0.3, EN: 0.3 },
      'Go along with it, but feel trapped or annoyed': { AV: 0.2, CA: -0.2, CT: -0.1, EN: -0.2 },
      'Start to pull back or see them as too needy': { AV: 0.5, CA: -0.4, CT: -0.4, EN: -0.3 }
    }
  },

  13: {
    text: 'In a romantic relationship, I want to have …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      AV: { weight: 'strong', direction: 1 },
      CA: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'A lot of connection and regular closeness': { AV: -0.4, CA: 0.4 },
      'A balance of closeness and independence': { AV: 0.0, CA: 0.0 },
      'Plenty of space and autonomy': { AV: 0.4, CA: -0.4 }
    }
  },

  14: {
    text: 'When something concerns me in a relationship, I\'m more likely to …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      CD: { weight: 'strong', direction: 1 },
      MR: { weight: 'strong', direction: 1 },
      AG: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Point it out pretty directly': { CD: 0.5, MR: -0.4, AG: 0.2 },
      'Hint at it and hope it\'s picked up': { CD: -0.2, MR: 0.3, AG: -0.1 },
      'Wait to see if they notice on their own': { CD: -0.5, MR: 0.5, AG: -0.3 }
    }
  },

  15: {
    text: 'In relationships, I usually feel that a good partner should …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      MR: { weight: 'strong', direction: 1 },
      CD: { weight: 'medium', direction: 1 },
      RS: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Understand most needs even if not everything is said': { MR: 0.5, CD: -0.3, RS: 0.2 },
      'Understand some things, but clear communication still matters': { MR: 0.0, CD: 0.0, RS: 0.0 },
      'Not be expected to know unless it\'s said directly': { MR: -0.5, CD: 0.4, RS: -0.1 }
    }
  },

  16: {
    text: 'If something about a partner\'s behavior feels ambiguous, I tend to …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      AA: { weight: 'strong', direction: 1 },
      JS: { weight: 'strong', direction: 1 },
      ES: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Assume it\'s probably nothing and move on': { AA: -0.4, JS: -0.4, ES: 0.3 },
      'Notice it and want some clarity': { AA: 0.1, JS: 0.2, ES: 0.0 },
      'Read into it and feel unsettled': { AA: 0.5, JS: 0.5, ES: -0.4 }
    }
  },

  17: {
    text: 'If a partner suddenly seems less available or attentive than usual, I\'m most likely to …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      JS: { weight: 'strong', direction: 1 },
      AA: { weight: 'strong', direction: 1 },
      ES: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Assume something else is probably going on and check in if needed': { JS: -0.4, AA: -0.3, ES: 0.3 },
      'Notice it and feel unsure until I understand why': { JS: 0.2, AA: 0.2, ES: 0.0 },
      'Feel unsettled and start wondering what it means about us': { JS: 0.5, AA: 0.5, ES: -0.4 }
    }
  },

  18: {
    text: 'When a relationship matters to me, I\'m more likely to …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      EN: { weight: 'strong', direction: 1 },
      CO: { weight: 'strong', direction: 1 },
      RS: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Show it through consistent actions over time': { EN: 0.4, CO: 0.5, RS: 0.3 },
      'Feel it strongly, even if my actions aren\'t always consistent': { EN: 0.2, CO: -0.2, RS: 0.1 },
      'Step up in key moments, even if I\'m not steady day-to-day': { EN: -0.1, CO: -0.3, RS: 0.1 }
    }
  },

  19: {
    text: 'When life gets busy or stressful, I usually …',
    section: 'Compatibility & Friction',
    critical: true,
    indices: {
      CO: { weight: 'strong', direction: 1 },
      EN: { weight: 'strong', direction: 1 },
      RS: { weight: 'strong', direction: 1 },
      ER: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Keep showing up pretty consistently': { CO: 0.5, EN: 0.4, RS: 0.4, ER: 0.2 },
      'Try to stay connected, but I can become less responsive': { CO: 0.1, EN: 0.0, RS: -0.1, ER: -0.1 },
      'Focus on what\'s most urgent and circle back later': { CO: -0.3, EN: -0.2, RS: -0.4, ER: -0.2 }
    }
  },

  20: {
    text: 'When something is important to me in a relationship, I usually …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      CD: { weight: 'strong', direction: 1 },
      MR: { weight: 'medium', direction: 1 },
      AG: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Say it clearly, even if it feels a bit uncomfortable': { CD: 0.5, MR: -0.3, AG: 0.3 },
      'Try to imply it or ease into it': { CD: -0.2, MR: 0.2, AG: -0.1 },
      'Assume they\'ll pick up on it without me saying much': { CD: -0.5, MR: 0.4, AG: -0.3 }
    }
  },

  21: {
    text: 'After a lot of closeness or time together, I usually …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      AV: { weight: 'strong', direction: 1 },
      CT: { weight: 'strong', direction: 1 },
      ER: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Still feel comfortable staying connected': { AV: -0.4, CT: 0.4, ER: 0.2 },
      'Need a bit of space to recharge': { AV: 0.2, CT: 0.0, ER: 0.0 },
      'Start to feel overwhelmed or want distance': { AV: 0.5, CT: -0.4, ER: -0.2 }
    }
  },

  22: {
    text: 'In a relationship, when effort starts to feel uneven, I usually …',
    section: 'Compatibility & Friction',
    critical: false,
    indices: {
      EN: { weight: 'strong', direction: 1 },
      CO: { weight: 'strong', direction: 1 },
      RS: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Try to match the level of effort I want to see': { EN: 0.3, CO: 0.4, RS: 0.2 },
      'Notice it, but adjust depending on the situation': { EN: 0.1, CO: 0.1, RS: 0.1 },
      'Feel frustrated if I\'m not getting the effort I expect': { EN: -0.3, CO: -0.2, RS: -0.2 }
    }
  },

  // ========== SECTION 4: VALUES & ALIGNMENT (5 questions) ==========

  23: {
    text: 'Right now, I\'m dating mainly for …',
    section: 'Values & Alignment',
    critical: true,
    indices: {
      LT: { weight: 'strong', direction: 1 }
    },
    responseMapping: {
      'Something meaningful and long-term': { LT: 0.5 },
      'Openness to either casual or serious, depending on fit': { LT: 0.0 },
      'Something more casual or short-term': { LT: -0.5 }
    }
  },

  24: {
    text: 'On major life choices (like kids, home base, or lifestyle), I tend to be …',
    section: 'Values & Alignment',
    critical: true,
    indices: {
      LS: { weight: 'strong', direction: 1 },
      LT: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Pretty clear about what I want': { LS: 0.4, LT: 0.2 },
      'Open, but within some limits': { LS: 0.0, LT: 0.0 },
      'Flexible and still figuring it out': { LS: -0.4, LT: -0.1 }
    }
  },

  25: {
    text: 'If someone I really like has a different timeline or level of certainty around major life decisions, I usually …',
    section: 'Values & Alignment',
    critical: false,
    indices: {
      LS: { weight: 'strong', direction: 1 },
      LT: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Need strong alignment fairly early to feel good about continuing': { LS: 0.4, LT: 0.3 },
      'Can keep exploring if the mismatch doesn\'t seem too big': { LS: 0.0, LT: 0.0 },
      'Am comfortable letting it stay open for quite a while': { LS: -0.4, LT: -0.2 }
    }
  },

  26: {
    text: 'In a long-term relationship, I usually want life to feel more …',
    section: 'Values & Alignment',
    critical: false,
    indices: {
      NS: { weight: 'strong', direction: 1 },
      CA: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Grounded and predictable': { NS: -0.4, CA: -0.2 },
      'Balanced between routine and novelty': { NS: 0.0, CA: 0.0 },
      'Fresh, stimulating, and changing': { NS: 0.4, CA: 0.2 }
    }
  },

  27: {
    text: 'After a relationship settles into a routine, I usually …',
    section: 'Values & Alignment',
    critical: false,
    indices: {
      NS: { weight: 'strong', direction: 1 },
      ES: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Like the steadiness and don\'t need much change': { NS: -0.4, ES: 0.2 },
      'Like some routine, but need occasional new experiences mixed in': { NS: 0.0, ES: 0.0 },
      'Start wanting more change, spontaneity, or intensity': { NS: 0.4, ES: -0.1 }
    }
  },

  // ========== SECTION 5: PERSONALITY & STABILITY (2 questions) ==========

  28: {
    text: 'People close to me would likely say I\'m …',
    section: 'Personality & Stability',
    critical: false,
    indices: {
      CO: { weight: 'strong', direction: 1 },
      EN: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Dependable and consistent': { CO: 0.4, EN: 0.3 },
      'Warm but a little unpredictable': { CO: -0.1, EN: 0.0 },
      'More spontaneous than consistent': { CO: -0.4, EN: -0.2 }
    }
  },

  29: {
    text: 'In close relationships, I tend to …',
    section: 'Personality & Stability',
    critical: false,
    indices: {
      AG: { weight: 'strong', direction: 1 },
      CD: { weight: 'medium', direction: 1 },
      NC: { weight: 'medium', direction: 1 }
    },
    responseMapping: {
      'Say what I need while trying to keep things respectful': { AG: 0.4, CD: 0.3, NC: -0.2 },
      'Keep the peace even if I hold things in': { AG: -0.3, CD: -0.2, NC: 0.1 },
      'Push my point even if it creates tension': { AG: 0.2, CD: 0.3, NC: 0.4 }
    }
  }
};

/**
 * Weight Multipliers
 * Convert text weights to numerical values for calculations
 */
const WEIGHT_MULTIPLIERS = {
  strong: 1.0,
  medium: 0.65,
  weak: 0.35
};

/**
 * Index Weight Categories
 * Define the importance of each index for overall compatibility
 */
const INDEX_IMPORTANCE = {
  critical: 1.0,
  high: 0.8,
  medium: 0.6,
  low: 0.4
};

module.exports = {
  INDICES,
  QUESTION_INDEX_MAPPINGS,
  WEIGHT_MULTIPLIERS,
  INDEX_IMPORTANCE
};
