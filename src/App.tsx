import React, { Component } from "react";
import NavBar from "./components/GUI/mainPage/navBar";
import SiteLayout from "./components/GUI/mainPage/siteLayout";
import ProofEditor from "./components/GUI/proofEditor/proofEditor";

// tslint:disable-next-line: no-empty-interface
export interface Props {
}

// tslint:disable-next-line: no-empty-interface
interface State {
}

class App extends Component<Props, State> {
	public render() {
		window.location.href = "#startseite";
		return (
			<div className="App">
			<SiteLayout />
			<NavBar />
			<ProofEditor />
			</div>
		);

	}

}

export default App;
