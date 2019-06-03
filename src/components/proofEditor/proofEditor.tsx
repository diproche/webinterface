import React from "react";
import Issue from "../../issueHandling/issue";
import { checkProof } from "../../util/proofChecker";
import styles from "./proofEditor.module.scss";

// tslint:disable-next-line:no-empty-interface
export interface Props {

}

interface State {
	text: string;
}

export class ProofEditor extends React.Component<Props, State> {
	public state = { text: "" };

	public render() {
		return <div className={styles.proofEditor}>
			<textarea
				className={styles.textInput}
				value={this.state.text}
				onChange={ev => this.setState({ text: ev.target.value })}
			/>
			<div className={styles.buttons}>
				<button onClick={this.checkInput}>
					Prüfen
				</button>
				<button onClick={() => { alert("Toller Hinweis"); }}>
					Hinweis
				</button>
			</div>
		</div>;
	}

	private readonly checkInput = (): void => {
		const errors: Issue[] = checkProof(this.state.text);
		alert(errors);
	}
}
