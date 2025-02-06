import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    Backup as BackupIcon,
    Home as HomeIcon,
    Image as ImageIcon,
    Article as ArticleIcon,
    BarChart as BarChartIcon,
    MonetizationOn as MoneyIcon,
    Newspaper as NewspaperIcon,
    DataUsage as DataUsageIcon,
    Group as GroupIcon,
    AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import AddDocuments from '../../../components/Dialogs/AddDocuments/AddDocuments';
import AddNewsAchievements from '../../../components/Dialogs/AddNewsAchievements/AddNewsAchievements';
import AddMedia from '../../../components/Dialogs/AddMedia/AddMedia';
import './General.css';
import axios from 'axios';
import { API_URL } from '../../../config';

const General = () => {
    const [openDocDialog, setOpenDocDialog] = useState(false);
    const [openNewsDialog, setOpenNewsDialog] = useState(false);
    const [openMediaDialog, setOpenMediaDialog] = useState(false);
    const [backingUp, setBackingUp] = useState(false);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const handleBackupData = async () => {
        setBackingUp(true);
        try {
            const response = await axios({
                url: `${API_URL}/admin/backup`,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`
                }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `kartavya-backup-${new Date().toISOString().split('T')[0]}.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Backup failed:', error);
        } finally {
            setBackingUp(false);
        }
    };

    const navigate = useNavigate();

    const actionButtons = [
        {
            title: "Add Media",
            icon: <ImageIcon />,
            onClick: () => setOpenMediaDialog(true)
        },
        {
            title: "Add New Document",
            icon: <ArticleIcon />,
            onClick: () => setOpenDocDialog(true)
        },
        {
            title: "Add News & Achievements",
            icon: <NewspaperIcon />,
            onClick: () => setOpenNewsDialog(true)
        },
        {
            title: "Manage News & Achievements",
            icon: <NewspaperIcon />,
            to: "/admin/news"
        },
        {
            title: "Core Data Management Panel",
            icon: <DataUsageIcon />,
            to: "/admin/dash"
        },
        {
            title: "Go to Home",
            icon: <HomeIcon />,
            to: "/"
        }
    ];

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    // Add useEffect for fetching
    useEffect(() => {
        fetchStats();
    }, []);


    const statsData = [
        {
            value: stats?.users?.active || "0",
            label: "Active Users",
            icon: <GroupIcon />
        },
        {
            value: stats?.donations?.verified || "0",
            label: "Verified Donations",
            icon: <BarChartIcon />
        },
        {
            value: `₹${(stats?.donations?.amount || 0).toLocaleString('en-IN')}`,
            label: "Total Donations",
            icon: <MoneyIcon />
        },
        {
            value: stats?.sponsorship?.totalChildren || "0",
            label: "Children Sponsored",
            icon: <GroupIcon />
        }
    ];

    return (
        <Box className="general-container">
            <Container maxWidth="lg">
                {/* Header Section */}
                <Typography variant="h2" className="page-title">
                    General Settings
                </Typography>
                <Typography variant="h5" className="page-subtitle">
                    Manage Documents, News & Media
                </Typography>


                <Grid container spacing={3} className="action-buttons-gen">
                    {actionButtons.map((btn, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={btn.onClick}
                                component={btn.to ? Link : 'button'}
                                to={btn.to}
                                className="action-button"
                                startIcon={btn.icon}
                            >
                                {btn.title}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 8, mb: 4 }} className="action-section">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Paper elevation={3} className="stats-paper">
                                <Typography variant="h6" className="section-title">
                                    Quick Stats
                                </Typography>
                                <Grid container spacing={3}>
                                    {statsLoading ? (
                                        <Box display="flex" justifyContent="center" alignItems="center" p={3} width="100%">
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        statsData.map((stat, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Paper className="stat-card">
                                                    <Box className="stat-icon">
                                                        {stat.icon}
                                                    </Box>
                                                    <Typography variant="h4">
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {stat.label}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Paper elevation={3} className="actions-paper">
                                <Typography variant="h6" className="section-title">
                                    Quick Links
                                </Typography>
                                <List>
                                    <ListItem component="button" onClick={() => navigate('/user/dash')}>
                                        <ListItemIcon><DataUsageIcon /></ListItemIcon>
                                        <ListItemText primary="Manage Your Dashboard" />
                                    </ListItem>
                                    <ListItem component="button" onClick={() => navigate('/user/profile')}>
                                        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                        <ListItemText primary="Manage Your Profile" />
                                    </ListItem>
                                    <ListItem
                                        component="button"
                                        onClick={() => handleBackupData()}
                                        disabled={backingUp}
                                    >
                                        <ListItemIcon>
                                            {backingUp ? <CircularProgress size={24} /> : <BackupIcon />}
                                        </ListItemIcon>
                                        <ListItemText primary={backingUp ? "Creating Backup..." : "Backup Data"} />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

            </Container >

            <AddMedia
                open={openMediaDialog}
                onClose={() => setOpenMediaDialog(false)}
            />
            <AddDocuments
                open={openDocDialog}
                onClose={() => setOpenDocDialog(false)}
            />
            <AddNewsAchievements
                open={openNewsDialog}
                onClose={() => setOpenNewsDialog(false)}
            />
        </Box >
    );
};

export default General;