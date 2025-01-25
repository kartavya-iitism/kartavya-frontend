import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Button,
    Box,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio
} from '@mui/material';
import { API_URL } from '../../config';
import axios from 'axios';
import './EditProfile.css'

const EditProfileDialog = ({ open, onClose, username, initialData }) => {
    const [formData, setFormData] = useState({
        email: initialData.email,
        contactNumber: initialData.contactNumber,
        address: initialData.address,
        isGovernmentOfficial: initialData.isGovernmentOfficial,
        currentJob: initialData.currentJob
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isGovernmentOfficial' ? checked : value
        }));
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                email: initialData.email || '',
                contactNumber: initialData.contactNumber || '',
                address: initialData.address || '',
                isGovernmentOfficial: initialData.isGovernmentOfficial || false,
                currentJob: initialData.currentJob || ''
            });
        }
    }, [initialData]);

    const handleUpdateProfile = async () => {
        setError('');
        setSuccess(false);
        try {
            console.log(formData)
            console.log(username)
            console.log(initialData)
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
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleClose = () => {
        setError('');
        setSuccess(false);
        setFormData({
            email: initialData?.email || '',
            contactNumber: initialData?.contactNumber || '',
            address: initialData?.address || '',
            isGovernmentOfficial: initialData?.isGovernmentOfficial || false,
            currentJob: initialData?.currentJob || ''
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
                        Profile Updated Successfully
                    </DialogTitle>
                    <Button
                        onClick={handleClose}
                        className="close-button"
                        variant="contained"
                    >
                        Close
                    </Button>
                </Box>
            ) : (
                <>
                    <DialogTitle className="dialog-title">
                        Edit Profile
                    </DialogTitle>
                    <DialogContent className="dialog-content">
                        <Box className="form-container">
                            <TextField
                                style={{ marginTop: "10px" }}
                                label="Email"
                                type="email"
                                name="email"
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                                className="form-field"
                                variant="outlined"
                            />
                            <TextField
                                label="Contact Number"
                                type="tel"
                                name="contactNumber"
                                fullWidth
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="form-field"
                                variant="outlined"
                            />
                            <TextField
                                label="Current Job"
                                name="currentJob"
                                fullWidth
                                value={formData.currentJob}
                                onChange={handleChange}
                                className="form-field"
                                variant="outlined"
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
                                variant="outlined"
                            />
                            <FormControl component="fieldset" className="custom-textfield" fullWidth>
                                <FormLabel className='radio-label' required>Government Official</FormLabel>
                                <RadioGroup
                                    className='radio-group'
                                    name="isGovernmentOfficial"
                                    value={formData.isGovernmentOfficial.toString()}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setFormData(prev => ({
                                            ...prev,
                                            [name]: value === 'true'
                                        }));
                                    }}
                                    row
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                            {error && (
                                <Typography className="error-text">
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions className="dialog-actions">
                        <Button
                            onClick={handleClose}
                            className="cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateProfile}
                            variant="contained"
                            className="save-button"
                        >
                            Save Changes
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
        email: PropTypes.string,
        contactNumber: PropTypes.string,
        address: PropTypes.string,
        isGovernmentOfficial: PropTypes.bool,
        currentJob: PropTypes.string
    })
};

export default EditProfileDialog;