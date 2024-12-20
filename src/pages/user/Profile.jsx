import { useState, useEffect } from 'react';
import AuthVerify from '../../helper/JWTVerify';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    Box,
    Typography,
    Avatar,
    Stack,
    CircularProgress,
    Paper,
    Divider,
    Button
} from '@mui/material';
import ChangePasswordDialog from './ChangePassword';

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    useEffect(() => {
        setLoading(true);
        if (!AuthVerify(token)) navigate('/login');
        axios.get(`http://localhost:3000/user/view`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then((res) => {
                setUser(res.data)
                console.log(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setError(true)
                setLoading(false)
                setErrorMessage(err.message)
            });
        //
    }, [])

    return (
        <Box sx={{ p: 3 }}>
            {/* Loading State */}
            {(!user?.name || loading) && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Profile Content */}
            {user?.name && (
                <Box>
                    {/* Personal Details Section */}
                    <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Avatar
                                sx={{ width: 120, height: 120 }}
                                src={
                                    user.profileImage === ''
                                        ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGhmTe4FGFtGAgbIwVBxoD3FmED3E5EE99UGPItI0xnQ&s'
                                        : user.profileImage
                                }
                            />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {user.name}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Username: <strong>{user.username}</strong>
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Email: <strong>{user.email}</strong>
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Contact: <strong>{user.contactNumber}</strong>
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Date of Birth: <strong>{formatDate(user.dateOfBirth)}</strong>
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenDialog}
                            sx={{ mt: 3 }}
                        >
                            Change Password
                        </Button>

                        {/* Change Password Dialog */}
                        <ChangePasswordDialog open={dialogOpen} onClose={handleCloseDialog} username={user.username} />

                    </Paper>

                    {/* Additional Information Section */}
                    <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Additional Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body1">
                                    <strong>Gender:</strong> {user.gender}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1">
                                    <strong>Address:</strong> {user.address}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1">
                                    <strong>Government Official:</strong>{' '}
                                    {user.governmentOfficial ? 'Yes' : 'No'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1">
                                    <strong>ISM Passout:</strong> {user.ismPassout ? 'Yes' : 'No'}
                                </Typography>
                            </Box>

                            {user.ismPassout &&
                                <Box>
                                    <Typography variant="body1">
                                        <strong>Batch:</strong>{' '}
                                        {user.batch}
                                    </Typography>
                                </Box>
                            }

                            <Box>
                                <Typography variant="body1">
                                    <strong>Kartavya Volunteer:</strong>{' '}
                                    {user.kartavyaVolunteer ? 'Yes' : 'No'}
                                </Typography>
                            </Box>

                            {user.kartavyaVolunteer &&
                                <Box>
                                    <Typography variant="body1">
                                        <strong>Years of Service:</strong>{' '}
                                        {user.yearsOfServiceStart} - {user.yearsOfServiceEnd}
                                    </Typography>
                                </Box>
                            }

                        </Stack>
                    </Paper>

                    {/* Donations Section */}
                    <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Donations
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            {user.donations?.length > 0 ? (
                                user.donations.map((donation, index) => (
                                    <Typography key={index} variant="body1">
                                        • {donation}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body1">No donations available.</Typography>
                            )}
                        </Stack>
                    </Paper>

                    {/* Sponsored Students Section */}
                    <Paper sx={{ p: 3 }} elevation={3}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Sponsored Students
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            {user.sponsoredStudents?.length > 0 ? (
                                user.sponsoredStudents.map((student, index) => (
                                    <Typography key={index} variant="body1">
                                        • {student}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body1">
                                    No sponsored students available.
                                </Typography>
                            )}
                        </Stack>
                    </Paper>
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Typography
                    variant="body1"
                    color="error"
                    align="center"
                    sx={{ mt: 2 }}
                >
                    {errorMessage}
                </Typography>
            )}
        </Box>
    )
}