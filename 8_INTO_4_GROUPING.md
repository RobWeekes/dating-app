# Consolidating 8 Questionnaires into 4

**Based on:** DEEP_RESEARCH.md (The Science of Romantic Compatibility, Relationship Satisfaction, and Marriage Longevity)

---

## Completion Arc Summary

| Order | Questionnaire | Total Qs | Tone | Difficulty | Why |
|-------|---|---|---|---|---|
| **1** | Values & Lifestyle | 44 | Practical | Low | Dealbreaker screening; momentum builder |
| **2** | Emotional Foundation | 40 | Self-reflective | Medium | Establishes baseline; transition to depth |
| **3** | Communication & Commitment | 40 | Behavioral | Medium-High | Scenario-based; requires thought |
| **4** | Passion & Partnership | 40 | Intimate | Medium | Rewarding close; requires full trust |

**Strategic Benefits of This Order**

1. **Efficient filtering** — dealbreakers identified early, before emotional investment
2. **Cognitive progression** — easy → moderate → moderately complex → intimate
3. **Engagement curve** — starts fun/practical, builds to meaningful, ends rewarding
4. **Trust buildin**g — demonstrates psychology-based approach before asking vulnerable questions
5. **Abandonment prevention** — hardest questions come when user is most invested
6. **Data quality** — by final section, user understands context and answers more truthfully
7. **Matching readiness** — app can start preliminary matching after Q1+Q3, then refine with Q2+Q4

---

## 4 Questionnaire Groups

### **Group 1: Values & Lifestyle Compatibility**
**Combines:** Values & Life Goals + Lifestyle Compatibility & Equity

**Why together?**
- **Values** shape major life decisions; **lifestyle** is how you actually *live* daily
- Both are **dealbreaker zones:** religion, children, money, location, substance use, work-life balance, fairness
- Strong assortative mating on values (politics r = 0.58); values create perpetual problems if mismatched
- **Equity & fairness** breed satisfaction; inequity is especially toxic during high-stress periods (parenthood, career transitions)
- Together they identify mismatches in: financial orientation, gender roles, parenting philosophy, substance use, social energy, geographic rootedness
- **Research weight:** VERY HIGH/LOW for initial compatibility; HIGH/VERY HIGH for long-term (especially post-cohabitation and after children)

---

### **Group 2: Emotional Foundation**
**Combines:** Attachment & Emotional Security + Emotional Regulation & Personality

**Why together?**
- Both measure the foundational **emotional stability & competence** that predicts all relationship outcomes
- **Attachment patterns** (secure/anxious/avoidant) determine how someone expresses emotions and handles stress
- **Emotional regulation & low neuroticism** (r = −0.24, strongest personality-satisfaction link) determine stress reactivity
- Together they measure: stress response, self-soothing capacity, ability to handle partner distress, anxiety/rumination patterns
- **Research weight:** HIGH for initial compatibility, HIGH for long-term (stress amplifies vulnerabilities per VSA model)

---

### **Group 3: Communication & Commitment**
**Combines:** Communication & Conflict Management + Commitment & Investment Orientation

**Why together?**
- **Communication** is the mechanism; **commitment** is the intention behind staying
- Both predict: repair behavior, willingness to work through problems, ability to de-escalate
- **Critical insight from Gottman:** Four Horsemen (criticism, contempt, defensiveness, stonewalling) are early predictors of dissolution — both questionnaires identify these patterns
- **Key finding:** Perceived partner commitment is the #1 predictor of satisfaction (Joel & Eastwick, 2020) — closely linked to *how* partners communicate commitment
- Together they answer: "Will this person fight for the relationship when things are hard?"
- **Research weight:** MODERATE/HIGH initially, but VERY HIGH long-term (communication patterns mature over time; commitment is essential)

---

### **Group 4: Passion & Partnership**
**Combines:** Intimacy, Sexuality & Affection + Friendship, Appreciation & Shared Meaning

**Why together?**
- Both measure the emotional **bonding & "glue"** that sustains relationships
- **Sexual satisfaction** is #3 predictor of relationship quality; **appreciation** is #2 predictor
- Together they address: physical affection, sexual compatibility, turning toward (vs. away), appreciation rituals, friendship depth, "we-ness"
- **Gottman's Sound Relationship House:** fondness/admiration + physical intimacy are the foundation of connection
- Aron's **Self-Expansion Theory:** couples maintain passion through shared novel activities and emotional vulnerability (both measured here)
- Together they answer: "Do we make each other feel wanted, appreciated, and alive?"
- **Research weight:** MODERATE initially, HIGH/VERY HIGH long-term (passion & friendship predict satisfaction trajectories)

---

## Summary Table

| Group | Questionnaire 1 | Questionnaire 2 | Combined Tests | Research Priority |
|-------|---|---|---|---|
| **1** | Attachment (1) | Emotional Regulation (4) | Stress resilience, emotional safety | HIGH/HIGH |
| **2** | Communication (2) | Commitment (5) | Repair patterns, willingness to fight | MOD/VERY HIGH |
| **3** | Values (3) | Lifestyle (7) | Life fit, dealbreaker screening | VERY HIGH/VERY HIGH |
| **4** | Intimacy (6) | Friendship & Meaning (8) | Bonding & appreciation | MOD/VERY HIGH |

---

## Key Strategic Benefits of This Grouping

1. **Balanced distribution** — each group has meaningful psychological coherence
2. **Dealbreaker screening** — Group 3 captures non-negotiable mismatches early
3. **Progression arc** — flows from foundational stability → coordination → alignment → connection
4. **Research alignment** — groups follow the evidence on relationship satisfaction predictors
5. **Reduced fatigue** — 164 questions → ~82 per combined questionnaire (more manageable)

This structure honors the deep research while giving a cleaner user experience.

---

## Implementation Notes

### For Frontend
- **Questionnaire 1 (Emotional Foundation):** 40 questions total
  - Helps assess emotional safety and capacity to handle stress together
  - Critical for identifying anxious/avoidant attachment patterns early

- **Questionnaire 2 (Communication & Commitment):** 40 questions total
  - Assesses repair capacity and dedication
  - Identifies Four Horsemen risk
  - #1 Predictor (perceived commitment) is heavily weighted

- **Questionnaire 3 (Values & Lifestyle):** 44 questions total
  - Dealbreaker identification (children, religion, substance use, location)
  - Life values alignment and daily routine compatibility
  - Most critical for initial matching filters

- **Questionnaire 4 (Passion & Partnership):** 40 questions total
  - Sexual/physical compatibility
  - Appreciation and friendship depth
  - #2 and #3 predictors (appreciation + sexual satisfaction)

### Critical Questions to Weight Heavily
- Attachment: Q1.1, Q1.3, Q1.4, Q1.5, Q1.9, Q1.12, Q1.15, Q1.18, Q1.19 (pursue-withdraw, abandonment fear, secure communication)
- Communication: Q2.1, Q2.2, Q2.3, Q2.7, Q2.11, Q2.12, Q2.13, Q2.16, Q2.19 (Four Horsemen, repair)
- Values: Q3.1, Q3.2, Q3.4, Q3.5, Q3.8, Q3.9, Q3.17, Q3.22 (dealbreaker screening)
- Lifestyle: Q7.3, Q7.4, Q7.5, Q7.6, Q7.11, Q7.14, Q7.17 (equity, substance use, stress response)
- Commitment: Q5.2, Q5.3, Q5.4, Q5.5, Q5.7, Q5.12, Q5.15, Q5.16 (dedication, alternatives, exclusivity)
- Intimacy: Q6.2, Q6.4, Q6.6, Q6.11, Q6.15 (sexual compatibility, communication, exclusivity)
- Appreciation: Q8.1, Q8.2, Q8.5, Q8.8, Q8.9, Q8.10, Q8.12, Q8.15, Q8.18 (appreciation, turning toward, supporting dreams)

### Matching Algorithm Integration
- **Stage 1 (Initial Browse):** Filter on Group 3 dealbreakers (children, monogamy, religion, substance use, location)
- **Stage 2 (Early Interest):** Match on Groups 1 & 3 (emotional safety + values alignment)
- **Stage 3 (Long-term Prediction):** Weight Groups 2, 4, and 7 more heavily (communication, passion, equity)
- **All Stages:** Monitor Group 5 commitment signals and Group 6 sexual compatibility
