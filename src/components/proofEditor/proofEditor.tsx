import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ContentEditable from "react-contenteditable";
import Issue from "../../issueHandling/issue";
import addStringIgnoringHTML from "../../util/addStringIgnoringHTML";
import { checkProof, checkProofWithoutDiproche } from "../../util/proofChecker";
import IssueInformation from "./issueInformation";
import styles from "./proofEditor.module.scss";

// proofEditorHTML is the value with HTML which is being rendered
// proofEditorText is the value ignoring the rendered HTML

interface State {
	proofEditorHTML: string;
	issues: readonly Issue[];
}

class ProofEditor extends React.Component<{}, State> {
	public state = {
		proofEditorHTML: "Gebe hier den Beweis ein.",
		issues: [],
	};

	private proofEditor = React.createRef<HTMLDivElement>();

	public render() {

		return <div className={styles.proofEditor}>
			<ContentEditable
				className={styles.textInput}
				innerRef={this.proofEditor}
				html={this.state.proofEditorHTML}
				onChange={(event: any) => this.inputChangeHandler(event)}
			/>
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

	private inputChangeHandler(event: any): void {
		const proofEditorText = this.getInputText();
		const issues = checkProofWithoutDiproche(proofEditorText);
		let proofEditorHTML: string = event.target.value;

		const issueFromIndeces: number[] = [];
		const issueToIndeces: number[] = [];
		issues.forEach((issue: Issue) => {
			if (issue.position) {
				issueFromIndeces.push(issue.position.fromIndex);
				issueToIndeces.push(issue.position.toIndex);
			}
		});

		proofEditorHTML = addStringIgnoringHTML(this.state.proofEditorHTML, "<mark>", issueFromIndeces);
		proofEditorHTML = addStringIgnoringHTML(proofEditorHTML, "</mark>", issueToIndeces);

		this.setState({proofEditorHTML, issues});
		}

	private readonly checkInput = async (): Promise<void> => {
		const proofEditorText = this.getInputText();
		const issues: readonly Issue[] = await checkProof(proofEditorText);
		this.setState({ issues });
	}

	private getInputText(): string {
		const proofEditorRef = this.proofEditor.current;
		if (!proofEditorRef) {
			return "";
		}
		return proofEditorRef.innerText || proofEditorRef.textContent || "";
	}

}

export default ProofEditor;
