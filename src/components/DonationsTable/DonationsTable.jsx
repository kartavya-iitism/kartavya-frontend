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
import { Tooltip } from 'primereact/tooltip';
import { API_URL } from '../../config';
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
    const [rejectDialog, setRejectDialog] = useState(false);
    const [selectedRejectDonation, setSelectedRejectDonation] = useState(null);
    const [rejectMessage, setRejectMessage] = useState('');
    const [rejecting, setRejecting] = useState(false);


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
            const response = await axios.get(`${API_URL}/donation/viewAllDonation`);
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
            await axios.put(`${API_URL}/donation/verify/${selectedDonationId}`, {}, {
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

    const handleRejectSubmit = async () => {
        setRejecting(true);
        try {
            await axios.put(`${API_URL}/donation/reject/${selectedRejectDonation.id}`,
                { message: rejectMessage },
                { headers: { Authorization: `Bearer ${localStorage.token}` } }
            );

            setDonations(donations.map(d =>
                d.id === selectedRejectDonation.id ? { ...d, verified: false, rejected: true } : d
            ));

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Donation rejected successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Reject error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to reject donation',
                life: 3000
            });
        } finally {
            setRejecting(false);
            setRejectDialog(false);
            setSelectedRejectDonation(null);
            setRejectMessage('');
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

    const verifiedBodyTemplate = (rowData) => {
        if (!rowData?.rejected) {
            return (
                <Tag
                    severity={rowData.verified ? "success" : "warning"}
                    value={rowData.verified ? "Verified" : "Pending"}
                />)
        }
        if (rowData?.rejected) {
            return (
                <Tag
                    severity={"danger"}
                    value={"Rejected"}
                />
            )
        }
    }

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
        if (!rowData.verified && !rowData.rejected) {
            return (
                <div className="action-buttons">
                    <Button
                        icon="pi pi-check"
                        className="p-button-rounded p-button-success p-button-text"
                        onClick={() => handleVerifyClick(rowData.id)}
                        tooltip="Verify Donation"
                        tooltipOptions={{ position: 'left' }}
                    />
                    <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-danger p-button-text"
                        onClick={() => {
                            setSelectedRejectDonation(rowData);
                            setRejectDialog(true);
                        }}
                        tooltip="Reject Donation"
                        tooltipOptions={{ position: 'left' }}
                    />
                </div>
            );
        }
        if (rowData.rejected) {
            return <>
                <Tooltip target=".rejected-tag" />
                <div
                    className="rejected-tag p-button-link name-cell-btn"
                    data-pr-tooltip={rowData?.rejectionReason}
                    data-pr-position="left"
                >
                    Reason
                </div>
            </>
        }
        return null;
    };

    const renderRejectDialog = () => (
        <Dialog
            visible={rejectDialog}
            onHide={() => {
                setRejectDialog(false);
                setRejectMessage('');
            }}
            header="Reject Donation"
            modal
            footer={
                <div>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => {
                            setRejectDialog(false);
                            setRejectMessage('');
                        }}
                        className="p-button-text"
                    />
                    <Button
                        label="Reject"
                        icon="pi pi-times"
                        onClick={handleRejectSubmit}
                        loading={rejecting}
                        className="p-button-danger"
                        disabled={!rejectMessage.trim()}
                        autoFocus
                    />
                </div>
            }
        >
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="rejectMessage">Rejection Reason</label>
                    <InputText
                        id="rejectMessage"
                        value={rejectMessage}
                        onChange={(e) => setRejectMessage(e.target.value)}
                        required
                        autoFocus
                        className="w-full"
                    />
                </div>
            </div>
        </Dialog>
    );

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
            {renderRejectDialog()}
        </>
    );
};


export default DonationsTable;