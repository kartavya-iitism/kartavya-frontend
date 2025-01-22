import { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import Card from "./Card";
import { fetchContent } from '../../helper/contentFetcher';
import "./Card.css";

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/cardList.json";

const CardList = () => {
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
        <div className="cardPile">
            {content.cards.map((card, index) => (
                <Card
                    key={index}
                    image={card.image}
                    title={card.title}
                    to={card.to}
                    bg={card.backgroundColor}
                />
            ))}
        </div>
    );
};

export default CardList;