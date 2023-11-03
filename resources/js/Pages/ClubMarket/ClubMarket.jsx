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

import CountdownTimer from "@/Components/CountDownTimer";

import { TermChoiceCard } from "@/Components/ClubMarket/TermChoiceCard";
import { ChipWithStatus } from "@/Components/ClubMarket/ChipWithStatus";
export default function ClubMarket({
    auth,
    userAvailableClubs,
    alreadyBookedOn,
    csrf,
    year
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

            {JSON.stringify(g)}
           
            <div className="container mx-auto flex flex-col   mt-5">

                <Typography variant="h2" className="mb-1">
                    Select your clubs
                </Typography>
                <Typography variant="h5" className="mb-7">
                    For the academic year 20{year.year_start} - 20{year.year_end}
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
                                    <TimelineHeader className="">
                                        <TimelineIcon
                                            color={auth.user.bookingConfigs.flatMap(bC => bC.associated_terms).includes(term) ? "green" : "red"}
                                            className="shadow-xl"
                                            variant="ghost"
                                        >
                                            <Typography
                                                variant="h3"
                                                className="w-10 h-10 text-center"
                                            >
                                                {term}
                                            </Typography>
                                        </TimelineIcon>
                                        {/* <Typography
                                            variant="h3"
                                            color="blue-gray"
                                            className="leading-none uppercase tracking-widest"
                                        >
                                            Term {term} 
                                        </Typography> */}
                                        <Typography
                                            variant="h3"
                                            color="blue-gray"
                                            className="leading-none uppercase tracking-widest">
                                           Term {term} - {year[`term${term}_name`]}
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
                                                    className=""
                                                />
                                                <p className="text-500 ">
                                                    Bookings for this term ends in &nbsp;
                                                    <strong className="font-bold">
                                                        <CountdownTimer
                                                            targetDate={
                                                                [...auth.user.bookingConfigs.filter(cBc =>
                                                                    cBc.associated_terms.includes(term)
                                                                )].reverse()[0].ends_at
                                                            }
                                                            className="font-bold"
                                                        />
                                                    </strong>
                                                    &nbsp;
                                                    ({
                                                        [...auth.user.bookingConfigs.filter(cBc =>
                                                            cBc.associated_terms.includes(term)
                                                        )].reverse()[0].ends_at
                                                    })
                                                </p>
                                            </>
                                            :
                                            <>
                                                <ChipWithStatus
                                                    color="red"
                                                    text="Bookings Closed"
                                                    tooltipContent="Bookings are currently closed for this term"
                                                />
                                                <p className="text-red-500">
                                                    {
                                                        auth.user.futureBookingConfigs.filter(fBc =>
                                                            fBc.associated_terms.includes(term)
                                                        ).map(fBc => (
                                                            <>Bookings for this term next opens in <strong className="font-bold">
                                                                <CountdownTimer
                                                                    targetDate={fBc.scheduled_at}
                                                                    className="font-bold"
                                                                /></strong></>
                                                        ))
                                                    }
                                                </p>
                                            </>
                                    }
                                    <Typography>

                                    </Typography>
                                </div>
                                <TimelineBody className={` m-4 ${false ? 'opacity-50' : 'opacity-100'}`}>
                                    <Typography className="text-2xl">
                                        This term starts on {year[`term${term}_start`]}
                                    </Typography>
                                    <TermChoiceCard term={term} csrf={csrf} days={auth.user.days[0].days_array} />

                                </TimelineBody>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
