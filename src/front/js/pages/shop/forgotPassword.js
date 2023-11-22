import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../../styles/login&register.css";


export const ForgotPassword = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [ user, setUser ] = useState(
		{
			"email":"",
		}
	);
	useEffect(() => {
		if(store.token) navigate("/")
		actions.changeAdminNav(false)
	}, []);
	

	async function userLogin(){
		if (!user.email || !user.password) alert("Some fields are missing")
		else{
			let create = await actions.getUserToken(user)
			if (create) navigate("/admin/")
			else alert("User doesn't exist or password is incorrect")
		}
	}

	return (
		<div className="login-container">
			<h4>Reestablecer contraseña</h4>
            <div className="login-tips">
                <p>Por favor, ingresa el correo electrónico asociado con tu cuenta.</p>
            </div>
			<div className="login-input">
				<input required maxLength="320"
				onChange={(e) => setUser({...user, "email":e.target.value})}/>
				<label>Correo Electrónico</label>

			</div>

			<button className="login-button">Recuperar</button>

            <div style={{display: "flex", justifyContent: "center", fontWeight: 600}} 
            onClick={()=> navigate("/login")} className="login-forgot-password">Cancelar</div>
		</div>

	);
};