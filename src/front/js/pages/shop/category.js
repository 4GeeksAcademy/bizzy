import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";
import { ShopProductCard } from "../../component/shop/shopProductCard";


export const Category = () => {
	const { store, actions } = useContext(Context);
	const [ category, setCategory ] = useState()
	const params = useParams();
    // We eventually will use params.subcategory to preapply filters on subcategories
	useEffect(() => {
		if (store.shop.categories && store.shop.categories.length > 0){
			setCategory(store.shop.categories.filter((category)=> category.name == params.name )[0] )
		}
	}, [store.shop.categories]);

	return <>
		{category && <div>
			<div onClick={()=> console.log(store.shop.products.filter((pr)=> pr.category == category.name))}>{category.name}</div>
            <div style={{display:"flex", flexWrap: "wrap", gap: "12px"}}>
                {store.shop.products && store.shop.products.filter((pr)=> pr.category == category.name).map( (product)=> <ShopProductCard 
				width={{width:"175px"}} prod={product} key={product.id}
				/>)}
            </div>
			
		</div>
		}
	</>
	;
};

