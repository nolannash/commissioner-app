import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory, Link } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    response: Yup.string()
        .max(250, 'Response must be at most 250 characters')
        .matches(/^[a-zA-Z0-9 ]*$/, 'No special characters allowed')
        .required('Response is required'),
});

const OrderForm = ({ item }) => {
    const { user } = useContext(AuthContext);
    const history = useHistory();
    const [submitting, setSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const handleSubmit = async (values, { setSubmitting, resetForm }, formItemId) => {
        setSubmitting(true);
        setSubmissionError(null);

        try {
            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item_id: item.id, user_response: values.response, user_id: user.id, seller_id: item.seller_id, form_item_id: formItemId }),
            });

            if (response.ok) {
                console.log('Order submitted successfully!');
                resetForm();
            } else {
                const data = await response.json();
                setSubmissionError(data.message || 'Error submitting order.');
            }
        } catch (error) {
            setSubmissionError('Error submitting order. Please try again later.');
            console.error('Error submitting order:', error);
        }

        setSubmitting(false);
    };

    return (
        <>
            {item && !item.form_items  ? (
                <Box mt={2}>
                    <Typography variant="h6" component="h2">
                        Please leave a note for the seller
                    </Typography>
                    <Formik
                        initialValues={{
                            response: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => handleSubmit(values, { setSubmitting, resetForm })}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form>
                                <Box mt={2}>
                                    <Field
                                        as={TextField}
                                        type="text"
                                        name="response"
                                        label="Response"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={touched.response && errors.response}
                                        helperText={touched.response && errors.response}
                                    />
                                    <ErrorMessage name="response" component="div" />
                                </Box>
                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button variant="contained" type="submit" disabled={isSubmitting}>
                                        {submitting ? <CircularProgress size={24} /> : 'Submit'}
                                    </Button>
                                    <Button variant="outlined" type="reset" disabled={isSubmitting}>
                                        Reset
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => history.push(`/userPage`)}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                                {submissionError && (
                                    <Box mt={2}>
                                        <Alert severity="error">{submissionError}</Alert>
                                    </Box>
                                )}
                            </Form>
                        )}
                    </Formik>
                </Box>
            ) : (
                item.form_items.map((formItem, index) => (
                    <Box key={index} mt={2}>
                        <Typography variant="h6" component="h2">
                            {formItem.seller_question}
                        </Typography>
                        <Formik
                            initialValues={{
                                response: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting, resetForm }) => handleSubmit(values, { setSubmitting, resetForm }, formItem.id)}
                        >
                            {({ touched, errors, isSubmitting }) => (
                                <Form>
                                    <Box mt={2}>
                                        <Field
                                            as={TextField}
                                            type="text"
                                            name="response"
                                            label="Response"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            error={touched.response && errors.response}
                                            helperText={touched.response && errors.response}
                                        />
                                        <ErrorMessage name="response" component="div" />
                                    </Box>
                                    <Box mt={2} display="flex" justifyContent="space-between">
                                        <Button variant="contained" type="submit" disabled={isSubmitting}>
                                            {submitting ? <CircularProgress size={24} /> : 'Submit'}
                                        </Button>
                                        <Button variant="outlined" type="reset" disabled={isSubmitting}>
                                            Reset
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => history.push(`/userPage`)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                    {submissionError && (
                                        <Box mt={2}>
                                            <Alert severity="error">{submissionError}</Alert>
                                        </Box>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </Box>
                ))
            )}
        </>
    );
};

export default OrderForm;
