import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { LuDog } from "react-icons/lu";
import { ShopProductCard } from "../../component/shop/shopProductCard";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import "../../../styles/home.css";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [ categoryView, setCategoryView ] = useState( "" )
	const [ subcategoryList, setSubcategoryList ] = useState( [] )

	const homeBreakpoints = {
		0: {
			slidesPerView: 2,
			spaceBetween: 15,
			},
		550: {
			slidesPerView: 3,
			spaceBetween: 15,
			},
		880: {
			slidesPerView: 4,
			spaceBetween: 15,
			},
		1200: {
			slidesPerView: 5,
			spaceBetween: 15,
		},
		1400: {
			slidesPerView: 6,
			spaceBetween: 15,
		},
		1700: {
			slidesPerView: 7,
			spaceBetween: 15,
		},
	}
	
	useEffect(() => {
		actions.changeTab("home")
		actions.changeAdminNav(false)
	  }, []);

	useEffect(() => {
		if (store.shop.categories && store.shop.categories.length > 0){
			setCategoryView(store.shop.categories[0].name)
		}
	}, [store.shop.categories]);

	useEffect(() => {
		if (categoryView && store.shop.categories && store.shop.categories.length > 0){
			setSubcategoryList( store.shop.categories.filter((category)=> category.name == categoryView )
			[0].subcategories.sort((a,b)=> b.products_quantity - a.products_quantity ) )
		}
	}, [categoryView]);

	return (<>
			<div className="home-container">
				<img className="home-top-banner" src="https://cdn.discordapp.com/attachments/922352758512824351/1177042835363614781/Banner-Consiente.png?ex=65711190&is=655e9c90&hm=57f09bb4eef430b01844255124d65afa6ba74e6e973c4580ef5088ee2ea9b711&"/>
				<div className="home-categories-title">Compra por <span className="title-effect"><span>Especie</span></span></div>

				<div className="home-categories">
					{store.shop.categories && store.shop.categories.map( (category)=> (
						<div className={categoryView == category.name?"home-category-container selected-category-container" : "home-category-container"} 
						key={category.name} onClick={()=>setCategoryView(category.name)} >
								<img src={category.icon}/>
								<span>{category.name}</span>
						</div>
						)
					)}
				</div>

				<div className="home-line-separator"/>

				<div className="home-subcategory-cards-container">
					<Swiper slidesPerView={1} spaceBetween={15} freeMode={true} pagination={{dynamicBullets: true}}
					modules={[FreeMode, Pagination]} breakpoints={homeBreakpoints}>
						{ subcategoryList.length > 0 && subcategoryList.map( (subcategory)=> <SwiperSlide key={subcategory.name}>
								<div className="home-subcategory-card" onClick={()=>navigate(`/category/${subcategory.category}/${subcategory.name}`)}>
									<img src={subcategory.image}/>
								</div>
								<span>{subcategory.name}</span>
							</SwiperSlide>
						)}
					</Swiper>
				</div>

				<span className="home-subtitle">Ofertas</span>
				<div className="home-products-cards-container">
					<Swiper slidesPerView={1} spaceBetween={15} freeMode={true} pagination={{dynamicBullets: true,}}
					modules={[FreeMode, Pagination]} breakpoints={homeBreakpoints}>
						{store.shop.products && store.shop.products.map( (product)=> <SwiperSlide key={product.name}>
								<ShopProductCard prod={product} />
							</SwiperSlide>
						)}
					</Swiper>
				</div>

				<img className="home-mid-banner" style={{borderRadius: "10px", marginBottom: "65px"}}
				src="https://cdn.discordapp.com/attachments/922352758512824351/1177042835741085766/Banner-Ropa.png?ex=65711190&is=655e9c90&hm=5606e7a292246cec7ade7d8ffbe5417f8f87dedd6dbd1aeed04083234d943d0e&"/>

				<span className="home-subtitle">Esenciales</span>
				<div className="home-products-cards-container">
					<Swiper slidesPerView={1} spaceBetween={15} freeMode={true} pagination={{dynamicBullets: true,}}
					modules={[FreeMode, Pagination]} breakpoints={homeBreakpoints}>
						{store.shop.products && store.shop.products.reverse().map( (product)=> <SwiperSlide key={product.name}>
								<ShopProductCard prod={product} />
							</SwiperSlide>
						)}
					</Swiper>
				</div>
			
			</div>
	</>
	);
};
