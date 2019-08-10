import React from "react";

import styles from "./propositionalLogic.module.scss";

class WikiPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<p><h1>Allgemeines</h1>
				Die Objekte, die man in der Aussagenlogik untersucht,
				sind <b>Aussagen</b>, welche mit sogenannten Junktoren verknüpft werden.
				Dabei geht man von elementaren Aussagen aus. Sogenannten
				Atomen.
				<h2>Atome</h2>
				Atome werden meist mit A, B, C, ..., Z
				gekennzeichnet. Jedes Atom kann einen Wahrheitswert haben.
				Wir betrachten ausschließlich die Wahrheitswerte "wahr" und "falsch".
				Atome heißen auch "atomare Formeln".
				<h2>Kompliziertere Formeln</h2>
				Atomare Formeln können mit den Junktoren
				&#172; (nicht), &amp; (und), | (oder), &rarr; (Implikation) und &harr; (Äquivalenz).
				&#172; negiert den Wahrheitswert einer Formel. Es ist der
				einzige Junktor, der nur auf einer statt auf zwei Formeln
				operiert.
				Wenn A und B Formeln sind, dann ist A&amp;B wahr genau dann, wenn
				A und B wahr sind. Ansonsten ist A&amp;B falsch.
				A | B ist wahr genau dann, wenn mindestens eine der Formeln
				A und B wahr ist. Ansonsten ist A | B falsch.
				A&arr;B ist wahr genau dann, wenn entweder die Voraussetzung A
				falsch ist oder A und B wahr sind. Ansonsten ist A&arr;B falsch.
				A&harr;B ist wahr genau dann, wenn A und B denselben Wahrheitswert
				haben. Ansonsten ist A&harr;B falsch.
			</p>
		</div>;

	}

}

export default WikiPropositionalLogic;
