# Dating App Matching Scoring Algorithm

## Overview

This document outlines a scalable, vectorized scoring system for matching users based on psychological compatibility, behavioral tendencies, and long-term relationship predictors. The system is designed to:

- Maximize relationship satisfaction and stability
- Minimize high-risk interaction dynamics
- Scale efficiently to millions of users

Each user is represented as a multidimensional vector of standardized indices derived from forced-choice questionnaire responses.

---

## Index List (Unified)

### Core Relational Dynamics

1. Attachment Anxiety (pursuit tendency)
2. Attachment Avoidance (withdrawal tendency)
3. Responsiveness / Partner Orientation
4. Emotional Responsibility (internal vs external attribution)
5. Emotional Regulation Style (self vs co-regulation)

### Conflict & Repair

6. Conflict Repair Ability
7. Negative Conflict Style (criticism, defensiveness, contempt, stonewalling)

### Compatibility & Friction

8. Closeness–Autonomy Preference
9. Effort & Investment Norms
10. Communication Directness
11. Mind-Reading Expectation
12. Jealousy / Threat Sensitivity

### Values & Life Alignment

13. Long-Term Orientation (casual → marriage)
14. Life Structure Alignment (kids, lifestyle, geography)
15. Risk & Novelty Preference

### Personality & Stability

16. Emotional Stability (neuroticism)
17. Conscientiousness / Reliability
18. Agreeableness vs Assertiveness Balance

---

## Vector Representation

Each user is encoded as:

```
U = [x1, x2, ..., x18]
```

Where each dimension is normalized to a continuous range (e.g., 0–1 or -1 to 1).

---

## Scoring Architecture

Total Match Score is composed of four components:

```
Match Score = (Similarity Score)
            + (Complementarity Score)
            - (Risk Penalty)
            + (Constraint Bonus)
```

---

## 1. Similarity Score

Used for dimensions where alignment improves outcomes.

### Applicable Dimensions

- Long-Term Orientation
- Life Structure Alignment
- Communication Directness
- Effort & Investment Norms
- Risk & Novelty Preference

### Formula

```
Similarity = Σ w_i * (1 - |A_i - B_i|)
```

Where:

- A_i, B_i are user values
- w_i is weight per dimension

---

## 2. Complementarity Score

Used where differences can create balance rather than conflict.

### Applicable Dimensions

- Emotional Regulation Style
- Agreeableness vs Assertiveness

### Example Logic

```
Complementarity = w * f(A_i, B_i)
```

Where f rewards balanced pairings (e.g., one slightly higher, one slightly lower) but penalizes extremes.

Example:

- High assertiveness + low assertiveness → positive
- High + high → conflict risk
- Low + low → stagnation risk

---

## 3. Risk Penalty (Critical)

Nonlinear penalties for known toxic interaction patterns.

### Key Interaction Risks

#### a) Anxious × Avoidant Loop

```
Penalty += w * (Anxiety_A * Avoidance_B + Anxiety_B * Avoidance_A)
```

#### b) High Jealousy × High Independence

```
Penalty += w * (Jealousy_A * Autonomy_B + Jealousy_B * Autonomy_A)
```

#### c) Low Repair × High Conflict Style

```
Penalty += w * ((1 - Repair_A) * Conflict_B + (1 - Repair_B) * Conflict_A)
```

#### d) High Mind-Reading Expectation × Low Communication

```
Penalty += w * (MindRead_A * (1 - Comm_B) + MindRead_B * (1 - Comm_A))
```

#### e) Contempt Amplification

If Negative Conflict Style exceeds threshold:

```
Penalty += large_constant
```

---

## 4. Constraint Bonus / Filters

Hard filters applied before scoring:

- Relationship intent mismatch → exclude
- Location incompatibility → exclude or penalize
- Life goals mismatch (e.g., children) → exclude

Optional soft bonuses for strong alignment.

---

## Weighting Strategy

### Initial Weights (heuristic)

- Core relational: high weight
- Conflict & repair: very high weight
- Values alignment: high weight
- Personality: moderate weight

### Optimization

Weights should be learned via:

- A/B testing
- Outcome tracking (conversation length, dates, relationship formation)
- Long-term retention and satisfaction signals

---

## Normalization & Scaling

- Normalize all indices to comparable ranges
- Apply z-score or min-max scaling
- Clip extreme values to reduce outlier dominance

---

## Cold Start Strategy

- Use population priors
- Infer traits from early behavior (messaging style, response latency)
- Update vector dynamically as more data is collected

---

## Continuous Learning

Update model using:

- Match success feedback
- Conversation quality metrics
- Relationship duration (if available)

Incorporate into:

- Weight updates
- New interaction penalties
- Feature refinement

---

## Key Design Principles

1. Avoid purely similarity-based matching
2. Model interaction effects explicitly
3. Penalize known toxic pairings
4. Use forced-choice inputs to reduce bias
5. Optimize for long-term outcomes, not just engagement

---

## Summary

This system combines:

- Individual trait scoring (vectorization)
- Pairwise interaction modeling
- Nonlinear risk penalties

Result: a scalable, high-signal compatibility engine designed to predict not just attraction—but relationship success.
