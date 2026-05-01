import { Trace } from "../condition/condition";
import { Rule } from "../rule/rule";
import { Decision, Kind, Options, Strategy } from "./engine.types";

export class RuleEngine<TFacts> {

  evaluate(facts: TFacts, rules: Rule<TFacts>[], opts?: Options): Decision {

    const passed: string[] = [];
    const failed: string[] = [];
    const traces: Trace[] = [];

    for (const rule of rules) {

      const result = opts?.trace
        ? rule.condition.explain(facts)
        : { result: rule.condition.evaluate(facts) };

      if (opts?.trace) traces.push(result as Trace);

      if (!result.result) {
        failed.push(rule.name)
      } else {
        passed.push(rule.name)
      }

      if (!opts?.strategy || opts?.strategy === "all") continue;

      if (this.shouldStop(opts.strategy, passed, failed)) break;

    }

    let kind: Kind;
    if (opts?.strategy === "anyPass") {
      kind = passed.length > 0 ? Kind.PASS : Kind.FAIL;
    } else {
      // all or allPass
      kind = failed.length === 0 ? Kind.PASS : Kind.FAIL;
    }

    const result: Decision = kind === Kind.FAIL ? {
      result: kind,
      passed,
      failed,
      trace: opts?.trace ? traces : undefined
    } : {
      result: kind,
      passed,
      trace: opts?.trace ? traces : undefined
    }

    return result;
  }

  private shouldStop(strat: Strategy, passed: string[], failed: string[]) {
    if (strat === "allPass" && failed.length > 0) return true;
    if (strat === "anyPass" && passed.length > 0) return true;
    return false;
  }
}
