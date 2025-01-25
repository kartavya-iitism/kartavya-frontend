import { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddDocuments from '../../../components/AddDocuments/AddDocuments';
import AddNewsAchievements from '../../../components/AddNewsAchievements/AddNewsAchievements';
import './General.css';

const General = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);

    return (
        <Box className="document-upload-container">
            <Button
                variant="contained"
                onClick={() => setOpenDialog(true)}
                className="add-document-button"
            >
                Add New Document
            </Button>

            <AddDocuments
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            />
            <Button
                variant="contained"
                onClick={() => setOpenDialog2(true)}
                className="add-document-button"
            >
                Add New Document
            </Button>

            <AddNewsAchievements
                open={openDialog2}
                onClose={() => setOpenDialog2(false)}
            />
        </Box>


    );
};

export default General;