import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { API_URL } from '../../../config';
import axios from 'axios';
import './ChangePassword.css'

const ChangePasswordDialog = ({ open, onClose, username }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleChangePassword = async () => {
        setError('');
        setSuccess(false)
        setLoading(true)
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }
        const data = {
            oldPassword: currentPassword,
            newPassword: newPassword
        }
        try {
            const response = await axios.put(
                `${API_URL}/user/${username}/changePassword`,
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
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            setLoading(false)
            console.log(err)
            setError(
                err.response?.data?.message ||
                'An error occurred while changing password. Please try again.'
            );
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
        <Dialog
            open={open}
            onClose={handleClose}
            className="password-dialog"
            PaperProps={{
                className: "dialog-paper"
            }}
        >
            {success ? (
                <Box className="success-container">
                    <DialogTitle className="dialog-title success-title">
                        Password Changed, Reloading...
                    </DialogTitle>
                </Box>
            ) : (
                <>
                    <DialogTitle className="dialog-title">
                        Change Password
                    </DialogTitle>
                    <DialogContent className="dialog-content">
                        <Box className="form-container change-password-form">
                            <TextField
                                label="Current Password"
                                type="password"
                                fullWidth
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="password-field"
                                variant="outlined"
                                style={{ marginTop: '5px' }}
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="password-field"
                                variant="outlined"
                                style={{ marginTop: '20px' }}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="password-field"
                                variant="outlined"
                                style={{ marginTop: '20px' }}
                            />
                            {error && (
                                <Alert
                                    severity="error"
                                    className="error-alert"
                                    sx={{ mb: 2 }}
                                >
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions className="dialog-actions">
                        <Button
                            onClick={handleClose}
                            className="cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            variant="contained"
                            disabled={!currentPassword || !newPassword || !confirmPassword || loading}
                            className="submit-button"
                        >
                            {loading ? <CircularProgress color='white' size={24} /> : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};


ChangePasswordDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;