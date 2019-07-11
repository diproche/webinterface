/**
 * generate a random exercise object including a discription and the generated exercise-content
 * @return the exercise object
 */
export function generateRandomExercise(): Exercise {
	const exerciseClassNumber: number = exerciseRandomClassNumberGenerator();
	const exerciseDiscription = matchExerciseDiscription(exerciseClassNumber);
	const exerciseContent = generateExerciseContent(exerciseClassNumber);
	const exercise: Exercise = new Exercise();
	exercise.exerciseDiscription = exerciseDiscription;
	exercise.exerciseContent = exerciseContent;
	return exercise;
}

/**
 * generates a random exercise class
 * @return the number of the execise class
 */
export function exerciseRandomClassNumberGenerator(): number {
	const exerciseClassNumber: number = Math.floor(Math.random() * 2);
	return exerciseClassNumber;
}

export class Exercise implements Exercise {
	public exerciseDiscription!: string;
	public exerciseContent!: string;
}

enum exerciseDiscriptions {
	proofAllTrue = "Zeigen Sie, dass folgender Ausdruck immer wahr wird:",
	proofAllFalse = "Zeigen Sie, dass folgender Ausdruck immer falsch wird:",
}

function matchExerciseDiscription(exerciseClassNumber: number): string {
	const discriptions = [exerciseDiscriptions.proofAllFalse, exerciseDiscriptions.proofAllTrue];
	const exerciseDiscription = discriptions[exerciseClassNumber];
	return exerciseDiscription;
}

function generateExerciseContent(exerciseClassNumber: number): string {
	const test = exerciseClassNumber.toString();
	return test;
}
