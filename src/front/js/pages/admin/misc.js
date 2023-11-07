import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { CategoryCard } from "../component/categoryCard";
import "../../../styles/misc.css";


export const Misc = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.changeTab("misc")
	  }, []);

	return (<div style={{margin: "50px 6vw"}}>
			<div className="customers-header">
          		<h2>Misc.</h2>
	  		</div>
            { store.categories.map((category)=><CategoryCard key={category.id} category={category}/>)}

		</div>
	);
};
