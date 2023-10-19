import React, { useState } from "react";
import { useStep } from "./StepContext";
import {
    Checkbox,
    Typography,
    Button,

} from "@material-tailwind/react";
import { Check } from "@mui/icons-material";

// import { Checkbox } from "@material-tailwind/react";

export default function StepClubs({ clubData, availableDays }) {
    // const [active, setActive] = React.useState(1);
    function daySort(a, b) {
        const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysInWeek.indexOf(a) - daysInWeek.indexOf(b);
    }

    const availableDaysForBooking = [...new Set(availableDays.flatMap(d => d.days_array))].sort(daySort);
    const { formData, setFormData } = useStep();

    const toggleClub = (club) => {
        let newClubs = [...(formData.clubs || [])]; // Ensure it's an array
        if (newClubs.includes(club)) {
            // Remove year if it's already in the array
            newClubs = newClubs.filter((c) => c !== club);
        } else {
            // Add year to array if not included
            newClubs.push(club);
        }
        setFormData({ ...formData, clubs: newClubs });
    };

    const toggleAll = () => {
        setFormData({
            ...formData,
            clubs: clubData
                .flatMap((club) => club.club_instances)
                .map((i) => i.id),
        });
    };

    const toggleTermSelect = (term) => {
        let newClubs = [...(formData.clubs || [])];

        let clubsToAdd = clubData
            .flatMap((club) => club.club_instances)
            .filter((instance) => instance.half_term == term)
            .map((i) => i.id);

        clubsToAdd.forEach((toAdd) => {
            // console.log("toadd", toAdd);

            if (newClubs.includes(toAdd)) {
                // Remove year if it's already in the array
                newClubs = newClubs.filter((c) => c !== toAdd);
            } else {
                // Add year to array if not included
                newClubs.push(toAdd);
            }
        });

        setFormData({ ...formData, clubs: newClubs });
    };

    const toggleClear = () => {
        setFormData({
            ...formData,
            clubs: [],
        });
    };

    return (
        <div className="h-full">
            <Typography variant="h2" className="font-bold mb-5">
                Which clubs should this apply to?
            </Typography>
            <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                    <strong className="font-bold">
                        <p>All Clubs</p>
                    </strong>

                    <Checkbox
                        onChange={toggleAll}
                        checked={clubData
                            .flatMap((club) => club.club_instances)
                            .map((i) => i.id)
                            .every((club) => formData.clubs.includes(club))}
                    />
                </div>

                <Button variant="text" color="red" onClick={toggleClear}>
                    Clear All
                </Button>
            </div>
            Or:
            <table className="w-full min-w-max table-auto text-center overflow-y-scroll">
                <thead>
                    <tr>
                        <td></td>
                        {[1, 2, 3, 4, 5, 6].map((term) => (
                            <td colSpan={availableDaysForBooking.length}>Term {term}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Select all in Term</td>
                        {[1, 2, 3, 4, 5, 6].map((term) => (
                            <td colSpan={availableDaysForBooking.length}>
                                <Checkbox
                                    checked={clubData
                                        .flatMap((club) => club.club_instances)
                                        .filter(
                                            (instance) =>
                                                instance.half_term == term,
                                        )
                                        .map((i) => i.id)
                                        .every((club) =>
                                            formData.clubs.includes(club),
                                        )}
                                    onChange={() => toggleTermSelect(term)}
                                />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th className="border-b border-blue-gray-100 bg-gray-400 p-1 ">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Club Name
                            </Typography>
                        </th>
                        {[1, 2, 3, 4, 5, 6].map((term) =>
                            availableDaysForBooking.map((day) => (
                                <th
                                    className={`border-b border-blue-gray-100 p-1 ${
                                        term % 2 === 0
                                            ? "bg-gray-400"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {day.substring(0, 3)}
                                    </Typography>
                                </th>
                            )),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {clubData.map((club) => (
                        <tr>
                            <td>
                                <Typography
                                    variant="small"
                                    className="text-left"
                                >
                                    <div className="flex justify-between items-center">
                                        {club.name}
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                let clubsToAdd =
                                                    club.club_instances.map(
                                                        (i) => i.id,
                                                    );
                                                let newClubs = [
                                                    ...(formData.clubs || []),
                                                ];

                                                clubsToAdd.forEach((toAdd) => {
                                                    if (
                                                        newClubs.includes(toAdd)
                                                    ) {
                                                    } else {
                                                        // Add year to array if not included
                                                        newClubs.push(toAdd);
                                                    }
                                                });

                                                setFormData({
                                                    ...formData,
                                                    clubs: newClubs,
                                                });
                                            }}
                                        >
                                            All
                                        </Button>
                                    </div>
                                </Typography>
                            </td>
                            {[1, 2, 3, 4, 5, 6].map((term) =>
                                availableDaysForBooking.map((day) => {
                                    const clubInstance =
                                        club.club_instances.find(
                                            (instance) =>
                                                instance.half_term === term &&
                                                instance.day_of_week === day,
                                        );

                                    return clubInstance ? (
                                        <td key={`${term}-${day}`}>
                                                <Checkbox
                                                    defaultChecked={true}
                                                    onChange={() =>
                                                        toggleClub(
                                                            clubInstance.id,
                                                        )
                                                    }
                                                    className="w-3 h-3"
                                                    checked={formData.clubs.includes(
                                                        clubInstance.id,
                                                    )}
                                                />
                                        </td>
                                    ) : <td>X</td>;
                                }),
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
