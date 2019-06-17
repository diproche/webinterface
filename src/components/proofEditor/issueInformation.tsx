import React from "react";
import Issue from "../../issueHandling/issue";
import IssuePositionInformation from "./issuePositionInformation";
import styles from "./proofEditor.module.scss";

export interface Props {
	issue: Issue;
}

export class IssueInformation extends React.Component<Props> {

	public render() {

		let displayedPosition: any = "";
		const position = this.props.issue.position;
		if (isPosition(position)) {
			displayedPosition = <IssuePositionInformation position={ position! } />;
		}

		return <div className={styles.IssuePositionInformation}>
				{this.props.issue.message} {displayedPosition}
			</div>;

	}

}

function isPosition(object: any): boolean {
	return object != null && typeof object.toIndex === "number" && typeof object.fromIndex === "number";
}

export default IssueInformation;
