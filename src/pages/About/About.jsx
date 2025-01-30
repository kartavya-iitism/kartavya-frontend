import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Modal,
    Paper,
    Tab,
    Tabs,
    Typography,
    Button
} from '@mui/material';
import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import { fetchContent } from '../../helper/contentFetcher';
import { API_URL } from '../../config';
import './About.css';

const About_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/about.json"

const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleCloseModal = () => setSelectedImage(null);
    const [mediaContent, setMediaContent] = useState(null);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [mediaError, setMediaError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (err) {
            console.log(err)
            console.error('Invalid date format:', dateString);
            return dateString;
        }
    };

    useEffect(() => {
        const loadContent = async () => {
            try {
                const [contentData, mediaData] = await Promise.all([
                    fetchContent(About_URL),
                    axios.get(`${API_URL}/media/all`, {
                        headers: { Authorization: `Bearer ${localStorage.token}` }
                    })
                ]);
                setIsAdmin(localStorage.role === 'admin');
                setContent(contentData);
                setMediaContent(mediaData.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setMediaError('Please login to view media content');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
                setMediaLoading(false);
            }
        };
        loadContent();
    }, []);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            console.log(selectedForDelete._id)
            await axios.delete(`${API_URL}/media/delete/${selectedForDelete._id}`, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            setMediaContent(prev => ({
                ...prev,
                photos: prev.photos.filter(p => p.id !== selectedForDelete._id),
                videos: prev.videos.filter(v => v.id !== selectedForDelete._id)
            }));

            setDeleteDialog(false);
            setSelectedForDelete(null);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleting(false);
        }
    };
    const handleCloseDeleteDialog = async () => {
        setDeleteDialog(false);
        setTimeout(() => {
            setSelectedForDelete(null);
        }, 100);
        setDeleting(false);
    };

    const renderDeleteDialog = () => (
        <Dialog
            open={deleteDialog}
            onClose={handleCloseDeleteDialog}
            className="password-dialog"
            PaperProps={{
                className: "dialog-paper"
            }}
        >
            <DialogTitle className='dialog-title'>Confirm Delete</DialogTitle>
            <DialogContent className="dialog-content">
                Are you sure you want to delete this {selectedForDelete?.type || 'media'}?
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button
                    onClick={handleCloseDeleteDialog}
                    className="cancel-button"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    color="error"
                    disabled={deleting}
                    className="submit-button"
                >
                    {deleting ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const getVideoUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://www.youtube.com/embed/${url}`;
    };

    const parseTags = (tagsString) => {
        try {
            return JSON.parse(tagsString);
        } catch (err) {
            console.log(err)
            console.error('Invalid tags format:', tagsString);
            return [];
        }
    };

    if (loading) return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            <CircularProgress color="primary" />
        </Box>
    );

    if (error) return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            padding={2}
        >
            <Alert severity="error" variant="filled">
                {error}
            </Alert>
        </Box>
    );
    const { main, initiatives, support } = content;
    const media = mediaContent || { photos: [], videos: [] };


    return (
        <Box className="about-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        {main.title}
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        {main.subTitle}
                    </Typography>
                </Box>

                <Paper elevation={0} className="description-container">
                    <Typography variant="body1" className="description-text">
                        {main.description}
                    </Typography>
                </Paper>

                <div className="initiatives-wrapper">
                    {initiatives.map((initiative, index) => (
                        <Paper key={index} elevation={3} className="initiative-card">
                            <Typography variant="h5" className="card-title">
                                {initiative.title}
                            </Typography>
                            <Typography variant="body1" className="card-content">
                                {initiative.description}
                            </Typography>
                        </Paper>
                    ))}
                </div>

                <Box className="media-gallery-section">
                    {mediaLoading ? (
                        <CircularProgress />
                    ) : mediaError ? (
                        <Alert severity="warning">{mediaError}</Alert>
                    ) : (
                        <>
                            <Typography variant="h3" className="section-title" align="center">
                                Our Gallery
                            </Typography>
                            <Tabs
                                value={tab}
                                onChange={(e, newValue) => setTab(newValue)}
                                centered
                                className="media-tabs"
                            >
                                <Tab label="Photos" className="tab-button" />
                                <Tab label="Videos" className="tab-button" />
                            </Tabs>

                            {tab === 0 && (
                                <div className="photo-grid">
                                    {media?.photos?.map((photo, index) => (
                                        <Paper key={index} elevation={3} className="media-card" onClick={() => setSelectedImage(photo)}>
                                            {isAdmin && (
                                                <IconButton
                                                    className="delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedForDelete(photo);
                                                        setDeleteDialog(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                            <div className="media-image-wrapper">
                                                <img src={photo.url} alt={photo.title} loading="lazy" />
                                                <div className="image-overlay">
                                                    <Chip
                                                        label={photo.category}
                                                        className={`category-chip ${photo.category.toLowerCase()}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="media-content">
                                                <Typography variant="h6" className="media-title">
                                                    {photo.title}
                                                </Typography>
                                                <div className="media-metadata">
                                                    <CalendarTodayIcon fontSize="small" />
                                                    <Typography variant="body2" className="media-date">
                                                        {formatDate(photo.date)}
                                                    </Typography>
                                                </div>
                                                <div className="tags-container">
                                                    {parseTags(photo.tags).map((tag, i) => (
                                                        <Chip
                                                            key={i}
                                                            label={tag}
                                                            size="small"
                                                            className="tag-chip"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </Paper>
                                    ))}
                                </div>
                            )}

                            {tab === 1 && (
                                <div className="video-grid">
                                    {media?.videos?.map((video, index) => (
                                        <Paper key={index} elevation={3} className="media-card">
                                            {isAdmin && (
                                                <IconButton
                                                    className="delete-button"
                                                    onClick={() => {
                                                        setSelectedForDelete(video);
                                                        setDeleteDialog(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                            <div className="video-container">
                                                <iframe
                                                    src={getVideoUrl(video.url)}
                                                    title={`video-${index}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </Paper>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </Box>
                <Modal
                    open={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    className="image-modal"
                >
                    <div className="modal-content">
                        <IconButton
                            onClick={handleCloseModal}
                            className="modal-close"
                        >
                            <CloseIcon />
                        </IconButton>
                        {selectedImage && (
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                className="modal-image"
                            />
                        )}
                    </div>
                </Modal>


                <Paper elevation={3} className="support-card">
                    <Typography variant="h5" className="card-title">
                        {support.title}
                    </Typography>
                    <Typography variant="body1" className="card-content">
                        {support.description}
                    </Typography>
                </Paper>
            </Container>
            {renderDeleteDialog()}
        </Box>
    );
};

export default About;