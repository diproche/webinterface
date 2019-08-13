import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ContentEditable from "react-contenteditable";
import addStringIgnoringHTML from "../../util/addStringIgnoringHTML";
import Issue from "../../util/issueHandling/issue";
import { checkProof, checkProofWithoutDiproche } from "../../util/proofChecker";
import exerciseStyles from "../exercises/exercises.module.scss";
import IssueInformation from "./issueInformation";
import styles from "./proofEditor.module.scss";

// proofEditorHTML is the value with HTML which is being rendered
// proofEditorText is the value ignoring the rendered HTML

export interface IParentState {
	proofEditorHTML: string;
	issues: Issue[];
}

interface IProps extends IParentState {
	// To squeeze in text inbetween the button and the input field
	displayAfterInputfield?: string | JSX.Element;
	transformUserinputPreCheck?(userInput: string): string;
	setStateParent(newState: object): void;
}

class ProofEditor extends React.Component< IProps , {} > {

	private innerProofEditor = React.createRef<HTMLDivElement>();
	private outerProofEditor = React.createRef<ContentEditable>();

	public render() {

		return <div className={styles.proofEditor}>
			<ContentEditable
				className={styles.textInput}
				ref={this.outerProofEditor}
				innerRef={this.innerProofEditor}
				html={this.props.proofEditorHTML}
				onChange={(event: React.ChangeEvent<ContentEditable>) => this.onChangeHandler(event)}
				onKeyDown={(event: React.KeyboardEvent<ContentEditable>) => this.keyPressHandler(event)}
			/>

			{this.renderAfterInputFieldText()}

			<button className={styles.buttons}
				onClick={this.checkInput}>
				Prüfen
				</button>
			<div className={styles.issuesInformation}>
				{this.props.issues.map((issue: Issue) => {
					return <IssueInformation
						issue={issue} />;
				})}
			</div>
		</div>;

	}

	private onChangeHandler(event: React.ChangeEvent<ContentEditable>): void {
		const proofEditorHTML: string = event.currentTarget.lastHtml;
		this.props.setStateParent({ proofEditorHTML });
	}

	private keyPressHandler(event: React.KeyboardEvent<ContentEditable>): void {

		if (event.key !== " ") {
			return;
		}

		const proofEditorText = this.getInputText();
		const issues = checkProofWithoutDiproche(proofEditorText);
		const outerProofEditor: ContentEditable = this.outerProofEditor.current!;
		let proofEditorHTML: string = outerProofEditor.lastHtml;

		const issueFromIndeces: number[] = [];
		const issueToIndeces: number[] = [];
		issues.forEach((issue: Issue) => {
			if (issue.position) {
				issueFromIndeces.push(issue.position.fromIndex);
				issueToIndeces.push(issue.position.toIndex);
			}
		});

		proofEditorHTML = addStringIgnoringHTML(proofEditorHTML, "<mark>", issueFromIndeces, false);
		proofEditorHTML = addStringIgnoringHTML(proofEditorHTML, "</mark>", issueToIndeces, false);

		this.props.setStateParent({proofEditorHTML, issues});
		}

	private readonly checkInput = async (): Promise<void> => {
		let proofEditorText = this.getInputText();

		if (this.props.transformUserinputPreCheck) {
			proofEditorText = this.props.transformUserinputPreCheck(proofEditorText);
		}

		const issues: readonly Issue[] = await checkProof(proofEditorText);
		this.setState({ issues });
	}

	private getInputText(): string {
		const proofEditorRef = this.innerProofEditor.current;
		if (!proofEditorRef) {
			return "";
		}
		return proofEditorRef.innerText || proofEditorRef.textContent || "";
	}

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
}

export default ProofEditor;
