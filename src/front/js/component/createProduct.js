import React, { useState } from "react";
import "../../styles/createProduct.css";


export const CreateProduct = () => {
    const [product, setProduct] = useState()
	return (<>
		<div className="background"></div>
        <div className="modalsito">
		<h2>Create new product</h2>

		<div className="input-holder">
			<input required ></input>
			<label>Product name</label>
		</div>

		<div className="input-holder">
			<input required></input>
			<label>Image URL</label>
		</div>

		<div className="input-holder">
			<select>hola</select>
            <option>Peluche</option>
			<label>Category</label>
		</div>
		<div className="double-input">
            <div className="input-holder">
                <input required></input>
                <label>Address</label>
            </div>
            <div className="input-holder">
                <input required></input>
                <label>Address</label>
            </div>
        </div>

		<p>Items marked with an <span>*</span> are required.</p>
		<button onClick={()=>contactAdd()}>Save</button>
        </div>

        </>
	);
};
