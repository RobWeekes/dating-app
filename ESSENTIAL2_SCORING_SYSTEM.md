# Essential Questionnaire 2 — Scoring Guide (Revised)

## Part 1: Index Scoring, Starting Weights, and Latent Features

## Overview

This revised guide updates the original scoring system to better reflect the current questionnaire structure, the 20-index model, and the addition of **state–trait gap features**. It is designed for:

* **efficient vectorized scoring** per user
* **high-signal compatibility prediction** for dating and long-term relationship success
* **scalable retrieval and ranking** across 10M+ users
* **future tuning** through A/B tests and outcome-based optimization

This is a **theoretical starting-weight system**, not a claim of final empirical optimality. The goal is to create a strong, explainable default that can later be tuned with real outcome data.

---

## Core Design Principles

1. **Weight stress behavior more than stated ideals**

   * Behavior under conflict, ambiguity, and emotional activation predicts outcomes better than identity claims.

2. **Separate trait from state whenever possible**

   * Baseline tendencies and stress responses should both be measured and compared.

3. **Do not let item count dominate trait strength**

   * Indices with many mapped items must be normalized so they do not overpower thinner but critical indices.

4. **Weight interaction risks more than raw similarity**

   * Many relationship failures arise from nonlinear combinations, not isolated traits.

5. **Use hard constraints before expensive scoring**

   * Relationship intent and life-structure alignment should gate candidate generation before pairwise ranking.

---

## Questionnaire Size and Representation

Current questionnaire basis:

* **29 questions**
* **3 response options per question**
* **20 primary indices**
* **5 explicit state–trait gap families**
* **pairwise risk interactions** for matching

Recommended per-user representation:

```text
Base user vector = [20 index scores + 5 gap scores + 1 consistency/confidence + 4 bias flags + optional risk auxiliaries]
```

Recommended operational vectors:

* **Retrieval vector:** compact 20–26D vector for ANN
* **Ranking vector:** full scored profile including gaps, risks, and confidence

---

# 1. The 20 Relationship Indices

## A. Behavioral Dynamics

| Code | Index                    | Role                                        | Starting Importance |
| ---- | ------------------------ | ------------------------------------------- | ------------------- |
| AA   | Attachment Anxiety       | abandonment sensitivity, pursuit            | 1.15                |
| AV   | Attachment Avoidance     | distancing, withdrawal, intimacy resistance | 1.15                |
| ER   | Emotional Regulation     | regulation under stress                     | 1.15                |
| RS   | Responsiveness           | turning toward needs / bids / repair        | 1.05                |
| ER2  | Emotional Responsibility | internal vs external attribution            | 0.95                |

## B. Conflict & Repair

| Code | Index                   | Role                                  | Starting Importance |
| ---- | ----------------------- | ------------------------------------- | ------------------- |
| CE   | Conflict Engagement     | baseline conflict approach            | 1.00                |
| CR   | Conflict Repair Ability | speed and reliability of reconnection | 1.20                |
| NC   | Negative Conflict Style | criticism, defensiveness, escalation  | 1.20                |

## C. Compatibility & Friction

| Code | Index                         | Role                                    | Starting Importance |
| ---- | ----------------------------- | --------------------------------------- | ------------------- |
| CA   | Closeness–Autonomy Preference | desired intimacy distance               | 1.00                |
| CT   | Closeness Tolerance           | flexibility under mismatch              | 0.95                |
| CD   | Communication Directness      | explicitness of expression              | 0.90                |
| MR   | Mind-Reading Expectation      | expectation partner should infer        | 0.90                |
| JS   | Jealousy / Threat Sensitivity | threat activation under ambiguity       | 0.95                |
| EN   | Effort & Investment Norms     | expectations around relationship effort | 0.95                |

## D. Values & Alignment

| Code | Index                           | Role                              | Starting Importance |
| ---- | ------------------------------- | --------------------------------- | ------------------- |
| LT   | Long-Term Orientation           | relationship intent / seriousness | 1.20                |
| LS   | Life Structure Alignment        | kids, lifestyle, timeline, base   | 1.20                |
| NS   | Novelty vs Stability Preference | desired stimulation vs routine    | 0.80                |

## E. Personality & Stability

| Code | Index                               | Role                           | Starting Importance |
| ---- | ----------------------------------- | ------------------------------ | ------------------- |
| ES   | Emotional Stability                 | baseline affect stability      | 1.05                |
| CO   | Conscientiousness / Reliability     | consistency and follow-through | 1.00                |
| AG   | Assertiveness–Agreeableness Balance | needs vs harmony balance       | 0.85                |

---

## Why these starting importance weights?

### Highest starting importance

* **CR, NC, LT, LS**
* These are the strongest theoretical predictors of long-term viability, not just attraction.

### Very high importance

* **AA, AV, ER**
* These shape attachment security, conflict volatility, and stability under pressure.

### High but not top-tier

* **RS, ES, CE, CO, CA**
* Important for satisfaction and reliability, but often partly mediated by the above.

### Moderate importance

* **ER2, CT, JS, EN**
* Meaningful friction amplifiers and clarifiers.

### Lower direct importance but high interaction value

* **CD, MR, NS, AG**
* These matter most through mismatch patterns rather than raw score similarity alone.

---

# 2. Updated Question-to-Index Mapping Strengths

Use three contribution strengths per item-to-index mapping:

* **Primary = 1.00**
* **Secondary = 0.60**
* **Tertiary = 0.30**

These are starting values for converting responses into index deltas.

---

## A. Behavioral Dynamics

### Q1.1 — partner pulling away

* **Primary:** AA, AV
* **Secondary:** ER, CE

### Q1.2 — partner needs reassurance

* **Primary:** RS, AV
* **Secondary:** NC, EN, AA

### Q1.3 — mood under stress / uncertainty

* **Primary:** ES
* **Secondary:** ER

### Q1.4 — very upset with someone

* **Primary:** ER, CE, NC
* **Secondary:** AA, AV

### Q1.5 — trait emotional attribution

* **Primary:** ER2
* **Secondary:** NC, AG

### Q1.6 — support preference when stressed

* **Primary:** CA
* **Secondary:** ER, RS, AV

### Q1.7 — state emotional attribution under relationship upset

* **Primary:** ER2
* **Secondary:** NC, ER

---

## B. Conflict & Repair

### Q2.1 — small disagreement

* **Primary:** CE
* **Secondary:** AV, ER

### Q2.2 — criticized or hurt in disagreement

* **Primary:** NC, ER2
* **Secondary:** AG
* **Tertiary:** CR

### Q2.3 — after a conflict

* **Primary:** CR
* **Secondary:** RS, AV, CO

### Q2.4 — if tension still remains

* **Primary:** CR
* **Secondary:** RS, AV
* **Tertiary:** ER, CO, NC

---

## C. Compatibility & Friction

### Q3.1 — partner wants more closeness

* **Primary:** CA, CT
* **Secondary:** AV, EN

### Q3.2 — desired relationship closeness baseline

* **Primary:** CA
* **Secondary:** AV

### Q3.3 — concerns in relationship: directness / hints / unspoken

* **Primary:** CD, MR
* **Secondary:** AG

### Q3.4 — what a good partner should infer

* **Primary:** MR
* **Secondary:** CD, RS

### Q3.5 — ambiguous partner behavior

* **Primary:** JS
* **Secondary:** AA, ES

### Q3.6 — partner seems less available / attentive

* **Primary:** JS
* **Secondary:** AA, ES

### Q3.7 — how I show a relationship matters

* **Primary:** CO
* **Secondary:** EN, RS

### Q3.8 — when life gets busy or stressful

* **Primary:** CO, RS
* **Secondary:** EN, ER

### Q3.9 — important things in relationship: say / imply / assume

* **Primary:** CD, MR
* **Secondary:** AG

### Q3.10 — after a lot of closeness or time together

* **Primary:** CT
* **Secondary:** AV, ER

### Q3.11 — when effort feels uneven

* **Primary:** EN
* **Secondary:** RS, CO

---

## D. Values & Alignment

### Q4.1 — dating mainly for

* **Primary:** LT

### Q4.2 — major life choices clarity

* **Primary:** LS
* **Secondary:** LT

### Q4.3 — mismatch on timeline / certainty around major life choices

* **Primary:** LS
* **Secondary:** LT

### Q4.4 — long-term life should feel more grounded vs stimulating

* **Primary:** NS
* **Secondary:** CA

### Q4.5 — response once relationship becomes routine

* **Primary:** NS
* **Secondary:** ES

---

## E. Personality & Stability

### Q5.1 — how close others would describe me

* **Primary:** CO
* **Secondary:** EN

### Q5.2 — in close relationships, I tend to

* **Primary:** AG
* **Secondary:** CD, NC

---

# 3. Recommended Per-Question Starting Weights

These weights reflect the **quality of signal** each item contributes globally before index-specific multipliers are applied.

## Critical items = 1.25

Use for items that are highly behaviorally anchored and strongly predictive.

* Q1.1, Q1.3, Q1.4, Q1.7
* Q2.1, Q2.2, Q2.3, Q2.4
* Q3.1, Q3.8
* Q4.1, Q4.2

## High items = 1.00

* Q1.2, Q1.5, Q1.6
* Q3.3, Q3.4, Q3.5, Q3.6, Q3.9, Q3.10, Q3.11
* Q4.3, Q4.4, Q4.5
* Q5.1, Q5.2

## Medium items = 0.80

* Q3.7

---

# 4. Index Score Computation

## Response deltas

Each answer maps to signed deltas in a bounded range.

Recommended starting delta scale:

* **Strong favorable / unfavorable signal:** ±0.70
* **Moderate signal:** ±0.40
* **Weak signal:** ±0.20

Example:

```python
# Example shape for a 3-option item
A = +0.70
B = +0.10 or 0.00
C = -0.70
```

Use asymmetric deltas when theoretically justified.
For some items, the middle option should be a real midpoint; for others it should reflect an ambivalent but still meaningful state.

---

## Index aggregation formula

For each index:

```python
raw_index_i = sum(question_weight * mapping_strength * answer_delta)
               / sum(question_weight * mapping_strength)
```

Then normalize:

```python
index_score_i = sigmoid(raw_index_i * 1.75)
```

Recommended interpretation:

* **0.00–0.33** = low presence / opposite pole
* **0.34–0.66** = mixed / moderate / context-sensitive
* **0.67–1.00** = strong presence

---

## Orientation rules

Maintain a consistent direction by index.

### Higher = more risk when high

* AA, AV, NC, MR, JS

### Higher = more protective when high

* ER, RS, ER2, CE, CR, CT, CD, EN, LT, LS, ES, CO

### Higher = “more toward one pole,” not automatically good or bad

* CA, NS, AG

For bipolar preference indices, store:

* the main continuous score
* and optionally a centered representation for similarity / complementarity logic

Example:

```python
CA_centered = (CA * 2) - 1
NS_centered = (NS * 2) - 1
AG_centered = (AG * 2) - 1
```

---

# 5. State–Trait Gaps (High-Value Latent Features)

These should be computed **after** primary index scoring and stored as separate latent variables.

## G1. Stress Response Gap

Compares low-intensity baseline conflict style vs high-intensity reaction.

```python
G1_stress_response_gap = abs(state_Q1_4 - trait_Q2_1)
```

Interpretation:

* low = behavior consistent under pressure
* high = instability or stress-triggered shift

Starting importance: **1.15**

---

## G2. Emotional Responsibility Gap

Trait-level attribution vs in-the-moment attribution.

```python
G2_ER_gap = abs(state_Q1_7 - trait_Q1_5)
```

Interpretation:

* low = emotionally coherent accountability style
* high = becomes more blaming when distressed

Starting importance: **1.00**

---

## G3. Communication Gap

How people say they communicate vs what they do when something actually matters.

```python
G3_comm_gap = abs(state_Q3_9 - trait_Q3_3)
```

Interpretation:

* low = consistent communication pattern
* high = indirectness or unrealistic expectation under pressure

Starting importance: **0.90**

---

## G4. Closeness Gap

Baseline closeness preference vs response after sustained closeness.

```python
G4_closeness_gap = abs(state_Q3_10 - trait_Q3_2)
```

Interpretation:

* low = preference matches tolerance
* high = likes closeness in theory but deactivates after enough of it

Starting importance: **1.00**

---

## G5. Effort Gap

Relationship effort ideals vs actual reliability under load / uneven effort.

```python
G5_effort_gap = mean(
    abs(state_Q3_8 - trait_Q3_7),
    abs(state_Q3_11 - trait_Q3_7)
)
```

Interpretation:

* low = effort norms match actual behavior
* high = says effort matters but becomes inconsistent or resentful

Starting importance: **1.00**

---

# 6. Confidence, Consistency, and Bias Adjustment

## Response confidence score

Recommended range: **0.70 to 1.00** for normal use

Start at:

```python
confidence = 1.00
```

Subtract modest penalties for:

* patterned responding
* internal contradiction
* excessive idealization
* excessive extremity

Do **not** over-penalize rare but coherent profiles.

Recommended starting penalties:

* social desirability flag: **-0.08**
* acquiescence / position-pattern flag: **-0.06**
* contradiction cluster: **-0.04 each**, capped
* over-extreme responding: **-0.04**

Clamp:

```python
confidence = clamp(confidence, 0.55, 1.00)
```

This confidence score should:

* downweight uncertain profiles in ranking
* reduce certainty in match explanations
* influence re-ask priority later

---

# 7. Recommended Retrieval Vector

For large-scale ANN retrieval, use a compact vector that favors stable and informative features.

## Option A — 20D retrieval vector

Use only the 20 primary indices.

## Option B — 26D retrieval vector (recommended)

Use:

* 20 indices
* 5 gap features
* 1 confidence score

```text
[AA, AV, ER, RS, ER2, CE, CR, NC, CA, CT, CD, MR, JS, EN, LT, LS, NS, ES, CO, AG,
 G1, G2, G3, G4, G5,
 CONF]
```

This is still compact enough for ANN and gives better ranking preselection than a pure 20D vector.

---

# 8. Starting Retrieval Weights

When building a weighted retrieval vector, scale dimensions approximately by importance.

## Suggested normalized retrieval multipliers

```text
CR 1.20
NC 1.20
LT 1.20
LS 1.20
AA 1.15
AV 1.15
ER 1.15
G1 Stress Gap 1.15
RS 1.05
ES 1.05
CE 1.00
ER2 0.95
CT 0.95
JS 0.95
EN 0.95
G2 ER Gap 1.00
G4 Closeness Gap 1.00
G5 Effort Gap 1.00
CA 1.00
CO 1.00
CD 0.90
MR 0.90
G3 Comm Gap 0.90
NS 0.80
AG 0.85
CONF 0.75
```

For ANN indexing, standardize all dimensions first, then apply these multipliers.

---

## Part 1 Summary

This revised starting system does four things better than the original guide:

1. updates mappings to the current 29-question structure
2. separates **index importance** from **question signal weight**
3. adds **state–trait gap features** as first-class variables
4. creates a practical path for scalable ANN retrieval using weighted user vectors

Part 2 should define:

* pairwise compatibility formulas
* hard filters and gating
* complementarity vs similarity treatment
* risk penalties
* final ranking equation
* production matching pipeline

--------------------

# Essential Questionnaire 2 — Scoring Guide (Revised)

## Part 2: Compatibility, Risk, Gating, and Scalable Matching

## Overview

Part 2 defines how to turn scored user profiles into:

* candidate gating
* compatibility retrieval
* detailed pairwise ranking
* risk prediction
* long-term relationship fit estimates

This framework assumes each user already has:

* 20 normalized index scores
* 5 state–trait gap scores
* 1 confidence score
* optional bias flags and auxiliary risk indicators

---

# 1. Matching Philosophy

A strong long-term match is not just:

* “similar people”
* “opposites attract”
* or “low-risk individuals”

It is a combination of:

1. **feasibility** — can this relationship realistically work?
2. **alignment** — do they want compatible things?
3. **interaction quality** — do their styles create security or friction?
4. **stress resilience** — how likely are they to break down when tested?

So the final score should combine:

```python
FinalMatchScore = FeasibilityGate * CandidateCompatibility * RiskAdjustment * ConfidenceAdjustment
```

---

# 2. Stage-Based Matching Pipeline

## Stage 1 — Hard / Semi-Hard Gating

Use before ANN retrieval when possible.

### True hard filters

These should usually exclude or severely downrank.

* **LT mismatch**: casual vs long-term incompatibility
* **LS mismatch**: incompatible major life path constraints
* product-level filters like geography, age range, orientation, etc.

### Semi-hard filters

Do not always exclude, but strongly reduce feasibility.

* large lifestyle / timeline mismatch
* major novelty / routine mismatch in serious daters
* extreme closeness mismatch when CT is low on both sides

---

## Stage 2 — Approximate Retrieval (ANN)

Retrieve top candidate pool using the weighted user vector.

Recommended:

* ANN on **26D vector** from Part 1
* top **500–2000** approximate candidates after gating

This stage should optimize for:

* good recall
* speed
* not prematurely over-penalizing nuanced interaction effects

---

## Stage 3 — Detailed Pairwise Ranking

Run full compatibility formulas only on the reduced candidate set.

This stage computes:

* similarity-based fit
* complementarity fit
* pairwise risk interactions
* dealbreaker severity
* final ranking score

---

# 3. Pairwise Compatibility Structure

## Main decomposition

```python
PairCompatibility = (
    0.36 * SimilarityFit
  + 0.18 * ComplementarityFit
  + 0.18 * GapResilienceFit
  + 0.28 * ProtectiveInteractionFit
)

FinalMatchScore = FeasibilityGate * PairCompatibility * (1 - RiskPenalty) * ConfidenceAdjustment
```

These are **starting theoretical weights**.

Why this balance?

* Similarity matters, but is not enough.
* Complementarity matters in a limited set of domains.
* Gap resilience matters because inconsistency under stress is highly predictive.
* Protective / risky interactions matter heavily in long-term outcomes.

---

# 4. Similarity Fit

Use similarity for dimensions where alignment usually improves satisfaction.

## Similarity dimensions and starting weights

| Index | Weight within SimilarityFit |
| ----- | --------------------------- |
| LT    | 1.35                        |
| LS    | 1.35                        |
| EN    | 1.00                        |
| CD    | 0.95                        |
| MR    | 0.95                        |
| NS    | 0.80                        |
| CA    | 0.95                        |
| AG    | 0.75                        |
| CO    | 0.85                        |

Formula:

```python
sim_i = 1 - abs(scoreA_i - scoreB_i)
SimilarityFit = weighted_mean(sim_i)
```

### Notes

* **LT and LS** deserve the highest similarity weight because severe mismatch destroys feasibility.
* **CA** belongs partly here, but also partly in complementarity / tolerance logic.
* **AG** should have lower pure-similarity weight because moderate asymmetry can work.

---

# 5. Complementarity Fit

Use complementarity only where balanced difference may outperform exact similarity.

## Best complementarity candidates

### A. Assertiveness–Agreeableness Balance (AG)

Moderate asymmetry can be healthy.

### B. Emotional Regulation / Stability buffering

One highly regulated partner can partially stabilize a more reactive one, within bounds.

### C. Closeness system, but only when tolerance is high

A closeness mismatch can be viable when CT is adequate.

---

## Starting complementarity formula

```python
ComplementarityFit = weighted_mean([
    AG_balance_fit,
    ER_buffer_fit,
    CA_tolerance_fit
])
```

### A. AG balance fit

Reward moderate differentiation, penalize two extremes.

```python
AG_balance_fit = 1 - abs((AG_A + AG_B) - 1.0)
```

If AG is stored from 0 to 1 with midpoint near balanced expression, add penalties for both highly passive or both highly forceful.

### B. ER buffer fit

```python
ER_buffer_fit = 1 - max(0, ((1-ER_A) + (1-ER_B)) - 1.0)
```

Practical interpretation:

* both dysregulated = poor
* one stable, one less stable = better than both unstable
* both regulated = best

### C. CA tolerance fit

```python
closeness_delta = abs(CA_A - CA_B)
closeness_tolerance = (CT_A + CT_B) / 2
CA_tolerance_fit = 1 - max(0, closeness_delta - closeness_tolerance)
```

---

# 6. Gap Resilience Fit

People do not just need good scores. They need **stable scores under pressure**.

This component rewards pairings where both users have manageable state–trait gaps.

## Gap weights

| Gap | Meaning                      | Weight |
| --- | ---------------------------- | ------ |
| G1  | Stress Response Gap          | 1.20   |
| G2  | Emotional Responsibility Gap | 1.00   |
| G3  | Communication Gap            | 0.90   |
| G4  | Closeness Gap                | 1.00   |
| G5  | Effort Gap                   | 1.00   |

Compute protective fit as:

```python
gap_fit_g = 1 - abs(gapA_g - gapB_g)
GapResilienceFit = weighted_mean(gap_fit_g)
```

But also penalize **jointly high gap levels**:

```python
joint_gap_penalty = weighted_mean([
    max(0, G1_A + G1_B - 1.0),
    max(0, G2_A + G2_B - 1.0),
    max(0, G3_A + G3_B - 1.0),
    max(0, G4_A + G4_B - 1.0),
    max(0, G5_A + G5_B - 1.0),
])

GapResilienceFit = GapResilienceFit * (1 - 0.35 * joint_gap_penalty)
```

### Why this matters

Two users with similar instability are **not** necessarily a good match.
The model must distinguish:

* similarity in calm behavior
* similarity in breakdown patterns

---

# 7. Protective Interaction Fit

This is where the most important nonlinear benefits and dangers are modeled.

## Starting positive interaction terms

### A. Repair × conflict style buffer

```python
repair_protection = mean(CR_A, CR_B) * (1 - mean(NC_A, NC_B))
```

### B. Responsiveness × anxiety buffer

```python
anxiety_buffer = 1 - (
    (AA_A * (1 - RS_B)) +
    (AA_B * (1 - RS_A))
) / 2
```

### C. Communication coherence

```python
communication_coherence = 1 - (
    (MR_A * (1 - CD_B)) +
    (MR_B * (1 - CD_A))
) / 2
```

### D. Effort reliability protection

```python
effort_reliability = mean(EN_A * CO_A, EN_B * CO_B)
```

### E. Emotional stability buffer

```python
stability_buffer = mean(ES_A, ES_B) * mean(ER_A, ER_B)
```

## Starting weights inside ProtectiveInteractionFit

| Component               | Weight |
| ----------------------- | ------ |
| repair_protection       | 1.25   |
| anxiety_buffer          | 1.10   |
| communication_coherence | 0.95   |
| effort_reliability      | 0.95   |
| stability_buffer        | 1.00   |

Then:

```python
ProtectiveInteractionFit = weighted_mean([
    repair_protection,
    anxiety_buffer,
    communication_coherence,
    effort_reliability,
    stability_buffer
])
```

---

# 8. Risk Penalty

This is the most important non-similarity component. It should be strong enough to stop high-attraction but high-risk pairings from dominating the rankings.

## Global starting formula

```python
RiskPenalty = clamp(
    0.34 * AttachmentRisk
  + 0.31 * ConflictRisk
  + 0.15 * CommunicationRisk
  + 0.10 * ClosenessRisk
  + 0.10 * EffortStabilityRisk,
  0,
  0.85
)
```

---

## A. Attachment Risk

### Key patterns

#### 1. Anxious–avoidant cycle

```python
R_AA_AV = ((AA_A * AV_B) + (AA_B * AV_A)) / 2
```

#### 2. Double high anxiety

```python
R_double_AA = max(0, mean(AA_A, AA_B) - 0.65)
```

#### 3. Double high avoidance

```python
R_double_AV = max(0, mean(AV_A, AV_B) - 0.65)
```

#### 4. Anxiety with weak partner responsiveness

```python
R_AA_low_RS = ((AA_A * (1 - RS_B)) + (AA_B * (1 - RS_A))) / 2
```

Attachment risk:

```python
AttachmentRisk = weighted_mean([
    1.25 * R_AA_AV,
    0.85 * R_double_AA,
    0.90 * R_double_AV,
    1.10 * R_AA_low_RS
])
```

---

## B. Conflict Risk

### Key patterns

#### 1. High NC + low CR

```python
R_conflict_core = (
    (NC_A * (1 - CR_A)) +
    (NC_B * (1 - CR_B))
) / 2
```

#### 2. Dyadic low repair

```python
R_double_low_CR = max(0, 1 - mean(CR_A, CR_B))
```

#### 3. High stress gap + conflict toxicity

```python
R_gap_conflict = mean(G1_A, G1_B) * mean(NC_A, NC_B)
```

#### 4. Defensiveness / blame pairing

```python
R_ER2_NC = mean(1 - ER2_A, 1 - ER2_B) * mean(NC_A, NC_B)
```

Conflict risk:

```python
ConflictRisk = weighted_mean([
    1.30 * R_conflict_core,
    1.10 * R_double_low_CR,
    1.00 * R_gap_conflict,
    0.85 * R_ER2_NC
])
```

---

## C. Communication Risk

```python
R_MR_CD = ((MR_A * (1 - CD_B)) + (MR_B * (1 - CD_A))) / 2
R_comm_gap = mean(G3_A, G3_B)

CommunicationRisk = weighted_mean([
    1.25 * R_MR_CD,
    0.90 * R_comm_gap
])
```

---

## D. Closeness Risk

```python
R_closeness_mismatch = max(0, abs(CA_A - CA_B) - ((CT_A + CT_B) / 2))
R_closeness_gap = mean(G4_A, G4_B)
R_AV_closeness = mean(AV_A, AV_B) * abs(CA_A - CA_B)

ClosenessRisk = weighted_mean([
    1.15 * R_closeness_mismatch,
    0.95 * R_closeness_gap,
    0.85 * R_AV_closeness
])
```

---

## E. Effort / Stability Risk

```python
R_EN_CO = abs((EN_A * CO_A) - (EN_B * CO_B))
R_effort_gap = mean(G5_A, G5_B)
R_load_drop = max(0, (1 - CO_A) + (1 - CO_B) - 0.8)

EffortStabilityRisk = weighted_mean([
    1.05 * R_EN_CO,
    1.00 * R_effort_gap,
    0.85 * R_load_drop
])
```

---

# 9. Feasibility Gate

This should combine hard filters and semi-hard tolerance functions.

## Starting formula

```python
FeasibilityGate = LT_gate * LS_gate * optional_context_gates
```

### LT gate

```python
LT_delta = abs(LT_A - LT_B)
LT_gate = 1.0 if LT_delta <= 0.25 else exp(-4.0 * (LT_delta - 0.25))
```

For clearly incompatible categories, allow a product rule to force exclusion.

### LS gate

```python
LS_delta = abs(LS_A - LS_B)
LS_gate = 1.0 if LS_delta <= 0.20 else exp(-4.5 * (LS_delta - 0.20))
```

### Optional location / logistics gate

Apply only if product constraints require it.

---

# 10. Confidence Adjustment

Do not let low-confidence profiles dominate rankings.

## Starting formula

```python
ConfidenceAdjustment = 0.75 + 0.25 * min(CONF_A, CONF_B)
```

Interpretation:

* high confidence pair ≈ 1.00
* lower confidence pair still eligible, but modestly discounted

This avoids over-punishing users during cold start.

---

# 11. Final Ranking Formula

## Recommended starting version

```python
FinalMatchScore = (
    FeasibilityGate
    * (
        0.36 * SimilarityFit
      + 0.18 * ComplementarityFit
      + 0.18 * GapResilienceFit
      + 0.28 * ProtectiveInteractionFit
    )
    * (1 - RiskPenalty)
    * ConfidenceAdjustment
)
```

### Suggested interpretation bands

* **0.85+** = exceptional theoretical fit
* **0.75–0.84** = strong fit
* **0.65–0.74** = promising but mixed
* **0.50–0.64** = workable with meaningful risk or mismatch
* **<0.50** = weak fit for long-term recommendation

These bands should later be calibrated on observed outcomes.

---

# 12. User-Facing Category Scores

Keep user-facing categories simpler than the full engine.

## Recommended categories

| Category              | Indices         |
| --------------------- | --------------- |
| Attachment & Security | AA, AV, ER, ES  |
| Conflict & Repair     | CE, CR, NC, ER2 |
| Intimacy & Closeness  | CA, CT, AV, RS  |
| Communication         | CD, MR, RS, AG  |
| Trust & Reassurance   | JS, AA, ES      |
| Effort & Reliability  | EN, CO, RS      |
| Values & Life Fit     | LT, LS, NS      |

These should be used for:

* explanations
* UI summaries
* match coaching

Not for the full ranking formula directly.

---

# 13. Scalable Retrieval Strategy for 10M+ Users

## Candidate generation

### Step 1 — hard filters / context filters

Reduce to feasible pool.

### Step 2 — ANN retrieval

Use weighted 26D vector from Part 1.

### Step 3 — pairwise reranking

Apply full formula from this document to top candidates.

---

## ANN recommendations

### Storage strategy

* store normalized float32 vectors
* optionally quantize for memory efficiency
* maintain separate sub-indices by region / relationship intent if needed

### Indexing recommendations

* **HNSW** for dynamic updates and low latency
* **FAISS IVF-PQ or HNSW** for larger-scale distributed retrieval

### Query flow

```text
1. filter by product constraints and hard compatibility gates
2. ANN retrieve top 1000–3000 candidates
3. rerank top 200–500 using full compatibility engine
4. diversify and deduplicate final set
5. present top 20–100 depending on product surface
```

---

# 14. Starting Diversification Rules

To avoid overly narrow recommendation clusters:

* do not show only near-identical vectors
* include some candidates with slightly different but still feasible profiles
* preserve diversity in:

  * CA / NS combinations
  * communication style
  * emotional profile

Recommended ranking blend:

```python
DisplayedScore = 0.88 * FinalMatchScore + 0.12 * DiversityAdjustment
```

Diversity should never override clear incompatibility.

---

# 15. Calibration Priorities After Launch

These starting weights should later be tuned using:

## Short-term signals

* response rate
* conversation start rate
* conversation depth
* unmatch / block rates

## Mid-term signals

* repeated conversations
* date conversion rate
* mutual follow-up behavior

## Long-term signals

* exclusive relationship formation
* self-reported satisfaction
* duration / retention

### Highest-priority weights to learn first

1. **CR and NC interaction weight**
2. **AA × AV penalty strength**
3. **LT / LS gate steepness**
4. **state–trait gap penalties**
5. **RS buffering effects**

---

# 16. Practical Default Output Schema

For each user, compute and store:

```json
{
  "indices": {"AA":0.00, "AV":0.00, "ER":0.00, "RS":0.00, "ER2":0.00, "CE":0.00, "CR":0.00, "NC":0.00, "CA":0.00, "CT":0.00, "CD":0.00, "MR":0.00, "JS":0.00, "EN":0.00, "LT":0.00, "LS":0.00, "NS":0.00, "ES":0.00, "CO":0.00, "AG":0.00},
  "gaps": {"G1":0.00, "G2":0.00, "G3":0.00, "G4":0.00, "G5":0.00},
  "confidence": 0.00,
  "flags": {"social_desirability":false, "acquiescence":false, "contradictions":0, "extreme_pattern":false},
  "retrieval_vector": [],
  "version": "eq2-rev1"
}
```

---

# 17. Summary

This revised scoring framework improves on the original guide by:

1. separating **index estimation** from **pairwise compatibility logic**
2. introducing **state–trait gaps** as first-class predictive features
3. assigning more realistic **starting theoretical weights**
4. using **hard feasibility gates + ANN retrieval + detailed reranking**
5. prioritizing **long-term relationship durability**, not just raw similarity

The most important starting idea is this:

> **Successful matches are not just similar people. They are feasible, low-risk, resilient pairings whose styles create security rather than repeated friction.**

That principle should guide later empirical tuning.
