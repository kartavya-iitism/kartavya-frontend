import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Card, CardContent, TextField, Button,
  CircularProgress, Alert, Grid, Chip
} from '@mui/material';
import axios from 'axios';
import ConfirmDialog from '../../components/Dialogs/ConfirmDialog/ConfirmDialog';
import DateField from '../../components/DateField/DateField';
import { fetchContent } from '../../helper/contentFetcher';
import { API_URL } from '../../config';
import qr from "../../assets/qr.png"
import './Redonate.css';

const CONTENT_URL = "https://raw.githubusercontent.com/kartavya-iitism/kartavya-frontend-content/refs/heads/main/donate.json";

export default function RedonateForm() {
  const [content, setContent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const storedUserInit = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      return null;
    }
  })();

  const currentYear = new Date().getFullYear();
  const currentAcademicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  const nextYear = currentYear + 1;
  const nextAcademicYear = `${nextYear}-${(nextYear + 1).toString().slice(-2)}`;

  const [formData, setformData] = useState({
    extamount: '',
    donationDate: storedUserInit?.donationDate || today,
    name: storedUserInit?.name || '',
    contactNumber: storedUserInit?.contactNumber || '',
    email: storedUserInit?.email || '',
    numChild: storedUserInit?.sponsoredStudents ? storedUserInit.sponsoredStudents.length : 0,
    amount: '',
    academicYear: currentAcademicYear,
    reductionReason: ''
  });
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [reciept, setReciept] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [lastDonation, setLastDonation] = useState(null);
  const [sponsoredStudents, setSponsoredStudents] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const DONATION_LIMITS = {
    LOGGED_IN: 100000000,
    GUEST: 5000
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchContent(CONTENT_URL);
        setContent(data);
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    };
    loadContent();

    // Fetch user data if logged in
    const fetchUserData = async () => {
      if (localStorage.token) {
        setLoadingUserData(true);
        try {
          const response = await axios.get(
            `${API_URL}/user/dashboard`,
            {
              headers: { Authorization: `Bearer ${localStorage.token}` }
            }
          );

          if (response.data) {
            const userData = response.data;

            // Get last donation
            if (userData.donations && userData.donations.length > 0) {
              const lastDonationData = userData.donations[0];
              setLastDonation(lastDonationData);
            }

            // Get sponsored students
            if (userData.sponsoredStudents && userData.sponsoredStudents.length > 0) {
              setSponsoredStudents(userData.sponsoredStudents);
            }

            // Autofill form with user data - preserve initial name/email/contact from localStorage
            setformData(prev => ({
              ...prev,
              numChild: userData.sponsoredStudents ? userData.sponsoredStudents.length : 0
            }));
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Fallback - keep initial values from localStorage, only update numChild
          setformData(prev => ({
            ...prev,
            numChild: 0
          }));
        } finally {
          setLoadingUserData(false);
        }
      } else {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setformData({
          name: storedUser?.name || '',
          contactNumber: storedUser?.contactNumber || '',
          email: storedUser?.email || '',
          numChild: 0,
          extamount: '0',
          amount: '0',
          donationDate: today,
          academicYear: currentAcademicYear,
          reductionReason: ''
        });
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (content?.sponsorship) {
      const childAmount = Math.max(0, parseInt(formData.numChild || 0)) * content.sponsorship.amountPerChild || 0;
      const extamount = Math.max(parseInt(formData.extamount || 0), 0);
      const totalAmount = childAmount + extamount;

      setformData(prev => ({
        ...prev,
        numChild: Math.max(0, parseInt(formData.numChild || 0)),
        extamount: extamount.toString(),
        amount: totalAmount.toString()
      }));
    }
  }, [formData.numChild, formData.extamount, content]);

  if (pageLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress color="primary" />
    </Box>
  );

  if (pageError) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" padding={2}>
      <Alert severity="error" variant="filled">{pageError}</Alert>
    </Box>
  );

  // Guard: if content not loaded yet, show spinner
  if (!content) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const { hero, steps, payment, form, messages, sponsorship } = content;

  const handleOpenConfirm = (evt) => {
    evt.preventDefault();
    setOpenConfirmDialog(true);
  };

  const handleRecieptChange = (e) => {
    const file = e.target.files[0];
    setReciept(file);
    setFileName(file ? file.name : '');
  };

  const handleChange = (evt) => {
    const fieldName = evt.target.name;
    const value = evt.target.value;
    setformData((currdata) => ({
      ...currdata,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setOpenConfirmDialog(false);
    setLoading(true);
    setSuccess(false);
    setError(false);

    if (!localStorage.token && Number(formData.amount) > DONATION_LIMITS.GUEST) {
      setLoading(false);
      setError(true);
      setErrorMessage('Guest users can only donate up to ₹5,000. Please login to donate more.');
      return;
    }

    if (localStorage.token && Number(formData.amount) > DONATION_LIMITS.LOGGED_IN) {
      setLoading(false);
      setError(true);
      setErrorMessage('Maximum donation amount is ₹5,00,000.');
      return;
    }

    const formDataToSend = new FormData();
    for (let prop in formData) {
      formDataToSend.append(prop, formData[prop]);
    }
    if (reciept) {
      formDataToSend.append('reciept', reciept, reciept.name);
    }

    try {
      const response = await axios.post(
        `${API_URL}/donation/new`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setLoading(false);
      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError(true);
        setErrorMessage(response.data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="donation-container">
      <Box className="form-box donation-main">
        <Typography variant="h3" className="page-title">
          Welcome back!
        </Typography>
        <Typography variant="subtitle1" className="page-subtitle">
          Your continued support helps transform more lives through education.
          {!localStorage.getItem('token') && (
            <p className='page-subtitle-2'>
              {hero.registerPrompt.text}
              <a href={hero.registerPrompt.linkUrl} className="register-link">
                {` `}{hero.registerPrompt.linkText}
              </a>
            </p>
          )}
        </Typography>

        {/* Sponsored Students */}
        {sponsoredStudents && sponsoredStudents.length > 0 && (
          <Paper elevation={3} className="sponsored-students-section" style={{ marginBottom: '30px', padding: '20px' }}>
            <Typography variant="h5" style={{ marginBottom: '15px', fontWeight: 'bold' }}>
              Your Sponsored Students ({sponsoredStudents.length})
            </Typography>
            <Grid container spacing={2}>
              {(showAllStudents ? sponsoredStudents : sponsoredStudents.slice(0, 3)).map((student, index) => (
                <Grid item xs={12} sm={6} md={4} key={student._id || `student-${index}`}>
                  <Card style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <div
                        style={{
                          width: '100%',
                          height: '200px',
                          borderRadius: '8px',
                          marginBottom: '15px',
                          background: student.profilePhoto ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '60px',
                          color: 'white',
                          fontWeight: 'bold',
                          overflow: 'hidden'
                        }}
                      >
                        {student.profilePhoto ? (
                          <img
                            src={student.profilePhoto}
                            alt={student.studentName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        ) : (
                          <span>{student.studentName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        {student.studentName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '5px' }}>
                        <strong>Roll Number:</strong> {student.rollNumber}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '5px' }}>
                        <strong>Class:</strong> {student.class || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '5px' }}>
                        <strong>School:</strong> {student.school || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '5px' }}>
                        <strong>Centre:</strong> {student.centre || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '5px' }}>
                        <strong>Gender:</strong> {student.gender}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '5px' }}>
                        <strong>Father's Name:</strong> {student.fathersName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                        <strong>Contact:</strong> {student.contactNumber}
                      </Typography>
                      <Chip
                        label={student.sponsorshipStatus ? 'Actively Sponsored' : 'Inactive'}
                        color={student.sponsorshipStatus ? 'success' : 'default'}
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {sponsoredStudents.length > 3 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Button variant="outlined" color="success" onClick={() => setShowAllStudents(!showAllStudents)}>
                  {showAllStudents ? 'SHOW LESS' : `SHOW ALL ${sponsoredStudents.length} STUDENTS`}
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {/* Payment Information */}
        <Paper elevation={3} className="payment-details" style={{ marginBottom: '30px' }}>
          <Typography variant="h4" className="section-title">
            {payment.title}
          </Typography>

          <Box className="payment-grid">
            <div className="bank-details">
              {payment.bankDetails.map((detail, index) => (
                <Card key={`bank-detail-${index}`} className="bank-detail-card">
                  <CardContent className="bank-detail-content">
                    <Typography className="detail-label">
                      {detail.label}
                    </Typography>
                    <Typography className="detail-value">
                      {detail.value}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="qr-section">
              <Typography variant="h6" className="qr-title">
                {payment.qr.title}
              </Typography>
              <img src={qr} alt={payment.qr.alt} className="qr-code" />
            </div>
          </Box>
        </Paper>

        {localStorage.token && (
          <Alert severity="info" style={{ marginTop: '30px', marginBottom: '20px' }}>
            <Typography variant="body2">
              <strong>Re-Donation:</strong> Your form has been pre-filled with your previous donation details and sponsored students information.
              You can modify the amount and other details as needed. Thank you for your continued support!
            </Typography>
          </Alert>
        )}

        <Paper component="form" className="donation-form" onSubmit={handleOpenConfirm}>
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
              Select Academic Year
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={formData.academicYear === currentAcademicYear ? 'contained' : 'outlined'}
                color="success"
                onClick={() => setformData({ ...formData, academicYear: currentAcademicYear })}
                sx={{ borderRadius: '4px' }}
              >
                CURRENT YEAR ({currentAcademicYear})
              </Button>
              <Button
                variant={formData.academicYear === nextAcademicYear ? 'contained' : 'outlined'}
                color="success"
                onClick={() => setformData({ ...formData, academicYear: nextAcademicYear })}
                sx={{ borderRadius: '4px' }}
              >
                NEXT YEAR ({nextAcademicYear})
              </Button>
            </Box>
          </Box>

          <div className="form-grid-donate">
            {[
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
              { component: DateField, name: 'donationDate', label: 'Date of Donation', required: true },
              { name: 'numChild', label: 'Number of Children', type: 'number', required: false },
              { name: 'extamount', label: 'Extra Amount', type: 'number', required: true }
            ].map((field) => (
              field.component ? (
                <field.component
                  key={field.name}
                  className="custom-textfield custom-textfield-donation"
                  name={field.name}
                  label={field.label}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              ) : field.options ? (
                <TextField
                  key={field.name}
                  select
                  className="custom-textfield custom-textfield-donation"
                  name={field.name}
                  label={field.label}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </TextField>
              ) : (
                <TextField
                  key={field.name}
                  className="custom-textfield custom-textfield-donation"
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              )
            ))}

            <TextField
              key="sponsorship-amount"
              label={sponsorship.labels.sponsorshipAmount}
              className="custom-textfield custom-textfield-donation"
              disabled
              value={`₹${(parseInt(formData.numChild || 0) * sponsorship.amountPerChild).toLocaleString('en-IN')}`}
              helperText={sponsorship.helperText.sponsorship}
            />
            <TextField
              key="total-amount"
              label={sponsorship.labels.totalAmount}
              name='amount'
              className="custom-textfield custom-textfield-donation"
              disabled
              value={`₹${parseInt(formData.amount || 0).toLocaleString('en-IN')}`}
              helperText={sponsorship.helperText.total}
            />

            <div className="file-input-container">
              <label className="file-input-label">
                {fileName || form.uploadLabel}
                <input
                  type="file"
                  onChange={handleRecieptChange}
                  accept="image/*,.pdf"
                  className="file-input"
                />
              </label>
            </div>

            <Button
              type="submit"
              variant="contained"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-text">Submit</span>
                  <CircularProgress size={24} className="button-loader" />
                </>
              ) : (
                'Complete Re-Donation'
              )}
            </Button>


          </div>
          {loading && (
            <div className="status-message loading-message">
              <CircularProgress size={20} />
              Processing donation...
            </div>
          )}
          {success && (
            <div className="status-message success-message">
              {messages.success}
            </div>
          )}
          {error && (
            <div className="status-message error-message">
              {errorMessage}
            </div>
          )}
        </Paper>
      </Box>

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleSubmit}
        formData={{ ...formData, numChild: String(formData.numChild), amount: String(formData.amount) }}
        amount={sponsorship ? String(sponsorship.amountPerChild) : ''}
        loading={loading}
        warningMessage={(parseInt(formData.numChild) || 0) < sponsoredStudents.length ? 'You are reducing the number of children you sponsor. This will affect their education. Please provide a reason.' : null}
        onReasonChange={(reason) => setformData({ ...formData, reductionReason: reason })}
      />
    </div>
  );
}
