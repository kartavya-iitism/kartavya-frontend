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
import axios from 'axios';
import './UsersTable.css';

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


    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Regular', value: 'regular' }
    ];
    const statusOptions = [
        { label: 'Verified', value: true },
        { label: 'Pending', value: false }
    ];

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        role: { value: null, matchMode: FilterMatchMode.EQUALS },
        isVerified: { value: null, matchMode: FilterMatchMode.EQUALS },
        dateOfRegistration: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/user/getAllUsers');
            const processedUsers = response.data.map(user => ({
                ...user,
                id: user._id,
                dateOfRegistration: new Date(user.dateOfRegistration),
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null
            }));
            setUsers(processedUsers);
        } catch (error) {
            console.error('Fetch error:', error);
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
            await axios.put(`http://localhost:3000/user/promote/${selectedPromoteUser.id}`, {}, {
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
            await axios.delete(`http://localhost:3000/user/delete/${selectedDeleteUser.id}`, {
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
            await axios.put(`http://localhost:3000/user/demote/${selectedDemoteUser.id}`, {}, {
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
            </div>
        );
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setUserDetailsDialog(true);
    };

    // Template functions
    const nameBodyTemplate = (rowData) => (
        <div className="name-cell-wrapper">
            {rowData.role === 'admin' ? (
                <Button
                    className="p-button-link name-cell-btn"
                    disabled
                >
                    {rowData.name}
                </Button>
            ) : (
                <Button
                    className="p-button-link name-cell-btn"
                    onClick={() => handleViewDetails(rowData)}
                >
                    {rowData.name}
                </Button>
            )}
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
                        {selectedUser.governmentOfficial && (
                            <p><strong>Government Official:</strong> Yes</p>
                        )}
                        {selectedUser.ismPassout && (
                            <>
                                <p><strong>ISM Passout:</strong> Yes</p>
                                <p><strong>Batch:</strong> {selectedUser.batch}</p>
                            </>
                        )}
                        {selectedUser.kartavyaVolunteer && (
                            <>
                                <p><strong>Kartavya Volunteer:</strong> Yes</p>
                                <p><strong>Service Period:</strong> {selectedUser.yearsOfServiceStart} - {selectedUser.yearsOfServiceEnd}</p>
                            </>
                        )}
                        {selectedUser.typeOfSponsor && (
                            <p><strong>Sponsor Type:</strong> {selectedUser.typeOfSponsor}</p>
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
                    }
                >
                    <Column
                        field="name"
                        header="Name"
                        body={nameBodyTemplate}
                        sortable
                        filter
                    />
                    <Column
                        field="contactNumber"
                        header="Contact"
                    />
                    <Column
                        field="email"
                        header="Email"
                        sortable
                        filter
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
        </>
    );
};

export default UsersTable;