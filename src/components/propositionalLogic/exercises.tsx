import React from "react";
import data from "./exercises.json";
import styles from "./propositionalLogic.module.scss";

interface IExercise {
	title: string;
	start: string;
	end: string;
	exampleSolution: string[][]; // More accurately: Arrray<[string, string]> but will cause type issues
}

interface IState {
	exerciseID: number;
	userInput: string;

}

const exercises: IExercise[] = data.exercises;

class ExercisesPropositionalLogic extends React.Component<IState, {}> {

	public state = {
		exerciseID: -1,
		userInput: "",
	};

	public render() {
		return <div className={styles.selector}>
			<select onChange={(event) => this.selectorOnChangeHandler(event)}>
				<option value={-1}>Bitte wähle eine Übung</option>
				{renderExerciseOptions()}
			</select>
			//Conditional Exercise loaded here; if -1 don't render anything otherwise the exerciseID
		</div>;

	}

	private selectorOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>): void {
		this.setState({exerciseID: event.target.value});
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
