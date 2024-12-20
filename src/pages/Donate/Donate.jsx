import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
        <div className="donation-form-container">
            <Box
                className="form-box"
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <h1>Make a Donation</h1>

                {[
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
                    { name: 'donationDate', label: 'Date of Donation', type: 'date', shrink: true, required: true },
                    { name: 'amount', label: 'Amount', type: 'number', required: true },
                    { name: 'numChild', label: 'Number of Children', type: 'number', required: false }
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
                        InputLabelProps={{
                            shrink: field.shrink || undefined,
                        }}
                    />
                ))}

                <div className="file-input-container">
                    <label className="file-input-label">
                        {fileName || 'Upload Receipt'}
                        <input
                            type="file"
                            className="file-input"
                            onChange={handleReceiptChange}
                            accept="image/*,.pdf"
                        />
                    </label>
                </div>

                <Button
                    className="submit-button"
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Make Donation'}
                </Button>

                {success && (
                    <div className="status-message success-message">
                        Thank you for your donation! We&apos;ll get in touch soon.
                    </div>
                )}
                {error && (
                    <div className="status-message error-message">
                        {errorMessage}
                    </div>
                )}
                {loading && (
                    <div className="status-message loading-message">
                        Processing your donation...
                    </div>
                )}

                <div className="new-user">
                    <p>
                        Don&apos;t have an account?
                        <a href="/register" className="register-link">Register</a>
                    </p>
                </div>
            </Box>
        </div>
    );
}