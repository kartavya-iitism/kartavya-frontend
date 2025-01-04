import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Stack, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [userStats, setUserStats] = useState({
        totalDonations: 0,
        childrenSponsored: 0,
        lastDonation: null,
        recentDonations: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/dashboard', {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                });
                setUserStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const impactMetrics = [
        {
            title: "Total Donated",
            value: `₹${userStats.totalDonations.toLocaleString('en-IN')}`,
            description: "Your generous contributions"
        },
        {
            title: "Children Sponsored",
            value: userStats.childrenSponsored,
            description: "Lives you've impacted"
        },
        {
            title: "Recent Activity",
            value: userStats.recentDonations.length,
            description: "Donations in last 30 days"
        }
    ];

    return (
        <Box className="dashboard-container">
            <Container maxWidth="lg">
                <Box className="welcome-banner">
                    <Typography variant="h2" className="welcome-title">
                        Welcome Back!
                    </Typography>
                    <Typography variant="h5" className="welcome-subtitle">
                        Your Impact Dashboard
                    </Typography>
                </Box>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    sx={{ mb: 4 }}
                >
                    {impactMetrics.map((metric, index) => (
                        <Card key={index} className="metric-card" sx={{ flex: 1 }}>
                            <CardContent>
                                <Typography variant="h3" className="metric-value">
                                    {metric.value}
                                </Typography>
                                <Typography variant="h6" className="metric-title">
                                    {metric.title}
                                </Typography>
                                <Typography variant="body2" className="metric-description">
                                    {metric.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    className="dashboard-actions"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        width: '100%',
                        margin: '0 auto'
                    }}
                >
                    <Paper className="action-card donate-card">
                        <Typography variant="h4" className="card-title">
                            Make a New Donation
                        </Typography>
                        <Typography variant="body1" className="card-content">
                            Continue supporting our mission to educate and empower
                        </Typography>
                        <Button
                            component={Link}
                            to="/donate"
                            className="action-button donate-button"
                        >
                            Donate Now
                        </Button>
                    </Paper>

                    <Paper className="action-card profile-card">
                        <Typography variant="h4" className="card-title">
                            Your Profile
                        </Typography>
                        <Typography variant="body1" className="card-content">
                            View and update your account details
                        </Typography>
                        <Button
                            component={Link}
                            to="/user/profile"
                            className="action-button profile-button"
                        >
                            View Profile
                        </Button>
                    </Paper>
                </Stack>

                <Paper className="recent-donations">
                    <Typography variant="h4" className="section-title">
                        Recent Donations
                    </Typography>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={3}
                        className="donations-list"
                    >
                        {userStats.recentDonations.map((donation, index) => (
                            <Card
                                key={index}
                                className="donation-item"
                                sx={{
                                    flex: {
                                        xs: '1 1 100%',
                                        sm: '1 1 calc(50% - 24px)',
                                        md: '1 1 calc(33.333% - 24px)'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        ₹{donation.amount.toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(donation.date).toLocaleDateString()}
                                    </Typography>
                                    {donation.receipt && (
                                        <Button
                                            href={donation.receipt}
                                            target="_blank"
                                            className="receipt-button"
                                        >
                                            View Receipt
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default Dashboard;