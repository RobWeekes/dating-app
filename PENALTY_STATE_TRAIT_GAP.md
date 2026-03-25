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