import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";

import {
    Button,
    Tooltip,
    Typography
} from "@material-tailwind/react";

import { Link } from "@inertiajs/react";

import SystemSchedulerCard from "./partials/SystemSchedulerAdminCard";
import ClubsAdminCard from "./partials/ClubsAdminCard";
import StudentsAdminCard from "./partials/StudentsAdminCard";
import AdminsAdminCard from "./partials/AdminsAdminCard";
import HowToAdminCard from "./partials/HowToAdminCard";
import DownloadBookingsView from "./partials/DownloadBookingsView";
import ResetSystemView from "./partials/ResetSystemView";

export default function Dashboard({ auth, clubData, scheduleData, year, availableDays }) {


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Admin Dashboard
            </h2>}
        >

            <Head title="Admin Dashboard" />

            <div class="container mx-auto p-6">
                <div className="w-full bg-white rounded-lg p-5 mb-4 shadow-lg">
                    <Typography variant="h3" className="mb-4">Academic Year {year ? <>20{year.year_start} - 20{year.year_end}</> : "- None Configured"}</Typography>
                    <div className="flex gap-4 items-center">
                        <Tooltip
                            content="Switch the system to a new academic year"
                        >
                            <Link href={route('admin.academic-year.index')}>
                                <Button size="sm" variant="outlined">Configure New Academic Year</Button>
                            </Link>
                        </Tooltip>
                        
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SystemSchedulerCard
                        clubData={clubData}
                        scheduleData={scheduleData}
                        className="shadow-none"
                        availableDays={availableDays} />
                    <ClubsAdminCard />
                    <StudentsAdminCard />
                    <AdminsAdminCard />
                    <HowToAdminCard />
                </div>

                <DownloadBookingsView />
                <ResetSystemView />

            </div>

        </AuthenticatedLayout>
    );
}
