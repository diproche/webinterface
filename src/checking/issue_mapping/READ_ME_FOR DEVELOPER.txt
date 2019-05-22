	
/** IMPORTS : maybe you need to configure the path first */
import * as ISSUE from "./issue_mapping";
	
	
	/**
	* IF You want to add an issue use the follow code snippet:
	*/
	const issueJSONObjectKey = /** SELECT ISSUE PATH HERE for example: ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_AT_THE_END;*/;
	
	const severityNumber = /** SELECT TYPE HERE: ISSUE.Severity.HINT|WARNING|ERROR|FATAL-ERROR*/;
	const issueCode = ISSUE.getIssueCodeFromJSON(issueJSONObjectKey); /** get the code/key of the issue path OR write your own code here*/
	const issueMessage = issueJSONObjectKey.MISSING_STATEMENT_AT_THE_END; /** use path and add the last path element to get the issue message OR write your own message here*/
	const positionNumber = /** add a number where the issue is found in the code or add NaN here */; 

	/** creates an issueObject*/
	const issue: IssueObject = ISSUE.createIssue(severityNumber, issueCode, issueMessage, positionNumber);
	
	/** add issue to List*/
	ISSUE.addIssueToIssueList(issue); 