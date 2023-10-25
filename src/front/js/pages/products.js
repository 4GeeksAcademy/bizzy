import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/products.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductCard } from "../component/productCard";

export const Products = () => {
	const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [ catFilter, setCatFilter ] = useState();
  const [ subCatFilter, setSubCatFilter ] = useState();
  const [ nameFilter, setNameFilter ] = useState();
  const [ loading, setLoading ] = useState();
  const [ checklist, setChecklist ] = useState([]);

  var filteredByCategory =  catFilter? store.products.filter((item)=> item.category == catFilter) : store.products
  var filteredBySubCategory = subCatFilter? filteredByCategory.filter((item)=> item.subcategory == subCatFilter) : filteredByCategory
  var filteredByName = nameFilter? filteredBySubCategory.filter((item)=> item.name.toLowerCase().includes(nameFilter.toLowerCase()) ) : filteredBySubCategory

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

        <div className="table-header">
          <h2>Productos</h2>
          <button onClick={()=>navigate("/create-product")}>+ Crear producto</button>
        </div>
          <div className="filters">
            <div>
              <input placeholder="Producto" onChange={(e)=>setNameFilter(e.target.value)}/>
            </div>

            <div>
                <select required 
                onChange={(e)=> setCatFilter(e.target.value)}>
                  <option value="" disabled selected hidden>Categoria</option>
								  <option value="" >Todos los productos</option>
                  {store.categories.map((category)=> <option>{category.name}</option>)}
                </select>
            </div>

            {catFilter && <div>				
              <select required 
              onChange={(e)=> setSubCatFilter(e.target.value)}>
                <option value="" disabled selected hidden>Sub-categoria</option>
								<option value="" >Todos</option>
                {catFilter && store.categories.filter((cat)=> cat.name == catFilter)[0].subcategories
                .map((subcategory)=> <option>{subcategory.name}</option>)}
              </select>
            </div>}
          </div>

        <div className="products-container">
          {filteredByCategory && filteredByName.map((product)=>(
            <ProductCard name={product.name} image={product.image} price={product.unit_price}
            stock={product.quantity} />))}

          {!loading && filteredBySubCategory.length == 0 && <p>No HAY</p>}

          {loading && <div class="spinner"></div>}

        </div>
    </div>
    </>
	);
};
