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

var today = new Date()
var todayFormated =  today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate()

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
			"date":todayFormated,
			"status":"Completada",
			"items": []
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

	async function createNewOrder(){
		// SEARCH FOR EXISTENT CUSTOMER IF NOT SELECTED
		if (!isSelected){
			const repeated = store.customers.filter((customer) => customer.name == order.name)
			if (repeated.length > 0){
				toast.error("Ya existe un cliente con este nombre",{
					position: "bottom-center"})
				return
			}
		}
		// SEARCH FOR UNFILLED FIELDS
		for (let value in order){
			if (value == "email" || value == "phone" || value == "notes") continue
			if (!order[value]){
				toast.error("Rellena todos los campos",{
					position: "bottom-center"})
				return
			}
		}

		// POST PRODUCT
		let info = await actions.postOrder({...order, "items":store.selectedProducts})
		if(info){
			toast.success("Orden creada con exito!")
			actions.addSelectedProducts([])
			navigate("/orders")
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
	}

	return (<>
		<div className="create-views-container">
			<div className="create-order-top">
				<button className="button-back" onClick={()=>navigate("/orders")}><span><BsChevronLeft/></span>Volver a Ordenes</button>
				<div className="time-input-holder">
					<input type="date" defaultValue={todayFormated}
					onChange={(e)=> setOrder({...order, "date": e.target.value })}/>
				</div>
			</div>
			<div className="create-order-header">
				<h2>Crear orden</h2>
				<select defaultValue="Completada" className={order.status=="Completada"? "green-order-status" 
				: order.status=="Pendiente"? "gray-order-status" : "red-order-status"}
				onChange={(e)=>setOrder({...order, "status": e.target.value })}>
					<option value="Completada" className="gray-order-status">&#x2022; Completada</option>
					<option value="Pendiente" className="gray-order-status">&#x2022; Pendiente</option>
					<option value="Cancelada" className="gray-order-status">&#x2022; Cancelada</option>
				</select>
			</div>
			<span className="order-select-products-header">
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
								<label>Metodo de Pago<span style={{color: "#7B57DF"}}>*</span></label>
							</div>
							<div className="payment-method-container">
								{store.payments.map((payment)=><div key={payment.id}>
									<button onClick={()=>setOrder({...order, "payment": payment.name})}>
										{payment.icon && <img src={payment.icon}/>}
										{!payment.icon && <span>{payment.name}</span>}
									</button>
									{order.payment == payment.name && <input type="radio" defaultChecked />}
								</div>)}
							</div>

						</div>
					</div>

				</div>
				

			</div>
			<div className="input-holder">
						<label>Notas</label>
						<textarea required placeholder="Inserta una nota..."
						onChange={(e)=> setOrder({...order, "notes": e.target.value })}/>
					</div>
				<button onClick={()=> createNewOrder()}>Crear</button>
			</div>
		</div>
        { selectProductsPopUp && <SelectProducts close={()=> setSelectProductsPopUp(false)}/>}
		{ selectCustomerPopUp && <SelectCustomer set={setOrder} ord={order} isSelect={setIsSelected} close={()=> setSelectCustomerPopUp(false)}/>}
        </>
	);
};	
