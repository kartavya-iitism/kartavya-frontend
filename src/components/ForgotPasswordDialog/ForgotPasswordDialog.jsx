import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ForgotPasswordDialog.css';

const ForgotPasswordDialog = ({ open, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:3000/user/forgot-password', { email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="forgot-password-dialog">
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
                {!success ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </Typography>
                        <TextField
                            required
                            className="custom-textfield"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    </>
                ) : (
                    <Typography variant="body1" sx={{ color: 'var(--admin-success)' }}>
                        Password reset instructions have been sent to your email.
                    </Typography>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} className="cancel-button">
                    Cancel
                </Button>
                {!success && (
                    <Button
                        onClick={handleSubmit}
                        className="dialog-button"
                        disabled={loading || !email}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

ForgotPasswordDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

ForgotPasswordDialog.displayName = 'ForgotPasswordDialog';

export default ForgotPasswordDialog;