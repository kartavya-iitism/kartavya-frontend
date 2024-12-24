import { Container, Typography, Paper, Stack, Box } from '@mui/material';
import "./AboutMission.css";

const AboutMission = () => {
    return (
        <Box className="about_mission">
            <Container maxWidth="lg">
                <Box className="title-container">
                    <Typography
                        variant="h2"
                        className="main-title"
                        align="center"
                        gutterBottom
                    >
                        Kartavya
                    </Typography>

                    <Typography
                        variant="h4"
                        className="subtitle"
                        align="center"
                        gutterBottom
                    >
                        An Effort towards Educated India
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
                        Kartavya is a national non-profit voluntary organization (registered
                        under Societies Registration Act XXI, 1860 with registration no.
                        S/63750/2008) run by the students and the alumni of IIT (ISM) Dhanbad
                        and other associated colleges with the vision to equip the children of
                        slums with education, life skills and character that they need to lead
                        empowered lives.
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
                            Mission
                        </Typography>
                        <Typography variant="body1" className="card-content">
                            A world where everyone has an equal opportunity to
                            reach their full potential regardless of their background or
                            circumstances. A society where no one is deemed underprivileged.
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={3}
                        className="vision-card"
                        sx={{ flex: 1 }}
                    >
                        <Typography variant="h5" className="card-title">
                            Vision
                        </Typography>
                        <Typography variant="body1" className="card-content">
                            Upliftment of the underprivileged sections of society living in slums
                            by helping children reach their full potential by providing access to
                            education, health care, and other basic necessities; empowering women
                            and by eradicating social evils so that our help is no longer needed.
                        </Typography>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default AboutMission;