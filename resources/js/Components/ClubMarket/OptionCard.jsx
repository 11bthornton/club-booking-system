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
    adminMode,
    alreadyBooked,
    availableClubs,
    setAvailableClubs, 
    setAlreadyBooked
}) {


    const { setShowSpinner } = useSpinner();

    const [showConfirmationDialogue, setShowConfirmationDialogue] =
        useState(false);

    const handleShowConfDialogue = () =>
        setShowConfirmationDialogue(!showConfirmationDialogue);
    const [dataForConfirmation, setDataForConfirmation] = useState({});

    const isAlreadyBooked =
        alreadyBooked[currentClubInstance.half_term][
            currentClubInstance.day_of_week
        ]?.id == currentClubInstance.id;

    const truncateText = (text, length = 15) => {
        if (text.length > length) {
            return `${text.substring(0, length)}...`;
        }
        return text;
    };

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
                availableClubs={availableClubs}
                alreadyBooked={alreadyBooked}
                setAvailableClubs={setAvailableClubs}
                setAlreadyBooked={setAlreadyBooked}
            />

            <div className="w-full shadow-xl p-3 rounded-lg">
                
                <div>

                    <div className="flex justify-between items-center mb-2">
                        
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
                                        text={`${currentClubInstance.capacity} spaces left`}
                                        color={
                                            currentClubInstance.capacity <= 5
                                                ? "red"
                                                : currentClubInstance.capacity <= 10
                                                    ? "amber"
                                                    : "green"
                                        }
                                        tooltipContent={`${currentClubInstance.capacity} spaces left`}
                                    /> : <></>
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
                                {currentClubInfo.name}
                            </Typography>
                            

                        </div>
                        <p className="text-red-600 font-bold">
                            {
                                currentClubInfo.is_paid ? "This club costs" : <p>&nbsp;</p>
                            }
                        </p>

                        <Typography>
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
                        className="mb-2  w-full mt-2 p-2 items-center "
                        color="blue"
                        variant="ghost"
                    >
                        <em>Rules: {currentClubInfo.rule}</em>
                    </Alert>
                </div>
                <div className="pt-0">
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
                                            csrf,
                                            adminMode
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
                                Already Booked!
                            </Alert>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
