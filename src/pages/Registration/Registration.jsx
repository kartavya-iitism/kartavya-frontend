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
    Typography,
    CircularProgress
} from '@mui/material';
import { API_URL } from '../../config';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthVerify from '../../helper/JWTVerify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DateField from '../../components/DateField/DateField';
import './Registration.css';
import OtpDialog from '../../components/Dialogs/OtpDialog/OtpDialog';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        contactNumber: "",
        currentJob: "",
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
    const [profilePicture, setProfilePicture] = useState();
    const [success, setSuccess] = useState(false);
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
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
                `${API_URL}/user/register`,
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

    const handleOtpDialogClose = () => {
        setOtpDialogOpen(false);
    };

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (AuthVerify(token)) navigate('/');
        setLoading(false);
    }, []);


    return (
        <Box className="split-registration-container">
            <Box className="registration-left">
                <Box className="welcome-section">
                    <Typography variant="h2" className="welcome-title">
                        Create Your Account
                    </Typography>
                    <Typography variant="subtitle1" className="welcome-subtitle">
                        Join us in making education accessible
                    </Typography>
                </Box>
                <Box className="form-box" component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Typography variant="h1" className="form-title section-title">
                        Register
                    </Typography>
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
                        { component: DateField, name: 'dateOfBirth', label: 'Date of Birth', required: true },
                        { name: 'currentJob', label: 'Current Job', type: 'text', required: true }
                    ].map((field) => (
                        field.component ? (
                            <field.component
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                required={field.required}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                        ) : (
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
                            />
                        )
                    ))}

                    <FormControl style={{ marginTop: '15px' }} component="fieldset" className="custom-textfield-2" fullWidth>
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

                    <FormControl component="fieldset" className="custom-textfield-2" fullWidth>
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



                    <FormControl component="fieldset" className="custom-textfield-2" fullWidth>
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
                                type="number"
                                placeholder="YYYY"
                                inputProps={{
                                    min: 1900,
                                    max: new Date().getFullYear(),
                                }}
                            />

                            <FormControl component="fieldset" className="custom-textfield-2" fullWidth>
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
                        <FormControl component="fieldset" fullWidth>
                            <TextField
                                className="custom-textfield"
                                label="Years of Service"
                                name="yearsOfService"
                                value={`${formData.yearsOfServiceStart}${formData.yearsOfServiceStart && formData.yearsOfServiceEnd ? '-' : ''}${formData.yearsOfServiceEnd}`}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length > 4) {
                                        value = value.slice(0, 4) + '-' + value.slice(4, 8);
                                    }
                                    const [start, end] = value.split('-');
                                    handleChange({
                                        target: {
                                            name: 'yearsOfServiceStart',
                                            value: start || ''
                                        }
                                    });
                                    handleChange({
                                        target: {
                                            name: 'yearsOfServiceEnd',
                                            value: end || ''
                                        }
                                    });
                                }}
                                placeholder="YYYY-YYYY"
                                inputProps={{
                                    maxLength: 9
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
                        {loading ? (
                            <>
                                <span className="button-text">Register</span>
                                <CircularProgress size={24} className="button-loader" />
                            </>
                        ) : (
                            'Register'
                        )}
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
                </Box>
            </Box>

            <Box className="registration-right">
                <Box className="cta-container">
                    <Typography variant="h3" className="cta-title">
                        Welcome to Kartavya!
                    </Typography>
                    <Typography variant="body1" className="cta-description">
                        Join our community of change-makers dedicated to educational empowerment
                    </Typography>
                    <Typography variant="h3" className="cta-title" sx={{ mt: 4 }}>
                        Already a Member?
                    </Typography>
                    <Typography variant="body1" className="cta-description">
                        Continue your journey of making a difference
                    </Typography>
                    <Button
                        component="a"
                        href="/login"
                        variant="contained"
                        className="cta-button login-button"
                    >
                        Login Now
                    </Button>
                </Box>
            </Box>

            <OtpDialog
                open={otpDialogOpen}
                onClose={handleOtpDialogClose}
                username={formData.username}
                redirectUrl="/login"
            />
        </Box>
    );
}
