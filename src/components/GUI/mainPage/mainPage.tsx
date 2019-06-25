import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import mainLayout from "../../CSS/mainLayout.module.scss";
import navBar from "../../CSS/navBar.module.scss";

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface State {
	name: string;
	href: string;
}

export class MainPage extends React.Component<Props, State> {
	public state = {
		name: "Startseite",
		href: "#startseite",
	};

	public render() {
		// return SiteLayout;
		window.location.href = "#startseite";
		return <div className={mainLayout.page}>
			<div className={navBar.name}>
				<ul>
					<li><a className={this.state.name} href={this.state.href}>Startseite</a></li>
					<li><a className="proofEditor" href="#aussagenlogisches_beweisen">Aussagenlogisches Beweisen</a></li>
					<li><a className="settings" href="#einstellungen">Einstellungen</a></li>
					<li><a className="contact" href="#kontakt">Kontakt</a></li>
					<li><a className="impressum" href="#impressum">Impressum</a></li>
				</ul>
			</div>
		</div>;

	}


}