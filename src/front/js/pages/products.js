import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/products.css";

export const Products = () => {
	const { store, actions } = useContext(Context);

	return (<>
      <button>Create Product</button>
      <div style={{margin: "75px"}}>
        <table>
        <tr>
          <th>ID</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Stock</th>
          <th>Cost</th>
          <th>Gross</th>
          <th>Profit</th>
        </tr>
        <tr>
          <td>1</td>
          <td>PL-NGE01</td>
          <td>Plush</td>
          <td>Rei Chiquita</td>
          <td>$20</td>
          <td>100</td>
          <td>53</td>
          <td>500</td>
          <td>750</td>
          <td>250</td>
        </tr>
        <tr>
          <td>2</td>
          <td>PL-NAR01</td>
          <td>Plush</td>
          <td>Itachi</td>
          <td>$20</td>
          <td>50</td>
          <td>27</td>
          <td>500</td>
          <td>750</td>
          <td>250</td>
        </tr>
      </table>
    </div>
      </>
	);
};
