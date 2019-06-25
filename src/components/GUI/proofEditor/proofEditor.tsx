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
		name: "Aussagenlogisches Beweisen",
		href: "#aussagenlogisches_beweisen",
	};

	public render() {
		// return SiteLayout;
		window.location.href = "#aussagenlogisches_beweisen";
		return <div className={mainLayout.page}>
			<div className={navBar.name}>
				<ul>
					<li><a className="backToMain" href="#startseite">Zurück zur Startseite</a></li>
					<li><a className="settings" href="#einstellungen">Einstellungen</a></li>
					<li><a className="contact" href="#kontakt">Kontakt</a></li>
					<li><a className="impressum" href="#impressum">Impressum</a></li>
				</ul>
			</div>
			<div className={styles.proofEditor}>
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

			</div>
		</div>;

	}

	private readonly checkInput = async (): Promise<void> => {
		const issueArray: readonly Issue[] = await checkProof(this.state.userInput);
		this.setState({ issues: issueArray });
	}
}
