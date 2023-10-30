import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/orders.css";
import { toast } from "react-toastify";

export const Orders = () => {
	const { store, actions } = useContext(Context);
  const [ loading, setLoading ] = useState();
  const navigate = useNavigate();
  const [ checklist, setChecklist ] = useState([]);

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
              <th>productos</th>
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
            <td>#{order.id}</td>
            <td>{order.date}</td>
            <td>{order.customer.name}</td>
            <td>{order.items.length} productos</td>
            <td className="table-product">${ Math.floor(Math.random()*1000) }</td>
            <td>Pagado</td>
            <td style={{paddingRight: "15px"}}>{order.payment.name}</td>
            </tr>)
            )}
            {!loading && store.products.length == 0 && <tr>
            <td colSpan={11} style={{textAlign:"center"}}>
              No hay productos en el inventario
            </td>
          </tr>
          }
        </tbody>
      </table>
      {loading && <div className="spinner"></div>}
    </div>
    </>
	);
};
