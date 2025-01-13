import DonationsTable from '../../../components/DonationsTable/DonationsTable';
import UsersTable from '../../../components/UsersTable/UsersTable';
import './Dashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-container">
            <DonationsTable />
            <br />
            <UsersTable />
        </div>
    );
};

export default AdminDashboard;