import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Props } from "../../../App";
import siteLayout from "../../CSS/siteLayout.module.scss";

// tslint:disable-next-line: no-empty-interface
interface State {
}

export class SiteLayout extends React.Component<Props, State> {
		public state = {
				name: "Startseite",
				href: "#startseite",
		};

		public render() {
				// return SiteLayout;
				window.location.href = "#startseite";
				return <div className={siteLayout.page}>
				</div>;

		}

}
export default SiteLayout;
