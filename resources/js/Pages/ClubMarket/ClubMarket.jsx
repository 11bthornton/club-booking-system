import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

import { useAvailableClubs } from "@/ClubContext";

import {
    Alert,
    Chip,
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

    // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    // const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <AuthenticatedLayout user={auth.user} header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Club Market
            </h2>
        }>
            <Head title="Club Market" />


            <div className="container mx-auto flex flex-col mt-5 px-4 sm:px-6">


                <Typography variant="h2" className="mb-1">
                    Select your clubs
                </Typography>
                <Typography variant="h5" className="mb-4">
                    For the academic year 20{year.year_start} - 20{year.year_end}
                </Typography>

                {
                    auth.user.bookingConfigs.length ?
                        <Alert className="mb-4" color="blue" variant="ghost"
                            icon={<svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>}
                        >
                            <Typography variant="h6" className="font-medium">
                                You can select and change your clubs as many times as
                                you want up until the deadline.

                            </Typography>
                        </Alert>
                        :
                        <>
                            <Alert color="red" className="mb-4" variant="ghost"
                                icon={
                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                                    </svg>
                                }
                            >

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


                <Typography
                    className="mb-4"
                >
                    Each of the 6 terms are shown in order. Make sure you scroll all the way to the bottom so you don't forget to book your clubs! You can view quickly which terms still require your attention here:

                </Typography>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center items-center mb-8 gap-2">
                    {
                        Object.values(alreadyBooked).map((bookings, term) => {

                            const stillNeedsToBook = Object.values(bookings).some(booking => !booking)
                            const length = Object.values(bookings).length
                            const countBooked = Object.values(bookings).filter(booking => booking).length

                            return (
                                <div className="flex justify-center gap-2">
                                    <Chip
                                        variant="ghost"
                                        icon={
                                            stillNeedsToBook ? <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg> : <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        }
                                        value={`Term ${term + 1}  - ${countBooked}/${length} booked`}
                                        color={!countBooked ? "red" : stillNeedsToBook ? "orange" : "green"}
                                    >

                                    </Chip>
                                </div>
                            )
                        })
                    }
                </div>


                <div className="flex flex-col justify-between items-center w-full">
                    <Timeline className="w-full">
                        {[1, 2, 3, 4, 5, 6].map((term) => {

                            const availableToWhichYearGroups = Object.values(availableClubs)
                                .flatMap(c => c.club_instances)
                                .filter(i => i.half_term == term)
                                .flatMap(i => i.year_groups)
                                .map(t => Number(t.year))


                            return (
                                <TimelineItem key={term}>
                                    <TimelineConnector />
                                    <div className="flex gap-5 items-center">
                                    

                                        <TimelineHeader className="items-start">
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


                                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                <Typography
                                                    variant="h3"
                                                    color="blue-gray"
                                                    className="leading-none uppercase tracking-widest text-center">
                                                    Term {term} - {year[`term${term}_name`]}
                                                </Typography>


                                                {

                                                    auth.user.bookingConfigs.flatMap(bC => bC.associated_terms).includes(term) && availableToWhichYearGroups.includes(Number(auth.user.year)) ?
                                                        <>
                                                            <div className="flex justify-center">
                                                                <ChipWithStatus
                                                                    color="green"
                                                                    text="Bookings Open"
                                                                    tooltipContent="You are currently able to book clubs for this term"
                                                                    className=""
                                                                />
                                                            </div>
                                                            <p className="text-500 text-center">
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
                                                            <div className="flex justify-center">
                                                                <ChipWithStatus
                                                                    color="red"
                                                                    text="Bookings Closed"
                                                                    tooltipContent="Bookings are currently closed for this term"
                                                                />
                                                            </div>
                                                            <p className="text-red-500 text-center">
                                                                {
                                                                    auth.user.futureBookingConfigs.filter(fBc =>
                                                                        fBc.associated_terms.includes(term)
                                                                    ).slice(0, 1).map(fBc => (
                                                                        <>
                                                                        Bookings for this term next opens in <strong className="font-bold">
                                                                            <CountdownTimer
                                                                                targetDate={fBc.scheduled_at}
                                                                                className="font-bold"
                                                                            /></strong></>
                                                                    ))
                                                                }
                                                            </p>
                                                        </>
                                                }
                                            </div>
                                        </TimelineHeader>


                                    </div>
                                    <TimelineBody className={` justify-center m-4 ${false ? 'opacity-50' : 'opacity-100'} w-full`}>
                                        <Typography className="text-2xl text-center mb-10">
                                            This term starts on {year[`term${term}_start`]}
                                        </Typography>
                                        <TermChoiceCard term={term} csrf={csrf} days={auth.user.days[0].days_array} />
                                        <br />
                                    </TimelineBody>
                                </TimelineItem>)

                        })}
                    </Timeline>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
