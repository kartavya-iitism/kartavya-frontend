import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "How can I support Kartavya?",
            answer: "You can support Kartavya through donations, volunteering, or by spreading awareness about our initiatives. Visit our donation page to contribute financially."
        },
        {
            question: "What is the child sponsorship program?",
            answer: "Our child sponsorship program provides educational support to underprivileged children. The sponsorship amount of ₹8,000 covers educational expenses for one year."
        },
        {
            question: "How are the donations utilized?",
            answer: "Donations are primarily used for educational programs, health initiatives, and community development projects. We maintain complete transparency in fund utilization."
        },
        {
            question: "Can I volunteer at Kartavya?",
            answer: "Yes, we welcome volunteers! IIT (ISM) students can join as regular volunteers, while others can participate in specific events and programs."
        },
        {
            question: "Is my donation tax-deductible?",
            answer: "Yes, all donations to Kartavya are eligible for tax deduction under Section 80G of the Income Tax Act."
        }
    ];

    return (
        <Box className="faq-container">
            <Container maxWidth="lg" className="content-box">
                <Box className="title-container">
                    <Typography variant="h2" className="main-title" align="center">
                        Frequently Asked Questions
                    </Typography>
                    <Typography variant="h4" className="subtitle" align="center">
                        Find answers to common questions about Kartavya
                    </Typography>
                </Box>

                <Paper elevation={0} className="description-container">
                    <Typography variant="body1" className="description-text">
                        We&apos;ve compiled a list of frequently asked questions to help you better understand our organization and its initiatives. If you can&apos;t find the answer you&apos;re looking for, feel free to contact us.
                    </Typography>
                </Paper>

                <div className="faq-wrapper">
                    {faqs.map((faq, index) => (
                        <Accordion key={index} className="faq-accordion">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className="accordion-summary"
                            >
                                <Typography variant="h6" className="question-text">
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                <Typography variant="body1" className="answer-text">
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                <Paper elevation={3} className="contact-card">
                    <Typography variant="h5" className="card-title">
                        Still Have Questions?
                    </Typography>
                    <Typography variant="body1" className="card-content">
                        If you couldn&apos;t find the answer you were looking for, please don&apos;t hesitate to reach out to us. Our team is here to help you with any queries you may have.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default FAQ;