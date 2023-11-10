import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [ user, setUser ] = useState(
		{
			"email":"",
			"password":""
		}
	);
	useEffect(() => {
		if(store.token) navigate("/admin/products")
		actions.changeAdminNav(false)
	}, []);
	

	async function userLogin(){
		if (!user.email || !user.password) alert("Some fields are missing")
		else{
			let create = await actions.getUserToken(user)
			if (create) navigate("/admin/products")
			else alert("User doesn't exist or password is incorrect")
		}
	}

	return (
		<div className="container w-25 bg-light border rounded p-4 my-5">
			<h1 className="text-center mb-3">Log in!</h1>
			<div className="mb-3">
				<label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
				<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
				onChange={(e) => setUser({...user, "email":e.target.value})}/>

			</div>
			<div className="mb-3">
				<label htmlFor="exampleInputPassword1" className="form-label">Password</label>
				<input type="password" className="form-control" id="exampleInputPassword1"
				onChange={(e) => setUser({...user, "password":e.target.value})}/>
			</div>

			<button type="submit" className="btn btn-primary mt-2" onClick={()=> userLogin() }>Submit</button>
		</div>

	);
};