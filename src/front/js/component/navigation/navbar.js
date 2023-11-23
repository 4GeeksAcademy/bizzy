import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
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

			<input className="nav-shop-search-products" placeholder="Buscar productos..."
			onKeyDown={(e)=> e.key === "Enter"? navigate(`/search/${e.target.value}`) : ""}/>
			<HiMiniMagnifyingGlass  className="nav-shop-search-icon"/>
			<div className="navbar-right">
				{store.user && store.user.admin && !store.adminNav && <div onClick={()=>navigate("/dashboard")}>admin</div>}
				<div>24/7 help</div>
				{store.user && <div onClick={()=>navigate("/account")}>account</div>}
				{!store.user && <div onClick={()=>navigate("/login")}>login</div>}
				<div onClick={()=> setCart(true)}>cart</div>
			</div>
		</nav>
		<div className="mini-navbar">
				{store.shop.categories && store.shop.categories.map( (category)=> (
						<div key={category.name} className="mini-nav-category" onClick={()=> navigate(`/category/${category.name}`)}>
							<img src={category.icon}/>
							<span>{category.name}</span>
						</div>
					)
				)}
		</div>
		{cart && <Cart useCart={setCart}/>}
	</>
};
