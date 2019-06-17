export class UnexpectedError extends Error {
	constructor(unexpected: never) {
		super(`Unexpected value '${unexpected}'!`);
	}
}
