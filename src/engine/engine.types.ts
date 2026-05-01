import { Trace } from "../condition/condition";

export enum Kind {
  PASS = "pass",
  FAIL = "fail"
}

// Pass
interface PassWithTrace {
  result: Kind.PASS,
  passed: string[],
  trace: Trace[],
}

interface PassWithoutTrace {
  result: Kind.PASS,
  passed: string[],
}

type Pass = PassWithTrace | PassWithoutTrace;

// Fail
interface FailWithTrace {
  result: Kind.FAIL,
  passed: string[],
  failed: string[],
  trace: Trace[],
}

interface FailWithoutTrace {
  result: Kind.FAIL,
  passed: string[],
  failed: string[],
}

type Fail = FailWithTrace | FailWithoutTrace

export type Decision = Pass | Fail

const strategy = ["all", "allPass", "anyPass"] as const;
export type Strategy = typeof strategy[number];

export type Options = {
  trace: boolean
  strategy: Strategy
}

