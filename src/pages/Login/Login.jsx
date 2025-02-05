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
import ForgotPasswordDialog from '../../components/Dialogs/ForgotPasswordDialog/ForgotPasswordDialog';
import { Google } from "@mui/icons-material";
import { API_URL } from '../../config';
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
        window.location.href = `${API_URL}/user/auth/google`;
    };
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        setLoading(true);
        setSuccess(false);
        setError(false);

        try {
            const response = await axios.post(
                `${API_URL}/user/login`,
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
                localStorage.setItem('role', response.data.user.role);
                setSuccess(true);
                console.log(response.data)
                if (response.data.user.role !== "admin") {
                    if (response.data.user.isVerified) {
                        navigate('/user/dash');
                    }
                    else {
                        navigate('/user/profile');
                    }
                }
                else {
                    navigate('/admin/general')
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
        if (AuthVerify(token)) navigate('/user/profile');
        setLoading(false);
    }, []);


    return (
        <Box className="split-login-container">
            <Box className="login-left">
                <Box className="welcome-section">
                    <Typography variant="h2" className="welcome-title">
                        Welcome Back!
                    </Typography>
                    <Typography variant="subtitle1" className="welcome-subtitle">
                        Continue your journey of making a difference
                    </Typography>
                </Box>
                <Box className="form-box login-form" component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
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
                </Box>
            </Box>

            <Box className="login-right">
                <Box className="cta-container">
                    <Typography variant="h3" className="cta-title">
                        New to Kartavya?
                    </Typography>
                    <Typography variant="body1" className="cta-description">
                        Join us in our mission to empower through education
                    </Typography>
                    <Button
                        component="a"
                        href="/register"
                        variant="contained"
                        className="cta-button register-button"
                    >
                        Register Now
                    </Button>
                    <Typography variant="h3" className="cta-title" sx={{ mt: 4 }}>
                        Want to Make a Difference?
                    </Typography>
                    <Typography variant="body1" className="cta-description">
                        Your contribution can change lives
                    </Typography>
                    <Button
                        component="a"
                        href="/donate"
                        variant="contained"
                        className="cta-button donate-button"
                    >
                        Donate Now
                    </Button>
                </Box>
            </Box>
            <ForgotPasswordDialog
                open={forgotPasswordOpen}
                onClose={handleForgotPasswordClose}
            />
        </Box>
    );
}