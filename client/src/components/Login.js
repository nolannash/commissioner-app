import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Alert } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();
  const [alertType, setAlertType] = useState(null); 
    const [alertMessage, setAlertMessage] = useState('');

    const determineUserType = () => {
    const { pathname } = location;

    if (pathname.includes('/signup/seller') || pathname.includes('/login/seller')) {
        return 'seller';
    } else if (pathname.includes('/signup/user') || pathname.includes('/login/user')) {
        return 'user';
    } else {
        return 'none';
    }
    };

    const handleLogin = async (values) => {
    try {
        await login(determineUserType(), values);
        setAlertType('success');
        setAlertMessage('Login successful!');
        determineUserType() === 'user' ? history.push('/') : history.push('/sellerPage');
    } catch (error) {
        console.error(error);
        setAlertType('error');
        setAlertMessage('Login failed. Please check your credentials and try again.');
    }
    };

    const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    });

    return (
    <div>
        <Typography variant="h4" component="h1" gutterBottom>
        Login
        </Typography>
        {alertType && (
        <Alert severity={alertType} onClose={() => setAlertType(null)}>
            {alertMessage}
        </Alert>
        )}
        <Formik
        initialValues={{
            email: '',
            password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
        >
        {({ touched, errors, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
            <div>
                <Field
                as={TextField}
                type="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
                />
                <ErrorMessage name="email" component="div" />
            </div>
            <div>
                <Field
                as={TextField}
                type="password"
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
                />
                <ErrorMessage name="password" component="div" />
            </div>
            <Button variant='outlined' onClick={()=>history.push('/landing')}>Back</Button>
            <Button variant="contained" type="submit">
                Login
            </Button>
            </Form>
        )}
        </Formik>
    </div>
    );
}