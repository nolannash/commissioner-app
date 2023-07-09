import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ItemForm = () => {
    const { user } = useContext(AuthContext);
    const [itemData, setItemData] = useState({
    // Initialize item form data here
    // For example:
    title: '',
    price: '',
    description: '',
    });

    const handleInputChange = (e) => {
    setItemData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
    }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`/sellers/${user.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
        });

        if (response.ok) {
        // Item created successfully
        // Redirect or perform any other actions
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error(error);
      // Handle error
    }
    };

    return (
    <div>
        <h2>New Item Form</h2>
        <form onSubmit={handleSubmit}>
        <label>
            Title:
            <input
            type="text"
            name="title"
            value={itemData.title}
            onChange={handleInputChange}
            />
        </label>
        <br />
        <label>
            Price:
            <input
            type="number"
            name="price"
            value={itemData.price}
            onChange={handleInputChange}
            />
        </label>
        <br />
        <label>
            Description:
            <textarea
            name="description"
            value={itemData.description}
            onChange={handleInputChange}
            ></textarea>
        </label>
        <br />
        <button type="submit">Create Item</button>
        </form>
    </div>
    );
};

export default ItemForm;