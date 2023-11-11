import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.changeTab("home")
		actions.changeAdminNav(false)
	  }, []);

	return (<>
			<div style={{display: "flex", justifyContent: "center"}}>
				<img style={{width: "1440px", height: "300px", objectFit:"cover"}} src="https://img.freepik.com/premium-photo/banner-large-group-dogs-together-row-orange-background_191971-28737.jpg?w=2000"/>
			</div>
	</>
	);
};
