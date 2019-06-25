import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Issue from "../../issueHandling/issue";
import { checkProof } from "../../util/proofChecker";
import MainLayout from "../mainGUI/mainLayout";
import NavBar from "../mainGUI/navBar/navBar";
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
		// return SiteLayout;
		return <div className={styles.page}>
			<div className={MainLayout.name}></div>
			<div className={NavBar.name}></div>

			<div className={styles.proofEditor}>
				<textarea
					className={styles.textInput}
					value={this.state.userInput}
					onChange={ev => this.setState({ userInput: ev.target.value })}
				/>

			</div>
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
		</div >;

	}

	private readonly checkInput = async (): Promise<void> => {
		const issueArray: readonly Issue[] = await checkProof(this.state.userInput);
		this.setState({ issues: issueArray });
	}
}
