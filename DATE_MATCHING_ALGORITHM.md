# Dating App Matching Scoring Algorithm

## Overview

This document outlines a scalable, vectorized scoring system for matching users based on psychological compatibility, behavioral tendencies, and long-term relationship predictors. The system is designed to:

- Maximize relationship satisfaction and stability
- Minimize high-risk interaction dynamics
- Scale efficiently to millions of users

Each user is represented as a multidimensional vector of standardized indices derived from forced-choice questionnaire responses.

---

Here’s a **clean, consolidated list of the highest-value indices** for predicting dating outcomes (match success, satisfaction, duration, commitment). This is optimized for **signal, orthogonality, and scalability** in a vector system.

---

# 🧠 Core Predictive Indices for Dating & Relationship Success

## Behavioral Dynamics

### 1. Attachment Anxiety (AA)
- Pursuit, reassurance-seeking, abandonment sensitivity  

### 2. Attachment Avoidance (AV)
- Withdrawal, emotional distancing, independence preference  

### 3. Emotional Regulation (ER)
- Stability vs reactivity under stress  

### 4. Responsiveness (RS)
- Turning toward vs away from partner bids  

### 5. Emotional Responsibility (ER2)
- Internal vs external attribution of one’s feelings  

---

## ⚔️ Conflict & Repair (Highest Impact)

### 6. Conflict Engagement (CE)
- Engage vs withdraw during conflict  

### 7. Conflict Repair Ability (CR)
- Ability to de-escalate and reconnect  

### 8. Negative Conflict Style (NC)
- Criticism, defensiveness, contempt, escalation  

---

## ⚖️ Compatibility & Friction

### 9. Closeness–Autonomy Preference (CA)
- Desired level of intimacy vs independence  

### 10. Closeness Tolerance (CT)
- Flexibility around mismatch in closeness  

### 11. Communication Directness (CD)
- Explicit vs implicit communication  

### 12. Mind-Reading Expectation (MR)
- Expectation partner should “just know”  

### 13. Jealousy / Threat Sensitivity (JS)
- Reactivity to ambiguity or perceived distance

### 14. Effort & Investment Norms (EN)
- Expected level of relationship effort 

---

## ❤️ Values & Alignment

### 15. Long-Term Orientation (LT)
- Casual vs serious vs marriage intent  

### 16. Life Structure Alignment (LS)
- Kids, lifestyle, geography, priorities  

### 17. Novelty vs Stability Preference (NS)
- Desire for excitement vs routine  

---

## 🧩 Personality & Stability

### 18. Emotional Stability (ES)
- Baseline mood volatility (inverse neuroticism)  

### 19. Conscientiousness / Reliability (CO)
- Follow-through, consistency  

### 20. Assertiveness–Agreeableness Balance (AG)
- Balance between needs vs harmony  

---

# 🔑 Key Insight

The strongest predictors are not just traits, but **interactions between them**, especially:

- **AA × AV → volatility**
- **NC × low CR → breakup risk**
- **CA mismatch → chronic dissatisfaction**
- **ER × partner reactivity → stabilization vs escalation**

---

* Build a **correlation / redundancy matrix** to ensure your indices stay orthogonal and efficient

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

**Q2.12** When I'm very upset with someone, my impulse is to …

- **Format:** single | **Weight:** critical
- **Options:**
  A) Stay engaged and try to work it out
  B) Pull back to settle myself first
  C) React strongly (push, vent, or seek reassurance)
- **Measures:** regulation strategy; risk behaviors

# Question → Index Mapping (Condensed)

## Question

**When I’m very upset with someone, I tend to…**
A) Stay engaged and try to work it out
B) Pull back to settle myself first
C) Get more reactive (e.g., push, vent, or seek reassurance)

---

## Target Indexes

- **CE**: Conflict Engagement
- **ER**: Emotional Regulation
- **AA**: Attachment Anxiety
- **AV**: Attachment Avoidance
- **NC**: Negative Conflict Style

All indices normalized to **[0,1]**.

---

## Response → Delta Mapping

```python
# Option A — Engage
CE += +0.7; ER += +0.6; AA += -0.2; AV += -0.4; NC += -0.5

# Option B — Withdraw
CE += -0.5; ER += +0.5; AA += -0.3; AV += +0.6; NC += -0.2

# Option C — Reactive
CE += +0.3; ER += -0.7; AA += +0.6; AV += +0.2; NC += +0.8
```

---

## Aggregation

```python
Index_final = Σ (question_weight * response_delta)
Index_score = sigmoid(Index_final)
```

**Suggested weight:** `question_weight ≈ 1.2–1.5`

---

## Disambiguation Rule

```python
if AV high across items:
    pattern = "avoidant"
elif ER high and AV low:
    pattern = "healthy self-regulation"
```

---

## System Impact

- **Complementarity:** AA × AV → penalty; ER can stabilize reactive partner
- **Risk:** High NC + low repair → high risk
- **Similarity:** Engagement style alignment → higher satisfaction

---

# 🧠 Latent Feature: State vs Trait Gap

## Definition

The **state vs trait gap** measures how much a person’s behavior **changes under emotional stress** compared to their **baseline tendencies**.

```python
stress_response_gap = State_response (Q1.4) - Trait_response (Q2.1)
```

* **Q2.1 (Trait)** → how they *usually* handle low-stakes conflict
* **Q1.4 (State)** → how they behave when *emotionally overwhelmed*

---

## 🔍 What the gap represents

### Small gap → **Behavioral consistency**

* Acts similarly in calm and stressful situations
* Predictable, stable partner
* Higher likelihood of **trust + repair success**

---

### Large gap → **Stress-induced divergence**

* Behavior shifts significantly under pressure
* “Different person when upset” effect
* Higher risk of:

  * escalation
  * withdrawal
  * emotional volatility

---

## 📊 Example patterns

### 1. Consistent & secure

* Q2.1 → A (engaged)
* Q1.4 → A (engaged)

👉 Gap ≈ 0 → **stable, reliable conflict behavior**

---

### 2. Regulated but avoidant

* Q2.1 → B (space)
* Q1.4 → B (space)

👉 Gap ≈ 0 → **consistent strategy (low volatility, lower intimacy)**

---

### 3. Escalates under stress

* Q2.1 → A (engaged)
* Q1.4 → C (reactive)

👉 Large gap → **hidden volatility risk**

---

### 4. Shuts down under pressure

* Q2.1 → A (engaged)
* Q1.4 → B or C (withdraw/react)

👉 Moderate–large gap → **breakdown under stress**

---

## ⚙️ How to compute it (practical)

First, encode answers on a consistent scale:

```python
# Example encoding (engagement → withdrawal / reactivity)
A = 0.0   # engaged
B = 0.5   # regulated distance
C = 1.0   # reactive / withdraw
```

Then:

```python
stress_response_gap = abs(Q1_4 - Q2_1)
```

Optional directional split:

```python
escalation_shift = max(0, Q1_4 - Q2_1)
withdrawal_shift = max(0, Q2_1 - Q1_4)
```

---

## 🔗 Why this is a high-value predictor

### 1. Captures **nonlinear risk**

Most models only measure traits. This captures:

* **how traits fail under stress**

👉 That’s where relationships actually break.

---

### 2. Predicts **partner experience**

Large gap → partner experiences:

* inconsistency
* confusion (“which version is real?”)
* reduced trust

---

### 3. Interacts with other indices

```python
Risk += stress_response_gap * (1 - ER)
Risk += stress_response_gap * NC
```

* High gap + low regulation → **explosive**
* High gap + high NC → **toxic conflict cycles**

---

## 🧩 How to use it in matching

### Penalize unstable pairings

```python
if gap_A high and gap_B high:
    Risk += strong_penalty
```

---

### Allow stabilizing matches

```python
if gap_A high and ER_B high:
    partial_buffer
```

---

## ✅ Summary

* **State vs trait gap = consistency under stress**
* Small gap → stable, predictable
* Large gap → volatile, context-dependent behavior

> This feature is powerful because it captures not just *who someone is*—
> but *who they become when it matters most*.

---

# Is Q2.2 redundant?

## Short answer
👉 **No — Q2.2 is not redundant.**  
It is one of the **highest-value, non-redundant questions** in your entire set.

---

# 🧠 What Q2.2 uniquely captures

**Q2.2 → Conflict Repair Ability (CR)**

> *What happens **after** tension?*

This is fundamentally different from:
- **Q2.1** → behavior **during** low-intensity conflict  
- **Q1.4** → behavior **during high emotional arousal**

👉 Q2.2 measures the **recovery phase**, which neither of those capture.

---

# ⚠️ Why this matters (a lot)

Research and real-world data consistently show:

> **Repair ability > conflict style** for predicting long-term success

Two couples can:
- fight the same amount  
- have similar conflict styles  

…but differ dramatically in:
- how quickly they repair  
- whether they reconnect  

👉 That difference determines **relationship survival**

---

# 🔍 What signal Q2.2 adds (that you don’t have elsewhere)

## 1. **Time-to-repair**
- Immediate (A)
- Delayed but reliable (B)
- Avoidant / passive (C)

👉 This is not captured by any other item.

---

## 2. **Ownership of reconnection**

Option C is especially important:

> “wait for them to bring it up”

This captures:
- low responsibility for repair  
- passive avoidance  
- hidden resentment accumulation  

👉 Strong predictor of **relationship decay**

---

## 3. **Repair reliability vs intention**

Compare:

| Q2.1 | Q2.2 | Insight |
|------|------|--------|
| Engages | Repairs quickly | Healthy |
| Engages | Doesn’t repair | **High risk** |
| Withdraws | Repairs later | Recoverable |
| Withdraws | Doesn’t repair | **Silent disconnection** |

👉 Q2.2 reveals whether conflict actually **gets resolved**

---

# 🔗 Interaction power (why it’s critical)

## With Negative Conflict Style (NC)

```
Risk += (1 - CR) * NC
```

High NC + low CR → toxic loop
High NC + high CR → manageable conflict
With Attachment Avoidance (AV)

```
if AV high and CR low:
    Risk += disconnection_penalty
```
👉 Classic “distance + no repair” pattern

**With Responsiveness (RS)**
```
RepairEffectiveness = CR * RS
```
👉 Repair only works if partner responds

---

## Design Pattern

- Update **3–5 indices per question**
- Include **positive + negative deltas**
- Focus on **behavior under stress**

---

## Optional (Learned Mapping)

```python
delta = learned_matrix[question_id][answer]
```

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
