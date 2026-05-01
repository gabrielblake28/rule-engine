
enum NodeKind {
  LEAF = "leaf",
  AND = "and",
  OR = "or",
  NOT = "not"
}

interface LeafTrace {
  kind: NodeKind.LEAF,
  label: string | undefined,
  result: boolean,
}

interface AndTrace {
  kind: NodeKind.AND,
  label: string | undefined,
  result: boolean,
  children: Trace[]
}

interface OrTrace {
  kind: NodeKind.OR,
  label: string | undefined,
  result: boolean,
  children: Trace[]
}

interface NotTrace {
  kind: NodeKind.NOT,
  label: string | undefined,
  result: boolean,
  children: Trace
}

export type Trace = LeafTrace | AndTrace | OrTrace | NotTrace;


export abstract class Condition<TFacts> {
  abstract evaluate(facts: TFacts): boolean;
  abstract explain(facts: TFacts): Trace;

  constructor(public label?: string) { };

  // and(other: Condition<TFacts>) { return new AndCondition(this.label, [this, other]); }
  // or(other: Condition<TFacts>) { return new OrCondition(this.label, [this, other]); }
  // not() { return new NotCondition(this); }
}


export class PredicateCondition<TFacts> extends Condition<TFacts> {

  constructor(public label: string, private fn: (facts: TFacts) => boolean) {
    super(label)
  }

  evaluate(facts: TFacts): boolean {
    return this.fn(facts);
  }

  explain(facts: TFacts): Trace {
    return {
      kind: NodeKind.LEAF,
      label: this.label,
      result: this.fn(facts),
    }
  }
}


export class AndCondition<TFacts> extends Condition<TFacts> {
  constructor(private children: Condition<TFacts>[], public label?: string) {
    super(label)
  }

  evaluate(facts: TFacts) {
    return this.children.every(child => child.evaluate(facts))
  }

  explain(facts: TFacts): Trace {

    const traces = [];
    let result = true;

    for (const child of this.children) {
      const childTrace = child.explain(facts);
      traces.push(childTrace);

      if (!childTrace.result) {
        result = false
        break; // short curcuit (stops the loop)
      }
    }

    return { kind: NodeKind.AND, label: this.label, result, children: traces }
  }
}


export class OrCondition<TFacts> extends Condition<TFacts> {
  constructor(private children: Condition<TFacts>[], public label?: string) {
    super(label)
  }

  evaluate(facts: TFacts) {
    return this.children.some(child => child.evaluate(facts))
  }

  explain(facts: TFacts): Trace {

    const traces = [];
    let result = false;

    for (const child of this.children) {
      const childTrace = child.explain(facts);
      traces.push(childTrace);

      if (childTrace.result) {
        result = true
        break; // short curcuit (stops the loop)
      }
    }

    return { kind: NodeKind.OR, label: this.label, result, children: traces }
  }
}

export class NotCondition<TFacts> extends Condition<TFacts> {
  constructor(private child: Condition<TFacts>, public label?: string) {
    super(label);
  }

  evaluate(facts: TFacts): boolean {
    return !this.child.evaluate(facts)
  }

  explain(facts: TFacts): Trace {
    const childTrace = this.child.explain(facts);
    return {
      kind: NodeKind.NOT,
      label: this.label,
      result: !childTrace.result,
      children: childTrace,
    };
  }
}

