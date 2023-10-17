import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (<div style={{padding: "2%"}}>
		<h1>Overview</h1>

		<div className="modulito">
			<span style={{display: "flex", justifyContent: "space-between"}}>	<p >Ventas totales</p>	<p>💚</p>	</span>
			
			<span style={{display: "flex"}}>	<h2 style={{textAlign: "center"}}>$1000</h2>		</span>
		</div>


		</div>
	);
};
