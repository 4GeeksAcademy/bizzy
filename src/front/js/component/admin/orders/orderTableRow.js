import React, { useState } from "react";
import moment from "moment";

import { GoDotFill } from "react-icons/go";
import "../../../../styles/orders.css";

export const OrderTableRow = (order) => {
    const calendarOptions = {
        sameDay: '[Hoy], h:mm A',
        nextDay: '[Mañana]',
        nextWeek: 'DD-MMM',
        lastDay: '[Ayer], h:mm A',
        lastWeek: 'DD-MMM',
        sameElse: 'DD-MMM'
    }

	return <>
        <tr onClick={()=> order.infoSetter(order.ord)}>
            <td className="table-order-id" style={{paddingLeft: "25px"}}>#{order.ord.id.toString().padStart(4, "0")}</td>
            <td className="table-order-date">{moment(order.ord.date, "YYYYMMDDhh:mm").calendar(calendarOptions).replace(".","")}</td>
            <td className="table-order-customer">{order.ord.customer.name}</td>
            <td className="table-order-quantity">{order.ord.total_quantity} productos</td>
            <td className="table-product">${order.ord.total_price}</td>
            <td className="table-order-status">
            <div className={order.ord.status=="Completada"? "table-status-green" : order.ord.status=="Pendiente"? "table-status-gray" : "table-status-red"}>
                <GoDotFill className="status-dot"/>{order.ord.status}
            </div>
            </td>
            <td style={{paddingRight: "5px"}}>
                <div className="table-order-payment">
                    {order.ord.payment.icon && <img src={order.ord.payment.icon}/>}
                    {!order.ord.payment.icon && <span>{order.ord.payment.name}</span>}
                </div>
            </td>
        </tr>
    </>
};
