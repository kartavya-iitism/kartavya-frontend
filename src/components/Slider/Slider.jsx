import { useState, useEffect } from 'react';
import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';
import { Box, CircularProgress, Alert } from '@mui/material';
import { fetchContent } from '../../helper/contentFetcher';
import './Slider.css';

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/slider.json";

function Slider() {
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

    const { settings, items } = content;

    return (
        <MDBCarousel
            showIndicators={settings.showIndicators}
            interval={settings.interval}
            touch={settings.touch}
            className={settings.className}
        >
            {items.map((item, index) => (
                <MDBCarouselItem
                    key={index}
                    className="carousel-item"
                    itemId={index + 1}
                >
                    <img
                        src={item.img}
                        className="d-block w-100 slider-image"
                        alt={item.alt || `Slide ${index + 1}`}
                        loading="eager"
                    />
                    <div className="carousel-caption">
                        <h2 className="slide-title">{item.title}</h2>
                        <p className="slide-description">{item.description}</p>
                    </div>
                </MDBCarouselItem>
            ))}
        </MDBCarousel>
    );
}

export default Slider;