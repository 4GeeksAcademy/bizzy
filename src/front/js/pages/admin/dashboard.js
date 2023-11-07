import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/dashboard.css";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.changeTab("dashboard")
	  }, []);

	return (<div style={{margin: "50px 6vw"}}>
			<div className="customers-header">
          		<h2>Overview</h2>
	  		</div>
			<div className="modulito">
				<span style={{display: "flex", justifyContent: "space-between"}}>	<p >Ventas totales</p>	<p>💚</p>	</span>
				
				<span style={{display: "flex"}}>	<h2 style={{textAlign: "center"}}>$1000</h2>		</span>
			</div>

	</div>
	);
};
