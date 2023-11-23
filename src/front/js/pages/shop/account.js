import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "../../../styles/login&register.css";


export const Account = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [ user, setUser ] = useState(
		{
			"email":"",
			"password":""
		}
	);

	useEffect(() => {
		actions.changeAdminNav(false)
	}, []);

	return (
		<div className="login-container">
			<h4>Cuenta</h4>
			<div>Bienvenido! {store.user.name}</div>
			<div>Dirección de correo: {store.user.email}</div>
		</div>

	);
};