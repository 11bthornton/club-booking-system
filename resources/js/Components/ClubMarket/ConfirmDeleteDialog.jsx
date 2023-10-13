import React from "react";
import { useAvailableClubs } from "@/ClubContext";
import {
    Alert,
    Button,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import deleteClub from "../../Pages/ClubMarket/scripts/DeleteBooking";
import { useSpinner } from "@/LoadingContext";

export function ConfirmDeleteDialog({
    open,
    handleOpen,
    currentClubInfo,
    currentClubInstance,
    csrf
}) {
    const { setShowSpinner } = useSpinner();
    const { setAlreadyBooked, setAvailableClubs } = useAvailableClubs();

    return (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Are you sure?</DialogHeader>
            <DialogBody divider>
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
                    You are about to delete your booking for{" "}
                    <strong className="font-bold">
                        {currentClubInfo.name}{" "}
                    </strong>
                    on{" "}
                    <strong className="font-bold">
                        {currentClubInstance.day_of_week}
                    </strong>
                    , during{" "}
                    <strong className="font-bold">
                        Term {currentClubInstance.half_term}.
                    </strong>
                </Alert>
                <Typography className="p-5">
                    Clubs are booked on a{" "}
                    <strong className="font-bold">
                        first-come first-served
                    </strong>{" "}
                    basis. Giving up your spot now may mean you won't be able to
                    book it again in the future.
                </Typography>
                <Typography className="p-5">Continue?</Typography>
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
                    onClick={async () => {
                        setShowSpinner(true);

                        setTimeout(async () => {
                            const data = await deleteClub(
                                currentClubInstance.id,
                                csrf
                            );

                            setAvailableClubs(data.data.availableClubs);
                            setAlreadyBooked(data.data.alreadyBookedOn);
                            setShowSpinner(false);
                            handleOpen();
                        }, 1000);
                    }}
                >
                    <span>Confirm</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
