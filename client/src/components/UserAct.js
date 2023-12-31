import React, { useState, useContext, useEffect } from 'react';
import {
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    Avatar,
    Switch,
    FormControlLabel,
    Popover,
    IconButton,
    TextField,
    Alert,
} from '@mui/material';
import { DeleteSharp, Person, AddPhotoAlternate } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    username: Yup.string()
        .min(2, 'Username must be between 2 and 20 characters')
        .max(20, 'Username must be between 2 and 20 characters')
        .matches(/^[a-zA-Z0-9]*$/, 'Username must be only letters and numbers with no spaces')
        .required('A username between 2 and 20 characters is required'),
});

const UserAccountInfo = () => {
    const history = useHistory();
    const { user, logout, csrfToken, refreshUser } = useContext(AuthContext);
    const [emailNotifications, setEmailNotifications] = useState(user.email_notifications);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setEmailNotifications(user.email_notifications);
    }, [user.email_notifications]);

    const handleEmailNotificationsChange = async (event) => {
        const checked = event.target.checked;
        setEmailNotifications(checked);

        try {
            const response = await fetch(`/api/v1/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ email_notifications: checked }),
            });

            if (!response.ok) {
                throw new Error('Failed to update email notifications');
            }

            setAlertType('success');
            setAlertMessage('Email notifications updated successfully!');
        } catch (error) {
            console.error('Email Notifications Error:', error);
            setAlertType('error');
            setAlertMessage('Failed to update email notifications. Please try again.');
        }
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
    };

    const handleConfirmToggleNotifications = async (confirm) => {
        if (confirm) {
            setEmailNotifications(false);
            setAlertType('success');
            setAlertMessage('Email notifications disabled successfully!');
        }
        setPopoverAnchorEl(null);
    };

    const handleProfilePhotoChange = (event) => {
        const file = event.target.files[0];
        setProfilePhoto(file);
    };

    const handleUploadProfilePhoto = async () => {
        if (profilePhoto) {
            const formData = new FormData();
            formData.append('userId', user.id);
            formData.append('profilePhoto', profilePhoto);

            try {
                const response = await fetch(`/api/v1/users/${user.id}/profile-photo`, {
                    method: 'PATCH',
                    headers: {
                        'X-CSRF-Token': csrfToken,
                    },
                    body: formData,
                });

                if (response.ok) {
                    console.log('Profile photo uploaded successfully');
                    refreshUser(user.id, 'users');
                    setAlertType('success');
                    setAlertMessage('Profile photo uploaded successfully!');
                } else {
                    console.error('Failed to upload profile photo');
                    setAlertType('error');
                    setAlertMessage('Failed to upload profile photo. Please try again.');
                }
            } catch (error) {
                console.error('Upload Profile Photo Error:', error);
                setAlertType('error');
                setAlertMessage('Failed to upload profile photo. Please try again.');
            }
        }
    };

    const handleDeleteProfilePhoto = async () => {
        try {
            const response = await fetch(`/api/v1/users/${user.id}/profile_photo`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
            });

            if (response.ok) {
                console.log('Profile photo deleted successfully');
                refreshUser(user.id, 'users');
                setAlertType('success');
                setAlertMessage('Profile photo deleted successfully!');
            } else {
                console.error('Failed to delete profile photo');
                setAlertType('error');
                setAlertMessage('Failed to delete profile photo. Please try again.');
            }
        } catch (error) {
            console.error('Delete Profile Photo Error:', error);
            setAlertType('error');
            setAlertMessage('Failed to delete profile photo. Please try again.');
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleProfileEdit = async (values) => {
        try {
            const { username, email } = values;

            const response = await fetch(`/api/v1/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ username, email }),
            });

            if (response.ok) {
                setEditMode(false);
                refreshUser(user.id, 'users');
                setAlertType('success');
                setAlertMessage('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Profile Edit Error:', error);
            setAlertType('error');
            setAlertMessage('Failed to update profile. Please try again.');
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const response = await fetch(`/api/v1/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
            });

            if (response.ok) {
                history.replace('/');
                logout();
                setAlertType('success');
                setAlertMessage('Profile deleted successfully!');
            } else {
                console.error('Failed To Delete Profile');
                setAlertType('error');
                setAlertMessage('Failed to delete profile. Please try again.');
            }
        } catch (error) {
            console.error('Error Deleting Profile', error);
            setAlertType('error');
            setAlertMessage('Failed to delete profile. Please try again.');
        }
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Card>
            <CardContent>
                {alertType && (
                    <Alert severity={alertType} onClose={() => setAlertType(null)}>
                        {alertMessage}
                    </Alert>
                )}
                <Box mb={2}>
                    <Button variant="contained" size="medium" color="secondary" onClick={toggleEditMode}>
                        {editMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="medium"
                        startIcon={<DeleteSharp />}
                        onClick={handleDeleteProfile}
                    >
                        Delete Profile
                    </Button>
                </Box>
                {editMode ? (
                    <div>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Enter Account Information Below
                        </Typography>
                        <Formik
                            initialValues={{
                                email: user.email,
                                username: user.username,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleProfileEdit}
                        >
                            {({ touched, errors, isSubmitting }) => (
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
                                    <Box mt={2} display="flex" justifyContent="space-between">
                                        <Button variant="contained" type="submit" disabled={isSubmitting}>
                                            Save
                                        </Button>
                                        <Button variant="contained" onClick={toggleEditMode}>
                                            Cancel
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </div>
                ) : (
                    <div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications}
                                    onChange={handleEmailNotificationsChange}
                                    color={emailNotifications ? 'success' : 'error'}
                                />
                            }
                            label={
                                emailNotifications ? (
                                    <Typography variant="body1" color="success">
                                        Email Notifications: Enabled
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" color="error">
                                        Email Notifications: Disabled
                                    </Typography>
                                )
                            }
                        />

                        <Popover
                            open={Boolean(popoverAnchorEl)}
                            anchorEl={popoverAnchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Box p={2}>
                                <Typography variant="body1">
                                    Are you sure you want to {emailNotifications ? 'disable' : 'enable'} email notifications?
                                </Typography>
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleConfirmToggleNotifications(false)}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleConfirmToggleNotifications(true)}
                                        sx={{ marginLeft: 2 }}
                                    >
                                        Yes
                                    </Button>
                                </Box>
                            </Box>
                        </Popover>

                        <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mb={2}>
                            <Avatar src={`api/v1/uploads/${user.profile_photo}`} alt="Profile Photo">
                                {!user.profile_photo && <Person />}
                            </Avatar>
                            <Typography variant="h6">{user.username}</Typography>
                        </Box>
                        <Typography variant="body1">
                            <strong>Contact:</strong> {user.email}
                        </Typography>
                        <Box mt={2}>
                            {!user.profile_photo && (
                                <React.Fragment>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="profile-photo-upload"
                                        type="file"
                                        onChange={handleProfilePhotoChange}
                                    />
                                    <label htmlFor="profile-photo-upload">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            aria-label="upload profile photo"
                                            component="span"
                                            startIcon={<AddPhotoAlternate />}
                                        >
                                            Click Here to Select Profile Photo
                                        </IconButton>
                                    </label>
                                    {profilePhoto && <Typography variant="body2">{profilePhoto.name}</Typography>}
                                    <Button variant="contained" color="primary" onClick={handleUploadProfilePhoto}>
                                        Submit Photo
                                    </Button>
                                </React.Fragment>
                            )}
                            {user.profile_photo && (
                                <Box mt={2}>
                                    <Button variant="contained" color="error" onClick={handleDeleteProfilePhoto}>
                                        Delete Profile Photo
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UserAccountInfo;
