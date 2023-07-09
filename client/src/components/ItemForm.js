import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import { TextField, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string()
    .matches(/^[A-Za-z0-9-]+$/, 'Invalid item name')
    .max(100, 'Item name must be at most 100 characters')
    .required('Item name is required'),
    description: Yup.string()
    .max(1000, 'Item description must be at most 1000 characters')
    .required('Item description is required'),
    price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be a positive number')
    .test('decimal-places', 'Price must have up to 2 decimal places', (value) => {
        if (!value) return true;
        return /^(\d+(\.\d{1,2})?)?$/.test(value.toString());
    })
    .required('Price is required'),
    images: Yup.array()
    .min(1, 'At least one image is required')
    .required('At least one image is required')
    .test('file-type', 'Invalid file type', (value) => {
        if (!value) return true;
        const allowedExtensions = ['jpeg', 'jpg', 'pdf'];
        for (let i = 0; i < value.length; i++) {
        const extension = value[i].name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            return false;
        }
        }
        return true;
    }),
});

const ItemForm = ({ onSubmit }) => {
    const { user } = useContext(AuthContext);
    const history = useHistory();
    const initialValues = {
    name: '',
    description: '',
    price: '',
    batchSize: '',
    rolloverPeriod: '',
    images: [],
    };

    const [imagePreviews, setImagePreviews] = useState([]);

    const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
        try {
        const formData = new FormData();
        formData.append('batch_size', values.batchSize);
        formData.append('rollover_period', values.rolloverPeriod);
        formData.append('description', values.description);
        formData.append('name', values.name);

        values.images.forEach((image) => {
            formData.append('images', image);
        });

        formData.append('seller_id', user.id);

        const response = await fetch(`/sellers/${user.id}/items`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            history.push('/sellerPage');
        } else {
            console.error('Form submission failed:', response.status, response.statusText);
        }
        } catch (error) {
        console.error('An error occurred:', error);
        }
    },
    });

    const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue('images', files);

    const previews = [];
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
        previews.push(reader.result);
        setImagePreviews([...previews]);
        };
        reader.readAsDataURL(file);
    });
    };

    const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue('images', updatedImages);
    };

    return (
    <form onSubmit={formik.handleSubmit}>
        <div className="item-form-group">
        <TextField
            type="text"
            name="name"
            label="Item Name"
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            {...formik.getFieldProps('name')}
        />
        </div>
        <div className="item-form-group">
        <TextField
            type="text"
            name="description"
            label="Item Description"
            multiline
            rows={4}
            error={formik.touched.description && !!formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
            {...formik.getFieldProps('description')}
        />
        </div>
        <div className="item-form-group">
        <TextField
            type="number"
            name="price"
            label="Price"
            error={formik.touched.price && !!formik.errors.price}
            helperText={formik.touched.price && formik.errors.price}
            {...formik.getFieldProps('price')}
        />
        </div>
        <div className="item-form-group">
        <TextField
            type="number"
            name="batchSize"
            label="Batch Size"
            error={formik.touched.batchSize && !!formik.errors.batchSize}
            helperText={formik.touched.batchSize && formik.errors.batchSize}
            {...formik.getFieldProps('batchSize')}
        />
        </div>
        <div className="item-form-group">
        <TextField
            type="number"
            name="rolloverPeriod"
            label="Rollover Period (optional)"
            error={formik.touched.rolloverPeriod && !!formik.errors.rolloverPeriod}
            helperText={formik.touched.rolloverPeriod && formik.errors.rolloverPeriod}
            {...formik.getFieldProps('rolloverPeriod')}
        />
        </div>
        <div className="item-form-group">
        <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg, image/jpg, application/pdf"
            onChange={handleImageChange}
        />
        {formik.touched.images && formik.errors.images && (
            <div>{formik.errors.images}</div>
        )}
        </div>
        <div className="image-preview-container">
        {imagePreviews.map((preview, index) => (
            <div className="image-preview-item" key={index}>
            <img src={preview} alt={`Preview ${index}`} className="preview-image" />
            <button
                type="button"
                className="remove-image-button"
                onClick={() => handleRemoveImage(index)}
            >
                X
            </button>
            </div>
        ))}
        </div>
        <Button type="submit" variant="contained" color="primary">
        Submit
        </Button>
    </form>
    );
};

export default ItemForm;
