/**
 * generate a random example object including a discription and the generated example-content
 * @return the example object
 */
export function generateRandomExample(): Example {
	const exampleClassNumber: number = exampleRandomClassNumberGenerator();
	const exampleDiscription = matchExampleDiscription(exampleClassNumber);
	const exampleContent = generateExampleContent(exampleClassNumber);
	const example: Example = new Example();
	example.exampleDiscription = exampleDiscription;
	example.exampleContent = exampleContent;
	return example;
}

/**
 * generates a random example class
 * @return the number of the example class
 */
export function exampleRandomClassNumberGenerator(): number {
	const exampleClassNumber: number = Math.floor(Math.random() * 2);
	return exampleClassNumber;
}

export class Example {
	public exampleDiscription!: string;
	public exampleContent!: string;
}

enum exampleDiscriptions {
	proofAllTrue = "Zeigen Sie, dass folgender Ausdruck immer wahr wird:",
	proofAllFalse = "Zeigen Sie, dass folgender Ausdruck immer falsch wird:",
}

function matchExampleDiscription(exampleClassNumber: number): string {
	const discriptions = [exampleDiscriptions.proofAllFalse, exampleDiscriptions.proofAllTrue];
	const exampleDiscription = discriptions[exampleClassNumber];
	return exampleDiscription;
}

function generateExampleContent(exampleClassNumber: number): string {
	const test = exampleClassNumber.toString();
	return test;
}




/*
const example = {"
Wir zeigen (a UND [b ODER c]) <-> ([a UND b] ODER [a UND c]).

=>.
Angenommen es gilt $(a UND [b ODER c])$.
Dann gilt a.
Ferner gilt $b ODER c$.
Fallunterscheidung.
Fall 1.
Angenommen es gilt b.
Dann gilt $a UND b$.
Also folgt $([a UND b] ODER [a UND c])$.
qed.
Damit gilt $b -> ([a UND b] ODER [a UND c])$.
Fall 2.
Angenommen es gilt c.
Dann gilt $a UND c$,
Also folgt $([a UND b] ODER [a UND c])$.
qed.
Damit gilt $c -> ([a UND b] ODER [a UND c])$.
In jedem Fall gilt $([a UND b] ODER [a UND c])$.
Also gilt $([a UND b] ODER [a UND c])$.
qed.
Also gilt $([a UND b] ODER [a UND c]) -> (a UND [b ODER c])$.

<=.
Angenommen es gilt $([a UND b] ODER [a UND c])$.
Fallunterscheidung.
Fall 1.
Angenommen es gilt $a UND b$.
Dann gilt a.
Ferner gilt b.
Also gilt auch $b ODER c$.
Damit folgt $(a UND [b ODER c])$.
qed.
Damit folgt $(a UND b) -> (a UND [b ODER c])$.
Fall 2.
Angenommen nun es gilt $a UND c$.
Dann gilt a.
Ferner gilt c.
Also gilt auch $b ODER c$.
Damit folgt $a UND (b ODER c)$.
qed.
Damit folgt $(a UND c) -> (a UND [b ODER c])$.
In jedem fall gilt $(a UND [b ODER c])$.
Also gilt $(a UND [b ODER c])$.
qed.
Also gilt $([a UND b] ODER [a UND c]) -> (a UND [b ODER c])$.
Damit folgt nun endlich $(a UND [b ODER c]) <-> ([a UND b] ODER [a UND c])$.
qed.};*/