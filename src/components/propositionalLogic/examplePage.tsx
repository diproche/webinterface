import React from "react";

import styles from "../propositionalLogic.module.scss";

class ExamplesPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<div>
				<p>Hier sollten Beispiele stehen. Entweder Zufällig generierte bzw. ausgewählte Aufgaben (nach schiwerigkeitsgrad?)
				 oder festes schema)</p>
			</div>
			<div className={styles.proofEditor}>
			<p>Beispiel 1:</p>
				<table>
					<tr>
						<th>Aufgabenstellung</th>
						<th>Erklärung</th>
					</tr>
					<tr>
					<td>Es seien a, b und c Aussagen.</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Angenommen a ->(b -> c)</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Angenommen ferner es gilt (a und b)</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Dann folgt a.</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Ausserdem folgt b.</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Damit gilt (b -> c).</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Ferner folgt c.</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>Also gilt $a -> (b -> c) -> (a und b) -> c$.</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
					<tr>
					<td>test1</td>
					<td className = {styles.element}> "test2" </td>
					</tr>
				</table>
			</div>

		</div >;
	}
}

export default ExamplesPropositionalLogic;
