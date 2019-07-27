/**
 * Returns a new iterable that contains no duplicate values
 * @param values - some iterable in which duplicates should be removed
 */
export default function uniqueValues<T>(values: Iterable<T>): Iterable<T> {
    return new Set(values);
}
