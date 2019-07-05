import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./navigationPropositionalLogic.module.scss";

const NavigationPropositionalLogic = () => {

	return (<div className={styles.navigationPropositionalLogic}>
		<ul className={styles.sidebar}>
			<li><NavLink to="/aussagenlogisches_beweisen/tutorial">Tutorial</NavLink></li>
			<li><NavLink to="/aussagenlogisches_beweisen/beispiele">Beispiele</NavLink></li>
			<li><NavLink to="/aussagenlogisches_beweisen/uebungen">Übungsaufgaben</NavLink></li>
			<li><NavLink to="/aussagenlogisches_beweisen/sandbox">Freies Beweisen</NavLink></li>
		</ul>
	</div >);
};

export default NavigationPropositionalLogic;
