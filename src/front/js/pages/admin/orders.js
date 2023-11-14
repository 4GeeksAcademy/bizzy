import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";

import { toast } from "react-toastify";
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { Spinner } from "../../component/admin/props/spinner";
import { OrderTableRow } from "../../component/admin/orders/orderTableRow";
import { OrderOverview } from "../../component/admin/orders/orderOverview";
import "../../../styles/orders.css";


export const Orders = () => {
	const { store, actions } = useContext(Context);
  const [ overviewed, setOverviewed ] = useState()
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
    actions.changeTab("admin/orders")
    actions.changeAdminNav(true)
    actions.getOrders()
  }, []);


	return (<>
      <div style={{margin: "50px 6vw"}}>
        <div className="table-header">
          <h2>Pedidos</h2>
          <button onClick={()=>navigate("/admin/create-order")}>+ Crear orden</button>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{paddingLeft: "25px"}} >Orden</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
            </tr>
          </thead>
        <tbody> 
          {store.orders.map((order)=>(<OrderTableRow key={order.id} ord={order} infoSetter={setOverviewed}/>))}
        </tbody>
      </table>

      {!loading && store.orders.length == 0 && <NoItemFound message={"No se encontraron pedidos"}/> }
			{loading && <Spinner/>}
      
      {overviewed && <OrderOverview ord={overviewed} close={()=>setOverviewed()}/>}
    </div>
    </>
	);
};
