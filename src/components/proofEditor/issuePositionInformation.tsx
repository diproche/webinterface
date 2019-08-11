import React from "react";
import Position from "../../util/issueHandling/position";

export interface Props {
	position: Position;
}

export class IssuePositionInformation extends React.Component<Props> {

	public render() {
		return <div>
			{" Von Index " + this.props.position.fromIndex + " bis " + this.props.position.toIndex}
		</div>;

	}
}

export default IssuePositionInformation;
