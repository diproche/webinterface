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
			{this.renderExerciseOrSolution()}
			<button
				className={styles.toggleExerciseSolution}
				onClick={() => this.setState({showSolution: !this.state.showSolution})}
			/>
		</div>;

	}

	private selectorOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>): void {
		this.setState({exerciseID: event.target.value});
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
			// Render example solution here. Should utilize the example component.
		}

		// If

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
