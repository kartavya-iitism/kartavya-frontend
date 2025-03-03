import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Chip, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import './StudentDetailsDialog.css';

const StudentDetailsDialog = ({ open, onClose, student }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const StatusChip = ({ label, value }) => (
        <Chip
            label={label}
            color={value ? "success" : "error"}
            variant="outlined"
            size="small"
            className="status-chip"
        />
    );

    StatusChip.propTypes = {
        label: PropTypes.string.isRequired,
        value: PropTypes.bool.isRequired
    };

    const formatCurrency = (amount) => {
        return amount ? `₹${amount.toLocaleString('en-IN')}` : 'N/A';
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="student-details-dialog"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle className="dialog-title">
                Student Details
            </DialogTitle>
            <DialogContent className="dialog-content">
                <Box className="content-grid">
                    <Box className="profile-header">
                        <Avatar
                            src={student.profilePhoto}
                            alt={student.studentName}
                            className="student-avatar"
                        />
                        <Box className="profile-basic-info">
                            <Typography variant="body1">
                                <strong>Name:</strong> {student.studentName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Roll Number:</strong> {student.rollNumber}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Gender:</strong> {student.gender}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="details-section personal">
                        <Typography variant="h6" className="section-title">
                            Personal Information
                        </Typography>
                        <Typography variant="body1">
                            <strong>Date of Birth:</strong> {formatDate(student.dob)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Contact:</strong> {student.contactNumber}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Address:</strong> {student.address}
                        </Typography>
                    </Box>

                    <Box className="details-section academic">
                        <Typography variant="h6" className="section-title">
                            Academic Details
                        </Typography>
                        <Typography variant="body1">
                            <strong>Class:</strong> {student.class}
                        </Typography>
                        <Typography variant="body1">
                            <strong>School:</strong> {student.school}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Centre:</strong> {student.centre}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Current Session:</strong> {student.currentSession}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Annual Fees:</strong> {formatCurrency(student.annualFees)}
                        </Typography>
                    </Box>

                    <Box className="details-section family">
                        <Typography variant="h6" className="section-title">
                            Family Information
                        </Typography>
                        <Typography variant="body1">
                            <strong>Father&apos;s Name:</strong> {student.fathersName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Father&apos;s Occupation:</strong> {student.fathersOccupation}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Mother&apos;s Name:</strong> {student.mothersName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Mother&apos;s Occupation:</strong> {student.mothersOccupation}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Annual Income:</strong> {formatCurrency(student.annualIncome)}
                        </Typography>
                    </Box>

                    <Box className="details-section status">
                        <Typography variant="h6" className="section-title">
                            Status & Documents
                        </Typography>
                        <Box className="status-chips">
                            <StatusChip label={student.activeStatus ? "Active" : "Inactive"} value={student.activeStatus} />
                            <StatusChip label="Sponsorship" value={student.sponsorshipStatus} />
                            <StatusChip label="Aadhar" value={student.aadhar} />
                            <StatusChip label="Domicile" value={student.domicile} />
                            <StatusChip label="Birth Certificate" value={student.birthCertificate} />
                            <StatusChip label="Disability" value={student.disability} />
                            <StatusChip label="Single Parent" value={student.singleParent} />
                        </Box>
                        {student.sponsorshipStatus && (
                            <Typography variant="body1" className="sponsorship-info">
                                <strong>Sponsorship Percentage:</strong> {student.sponsorshipPercent}%
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button
                    onClick={onClose}
                    variant="contained"
                    className="close-button"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

StudentDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    student: PropTypes.shape({
        profilePhoto: PropTypes.string,
        studentName: PropTypes.string.isRequired,
        rollNumber: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        dob: PropTypes.string.isRequired,
        contactNumber: PropTypes.string.isRequired,
        class: PropTypes.string.isRequired,
        school: PropTypes.string.isRequired,
        centre: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        fathersName: PropTypes.string.isRequired,
        fathersOccupation: PropTypes.string.isRequired,
        mothersName: PropTypes.string.isRequired,
        mothersOccupation: PropTypes.string.isRequired,
        currentSession: PropTypes.string.isRequired,
        sponsorshipStatus: PropTypes.bool.isRequired,
        annualIncome: PropTypes.number,
        sponsorshipPercent: PropTypes.number,
        annualFees: PropTypes.number,
        activeStatus: PropTypes.bool.isRequired,
        aadhar: PropTypes.bool.isRequired,
        domicile: PropTypes.bool.isRequired,
        birthCertificate: PropTypes.bool.isRequired,
        disability: PropTypes.bool.isRequired,
        singleParent: PropTypes.bool.isRequired,
    }).isRequired
};

export default StudentDetailsDialog;