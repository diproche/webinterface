import React from "react";
import Issue from "../../../issueHandling/issue";
import styles from "../../CSS/proofEditor.module.scss";
import IssuePositionInformation from "./issuePositionInformation";

export interface Props {
	issue: Issue;
}

export class IssueInformation extends React.Component<Props> {

	public render() {

		let displayedPosition: any = "";
		const position = this.props.issue.position;
		if (position) {
			displayedPosition = <IssuePositionInformation position={position!} />;
		}

		return <div className={styles.IssuePositionInformation}>
			{this.props.issue.message} {displayedPosition}
		</div>;

	}

}

export default IssueInformation;
