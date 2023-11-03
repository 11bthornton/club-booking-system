import { useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";



import { Button } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';
import { Card, CardBody } from '@material-tailwind/react';

import { Link } from "@inertiajs/inertia-react";

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

            <div className=" pt-8 pb-14">
                <div className="container mx-auto px-4">
                    <Card>
                        <CardBody className="text-center">
                            <Typography variant="h2" color="blue-gray" className="mb-2">
                                Welcome, {auth.user.username}
                            </Typography>
                            <Typography>
                                This is a simple guide on how to get started.
                                {/* Here you will add the content for your "How To" section later. */}
                            </Typography>
                            <Link
                                href={route("club.market")}>
                                <Button
                                    color="lightBlue"
                                    buttonType="filled"
                                    size="regular"
                                    rounded={false}
                                    block={false}
                                    iconOnly={false}
                                    ripple="light"
                                    className="mt-4"
                                >
                                    Go to Club Market
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
