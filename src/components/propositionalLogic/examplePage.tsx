import React from "react";
import data from "./examples.json";
import styles from "./propositionalLogic.module.scss";

const exampleProofList: Array<Array<[string, string]>> = data.examples;
console.log(exampleProofList);
const exampleNumber = Math.floor(Math.random() * exampleProofList.length);

interface State {
	exampleToShow: number;
	showExplanation: boolean[];
}

class ExamplesPropositionalLogic extends React.Component<{}, State> {

	// Via constructor since an immediate assignment led to type issues
	constructor(props: {}) {
		super(props);
		const exampleToShow: number = 0;
		const showExplanation = initializeShowExplanation(exampleProofList[exampleToShow]);
		this.state = { exampleToShow, showExplanation };
	}

	public render() {
		return <div className={styles.site}>
			{this.renderExampleButtons()}
			<table className={styles.example} id="solve">
				{this.renderProof(exampleNumber, false)}
			</table>
		</div >;
	}

	private renderProof(): JSX.Element {
		const renderedPart: JSX.Element[] = [];

		renderedPart.push(<tr>
				<th>Eingabe</th>
				<th>Klicke auf "Hilfe", um eine Erklärung anzeigen zu lassen.</th>
		</tr>);

		renderedPart.push(<tr>
			<td></td>
			<td></td>
		</tr>);

		const proofPart: Array<[string, string]> = exampleProofList[this.state.exampleToShow];

		proofPart.forEach((line: [string, string], index: number) => {
			let explanation: string;
			let scssClass: string;

			if (this.state.showExplanation[index]) {
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

	private showExplanation(index: number): void {
		const copy: boolean[] = this.state.showExplanation;
		copy[index] = true;
		this.setState({showExplanation: copy});
	}

	private renderExampleButtons(): JSX.Element[] {
		const buttons: JSX.Element[] = [];
		exampleProofList.forEach((_, index) => {
			buttons.push(
				<button className={styles.buttons}
					onClick={() => this.showExampleID(index)}>
					Beispiel {index + 1}
				</button>);
		});

		return buttons;
	}

	private showExampleID(exampleToShow: number) {
		const showExplanation = initializeShowExplanation(exampleProofList[exampleToShow]);
		this.setState({ exampleToShow, showExplanation });
	}

}

function initializeShowExplanation(example: Array<[string, string]>): boolean[] {
	return Array(example.length).fill(false);
}

export default ExamplesPropositionalLogic;
