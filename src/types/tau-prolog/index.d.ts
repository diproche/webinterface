export namespace type {
  export class Session{
    constructor(stepLimit: number);
    consult(codebase: string): void;
    query(query: string): void;
    answer(callbackFunction: (x: any) => void): void;
  }
}

export function format_answer(output: any): string;
