import React from "react";

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
			<p id="solve"></p>
		</div>;

	}
	private checkInput = async (): Promise<void> => {
		const myComponent = document.getElementById("solve");
		if (myComponent !== null) {
			myComponent.innerHTML = Math.random().toString();
		}
	}

}

export default ExercisesPropositionalLogic;
