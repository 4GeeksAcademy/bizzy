import React, { useState, useEffect, useContext } from "react";
import { MdDeliveryDining, MdStorefront, MdOutlineLocalShipping } from "react-icons/md";
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { TbMapSearch } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../../styles/login&register.css";
import "../../../styles/checkout.css";
import "../../../styles/cart.css";
import { toast } from "react-toastify";


export const Checkout = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [ total, setTotal ] = useState(0)
	const [ totalQ, setTotalQ ] = useState(0)
	const [ shipping, setShipping] = useState("pickup");
	const [ paymentMethod, setPaymentMethod] = useState("");
	const [ shipInfo, setShipInfo ] = useState({
		"type": "",
		"country": "",
		"state": "",
		"city":"",
		"address": "",
		"building": "",
		"phone": "",
	});

	let today = new Date()
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, "0");
	const day = today.getDate().toString().padStart(2, "0");
	const hours = today.getHours().toString().padStart(2, "0");
	const minutes = today.getMinutes().toString().padStart(2, "0");
	let todayFormated =  `${year}-${month}-${day}T${hours}:${minutes}`

	useEffect(() => {
		actions.changeAdminNav(false)
		document.getElementById("content").scroll(0,0)
	}, []);

	useEffect(() => {
		let tempTotal = 0
			if (store.cart.length > 0){
				for (let item of store.cart ){
			tempTotal += item.quantity * item.product.unit_price
		  }
		  setTotal(tempTotal)
			}
		else{
		  setTotal(0)
		}

		let tempTotalQ = 0
		if (store.cart.length > 0){
			for (let item of store.cart ){
				tempTotalQ += item.quantity
				}
			setTotalQ(tempTotalQ)
		}
		else{
			setTotalQ(0)
		  }
		}, [store.cart]);

	useEffect(() => {
		let tempTotal = 0
			if (store.cart.length > 0){
				for (let item of store.cart ){
					tempTotal += item.quantity * item.product.unit_price
					}
				setTotal(tempTotal)
			}

		let tempTotalQ = 0
		if (store.cart.length > 0){
			for (let item of store.cart ){
				tempTotalQ += item.quantity
				}
			setTotalQ(tempTotalQ)
		}
		}, [store.random]);

	useEffect(() => {
		if(!localStorage.getItem("token") && !store.user.id) navigate("/login")
	}, [store.user])

	useEffect(() => {
		if(!localStorage.getItem("token") && !store.user.id) navigate("/login")
	}, [store.cart])
	
	function handleAddress(shipType){
		if (shipType == "delivery"){
			if (!shipInfo.address || !shipInfo.building || !shipInfo.phone){
				toast.error("Rellena todos los campos")
			}
			else{
				setShipInfo({...shipInfo, "type":"delivery", "country": "venezuela", "state":"distrito capital", "city": "caracas"})
			}
		}
		else if (shipType == "ship"){
			if (!shipInfo.state || !shipInfo.city || !shipInfo.address || !shipInfo.building || !shipInfo.phone){
				toast.error("Rellena todos los campos")
			}
			else{
				setShipInfo({...shipInfo, "type":"ship", "country": "venezuela"})
			}
		}
	}
	
	useEffect(() => {
		if (shipping == "pickup"){
			setShipInfo({"type": "pickup",
			"country": "pickup",
			"state": "pickup",
			"city":"pickup",
			"address": "pickup",
			"building": "pickup",
			"phone": "pickup",
			})
		}
		else{
			setShipInfo({"type": "",
			"country": "",
			"state": "",
			"city":"",
			"address": "",
			"building": "",
			"phone": "",
			})
		}

	}, [shipping]);

	async function handleCheckout(){
		for (let keys in shipInfo){
			if (!shipInfo[keys]){
				toast.error("Rellena todos los campos de dirección")
				return
			}
		}
		if (!paymentMethod){
			toast.error("Porfavor, selecciona un metodo de pago")
			return
		}
		if (store.cart.length == 0){
			toast.error("No hay productos en el carrito")
			return
		}
		let fixedCart = []
		let i = 0
		for (let item of store.cart){
			fixedCart.push(item.product)
			fixedCart[i].quantity = item.quantity
			i+=1
		}

		let info = await actions.postOrder({"date":todayFormated, "email":store.user.email, "items":fixedCart, "name": store.user.name,
		"notes": `${shipInfo.type}: ${shipInfo.country}, ${shipInfo.state}, ${shipInfo.city}, ${shipInfo.address}, ${shipInfo.building}`,
		"phone":shipInfo.phone, "status": "Pendiente", "payment": paymentMethod })

		if (info){
			let writtenCart = ""
			for (let product of fixedCart){
				writtenCart += `(${product.quantity})%20x%20${product.name}%0A` 
			}
			window.open(`https://wa.me/584129709870?text=Hola%2C%20Petzzy%21%0AEscribo%20para%20concretar%20mi%20compra%20en%20su%20web
			%0A%0A------%20------%0ANombre%3A%20${store.user.name}%0AM%C3%A9todo%20de%20Entrega%3A%20${shipInfo.type}%0ACorreo%3A%20
			${store.user.email}%0AN%C3%BAmero%3A%20${shipInfo.phone}%0A%0A------%20Pedido%3A%20%23${info.id}%20------%0A${writtenCart}
			%0A---Total%3A%20%24${info.total_price}`)
			
			actions.addToCart([])
			toast.success("Orden realizada con éxito!", {autoClose: false})
			navigate("/")
		}
	}

	return <div className="checkout-container">
				<div className="checkout-shipping-container">
					<h4>¿Como desea recibir su pedido?</h4>
					<div className="checkout-shipping-type">
						<button onClick={()=> setShipping("pickup")}
						className={shipping == "pickup"? "active-shipping-type" : ""}><MdStorefront/> Recoger en tienda</button>
						<button onClick={()=> setShipping("ship")}
						className={shipping == "ship"? "active-shipping-type" : ""}><MdOutlineLocalShipping/>  Envio Nacional</button>
						<button onClick={()=> setShipping("delivery")}
						className={shipping == "delivery"? "active-shipping-type" : ""}><MdDeliveryDining/>Delivery</button>
					</div>
				
				{shipping == "delivery" && <div>
					<h3>Dirección de envio</h3>
					<div className="login-input disabled-checkout-input" >
						<input required value="Venezuela" style={{border: "2px solid rgb(229 229 229)"}}
						onChange={(e)=> setShipInfo({...shipInfo, "country": e.target.event})}/>
						<label>Pais</label>
					</div>

					<div style={{display: "flex", justifyContent: "space-between"}} >
						<div className="login-input disabled-checkout-input">
							<input required value="Distrito Capital" style={{border: "2px solid rgb(229 229 229)"}}
							onChange={(e)=> setShipInfo({...shipInfo, "state": e.target.value})}/>
							<label style={{left: "9%"}}>Estado</label>
						</div>
						<div className="login-input disabled-checkout-input">
							<input required value="Caracas" style={{border: "2px solid rgb(229 229 229)"}}
							onChange={(e)=> setShipInfo({...shipInfo, "city": e.target.value})}/>
							<label style={{left: "9%"}}>Ciudad</label>
						</div>
					</div>
					
					<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
						<input required maxLength="100" style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
						onChange={(e)=> setShipInfo({...shipInfo, "address": e.target.value})}/>
						<label>Dirección</label>
					</div>

					<div style={{display: "flex", justifyContent: "space-between"}} >
						<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
							<input required maxLength="100" style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
							onChange={(e)=> setShipInfo({...shipInfo, "building": e.target.value})}/>
							<label style={{left: "9%"}}>Apt, edificio</label>
						</div>
						<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
							<input required maxLength="100" style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
							onChange={(e)=> setShipInfo({...shipInfo, "phone": e.target.value})}/>
							<label style={{left: "9%"}}>Numero de contacto</label>
						</div>
					</div>
					<div className="login-tips">
                		<p>Asegúrate de estar disponible para recibir tu pedido en esta dirección.</p>
            		</div>
					<div className="save-info-button-container">
						{!shipInfo.type && <button onClick={()=>handleAddress("delivery")}>Usar esta dirección</button>}
						{shipInfo.type && <button onClick={()=> setShipInfo({...shipInfo, "type":""})} style={{background: "#a7a7a7"}}>Cambiar</button>}
					</div>
				</div>
				}

				{shipping == "ship" && <div>
					<h3>Dirección de envio</h3>
					<div className="login-input disabled-checkout-input" >
						<input required value="Venezuela" style={{border: "2px solid rgb(229 229 229)"}}
						onChange={(e)=> setShipInfo({...shipInfo, "country": e.target.event})}/>
						<label>Pais</label>
					</div>

					<div style={{display: "flex", justifyContent: "space-between"}} >
						<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
							<input required style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
							onChange={(e)=> setShipInfo({...shipInfo, "state": e.target.value})}/>
							<label style={{left: "9%"}}>Estado</label>
						</div>
						<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
							<input required style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
							onChange={(e)=> setShipInfo({...shipInfo, "city": e.target.value})}/>
							<label style={{left: "9%"}}>Ciudad</label>
						</div>
					</div>
					
					<div style={{display: "flex", justifyContent: "space-between"}} >
						<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
							<input required maxLength="100" style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
							onChange={(e)=> setShipInfo({...shipInfo, "building": e.target.value})}/>
							<label style={{left: "9%"}}>Agencia</label>
						</div>
						<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
							<input required maxLength="100" style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
							onChange={(e)=> setShipInfo({...shipInfo, "phone": e.target.value})}/>
							<label style={{left: "9%"}}>Numero de contacto</label>
						</div>
					</div>

					<div className={shipInfo.type? "login-input disabled-checkout-input" : "login-input"}>
						<input required maxLength="100" style={shipInfo.type? {border: "2px solid rgb(229 229 229)"} : {} }
						onChange={(e)=> setShipInfo({...shipInfo, "address": e.target.value})}/>
						<label>Dirección de Agencia</label>
					</div>

					<div className="login-tips">
                		<p>Recuerda que deberás cancelar el costo del envio en la agencia de tu preferencia.</p>
            		</div>
					<div className="save-info-button-container">
						{!shipInfo.type && <button onClick={()=>handleAddress("ship")}>Usar esta dirección</button>}
						{shipInfo.type && <button onClick={()=> setShipInfo({...shipInfo, "type":""})} style={{background: "#a7a7a7"}}>Cambiar</button>}
					</div>
				</div>
				}
				{shipping == "pickup" && <div>
					<h3>Estamos ubicados en: </h3>
					<div className="pickup-location">
						<FiMapPin/>
						Centro Comercial Tolon
						<p>Planta Baja, frente al Granier</p>
						<div className="map-icon">
							<TbMapSearch/>
							<a href="https://www.google.com/maps/place/Tolón/@10.4809862,-66.8609499,15z/data=!4m2!3m1!1s0x0:0xbcc03cc5a471e3d2?sa=X&ved=2ahUKEwjgyp-FuNiCAxVGq4QIHSX8CAoQ_BJ6BAg_EAA"
							target="_blank">Ir maps</a>
						</div>
					</div>
				</div>
				}




				</div>
				<div className="checkout-order-summarry">
					{store.cart.length == 0 && <NoItemFound message={"No hay nada en el carrito"}/> }
						{store.cart.length > 0 && store.cart.map((prod)=><div className="cart-product-container" key={prod.product.id}>
						<img src={prod.product.image} />
						<div className="cart-product-info">
							<div className="quantity-for-checkout">{prod.quantity}</div>
							<div className="name">{prod.product.name}</div>
							<div className="cart-category">{prod.product.category}</div>
						</div>
						<div className="price" style={{fontSize: "13px"}}>
							${parseFloat(prod.product.unit_price * prod.quantity).toFixed(2)}
						</div>
					</div>)}
					<div className="checkout-order-bill">
						<div className="checkout-bill-divisor"/>
						<div className="bill-row">
							<div className="bill-left">Subtotal({totalQ})</div>
							<div className="bill-right">${parseFloat(total).toFixed(2)}</div>
						</div>

						<div className="bill-row">
							<div className="bill-left">Envio</div>
							<div className="bill-right">{shipping == "delivery"? total < 35? "$"+parseFloat(3).toFixed(2) : "GRATIS" : "GRATIS" }</div>
						</div>
							<div className="checkout-payment-title">Método de pago</div>
						<div className="checkout-payment-methods-container">
							{store.shop.payments && store.shop.payments.map((payment)=> <div key={payment.name} onClick={()=> setPaymentMethod(payment.name)}
							className={paymentMethod == payment.name? "selected-checkout-payment" : ""}>
								{payment.icon && <img src={payment.icon}/>}
								{!payment.icon && <span>{payment.name}</span>}
							</div>)}
						</div>
						<div className="checkout-final-button">
							<button onClick={()=> handleCheckout()}>Finalizar compra</button>
						</div>
						
					</div>
				</div>
			</div>
};