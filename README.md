# TypeScript Rule Engine

A type-safe, composable rule engine built from scratch in TypeScript. It evaluates business rules against a typed set of facts using a tree-based condition model, with optional deep tracing to explain exactly why a rule passed or failed.

## What It Does

The engine takes a set of typed **facts** (e.g., a user profile, an order) and a list of **rules**, then evaluates each rule's condition to produce a **pass/fail decision**. Conditions can be combined with `AND` / `OR` logic, nested arbitrarily deep, and are evaluated with short-circuiting for performance. An `explain` mode returns a full execution trace so you can audit every leaf condition.

### Quick Example

```typescript
const ageCheck = new PredicateCondition("age > 18", (f: UserFacts) => f.age > 18);
const usCheck = new PredicateCondition("country === US", (f: UserFacts) => f.country === "US");

const rule: Rule<UserFacts> = {
  name: "eligible-rule",
  condition: new AndCondition("age > 18 AND US", [ageCheck, usCheck]),
  priority: 1,
};

const engine = new RuleEngine<UserFacts>();
const result = engine.evaluate(facts, [rule], { trace: true });
```

## Architecture Highlights

- **Type-safe facts** — Rules are generic over `TFacts`, so the compiler guarantees conditions only access valid fields.
- **Composite pattern** — `PredicateCondition` (leaf) and `AndCondition` / `OrCondition` (branch) share a common `Condition<TFacts>` base, enabling arbitrary nesting.
- **Short-circuit evaluation** — `AND` stops at the first false child; `OR` stops at the first true child, avoiding unnecessary work.
- **Explainability** — Every condition implements `explain(facts)`, returning a typed `Trace` tree. The engine can toggle tracing on/off for a fast path vs. an auditable path.
- **Clean separation** — `Rule` (metadata + priority), `Condition` (logic tree), and `RuleEngine` (orchestration + decision formatting) are decoupled.

## Tech Stack

- **TypeScript** — Strict typing, generics, and discriminated unions for trace nodes.
- **Vitest** — Unit tests covering leaf predicates, composite logic, and edge cases.

## Learning Goals

I built this project to practice:

1. **Generics & type-level design** — Using `TFacts` to make the entire rule graph type-safe without leaking implementation details.
2. **Composite & Strategy patterns** — Designing a small internal DSL where leaf predicates and composite logic are interchangeable.
3. **Performance-aware evaluation** — Implementing short-circuit logic manually and separating traced vs. untraced evaluation paths.
4. **Observability in rule systems** — Adding first-class tracing (`explain`) so failures are inspectable, not opaque boolean results.
5. **TDD with Vitest** — Writing tests before/while building the `And`, `Or`, and `Predicate` condition classes.

## Running It

```bash
# Run tests
npm test

# Run examples
npx tsx examples/basic.ts
npx tsx examples/nested.ts
```
