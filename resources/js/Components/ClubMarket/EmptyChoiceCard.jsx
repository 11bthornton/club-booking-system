import React, { useState } from "react";
import {
    Alert,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Typography,
    Tooltip,
} from "@material-tailwind/react";
import { ChipWithStatus } from "../../Pages/ClubMarket/ClubMarket";
import { FindClubModal } from "@/Components/ClubMarket/FindClubModal";

export function EmptyChoiceCard({ term, day }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    return (
        <div className="flex justify-center">
            <FindClubModal
                open={open}
                handleOpen={handleOpen}
                term={term}
                day={day}
            />
            <Card className="mt-2 w-96 border border-4 border-dashed bg-gray-50 shadow-none">
                <CardHeader
                    // variant="gradient"
                    color="transparent"
                    className="mb-4 grid h-28 place-items-center shadow-none "
                >
                    <Typography variant="h3" color="white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="orange"
                            className="w-14 h-14"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </Typography>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Typography
                                    variant="h5"
                                    className="uppercase tracking-widest"
                                >
                                    {day}
                                </Typography>
                                <ChipWithStatus
                                    text="None Selected"
                                    color="orange"
                                    tooltipContent="Please select a club for this day."
                                />
                            </div>

                            <div className="flex-col flex">
                                <Typography
                                    variant="h3"
                                    className="mb-2 min-h-[40px] h-[40px] max-h-[40px]"
                                >
                                    None Selected
                                </Typography>

                                <Typography className="mb-2 min-h-[30px] h-[30px] max-h-[30px] mt-7"></Typography>
                            </div>
                        </div>
                        <div>
                            <Alert
                                className="max-h-[100px] h-[100px] min-h-[100px] overflow-hidden"
                                variant="ghost"
                                color="orange"
                                icon={
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
                                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                        />
                                    </svg>
                                }
                            >
                                Press <strong>FIND</strong> to select a club for
                                this day, or <strong>"Home"</strong> will be
                                automatically allocated.
                            </Alert>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="pt-0">
                    <div className="flex justify-between mt-2">
                        <Tooltip content="Find a club">
                            <Button
                                variant="filled"
                                color="blue"
                                icon={<svg></svg>}
                                className="flex items-center gap-3"
                                onClick={handleOpen}
                            >
                                Find
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </Button>
                        </Tooltip>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
