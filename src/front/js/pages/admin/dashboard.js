import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { OrderTableRow } from "../../component/admin/orders/orderTableRow";
import { OrderOverview } from "../../component/admin/orders/orderOverview";
import { NoItemFound } from "../../component/admin/props/noItemFound";
import { toast } from "react-toastify";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { defaults } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend );
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import moment from "moment";
import "../../../styles/dashboard.css";
import "../../../styles/orders.css";


export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const [ overviewed, setOverviewed ] = useState()
	const [ loading, setLoading ] = useState(true);
	const [ chartYear, setChartYear] = useState()
	const [ productHistory, setProductHistory ] = useState([])

	defaults.font.family = "'Poppins', sans-serif"
	const lineOptions = {
	  responsive: true,
  
	  plugins: {
		legend: {
		  display: false
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
			  return "$"+context[0].formattedValue
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
	
	const lineData = {
	  labels: moment.monthsShort(),
	  datasets: [
		{
		  label: 'Ingresos',
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

	const doughnutOptions = {
		responsive: true,
		plugins: {
			legend: {
			display: false,
			},
		title: {
			display: true,
			text: 'Ventas por categoria'
			}
		}
	}
	
	const doughnutData = {
	labels: store.info.categories? Object.keys(store.info.categories) : [] ,
	datasets: [
		{
		label: 'Vendidos',
		data:  store.info.categories? Object.values(store.info.categories) : [] ,
		backgroundColor: [
			'#F3EEEA','#739072','#F9B572','#D0BFFF','#D2E0FB','#8DDFCB','#DBC4F0', '#FFEEF4', '#ACB1D6',
			'#A7727D', '#FD8A8A'],
		},
	],
	};

	async function loadData(){
		const loadI = await actions.getInfo()
		const loadO = await actions.getOrders()
		if (loadI && loadO) setLoading(false)
		else {
			toast.error("Ocurrio un error al cargar la información", {autoClose: false})
		}		
	  }

	useEffect(() => {
		let allTime = []
		if (store.info.years){
			for (let month in store.info.years[`${chartYear}`]){
				let index = parseInt(month)-1
				allTime[index] = store.info.years[`${chartYear}`][month]["total"]
			  }
			  setProductHistory(allTime)
		}
	  }, [chartYear]);

	useEffect(() => {
	setChartYear(store.info.years? Object.keys(store.info.years).reverse()[0] : [])
	}, [store.info.years]);

	useEffect(() => {
		loadData()
		actions.changeTab("admin")
		actions.changeAdminNav(true)
	  }, []);

	return (<div style={{margin: "50px 6vw"}}>
			<div className="customers-header">
          		<h2>Overview</h2>
	  		</div>
			<div className="dashboard-top">
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>${store.info.data && store.info.data.income}</h2>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Clientes</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>{store.info.data && store.info.data.customers}</h2>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ordenes</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>{store.info.data && store.info.data.orders}</h2>
					</div>
				</div>

			</div>
			<div className="dashboard-middle">
				<div>
				{productHistory.length != 0 && <>
                <select defaultValue={store.info.years && Object.keys(store.info.years).reverse()[0]} onChange={(e)=> setChartYear(e.target.value)}>
                  {store.info.years && Object.keys(store.info.years).reverse().map((year)=> <option key={year}>{year}</option>)}
                </select>
                {chartYear && <Line options={lineOptions} data={lineData}/>}
              </>}
			  	{!loading && !chartYear && <NoItemFound message={"No info"}/> }
				</div>

				<div>
				{chartYear && <Doughnut options={doughnutOptions} data={doughnutData}/>}

				{!loading && !chartYear && <NoItemFound message={"No info"}/> }
				</div>
			</div>
			<div className="dashboard-bottom-header">Ordenes recientes</div>
			<div className="dashboard-bottom">
				<table>
					<thead>
						<tr>
						<th style={{paddingLeft: "25px"}} >Orden</th>
						<th>Fecha</th>
						<th>Cliente</th>
						<th>Productos</th>
						<th>Total</th>
						<th>Estado</th>
						<th>Pago</th>
						</tr>
					</thead>
					<tbody> 
						{store.orders.slice(0,4).map((order)=>(<OrderTableRow key={order.id} ord={order} infoSetter={setOverviewed}/>))}
						
					</tbody>
				</table>
				{!loading && store.orders.length == 0 && <NoItemFound message={"No se encontraron pedidos"}/> }
			</div>
		{overviewed && <OrderOverview ord={overviewed} close={()=>setOverviewed()}/>}
	</div>
	);
};
