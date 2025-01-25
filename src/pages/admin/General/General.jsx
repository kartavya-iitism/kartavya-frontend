import { useState } from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import {
    Add as AddIcon,
    Dashboard as DashboardIcon,
    ManageAccounts as ManageIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AddDocuments from '../../../components/AddDocuments/AddDocuments';
import AddNewsAchievements from '../../../components/AddNewsAchievements/AddNewsAchievements';
import './General.css';

const General = () => {
    const [openDocDialog, setOpenDocDialog] = useState(false);
    const [openNewsDialog, setOpenNewsDialog] = useState(false);

    return (
        <Box className="general-container">
            <Container maxWidth="lg">
                <Typography variant="h2" className="page-title">
                    General Settings
                </Typography>
                <Typography variant="h5" className="page-subtitle">
                    Manage Documents & News
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    className="action-buttons"
                >
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
                </Stack>

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