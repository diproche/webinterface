import React from "react";

import ProofEditor from "../proofEditor";
import styles from "../propositionalLogic.module.scss";
import { Example, generateRandomExample } from "./exampleCollection";

class ExamplesPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<div>
				<p>Hier sollten Beispiele stehen. Entweder Zufällig generierte bzw. ausgewählte Aufgaben (nach schiwerigkeitsgrad?)
				 oder festes schema)</p>
				<p>Click the button to display a random example.</p>
				<button className={styles.buttons}
					onClick={this.checkInput}>
					Zufallsgenerator
					</button>

				<p id="exampleDescription"></p>
				<p id="exampleContent"></p>
			</div>
			<ProofEditor />
		</div >;

	}
	private checkInput = async (): Promise<void> => {
		const exampleDiscription = document.getElementById("exampleDescription");
		const exampleContent = document.getElementById("exampleContent");
		const randomExample: Example = generateRandomExample();
		if (exampleDiscription !== null && exampleContent !== null) {
			exampleDiscription.innerHTML = randomExample.exampleDiscription;
			exampleContent.innerHTML = randomExample.exampleContent;
		}
	}

}
export default ExamplesPropositionalLogic;
