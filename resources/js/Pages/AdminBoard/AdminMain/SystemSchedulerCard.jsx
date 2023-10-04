import React from "react";

import { useState } from "react";

import {
    Card, CardBody,
    CardFooter,
    Typography,
    Button,
    ButtonGroup,
} from "@material-tailwind/react"

import { Switch } from "@material-tailwind/react";

import { ChipWithStatus } from "./AdminBoardNew";

import StepsDialog from "./StepsDialog";

export default function SystemSchedulerCard({ clubData }) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleOpen = () => setIsDialogOpen(!isDialogOpen);

    return (
        <Card className="w-full">
            <CardBody>
                <StepsDialog
                    clubData={clubData}
                    handleOpen={handleOpen}
                    isDialogOpen={isDialogOpen}
                />
                <div className="flex justify-between items-start overflow-hidden">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mb-4 w-12 h-12">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>

                        <div className="flex justify-between mb-2 items-center gap-10">
                            <Typography variant="h5" color="blue-gray" className="">
                                System Scheduling
                            </Typography>
                            <Switch
                                defaultChecked
                                color="green"
                            />
                        </div>
                    </div>
                        <ChipWithStatus />
                </div>
                <Typography>
                    Schedule bookings to go live - globally or for specific year groups, users, or clubs.
                </Typography>

            </CardBody>
            <CardFooter className="pt-0">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="text" className="flex lg:justify-center items-center gap-2" onClick={handleOpen}>
                        <p>Schedule</p>
                    </Button>
                    <Button variant="text" className="flex lg:justify-center items-center gap-2">
                        <p>View</p>
                    </Button>
                    <Button variant="text" className="flex lg:justify-center items-center gap-2">
                        <p>Three</p>
                    </Button>
                </div>


            </CardFooter>
        </Card>
    );

}
