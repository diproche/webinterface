import React from "react";

import styles from "./propositionalLogic.module.scss";

const exampleProofList: Array<Array<[string, string, boolean]>> = [
	[
		["Wir zeigen: a -> (b -> c) -> (a und b) -> c.", "Dies soll bewiesen werden.", false],
		["Es seien a, b und c Aussagen.", "Allgemeine Vorraussetzung", false],
		["Angenommen $a ->(b -> c)$.", "Vorraussetzung: Die Prämisse a -> (b -> c) ist wahr.", false],
		["Angenommen ferner es gilt $(a und b)$.", "Vorraussetzung: (a und b) ist wahr.", false],
		["Dann folgt a.", "a folgt, da (a und b) nur dann wahr ist, wenn a wahr ist.", false],
		["Ausserdem folgt b.", "b folgt, da (a und b) nur dann wahr ist, wenn b wahr ist.", false],
		["Damit gilt $(b -> c)$.", "Die Konlusion (b -> c) gilt, da die Prämissen a,sowie (a und b) beide gelten.", false],
		["Ferner folgt c.", "Die Konlusion c gilt, da die Prämissen a, sowie (a und b) beide gelten.", false],
		["Also gilt $a -> (b -> c) -> (a und b) -> c$.", "qed", false]],
	[
		["test1", "test2", false],
		["test3", "test4", false]],
];

interface State {
	exampleProofList: Array<Array<[string, string, boolean]>>;
}

class ExamplesPropositionalLogic extends React.Component<{}, State> {

	// Via constructor since an immediate assignment led to type issues
	constructor(props: {}) {
		super(props);

		this.state = { exampleProofList };
	}

	public render() {
		return <div className={styles.site}>
			<button>Nächstes Beispiel</button>
			<table className={styles.example}>
				<tbody>
					<tr>
						<th>Eingabe</th>
						<th>Klicke auf "Hilfe", um eine Erklärung anzeigen zu lassen.</th>
					</tr>
					<tr>
						<td></td>
						<td></td>
					</tr>
					{this.renderProof(0)}
				</tbody>
			</table>
		</div>;
	}

	private renderProof(exampleNumber: number): JSX.Element {
		const renderedPart: JSX.Element[] = [];
		const proofPart: Array<[string, string, boolean]> = this.state.exampleProofList[exampleNumber];
		proofPart.forEach((line: [string, string, boolean], index: number) => {
			let explanation: string;
			let scssClass: string;
			if (line[2]) {
				explanation = line[1];
				scssClass = styles.alreadyClicked;
			} else {
				explanation = "Hilfe";
				scssClass = styles.clickToChange;
			}

			renderedPart.push(<tr>
				<td>{line[0]}</td>
				<td className={scssClass} onClick={() => this.showExplanation(index, proofPart)}>{explanation}</td>

			</tr>);
		});

		return <React.Fragment>
			{renderedPart}
		</React.Fragment>;
	}

	private showExplanation(index: number, proofPart: Array<[string, string, boolean]>): void {
		if (!proofPart[index][2]) {
			const copy: Array<[string, string, boolean]> = proofPart;
			copy[index][2] = true;
			this.setState({exampleProofList});
		} else if (proofPart[index][2]) {
			const copy: Array<[string, string, boolean]> = proofPart;
			copy[index][2] = false;
			this.setState({exampleProofList});
		}

	}

}

export default ExamplesPropositionalLogic;
