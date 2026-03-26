## 💬 Communication Gap (CG)

### Definition

The **Communication Gap** measures the difference between:

- **Stated expectation for clarity** (what they expect partners to understand)
- **Actual directness in expression** (how clearly they communicate in reality)

```python
communication_gap = max(0, Need_for_clarity - Communication_directness)
```

Where:
- **Need_for_clarity** = How much they expect mind-reading (MR index, inverse)
- **Communication_directness** = How directly they actually express concerns (CD index)

---

## 🎯 What It Captures

> **"Do you say what you expect—or expect others to read your mind?"**

- Small gap → clear expectations, direct communication
- Large gap → **expects mind-reading but avoids direct expression**

---

## 🧠 Why It Matters

- Silent frustration is **one of the strongest relationship toxins** (Gottman)
- Many users **expect partners to know** but **don't tell them clearly**
- The gap reveals:
  - indirect / passive-aggressive communication
  - unmet expectations
  - chronic misunderstanding
  - resentment from "you should have known"
  - failure to resolve issues

---

## 🔗 Index Mapping

- **Primary:** Communication Directness (CD) + Mind-Reading Expectation (MR, inverse)
- **Secondary:**
  - Emotional Responsibility (ER2)
  - Assertiveness–Agreeableness Balance (AG)

---

## ⚠️ High-Risk Pattern

```python
Penalty += communication_gap * MR
```

👉 "They should understand what I need" + "I don't say it clearly" = **guaranteed misunderstanding**

---

## 🧩 Role in Matching System

- **Use in:** Risk Penalty layer (not similarity)
- Detects **communication misalignment and frustration cycles**, not just conflict style
- Especially harmful when:
  - paired with high MR (partner also expects mind-reading)
  - paired with low AG (less willing to adapt/clarify)
  - both partners have high communication gaps (mutual silent frustration)

---

## 🔥 Key Insight

> **Communication Gap = integrity of expression vs expectation**

It separates:

- people who _expect to be understood_
  from
- people who _actually communicate clearly_

This is a **top-tier predictor of chronic frustration and relationship erosion**.

---

## ⚙️ Construction

You need to combine:

### **Trait proxy (expectations):**

- **Q15** — Mind-Reading Expectation: "In relationships, I usually feel that a good partner should …"
  - A = "Understand most needs even if not everything is said" (high MR, expects mind-reading)
  - B = "Understand some things, but clear communication still matters" (medium MR)
  - C = "Not be expected to know unless it's said directly" (low MR, realistic)

### **State proxies (actual behavior):**

- **Q14** — Directness with concerns: "When something concerns me in a relationship, I'm more likely to …"
  - A = "Point it out pretty directly" (high CD, direct)
  - B = "Hint at it and hope it's picked up" (medium CD, indirect)
  - C = "Wait to see if they notice on their own" (low CD, very indirect)

- **Q20** — Directness with important matters: "When something is important to me in a relationship, I usually …"
  - A = "Say it clearly, even if it feels a bit uncomfortable" (high CD, direct)
  - B = "Try to imply it or ease into it" (medium CD, indirect)
  - C = "Assume they'll pick up on it without me saying much" (low CD, very indirect)

---

## 🧠 Algorithm

```python
# Trait (expectation for being understood)
MR_expectation = score(Q15)  # Inverse: high score = expects mind-reading

# State (actual directness in communication)
CD_behavior_1 = score(Q14)  # Directness with concerns
CD_behavior_2 = score(Q20)  # Directness with important matters

# Average directness
CD_average = (CD_behavior_1 + CD_behavior_2) / 2

# Communication gap = expectation vs behavior
communication_gap = max(0, MR_expectation - CD_average)
```

---

## 🔍 Interpretation

### Small gap (< 0.2)
- Expectation: "Partners should understand without being told"
- Behavior: "I communicate pretty clearly"
- ✅ Realistic expectations, low frustration risk

### Medium gap (0.2–0.4)
- Expectation: "Some things should be implied"
- Behavior: "But I'm mostly direct"
- ⚠️ Occasional misunderstanding, manageable frustration

### Large gap (> 0.4)
- Expectation: "They should just know"
- Behavior: "But I barely tell them anything directly"
- 🔴 **HIGH FRUSTRATION**: Chronic "you should have known" cycles

---

## 💡 Integration Tips

### Combine with partner's Mind-Reading Expectation (MR)

```python
Interaction = user_A.communication_gap × user_B.MR
```

👉 "I don't communicate clearly" + "You expect mind-reading" = **mutual frustration spiral**

### Combine with Emotional Responsibility Gap (ERG)

```python
Interaction = communication_gap × emotion_gap
```

👉 "I'm unclear" + "I blame you for not understanding" = **defensiveness + misunderstanding**

### Combine with partner's Communication Directness (CD)

```python
Risk = user_A.communication_gap × (1 - user_B.CD)
```

👉 Indirect communicator + indirect partner = **issues never surface, silent resentment builds**

---

## 🎯 Summary

**CG reveals the gap between:**
- "You should understand what I need"
- "But I don't really tell you clearly"

**This is one of the strongest predictors of:**
- Chronic silent frustration
- "You should have known" cycles
- Unresolved misunderstandings
- Relationship erosion (slow burn)
