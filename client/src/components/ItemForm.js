import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button } from '@mui/material';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  batchSize: Yup.number()
    .positive('Batch size must be a positive number')
    .required('Batch size is required'),
  rolloverPeriod: Yup.number()
    .positive('Rollover period must be a positive number')
    .nullable(true),
  images: Yup.array()
    .min(1, 'At least one image is required')
    .required('At least one image is required'),
});

const ItemForm = ({ onSubmit }) => {
    const initialValues = {
    batchSize: '',
    rolloverPeriod: '',
    images: [],
    };

    const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('batch_size', values.batchSize);
    formData.append('rollover_period', values.rolloverPeriod);

    values.images.forEach((image) => {
        formData.append('images', image);
    });

    onSubmit(formData);
    };

    return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
    >
        {({ setFieldValue, touched, errors }) => (
        <Form>
            <div>
            <Field
                as={TextField}
                type="number"
                name="batchSize"
                label="Batch Size"
                error={touched.batchSize && !!errors.batchSize}
                helperText={touched.batchSize && errors.batchSize}
            />
            </div>
            <div>
            <Field
                as={TextField}
                type="number"
                name="rolloverPeriod"
                label="Rollover Period (optional)"
                error={touched.rolloverPeriod && !!errors.rolloverPeriod}
                helperText={touched.rolloverPeriod && errors.rolloverPeriod}
            />
            </div>
            <div>
            <input
                type="file"
                name="images"
                multiple
                onChange={(event) => {
                const files = Array.from(event.target.files);
                setFieldValue('images', files);
                }}
            />
            <ErrorMessage name="images" component="div" />
            </div>
            <Button type="submit" variant="contained" color="primary">
            Submit
            </Button>
        </Form>
        )}
    </Formik>
    );
};

export default ItemForm;
