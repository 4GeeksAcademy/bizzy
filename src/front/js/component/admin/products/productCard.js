import React, { useState } from "react";

import { FaDollarSign } from "react-icons/fa";
import { ProductOverview } from "./productOverview";
import "../../../../styles/productCard.css";

export const ProductCard = (item) => {
	const [ overview, setOverview] = useState(false)

	return (<>
        <div>
            {!item.prod.for_sale && item.prod.stock > 0 && <div className="not-for-sale-sign">No Disponible</div>}
            {item.prod.stock <= 0 && <div className="not-in-stock-sign">Agotado</div>}
            <div className={item.prod.for_sale? "product-container" : "product-container not-for-sale"} onClick={()=>setOverview(true)}>
                <img src={item.prod.image}/>
                <span>
                    <p className="item-price"><FaDollarSign/>{item.prod.unit_price}</p>
                    <p className="item-name" >{item.prod.name}</p>
                    <p className="item-stock" >{item.prod.stock} disponibles</p>
                </span>
            </div>
        </div>
        { overview && <ProductOverview close={()=>setOverview(false)} prod={item.prod} /> }
    </>
	);
};
