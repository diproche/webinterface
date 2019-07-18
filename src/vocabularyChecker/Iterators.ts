/**
 * Eliminates duplicates from an Iterable
 * @param values
 */
export default function uniqueValues<T>(values: Iterable<T>): Iterable<T> {
		return new Set(values);
	}
