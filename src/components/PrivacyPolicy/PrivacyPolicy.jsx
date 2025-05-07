import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Grid,
    Link
} from '@mui/material';
import {
    Security,
    Cookie,
    PrivacyTip,
    ContactSupport,
    Update,
    Person,
    DataUsage,
    ChildCare,
    Share,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    const sections = [
        {
            title: "Information We Collect",
            icon: <DataUsage />,
            content: "We collect the following types of information: a) Personal Information: Name, email address, phone number, and other contact details you provide voluntarily via contact forms, volunteer registration, or donation portals. b) Non-Personal Information: Browser type, device information, pages visited, and time spent on the site (collected via cookies and analytics tools)."
        },
        {
            title: "How We Use Your Information",
            icon: <Person />,
            content: "We use the collected information to: Respond to your queries and requests. Manage volunteer and donor records. Send updates about our work and events (with your consent). Improve website functionality and content."
        },
        {
            title: "Sharing of Information",
            icon: <Share />,
            content: "We do not sell, trade, or rent your personal information. We may share data: With service providers for payment processing or email delivery (under strict confidentiality agreements). When required by law or to protect our legal rights."
        },
        {
            title: "Cookies and Analytics",
            icon: <Cookie />,
            content: "We use cookies and third-party analytics tools (like Google Analytics) to improve user experience. You can disable cookies in your browser settings."
        },
        {
            title: "Data Security",
            icon: <Security />,
            content: "We take reasonable steps to protect your information from unauthorized access. However, no method of transmission over the Internet is 100% secure."
        },
        {
            title: "Children's Privacy",
            icon: <ChildCare />,
            content: "We do not knowingly collect personal data from children under 13 without parental consent. If we discover such information has been collected, we will delete it promptly."
        },
        {
            title: "Your Rights",
            icon: <PrivacyTip />,
            content: "You may: Request access to your data. Ask us to correct or delete your personal information. Withdraw consent for communication at any time."
        },
        {
            title: "Changes to This Policy",
            icon: <Update />,
            content: "We may update this policy periodically. Changes will be posted on this page with the updated date."
        }
    ];

    return (
        <Box className="privacy-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        Privacy Policy
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        Your Privacy Matters to Us
                    </Typography>
                    <Typography variant="body1" className="last-updated">
                        Effective Date: 10/05/2025
                    </Typography>
                </Box>

                <Paper elevation={0} className="privacy-intro">
                    <Typography variant="body1" className="intro-text">
                        Kartavya respects the privacy of our website visitors and users. This Privacy Policy outlines how
                        we collect, use, disclose, and protect your information through our website.
                    </Typography>
                </Paper>

                {sections.map((section, index) => (
                    <Paper key={index} elevation={3} className="policy-section">
                        <Box className="section-header">
                            <Box className="icon-container">
                                {section.icon}
                            </Box>
                            <Typography variant="h5" className="section-title">
                                {section.title}
                            </Typography>
                        </Box>
                        <Divider className="section-divider" />
                        <Typography variant="body1" className="section-content">
                            {section.content}
                        </Typography>
                    </Paper>
                ))}

                {/* Enhanced Contact Section */}
                <Paper elevation={3} className="contact-section policy-section">
                    <Box className="section-header">
                        <Box className="icon-container">
                            <ContactSupport />
                        </Box>
                        <Typography variant="h5" className="section-title">
                            Contact Us
                        </Typography>
                    </Box>
                    <Divider className="section-divider" />
                    <Typography variant="body1" className="section-content" sx={{ mb: 2 }}>
                        If you have questions about this Privacy Policy or your data, please contact:
                    </Typography>

                    <Box className="contact-details">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box className="contact-item">
                                    <Box className="contact-icon">
                                        <Email color="primary" />
                                    </Box>
                                    <Typography variant="h6" className="contact-label">Email</Typography>
                                    <Typography variant="body1" className="contact-value">
                                        <Link href="mailto:sponsor.kartavya@gmail.com" underline="hover">
                                            sponsor.kartavya@gmail.com
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box className="contact-item">
                                    <Box className="contact-icon">
                                        <Phone color="primary" />
                                    </Box>
                                    <Typography variant="h6" className="contact-label">Phone</Typography>
                                    <Typography variant="body1" className="contact-value">
                                        <Link href="tel:7264822356" underline="hover">
                                            7264822356
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box className="contact-item">
                                    <Box className="contact-icon">
                                        <LocationOn color="primary" />
                                    </Box>
                                    <Typography variant="h6" className="contact-label">Address</Typography>
                                    <Typography variant="body1" className="contact-value">
                                        C1-Centre, Kartavya, Mondal Basti,<br />
                                        Dhaiya, Dhanbad, 826004
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Paper elevation={3} className="consent-section">
                    <Typography variant="h5" className="consent-title">
                        Your Consent
                    </Typography>
                    <Typography variant="body1" className="consent-text">
                        By using our website and services, you consent to our Privacy Policy. If you have any questions or concerns about our privacy practices, please contact us.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default PrivacyPolicy;