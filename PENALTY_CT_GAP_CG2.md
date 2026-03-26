## 🤝 Closeness Tolerance Gap (CG2)

### Definition

The **Closeness Tolerance Gap** measures the difference between:

* **Stated tolerance for closeness mismatch (trait)**
* **Actual reaction to sustained closeness (state)**

```python
CG2 = max(0, Claimed_Tolerance - Observed_Tolerance_under_load)
```

---

## 🎯 What It Captures

> **“Do you handle closeness as well as you think you do?”**

* Small gap → tolerance is **real and stable**
* Large gap → tolerance **breaks down under sustained closeness**

---

## 🧠 Why It Matters

Many people believe they are flexible in relationships—but:

* feel overwhelmed after extended closeness
* become avoidant or irritable over time
* misinterpret their own need for space

This creates:

* push–pull dynamics
* sudden distancing
* confusion for partners (“they seemed fine before”)

---

## 🔗 Index Mapping

* **Primary:** Closeness Tolerance (CT)
* **Secondary:** Attachment Avoidance (AV), Emotional Regulation (ER)

---

## 📊 Measurement

### Trait (claimed tolerance)

* Q3.3 → tolerance for mismatch

### State (under load)

* Q3.11 → reaction after sustained closeness

---

## ⚠️ High-Risk Pattern

```python
if CT high and CG2 high:
    risk += instability_penalty
```

👉 Appears flexible, but becomes overwhelmed in real situations

---

## 🧩 Role in Matching System

Used to **adjust effective tolerance**:

```python
effective_CT = CT * (1 - CG2)
```

* Reduces overestimated flexibility
* Improves closeness compatibility scoring
* Prevents mismatches that look good on paper

---

## 🔥 Key Insight

> **Closeness Gap = difference between perceived flexibility and lived capacity**

It separates:

* people who can truly handle closeness
  from
* people who *think* they can, but disengage over time

This is a **core driver of avoidant drift and relationship instability**.

---

## CG2 vs Attachment Avoidance (AV)

### 🧠 Core Distinction

**🧩 Attachment Avoidance (AV)**

Preference / orientation toward distance

- “I don’t want that much closeness”
- Stable across contexts
- Identity-consistent

**⚠️ Closeness Gap (CG2)**

Capacity failure under closeness

- “I thought I could handle this, but I can’t”
- Emerges over time / under load
- Often surprising to the person themselves

---

**Deconfound two signals that often blur together.**

### 🎯 How to Separate Them Cleanly
**Step 1: Anchor each construct to different question types**
**AV → preference questions**
- Q3.2 (desired closeness)
- Q1.6 (support style)
- Q3.1 (reaction to partner wanting more)

👉 “What do you want?”

**CG2 → state breakdown questions**
- Q3.3 (claimed tolerance)
- Q3.11 (reaction after sustained closeness)

👉 “What actually happens over time?”

---

**🧪 Step 2: Decompose observed behavior**

Instead of:

```python
distance_behavior = AV + CG2  # ❌ confounded
```

Do:

```python
baseline_distance = AV
excess_distance = max(0, observed_withdrawal - AV)

CG2 ≈ excess_distance
```

👉 This isolates:

- **expected distance (AV)**
- vs
- **unexpected breakdown (CG2)**

---

**📊 Step 3: Residualize CG2 against AV**

Statistically:

```python
CG2_adjusted = CG2_raw - α * AV
```

Where:

- α ≈ correlation coefficient between AV and CG2

👉 Removes overlap

---

### 🔥 Practical Interpretation Layer

4 Archetypes
1. **Low AV, Low CG2**
- Wants closeness
- Handles it well
  - **👉 Secure / ideal**
2. **High AV, Low CG2**
- Prefers space
- Consistent about it
  - **👉 Stable avoidant (predictable)**
3. **Low AV, High CG2**
- Wants closeness
- Gets overwhelmed
  - **👉 Push–pull / anxious-avoidant hybrid ⚠️**
4. **High AV, High CG2**
- Avoidant + unstable
  - **👉 High-risk pairing profile**

---

## 🧩 Using AV vs CG2 in Your Matching System

### 1. Matching (Compatibility Layer)

Use **Attachment Avoidance (AV)** to model alignment in closeness preferences:

```python
compatibility += f(CA_A, CA_B, AV_A, AV_B)
```

* Captures **desired level of closeness vs independence**
* Drives **long-term satisfaction**
* Determines whether two people *want the same relationship style*

---

### 2. Risk Modeling (Stability Layer)

Use **Closeness Tolerance Gap (CG2)** to model breakdown under sustained closeness:

```python
Risk += CG2_A * (1 - ER_A)
Risk += CG2_B * (1 - ER_B)
```

* Captures **instability over time**
* Predicts **withdrawal, overwhelm, and push–pull dynamics**
* Especially important in otherwise “good-on-paper” matches

---

### 3. Combined Behavioral Effect

```python
Effective_withdrawal = AV + CG2
```

* **AV** = expected, preference-driven distance
* **CG2** = unexpected, stress-driven withdrawal

👉 Same behavior, different cause

---

### ⚠️ Key Rule

* Use **AV for matching (fit)**
* Use **CG2 for risk (stability)**

Do not treat them as interchangeable.

---

## 🔥 Key Insight

> AV predicts whether a relationship *fits*
>
> CG2 predicts whether it *holds up over time*
