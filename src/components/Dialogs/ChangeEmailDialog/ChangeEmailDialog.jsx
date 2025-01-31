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
    Alert,
    Typography
} from '@mui/material';
import { API_URL } from '../../../config';
import axios from 'axios';
import './ChangeEmailDialog.css';

const ChangeEmailDialog = ({ open, onClose, username }) => {
    const [newEmail, setNewEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChangeEmail = async () => {
        setError('');
        setSuccess(false);
        setLoading(true);

        if (!newEmail) {
            setError('Please enter new email address');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `${API_URL}/user/${username}/edit`,
                { email: newEmail },
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'An error occurred while changing email. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewEmail('');
        setError('');
        setSuccess(false);
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
                        Email Changed Successfully
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <CircularProgress size={40} sx={{ mb: 2 }} />
                            <Typography>
                                Page will reload in a moment. You will need to verify your new email address with an OTP.
                            </Typography>
                        </Box>
                    </DialogContent>
                </Box>
            ) : (
                <>
                    <DialogTitle className="dialog-title">
                        Change Email Address
                    </DialogTitle>
                    <DialogContent className="dialog-content">
                        <Box className="form-container change-email-form">
                            <TextField
                                label="New Email Address"
                                type="email"
                                fullWidth
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="email-field"
                                variant="outlined"
                                helperText="An OTP will be sent to your new email address for verification. Please note that account actions will be restricted until verification is complete."
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
                            onClick={handleChangeEmail}
                            variant="contained"
                            disabled={!newEmail || loading}
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

ChangeEmailDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangeEmailDialog;