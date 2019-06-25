import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import navBar from "./navBar.module.scss";

export class NavBar {
	public render() {
		return <div className={navBar.page}>
			<ul>
				<li><a className="activeElement" href="#start">Start</a></li>
				<li><a className="activeElement" href="#einstellungen">Einstellungen</a></li>
				<li><a className="activeElement" href="#kontakt">Kontakt</a></li>
				<li><a className="activeElement" href="#impressum">Impressum</a></li>
			</ul>
		</div>;
	}
}
export default NavBar;
