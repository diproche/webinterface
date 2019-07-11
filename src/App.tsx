import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// tslint:disable: ordered-imports
import MainPage from "./components/mainPage/mainPage";
import Navigation from "./components/navigationBar/navigationBar";
import Einstellungen from "./components/einstellungen/einstellungen";
import Kontakt from "./components/kontakt/kontakt";
import Impressum from "./components/impressum/impressum";
import ErrorPage404 from "./components/errorPage404/errorPage404";

import ExamplesBooleanAlgebra from "./components/booleanAlgebra/examples";
import ExercisesBooleanAlgebra from "./components/booleanAlgebra/exercises";
import FreeProverBooleanAlgebra from "./components/booleanAlgebra/freeProver";
import NavigationBooleanAlgebra from "./components/booleanAlgebra/navigationBooleanAlgebra";
import TutorialBooleanAlgebra from "./components/booleanAlgebra/tutorial";
import WikiBooleanAlgebra from "./components/booleanAlgebra/wiki";

import ExamplesPropositionalLogic from "./components/propositionalLogic/examples";
import ExercisesPropositionalLogic from "./components/propositionalLogic/exercises";
import FreeProverPropositionalLogic from "./components/propositionalLogic/freeProver";
import NavigationPropositionalLogic from "./components/propositionalLogic/navigationPropositionalLogic";
import TutorialPropositionalLogic from "./components/propositionalLogic/tutorial";
import WikiPropositionalLogic from "./components/propositionalLogic/wiki";
// tslint:enable: ordered-imports

class App extends Component<{}, {}> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<Switch>
						<Route exact path="/" component={MainPage} />
						<Route path="/aussagenlogisches_beweisen" component={NavigationPropositionalLogic} />
						<Route path="/boolesche_algebra" component={NavigationBooleanAlgebra} />
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
						<Route exact path="/aussagenlogisches_beweisen/wiki" component={WikiPropositionalLogic} />
					</Switch>
				</React.Fragment>
				<React.Fragment>
					<Switch>
						<Route exact path="/boolesche_algebra/tutorial" component={TutorialBooleanAlgebra} />
						<Route exact path="/boolesche_algebra/beispiele" component={ExamplesBooleanAlgebra} />
						<Route exact path="/boolesche_algebra/uebungen" component={ExercisesBooleanAlgebra} />
						<Route exact path="/boolesche_algebra/sandbox" component={FreeProverBooleanAlgebra} />
						<Route exact path="/boolesche_algebra/wiki" component={WikiBooleanAlgebra} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

export default App;
