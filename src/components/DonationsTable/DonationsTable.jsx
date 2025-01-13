import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import './DonationsTable.css';


const DonationsTable = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDialog, setUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const statusOptions = [
        { label: 'Verified', value: true },
        { label: 'Pending', value: false }
    ];
    const toast = useRef(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);
    const [verifying, setVerifying] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        amount: { value: null, matchMode: FilterMatchMode.BETWEEN },
        donationDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        numChild: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });


    // Fetch donations
    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/donation/viewAllDonation');
            const donations = Array.isArray(response.data) ? response.data :
                Array.isArray(response.data.donations) ? response.data.donations : [];

            const processedDonations = donations.map(donation => ({
                ...donation,
                id: donation._id,
                donationDate: new Date(donation.donationDate || donation.createdAt),
                name: donation.name || 'Anonymous'
            }));

            setDonations(processedDonations);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch donations',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClick = (donationId) => {
        setSelectedDonationId(donationId);
        setConfirmDialog(true);
    };

    const handleVerifySubmit = async () => {
        setVerifying(true);
        try {
            await axios.put(`http://localhost:3000/donation/verify/${selectedDonationId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            setDonations(donations.map(d =>
                d.id === selectedDonationId ? { ...d, verified: true } : d
            ));

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Donation verified successfully',
                life: 3000
            });
        } catch (error) {
            console.log(error)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to verify donation',
                life: 3000
            });
        } finally {
            setVerifying(false);
            setConfirmDialog(false);
            setSelectedDonationId(null);
        }
    };

    // Template functions
    const nameBodyTemplate = (rowData) => {
        const nameContent = rowData.user ? (
            <Button
                className="p-button-link name-cell-btn"
                onClick={() => {
                    setSelectedUser(rowData.user);
                    setUserDialog(true);
                }}
            >
                {rowData.name}
            </Button>
        ) : (
            <Button
                className="p-button-link name-cell-btn"
                disabled
            >
                {rowData.name}
            </Button>
        );

        return <div className="name-cell-wrapper">{nameContent}</div>;
    };

    const amountBodyTemplate = (rowData) => {
        return `₹${rowData.amount?.toLocaleString('en-IN') || 0}`;
    };

    const dateBodyTemplate = (rowData) => {
        return rowData.donationDate?.toLocaleDateString('en-IN');
    };

    const receiptBodyTemplate = (rowData) => {
        if (!rowData.recieptUrl) return null;

        return (
            <Button
                icon="pi pi-download"
                className="p-button-rounded p-button-text"
                onClick={() => window.open(rowData.recieptUrl, '_blank')}
                tooltip="Download Receipt"
            />
        );
    };

    const verifiedBodyTemplate = (rowData) => (
        <Tag
            severity={rowData.verified ? "success" : "warning"}
            value={rowData.verified ? "Verified" : "Pending"}
        />
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

    // Dialog render
    const renderUserDialog = () => (
        <Dialog
            visible={userDialog}
            onHide={() => setUserDialog(false)}
            header="User Details"
            className="admin-user-dialog"
        >
            {selectedUser && (
                <div className="admin-user-details">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Username:</strong> {selectedUser.username}</p>
                </div>
            )}
        </Dialog>
    );

    const actionBodyTemplate = (rowData) => {
        if (!rowData.verified) {
            return (
                <div className="action-buttons">
                    <Button
                        icon="pi pi-check"
                        className="p-button-rounded p-button-success p-button-text"
                        onClick={() => handleVerifyClick(rowData.id)}
                        tooltip="Verify Donation"
                        tooltipOptions={{ position: 'left' }}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Dialog
                visible={confirmDialog}
                onHide={() => setConfirmDialog(false)}
                header="Confirm Verification"
                modal
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => setConfirmDialog(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Verify"
                            icon="pi pi-check"
                            onClick={handleVerifySubmit}
                            loading={verifying}
                            autoFocus
                        />
                    </div>
                }
            >
                <p>Are you sure you want to verify this donation?</p>
            </Dialog>
            <Toast ref={toast} position="bottom-right" />
            <div className="admin-table-card">
                <DataTable
                    value={donations}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    emptyMessage="No donations found"
                    className="admin-donations-table"
                    header={
                        <div className="admin-table-header">
                            <h2>All Donations</h2>
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
                        field="donationDate"
                        header="Date"
                        dataType="date"
                        body={dateBodyTemplate}
                        sortable
                        filter
                        filterElement={dateFilterTemplate}
                    />
                    <Column
                        field="numChild"
                        header="Children"
                        dataType="numeric"
                        sortable
                        filter
                        filterPlaceholder="Children"
                    />

                    <Column
                        field="amount"
                        header="Amount"
                        dataType="numeric"
                        body={amountBodyTemplate}
                        sortable
                        filter
                        filterPlaceholder="Amount"
                    />
                    <Column
                        field="recieptUrl"
                        header="Receipt"
                        body={receiptBodyTemplate}
                    />
                    <Column
                        field="verified"
                        header="Status"
                        body={verifiedBodyTemplate}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={statusOptions}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Status"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        field="actions"
                        header="Actions"
                        body={actionBodyTemplate}
                        style={{ width: '8%', minWidth: '80px' }}
                        headerStyle={{ textAlign: 'center' }}
                        bodyStyle={{ textAlign: 'center', padding: '0.5rem' }}
                    />
                </DataTable>
            </div >
            {renderUserDialog()}
        </>
    );
};


export default DonationsTable;