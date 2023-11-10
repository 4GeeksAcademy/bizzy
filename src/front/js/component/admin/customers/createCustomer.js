import React, { useState, useContext} from "react";
import { Context } from "../../../store/appContext";
import { useRef } from 'react';

import { toast } from 'react-toastify';
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../../../styles/createCategory.css";

export const CreateCustomer = (create) => {
    const { store, actions } = useContext(Context);
    const background = useRef(null);
    const [ customer, setCustomer ] = useState(
        {
            "name":""
        }
    )
    
    async function createNewCustomer(){
        // NAME?
        if (!customer["name"]) toast.error("Porfavor ingrese un nombre",{position: "bottom-center"})

		// POST CUSTOMER
		let info = await actions.postCustomer(customer)
		if(info){
			toast.success("Cliente creado con exito!")
            background.current.click()
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
	}

	return (<>
		<div ref={background} onClick={create.close} className="background"/>
            <div className="popup-body">
                <div className="create-container">
                    <div className="popup-header">
                        <h2> Nuevo cliente </h2>
                        <AiOutlineCloseCircle className="popup-close" onClick={create.close} />
                    </div>
                    
                    <div className="input-holder">
						<label>Nombre<span style={{color: "#7B57DF"}}>*</span></label>
						<input required placeholder="Nombre" maxLength="40"
						onChange={(e)=> setCustomer({...customer, "name":e.target.value })}></input>
					</div>
					<div className="input-holder">
						<label>Email</label>
						<input required placeholder="Correo electronico" maxLength="80"
						onChange={(e)=> setCustomer({...customer, "email":e.target.value })}></input>
					</div>
					<div className="input-holder">
						<label>Telefono</label>
						<input required placeholder="Número de telefono" maxLength="40"
						onChange={(e)=> setCustomer({...customer, "phone":e.target.value })}></input>
					</div>
                    <div className="button-container">
                    	<button onClick={()=> createNewCustomer()}>Crear</button>
                    </div>
                </div>
            </div>
        </>
	);
};
