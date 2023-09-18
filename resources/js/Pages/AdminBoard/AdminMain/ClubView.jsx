import React, { useEffect, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import toast from "react-hot-toast";

import Alert from "@mui/material/Alert";

import { Avatar } from "@mui/material";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, TextField, Chip, Box } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import AddIcon from '@mui/icons-material/Add';

import { Checkbox } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
export default function ClubView({ auth, clubs }) {

    const [searchQuery, setSearchQuery] = useState('');

    const [open, setOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);

    const filteredClubs = clubs.filter(
        (club) => club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [selectedClubs, setSelectedClubs] = useState([]);

    const handleCheckboxChange = (clubId) => {
        setSelectedClubs((prev) =>
            prev.includes(clubId)
                ? prev.filter(id => id !== clubId)
                : [...prev, clubId]
        );
    };

    const handleClickOpen = (club) => {
        setSelectedClub(club);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedClub(null);
    };

    const handleDelete = () => {
        toast.success(`Successfully deleted ${selectedClub.name}`);
        // TODO: Implement your delete logic here
        setOpen(false);
    };

    const handleSelectAll = () => {
        if (selectedClubs.length === clubs.length) {
            setSelectedClubs([]);
        } else {
            setSelectedClubs(clubs.map(club => club.id));
        }
    };

    const isClubSelected = (clubId) => selectedClubs.includes(clubId);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<div className="flex gap-5 align-centerfont-semibold text-xl text-gray-800 leading-tight"> <ArrowBackIosIcon /> <p>View Clubs</p></div>}
        >
            <Head title="Add New Club" />

            <div class="container mx-auto p-6">

                <div className="flex justify-between items-baseline mb-1">
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2 }} // Adding a margin at the bottom for some space between search and table
                    />

                    <div className="flex items-center gap-3">
                        Eligible to
                        <Box display="flex" gap={2}>
                            {[7, 8, 9, 10, 11].map((year, index) => (
                                <Chip
                                    key={index}
                                    label={`Year ${year}`}
                                    variant="outlined"
                                    clickable
                                />
                            ))}
                        </Box>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }} className="mb-5">
                    <Chip
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        console.log('Add clicked');
                                        // e.stopPropagation();  // Prevents chip click from triggering
                                    }}
                                >
                                    <AddIcon style={{ color: 'green' }} />
                                </IconButton>

                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        console.log('Delete clicked');
                                        // e.stopPropagation();  // Prevents chip click from triggering
                                    }}
                                >
                                    <DeleteIcon style={{ color: 'red' }} />
                                </IconButton>
                            </div>
                        }
                        clickable
                        onClick={() => { console.log('Chip clicked'); }}
                        variant="outlined"
                        style={{ backgroundColor: 'white' }}
                    />
                </div>

                <Paper elevation={3}>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ py: 0 }}>
                                    <Checkbox
                                        checked={selectedClubs.length === clubs.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 0 }}>
                                    <p className="font-semibold">Name</p>
                                </TableCell>
                                <TableCell sx={{ py: 0 }}><p className="font-semibold">Description</p></TableCell>
                                <TableCell sx={{ py: 0 }}><p className="font-semibold">Created At</p></TableCell>
                                <TableCell sx={{ py: 0 }}><p className="font-semibold">Updated At</p></TableCell>
                                <TableCell sx={{ py: 0 }} align="right"><p className="font-semibold">Actions</p></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clubs.map((club, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ py: 0 }}>
                                        <Checkbox
                                            checked={isClubSelected(club.id)}
                                            onChange={() => handleCheckboxChange(club.id)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <p className="font-medium">{club.name}</p>
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <TruncatedDescription description={club.description} />
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }}>{club.created_at}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{club.updated_at}</TableCell>
                                    <TableCell sx={{ py: 0 }} align="right">
                                        <IconButton onClick={() => handleEdit(club)}>
                                            <EditIcon />
                                        </IconButton>
                                        <>
                                            <IconButton onClick={() => handleClickOpen(club)}>
                                                <DeleteIcon />
                                            </IconButton>

                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Do you really want to delete {selectedClub?.name}?
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleClose} color="primary">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleDelete} color="primary" autoFocus>
                                                        Delete
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

            </div>
        </AuthenticatedLayout>
    );

}

function TruncatedDescription({ description }) {
    const truncatedDescription = description.length > 50 ? description.substr(0, 50) + "…" : description;

    return (
        <em className="truncate max-w-[300px] block overflow-hidden">
            {truncatedDescription}
        </em>
    );
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}