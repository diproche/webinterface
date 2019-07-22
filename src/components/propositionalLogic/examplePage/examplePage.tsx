import React from "react";

import styles from "../propositionalLogic.module.scss";
import { Example, pickExample } from "./exampleCollection";

class ExamplesPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<div>
				<p>Hier sollten Beispiele stehen. Entweder Zufällig generierte bzw. ausgewählte Aufgaben (nach schiwerigkeitsgrad?)
				 oder festes schema)</p>
				<p>Click the button to display a random example.</p>
				<button className={styles.buttons}
					onClick={this.button}>
					Nächstes Beispiel
					</button>

			</div>
			<div className={styles.proofEditor}>
				<p id="exampleDescription">Beispiel Nummer 1</p>
				<table id="exampleDescription">

					<tr>
						<th>Aufgabenstellung</th>
						<td>Erklärung</td>

					</tr>
					<tr>
						<td>Es seien a, b und c Aussagen.</td>
						<td></td>

					</tr>
					<tr>
						<td>Angenommen a ->(b -> c)</td>
						<td></td>

					</tr>
					<tr>
						<td>Angenommen ferner es gilt (a und b)</td>
						<td></td>
					</tr>
					<tr>
						<th>Beweis</th>
						<th></th>
					</tr>
					<tr>
						<td>Dann folgt a.</td>
						<td></td>
					</tr>
					<tr>
						<td>Ausserdem folgt b.</td>
						<td></td>
					</tr>
					<tr>
						<td>Damit gilt (b -> c).</td>
						<td></td>
					</tr>
					<tr>
						<td>Ferner folgt c.</td>
						<td></td>
					</tr>
					<tr>
						<th>Ziel</th>
						<th></th>
					</tr>
					<tr>
						<td>Also gilt $a -> (b -> c) -> (a und b) -> c$.</td>
						<td>Dies soll bewiesen werden!</td>
					</tr>
					<tr id="exampleDescription">
						<td ></td>
						<td>Griffin</td>

					</tr>
					<tr>
						<td><p id="exampleContent"></p></td>
						<td><button className={styles.buttons}
							onClick={this.button}>
							BING
					</button>
						</td>
						<td><button className={styles.buttons}
							onClick={this.button}>
							BING
					</button>
						</td>

					</tr>
					<tr>
						<td><p id="exampleConclusion">TEST</p></td>
						<td>Swanson</td>

					</tr>

				</table>
				<p id="exampleDescription"></p>
				<p id="exampleContent"></p>
				<p id="exampleConclusion"></p>

			</div>
		</div >;
	}

	private button = async (): Promise<void> => {
		const exampleDiscription = document.getElementById("exampleDescription");
		const exampleContent = document.getElementById("exampleContent");
		const exampleConclusion = document.getElementById("exampleConclusion");
		const randomExample: Example = pickExample();
		if (exampleDiscription !== null && exampleContent !== null && exampleConclusion !== null) {
			exampleDiscription.innerHTML = randomExample.exampleDiscription;
			exampleContent.innerHTML = randomExample.exampleContent;
			exampleConclusion.innerHTML = randomExample.exampleConclusion;

		}
	}
}

export default ExamplesPropositionalLogic;
