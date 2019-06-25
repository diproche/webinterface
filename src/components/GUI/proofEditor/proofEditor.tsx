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

		return <div className={mainLayout.page}>
		<div className={navBar.name}></div>
			<ul>
				<li><a className="activeElement1" href="#start">Start</a></li>
				<li><a className="activeElement2" href="#einstellungen">Einstellungen</a></li>
				<li><a className="activeElement3" href="#kontakt">Kontakt</a></li>
				<li><a className="activeElement4" href="#impressum">Impressum</a></li>
			</ul>


		<div className={styles.proofEditor}>
			<textarea
				className={styles.textInput}
				placeholder="Gebe hier deinen Beweis ein."
				required={true}
				value={this.state.userInput}
				onChange={ev => this.setState({ userInput: ev.target.value })}/>	
			<button className={styles.buttons}
			onClick={this.checkInput}>
			Prüfen
			</button>
			<div className={styles.issuesInformation}>
		<p>Do not forget to buy <mark>milk</mark> today.</p>

<p><strong>Note:</strong> The mark tag is not supported in Internet Explorer 8 and earlier versions.</p>
		<span className="highlightme">test</span>
			{this.state.issues.map((issue: Issue) => {
				var x= document.getElementsByClassName(styles.textInput);
				var y = x[0].innerHTML.getAttributName(placeholder);
				y[0].innerHTML = "test"; 
				return <IssueInformation
					issue={issue} />
			})}
		</div>
	</div>
	</div>
	}
	private readonly checkInput = async (): Promise<void> => {
		const issueArray: readonly Issue[] = await checkProof(this.state.userInput);
		this.setState({ issues: issueArray });
	}

}
