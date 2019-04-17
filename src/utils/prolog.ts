import * as tauProlog from "tau-prolog/modules/core";

export class PrologSession {
    public readonly session: any;

    constructor(program: string, limit?: number) {
        this.session = new tauProlog.type.Session(limit);
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

        return results;
    }

    private getNextAnswer() {
        return new Promise<string>((resolve, reject) => {
            this.session.answers((x: any) => {
                resolve(tauProlog.format_answer(x));
            });
        });
    }
}
