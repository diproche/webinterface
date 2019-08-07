import React from "react";
import Position from "../../util/issueHandling/position";

import styles from "../propositionalLogic/propositionalLogic.module.scss";

export interface Props {
	position: Position;
}

export class IssuePositionInformation extends React.Component<Props> {

	public render() {
		return <div className={styles.issuePositionInformation}>
			{" Von Index " + this.props.position.fromIndex + " bis " + this.props.position.toIndex}
		</div>;

	}
}

export default IssuePositionInformation;