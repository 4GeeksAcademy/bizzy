import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import { MdSpaceDashboard, MdShoppingBasket, MdReceiptLong, MdPeopleAlt, MdMiscellaneousServices, MdArrowForwardIos, MdStar, MdLogout } from "react-icons/md"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../../../styles/navigation.css";

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();


	return <>
		<div id="sidebar">
            <img src="https://www.nic.do/wp-content/uploads/2016/10/logo-placeholder-3.jpg" className="sidebar-logo"/>
            <button className="shrt-order-btn" onClick={()=> navigate("/admin/create-order")}>
                <MdStar className="order-heart"/>Nuevo pedido
            </button>
            <div className="menu-title">TIENDA</div>
            <Link to={"/admin"}>
                <div className={store.active == "admin"? "menu-item menu-item-active": "menu-item"}>
                    <MdSpaceDashboard className="menu-icon"/>Dashboard
                </div>
            </Link> 
            <Link to={"/admin/orders"}>
                <div className={store.active == "admin/orders"? "menu-item menu-item-active": "menu-item"}>
                    <MdShoppingBasket className="menu-icon"/>Pedidos<MdArrowForwardIos className="expand-item"/>
                </div>
            </Link>
            <Link to={"/admin/products"}>
                <div className={store.active == "admin/products"? "menu-item menu-item-active": "menu-item"}>
                    <MdReceiptLong className="menu-icon"/>Productos
                </div>
            </Link>
            <Link to={"/admin/customers"}>
                <div className={store.active == "admin/customers"? "menu-item menu-item-active": "menu-item"}>
                    <MdPeopleAlt className="menu-icon"/>Clientes
                </div>
            </Link>
            <Link to={"/admin/misc"}>
                <div className={store.active == "admin/misc"? "menu-item menu-item-active": "menu-item"}>
                    <MdMiscellaneousServices className="menu-icon"/>Misc.
                </div>
            </Link>
            <div className="menu-logout"><MdLogout className="logout-icon"/>Cerrar sesión</div>
        </div>
    </>
};
