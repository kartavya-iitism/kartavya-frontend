import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { API_URL } from '../../../config';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Tables.css';

export const UpdatesTable = ({ updates, loading, onRefetch }) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const toast = useRef(null);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        examType: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        title: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(
                `${API_URL}/news/delete/update/${selectedUpdate.id}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                }
            );
            onRefetch();
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Update deleted successfully',
                life: 3000
            });
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete update',
                life: 3000
            });
        } finally {
            setDeleting(false);
            setDeleteDialog(false);
            setSelectedUpdate(null);
        }
    };

    const dateBodyTemplate = (rowData) => {
        return rowData.date.toLocaleDateString('en-IN');
    };

    const actionBodyTemplate = (rowData) => (
        <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => {
                setSelectedUpdate(rowData);
                setDeleteDialog(true);
            }}
            tooltip="Delete Update"
            tooltipOptions={{ position: 'left' }}
        />
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
                        onClick={handleDelete}
                        loading={deleting}
                        className="p-button-danger"
                        autoFocus
                    />
                </div>
            }
        >
            <p>Are you sure you want to delete this update?</p>
        </Dialog>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="admin-table-card">
                <DataTable
                    value={updates}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    header={
                        <div className="admin-table-header">
                            <h2>Recent Updates</h2>
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
                        field="date"
                        header="Date"
                        body={dateBodyTemplate}
                        sortable
                    />
                    <Column
                        field="examType"
                        header="Exam Type"
                        sortable
                        filter
                    />
                    <Column
                        field="title"
                        header="Title"
                        sortable
                        filter
                    />
                    <Column
                        field="description"
                        header="Description"
                        sortable
                    />
                    <Column
                        body={actionBodyTemplate}
                        headerStyle={{ width: '5rem' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                </DataTable>
            </div>
            {renderDeleteDialog()}
        </>
    );
};

UpdatesTable.propTypes = {
    updates: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            date: PropTypes.instanceOf(Date).isRequired,
            examType: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            createdAt: PropTypes.instanceOf(Date).isRequired
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    onRefetch: PropTypes.func.isRequired
};