import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Issue from "../../../issueHandling/issue";
import { checkProof } from "../../../util/proofChecker";
import mainLayout from "../../CSS/mainLayout.module.scss";
import navBar from "../../CSS/navBar.module.scss";
import styles from "../../CSS/proofEditor.module.scss";
import IssueInformation from "./issueInformation";

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
			<div className={mainLayout.name}></div>
			<div className={navBar.name}>
				<ul>
					<li><a className="activeElement1" href="#start">Start</a></li>
					<li><a className="activeElement2" href="#einstellungen">Einstellungen</a></li>
					<li><a className="activeElement3" href="#kontakt">Kontakt</a></li>
					<li><a className="activeElement4" href="#impressum">Impressum</a></li>
				</ul>
			</div>

			<div className={styles.proofEditor}>
				<textarea
					className={styles.textInput}
					placeholder="Gebe hier deinen Beweis ein."
					required={true}
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
