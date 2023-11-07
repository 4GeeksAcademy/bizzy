import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

import { CreateCustomer } from "../../component/admin/customers/createCustomer";
import { AiOutlineUserAdd } from "react-icons/ai"
import { BsArrowLeftShort } from "react-icons/bs"
import { BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { Spinner } from "../../component/admin/props/spinner";
import { toast } from "react-toastify";
import "../../../styles/createProduct.css";
import "../../../styles/customers.css";

export const Customers = (select) => {
    const { store, actions } = useContext(Context);

    const [ nameFilter, setNameFilter ] = useState();
    const [ loading, setLoading ] = useState();
    const [ customer, setCustomer ] = useState();
    const [ editable, setEditable] = useState (false);
    const [ confirmDelete, setConfirmDelete] = useState(false)
    const [ create, setCreate] = useState(false)


    let filteredByName = nameFilter? store.customers.filter((item)=> 
    item.name.toLowerCase().includes(nameFilter.toLowerCase()) 
    || item.phone && item.phone.toLowerCase().includes(nameFilter.toLowerCase())
    || item.email && item.email.toLowerCase().includes(nameFilter.toLowerCase())) 
    : store.customers

    async function loadCustomers(){
        const load = await actions.getCustomers()
        if (load){
            setLoading(false)
            setCustomer(store.customers[0])
        }
        else toast.error("Ocurrio un error al cargar los clientes", {autoClose: false})
    }

    useEffect(() => {
        actions.changeTab("customers")
        if(store.customers.length == 0)setLoading(true)
        loadCustomers()
    }, []);

    async function handleEdit(){
		// PUT PRODUCT
		let info = await actions.putCustomer(customer)
		if(info){
			toast.success("Cliente editado con exito!")
			setEditable(false)
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
    }

    async function handleDelete (){
        if (customer.info.orders){
                toast.warning("No es posible eliminar un cliente con ordenes",{
                    position: "bottom-center"
                })
                setConfirmDelete(false)
                return
            }
    
        let info = await actions.deleteCustomer(customer.id)
        if(info){
                toast.success("Cliente eliminado!",{
                    position: "bottom-center"
                })
                setConfirmDelete(false)
                return
            }
            else{
                toast.error("Ocurrio un error inesperado",{
                    position: "bottom-center"
                })
            }
    }


	return (<>
      <div style={{margin: "50px 6vw"}}>
        <div className="customers-header">
          <h2>Clientes</h2>
          <span className="create-customer" onClick={()=> setCreate(true)}>
            <AiOutlineUserAdd/>
          </span>
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
            <div className="divisor-line"/>
            <div className="customer-information">
                {!editable && customer && <div className="customer-info-icons">
                    <BiSolidTrashAlt className="customer-info-delete" onClick={()=>setConfirmDelete(true)}/>
                    <BiSolidPencil className="customer-info-edit" onClick={()=>setEditable(true)}/>
                </div>}
                {editable && <div className="customer-info-icons">
                    <BsArrowLeftShort style={{fontSize: "30px"}}
                    className="customer-info-return" onClick={()=>setEditable(false)}/>
                </div>}

                {!editable && customer && <>
                <div className="customer-info-id"><label>ID:</label>{customer.id}</div>
                <div className="customer-info-name">{customer.name}</div>
                <label>Email</label>
                <div style={{fontSize: "14px"}}>{customer.email || "N/A"}</div>
                <label>Telefono</label>
                <div style={{fontSize: "14px"}}>{customer.phone || "N/A"}</div>
                {customer.info.orders != 0 && <>
                <label>Ordenes</label>
                <div style={{fontSize: "14px"}}>{customer.info.orders}</div>
                <label>Productos comprados</label>
                <div style={{fontSize: "14px"}}>{customer.info.quantity}</div>
                <label>Total gastado</label>
                <div style={{fontSize: "14px"}}>${customer.info.spent}</div>
                </>}
                </>
                }

                {editable && <>
                <div className="form-container" style={{justifyContent: "normal"}}>
                    <div className="customer-info-id"><label>ID:</label>{customer.id}</div>
                    <div className="input-holder">
                        <label>Nombre</label>
                        <input defaultValue={customer.name} onChange={(e)=>setCustomer({...customer, "name":e.target.value})}/>
                    </div>
                    <div className="input-holder">
                        <label>Email</label>
                        <input defaultValue={customer.email} onChange={(e)=>setCustomer({...customer, "email":e.target.value})}/>
                    </div>
                    <div className="input-holder">
                        <label>Telefono</label>
                        <input defaultValue={customer.phone} onChange={(e)=>setCustomer({...customer, "phone":e.target.value})}/>
                    </div>

                    <button onClick={()=>handleEdit()}>Actualizar</button>
                </div>
                </>}
                
            </div>
        </div>
        
        {confirmDelete && <>
            <div className="customer-delete-popup">
              <div>
                <p>¿Estás seguro?</p>
                <span>Una vez eliminado, no podrás recuperarlo</span>
              </div>
              <div className="customer-delete-popup-buttons">
                <button className="accept-delete" onClick={()=>handleDelete()}>Eliminar</button>
                <button className="cancel-delete" onClick={()=>setConfirmDelete(false)}>Cancel</button>
              </div>
            </div>
            <div className="customer-delete-popup-background" onClick={()=>setConfirmDelete(false)} />
        </>}
        {create && <CreateCustomer close={()=>setCreate(false)}/>}
      </div>
    </>
	);
};
