import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";
import { useRef } from 'react';
import moment from "moment";

import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { defaults } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );
import { Line } from 'react-chartjs-2';

import { EditProduct } from "../products/editProduct";
import { NoItemFound } from "../props/noItemFound";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import "../../../../styles/selectProducts.css";
import "../../../../styles/productOverview.css";


export const ProductOverview = (select) => {
	const { store, actions } = useContext(Context);
  const background = useRef(null);
  const [ chartYear, setChartYear] = useState(Object.keys(select.prod.all_time).reverse()[0])
  const [ productHistory, setProductHistory ] = useState([])
  const [ editView, setEditView ] = useState(false);
  const [ confirmDelete, setConfirmDelete] = useState(false)
  const [ loading, setLoading ] = useState();

  async function handleDelete (){
    if (select.prod.sold){
			toast.warning("No es posible eliminar un producto con ordenes existentes",{
				position: "bottom-center"
			})
            background.current.click()
			return
		}

    let info = await actions.deleteProduct(select.prod.id)
    if(info){
			toast.success("Producto eliminado!",{
				position: "bottom-center"
			})
            background.current.click()
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
  }

  useEffect(() => {
    if(store.products.length == 0)setLoading(true)

  }, []);

  useEffect(() => {
    let allTime = []
    for (let month in select.prod.all_time[`${chartYear}`]){
      let index = parseInt(month)-1
      allTime[index] = select.prod.all_time[`${chartYear}`][month]["quantity"]
    }
    setProductHistory(allTime)

  }, [chartYear]);

  defaults.font.family = "'Poppins', sans-serif"
  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'top',
      },

      title: {
        display: false,
        text: 'Historico de ventas',
      },
      tooltip:{
        titleMarginBottom: 0,
        padding: {
          left: 13,
          right: 13,
          top: 8,
          bottom: 5,
        },
        titleFont:{
          size:16
        },
        boxWidth: 50,
        backgroundColor: "#2E2153",
        cornerRadius: 15,
        callbacks:{
          title: function(context){
            return context[0].formattedValue
          },
          label: function(context){
            return ""
          }
        }
      }
    },

    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          tickBorderDash: [6, 10],
        },
        border: {
          dash: [6, 10]
        }
      },
    }
  }
  
  const labels = moment.monthsShort();
  
   const data = {
    labels,
    datasets: [
      {
        label: 'Unidades vendidas',
        data:  productHistory,
        borderColor: '#7B57DF',
        backgroundColor: '#5634b3',
        tension: 0.4,
        borderWidth: 2.5,
        spanGaps: true,
        pointRadius: 8,
        pointBackgroundColor: "rgba(0,0,0,0)",
        pointBorderColor: "rgba(0,0,0,0)"
      },
    ],
  };


	return (<>
      <div ref={background} className="background" onClick={select.close}/> 
      <div className="popup-body">
        <div className="product-overview-container">
          { !editView && <>
            <div className="popup-header" style={{margin: 0}}>
              <AiOutlineCloseCircle className="popup-close" onClick={select.close} style={{margin: 0, marginRight: "auto"}} />
              <div className="product-overview-top-icons">
                <BiSolidTrashAlt className="product-overview-delete" onClick={()=> setConfirmDelete(true)}/>
                <BiSolidPencil className="product-overview-edit" onClick={()=>setEditView(true)}/>
              </div>
            </div>
            <span className="card-price">${parseFloat(select.prod.unit_price).toFixed(2)}</span>
            <div style={{display: "flex"}}>
              <img src={select.prod.image} />
              <div className="top-info">
                <div>

                  <div className="top-info-sku">
                    <label>SKU:</label>
                    {select.prod.sku}
                  </div>
                  <div className="top-info-name">{select.prod.name}</div>
                <div className="top-info-for-sale">{select.prod.for_sale? "Disponible" : "No Disponible"}</div>
                </div>

                <div className="top-info-stock">
                  <div>
                    <label>STOCK</label>
                    <div>{select.prod.stock}</div>
                  </div>
                  <div>
                    <label>VENDIDOS</label>
                    <div>{select.prod.sold}</div>
                  </div>
                </div>

              </div>
            </div>
            <div className="product-info-categories">
              <div>{select.prod.category}</div>
              <div>{select.prod.subcategory}</div>
            </div>
            
            <label style={{marginTop:"5px"}}>DESCRIPCIÓN</label>
            <div className="product-info-description">{select.prod.description}</div>
            <div className="product-info-all-time">
                <label style={{marginTop:"5px"}}>HISTORICO DE VENTAS</label>
              {productHistory.length != 0 && <>
                <select defaultValue={Object.keys(select.prod.all_time).reverse()[0]} onChange={(e)=> setChartYear(e.target.value)}>
                  {select.prod.all_time && Object.keys(select.prod.all_time).reverse().map((year)=> <option key={year}>{year}</option>)}
                </select>
                {chartYear && <Line options={options} data={data}/>}
              </>}
              {productHistory.length == 0 && <NoItemFound message={"No existen ventas para este producto"}/>}
            </div>
          </>}
          
          {editView && <EditProduct prod={select.prod} close={()=>setEditView(false)}/> }
        </div>
          {confirmDelete && <>
            <div className="product-overview-delete-popup">
              <div>
                <p>¿Estás seguro?</p>
                <span>Una vez eliminado, no podrás recuperarlo</span>
              </div>
              <div className="product-overview-delete-popup-buttons">
                <button className="accept-delete" onClick={()=> handleDelete()}>Eliminar</button>
                <button className="cancel-delete" onClick={()=>setConfirmDelete(false)}>Cancel</button>
              </div>
            </div>
            <div className="product-overview-delete-popup-background" onClick={()=>setConfirmDelete(false)}/>
          </>}
      </div>
    </>
	);
};
