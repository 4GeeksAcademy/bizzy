import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../../styles/navigation.css";

import { Cart } from "../shop/cart";

export const Navbar = (navb) => {
	const { store, actions } = useContext(Context);
	const [ cart, setCart ] = useState(false);
	const navigate = useNavigate();
	return <>
		<nav className="navbar-main" style={{background: "#540EA7"}}>
			<img src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/shop%2Fimage.png?alt=media&token=3fa8c0af-c2a8-4f28-9a9d-59ee374921af"
			onClick={()=> navigate("/")}/>
			<div className="navbar-right">
				{store.user && store.user.admin && !store.adminNav && <div onClick={()=>navigate("/admin")}>admin</div>}
				<div>24/7 help</div>
				{store.user && <div onClick={()=>navigate("/account")}>account</div>}
				{!store.user && <div onClick={()=>navigate("/login")}>login</div>}
				<div onClick={()=> setCart(true)}>cart</div>
			</div>
		</nav>
		{cart && <Cart useCart={setCart}/>}
	</>
};
