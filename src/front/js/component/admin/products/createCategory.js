import React, { useState, useContext} from "react";
import { Context } from "../../../store/appContext";
import { useRef } from 'react';

import { toast } from 'react-toastify';
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../../../styles/createCategory.css";

export const CreateCategory = (create) => {
    const { store, actions } = useContext(Context);
    const background = useRef(null);
    const [ category, setCategory ] = useState(
        {
            "name":""
        }
    )
    
    async function createNewCategory(){
		// SEARCH FOR EXISTENT CATEGORY
		const repeated = store.categories.filter((item) => item.name == category.name)
		if (repeated.length > 0){
			toast.error("Ya existe una categoria con este nombre",{
				position: "bottom-center"})
			return
		}

        // SEARCH FOR UNFILLED FIELDS
        for (let value in category){
			if (!category[value]){
				toast.error("Rellena todos los campos",{
					position: "bottom-center"})
				return
			}
		}

		// POST CATEGORY
		let info = await actions.postCategory(category)
		if(info){
			toast.success("Categoria creada con exito!")
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
                        <h2> Crear categoria </h2>
                        <AiOutlineCloseCircle className="popup-close" onClick={create.close} />
                    </div>
                    
                    <div className="input-holder">
						<label>Nombre</label>
						<input required placeholder="Ingresa el nombre de la categoria"
						onChange={(e)=> setCategory({...category, "name":e.target.value })}></input>
					</div>
                    <div className="button-container">
                    <button onClick={()=> createNewCategory()}>Crear</button>
                    </div>
                </div>
            </div>
        </>
	);
};
