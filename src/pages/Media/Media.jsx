import { Box, Container, Typography, Tabs, Tab, Paper, Chip, Modal, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './Media.css';

const Media = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageClick = (image) => setSelectedImage(image);
    const handleCloseModal = () => setSelectedImage(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                // const response = await fetch('/api/media');
                // const data = await response.json();
                const data = {
                    "photos": [
                        {
                            "id": "1",
                            "title": "Annual Day Celebration 2024",
                            "url": "https://example.com/images/annual-day-2024.jpg",
                            "thumbnail": "https://example.com/images/thumbnails/annual-day-2024.jpg",
                            "date": "2024-03-15",
                            "category": "Events",
                            "description": "Students performing at the annual day celebration",
                            "tags": ["cultural", "performance", "annual-day"]
                        },
                        {
                            "id": "2",
                            "title": "Science Exhibition Winners",
                            "url": "https://example.com/images/science-expo-2024.jpg",
                            "thumbnail": "https://example.com/images/thumbnails/science-expo-2024.jpg",
                            "date": "2024-02-20",
                            "category": "Academic",
                            "description": "Winners of the National Science Exhibition 2024",
                            "tags": ["science", "competition", "achievement"]
                        }
                    ],
                    "videos": [
                        {
                            "id": "1",
                            "url": "https://www.youtube.com/embed/VIDEO_ID_1"
                        },
                        {
                            "id": "2",
                            "url": "https://www.youtube.com/embed/VIDEO_ID_2"
                        }
                    ],
                    "categories": [
                        {
                            "name": "Events",
                            "color": "#1a4d2e"
                        },
                        {
                            "name": "Academic",
                            "color": "#437a1e"
                        },
                        {
                            "name": "Sports",
                            "color": "#86c540"
                        }
                    ]
                }
                setContent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress color="primary" />
        </Box>
    );

    if (error) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" padding={2}>
            <Alert severity="error" variant="filled">{error}</Alert>
        </Box>
    );

    return (
        <Box className="media-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-section">
                    <Typography variant="h2" className="main-title" align="center">
                        Our Gallery
                    </Typography>
                    <Typography variant="h5" className="subtitle" align="center">
                        Capturing Moments of Excellence
                    </Typography>
                </Box>

                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    centered
                    className="media-tabs"
                    TabIndicatorProps={{ className: "tab-indicator" }}
                >
                    <Tab label="Photos" className="tab-button" />
                    <Tab label="Videos" className="tab-button" />
                </Tabs>

                {tab === 0 && (
                    <div className="photo-grid">
                        {content?.photos?.map((photo, index) => (
                            <Paper key={index} elevation={3} className="media-card" onClick={() => handleImageClick(photo)}>
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
                                            {photo.date}
                                        </Typography>
                                    </div>
                                    <div className="tags-container">
                                        {photo.tags.map((tag, i) => (
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

                {/* Image Preview Modal */}
                <Modal
                    open={!!selectedImage}
                    onClose={handleCloseModal}
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

                {tab === 1 && (
                    <div className="video-grid">
                        {content?.videos?.map((video, index) => (
                            <Paper key={index} elevation={3} className="media-card">
                                <div className="video-container">
                                    <iframe
                                        src={video.url}
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
            </Container>
        </Box>
    );
};

export default Media;