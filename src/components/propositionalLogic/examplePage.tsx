import React from "react";
import NavigatableExamples from "../examples/navigatableExamples";
import data from "./examples.json";

class ExamplePage extends React.Component< {} , {} > {
	public render() {
		return <React.Fragment>
			<NavigatableExamples
				examplesData = { data.examples }
			/>
		</React.Fragment>;
	}

}

export default ExamplePage;
