// tslint:disable:file-name-casing
import React, { Component } from "react";
import styles from "./generalStyles/pageLayout.module.scss";

// tslint:disable: ordered-imports
import MainPage from "./mainPage/mainPage";
import Navigation from "./navigationBar/navigationBar";
import Kontakt from "./contact/contact";

import ExamplesPropositionalLogic from "./propositionalLogic/examplePage";
import ExercisesPropositionalLogic from "./propositionalLogic/exercises";
import SandboxPropositionalLogic from "./propositionalLogic/sandbox";
import WikiPropositionalLogic from "./propositionalLogic/wiki";
// tslint:enable: ordered-imports

// Making it of type React.ComponentType and then call the .prototype.render doesn't work well
// It will not intitalize the state
const pages: Array<[string, JSX.Element]> = [
	["Startseite", <MainPage />],
	["Beispiele", <ExamplesPropositionalLogic />],
	["Übung", <ExercisesPropositionalLogic />],
	["Freies Beweisen", <SandboxPropositionalLogic />],
	["Wiki", <WikiPropositionalLogic />],
	["Kontakt", <Kontakt />],
];

interface IState {
	// corresponds with the page ID's
	displayPage: number;
}

class App extends Component< {} , IState > {

	public state = {
		displayPage: 0,
	};

	public render() {
		return (
				<React.Fragment>
					<Navigation
						setStateParent={(newState: object) => this.setState(newState)}
						pages={pages}
					/>
					<div className={styles.pageContent}>
						{pages[this.state.displayPage][1]}
					</div>
				</React.Fragment>
		);

	}

}

export default App;
