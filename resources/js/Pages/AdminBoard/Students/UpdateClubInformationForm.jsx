import { Button } from "@material-tailwind/react";
import { Link, useForm, usePage } from "@inertiajs/react";

import { useAvailableClubs } from "@/ClubContext";
import { useEffect } from "react";

import { FindClubModal } from "@/Components/ClubMarket/FindClubModal";
import { useState } from "react";

import deleteClub from "@/Pages/ClubMarket/scripts/DeleteBooking";
import { ConfirmDeleteDialog } from "@/Components/ClubMarket/ConfirmDeleteDialog";

import { useSpinner } from "@/LoadingContext";
export default function UpdateClubInformationForm({
    student,
    organizedByTerm,
    availableClubs,
    csrf
}) {

    const { setShowSpinner } = useSpinner();

    const { setAvailableClubs, setAlreadyBooked, alreadyBooked } =
        useAvailableClubs();

    useEffect(() => {
        setAvailableClubs(availableClubs);
        setAlreadyBooked(organizedByTerm);
    }, []);

    useEffect(() => {
        setAvailableClubs(availableClubs);

        if (JSON.stringify(alreadyBooked) == "{}") {
            setAlreadyBooked(organizedByTerm);
        }
    }, [alreadyBooked]);

    const [findClubModalOpen, setFindClubModalOpen] = useState(false);
    const handleFindClubModalOpen = () =>
        setFindClubModalOpen(!findClubModalOpen);

    const [currentTerm, setCurrentTerm] = useState(0);
    const [currentDay, setCurrentDay] = useState("");

    return (
        <div>
            <FindClubModal
                open={findClubModalOpen}
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
                {Object.values(organizedByTerm).map((term, index) => {
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
                                                    ? " "
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
                                            <Button variant="text" color="red" onClick={() => {
                                                setShowSpinner(true);

                                                setTimeout(async () => {
                                                    const data = await deleteClub(
                                                        term[day]?.id,
                                                        csrf,
                                                        {
                                                            flag: true,
                                                            id: student.id
                                                        }
                                                    );
                        
                                                    setAvailableClubs(data.data.availableClubs);
                                                    setAlreadyBooked(data.data.alreadyBookedOn);
                                                    setShowSpinner(false);
                                                    handleOpen();
                                                }, 1000);
                                            }}>
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
