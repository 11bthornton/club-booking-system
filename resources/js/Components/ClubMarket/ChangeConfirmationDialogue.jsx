import React, { useEffect } from "react";
import { useAvailableClubs, findClubByInstanceID } from "@/ClubContext";
import {
    Alert,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

import postClub from "../../Pages/ClubMarket/scripts/BookClub";
import { useSpinner } from "@/LoadingContext";


export function ChangeConfirmationDialogue({
    open,
    handleOpen,
    data,
    clubIdToBook,
    handleOriginalFindDialog,
    adminMode,
    csrf
}) {


    const { setShowSpinner } = useSpinner();
    const { availableClubs, setAlreadyBooked, setAvailableClubs } =
        useAvailableClubs();

    return open ? (
        <Dialog open={open}>
            <DialogHeader>Are you sure?</DialogHeader>
            <DialogBody divider>
                <div className="flex flex-col gap-2">
                    {data.data.clubsToDelete.length ? (
                        <Alert
                            variant="ghost"
                            color="amber"
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
                            <strong className="font-black">
                                Existing bookings will be removed
                            </strong>
                            <br />
                            <p className="font-semibold mb-4">
                                The booking you are trying to make conflicts
                                with some of your existing bookings. The
                                following will be removed:
                            </p>
                            <ol>
                                {data.data.clubsToDelete.map((clubInstance) => {
                                    if (clubInstance) {
                                        return (
                                            <li>
                                                <strong>{clubInstance.club.name}</strong> - {" "}
                                                {clubInstance.day_of_week}, Term{" "}
                                                {clubInstance.half_term}
                                            </li>
                                        );
                                    }
                                })}
                            </ol>
                        </Alert>
                    ) : (
                        <></>
                    )}
                    {data.data.clubsToBook ? (
                        <Alert
                            color="green"
                            variant="ghost"
                            className=""
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
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            }
                        >
                            <strong className="font-black">
                                Bookings to be added
                            </strong>
                            {data.data.clubsToBook.length > 10 ? (
                                <p className="italic">
                                    This club requires a commitment across
                                    multiple timeslots, so extra bookings have
                                    automatically been included with your
                                    request
                                </p>
                            ) : (
                                <></>
                            )}
                            <p className="font-semibold mb-4">
                                The following clubs will be added to your
                                account:
                            </p>
                            <ol>
                                {data.data.clubsToBook.map((clubInstance) => {
                                    if (clubInstance) {
                                        return (
                                            <li>
                                                <strong>{clubInstance.club.name}</strong> - {" "}
                                                {clubInstance.day_of_week}, Term{" "}
                                                {clubInstance.half_term}
                                            </li>
                                        );
                                    }
                                })}
                            </ol>
                        </Alert>
                    ) : (
                        <></>
                    )}
                </div>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleOpen}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => {
                        setShowSpinner(true);
                        /**
                         * Process things after a short time out,
                         * otherwise the process is so quick,
                         * user might not know anything has actually
                         * happened
                         */
                        setTimeout(async () => {
                            const data = await postClub(clubIdToBook, csrf, adminMode);

                            /**
                             * Need some error handling here, but otherwise this is
                             * the main flow written in
                             */
                            setShowSpinner(false);
                            handleOpen();
                            handleOriginalFindDialog();

                            setTimeout(() => {
                                setAlreadyBooked(data.data.alreadyBookedOn);
                                setAvailableClubs(data.data.availableClubs);

                                /**
                                 * Run this regardless of if error or not.
                                 */
                                setShowSpinner(false);
                            }, 500);


                        }, 1000);
                    }}
                >
                    <span>Confirm</span>
                </Button>
            </DialogFooter>
        </Dialog>
    ) : (
        <></>
    );
}
