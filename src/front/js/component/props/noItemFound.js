import React from "react";
import "../../../styles/index.css";
import { RiEmotionSadLine } from "react-icons/ri";

export const NoItemFound = (notFound) => {
	return (
		<div className="no-items" >
            <RiEmotionSadLine className="no-items-icon"/>
            <p>{notFound.message}</p>
        </div>
	);
};
