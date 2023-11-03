import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useRef } from 'react';

import "../../styles/selectProducts.css";
import { toast } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiEmotionSadLine } from "react-icons/ri";

export const SelectCustomer = (select) => {
	const { store, actions } = useContext(Context);
  const background = useRef(null);

  const [ nameFilter, setNameFilter ] = useState();
  const [ loading, setLoading ] = useState();

  let filteredByName = nameFilter? store.customers.filter((item)=> 
  item.name.toLowerCase().includes(nameFilter.toLowerCase()) 
  || item.phone && item.phone.toLowerCase().includes(nameFilter.toLowerCase())
  || item.email && item.email.toLowerCase().includes(nameFilter.toLowerCase())) 
  : store.customers


  function handleSelectCustomer(c){
    select.set({...select.ord, "name": c.name || "", "phone": c.phone || "", "email": c.email || "" })
    select.isSelect("disabled")
    background.current.click()
  }

  async function loadCustomers(){
    const load = await actions.getCustomers()
    if (load) setLoading(false)
    else toast.error("Ocurrio un error al cargar los clientes", {autoClose: false})
  }

  useEffect(() => {
    if(store.customers.length == 0)setLoading(true)

    loadCustomers()
  }, []);



	return (<>
    <div ref={background} className="background" onClick={select.close}/> 
    <div className="popup-body">
      <div className="select-products-container">
        <div className="popup-header">
          <h2>Clientes</h2>
          <AiOutlineCloseCircle className="popup-close" onClick={select.close} />
        </div>

        <div className="filters-select-products">
          <div className="filter-box">
            <input placeholder="Buscar..." onChange={(e)=>setNameFilter(e.target.value)}/>
          </div>
        </div>
        <div>
          {filteredByName.map((customer)=><div className="customer-holder" key={customer.id}
          onClick={()=>handleSelectCustomer(customer)}>
              <div className="customer-initial">{customer.name[0].toUpperCase()}</div>
              <div>
                <div>{customer.name}</div>
                <div className="customer-phone">{customer.phone || "-"}</div>
              </div>
            </div>)}
            {!loading && filteredByName.length == 0 && <div className="no-items" >
            <RiEmotionSadLine className="no-items-icon"/>
            <p>No se encontraron clientes</p>
            </div>}
            {loading && <div className="spinner"></div>}
        </div>
      </div>
    </div>
    </>
	);
};
