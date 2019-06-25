import React, { Component } from "react";
import { MainPage } from "./components/GUI/mainPage/mainPage";

class App extends Component {
	public render() {
		window.location.href = "#startseite";
		return (
			<div className="App">
			<MainPage />
			</div>
		);

	}

}

export default App;
