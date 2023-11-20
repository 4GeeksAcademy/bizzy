import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

import { MdArrowForwardIos } from "react-icons/md"
import "../../../styles/navigation.css";
import { Link } from "react-router-dom";

export const AdminNavbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	return (
		<nav className="admin-navbar-main">
			<img src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/shop%2Fimage.png?alt=media&token=3fa8c0af-c2a8-4f28-9a9d-59ee374921af"/>
			<div className="navbar-user">
				{store.user && <button onClick={()=>actions.logout()}>logout</button>}
				{!store.user && <button onClick={()=>navigate("/login")}>login</button>}
				{store.adminNav && <span onClick={()=>navigate("/")}>shop</span>}
				<img className="navbar-user-icon"  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"/>
				{store.user.name || "NoOne"}
				<MdArrowForwardIos className="navbar-user-arrow"/>
			</div>
		</nav>
	);
};
