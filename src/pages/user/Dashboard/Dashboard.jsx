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
    CircularProgress,
    Avatar
} from '@mui/material';

import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material';
import { PictureAsPdf, InsertDriveFile } from '@mui/icons-material';
import StudentDetailsDialog from '../../../components/Dialogs/StudentDetails/StudentDetailsDialog';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import './Dashboard.css';

const Dashboard = () => {

    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasPreviousDonation, setHasPreviousDonation] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/dashboard`, {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                });

                setUserStats(res.data);
                setIsAdmin(localStorage.role === "admin");

                // correct donation check
                setHasPreviousDonation(res.data.totalDonations > 0);

            } catch (err) {
                setError(
                    err?.response?.data?.message || "Error fetching dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
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

        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !userStats) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    const getStatusTextColor = donation =>
        donation.verified ? "#2e7d32" :
            donation.rejected ? "#d32f2f" :
                "#ed6c02";

    const getStatusBackgroundColor = donation =>
        donation.verified ? "#e8f5e9" :
            donation.rejected ? "#ffebee" :
                "#fff3e0";

    const getStatusHoverColor = donation =>
        donation.verified ? "#c8e6c9" :
            donation.rejected ? "#ffcdd2" :
                "#ffe0b2";

    const impactMetrics = [
        {
            title: "Total Donated",
            value: `₹${userStats.totalDonations.toLocaleString('en-IN')}`,
            description: "Your generosity"
        },
        {
            title: "Children Sponsored",
            value: userStats.childrenSponsored,
            description: "Lives impacted"
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

                {/* Metrics */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ mb: 4 }}>
                    {impactMetrics.map((metric, i) => (
                        <Card key={i} className="metric-card" sx={{ flex: 1 }}>
                            <CardContent>
                                <Typography variant="h3">{metric.value}</Typography>
                                <Typography variant="h6">{metric.title}</Typography>
                                <Typography variant="body2">{metric.description}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                {/* Donate + Profile */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    className="dashboard-actions"
                >
                    <Paper className="action-card profile-card">
                        <Typography variant="h4">Make a New Donation</Typography>
                        <Typography variant="body1">
                            Continue supporting children's education
                        </Typography>

                        {hasPreviousDonation ? (
                            <Button component={Link} to="/redonate" className="action-button donate-button">
                                Re-Donate Now
                            </Button>
                        ) : (
                            <Button component={Link} to="/donate" className="action-button donate-button">
                                Donate Now
                            </Button>
                        )}
                    </Paper>

                    <Paper className="action-card profile-card">
                        <Typography variant="h4">Your Profile</Typography>
                        <Typography variant="body1">
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

                {/* Recent Donations */}
                <Paper className="recent-donations">
                    <Typography variant="h4" className="section-title">Recent Donations</Typography>

                    <Stack direction="row" flexWrap="wrap" gap={3}>
                        {userStats.recentDonations.map((donation, i) => (
                            <Card
                                key={i}
                                onClick={() => setSelectedDonation(donation)}
                                sx={{
                                    p: 2,
                                    width: "32%",
                                    cursor: "pointer",
                                    backgroundColor: getStatusBackgroundColor(donation),
                                    color: getStatusTextColor(donation),
                                    "&:hover": {
                                        backgroundColor: getStatusHoverColor(donation),
                                        transform: "scale(1.02)",
                                        boxShadow: 3
                                    },
                                    flex: {
                                        xs: "0 0 100%",
                                        sm: "0 0 48%",
                                        md: "0 0 31%"
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        ₹{donation.amount.toLocaleString("en-IN")}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {donation.verified
                                            ? "Verified"
                                            : donation.rejected
                                                ? "Rejected"
                                                : "Pending Verification"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Paper>

                {/* Sponsored Students */}
                <Paper className="sponsored-students">
                    <Typography variant="h4" className="section-title">
                        Sponsored Students
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={3}>
                        {userStats.sponsoredStudents.length > 0 ? (
                            userStats.sponsoredStudents.map((student, i) => (
                                <Card
                                    key={i}
                                    onClick={() => setSelectedStudent(student)}
                                    className="student-card"
                                    sx={{
                                        cursor: "pointer",
                                        flex: {
                                            xs: "0 0 100%",
                                            sm: "0 0 48%",
                                            md: "0 0 31%"
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box className="student-header">
                                            <Avatar
                                                src={student.profilePhoto}
                                                sx={{ width: 80, height: 80 }}
                                            />
                                            <Typography variant="h6">{student.studentName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Class {student.class}
                                            </Typography>
                                        </Box>

                                        <Box className="student-info">
                                            <Typography variant="body2">
                                                <strong>School:</strong> {student.school}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Centre:</strong> {student.centre}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Session:</strong> {student.currentSession}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No sponsored students available.</Typography>
                        )}
                    </Stack>

                    {selectedStudent && (
                        <StudentDetailsDialog
                            open={true}
                            onClose={() => setSelectedStudent(null)}
                            student={selectedStudent}
                        />
                    )}
                </Paper>

                {/* Documents */}
                <Paper className="user-documents">
                    <Typography variant="h4" className="section-title">
                        Documents
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={3}>
                        {userStats.documents.map((doc, i) => (
                            <Card
                                key={i}
                                sx={{
                                    width: "32%",
                                    cursor: "pointer",
                                    borderRadius: "15px",
                                    backgroundColor: "#f8f9fa",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: 3
                                    }
                                }}
                            >
                                {isAdmin && (
                                    <IconButton
                                        sx={{ position: "absolute", top: 5, right: 5 }}
                                        onClick={() => {
                                            setSelectedForDelete(doc._id);
                                            setDeleteDialog(true);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}

                                <CardContent>
                                    <Box sx={{ textAlign: "center", mb: 1 }}>
                                        {doc.type.includes("pdf") ? (
                                            <PictureAsPdf sx={{ fontSize: 40 }} />
                                        ) : (
                                            <InsertDriveFile sx={{ fontSize: 40 }} />
                                        )}
                                    </Box>

                                    <Typography variant="h6">{doc.title}</Typography>
                                    <Typography variant="body2">{doc.description}</Typography>

                                    <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </Typography>

                                    <Button
                                        href={doc.fileUrl}
                                        target="_blank"
                                        variant="outlined"
                                        size="small"
                                        sx={{ mt: 2 }}
                                    >
                                        Download
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Paper>

                {/* Delete Dialog */}
                <Dialog
                    open={deleteDialog}
                    onClose={() => setDeleteDialog(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this document?
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleDeleteDocument}
                            color="error"
                            disabled={deleting}
                        >
                            {deleting ? <CircularProgress size={20} /> : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </Box>
    );
};

export default Dashboard;