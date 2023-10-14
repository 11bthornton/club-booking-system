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
    const { availableClubs, alreadyBooked, setAvailableClubs, setAlreadyBooked } =
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
                <Typography variant="h2" className="mb-4">
                    Select your clubs
                <Typography variant="h2" className="mb-7">
                    Select your clubs
                </Typography>

                {
                    auth.user.bookingConfigs.length ?
                        <Alert className="mb-12" color="blue" variant="ghost">
                            <Typography variant="h6" className="font-medium">
                                You can select and change your clubs as many times as
                                you want up until the deadline.

                            </Typography>
                        </Alert>
                        :
                        <>
                            <Alert color="red" className="mb-12" variant="ghost">

                                <Typography variant="h4" className="font-medium">
                                    The booking system is currently <strong>offline</strong> for you.
                                </Typography>
                                <Typography variant="h6" className="font-medium">
                                    {
                                        auth.user.futureBookingConfigs.length ?
                                            <>Check back at <strong>{auth.user.futureBookingConfigs[0].scheduled_at}</strong>, when you will be able to alter or change some or all of your bookings.</>
                                        :
                                            <>There are currently no times scheduled for you to book your clubs. Check back at a later date.</>
                                    }
                                </Typography>
                                <p className="mt-3">
                                    In the meantime, you can still view your current selections.
                                </p>
                            </Alert>
                        </>
                }


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
                                    {
                                        /**
                                         * Need to do some filtering.
                                         */
                                        auth.user.bookingConfigs.flatMap(bC => bC.associated_terms).includes(term) ?
                                            <>
                                                <ChipWithStatus
                                                    color="green"
                                                    text="Bookings Open"
                                                    tooltipContent="You are currently able to book clubs for this term"
                                                />
                                                <p className="font-bold text-red-500">
                                                </p>
                                            </>
                                            :
                                            <>
                                                <ChipWithStatus
                                                    color="red"
                                                    text="Bookings Closed"
                                                    tooltipContent="Bookings are currently closed for this term"
                                                />
                                                <p className="font-bold text-red-500">
                                                    Bookings for this term next opens at: { }
                                                </p>
                                            </>
                                    }

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
