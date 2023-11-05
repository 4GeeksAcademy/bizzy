import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { NoItemFound } from "../component/props/noItemFound";
import { Spinner } from "../component/props/spinner";

import "../../styles/customers.css";
import { toast } from "react-toastify";

export const Customers = (select) => {
    const { store, actions } = useContext(Context);

    const [ nameFilter, setNameFilter ] = useState();
    const [ loading, setLoading ] = useState();
    const [ customer, setCustomer ] = useState();
    const [ editable, setEditable] = useState (false);

    let filteredByName = nameFilter? store.customers.filter((item)=> 
    item.name.toLowerCase().includes(nameFilter.toLowerCase()) 
    || item.phone && item.phone.toLowerCase().includes(nameFilter.toLowerCase())
    || item.email && item.email.toLowerCase().includes(nameFilter.toLowerCase())) 
    : store.customers

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
      <div style={{margin: "50px 6vw"}}>
        <div className="customers-header">
          <h2>Clientes</h2>
        </div>

        <div style={{display:"flex"}}>
            <div className="customers-list-container">
                <div className="customers-filters">
                <div className="filter-box">
                    <input placeholder="Buscar..." onChange={(e)=>setNameFilter(e.target.value)}/>
                </div>
                </div>
                <div>
                {filteredByName.map((customer)=><div className="customer-holder" key={customer.id}
                onClick={()=>setCustomer(store.customers.filter((itm)=> itm.id == customer.id)[0])}>
                    <div className="customer-initial">{customer.name[0].toUpperCase()}</div>
                    <div>
                        <div>{customer.name}</div>
                        <div className="customer-phone">{customer.phone || "-"}</div>
                    </div>
                    </div>)}
                    {!loading && filteredByName.length == 0 && <NoItemFound message={"No se encontraron clientes"}/> }
			        {loading && <Spinner/>}
                </div>
            </div>

            <div style={{display:"flex", flexDirection: "column"}}>
                {customer && <div style={{width:"10px", height:"10px", background: "red"}} onClick={()=>setEditable(true)}></div>}
             <div className="customer-initial">{customer? customer.name[0].toUpperCase(): "?"}</div>
                <label>Nombre</label>
                {!editable && <div>{customer? customer.name: "nombre"}</div>}
                { editable && <input placeholder={customer.name} onChange={(e)=>setCustomer({...customer, "name":e.target.value})}/> }
                <label>Email</label>
                {!editable && <div>{customer? customer.email: "email"}</div>}
                { editable && <input placeholder={customer.email} onChange={(e)=>setCustomer({...customer, "email":e.target.value})}/> }
                <label>Telefono</label>
                {!editable && <div>{customer? customer.phone: "telefono"}</div>}
                { editable && <input placeholder={customer.phone} onChange={(e)=>setCustomer({...customer, "phone":e.target.value})}/> }
                <label>ID</label>
                {!editable && <div>{customer? customer.id: "id"}</div>}
                { editable && <input placeholder={customer.id} disabled/> }

                { editable && <button onClick={()=>actions.editCustomer(customer)}>Save new info</button> }
                
            </div>
        </div>

      </div>
    </>
	);
};
