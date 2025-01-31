import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    MenuItem,
    Alert,
    CircularProgress,
    Box
} from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import './AddDocuments.css';
import { API_URL } from '../../../config';

const AddDocuments = ({ open, onClose }) => {
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
                `${API_URL}/document/upload`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            className="document-dialog"
        >
            <DialogTitle className="dialog-title">
                Upload Document
            </DialogTitle>
            <DialogContent dividers>
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

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}
                </form>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button
                    onClick={onClose}
                    className="cancel-button"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    className="submit-button"
                    disabled={loading || !file}
                >
                    {loading ? <CircularProgress color='white' size={24} /> : 'Upload Document'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddDocuments.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

AddDocuments.displayName = 'AddDocuments';

export default AddDocuments;