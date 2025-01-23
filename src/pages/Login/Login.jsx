// LoginForm.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
import { Typography } from '@mui/material';
import AuthVerify from '../../helper/JWTVerify';
import ForgotPasswordDialog from '../../components/ForgotPasswordDialog/ForgotPasswordDialog';
import { Google } from "@mui/icons-material";
import './Login.css'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setformData] = useState({
        username: '',
        password: '',
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const handleForgotPasswordOpen = () => setForgotPasswordOpen(true);
    const handleForgotPasswordClose = () => setForgotPasswordOpen(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleChange = (evt) => {
        const fieldName = evt.target.name;
        const value = evt.target.value;
        setformData((currdata) => ({
            ...currdata,
            [fieldName]: value,
        }));
    };
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/user/auth/google';
    };
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        setLoading(true);
        setSuccess(false);
        setError(false);

        try {
            const response = await axios.post(
                `http://localhost:3000/user/login`,
                formData,
                {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            );
            setLoading(false);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setSuccess(true);
                if (response.data.role !== "admin") {
                    navigate('/user/profile');
                }
                else {
                    navigate('/admin/dashboard')
                }
            } else {
                setError(true);
                setErrorMessage(response.data.message);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMessage(err.response?.data?.message || 'An error occurred');
        }
    };

    const token = localStorage.getItem('token');
    useEffect(() => {
        setLoading(true);
        if (AuthVerify(token)) navigate('/profile');
        setLoading(false);
    }, []);

    return (
        <div className="login-form-container">
            <Box
                className="form-box"
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Typography variant="h1" className="form-title section-title">
                    Login
                </Typography>
                <TextField
                    required
                    className="custom-textfield"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                />
                <FormControl className="custom-textfield login-textfield" variant="outlined" fullWidth>
                    <InputLabel required>Password</InputLabel>
                    <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                    />
                </FormControl>
                <div className="forgot-password">
                    <Button
                        onClick={handleForgotPasswordOpen}
                        className="forgot-password-link"
                    >
                        Forgot Password?
                    </Button>
                </div>
                <Button
                    className="submit-button"
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="button-text">Login</span>
                            <CircularProgress size={24} className="button-loader" />
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>

                <div className="divider">
                    <span>or</span>
                </div>

                <Button
                    className="google-button"
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={<Google />}
                >
                    Continue with Google
                </Button>

                {success && <div className="status-message success-message">Login Successful</div>}
                {error && <div className="status-message error-message">{errorMessage}</div>}
                {loading && <div className="status-message loading-message">Please Wait...</div>}

                <div className="existing-user" style={{ marginTop: '15px' }}>
                    <p>
                        New User?{' '}
                        <a href="/register" className="login-link">Register</a>
                    </p>
                </div>
            </Box>
            <ForgotPasswordDialog
                open={forgotPasswordOpen}
                onClose={handleForgotPasswordClose}
            />
        </div>
    );
}