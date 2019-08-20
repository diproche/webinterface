import React from "react";

class ProofEditor extends React.Component {

	public render() {
		return <div>
			<h1>Willkommen bei Diproche!</h1>
			<p>
				<b>Diproche</b> steht für <b>Didactical proof checking</b>. Das heißt im Wesentlichen, dass Diproche die
				Möglichkeit bietet, Beweise auf ihre Richtigkeit zu überprüfen. Dafür müssen die Beweise auf eine
				bestimmte Art aufgeschrieben werden. Wie man das macht, kann man in der Kategorie <b>Beispiele</b> sehen.
				Unter <b>Übungen</b> gibt es vorgefertigte Aufgabenstellungen, die man durch
				einen Beweis lösen soll. Will man eine eigene Aussage formulieren und beweisen,
				kann man die Kategorie <b>Freies Üben</b> dafür nutzen. Wenn man noch nicht
				allzu vertraut mit der Theorie hinter dem ist, was man beweisen möchte, findet
				man im <b>Wiki</b> einige Informationen dazu. Bei Problemen befinden sich unter <b>Kontakt</b> die
				passenden Ansprechpartner. Viel Spaß beim Beweisen!
			</p>
		</div>;

	}

}

export default ProofEditor;
