import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/products.css";
import { CreateProduct } from "../component/createProduct";
import { toast } from "react-toastify";

export const Products = () => {
  const [ createModal, setCreateModal ] = useState(false);
  const [ checklist, setChecklist ] = useState([]);
	const { store, actions } = useContext(Context);
  useEffect(() => {
    actions.getProducts()
  }, []);

  async function eliminateProduct(list){
    for (let id of list){
      let deleted = await actions.deleteProduct(id)
      if (deleted == false){
        toast.error("Ocurrio un error inesperado")
        return 
      }
    }
    setChecklist([])
  }
  
  function checkboxes(id){
    if( checklist.includes(id) ){
      let new_list = checklist.filter((list_id) => list_id != id)
      setChecklist(new_list)
    }
    else{
      setChecklist([...checklist, id])
    }
  }

	return (<>
      <div style={{margin: "50px 6vw"}}>
        <div className="table-header">
          <h2>Productos</h2>
          <button onClick={()=>setCreateModal(true)}>+ Crear producto</button>
        </div>
        <button 
        className="delete-button" 
        style={{visibility:checklist.length == 0 && "hidden"}}
        onClick={()=>eliminateProduct(checklist)}>
          Eliminar
        </button>
        <table>
          <thead>
        <tr>
          <th>
            <input type="checkbox" style={{visibility: "hidden"}}/>
          </th>
          <th>SKU</th>
          <th style={{width: "50px"}}>Image</th>
          <th>Category</th>
          <th>Product</th>
          <th>Cost</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Stock</th>
          <th>Gross</th>
          <th>Profit</th>
        </tr>
        </thead>
        <tbody>
        {store.products.map((product)=>(
          <tr key={product.id}>
            <td>
            <input type="checkbox" onChange={()=>checkboxes(product.id)}/>
              </td>
            <td>SKU</td>
            <td>
              <img src="https://i1.sndcdn.com/artworks-3Db66zd6zOXyYP9f-8VAOXg-t500x500.jpg"/>
            </td>
            <td>{product.category}</td>
            <td className="table-product">{product.name}</td>
            <td>${product.unit_cost}</td>
            <td>${product.unit_price}</td>
            <td>{product.quantity}</td>
            <td>{product.stock}</td>
            <td>gross</td>
            <td>profit</td>
        </tr>)
        )}
        <tr></tr>
        </tbody>
      </table>
    </div>
    { createModal && <CreateProduct click={()=>setCreateModal(false)}/>}
      </>
	);
};
