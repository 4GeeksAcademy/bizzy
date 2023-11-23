import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

import "../../../styles/navigation.css";

export const Footer = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	return (
		<footer className="shop-view-footer">
            <div className="shop-footer-left">
                <div >
                    <span>Powered by </span>
                    <img src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/image_2023-11-23_025002027.png?alt=media&token=6a38e66f-47ef-4ce4-b1b7-d161d98bb43c"/>
                </div>
            </div>
            <div className="shop-footer-center">
                <img style={{width: "150px"}}
                src="https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/shop%2Fimage.png?alt=media&token=3fa8c0af-c2a8-4f28-9a9d-59ee374921af" />
            </div>
            <div>

            </div>
	</footer>
	);
};
