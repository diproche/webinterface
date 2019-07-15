import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Issue from "../../util/issueHandling/issue";
import { checkProof } from "../../util/proofChecker";
import IssueInformation from "./issueInformation";
import styles from "./propositionalLogic.module.scss";

interface State {
	userInput: string;
	issues: readonly Issue[];
}

class ProofEditor extends React.Component<{}, State> {
	public state = {
		userInput: "",
		issues: [],
	};

	public render() {
		return <div className={styles.proofEditor}>
			<textarea
				className={styles.textInput}
				placeholder="Gebe hier deinen Beweis ein."
				required={true}
				value={this.state.userInput}
				onChange={ev => this.setState({ userInput: ev.target.value })} />
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
		</div>;

	}

	private readonly checkInput = async (): Promise<void> => {
		const issueArray: readonly Issue[] = await checkProof(this.state.userInput);
		this.setState({ issues: issueArray });
	}
}

export default ProofEditor;
