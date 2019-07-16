export default function uniqueValues<T>(values: Iterable<T>): Iterable<T> {
		return new Set(values);
	}
