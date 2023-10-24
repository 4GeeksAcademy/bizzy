import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/orders.css";
import { toast } from "react-toastify";

export const Orders = () => {
  const [ loading, setLoading ] = useState();
  const [ checklist, setChecklist ] = useState([]);
	const { store, actions } = useContext(Context);

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
          <button onClick={()=>console.log("dont forget me")}>+ Crear producto</button>
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
          <th style={{width: "50px"}}>ID</th>
          <th>Pago</th>
          <th>Productos</th>
          <th>Valor</th>
          <th>Fecha</th>
          <th>Estado</th>
        </tr>
        </thead>
        <tbody>
          
        {store.orders.map((order)=>(
          <tr key={order.id}>
            <td>
            <input type="checkbox" onChange={()=>checkboxes(order.id)}/>
              </td>
            <td>1</td>
            <td>PayPal</td>
            <td>1 Rei Chikita</td>
            <td className="table-product">$20</td>
            <td>{Date()}</td>
            <td>Pagado</td>
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
      {loading && <div class="spinner"></div>}
    </div>
    </>
	);
};
