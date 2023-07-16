import React from "react";
import { AuthContext } from '../contexts/AuthContext';

const ShopList = ({ shops }) => {
    const { user } = React.useContext(AuthContext);
    console.log(shops)
    return (
        <ul>
            <p>TEST</p>
            {shops.map(shop => (
                <li key={shop.id}>{shop.shopname}</li>
            ))}
        </ul>
    );
};

export default ShopList;