/** Shared eval types. */
export interface CaseExpectation {
  behavior: string;
  mustIncludeAny?: string[];
  mustNotInclude?: string[];
  shouldBlock?: boolean;
  shouldCallTool?: string;
}

export interface EvalCase {
  name: string;
  category: string;
  messages: { role: "user" | "assistant"; content: string }[];
  expect: CaseExpectation;
}

export interface CaseOutput {
  finalText: string;
  blocked: boolean;
  toolsCalled: string[];
}

export interface Verdict {
  pass: boolean;
  reason: string;
}
