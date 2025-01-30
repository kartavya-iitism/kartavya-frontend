import { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, TextField,
    Button, Grid, Alert, Snackbar, CircularProgress
} from '@mui/material';
import { LocationOn, Email, Phone } from '@mui/icons-material';
import axios from 'axios';
import { fetchContent } from '../../helper/contentFetcher';
import './Contact.css';
import { API_URL } from '../../config';

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/contact.json";

const Contact = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', subject: '', message: '', contactNumber: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchContent(CONTENT_URL);
                setContent(data);
            } catch (err) {
                setLoadError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress color="primary" />
        </Box>
    );

    if (loadError) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" padding={2}>
            <Alert severity="error" variant="filled">{loadError}</Alert>
        </Box>
    );

    const { hero, contactInfo, form, map, alerts } = content;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await axios.post(`${API_URL}/contact/submit`, formData);
            if (response.status === 201) {
                setSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '', contactNumber: '' });
            }
        } catch (err) {
            console.log(err);
            setError(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box className="contact-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        {hero.title}
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        {hero.subtitle}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {Object.entries(contactInfo).map(([key, info]) => (
                        <Grid item xs={12} md={4} key={key}>
                            <Paper elevation={3} className="contact-info-card">
                                {key === 'address' && <LocationOn className="contact-icon" />}
                                {key === 'email' && <Email className="contact-icon" />}
                                {key === 'phone' && <Phone className="contact-icon" />}
                                <Typography variant="h6" className="info-title">
                                    {info.title}
                                </Typography>
                                <Typography variant="body1" className="info-text">
                                    {info.text}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={4} className="contact-section">
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} className="map-container">
                            <iframe
                                src={map.src}
                                title={map.title}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} className="contact-form">
                            <Typography variant="h5" className="form-title">
                                {form.title}
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                {Object.entries(form.fields).map(([fieldName, field]) => (
                                    <TextField
                                        key={fieldName}
                                        fullWidth
                                        label={field.label}
                                        name={fieldName}
                                        type={field.type}
                                        value={formData[fieldName]}
                                        onChange={handleChange}
                                        required={field.required}
                                        multiline={field.type === 'textarea'}
                                        rows={field.rows}
                                        margin="normal"
                                        disabled={submitting}
                                    />
                                ))}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="submit-button"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        </>
                                    ) : form.submitButton}
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>

                <Snackbar
                    open={success}
                    autoHideDuration={6000}
                    onClose={() => setSuccess(false)}
                >
                    <Alert severity="success">{alerts.success.message}</Alert>
                </Snackbar>

                <Snackbar
                    open={error}
                    autoHideDuration={6000}
                    onClose={() => setError(false)}
                >
                    <Alert severity="error">{alerts.error.message}</Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default Contact;