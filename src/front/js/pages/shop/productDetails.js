import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";
import "../../../styles/category.css";
import "../../../styles/productDetails.css";
import { Cart } from "../../component/shop/cart";



export const ProductDetails = ()=> {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [ category, setCategory ] = useState()
	const [ subcategory, setSubcategory ] = useState()
	const [ cart, setCart ] = useState(false)
	const [ product, setProduct ] = useState()
	const [ item, setItem ] = useState({
		"product": {},
		"quantity": 1,
	})
	const params = useParams();

	function handleCart(){
		let inCart = store.cart.filter((p) => p.product.id == product.id )

		if (inCart.length == 0){
			actions.addToCart([...store.cart, {...item, "product": product}])
		}
		else{
			let newCart = store.cart
			newCart[newCart.indexOf(inCart[0])] = {"product": product, "quantity": item.quantity}
        	actions.addToCart(newCart)
		}
		setCart(true)
	}

	function handleOrder(){
		let inCart = store.cart.filter((p) => p.product.id == product.id )

		if (inCart.length == 0){
			actions.addToCart([...store.cart, {...item, "product": product}])
		}
		else{
			let newCart = store.cart
			newCart[newCart.indexOf(inCart[0])] = {"product": product, "quantity": item.quantity}
        	actions.addToCart(newCart)
		}
		navigate("/checkout")
	}

	useEffect(() => {
		actions.changeAdminNav(false)
		document.getElementById("content").scroll(0,0)
	}, []);

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

	return <>
	<div style={{margin: "3% 10% 0 10%"}}>

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
				<div className="price">${product && parseFloat(product.unit_price).toFixed(2)}</div>
				<div className="quantity">
					<select onChange={(e)=>setItem({...item, "quantity": parseInt(e.target.value)})}>
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
					<button className="add-to-cart" onClick={()=> product && handleCart() }>añadir al carrito</button>
					<button className="buy-now" onClick={()=> product && handleOrder()}>comprar ahora</button>
				</div>
				<div className="payment-methods">
					<p>Medios de pago:</p>
					<div className="shop-product-payment-container">
						{store.shop.payments && store.shop.payments.map((payment)=> <div key={payment.name}>
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
	{cart && <Cart useCart={setCart}/>}
	</>
};

