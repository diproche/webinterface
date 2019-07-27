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

	private innerProofEditor = React.createRef<HTMLDivElement>();
	private outerProofEditor = React.createRef<ContentEditable>();

	public render() {

		return <div className={styles.proofEditor}>
			<ContentEditable
				className={styles.textInput}
				ref={this.outerProofEditor}
				innerRef={this.innerProofEditor}
				html={this.state.proofEditorHTML}
				onKeyDown={(event: React.KeyboardEvent<ContentEditable>) => this.keyPressHandler(event)}
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

		this.setState({proofEditorHTML, issues});
		}

	private readonly checkInput = async (): Promise<void> => {
		const proofEditorText = this.getInputText();
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

}

export default ProofEditor;
