
import { useState } from "react";
import { Head, Link, useForm } from '@inertiajs/react';

export default function BookingSidebar({ currentBookingChoices, availableClubs }) {

    function getClubById(clubId) {
        for (let club of availableClubs) {
            if (club.id == clubId) {
                return club
            }
        }
        return null; // Return null if no match is found
    }

    console.log(availableClubs);

    return (
        
<div className="sticky top-10 mx-auto mt-20 p-4 bg-white rounded-lg shadow-lg max-h-[calc(100%-20rem)] overflow-y-auto w-4/6 space-y-2 border border-gray-200 flex flex-col items-center">
    <h2 className="text-xl font-bold mb-4">Your Bookings</h2>
    <div className="flex">
        {(() => {
            const groupedByTerm = groupBy(currentBookingChoices, instance => instance.half_term);

            return [1, 2, 3, 4, 5, 6].map(term => (
                <div className="flex flex-col space-y-2">
                    <strong>Term {term}</strong>
                    {
                        groupedByTerm[term] ?
                            <div>
                                {(() => {
                                    const groupedByDay = groupBy(groupedByTerm[term], t => t.day_of_week);

                                    return ["Wednesday", "Friday"].map(day => (
                                        <div>
                                            <em>{day}</em>
                                            <ul>
                                                {
                                                    groupedByDay[day] ?
                                                        <li key={"1"}> {getClubById(groupedByDay[day][0].club_id).name} </li>
                                                        :
                                                        <li key={"2"}>-</li>
                                                }
                                            </ul>
                                        </div>
                                    ));
                                })()}
                            </div>
                            :
                            <p>-</p>
                    }
                </div>
            ));
        })()}
    </div>
    <button onClick={() => { }} className="mt-4 text-white bg-green-500 hover:bg-red-600 focus:ring-red-500 focus:ring-offset-red-200 focus:outline-none text-sm py-2 px-4 rounded">
        Confirm Booking Choices
    </button>
</div>

    );
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });

    // Convert the map back to an object
    const object = {};
    map.forEach((value, key) => {
        object[key] = value;
    });

    return object;
}