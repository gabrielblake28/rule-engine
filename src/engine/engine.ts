import { Trace } from "../condition/condition";
import { Rule } from "../rule/rule";
import { Decision, DecisionWithTrace, Kind, Options, Strategy } from "./engine.types";

export class RuleEngine<TFacts> {

  evaluate(facts: TFacts, rules: Rule<TFacts>[], opts?: Options): Decision {
    const { passed, failed } = this.run(facts, rules, opts, false);
    return this.toDecision(passed, failed, opts?.strategy);
  }

  evaluateWithTrace(facts: TFacts, rules: Rule<TFacts>[], opts?: Options): DecisionWithTrace {
    const { passed, failed, traces } = this.run(facts, rules, opts, true);
    return { ...this.toDecision(passed, failed, opts?.strategy), trace: traces };
  }

  private run(facts: TFacts, rules: Rule<TFacts>[], opts: Options | undefined, trace: boolean) {
    const passed: string[] = [];
    const failed: string[] = [];
    const traces: Trace[] = [];

    for (const rule of rules) {
      let ok: boolean;
      if (trace) {
        const tResult = rule.condition.explain(facts);
        traces.push(tResult);
        ok = tResult.result;
      } else {
        ok = rule.condition.evaluate(facts);
      }

      if (ok) passed.push(rule.name);
      else failed.push(rule.name);

      if (!opts?.strategy || opts.strategy === "all") continue;
      if (this.shouldStop(opts.strategy, passed, failed)) break;
    }

    return { passed, failed, traces };
  }

  private toDecision(passed: string[], failed: string[], strat?: Strategy): Decision {
    const kind: Kind = strat === "anyPass"
      ? (passed.length > 0 ? Kind.PASS : Kind.FAIL)
      : (failed.length === 0 ? Kind.PASS : Kind.FAIL);

    return kind === Kind.FAIL
      ? { result: kind, passed, failed }
      : { result: kind, passed };
  }

  private shouldStop(strat: Strategy, passed: string[], failed: string[]) {
    if (strat === "allPass" && failed.length > 0) return true;
    if (strat === "anyPass" && passed.length > 0) return true;
    return false;
  }
}
