import { Rule } from "../rule/rule";


export type Decision = {
  result: boolean,
  passed: string[],
  failed: string[],
}


export class RuleEngine<TFacts> {

  evaluate(facts: TFacts, rules: Rule<TFacts>[]): Decision {

    const passed: string[] = [];
    const failed: string[] = [];

    let noRulesFailed = true;

    for (const rule of rules) {
      if (!rule.condition.evaluate(facts)) {
        failed.push(rule.name)
        noRulesFailed = false;
        continue;
      }

      passed.push(rule.name)
    }


    const result: Decision = {
      result: noRulesFailed,
      passed,
      failed
    }


    return result;
  }

}
