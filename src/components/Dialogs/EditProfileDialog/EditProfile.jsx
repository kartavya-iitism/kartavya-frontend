import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DateField from '../../DateField/DateField';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Alert,
    CircularProgress
} from '@mui/material';
import { API_URL } from '../../../config';
import axios from 'axios';
import './EditProfile.css'

const EditProfileDialog = ({ open, onClose, username, initialData }) => {
    const [formData, setFormData] = useState({
        contactNumber: initialData?.contactNumber || '',
        address: initialData?.address || '',
        governmentOfficial: Boolean(initialData?.governmentOfficial) || false,
        currentJob: initialData?.currentJob || '',
        name: initialData?.name || '',
        dateOfBirth: initialData?.dateOfBirth || '',
        gender: initialData?.gender || '',
        ismPassout: Boolean(initialData?.ismPassout) || false,
        batch: initialData?.batch || '',
        kartavyaVolunteer: Boolean(initialData?.kartavyaVolunteer) || false,
        yearsOfServiceStart: initialData.yearsOfServiceStart || '',
        yearsOfServiceEnd: initialData.yearsOfServiceEnd || ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async () => {
        setError('');
        setSuccess(false);
        setLoading(true);
        try {
            const response = await axios.put(
                `${API_URL}/user/${username}/edit`,
                formData,
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
            setError(err.response?.data?.message || 'An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                contactNumber: initialData.contactNumber || '',
                address: initialData.address || '',
                governmentOfficial: Boolean(initialData.governmentOfficial),
                currentJob: initialData.currentJob || '',
                name: initialData.name || '',
                dateOfBirth: initialData.dateOfBirth || '',
                gender: initialData.gender || '',
                ismPassout: Boolean(initialData.ismPassout),
                batch: initialData.batch || '',
                kartavyaVolunteer: Boolean(initialData.kartavyaVolunteer),
                yearsOfServiceStart: initialData.yearsOfServiceStart || '',
                yearsOfServiceEnd: initialData.yearsOfServiceEnd || ''
            });
        }
    }, [initialData]);

    const handleClose = () => {
        setError('');
        setSuccess(false);
        setFormData({
            contactNumber: initialData.contactNumber || '',
            address: initialData.address || '',
            governmentOfficial: Boolean(initialData.governmentOfficial),
            currentJob: initialData.currentJob || '',
            name: initialData.name || '',
            dateOfBirth: initialData.dateOfBirth || '',
            gender: initialData.gender || '',
            ismPassout: Boolean(initialData.ismPassout),
            batch: initialData.batch || '',
            kartavyaVolunteer: Boolean(initialData.kartavyaVolunteer),
            yearsOfServiceStart: initialData.yearsOfServiceStart || '',
            yearsOfServiceEnd: initialData.yearsOfServiceEnd || ''
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            className="profile-dialog"
            PaperProps={{
                className: "dialog-paper"
            }}
        >
            {success ? (
                <Box className="success-container">
                    <DialogTitle className="dialog-title success-title">
                        Profile Updated, Reloading...
                    </DialogTitle>
                </Box>
            ) : (
                <>
                    <DialogTitle className="dialog-title">Edit Profile</DialogTitle>
                    <DialogContent className="dialog-content">
                        <Box className="form-container">
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                                className="form-field"
                            />

                            <DateField
                                name="dateOfBirth"
                                label="Date of Birth"
                                fullWidth
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="form-field"
                            />

                            <TextField
                                label="Contact Number"
                                name="contactNumber"
                                fullWidth
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="form-field"
                            />

                            <TextField
                                label="Current Job"
                                name="currentJob"
                                fullWidth
                                value={formData.currentJob}
                                onChange={handleChange}
                                className="form-field"
                            />

                            <TextField
                                label="Address"
                                name="address"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.address}
                                onChange={handleChange}
                                className="form-field"
                            />

                            <FormControl component="fieldset" fullWidth>
                                <FormLabel className='radio-label'>Gender</FormLabel>
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


                            <FormControl component="fieldset" fullWidth>
                                <FormLabel className='radio-label'>Government Official</FormLabel>
                                <RadioGroup
                                    name="governmentOfficial"
                                    value={String(Boolean(formData.governmentOfficial))}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'governmentOfficial',
                                            value: e.target.value === 'true'
                                        }
                                    })}
                                    row
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl component="fieldset" fullWidth>
                                <FormLabel className='radio-label'>IIT ISM Passout</FormLabel>
                                <RadioGroup
                                    name="ismPassout"
                                    value={String(Boolean(formData.ismPassout))}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'ismPassout',
                                            value: e.target.value === 'true'
                                        }
                                    })}
                                    row
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>

                            {formData.ismPassout && (
                                <>
                                    <TextField
                                        label="Batch"
                                        name="batch"
                                        type="number"
                                        fullWidth
                                        value={formData.batch}
                                        onChange={handleChange}
                                        className="form-field"
                                        placeholder="YYYY"
                                    />

                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel className='radio-label'>Kartavya Volunteer</FormLabel>
                                        <RadioGroup
                                            name="kartavyaVolunteer"
                                            value={formData.kartavyaVolunteer.toString()}
                                            onChange={(e) => handleChange({
                                                target: {
                                                    name: 'kartavyaVolunteer',
                                                    value: e.target.value === 'true'
                                                }
                                            })}
                                            row
                                        >
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>

                                    {formData.kartavyaVolunteer && (
                                        <FormControl component="fieldset" fullWidth>
                                            <TextField
                                                className="form-field"
                                                label="Years of Service"
                                                name="yearsOfService"
                                                value={`${formData.yearsOfServiceStart}${formData.yearsOfServiceStart && formData.yearsOfServiceEnd ? '-' : ''}${formData.yearsOfServiceEnd}`}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length > 4) {
                                                        value = value.slice(0, 4) + '-' + value.slice(4, 8);
                                                    }
                                                    const [start, end] = value.split('-');
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        yearsOfServiceStart: start || '',
                                                        yearsOfServiceEnd: end || ''
                                                    }));
                                                }}
                                                placeholder="YYYY-YYYY"
                                                inputProps={{
                                                    maxLength: 9
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                </>
                            )}

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
                        <Button onClick={handleClose} className="cancel-button">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateProfile}
                            variant="contained"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

EditProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        contactNumber: PropTypes.string,
        address: PropTypes.string,
        governmentOfficial: PropTypes.bool,
        currentJob: PropTypes.string,
        name: PropTypes.string,
        dateOfBirth: PropTypes.string,
        gender: PropTypes.oneOf(['male', 'female']),
        ismPassout: PropTypes.bool,
        batch: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        kartavyaVolunteer: PropTypes.bool,
        yearsOfServiceStart: PropTypes.string,
        yearsOfServiceEnd: PropTypes.string
    }).isRequired
};

export default EditProfileDialog;