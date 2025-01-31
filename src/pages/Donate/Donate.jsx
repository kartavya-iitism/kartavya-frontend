import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Card, CardContent, TextField, Button,
    CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';
import ConfirmDialog from '../../components/Dialogs/ConfirmDialog/ConfirmDialog';
import DateField from '../../components/DateField/DateField';
import { fetchContent } from '../../helper/contentFetcher';
import { API_URL } from '../../config';
import qr from "../../assets/qr.png"
import './Donate.css';

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/donate.json";

export default function DonationForm() {
    const [content, setContent] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [formData, setformData] = useState({
        extamount: '',
        donationDate: '',
        name: '',
        contactNumber: '',
        email: '',
        numChild: '',
        amount: ''
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [reciept, setReciept] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fileName, setFileName] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const DONATION_LIMITS = {
        LOGGED_IN: 100000000,
        GUEST: 5000
    };

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchContent(CONTENT_URL);
                setContent(data);
            } catch (err) {
                setPageError(err.message);
            } finally {
                setPageLoading(false);
            }
        };
        loadContent();

        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setformData({
            name: storedUser?.name || '',
            contactNumber: storedUser?.contactNumber || '',
            email: storedUser?.email || '',
            numChild: '',
            extamount: '',
            amount: '0',
            donationDate: today
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        const childAmount = parseInt(formData.numChild || 0) * content?.sponsorship.amountPerChild || 0;
        const extraAmount = parseInt(formData.extamount || 0);
        const totalAmount = childAmount + extraAmount;

        setformData(prev => ({
            ...prev,
            amount: totalAmount.toString()
        }));
    }, [formData.numChild, formData.extamount, content]);

    if (pageLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress color="primary" />
        </Box>
    );

    if (pageError) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" padding={2}>
            <Alert severity="error" variant="filled">{pageError}</Alert>
        </Box>
    );

    const handleOpenConfirm = (evt) => {
        evt.preventDefault();
        setOpenConfirmDialog(true);
    };

    const handleRecieptChange = (e) => {
        const file = e.target.files[0];
        setReciept(file);
        setFileName(file ? file.name : '');
    };

    const handleChange = (evt) => {
        const fieldName = evt.target.name;
        const value = evt.target.value;
        setformData((currdata) => ({
            ...currdata,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setOpenConfirmDialog(false);
        setLoading(true);
        setSuccess(false);
        setError(false);

        if (!localStorage.token && Number(formData.amount) > DONATION_LIMITS.GUEST) {
            setLoading(false);
            setError(true);
            setErrorMessage('Guest users can only donate up to ₹5,000. Please login to donate more.');
            return;
        }

        if (localStorage.token && Number(formData.amount) > DONATION_LIMITS.LOGGED_IN) {
            setLoading(false);
            setError(true);
            setErrorMessage('Maximum donation amount is ₹5,00,000.');
            return;
        }

        const formDataToSend = new FormData();
        for (let prop in formData) {
            formDataToSend.append(prop, formData[prop]);
        }
        if (reciept) {
            formDataToSend.append('reciept', reciept, reciept.name);
        }

        try {
            const response = await axios.post(
                `${API_URL}/donation/new`,
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            setLoading(false);
            if (response.status === 201) {
                setSuccess(true);
            } else {
                setError(true);
                setErrorMessage(response.data.message);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMessage(err.response?.data?.message || 'An error occurred');
        }
    };

    const { hero, steps, payment, form, messages, sponsorship } = content;

    return (
        <div className="donation-container">
            <Box className="form-box donation-main">
                <Typography variant="h3" className="page-title">
                    {hero.title}
                </Typography>
                <Typography variant="subtitle1" className="page-subtitle">
                    {hero.subtitle}
                    {!localStorage.getItem('token') && (
                        <p className='page-subtitle-2'>
                            {hero.registerPrompt.text}
                            <a href={hero.registerPrompt.linkUrl} className="register-link">
                                {` `}{hero.registerPrompt.linkText}
                            </a>
                        </p>
                    )}
                </Typography>

                <div className="steps-wrapper">
                    {steps.map((step, index) => (
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

                <Paper elevation={3} className="payment-details">
                    <Typography variant="h4" className="section-title">
                        {payment.title}
                    </Typography>

                    <Box className="payment-grid">
                        <div className="bank-details">
                            {payment.bankDetails.map((detail, index) => (
                                <Card key={index} className="bank-detail-card">
                                    <CardContent className="bank-detail-content">
                                        <Typography className="detail-label">
                                            {detail.label}
                                        </Typography>
                                        <Typography className="detail-value">
                                            {detail.value}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="qr-section">
                            <Typography variant="h6" className="qr-title">
                                {payment.qr.title}
                            </Typography>
                            <img src={qr} alt={payment.qr.alt} className="qr-code" />
                        </div>
                    </Box>
                </Paper>

                <Paper component="form" className="donation-form" onSubmit={handleOpenConfirm}>
                    <Typography variant="h4" className="form-title section-title">
                        {form.title}
                    </Typography>

                    <div className="form-grid-donate">
                        {[
                            { name: 'name', label: 'Name', type: 'text', required: true },
                            { name: 'email', label: 'Email', type: 'email', required: true },
                            { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
                            { component: DateField, name: 'donationDate', label: 'Date of Donation', required: true },
                            { name: 'numChild', label: 'Number of Children', type: 'number', required: false },
                            { name: 'extamount', label: 'Extra Amount', type: 'number', required: true }
                        ].map((field) => (
                            field.component ? (
                                <field.component
                                    key={field.name}
                                    className="custom-textfield custom-textfield-donation"
                                    name={field.name}
                                    label={field.label}
                                    required={field.required}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                            ) : (
                                <TextField
                                    key={field.name}
                                    className="custom-textfield custom-textfield-donation"
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    required={field.required}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            )
                        ))}

                        <TextField
                            label={sponsorship.labels.sponsorshipAmount}
                            className="custom-textfield custom-textfield-donation"
                            disabled
                            value={`₹${(parseInt(formData.numChild || 0) * sponsorship.amountPerChild).toLocaleString('en-IN')}`}
                            helperText={sponsorship.helperText.sponsorship}
                        />
                        <TextField
                            label={sponsorship.labels.totalAmount}
                            name='amount'
                            className="custom-textfield custom-textfield-donation"
                            disabled
                            value={`₹${parseInt(formData.amount || 0).toLocaleString('en-IN')}`}
                            helperText={sponsorship.helperText.total}
                        />

                        <div className="file-input-container">
                            <label className="file-input-label">
                                {fileName || form.uploadLabel}
                                <input
                                    type="file"
                                    onChange={handleRecieptChange}
                                    accept="image/*,.pdf"
                                    className="file-input"
                                />
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="button-text">Submit</span>
                                    <CircularProgress size={24} className="button-loader" />
                                </>
                            ) : (
                                'Complete Donation'
                            )}
                        </Button>


                    </div>
                    {loading && (
                        <div className="status-message loading-message">
                            <CircularProgress size={20} />
                            Processing donation...
                        </div>
                    )}
                    {success && (
                        <div className="status-message success-message">
                            {messages.success}
                        </div>
                    )}
                    {error && (
                        <div className="status-message error-message">
                            {errorMessage}
                        </div>
                    )}
                </Paper>
            </Box>

            <ConfirmDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={handleSubmit}
                formData={formData}
                loading={loading}
            />
        </div>
    );
}