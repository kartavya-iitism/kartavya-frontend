import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Button from '@mui/material/Button';
import AuthVerify from '../../helper/JWTVerify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// include otp verification in this file itself

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        email: "",
        username: "",
        password: ""
    });
    const [material, setMaterial] = useState()
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (evt) => {
        const fieldName = evt.target.name;
        const value = evt.target.value;
        setformData((currdata) => ({
            ...currdata,
            [fieldName]: value,
        }));
    };
    const handleMaterialChange = (e) => {
        console.log(e.target.files)
        setMaterial(e.target.files[0]);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        setLoading(true);
        setSuccess(false);
        setError(false);
        console.log(formData)
        console.log(material)
        const ReactFormData = new FormData();
        for (let prop in formData) {
            ReactFormData.append(prop, formData[prop]);
        }
        ReactFormData.append('material', material, material.name);
        console.log(ReactFormData);
        try {
            // const response = await axios.post(
            //     `LINK`,
            //     ReactFormData,
            //     {
            //         headers: {
            //             'Content-Type': `multipart/form-data`,
            //         },
            //     }
            // );
            setLoading(false);
            // if (response.data.message === 'Registration Successful') {
            //     localStorage.setItem("token", response.data.token);
            //     localStorage.setItem("role", response.data.role);
            //     setSuccess(true);
            // } else {
            //     setError(true);
            //     setErrorMessage(response.data.message);
            // }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMessage(err);
        }
    };

    const token = localStorage.getItem('token');
    useEffect(() => {
        setLoading(true);
        if (AuthVerify(token)) navigate('/');
        setLoading(false);
    }, []);

    return (
        <div className="register-form-container">

            <Box
                className="form-box"
                component="form"
                noValidate
                autoComplete="off"
                style={{ margin: "2.5%" }}
            >
                <h1>Register</h1>
                <TextField
                    required
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <div>
                    <input
                        type="file"
                        className="form-control"
                        id="material"
                        name="material"
                        onChange={handleMaterialChange}
                    />
                </div>
                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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

                <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '20px' }}>
                    Register
                </Button>
                {success && <div>Registration Successful</div>}
                {error && <div>{errorMessage}</div>}
                {loading && <div>Registering</div>}
                <div className="old-user" style={{ marginTop: "1em" }}>
                    <p>Already have an account?
                        <a href="/login" className="login-link" >Login</a>
                    </p>
                </div>
            </Box>
        </div>
    );
}