import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import siteLayout from "./siteLayout.module.scss";

export class SiteLayout extends React.Component{

		public render() {
				// return SiteLayout;
				return <div className={siteLayout.page}>
				</div>;

		}

}
export default SiteLayout;
