# 🔄 State–Trait Gap Modeling Summary

---

## Purpose

These gap constructs model the difference between a user’s:

* **stated preference / self-concept / lower-stress pattern**
* and their **actual behavior under stress, closeness, conflict, or relational pressure**

This layer is valuable because many users are not mismatched on traits alone.
They are mismatched on:

* **consistency**
* **stress execution**
* **follow-through under activation**

In practice, these gaps should function primarily as:

* **risk amplifiers**
* **stability modifiers**
* **robustness predictors**

rather than simple similarity dimensions.

---

# 1. Emotional Responsibility Gap (ERG)

## Definition

Difference between how much a person **believes emotions are their responsibility** versus how much they **blame the partner when activated**.

## Anchors

* **Trait anchor:** Q1.5
* **State anchor:** Q1.7

## Mapping

* Core index linked: **ER2 (Emotional Responsibility)**
* Secondary linked indices: **NC, ER, AG**

## Equation

```python
gap_ERG = abs(Q1_7 - Q1_5)
```

Optional signed version:

```python
gap_ERG_signed = Q1_7 - Q1_5
```

## Interpretation

* **Low gap** = accountability belief is stable under activation
* **High positive gap** = person becomes more blaming / externally attributive when upset
* **High negative gap** = less common; may over-internalize under stress

## Predictive meaning

High ERG predicts:

* conflict toxicity risk
* defensive attribution cycles
* unstable accountability under stress

---

# 2. Conflict Engagement Gap (CE Gap)

## Definition

Difference between a person’s **low-intensity conflict style** and their **high-emotion conflict style**.

## Anchors

* **Lower-intensity anchor:** Q2.1
* **High-intensity anchor:** Q1.4

## Mapping

* Core linked indices: **CE, ER**
* Secondary linked indices: **AA, AV, NC**

## Equation

```python
gap_CE = abs(Q1_4 - Q2_1)
```

Optional signed version:

```python
gap_CE_signed = Q1_4 - Q2_1
```

## Interpretation

* **Low gap** = conflict style remains stable as emotion rises
* **High positive / negative gap** = conflict behavior changes sharply under activation

## Predictive meaning

High CE Gap predicts:

* “looks constructive until stress hits” dynamics
* hidden pursue / withdraw shifts
* reduced conflict predictability

---

# 3. Communication Gap (CG)

## Definition

Difference between a person’s **baseline communication style** and how directly they communicate when something is truly important.

## Anchors

* **Trait anchor:** Q3.3
* **State / importance anchor:** Q3.9

## Mapping

* Core linked indices: **CD, MR**
* Secondary linked indices: **AG, RS**

## Equation

```python
gap_CG = abs(Q3_9 - Q3_3)
```

Optional signed version:

```python
gap_CG_signed = Q3_9 - Q3_3
```

## Interpretation

* **Low gap** = communication remains consistent when stakes rise
* **Positive direction** = may become more indirect / assumptive under pressure
* **Negative direction** = may become more direct only when highly activated

## Predictive meaning

High CG predicts:

* misread needs
* resentment due to uneven signaling
* expectation / expression mismatch

---

# 4. Closeness Gap (CG2)

## Definition

Difference between a person’s **stated preference for closeness** and their **actual tolerance after sustained closeness**.

## Anchors

* **Trait anchor:** Q3.2
* **State anchor:** Q3.10

## Mapping

* Core linked indices: **CA, CT**
* Secondary linked indices: **AV, ER**

## Equation

```python
gap_CG2 = abs(Q3_10 - Q3_2)
```

Optional signed version:

```python
gap_CG2_signed = Q3_10 - Q3_2
```

## Interpretation

* **Low gap** = intimacy preference matches real tolerance
* **High positive gap** = person wants more closeness in theory than they tolerate in practice
* **High negative gap** = person may underestimate their comfort with connection

## Predictive meaning

High CG2 predicts:

* intimacy drift
* closeness fatigue
* avoidant-looking behavior after bonding intensifies

---

# 5. Effort–Expectation Gap (EEG)

## Definition

Difference between a person’s **identity-level sense of investment** and their **actual effort under stress or reciprocity strain**.

## Anchors

* **Trait anchor:** Q3.7
* **State anchors:** Q3.8, Q3.11

## Mapping

* Core linked indices: **EN, CO**
* Secondary linked indices: **RS, ER**

## Equation

```python
state_EEG = mean(Q3_8, Q3_11)
gap_EEG = abs(state_EEG - Q3_7)
```

Optional signed version:

```python
gap_EEG_signed = state_EEG - Q3_7
```

## Interpretation

* **Low gap** = effort identity matches enacted behavior
* **High positive gap** = person says they care, but follow-through degrades under load
* **High negative gap** = less common; behavior may exceed self-concept

## Predictive meaning

High EEG predicts:

* reliability disappointment
* unequal effort perceptions
* match instability during busy / stressful periods

---

# 6. Conflict Repair Gap (CR Gap)

## Definition

Difference between a person’s **repair willingness / accountability intent** and their **actual re-engagement after conflict**.

## Anchors

* **Trait anchor (inferred):** Q2.2
* **State anchors:** Q2.3, Q2.4

## Mapping

* Core linked indices: **CR**
* Secondary linked indices: **RS, ER, NC, RFs**

## Equation

```python
state_CR = mean(Q2_3, Q2_4)
gap_CR = abs(state_CR - Q2_2)
```

Optional signed version:

```python
gap_CR_signed = state_CR - Q2_2
```

## Interpretation

* **Low gap** = accountability / repair intent matches follow-through
* **High positive gap** = person sounds repair-oriented, but does not actually come back well
* **High negative gap** = behavior may be more conciliatory than stated style suggests

## Predictive meaning

High CR Gap predicts:

* unresolved conflict accumulation
* low trust in repair cycles
* fragile long-term robustness

---

# 7. Responsiveness Gap (RS Gap)

## Definition

Difference between a person’s **stated willingness to respond to partner needs** and their **actual responsiveness under load or imbalance**.

## Anchors

* **Trait anchor:** Q1.2
* **State anchors:** Q3.8, Q3.11

## Mapping

* Core linked indices: **RS**
* Secondary linked indices: **EN, CO, ER**

## Equation

```python
state_RS = mean(Q3_8, Q3_11)
gap_RS = abs(state_RS - Q1_2)
```

Optional signed version:

```python
gap_RS_signed = state_RS - Q1_2
```

## Interpretation

* **Low gap** = responsiveness values are enacted consistently
* **High positive gap** = person endorses responsiveness, but becomes less available under pressure
* **High negative gap** = behavior may be more responsive than self-description implies

## Predictive meaning

High RS Gap predicts:

* unmet support needs
* perceived emotional unreliability
* breakdown in stressful life periods

---

# 8. Regulation Gap (ER Gap)

## Definition

Difference between a person’s **baseline emotional steadiness** and their **actual control when activated or overwhelmed**.

## Anchors

* **Trait anchor (inferred):** Q1.3
* **State anchors:** Q1.4, Q1.8

## Mapping

* Core linked indices: **ER**
* Secondary linked indices: **NC, ES, RFq**

## Equation

```python
state_ER = mean(Q1_4, Q1_8)
gap_ER = abs(state_ER - Q1_3)
```

Optional signed version:

```python
gap_ER_signed = state_ER - Q1_3
```

## Interpretation

* **Low gap** = baseline stability holds under activation
* **High positive gap** = person appears steady at baseline but dysregulates when activated
* **High negative gap** = less common; may report instability yet behave more controlled in relational stress

## Predictive meaning

High ER Gap predicts:

* escalation risk
* unstable emotional containment
* conflict volatility under pressure

---

# Summary Table

| Gap    | Trait / Baseline Anchor | State / Pressure Anchor(s) | Core Indices | Main Risk Meaning                               |
| ------ | ----------------------- | -------------------------- | ------------ | ----------------------------------------------- |
| ERG    | Q1.5                    | Q1.7                       | ER2          | accountability collapses into blame             |
| CE Gap | Q2.1                    | Q1.4                       | CE, ER       | conflict style changes under activation         |
| CG     | Q3.3                    | Q3.9                       | CD, MR       | signaling becomes inconsistent when stakes rise |
| CG2    | Q3.2                    | Q3.10                      | CA, CT       | intimacy preference exceeds tolerance           |
| EEG    | Q3.7                    | Q3.8, Q3.11                | EN, CO       | caring identity exceeds enacted effort          |
| CR Gap | Q2.2                    | Q2.3, Q2.4                 | CR           | repair intent exceeds repair follow-through     |
| RS Gap | Q1.2                    | Q3.8, Q3.11                | RS           | responsiveness values fail under load           |
| ER Gap | Q1.3                    | Q1.4, Q1.8                 | ER           | baseline stability breaks under activation      |

---

# Normalization & Scoring Recommendations

## 1. Normalize item anchors first

Each anchor question should first be converted into a standardized scalar for the target dimension.
For example:

```python
# Example only
# map answer A/B/C -> latent scalar in [-1, 0, +1] or [0, 0.5, 1.0]
```

The gap equations should operate on those normalized latent values, not raw answer letters.

## 2. Use both absolute and signed forms

Recommended storage:

```python
gap_abs = abs(state - trait)
gap_signed = state - trait
```

* **gap_abs** = magnitude of inconsistency
* **gap_signed** = direction of inconsistency

## 3. Suggested normalization

```python
gap_norm = min(1.0, gap_abs / gap_max)
```

where `gap_max` depends on the answer scaling scheme.

## 4. Use gaps mostly as risk amplifiers

```python
pair_risk += w_gap * gap_norm
```

Not all gaps should directly reduce similarity; most should increase risk / instability weighting.

---

# Recommended Relative Gap Weights

These are starting priors and should be updated with outcome data.

| Gap    | Recommended Weight | Why                                                          |
| ------ | -----------------: | ------------------------------------------------------------ |
| CR Gap |               1.35 | strongest follow-through failure signal                      |
| ER Gap |               1.30 | emotional containment failure is highly destabilizing        |
| RS Gap |               1.25 | support inconsistency strongly affects satisfaction          |
| EEG    |               1.20 | reliability / reciprocity strain compounds over time         |
| CG     |               1.15 | communication inconsistency creates chronic friction         |
| CG2    |               1.10 | closeness mismatch matters, but usually more slowly          |
| ERG    |               1.15 | blame-vs-accountability instability raises conflict toxicity |
| CE Gap |               1.10 | conflict pattern shifts matter, but overlap partly with ER   |

---

# Suggested Interaction Layer

These are useful starting interaction terms:

```python
risk += gap_CR * NC * 1.5
risk += gap_ER * NC * 1.3
risk += gap_RS * (1 - RS) * 1.2
risk += gap_EEG * (1 - CO) * 1.1
risk += gap_CG * MR * 1.1
risk += gap_CG2 * AV * 1.1
risk += gap_ERG * NC * 1.2
risk += gap_CE * AA * 1.0
```

---

# Implementation Notes

## Recommended storage per user

```python
user.gap_ERG
user.gap_CE
user.gap_CG
user.gap_CG2
user.gap_EEG
user.gap_CR
user.gap_RS
user.gap_ER
```

Optional signed variants:

```python
user.gap_ERG_signed
user.gap_CE_signed
user.gap_CG_signed
user.gap_CG2_signed
user.gap_EEG_signed
user.gap_CR_signed
user.gap_RS_signed
user.gap_ER_signed
```

## Practical rule

Use gaps as:

* **user-level nonlinear features**
* **pair-level risk inputs**
* **tie-breakers in reranking**, not coarse retrieval features

---

# Bottom Line

These eight state–trait gaps are not redundant with the core trait indices.
They model:

* **stress inconsistency**
* **follow-through failure**
* **behavioral drift under activation**

That makes them especially valuable for predicting:

* relationship satisfaction
* repair reliability
* long-term robustness
* failure modes that ordinary trait matching misses
