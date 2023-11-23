import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useRef } from 'react';
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { useNavigate } from "react-router-dom";

import "../../../styles/cart.css";


export const Cart = (cart) => {
	const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const background = useRef(null);
  const [ total, setTotal] = useState(0)


  useEffect(() => {
    let tempTotal = 0
		if (store.cart.length > 0){
			for (let item of store.cart ){
        tempTotal += item.quantity * item.product.unit_price
      }
      setTotal(tempTotal)
		}
    else{
      setTotal(0)
    }
	}, [store.random]);

  async function handleProduct(boolean, product){
    let newCart = store.cart
    if (boolean){
      if(product.quantity < 5){       
        newCart[newCart.indexOf(product)] = {...product, "quantity": product.quantity+1}
        await actions.addToCart(newCart)
      }
    }
    else{
      if(product.quantity > 1){
        newCart[newCart.indexOf(product)] = {...product, "quantity": product.quantity-1}
        await actions.addToCart(newCart)
      }
    }
  }

  async function handleDelete(product){
    let newCart = store.cart.filter((p) => p != product )
      actions.addToCart(newCart)
  }

   function handleCheckout(){
    navigate("/checkout")
    cart.useCart(false)
  }

	return (<>
      <div ref={background} className="background" onClick={()=>cart.useCart(false)}/> 
      <div className="popup-body">
        <div className="cart-body">
          <div className="cart-body-header">
          <h3>Carrito</h3>

          <IoClose onClick={()=>cart.useCart(false)}/>
          </div>
          <div className="cart-body-content">
            {store.cart.length == 0 && <NoItemFound message={"No hay nada en el carrito"}/> }
            {store.cart.length > 0 && store.cart.map((prod)=><div className="cart-product-container" key={prod.product.id}>
              <img src={prod.product.image} />
              <div className="cart-product-info">
                <div className="name">{prod.product.name}</div>
                <div className="cart-category">{prod.product.category}</div>

                <div className="cart-product-count-container">
                  <div className="cart-count-togglers">
                      <button onClick={()=>handleProduct(false, prod)}>-</button>
                      <button onClick={()=>handleProduct(true, prod)}>+</button>
                  </div>
                  <div className="cart-product-count">{prod.quantity}</div>
                  <span onClick={()=> handleDelete(prod)}><FaTrash/></span>
                </div>
              </div>
              <div className="price">
                ${parseFloat(prod.product.unit_price).toFixed(2)}
              </div>
            </div>)}
          </div>
          <div className="cart-body-footer">
            <div className="cart-divisor"/>
            <div className="cart-footer-text">
              <div>Subtotal</div>
              <div><b>${parseFloat(total).toFixed(2)}</b></div>
            </div>
            <button onClick={()=> handleCheckout()}>Finalizar Compra</button>
          </div>
        </div>
      </div>
    </>
	);
};
