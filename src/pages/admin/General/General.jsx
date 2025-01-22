import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import './General.css';

const General = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileName, setFileName] = useState('');

    const documentTypes = [
        'Annual Report',
        'Financial Statement',
        'Meeting Minutes',
        'Legal Document',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('document', file);

        try {
            const response = await axios.post(
                'http://localhost:3000/api/documents',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess('Document uploaded successfully!');
                setFormData({ title: '', description: '', type: '' });
                setFile(null);
                setFileName('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="document-upload-container">
            <Box className="form-box">
                <Paper elevation={3} className="upload-form">
                    <Typography variant="h2" className="page-title">
                        Upload Document
                    </Typography>

                    <form onSubmit={handleSubmit} className="form-grid">
                        <TextField
                            className="custom-textfield"
                            name="title"
                            label="Document Title"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth>
                            <TextField
                                select
                                className="custom-textfield"
                                name="type"
                                label="Document Type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                fullWidth
                            >
                                {documentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>

                        <TextField
                            className="custom-textfield"
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            style={{ gridColumn: '1 / -1' }}
                        />

                        <Box className="file-input-container">
                            <input
                                type="file"
                                id="document-upload"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept=".pdf,.doc,.docx"
                            />
                            <label htmlFor="document-upload" className="file-input-label">
                                {fileName || 'Choose File'}
                            </label>
                        </Box>

                        <Button
                            variant="contained"
                            className="submit-button"
                            disabled={loading || !file}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Upload Document'}
                        </Button>
                    </form>

                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default General;