import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// tslint:disable: ordered-imports
import MainPage from "./components/mainPage/mainPage";
import Navigation from "./components/navigationBar/navigationBar";
import ProofEditor from "./components/proofEditor/proofEditor";
import Einstellungen from "./components/einstellungen/einstellungen";
import Kontakt from "./components/kontakt/kontakt";
import Impressum from "./components/impressum/impressum";
import ErrorPage404 from "./components/errorPage404/errorPage404";
// tslint:enable: ordered-imports

class App extends Component<{}, {}> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<Navigation />
					<Switch>
						<Route exact path="/" component={MainPage} />
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

export default App;
