import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";
import "../../../styles/category.css";
import "../../../styles/productDetails.css";



export const ProductDetails = ()=> {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [ category, setCategory ] = useState()
	const [ subcategory, setSubcategory ] = useState()
	const [ product, setProduct ] = useState()
	const params = useParams();

	useEffect(() => {
		if (store.shop.products && store.shop.products.length > 0){
			setProduct(store.shop.products.filter((product)=> product.id == params.id )[0] )
		}
	}, [store.shop.products]);
	
	useEffect(() => {
		if (product){
			setCategory(product.category)
			setSubcategory(product.subcategory)
		}
	}, [product]);

	return <div style={{margin: "3% 10% 0 10%"}}>

		<div className="shop-view-category-header" style={{marginBottom: "40px"}}>
			<div className="shop-view-category-header-perma-link">
				<span className="shop-view-category-header-abled" onClick={()=> navigate("/")}>
					Inicio
				</span>
				&nbsp;/&nbsp; 
				<span onClick={()=>navigate(`/category/${category}`)}>
					{category}
				</span>
				{category && <>
					&nbsp;/&nbsp;
					<span onClick={()=>navigate(`/category/${category}/${subcategory}`)}> 
						{subcategory}
					</span>
				</>}
			</div>
		</div>



		<div className="shop-view-product-middle">
			<div className="shop-view-product-image">
				<img src={product && product.image}/>
			</div>


			<div className="shop-view-product-info">
				<div className="sku">SKU: {product && product.sku}</div>
				<div className="name">{product && product.name}</div>
				<div className="price">${product && product.unit_price}</div>
				<div className="quantity">
					<select>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</select>
					<div className="stock-info">
						<p><b style={{color: "#213E00"}}>En Stock</b></p>
						<p><b>Delivery GRATIS</b> en ordenes de más de $35</p>
					</div>
				</div>
				<div style={{display:'flex', flexDirection: "column"}}>
					<button className="add-to-cart">añadir al carrito</button>
					<button className="buy-now">comprar ahora</button>
				</div>
				<div className="payment-methods">
					<p>Medios de pago:</p>
					<div className="shop-product-payment-container">
						{store.shop.payments && store.shop.payments.map((payment)=> <div>
							{payment.icon && <img src={payment.icon}/>}
							{!payment.icon && <span>{payment.name}</span>}
							</div>)}
					</div>
				</div>

			</div>
		</div>
		
		<div className="shop-view-product-description">
			<h3>Descripción</h3>
			<p>
			{product && product.description}
			</p>
		</div>
	</div>
	;
};

