import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import { ShopProductCard } from "../../component/shop/shopProductCard";
import { FaTags } from "react-icons/fa6";
import "../../../styles/category.css";


export const Category = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [ category, setCategory ] = useState()
	const [ subcategory, setSubcategory ] = useState()
	const [ priceRange, setPriceRange ] = useState()
	const [ sortBy, setSortBy ] = useState()
	const params = useParams();

	let filtered =  category? store.shop.products.filter((pr)=> pr.category == category.name) : []
  	let filteredSubcat = subcategory? filtered.filter((item)=> item.subcategory == subcategory) : filtered
	let filteredPrice = priceRange? filtered.filter((item)=> item.unit_price >= priceRange[0] && item.unit_price <= priceRange[1]) : filteredSubcat
	let sortedProducts = sortBy? sortBy == "-price"?  filteredPrice.sort((a,b)=> a.unit_price - b.unit_price) 
	: filteredPrice.sort((a,b)=> a.unit_price - b.unit_price).reverse() : filteredPrice 
	


	useEffect(() => {
		actions.changeAdminNav(false)
		document.getElementById("content").scroll(0,0)
	}, []);

	useEffect(() => {
		if (store.shop.categories && store.shop.categories.length > 0){
			setCategory(store.shop.categories.filter((category)=> category.name == params.name )[0] )
		}
	}, [store.shop.categories]);


	useEffect(() => {
		if (store.shop.categories && store.shop.categories.length > 0){
		setCategory(store.shop.categories.filter((category)=> category.name == params.name )[0] )
		}
	}, [params.name]);

	useEffect(() => {
		setSubcategory(params.subcategory)
	}, [params.subcategory]);
	

	return <div className="shop-view-category">
		<div className="shop-view-category-banner">
			<img src={category && category.banner} />
		</div>

		<div className="shop-view-category-header">
			<div className="shop-view-category-header-perma-link">
				<span className="shop-view-category-header-abled" onClick={()=> navigate("/")}>
					Inicio
				</span>
				&nbsp;/&nbsp; 
				<span className={subcategory?"shop-view-category-header-abled": ""} onClick={()=> subcategory? navigate(`/category/${category.name}`): ""}>
					{category && category.name}
				</span>
				&nbsp;/&nbsp;
				<span>
					{subcategory}
				</span>
			</div>
			<div className="shop-view-category-title">
				<img src={category && category.icon}/>
				{!subcategory && <span>Suministros para {category && category.name}</span> }
				{subcategory && <span>{subcategory} para {category && category.name}</span> }
				
			</div>
		</div>

		<div style={{display:"flex", margin: "0 10%"}}>
			<div className="shop-view-category-filters">
				<div className="subcat-filter-title">Categorías</div>
				{category && category.subcategories.map((subcat)=> <div className={subcategory==subcat.name? "subcat-filter-option-disabled" : "subcat-filter-option" }
				key={subcat.name} onClick={()=> subcategory==subcat.name? "" : navigate(`/category/${category.name}/${subcat.name}`)}>
						{subcat.name}<span>({subcat.products_quantity})</span>
					</div>
				)}
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
					{sortedProducts.map( (product)=> <ShopProductCard 
					width={{width:"198px"}} prod={product} key={product.id}
					/>)}
				</div>
			</div>
			
		</div>
		
	</div>
	;
};

