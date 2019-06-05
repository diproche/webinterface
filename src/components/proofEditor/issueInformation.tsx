import React from "react";
import Issue from "../../issueHandling/issue";
import styles from "./proofEditor.module.scss";

export interface Props {
	message: string;
}

export class IssueInformation extends React.Component<Props> {

	public render() {
		return <div className={styles.IssueInformationLine}>
				{this.props.message}
			</div>;

	}

}

export default IssueInformation;
