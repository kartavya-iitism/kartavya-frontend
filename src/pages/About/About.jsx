import { Box, Paper, Typography, Container } from '@mui/material';
import { TwitterTimelineEmbed } from "react-twitter-embed";
import './About.css';

const About = () => {
    const initiatives = [
        {
            title: "Educational Programs",
            description: "Providing tutoring, computer literacy classes, and scholarships for underprivileged children."
        },
        {
            title: "Health Awareness",
            description: "Organizing health camps, awareness programs, and free medical check-ups for the community."
        },
        {
            title: "Environmental Care",
            description: "Conducting tree-planting drives and promoting eco-friendly practices in the community."
        }
    ];

    return (
        <Box className="about-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        About Kartavya
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        A student-led social organization at IIT (ISM) Dhanbad
                    </Typography>
                </Box>

                <Paper elevation={0} className="description-container">
                    <Typography variant="body1" className="description-text">
                        Kartavya is committed to promoting social welfare and community development
                        in and around the IIT (ISM) Dhanbad campus. We strive to make a positive
                        impact by addressing various social issues and providing a platform for
                        meaningful community service.
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
                                Video Gallery
                            </Typography>
                            <div className="video-container">
                                <iframe
                                    src="https://www.youtube.com/embed/TRjVbS-Gdak"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </Paper>

                        <Paper elevation={3} className="media-card">
                            <Typography variant="h5" className="card-title">
                                Social Media
                            </Typography>
                            <div className="twitter-container">
                                <TwitterTimelineEmbed
                                    sourceType="profile"
                                    screenName="Kartavyadhn"
                                    options={{ height: 400 }}
                                />
                            </div>
                        </Paper>
                    </Box>
                </Box>

                <Paper elevation={3} className="support-card">
                    <Typography variant="h5" className="card-title">
                        Support & Recognition
                    </Typography>
                    <Typography variant="body1" className="card-content">
                        Kartavya is powered by generous donations from alumni, faculty members,
                        and supporters. Our dedicated team of volunteers works tirelessly to
                        create positive change in our community.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default About;