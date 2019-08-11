import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./navigationBar.module.scss";

const Navigation = () => {

	return (<div className={styles.navigationBar}>
		<ul className={styles.headline}>
			<li><NavLink to="/">Startseite</NavLink></li>
			<li><NavLink to="/examples">Beispiele</NavLink></li>
			<li><NavLink to="/exercises">Übungen</NavLink></li>
			<li><NavLink to="/sandbox">Freies Üben</NavLink></li>
			<li><NavLink to="/wiki">Wiki</NavLink></li>
			<li><NavLink to="/contact">Kontakt</NavLink></li>
		</ul>
	</div >);
};

export default Navigation;
