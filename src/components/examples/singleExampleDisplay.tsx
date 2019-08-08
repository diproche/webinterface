import React from "react";
import styles from "./singleExampleDisplay.module.scss";

interface IProps {
	exampleData: string[][];
}

interface IState {
	showExplanation: boolean[];
}

class SingleExampleDisplay extends React.Component<IProps, IState> {

	// Via constructor since an immediate assignment led to type issues
	constructor(props: IProps) {
		super(props);
		const showExplanation = initializeShowExplanation(this.props.exampleData);
		this.state = { showExplanation };
	}

	public render() {
		return <div className={styles.site}>
			<table className={styles.example} id="solve">
				{this.renderProof()}
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

		const proofPart: string[][] = this.props.exampleData;

		proofPart.forEach((line: string[], index: number) => {
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
				<td className={scssClass} onClick={() => this.showExplanation(index)}>{explanation}</td>
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

}

function initializeShowExplanation(example: string[][]): boolean[] {
	return Array(example.length).fill(false);
}

export default SingleExampleDisplay;
