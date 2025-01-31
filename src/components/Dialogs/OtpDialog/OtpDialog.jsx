import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../../config';
import './OtpDialog.css';

const OtpDialog = ({
    open,
    onClose,
    username,
    onSuccess,
    redirectUrl,
    forceVerification = false
}) => {
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [otpEmail, setOtpEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError("");
        try {
            await axios.post(
                `${API_URL}/user/resend-otp`,
                { username },
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setCooldown(30); // 30 seconds cooldown
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(
                `${API_URL}/user/verify`,
                { username, otpEmail },
                { headers: { "Content-type": "application/json; charset=UTF-8" } }
            );
            if (response.status === 200) {
                setSuccess(true);
                if (onSuccess) onSuccess();
                if (redirectUrl) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1500);
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => !loading && onClose()}
            disableEscapeKeyDown={forceVerification}
            onBackdropClick={() => !forceVerification}
        >
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogContent>
                {!success ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                            Please enter the OTP sent to your email address
                        </Typography>
                        <TextField
                            required
                            label="Enter OTP"
                            className="custom-textfield"
                            value={otpEmail}
                            onChange={(e) => setOtpEmail(e.target.value)}
                            fullWidth
                            autoFocus
                            placeholder="Enter 6-digit OTP"
                        />
                        <div className="forgot-password">
                            <Button
                                onClick={handleResendOtp}
                                disabled={resendLoading || cooldown > 0}
                                className="forgot-password-link"
                                size="small"
                            >
                                {resendLoading ? (
                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                ) : cooldown > 0 ? (
                                    `Resend OTP in ${cooldown}s`
                                ) : (
                                    'Resend OTP'
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <Typography variant="body1" className="success-message">
                        Email verified successfully!
                        {redirectUrl && " Redirecting..."}
                    </Typography>
                )}
                {error && (
                    <Typography variant="body2" className="error-message">
                        {error}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button
                    onClick={onClose}
                    disabled={loading || success || forceVerification}
                    className="cancel-button"
                >
                    Cancel
                </Button>
                {!success && (
                    <Button
                        onClick={handleVerify}
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? (
                            <>
                                <CircularProgress color='white' size={24} sx={{ mr: 1 }} />
                            </>
                        ) : 'Verify OTP'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

OtpDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    redirectUrl: PropTypes.string,
    forceVerification: PropTypes.bool
};

OtpDialog.displayName = 'OtpDialog';

export default OtpDialog;