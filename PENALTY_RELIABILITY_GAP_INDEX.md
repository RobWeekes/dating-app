## 🧠 Reliability Gap Index (RGI) — Integration Overview

### Definition

The **Reliability Gap Index (RGI)** captures the drop-off between:

- **Trait reliability** (claimed / baseline behavior)
- **Stress reliability** (actual behavior under load)

```python
R_trait  = score_from_Q_trait
R_stress = score_from_Q_stress

RG = max(0, R_trait - R_stress)
```

### Key Components

- **R_stress → reliability_resilience** (used for compatibility)
- **RG → reliability_gap** (used for risk)

---

## 🧩 System Role

### 1. Add as a Derived Feature (not base index)

```python
U = [x1, x2, ..., x20, reliability_gap, reliability_resilience]
```

---

### 2. Update Core Indices (but don’t collapse the gap)

```python
CO += w1 * R_trait + w2 * R_stress
EN += w3 * R_trait
RS += w4 * R_stress
```

👉 Keep `RG` separate — it captures **inconsistency under stress**, not baseline traits

---

## ⚙️ Use in Scoring Architecture

### Similarity (use stress reliability)

```python
Similarity += w * (1 - abs(R_stress_A - R_stress_B))
```

---

### Perceived Reliability Composite

```python
PR =
    0.45 * R_stress +
    0.25 * CO +
    0.20 * RS -
    0.10 * RG
```

```python
Similarity += w_pr * (1 - abs(PR_A - PR_B))
ConstraintBonus += w_high * min(PR_A, PR_B)
```

---

## 🎯 Interpretation

- **R_stress** → “How reliable are they in real life?”
- **RG** → “How much do they fall short of their own standard?”

> RGI measures **trust fragility under stress**, not just effort or personality

## ⚠️ Reliability Gap — Risk Modeling (Core Value)

### 1. Individual Risk (nonlinear)

```python
phi(g) = max(0, g - tau) ** 2

Penalty += w * phi(RG_A)
Penalty += w * phi(RG_B)
```

---

### 2. High-Impact Interaction Risks

#### A) Gap × Threat Sensitivity (JS)

```python
Penalty += w1 * (RG_A * JS_B + RG_B * JS_A)
```

👉 Inconsistency triggers insecurity

---

#### B) Gap × Attachment Anxiety (AA)

```python
Penalty += w2 * (RG_A * AA_B + RG_B * AA_A)
```

👉 “You said you cared, but disappeared”

---

#### C) Gap × Closeness Needs (CA)

```python
Penalty += w3 * (RG_A * CA_B + RG_B * CA_A)
```

👉 High-needs partner + inconsistent partner = friction

---

#### D) Gap × Mind-Reading (MR)

```python
Penalty += w4 * (RG_A * MR_B + RG_B * MR_A)
```

👉 Ambiguity + expectation = misinterpretation loops

---

### 3. Pair Instability

```python
Penalty += w_pair * RG_A * RG_B
```

👉 Two inconsistent partners → no stabilizer

---

## 🧯 Stabilizing Buffers

#### A) Communication Directness

```python
Penalty -= k1 * (RG_A * CD_A + RG_B * CD_B)
```

👉 Explaining inconsistency reduces damage

---

#### B) Partner Emotional Stability

```python
Penalty -= k2 * (RG_A * ES_B + RG_B * ES_A)
```

👉 Stable partner absorbs inconsistency better

---

## 🧠 Minimal Implementation

```python
RG = max(0, R_trait - R_stress)

Penalty += 0.6 * (RG_A + RG_B)
Penalty += 1.0 * (RG_A * JS_B + RG_B * JS_A)
Penalty += 0.8 * (RG_A * AA_B + RG_B * AA_A)
Penalty -= 0.5 * (RG_A * CD_A + RG_B * CD_B)
```

---

## 🔥 Key Insight

> **Similarity uses what people do.
> Risk uses where they break.**

- Use **R_stress** → compatibility
- Use **RG** → trust & friction prediction

This is what turns your system from **trait matching → behavioral prediction**
