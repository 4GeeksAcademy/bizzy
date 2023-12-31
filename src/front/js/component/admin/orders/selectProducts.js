import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";
import { useRef } from 'react';

import { toast } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { NoItemFound } from "../props/noItemFound";
import { Spinner } from "../props/spinner";
import { SelectProductsCard } from "../orders/selectProductsCard";
import "../../../../styles/selectProducts.css";

export const SelectProducts = (select) => {
	const { store, actions } = useContext(Context);
  const background = useRef(null);

  const [ catFilter, setCatFilter ] = useState();
  const [ subCatFilter, setSubCatFilter ] = useState();
  const [ nameFilter, setNameFilter ] = useState();
  const [ loading, setLoading ] = useState();
  const [ productList, setProductList] = useState(store.selectedProducts)

  let filteredByCategory =  catFilter? store.products.filter((item)=> item.category == catFilter) : store.products
  let filteredBySubCategory = subCatFilter? filteredByCategory.filter((item)=> item.subcategory == subCatFilter) : filteredByCategory
  let filteredByName = nameFilter? filteredBySubCategory.filter((item)=> item.name.toLowerCase().includes(nameFilter.toLowerCase()) || item.sku.toLowerCase().includes(nameFilter.toLowerCase())) : filteredBySubCategory

  let productCount = countProducts()

  function countProducts(){
    let count = 0
    for(let product of productList){
      count += product.quantity
    }
    return count
  }

  function storeProducts(){
    actions.addSelectedProducts(productList)
    background.current.click()
  }

  function handleCategoryFilter(e){
    setCatFilter(e.target.value)
    setSubCatFilter("")
  }

  async function loadProducts(){
    const load = await actions.getProducts()
    if (load) setLoading(false)
    else toast.error("Ocurrio un error al cargar los productos", {autoClose: false})
  }

  useEffect(() => {
    if(store.products.length == 0)setLoading(true)

    loadProducts()
    actions.getCategories()
  }, []);



	return (<>
    <div ref={background} className="background" onClick={select.close}/> 
    <div className="popup-body">
      <div className="select-products-container">
        <div className="popup-header">
          <h2> Agregar productos </h2>
          <AiOutlineCloseCircle className="popup-close" onClick={select.close} />
        </div>

          <div className="filters-select-products">
            <div className="filter-box">
              <input placeholder="Buscar producto por nombre o SKU" onChange={(e)=>setNameFilter(e.target.value)}/>
            </div>

            <div className="select-products-categories">
              <div className="filter-box">
                  <select required defaultValue=""
                  onChange={(e)=> handleCategoryFilter(e)}>
                    <option value="" disabled hidden>Categoria</option>
                    <option value="" >Todos</option>
                    {store.categories.map((category)=> <option key={category.id}>{category.name}</option>)}
                  </select>
              </div>
              {catFilter && <div className="filter-box">				
                <select className="subcat-filter" required defaultValue=""
                onChange={(e)=> setSubCatFilter(e.target.value)}>
                  <option value="" disabled hidden>Sub-categoria</option>
                  <option value="" >Todos</option>
                  {catFilter && store.categories.filter((cat)=> cat.name == catFilter)[0].subcategories
                  .map((subcategory)=> <option key={subcategory.id}>{subcategory.name}</option>)}
                </select>
              </div>}
            </div>
          </div>

        <div className="products-container">
          {filteredByCategory && filteredByName.sort((x, y) => Number(y.for_sale) - Number(x.for_sale)).map((product)=>(
            <SelectProductsCard key={product.id} product={product} i
            set={setProductList} plist={productList} />))}
							{!loading && filteredByName.length == 0 && <NoItemFound message={"No se encontraron productos"}/> }
							{loading && <Spinner/>}
        </div>
          <div className="add-selected-products">
            <button onClick={()=>storeProducts()}>Agregar({productCount})</button>
          </div>
      </div>
    </div>
    </>
	);
};
