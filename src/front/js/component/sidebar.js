import React from "react";
import { MdSpaceDashboard, MdShoppingBasket, MdReceiptLong, MdPeopleAlt, MdLocalOffer, MdArrowForwardIos, MdStar, MdLogout } from "react-icons/md"
import { Link } from "react-router-dom";
import "../../styles/navigation.css";


export const Sidebar = () => {
	return (
		<div id="sidebar">
            <img src="https://www.nic.do/wp-content/uploads/2016/10/logo-placeholder-3.jpg" className="sidebar-logo"/>
            <button className="shrt-order-btn"><MdStar className="order-heart"/>Nuevo pedido</button>
            <div className="menu-title">TIENDA</div>
            <Link to={"/"}><div className="menu-item menu-item-active"><MdSpaceDashboard className="menu-icon"/>Dashboard</div></Link> 
            <Link to={"/"}><div className="menu-item"><MdShoppingBasket className="menu-icon"/>Pedidos<MdArrowForwardIos className="expand-item"/></div></Link>
            <Link to={"/products"}><div className="menu-item"><MdReceiptLong className="menu-icon"/>Productos</div></Link>
            <Link to={"/"}><div className="menu-item"><MdPeopleAlt className="menu-icon"/>Clientes</div></Link>
            <Link to={"/"}><div className="menu-item"><MdLocalOffer className="menu-icon"/>Cupones</div></Link>
            <div className="menu-logout"><MdLogout className="logout-icon"/>Cerrar sesión</div>
        </div>
	);
};
