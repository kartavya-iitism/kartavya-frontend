import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { fetchContent } from '../../helper/contentFetcher';
import { CircularProgress, Alert } from '@mui/material';
import './FAQ.css';

const FAQ_URL = 'https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/faq.json';
const FAQ = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchContent(FAQ_URL);
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

    const { main, contactCard, faqs } = content;
    return (
        <Box className="faq-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        {main.heading}
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        {main.subHeading}
                    </Typography>
                </Box>

                <Paper elevation={0} className="description-container">
                    <Typography variant="body1" className="description-text">
                        {main.description}
                    </Typography>
                </Paper>

                <div className="faq-wrapper">
                    {faqs.map((faq, index) => (
                        <Accordion key={index} className="faq-accordion">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className="accordion-summary"
                            >
                                <Typography variant="h6" className="question-text">
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                <Typography variant="body1" className="answer-text">
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                <Paper elevation={3} className="contact-card">
                    <Typography variant="h5" className="card-title">
                        {contactCard.heading}
                    </Typography>
                    <Typography variant="body1" className="card-content">
                        {contactCard.description}
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default FAQ;