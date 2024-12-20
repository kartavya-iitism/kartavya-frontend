import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    OutlinedInput,
    IconButton,
    InputLabel,
    InputAdornment,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthVerify from '../../helper/JWTVerify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        contactNumber: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        governmentOfficial: false,
        ismPassout: false,
        batch: "",
        kartavyaVolunteer: false,
        yearsOfServiceStart: "",
        yearsOfServiceEnd: ""
    });
    const [otpEmail, setOtpEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const [success, setSuccess] = useState(false);
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [otpSuccess, setOtpSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (evt) => {
        const fieldName = evt.target.name;
        const value = evt.target.value;
        setformData((currdata) => ({
            ...currdata,
            [fieldName]: (fieldName === "governmentOfficial" || fieldName === "ismPassout" || fieldName === "kartavyaVolunteer") ? value === "true" : value,
        }));
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(false);

        const ReactFormData = new FormData();
        for (let prop in formData) {
            ReactFormData.append(prop, formData[prop]);
        }
        if (profilePicture) {
            ReactFormData.append('profilePicture', profilePicture, profilePicture?.name);
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/user/register`,
                ReactFormData,
                { headers: { 'Content-Type': `multipart/form-data` } }
            );
            setLoading(false);
            if (response.status === 201) {
                setSuccess(true);
                setOtpDialogOpen(true); // Open the OTP dialog after successful registration
            } else {
                setError(true);
                setErrorMessage(response.data.message);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMessage(err.response.data.error);
        }
    };

    const handleOtpSubmit = async () => {
        setLoading(true);
        setOtpSuccess(false);
        setError(false);
        const data = {
            username: formData.username,
            otpEmail: otpEmail
        };
        try {
            console.log(data)
            const response = await axios.post(
                `http://localhost:3000/user/verify`,
                data,
                { headers: { "Content-type": "application/json; charset=UTF-8" } }
            );
            setLoading(false);
            if (response.status === 200) {
                setOtpSuccess(true);
                setOtpDialogOpen(false); // Close the dialog on success
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

    const handleOtpDialogClose = () => {
        setOtpDialogOpen(false);
        setOtpEmail("");
    };

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
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

                <div>
                    <input
                        type="file"
                        className="form-control"
                        id="material"
                        name="material"
                        onChange={handleProfilePictureChange}
                    />
                </div>
                <TextField
                    required
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />

                <FormControl component="fieldset" style={{ marginTop: '20px', width: '100%' }}>
                    <FormLabel component="legend" required>
                        Gender
                    </FormLabel>
                    <RadioGroup
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        row // Optional: Makes the radio buttons appear inline
                    >
                        <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                        />
                        <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                        />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px', width: '100%' }}>
                    <FormLabel component="legend" required>
                        Government Official
                    </FormLabel>
                    <RadioGroup
                        name="governmentOfficial"
                        value={formData.governmentOfficial} // Convert to string for proper comparison
                        onChange={handleChange}
                        row
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                        />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px', width: '100%' }}>
                    <FormLabel component="legend" required>
                        IIT ISM Passout
                    </FormLabel>
                    <RadioGroup
                        name="ismPassout"
                        value={formData.ismPassout}
                        onChange={handleChange}
                        row // Optional: Makes the radio buttons appear inline
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                        />
                    </RadioGroup>
                </FormControl>
                {
                    formData.ismPassout ?
                        <>
                            <TextField
                                label="Batch"
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                fullWidth
                                style={{ marginTop: '20px' }}
                            />
                            <FormControl component="fieldset" style={{ marginTop: '20px', width: '100%' }}>
                                <FormLabel component="legend" >
                                    Kartavya Volunteer
                                </FormLabel>
                                <RadioGroup
                                    name="kartavyaVolunteer"
                                    value={formData.kartavyaVolunteer}
                                    onChange={handleChange}
                                    row // Optional: Makes the radio buttons appear inline
                                >
                                    <FormControlLabel
                                        value="true"
                                        control={<Radio />}
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        value="false"
                                        control={<Radio />}
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>

                        </> : <></>
                }

                {
                    formData.kartavyaVolunteer ?
                        <>
                            <FormControl component="fieldset" style={{ marginTop: '20px', width: '100%' }}>
                                <FormLabel component="legend">
                                    Years of Service
                                </FormLabel>
                                <TextField
                                    label="Start Year"
                                    name="yearsOfServiceStart"
                                    type="number" // Ensures numeric input
                                    value={formData.yearsOfServiceStart}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="YYYY"
                                    inputProps={{
                                        min: 1900, // Set the earliest allowed year
                                        max: new Date().getFullYear(), // Prevents future years
                                    }}
                                />
                                <TextField
                                    label="End Year"
                                    name="yearsOfServiceEnd"
                                    type="number" // Ensures numeric input
                                    value={formData.yearsOfServiceEnd}
                                    onChange={handleChange}
                                    fullWidth
                                    style={{ marginTop: '5px' }}
                                    placeholder="YYYY"
                                    inputProps={{
                                        min: formData.yearsOfServiceStart || 1900, // Start year must precede or match
                                        max: new Date().getFullYear(), // Prevents future years
                                    }}
                                />
                            </FormControl>
                        </> : <></>
                }


                <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '20px' }} disabled={success}>
                    Register
                </Button>

                {error && <div>{errorMessage}</div>}
                {loading && <div>Registering...</div>}
                {otpSuccess && <div>OTP Verified Successfully! Please <a href='/login'>Login</a></div>}

                <Dialog open={otpDialogOpen} onClose={handleOtpDialogClose}>
                    <DialogTitle>OTP Verification</DialogTitle>
                    <DialogContent>
                        <Typography>Please enter the OTP sent to your email:</Typography>
                        <TextField
                            required
                            label="OTP"
                            name="otpEmail"
                            value={otpEmail}
                            onChange={(e) => setOtpEmail(e.target.value)}
                            fullWidth
                            style={{ marginTop: '10px' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleOtpDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleOtpSubmit} variant="contained" color="primary">
                            Verify
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
}
