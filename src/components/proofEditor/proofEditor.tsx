import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Issue from "../../util/issueHandling/issue";
import { checkProof } from "../../util/proofChecker";
import exerciseStyles from "../exercises/exercises.module.scss";
import buttonStyles from "../generalStyles/buttons.module.scss";
import IssueInformation from "./issueInformation";
import styles from "./proofEditor.module.scss";

const textboxPlaceHolder = "Gebe hier deinen Beweis ein...";

/** The parent component needs to control the proofEditor and have these states */
export interface IParentState {
	issues: Issue[];
	userInput: string;
}

interface IProps extends IParentState {
	// To squeeze in text inbetween the button and the input field
	displayAfterInputfield?: string | JSX.Element;
	transformUserinputPreCheck?(userInput: string): string;
	setStateParent(newState: object): void;
}

class ProofEditor extends React.Component<IProps, {}> {

	public render() {
		return <div className={styles.proofEditor}>

			<textarea
				className={styles.textInput}
				placeholder={textboxPlaceHolder}
				required={true}
				value={this.props.userInput}
				onChange={ev => this.props.setStateParent({userInput: ev.target.value})}
			/>

			{this.renderAfterInputFieldText()}

			<br />

			<button className={buttonStyles.buttons + " " + styles.checkProofBtn}
				onClick={() => this.checkInput()}>
				Prüfen
			</button>

			<div className={styles.issuesInformation}>
				{this.renderIssueList()}
			</div>

		</div>;

	}

	// An attempt to make this inline didn't work
	private renderAfterInputFieldText(): string | JSX.Element {
		if (this.props.displayAfterInputfield) {
			return  <div className={exerciseStyles.postText}>
				<br />
				{this.props.displayAfterInputfield}s
			</div>;
		}

		return "";
	}

	private readonly checkInput = async (): Promise<void> => {
		let userInput = this.props.userInput;
		if (this.props.transformUserinputPreCheck) {
			userInput = this.props.transformUserinputPreCheck(userInput);
		}

		const issues: readonly Issue[] = await checkProof(userInput);
		this.props.setStateParent({ issues });
	}

	private renderIssueList(): JSX.Element | JSX.Element[] {
		if (this.props.issues.length === 0 && this.props.userInput !== "") {
			return <div
					className={styles.successMessage}
				>
				Alles richtig
				</div>;
		}

		const issueList: JSX.Element[] = [];

		this.props.issues.map((issue: Issue) => {
			issueList.push(<IssueInformation
				issue={issue}
			/>);
		});

		return issueList;
	}
}

export default ProofEditor;
