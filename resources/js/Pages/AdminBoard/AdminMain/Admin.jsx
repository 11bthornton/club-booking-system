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
} from "@material-tailwind/react";
import {
    Tooltip
} from "@material-tailwind/react";

import SystemSchedulerCard from "./SystemSchedulerCard";

import { ChipWithStatus } from "@/Components/ClubMarket/ChipWithStatus";
import { StepProvider } from "./StepContext";

import { useForm } from "@inertiajs/react";

export default function Dashboard({ auth, clubData, scheduleData, year, availableDays }) {

    const { post } = useForm({});

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
                <div className="w-full bg-white rounded-lg p-5 mb-4">
                    <Typography variant="h3" className="mb-4">Academic Year {
                        year ? <>20{year.year_start} - 20{year.year_end}</> : "- None Configured"
                    }</Typography>
                    <div className="flex gap-4 items-center">
                        <Tooltip
                            content="Switch the system to a new academic year"
                        >
                            <Link href={route('admin.academic-year.index')}>
                                <Button size="sm" variant="outlined">Configure New Academic Year</Button>
                            </Link>
                        </Tooltip>
                        {/* <Tooltip
                            content="Place the system into maintenance mode, restricting access to students to the site whatsoever."
                        >
                            <Button
                                variant="text"
                                color="amber"
                                size="sm"
                            >
                                Maintenance Mode
                            </Button>
                        </Tooltip> */}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StepProvider>
                        <SystemSchedulerCard
                            clubData={clubData}
                            scheduleData={scheduleData}
                            className="shadow-none"
                            availableDays={availableDays}
                        />
                    </StepProvider>

                    <Card className="w-full shadow-none">
                        <CardBody>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex justify-between items-start">
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
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <Typography
                                            variant="h5"
                                            color="blue-gray"
                                            className="mb-2 min-h-[60px]"
                                        >
                                            Clubs
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                            <Typography
                                className="min-h-[100px] overflow-hidden"
                            >
                                View clubs, export information and add new ones
                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <div className="flex justify-between items-center">
                                <Link
                                    href={route("admin.clubs")}
                                >
                                    <Button
                                        variant="text"
                                        className="flex lg:justify-center items-center gap-2"
                                    >
                                        View All
                                    </Button>
                                </Link>
                                <Link
                                    href={route("admin.clubs.new")}
                                >

                                    <Button
                                        variant="text"
                                        className="flex lg:justify-center items-center gap-2"
                                    >
                                        <p>New</p>
                                    </Button>
                                </Link>

                            </div>
                        </CardFooter>
                    </Card>
                    <Card className="w-full flex flex-col shadow-none">
                        <CardBody>
                            <div className="flex-grow ">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                    </svg>

                                    <Typography
                                        variant="h5"
                                        color="blue-gray"
                                        className="mb-2 min-h-[60px]"
                                    >
                                        Students
                                    </Typography>
                                </div>
                                {/* <ChipWithStatus /> */}
                            </div>
                            <Typography
                                className="min-h-[100px]"
                            >
                                Manage information about students and edit their
                                bookings.
                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <div className="flex justify-between items-center">
                                <Link
                                    href={route("admin.students")}
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <Button
                                        variant="text"
                                        className=""
                                    >
                                        Take me there
                                    </Button>
                                </Link>


                            </div>
                        </CardFooter>
                    </Card>
                    <Card className="w-full flex flex-col shadow-none">
                        <CardBody>
                            <div className="flex-grow ">
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
                                        className="mb-2 min-h-[60px]"
                                    >
                                        Admins
                                    </Typography>
                                </div>
                                {/* <ChipWithStatus /> */}
                            </div>
                            <Typography
                                className="min-h-[100px]"
                            >
                                Manage admins and admin accounts.
                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <div className="flex justify-between items-center">
                                <Link
                                    href={route("admin.admins")}
                                    className="flex lg:justify-center items-center gap-2"
                                >
                                    <Button
                                        variant="text"
                                        className=""
                                    >
                                        Take me there
                                    </Button>
                                </Link>


                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div className="bg-white p-4 rounded-lg mt-4">

                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-9 h-9">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                        <Typography
                            variant="h4"

                        >
                            Download Student Choices
                        </Typography>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 mb-4">
                        {/* When scheduled periods end, this will automatically be emailed to <strong>admin@admin.com</strong> (you can change this in <em>Communication Controls</em>),
                        but you can download them in their current state now. */}
                    </p>

                    <a href={route('admin.download.total-user-club-spreadsheet')} class="btn btn-primary">
                        <Button
                            variant=""
                            size="sm"
                        >
                            Download
                        </Button>
                    </a>

                </div>

                {/* <div className="bg-white p-4 rounded-lg mt-4">

                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>

                        <Typography
                            variant="h4"

                        >
                            Communication Controls
                        </Typography>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 mb-4">
                        Send out communications
                    </p>

                </div> */}

                <div className="bg-red-50 mt-4 p-4 text-red-500 rounded-lg border-dashed border-6 border">
                    <Typography
                        variant="h4"
                        className="tracking-widest uppercase"
                    >
                        Danger Zone
                    </Typography>
                    <Typography
                        variant="h6"
                    >
                        Reset System
                    </Typography>
                    <p className="mt-1 text-sm text-gray-600 mb-4">
                        Resets the system. Deletes all bookings, clubs, students and academic year configurations.
                    </p>
                    <Button
                        color="red"
                        variant=""
                        size="sm"
                        onClick={() => post(route("admin.reset"))}
                    >
                        Reset
                    </Button>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import { Link } from "@inertiajs/react";