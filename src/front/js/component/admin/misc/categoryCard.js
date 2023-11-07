import React, { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md"
import "../../../../styles/misc.css";

export const CategoryCard = (cat) => {
    const [ showSub, setShowSub ] = useState(false)

	return (<div className="misc-category-container">
                <div className="misc-category-box" onClick={()=>setShowSub(!showSub)}>
                    <div>
                        {cat.category.name}
                        <span>
                            {cat.category.products_quantity} productos
                        </span>
                    </div>
                    {cat.category.subcategories.length > 0 && <MdArrowForwardIos className="misc-dropdown-arrow"/>}
                </div>
                {showSub && cat.category.subcategories.map((subcat)=><div className="misc-subcategory-box">
                    <div>
                        {subcat.name}
                        <span>
                            {subcat.products_quantity} productos
                        </span>
                    </div>
                </div>)}
            </div>
	);
};
