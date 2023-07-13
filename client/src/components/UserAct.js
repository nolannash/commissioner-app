import React, { useState, useContext } from 'react';
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
import {
    Edit,
    DeleteSharp,
    Person,
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';


const SellerAccountInfo = () => {
    const { user } = useContext(AuthContext);
    const [emailNotifications, setEmailNotifications] = useState(user.email_notifications);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

    const handleEmailNotificationsChange = (event) => {
        const checked = event.target.checked;
        if (checked) {
            setEmailNotifications(true);
        } else {
            setPopoverAnchorEl(event.target);
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

    const open = Boolean(popoverAnchorEl);

    return (
        <Card>
            <CardContent>
                <Box mb={2}>
                    <Button
                        variant="contained"
                        size="medium"
                        color="secondary"
                        startIcon={<Edit />}
                    >
                        Edit Profile
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="medium"
                        startIcon={<DeleteSharp />}
                        onClick={handleDeleteProfileClick}
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
                <CardContent>
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        mb={2}
                    >
                        {/* Profile photo overlaid as an avatar */}
                        <Avatar
                            src={user.profile_photo}
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
                </CardContent>
            </CardContent>
        </Card>
    );
};

export default SellerAccountInfo;
