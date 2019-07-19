export class Example {
	public exampleDiscription!: string;
	public exampleContent!: string;
	public exampleConclusion!: string;
}

/**
 * generate a random example object including a discription and the generated example-content
 * @return the example object
 */
export function pickExample(): Example {
	let example: Example;
	example = new Example();
	example.exampleDiscription = "Es seien a, b und c Aussagen. " +
									"Angenommen a ->(b -> c) ";
	example.exampleContent =		"Angenommen ferner es gilt (a und b) " +
									"Dann folgt a. " +
									"Ausserdem folgt b. " +
									"Damit gilt (b -> c). " +
									"Ferner folgt c. ";
	example.exampleConclusion = 	"Also gilt $a -> (b -> c) -> (a und b) -> c$. ";
	return example;
}
