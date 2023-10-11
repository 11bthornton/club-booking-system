import { useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import {
    Alert,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Tooltip,
    IconButton,
} from "@material-tailwind/react";

export default function Dashboard({
    auth,
    bookedClubInstances,
    clubInformation,
    error,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home{" "}
                </h2>
            }
        >
            <Head title="Home" />

            <div className="container p-6 mx-auto  mt-4">
                <Typography variant="h2">
                    Welcome, {auth.user.username}
                </Typography>
            </div>

            <div className="container  mx-auto  mt-4"></div>
        </AuthenticatedLayout>
    );
}
