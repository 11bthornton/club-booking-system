import React, { useEffect, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import toast from "react-hot-toast";

import Alert from "@mui/material/Alert";

import { Avatar } from "@mui/material";

export default function Dashboard({ auth }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Add New Club" />

            <div class="container mx-auto p-6">
                <div className="flex mb-5">
                    <Avatar>KT</Avatar>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div class="card">
                        <div class="p-4 bg-white rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 class="text-xl font-semibold mb-2">System</h2>
                                <div>
                                    <em className="text-bold">Bookings Open</em>
                                </div>
                            </div>
                            <Alert severity="success" className="mb-4 mt-4">
                                The system is currently <strong>open</strong> for bookings.
                            </Alert>
                            <p class="text-gray-600">Manage information about the system. Schedule system </p>
                            <div className="text-sm flex justify-between items-baseline mt-2">
                                <strong>Next Scheduled Open Time:</strong>
                                <p>3/4/12 12:00:00</p>
                            </div>
                            <h3 class="text-l font-semibold mt-2">Quick Links</h3>
                            <ul class="">
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Open or schedule bookings</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Logs</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">System settings</a></li>

                            </ul>
                        </div>
                    </div>

                    <div class="card">
                        <div class="p-4 bg-white rounded-lg shadow-md">
                            <h2 class="text-xl font-semibold mb-2">Clubs</h2>
                            <Alert severity="error" className="mb-4 mt-4">
                                7 Clubs at Capacity
                            </Alert>
                            <p class="text-gray-600">Manage clubs and information about them.</p>
                            <h3 class="text-l font-semibold mt-4">Quick Links</h3>
                            <ul class="">
                                <li><a href="admin/clubs" class="text-sm text-blue-600 hover:underline">View clubs</a></li>
                                <li><a href="admin/clubs/new" class="text-sm text-blue-600 hover:underline">Add a new club</a></li>
                                {/* <li><a href="#" class="text-sm text-blue-600 hover:underline">Settings</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Reports</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Logout</a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div class="card">
                        <div class="p-4 bg-white rounded-lg shadow-md">
                            <h2 class="text-xl font-semibold mb-2">Students & Bookings</h2>
                            <Alert severity="warning" className="mb-4 mt-4">
                                <strong>7 students have not made a booking yet.</strong>
                            </Alert>
                            <p class="text-gray-600">Manage information about students and their choices.</p>
                            <h3 class="text-l font-semibold mt-4">Quick Links</h3>
                            <ul class="">
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">View students</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Manage users</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Settings</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Reports</a></li>
                                <li><a href="#" class="text-sm text-blue-600 hover:underline">Logout</a></li>
                            </ul>
                        </div>

                    </div>

                </div>
                <div className="card p-4 bg-white rounded-lg shadow-md mt-5">
                    <h2 class="text-xl font-semibold mb-2">Overview</h2>
                </div>
            </div>
        </AuthenticatedLayout>
    );

}




