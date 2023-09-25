import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { TextField, Chip, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Switch } from '@mui/material';
import Link from '@mui/material/Link';

import { faEdit } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faTrash } from '@fortawesome/free-solid-svg-icons';


const useStyles = makeStyles({
    root: {
        '& .MuiDataGrid-row': {
            cursor: 'pointer',
        },
        '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #E0E0E0',
        },
        '& .MuiDataGrid-columnsContainer': {
            backgroundColor: '#F5F5F5',
        },
    },
});

export default function ClubView({ auth, clubs }) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 120 },
        { field: 'description', headerName: 'Description', width: 220 },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) => {
                return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            width: 200,
            renderCell: (params) => {
                return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            field: 'instances',
            headerName: 'Instances',
            width: 140,
            renderCell: (params) => (
                <Link href={`/admin/clubs/${params.id}`} color="primary" underline="hover">
                    <div className="flex gap-2 items-center">
                        View Instances
                        <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEdit(params)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Link>
            )
        },
        {
            field: 'is_paid',
            headerName: 'Requires Payment',
            align: "center",
            width: 140,
            renderCell: (params) => {
                if (params.value) {
                    return <FontAwesomeIcon icon={faDollarSign} />;
                }
                return 'No';
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: "center",
            width: 100,
            align: "center",
            renderCell: (params) => (
                <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDelete(params)}
                    style={{ cursor: 'pointer' }}
                />
            )
        },
        {
            field: 'openForBookings',
            headerName: 'Open for Bookings',
            headerAlign: 'center',  // you can set this to 'left', 'right', or 'center'
            align: "center",
            renderHeader: () => (
                <span>Open <strong>all</strong> for Bookings</span>
            ),
            width: 180,
            renderCell: (params) => {
                return (
                    <Switch
                        checked={params.value}
                        onChange={() => handleToggle(params)}
                        color="primary"
                    />
                );
            }
        },
    ];

    const handleRowClick = (param) => {
        const club = clubs.find((c) => c.id === param.id);
        setSelectedClub(club);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedClub(null);
    };

    const handleDelete = (params) => {
        const club = clubs.find((c) => c.id === params.id);
        setSelectedClub(club);
        toast.success(`Successfully deleted ${selectedClub.name}`);
        // Perform actual deletion here
        setOpen(false);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex gap-5 align-center font-semibold text-xl text-gray-800 leading-tight'>
                    <p>View Clubs</p>
                </div>
            }>
            <Head title='View Clubs' />
            <div className='container mx-auto p-6 bg-white mt-5 rounded-lg shadow-lg'>

                <div className={classes.root}>
                    <DataGrid
                        rows={clubs}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{'Are You Sure?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete {selectedClub?.name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color='primary'>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
