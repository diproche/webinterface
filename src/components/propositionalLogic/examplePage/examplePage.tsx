import React from "react";

import ProofEditor from "../proofEditor";
import styles from "../propositionalLogic.module.scss";
import { Example, generateRandomExample } from "./exampleCollection";

const lyrics = "placeholder";

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

				<p id="exampleDescription"></p>
					<div className={ProofEditor.name}>
					</div>
					<p id="exampleContent"></p>

			</div>
			<div className="test">
			<ProofEditor/>
			</div>
			<div>{lyrics}</div>
		</div >;

	}
	private button = async (): Promise<void> => {
		const exampleDiscription = document.getElementById("exampleDescription");
		const exampleContent = document.getElementById("exampleContent");
		const randomExample: Example = generateRandomExample();
		const test = document.getElementsByClassName("test");
		const modifiedPE: ProofEditor = new ProofEditor("TEST", []);
		if (exampleDiscription !== null && exampleContent !== null && test !== null) {
			exampleDiscription.innerHTML = randomExample.exampleDiscription;
			test.item = modifiedPE;
		}
	}

}
export default ExamplesPropositionalLogic;
