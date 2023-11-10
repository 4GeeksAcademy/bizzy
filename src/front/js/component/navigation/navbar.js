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
		<nav className="navbar-main">
			<div className="navbar-user">
				{store.adminNav && <span onClick={()=>navigate("/")}>shop</span>}
				{store.user && store.user.admin && !store.adminNav && <span onClick={()=>navigate("/admin")}>admin</span>}
				<img className="navbar-user-icon"  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"/>
				Stefano
				<MdArrowForwardIos className="navbar-user-arrow"/>
			</div>
		</nav>
	);
};
