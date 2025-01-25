import { Box, Paper, Typography, Container, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { School, EmojiEvents, Stars } from '@mui/icons-material';
import { CircularProgress, Alert } from '@mui/material';
import { API_URL } from '../../config';

import './NewsAchievement.css';

const NEWS_URL = `${API_URL}/news/all`;

const NewsAchievements = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch(NEWS_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                setContent(data);
            } catch (err) {
                setError("Failed to fetch data: " + err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    const getCategoryIcon = (category, style) => {
        switch (category) {
            case 'Academic Excellence':
                return <School style={style} />;
            case 'Competition':
                return <EmojiEvents style={style} />;
            default:
                return <Stars style={style} />;
        }
    };

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

    const { studentStories, academicMilestones, recentUpdates } = content;
    return (
        <Box className="news-container">
            <Container maxWidth="lg" className="content-box">
                {/* Title Section */}
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        Student Success Stories
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        Celebrating Academic Excellence
                    </Typography>
                </Box>

                {/* Achievement Cards */}
                <div className="news-grid">
                    {studentStories.map((item, index) => (
                        <Paper key={index} elevation={3} className="news-card">
                            <div className="news-image">
                                <img src={item.studentImage} alt={item.title} />
                                <Chip
                                    icon={getCategoryIcon(item.category, { color: "#ffffff" })}
                                    label={item.category}
                                    className={`category-chip ${item.category.toLowerCase().replace(' ', '-')}`}
                                />
                            </div>
                            <div className="news-content">
                                <div className="student-details">
                                    <div className="student-info">
                                        <Typography variant="h6" className="student-name">
                                            {item.studentName}
                                        </Typography>
                                        <Typography variant="body2" className="student-class">
                                            {item.class}
                                        </Typography>
                                    </div>
                                </div>
                                <Typography variant="h5" className="achievement-headline">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" className="achievement-date">
                                    {new Date(item.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </Typography>
                                <Typography variant="body1" className="achievement-details">
                                    {item.description}
                                </Typography>
                                {item.score && (
                                    <div className="score-badge">
                                        <Stars className="score-icon" />
                                        <Typography variant="h6">
                                            {item.score}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </Paper>
                    ))}
                </div>

                {/* Stats Section */}
                <Box className="achievements-section">
                    <Typography variant="h3" className="section-title" align="center">
                        Academic Milestones
                    </Typography>
                    <div className="achievements-grid">
                        {academicMilestones.map((achievement, index) => (
                            <Paper key={index} elevation={3} className="achievement-card">
                                <div className="achievement-icon">
                                    {getCategoryIcon(achievement.category, { fontSize: '2.5rem' })}
                                </div>
                                <Typography variant="h2" className="achievement-number">
                                    {achievement.number}
                                </Typography>
                                <Typography variant="h6" className="achievement-title">
                                    {achievement.title}
                                </Typography>
                                <Typography variant="body1" className="achievement-description">
                                    {achievement.description}
                                </Typography>
                            </Paper>
                        ))}
                    </div>
                </Box>

                {/* Timeline Section */}
                <Box className="recent-updates-section">
                    <Typography variant="h3" className="section-title" align="center">
                        Recent Updates
                    </Typography>
                    <div className="updates-grid">
                        {recentUpdates.map((update, index) => (
                            <Paper key={index} elevation={3} className="update-card">
                                <Typography variant="overline" className="update-date">
                                    {new Date(update.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </Typography>
                                {update.examType && (
                                    <Chip
                                        label={update.examType}
                                        size="small"
                                        className="exam-type-chip"
                                        sx={{ mb: 2 }}
                                    />
                                )}
                                <Typography variant="h6" className="update-title">
                                    {update.title}
                                </Typography>
                                <Typography variant="body1" className="update-description">
                                    {update.description}
                                </Typography>
                            </Paper>
                        ))}
                    </div>
                </Box>
            </Container>
        </Box>
    );
};

export default NewsAchievements;