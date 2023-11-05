import React, { useState, useContext, useEffect } from "react";
import { BsCardImage, BsArrowLeftShort } from "react-icons/bs"
import { useRef } from 'react';

import { toast } from 'react-toastify';
import { Context } from "../store/appContext";
import { storage } from "../hooks/useFirebase";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import "../../styles/createProduct.css";


export const EditProduct = (edit) => {
	const returnToOverview = useRef(null);
	const { store, actions } = useContext(Context);
	const [ fileName, setFileName ] = useState("")
	const [ tempImage, setTempImage ] = useState(edit.prod.image)
    const [ product, setProduct ] = useState(
		{
            "id": edit.prod.id,
			"name":edit.prod.name,
			"category":edit.prod.category,
			"subcategory":edit.prod.subcategory,
			"unit_price":edit.prod.unit_price,
			"stock":edit.prod.stock,
			"sku":edit.prod.sku,
			"image":edit.prod.image,
			"description":edit.prod.description
		}
	)
	
	async function loadInfo(){
		const pLoad = await actions.getProducts()
		const cLoad = await actions.getCategories()
	
		if (!pLoad) toast.error("Ocurrio un error al cargar los productos", {autoClose: false})
		if (!cLoad) toast.error("Ocurrio un error al cargar las categorias", {autoClose: false})
	  }

	useEffect(() => {
		loadInfo()
	}, []);

	function handleImage(e){
        setTempImage(e.target.files[0])
	}

	async function editThisProduct(){
		// SEARCH FOR EXISTENT PRODUCT
		const repeated = store.products.filter((item) => item.name == product.name && product.name != edit.prod.name)
		if (repeated.length > 0){
			toast.error("Ya existe un producto con este nombre",{
				position: "bottom-center"})
			return
		}
		// MAKE NULL 
		if (product.subcategory == "No aplica") setProduct({...product, "subcategory":null })

		// SEARCH FOR CHANGES
		let changes = 0
		for (let key in product){
			if (product[key] == edit.prod[`${key}`]){
				if(key != "id" && key != "image"){
					delete product[key]
				}
			}
			else changes += 1
		}
		if (changes == 0 && tempImage == edit.prod.image){
			returnToOverview.current.click()
			return
		}

		// UPLOAD IMAGE
        const url = await uploadFile();
    	if(url == false) return false;
        
		
		// PUT PRODUCT
		let info = await actions.putProduct({...product, "image": url })
		if(info){
			toast.success("Producto editado con exito!")
			returnToOverview.current.click()
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
	}

	const uploadFile = async () => {
        if (tempImage == edit.prod.image) {
            return edit.prod.image
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
            <div className="popup-header" style={{ marginBottom: "8%" }}>
                <h2 style={{fontSize: "30px"}}>Editar producto</h2>
				<span ref={returnToOverview} onClick={edit.close}>
                	<BsArrowLeftShort  className="edit-product-return-icon" />
				</span>
            </div>
            <div style={{display: "flex"}}>
                <div className="edit-product-image" 
                style={{backgroundImage: `url(${ tempImage == edit.prod.image? tempImage : tempImage? URL.createObjectURL(tempImage) : setTempImage(edit.prod.image) })` }}>

                    <input
                        className="image-input-for-edit"
                        onChange={(e) => handleImage(e)}
                        type="file"
                        accept="image/png, image/jpeg"/>
                </div>
                <div >
                    <div className="edit-product-subimage">
                        <BsCardImage/>
                    </div>
                    <div className="edit-product-subimage">
                        <BsCardImage/>
                    </div>
                    <div className="edit-product-subimage">
                        <BsCardImage/>
                    </div>
                </div>
            </div>

			<div className="form-container" style={{justifyContent: "normal"}}>

			<div className="two-columns">
				<div className="column-input">
					<div className="input-holder">
						<label>Nombre<span style={{color: "#7B57DF"}}>*</span></label>
						<input required defaultValue={edit.prod.name}  maxLength="40"
						onChange={(e)=> setProduct({...product, "name":e.target.value })}></input>
					</div>

					<div style={{display:"flex"}}>
						<div className="input-holder">
							<label>Sub-Categoria</label>
							<select required defaultValue={edit.prod.subcategory} 
							onChange={(e)=> setProduct({...product, "subcategory":e.target.value })}>
								<option value="" >No aplica</option>
								{ product.category && store.categories.filter((cat)=> cat.name == product.category)[0].subcategories
								.map((subcategory)=> <option key={subcategory.id}>{subcategory.name}</option>)}
							</select>

						</div>
					</div>

					<div className="input-holder">
						<label>Precio<span style={{color: "#7B57DF"}}>*</span></label>
						<input type="number" required defaultValue={edit.prod.unit_price} 
						onChange={(e)=> setProduct({...product, "unit_price": parseInt(e.target.value) })}></input>
					</div>
				</div>

				<div className="column-input">
					<div style={{display:"flex"}}>
						<div className="input-holder">
							<label>Categoria<span style={{color: "#7B57DF"}}>*</span></label>
							<select required defaultValue={edit.prod.category}  
							onChange={(e)=> setProduct({...product, "category":e.target.value })}>
								{store.categories.map((category)=> <option key={category.id}>{category.name}</option>)}
							</select>	

						</div>
					</div>

					<div className="input-holder">
						<label>SKU<span style={{color: "#7B57DF"}}>*</span></label>
						<input required defaultValue={edit.prod.sku} maxLength="30" 
						onChange={(e)=> setProduct({...product, "sku":e.target.value })}></input>
					</div>

					<div className="input-holder">
						<label>Stock<span style={{color: "#7B57DF"}}>*</span></label>
						<input type="number" required defaultValue={edit.prod.stock} 
						onChange={(e)=> setProduct({...product, "stock": parseInt(e.target.value) })}></input>
					</div>
				</div>
			</div>
			<div className="input-holder">
						<label>Descripción<span style={{color: "#7B57DF"}}>*</span></label>
						<textarea required defaultValue={edit.prod.description} maxLength="1000" 
						onChange={(e)=> setProduct({...product, "description":e.target.value })}/>
					</div>
				<button onClick={()=> editThisProduct()}>Guardar</button>
			</div>
        </>
	);
};	
