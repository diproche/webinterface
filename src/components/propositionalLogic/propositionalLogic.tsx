import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavigationPropositionalLogic from "./navigationPropositionalLogic";
import ProofEditor from "./proofEditor";
import TutorialPropositionalLogic from "./tutorialPage";

// tslint:disable-next-line: no-empty-interface
export interface Props {
}

// tslint:disable-next-line: no-empty-interface
interface State {
}

class PropositionalLogic extends Component<Props, State> {
	public render() {

		return (
			<BrowserRouter>
				<React.Fragment>
					<NavigationPropositionalLogic />
					<Switch>
						<Route exact path="/" component={NavigationPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/tutorial" component={TutorialPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/beispiele" component={Examples} />
						<Route exact path="/aussagenlogisches_beweisen/uebungen" component={Exercises} />
						<Route exact path="/aussagenlogisches_beweisen/sandbox" component={ProofEditor} />
						<Route component={ErrorPage404} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

// These are just demonstration pages. Please don't implement the pages here.
// Implement them as external components which will be imported

const Examples = () => {
	return (
		<div>
			<p>Hier müssen noch Beispiele hin</p>
		</div>
	);
};
const Exercises = () => {
	return (
		<div>
			<p>Hier müssen noch Übungsaufgaben hin</p>
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

export default PropositionalLogic;
