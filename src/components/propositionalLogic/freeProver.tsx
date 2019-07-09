import React from "react";
import ProofEditor from "./proofEditor";
import styles from "./propositionalLogic.module.scss";

class FreeProverPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<p>Hier kannst du frei Beweise üben</p>
			<ProofEditor/>
		</div>;

	}

}

export default FreeProverPropositionalLogic;
