## 🔧 Repair Gap (RG2)

### Definition

The **Repair Gap** measures the difference between:

- **Stated repair tendency** (how much someone _believes_ they repair conflict well)
- **Actual repair behavior under stress** (what they _do after conflict_)

```python
repair_gap = max(0, Repair_trait - Repair_state)
```

---

## 🎯 What It Captures

> **“Do you actually repair when it matters?”**

- Small gap → consistent repair behavior
- Large gap → _failure to repair under stress_

---

## 🧠 Why It Matters

- Repair ability is the **strongest predictor of relationship longevity**
- Many users **overestimate** their repair behavior
- The gap reveals:
  - missed reconnection attempts
  - prolonged disconnection
  - unresolved conflict cycles

---

## 🔗 Index Mapping

- **Primary:** Conflict Repair (CR)
- **Secondary:**
  - Negative Conflict Style (NC) _(inverse)_
  - Emotional Regulation (ER)

---

## ⚠️ High-Risk Pattern

```python
Penalty += repair_gap_A * NC_A
Penalty += repair_gap_A * (1 - CR_A)
```

👉 “I think I repair” + “I escalate or avoid” = **false repair signal**

---

## 🧩 Role in Matching System

- **Use in:** Risk Penalty layer (not similarity)
- Detects **trust breakdown after conflict**, not just conflict style
- Especially harmful when:
  - paired with high NC
  - paired with low ER
  - both partners have high repair gaps

---

## 🔥 Key Insight

> **Repair Gap = integrity of repair under stress**

It separates:

- people who _value repair_
  from
- people who _actually reconnect after conflict_

This is a **top-tier predictor of long-term relationship stability**.

---

Repair Gap = Trait (intention) − State (behavior under stress)

Needed:

- What they believe / intend to do (trait)
- What they actually do in the moment (state)

✅ Best “STATE” signals (what they actually do)
Q2.3 — Reaction to criticism

✔️ Strong in-the-moment behavior under threat

- A = repair-compatible
- B = defensive (blocks repair)
- C = escalatory (anti-repair)

👉 This is your cleanest state disruption signal

Q2.5 — When I hurt a partner

✔️ Strong accountability under pressure

- A = active repair
- B = avoidant deflection
- C = justificatory (blocks repair)

👉 This is also state behavior, especially tied to responsibility

---

## 🧩 So what actually identifies the Repair Gap?

You need to combine:

### **Trait proxy:**

- **Q2.2** (how they say they repair)

### **State proxies:**

- **Q2.3** (how they react under threat)
- **Q2.5** (how they act when accountable)
  ⚙️ Constructing the Repair Gap
  Step 1: Encode repair signals

Example:python

```
# Trait (self-image)
R_trait = score(Q2_2)

# State (behavior under stress)
R_state = 0.5 * score(Q2_3) + 0.5 * score(Q2_5)

repair_gap = max(0, R_trait - R_state)
```

🧠 Interpretation
Small gap
- Says they repair
- Actually repairs

👉 Reliable reconnection

Large gap
- Says they repair
- But:
    - gets defensive (Q2.3 B/C)
    - voids accountability (Q2.5 B/C)

👉 “False repair” profile

---

🔥 Why this matters

Without the gap:

You’d score someone high on CR because of Q2.2
But miss that they:
- get defensive
- avoid responsibility

👉 That’s exactly the person who says:

“I always try to fix things”

…but doesn’t.

✅ Q2.2 + (Q2.3, Q2.5) approximate Repair Gap well

---

Use this:

**Q2.5** After an argument, when things still feel tense, I usually …

- **Format:** single | **Weight:** critical
- **Options:**
  A) Try to smooth things over, even if it's a bit uncomfortable
  B) Give it some time, then come back and reconnect
  C) Wait for the tension to pass, or for them to reach out first

**High signal for Repair Gap**

This specifically captures:
- Repair behavior under residual emotional tension

Use as Repair State anchor:

```python
R_trait = score(Q2_2)          # stated repair tendency
R_state = score(Q2_6)          # actual behavior under tension

repair_gap = max(0, R_trait - R_state)
```

Optionally blend with existing items:

```python
R_state = 0.5 * Q2_6 + 0.25 * Q2_3 + 0.25 * Q2_5
```

**Why this question is valuable**

Most items measure:

- what people intend to do after conflict

This one measures:

- what they do when repair feels uncomfortable and effortful
