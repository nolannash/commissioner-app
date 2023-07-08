import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

export default function LoginPage() {
    const { login, userType } = useContext(AuthContext);
    const history = useHistory()

    const handleLogin = async (values) => {
    try {
        await login(userType, values);
        history.push('/home');
    } catch (error) {
        console.error(error);
      // Handle the error, show an error message, or perform other actions
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
        <Formik
        initialValues={{
            email: '',
            password: '',
        }}
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
                <ErrorMessage name="email"component="div" />
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
}
