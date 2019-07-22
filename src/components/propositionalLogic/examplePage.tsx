import React from "react";

import styles from "./propositionalLogic.module.scss";

class ExamplesPropositionalLogic extends React.Component {
	public render() {
		return <div className={styles.site}>
			<div className={styles.proofEditor}>
				<table>
					<tr>
						<th>Beispiel 1:</th>
						<th>Erklärung</th>
					</tr>
					<tr>
						<td>Zu zeigen: a -> (b -> c) -> (a und b) -> c.</td>
						<td>Dies soll bewiesen werden. </td>
					</tr>
					<tr>
						<td>Es seien a, b und c Aussagen.</td>
						<td>Vorraussetzung </td>
					</tr>
					<tr>
						<td>Angenommen a ->(b -> c).</td>
						<td>Vorraussetzung </td>
					</tr>
					<tr>
						<td>Angenommen ferner es gilt (a und b).</td>
						<td>Vorraussetzung </td>
					</tr>
					<tr>
						<td>Dann folgt a.</td>
						<td className={styles.element}>a folgt, da (a und b) nur dann wahr ist, wenn a wahr ist. </td>
					</tr>
					<tr>
						<td>Ausserdem folgt b.</td>
						<td className={styles.element}>b folgt, da (a und b) nur dann wahr ist, wenn b wahr ist. </td>
					</tr>
					<tr>
						<td>Damit gilt (b -> c).</td>
						<td className={styles.element}> Die Konlusion (b -> c) gilt, da die Prämissen a,
						sowie (a und b) beide gelten.</td>
					</tr>
					<tr>
						<td>Ferner folgt c.</td>
						<td className={styles.element}> Die Konlusion c gilt, da die Prämissen a, sowie (a und b) beide gelten. </td>
					</tr>
					<tr>
						<td>Also gilt a -> (b -> c) -> (a und b) -> c.</td>
						<td>qed </td>
					</tr>
				</table>
			</div>

		</div >;
	}
}

export default ExamplesPropositionalLogic;
