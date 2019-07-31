import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./booleanAlgebra.module.scss";

const NavigationBooleanAlgebra = () => {

	return (<div className={styles.navigationPropositionalLogic}>
		<ul className={styles.sidebar}>
			<li className={styles.sidebarHeadline}>Boolesche Algebra</li>
			<li><NavLink to="/boolesche_algebra/tutorial">Tutorial</NavLink></li>
			<li><NavLink to="/boolesche_algebra/beispiele">Beispiele</NavLink></li>
			<li><NavLink to="/boolesche_algebra/uebungen">Übungsaufgaben</NavLink></li>
			<li><NavLink to="/boolesche_algebra/sandbox">Freies Beweisen</NavLink></li>
			<li><NavLink to="/boolesche_algebra/wiki">Wiki</NavLink></li>
		</ul>
	</div >);
};

export default NavigationBooleanAlgebra;
