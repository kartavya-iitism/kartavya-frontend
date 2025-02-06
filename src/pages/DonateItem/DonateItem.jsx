import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, Button,
    CircularProgress, Alert, FormControl, MenuItem, Card, CardContent, AlertTitle
} from '@mui/material';
import axios from 'axios';
import { fetchContent } from '../../helper/contentFetcher';
import { API_URL } from '../../config';
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
        itemType: [],
        itemDescription: '',
        quantity: '',
        pickupAddress: ''
    });
    const [success, setSuccess] = useState(false);

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
        if (e.target.name === 'itemType') {
            setFormData({
                ...formData,
                itemType: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const [processing, setProcessing] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                `${API_URL}/donation/item`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.token}`
                    }
                }
            );

            if (response.status === 201) {
                setSuccess(true);
                setSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    contactNumber: '',
                    itemType: [],
                    itemDescription: '',
                    quantity: '',
                    pickupAddress: ''
                });
                // Scroll to top after success
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit donation request');
        } finally {
            setProcessing(false);
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
            <Box className="form-box donation-main">
                <Typography variant="h3" className="page-title">
                    {hero?.title || 'Donate Items'}
                </Typography>
                <Typography variant="subtitle1" className="page-subtitle">
                    {hero?.subtitle || 'Help us by donating items'}
                </Typography>

                <div className="steps-wrapper">
                    {content?.steps?.map((step, index) => (
                        <Card key={index} className="step-card">
                            <CardContent>
                                <Typography variant="h2" className="step-number">
                                    {index + 1}
                                </Typography>
                                <Typography variant="h6" className="step-title">
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" className="step-description">
                                    {step.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Paper component="form" className="donation-form" onSubmit={handleSubmit}>
                    <Typography variant="h4" className="section-title">
                        Donation Details
                    </Typography>

                    <div className="form-grid-donate">
                        <TextField
                            className="custom-textfield custom-textfield-donation"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            className="custom-textfield custom-textfield-donation"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            className="custom-textfield custom-textfield-donation"
                            label="Contact Number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth className="custom-textfield custom-textfield-donation">
                            <TextField
                                select
                                label="Item Types"
                                name="itemType"
                                value={formData.itemType}
                                onChange={handleChange}
                                required
                                fullWidth
                                SelectProps={{
                                    multiple: true
                                }}
                            >
                                {itemTypes?.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                        <TextField
                            className="custom-textfield custom-textfield-donation"
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            className="custom-textfield custom-textfield-donation"
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
                            className="custom-textfield custom-textfield-donation"
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

                        <Button
                            type="submit"
                            variant="contained"
                            className="submit-button"
                            disabled={processing}
                            fullWidth
                        >
                            {processing ? (
                                <div className="button-content">
                                    <CircularProgress size={20} color="inherit" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Submit Donation'
                            )}
                        </Button>
                    </div>

                    {(success || error) && (
                        <div className={`status-container ${submitted ? 'fade-in' : ''}`}>
                            {success && (
                                <Alert
                                    severity="success"
                                    className="status-message"
                                    onClose={() => setSuccess(false)}
                                >
                                    <AlertTitle>Thank You!</AlertTitle>
                                    Your donation request has been received. We will contact you soon.
                                </Alert>
                            )}
                            {error && (
                                <Alert
                                    severity="error"
                                    className="status-message"
                                    onClose={() => setError(null)}
                                >
                                    <AlertTitle>Error</AlertTitle>
                                    {error}
                                </Alert>
                            )}
                        </div>
                    )}
                </Paper>
            </Box>
        </div>
    );
}
