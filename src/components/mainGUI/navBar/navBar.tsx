import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import navBar from "./navBar.module.scss";

export class NavBar {
	public render() {
		return <div className={navBar.name}>
		</div>;
	}
}
export default NavBar;
