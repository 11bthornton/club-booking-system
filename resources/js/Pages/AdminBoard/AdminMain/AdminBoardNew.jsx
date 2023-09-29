import React, { useEffect, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import toast from "react-hot-toast";

import Alert from "@mui/material/Alert";

import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Dashboard({ auth }) {

    const [selectedDate, setSelectedDate] = useState(new Date());


    const [isDialogOpen, setDialogOpen] = useState(false);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Add New Club" />

            <div class="container mx-auto p-6">
                <div className="flex mb-5">
                    <Avatar>KT</Avatar>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div class="card">
                        <div class="p-4 bg-white rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 class="text-xl font-semibold mb-2">System</h2>
                                <div>
                                    <em className="text-bold">Bookings Open</em>
                                </div>
                            </div>
                            <Alert severity="success" className="mb-4 mt-4">
                                The system is currently <strong>open</strong> for bookings.
                            </Alert>

                            <div className="flex items-center gap-3 mb-4">
                                <FontAwesomeIcon icon={faInfo} />
                                <p class="text-gray-600">Manage information about the system. Schedule system to open at certain times. </p>
                            </div>

                            <div className="text-sm flex justify-between items-baseline mt-2">
                                <strong>Next Scheduled Open Time:</strong>
                                <p>3/4/12 12:00:00</p>
                            </div>
                            <div className="mt-2 flex justify-end">
                                <Button onClick={() => setDialogOpen(true)} variant="outlined">
                                    Schedule Next Open Time
                                </Button>
                            </div>
                            <BookingScheduler
                                open={isDialogOpen}
                                onClose={() => setDialogOpen(false)}
                            />
                            <div className="p-2 mt-3 bg-gray-100 rounded-md">
                                <h3 class="text-l font-semibold mt-2 ">Quick Links</h3>
                                <ul class="">
                                    <li><a href="#" class="text-sm text-blue-600 hover:underline">Open or schedule bookings</a></li>
                                    <li><a href="#" class="text-sm text-blue-600 hover:underline">Logs</a></li>
                                    <li><a href="#" class="text-sm text-blue-600 hover:underline">System settings</a></li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="p-4 bg-white rounded-lg shadow-md">
                            <h2 class="text-xl font-semibold mb-2">Clubs</h2>
                            <Alert severity="error" className="mb-4 mt-4">
                                7 Clubs at Capacity
                            </Alert>
                            <p class="text-gray-600">Manage clubs and information about them.</p>
                            <h3 class="text-l font-semibold mt-4">Quick Links</h3>
                            <ul class="">
                                <li><a href="admin/clubs" class="text-sm text-blue-600 hover:underline">View clubs</a></li>
                                <li><a href="admin/clubs/new" class="text-sm text-blue-600 hover:underline">Add a new club</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="card">
                        <div class="p-4 bg-white rounded-lg shadow-md">
                            <h2 class="text-xl font-semibold mb-2">Students & Bookings</h2>
                            <Alert severity="warning" className="mb-4 mt-4">
                                <strong>7 students have not made a booking yet.</strong>
                            </Alert>
                            <p class="text-gray-600">Manage information about students and their choices.</p>
                            <h3 class="text-l font-semibold mt-4">Quick Links</h3>
                            <ul class="">
                                <li><a href="/admin/students" class="text-sm text-blue-600 hover:underline">View students</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Manage users</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Settings</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Reports</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Logout</a></li>
                            </ul>
                        </div>

                    </div>

                </div>
                <div className="card p-4 bg-white rounded-lg shadow-md mt-5">
                    <h2 class="text-xl font-semibold mb-2">Overview</h2>
                </div>
            </div>
        </AuthenticatedLayout>
    );

}




// import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Dialog, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// /import Stepper from "@mui/material";

function BookingScheduler({ open, onClose }) {

    const [activeStep, setActiveStep] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedYearGroups, setSelectedYearGroups] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [selectedAll, setSelectedAll] = useState(false);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleYearGroupChange = (year, isChecked) => {
        if (isChecked) {
            setSelectedYearGroups([...selectedYearGroups, year]);
        } else {
            setSelectedYearGroups(selectedYearGroups.filter(y => y !== year));
        }
    };

    const handleSelectAll = (isChecked) => {
        setSelectedAll(isChecked);
        if (isChecked) {
            setSelectedYearGroups([7, 8, 9, 10, 11]);
        } else {
            setSelectedYearGroups([]);
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth onClose={onClose} PaperProps={{
            sx: {
                height: 800,
                position: 'relative', // Add this line
            }
        }}>
            <div className="p-4 h-4/5">
                <div className="p-6">
                    <Stepper activeStep={activeStep}>
                        <Step><StepLabel>Select Time</StepLabel></Step>
                        <Step><StepLabel>Select Year Groups</StepLabel></Step>
                        <Step><StepLabel>Select Users</StepLabel></Step>
                        <Step><StepLabel>Select Clubs</StepLabel></Step>
                        <Step><StepLabel>Confirm</StepLabel></Step>
                    </Stepper>
                </div>

                <div className="mt-6 mb-4 h-full">
                    {activeStep === 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                            width: '100%',
                            height: '100%'
                        }}>
                            {/* Left Section: Controls */}
                            <div style={{
                                flex: '0 0 60%', // This takes up 3/4 of the space
                                padding: '20px',
                                borderRight: '1px solid #ccc' // Vertical divider
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}
                                // className="mt-10"
                                >
                                    <div style={{
                                        marginBottom: '20px',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <label htmlFor="start-datetime" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Start Time</label>
                                        <input
                                            type="datetime-local"
                                            id="start-datetime"
                                            name="start-datetime"
                                            required
                                            onChange={(e) => setSelectedStartTime(e.target.value)}
                                            style={{ textAlign: 'center' }}
                                        />
                                    </div>
                                    <div style={{
                                        marginBottom: '20px',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <label htmlFor="end-datetime" style={{ fontWeight: 'bold', marginBottom: '8px' }}>End Time</label>
                                        <input
                                            type="datetime-local"
                                            id="end-datetime"
                                            name="end-datetime"
                                            required
                                            onChange={(e) => setSelectedEndTime(e.target.value)}
                                            style={{ textAlign: 'center' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Section: Info and Instructions */}
                            <div style={{
                                flex: '0 0 40%', // This takes up 1/4 of the space
                                padding: '20px'
                            }}>
                                { /* Your info and instructions go here */}
                            </div>
                        </div>
                    )}


                    {activeStep === 1 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                            width: '100%',
                            height: '100%'
                        }}>
                            {/* Left Section: Controls */}
                            <div style={{
                                flex: '0 0 60%', // This takes up 3/4 of the space
                                padding: '20px',
                                borderRight: '1px solid #ccc' // Vertical divider
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}
                                // className="mt-10"
                                >

                                    <FormControl>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedYearGroups.length == 5}
                                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                                    />
                                                }
                                                label="Select All"
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedYearGroups.includes(7)}
                                                        onChange={(e) => handleYearGroupChange(7, e.target.checked)}
                                                    />
                                                }
                                                label="Year 7"
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedYearGroups.includes(8)}
                                                        onChange={(e) => handleYearGroupChange(8, e.target.checked)}
                                                    />
                                                }
                                                label="Year 8"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedYearGroups.includes(9)}
                                                        onChange={(e) => handleYearGroupChange(9, e.target.checked)}
                                                    />
                                                }
                                                label="Year 9"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedYearGroups.includes(10)}
                                                        onChange={(e) => handleYearGroupChange(10, e.target.checked)}
                                                    />
                                                }
                                                label="Year 10"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedYearGroups.includes(11)}
                                                        onChange={(e) => handleYearGroupChange(11, e.target.checked)}
                                                    />
                                                }
                                                label="Year 11"
                                            />

                                            {/* Add more checkboxes for each year group */}
                                        </FormGroup>
                                    </FormControl>


                                </div>
                            </div>

                            {/* Right Section: Info and Instructions */}
                            <div style={{
                                flex: '0 0 40%', // This takes up 1/4 of the space
                                padding: '20px'
                            }}>
                                { /* Your info and instructions go here */}
                            </div>
                        </div>
                    )}


                    {activeStep === 2 && selectedYearGroups.length !== 5 && (
                        <FormControl>
                            <InputLabel>Users</InputLabel>
                            <Select multiple value={selectedUsers} onChange={(e) => setSelectedUsers(e.target.value)}>
                                {/* Add MenuItems for each user */}
                            </Select>
                        </FormControl>
                    )}

                    {activeStep === 3 && (
                        <FormControl>
                            <InputLabel>Clubs</InputLabel>
                            <Select multiple value={selectedClubs} onChange={(e) => setSelectedClubs(e.target.value)}>
                                {/* Add MenuItems for each club */}
                            </Select>
                        </FormControl>
                    )}

                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            {activeStep === 3 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

import { FormControlLabel } from "@mui/material";
import { FormGroup, Checkbox } from "@mui/material";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
