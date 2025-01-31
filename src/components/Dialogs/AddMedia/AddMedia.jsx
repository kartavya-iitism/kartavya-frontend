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
    Box,
    Chip,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import './AddMedia.css';
import { API_URL } from '../../../config';

const AddMedia = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'photo',
        tags: [],
        url: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileName, setFileName] = useState('');
    const [tagInput, setTagInput] = useState('');

    const YoutubeHelp = () => (
        <Box className="youtube-help" component="section">
            <Typography variant="subtitle2" gutterBottom>
                How to get YouTube embed link:
            </Typography>
            <Typography component="div">
                <ol>
                    <li>Go to YouTube video</li>
                    <li>Click Share</li>
                    <li>Click Embed</li>
                    <li>Copy the src URL from iframe code</li>
                </ol>
            </Typography>
        </Box>
    );

    const mediaCategories = ['Events', 'Academic', 'Cultural', 'Sports', 'Other'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            setFormData(prev => ({
                ...prev,
                tags: [...new Set([...prev.tags, tagInput.trim().toLowerCase()])]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
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
        Object.keys(formData).forEach(key => {
            if (key === 'tags') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });
        formDataToSend.append('media', file);

        try {
            await axios.post(
                `${API_URL}/media/add`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.token}`
                    }
                }
            );

            setSuccess('Media uploaded successfully!');
            setFormData({
                title: '',
                description: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                type: 'photo',
                tags: []
            });
            setFile(null);
            setFileName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload media');
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
            className="media-dialog"
        >
            <DialogTitle className="dialog-title">
                Upload Media
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit} className="form-grid">
                    <FormControl fullWidth>
                        <TextField
                            select
                            className="custom-textfield"
                            name="type"
                            label="Media Type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="photo">Photo</MenuItem>
                            <MenuItem value="video">Video</MenuItem>
                        </TextField>
                    </FormControl>

                    <TextField
                        className="custom-textfield"
                        name="title"
                        label="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <TextField
                            select
                            className="custom-textfield"
                            name="category"
                            label="Category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            {mediaCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <TextField
                        className="custom-textfield"
                        name="date"
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

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

                    <Box className="tags-input-container" style={{ gridColumn: '1 / -1' }}>
                        <TextField
                            className="custom-textfield"
                            label="Add Tags (Press Enter)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            fullWidth
                        />
                        <Box className="tags-container">
                            {formData.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleRemoveTag(tag)}
                                    className="tag-chip"
                                />
                            ))}
                        </Box>
                    </Box>

                    {formData.type === 'photo' ? (
                        <Box className="file-input-container">
                            <input
                                type="file"
                                id="media-upload"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                            <label htmlFor="media-upload" className="file-input-label">
                                {fileName || 'Choose Image'}
                            </label>
                        </Box>
                    ) : (
                        <TextField
                            className="custom-textfield"
                            name="url"
                            label="YouTube Embed URL"
                            value={formData.url}
                            onChange={handleChange}
                            fullWidth
                            required
                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                            FormHelperTextProps={{
                                component: 'div'
                            }}
                            helperText={<YoutubeHelp />}
                        />
                    )}
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                </form>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} className="cancel-button">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? <CircularProgress color='white' size={24} /> : 'Upload Media'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddMedia.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AddMedia;