import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Einstellungen from "./components/einstellungen/einstellungen";
import ErrorPage404 from "./components/errorPage404/errorPage404";
import Impressum from "./components/impressum/impressum";
import Kontakt from "./components/kontakt/kontakt";
import MainPage from "./components/mainPage/mainPage";
import Navigation from "./components/navigationBar/navigationBar";
import ExamplesPropositionalLogic from "./components/propositionalLogic/examples";
import ExercisesPropositionalLogic from "./components/propositionalLogic/exercises";
import FreeProverPropositionalLogic from "./components/propositionalLogic/freeProver";
import NavigationPropositionalLogic from "./components/propositionalLogic/navigationPropositionalLogic";
import TutorialPropositionalLogic from "./components/propositionalLogic/tutorial";

class App extends Component<{}, {}> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<Switch>
						<Route exact path="/" component={MainPage} />
						<Route path="/aussagenlogisches_beweisen" component={NavigationPropositionalLogic} />
						<Route exact path="/einstellungen" component={Einstellungen} />
						<Route exact path="/kontakt" component={Kontakt} />
						<Route exact path="/impressum" component={Impressum} />
						<Route component={ErrorPage404} />
					</Switch>
				</React.Fragment>
				<React.Fragment>
					<Switch>
						<Route exact path="/aussagenlogisches_beweisen/tutorial" component={TutorialPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/beispiele" component={ExamplesPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/uebungen" component={ExercisesPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/sandbox" component={FreeProverPropositionalLogic} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

export default App;
