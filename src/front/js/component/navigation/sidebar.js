import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { MdSpaceDashboard, MdShoppingBasket, MdReceiptLong, MdPeopleAlt, MdStar, MdLogout } from "react-icons/md"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../../../styles/navigation.css";

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    //REDIRECT TO LOGIN IF NOT LOGGED AS ADMIN
	useEffect(() => {
		if(!localStorage.getItem("token") || store.user.id && !store.user.admin) navigate("/")
	}, [store.user])

    useEffect(() => {
		actions.checkToken()
        if(!localStorage.getItem("token") || store.user.id && !store.user.admin) navigate("/")
	}, [store.active])

	return <>
		<div id="sidebar">
            <img src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/image_2023-11-23_025002027.png?alt=media&token=6a38e66f-47ef-4ce4-b1b7-d161d98bb43c" className="sidebar-logo"/>
            <button className="shrt-order-btn" onClick={()=> navigate("/dashboard/create-order")}>
                <MdStar className="order-heart"/>Nuevo pedido
            </button>
            <div className="menu-title">TIENDA</div>
            <Link to={"/dashboard"}>
                <div className={store.active == "admin"? "menu-item menu-item-active": "menu-item"}>
                    <MdSpaceDashboard className="menu-icon"/>Dashboard
                </div>
            </Link> 
            <Link to={"/dashboard/orders"}>
                <div className={store.active == "admin/orders"? "menu-item menu-item-active": "menu-item"}>
                    <MdShoppingBasket className="menu-icon"/>Pedidos
                </div>
            </Link>
            <Link to={"/dashboard/products"}>
                <div className={store.active == "admin/products"? "menu-item menu-item-active": "menu-item"}>
                    <MdReceiptLong className="menu-icon"/>Productos
                </div>
            </Link>
            <Link to={"/dashboard/customers"}>
                <div className={store.active == "admin/customers"? "menu-item menu-item-active": "menu-item"}>
                    <MdPeopleAlt className="menu-icon"/>Clientes
                </div>
            </Link>
            <div className="menu-logout" onClick={()=> actions.logout()}><MdLogout className="logout-icon"/>Cerrar sesión</div>
        </div>
    </>
};
