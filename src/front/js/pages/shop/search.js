import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { ShopProductCard } from "../../component/shop/shopProductCard";
import { FaTags } from "react-icons/fa6";
import "../../../styles/category.css";


export const Search = () => {
	const { store, actions } = useContext(Context);
	const [ search, setSearch ] = useState() 
	const [ priceRange, setPriceRange ] = useState()
	const [ sortBy, setSortBy ] = useState()
	const params = useParams();

	let filtered = search? store.shop.products.filter((pr)=> pr.name.toLowerCase().includes(search.toLowerCase())) : []
	let filteredPrice = priceRange? filtered.filter((item)=> item.unit_price >= priceRange[0] && item.unit_price <= priceRange[1]) : filtered
	let sortedProducts = sortBy? sortBy == "-price"?  filteredPrice.sort((a,b)=> a.unit_price - b.unit_price) 
	: filteredPrice.sort((a,b)=> a.unit_price - b.unit_price).reverse() : filteredPrice 
	
	useEffect(() => {
		if (store.shop.products && store.shop.products.length > 0){
			setSearch(params.name)
		}
	}, [params.name]);

	useEffect(() => {
		if (store.shop.products && store.shop.products.length > 0){
			setSearch(params.name)
		}
	}, [store.shop.products]);

	return <div className="shop-view-category">
		<div className="shop-view-category-banner">
			<img src="https://cdn.discordapp.com/attachments/922352758512824351/1177042835741085766/Banner-Ropa.png?ex=65711190&is=655e9c90&hm=5606e7a292246cec7ade7d8ffbe5417f8f87dedd6dbd1aeed04083234d943d0e&"/>
		</div>

		<div className="shop-view-category-header">
			<div className="shop-view-category-title">
				<span style={{color: "#121212"}}>Búsqueda para "{search}"</span>
			</div>
		</div>

		<div style={{display:"flex", margin: "0 10%"}}>
			<div className="shop-view-category-filters">
				<div className="category-filter-divisor"/>
				<div className="category-filter-offer-tag"><FaTags /><span>En oferta</span></div>
				<div className="category-filter-divisor"/>
				<div className="price-filter-title">Precio</div>
				
				<div className="price-filter-option">
					<input name="price" type="radio" 
					defaultChecked onClick={()=>setPriceRange()}/> <span>Todos</span>
				</div>
				<div className="price-filter-option">
					<input name="price" type="radio"
					onClick={()=>setPriceRange([0,10])}/> <span>Menos de $10</span>
				</div>
				<div className="price-filter-option">
					<input name="price" type="radio"
					onClick={()=>setPriceRange([10,20])}/> <span>$10 a $20</span>
				</div>
				<div className="price-filter-option">
					<input name="price" type="radio"
					onClick={()=>setPriceRange([20,30])}/> <span>$20 a $30</span>
				</div>
				<div className="price-filter-option">
					<input name="price" type="radio"
					onClick={()=>setPriceRange([30,40])}/> <span>$30 a $40</span>
				</div>
				<div className="price-filter-option">
					<input name="price" type="radio"
					onClick={()=>setPriceRange([40,50])}/> <span>$40 a $50</span>
				</div>
				<div className="price-filter-option">
					<input name="price" type="radio"
					onClick={()=>setPriceRange([50, Infinity])}/> $50 o más
				</div>

			</div>
			<div className="shop-view-category-products">
				<div className="shop-view-category-products-header">
					<div>{sortedProducts.length} resultados</div>
					<div>
						<select onChange={(e)=>setSortBy(e.target.value)}>
							<option value="">Bestselling</option>
							<option value="-price">Menor Precio</option>
							<option value="+price">Mayor Precio</option>
						</select>
					</div>
				</div>
				<div className="shop-view-category-products-container">
					{sortedProducts.length > 0 && sortedProducts.map( (product)=> <ShopProductCard 
					width={{width:"200px"}} prod={product} key={product.id}
					/>)}
					{sortedProducts.length == 0 && <NoItemFound message={"No existen productos para esta busqueda"}/> }
				</div>
			</div>
			
		</div>
		
	</div>
	;
};

