## 🧭 Emotional Responsibility Gap (ERG)

### Definition

The **Emotional Responsibility Gap** measures the difference between:

- **Stated attribution style** (who they believe is responsible for their emotions)
- **Actual attribution under stress** (who they blame when really upset)

```python
emotion_gap = max(0, ER2_trait - ER2_state)
```

---

## 🎯 What It Captures

> **"Do you take ownership of your emotions—or blame your partner under stress?"**

- Small gap → consistent accountability
- Large gap → **blame-shifting under emotional pressure**

---

## 🧠 Why It Matters

- Accountability is **foundational to conflict repair**
- Many users **believe they own their emotions** but **blame their partner when upset**
- The gap reveals:
  - defensive patterns
  - inability to regulate during conflict
  - potential for escalation and blame cycles
  - core relationship toxicity predictor

---

## 🔗 Index Mapping

- **Primary:** Emotional Responsibility (ER2)
- **Secondary:**
  - Negative Conflict Style (NC) _(inverse)_
  - Emotional Regulation (ER) _(inverse)_

---

## ⚠️ High-Risk Pattern

```python
Penalty += emotion_gap_A * NC_A
Penalty += emotion_gap_A * (1 - ER_A)
```

👉 "I own my emotions" + "I blame under stress" = **false accountability signal**

---

## 🧩 Role in Matching System

- **Use in:** Risk Penalty layer (not similarity)
- Detects **blame-shifting and defensive cycles**, not just conflict style
- Especially harmful when:
  - paired with high NC (escalates blame)
  - paired with low ER (can't regulate)
  - both partners have high emotion gaps (mutual blame loop)

---

## 🔥 Key Insight

> **Emotion Gap = integrity of responsibility under stress**

It separates:

- people who _value accountability_
  from
- people who _actually own their emotions when upset_

This is a **top-tier predictor of defensiveness and relationship toxicity**.

---

## ⚙️ Construction

You need to combine:

### **Trait proxy (calm state):**

- **Q5** — Attribution belief: "In a relationship, when I have a strong reaction, I tend to see it as …"
  - A = "Largely my own interpretation" (high ER2)
  - B = "A mix of my perspective and my partner's actions" (medium ER2)
  - C = "My partner is causing me to feel a certain way" (low ER2)

### **State proxies (under stress):**

- **Q7** — Attribution under upset: "When I'm really upset in a relationship, I tend to …"
  - A = "Notice my reaction and try to understand it" (high ER2 under stress)
  - B = "Feel caught between my reaction and what my partner did" (defensive)
  - C = "Feel like my partner is the cause of it" (blame under stress)

---

## 🧠 Algorithm

```python
# Trait (identity / belief)
ER2_trait = score(Q5)

# State (behavior when really upset)
ER2_state = score(Q7)

emotion_gap = max(0, ER2_trait - ER2_state)
```

---

## 🔍 Interpretation

### Small gap (< 0.2)
- Says: "I own my emotions"
- Does: Takes responsibility even when upset
- ✅ Reliable accountability, low blame cycle risk

### Medium gap (0.2–0.4)
- Says: "I try to own my emotions"
- Does: Sometimes blames under pressure
- ⚠️ Moderate defensiveness risk

### Large gap (> 0.4)
- Says: "I own my emotions"
- Does: Blames partner when upset (A→C)
- 🔴 High toxicity risk, escalation cycles, defensive loops

---

## 💡 Integration Tip

Combine with **Reactivity Gap** (increase in NC under stress) to detect:

```python
Interaction = emotion_gap × reactivity_gap
```

👉 High emotion gap + High reactivity gap = **toxic escalation pattern**

Both mean: "Blames AND escalates" under stress = relationship danger zone

---

## 🎯 Summary

**ERG reveals the gap between:**
- "I take responsibility for my emotions"
- "But when really upset, I blame you"

**This is one of the strongest predictors of:**
- Conflict escalation
- Blame cycles
- Trust erosion
- Relationship breakdown
