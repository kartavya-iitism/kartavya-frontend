import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { Link } from "react-router-dom";
import { fetchContent } from '../../helper/contentFetcher';
import "./ImpactStory.css";
import founderImg from "/src/assets/amreshmishra.webp"

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/impactStory.json";

const ImpactStory = () => {
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

    const { hero, founder, story, cta } = content;

    return (
        <Box className="founding-story-section">
            <Container maxWidth="lg" style={{ padding: '0 0' }}>
                <Box className="story-header">
                    <Typography variant="h2" className="story-title" align="center" gutterBottom>
                        {hero.title}
                    </Typography>
                    <Typography variant="h5" className="story-subtitle" align="center" gutterBottom>
                        {hero.subtitle}
                    </Typography>
                </Box>

                <Paper elevation={0} className="story-content">
                    <Box className="founder-image-container">
                        <img
                            src={founderImg}
                            alt={founder.imageAlt}
                            className="founder-image"
                        />
                    </Box>

                    <Box className="story-text-content">
                        {story.paragraphs.map((paragraph, index) => (
                            <Typography key={index} variant="body1" paragraph className="story-paragraph">
                                {paragraph.highlights ?
                                    paragraph.text.split('{founderName}').map((part, i) =>
                                        i === 0 ? part : <><span key={i} className="highlight">{paragraph.highlights[0]}</span>{part.slice(1)}</>
                                    )
                                    : paragraph.text
                                }
                            </Typography>
                        ))}

                        <Box className="cta-container-founder">
                            <Link to={cta.link} style={{ textDecoration: 'none' }}>
                                {cta.text}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ImpactStory;