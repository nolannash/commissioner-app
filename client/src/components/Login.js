import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography } from '@mui/material';

export default function LoginPage () {
    const { login } = React.useContext(AuthContext);

    const handleLogin = async (values) => {
    try {
        const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        });

        if (response.ok) {
        const data = await response.json();
        login(data.access_token);
        } else {
        throw new Error('Login failed');
        }
    } catch (error) {
      // Handle login error
    }
    };

    const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
    });

    return (
    <div>
        <Typography variant="h4" component="h1" gutterBottom>
        Login Page
        </Typography>
        <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
    >
        {({ touched, errors }) => (
        <Form>
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
            <Button type="submit" variant="contained" color="primary">
                Login
            </Button>
            </Form>
        )}
        </Formik>
    </div>
    );
};