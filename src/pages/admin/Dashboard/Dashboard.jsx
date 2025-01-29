import { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import DonationsTable from '../../../components/DonationsTable/DonationsTable';
import UsersTable from '../../../components/UsersTable/UsersTable';
import ContactTable from '../../../components/ContactTable/ContactTable';
import './Dashboard.css';

const AdminDashboard = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="admin-dashboard-container">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
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

        </div>
    );
};

export default AdminDashboard;