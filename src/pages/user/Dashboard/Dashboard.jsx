import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Stack, Button, Card, CardContent } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [userStats, setUserStats] = useState({
        name: '',
        totalDonations: 0,
        childrenSponsored: 0,
        lastDonation: null,
        recentDonations: []
    });

    const [selectedDonation, setSelectedDonation] = useState(null);

    const handleOpenDialog = (donation) => setSelectedDonation(donation);
    const handleCloseDialog = () => setSelectedDonation(null);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/dashboard', {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                });
                console.log(response.data)
                setUserStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusTextColor = (donation) => {
        if (donation.verified) return '#2e7d32';  // Material-UI green[800]
        if (donation.rejected) return '#d32f2f';  // Material-UI red[700]
        return '#ed6c02';  // Material-UI orange[700]
    };

    const getStatusBackgroundColor = (donation) => {
        if (donation.verified) return '#e8f5e9';  // Material-UI green[50]
        if (donation.rejected) return '#ffebee';  // Material-UI red[50]
        return '#fff3e0';  // Material-UI orange[50]
    };

    const getStatusHoverColor = (donation) => {
        if (donation.verified) return '#c8e6c9';  // Material-UI green[100]
        if (donation.rejected) return '#ffcdd2';  // Material-UI red[100]
        return '#ffe0b2';  // Material-UI orange[100]
    };

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
                        Welcome Back! {userStats.name}
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
                    <Paper className="action-card profile-card">
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
                                onClick={() => handleOpenDialog(donation)}
                                sx={{
                                    width: '33%',
                                    margin: '0px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    borderRadius: '15px',
                                    color: getStatusTextColor(donation),
                                    backgroundColor: getStatusBackgroundColor(donation),
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 3,
                                        backgroundColor: getStatusHoverColor(donation)
                                    },
                                    flex: {
                                        xs: '0 0 100%',
                                        sm: '0 0 48%',
                                        md: '0 0 31%'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        ₹{donation.amount.toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: getStatusTextColor(donation),
                                            fontWeight: 500
                                        }}
                                    >
                                        {donation.verified ? "Verified" :
                                            donation.rejected ? "Rejected" :
                                                "Pending Verification"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}

                        <Dialog
                            open={!!selectedDonation}
                            onClose={handleCloseDialog}
                            maxWidth="sm"
                            fullWidth
                            className="donation-details-dialog"
                        >
                            {selectedDonation && (
                                <>
                                    <DialogTitle>
                                        Donation Details
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Typography variant="h5" className="donation-amount" gutterBottom>
                                            ₹{selectedDonation.amount.toLocaleString('en-IN')}
                                        </Typography>
                                        <div className="donation-info">
                                            <Typography variant="body1" gutterBottom>
                                                Date: {new Date(selectedDonation.donationDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                Status: {selectedDonation.verified ? "Verified" :
                                                    selectedDonation.rejected ? "Rejected" :
                                                        "Pending Verification"}
                                            </Typography>
                                            {selectedDonation.rejected && (
                                                <Typography variant="body1" className="rejection-reason" gutterBottom>
                                                    Rejection Reason: {selectedDonation.rejectionReason}
                                                </Typography>
                                            )}
                                        </div>
                                    </DialogContent>
                                    <DialogActions>
                                        {selectedDonation.recieptUrl && (
                                            <Button
                                                href={selectedDonation.recieptUrl}
                                                target="_blank"
                                                className="receipt-button dialog-button"
                                            >
                                                View Receipt
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleCloseDialog}
                                            className="cancel-button"
                                        >
                                            Close
                                        </Button>
                                    </DialogActions>
                                </>
                            )}
                        </Dialog>
                    </Stack>
                </Paper>
            </Container>
        </Box >
    );
};

export default Dashboard;