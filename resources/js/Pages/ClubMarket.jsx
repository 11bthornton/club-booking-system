import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import React, { useState } from "react";
import {Inertia} from '@inertiajs/react';

import BookingSidebar from './BookingSidebar';

export default function ClubMarket({ auth, availableClubs, alreadyBookedOn, testing }) {

    const [activeFilters, setActiveFilters] = useState([]);
    const [currentBookingChoices, setCurrentBookingChoices] = useState(alreadyBookedOn);
    const [searchTerm, setSearchTerm] = useState("");



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


    const filteredClubs = availableClubs;

    // .filter(club => {

    //     // Filter by active filters
    //     if (activeFilters.length > 0 && !club.club_instances.some(instance =>
    //         activeFilters.includes(instance.day_of_week) ||
    //         activeFilters.includes(`Term ${instance.half_term}`)
    //     )) {
    //         return false;
    //     }

    //     // Filter by search term
    //     if (searchTerm && !club.name.toLowerCase().includes(searchTerm.toLowerCase())) {
    //         return false;
    //     }

    //     return true;
    // });


    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    console.table(currentBookingChoices);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Club Market</h2>}
        >
            <Head title="Club Market" />

            <div className="max-w-7xl mx-auto flex sm:px-6 lg:px-8">


                {/* StickyBookingBar: given a fixed width and made sticky within the container */}
                <div className="w-1/5 overflow-y-auto mt-8 relative">
                    <StickyBookingBar currentBookingChoices={currentBookingChoices} availableClubs={availableClubs} />
                </div>
                {/* Main Content: It occupies the remaining space to the right of StickyBookingBar */}
                <div className="w-3/4">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="p-6">
                            <div className="mb-4 flex space-x-2">
                                {["Wednesday", "Friday", "Term 1", "Term 2", "Term 3", "Term 4", "Term 5", "Term 6"].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => toggleFilter(filter)}
                                        className={`py-2 px-4 rounded ${activeFilters.includes(filter) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="grid gap-4">
                                {Object.entries(filteredClubs).map(([clubId, club]) => (
                                    <div key={club.id} className="p-4 border rounded shadow bg-gray-50 ">
                                        <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                                        <p className="text-gray-600 mb-2">{club.description}</p>
                                        <p className="text-sm italic mb-2">{club.rule}</p>
                                        <p className="text-sm italic mb-2">{club.id}</p>

                                        <div className="flex">
                                            {(() => {
                                                const groupedByTerm = groupBy(club.club_instances, instance => instance.half_term.toString());
                                                const isMultipleSelectionAllowed = club.rule === "multiple";

                                                return Object.keys(groupedByTerm).map(term => (
                                                    <div key={term} className="mb-2 mr-4">
                                                        <strong>Term {term}:</strong>
                                                        <form>
                                                            {groupedByTerm[term].map(instance => (
                                                                <div key={instance.id} className="text-gray-500">
                                                                    <label>
                                                                        <input
                                                                            type={isMultipleSelectionAllowed ? "checkbox" : "radio"}
                                                                            name={`term-${term}`}
                                                                            value={instance.day_of_week}
                                                                            className="mr-2"
                                                                            checked={currentBookingChoices[term][instance.day_of_week]?.id === instance.id}
                                                                            onChange={(e) => {
                                                                                setCurrentBookingChoices(prevSelectedInstances => {
                                                                                    const updatedTermChoices = { ...prevSelectedInstances[term] };
                                                                                    if (isMultipleSelectionAllowed) {
                                                                                        if (e.target.checked) {
                                                                                            updatedTermChoices[instance.day_of_week] = instance;
                                                                                        } else {
                                                                                            updatedTermChoices[instance.day_of_week] = null;
                                                                                        }
                                                                                    } else {
                                                                                        updatedTermChoices[instance.day_of_week] = e.target.checked ? instance : null;
                                                                                        // Do not clear the other day_of_week since we want to keep the existing selection.
                                                                                    }
                                                                                    return {
                                                                                        ...prevSelectedInstances,
                                                                                        [term]: updatedTermChoices
                                                                                    };
                                                                                });
                                                                            }}

                                                                        />
                                                                        {`Day: ${instance.day_of_week} - ${instance.id}`}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </form>
                                                    </div>
                                                ));
                                            })()}


                                        </div>

                                        <div className="mt-2">
                                            {/* {JSON.stringify(club)} */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StickyBookingBar({ availableClubs, currentBookingChoices }) {
    const handleRemoveDayBooking = (term, day) => {
        // You will need to implement this function to handle the removal
        // I'm just providing a placeholder here.
        console.log(`Remove booking for term ${term} on ${day}`);
    }

    return (
        <div className="sticky top-1">
            <h3 className="font-black mb-3" style={{textTransform: "capitalize"}}>Your Selected Clubs:</h3>
            {Object.entries(currentBookingChoices).map(([term, days]) => (
                <div key={term} className="mb-6">
                    <strong>Term {term}:</strong>
                    <div className="flex flex-col mt-2 w-full">
                        {days.Wednesday
                            ? <span className="bg-gray-200 px-2 py-1 rounded mb-2 relative">
                                {availableClubs[days.Wednesday.club_id].name} (Wed)
                                <button onClick={() => handleRemoveDayBooking(term, 'Wednesday')} className="text-red-500 absolute top-0 right-0 mt-1 mr-2">&times;</button>
                            </span>
                            : <span className="bg-gray-200 px-2 py-1 rounded mb-2 text-red-500">No booking for Wednesday</span>
                        }
                        {days.Friday
                            ? <span className="bg-gray-200 px-2 py-1 rounded relative">
                                {availableClubs[days.Friday.club_id].name} (Fri)
                                <button onClick={() => handleRemoveDayBooking(term, 'Friday')} className="text-red-500 absolute top-0 right-0 mt-1 mr-2">&times;</button>
                            </span>
                            : <span className="bg-gray-200 px-2 py-1 rounded text-red-500">No booking for Friday</span>
                        }
                    </div>
                </div>
            ))}
            <button onClick={() => handleRemoveBooking(clubForDay.id)} className="text-white bg-green-500 hover:bg-green-600 focus:ring-red-500 focus:ring-offset-red-200 focus:outline-none text-sm py-2 px-4 rounded">
                Update Choices
            </button>
        </div>
    );
}



