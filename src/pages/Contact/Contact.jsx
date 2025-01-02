import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar
} from '@mui/material';
import { LocationOn, Email, Phone } from '@mui/icons-material';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://sheet.best/api/sheets/61aa65a3-b56b-46b1-8336-539d644e626d",
                formData
            );
            if (response.status === 200) {
                setSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <Box className="contact-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        Contact Us
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        Get in touch with us
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} className="contact-info-card">
                            <LocationOn className="contact-icon" />
                            <Typography variant="h6" className="info-title">
                                Address
                            </Typography>
                            <Typography variant="body1" className="info-text">
                                Kartavya C-3, Mondal Basti, Dhaiya PO-ISM,
                                Dhanbad - 826004 (Jharkhand)
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} className="contact-info-card">
                            <Email className="contact-icon" />
                            <Typography variant="h6" className="info-title">
                                Email
                            </Typography>
                            <Typography variant="body1" className="info-text">
                                sponsor.kartavya@gmail.com
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} className="contact-info-card">
                            <Phone className="contact-icon" />
                            <Typography variant="h6" className="info-title">
                                Phone
                            </Typography>
                            <Typography variant="body1" className="info-text">
                                +91-9123258021
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={4} className="contact-section">
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.082469212406!2d86.43252181429825!3d23.815666292198365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6bca0c68a439f%3A0xb7aeed608c840d19!2sKartavya%20Center-3!5e0!3m2!1sen!2sin!4v1678824590782!5m2!1sen!2sin"
                                title="Kartavya Location"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} className="contact-form">
                            <Typography variant="h5" className="form-title">
                                Send Message
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    multiline
                                    rows={4}
                                    margin="normal"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="submit-button"
                                >
                                    Send Message
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
                    <Alert severity="success">
                        Message sent successfully!
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={error}
                    autoHideDuration={6000}
                    onClose={() => setError(false)}
                >
                    <Alert severity="error">
                        Failed to send message. Please try again.
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default Contact;