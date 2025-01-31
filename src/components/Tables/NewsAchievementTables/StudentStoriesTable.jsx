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

export const StudentStoriesTable = ({ stories, loading, onRefetch }) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const toast = useRef(null);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        studentName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        category: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(
                `${API_URL}/news/delete/story/${selectedStory.id}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                }
            );
            onRefetch()
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Story deleted successfully',
                life: 3000
            });
        } catch (error) {
            console.log(error)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete story',
                life: 3000
            });
        } finally {
            setDeleting(false);
            setDeleteDialog(false);
            setSelectedStory(null);
        }
    };

    const dateBodyTemplate = (rowData) => {
        return rowData.date?.toLocaleDateString('en-IN');
    };

    const actionBodyTemplate = (rowData) => (
        <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => {
                setSelectedStory(rowData);
                setDeleteDialog(true);
            }}
            tooltip="Delete Story"
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
            <p>Are you sure you want to delete this story?</p>
        </Dialog>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="admin-table-card">
                <DataTable
                    value={stories}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    header={
                        <div className="admin-table-header">
                            <h2>Student Stories</h2>
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
                        field="studentName"
                        header="Student Name"
                        sortable
                        filter
                    />
                    <Column
                        field="category"
                        header="Category"
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
                        field="date"
                        header="Date"
                        body={dateBodyTemplate}
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

StudentStoriesTable.propTypes = {
    stories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            studentName: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            class: PropTypes.string.isRequired,
            date: PropTypes.instanceOf(Date).isRequired,
            score: PropTypes.number,
            studentImage: PropTypes.string,
            createdAt: PropTypes.instanceOf(Date).isRequired
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    onRefetch: PropTypes.func.isRequired
};