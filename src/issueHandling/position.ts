/** Represents a singe position or range within a text. */
export default interface Position {
	fromIndex: number;
	toIndex: number;
}

export function setPosition(from: number, to: number) {
	const position: Position = {
		fromIndex: from,
		toIndex: to,
	};
	return position;
}
