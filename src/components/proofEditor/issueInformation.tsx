import React from "react";
import Issue from "../../issueHandling/issue";
import styles from "./proofEditor.module.scss";

export interface Props {
	issue: Issue;
}

export class IssueInformation extends React.Component<Props> {

	public render() {
		return <div className={styles.IssueInformationLine}>
				{this.props.issue.message + " " + this.renderPosition()}
			</div>;

	}

	private renderPosition() {
		const position = this.props.issue.position;

		if (isPosition(position)) {
			return <div className={styles.PositionInformation}>
				{" Von Index " + position!.fromIndex + " bis " + position!.toIndex}
			</div>;
		}

		return;
	}

}

function isPosition(object: any): boolean {
	return typeof object.toIndex === "number" && typeof object.fromIndex === "number";
}

export default IssueInformation;
