import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import QRCode from '../../assets/qrcode.png';
import axios from 'axios';
import './Donate.css';

export default function DonationForm() {
    const [formData, setformData] = useState({
        amount: '',
        donationDate: '',
        name: '',
        contactNumber: '',
        email: '',
        numChild: ''
    });
    const donationSteps = [
        {
            title: "Choose Amount",
            description: "Select how much you'd like to donate to support our cause"
        },
        {
            title: "Make Payment",
            description: "Transfer the amount using our bank details or scan QR code"
        },
        {
            title: "Fill Details",
            description: "Complete the form with your information and upload payment receipt"
        }
    ];
    const [receipt, setReceipt] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fileName, setFileName] = useState('');

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        setReceipt(file);
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
        setLoading(true);
        setSuccess(false);
        setError(false);
        if (Number(formData.amount) > 5000) {
            console.log("HII")
            setLoading(false)
            setError(true)
            setErrorMessage("Please register yourself to donate large amounts.")
            return;
        }

        const formDataToSend = new FormData();
        for (let prop in formData) {
            formDataToSend.append(prop, formData[prop]);
        }
        if (receipt) {
            formDataToSend.append('receipt', receipt, receipt.name);
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/donation/new`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
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

    useEffect(() => {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setformData({
            name: storedUser?.name || '',
            contactNumber: storedUser?.contactNumber || '',
            email: storedUser?.email || '',
            numChild: '',
            amount: '',
            donationDate: ''
        });
        setLoading(false);
    }, []);

    return (
        <div className="donation-container">
            <Box className="form-box donation-main">
                <Typography variant="h3" className="page-title">
                    Make a Difference Today
                </Typography>
                <Typography variant="subtitle1" className="page-subtitle">
                    Your contribution helps create a better future for children in need.
                    If you wish to donate regularly consider registering to our portal. Click to
                    <a href="/register" className="register-link"> Register</a>
                </Typography>
                <div className="steps-wrapper">
                    {donationSteps.map((step, index) => (
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
                        Payment Information
                    </Typography>

                    <Box className="payment-grid">
                        <div className="bank-details">
                            {[
                                { label: 'Account Name', value: 'Kartavya Foundation' },
                                { label: 'Account Number', value: '1234567890' },
                                { label: 'IFSC Code', value: 'ABCD0123456' },
                                { label: 'Bank Name', value: 'State Bank of India' },
                                { label: 'Branch', value: 'Main Branch, City' }
                            ].map((detail, index) => (
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
                                Scan to Pay
                            </Typography>
                            <img src={QRCode} alt="Payment QR Code" className="qr-code" />
                        </div>
                    </Box>
                </Paper>

                <Paper component="form" className="donation-form" onSubmit={handleSubmit}>
                    <Typography variant="h4" className="form-title section-title">
                        Donation Details
                    </Typography>

                    <div className="form-grid">
                        {[
                            { name: 'name', label: 'Name', type: 'text', required: true },
                            { name: 'email', label: 'Email', type: 'email', required: true },
                            { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
                            { name: 'donationDate', label: 'Date of Donation', type: 'date', required: true, shrink: true },
                            { name: 'amount', label: 'Amount', type: 'number', required: true },
                            { name: 'numChild', label: 'Number of Children', type: 'number', required: false }
                        ].map((field) => (
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
                                InputLabelProps={{
                                    shrink: field.shrink || undefined,
                                }}
                            />
                        ))}

                        <div className="file-input-container">
                            <label className="file-input-label">
                                {fileName || 'Upload Payment Receipt'}
                                <input
                                    type="file"
                                    onChange={handleReceiptChange}
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
                            {loading ? 'Processing...' : 'Complete Donation'}
                        </Button>
                    </div>

                    {success && (
                        <div className="status-message success-message">
                            Thank you for your generous donation! We&apos;ll get in touch soon.
                        </div>
                    )}
                    {error && (
                        <div className="status-message error-message">
                            {errorMessage}
                        </div>
                    )}
                </Paper>
            </Box>
        </div>
    );
}