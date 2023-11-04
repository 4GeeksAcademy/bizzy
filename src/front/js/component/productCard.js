import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";

import "../../styles/productCard.css";
import { ProductOverview } from "./productOverview";

export const ProductCard = (item) => {
	const [ overview, setOverview] = useState(false)


	return (<>
		<div className="product-container" onClick={()=>setOverview(true)}>
            <img src={item.prod.image}/>
            <span>
                <p className="item-price"><FaDollarSign/>{item.prod.unit_price}</p>
                <p className="item-name" >{item.prod.name}</p>
                <p className="item-stock" >{item.prod.stock} disponibles</p>
            </span>
        </div>
        { overview && <ProductOverview close={()=>setOverview(false)} prod={item.prod} /> }
    </>
	);
};
