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
import './Registration.css';

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
            setErrorMessage(err.response ? err.response.data.error : "Some Error Occured");
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
            const response = await axios.post(
                `http://localhost:3000/user/verify`,
                data,
                { headers: { "Content-type": "application/json; charset=UTF-8" } }
            );
            if (response.status === 200) {
                setOtpSuccess(true);
                setLoading(false);
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMessage(err.response ? err.response.data.error : "Verification failed");
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
        <div className="registration-form-container">
            <Box
                className="form-box"
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <h1>Register</h1>

                {[
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'username', label: 'Username', type: 'text', required: true },
                ].map((field) => (
                    <TextField
                        key={field.name}
                        required={field.required}
                        className="custom-textfield"
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        fullWidth
                    />
                ))}

                <FormControl className="custom-textfield" variant="outlined" fullWidth>
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </FormControl>

                <div className="file-input-container">
                    <label className="file-input-label">
                        {profilePicture?.name || 'Upload Profile Picture'}
                        <input
                            type="file"
                            className="file-input"
                            onChange={handleProfilePictureChange}
                            accept="image/*"
                        />
                    </label>
                </div>

                {[
                    { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
                    { name: 'address', label: 'Address', type: 'text', required: true, multiline: true, rows: 3 },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, shrink: true },
                ].map((field) => (
                    <TextField
                        key={field.name}
                        required={field.required}
                        className="custom-textfield"
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        fullWidth
                        multiline={field.multiline}
                        rows={field.rows}
                        InputLabelProps={{
                            shrink: field.shrink || undefined,
                        }}
                    />
                ))}

                <FormControl component="fieldset" className="custom-textfield" fullWidth>
                    <FormLabel required>Gender</FormLabel>
                    <RadioGroup
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        row
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" className="custom-textfield" fullWidth>
                    <FormLabel required>Government Official</FormLabel>
                    <RadioGroup
                        name="governmentOfficial"
                        value={formData.governmentOfficial.toString()}
                        onChange={handleChange}
                        row
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" className="custom-textfield" fullWidth>
                    <FormLabel required>IIT ISM Passout</FormLabel>
                    <RadioGroup
                        name="ismPassout"
                        value={formData.ismPassout.toString()}
                        onChange={handleChange}
                        row
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                {formData.ismPassout && (
                    <>
                        <TextField
                            className="custom-textfield"
                            label="Batch"
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            fullWidth
                        />

                        <FormControl component="fieldset" className="custom-textfield" fullWidth>
                            <FormLabel>Kartavya Volunteer</FormLabel>
                            <RadioGroup
                                name="kartavyaVolunteer"
                                value={formData.kartavyaVolunteer.toString()}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </>
                )}

                {formData.kartavyaVolunteer && (
                    <FormControl component="fieldset" className="custom-textfield" fullWidth>
                        <FormLabel>Years of Service</FormLabel>
                        <TextField
                            className="custom-textfield"
                            label="Start Year"
                            name="yearsOfServiceStart"
                            type="number"
                            value={formData.yearsOfServiceStart}
                            onChange={handleChange}
                            fullWidth
                            placeholder="YYYY"
                            inputProps={{
                                min: 1900,
                                max: new Date().getFullYear(),
                            }}
                        />
                        <TextField
                            className="custom-textfield"
                            label="End Year"
                            name="yearsOfServiceEnd"
                            type="number"
                            value={formData.yearsOfServiceEnd}
                            onChange={handleChange}
                            fullWidth
                            placeholder="YYYY"
                            inputProps={{
                                min: formData.yearsOfServiceStart || 1900,
                                max: new Date().getFullYear(),
                            }}
                        />
                    </FormControl>
                )}

                <Button
                    className="submit-button"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || success}
                >
                    {loading ? 'Processing...' : 'Register'}
                </Button>

                {success && (
                    <div className="status-message success-message">
                        Registration successful! Please verify your email.
                    </div>
                )}
                {error && (
                    <div className="status-message error-message">
                        {errorMessage}
                    </div>
                )}
                {loading && (
                    <div className="status-message loading-message">
                        Processing registration...
                    </div>
                )}

                <div className="existing-user" style={{ marginTop: '5px' }}>
                    <p>
                        Already have an account?
                        <a href="/login" className="login-link">Login</a>
                    </p>
                </div>

                <Dialog
                    open={otpDialogOpen}
                    onClose={handleOtpDialogClose}
                    className="otp-dialog"
                >
                    <DialogTitle>
                        Verify Your Email
                    </DialogTitle>
                    <DialogContent>
                        {!otpSuccess ? (
                            <>
                                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                                    Please enter the OTP sent to your email address
                                </Typography>
                                <TextField
                                    required
                                    className="custom-textfield"
                                    label="Enter OTP"
                                    name="otpEmail"
                                    value={otpEmail}
                                    onChange={(e) => setOtpEmail(e.target.value)}
                                    fullWidth
                                    autoFocus
                                    placeholder="Enter 6-digit OTP"
                                />
                            </>
                        ) : (
                            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#155724' }}>
                                Email verified successfully! Redirecting to login...
                            </Typography>
                        )}
                        {error && (
                            <Typography variant="body2" sx={{ color: '#721c24', textAlign: 'center', mt: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleOtpDialogClose}
                            className="cancel-button"
                            disabled={otpSuccess}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleOtpSubmit}
                            className="dialog-button"
                            disabled={loading || otpSuccess}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
}
