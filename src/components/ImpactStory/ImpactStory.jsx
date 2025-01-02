import { Container, Typography, Box, Paper } from '@mui/material';
import logo from "../../assets/amreshmishra.webp";
import "./ImpactStory.css";
import { Link } from "react-router-dom";

const ImpactStory = () => {
    return (
        <Box className="founding-story-section">
            <Container maxWidth="lg" style={{ padding: '0 0' }}>
                <Box className="story-header">
                    <Typography
                        variant="h2"
                        className="story-title"
                        align="center"
                        gutterBottom
                    >
                        Founding Story
                    </Typography>
                    <Typography
                        variant="h5"
                        className="story-subtitle"
                        align="center"
                        gutterBottom
                    >
                        A Journey That Led to New Beginnings
                    </Typography>
                </Box>

                <Paper elevation={0} className="story-content">
                    <Box className="founder-image-container">
                        <img
                            src={logo}
                            alt="Mr. Amresh Mishra - Founder of Kartavya"
                            className="founder-image"
                        />
                    </Box>

                    <Box className="story-text-content">
                        <Typography variant="body1" paragraph className="story-paragraph">
                            Kartavya was founded by a 1999 cohort of students of IIT ISM Dhanbad
                            led by <span className="highlight">Mr. Amresh Mishra</span>, who is an Indian Police Service
                            (IPS) officer. IIT(ISM) Dhanbad is surrounded by slums. The children
                            there used to gather around the hostels on campus and collect stale
                            food. They loitered in and around campus to collect garbage.
                        </Typography>

                        <Typography variant="body1" paragraph className="story-paragraph">
                            Mr. Amresh Mishra, along with some students of IIT(ISM) Dhanbad, decided
                            to start educating these children. Initially, its classes were held
                            in a temple in Lahbani Basti, Dhaiya. Later, it got its own
                            building. This was christened Centre 1 Dhanbad.
                        </Typography>

                        <Typography variant="body1" paragraph className="story-paragraph">
                            Initially, its target was childhood education. It expanded to address other
                            problems, including vocational training, woman&apos;s empowerment (with a
                            direction to remove social and economic inequalities), and health.
                        </Typography>

                        <Box className="cta-container">
                            <Link to="/about" style={{ textDecoration: 'none' }}>
                                Read More
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ImpactStory;