import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/products.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductCard } from "../component/productCard";

export const Products = () => {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState();
  const [ checklist, setChecklist ] = useState([]);
	const { store, actions } = useContext(Context);

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
        <div className="products-container">
          {store.products.map((product)=>(
            <ProductCard name={product.name} image={product.image} price={product.unit_price}
            stock={product.quantity} />)
          )}
          {loading && <div class="spinner"></div>}
        </div>
    </div>
    </>
	);
};
