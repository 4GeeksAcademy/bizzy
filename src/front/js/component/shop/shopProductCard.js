import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaDollarSign } from "react-icons/fa";
import "../../../styles/shopProductCard.css";

export const ShopProductCard = (product) => {
	const navigate = useNavigate();

	return <div style={product.width}>
        <div className="shop-product-card" style={product.width}
		onClick={()=> navigate(`product/${product.prod.id}`)}>
			<img src={product.prod.image} />
		</div>
		<div>{product.prod.name}</div>
		<div> <FaDollarSign/> {product.prod.unit_price}</div>
    </div>
};
