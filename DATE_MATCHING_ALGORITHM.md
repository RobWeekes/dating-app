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

Complementarity captures dimensions where **fit is not based on similarity**, but on how two people’s tendencies interact to create balance, polarity, or strain. Unlike similarity (distance minimization), complementarity uses **shape functions** that reward _asymmetry within bounds_ and penalize extremes.

### Core Complementarity Dimensions (High Priority)

#### 1) Emotional Regulation Style (Self ↔ Co-regulation)

- **Definition:** Preference for handling stress internally vs leaning on a partner
- **Why complementarity matters:**
  - Two high co-regulators → emotional overload / dependency
  - Two high self-regulators → emotional distance
  - Balanced pairing → stability (one can anchor while the other engages)

##### Scoring Function

Let values be normalized in [0,1], where 0 = self-regulation, 1 = co-regulation

```
f(A,B) = 1 - |(A + B)/2 - target|
```

Where target ≈ 0.5 (balanced midpoint)

Optional asymmetry bonus:

```
bonus = k * |A - B|
```

Final:

```
Score = w * (f(A,B) + bonus - extreme_penalty)
```

Penalty if both > 0.85 or both < 0.15

---

#### 2) Assertiveness vs Agreeableness Balance

- **Definition:** Tendency to push vs accommodate in interpersonal situations
- **Why complementarity matters:**
  - High + High → power struggles
  - Low + Low → avoidance / unmet needs
  - Moderate asymmetry → functional polarity

##### Scoring Logic

Ideal zone:

- One partner slightly more assertive (0.6–0.8)
- Other slightly more agreeable (0.2–0.4)

```
f(A,B) = exp(-((A - (1-B))^2)/σ)
```

This rewards mirrored balance (A ≈ 1 - B)

Penalty:

```
if A > 0.8 and B > 0.8: strong penalty
if A < 0.2 and B < 0.2: moderate penalty
```

---

#### 3) Closeness–Autonomy Preference (with Tolerance)

- **Definition:** Desired level of emotional/physical closeness
- **Key insight:** Raw difference is not enough—**tolerance bandwidth** matters

Each user has:

- preference P
- tolerance T (how much mismatch they can handle)

##### Scoring Function

```
delta = |P_A - P_B|
allowed = (T_A + T_B)/2

if delta <= allowed:
    Score = high
else:
    Score = exp(-(delta - allowed))
```

This avoids over-penalizing compatible-but-flexible users.

---

#### 4) Effort & Investment Norms

- **Definition:** Expected amount of work a relationship should require
- **Why complementarity matters:**
  - High + Low mismatch → resentment asymmetry
  - Slight asymmetry can work if aligned with roles

##### Scoring

Primarily similarity-based but with asymmetry tolerance:

```
f(A,B) = 1 - |A - B|

if |A - B| < threshold:
    slight bonus
else:
    increasing penalty
```

Optional interaction:

- High effort + high conscientiousness partner → stabilizing

---

#### 5) Emotional Intensity vs Stability Pairing

- **Definition:** Baseline emotional volatility vs steadiness
- **Why complementarity matters:**
  - Two high-intensity → chaos
  - Two low-intensity → flat / disengaged
  - Mixed → one stabilizes, one energizes

##### Scoring

Let E = emotional intensity (inverse of stability)

```
f(A,B) = 1 - |(E_A + E_B)/2 - 0.5|
```

Penalty:

```
if E_A > 0.8 and E_B > 0.8: strong penalty
```

---

### Secondary Complementarity Dimensions

#### 6) Planning vs Spontaneity

- Moderate asymmetry beneficial
- Extreme mismatch → friction in daily life

#### 7) Social Energy (Introversion ↔ Extroversion)

- Works with partial complementarity
- Requires alignment in lifestyle contexts

---

## General Complementarity Design Pattern

Most complementarity functions follow:

```
Score = w * (
  balance_term
+ asymmetry_bonus
- extreme_penalty
)
```

Where:

- **balance_term** ensures the pair is not collectively skewed
- **asymmetry_bonus** rewards useful differences
- **extreme_penalty** prevents unstable pairings

---

## Implementation Notes

- Normalize all complementarity outputs to [0,1]
- Keep weights lower than hard risk penalties
- Use smooth (differentiable) functions for optimization
- Validate with real interaction data (message patterns, retention)

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
