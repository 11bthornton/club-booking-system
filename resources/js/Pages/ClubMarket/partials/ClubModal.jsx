import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Typography, Box, Alert
} from '@mui/material';
import toast from 'react-hot-toast';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

export function ClubModal({ open, handleClose, term, day, availableClubs, bookClub, removeClub, clubSelections, setClubSelections, setAvailableClubs }) {
    const [changeInfoModalOpen, setChangeInfoModalOpen] = useState(false);
    const [selectedChangeInfo, setSelectedChangeInfo] = useState({});
    const [selectedInstanceToBook, setSelectedInstanceToBook] = useState(null);

    async function postClub(clubId) {
        // Retrieve CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        console.log(csrfToken);

        try {
            const response = await fetch(`/club/${clubId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
            });

            const data = await response.json();

            // Check the response status
            if (response.ok) {
                // console.log(data); // Successfully booked the club.
                return data;
            } else {
                console.error(data.message); // Error messages, e.g., "No available slots for this club."
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('There was an error:', error);
            throw error;
        }
    }

    async function findClubChanges(clubId) {
        // Retrieve CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        console.log(csrfToken);

        try {
            const response = await fetch(`/simulate-book/${clubId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
            });

            const data = await response.json();

            if (response.ok) {

                return data;
            } else {
                console.error(data.message); 
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('There was an error:', error);
            throw error;
        }
    }

    console.log(availableClubs);
    // Filter the club instances based on term and day
    const filteredClubs = Object.values(availableClubs).filter(club => club.club_instances.some(instance => instance.half_term === term && instance.day_of_week === day
    )
    );

    const alreadySelectedAsIds = clubSelections.flatMap(obj => Object.values(obj).map(day => day && day.id).filter(Boolean));

    return (
        <Modal
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="club-modal-title"
            aria-describedby="club-modal-description"
        >
            <Box
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vh',
                    backgroundColor: 'white',
                    boxShadow: 24,
                    padding: '20px',
                    overflowY: 'auto',
                }}
            >

                <div className="flex justify-between items-baseline">
                    <h2 id="club-modal-title"  className='font-bold text-5xl'>
                        Select your club for {day}, Term {term}.
                    </h2>
                    <Button data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" style={{ marginTop: '20px' }} variant="contained" color="primary" onClick={() => handleClose(false)}>
                        Close
                    </Button>
                </div>

                <Divider style={{ margin: '20px 0px' }} />

                <Box style={{ marginBottom: '20px', padding: "0px 20px" }}>

                </Box>

                <Box display="flex" justifyContent="space-between" padding={"20px"}>
                    <Box flex={0.7} style={{ marginRight: '20px' }}>
                        {filteredClubs.map(club => {

                            const instance = club.club_instances.filter(instance => instance.day_of_week == day && instance.half_term == term)[0];

                            return (
                                <Box key={club.id} style={{ margin: '20px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }} className="shadow-lg">
                                    <div className="flex justify-between items-baseline">
                                        <div className="flex items-baseline gap-4">
                                            <h2 className='text-4xl font-bold ' style={{ minWidth: "500px" }}>{club.name}</h2>


                                            <div className="flex gap-2 items-baseline">
                                                <Typography variant="body2">{instance.day_of_week}, </Typography>
                                                <Typography variant="body2">Term {instance.half_term}</Typography>
                                                <Typography variant="body2">id {instance.id}</Typography>


                                            </div>

                                        </div>
                                        <div className="flex gap-2 items-baseline">
                                            <h2>
                                                {club.is_paid ?
                                                    <FontAwesomeIcon icon={faDollarSign} className='text-red-600' /> : ""}
                                            </h2>
                                            <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />
                                            <h2 className='text-xl font-semibold'>
                                                <em>{instance.capacity} spaces left</em>
                                            </h2>
                                        </div>
                                    </div>
                                    <Divider style={{ margin: '10px 0' }} />

                                    <div className="flex">
                                        <div className='flex flex-col gap-3' style={{ width: "80%" }}>
                                            <p className="text-xl">{club.description}</p>
                                            <Typography variant="body2">Rules: <em>{club.rule}</em></Typography>
                                        </div>

                                        {alreadySelectedAsIds.some(id => instance.incompatible_club_ids.includes(id)) ?
                                            <Alert severity='error'>
                                                You have already selected another instance of this club. Selecting this one will remove your
                                                existing booking. You will then have to choose another for that day.
                                            </Alert>
                                            :
                                            <></>}
                                    </div>
                                    <Divider style={{ margin: '10px 0' }} />

                                    <Button
                                        style={{ marginTop: '10px' }}
                                        variant="outlined"
                                        onClick={async () => {
                                            try {
                                                const changeInfo = await findClubChanges(instance.id);
                                                setSelectedChangeInfo(changeInfo.data);
                                                setSelectedInstanceToBook(instance.id);
                                                setChangeInfoModalOpen(true);
                                            } catch (error) {
                                                console.error("Error fetching change info:", error);
                                            }
                                        }}
                                    >
                                        Select
                                    </Button>


                                </Box>
                            );
                        })}
                    </Box>

                    <Modal
                        open={changeInfoModalOpen}
                        onClose={() => setChangeInfoModalOpen(false)}
                        aria-labelledby="change-info-modal-title"
                        aria-describedby="change-info-modal-description"
                    >
                        <Box
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white shadow-lg p-5"

                        >
                            <h2
                                id="change-info-modal-title"
                                className="text-center text-2xl mb-5"
                            >
                                Change Information
                            </h2>

                            <p className="text-green-500 mb-3">
                                Clubs to Book: {selectedChangeInfo.clubsToBook?.join(", ")}
                            </p>

                            <p className="text-red-500 mb-5">
                                Clubs to Remove: {selectedChangeInfo.clubsToDelete?.join(", ")}
                            </p>
                            <div className='flex justify-between items-center '>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {

                                        const notify = toast.promise(
                                            postClub(selectedInstanceToBook),
                                            {
                                                loading: `Booking club... ${selectedInstanceToBook}`,
                                                success: 'Club booked successfully!',
                                                error: (err) => err.toString()
                                            }
                                        ).then((response) => {
                                            console.log("response is: ", response);


                                            console.log(response.data);

                                            const newBookedClubs = response.data.alreadyBookedOn;

                                            setAvailableClubs(response.data.availableClubs);
                                            setClubSelections(Object.values(newBookedClubs));

                                            handleClose(true);
                                        }).catch((error) => {
                                            // Handle any error from postClub if needed
                                            console.error("Error booking club:", error);
                                        });


                                        setChangeInfoModalOpen(false);

                                    }}
                                >
                                    Confirm Changes and Book
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setChangeInfoModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Box>
                    </Modal>

                    {/* Vertical Divider */}
                    <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />


                    <Box flex={0.3} style={{ padding: '0 20px' }} className="sticky top-20">
                        <Typography variant="h6">
                            Your Selections
                        </Typography>
                        {clubSelections.map((selection, index) => (
                            <Box key={index} marginBottom={2} style={{
                                backgroundColor: (index + 1 === term) ? '#f5f5f5' : 'transparent',
                                padding: '5px',
                                borderRadius: '4px'
                            }}>
                                <Typography
                                    variant="subtitle1"
                                    style={{
                                        fontWeight: (index + 1 === term) ? 'bold' : 'normal'
                                    }}
                                >
                                    Term {index + 1}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    style={{
                                        textDecoration: (index + 1 === term && day === 'Wednesday') ? 'underline' : 'none'
                                    }}
                                >
                                    Wednesday: {selection.Wednesday ? selection.Wednesday.id : 'Not Selected'}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    style={{
                                        textDecoration: (index + 1 === term && day === 'Friday') ? 'underline' : 'none'
                                    }}
                                >
                                    Friday: {selection.Friday ? selection.Friday.id : 'Not Selected'}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>


                <Tooltip id="icon-tooltip-s" effect="solid" />
            </Box>
        </Modal>
    );


}
