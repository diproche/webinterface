/**
 * Creates a new version of an iterable values without duplicated
 */
export default function uniqueValues<T>(values: Iterable<T>): Iterable<T> {
	return new Set(values);
}
