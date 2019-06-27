import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navigation from "./components/GUI/navigation/navigation";
import ProofEditor from "./components/GUI/proofEditor/proofEditor";

class App extends Component {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<Switch>
						<Route path="/" component={Startseite} exact />
						<Route path="/aussagenlogisches_beweise" component={ProofEditor} exact />
						<Route path="/einstellungen" component={Einstellungen} exact />
						<Route path="/kontakt" component={Kontakt} exact />
						<Route path="/impressum" component={Impressum} exact />
						// <Route component={ErrorPage404} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

// These are just demonstration pages. Please don't implement the pages here.
// Implement them as external components which will be imported

const Startseite = () => {
	return (
		<div>
			<p>Startseite</p>
		</div>
	);
};

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

const Impressum = () => {
	return (
		<div>
			<p>Impressum</p>
		</div>
	);
};

export default App;
