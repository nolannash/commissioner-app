import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory, Link, useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    response: Yup.string()
    .max(250, 'Response must be at most 250 characters')
    .matches(/^[a-zA-Z0-9 ]*$/, 'No special characters allowed')
    .required('Response is required'),
});

const OrderForm = () => {
    const { user } = useContext(AuthContext);
    const history = useHistory();
    const [submitting, setSubmitting] = useState(false);
    const [item, setItem] = useState([]);
    const [formItems, setFormItems] = useState([]);
    const [formResponses, setFormResponses] = useState([]);
    const { item_id } = useParams();

    useEffect(() => {
    const fetchFormItems = async () => {
        try {
        const resp = await fetch(`/items/${item_id}/form_items`);
        if (resp.ok) {
            const data = await resp.json();
            console.log(data);
            setFormItems(data);
        } else {
            console.log('There was an issue');
        }
        } catch (error) {
        console.error(error.message);
        }
    };
    fetchFormItems();
    }, [item_id]);

    useEffect(() => {
    const fetchItem = async () => {
        try {
        const resp = await fetch(`/items/${item_id}`);

        if (resp.ok) {
            const data = await resp.json();
            setItem(data);
        } else {
            console.log('There was an issue');
        }
        } catch (error) {
        console.error(error.message);
        }
    };
    fetchItem();
    }, [item_id]);

    const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
        const formData = {
        seller_id: item.seller.id,
        user_id: user.id,
        item_id: item.id,
        form_responses: formResponses.map((response, index) => ({
            form_item_id: formItems[index].id,
            response: response,
        })),
        };
        const resp = await fetch('/your-backend-route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        });

        if (resp.ok) {
        // Handle successful submission, e.g., show a success message or redirect
        // to a thank-you page.
        } else {
        // Handle errors, e.g., show an error message.
        }
    } catch (error) {
      // Handle unexpected errors, e.g., show an error message.
    }
    setSubmitting(false);
    };

    return (
    <div>
        <h1>Complete Your Comission:</h1>
        <p>Write your answers in the boxes provided:</p>
        <Formik
        initialValues={{ responses: Array(formItems.length).fill('') }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        >
        {({ values, handleChange, handleSubmit, errors }) => (
            <Form>
            {formItems.map((formItem, index) => (
                <div key={formItem.id}>
                <p>{formItem.seller_question}</p>
                <Field
                    as={TextField}
                    name={`responses[${index}]`}
                    value={values.responses[index]}
                    onChange={(e) => {
                    handleChange(e);
                    const newResponses = [...formResponses];
                    newResponses[index] = e.target.value;
                    setFormResponses(newResponses);
                    }}
                    error={
                    Boolean(errors.responses) && Boolean(errors.responses[index])
                    }
                    helperText={
                    errors.responses && errors.responses[index]
                        ? errors.responses[index]
                        : ''
                    }
                />
                </div>
            ))}
            <Button
                type="submit"
                disabled={submitting}
                variant="contained"
                color="primary"
            >
                {submitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            </Form>
        )}
        </Formik>
    </div>
    );
};

export default OrderForm;
