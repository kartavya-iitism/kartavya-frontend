import { useState } from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import {
    Add as AddIcon,
    Dashboard as DashboardIcon,
    ManageAccounts as ManageIcon,
    Home as HomeIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AddDocuments from '../../../components/AddDocuments/AddDocuments';
import AddNewsAchievements from '../../../components/AddNewsAchievements/AddNewsAchievements';
import AddMedia from '../../../components/AddMedia/AddMedia';
import './General.css';

const General = () => {
    const [openDocDialog, setOpenDocDialog] = useState(false);
    const [openNewsDialog, setOpenNewsDialog] = useState(false);
    const [openMediaDialog, setOpenMediaDialog] = useState(false);

    return (

        <Box className="general-container">
            <Container maxWidth="lg">
                <Typography variant="h2" className="page-title">
                    General Settings
                </Typography>
                <Typography variant="h5" className="page-subtitle">
                    Manage Documents, News & Media
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    className="action-buttons"
                >
                    <Button
                        variant="contained"
                        onClick={() => setOpenMediaDialog(true)}
                        className="action-button"
                        startIcon={<ImageIcon />}
                    >
                        Add Media
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setOpenDocDialog(true)}
                        className="action-button"
                        startIcon={<AddIcon />}
                    >
                        Add New Document
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenNewsDialog(true)}
                        className="action-button"
                        startIcon={<AddIcon />}
                    >
                        Add News & Achievements
                    </Button>

                    <Button
                        component={Link}
                        to="/admin/news"
                        variant="contained"
                        className="action-button"
                        startIcon={<ManageIcon />}
                    >
                        Manage News & Achievements
                    </Button>

                    <Button
                        component={Link}
                        to="/admin/dash"
                        variant="contained"
                        className="action-button dashboard-button"
                        startIcon={<DashboardIcon />}
                    >
                        Go to Dashboard
                    </Button>

                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        className="action-button home-button"
                        startIcon={<HomeIcon />}
                    >
                        Go to Home
                    </Button>
                </Stack>

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
            </Container>
        </Box>

    );
};

export default General;
