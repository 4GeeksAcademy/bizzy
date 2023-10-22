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
			"sub_category":"",
			"unit_price":"",
			"quantity":"",
			"sku":"",
			"image":"",
			"description":""
		}
	)

	async function createProduct(something){
		const repeated = store.products.filter((item) => item.name == product.name)
		console.log(repeated)
		if (repeated.length > 0){
			toast.error("Ya existe un producto con este nombre",{
				position: "bottom-center"
			})
			return
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
		<div style={{margin: "50px 6vw", width:"65%"}}>
			<h2>Añadir producto</h2>
			<div className="imagensita">Imagen</div>
			<p>Imagen subida</p>
			<div className="imagen-subida"></div>
			<div className="form-container">

			<div className="two-columns">
				<div className="column-input">
					<div className="input-holder">
						<label>Nombre</label>
						<input required placeholder="Camiseta Roja"
						onChange={(e)=> setProduct({...product, "name":e.target.value })}></input>
					</div>

					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label className="select-label">Sub-Categoria</label>
								<button className="category-btn">Añadir nueva</button>
							</div>
							<select required 
							onChange={(e)=> setProduct({...product, "sub_category":e.target.value })}>
								<option value="" disabled selected hidden>Elige una opción</option>
								{store.categories.map((category)=> <option>{category.name}</option>)}
							</select>							
						</div>
					</div>

					<div className="input-holder">
						<label>Precio unidad</label>
						<input type="number" required placeholder="15"
						onChange={(e)=> setProduct({...product, "unit_price":e.target.value })}></input>
					</div>
				</div>

				<div className="column-input">
					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label className="select-label">Categoria</label>
								<button className="category-btn">Añadir nueva</button>
							</div>
							<select required 
							onChange={(e)=> setProduct({...product, "category":e.target.value })}>
								<option value="" disabled selected hidden>Elige una opción</option>
								{store.categories.map((category)=> <option>{category.name}</option>)}
							</select>							
						</div>
					</div>

					<div className="input-holder">
						<label>SKU</label>
						<input required placeholder="SQ-973"
						onChange={(e)=> setProduct({...product, "sku":e.target.value })}></input>
					</div>

					<div className="input-holder">
						<label>Cantidad</label>
						<input type="number" required placeholder="100"
						onChange={(e)=> setProduct({...product, "quantity":e.target.value })}></input>
					</div>
				</div>
			</div>
			<div className="input-holder">
						<label>Descripción</label>
						<textarea required placeholder="Inserta la descripción de tu producto aqui..."
						onChange={(e)=> setProduct({...product, "description":e.target.value })}/>
					</div>
				<button onClick={()=> createProduct(product)}>Crear</button>
			</div>
		</div>
        </>
	);
};	
