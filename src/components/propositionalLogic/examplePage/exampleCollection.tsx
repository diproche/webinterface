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
