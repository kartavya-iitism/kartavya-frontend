import { useState, useEffect } from 'react';
import AuthVerify from '../../../helper/JWTVerify';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    Box,
    Typography,
    Avatar,
    Stack,
    CircularProgress,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Link
} from '@mui/material';
import OtpDialog from '../../../components/Dialogs/OtpDialog/OtpDialog';
import { API_URL } from '../../../config';
import ChangePasswordDialog from '../../../components/Dialogs/ChangePasswordDialog/ChangePassword'
import EditProfileDialog from '../../../components/Dialogs/EditProfileDialog/EditProfile';
import ChangeEmailDialog from '../../../components/Dialogs/ChangeEmailDialog/ChangeEmailDialog';
import './Profile.css'

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenEditDialog = () => {
        setEditProfileDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditProfileDialogOpen(false);
    };
    const handleOpenEmailDialog = () => setEmailDialogOpen(true);
    const handleCloseEmailDialog = () => setEmailDialogOpen(false);

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
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (!AuthVerify(token)) navigate('/login');
        axios.get(`${API_URL}/user/view`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then((res) => {
                setUser(res.data)
                console.log(res.data)
                setLoading(false)
                setInitialLoad(false);
            })
            .catch((err) => {
                console.error(err)
                setError(true)
                setLoading(false)
                setErrorMessage(err.message)
                setInitialLoad(false);
            });
        //
    }, [])

    useEffect(() => {
        if (!initialLoad && !loading && user?.username) {
            setShowOtpDialog(!user.isVerified);
        }
    }, [user, initialLoad, loading]);

    return (
        <Box className="profile-container">
            <Box className="profile-content">
                {(!user?.name || loading) && (
                    <Box className="loading-state">
                        <CircularProgress />
                    </Box>
                )}

                {user?.name && (
                    <Stack spacing={3}>
                        {/* Personal Details Card */}
                        <Paper className="profile-card personal-details">
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                                <Avatar
                                    className="profile-avatar"
                                    src={user.profileImage || 'default-avatar-url'}
                                />
                                <Box className="profile-info">
                                    <Typography variant="h4" className="profile-name">
                                        {user.name}
                                    </Typography>
                                    {[
                                        { label: 'Username', value: user.username },
                                        {
                                            label: 'Email',
                                            value: (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    sx={{ display: 'inline-flex' }}
                                                >
                                                    {user.email}
                                                    {user.isVerified && (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            className="change-email-button"
                                                            onClick={handleOpenEmailDialog}
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                padding: '2px 8px',
                                                                minWidth: 'auto',
                                                                height: '24px',
                                                                marginLeft: '10px !important',
                                                                color: '#1a4d2e',
                                                                borderColor: '#1a4d2e',
                                                                '&:hover': {
                                                                    borderColor: '#1a4d2e',
                                                                    backgroundColor: 'rgba(26, 77, 46, 0.04)'
                                                                }
                                                            }}
                                                        >
                                                            Change
                                                        </Button>
                                                    )}
                                                </Stack>
                                            )
                                        },
                                        { label: 'Contact', value: user.contactNumber },
                                        { label: 'Date of Birth', value: formatDate(user.dateOfBirth) },
                                        { label: 'Current Job', value: user.currentJob }
                                    ].map((detail, index) => (
                                        <Typography key={index} variant="subtitle1" className="profile-detail">
                                            {detail.label}: <strong>{detail.value}</strong>
                                        </Typography>
                                    ))}
                                </Box>
                            </Stack>
                            <Button
                                variant="contained"
                                className="edit-button"
                                onClick={handleOpenEditDialog}
                            >
                                Edit Details
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleOpenDialog}
                                className="password-button"
                            >
                                Change Password
                            </Button>
                        </Paper>

                        {/* Additional Details Card */}
                        <Paper className="profile-card">
                            <Typography variant="h5" className="card-title">
                                Additional Details
                            </Typography>
                            <Stack spacing={2} className="details-grid">
                                <Box>
                                    <Typography variant="body1" style={{ marginTop: '0px' }}>
                                        <strong>Gender:</strong> {user.gender}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" style={{ marginTop: '-15px' }}>
                                        <strong>Address:</strong> {user.address}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" style={{ marginTop: '-15px' }}>
                                        <strong>Government Official:</strong>{' '}
                                        {user.governmentOfficial ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" style={{ marginTop: '-15px' }}>
                                        <strong>ISM Passout:</strong> {user.ismPassout ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>

                                {user.ismPassout &&
                                    <Box>
                                        <Typography variant="body1" style={{ marginTop: '-15px' }}>
                                            <strong>Batch:</strong>{' '}
                                            {user.batch}
                                        </Typography>
                                    </Box>
                                }

                                <Box>
                                    <Typography variant="body1" style={{ marginTop: '-15px' }}>
                                        <strong>Kartavya Volunteer:</strong>{' '}
                                        {user.kartavyaVolunteer ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>

                                {user.kartavyaVolunteer &&
                                    <Box>
                                        <Typography variant="body1" style={{ marginTop: '-15px' }}>
                                            <strong>Years of Service:</strong>{' '}
                                            {user.yearsOfServiceStart} - {user.yearsOfServiceEnd}
                                        </Typography>
                                    </Box>
                                }
                            </Stack>
                        </Paper>

                        {/* Donations Card */}
                        <Paper className="profile-card">
                            <Typography variant="h5" className="card-title">
                                Donations
                            </Typography>
                            <Stack spacing={1} className="list-content">
                                {user.donations?.length > 0 ? (
                                    <TableContainer className="donations-table">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="table-header">S.No.</TableCell>
                                                    <TableCell className="table-header">Amount</TableCell>
                                                    <TableCell className="table-header">Date</TableCell>
                                                    <TableCell className="table-header">Reciept</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {user.donations.map((donation, index) => (
                                                    <TableRow key={index} className="table-row">
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>₹{donation.amount}</TableCell>
                                                        <TableCell>{formatDate(donation.donationDate)}</TableCell>
                                                        <TableCell>
                                                            {donation.recieptUrl ? (
                                                                <Link
                                                                    href={donation.recieptUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="reciept-link"
                                                                >
                                                                    View Reciept
                                                                </Link>
                                                            ) : (
                                                                'Not Available'
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography variant="body1">No donations available.</Typography>
                                )}
                            </Stack>
                        </Paper>

                        {/* Sponsored Students Card */}
                        <Paper className="profile-card">
                            <Typography variant="h5" className="card-title">
                                Sponsored Students
                            </Typography>
                            <Stack spacing={1} className="list-content">
                                {user.sponsoredStudents?.length > 0 ? (
                                    <TableContainer className="students-table">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="table-header">S.No.</TableCell>
                                                    <TableCell className="table-header">Name</TableCell>
                                                    <TableCell className="table-header">School</TableCell>
                                                    <TableCell className="table-header">Profile</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {user.sponsoredStudents.map((student, index) => (
                                                    <TableRow key={index} className="table-row">
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{student.name}</TableCell>
                                                        <TableCell>{student.school}</TableCell>
                                                        <TableCell>
                                                            <Link
                                                                href={`/student/${student.id}`}
                                                                className="student-link"
                                                            >
                                                                View Profile
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography variant="body1">
                                        No sponsored students available.
                                    </Typography>
                                )}
                            </Stack>
                        </Paper>
                    </Stack>
                )}

                {error && (
                    <Typography className="error-message">
                        {errorMessage}
                    </Typography>
                )}
                <EditProfileDialog
                    open={editProfileDialogOpen}
                    onClose={() => {
                        handleCloseEditDialog();
                        document.querySelector('.edit-button')?.focus();
                    }}
                    username={user?.username || ''}
                    initialData={{
                        email: user?.email || '',
                        contactNumber: user?.contactNumber || '',
                        address: user?.address || '',
                        isGovernmentOfficial: user?.isGovernmentOfficial || false,
                        currentJob: user?.currentJob || '',
                        name: user?.name || '',
                        dateOfBirth: user?.dateOfBirth || '',
                        gender: user?.gender || '',
                        ismPassout: user?.ismPassout || false,
                        batch: user?.batch || '',
                        kartavyaVolunteer: user?.kartavyaVolunteer || false,
                        yearsOfServiceStart: user?.yearsOfServiceStart || '',
                        yearsOfServiceEnd: user?.yearsOfServiceEnd || ''
                    }}
                />
                <ChangePasswordDialog
                    open={dialogOpen}
                    onClose={() => {
                        handleCloseDialog();
                        document.querySelector('.password-button')?.focus();
                    }}
                    username={user?.username || ''}
                    disableEnforceFocus={false}
                    keepMounted={false}
                />

            </Box>
            <OtpDialog
                open={showOtpDialog && !loading && !initialLoad && user?.username && !user.isVerified}
                onClose={() => user?.isVerified && setShowOtpDialog(false)}
                username={user?.username}
                onSuccess={() => {
                    setUser({ ...user, isVerified: true });
                    setShowOtpDialog(false);
                }}
                forceVerification={true}
            />
            <ChangeEmailDialog
                open={emailDialogOpen}
                onClose={handleCloseEmailDialog}
                username={user?.username || ''}
            />
        </Box>
    );
}
