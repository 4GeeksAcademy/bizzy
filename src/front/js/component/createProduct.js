import React, { useState, useContext } from "react";
import { toast } from 'react-toastify';
import { Context } from "../store/appContext";
import "../../styles/createProduct.css";


export const CreateProduct = (modal) => {
	const { store, actions } = useContext(Context);
    const [product, setProduct] = useState(
		{
			"name":"",
			"category":"",
			"unit_price":"",
			"unit_cost":"",
			"quantity":"",
			"sku":"",
			"image":"",
		}
	)

	async function createProduct(something){
		const repeated = store.products.filter((item) => item.name == product.name)
		console.log(repeated)
		if (repeated.length > 0){
			toast.error("Ya existe un producto con este nombre",{
				position: "bottom-center"
			})
		}

		for (let values in product){
			if (!product[values]){
				toast.error("Rellena todos los campos",{
					position: "bottom-center"
				})
				return
			}
		}
		let info = await actions.postProduct(something)
		if(info){
			toast.success("Producto creado con exito!")
			modal.click()
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
	}

	return (<>
		<div className="background" onClick={modal.click}></div>
        <div className="modalsito">
		<h2>Create new product</h2>

		<div className="input-holder">
			<input required onChange={(e)=> setProduct({...product, "name":e.target.value })}></input>
			<label>Product name</label>
		</div>
		<div className="double-input">
			<div className="input-holder">
				<input required onChange={(e)=> setProduct({...product, "image":e.target.value })}></input>
				<label>Image URL</label>
			</div>
            <div className="input-holder">
				<select required onChange={(e)=> setProduct({...product, "category":e.target.value })}>
					<option></option>
					<option>Peluche</option>
					<option>Yesquero</option>
				</select>
				<label className="select-label">Category</label>
			</div>
        </div>
		<div className="double-input">
            <div className="input-holder">
                <input required onChange={(e)=> setProduct({...product, "sku":e.target.value })}></input>
                <label>SKU</label>
            </div>
            <div className="input-holder">
                <input required onChange={(e)=> setProduct({...product, "quantity":e.target.value })}></input>
                <label>Cantidad</label>
            </div>
        </div>
		<div className="double-input">
            <div className="input-holder">
                <input required onChange={(e)=> setProduct({...product, "unit_cost":e.target.value })}></input>
                <label>Costo unidad</label>
            </div>
            <div className="input-holder">
                <input required onChange={(e)=> setProduct({...product, "unit_price":e.target.value })}></input>
                <label>Precio unidad</label>
            </div>
        </div>
			<button onClick={()=> createProduct(product)}>Crear</button>
        </div>
        </>
	);
};	
