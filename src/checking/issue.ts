import IssueCode from "./issueCodes";
import Position from "./position";

export enum Severity {
	/** A problem that does not affect the correctness of the
	 * input and can possibly be ignored.
	 */
	Hint,
	/** A problem that is not technically making the input
	 * incorrect, but is either indicating or encouraging a
	 * real problem.
	 */
	Warning,
	/** A solid incorrectness in the users input, that is not
	 * preventing the further checking process to take place.
	 */
	Error,
	/** A problem that is immediately stopping all further
	 * attempts to check the input.
	 */
	FatalError,
}

/** A problem detected in the user's input (opposed to an
 * {@see Error} which represents a problem with the application).
 */
export default interface Issue {
	/** Indicates how bad the issue is. */
	severity: Severity;
	/** A value that uniquely identifies the kind of issue. */
	code: IssueCode;
	/** Optional. Points to the location in the users input
	 * this issue refers to.
	 */
	position?: Position;
	/** A detailed message for this error. */
	message?: string;
}
