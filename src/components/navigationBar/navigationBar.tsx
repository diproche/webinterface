import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./navigationBar.module.scss";

const Navigation = () => {

	return (<div className={styles.navigationBar}>
		<ul>
			<li><NavLink to="/">Startseite</NavLink></li>
			<li className={styles.dropdown}>
			<a className={styles.dropdownButton}>Spielwiese</a>
				<div className={styles.dropdownContent}>
					<NavLink to="/aussagenlogisches_beweise">Aussagenlogisches Beweisen</NavLink>
					<NavLink to="/notRdyYet">coming soon</NavLink>
					<NavLink to="/notRdyYet2">coming soon too</NavLink>
				</div>
			</li>
			<li><NavLink to="/einstellungen">Einstellungen</NavLink></li>
			<li><NavLink to="/kontakt">Kontakt</NavLink></li>
		</ul>
	</div >);
};

export default Navigation;
