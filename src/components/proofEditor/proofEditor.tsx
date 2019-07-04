import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ContentEditable from "react-contenteditable";
import { Props } from "../../App";
import Issue from "../../issueHandling/issue";
import { checkProof, checkProofWithoutDiproche } from "../../util/proofChecker";
import IssueInformation from "./issueInformation";
import styles from "./proofEditor.module.scss";

interface State {
	proofEditorHTML: string;
	issues: readonly Issue[];
}

class ProofEditor extends React.Component<Props, State> {
	public state = {
		proofEditorHTML: "Gebe hier <mark>deinen</mark> Beweis ein.",
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
		const proofEditorHTML: string = event.target.value;
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
