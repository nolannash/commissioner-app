import React from "react";
import { AuthContext } from '../contexts/AuthContext';

const ItemList = ({ items }) => {
    const { user } = React.useContext(AuthContext);
    console.log(items)
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
};

export default ItemList;