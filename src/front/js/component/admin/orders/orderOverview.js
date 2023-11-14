import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";
import { useRef } from 'react';
import moment from "moment";

import { toast } from 'react-toastify';

import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import "../../../../styles/selectProducts.css";
import "../../../../styles/productOverview.css";
import "../../../../styles/orderOverview.css";


export const OrderOverview = (order) => {
	const { store, actions } = useContext(Context);
  const background = useRef(null);
  const [ confirmDelete, setConfirmDelete] = useState(false)
  const [ loading, setLoading ] = useState();

  async function handleDelete (){
    if (order.ord.prod.sold){
			toast.warning("No es posible eliminar un producto con ordenes existentes",{
				position: "bottom-center"
			})
            background.current.click()
			return
		}

    let info = await actions.deleteProduct(order.ord.prod.id)
    if(info){
			toast.success("Producto eliminado!",{
				position: "bottom-center"
			})
            background.current.click()
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
  }

  useEffect(() => {
    if(store.products.length == 0)setLoading(true)

  }, []);



	return (<>
      <div ref={background} className="background" onClick={order.close}/> 
      <div className="popup-body">
        <div className="order-overview-container">
            <div className="popup-header" style={{margin: 0}}>
              <AiOutlineCloseCircle className="popup-close" onClick={order.close} style={{margin: 0, marginRight: "auto"}} />
              <div className="order-overview-top-icons">
                <BiSolidTrashAlt className="order-overview-delete" onClick={()=> setConfirmDelete(true)}/>
              </div>
            </div>

            <div style={{display:"flex", justifyContent: "space-between", marginTop:"25px"}}>
              <div className="order-overview-id">
                <label>ORDEN N°:</label> {order.ord.id}
              </div>
              <div className="order-overview-status">{order.ord.status}</div>
            </div>

            <div className="order-overview-name">{order.ord.customer.name}</div>
            <div className="order-overview-phone">{order.ord.customer.phone || "-"}</div>
            <div className="order-overview-date">{moment(order.ord.date, "YYYYMMDDhh:mm").format('LL')}</div>
            <div className="order-overview-status">{order.ord.payment.name}</div>
            <div className="order-overview-notes">
              <label>NOTAS</label>
              <div>{order.ord.notes || "No hay notas..."}</div>
            </div>

            <div className="order-overview-products-header">
              <h3>ORDEN:</h3> <div>TOTAL: <span>${order.ord.total_price}</span></div>
            </div>

            <div className="order-overview-products-container">
              {order.ord.items.length > 0 && order.ord.items.map((itm)=> (
                <div key={itm.id} className="order-overview-products">
                <div>{itm.quantity}</div>
                <img src={itm.product.image}/>
                <p>{itm.product.sku}</p>
                </div>
                ))}
            </div>


        </div>

          {confirmDelete && <>
            <div className="product-overview-delete-popup">
              <div>
                <p>¿Estás seguro?</p>
                <span>Una vez eliminada, no podrás recuperarla</span>
              </div>
              <div className="product-overview-delete-popup-buttons">
                <button className="accept-delete" onClick={()=> handleDelete()}>Eliminar</button>
                <button className="cancel-delete" onClick={()=>setConfirmDelete(false)}>Cancel</button>
              </div>
            </div>
            <div className="product-overview-delete-popup-background" onClick={()=>setConfirmDelete(false)}/>
          </>}
      </div>
    </>
	);
};
