import React, { useState, useContext, useEffect } from "react";
import { BsFillCloudUploadFill, BsChevronLeft } from "react-icons/bs"
import { AiOutlineCloseCircle } from "react-icons/ai";

import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Context } from "../store/appContext";
import { storage } from "../hooks/useFirebase";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import "../../styles/createProduct.css";
import { CreateCategory } from "../component/createCategory";
import { CreateSubCategory } from "../component/createSubCategory";

export const CreateProduct = (modal) => {
	const placeholderImage = "https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/placeholder-image.jpg?alt=media&token=02f6aa41-62db-4321-912c-02d5fb6ca9a7&_gl=1*awbatw*_ga*MTgwNzc5NjIwMS4xNjk2Mjk0ODc2*_ga_CW55HF8NVT*MTY5ODA0OTA4NS41LjEuMTY5ODA0OTEzOC43LjAuMA.."
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const ref = useRef(null);
	const [ categoryPopUp, setCategoryPopUp] = useState(false) 
	const [ subCategoryPopUp, setSubCategoryPopUp] = useState(false) 
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
		actions.changeTab("products")

		loadInfo()
	}, []);

	function handleImage(e){
		setTempImage(e.target.files[0])
		setFileName(e.target.value)
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
			<button className="button-back" onClick={()=>navigate("/products")}><span><BsChevronLeft/></span> Volver a Productos</button>
			<h2>Añadir producto</h2>
			<div>
			<div className="upload-image">
				<BsFillCloudUploadFill className="upload-icon"/>
				<button onClick={()=>ref.current.click()}>Selecciona las imagenes</button>
				<p>o</p>
				<p>Sueltalas acá</p>
				
			</div>
			<input
				className="image-input"
				ref={ref}
				onChange={(e) => handleImage(e)}
				type="file"
				accept="image/png, image/jpeg"/>
			</div>

			<label>Imagen<span style={{color: "#7B57DF"}}>*</span></label>
			<div className="imagen-subida">
				{!tempImage && <>
								<img src={placeholderImage} width={"300px"}/>
								<span style={{color: "#9b9b9b"}}>No has seleccionado una imagen aun...</span>
							</>}
				{tempImage && <>
								<img src={URL.createObjectURL(tempImage)} width={"300px"}/>
								<span>{fileName.substring(12)}</span>
							</>}
				<AiOutlineCloseCircle 
				onClick={()=> setTempImage()}
				className="delete-image"/>
			</div>
			<div className="form-container">

			<div className="two-columns">
				<div className="column-input">
					<div className="input-holder">
						<label>Nombre<span style={{color: "#7B57DF"}}>*</span></label>
						<input required placeholder="Camiseta Roja"
						onChange={(e)=> setProduct({...product, "name":e.target.value })}></input>
					</div>

					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label>Sub-Categoria</label>
								<button 
								onClick={()=> product.category? setSubCategoryPopUp(true): toast.warn('Selecciona una categoria', {position: "bottom-center",})} 
								className="category-btn">Añadir nueva</button>
							</div>
							
							<select required defaultValue=""
							onChange={(e)=> setProduct({...product, "subcategory":e.target.value })}>
								<option value="" disabled hidden>Elige una opción</option>
								<option value="" >No aplica</option>
								{ product.category && store.categories.filter((cat)=> cat.name == product.category)[0].subcategories
								.map((subcategory)=> <option key={subcategory.id}>{subcategory.name}</option>)}
							</select>

						</div>
					</div>

					<div className="input-holder">
						<label>Precio<span style={{color: "#7B57DF"}}>*</span></label>
						<input type="number" required placeholder="15"
						onChange={(e)=> setProduct({...product, "unit_price": parseInt(e.target.value) })}></input>
					</div>
				</div>

				<div className="column-input">
					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label>Categoria<span style={{color: "#7B57DF"}}>*</span></label>
								<button onClick={()=>setCategoryPopUp(true)} className="category-btn">Añadir nueva</button>
							</div>

							<select required defaultValue="" 
							onChange={(e)=> setProduct({...product, "category":e.target.value })}>
								<option value="" disabled hidden>Elige una opción</option>
								{store.categories.map((category)=> <option key={category.id}>{category.name}</option>)}
							</select>	

						</div>
					</div>

					<div className="input-holder">
						<label>SKU<span style={{color: "#7B57DF"}}>*</span></label>
						<input required placeholder="SQ-973"
						onChange={(e)=> setProduct({...product, "sku":e.target.value })}></input>
					</div>

					<div className="input-holder">
						<label>Cantidad<span style={{color: "#7B57DF"}}>*</span></label>
						<input type="number" required placeholder="100"
						onChange={(e)=> setProduct({...product, "stock": parseInt(e.target.value) })}></input>
					</div>
				</div>
			</div>
			<div className="input-holder">
						<label>Descripción<span style={{color: "#7B57DF"}}>*</span></label>
						<textarea required placeholder="Inserta la descripción de tu producto aqui..."
						onChange={(e)=> setProduct({...product, "description":e.target.value })}/>
					</div>
				<button onClick={()=> createNewProduct()}>Crear</button>
			</div>
		</div>
		{ categoryPopUp && <CreateCategory close={()=>setCategoryPopUp(false)} />}
		{ subCategoryPopUp && <CreateSubCategory close={()=>setSubCategoryPopUp(false)} category={product.category} />}
        </>
	);
};	
