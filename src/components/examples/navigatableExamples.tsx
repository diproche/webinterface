import React from "react";
import buttonStyles from "../generalStyles/buttons.module.scss";
import styles from "./navigatableExamples.module.scss";
import SingleExampleDisplay from "./singleExampleDisplay";

interface IProps {
	examplesData: string[][][];
}

interface IState {
	exampleToShow: number;
}

class NavigatableExamples extends React.Component<IProps, IState> {

	public state: IState = {
		exampleToShow: 0,
	};

	public render() {
		return <React.Fragment>
			{this.renderExampleButtons()}
			<SingleExampleDisplay
				exampleData={this.props.examplesData[this.state.exampleToShow]}
			/>
		</React.Fragment>;
	}

	private renderExampleButtons(): JSX.Element[] {

		const buttons: JSX.Element[] = [];
		this.props.examplesData.forEach((_, index: number) => {
			buttons.push(
				<button className={buttonStyles.buttons + " " + styles.exampleChanger}
					onClick={() => this.setState({exampleToShow: index})}>
					Beispiel {index + 1}
				</button>);
		});

		return buttons;
	}

}

export default NavigatableExamples;
