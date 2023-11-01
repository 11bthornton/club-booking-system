import React from "react";

import { useState } from "react";

import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    ButtonGroup,
} from "@material-tailwind/react";

import { Switch } from "@material-tailwind/react";

import { ChipWithStatus } from "./ChipWithStatus";

import StepsDialog from "./StepsDialog";
import {
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Chip,
} from "@material-tailwind/react";
import { Link } from "@inertiajs/react";

export default function SystemSchedulerCard({ clubData, scheduleData, availableDays }) {
    console.log(scheduleData);

    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const handleCreateDialogue = () => setCreateDialogOpen(!isCreateDialogOpen);

    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const handleViewDialog = () => setViewDialogOpen(!isViewDialogOpen);

    return (
        <Card className="w-full shadow-none">
            <CardBody>
                <StepsDialog
                    clubData={clubData}
                    handleOpen={handleCreateDialogue}
                    isDialogOpen={isCreateDialogOpen}
                    availableDays={availableDays}
                />

                <ViewScheduled
                    isOpen={isViewDialogOpen}
                    handleOpen={handleViewDialog}
                    scheduleData={scheduleData}
                />

                <div className="flex justify-between items-start overflow-hidden">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="mb-4 w-12 h-12"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                            />
                        </svg>

                        <div className="flex justify-between mb-2 items-center gap-10">
                            <Typography
                                variant="h5"
                                color="blue-gray"
                                className="min-h-[60px] overflow-hidden"
                            >
                                System Scheduling
                            </Typography>
                        </div>
                    </div>
                    <ChipWithStatus />
                </div>
                <Typography className="min-h-[100px]">
                    Schedule bookings to go live - globally or for specific year
                    groups, users, or clubs.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <div className="flex justify-between items-center">
                    {/* <Button
                        variant="text"
                        className="flex lg:justify-center items-center gap-2"
                        onClick={handleCreateDialogue}
                    >
                        <p>Schedule</p>
                    </Button> */}
                    <Link href={route('admin.booking-config.index')}>

                        <Button
                            variant="text"
                            className="flex lg:justify-center items-center gap-2"
                        // onClick={handleViewDialog}
                        >
                            Take me there
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

function ViewScheduled({ isOpen, handleOpen, scheduleData }) {
    const TABLE_HEAD = ["Name", "Scheduled at", "Ends at", "Live", "Actions"];

    return (
        <Dialog
            open={isOpen}
            handler={handleOpen}
        // className="h-[80vh]"
        >
            <DialogHeader>
                <Typography variant="h2">Currently Scheduled</Typography>
            </DialogHeader>
            <DialogBody className="h-full">
                <table className="w-full  table-auto text-center">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map((data, index) => {
                            const isLast = index === data.length - 1;
                            const classes = isLast ? "p-4" : "p-4  text-rig";

                            return (
                                <tr key={data.id}>
                                    <td className={classes}>/</td>
                                    <td className={classes}>
                                        {data.scheduled_at}
                                    </td>
                                    <td className={classes}> {data.ends_at}</td>
                                    <td className={classes}>
                                        <ScheduleStatusChip data={data} />
                                    </td>
                                    <td className="flex justify-center items-start p-4 text-rig cursor-pointer">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                                            />
                                        </svg>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </DialogBody>
        </Dialog>
    );
}

function ScheduleStatusChip({ data }) {
    return (
        <div className="flex gap-2">
            <Chip
                variant="ghost"
                color={data.isLive ? "green" : "red"}
                size="sm"
                value={data.isLive ? "Live" : "Complete"}
                icon={
                    <span
                        className={`mx-auto mt-1 block h-2 w-2 rounded-full ${data.isLive ? "bg-green-900" : "bg-red-900"
                            } content-['']`}
                    />
                }
            />
        </div>
    );
}
