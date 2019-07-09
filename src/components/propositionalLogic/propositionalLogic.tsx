import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ExercisesPropositionalLogic from ".//exercises";
import ExamplesPropositionalLogic from "./examples";
import FreeProverPropositionalLogic from "./freeProver";
import NavigationPropositionalLogic from "./navigationPropositionalLogic";
import TutorialPropositionalLogic from "./tutorial";

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
						<Route exact path="/aussagenlogisches_beweisen/beispiele" component={ExamplesPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/uebungen" component={ExercisesPropositionalLogic} />
						<Route exact path="/aussagenlogisches_beweisen/sandbox" component={FreeProverPropositionalLogic} />
						<Route component={ErrorPage404} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);

	}

}

const ErrorPage404 = () => {
	return (
		<div>
			<p>404 Page Not Found</p>
		</div>
	);
};

export default PropositionalLogic;
