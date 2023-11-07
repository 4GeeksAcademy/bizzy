import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";
import { FaDollarSign } from "react-icons/fa";

import "../../../../styles/selectProductsCard.css";

export const SelectProductsCard = (item) => {
    const { store, actions } = useContext(Context);
    const [ selectedProduct, setSelectedProduct] = useState({
        ...item.product,
        "quantity":0
    })

async function handleProduct(boolean){
    if (boolean){
        if (selectedProduct.stock > selectedProduct.quantity) setSelectedProduct({...selectedProduct, "quantity": selectedProduct['quantity'] + 1 })
    }
    else{
        if (selectedProduct.quantity > 0) setSelectedProduct({...selectedProduct, "quantity": selectedProduct['quantity'] - 1 })
    }
}

useEffect(() => {
    const onStore = store.selectedProducts.filter((itm)=> itm.name == selectedProduct.name)
    if(onStore.length > 0) {
        setSelectedProduct(onStore[0])
        item.set([...item.plist, selectedProduct])
    }
}, []);

useEffect(() => {
    const newList = item.plist.filter((itm)=> itm.name != selectedProduct.name)
    if (selectedProduct.quantity == 0) item.set(newList)

    else item.set([...newList, selectedProduct])

}, [selectedProduct]);

	return (
		<div className="select-product-card-container">
            <img src={item.product.image}/>
            <span>
                <p className="select-item-price"><FaDollarSign/>{item.product.unit_price}</p>
                <p className="select-item-name" >{item.product.name}</p>
            </span>
            <div className="count-container">
                <div className="count-togglers">
                    <button onClick={()=>handleProduct(false)}>-</button>
                    <button onClick={()=>handleProduct(true)}>+</button>
                </div>
                <div className="select-product-count">{selectedProduct.quantity}</div>
            </div>
        </div>
	);
};
