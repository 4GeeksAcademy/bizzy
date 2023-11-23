import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";

import "../../../styles/navigation.css";

import { Cart } from "../shop/cart";

export const Navbar = (navb) => {
	const { store, actions } = useContext(Context);
	const [ inCartProducts, setInCartProducts ] = useState(0)
	const [ cart, setCart ] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		let tempTotalQ = 0
		if (store.cart.length > 0){
			for (let item of store.cart ){
				tempTotalQ += item.quantity
				}
			setInCartProducts(tempTotalQ)
		}
		else{
			setInCartProducts(0)
		}
	}, [store.cart]);

	useEffect(() => {
		let tempTotalQ = 0
		if (store.cart.length > 0){
			for (let item of store.cart ){
				tempTotalQ += item.quantity
				}
			setInCartProducts(tempTotalQ)
		}
	}, [store.random]);


	return <>
		<nav className="navbar-main" style={{background: "#540EA7"}}>
			<img src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/shop%2Fimage.png?alt=media&token=3fa8c0af-c2a8-4f28-9a9d-59ee374921af"
			onClick={()=> navigate("/")}/>

			<input className="nav-shop-search-products" placeholder="Buscar productos..."
			onKeyDown={(e)=> e.key === "Enter"? navigate(`/search/${e.target.value}`) : ""}/>
			<HiMiniMagnifyingGlass  className="nav-shop-search-icon"/>
			<div className="navbar-right">
				{store.user && store.user.admin && !store.adminNav && <button onClick={()=>navigate("/dashboard")}>
					<MdSpaceDashboard/> ir a admin</button>}
				{store.user && <div onClick={()=>navigate("/account")}>
				 	<FaUserCircle/> cuenta
				 </div>}
				{!store.user && <div onClick={()=>navigate("/login")}>
					<FaUserCircle/>iniciar sesión
				</div>}
				<div onClick={()=> setCart(true)}>
					<span className="nav-cart-quantity">{inCartProducts}</span>
					<PiShoppingCartFill style={{fontSize:  "28px"}}/> carrito
				</div>
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
