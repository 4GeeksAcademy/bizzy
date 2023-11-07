import React, { useState, useContext} from "react";
import { Context } from "../../../store/appContext";
import { useRef } from 'react';

import { toast } from 'react-toastify';
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../../../styles/createCategory.css";

export const CreateSubCategory = (create) => {
    const { store, actions } = useContext(Context);
    const background = useRef(null);
    const [ subcategory, setSubcategory ] = useState(
        {
			"category":create.category,
            "name":""
        }
    )
    
    async function createNewSubCategory(){
		// SEARCH FOR UNFILLED FIELDS
        for (let value in subcategory){
			if (!subcategory[value]){
				toast.error("Rellena todos los campos",{
					position: "bottom-center"})
					return
				}
			}
			
			// SEARCH FOR EXISTENT SUBCATEGORY
			const filteredCategory = store.categories.filter((item) => item.name == create.category)[0]
			const repeated = filteredCategory.subcategories.filter((subitem) => subitem.name == subcategory.name)
			if (repeated.length > 0){
				toast.error("Ya existe una subcategoria con este nombre",{
					position: "bottom-center"})
				return
			}

		// POST SUBCATEGORY
		let info = await actions.postSubCategory(subcategory)
		if(info){
			toast.success("Sub-categoria creada con exito!")
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
                        <h2> Crear sub-categoria </h2>
                        <AiOutlineCloseCircle className="popup-close" onClick={create.close} />
                    </div>
					<p>Categoria: <b>{create.category}</b></p>
                    <div className="input-holder">
						<label>Nombre</label>
						<input required placeholder="Ingresa el nombre de la Sub-Categoria"
						onChange={(e)=> setSubcategory({...subcategory, "name":e.target.value })}></input>
					</div>
                    <div className="button-container">
                    <button onClick={()=> createNewSubCategory()}>Crear</button>
                    </div>
                </div>
            </div>
        </>
	);
};
