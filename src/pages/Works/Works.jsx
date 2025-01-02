import { Box, Paper, Typography, Container } from '@mui/material';
import { TwitterTimelineEmbed } from "react-twitter-embed";
import CardList from "../../components/Card/CardList";
import "./works.css";

const Works = () => {
    const worksList = [
        {
            title: "Education Support",
            description: "We provide regular tuition classes at the centers and get children admitted to good schools. In addition, we prepare students for competitive examinations like Jawahar Navodaya, JEE, and SSC, to name a few."
        },
        {
            title: "Co-curricular Activities",
            description: "We promote co-curricular activities among the children by providing karate classes. Kartavya Sports Meet(KSM) is conducted annually."
        },
        {
            title: "Annual Fest PRAKASH",
            description: "Our annual fest \"PRAKASH\" provides children the platform for numerous events including quizzes, dance, singing, poetry competition, science exhibitions, and martial arts demonstration."
        },
        {
            title: "Awareness Camps",
            description: "We set up awareness camps regarding social issues and health and well-being."
        },
        {
            title: "Vocational Training",
            description: "We provide vocational training to women at our sewing centers."
        }
    ];

    return (
        <>
            <Box className="works-container">
                <Container maxWidth="lg" className="content-box">
                    <Box className="title-container">
                        <Typography variant="h2" className="main-title" align="center">
                            Our Works
                        </Typography>
                        <Typography variant="h4" className="subtitle" align="center">
                            Making a difference in our community
                        </Typography>
                    </Box>

                    <div className="works-wrapper">
                        {worksList.map((work, index) => (
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

                </Container>

            </Box>
            <Box className="gallery-section">
                <CardList />
            </Box>
        </>
    );
};

export default Works;