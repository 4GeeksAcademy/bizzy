import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useRef } from 'react';
import moment from "moment";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { defaults } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );
import { Line } from 'react-chartjs-2';

import "../../styles/selectProducts.css";
import "../../styles/productOverview.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";


export const ProductOverview = (select) => {
	const { store, actions } = useContext(Context);
  const background = useRef(null);
  const [ chartYear, setChartYear] = useState(Object.keys(select.prod.all_time).reverse()[0])
  const [ productHistory, setProductHistory ] = useState([])
  const [ loading, setLoading ] = useState();

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
        display: true,
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
        label: 'Productos vendidos',
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
        <div className="popup-header">
          <h2>...</h2>
          <AiOutlineCloseCircle className="popup-close" onClick={select.close} />
        </div>
        <span className="card-price">${select.prod.unit_price}</span>
        <div style={{display: "flex"}}>
          <img src={select.prod.image} />
          <div className="top-info">
            <div>

              <div className="top-info-sku">
                <label>SKU:</label>
                {select.prod.sku}
              </div>
              <div className="top-info-name">{select.prod.name}</div>
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
        
        <div>{select.prod.for_sale}</div>
        <label style={{marginTop:"5px"}}>DESCRIPCIÓN</label>
        <div className="product-info-description">{select.prod.description}</div>
        <select defaultValue={Object.keys(select.prod.all_time).reverse()[0]} onChange={(e)=> setChartYear(e.target.value)}>
          {select.prod.all_time && Object.keys(select.prod.all_time).reverse().map((year)=> <option>{year}</option>)}
        </select>
        {chartYear && <Line options={options} data={data}/>}
          
      </div>
    </div>
    </>
	);
};
