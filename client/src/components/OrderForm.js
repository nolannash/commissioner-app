import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory, useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    responses: Yup.array()
        .of(Yup.string().required('Response is required'))
        .min(1, 'At least one response is required'),
});

const OrderForm = () => {
    const { user, csrfToken, refreshUser } = useContext(AuthContext);
    const history = useHistory();
    const [item, setItem] = useState([]);
    const [formItems, setFormItems] = useState([]);
    const [formResponses, setFormResponses] = useState([]);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const { item_id } = useParams();

    useEffect(() => {
        const fetchFormItems = async () => {
            try {
                const resp = await fetch(`/api/v1/items/${item_id}/form_items`);
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
                const resp = await fetch(`/api/v1/items/${item_id}`);

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
        try {
            const formData = {
                seller_id: item.seller_id,
                user_id: user.id,
                item_id: item.id,
                form_responses: formResponses.map((response, index) => ({
                    form_item_id: formItems[index].id,
                    response: response,
                })),
            };
            const resp = await fetch('/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            if (resp.ok) {
                setAlertType('success');
                setAlertMessage('Order submitted successfully');
                history.push('/');
                refreshUser(user.id, 'users');
            } else {
                setAlertType('error');
                setAlertMessage('There was an issue submitting the order');
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage('An unexpected error occurred');
        }
    };

    return (
        <div>
            <h1>Please Answer The following Questions:</h1>
            <p>Write your answers in the box provided</p>
            {alertType && (
                <Alert severity={alertType} onClose={() => setAlertType(null)}>
                    {alertMessage}
                </Alert>
            )}
            <Formik
                initialValues={{ responses: formItems.length ? Array(formItems.length).fill('') : [''] }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleSubmit, errors }) => (
                    <Form onSubmit={handleSubmit}>
                        {formItems.length ? (
                            formItems.map((formItem, index) => (
                                <div key={formItem.id}>
                                    <p>{formItem.seller_question}</p>
                                    <Field
                                        as={TextField}
                                        name={`responses[${index}]`}
                                        value={values.responses[index]}
                                        onChange={(e) => {
                                            handleChange(e);
                                            const newResponses = [...values.responses];
                                            newResponses[index] = e.target.value;
                                            setFormResponses(newResponses);
                                        }}
                                        error={Boolean(errors.responses) && Boolean(errors.responses[index])}
                                        helperText={errors.responses && errors.responses[index] ? errors.responses[index] : ''}
                                    />
                                </div>
                            ))
                        ) : (
                            <div>
                                <p>Please leave a note for the seller:</p>
                                <Field
                                    as={TextField}
                                    name="responses[0]"
                                    value={values.responses[0]}
                                    onChange={(e) => {
                                        handleChange(e);
                                        const newResponses = [...values.responses];
                                        newResponses[0] = e.target.value;
                                        setFormResponses(newResponses);
                                    }}
                                    error={Boolean(errors.responses) && Boolean(errors.responses[0])}
                                    helperText={errors.responses && errors.responses[0] ? errors.responses[0] : ''}
                                />
                            </div>
                        )}
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default OrderForm;
