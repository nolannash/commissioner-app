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
} from '@mui/material';
import { DeleteSharp, Person, AddPhotoAlternate } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const UserAccountInfo = () => {
    const { user, logout } = useContext(AuthContext);
    const [emailNotifications, setEmailNotifications] = useState(user.email_notifications);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
    setEmailNotifications(user.email_notifications);
    }, [user.email_notifications]);

    const handleEmailNotificationsChange = async (event) => {
    const checked = event.target.checked;
    setEmailNotifications(checked);

    try {
      // Perform API request to update email notifications for the user
      // ...

      // For this example, we will just update the state directly
    } catch (error) {
        console.error('Email Notifications Error:', error);
      // Handle the error, show a notification, etc.
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

    const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    setProfilePhoto(file);
    };

    const handleUploadProfilePhoto = async () => {
    if (profilePhoto) {
      // Perform API request to upload profile photo for the user
      // ...

      // For this example, we will just update the state directly
      // You can use the fetch API or a library like Axios for the actual API requests
        console.log('Profile photo uploaded successfully');
    }
    };

    const handleDeleteProfilePhoto = async () => {
    try {
      // Perform API request to delete profile photo for the user
      // ...

      // For this example, we will just update the state directly
      // You can use the fetch API or a library like Axios for the actual API requests
        console.log('Profile photo deleted successfully');
    } catch (error) {
        console.error('Delete Profile Photo Error:', error);
    }
    };

    const handleDeleteProfile = async () => {
    try {
      // Perform API request to delete the user's profile
      // ...

      // For this example, we will log a message and perform the logout locally
        console.log('Profile deleted successfully');
        logout();
    } catch (error) {
        console.error('Delete Profile Error:', error);
    }
    };

    return (
    <Card>
        <CardContent>
        <Box mb={2}>
            <Button variant="contained" size="medium" color="secondary">
            Edit Profile
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
        <CardContent>
            <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mb={2}>
            {/* Profile photo overlaid as an avatar */}
            <Avatar src={user.profile_photo} alt="Profile Photo">
                {!user.profile_photo && <Person />}
            </Avatar>
            <Typography variant="h6">{user.username}</Typography>
            </Box>
            <Typography variant="body1">
            <strong>Contact:</strong> {user.email}
            </Typography>
            <Box mt={2}>
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-photo-upload"
                type="file"
                onChange={handleProfilePhotoChange}
            />
            <label htmlFor="profile-photo-upload">
                <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<AddPhotoAlternate />}
                >
                Upload Profile Photo
                </Button>
            </label>
            {profilePhoto && <Typography variant="body2">{profilePhoto.name}</Typography>}
            <Button variant="contained" color="primary" onClick={handleUploadProfilePhoto}>
                Submit Photo
            </Button>
            <Box mt={2}>
                {user.profile_photo && (
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteProfilePhoto}
                >
                    Delete Profile Photo
                </Button>
                )}
            </Box>
            </Box>
        </CardContent>
        </CardContent>
    </Card>
    );
};

export default UserAccountInfo;
