import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./navigationBar.module.scss";

const Navigation = () => {

	return (<div className={styles.navigationBar}>
		<ul className={styles.headline}>
			<li><NavLink to="/">Startseite</NavLink></li>
			<li className={styles.dropdown}>
				<a className={styles.dropdownButton}>Spielwiese</a>
				<div className={styles.dropdownContent}>
					<NavLink to="/aussagenlogisches_beweisen">Aussagenlogisches Beweisen</NavLink>
					<NavLink to="/boolesche_algebra">Boolesche Algebra</NavLink>
					<NavLink to="/coming_soon">coming soon</NavLink>
				</div>
			</li>
			<li><NavLink to="/einstellungen">Einstellungen</NavLink></li>
			<li><NavLink to="/kontakt">Kontakt</NavLink></li>
		</ul>
	</div >);
};

export default Navigation;
