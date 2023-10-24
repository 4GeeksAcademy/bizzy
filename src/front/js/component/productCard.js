import React from "react";
import { FaDollarSign } from "react-icons/fa";

import "../../styles/productCard.css";

export const ProductCard = (item) => {
	return (
		<div className="product-container">
            <img src={item.image}/>
            <span>
                <p className="item-price"><FaDollarSign/>{item.price}</p>
                <p className="item-name" >{item.name}</p>
                <p className="item-stock" >{item.stock} disponibles</p>
            </span>
        </div>
	);
};
