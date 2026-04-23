

export abstract class Condition<TFacts> {
  abstract evaluate(facts: TFacts): boolean;

  and(other: Condition<TFacts>) { return new AndCondition([this, other]); }
  or(other: Condition<TFacts>) { return new OrCondition([this, other]); }
  not() { return new NotCondition(this); }
}


export class BaseCondition<TFacts> extends Condition<TFacts> {

  constructor(private fn: (facts: TFacts) => boolean) {
    super()
  }

  evaluate(facts: TFacts): boolean {
    return this.fn(facts);
  }
}


export class AndCondition<TFacts> extends Condition<TFacts> {
  constructor(private children: Condition<TFacts>[]) {
    super()
  }

  evaluate(facts: TFacts) {
    return this.children.every(child => child.evaluate(facts))
  }
}


export class OrCondition<TFacts> extends Condition<TFacts> {
  constructor(private children: Condition<TFacts>[]) {
    super()
  }

  evaluate(facts: TFacts) {
    return this.children.some(child => child.evaluate(facts))
  }
}

export class NotCondition<TFacts> extends Condition<TFacts> {
  constructor(private child: Condition<TFacts>) {
    super();
  }

  evaluate(facts: TFacts): boolean {
    return !this.child.evaluate(facts)
  }
}

