// the general donation page
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

export default function DonationForm() {
    const [formData, setformData] = useState({
        amount: '',
        donationDate: '',
        name: '',
        contactNumber: '',
        email: '',
        numChild: ''
    });
    const [reciept, setReciept] = useState()
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleRecieptChange = (e) => {
        console.log(e.target.files)
        setReciept(e.target.files[0]);
    }
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
        const ReactFormData = new FormData();
        for (let prop in formData) {
            ReactFormData.append(prop, formData[prop]);
        }
        ReactFormData.append('reciept', reciept, reciept.name);
        console.log(ReactFormData);
        try {
            const response = await axios.post(
                `http://localhost:3000/donation`,
                ReactFormData,
                {
                    headers: {
                        'Content-Type': `multipart/form-data`,
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
            setErrorMessage(err.response.data.message);
        }
    };
    useEffect(() => {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setformData({
            name: storedUser ? storedUser.name : '',
            contactNumber: storedUser ? storedUser.contactNumber : '',
            email: storedUser ? storedUser.email : '',
            numChild: '',
            amount: '',
            donationDate: ''
        })
        setLoading(false);
    }, []);




    return (
        <div className="donation-form-container">
            <Box
                className="form-box"
                component="form"
                noValidate
                autoComplete="off"
                style={{ margin: "2.5%" }}
            >
                <h1>Donate</h1>
                <TextField
                    required
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Date of Donation"
                    name="donationDate"
                    value={formData.donationDate}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    required
                    label="Amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <div>
                    <input
                        type="file"
                        className="form-control"
                        id="material"
                        name="material"
                        onChange={handleRecieptChange}
                    />
                </div>
                <TextField
                    required
                    label="Number of Children"
                    name="numChild"
                    value={formData.numChild}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px' }}
                />
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                >
                    Donate
                </Button>
                {success && <div>Login Successful</div>}
                {error && <div>{errorMessage}</div>}
                {loading && <div>Please Wait...</div>}
                <div className="new-user">
                    <p>Don&apos;t have an account?
                        <a href="/register" className="register-link">Register</a>
                    </p>
                </div>
            </Box>
        </div>

    );
}