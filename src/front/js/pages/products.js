import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/products.css";
import { CreateProduct } from "../component/createProduct";

export const Products = () => {
	const { store, actions } = useContext(Context);
  useEffect(() => {
    actions.getProducts()
  }, []);

	return (<>
      
      <div style={{margin: "50px 6vw"}}>
        <div className="table-header">
          <h2>Productos</h2>
          <button>+ Crear producto</button>
        </div>
      
        <table>
          <thead>
        <tr>
          <th><input type="radio"/></th>
          <th>SKU</th>
          <th style={{width: "50px"}}>Image</th>
          <th>Category</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Stock</th>
          <th>Cost</th>
          <th>Gross</th>
          <th>Profit</th>
        </tr>
        </thead>
        <tbody>
        {store.products.map((product)=><>
          <tr>
          <td><input type="radio"/></td>
          <td>SKU</td>
          <td><img src="https://i1.sndcdn.com/artworks-3Db66zd6zOXyYP9f-8VAOXg-t500x500.jpg"/></td>
          <td>{product.category}</td>
          <td className="table-product">{product.name}</td>
          <td>${product.price}</td>
          <td>{product.quantity}</td>
          <td>{product.stock}</td>
          <td>cost</td>
          <td>gross</td>
          <td>profit</td>
        </tr>
        </>)}
        <tr></tr>
        </tbody>
      </table>
    </div>
    <CreateProduct/>
      </>
	);
};
