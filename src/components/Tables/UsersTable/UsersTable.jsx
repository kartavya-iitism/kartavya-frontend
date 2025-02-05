import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { API_URL } from '../../../config';
import axios from 'axios';
import './UsersTable.css';
import { InputTextarea } from 'primereact/inputtextarea';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetailsDialog, setUserDetailsDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useRef(null);
    const [promoteDialog, setPromoteDialog] = useState(false);
    const [selectedPromoteUser, setSelectedPromoteUser] = useState(null);
    const [promoting, setPromoting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [demoteDialog, setDemoteDialog] = useState(false);
    const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
    const [selectedDemoteUser, setSelectedDemoteUser] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [demoting, setDemoting] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [emailDialog, setEmailDialog] = useState(false);
    const [emailData, setEmailData] = useState({ subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Regular', value: 'regular' }
    ];
    const statusOptions = [
        { label: 'Verified', value: true },
        { label: 'Pending', value: false }
    ];


    const handleSendEmail = async (users) => {
        setSending(true);
        try {
            const emails = Array.isArray(users) ? users.map(u => u.email) : [users.email];
            await axios.post(`${API_URL}/user/send-mails`, {
                users: emails,
                subject: emailData.subject,
                message: emailData.message
            }, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Email sent successfully',
                life: 3000
            });
        } catch (error) {
            console.log(error)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to send email',
                life: 3000
            });
        } finally {
            setSending(false);
            setEmailDialog(false);
            setEmailData({ subject: '', message: '' });
        }
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        role: { value: null, matchMode: FilterMatchMode.EQUALS },
        isVerified: { value: null, matchMode: FilterMatchMode.EQUALS },
        dateOfRegistration: { value: null, matchMode: FilterMatchMode.DATE_IS },
        governmentOfficial: { value: null, matchMode: FilterMatchMode.EQUALS },
        ismPassout: { value: null, matchMode: FilterMatchMode.EQUALS },
        batch: { value: null, matchMode: FilterMatchMode.BETWEEN },
        currentJob: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kartavyaVolunteer: { value: null, matchMode: FilterMatchMode.EQUALS },
        totalDonation: { value: null, matchMode: FilterMatchMode.BETWEEN },
        lastDonationDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        activity: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const booleanOptions = [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/user/getAllUsers`, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            // Handle different response structures
            const users = Array.isArray(response.data) ? response.data :
                Array.isArray(response.data.users) ? response.data.users : [];

            const processedUsers = users.map(user => ({
                ...user,
                id: user._id,
                dateOfRegistration: new Date(user.dateOfRegistration),
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null
            }));

            setUsers(processedUsers);
        } catch (error) {
            console.error('Fetch error:', error);
            console.log('Response structure:', error.response?.data);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch users',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePromoteUser = async () => {
        setPromoting(true);
        try {
            await axios.put(`${API_URL}/user/promote/${selectedPromoteUser.id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            setUsers(users.map(user =>
                user.id === selectedPromoteUser.id ? { ...user, role: 'admin' } : user
            ));

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'User promoted to admin successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Promote error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to promote user',
                life: 3000
            });
        } finally {
            setPromoting(false);
            setPromoteDialog(false);
            setSelectedPromoteUser(null);
        }
    };

    const handleDeleteUser = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${API_URL}/user/delete/${selectedDeleteUser.id}`, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            setUsers(users.filter(user => user.id !== selectedDeleteUser.id));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'User deleted successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete user',
                life: 3000
            });
        } finally {
            setDeleting(false);
            setDeleteDialog(false);
            setSelectedDeleteUser(null);
        }
    };

    const handleDemoteUser = async () => {
        setDemoting(true);
        try {
            await axios.put(`${API_URL}/user/demote/${selectedDemoteUser.id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            setUsers(users.map(user =>
                user.id === selectedDemoteUser.id ? { ...user, role: 'regular' } : user
            ));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'User demoted successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Demote error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to demote user',
                life: 3000
            });
        } finally {
            setDemoting(false);
            setDemoteDialog(false);
            setSelectedDemoteUser(null);
        }
    };

    const lastDonationDateTemplate = (rowData) => {
        return rowData.lastDonationDate
            ? new Date(rowData.lastDonationDate).toLocaleDateString('en-IN')
            : '-';
    };

    const activityBodyTemplate = (rowData) => {
        const lastDonation = rowData.lastDonationDate ? new Date(rowData.lastDonationDate) : null;
        const yearAgo = new Date();
        yearAgo.setDate(yearAgo.getDate() - 365);

        const isActive = lastDonation && lastDonation > yearAgo;

        return (
            <div className="activity-tag-wrapper">
                <Tag
                    severity={isActive ? "success" : "danger"}
                    value={isActive ? "Active" : "Inactive"}
                />
            </div>
        );
    };

    const booleanBodyTemplate = (rowData, field) => (
        <Tag
            severity={rowData[field] ? "success" : "danger"}
            value={rowData[field] ? "Yes" : "No"}
        />
    );

    const batchBodyTemplate = (rowData) => {
        if (!rowData.ismPassout) return '-';
        return rowData.batch;
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <div>
                ₹{(rowData.totalDonation || 0).toLocaleString('en-IN')}
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        if (rowData.role === 'admin') {
            return (
                <div className="action-buttons">
                    <Button
                        icon="pi pi-user-minus"
                        className="p-button-rounded p-button-info p-button-text"
                        onClick={() => {
                            setSelectedDemoteUser(rowData);
                            setDemoteDialog(true);
                        }}
                        tooltip="Demote to Regular"
                        tooltipOptions={{ position: 'left' }}
                    />
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-text"
                        onClick={() => {
                            setSelectedDeleteUser(rowData);
                            setDeleteDialog(true);
                        }}
                        tooltip="Delete User"
                        tooltipOptions={{ position: 'left' }}
                    />
                    <Button
                        icon="pi pi-envelope"
                        className="p-button-rounded p-button-success p-button-text"
                        onClick={() => {
                            setSelectedUsers([rowData]);
                            setEmailDialog(true);
                        }}
                        tooltip="Send Email"
                        tooltipOptions={{ position: 'left' }}
                    />
                </div>
            );
        }
        return (
            <div className="action-buttons">
                <Button
                    icon="pi pi-user-plus"
                    className="p-button-rounded p-button-warning p-button-text"
                    onClick={() => {
                        setSelectedPromoteUser(rowData);
                        setPromoteDialog(true);
                    }}
                    tooltip="Promote to Admin"
                    tooltipOptions={{ position: 'left' }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => {
                        setSelectedDeleteUser(rowData);
                        setDeleteDialog(true);
                    }}
                    tooltip="Delete User"
                    tooltipOptions={{ position: 'left' }}
                />
                <Button
                    icon="pi pi-envelope"
                    className="p-button-rounded p-button-success p-button-text"
                    onClick={() => {
                        setSelectedUsers([rowData]);
                        setEmailDialog(true);
                    }}
                    tooltip="Send Email"
                    tooltipOptions={{ position: 'left' }}
                />
            </div>
        );
    };

    const renderEmailDialog = () => (
        <Dialog
            visible={emailDialog}
            onHide={() => setEmailDialog(false)}
            header="Send Email"
            modal
            className="email-dialog"
            footer={
                <div>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setEmailDialog(false)}
                        className="p-button-text"
                    />
                    <Button
                        label="Send"
                        icon="pi pi-send"
                        onClick={() => handleSendEmail(selectedUsers)}
                        loading={sending}
                        className="p-button-success"
                        autoFocus
                    />
                </div>
            }
        >
            <div className="email-form">
                <InputText
                    placeholder="Subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full mb-3"
                />
                <InputTextarea
                    placeholder="Message"
                    value={emailData.message}
                    onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    className="w-full"
                />
            </div>
        </Dialog>
    );

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setUserDetailsDialog(true);
    };

    // Template functions
    const nameBodyTemplate = (rowData) => (
        <div className="name-cell-wrapper">
            <Button
                className="p-button-link name-cell-btn"
                onClick={() => handleViewDetails(rowData)}
            >
                {rowData.name}
            </Button>
        </div>
    );

    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterCallback(e.value)}
                dateFormat="dd/mm/yy"
                placeholder="Select Date"
                mask="99/99/9999"
                showButtonBar
            />
        );
    };

    const roleBodyTemplate = (rowData) => (
        <Tag
            severity={
                rowData.role === 'admin' ? 'danger' :
                    rowData.role === 'volunteer' ? 'warning' : 'info'
            }
            value={rowData.role?.charAt(0).toUpperCase() + rowData.role?.slice(1)}
        />
    );

    const verifiedBodyTemplate = (rowData) => (
        <Tag
            severity={rowData.isVerified ? "success" : "warning"}
            value={rowData.isVerified ? "Verified" : "Pending"}
        />
    );

    const dateBodyTemplate = (rowData) => {
        return rowData.dateOfRegistration?.toLocaleDateString('en-IN');
    };

    const renderUserDetailsDialog = () => (
        <Dialog
            visible={userDetailsDialog}
            onHide={() => setUserDetailsDialog(false)}
            header="User Details"
            className="admin-user-dialog"
        >
            {selectedUser && (
                <div className="admin-user-details">
                    <div className="user-profile-section">
                        {selectedUser.profileImage && (
                            <img
                                src={selectedUser.profileImage}
                                alt="Profile"
                                className="user-profile-image"
                            />
                        )}
                        <h3>{selectedUser.name}</h3>
                        <Tag
                            severity={
                                selectedUser.role === 'admin' ? 'danger' :
                                    selectedUser.role === 'volunteer' ? 'warning' : 'info'
                            }
                            value={selectedUser.role?.toUpperCase()}
                        />
                    </div>

                    <div className="user-details-list">
                        <p><strong>Username:</strong> {selectedUser.username}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Total Donation:</strong> ₹{(selectedUser.totalDonation).toLocaleString('en-IN')}</p>
                        <p><strong>Contact:</strong> {selectedUser.contactNumber}</p>
                        {selectedUser.address && (
                            <p><strong>Address:</strong> {selectedUser.address}</p>
                        )}
                        {selectedUser.dateOfBirth && (
                            <p><strong>Date of Birth:</strong> {selectedUser.dateOfBirth.toLocaleDateString()}</p>
                        )}
                        {selectedUser.gender && (
                            <p><strong>Gender:</strong> {selectedUser.gender}</p>
                        )}
                        <p><strong>Verified:</strong> {selectedUser.isVerified ? 'Yes' : 'No'}</p>
                        <p><strong>Government Official:</strong> {selectedUser.governmentOfficial ? 'Yes' : 'No'}</p>
                        <p><strong>ISM Passout:</strong> {selectedUser.ismPassout ? 'Yes' : 'No'}</p>
                        {selectedUser.ismPassout && (
                            <p><strong>Batch:</strong> {selectedUser.batch}</p>
                        )}
                        <p><strong>Kartavya Volunteer:</strong>  {selectedUser.kartavyaVolunteer ? 'Yes' : 'No'}</p>
                        {selectedUser.kartavyaVolunteer && (
                            <p><strong>Service Period:</strong> {selectedUser.yearsOfServiceStart} - {selectedUser.yearsOfServiceEnd}</p>
                        )}
                        <p><strong>Sponsored Students:</strong> {selectedUser.sponsoredStudents?.length || 0}</p>
                        <p><strong>Donations Made:</strong> {selectedUser.donations?.length || 0}</p>
                        <p><strong>Registered On:</strong> {selectedUser.dateOfRegistration.toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </Dialog>
    );

    const renderPromoteDialog = () => (
        <Dialog
            visible={promoteDialog}
            onHide={() => setPromoteDialog(false)}
            header="Confirm Promotion"
            modal
            footer={
                <div>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setPromoteDialog(false)}
                        className="p-button-text"
                    />
                    <Button
                        label="Promote"
                        icon="pi pi-check"
                        onClick={handlePromoteUser}
                        loading={promoting}
                        className="p-button-warning"
                        autoFocus
                    />
                </div>
            }
        >
            <p>Are you sure you want to promote {selectedPromoteUser?.name} to admin?</p>
        </Dialog>
    );

    const renderDemoteDialog = () => (
        <Dialog
            visible={demoteDialog}
            onHide={() => setDemoteDialog(false)}
            header="Confirm Demotion"
            modal
            footer={
                <div>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setDemoteDialog(false)}
                        className="p-button-text"
                    />
                    <Button
                        label="Demote"
                        icon="pi pi-check"
                        onClick={handleDemoteUser}
                        loading={demoting}
                        className="p-button-info"
                        autoFocus
                    />
                </div>
            }
        >
            <p>Are you sure you want to demote {selectedDemoteUser?.name} to regular user?</p>
        </Dialog>
    );

    const renderDeleteDialog = () => (
        <Dialog
            visible={deleteDialog}
            onHide={() => setDeleteDialog(false)}
            header="Confirm Delete"
            modal
            footer={
                <div>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => setDeleteDialog(false)}
                        className="p-button-text"
                    />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        onClick={handleDeleteUser}
                        loading={deleting}
                        className="p-button-danger"
                        autoFocus
                    />
                </div>
            }
        >
            <p>Are you sure you want to delete {selectedDeleteUser?.name}?</p>
        </Dialog>
    );


    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <div className="admin-table-card">
                <DataTable
                    value={users}
                    selection={selectedUsers}
                    onSelectionChange={(e) => setSelectedUsers(e.value)}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    emptyMessage="No users found"
                    className="admin-users-table"
                    header={
                        <div className="admin-table-header">
                            <h2>All Users</h2>
                            <div className="header-actions">
                                {selectedUsers.length > 0 && (
                                    <Button
                                        icon="pi pi-envelope"
                                        className="p-button-success mr-2"
                                        onClick={() => setEmailDialog(true)}
                                        label={`Send Email (${selectedUsers.length})`}
                                    />
                                )}
                                <InputText
                                    placeholder="Global Search..."
                                    onInput={(e) =>
                                        setFilters({
                                            ...filters,
                                            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                                        })
                                    }
                                />
                            </div>
                        </div>
                    }
                >
                    <Column
                        selectionMode="multiple"
                        headerStyle={{ width: '3rem' }}
                    />
                    <Column
                        field="name"
                        header="Name"
                        body={nameBodyTemplate}
                        sortable
                        filter
                    />
                    <Column
                        field="totalDonation"
                        header="Total Donation"
                        body={amountBodyTemplate}
                        sortable
                        filter
                        dataType="numeric"
                        filterPlaceholder="Search by amount"
                    />
                    <Column
                        field="dateOfRegistration"
                        header="Registered On"
                        body={dateBodyTemplate}
                        sortable
                        filter
                        dataType="date"
                        filterElement={dateFilterTemplate}
                    />
                    <Column
                        field="lastDonationDate"
                        header="Last Donation"
                        body={lastDonationDateTemplate}
                        sortable
                        filter
                        dataType="date"
                        filterElement={dateFilterTemplate}
                    />
                    <Column
                        field="currentJob"
                        header="Current Job"
                        sortable
                        filter
                        filterPlaceholder="Search job..."
                        body={(rowData) => rowData.currentJob || '-'}
                    />
                    <Column
                        field="activity"
                        header="Activity"
                        body={activityBodyTemplate}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={[
                                    { label: 'Active', value: true },
                                    { label: 'Inactive', value: false }
                                ]}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select Status"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        field="role"
                        header="Role"
                        body={roleBodyTemplate}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={roleOptions}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select Role"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        field="governmentOfficial"
                        header="Govt. Off."
                        body={(rowData) => booleanBodyTemplate(rowData, 'governmentOfficial')}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={booleanOptions}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select"
                                className="p-column-filter"
                            />
                        )}
                    />

                    <Column
                        field="ismPassout"
                        header="ISM"
                        body={(rowData) => booleanBodyTemplate(rowData, 'ismPassout')}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={booleanOptions}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select"
                                className="p-column-filter"
                            />
                        )}
                    />

                    <Column
                        field="batch"
                        header="Batch"
                        body={batchBodyTemplate}
                        sortable
                        filter
                        dataType="numeric"
                    />

                    <Column
                        field="kartavyaVolunteer"
                        header="Kartavya"
                        body={(rowData) => booleanBodyTemplate(rowData, 'kartavyaVolunteer')}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={booleanOptions}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        field="isVerified"
                        header="Status"
                        body={verifiedBodyTemplate}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={statusOptions}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select Status"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        field="actions"
                        header="Actions"
                        body={actionBodyTemplate}
                        style={{ width: '10%', minWidth: '120px' }}
                        headerStyle={{ textAlign: 'center' }}
                        bodyStyle={{ textAlign: 'center', padding: '0.5rem' }}
                    />
                </DataTable>
            </div>
            {renderUserDetailsDialog()}
            {renderPromoteDialog()}
            {renderDeleteDialog()}
            {renderDemoteDialog()}
            {renderEmailDialog()}
        </>
    );
};

export default UsersTable;