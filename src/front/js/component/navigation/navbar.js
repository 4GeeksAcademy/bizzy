import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

import { MdArrowForwardIos } from "react-icons/md"
import "../../../styles/navigation.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	return (
		<nav className="navbar-main" style={{background: "#540EA7"}}>
			<img src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/shop%2Fimage.png?alt=media&token=3fa8c0af-c2a8-4f28-9a9d-59ee374921af"
			onClick={()=> navigate("/")}/>
			<div className="navbar-left">
				{store.user && store.user.admin && !store.adminNav && <div onClick={()=>navigate("/admin")}>admin</div>}
				<div>24/7 help</div>
				{store.user && <div onClick={()=>actions.logout()}>account</div>}
				{!store.user && <div onClick={()=>navigate("/login")}>login</div>}
				<div>cart</div>
			</div>
		</nav>
	);
};
