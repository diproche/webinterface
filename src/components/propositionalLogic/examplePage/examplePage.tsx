import React from "react";

import Issue from "../../../util/issueHandling/issue";
import { checkProof } from "../../../util/proofChecker";
import IssueInformation from "../issueInformation";
import styles from "../propositionalLogic.module.scss";
import { Example, pickExample } from "./exampleCollection";

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
				<button className={styles.buttons}
					onClick={this.button}>
					Nächstes Beispiel
					</button>
				<p id="exampleDescription"></p>
				<p id="exampleContent"></p>

			</div>
			<div className={styles.proofEditor}>
				<textarea
					className={styles.textInput}
					placeholder={textboxPlaceHolder}
					value={this.state.userInput}
					onChange={ev => this.setState({ userInput: ev.target.value })} />
					<p id="exampleConclusion"></p>
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

		this.setState({ issues: issueArray });
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

const textboxPlaceHolder = "Gebe hier deinen Beweis ein...";
let textBoxValue = "";

export function updateInputPlaceholder(newPlaceholder: string): string {
	textBoxValue = newPlaceholder;
	return textBoxValue;
}
export default ExamplesPropositionalLogic;
