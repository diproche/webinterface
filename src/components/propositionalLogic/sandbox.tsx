import React from "react";
import ProofEditor, { IParentState } from "../proofEditor/proofEditor";

class Sandbox extends React.Component< {}, IParentState > {

	public state: IParentState =  {
		userInput: "",
		issues:  [],
	};

	public render() {
		return <React.Fragment>
			<ProofEditor
				userInput = {this.state.userInput}
				issues = {this.state.issues}
				setStateParent = {(input) => this.setState(input)}
			/ >
		</React.Fragment>;
	}

}

export default Sandbox;
