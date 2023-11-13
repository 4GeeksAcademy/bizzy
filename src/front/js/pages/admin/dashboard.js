import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { MdTrendingUp } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { defaults } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend );
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import moment from "moment";
import "../../../styles/dashboard.css";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [ chartYear, setChartYear] = useState()
	const [ productHistory, setProductHistory ] = useState([])

	defaults.font.family = "'Poppins', sans-serif"
	const lineOptions = {
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
		actions.changeTab("admin")
		actions.changeAdminNav(true)
		actions.getInfo()
	  }, []);

	//REDIRECT TO LOGIN IF NOT LOGGED AS ADMIN
	useEffect(() => {
		if(!localStorage.getItem("token") || store.user.id && !store.user.admin) console.log("rechazado")
	}, [store.user]);

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
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
					</div>
				</div>
				<div className="modulito">
					<span className="modulito-top">
						<p>Ventas totales</p>
						<AiFillHeart/>
					</span>
					
					<div className="modulito-bot">	
						<h2>$1000</h2>
						<span>+5.66 %<MdTrendingUp/></span>
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
				</div>
				<div>
				{chartYear && <Doughnut options={doughnutOptions} data={doughnutData}/>}
				</div>
			</div>
			<div className="dashboard-bottom">

			</div>
	</div>
	);
};
