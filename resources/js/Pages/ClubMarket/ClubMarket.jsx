import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import React, { useState } from "react";

import {
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Container,
    Alert,
} from '@mui/material';


import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { ClubFilterComponent } from './partials/ClubFilterComponent';

import "./ClubMarket.css";


export function findClubByInstanceID(clubs, instanceID) {
    return Object.values(clubs).find(club =>
        club.club_instances.some(instance => instance.id === instanceID)
    );
}

function getSteps() {
    return ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5', 'Term 6', 'Finish'];
}

export default function ClubMarket({ auth, userAvailableClubs, alreadyBookedOn }) {

    const [availableClubs, setAvailableClubs] = useState(userAvailableClubs);

    const bookClub = (term, day, clubInstance) => {

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
        Object.values(alreadyBookedOn)
    );

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
            header={
                <div className='flex justify-between items-baseline'>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Club Market</h2>
                    {/**
                     * TODO: I would like this to show the number of outstanding slots the student
                     * has left to book. Currently a placeholder.
                     */}
                    <h2>Num Clubs Picked</h2>
                </div>
            }
        >
         
            <Head title="Club Market" />

            <div className="container mx-auto p-6">
                <Container>

                    {
                        /**
                         * Shows the student which step they're currently on.
                         * In reality, they can switch between these steps at
                         * will, but for simplicity, it's nice to give them
                         * a step-by-step walkthrough.
                         */
                    }
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton onClick={() => setActiveStep(index)}>
                                    <StepLabel StepIconComponent={() => getStepIcon(index)}>{label}</StepLabel>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    
                    {
                        /**
                         * This is the actual content of the stepper.
                         * 
                         * Perhaps there's a nicer way of 
                         * passing down props?
                         */
                    }
                    <ClubFilterComponent
                        availableClubs={availableClubs}
                        setAvailableClubs={setAvailableClubs}
                        activeStep={activeStep}
                        clubSelections={clubSelections}
                        setClubSelections={setClubSelections}
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










