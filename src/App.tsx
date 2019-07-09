import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// tslint:disable: ordered-imports
import MainPage from "./components/mainPage/mainPage";
import Navigation from "./components/navigationBar/navigationBar";
<<<<<<< HEAD
import PropositionalLogic from "./components/propositionalLogic/propositionalLogic";
=======
import ProofEditor from "./components/proofEditor/proofEditor";
import Einstellungen from "./components/einstellungen/einstellungen";
import Kontakt from "./components/kontakt/kontakt";
import Impressum from "./components/impressum/impressum";
import ErrorPage404 from "./components/errorPage404/errorPage404";
// tslint:enable: ordered-imports
>>>>>>> master

class App extends Component<{}, {}> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<Switch>
						<Route exact path="/" component={MainPage} />
						<Route exact path="/aussagenlogisches_beweisen" component={PropositionalLogic} />
						<Route exact path="/einstellungen" component={Einstellungen} />
						<Route exact path="/kontakt" component={Kontakt} />
						<Route component={ErrorPage404} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

<<<<<<< HEAD
// These are just demonstration pages. Please don't implement the pages here.
// Implement them as external components which will be imported

const Einstellungen = () => {
	return (
		<div>
			<p>Einstellungen</p>
		</div>
	);
};

const Kontakt = () => {
	return (
		<div>
			<p>Kontakt</p>
		</div>
	);
};

const ErrorPage404 = () => {
	return (
		<div>
			<p>404 Page Not Found</p>
		</div>
	);
};

=======
>>>>>>> master
export default App;
