import { Trace } from "../condition/condition";

export enum Kind {
  PASS = "pass",
  FAIL = "fail",
}

interface Pass {
  result: Kind.PASS;
  passed: string[];
}

interface Fail {
  result: Kind.FAIL;
  passed: string[];
  failed: string[];
}

export type Decision = Pass | Fail;
export type DecisionWithTrace = Decision & { trace: Trace[] };

const strategy = ["all", "allPass", "anyPass"] as const;
export type Strategy = typeof strategy[number];

export type Options = {
  strategy?: Strategy;
};
