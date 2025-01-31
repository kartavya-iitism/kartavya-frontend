import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import './ConfirmDialog.css';

const ConfirmDialog = ({ open, onClose, onConfirm, formData, loading }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="confirm-dialog"
        >
            <DialogTitle className="dialog-title">
                Confirm Donation Details
            </DialogTitle>
            <DialogContent className="dialog-content">
                <Typography variant="body1">
                    <strong>Name:</strong> {formData.name}
                </Typography>
                <Typography variant="body1">
                    <strong>Email:</strong> {formData.email}
                </Typography>
                <Typography variant="body1">
                    <strong>Contact:</strong> {formData.contactNumber}
                </Typography>
                <Typography variant="body1">
                    <strong>Date:</strong> {formData.donationDate ? new Date(formData.donationDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : ''}
                </Typography>
                <Typography variant="body1">
                    <strong>Number of Children:</strong> {formData.numChild || 0}
                </Typography>
                <Typography variant="body1">
                    <strong>Children Sponsorship Amount:</strong> ₹{parseInt(formData.numChild * 8000 || 0).toLocaleString('en-IN')}
                </Typography>
                <Typography variant="body1">
                    <strong>Extra Amount:</strong> ₹{parseInt(formData.extamount || 0).toLocaleString('en-IN')}
                </Typography>
                <Typography variant="h6" className="total-amount">
                    <strong>Total Amount:</strong> ₹{parseInt(formData.amount || 0).toLocaleString('en-IN')}
                </Typography>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button
                    onClick={onClose}
                    className="cancel-button"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Sending...
                        </>
                    ) : 'Confirm Donation'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        contactNumber: PropTypes.string,
        donationDate: PropTypes.string,
        numChild: PropTypes.string,
        extamount: PropTypes.string,
        amount: PropTypes.string
    }).isRequired,
    loading: PropTypes.bool.isRequired
};

export default ConfirmDialog;