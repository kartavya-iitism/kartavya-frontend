import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { API_URL } from '../../../config';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';
import './ContactTable.css';

const ContactTable = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [notifyDialog, setNotifyDialog] = useState(false);
    const [selectedDeleteContact, setSelectedDeleteContact] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [sending, setSending] = useState(false);
    const [emailData, setEmailData] = useState({ subject: '', message: '' });
    const toast = useRef(null);
    const [statusDialog, setStatusDialog] = useState(false);
    const [selectedStatusContact, setSelectedStatusContact] = useState(null);
    const [statusData, setStatusData] = useState({ status: '', resolutionNotes: '' });
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        contactNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/contact/all`, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });
            setContacts(response.data.contacts.map(contact => ({
                ...contact,
                id: contact._id,
                date: new Date(contact.date),
                resolvedAt: contact.resolvedAt ? new Date(contact.resolvedAt) : null,
                status: contact.status || 'pending'
            })));
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch contacts',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const statusBodyTemplate = (rowData) => {
        const severityMap = {
            'pending': 'warning',
            'in-progress': 'info',
            'resolved': 'success',
            'closed': 'danger'
        };

        const tooltipId = `status-tooltip-${rowData.id}`;

        return (
            <div className="status-container">
                <Tag
                    id={tooltipId}
                    value={rowData.status}
                    severity={severityMap[rowData.status]}
                />
                {rowData.resolutionNotes && (
                    <Tooltip
                        target={`#${tooltipId}`}
                        content={rowData.resolutionNotes}
                        position="left"
                    />
                )}
            </div>
        );
    };

    const resolvedInfoTemplate = (rowData) => {
        if (!rowData.resolvedAt) return '-';
        return (
            <div className="resolved-info">
                <div>{rowData.resolvedBy?.name || '-'}</div>
                <div className="resolved-date">
                    {new Date(rowData.resolvedAt).toLocaleDateString()}
                </div>
            </div>
        );
    };


    const handleDelete = async (contacts) => {
        setDeleting(true);
        try {
            const ids = Array.isArray(contacts) ? contacts.map(c => c.id) : [contacts.id];
            console.log({ ids })
            await axios.delete(`${API_URL}/contact/bulk-delete`, {
                data: { ids },
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            setContacts(prev => prev.filter(c => !ids.includes(c.id)));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Contact(s) deleted successfully',
                life: 3000
            });
        } catch (error) {
            console.log(error)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete contact(s)',
                life: 3000
            });
        } finally {
            setDeleting(false);
            setDeleteDialog(false);
            setSelectedDeleteContact(null);
        }
    };

    const handleNotify = async (contacts) => {
        setSending(true);
        try {
            const emails = Array.isArray(contacts) ? contacts.map(c => c.email) : [contacts.email];
            await axios.post(`${API_URL}/contact/bulk-notify`, {
                emails,
                subject: emailData.subject,
                message: emailData.message
            }, {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            });

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Notification sent successfully',
                life: 3000
            });
        } catch (error) {
            console.log(error)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to send notification',
                life: 3000
            });
        } finally {
            setSending(false);
            setNotifyDialog(false);
            setEmailData({ subject: '', message: '' });
        }
    };

    const handleStatusUpdate = async () => {
        setUpdatingStatus(true);
        try {
            await axios.put(
                `${API_URL}/contact/${selectedStatusContact.id}/status`,
                statusData,
                { headers: { Authorization: `Bearer ${localStorage.token}` } }
            );

            setContacts(prev => prev.map(contact =>
                contact.id === selectedStatusContact.id
                    ? { ...contact, status: statusData.status, resolutionNotes: statusData.resolutionNotes }
                    : contact
            ));

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Status updated successfully',
                life: 3000
            });
        } catch (error) {
            console.log(error)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update status',
                life: 3000
            });
        } finally {
            setUpdatingStatus(false);
            setStatusDialog(false);
            setSelectedStatusContact(null);
            setStatusData({ status: '', resolutionNotes: '' });
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="action-buttons">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-primary p-button-text"
                onClick={() => {
                    setSelectedStatusContact(rowData);
                    setStatusData({ status: rowData.status, resolutionNotes: rowData.resolutionNotes || '' });
                    setStatusDialog(true);
                }}
                tooltip="Update Status"
            />
            <Button
                icon="pi pi-envelope"
                className="p-button-rounded p-button-success p-button-text"
                onClick={() => {
                    setSelectedContacts([rowData]);
                    setNotifyDialog(true);
                }}
                tooltip="Notify"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => {
                    setSelectedDeleteContact(rowData);
                    setDeleteDialog(true);
                }}
                tooltip="Delete"
            />
        </div>
    );

    const dateBodyTemplate = (rowData) => {
        return rowData.date.toLocaleDateString('en-IN');
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="admin-table-card">
                <DataTable
                    value={contacts}
                    selection={selectedContacts}
                    onSelectionChange={(e) => setSelectedContacts(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    emptyMessage="No contacts found"
                    header={
                        <div className="admin-table-header">
                            <h2>Contact Form Submissions</h2>
                            <div className="header-actions">
                                {selectedContacts.length > 0 && (
                                    <>
                                        <Button
                                            icon="pi pi-envelope"
                                            className="p-button-success"
                                            onClick={() => setNotifyDialog(true)}
                                            label={`Notify (${selectedContacts.length})`}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-danger"
                                            onClick={() => setDeleteDialog(true)}
                                            label={`Delete (${selectedContacts.length})`}
                                        />
                                    </>
                                )}
                                <InputText
                                    placeholder="Search..."
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
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="name" header="Name" sortable filter />
                    <Column field="email" header="Email" sortable filter />
                    <Column
                        field="contactNumber"
                        header="Contact"
                        sortable
                        filter
                        body={(rowData) => rowData.contactNumber || '-'}
                    />
                    <Column field="subject" header="Subject" sortable filter />
                    <Column field="message" header="Message" />
                    <Column
                        field="date"
                        header="Date"
                        body={dateBodyTemplate}
                        sortable
                        filter
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                        filter
                        filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={validStatuses}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select Status"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        field="resolvedBy"
                        header="Resolved By"
                        body={resolvedInfoTemplate}
                        sortable
                    />
                    <Column
                        field="resolvedAt"
                        header="Resolved Date"
                        body={(rowData) => rowData.resolvedAt ?
                            new Date(rowData.resolvedAt).toLocaleDateString() : '-'}
                        sortable
                    />
                    <Column
                        field="actions"
                        header="Actions"
                        body={actionBodyTemplate}
                        headerStyle={{ width: '8rem' }}
                    />
                </DataTable>
            </div>

            {/* Delete Dialog */}
            <Dialog
                visible={deleteDialog}
                onHide={() => setDeleteDialog(false)}
                header="Confirm Delete"
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setDeleteDialog(false)}
                        />
                        <Button
                            label="Delete"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={() => handleDelete(selectedDeleteContact || selectedContacts)}
                            loading={deleting}
                        />
                    </div>
                }
            >
                <p>Are you sure you want to delete the selected contact(s)?</p>
            </Dialog>

            {/* Notify Dialog */}
            <Dialog
                visible={notifyDialog}
                onHide={() => setNotifyDialog(false)}
                header="Send Notification"
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setNotifyDialog(false)}
                        />
                        <Button
                            label="Send"
                            icon="pi pi-send"
                            className="p-button-success"
                            onClick={() => handleNotify(selectedContacts)}
                            loading={sending}
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="subject">Subject</label>
                        <InputText
                            id="subject"
                            value={emailData.subject}
                            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="message">Message</label>
                        <InputText
                            id="message"
                            value={emailData.message}
                            onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                            rows={5}
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={statusDialog}
                onHide={() => setStatusDialog(false)}
                header="Update Status"
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setStatusDialog(false)}
                        />
                        <Button
                            label="Update"
                            icon="pi pi-check"
                            className="p-button-success"
                            onClick={handleStatusUpdate}
                            loading={updatingStatus}
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="status">Status</label>
                        <Dropdown
                            id="status"
                            value={statusData.status}
                            options={validStatuses}
                            onChange={(e) => setStatusData(prev => ({ ...prev, status: e.value }))}
                            placeholder="Select Status"
                        />
                    </div>
                    {statusData.status === 'resolved' && (
                        <div className="p-field">
                            <label htmlFor="resolutionNotes">Resolution Notes</label>
                            <InputText
                                id="resolutionNotes"
                                value={statusData.resolutionNotes}
                                onChange={(e) => setStatusData(prev => ({ ...prev, resolutionNotes: e.target.value }))}
                                rows={5}
                                required
                            />
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default ContactTable;