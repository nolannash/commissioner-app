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
} from '@mui/material';
import { DeleteSharp, Person, AddPhotoAlternate } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  shopname: Yup.string()
    .min(2, 'Shop Name must be between 2 and 20 characters')
    .max(20, 'Shop Name must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9]*$/, 'Shop Name must be only letters and numbers with no spaces')
    .required('A shop name between 2 and 20 characters is required'),
});

const SellerAccountInfo = () => {
  const { user, csrfToken, refreshUser } = useContext(AuthContext);
  const [emailNotifications, setEmailNotifications] = useState(user.email_notifications);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [showUploadBanner, setShowUploadBanner] = useState(!user.logo_banner);
  const [logoBanner, setLogoBanner] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    setEmailNotifications(user.email_notifications);
  }, [user.email_notifications]);

  const handleEmailNotificationsChange = async (event) => {
    const checked = event.target.checked;
    if (checked) {
      setEmailNotifications(true);
      try {
        const response = await fetch(`/sellers/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ email_notifications: true }),
        });
        if (!response.ok) {
          throw new Error('Failed to update email notifications');
        }
      } catch (error) {
        console.error('Email Notifications Error:', error);
        // Handle the error, show a notification, etc.
      }
    } else {
      setEmailNotifications(false);
      try {
        const response = await fetch(`/sellers/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ email_notifications: false }),
        });
        if (!response.ok) {
          throw new Error('Failed to update email notifications');
        }
      } catch (error) {
        console.error('Email Notifications Error:', error);
        // Handle the error, show a notification, etc.
      }
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleConfirmToggleNotifications = (confirm) => {
    if (confirm) {
      setEmailNotifications(false);
    }
    setPopoverAnchorEl(null);
  };

  const handleLogoBannerChange = (event) => {
    setLogoBanner(event.target.files[0]);
  };

  const handleUploadBanner = () => {
    // Implement the logic to upload the logo banner
    // On successful upload, update the "user.logo_banner" in the backend and set "showUploadBanner" to false
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
      console.log(formData);
      console.log(profilePhoto);
      try {
        const response = await fetch(`/sellers/${user.id}/profile_photo`, {
          method: 'PATCH',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          body: formData, profilePhoto, user
        });

        if (response.ok) {
          console.log('Profile photo uploaded successfully');
          refreshUser(user.id, 'sellers');
        } else {
          console.error('Failed to upload profile photo');
        }
      } catch (error) {
        console.error('Upload Profile Photo Error:', error);
      }
    }
  };

  const open = Boolean(popoverAnchorEl);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleProfileEdit = async (values) => {
    try {
      const { shopname, email } = values;

      const response = await fetch(`/sellers/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ shopname, email }),
      });

      if (response.ok) {
        toggleEditMode();
        refreshUser(user.id, 'sellers');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Profile Edit Error:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Button variant="contained" size="medium" color="secondary" onClick={toggleEditMode}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button variant="contained" color="error" size="medium" startIcon={<DeleteSharp />}>
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
              }}
              validationSchema={validationSchema}
              onSubmit={handleProfileEdit}
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
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" type="submit">
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
              open={open}
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
              open={open}
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

            {/* Logo banner as the header background */}
            {user.logo_banner ? (
              <CardMedia component="img" height="150" image={user.logo_banner} alt="Logo Banner" />
            ) : (
              <CardHeader title="Logo Banner Here" />
            )}

            <CardContent>
              <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mb={2}>
                {/* Profile photo overlaid as an avatar */}
                <Avatar
                  src={`/uploads/${user.profile_photo}`}
                  alt="Profile Photo"
                  sx={{ width: 80, height: 80, marginRight: 2, marginTop: -40 }}
                >
                  {!user.profile_photo && <Person />}
                </Avatar>
                <Typography variant="h6">{user.shopname}</Typography>
              </Box>
              <Typography variant="body1">
                <strong>Contact:</strong> {user.email}
              </Typography>

              {showUploadBanner && (
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
            </CardContent>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerAccountInfo;
