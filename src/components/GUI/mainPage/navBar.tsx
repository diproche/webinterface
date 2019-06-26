import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Props } from "../../../App";
import navBar from "../../CSS/navBar.module.scss";

interface State {
	name: string;
	href: string;
}

export class NavBar extends React.Component<Props, State> {
	public state = {
		name: "",
		href: "",
	};

	public render() {
		// return navbar;
		return <div className={navBar.page}>
			<Navbar bg="transparent">
				<Navbar.Toggle aria-controls="navbar" />
				<Nav className="navbar">
					<li><Nav.Link className="#mainsite" href="#startseite">Startseite</Nav.Link></li>
					<li><NavDropdown className="playground" title="Spielwiese" id="basic-nav-dropdown">
					<NavDropdown.Item className="proofEditor" href="#aussagenlogisches_beweisen">
							Aussagenlogisches Beweisen</NavDropdown.Item>
						<NavDropdown.Divider />
					<NavDropdown.Item className="randomEditor" href="#notIcludedyet">
							coming soon...</NavDropdown.Item>
						<NavDropdown.Divider />
					<NavDropdown.Item className="anotherrandomEditor" href="#notIcludedyet2">
							coming soon too...</NavDropdown.Item>
					</NavDropdown></li>
					<li><Nav.Link className="settings" href="#einstellungen">Einstellungen</Nav.Link></li>
					<li><Nav.Link className="contact" href="#kontakt">Kontakt</Nav.Link></li>
					<li><Nav.Link className="impressum" href="#impressum">Impressum</Nav.Link></li>
				</Nav>
			</Navbar>
		</div>;
	}

}
export default NavBar;
