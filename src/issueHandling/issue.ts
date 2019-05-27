import Position from "./position";

/** A problem detected in the user's input (opposed to an
 * {@see Error} which represents a problem with the application).
 */
export default interface Issue {
	/** Indicates how bad the issue is. */
	severity: string;
	/** A value that uniquely identifies the kind of issue. */
	code: string;
	/** Optional. Points to the location in the users input
	 * this issue refers to.
	 */
	position?: Position;
	/** A detailed message for this error. */
	message: string;
}