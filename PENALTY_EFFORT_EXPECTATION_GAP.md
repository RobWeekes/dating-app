## ⚖️ Effort–Expectation Gap (EEG)

### Definition

The **Effort–Expectation Gap** measures the difference between:

- **Expected effort level** (how much they expect a partner to invest)
- **Actual effort delivered** (how much they personally invest when life gets demanding)

```python
effort_gap = max(0, Expected_EN - Actual_EN)
```

Where:
- **Expected_EN** = Effort & Investment Norms they expect from partner
- **Actual_EN** = Effort & Investment they actually show under pressure

---

## 🎯 What It Captures

> **"Do you expect high effort but don't personally deliver it?"**

- Small gap → realistic expectations, consistent effort
- Large gap → **expects partner to show up while vanishing under pressure**

---

## 🧠 Why It Matters

- Perceived unfairness is **the #1 resentment driver** (Gottman)
- Many users **demand commitment** but **disappear under stress**
- The gap reveals:
  - double standards
  - asymmetrical commitment
  - resentment from feeling deprioritized
  - hypocrisy (preaching vs doing)
  - relationship imbalance

---

## 🔗 Index Mapping

- **Primary:** Effort & Investment Norms (EN) + Conscientiousness (CO)
- **Secondary:**
  - Responsiveness (RS)
  - Emotional Regulation (ER)

---

## ⚠️ High-Risk Pattern

```python
Penalty += effort_gap * (1 - CO)
Penalty += effort_gap * (1 - RS)
```

👉 "I expect high effort" + "I disappear when busy" = **massive resentment risk**

---

## 🧩 Role in Matching System

- **Use in:** Risk Penalty layer (not similarity)
- Detects **unfair commitment expectations and hypocrisy**, not just effort level
- Especially harmful when:
  - paired with low CO (unreliable under stress)
  - paired with low RS (unresponsive when needed)
  - both partners have high effort gaps (mutual disappointment)

---

## 🔥 Key Insight

> **Effort Gap = integrity of commitment under pressure**

It separates:

- people who _expect commitment_
  from
- people who _actually show up when it's hard_

This is a **top-tier predictor of resentment and fairness collapse**.

---

## ⚙️ Construction

You need to combine:

### **Trait proxy (expectations):**

- **Q22** — Effort expectations when feeling uneven: "In a relationship, when effort starts to feel uneven, I usually …"
  - A = "Try to match the level of effort I want to see" (high expectation for effort matching)
  - B = "Notice it, but adjust depending on the situation" (flexible expectation)
  - C = "Feel frustrated if I'm not getting the effort I expect" (high expectation, low tolerance)

### **State proxies (actual behavior):**

- **Q19** — Effort under life stress: "When life gets busy or stressful, I usually …"
  - A = "Keep showing up pretty consistently" (high actual effort)
  - B = "Try to stay connected, but I can become less responsive" (medium effort, drops)
  - C = "Focus on what's most urgent and circle back later" (low effort, disappears)

- **Q28** — Personal consistency: "People close to me would likely say I'm …"
  - A = "Dependable and consistent" (high CO, high effort consistency)
  - B = "Warm but a little unpredictable" (medium CO, inconsistent)
  - C = "More spontaneous than consistent" (low CO, unreliable)

---

## 🧠 Algorithm

```python
# Trait (what they expect from partner)
Expected_EN = score(Q22)  # High score = expects significant effort

# State (what they actually deliver when pressure rises)
Actual_EN_1 = score(Q19)  # Effort during life stress
Actual_EN_2 = score(Q28)  # Conscientiousness/reliability as others see it

# Average actual effort
Actual_EN = (Actual_EN_1 + Actual_EN_2) / 2

# Effort gap = expectation vs reality
effort_gap = max(0, Expected_EN - Actual_EN)
```

---

## 🔍 Interpretation

### Small gap (< 0.2)
- Expectation: "I expect consistent effort"
- Action: "And I deliver it too"
- ✅ Fair, balanced, low resentment risk

### Medium gap (0.2–0.4)
- Expectation: "I expect effort"
- Action: "But I slack off under pressure"
- ⚠️ Moderate resentment risk, fairness concerns

### Large gap (> 0.4)
- Expectation: "I expect high, consistent effort"
- Action: "But I disappear when busy / stressed"
- 🔴 **HIGH RESENTMENT**: Partner feels deprioritized, hypocrisy recognized

---

## 💡 Integration Tips

### Combine with partner's Conscientiousness (CO)

```python
Interaction = user_A.effort_gap × user_B.CO
```

👉 "I expect effort but don't deliver" + "You're reliable" = **asymmetrical burden on reliable partner**

### Combine with reliability Gap Index (RGI)

```python
Interaction = effort_gap + RGI
```

👉 "I expect effort" + "I disappear when needed" = **double betrayal**

### Combine with partner's Responsiveness (RS)

```python
Risk = user_A.effort_gap × user_B.RS
```

👉 Effort-expectant lazy person + responsive partner = **responsive person burns out**

---

## 🎯 Summary

**EEG reveals the gap between:**
- "I expect you to show up for me"
- "But I disappear when life gets hard"

**This is one of the strongest predictors of:**
- Asymmetrical resentment
- Fairness collapse
- Partner burnout (if they're conscientious)
- Long-term relationship bitterness
