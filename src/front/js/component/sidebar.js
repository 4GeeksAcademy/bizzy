import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { MdSpaceDashboard, MdShoppingBasket, MdReceiptLong, MdPeopleAlt, MdLocalOffer, MdArrowForwardIos, MdStar, MdLogout } from "react-icons/md"
import { Link } from "react-router-dom";
import "../../styles/navigation.css";


export const Sidebar = () => {
    const { store, actions } = useContext(Context);

	return (
		<div id="sidebar">
            <img src="https://www.nic.do/wp-content/uploads/2016/10/logo-placeholder-3.jpg" className="sidebar-logo"/>
            <button className="shrt-order-btn"><MdStar className="order-heart"/>Nuevo pedido</button>
            <div className="menu-title">TIENDA</div>
            <Link to={"/"}>
                <div className={store.active == "dashboard"? "menu-item menu-item-active": "menu-item"}>
                    <MdSpaceDashboard className="menu-icon"/>Dashboard
                </div>
            </Link> 
            <Link to={"/orders"}>
                <div className={store.active == "orders"? "menu-item menu-item-active": "menu-item"}>
                    <MdShoppingBasket className="menu-icon"/>Pedidos<MdArrowForwardIos className="expand-item"/>
                </div>
            </Link>
            <Link to={"/products"}>
                <div className={store.active == "products"? "menu-item menu-item-active": "menu-item"}>
                    <MdReceiptLong className="menu-icon"/>Productos
                </div>
            </Link>
            <Link to={"/customers"}>
                <div className="menu-item">
                    <MdPeopleAlt className="menu-icon"/>Clientes
                </div>
            </Link>
            <Link to={"/"}>
                <div className="menu-item">
                    <MdLocalOffer className="menu-icon"/>Cupones
                </div>
            </Link>
            <div className="menu-logout"><MdLogout className="logout-icon"/>Cerrar sesión</div>
        </div>
	);
};
