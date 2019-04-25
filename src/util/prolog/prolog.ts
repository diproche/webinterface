import { format_answer, type } from "tau-prolog/modules/core";

export class PrologSession {
    public readonly session: any;

    constructor(program: string, limit?: number) {
        this.session = new type.Session(limit);
        //Loadig the program already fetches writes to a file in case of open -> write -> close
        this.session.consult(program);
    }

    public async executeQuery(query: string): Promise<string[]> {
        this.session.query(query);

        const results: string[] = [];

        let result: string;
        do {
            result = await this.getNextAnswer();
            results.push(result);
        } while (result[result.length - 1] !== ".");
        //this could be checked more reliably with the this.session.step() method
        //it returns an undefined if the end of the threat has been reached, but it does a step when called

        return results;
    }

    private getNextAnswer() {
        return new Promise<string>((resolve, reject) => {
            this.session.answers((x: any) => {
                resolve(format_answer(x));
            });
        });
    }
}
