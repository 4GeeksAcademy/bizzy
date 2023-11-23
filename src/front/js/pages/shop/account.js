import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";

import { FaChevronRight } from "react-icons/fa";
import { MdLogout, MdReceiptLong } from "react-icons/md"
import { IoPerson } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";

import moment from "moment";
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { toast } from 'react-toastify';
import "../../../styles/login&register.css";
import "../../../styles/account.css";


export const Account = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [ tab, setTab ] = useState("orders")
	const [ newPassword, setNewPassword ] = useState({
		"id": "",
		"password": "",
		"new_password": "",
		"confirm_new_password":""
	})
	const [ user, setUser ] = useState(
		{
			"id": "",
			"email":"",
			"name":""
		}
	);

	let userOrders = store.shop.orders? store.shop.orders.filter((order)=> order.customer.email == store.user.email) : []

	async function changeInfo(){
		if (!user.email && !user.name) return
		let info = await actions.putUser({...user, "id": store.user.id})
		if (info){
			toast.success("¡Información actualizada!")
		}
		else{
			toast.error("Ocurrio un error inesperado")
		}
	}

	async function changePassword(){
		if(!newPassword.password){
			toast.error("Ingresa tu contraseña actual")
			return
		}
		if(newPassword.new_password != newPassword.confirm_new_password){
			toast.error("La nueva contraseña no coincide")
			return
		}
		let info = await actions.putUser({...newPassword, "id": store.user.id})
		if (info){
			toast.success("¡Contraseña actualizada!")
		}
		else{
			toast.error("Contraseña actual incorrecta")
		}
	}

	useEffect(() => {
		actions.changeAdminNav(false)
		actions.getShopInfo()
		document.getElementById("content").scroll(0,0)
	}, []);

	useEffect(() => {
		if(!localStorage.getItem("token") && !store.user.id) navigate("/login")
	}, [store.user])

	return (
		<div className="shop-account-container">
			<div className="account-dashboard">
				<div className="account-dash-header">
					<div>
						<FaHouse />
						<span>Panel de Cuenta</span>
					</div>
					<p>Hola, {store.user.name}!</p>
				</div>

				<div className="account-dash-buttons">
					<button onClick={()=>setTab("orders")}>
						<div><MdReceiptLong/> Pedidos</div> 
						<FaChevronRight/> 
					</button>
					<button onClick={()=>setTab("security")}>
						<div><IoPerson/> Seguridad</div>
						<FaChevronRight/>
					</button>
				</div>
				<div className="account-dash-logout" onClick={()=>actions.logout()}><MdLogout/>Cerrar sesión</div>
			</div>


			<div className="account-right-board">
				<div className="right-board-inside">
					{tab == "orders" && <>
						<div className="right-board-fake-permalink">
							<span>Panel de Cuenta</span> / Pedidos
						</div>
						<h3>Historial de Pedidos</h3>
						<div className="right-board-orders-container">
							{userOrders.length == 0 && <NoItemFound message={"Aun no tienes ordenes"}/>}
							{userOrders.length > 0 &&  userOrders.reverse().map((order)=><div className="account-order-container" key={order.id}>
								<div className="right-board-order-header">
									<div>Fecha del pedido <span>{moment(order.date, "YYYYMMDDhh:mm").format('ll')}</span></div>
									<div>N.° de pedido <span>{order.id.toString().padStart(4, "0")}</span></div>
								</div>
								<div style={{display: "flex", margin: "10px 0"}}>
									{order.items.slice(0,5).map((item)=><div key={item.id} className="right-board-order-product">
									<span>{item.quantity}</span>
									<img src={item.product.image}/>
									</div>)}
								</div>
								<div className="right-board-order-footer">
									<div className="right-board-left-footer">
										<div>
											<div>Productos</div>
											<p>{order.total_quantity}</p>
										</div>
										<div>
											<div>Método de Pago</div>
											<p>{order.payment.name}</p>
										</div>
									</div>
									<div className="right-board-right-footer">
										<div>Total del Pedido</div>
										<p>${parseFloat(order.total_price).toFixed(2)}</p>
									</div>
								</div>

								<div className="right-board-divisor"/>

								</div>)}
						</div>
					</>}





					{tab == "security" && <>
						<div className="right-board-fake-permalink">
							<span>Panel de Cuenta</span> / Seguridad
						</div>

						<h3 style={{marginBottom: "0"}}>Configuración</h3>
						<p className="right-board-informative-text">Actualiza tu información personal y contraseña acá</p>

						<div className="login-input">
							<input required maxLength="3200" defaultValue={store.user.name}
							onChange={(e) => setUser({...user, "name":e.target.value})}/>
							<label>Nombre Completo</label>
						</div>

						<div className="login-input">
							<input required maxLength="3200" defaultValue={store.user.email}
							onChange={(e) => setUser({...user, "email":e.target.value})}/>
							<label>Correo Electrónico</label>
						</div>

						<div style={{display:"flex", justifyContent: "flex-end", marginBottom: "30px"}}>
							<button className="login-button" onClick={()=> changeInfo() }>Guardar Cambios</button>
						</div>



						<div className="change-password-header">Cambiar contraseña</div>
						<div className="login-input" style={{marginBottom: "15px"}}>
							<input type="password" required maxLength="3200"
							onChange={(e) => setNewPassword({...newPassword, "password":e.target.value})}/>
							<label>Contraseña Actual</label>
						</div>

						<div className="login-input">
							<input type="password" required maxLength="3200"
							onChange={(e) => setNewPassword({...newPassword, "new_password":e.target.value})}/>
							<label>Contraseña nueva</label>
						</div>

						<div className="login-input">
							<input type="password" required maxLength="3200"
							onChange={(e) => setNewPassword({...newPassword, "confirm_new_password":e.target.value})}/>
							<label>Confirmar Contraseña</label>
						</div>
						<div style={{display:"flex", justifyContent: "flex-end"}}>
							<button className="login-button" onClick={()=> changePassword() }>Guardar Cambios</button>
						</div>
					</>}
				</div>
			</div>

		</div>
	);
};