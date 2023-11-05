import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import moment from "moment";
import "../../styles/orders.css";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";

import { NoItemFound } from "../component/props/noItemFound";
import { Spinner } from "../component/props/spinner";


export const Orders = () => {
	const { store, actions } = useContext(Context);
  const [ loading, setLoading ] = useState();
  const navigate = useNavigate();
  const [ checklist, setChecklist ] = useState([]);

  const calendarOptions = {
      sameDay: '[Hoy], h:mm A',
      nextDay: '[Mañana]',
      nextWeek: 'DD-MMM',
      lastDay: '[Ayer], h:mm A',
      lastWeek: 'DD-MMM',
      sameElse: 'DD-MMM'
  }
  

  async function loadProducts(){
    const load = await actions.getProducts()
    if (load) setLoading(false)
    else toast.error("Ocurrio un error al cargar los productos", {autoClose: false})
  }

  useEffect(() => {
    if(store.products.length == 0)setLoading(true)

    loadProducts()
    actions.changeTab("orders")
    actions.getOrders()
  }, []);

  async function eliminateProduct(list){
    for (let id of list){
      let deleted = await actions.deleteProduct(id)
      if (deleted == false){
        toast.error("Ocurrio un error inesperado")
        return 
      }
    }
    setChecklist([])
  }
  
  function checkboxes(id){
    if( checklist.includes(id) ){
      let new_list = checklist.filter((list_id) => list_id != id)
      setChecklist(new_list)
    }
    else{
      setChecklist([...checklist, id])
    }
  }

	return (<>
      <div style={{margin: "50px 6vw"}}>
        <div className="table-header">
          <h2>Pedidos</h2>
          <button onClick={()=>navigate("/create-order")}>+ Crear orden</button>
        </div>
        <button 
        className="delete-button" 
        style={{visibility:checklist.length == 0 && "hidden"}}
        onClick={()=>eliminateProduct(checklist)}>
          Eliminar
        </button>
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" style={{visibility: "hidden"}}/>
              </th>
              <th>Orden</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
            </tr>
          </thead>

        <tbody> 
          {store.orders.map((order)=>(
          <tr key={order.id}>
            <td style={{paddingLeft: "15px"}}>
            <input type="checkbox" onChange={()=>checkboxes(order.id)}/>
              </td>
            <td className="table-order-id">#{order.id.toString().padStart(4, "0")}</td>
            <td className="table-order-date">{moment(order.date, "YYYYMMDDhh:mm").calendar(calendarOptions).replace(".","")}</td>
            <td className="table-order-customer">{order.customer.name}</td>
            <td className="table-order-quantity">{order.total_quantity} productos</td>
            <td className="table-product">${order.total_price}</td>
            <td className="table-order-status">
              <div className={order.status=="Completada"? "table-status-green" : order.status=="Pendiente"? "table-status-gray" : "table-status-red"}>
                <GoDotFill className="status-dot"/>{order.status}
              </div>
            </td>
            <td style={{paddingRight: "5px"}}>
              <div className="table-order-payment">
                {order.payment.icon && <img src={order.payment.icon}/>}
                {!order.payment.icon && <span>{order.payment.name}</span>}
              </div>
            </td>
            </tr>)
            )}
        </tbody>
      </table>
      {!loading && store.orders.length == 0 && <NoItemFound message={"No se encontraron pedidos"}/> }
			{loading && <Spinner/>}
    </div>
    </>
	);
};
