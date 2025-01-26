import { Box, Stack, Typography, Card, CardContent } from '@mui/material';
import "./Features.css";
import gift from "../../assets/gift.svg"
import idea from "../../assets/Idea.svg"
import laugh from "../../assets/laugh.svg"


const Features = () => {
    const content = {
        "features": [
            {
                "icon": gift,
                "title": "Gifts of Happiness",
                "description": "Unleashing pure happiness in children with delightful surprise gifts"
            },
            {
                "icon": idea,
                "title": "Creative Exploration",
                "description": "Enhancing the creative potential of children"
            },
            {
                "icon": laugh,
                "title": "Recreational Events",
                "description": "Engaging and connecting children with each other through fun events"
            }
        ]
    }
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