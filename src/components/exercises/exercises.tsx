import React from "react";
import SingleExampleDisplay from "../examples/singleExampleDisplay";
import buttonStyles from "../generalStyles/buttons.module.scss";
import ProofEditor,  { IParentState } from "../proofEditor/proofEditor";
import styles from "./exercises.module.scss";

interface IExercise {
	title: string;
	start: string;
	end: string;
	exampleSolution: string[][]; // More accurately: Arrray<[string, string]> but will cause type issues
}

interface IState extends IParentState {
	exerciseID: number;
	// A potential solution that is.
	showSolution: boolean;
}

interface IProps {
	data: IExercise[];
}

class Exercises extends React.Component<IProps, IState> {

	public state = {
		userInput: "",
		issues: [],
		exerciseID: -1,
		showSolution: false,
	};

	public render() {
		return <div>
			<select
				onChange={(event) => this.selectorOnChangeHandler(event)}
				className={styles.selector}
			>
				<option value={-1}>Bitte wähle eine Übung</option>
				{this.renderExerciseOptions()}
			</select>
			{this.renderExerciseOrSolution()}
			{this.renderToggleButton()}
		</div>;

	}

	private selectorOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>): void {
		this.setState({exerciseID: Number.parseInt(event.target.value, 10)});
	}

	private renderExerciseOrSolution(): JSX.Element {
		// Could be made more general, but -1 is the default "no exercise is selected" and otherwise it should be an error
		// More general could be: if(!exercises[this.state.exerciseID])
		// It will then create an empty return if the exercise at the index doesn't exist
		if (this.state.exerciseID === -1) {
			// Returns nothing but is still a JSX.Element
			return <React.Fragment></React.Fragment>;
		}

		if (this.state.showSolution) {
			return <SingleExampleDisplay
				exampleData = { this.props.data[this.state.exerciseID].exampleSolution }
			/>;
		}

		const activeExercise = this.props.data[this.state.exerciseID];
		return <div>
			<div className={styles.preText}>
				{activeExercise.start} <br />
			</div>
			<ProofEditor
				userInput = {this.state.userInput}
				issues = {this.state.issues}
				setStateParent = {(insert) => this.setState(insert)}
				transformUserinputPreCheck={(input: string) => this.addStartAndEndToUserInput(input)}
				displayAfterInputfield={activeExercise.end}
			/>
			<br />
		</div>;
	}

	private  addStartAndEndToUserInput(userInput: string): string {

		const activeExercise = this.props.data[this.state.exerciseID];
		const modifiedUserInput: string =  activeExercise.start
			+ "\n" + userInput
			+ "\n" + activeExercise.end;

		return modifiedUserInput;
	}

	private renderToggleButton(): JSX.Element {
		if (this.state.exerciseID === -1) {
			return <React.Fragment></React.Fragment>;
		}

		let buttonCaption: string = "Musterlösung anzeigen";

		if (this.state.showSolution) {
			buttonCaption = "Zurück zum Editor";
		}

		return <button
			className={buttonStyles.buttons + " " + styles.toggleExerciseSolutionBtn}
			onClick={() => this.setState({showSolution: !this.state.showSolution})}
		>
			{buttonCaption}
		</button>;
	}

	private renderExerciseOptions(): JSX.Element[] {
		const options: JSX.Element[] = [];
		this.props.data.forEach((oneExercise, index) => {
			options.push(<option value={index}>
				{oneExercise.title}
			</option>);
		});

		return options;
	}

}

export default Exercises;
