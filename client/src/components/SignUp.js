import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';

function SignUpPage () {
    const { signUp } = React.useContext(AuthContext);
    const [userType, setUserType] = React.useState('user');

    const handleSignUp = async (values) => {
    try {
        const response = await fetch(`/signup/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        });

        if (response.ok) {
        const data = await response.json();
        signUp(data);
        } else {
        throw new Error('Sign up failed');
        }
    } catch (error) {
      // Handle sign up error
    }
    };

    const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    username: Yup.string()
        .required('Username is required'),
    shopname: Yup.string()
        .when('userType', {
        is: 'seller',
        then: Yup.string().required('Shop Name is required'),
        }),
    });

    return (
    <div>
        <Typography variant="h4" component="h1" gutterBottom>
        Sign Up Page
        </Typography>
        <FormControl component="fieldset">
        <RadioGroup
            row
            aria-label="userType"
            name="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
        >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="seller" control={<Radio />} label="Seller" />
        </RadioGroup>
        </FormControl>
        <Formik
        initialValues={{ email: '', password: '', confirmPassword: '', username: '', shopname: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
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
            <div>
                <Field
                as={TextField}
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                error={touched.confirmPassword && errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
            />
            <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <div>
                <Field
                as={TextField}
                type="text"
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                error={touched.username && errors.username}
                helperText={touched.username && errors.username}
            />
            <ErrorMessage name="username" component="div" />
            </div>
            {userType === 'seller' && (
                <div>
                <Field
                    as={TextField}
                    type="text"
                    name="shopname"
                    label="Shop Name"
                    variant="outlined"
                    fullWidth
                    error={touched.shopname && errors.shopname}
                    helperText={touched.shopname && errors.shopname}
                />
                <ErrorMessage name="shopname" component="div" />
                </div>
            )}
            <Button type="submit" variant="contained" color="primary">
                Sign Up
            </Button>
            </Form>
        )}
        </Formik>
    </div>
    );
};

export default SignUpPage;
