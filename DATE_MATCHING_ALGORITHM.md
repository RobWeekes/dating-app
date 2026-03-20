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

---

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

This layer enforces **non-negotiable compatibility constraints** and optionally rewards strong alignment. These constraints operate differently from similarity and complementarity—they are about **feasibility**, not optimization.

---

### Hard Filters (Pre-Scoring Exclusion)

These are binary or near-binary constraints that determine whether a match should be considered at all.

#### Common Hard Filters

- **Relationship Intent Mismatch** (e.g., casual vs marriage)
- **Location Incompatibility** (distance beyond acceptable range)
- **Life Goals Misalignment** (e.g., children, lifestyle constraints)

#### Implementation (Vectorized)

Hard filters can be implemented within the same vector framework using **constraint masks**:

```
F_i(A,B) = 1 if compatible
F_i(A,B) = 0 if incompatible
```

Overall feasibility:

```
Feasibility = Π F_i(A,B)
```

If any constraint = 0 → match is excluded before scoring.

---

### Softening Hard Filters (Scalable Relaxation)

Strict exclusion can reduce match pool size at scale. Instead, convert some filters into **soft constraints**:

```
F_i(A,B) = exp(-k * mismatch)
```

Examples:

#### Location (continuous)

```
d = geographic_distance(A,B)
F_location = exp(-k * d)
```

Allows:

- Nearby → ~1
- Far away → smoothly decays instead of hard cutoff

#### Life Goals (categorical embedding)

Encode goals as vectors and compute:

```
F_goals = cosine_similarity(G_A, G_B)
```

---

### Hybrid Approach (Recommended)

Split constraints into tiers:

#### Tier 1: True Hard Filters (non-negotiable)

- Relationship intent (if strongly incompatible)
- Critical life goals (e.g., wants kids vs never)

#### Tier 2: Soft Constraints

- Location radius
- Lifestyle preferences
- Timeline differences

---

### Constraint Integration into Scoring

Instead of separate stages, constraints can be integrated directly:

```
Match Score = Feasibility * BaseScore
```

Where:

- Feasibility = product of constraint functions (0–1)
- BaseScore = similarity + complementarity − penalties

This allows:

- Full exclusion (Feasibility = 0)
- Gradual downranking (0 < Feasibility < 1)

---

### Optional Constraint Bonuses

Strong alignment on key constraints can be rewarded:

```
Bonus += w * indicator(strong_alignment)
```

Examples:

- Same long-term goals + timeline → bonus
- Same location + high flexibility → bonus

---

### Embedding-Based Constraints (Advanced / Scalable)

For large-scale systems, constraints can be embedded into the same vector space:

- Encode categorical attributes (intent, goals) as vectors
- Learn embeddings from user behavior (matches, conversations, outcomes)

Then:

```
F(A,B) = sigmoid( dot(E_A, E_B) )
```

Advantages:

- Fully vectorized
- Learns implicit compatibility beyond explicit rules
- Scales efficiently with ANN (Approximate Nearest Neighbor) search

---

### Practical Tradeoffs

| Approach           | Pros                 | Cons                  |
| ------------------ | -------------------- | --------------------- |
| Hard filters       | Clean, interpretable | Reduces match pool    |
| Soft constraints   | Flexible, scalable   | May allow bad matches |
| Hybrid             | Best balance         | More complex tuning   |
| Learned embeddings | Highly scalable      | Less interpretable    |

---

### Key Design Principle

Treat constraints as **probabilistic feasibility gates**, not just binary switches. This allows:

- Better scalability
- More diverse matches
- Graceful degradation instead of hard rejection

---

## Weighting Strategy

### Initial Weights (heuristic)

- Core relational: high weight
- Conflict & repair: very high weight
- Values alignment: high weight
- Personality: moderate weight

### Optimization

Weights should be learned and continuously refined using real-world behavioral and outcome data:

- **Conversation quality metrics** (length, reciprocity, sentiment)
- **Reply rates / ghosting rates**
- **Date conversion rates** (matches → real-world meetings)
- **Short-term retention** (continued engagement between matched users)
- **Long-term outcomes** (relationship formation, duration, reported satisfaction)

#### Learning Methods

- Gradient-based optimization on match success labels
- Multi-armed bandit approaches for online weight tuning
- Reinforcement learning from delayed outcomes (e.g., relationship success signals)

---

## Normalization & Scaling

To ensure comparability across dimensions:

- Normalize all indices to a common range (e.g., [0,1])
- Apply **z-score normalization** for population-relative positioning
- Use **clipping** to reduce the influence of extreme outliers

```
x_normalized = (x - mean) / std
```

Optional:

- Apply nonlinear transforms (e.g., sigmoid) to compress extremes

---

## Candidate Generation (Scalable Retrieval Layer)

Before full scoring, reduce the search space using **Approximate Nearest Neighbor (ANN)** methods.

### Steps

1. **Pre-filter candidates** using hard/soft constraints
2. **Embed users into vector space** (subset of key dimensions)
3. Retrieve top-K nearest candidates using ANN (e.g., FAISS, ScaNN)
4. Apply full scoring pipeline on reduced candidate set

### Benefits

- Reduces computational cost from O(N²)
- Enables real-time matching at scale

---

## Cold Start Strategy

For new users with limited data:

- Initialize vectors using questionnaire responses
- Use **population priors** for missing dimensions
- Infer traits from early behavioral signals:
  - Messaging latency
  - Message length and tone
  - Response consistency

Gradually update vector as more data is observed.

---

## Dynamic Updating

User vectors should evolve over time:

```
U_t+1 = (1 - α) * U_t + α * NewSignal
```

Where:

- α = learning rate (decay factor)
- NewSignal = inferred trait updates from behavior

---

## Interaction Feedback Loop

Incorporate feedback from matches:

- Explicit feedback (likes, ratings)
- Implicit feedback (conversation continuation, unmatching)

Update:

- Feature weights
- Interaction penalties
- Constraint thresholds

---

## Evaluation Metrics

### Offline Metrics

- AUC / ROC for match success prediction
- Precision@K for top matches

### Online Metrics

- Match acceptance rate
- Conversation start rate
- Conversation depth (messages per match)
- Date conversion rate
- Retention (7-day, 30-day)

---

## Fairness & Bias Considerations

- Monitor for demographic bias in matching outcomes
- Avoid reinforcing popularity loops (rich-get-richer dynamics)
- Introduce exploration mechanisms to surface diverse candidates

---

## Exploration vs Exploitation

Use a hybrid strategy:

- **Exploitation:** show high-scoring matches
- **Exploration:** inject some diverse / lower-confidence matches

Example:

```
FinalCandidates = 0.8 * TopMatches + 0.2 * ExploratoryMatches
```

---

## System Architecture Overview

1. User completes questionnaire → initial vector
2. Constraints applied → feasible candidate pool
3. ANN retrieval → top-K candidates
4. Full scoring:
   - Similarity
   - Complementarity
   - Risk penalties
   - Constraints

5. Ranking + diversity injection
6. Feedback loop updates system

---

## Key Design Principles (Extended)

1. Optimize for **long-term relationship success**, not just engagement
2. Explicitly model **interaction effects**, not just individual traits
3. Use **forced-choice inputs** to reduce bias
4. Combine **hard constraints + soft scoring**
5. Continuously learn from behavioral data
6. Balance **precision with exploration**

---

## Summary

This extended system provides:

- A fully vectorized representation of users
- Scalable candidate retrieval
- Multi-layered scoring (similarity, complementarity, risk)
- Constraint-aware filtering
- Continuous learning and optimization

Result: a robust, scalable matching engine capable of improving over time and aligning users not just on attraction—but on compatibility and long-term success.
