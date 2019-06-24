import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import mainLayout from "./mainLayout.module.scss";

export class MainLayout {
	public render() {
		return <div className={mainLayout.page}>
		</div>;
	}
}
export default MainLayout;
