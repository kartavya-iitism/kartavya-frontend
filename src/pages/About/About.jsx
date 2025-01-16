import { Box, Paper, Typography, Container } from '@mui/material';
import { TwitterTimelineEmbed } from "react-twitter-embed";
import './About.css';
import { useEffect, useState } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import { fetchContent } from '../../helper/contentFetcher';

const About_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/about.json"
const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchContent(About_URL);
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
    const { main, initiatives, media, support } = content;


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

                <Box className="media-section">
                    <Box className="media-grid">
                        <Paper elevation={3} className="media-card">
                            <Typography variant="h5" className="card-title">
                                {media.video.title}
                            </Typography>
                            <div className="video-container">
                                <iframe
                                    src={`https://www.youtube.com/embed/${media.video.youtubeId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </Paper>

                        <Paper elevation={3} className="media-card">
                            <Typography variant="h5" className="card-title">
                                {media.social.title}
                            </Typography>
                            <div className="twitter-container">
                                <TwitterTimelineEmbed
                                    sourceType="profile"
                                    screenName={media.social.twitterHandle}
                                    options={{ height: 400 }}
                                />
                            </div>
                        </Paper>
                    </Box>
                </Box>

                <Paper elevation={3} className="support-card">
                    <Typography variant="h5" className="card-title">
                        {support.title}
                    </Typography>
                    <Typography variant="body1" className="card-content">
                        {support.description}
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default About;