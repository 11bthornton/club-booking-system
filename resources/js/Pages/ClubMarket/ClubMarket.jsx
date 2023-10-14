import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

import { useAvailableClubs } from "@/ClubContext";

import {
    Alert,
    Typography,
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
} from "@material-tailwind/react";

import { TermChoiceCard } from "@/Components/ClubMarket/TermChoiceCard";
import { ChipWithStatus } from "@/Components/ClubMarket/ChipWithStatus";
export default function ClubMarket({
    auth,
    userAvailableClubs,
    alreadyBookedOn,
    csrf
}) {
    const { alreadyBooked, setAvailableClubs, setAlreadyBooked } =
        useAvailableClubs();

    useEffect(() => {
        setAvailableClubs(userAvailableClubs);

        if (JSON.stringify(alreadyBooked) == "{}") {
            setAlreadyBooked(alreadyBookedOn);
        }
    }, [userAvailableClubs]);

    const [activeStep, setActiveStep] = React.useState(0);
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <AuthenticatedLayout user={auth.user} header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Club Market
            </h2>
        }>
            <Head title="Club Market" />


            <div className="container mx-auto flex flex-col   mt-5">
                <Typography variant="h2" className="mb-7">
                    Select your clubs
                </Typography>

                <Alert className="mb-12" color="blue" variant="ghost">
                    <Typography variant="h6" className="font-medium">
                        You can select and change your clubs as many times as
                        you want up until the deadline.
                    </Typography>
                </Alert>

                <div className="flex flex-col justify-between items-center w-full">
                    <Timeline>
                        {[1, 2, 3, 4, 5, 6].map((term) => (
                            <TimelineItem key={term}>
                                <TimelineConnector />
                                <div className="flex gap-5 items-center">
                                    <TimelineHeader className="h-3 pt-4 pb-5">
                                        <TimelineIcon color="green" className="shadow-xl">
                                            <Typography
                                                variant="h3"
                                                className="w-10 h-10 text-center"
                                            >
                                                {term}
                                            </Typography>
                                        </TimelineIcon>
                                        <Typography
                                            variant="h3"
                                            color="blue-gray"
                                            className="leading-none uppercase tracking-widest"
                                        >
                                            Term {term}
                                        </Typography>
                                    </TimelineHeader>
                                    <ChipWithStatus
                                        color="green"
                                        text="live"
                                        tooltipContent="You are currently able to book clubs for this term"
                                    />
                                </div>
                                <TimelineBody className={` m-4 ${false ? 'opacity-50' : 'opacity-100'}`}>
                                    <Typography className="text-2xl">
                                        This term runs from _ to _
                                    </Typography>
                                    <TermChoiceCard term={term} csrf={csrf} />
                                    
                                </TimelineBody>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
