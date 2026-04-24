import { describe, expect, test } from 'vitest';
import { AndCondition, PredicateCondition, NotCondition, OrCondition } from './condition';
import { Direction, Fact, MemberType } from '../utils/testHelpers';

const TestFact = {
  name: "TestFact",
  direction: Direction.Down,
  memberType: MemberType.Pro,
  value: 99
}

const trueCondition = new PredicateCondition((facts: Fact) => facts.name === "TestFact");
const falseCondition = new PredicateCondition((facts: Fact) => facts.value > 100);

const trueConditionTwo = new PredicateCondition((facts: Fact) => facts.direction === Direction.Down);
const falseConditionTwo = new PredicateCondition((facts: Fact) => facts.memberType === MemberType.Free);

const trueAndCondition = new AndCondition([trueCondition, trueConditionTwo]);
const falseAndWithBothFalseConditions = new AndCondition([falseCondition, falseConditionTwo]);
const falseAndWithOneFalseCondition = new AndCondition([trueCondition, falseCondition]);

const trueOrWithBothTrueConditions = new OrCondition([trueCondition, trueConditionTwo]);
const trueOrWithOneTrueCondition = new OrCondition([trueCondition, falseCondition]);
const falseOrCondition = new OrCondition([falseCondition, falseConditionTwo]);

const notTrueCondition = new NotCondition(trueCondition);
const notFalseCondition = new NotCondition(falseCondition);

describe("PredicateCondition", () => {

  test("evaluate returns true when condition is met", () => {
    expect(trueCondition.evaluate(TestFact)).toBeTruthy()
  })


  test("evaluate returns false when condition is met", () => {
    expect(falseCondition.evaluate(TestFact)).toBeFalsy()
  })

})


describe("AndCondition", () => {

  test("evaluate return true when both conditions are ture", () => {
    expect(trueAndCondition.evaluate(TestFact)).toBeTruthy()
  })

  test("evaluate return false when both conditions are false", () => {
    expect(falseAndWithBothFalseConditions.evaluate(TestFact)).toBeFalsy()
  })

  test("evaluate return false when one conditions is false", () => {
    expect(falseAndWithOneFalseCondition.evaluate(TestFact)).toBeFalsy()
  })

})


describe("OrCondition", () => {

  test("evaluate return true when both conditions are true", () => {
    expect(trueOrWithBothTrueConditions.evaluate(TestFact)).toBeTruthy()
  })

  test("evaluate return true when one condition is true", () => {
    expect(trueOrWithOneTrueCondition.evaluate(TestFact)).toBeTruthy()
  })

  test("evaluate return false when both conditions are false", () => {
    expect(falseOrCondition.evaluate(TestFact)).toBeFalsy()
  })

})


describe("NotCondition", () => {

  test("evaluate returns false when inner condition is true", () => {
    expect(notTrueCondition.evaluate(TestFact)).toBeFalsy()
  })

  test("evaluate returns true when inner condition is false", () => {
    expect(notFalseCondition.evaluate(TestFact)).toBeTruthy()
  })

})
