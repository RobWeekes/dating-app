## 🔥 Reactivity Gap (ReG)

### Definition

The **Reactivity Gap** measures how much someone's conflict style **worsens under stress**:

```python
reactivity_gap = max(0, NC_under_stress - NC_baseline)
```

Where:
- **NC_baseline** = Negative Conflict Style score in calm state
- **NC_under_stress** = Negative Conflict Style score when upset

---

## 🎯 What It Captures

> **"How much worse do they get under emotional pressure?"**

- Small gap → consistent behavior, predictable
- Large gap → **escalates, loses control, becomes hostile under stress**

---

## 🧠 Why It Matters

- Escalation is the **relationship violence predictor** (Gottman research)
- Many users are **calm until triggered**, then become dangerous
- The gap reveals:
  - loss of emotional control
  - defensiveness spike
  - aggression / hostility under pressure
  - potential for emotional damage
  - breakdown of communication

---

## 🔗 Index Mapping

- **Primary:** Negative Conflict Style (NC)
- **Secondary:**
  - Emotional Regulation (ER) _(inverse)_
  - Emotional Stability (ES) _(inverse)_

---

## ⚠️ High-Risk Pattern

```python
Penalty += reactivity_gap * (1 - ER)
Penalty += reactivity_gap * (1 - ES)
```

👉 "I stay calm" + "I escalate when upset" = **false control signal**

---

## 🧩 Role in Matching System

- **Use in:** Risk Penalty layer (not similarity)
- Detects **emotional escalation and loss of control**, not just conflict style
- Especially harmful when:
  - paired with low ER (can't regulate)
  - paired with low ES (emotionally unstable)
  - both partners have high reactivity (mutual escalation spiral)

---

## 🔥 Key Insight

> **Reactivity Gap = emotional control integrity under stress**

It separates:

- people who _say they're calm_
  from
- people who _actually stay calm when upset_

This is a **top-tier predictor of relationship damage and conflict toxicity**.

---

## ⚙️ Construction

You need to compare baseline conflict style vs upset conflict style:

### **Baseline (calm state):**

- **Q8** — Baseline conflict: "If there's a small disagreement, I usually …"
  - A = "Stay engaged and address it directly" (low NC)
  - B = "Take some space before dealing with it" (medium NC)
  - C = "Let it go or distance myself from it" (high NC, avoidant)

### **State proxies (under stress):**

- **Q1** — Reaction to perceived withdrawal: "When I sense my partner pulling away, I tend to:"
  - A = "Check in and try to understand" (low NC)
  - B = "Give them space but stay available" (low/medium NC)
  - C = "Feel like something's wrong and react (chase / pull back)" (high NC, reactive)

- **Q4** — Reaction when very upset: "When I'm very upset with someone, I tend to …"
  - A = "Stay engaged and try to work it out" (low NC)
  - B = "Pull back to settle myself first" (medium NC)
  - C = "React strongly (push, vent, or seek reassurance)" (high NC, escalatory)

---

## 🧠 Algorithm

```python
# Baseline NC (calm state)
NC_baseline = score(Q8)

# Escalation signals when stressed
NC_upset_1 = score(Q1_C)  # Reactive escalation to withdrawal
NC_upset_2 = score(Q4_C)  # Aggressive escalation when upset

# Average escalation under stress
NC_under_stress = (NC_upset_1 + NC_upset_2) / 2

# Reactivity gap = how much worse
reactivity_gap = max(0, NC_under_stress - NC_baseline)
```

---

## 🔍 Interpretation

### Small gap (< 0.2)
- Baseline: "I handle disagreement calmly"
- Under stress: "Still handles it relatively calmly"
- ✅ Emotionally stable, controlled, safe

### Medium gap (0.2–0.4)
- Baseline: "I can handle disagreement"
- Under stress: "But I do escalate some"
- ⚠️ Moderate escalation risk, manageable with support

### Large gap (> 0.4)
- Baseline: "I'm pretty calm"
- Under stress: "But I get hostile / reactive / aggressive"
- 🔴 **HIGH DANGER**: Escalation spiral, emotional damage

---

## 💡 Integration Tips

### Combine with Emotional Regulation (ER)

```python
Interaction = reactivity_gap × (1 - ER)
```

👉 High reactivity gap + Low ER = **explosive escalation pattern**

### Combine with Emotional Responsibility Gap (ERG)

```python
Interaction = reactivity_gap × emotion_gap
```

👉 "I escalate AND blame you" = **mutual damage cycle**

### Combine with partner's Emotional Stability (ES)

```python
Risk = user_A.reactivity_gap × user_B.ES
```

👉 Highly reactive person + stable/absorbing partner = **emotional damage to stable person**

---

## 🎯 Summary

**ReG reveals the gap between:**
- "I handle conflict calmly"
- "But when stressed, I escalate / get aggressive"

**This is one of the strongest predictors of:**
- Conflict escalation spirals
- Emotional abuse patterns
- Relationship trauma
- Relationship termination
