import React, { useState } from "react";
import { useAvailableClubs } from "@/ClubContext";
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
import { useSpinner } from "@/LoadingContext";
import findClubChanges from "../../Pages/ClubMarket/scripts/SimulateBooking";
import { ChipWithStatus } from "./ChipWithStatus";

import { ChangeConfirmationDialogue } from "./ChangeConfirmationDialogue";
export function OptionCard({
    csrf,
    day,
    currentClubInfo,
    currentClubInstance,
    handleOpenFind,
    adminMode
}) {
    const { setShowSpinner } = useSpinner();

    const { alreadyBooked } = useAvailableClubs();

    const [showConfirmationDialogue, setShowConfirmationDialogue] =
        useState(false);
    const handleShowConfDialogue = () =>
        setShowConfirmationDialogue(!showConfirmationDialogue);
    const [dataForConfirmation, setDataForConfirmation] = useState({});

    const isAlreadyBooked =
        alreadyBooked[currentClubInstance.half_term][
            currentClubInstance.day_of_week
        ]?.id == currentClubInstance.id;

    return (
        <div className="flex justify-center" key={currentClubInstance.id}>
            <ChangeConfirmationDialogue
                open={showConfirmationDialogue}
                handleOpen={handleShowConfDialogue}
                data={dataForConfirmation}
                clubIdToBook={currentClubInstance.id}
                handleOriginalFindDialog={handleOpenFind}
                adminMode={adminMode}
                csrf={csrf}
            />

            <Card className="mt-6 w-96 border">
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                            />
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
                                    text="Requires Payment"
                                    color="red"
                                />
                            ) : (
                                <ChipWithStatus
                                    text="free"
                                    color="green"
                                    tooltipContent="This club is free to join"
                                />
                            )}
                            {currentClubInstance.must_go_with_club_ids.length > 0  ? (
                                <ChipWithStatus
                                    text={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                    }
                                    color="purple"
                                    tooltipContent="This club requires a commitment over one or more terms."
                                />
                            ) : (
                                <></>
                            )}
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
                            />
                        </div>
                    </div>
                    <div className="flex-col flex ">
                        <div className="flex items-center justify-between">
                            <Typography
                                variant="h3"
                                className="mb-2 min-h-[40px] h-[40px] max-h-[40px]"
                            >
                                {currentClubInfo.name}
                            </Typography>

                           </div>

                        <Typography className="max-h-[100px] h-[100px] min-h-[100px] overflow-hidden">
                            {currentClubInfo.description}.
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
                        className="mb-2 min-h-[60px] h-[60px] w-full max-h-[60px] mt-2 p-2 items-center "
                        color="blue"
                        variant="ghost"
                    >
                        <em>Rules: {currentClubInfo.rule}</em>
                    </Alert>
                </CardBody>
                <CardFooter className="pt-0">
                    <div className="flex gap-4">
                        <Tooltip content="Books this Club">
                            <Button
                                disabled={isAlreadyBooked}
                                variant="filled"
                                color="green"
                                className="uppercase flex items-center gap-3"
                                onClick={async () => {
                                    setShowSpinner(true);
                                    setTimeout(async () => {
                                        const data = await findClubChanges(
                                            currentClubInstance.id,
                                        );
                                        setDataForConfirmation(data);
                                        setShowSpinner(false);
                                        handleShowConfDialogue();
                                    }, 100);
                                }}
                            >
                                Select
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
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                            </Button>
                        </Tooltip>
                        {isAlreadyBooked ? (
                            <Alert variant="ghost" color="green">
                                Booked!
                            </Alert>
                        ) : (
                            <></>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
