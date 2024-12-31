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
import './ChangePassword.css'

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
                        Password Changed Successfully
                    </DialogTitle>
                    <Button
                        onClick={handleClose}
                        className="close-button"
                        variant="contained"
                    >
                        Close
                    </Button>
                </Box>
            ) : (
                <>
                    <DialogTitle className="dialog-title">
                        Change Password
                    </DialogTitle>
                    <DialogContent className="dialog-content">
                        <Box className="form-container">
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
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="password-field"
                                variant="outlined"
                            />
                            {error && (
                                <Typography className="error-text">
                                    {error}
                                </Typography>
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
                            disabled={!currentPassword || !newPassword || !confirmPassword}
                            className="save-button"
                        >
                            Save Changes
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