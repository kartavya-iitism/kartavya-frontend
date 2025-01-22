import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, Button,
    CircularProgress, Alert, FormControl, MenuItem
} from '@mui/material';
import axios from 'axios';
import { fetchContent } from '../../helper/contentFetcher';
import './DonateItem.css';

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/donateItem.json";

export default function DonateItem() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        itemType: '',
        itemDescription: '',
        quantity: '',
        pickupAddress: ''
    });
    const [images, setImages] = useState([]);
    const [success, setSuccess] = useState(false);
    const [fileNames, setFileNames] = useState([]);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchContent(CONTENT_URL);
                setContent(data);
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    setFormData(prev => ({
                        ...prev,
                        name: storedUser.name || '',
                        email: storedUser.email || '',
                        contactNumber: storedUser.contactNumber || ''
                    }));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setFileNames(files.map(file => file.name));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        images.forEach(image => {
            formDataToSend.append('images', image);
        });

        try {
            const response = await axios.post(
                'http://localhost:3000/donation/item',
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.status === 201) {
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    contactNumber: '',
                    itemType: '',
                    itemDescription: '',
                    quantity: '',
                    pickupAddress: ''
                });
                setImages([]);
                setFileNames([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress color="primary" />
        </Box>
    );

    const { hero, itemTypes } = content || {};

    return (
        <div className="donation-container">
            <Box className="form-box">
                <Typography variant="h2" className="page-title">
                    {hero?.title || 'Donate Items'}
                </Typography>
                <Typography variant="subtitle1" className="page-subtitle">
                    {hero?.subtitle || 'Help us by donating items'}
                </Typography>

                <Paper component="form" className="donation-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <TextField
                            className="custom-textfield"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            className="custom-textfield"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            className="custom-textfield"
                            label="Contact Number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth className="custom-textfield">
                            <TextField
                                select
                                label="Item Type"
                                name="itemType"
                                value={formData.itemType}
                                onChange={handleChange}
                                required
                                fullWidth
                            >
                                {itemTypes?.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                        <TextField
                            className="custom-textfield"
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            className="custom-textfield"
                            label="Item Description"
                            name="itemDescription"
                            value={formData.itemDescription}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                            fullWidth
                            style={{ gridColumn: '1 / -1' }}
                        />
                        <TextField
                            className="custom-textfield"
                            label="Pickup Address"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            required
                            fullWidth
                            style={{ gridColumn: '1 / -1' }}
                        />

                        <div className="file-input-container">
                            <label className="file-input-label">
                                {fileNames.length ? fileNames.join(', ') : 'Upload Item Images'}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    multiple
                                    className="file-input"
                                />
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            className="submit-button"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Submit Donation'}
                        </Button>
                    </div>

                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Thank you for your donation! We will contact you soon.
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>
            </Box>
        </div>
    );
}