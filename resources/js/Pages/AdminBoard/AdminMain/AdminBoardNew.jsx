import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    ButtonGroup,
    Chip,
} from "@material-tailwind/react";
import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
    // Typography,
} from "@material-tailwind/react";

export function ChipWithStatus() {
    return (
        <div className="flex gap-2">
            <Chip
                variant="ghost"
                color="green"
                size="sm"
                value="System Live"
                icon={
                    <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                }
            />
        </div>
    );
}

import SystemSchedulerCard from "./SystemSchedulerCard";

import { StepProvider } from "./StepContext";

export default function Dashboard({ auth, clubData, scheduleData }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [isDialogOpen, setDialogOpen] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />
            <div class="container mx-auto p-6">
                <div className="w-full bg-white shadow-md rounded-lg p-5 mb-7">
                    <Typography variant="h2">Academic Year 23/24</Typography>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StepProvider>
                        <SystemSchedulerCard
                            clubData={clubData}
                            scheduleData={scheduleData}
                        />
                    </StepProvider>

                    <Card className="w-full">
                        <CardBody>
                            <div className="flex justify-between items-start">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="mb-4 w-12 h-12"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                                        />
                                    </svg>

                                    <Typography
                                        variant="h5"
                                        color="blue-gray"
                                        className="mb-2"
                                    >
                                        Clubs
                                    </Typography>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <Typography>
                                Schedule bookings to go live - globally or for
                                specific year groups, users, or clubs.
                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <a
                                    href="/admin/clubs"
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <Button
                                        variant="outlined"
                                        className="flex lg:justify-center items-center gap-2"
                                    >
                                        <p>View All</p>
                                    </Button>
                                </a>
                                <a
                                    href="/admin/clubs/new"
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <Button
                                        variant="text"
                                        className="flex lg:justify-center items-center gap-2"
                                    >
                                        <p>New</p>
                                    </Button>
                                </a>
                                {/* <Button variant="text" className="flex lg:justify-center items-center gap-2">
                                    <p>Three</p>
                                </Button> */}
                            </div>
                        </CardFooter>
                    </Card>
                    <Card className="w-full">
                        <CardBody>
                            <div className="flex justify-between items-start">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-12 h-12 mb-4"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <Typography
                                        variant="h5"
                                        color="blue-gray"
                                        className="mb-2"
                                    >
                                        Students
                                    </Typography>
                                </div>
                                {/* <ChipWithStatus /> */}
                            </div>
                            <Typography>
                                Manage information about students and edit their
                                bookings.
                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <a
                                    href="/admin/students"
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <Button
                                        variant="outlined"
                                        className="flex lg:justify-center items-center gap-2"
                                    >
                                        <p>View All</p>
                                    </Button>
                                </a>
                                <Button
                                    variant="text"
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <p>New</p>
                                </Button>
                                <Button
                                    variant="text"
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <p>Upload</p>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
