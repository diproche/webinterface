import React from "react";
import shortid from "shortid";
import Issue from "../../util/issueHandling/issue";
import styles from "../propositionalLogic/propositionalLogic.module.scss";
import IssuePositionInformation from "./issuePositionInformation";

export interface Props {
	issue: Issue;
}

export class IssueInformation extends React.Component<Props, {}> {

	public render() {

		let displayedPosition: any = "";
		const position = this.props.issue.position;
		if (position) {
			displayedPosition =
				<IssuePositionInformation
				key={shortid.generate()}
				position={position!}
			/>;
		}

		return <div className={styles.IssuePositionInformation}>
			{this.props.issue.message} {displayedPosition}
		</div>;

	}

}

export default IssueInformation;
