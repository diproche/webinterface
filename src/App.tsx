import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Navigation from "./components/GUI/navigation/navigation";

import ProofEditor from "./components/GUI/proofEditor/proofEditor";

// tslint:disable-next-line: no-empty-interface
export interface Props {
}

// tslint:disable-next-line: no-empty-interface
interface State {
}

class App extends Component<Props, State> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<Switch>
						<Route exact path="/" component={Startseite} />
						<Route exact path="/aussagenlogisches_beweise" component={ProofEditor} />
						<Route exact path="/einstellungen" component={Einstellungen} />
						<Route exact path="/kontakt" component={Kontakt} />
						<Route exact path="/impressum" component={Impressum} />
						<Route component={ErrorPage404} />
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

const ErrorPage404 = () => {
	return (
		<div>
			<p>404 Page Not Found</p>
		</div>
	);
};

export default App;
