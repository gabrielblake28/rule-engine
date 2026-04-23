import { Condition } from "../condition/condition";



export interface Rule<TFacts> {
  name: string,
  description: string | undefined;
  condition: Condition<TFacts>;
  priority: number
}

