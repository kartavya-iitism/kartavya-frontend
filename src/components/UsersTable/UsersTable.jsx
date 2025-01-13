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
            value={rowData.role?.toUpperCase()}
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

                    <div className="user-details-grid">
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
                        field="email"
                        header="Email"
                        sortable
                        filter
                    />
                    <Column
                        field="contactNumber"
                        header="Contact"
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
                        field="dateOfRegistration"
                        header="Registered On"
                        headerStyle={{ whiteSpace: 'nowrap' }}
                        body={dateBodyTemplate}
                        sortable
                        filter
                        dataType="date"
                        filterElement={dateFilterTemplate}
                    />
                </DataTable>
            </div>
            {renderUserDetailsDialog()}
        </>
    );
};

export default UsersTable;