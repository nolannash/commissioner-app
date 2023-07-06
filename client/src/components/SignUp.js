import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';

export default function SignUpPage (){
  const { signUp } = React.useContext(AuthContext);

  const handleSignUp = async (values, userType) => {
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
      console.error(error);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/^\S+$/, 'Password cannot contain spaces')
      .matches(/[A-Z]/, 'Password must have an uppercase letter')
      .matches(/[a-z]/, 'Password must have a lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least 1 number')
      .matches(/[^a-zA-Z0-9]/, 'Password must have at least one special character')
      .required('Please enter a password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    username: Yup.string()
      .min(2, 'Username cannot be less than 2 characters')
      .max(20, 'Username cannot be greater than 20 characters')
      .matches(/^[a-zA-Z0-9]*$/, 'Username must be only letters and numbers with no spaces')
      .required('Please enter a username between 2 and 20 characters'),
    shopname: Yup.string().when('userType', {
      is: 'seller',
      then: Yup.string()
        .min(2, 'Shop Name must be between 2 and 20 characters')
        .max(20, 'Shop Name must be between 2 and 20 characters')
        .matches(/^[a-zA-Z0-9]*$/, 'Shop Name must be only letters and numbers with no spaces')
        .required('A shop name between 2 and 20 characters is required'),
    }),
  });

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up Page
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="userType" name="userType">
          <FormControlLabel value="user" control={<Radio />} label="User" />
          <FormControlLabel value="seller" control={<Radio />} label="Seller" />
        </RadioGroup>
      </FormControl>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '', username: '', shopname: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSignUp(values, 'user')}
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
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};


