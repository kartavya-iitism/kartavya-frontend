
import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import DonationsTable from '../../../components/Tables/DonationsTable/DonationsTable';
import UsersTable from '../../../components/Tables/UsersTable/UsersTable';
import ContactTable from '../../../components/Tables/ContactTable/ContactTable';
import axios from 'axios';
import { API_URL } from '../../../config';
import './Dashboard.css';

const AdminDashboard = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showWarning, setShowWarning] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        logActivity('Accessed dashboard page');
        return () => {
            setAccepted(false);
            setShowWarning(true);
            logActivity('Left dashboard page');
        };
    }, []);

    const logActivity = async (action) => {
        try {
            // await axios.post(`${API_URL}/admin/log`, {
            //     action,
            //     timestamp: new Date(),
            //     userId: localStorage.getItem('userId')
            // }, {
            //     headers: { Authorization: `Bearer ${localStorage.token}` }
            // });
        } catch (error) {
            console.error('Activity logging failed:', error);
        }
    };

    const handleAccept = () => {
        setShowWarning(false);
        setAccepted(true);
        logActivity('Accepted data access warning');
    };

    const handleDecline = () => {
        logActivity('Declined data access warning');
        navigate('/admin/general');
    };

    const handleTabChange = (e) => {
        setActiveIndex(e.index);
        const tabs = ['Donations', 'Users', 'Contact Us'];
        logActivity(`Accessed ${tabs[e.index]} tab`);
    };


    return (
        <div className="admin-dashboard-container">
            <Dialog
                visible={showWarning}
                onHide={() => { }}
                header="Sensitive Data Warning"
                closable={false}
                style={{ width: '50vw' }}
                footer={
                    <div>
                        <Button
                            label="Decline"
                            icon="pi pi-times"
                            onClick={handleDecline}
                            className="p-button-text"
                        />
                        <Button
                            label="Accept & Continue"
                            icon="pi pi-check"
                            onClick={handleAccept}
                            autoFocus
                        />
                    </div>
                }
            >
                <div className="warning-content">
                    <p><strong>Sensitive Information Access</strong></p>
                    <ul>
                        <li>You are about to access confidential user profiles and donation records</li>
                        <li>Your actions in this administrative panel are monitored and logged</li>
                        <li>Unauthorized sharing or misuse of this information is strictly prohibited</li>
                        <li>Handle all personal and financial data with utmost care</li>
                        <li>Use this information only for authorized administrative tasks</li>
                        <li>Report any security concerns immediately to the system administrator</li>
                    </ul>
                    <p className="consent-text">
                        By selecting &quot;Accept & Continue&quot;, you agree to handle this sensitive information responsibly.
                    </p>
                </div>
            </Dialog>

            {accepted && (
                <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                    <TabPanel header="Donations">
                        <DonationsTable />
                    </TabPanel>
                    <TabPanel header="Users">
                        <UsersTable />
                    </TabPanel>
                    <TabPanel header="Contact Us">
                        <ContactTable />
                    </TabPanel>
                </TabView>
            )}
        </div>
    );
};

export default AdminDashboard;