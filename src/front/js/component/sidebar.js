import React from "react";
import { MdSpaceDashboard, MdShoppingBasket, MdReceiptLong, MdPeopleAlt, MdLocalOffer, MdArrowForwardIos, MdStar, MdLogout } from "react-icons/md"
import { Link } from "react-router-dom";
import "../../styles/sidebar.css";


export const Sidebar = () => {
	return (
		<div id="sidebar">
            <img src="https://www.nic.do/wp-content/uploads/2016/10/logo-placeholder-3.jpg" className="sidebar-logo"/>
            <button className="shrt-order-btn"><MdStar className="order-heart"/>Nuevo pedido</button>
            <span className="menu-item"><MdSpaceDashboard className="menu-icon"/>   Dashboard </span>
            <span className="menu-item"><MdShoppingBasket className="menu-icon"/>   Pedidos <MdArrowForwardIos className="expand-item"/> </span>
            <span className="menu-item"><MdReceiptLong className="menu-icon"/>   Productos </span>
            <span className="menu-item"><MdPeopleAlt className="menu-icon"/>   Clientes </span>
            <span className="menu-item"><MdLocalOffer className="menu-icon"/>   Cupones </span>
            <span className="menu-logout"><MdLogout className="logout-icon"/>   Cerrar sesión </span>
        </div>
	);
};
