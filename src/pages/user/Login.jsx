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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';
import AuthVerify from '../../helper/JWTVerify';

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

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleChange = (evt) => {
        const fieldName = evt.target.name;
        const value = evt.target.value;
        setformData((currdata) => ({
            ...currdata,
            [fieldName]: value,
        }));
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
                localStorage.setItem('role', response.data.role);
                setSuccess(true);
                navigate('/');
            } else {
                setError(true);
                setErrorMessage(response.data.message);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMessage(err.response.data.message);
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
                style={{ margin: "2.5%" }}
            >
                <h1>LogIn</h1>
                <TextField
                    required
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <FormControl sx={{ mt: '20px', mb: '20px', width: '100%' }} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        value={formData.password}
                        name="password"
                        fullWidth
                        onChange={handleChange}
                    />
                </FormControl>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                >
                    Login
                </Button>
                {success && <div>Login Successful</div>}
                {error && <div>{errorMessage}</div>}
                {loading && <div>Please Wait...</div>}
                <div className="new-user">
                    <p>Don&apos;t have an account?
                        <a href="/register" className="register-link">Register</a>
                    </p>
                </div>
            </Box>
        </div>

    );
}