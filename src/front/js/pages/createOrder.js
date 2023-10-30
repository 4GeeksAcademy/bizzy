import React, { useState, useContext, useEffect } from "react";
import { BsChevronLeft } from "react-icons/bs"
import { FaBasketShopping, FaMagnifyingGlass, FaTrash } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Context } from "../store/appContext";
import { storage } from "../hooks/useFirebase";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import "../../styles/createProduct.css";
import "../../styles/createOrder.css";
import { SelectProducts } from "../component/selectProducts";
import { SelectCustomer } from "../component/selectCustomer";

export const CreateOrder = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [ selectProductsPopUp, setSelectProductsPopUp] = useState(false)
	const [ selectCustomerPopUp, setSelectCustomerPopUp] = useState(false) 
	const [ tempImage, setTempImage ] = useState("")
	const [ isSelected, setIsSelected ] = useState(false)
    const [ order, setOrder ] = useState(
		{
			"name":"",
			"email": "",
			"phone": "",
			"payment":"",
			"notes":"",
			"date":"",
		}
	)
	
	async function loadInfo(){
		const pLoad = await actions.getProducts()
		const cLoad = await actions.getCustomers()
		const payLoad = await actions.getPayments()
	
		if (!pLoad) toast.error("Ocurrio un error al cargar los productos", {autoClose: false})
		if (!cLoad) toast.error("Ocurrio un error al cargar las categorias", {autoClose: false})
		if (!payLoad) toast.error("Ocurrio un error al cargar los metodos de pago", {autoClose: false})
	  }

	function removeCustomer(){
		setOrder({...order, "name": "", "email":"", "phone":""})
		setIsSelected(false)
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
				<label>Pedido<span style={{color: "#7B57DF"}}>*</span></label>
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
						<label>Cliente<span style={{color: "#7B57DF"}}>*</span></label>
						{!isSelected && <span className="search-customer" onClick={()=>setSelectCustomerPopUp(true)}>
							<FaMagnifyingGlass/>
						</span>}
						{isSelected && <span className="remove-customer" onClick={()=>removeCustomer()}>
							<FaTrash/>
						</span>}
						<input required disabled={isSelected} value={order.name} style={{paddingRight: "50px"}} placeholder={!isSelected? "Maria Perez" : "-"}
						onChange={(e)=> setOrder({...order, "name": e.target.value })}></input>
					</div>

					<div className="input-holder">
						<label>Email</label>
						<input required value={order.email} disabled={isSelected} placeholder={!isSelected? "mariaperez@email.com" : "-"}
						onChange={(e)=> setOrder({...order, "email": e.target.value })}></input>
					</div>

					<div className="input-holder">
						<label>Telefono</label>
						<input required value={order.phone} disabled={isSelected} placeholder={!isSelected? "+58 04241234567" : "-"}
						onChange={(e)=> setOrder({...order, "phone": e.target.value })}></input>
					</div>

				</div>

				<div className="column-input">

					<div style={{display:"flex"}}>
						<div className="input-holder">
							<div style={{display: "flex", justifyContent: "space-between"}}>
								<label>Metodo de Pago</label>
							</div>
							<div className="payment-method-container">
								{store.payments.map((payment)=><div key={payment.id}>
									<button onClick={()=>setOrder({...order, "payment": payment.name})}>
										{payment.icon && <img src={payment.icon}/>}
										{!payment.icon && <span>{payment.name}</span>}
									</button>
									{order.payment == payment.name && <input type="radio" checked />}
								</div>)}
							</div>

						</div>
					</div>

				</div>
				

			</div>
			<input type="date"/>
			<div className="input-holder">
						<label>Notas</label>
						<textarea required placeholder="Inserta una nota..."
						onChange={(e)=> setOrder({...order, "notes": e.target.value })}/>
					</div>
				<button onClick={()=> createNewProduct()}>Crear</button>
			</div>
		</div>
        { selectProductsPopUp && <SelectProducts close={()=> setSelectProductsPopUp(false)}/>}
		{ selectCustomerPopUp && <SelectCustomer set={setOrder} ord={order} isSelect={setIsSelected} close={()=> setSelectCustomerPopUp(false)}/>}
        </>
	);
};	
