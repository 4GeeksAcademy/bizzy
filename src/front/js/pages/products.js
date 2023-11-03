import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/products.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiEmotionSadLine } from "react-icons/ri";
import { ProductCard } from "../component/productCard";

export const Products = () => {
	const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [ catFilter, setCatFilter ] = useState();
  const [ subCatFilter, setSubCatFilter ] = useState();
  const [ nameFilter, setNameFilter ] = useState();
  const [ loading, setLoading ] = useState();

  let filteredByCategory =  catFilter? store.products.filter((item)=> item.category == catFilter) : store.products
  let filteredBySubCategory = subCatFilter? filteredByCategory.filter((item)=> item.subcategory == subCatFilter) : filteredByCategory
  let filteredByName = nameFilter? filteredBySubCategory.filter((item)=> item.name.toLowerCase().includes(nameFilter.toLowerCase()) || item.sku.toLowerCase().includes(nameFilter.toLowerCase())) : filteredBySubCategory

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
    actions.changeTab("products")
    actions.getCategories()
  }, []);

	return (<>
      <div style={{margin: "50px 6vw"}}>

        <div className="products-header">
          <h2>Productos</h2>
          <button onClick={()=>navigate("/create-product")}>+ Crear producto</button>
        </div>
          <div className="products-filters">
            <div className="filter-box">
              <input placeholder="Buscar producto por nombre o SKU" onChange={(e)=>setNameFilter(e.target.value)}/>
            </div>

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

        <div className="products-container">
          {filteredByCategory && filteredByName.map((product)=>(
            <ProductCard key={product.id} name={product.name} image={product.image} price={product.unit_price}
            stock={product.stock} />))}

          {!loading && filteredByName.length == 0 && <div className="no-items" >
            <RiEmotionSadLine className="no-items-icon"/>
            <p>No se encontraron productos</p>
            </div>}

          {loading && <div className="spinner"></div>}

        </div>
    </div>
    </>
	);
};
