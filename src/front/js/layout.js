import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import moment from "moment";

import { BackendURL } from "./component/backendURL";

import "../styles/layout.css";
import { Demo } from "./pages/admin/demo";
import injectContext from "./store/appContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from "./component/navigation/navbar";
import { Sidebar } from "./component/navigation/sidebar";
import { Dashboard } from "./pages/admin/dashboard";
import { Products } from "./pages/admin/products";
import { Orders } from "./pages/admin/orders";
import { CreateProduct } from "./pages/admin/createProduct";
import { CreateOrder } from "./pages/admin/createOrder";
import { Customers } from "./pages/admin/customers";
import { Misc } from "./pages/admin/misc";

import { Login } from "./pages/shop/login";
import { Home } from "./pages/shop/home";
import { ProductDetails } from "./pages/shop/productDetails";
import { Category } from "./pages/shop/category";

import { AdminNavbar } from "./component/navigation/adminNavbar";

//create your first component
const Layout = () => {
    const { store, actions } = useContext(Context);
    // MOMENT.JS TIME FORMAT
    moment.locale("es-us")
    
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
    <>
        <BrowserRouter basename={basename}>
            <div style={{display: "flex", height: "100vh"}}>
                {store.adminNav && <Sidebar/> }
                <div style={{width: "100%"}}>
                    {store.adminNav? <AdminNavbar/> : <Navbar/>}
                    
                    <div id="content">
                        <Routes>
                            {/* ADMIN VIEWS */}
                            <Route element={<Dashboard />} path="/admin/*"/>
                            <Route element={<Orders />} path="/admin/orders" />
                            <Route element={<CreateOrder />} path="/admin/create-order" />
                            <Route element={<Products />} path="/admin/products" />
                            <Route element={<CreateProduct />} path="/admin/create-product" />
                            <Route element={<Customers/>} path="/admin/customers" />
                            <Route element={<Misc/>} path="/admin/misc" />
                            <Route element={<Demo />} path="/admin/demo" />

                            {/* NORMAL VIEWS */}
                            <Route element={<Login/>} path="/login" />
                            <Route element={<Home/>} path="/*" />
                            <Route element={<ProductDetails/>} path="/product/:id" />
                            <Route element={<Category/>} path="/category/:name" />
                        </Routes>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={2000} />
        </BrowserRouter>
    </>
    );
};

export default injectContext(Layout);
