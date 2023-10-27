import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { FaDollarSign } from "react-icons/fa";

import "../../styles/selectProductsCard.css";

export const SelectProductsCard = (item) => {
    const { store, actions } = useContext(Context);
    const [ selectedProducts, setSelectedProducts] = useState({
        "product":item.name,
        "quantity":0
    })

async function handleProduct(boolean){
    if (boolean){
        setSelectedProducts({...selectedProducts, "quantity": selectedProducts['quantity'] + 1 })
    }
    else{
        if (selectedProducts.quantity > 0) setSelectedProducts({...selectedProducts, "quantity": selectedProducts['quantity'] - 1 })
    }
}

useEffect(() => {
    const onStore = store.selectedProducts.filter((itm)=> itm.product == selectedProducts.product)
    if(onStore.length > 0) {
        setSelectedProducts(onStore[0])
        item.set([...item.plist, selectedProducts])
    }
}, []);

useEffect(() => {
    const newList = item.plist.filter((itm)=> itm.product != selectedProducts.product)
    if (selectedProducts.quantity == 0) item.set(newList)

    else item.set([...newList, selectedProducts])

}, [selectedProducts]);

	return (
		<div className="select-product-card-container">
            <img src={item.image}/>
            <span>
                <p className="select-item-price"><FaDollarSign/>{item.price}</p>
                <p className="select-item-name" >{item.name}</p>
            </span>
            <div className="count-container">
                <div className="count-togglers">
                    <button onClick={()=>handleProduct(false)}>-</button>
                    <button onClick={()=>handleProduct(true)}>+</button>
                </div>
                <div className="select-product-count">{selectedProducts.quantity}</div>
            </div>
        </div>
	);
};
