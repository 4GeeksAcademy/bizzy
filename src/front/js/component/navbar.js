import React from "react";
import { MdArrowForwardIos } from "react-icons/md"
import "../../styles/sidebar.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar-main">
			<span className="navbar-user">
				<img className="navbar-user-icon"  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"/>
				Stefano
				<MdArrowForwardIos className="navbar-user-arrow"/>
			</span>
		</nav>
	);
};
