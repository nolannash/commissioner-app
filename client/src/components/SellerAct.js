import React, { useState, useContext, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  Switch,
  FormControlLabel,
  Popover,
  IconButton,
  TextField,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { DeleteSharp, Person, AddPhotoAlternate } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  shopname: Yup.string()
    .min(2, 'Shop Name must be between 2 and 20 characters')
    .max(20, 'Shop Name must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9]*$/, 'Shop Name must be only letters and numbers with no spaces')
    .required('A shop name between 2 and 20 characters is required'),
});

const SellerAccountInfo = () => {
  const history = useHistory();
  const { user, csrfToken, refreshUser, logout } = useContext(AuthContext);
  const [emailNotifications, setEmailNotifications] = useState(user.email_notifications);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [logoBanner, setLogoBanner] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setEmailNotifications(user.email_notifications);
  }, [user.email_notifications]);

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleEmailNotificationsChange = async (event) => {
    const checked = event.target.checked;
    setEmailNotifications(checked);

    try {
      const response = await fetch(`/api/v1/sellers/${user.id}`, {
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
    } catch (error) {
      console.error('Email Notifications Error:', error);
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleConfirmToggleNotifications = async (confirm) => {
    if (confirm) {
      setEmailNotifications(false);
    }
    setPopoverAnchorEl(null);
  };

  const handleLogoBannerChange = (event) => {
    const file = event.target.files[0];
    setLogoBanner(file);
  };

  const handleUploadBanner = async () => {
    if (logoBanner) {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('logoBanner', logoBanner);

      try {
        const response = await fetch(`/api/v1/sellers/${user.id}/logo_banner`, {
          method: 'PATCH',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          body: formData,
        });

        if (response.ok) {

          handleSnackbarOpen('success', 'Logo Banner uploaded successfully');
          refreshUser(user.id, 'sellers');
        } else {
          console.error('Failed to upload logo banner');
          handleSnackbarOpen('error', 'Failed to upload logo banner');
        }
      } catch (error) {
        console.error('Upload Logo Banner Error:', error);
        handleSnackbarOpen('error', 'Failed to upload logo banner');
      }
    }
  };

  const handleDeleteBanner = async () => {
    try {
      const response = await fetch(`/api/v1/sellers/${user.id}/logo_banner`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {

        handleSnackbarOpen('success', 'Logo Banner deleted successfully');
        refreshUser(user.id, 'sellers');
      } else {
        console.error('Failed to delete logo banner');
        handleSnackbarOpen('error', 'Failed to delete logo banner');
      }
    } catch (error) {
      console.error('Delete Logo Banner Error:', error);
      handleSnackbarOpen('error', 'Failed to delete logo banner');
    }
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
        const response = await fetch(`/api/v1/sellers/${user.id}/profile_photo`, {
          method: 'PATCH',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          body: formData,
        });

        if (response.ok) {

          handleSnackbarOpen('success', 'Profile photo uploaded successfully');
          refreshUser(user.id, 'sellers');
        } else {
          console.error('Failed to upload profile photo');
          handleSnackbarOpen('error', 'Failed to upload profile photo');
        }
      } catch (error) {
        console.error('Upload Profile Photo Error:', error);
        handleSnackbarOpen('error', 'Failed to upload profile photo');
      }
    }
  };

  const handleDeleteProfilePhoto = async () => {
    try {
      const response = await fetch(`/api/v1/sellers/${user.id}/profile_photo`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {

        handleSnackbarOpen('success', 'Profile photo deleted successfully');
        refreshUser(user.id, 'sellers');
      } else {
        console.error('Failed to delete profile photo');
        handleSnackbarOpen('error', 'Failed to delete profile photo');
      }
    } catch (error) {
      console.error('Delete Profile Photo Error:', error);
      handleSnackbarOpen('error', 'Failed to delete profile photo');
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleProfileEdit = async (values) => {
    try {
      const { shopname, email, bio } = values;

      const response = await fetch(`/api/v1/sellers/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ shopname, email, bio }),
      });

      if (response.ok) {
        toggleEditMode();
        handleSnackbarOpen('success', 'Profile information updated successfully');
        refreshUser(user.id, 'sellers');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Profile Edit Error:', error);
      handleSnackbarOpen('error', 'Failed to update profile information');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(`/api/v1/sellers/${user.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });
      if (response.ok) {

        handleSnackbarOpen('success', 'Profile deleted successfully');
        history.replace('/');
        logout();
      } else {
        console.error('Failed To Delete Profile');
        handleSnackbarOpen('error', 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Error Deleting Profile');
      handleSnackbarOpen('error', 'Failed to delete profile');
    }
  };

  return (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Button variant="contained" size="medium" color="secondary" onClick={toggleEditMode}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button variant="contained" color="error" size="medium" startIcon={<DeleteSharp />} onClick={handleDeleteProfile}>
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
                shopname: user.shopname,
                bio: user.bio,
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
                      name="shopname"
                      label="Shop Name"
                      variant="outlined"
                      fullWidth
                      error={touched.shopname && errors.shopname}
                      helperText={touched.shopname && errors.shopname}
                    />
                    <ErrorMessage name="shopname" component="div" />
                  </div>
                  <div>
                    <Field
                      as={TextField}
                      type="text"
                      name="bio"
                      label="Bio"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      error={touched.bio && errors.bio}
                      helperText={touched.bio && errors.bio}
                    />
                    <ErrorMessage name="bio" component="div" />
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
                <Typography variant="body1">Are you sure you want to edit your profile?</Typography>
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

            {user.logo_banner ? (
              <CardMedia
                component="img"
                height="150"
                image={`api/v1/uploads/${user.logo_banner}`}
                alt="Logo Banner"
              />
            ) : (
              <CardHeader title="Logo Banner Here" />
            )}

            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mb={2}>
                    <Avatar src={`api/v1/uploads/${user.profile_photo}`} alt="Profile Photo">
                      {!user.profile_photo && <Person />}
                    </Avatar>
                    <Typography variant="h6">{user.shopname}</Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>Contact:</strong> {user.email}
                  </Typography>
                  {user.bio ? (
                    <Typography variant="body1">
                      <strong>Bio:</strong> {user.bio}
                    </Typography>
                  ) : (
                    <Box mt={2}>
                      <Typography variant="body1">Please edit your profile and create a bio.</Typography>
                      <Button variant="contained" color="primary" onClick={toggleEditMode}>
                        Edit Profile
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Box>
                {user.logo_banner ? (
                  <Box mt={2}>
                    <Button variant="contained" color="error" onClick={handleDeleteBanner}>
                      Delete Logo Banner
                    </Button>
                  </Box>
                ) : (
                  <Box mt={2}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-banner-upload"
                      type="file"
                      onChange={handleLogoBannerChange}
                    />
                    <label htmlFor="logo-banner-upload">
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="upload logo banner"
                        component="span"
                        startIcon={<AddPhotoAlternate />}
                      >
                        Click Here to Select Logo Banner
                      </IconButton>
                    </label>
                    {logoBanner && <Typography variant="body2">{logoBanner.name}</Typography>}
                    <Button variant="contained" color="primary" onClick={handleUploadBanner}>
                      Submit Banner
                    </Button>
                  </Box>
                )}
              </Box>
              {user.profile_photo ? (
                <Box mt={2}>
                  <Button variant="contained" color="error" onClick={handleDeleteProfilePhoto}>
                    Delete Profile Photo
                  </Button>
                </Box>
              ) : (
                <Box mt={2}>
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
                </Box>
              )}
            </CardContent>
          </div>
        )}
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SellerAccountInfo;
