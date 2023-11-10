import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { MdTrendingUp } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";

import "../../../styles/dashboard.css";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.changeTab("admin")
		actions.changeAdminNav(true)
	  }, []);

	return (<div style={{margin: "50px 6vw"}}>
			<div className="customers-header">
          		<h2>Overview</h2>
	  		</div>
			<div className="dashboard-top">
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
			</div>
			<div className="dashboard-middle">
				<div></div>
				<div></div>
			</div>
			<div className="dashboard-bottom">

			</div>
	</div>
	);
};
