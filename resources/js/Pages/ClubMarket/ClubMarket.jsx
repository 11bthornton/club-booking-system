import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import React, { useState } from "react";

import ClubCard from './partials/ClubCard';
import StickyBookingBar from './partials/StickyBookingBar';


export default function ClubMarket({ auth, availableClubs, alreadyBookedOn }) {

    const [activeFilters, setActiveFilters] = useState([]);
    const [currentBookingChoices, setCurrentBookingChoices] = useState(alreadyBookedOn);
    const [searchTerm, setSearchTerm] = useState("");

    // const filteredClubs = availableClubs;

    const filteredClubs = Object.values(availableClubs).filter(club => {

        // Filter by active filters
        if (activeFilters.length > 0 && !club.club_instances.some(instance =>
            activeFilters.includes(instance.day_of_week) ||
            activeFilters.includes(`Term ${instance.half_term}`)
        )) {
            return false;
        }
    
        // Filter by search term
        if (searchTerm && !club.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
    
        return true;
    });
    
    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Club Market</h2>}
        >
            <Head title="Club Market" />

            {
                JSON.stringify(availableClubs)
            }

            <div className="max-w-7xl mx-auto flex sm:px-6 lg:px-8">

                <div className="w-1/5 overflow-y-auto mt-8 relative">
                    <StickyBookingBar currentBookingChoices={currentBookingChoices} availableClubs={availableClubs} />
                </div>

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
                                    <ClubCard
                                        availableClubs={availableClubs}
                                        club={club}
                                        currentBookingChoices={currentBookingChoices}
                                        setCurrentBookingChoices={setCurrentBookingChoices}
                                        disallowedCombinations={[]}
                                        forcedCombinations={[]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


export function groupBy(list, keyGetter) {
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