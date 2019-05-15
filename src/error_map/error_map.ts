// creating reference map with errormessages; could add some stuff to the map if needed
const errorReferenceMap = new Map();
errorReferenceMap.set(100, "Error 100");
errorReferenceMap.set(101, "Error 101");
errorReferenceMap.set(102, "Error 102");
errorReferenceMap.set(103, "Error 103");
errorReferenceMap.set(104, "Error 104");
// ADD ERRORdescription here HERE
errorReferenceMap.set(200, "200|Bracket Error: some brackets are not closed.");
errorReferenceMap.set(201, "201|Bracket Error: too much brackets has been closed or has been closed before a bracket were opened.");
errorReferenceMap.set(202, "202|Missing Statement Error: It seems, you forgot some statements inside your logic expression.");
errorReferenceMap.set(203, "203|Missing Statement Error: It seems, you forgot to add a statement at the end of your logic expression.");
errorReferenceMap.set(204, "204|Missing Connector Error: It seems, you forgot some connector between your statements inside your logic expression.");

let errorList: string[] = [];

export function emptyErrorList() {
	errorList = [];
}

export function addErrorToErrorMap(keyIndex: number) {
	errorList.push(findErrorMessage(keyIndex));
}

export function removeErrorFromErrorMap(keyIndex: number) {
	errorList.delete(keyIndex);
}

export function findErrorMessage(keyIndex: number) {
	return errorReferenceMap.get(keyIndex);
}
export function listCollectedErrors() {
	return errorList;
}
