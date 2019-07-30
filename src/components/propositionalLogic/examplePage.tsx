import React from "react";
import exercises from "./example.json"
import styles from "./propositionalLogic.module.scss";

const exampleProofList: Array<Array<[string, string, boolean]>> = [
	[
		[exercises.example1[0][0].toString(), exercises.example1[0][1].toString(), true],
		[exercises.example1[1][0].toString(), exercises.example1[1][1].toString(), false],
		[exercises.example1[2][0].toString(), exercises.example1[2][1].toString(), false],
		[exercises.example1[3][0].toString(), exercises.example1[3][1].toString(), false],
		[exercises.example1[4][0].toString(), exercises.example1[4][1].toString(), false],
		[exercises.example1[5][0].toString(), exercises.example1[5][1].toString(), false],
		[exercises.example1[6][0].toString(), exercises.example1[6][1].toString(), false],
		[exercises.example1[7][0].toString(), exercises.example1[7][1].toString(), false],
		[exercises.example1[8][0].toString(), exercises.example1[8][1].toString(), false],
		[exercises.example1[9][0].toString(), exercises.example1[9][1].toString(), false],
		],
	[
		["test1", "test1", false]],
	[
		["test2", "test2", false],
		["test2", "test2", false]],
	[
		["test3", "test3", false],
		["test3", "test3", false],
		["test3", "test3", false]],
	[
		["test4", "test4", false],
		["test4", "test4", false],
		["test4", "test4", false],
		["test4", "test4", false]],
	[
		["test5", "test5", false],
		["test5", "test5", false],
		["test5", "test5", false],
		["test5", "test5", false],
		["test5", "test5", false]],
	[
		["test6", "test6", false],
		["test6", "test6", false],
		["test6", "test6", false],
		["test6", "test6", false],
		["test6", "test6", false],
		["test6", "test6", false]],
	[
		["test7", "test7", false],
		["test7", "test7", false],
		["test7", "test7", false],
		["test7", "test7", false],
		["test7", "test7", false],
		["test7", "test7", false],
		["test7", "test7", false],
		["test7", "test7", false]],
];
let exampleNumber = Math.floor(Math.random() * exampleProofList.length);

interface State {
	exampleProofList: Array<Array<[string, string, boolean]>>;
	exampleNumber: number;
}

class ExamplesPropositionalLogic extends React.Component<{}, State> {

	// Via constructor since an immediate assignment led to type issues
	constructor(props: {}) {
		super(props);

		this.state = { exampleProofList, exampleNumber };
	}

	public render() {
		return <div className={styles.site}>
			<button className={styles.buttons}
				onClick={this.showAnotherExample}>
				Zeige mir anderes Beispiel!
			</button>
			<table className={styles.example} id="solve">
				{this.renderProof(exampleNumber, false)}
			</table>
		</div >;
	}
	private readonly showAnotherExample = async (): Promise<void> => {
		let newExampleNumber = Math.floor(Math.random() * exampleProofList.length);
		while (newExampleNumber === exampleNumber) {
			newExampleNumber = Math.floor(Math.random() * exampleProofList.length);
		}
		exampleNumber = newExampleNumber;

		this.renderProof(exampleNumber, true);
		this.setState({ exampleProofList });

	}

	private renderProof(newExampleNumber: number, numberChanged: boolean): JSX.Element {
		const renderedPart: JSX.Element[] = [];
		renderedPart.push(<tr><th>Eingabe</th>
			<th>Klicke auf "Hilfe", um eine Erklärung anzeigen zu lassen.</th>
		</tr>);
		renderedPart.push(<tr>
			<td></td>
			<td></td>
		</tr>);
		const proofPart: Array<[string, string, boolean]> = this.state.exampleProofList[newExampleNumber];
		if (numberChanged === true) {
			proofPart.forEach((line: [string, string, boolean]) => {
				line[2] = false;
			});
		}
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
			this.setState({ exampleProofList });
		} else if (proofPart[index][2]) {
			const copy: Array<[string, string, boolean]> = proofPart;
			copy[index][2] = false;
			this.setState({ exampleProofList });
		}

	}

}

export default ExamplesPropositionalLogic;
