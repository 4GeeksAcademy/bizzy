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

            <label className="order-overview-date">FECHA:&nbsp;{moment(order.ord.date, "YYYYMMDDhh:mm").format('ll').toUpperCase()}</label>
            <div style={{display:"flex", justifyContent: "space-between", margin:"10px 0", alignItems: "flex-end"}}>
              <div className="order-overview-id">
                <label style={{margin: 0}}>ORDEN N°:</label> {order.ord.id}
              </div>
              <div className={order.ord.status=="Completada"? "overview-status-green" : order.ord.status=="Pendiente"? "overview-status-gray" : "overview-status-red"}>{order.ord.status}</div>
            </div>

            <div className="order-overview-name">{order.ord.customer.name}</div>
            <div className="order-overview-phone">TLF:&nbsp;{order.ord.customer.phone || "-"}</div>

            <div>
              <label>MÉTODO DE PAGO:</label>
              <div className="order-overview-payment">
                {order.ord.payment.icon && <img src={order.ord.payment.icon}/>}
                {!order.ord.payment.icon && <span>{order.ord.payment.name}</span>}
              </div>
            </div>

            <label>ORDEN:</label>

            <div className="order-overview-products-container">
              {order.ord.items.length > 0 && order.ord.items.map((itm)=> (
                <div key={itm.id} className="order-overview-products">
                <div className="order-overview-product-quantity">{itm.quantity}</div>
                <img src={itm.product.image}/>
                <div className="order-overview-product-info">
                  <p className="order-overview-product-name">{itm.product.name}</p>
                  <p>SKU: {itm.product.sku}</p>
                  <div>
                    {itm.quantity} x&nbsp;<span style={{fontWeight: "700"}}>{itm.product.unit_price}</span>&nbsp;= ${itm.quantity*itm.product.unit_price}
                  </div>
                </div>
                </div>
                ))}
            </div>
            <div className="order-overview-total">TOTAL:&nbsp;<span>${order.ord.total_price}</span></div>


            <div className="order-overview-notes">
              <label>NOTAS:</label>
              <div>{order.ord.notes || "No hay notas..."}</div>
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
