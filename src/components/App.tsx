// tslint:disable:file-name-casing
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styles from "./generalStyles/pageLayout.module.scss";

// tslint:disable: ordered-imports
import MainPage from "./mainPage/mainPage";
import Navigation from "./navigationBar/navigationBar";
import Kontakt from "./contact/contact";
import ErrorPage404 from "./errorPage404/errorPage404";

import ExamplesPropositionalLogic from "./propositionalLogic/examplePage";
import ExercisesPropositionalLogic from "./propositionalLogic/exercises";
import SandboxPropositionalLogic from "./propositionalLogic/sandbox";
import WikiPropositionalLogic from "./propositionalLogic/wiki";
// tslint:enable: ordered-imports

class App extends Component<{}, {}> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<div className={styles.pageContent}>
						<Switch>

							<Route exact path="/" component={MainPage} />
							<Route exact path="/examples" component={ExamplesPropositionalLogic} />
							<Route exact path="/exercises" component={ExercisesPropositionalLogic} />
							<Route exact path="/sandbox" component={SandboxPropositionalLogic} />
							<Route exact path="/wiki" component={WikiPropositionalLogic} />
							<Route exact path="/contact" component={Kontakt} />
							<Route component={ErrorPage404} />

						</Switch>
					</div>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

export default App;
