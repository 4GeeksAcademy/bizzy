import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import moment from "moment";

import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import "../styles/layout.css";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from "./component/navbar";
import { Sidebar } from "./component/sidebar";
import { Dashboard } from "./pages/dashboard";
import { Products } from "./pages/products";
import { Orders } from "./pages/orders";
import { CreateProduct } from "./pages/createProduct";
import { CreateOrder } from "./pages/createOrder";
import { Customers } from "./pages/customers";

//create your first component
const Layout = () => {
    // MOMENT.JS TIME FORMAT
    moment.locale("es-us")
    
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <div style={{display: "flex", height: "100vh"}}>
                            <Sidebar/>
                        <div style={{width: "100%"}}>
                            <Navbar />
                            <div id="content">
                                <Routes>
                                    <Route element={<Dashboard />} path="/" />
                                    <Route element={<Orders />} path="/orders" />
                                    <Route element={<CreateOrder />} path="/create-order" />
                                    <Route element={<Products />} path="/products" />
                                    <Route element={<CreateProduct />} path="/create-product" />
                                    <Route element={<Customers/>} path="/customers" />
                                    <Route element={<Demo />} path="/demo" />
                                    <Route element={<Single />} path="/single/:theid" />
                                    <Route element={<h1>Not found!</h1>} />
                                </Routes>
                            </div>

                        </div>
                    </div>
                    <ToastContainer autoClose={2000} />
                </ScrollToTop>
            </BrowserRouter>
    );
};

export default injectContext(Layout);
