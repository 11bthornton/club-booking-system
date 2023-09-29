import { useState } from 'react';
// import { useEffect } from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import toast from 'react-hot-toast';
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
import { Button } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import ScheduleIcon from '@mui/icons-material/Schedule';

export default function Dashboard({ auth, bookedClubInstances, clubInformation, error }) {

    useEffect(() => {
        if(error) {
            toast.error(error);
        }
    }, [error]);

    const announcements = [
        { type: 'info', text: 'Lorem ipsum dolor sit amet.' },
        { type: 'warning', text: 'Lorem ipsum dolor sit amet.' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home </h2>}
        >
            <Head title="Home" />

            <div className="max-w-7xl  mx-auto sm:px-6 lg:px-8 p-4">

                {/* <div className="text-xl mb-4">
                    Good Afternoon!
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    <div className="rounded-lg w-full md:col-span-2 h-full font-light">

                        <UserClubs
                            clubData={bookedClubInstances}
                        >

                        </UserClubs>

                    </div>

                    <div className="  md:col-start-1 md:row-span-3">
                        <BookingStatus isOpen={true} scheduledTime="Sept 30, 2023, 5:00 PM" />
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md md:col-start-2">
                        <div className="text-3xl font-black mb-2">Your Actions</div>
                        <div className='mb-4 capitalize text-2xl '>
                            <strong>12 / 12</strong> Clubs Booked!
                        </div>
                        <Alert severity='success'
                            action={
                                <Button color="inherit" size="" variant="outlined">
                                    Change
                                </Button>
                            }
                        >
                            <AlertTitle>
                                <strong>Nothing to do!</strong>
                            </AlertTitle>
                            You've already booked all your clubs!
                        </Alert>
                        or
                        <Alert severity='warning' action={
                            <Button color="inherit" size="" variant="outlined">
                                Book now
                            </Button>
                        }>
                            <AlertTitle>
                                <strong>Book your clubs!</strong>
                            </AlertTitle>
                            You still need to book your clubs!

                        </Alert>
                        or
                        <Alert severity='error'>
                            <AlertTitle>
                                <strong>Bookings Closed!</strong>
                            </AlertTitle>

                            Bookings have now closed. You will not be able to change your bookings.

                        </Alert>
                        <div className="flex justify-end">

                        </div>

                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md md:col-start-2">
                        <AnnouncementsPanel announcements={announcements} />

                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <span className="text-2xl font-bold">Your Clubs</span>
                        <p>
                            {
                                JSON.stringify(auth)
                            }
                        </p>
                    </div>
                    
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

import { Link } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const BookingStatus = ({ isOpen, scheduledTime }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-md h-full">
            <div className="flex items-center ">
                {isOpen ? (
                    <>

                        <div className="flex flex-col w-full">
                            <div className='flex items-center justify-between w-full gap-4'>
                                <span className="text-3xl font-semibold">Bookings are Open!</span>
                                <CheckCircleIcon style={{ fontSize: 40, color: 'green' }} />

                            </div>
                            <span className="text-lg text-gray-600 ">
                                You can now book your clubs.
                            </span>
                            <div className="flex flex-col space-x-2 mt-2">
                                <Alert severity='warning' icon={<ScheduleIcon />}>
                                    <span className="text-sm text-gray-600">
                                        Scheduled to close: <strong>{scheduledTime}</strong>
                                    </span>
                                </Alert>

                            </div>
                            <div className='mt-3'>
                                <Button
                                    variant="contained"
                                    size="large"
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <CancelIcon style={{ fontSize: 40, color: 'red' }} />
                        <div className="flex flex-col">
                            <span className="text-3xl font-semibold">Bookings are Closed</span>
                            <span className="text-lg text-gray-600">We are currently not accepting any bookings.</span>
                            <div className="flex items-center space-x-2 mt-2">
                                <ScheduleIcon style={{ fontSize: 20, color: 'gray' }} />
                                <span className="text-sm text-gray-600">Scheduled to open: {scheduledTime}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const AnnouncementsPanel = ({ announcements }) => {
    return (
        <div className="max-w-md mx-auto bg-white rounded-lg sm:max-w-xl md:max-w-full lg:max-w-screen-xl">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-semibold">Announcements</h2>
            </div>
            <div className='mb-2'>
                <Alert
                    severity='info'
                    icon={<CampaignIcon />}
                    action={
                        <Button>
                            Read
                        </Button>
                    }
                >
                    <AlertTitle>
                        <strong>Today at 12:32pm</strong>
                        <p>
                            Bookings go live today. Please make sure you have read and understood
                            the rules
                        </p>
                    </AlertTitle>
                </Alert>
            </div>
            <ul>
                {announcements.map((announcement, index) => (
                    <li key={index} className="flex items-center space-x-4 mb-2">
                        {announcement.type === 'info' ? (
                            <InfoIcon style={{ fontSize: 24, color: 'blue' }} />
                        ) : (
                            <WarningIcon style={{ fontSize: 24, color: 'orange' }} />
                        )}
                        <span className="text-sm text-gray-700">{announcement.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// import { useState } from 'react';

const UserClubs = ({ clubData }) => {
    const groupedByTerm = clubData.reduce((acc, club) => {
        const term = club.half_term;
        if (!acc[term]) {
            acc[term] = [];
        }
        acc[term].push(club);
        return acc;
    }, {});

    // Assuming terms range from 1 to 6
    const allTerms = [1, 2, 3, 4, 5, 6];
    const [collapsed, setCollapsed] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const updateWidth = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleExpandClick = (term) => {
        setExpandedTerm(expandedTerm === term ? null : term);
    };
    return (
        <div className="max-w-screen-xl mx-auto">


            <div className="flex justify-between items-baseline">
                <div className="text-4xl font-semibold mb-4">Your Clubs</div>
                <Tooltip title="Download iCal">
                    <IconButton color="primary" onClick={() => { /* Download iCal function */ }}>
                        <CalendarTodayIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {screenWidth <= 640 ? (
                <div>
                    <IconButton onClick={() => setCollapsed(!collapsed)}>
                        <ExpandMoreIcon />
                    </IconButton>
                    View More
                    <Collapse in={collapsed}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {allTerms.map((term, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
                                    <div className="flex justify-between items-baseline">
                                        <div className="font-semibold mb-2 cursor-pointer" >
                                            Term {term}
                                        </div>
                                    </div>

                                    <ul>
                                        <li className='flex justify-between'>
                                            Wednesday:{" "}
                                            {groupedByTerm[term] &&
                                                groupedByTerm[term].find((club) => club.day_of_week === "Wednesday")
                                                ? groupedByTerm[term]
                                                    .filter((club) => club.day_of_week === "Wednesday")
                                                    .map((club, i) => club.club.name)
                                                    .join(", ")
                                                : <strong>None</strong>
                                            }
                                        </li>
                                        <li>
                                            Fri:{" "}
                                            {groupedByTerm[term] &&
                                                groupedByTerm[term].find((club) => club.day_of_week === "Friday")
                                                ? groupedByTerm[term]
                                                    .filter((club) => club.day_of_week === "Friday")
                                                    .map((club, i) => club.club.name)
                                                    .join(", ")
                                                : <strong>None</strong>
                                            }
                                        </li>
                                    </ul>

                                </div>
                            ))}
                        </div>
                    </Collapse>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {allTerms.map((term, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
                            <div className="flex justify-between items-baseline">
                                <div className="font-semibold mb-2 cursor-pointer" >
                                    Term {term}
                                </div>
                            </div>

                            <ul>
                                <li>
                                    Wednesday:{" "}
                                    {groupedByTerm[term] &&
                                        groupedByTerm[term].find((club) => club.day_of_week === "Wednesday")
                                        ? groupedByTerm[term]
                                            .filter((club) => club.day_of_week === "Wednesday")
                                            .map((club, i) => club.club.name)
                                            .join(", ")
                                        : <strong>None</strong>
                                    }
                                </li>
                                <li>
                                    Fri:{" "}
                                    {groupedByTerm[term] &&
                                        groupedByTerm[term].find((club) => club.day_of_week === "Friday")
                                        ? groupedByTerm[term]
                                            .filter((club) => club.day_of_week === "Friday")
                                            .map((club, i) => club.club.name)
                                            .join(", ")
                                        : <strong>None</strong>
                                    }
                                </li>
                            </ul>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


