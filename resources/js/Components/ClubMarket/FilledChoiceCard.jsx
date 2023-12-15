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
import { ChipWithStatus } from "./ChipWithStatus";
import { ConfirmDeleteDialog } from "@/Components/ClubMarket/ConfirmDeleteDialog";
import { FindClubModal } from "@/Components/ClubMarket/FindClubModal";

export function FilledChoiceCard({
    term,
    day,
    currentClubInfo,
    currentClubInstance,
    csrf,
    alreadyBooked,
    userAvailableClubs,
    setAlreadyBooked,
    setAvailableClubs,
}) {
    const [openFind, setOpenFind] = useState(false);
    const handleOpenFind = () => setOpenFind(!openFind);

    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const handleOpenDeleteConfirmation = () =>
        setOpenDeleteConfirmation(!openDeleteConfirmation);

    const truncateText = (text, length = 15) => {
        if (text.length > length) {
            return `${text.substring(0, length)}...`;
        }
        return text;
    };

    const filteredClubs = Object.values(userAvailableClubs).flatMap(c => Object.values(c.club_instances)).filter(c => c.half_term == term && c.day_of_week == day);
    
    return (
        <div className="flex justify-center" key={currentClubInstance.id}>
            <FindClubModal
                open={openFind}
                handleOpen={handleOpenFind}
                term={term}
                day={day}
                csrf={csrf}
                userAvailableClubs={userAvailableClubs}
                alreadyBooked={alreadyBooked}
                setAlreadyBooked={setAlreadyBooked}
                setAvailableClubs={setAvailableClubs}
            />

            <ConfirmDeleteDialog
                open={openDeleteConfirmation}
                handleOpen={handleOpenDeleteConfirmation}
                currentClubInfo={currentClubInfo}
                currentClubInstance={currentClubInstance}
                csrf={csrf}
                adminMode={{
                    flag: false, id: null
                }}
                setAlreadyBooked={setAlreadyBooked}
                setAvailableClubs={setAvailableClubs}
            />


            <Card className="mt-6 w-[500px] border shadow-2xl">
                <CardHeader
                    variant="gradient"
                    color="green"
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-14 h-14"
                        >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />

                        </svg>
                    </Typography>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-between items-center mb-2">
                        <Typography
                            variant="h5"
                            className="uppercase tracking-widest"
                        >
                            {day}
                        </Typography>
                        <div className="flex gap-2">
                            {currentClubInfo.is_paid ? (
                                <ChipWithStatus
                                    text={`£${currentClubInfo.is_paid} - ${currentClubInfo.payment_type}`}
                                    color="red"
                                    tooltipContent={"This club costs to join"}
                                />
                            ) : (
                                <ChipWithStatus
                                    text="free"
                                    color="green"
                                    tooltipContent="This club is free to join"
                                />
                            )}
                            
                            {
                                currentClubInstance.capacity ? 
                                <ChipWithStatus
                                text={currentClubInstance.capacity}
                                color={
                                    currentClubInstance.capacity <= 5
                                        ? "red"
                                        : currentClubInstance.capacity <= 10
                                            ? "amber"
                                            : "green"
                                }
                                tooltipContent={`${currentClubInstance.capacity} spaces left`}
                            />: <></>
                            }
                        </div>
                    </div>
                    <div className="flex-col flex ">
                        <div className="flex items-center justify-between">
                            <Typography
                                variant="h3"
                                className="mb-2 min-h-[40px] h-[40px] max-h-[40px]"
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {truncateText(currentClubInfo.name, 60)}
                                {/* {truncateText("Senior Production (all must attend)", 60)} */}
                                
                            </Typography>


                        </div>
                        
                        <p className="text-red-600 font-bold">
                        {
                            currentClubInfo.is_paid ? "This club costs" : <p>&nbsp;</p>
                        }
                        </p>

                        <Typography
                            className="max-h-[100px] h-[100px] min-h-[100px] overflow-hidden"

                        >
                            {currentClubInfo.description}
                            
                        </Typography>
                    </div>

                    <Alert
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
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                        }
                        className="mb-2 min-h-[120px] h-[120px] w-full max-h-[120px] mt-2 p-2 items-center "
                        color="blue"
                        variant="ghost"
                    >
                        <em>Rules: {currentClubInfo.rule}</em>
                    </Alert>
                </CardBody>
                <CardFooter className="pt-0">
                    <div className="flex justify-between">
                        <Tooltip content="Swap this club out for another">
                            <Button
                                variant="outlined"
                                className="flex items-center gap-3"
                                onClick={handleOpenFind}
                                disabled={!filteredClubs.length}

                            >
                                Swap
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
                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                    />
                                </svg>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Removes your place on this club">
                            <Button
                                variant="text"
                                color="red"
                                className="uppercase flex items-center gap-3"
                                onClick={handleOpenDeleteConfirmation}
                            >
                                Remove
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
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
