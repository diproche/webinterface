import React from "react";

import { Exercise, generateRandomExercise } from "./exerciseGenerator";
import styles from "./propositionalLogic.module.scss";

class ExercisesPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<p>Hier sollten Übungen stehen. Entweder Zufällig generierte bzw. ausgewählte Aufgaben (nach schiwerigkeitsgrad?)
				 oder festes schema)</p>
			<p>Click the button to display a random exercise.</p>

			<button className={styles.buttons}
				onClick={this.checkInput}>
				Zufallsgenerator
	</button>
			<p id="exerciseDescription"></p>
			<p id="exerciseContent"></p>
		</div>;

	}
	private checkInput = async (): Promise<void> => {
		const exerciseDiscription = document.getElementById("exerciseDescription");
		const exerciseContent = document.getElementById("exerciseContent");
		const randomExercise: Exercise = generateRandomExercise();
		if (exerciseDiscription !== null && exerciseContent !== null) {
			exerciseDiscription.innerHTML = randomExercise.exerciseDiscription;
			exerciseContent.innerHTML = randomExercise.exerciseContent;
		}
	}

}

export default ExercisesPropositionalLogic;
