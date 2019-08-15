import React from "react";
import styles from "./wiki.module.scss";

class WikiPropositionalLogic extends React.Component {

	public render() {
		return <div className={styles.site}>
			<h1>Allgemeines</h1>
			<p>Die Objekte, die man in der Aussagenlogik untersucht,
				sind <b>Aussagen</b>, welche mit sogenannten Junktoren verknüpft werden.
				Dabei geht man von elementaren Aussagen aus. Sogenannten
				Atomen.</p>
				<h2>Atome</h2>
				<p>Atome werden meist mit A, B, C, ..., Z
				gekennzeichnet. Jedem Atom kann einen Wahrheitswert zugeordnet werden.
				Wir betrachten ausschließlich die Wahrheitswerte "wahr" und "falsch".
				Atome heißen auch "atomare Formeln".</p>
				<h2>Nicht-atomare Formeln</h2>
				<p>Atomare Formeln können mit den Junktoren
				&#172; (nicht), &amp; (und), | (oder), &rarr; (Implikation) und &harr; (Äquivalenz).
				&#172; negiert den Wahrheitswert einer Formel. Das heißt eine wahre Formel wird falsch
				und eine falsche Formel wird wahr. Statt &amp; sieht man normalerweise
				das Zeichen &#8743; und statt | das Zeichen &#8744;. Auf einer gewöhnlichen Tastatur
				gibt es diese Zeichen jedoch nicht. Daher benutzen wir in Diproche lieber die ersten
				beiden Zeichen. Alternativ kann man auch die Worte "und" und "oder" schreiben.
				&#172; ist der einzige Junktor, der nur auf einer statt auf zwei Formeln operiert.
				Wenn A und B Formeln sind, dann ist A&amp;B wahr genau dann, wenn
				sowohl A, als auch B wahr ist. Ansonsten ist A&amp;B falsch.
				A | B ist wahr genau dann, wenn mindestens eine der Formeln
				A und B wahr ist. Ansonsten ist A | B falsch.
				A&rarr;B ist wahr genau dann, wenn entweder die Voraussetzung A
				falsch ist oder A und B wahr sind. Ansonsten ist A&rarr;B falsch.
				A&harr;B ist wahr genau dann, wenn A und B beide falsch oder beide
				wahr sind. Ansonsten ist A&harr;B falsch.</p>
				<h2>Klassifikation einiger Formeln</h2>
				<p> Sei F eine Formel mit n Aussagenvariablen. Man kann allen Aussagenvariablen
					von F auf 2<sup>n</sup> verschiedene Weisen einen Wahrheitswert zuordnen.
					F heißt nun <b>allgemeingültig</b> oder auch <b>Tatutologie</b>, falls jede Wertebelegung F wahr macht.
					Gibt es mindestens eine Wahrheitswertebelegung, sodass F wahr wird, so heißt
					F <b>erfüllbar</b>. Gibt es keine solche Wahrheitswertebelegung, dann heißt F
					<b>unerfüllbar</b> oder auch <b>Kontradiktion</b>.
				</p>
				<h2>Was ist ein Beweis?</h2>
				Wenn man etwas beweisen muss, so handelt es sich immer um eine Aussage.
				Wir nennen die zu zeigende Aussage Z. Eventuell gibt es auch einige Annahmen
				die man treffen kann. Diese können auch als Aussage gesehen werden. Wir nennen
				sie A. Dann besteht ein Beweis von Z daraus, Formeln zu finden, sagen wir B,..., Y,
				sodass A&rarr;B&rarr;...&rarr;Y&rarr;Z eine allgemeingültige Formel ist. Es muss also eine
				Abfolge von Schlussfolgerungen gefunden werden, die in jedem Fall wahr ist. Streng genommen
				können in allen Aussagen auch "quantifizierte" Variablen auftauchen. Dies wird aber erst
				zu einem späteren Zeitpunkt behandelt.
				<h2>Literatur</h2>
				Über die Unibibliothek gibt es zu dem Thema folgende
				Bücher gratis als E-Book-Download:
				<p>Martin Ziegler - Mathematische Logik, 2017, 2. Auflage</p>
				<p>Kurt-Ulrich Witt - Mathematische Grundlagen für die Informatik, 2013</p>
		</div>;

	}

}

export default WikiPropositionalLogic;
