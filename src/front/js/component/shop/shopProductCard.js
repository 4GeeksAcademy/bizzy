import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/shopProductCard.css";

export const ShopProductCard = (product) => {
	const navigate = useNavigate();

	return <div style={product.width}>
        <div className="shop-product-card" style={product.width}
		onClick={()=> navigate(`product/${product.prod.id}`)}>
			<img src={product.prod.image} />
		</div>
		<div className="shop-product-card-name">{product.prod.name}</div>
		<div className="shop-product-card-price"> $ {product.prod.unit_price}</div>
    </div>
};
