import React from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/navigation.css";

export const Footer = () => {
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
            <div className="shop-footer-right">
                <div className="footer-made-with">Realizado con:</div>
                <div className="footer-tecnologies">
                    <img src="https://www.chartjs.org/img/chartjs-logo.svg"/>
                    <img src="https://swiperjs.com/images/swiper-logo.svg"/>
                    <img src="https://static-00.iconduck.com/assets.00/moment-js-icon-512x512-lezm7xw5.png"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/640px-JavaScript-logo.png"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png"/>
                </div>
                <button onClick={()=> navigate("/made-with")}>Descubre más</button>
            </div>
	</footer>
	);
};
