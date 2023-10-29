import React, { useState, useContext, useEffect } from "react";
import { BsChevronLeft } from "react-icons/bs"
import { FaBasketShopping } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Context } from "../store/appContext";
import { storage } from "../hooks/useFirebase";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import "../../styles/createProduct.css";
import "../../styles/createOrder.css";
import { SelectProducts } from "../component/selectProducts";


export const CreateOrder = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [ selectProductsPopUp, setSelectProductsPopUp] = useState(false) 
	const [ fileName, setFileName ] = useState("")
	const [ tempImage, setTempImage ] = useState("")
    const [ product, setProduct ] = useState(
		{
			"name":"",
			"category":"",
			"subcategory":null,
			"unit_price":"",
			"stock":"",
			"sku":"",
			"image":"",
			"description":""
		}
	)
	
	async function loadInfo(){
		const pLoad = await actions.getProducts()
		const cLoad = await actions.getCategories()
	
		if (!pLoad) toast.error("Ocurrio un error al cargar los productos", {autoClose: false})
		if (!cLoad) toast.error("Ocurrio un error al cargar las categorias", {autoClose: false})
	  }

	useEffect(() => {
		actions.changeTab("orders")

		loadInfo()
	}, []);

	function deleteFromSelected(p){
	const newSelects = store.selectedProducts.filter((item)=> item.name != p.name)
	actions.addSelectedProducts(newSelects)
	}

	async function createNewProduct(){
		// SEARCH FOR EXISTENT PRODUCT
		const repeated = store.products.filter((item) => item.name == product.name)
		if (repeated.length > 0){
			toast.error("Ya existe un producto con este nombre",{
				position: "bottom-center"})
			return
		}
		// MAKE NULL 
		if (product.subcategory == "No aplica") setProduct({...product, "subcategory":null })
		// SEARCH FOR UNFILLED FIELDS
		for (let value in product){
			if (value == "image" || value == "subcategory") continue
			if (!product[value]){
				toast.error("Rellena todos los campos",{
					position: "bottom-center"})
				return
			}
		}
		// UPLOAD IMAGE
		const url = await uploadFile();
		if(url == false) return false;

		// POST PRODUCT
		let info = await actions.postProduct({...product, "image": url })
		if(info){
			toast.success("Producto creado con exito!")
			navigate("/products")
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
	}

	const uploadFile = async () => {
        if (!tempImage) {
            toast.error("Porfavor agrega una imagen",{
				position: "bottom-center"})
            return false
        }
        const imageRef = storageRef(storage, `products/${product.category}-${product.subcategory}-${product.name}`);

        try{
            const uploadResp = await uploadBytes(imageRef, tempImage)
            const url =  await getDownloadURL(uploadResp.ref)
            return url
        }
		catch(err){
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"})
			return false
        }
    };

	return (<>
		<div className="create-views-container">
			<button className="button-back" onClick={()=>navigate("/orders")}><span><BsChevronLeft/></span>Volver a Ordenes</button>
			<h2>Crear orden</h2>

			<span className="create-order-header">
				<p>Pedido</p>
				{store.selectedProducts.length > 0 && <button onClick={()=> setSelectProductsPopUp(true) } className="category-btn">Editar</button>}
			</span>
			<div className={store.selectedProducts.length > 0 ? "order-selected-products" : "order-no-selected-products"}>
				{store.selectedProducts.length > 0 && store.selectedProducts.map((prod)=> (
				<div key={prod.id} className="selected-minicard" onClick={()=>deleteFromSelected(prod)}>
				<div>{prod.quantity}</div>
				<img src={prod.image}/>
				</div>
				))}
				{!store.selectedProducts.length > 0 && <button onClick={ ()=> setSelectProductsPopUp(true) }>
					<FaBasketShopping style={{fontSize: "25px"}}/>Haz click para añadir productos
					</button>}
			</div>

			<div className="form-container">

			<div className="two-columns">
				<div className="column-input">
					<div className="input-holder">
						<label>Cliente</label>
						<input required placeholder="Camiseta Roja"
						onChange={(e)=> setProduct({...product, "name":e.target.value })}></input>
					</div>

					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label className="select-label">Metodo de Pago</label>
							</div>
							
							<select required 
							onChange={(e)=> setProduct({...product, "subcategory":e.target.value })}>
								<option value="" disabled selected hidden>Elige una opción</option>
								<option value="" >No aplica</option>
								{ product.category && store.categories.filter((cat)=> cat.name == product.category)[0].subcategories
								.map((subcategory)=> <option key={subcategory.id}>{subcategory.name}</option>)}
							</select>

						</div>
					</div>
				</div>

				<div className="column-input">
					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label className="select-label">Categoria</label>
							</div>

							<select required 
							onChange={(e)=> setProduct({...product, "category":e.target.value })}>
								<option value="" disabled selected hidden>Elige una opción</option>
								{store.categories.map((category)=> <option key={category.id}>{category.name}</option>)}
							</select>	

						</div>
					</div>

					<div className="input-holder">
						<label>SKU</label>
						<input required placeholder="SQ-973"
						onChange={(e)=> setProduct({...product, "sku":e.target.value })}></input>
					</div>
				</div>
			</div>
			<div className="input-holder">
						<label>Notas</label>
						<textarea required placeholder="Inserta una nota..."
						onChange={(e)=> setProduct({...product, "description":e.target.value })}/>
					</div>
				<button onClick={()=> createNewProduct()}>Crear</button>
			</div>
		</div>
        { selectProductsPopUp && <SelectProducts close={()=> setSelectProductsPopUp(false)}/>}
        </>
	);
};	
