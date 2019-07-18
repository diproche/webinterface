import React from "react";

import Issue from "../../../util/issueHandling/issue";
import { checkProof } from "../../../util/proofChecker";
import IssueInformation from "../issueInformation";
import ProofEditor from "../proofEditor";
import styles from "../propositionalLogic.module.scss";
import { Example, generateRandomExample } from "./exampleCollection";

interface State {
	userInput: string;
	issues: readonly Issue[];
}

class ExamplesPropositionalLogic extends React.Component<{}, State> {
	public state = {
		userInput: "",
		issues: [],
	};
	public render() {
		return <div className={styles.site}>
			<div>
				<p>Hier sollten Beispiele stehen. Entweder Zufällig generierte bzw. ausgewählte Aufgaben (nach schiwerigkeitsgrad?)
				 oder festes schema)</p>
				<p>Click the button to display a random example.</p>

				<p id="exampleDescription"></p>
				<div className={ProofEditor.name}>
				</div>
				<p id="exampleContent"></p>
			</div>
			<div className={styles.proofEditor}>
				<textarea
					className={styles.textInput}
					placeholder={textboxPlaceHolder}
					value={this.state.userInput}
					onChange={ev => this.setState({ userInput: ev.target.value })} />
				<button className={styles.buttons}
					onClick={this.button}>
					Nächstes Beispiel
					</button>
				<button className={styles.buttons}
					onClick={this.checkInput}>
					Prüfen
				</button>
				<div className={styles.issuesInformation}>
					{this.state.issues.map((issue: Issue) => {
						return <IssueInformation
							issue={issue} />;

					})}
				</div>
			</div>
		</div>;
	}

	private readonly checkInput = async (): Promise<void> => {
		const issueArray: readonly Issue[] = await checkProof(this.state.userInput);
		//const randomExample: Example = generateRandomExample();

		this.setState({ issues: issueArray });
	}
	private button = async (): Promise<void> => {
		const exampleDiscription = document.getElementById("exampleDescription");
		const exampleContent = document.getElementById("exampleContent");
		const randomExample: Example = generateRandomExample();
		if (exampleDiscription !== null && exampleContent !== null) {
			exampleDiscription.innerHTML = randomExample.exampleDiscription;
			// exampleContent.innerHTML = randomExample.exampleContent;
			updateInputPlaceholder(randomExample.exampleContent);
		}
	}
}

const textboxPlaceHolder = "Gebe hier deinen Beweis ein...";
let textBoxValue = "";

export function updateInputPlaceholder(newPlaceholder: string): string {
	textBoxValue = newPlaceholder;
	return textBoxValue;
}
export default ExamplesPropositionalLogic;
