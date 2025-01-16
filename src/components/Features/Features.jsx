import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { fetchContent } from '../../helper/contentFetcher';
import "./Features.css";

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/features.json";

const Features = () => {
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

    return (
        <Box className="features-section">
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                className="features-stack"
            >
                {content.features.map((feature, index) => (
                    <Box key={index} flex={1}>
                        <Card className="feature-card">
                            <CardContent>
                                <Box className="icon-wrapper">
                                    <img src={feature.icon} alt={feature.title} />
                                </Box>
                                <Typography variant="h5" className="feature-title">
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" className="feature-description">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default Features;