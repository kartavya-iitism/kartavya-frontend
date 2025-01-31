import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Backup as BackupIcon,
    Dashboard as DashboardIcon,
    Home as HomeIcon,
    Image as ImageIcon,
    ManageAccounts as ManageIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import AddDocuments from '../../../components/Dialogs/AddDocuments/AddDocuments';
import AddNewsAchievements from '../../../components/Dialogs/AddNewsAchievements/AddNewsAchievements';
import AddMedia from '../../../components/Dialogs/AddMedia/AddMedia';
import './General.css';

const General = () => {
    const [openDocDialog, setOpenDocDialog] = useState(false);
    const [openNewsDialog, setOpenNewsDialog] = useState(false);
    const [openMediaDialog, setOpenMediaDialog] = useState(false);

    const handleListItemClick = (action) => {
        console.log(`Clicked ${action}`);
        // Add your click handlers here
    };

    const actionButtons = [
        {
            title: "Add Media",
            icon: <ImageIcon />,
            onClick: () => setOpenMediaDialog(true)
        },
        {
            title: "Add New Document",
            icon: <AddIcon />,
            onClick: () => setOpenDocDialog(true)
        },
        {
            title: "Add News & Achievements",
            icon: <AddIcon />,
            onClick: () => setOpenNewsDialog(true)
        },
        {
            title: "Manage News & Achievements",
            icon: <ManageIcon />,
            to: "/admin/news"
        },
        {
            title: "Go to Dashboard",
            icon: <DashboardIcon />,
            to: "/admin/dash"
        },
        {
            title: "Go to Home",
            icon: <HomeIcon />,
            to: "/"
        }
    ];

    const statsData = [
        { value: "23", label: "Active Users", icon: <PersonIcon /> },
        { value: "45", label: "Documents", icon: <BackupIcon /> },
        { value: "12", label: "News Items", icon: <ImageIcon /> },
        { value: "89", label: "Media Files", icon: <SettingsIcon /> }
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
                                    {statsData.map((stat, index) => (
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
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Paper elevation={3} className="actions-paper">
                                <Typography variant="h6" className="section-title">
                                    Quick Links
                                </Typography>
                                <List>
                                    <ListItem
                                        component="button"
                                        onClick={() => handleListItemClick('user-management')}
                                    >
                                        <ListItemIcon><PersonIcon /></ListItemIcon>
                                        <ListItemText primary="User Management" />
                                    </ListItem>
                                    <ListItem
                                        component="button"
                                        onClick={() => handleListItemClick('site-settings')}
                                    >
                                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                                        <ListItemText primary="Site Settings" />
                                    </ListItem>
                                    <ListItem
                                        component="button"
                                        onClick={() => handleListItemClick('backup-data')}
                                    >
                                        <ListItemIcon><BackupIcon /></ListItemIcon>
                                        <ListItemText primary="Backup Data" />
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