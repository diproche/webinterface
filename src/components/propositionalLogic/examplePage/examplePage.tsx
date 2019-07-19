import React from "react";

import styles from "../propositionalLogic.module.scss";
import { Example, pickExample } from "./exampleCollection";

class ExamplesPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<div>
				<p>Hier sollten Beispiele stehen. Entweder Zufällig generierte bzw. ausgewählte Aufgaben (nach schiwerigkeitsgrad?)
				 oder festes schema)</p>
				<p>Click the button to display a random example.</p>
				<button className={styles.buttons}
					onClick={this.button}>
					Nächstes Beispiel
					</button>

			</div>
			<div className={styles.proofEditor}>
			<p id="exampleDescription"></p>
				<p id="exampleContent"></p>
			<p id="exampleConclusion"></p>
			</div>
		</div>;
	}

	private button = async (): Promise<void> => {
		const exampleDiscription = document.getElementById("exampleDescription");
		const exampleContent = document.getElementById("exampleContent");
		const exampleConclusion = document.getElementById("exampleConclusion");
		const randomExample: Example = pickExample();
		if (exampleDiscription !== null && exampleContent !== null && exampleConclusion !== null) {
			exampleDiscription.innerHTML = randomExample.exampleDiscription;
			exampleContent.innerHTML = randomExample.exampleContent;
			exampleConclusion.innerHTML = randomExample.exampleConclusion;

		}
	}
}

export default ExamplesPropositionalLogic;
