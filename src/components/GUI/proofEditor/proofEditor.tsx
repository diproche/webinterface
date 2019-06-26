import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "react-bootstrap/Button";
import { Props } from "../../../App";
import Issue from "../../../issueHandling/issue";
import { checkProof } from "../../../util/proofChecker";
import styles from "../../CSS/proofEditor.module.scss";
import IssueInformation from "./issueInformation";

interface State {
	userInput: string;
	issues: readonly Issue[];
}

class ProofEditor extends React.Component<Props, State> {
	public state = {
		userInput: "",
		issues: [],
		name: "Aussagenlogisches Beweisen",
		href: "#aussagenlogisches_beweisen",
	};

	public render() {
		window.location.href = "#aussagenlogisches_beweisen";
		// return SiteLayout;
		return <div className={styles.proofEditor}>
			<textarea
				className={styles.textInput}
				placeholder="Gebe hier deinen Beweis ein."
				required={true}
				value={this.state.userInput}
				onChange={ev => this.setState({ userInput: ev.target.value })} />
			<Button className={styles.buttons}
				onClick={this.checkInput}>
				Eingabe prüfen
			</Button>
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
