import { Box, Stack, Typography, Card, CardContent } from '@mui/material';
import "./Features.css";


const Features = () => {
    const content = {
        "features": [
            {
                "icon": "/src/assets/gift.svg",
                "title": "Gifts of Happiness",
                "description": "Unleashing pure happiness in children with delightful surprise gifts"
            },
            {
                "icon": "/src/assets/Idea.svg",
                "title": "Creative Exploration",
                "description": "Enhancing the creative potential of children"
            },
            {
                "icon": "/src/assets/laugh.svg",
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