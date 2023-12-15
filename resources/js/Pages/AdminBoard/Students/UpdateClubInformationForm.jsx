import { Button } from "@material-tailwind/react";
import { Link, useForm, usePage } from "@inertiajs/react";

import { useEffect } from "react";

import { FindClubModal } from "@/Components/ClubMarket/FindClubModal";
import { useState } from "react";

import deleteClub from "@/Pages/ClubMarket/scripts/DeleteBooking";
import { ConfirmDeleteDialog } from "@/Components/ClubMarket/ConfirmDeleteDialog";

import { useSpinner } from "@/LoadingContext";
export default function UpdateClubInformationForm({
    student,
    alreadyBooked,
    setAlreadyBooked,
    availableClubs,
    setAvailableClubs,
    csrf
}) {

    const { setShowSpinner } = useSpinner();




    const [findClubModalOpen, setFindClubModalOpen] = useState(false);
    const handleFindClubModalOpen = () =>
        setFindClubModalOpen(!findClubModalOpen);

    const [currentTerm, setCurrentTerm] = useState(0);
    const [currentDay, setCurrentDay] = useState("");

    return (
        <div>
            <FindClubModal
                open={findClubModalOpen}
                userAvailableClubs={availableClubs}
                setAvailableClubs={setAvailableClubs}
                alreadyBooked={alreadyBooked}
                setAlreadyBooked={setAlreadyBooked}
                handleOpen={handleFindClubModalOpen}
                term={currentTerm}
                day={currentDay}
                adminMode={
                    {
                        flag: true,
                        id: student.id
                    }
                }
                csrf={csrf}
            />

            <h2 className="text-xl font-medium text-gray-900">Club Bookings</h2>

            <p className="mt-1 text-sm text-gray-600 mb-4">
                Manage club bookings on behalf of {student.username}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(alreadyBooked).map((term, index) => {
                    return (
                        <div class="col-span-1 flex flex-col items-center justify-center ">
                            <h3 className="text-lg font-medium text-gray-900">
                                Term {index + 1}
                            </h3>
                            <div className="flex flex-col w-full gap-2">
                                {["Wednesday", "Friday"].map((day) => (
                                    <div className="border border-2 p-4 rounded-lg ">
                                        <h3 className="text-lg font-medium text-gray-900 ">
                                            {day}
                                        </h3>
                                        <p
                                            className={`${term[day]?.club
                                                ? "text-green-600 font-black"
                                                : "text-red-600 font-bold"
                                                }`}
                                        >
                                            {term[day]?.club.name ??
                                                "No Club Selected"}
                                        </p>
                                        <div className="flex gap-4 mt-4 justify-center">

                                            <Button
                                                color="blue"
                                                variant="text"
                                                onClick={() => {
                                                    setCurrentDay(day);
                                                    setCurrentTerm(index + 1);
                                                    handleFindClubModalOpen();
                                                }}
                                            >
                                                Find / Swap{" "}
                                            </Button>
                                            <Button disabled={!term[day]} variant="text" color="red" onClick={() => {
                                                setShowSpinner(true);

                                                setTimeout(async () => {
                                                    try {
                                                        const data = await deleteClub(
                                                            term[day]?.id,
                                                            csrf,
                                                            {
                                                                flag: true,
                                                                id: student.id
                                                            }
                                                        );
                                                        setAlreadyBooked(data.data.alreadyBookedOn);

                                                        setAvailableClubs(data.data.availableClubs);
                                                    } catch (error) {
                                                        console.error("An error occurred:", error);
                                                        // Handle the error appropriately
                                                        // You might want to set some state here to show an error message to the user
                                                    } finally {
                                                        setShowSpinner(false);
                                                        // handleOpen(); // If handleOpen needs to be called regardless of success or error, put it in finally block
                                                    }
                                                }, 1000);
                                            }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
