import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Stack, Box, CircularProgress, Alert } from '@mui/material';
import { fetchContent } from '../../helper/contentFetcher';
import "./AboutMission.css";

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/aboutMission.json";

const AboutMission = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const { hero, description, cards } = content;

    return (
        <Box className="about_mission">
            <Container maxWidth="lg" className='top-container'>
                <Box className="title-container">
                    <Typography
                        variant="h2"
                        className="main-title"
                        align="center"
                        gutterBottom
                    >
                        {hero.title}
                    </Typography>

                    <Typography
                        variant="h4"
                        className="subtitle"
                        align="center"
                        gutterBottom
                    >
                        {hero.subtitle}
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    className="description-container"
                >
                    <Typography
                        variant="body1"
                        className="description-text"
                    >
                        {description.text}
                    </Typography>
                </Paper>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    className="cards-container"
                >
                    <Paper
                        elevation={3}
                        className="mission-card"
                        sx={{ flex: 1 }}
                    >
                        <Typography variant="h5" className="card-title">
                            {cards.mission.title}
                        </Typography>
                        <Typography variant="body1" className="card-content">
                            {cards.mission.content}
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={3}
                        className="vision-card"
                        sx={{ flex: 1 }}
                    >
                        <Typography variant="h5" className="card-title">
                            {cards.vision.title}
                        </Typography>
                        <Typography variant="body1" className="card-content">
                            {cards.vision.content}
                        </Typography>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default AboutMission;