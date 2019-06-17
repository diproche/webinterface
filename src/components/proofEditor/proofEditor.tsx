import React from "react";
import Issue from "../../issueHandling/issue";
import { checkProof } from "../../util/proofChecker";
import IssueInformation from "./issueInformation";
import styles from "./proofEditor.module.scss";

// tslint:disable-next-line:no-empty-interface
export interface Props {

}

interface State {
	userInput: string;
	issues: readonly Issue[];
}

export class ProofEditor extends React.Component<Props, State> {
	public state = {
		userInput: "",
		issues: [],
	};

	public render() {

		return <div className={styles.page}>
			<div className={styles.proofEditor}>
				<textarea
					className={styles.textInput}
					value={this.state.userInput}
					onChange={ev => this.setState({ userInput: ev.target.value })}
				/>
				<div className={styles.buttons}>
					<button onClick={this.checkInput}>
						Prüfen
					</button>
				</div>
			</div>
			<div className={styles.issuesInformation}>
				{this.state.issues.map((issue: Issue) => {
					return <IssueInformation
						issue={ issue } />;
				})}
			</div>
		</div>;

	}

	private readonly checkInput = (): void => {
		const issueArray: readonly Issue[] = checkProof(this.state.userInput);
		this.setState({issues:  issueArray});
	}
}
