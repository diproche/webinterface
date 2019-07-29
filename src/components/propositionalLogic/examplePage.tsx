import React from "react";

import styles from "./propositionalLogic.module.scss";

interface State {
	proofPart: Array<[string, string, boolean]>;
}

class ExamplesPropositionalLogic extends React.Component<{}, State> {

	// Via constructor since an immediate assignment led to type issues
	constructor(props: {}) {
		super(props);
		const proofPart: Array<[string, string, boolean]> = [
			["Es seien a, b und c Aussagen.", "Allgemeine Vorraussetzung", false],
			["Angenommen $a ->(b -> c)$.", "Vorraussetzung: Die Prämisse a -> (b -> c) ist wahr.", false],
			["Angenommen ferner es gilt $(a und b)$.", "Vorraussetzung: (a und b) ist wahr.", false],
			["Dann folgt a.", "a folgt, da (a und b) nur dann wahr ist, wenn a wahr ist.", false],
			["Ausserdem folgt b.", "b folgt, da (a und b) nur dann wahr ist, wenn b wahr ist.", false],
			["Damit gilt $(b -> c)$.", "Die Konlusion (b -> c) gilt, da die Prämissen a,sowie (a und b) beide gelten.", false],
			["Ferner folgt c.", "Die Konlusion c gilt, da die Prämissen a, sowie (a und b) beide gelten.", false],
		];

		this.state = { proofPart };
	}

	public render() {
		return <div className={styles.site}>
			<table>
				<tbody>
					<tr>
						<th>Eingabe</th>
						<th></th>
					</tr>
					<tr>
						<th>Wir zeigen: a -> (b -> c) -> (a und b) -> c.</th>
						<th>Dies soll bewiesen werden. </th>
					</tr>
					<tr>
						<td></td>
						<td></td>
					</tr>
					{this.renderProof()}
					<tr>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td>Also gilt $a -> (b -> c) -> (a und b) -> c$.</td>
						<td>qed </td>
					</tr>
				</tbody>
			</table>
		</div>;
	}

	private renderProof(): JSX.Element {
		const renderedPart: JSX.Element[] = [];

		this.state.proofPart.forEach((line: [string, string, boolean], index: number) => {
			let explanation: string;
			let scssClass: string;
			if (line[2]) {
				explanation = line[1];
				scssClass = styles.alreadyClicked;
			} else {
				explanation = "Klicke hier um eine Erklärung anzuzeigen";
				scssClass = styles.clickToChange;
			}

			renderedPart.push(<tr>
				<td>{line[0]}</td>
				<td className={scssClass} onClick={() => this.showExplanation(index)}>{explanation}</td>
			</tr>);
		});

		return <React.Fragment>
			{renderedPart}
		</React.Fragment>;
	}

	private showExplanation(index: number): void {
		if (!this.state.proofPart[index][2]) {
			const copy: Array<[string, string, boolean]> = this.state.proofPart;
			copy[index][2] = true;
			this.setState({ proofPart: copy });
		}

	}

}

export default ExamplesPropositionalLogic;
