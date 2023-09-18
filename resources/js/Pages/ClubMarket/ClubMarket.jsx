import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import React, { useState } from "react";

import {
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Button,
    Typography,
    Container,
    Box,
    Card,
    CardContent,
    CardActions,
    Paper
} from '@mui/material';
import Badge from '@mui/material/Badge';

import toast from 'react-hot-toast';

import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function findClubByInstanceID(clubs, instanceID) {
    return Object.values(clubs).find(club =>
        club.club_instances.some(instance => instance.id === instanceID)
    );
}

export default function ClubMarket({ auth, availableClubs, alreadyBookedOn }) {

    const bookClub = (term, day, clubInstance) => {

        console.log()

        setClubSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections[term - 1][day] = clubInstance;
            return newSelections;
        });
    };

    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [clubSelections, setClubSelections] = useState(
        Array.from({ length: 6 }, () => ({ Wednesday: null, Friday: null }))
    );

    console.table(clubSelections);

    const isIncomplete = (step) => {
        return (
            !clubSelections[step].Wednesday || !clubSelections[step].Friday
        );
    };

    // Function to get the appropriate icon for a step
    const getStepIcon = (step) => {
        const commonStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            position: 'relative' // added for positioning the FiberManualRecordIcon
        };

        // Logic to determine the background color
        let backgroundColor;
        if (step < activeStep) {
            backgroundColor = isIncomplete(step) ? '#ffcccc' : '#cce5ff';
        } else if (step === activeStep) {
            backgroundColor = '#e0e0e0'; // Gray for the current step
        } else {
            backgroundColor = 'transparent';
        }

        return (
            <div style={{ ...commonStyle, backgroundColor }}>
                {step < activeStep && isIncomplete(step) && (
                    <WarningIcon color="error" fontSize="small" />
                )}
                {step < activeStep && !isIncomplete(step) && (
                    <CheckCircleIcon color="primary" fontSize="small" />
                )}
                {step === activeStep && (
                    <FiberManualRecordIcon color="primary" style={{ position: 'absolute' }} />
                )}
                {step > activeStep && (step + 1)}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Club Market</h2>}
        >
            <Head title="Club Market" />

            <div className="container mx-auto p-6">
                <Container>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton onClick={() => setActiveStep(index)}>
                                    <StepLabel StepIconComponent={() => getStepIcon(index)}>{label}</StepLabel>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>


                    <ClubFilterComponent
                        availableClubs={availableClubs}
                        activeStep={activeStep}
                        clubSelections={clubSelections}
                        bookClub={bookClub}
                    />
                    <Box display="flex" justifyContent="center" marginBottom={2} marginTop={4}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
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
                </Container>
            </div>
        </AuthenticatedLayout>
    );
}


function ClubFilterComponent({ availableClubs, activeStep, clubSelections, setClubSelections, bookClub }) {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState("Wednesday");
    const term = activeStep + 1;

    const handleModalOpen = (day) => {
        setSelectedDay(day);
        setModalOpen(true);
    }

    const handleModalClose = (success = false) => {
        setModalOpen(false);

        if (success) {
            toast.success("Successfully added club _ to your choices!")
        }
    }

    const selectedClubWednesday = clubSelections[activeStep].Wednesday;
    const selectedClubFriday = clubSelections[activeStep].Friday;

    return (
        <Box style={{ padding: '20px', width: '100%', borderRadius: '2em' }} className="mt-8" >
            <Typography variant="h4" align="" gutterBottom fontWeight={600} fontStyle={"italic"} paddingLeft={2}>
                Choose your clubs for term {term}.
            </Typography>
            <Typography variant="h6" align="" gutterBottom fontWeight={300} paddingLeft={3}>
                When you're ready, press <em>next</em>.
            </Typography>
            <Box display="flex" justifyContent="space-between">
                <ClubCard
                    day="Wednesday"
                    isSelected={!!selectedClubWednesday}
                    club={findClubByInstanceID(availableClubs, selectedClubWednesday?.id)}
                    onChoose={handleModalOpen} />
                <ClubCard
                    day="Friday"
                    isSelected={!!selectedClubFriday}
                    club={findClubByInstanceID(availableClubs, selectedClubFriday?.id)}
                    onChoose={handleModalOpen} />
            </Box>
            <ClubModal bookClub={bookClub} open={modalOpen} handleClose={handleModalClose} day={selectedDay} term={term} availableClubs={availableClubs} />

        </Box>
    )
}

function getSteps() {
    return ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5', 'Term 6', 'Finish'];
}

import Modal from '@mui/material/Modal';

function ClubModal({ open, handleClose, term, day, availableClubs, bookClub }) {

    console.log(availableClubs)
    // Filter the club instances based on term and day
    const filteredClubs = Object.values(availableClubs).filter(club =>
        club.club_instances.some(instance =>
            instance.half_term === term && instance.day_of_week === day
        )
    );

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
                <Typography variant="h4" id="club-modal-title" gutterBottom>
                    Term {term}, {day}
                </Typography>

                {filteredClubs.map(club => (
                    <Box key={club.id} style={{ margin: '20px 0' }}>
                        <Typography variant="h6">
                            {club.name}

                        </Typography>
                        <Typography variant="body1">
                            {club.description}
                        </Typography>
                        <Typography variant="body2">
                            {club.rule}
                        </Typography>
                        <Typography variant="body2">
                            {club.club_instances[0].day_of_week}
                        </Typography>
                        <Button
                            style={{ marginTop: '10px' }}
                            variant="outlined"
                            onClick={() => {
                                bookClub(term, day, club.club_instances[0]);
                                handleClose(true);
                            }}
                        >
                            Join Club
                        </Button>
                    </Box>
                ))}

                <Button style={{ marginTop: '20px' }} variant="contained" color="primary" onClick={() => handleClose(false)}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ClubCard = ({ day, isSelected, club, onChoose }) => (
    <Card
        variant="outlined"
        style={{
            backgroundColor: 'transparent',
            width: '45%',
            margin: '1%',
            borderWidth: '2px',
            borderStyle: isSelected ? '' : 'dashed',
            display: 'flex'
        }}
    >
        {isSelected && (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                paddingY={2}
                paddingX={2}
                pr={2}
            >
                {/* Here are some placeholder icons, replace them with your desired icons */}
                {/* <CheckIcon color="primary" />
                <StarIcon color="primary" />
                <FavoriteIcon color="primary" /> */}
            </Box>
        )}
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            flexGrow={1}
        >
            <CardContent>
                <Typography fontWeight={700} variant="h6" align='center'>{day.toUpperCase()}</Typography>
                <Typography variant="h6" align='center'>{club?.name}</Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
                <ChooseClubButton day={day} isSelected={isSelected} onChoose={onChoose} />
            </CardActions>
        </Box>
        {isSelected && (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                paddingY={2}
                paddingX={2}
                pr={2}
            >
                {/* Here are some placeholder icons, replace them with your desired icons */}
                <CheckCircleOutlineIcon style={{ strokeWidth: 2 }} />
                <StarBorderIcon style={{ strokeWidth: 2 }} />
                <FavoriteBorderIcon style={{ strokeWidth: 2 }} />
            </Box>
        )}
    </Card>
);

const ChooseClubButton = ({ day, isSelected, onChoose }) => (
    <Button
        variant="contained"
        style={{ backgroundColor: isSelected ? 'orange' : 'green', color: 'white' }}
        onClick={() => onChoose(day)}>
        {isSelected ? 'Change Club' : 'CHOOSE'}
    </Button>
);
