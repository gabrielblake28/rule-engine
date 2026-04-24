import { Rule } from "../rule/rule";


interface Pass {
  kind: "pass",
  passed: string[],
  // trace: Trace[]
}

interface Fail {
  kind: "fail",
  passed: string[],
  failed: string[],
  // trace: Trace[],
}


export type Decision = Pass | Fail


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

    const result: Decision = failed.length > 0 ? {
      kind: "pass",
      passed
    } : {
      kind: "fail",
      passed,
      failed
    }


    return result;
  }

}
