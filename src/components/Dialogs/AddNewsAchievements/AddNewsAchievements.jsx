import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { API_URL } from '../../../config';
import axios from 'axios';
import './AddNewsAchievements.css';

const AddNewsAchievements = ({ open, onClose }) => {
    const [formType, setFormType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [studentImage, setStudentImage] = useState();
    const formTypes = [
        { value: 'story', label: 'Student Success Story' },
        { value: 'milestone', label: 'Academic Milestone' },
        { value: 'update', label: 'Recent Update' }
    ];

    const categories = ['Academic Excellence', 'Competition', 'Other'];
    const [storyForm, setStoryForm] = useState({
        studentName: '',
        category: '',
        title: '',
        description: '',
        class: '',
        date: '',
        score: ''
    });

    const handleImageChange = (e) => {
        setStudentImage(e.target.files[0]);
    };

    const [milestoneForm, setMilestoneForm] = useState({
        category: '',
        number: '',
        title: '',
        description: ''
    });

    const [updateForm, setUpdateForm] = useState({
        date: '',
        examType: '',
        title: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        let currentForm;

        switch (formType) {
            case 'story':
                currentForm = storyForm;
                break;
            case 'milestone':
                currentForm = milestoneForm;
                break;
            case 'update':
                currentForm = updateForm;
                break;
            default:
                return;
        }

        Object.keys(currentForm).forEach(key => {
            formData.append(key, currentForm[key]);
        });
        formData.append('type', formType);
        if (studentImage && formType === 'story') {
            formData.append('studentImage', studentImage, studentImage?.name);
        }

        try {
            const response = await axios.post(
                `${API_URL}/news/add`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 201) {
                setSuccess('Content added successfully!');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            console.log(formData)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add content');
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => {
        switch (formType) {
            case 'story':
                return (
                    <Box component="form" className="form-grid">
                        <div className="file-input-container">
                            <label className="file-input-label">
                                {studentImage?.name || 'Upload Student Image'}
                                <input
                                    type="file"
                                    className="file-input"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        <TextField
                            label="Student Name"
                            value={storyForm.studentName}
                            onChange={(e) => setStoryForm({ ...storyForm, studentName: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="Category"
                            name="category"
                            value={storyForm.category}
                            onChange={(e) => setStoryForm({ ...storyForm, category: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                            required
                        >
                            {categories.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Achievement Title"
                            name="title"
                            value={storyForm.title}
                            onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={storyForm.description}
                            onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                            multiline
                            rows={4}
                            className="custom-textfield"
                            fullWidth
                        />
                        <TextField
                            label="Class"
                            name="class"
                            value={storyForm.class}
                            onChange={(e) => setStoryForm({ ...storyForm, class: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                        />
                        <TextField
                            label="Score/Achievement"
                            name="score"
                            value={storyForm.score}
                            onChange={(e) => setStoryForm({ ...storyForm, score: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="Date"
                            name="date"
                            value={storyForm.date}
                            onChange={(e) => setStoryForm({ ...storyForm, date: e.target.value })}
                            className="custom-textfield"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                    </Box>
                );
            case 'milestone':
                return (
                    <Box component="form" className="form-grid">
                        <TextField
                            label="Achievement Number"
                            value={milestoneForm.number}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, number: e.target.value })}
                            className="custom-textfield"
                            type="number"
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="Category"
                            name="category"
                            value={milestoneForm.category}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, category: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                            required
                        >
                            {categories.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Title"
                            value={milestoneForm.title}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={milestoneForm.description}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                            multiline
                            rows={4}
                            className="custom-textfield"
                            fullWidth
                        />
                    </Box>
                );
            case 'update':
                return (
                    <Box component="form" className="form-grid">
                        <TextField
                            type="date"
                            label="Date"
                            value={updateForm.date}
                            onChange={(e) => setUpdateForm({ ...updateForm, date: e.target.value })}
                            className="custom-textfield"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Exam Type"
                            value={updateForm.examType}
                            onChange={(e) => setUpdateForm({ ...updateForm, examType: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                        />
                        <TextField
                            label="Title"
                            value={updateForm.title}
                            onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                            className="custom-textfield"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={updateForm.description}
                            onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                            multiline
                            rows={4}
                            className="custom-textfield"
                            fullWidth
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            className="achievement-dialog"
        >
            <DialogTitle className="dialog-title">
                Add New Content
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    select
                    label="Content Type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="custom-textfield type-selector"
                    fullWidth
                    required
                >
                    {formTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                {renderForm()}

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} className="cancel-button">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    className="submit-button"
                    disabled={loading || !formType}
                >
                    {loading ? <CircularProgress color='white' size={24} /> : 'Add Content'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddNewsAchievements.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AddNewsAchievements;