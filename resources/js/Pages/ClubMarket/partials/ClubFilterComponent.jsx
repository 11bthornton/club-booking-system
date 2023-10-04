import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Typography, Box
} from '@mui/material';
import { Divider } from '@mui/material';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { ClubCard } from './ClubCard';
import { ClubModal } from "./ClubModal";





function findClubByInstanceID(clubs, instanceID) {



    return Object.values(clubs).find(club => {
        console.log(Object.values(club.club_instances))

        return (Object.values(club.club_instances).some(instance => instance.id === instanceID))
    }
    );
}

export function ClubFilterComponent({ availableClubs, setAvailableClubs, activeStep, clubSelections, setClubSelections, handleBack, handleNext, steps }) {

    // console.log("HEREER", availableClubs);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState("Wednesday");
    const term = activeStep + 1;

    const handleModalOpen = (day) => {
        setSelectedDay(day);
        setModalOpen(true);
    };

    const handleModalClose = (success = false) => {
        setModalOpen(false);
    };

    const selectedClubWednesday = clubSelections[activeStep].Wednesday;
    const selectedClubFriday = clubSelections[activeStep].Friday;

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <div className="bg-white rounded-lg shadow-md pr-6">
            <Box style={{ padding: '20px', width: '100%', borderRadius: '2em' }} className="mt-8">
                <div className="flex justify-between items-baseline ">

                    <Typography variant="h5" align="" gutterBottom fontWeight={600}>
                        Choose your Clubs for Term {term}.
                    </Typography>

                    <Box display="flex" justifyContent="center" marginTop={4}>

                        <Button disabled={activeStep === 0} onClick={handleBack} color='primary'>
                            Back
                        </Button>

                        {activeStep === steps.length - 1 ?

                            <Button variant="contained" color="primary" onClick={() => { }}>
                                Finish
                            </Button> :

                            <Button variant="contained" color="primary" onClick={handleNext}>
                                Next
                            </Button>
                        }

                    </Box>
                </div>

                <Typography variant="h6" align="" gutterBottom fontWeight={300}>
                    When you're ready, press <em>next</em>.
                </Typography>

                <Divider style={{ margin: '10px 0' }} />

                <div className="flex gap-4 items-baseline justify-center mt-4 mb-2">
                    <FontAwesomeIcon
                        icon={faCalendarDays}
                        className='mb-4'
                    />
                    <em>Term dates: 1st September 2024 - 3rd October 2024</em>
                </div>

                <Divider style={{ margin: '10px 0' }} />

                <Box
                    display="flex"
                    flexDirection={matches ? 'column' : 'row'}
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                >                    <ClubCard
                        day="Wednesday"
                        isSelected={!!selectedClubWednesday}
                        instance={selectedClubWednesday?.id}
                        club={findClubByInstanceID(availableClubs, selectedClubWednesday?.id)}
                        onChoose={handleModalOpen}
                        term={term}
                        setAvailableClubs={setAvailableClubs}
                        setClubSelections={setClubSelections}
                    />
                    <ClubCard
                        day="Friday"
                        isSelected={!!selectedClubFriday}
                        instance={selectedClubFriday?.id}
                        club={findClubByInstanceID(availableClubs, selectedClubFriday?.id)}
                        onChoose={handleModalOpen}
                        term={term}
                        setClubSelections={setClubSelections}
                        setAvailableClubs={setAvailableClubs}
                    />
                </Box>

                <ClubModal
                    open={modalOpen}
                    handleClose={handleModalClose}
                    day={selectedDay}
                    term={term}
                    availableClubs={availableClubs}
                    setAvailableClubs={setAvailableClubs}
                    clubSelections={clubSelections}
                    setClubSelections={setClubSelections}
                />

            </Box>
        </div>
    );
}

import { useTheme } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
