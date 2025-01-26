import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { TwitterTimelineEmbed } from "react-twitter-embed";
import CardList from "../../components/Card/CardList";
import { fetchContent } from '../../helper/contentFetcher';
import { Timeline } from 'react-twitter-widgets';
import "./works.css";

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/works.json";

const Works = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [twitterLoaded, setTwitterLoaded] = useState(false);
    const [twitterError, setTwitterError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchContent(CONTENT_URL);
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

    const { hero, works, media } = content;

    return (
        <>
            <Box className="works-container">
                <Container maxWidth="lg" className="content-box">
                    <Box className="title-container">
                        <Typography variant="h2" className="main-title" align="center">
                            {hero.title}
                        </Typography>
                        <Typography variant="h4" className="subtitle" align="center">
                            {hero.subtitle}
                        </Typography>
                    </Box>

                    <div className="works-wrapper">
                        {works.map((work, index) => (
                            <Paper key={index} elevation={3} className="work-card">
                                <Typography variant="h5" className="card-title">
                                    {work.title}
                                </Typography>
                                <Typography variant="body1" className="card-content">
                                    {work.description}
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
                                    <Timeline
                                        dataSource={{
                                            sourceType: 'profile',
                                            screenName: media.social.twitterHandle
                                        }}
                                        options={{
                                            height: '400',
                                            ...media.social.twitterOptions
                                        }}
                                        onLoad={() => setTwitterLoaded(true)}
                                        onError={(error) => setTwitterError(error)}
                                        renderError={() => (
                                            <p>Could not load timeline</p>
                                        )}
                                    />
                                </div>
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box className="gallery-section">
                <CardList />
            </Box>
        </>
    );
};

export default Works;