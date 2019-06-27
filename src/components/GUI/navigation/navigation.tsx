import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../CSS/navBar.module.scss";

const Navigation = () => {

		return (<div className={styles.navigation}>
				<ul>
					<li><NavLink to="/">Startseite</NavLink></li>
					<li><NavLink to="/aussagenlogisches_beweise">Aussagenlogisches Beweisen</NavLink></li>
					<li><NavLink to="/einstellungen">Einstellungen</NavLink></li>
					<li><NavLink to="/kontakt">Kontakt</NavLink></li>
					<li><NavLink to="/impressum">Impressum</NavLink></li>
				</ul>
		</div>);
};

export default Navigation;
