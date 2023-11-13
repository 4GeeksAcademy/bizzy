import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";


export const ProductDetails = ()=> {
	const { store, actions } = useContext(Context);
	const [ product, setProduct ] = useState()
	const params = useParams();

	useEffect(() => {
		if (store.shop.products && store.shop.products.length > 0){
			setProduct(store.shop.products.filter((product)=> product.id == params.id )[0] )
		}
	}, [store.shop.products]);

	return <>
		{product && <div>
			<img src={product.image}/>
			<div>{product.name}</div>
			<div>{product.category}</div>
			<div>{product.subcategory}</div>
			<div>{product.unit_price}</div>
			<div>{product.description}</div>
		</div>
		}
	</>
	;
};

