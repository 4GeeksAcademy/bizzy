import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { toast } from 'react-toastify';


import "../../../styles/login&register.css";


export const Register = () => {
	const navigate = useNavigate();
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
	const { store, actions } = useContext(Context);
	const [ user, setUser ] = useState(
		{
            "name": "",
			"email":"",
			"password":"",
            "confirm_password":""
		}
	);

	useEffect(() => {
		if(store.token) navigate("/")
		actions.changeAdminNav(false)
	}, []);


	async function userRegister(){
		if (!user.name || !user.email || !user.password || !user.confirm_password) {
            toast.error("Rellena todos los campos",{
            position: "bottom-center"})
        }
        else if (user.password != user.confirm_password){
            toast.error("Las contraseñas no coinciden",{
                position: "bottom-center"})
        }
        else if (user.email.match(re) == null){
            toast.error("Dirección de correo invalida",{
                position: "bottom-center"})
        }
		else{
            let info = await actions.postUser(user)
            if(info){
                toast.success(`Usuario registrado! Bienvenido ${user.name}`)
			    navigate("/")
                return
            }
            else{
				toast.error("Ocurrio un error inesperado",{
					position: "bottom-center"
				})
            }

		}
	}

	return (
		<div className="login-container">
			<h4>Crea tu cuenta</h4>
			<div className="login-input">
				<input required maxLength="40"
				onChange={(e) => setUser({...user, "name":e.target.value})}/>
				<label>Nombre Completo</label>
			</div>

            <div className="login-input">
				<input required maxLength="320"
				onChange={(e) => setUser({...user, "email":e.target.value})}/>
				<label>Correo Electrónico</label>
			</div>

            <div className="login-input">
				<input type="password" required maxLength="100"
				onChange={(e) => setUser({...user, "password":e.target.value})}/>
				<label>Contraseña</label>
			</div>

			<div className="login-input">
				<input type="password" required maxLength="100"
				onChange={(e) => setUser({...user, "confirm_password":e.target.value})}/>
				<label>Confirmar Contraseña</label>
			</div>
            <div className="login-tips">
                <p>Tips para una contraseña fuerte:</p>
                <p><GoDotFill/>Crea una contraseña única.</p>
                <p><GoDotFill/>Usa letras minúsculas y mayúsculas y números.</p>
                <p><GoDotFill/>Usa caracteres especiales en tu contraseña.</p>
            </div>

			<button className="login-button" onClick={()=> userRegister() }>Crear cuenta</button>

			<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
				<div className="login-divisor"/>
				<div className="login-new">¿Ya tienes una cuenta?</div>
			</div>

			<button onClick={()=> navigate("/login")} className="register-button">Inicia Sesión</button>
		</div>

	);
};