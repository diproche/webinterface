import React from "react";
import styles from "./navigationBar.module.scss";

interface IProps {
	// The second field won't actually be used
	pages: Array<[string, any]>;
	setStateParent(newState: object): void;
}

const Navigation = (props: IProps) => {

	const navigationElements: JSX.Element[] = [];

	props.pages.forEach((page: [string, any], index: number) => {
		navigationElements.push(<li>
			<div
				onClick={() => props.setStateParent({displayPage: index})}
			>
				{page[0]}
			</div>
		</li>);
	});

	return (<div className={styles.navigationBar}>
		<ul className={styles.headline}>
			{navigationElements}
		</ul>
	</div >);
};

export default Navigation;
