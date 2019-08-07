import React from "react";
import ProofEditor,  { IParentState } from "../proofEditor/proofEditor";
import data from "./exercises.json";
import styles from "./propositionalLogic.module.scss";

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

const exercises: IExercise[] = data.exercises;

class ExercisesPropositionalLogic extends React.Component<IState, {}> {

	public state = {
		userInput: "",
		issues: [],
		exerciseID: -1,
		showSolution: false,
	};

	public render() {
		return <div className={styles.selector}>
			<select onChange={(event) => this.selectorOnChangeHandler(event)}>
				<option value={-1}>Bitte wähle eine Übung</option>
				{renderExerciseOptions()}
			</select>
			{this.renderExercise()}
		</div>;

	}

	private selectorOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>): void {
		this.setState({exerciseID: event.target.value});
	}

	private renderExercise(): JSX.Element {
		if (this.state.exerciseID === -1) {
			return <React.Fragment></React.Fragment>;
		}

		const activeExercise = exercises[this.state.exerciseID];
		return <div className={styles.workspace}>
			{activeExercise.start} <br />
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

		const activeExercise = exercises[this.state.exerciseID];
		const modifiedUserInput: string =  activeExercise.start
			+ "\n" + userInput
			+ "\n" + activeExercise.end;

		return modifiedUserInput;
	}

}

function renderExerciseOptions(): JSX.Element[] {
	const options: JSX.Element[] = [];
	exercises.forEach((oneExercise, index) => {
		options.push(<option value={index}>
			{oneExercise.title}
		</option>);
	});

	return options;
}

export default ExercisesPropositionalLogic;
