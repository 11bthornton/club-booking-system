import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    Paper,
    Alert
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

    const removeClub = (term, day) => {
        setClubSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections[term - 1][day] = null;
            return newSelections;
        });
    }

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
                        removeClub={removeClub}
                        handleBack={handleBack}
                        handleNext={handleNext}
                        steps={steps}
                    />

                <div className="bg-white mt-4 p-6 rounded-lg shadow-md">
                    <Alert severity='warning'>
                        Your clubs are booked in real-time. If a selection is filled, you are guaranteed a place until you change it again.
                        If you remove a booking, you will <strong>not</strong> be guaranteed to undo that change straight away as somebody may have taken your spot.
                    </Alert>
                </div>
                </Container>

                
            </div>

        </AuthenticatedLayout>
    );
}


function ClubFilterComponent({ availableClubs, activeStep, clubSelections, setClubSelections, bookClub, handleBack, handleNext, steps, removeClub }) {

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
        <div className="bg-white rounded-lg shadow-md pr-6">
            <Box style={{ padding: '20px', width: '100%', borderRadius: '2em' }} className="mt-8" >
                <div className="flex justify-between items-baseline " >
                    <Typography variant="h5" align="" gutterBottom fontWeight={600}>
                        Choose your Clubs for Term {term}.

                    </Typography>
                    <Box display="flex" justifyContent="center" marginTop={4}>
                        <Button disabled={activeStep === 0} onClick={handleBack} color='secondary'>
                            Back
                        </Button>

                        {activeStep === steps.length - 1 ?

                            <Button variant="contained" color="primary" onClick={() => { }}>
                                Finish
                            </Button> :

                            <Button variant="contained" color="secondary" onClick={handleNext}>
                                Next
                            </Button>
                        }

                    </Box>
                </div>

                <Typography variant="h6" align="" gutterBottom fontWeight={300}>
                    When you're ready, press <em>next</em>.
                </Typography>
                <div className="flex gap-4 items-baseline justify-center mt-4 mb-2">
                    <FontAwesomeIcon
                        icon={faCalendarDays}
                        className='mb-4'
                    />
                    <em>Term dates: 1st September 2024 - 3rd October 2024</em>
                </div>

                <Box display="flex" justifyContent="space-between">
                    <ClubCard
                        day="Wednesday"
                        isSelected={!!selectedClubWednesday}
                        club={findClubByInstanceID(availableClubs, selectedClubWednesday?.id)}
                        onChoose={handleModalOpen}
                        removeClub={removeClub}
                        term={term}
                    />
                    <ClubCard
                        day="Friday"
                        isSelected={!!selectedClubFriday}
                        club={findClubByInstanceID(availableClubs, selectedClubFriday?.id)}
                        onChoose={handleModalOpen}
                        removeClub={removeClub}
                        term={term}
                    />
                </Box>
                <ClubModal
                    bookClub={bookClub}
                    removeClub={removeClub}
                    open={modalOpen}
                    handleClose={handleModalClose}
                    day={selectedDay}
                    term={term}
                    availableClubs={availableClubs}
                    clubSelections={clubSelections}
                />

            </Box>
        </div>
    )
}

function getSteps() {
    return ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5', 'Term 6', 'Finish'];
}

import Modal from '@mui/material/Modal';

function ClubModal({ open, handleClose, term, day, availableClubs, bookClub, removeClub, clubSelections }) {

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
                
                <div className="flex justify-between items-baseline">
                <Typography variant="h4" id="club-modal-title" gutterBottom>
                    Term {term}, {day}
                </Typography>
                <Button data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" style={{ marginTop: '20px' }} variant="contained" color="primary" onClick={() => handleClose(false)}>
                    Close
                </Button>
                </div>
    
                {/* Placeholder for filters */}
                <Box style={{ marginBottom: '20px' }}>
                    {/* Add your filters here */}
                </Box>
    
                <Box display="flex" justifyContent="space-between" style={{ height: 'calc(80vh - 20px)' }}>
                <Box flex={0.7} style={{ marginRight: '20px' }}>
        {filteredClubs.map(club => (
            <Box key={club.id} style={{ margin: '20px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                <Typography variant="h6">{club.name}</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="body1">{club.description}</Typography>
                <Typography variant="body2">{club.rule}</Typography>
                <Typography variant="body2">{club.club_instances[0].day_of_week}</Typography>
                <Button
                    style={{ marginTop: '10px' }}
                    variant="outlined"
                    onClick={() => {
                        bookClub(term, day, club.club_instances[0]);
                        handleClose(true);
                    }}
                >
                    Select
                </Button>
            </Box>
        ))}
    </Box>
    
                    {/* Vertical Divider */}
                    <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />
    
                    <Box flex={0.3} style={{ padding: '0 20px' }} className="sticky top-20">
                        <Typography variant="h6" gutterBottom>
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
                                        textDecoration: (index + 1 === term && selection.Wednesday && day === 'Wednesday') ? 'underline' : 'none'
                                    }}
                                >
                                    Wednesday: {selection.Wednesday ? selection.Wednesday.id : 'Not Selected'}
                                </Typography>
                                <Typography 
                                    color="textSecondary"
                                    style={{
                                        textDecoration: (index + 1 === term && selection.Friday && day === 'Friday') ? 'underline' : 'none'
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

import { Divider } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { faCalendar, faCalendarDays, faDollarSign, faLeftRight, faRightLeft, faTrashCan, faBan, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles';

const ClubCard = ({ day, isSelected, club, onChoose, removeClub, term }) => (



    <Card
        variant="outlined"
        style={{
            backgroundColor: 'transparent',
            width: '45%',
            margin: '1%',
            borderWidth: '2px',
            borderStyle: isSelected ? '' : 'dashed',
            borderColor: isSelected ? useTheme().palette.primary.main : useTheme().palette.warning.main,
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
                <Typography fontWeight={700} variant="h6" align='center' className='tracking-wide' style={{letterSpacing: "2px"}}>{day.toUpperCase()}</Typography>
                <Typography fontWeight={300} variant="h6"  className='mt-10' height={70} marginTop={3}>
                    {
                        club ?
                            <h6 align='center'>{club.name}</h6>
                            : <Alert severity='warning' > You haven't selected a club for this day yet. You will be allocated "Home" if left unchecked </Alert>
                    }
                </Typography>
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
                color="grey"
            >
                <button onClick={() => removeClub(term, day)}
                    data-tooltip-content="Delete"
                    data-tooltip-id="icon-tooltip"
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <button onClick={() => console.log("Swap button clicked")} data-tooltip-content="Swap" data-tooltip-id="icon-tooltip" >
                    <FontAwesomeIcon icon={faCalendarDays} />
                </button>
                {
                    club.is_paid ?
                        <button onClick={() => console.log("Icon button clicked")}
                            data-tooltip-content="This is a paid club, parental consent will be required after booking."
                            data-tooltip-id="icon-tooltip"

                        >
                            <FontAwesomeIcon icon={faDollarSign}
                                color='red'
                                fontWeight={700}
                            />
                        </button>
                        :
                        <button>
                            {
                                /**
                                 * Placeholder - need something to take the space. 
                                 */
                            }
                        </button>
                }
                <Tooltip id="icon-tooltip" effect="solid" />
                <Tooltip id="my-tooltip" />
            </Box>
        )}
    </Card>
);
import { Tooltip } from 'react-tooltip'


const ChooseClubButton = ({ day, isSelected, onChoose }) => (
    <Button
        // style={{ backgroundColor: isSelected ? 'orange' : 'primary', color: 'white' }}
        color='primary'
        variant="outlined"
        onClick={() => onChoose(day)}>
        {isSelected ?
            <div className='flex gap-4 items-center'>
                <FontAwesomeIcon icon={faRightLeft} data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" />
                Change
            </div> :
            <div data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" className='flex gap-4 items-center'>
                <FontAwesomeIcon icon={faMagnifyingGlass} data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" />
                CHOOSE
            </div>
        }
        <Tooltip id="icon-tooltip-s" effect="solid" />


    </Button>
);
