import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { FaStore } from "react-icons/fa";

import "../../../styles/navigation.css";

export const AdminNavbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	return (
		<nav className="admin-navbar-main">
			<button onClick={()=>navigate("/")}>
				<FaStore/> Ir a la Tienda
			</button>
			<div className="navbar-user">
				<img className="navbar-user-icon"  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"/>
				{store.user.name}
			</div>
		</nav>
	);
};
