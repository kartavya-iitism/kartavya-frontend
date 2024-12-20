import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Button,
    Box,
} from '@mui/material';
import axios from 'axios';

const ChangePasswordDialog = ({ open, onClose, username }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');


    const handleChangePassword = async () => {
        setError('');
        setSuccess(false)
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        const data = {
            oldPassword: currentPassword,
            newPassword: newPassword
        }
        try {
            const response = await axios.put(
                `http://localhost:3000/user/${username}/changePassword`,
                data,
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.status === 200) {
                setSuccess(true)

            }
        } catch (err) {
            setError(err.response.data.message);
        }


        // handleClose();
    };

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess(false)
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            {
                success &&
                <>
                    <DialogTitle>Password change successful</DialogTitle>
                    <Button onClick={handleClose} color="warning">
                        Close
                    </Button>
                </>
            }
            {!success && <>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChangePassword}
                        variant="contained"
                        color="primary"
                        disabled={success}
                    >
                        Save
                    </Button>

                </DialogActions>
            </>
            }
        </Dialog>
    );
};

// Prop validation
ChangePasswordDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;
