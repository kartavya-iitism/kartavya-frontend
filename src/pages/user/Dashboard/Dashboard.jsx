import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    IconButton,
    CircularProgress
} from '@mui/material';

import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material';
import { PictureAsPdf, InsertDriveFile } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import './Dashboard.css';

const Dashboard = () => {
    const [userStats, setUserStats] = useState({
        name: '',
        totalDonations: 0,
        childrenSponsored: 0,
        lastDonation: null,
        recentDonations: [],
        documents: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [error, setError] = useState('');
    const handleOpenDialog = (donation) => setSelectedDonation(donation);
    const handleCloseDialog = () => setSelectedDonation(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/user/dashboard`, {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                });
                console.log(response.data)
                setUserStats(response.data);
                setIsAdmin(localStorage.role === 'admin');
            } catch (error) {
                setError(error.response.data.message === '' ? 'Error Fetching Data' : error.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleDeleteDocument = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${API_URL}/document/${selectedForDelete}`, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });
            setUserStats(prev => ({
                ...prev,
                documents: prev.documents.filter(doc => doc._id !== selectedForDelete)
            }));
            setDeleteDialog(false);
            setSelectedForDelete(null);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleting(false);
        }
    };

    const renderDeleteDialog = () => (
        <Dialog
            open={deleteDialog}
            onClose={() => {
                setDeleteDialog(false);
                setSelectedForDelete(null);
            }}
            className="password-dialog"
            PaperProps={{
                className: "dialog-paper"
            }}
        >
            <DialogTitle className='dialog-title'>Confirm Delete</DialogTitle>
            <DialogContent className="dialog-content">
                Are you sure you want to delete this Document?
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button
                    onClick={() => {
                        setDeleteDialog(false);
                        setSelectedForDelete(null);
                    }}
                    className="cancel-button"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDeleteDocument}
                    color="error"
                    disabled={deleting}
                    className="submit-button"
                >
                    {deleting ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );

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

                {error && (
                    <Alert severity="error" className="error-alert">
                        {error}
                    </Alert>
                )}
                {!error && !loading &&
                    <>
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
                                            <DialogActions className="dialog-actions">
                                                <Button
                                                    onClick={handleCloseDialog}
                                                    className="cancel-button"
                                                >
                                                    Close
                                                </Button>
                                                {selectedDonation.recieptUrl && (
                                                    <Button
                                                        href={selectedDonation.recieptUrl}
                                                        target="_blank"
                                                        className="submit-button"
                                                    >
                                                        View Receipt
                                                    </Button>
                                                )}
                                            </DialogActions>
                                        </>
                                    )}
                                </Dialog>
                            </Stack>
                        </Paper>

                        <Paper className="user-documents">
                            <Typography variant="h4" className="section-title">
                                Documents
                            </Typography>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                gap={3}
                                className="documents-list"
                            >
                                {userStats.documents.map((doc, index) => (
                                    <Card
                                        key={index}
                                        sx={{
                                            width: '33%',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            borderRadius: '15px',
                                            backgroundColor: '#f8f9fa',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: 3
                                            },
                                            flex: {
                                                xs: '0 0 100%',
                                                sm: '0 0 48%',
                                                md: '0 0 31%'
                                            }
                                        }}
                                    >
                                        {isAdmin && (
                                            <IconButton
                                                className="delete-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedForDelete(doc._id);
                                                    setDeleteDialog(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                        <CardContent>
                                            <Box className="document-icon">
                                                {doc.type.toLowerCase().includes('pdf') ? (
                                                    <PictureAsPdf sx={{ fontSize: 40, color: '#1a4d2e' }} />
                                                ) : (
                                                    <InsertDriveFile sx={{ fontSize: 40, color: '#1a4d2e' }} />
                                                )}
                                            </Box>
                                            <Typography variant="h6" className="document-title">
                                                {doc.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {doc.description}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                {new Date(doc.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </Typography>
                                            <Button
                                                href={doc.fileUrl}
                                                target="_blank"
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    mt: 2,
                                                    color: '#1a4d2e',
                                                    borderColor: '#1a4d2e',
                                                    '&:hover': {
                                                        borderColor: '#1a4d2e',
                                                        backgroundColor: 'rgba(26, 77, 46, 0.04)'
                                                    }
                                                }}
                                            >
                                                Download
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Paper>

                    </>
                }

            </Container>
            {renderDeleteDialog()}
        </Box >
    );
};

export default Dashboard;