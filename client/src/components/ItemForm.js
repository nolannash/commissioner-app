import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const validationSchema = Yup.object().shape({
  name: Yup.string()
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

const ItemForm = () => {
  const { user, csrfToken } = useContext(AuthContext);
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
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('batch_size', values.batchSize);
        formData.append('rollover_period', values.rolloverPeriod);
        values.images.forEach((image) => {
          formData.append('images', image);
        });

        const response = await fetch(`/sellers/${user.id}/items`, {
          method: 'POST',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          body: formData,
        });

        if (response.ok) {
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
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '45%' }}>
          <Typography variant="h4" gutterBottom>
            Item Info
            <Button variant='contained' onClick={() => history.push('/sellerPage')}><ArrowBackIcon />back</Button>
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ marginBottom: '16px' }}>
              <TextField
                type="text"
                name="name"
                label="Item Name"
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
                {...formik.getFieldProps('name')}
                fullWidth
              />
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
              <TextField
                type="text"
                name="description"
                label="Item Description"
                multiline
                rows={4}
                error={formik.touched.description && !!formik.errors.description}
                helperText={formik.touched.description && formik.errors.description}
                {...formik.getFieldProps('description')}
                fullWidth
              />
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
              <TextField
                type="number"
                name="price"
                label="Price"
                error={formik.touched.price && !!formik.errors.price}
                helperText={formik.touched.price && formik.errors.price}
                {...formik.getFieldProps('price')}
                fullWidth
              />
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
              <TextField
                type="number"
                name="batchSize"
                label="Batch Size"
                error={formik.touched.batchSize && !!formik.errors.batchSize}
                helperText={formik.touched.batchSize && formik.errors.batchSize}
                {...formik.getFieldProps('batchSize')}
                fullWidth
              />
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
              <TextField
                type="number"
                name="rolloverPeriod"
                label="Rollover Period (optional)"
                error={formik.touched.rolloverPeriod && !!formik.errors.rolloverPeriod}
                helperText={formik.touched.rolloverPeriod && formik.errors.rolloverPeriod}
                {...formik.getFieldProps('rolloverPeriod')}
                fullWidth
              />
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
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
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Post Item
            </Button>
          </form>
        </Box>

        <Box sx={{ width: '45%' }}>
          <Typography variant="h6" gutterBottom>
            Images
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {imagePreviews.map((preview, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              >
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  style={{ width: '100%', height: 'auto' }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 1,
                  }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ItemForm;