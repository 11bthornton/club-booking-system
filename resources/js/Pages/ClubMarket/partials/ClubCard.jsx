import React, { useState } from "react";

import { groupBy } from "../ClubMarket";
import toast from "react-hot-toast";

export default function ClubCard({ availableClubs, club, currentBookingChoices, setCurrentBookingChoices, disallowedCombinations, forcedCombinations }) {

    const groupedByTerm = groupBy(
        club.club_instances,
        instance => instance.half_term.toString()
    );

    function updateBookingChoice(event, term, instance) {
        setCurrentBookingChoices(prevSelectedInstances => {
            if (event.target.checked) {
                // Check for disallowed combinations across all terms and all days
                for (const t in prevSelectedInstances) {
                    for (const day in prevSelectedInstances[t]) {
                        const otherInstance = prevSelectedInstances[t][day];
                        if (otherInstance && disallowedCombinations.some(combo => {
                            return (combo[0] === instance.id && combo[1] === otherInstance.id) ||
                                   (combo[1] === instance.id && combo[0] === otherInstance.id);
                        })) {
                            toast.error('The selected club is incompatible with another club you have selected in a different term.');
                            return prevSelectedInstances;  // Return previous state without making updates
                        }
                    }
                }
            }
    
            // If no incompatibilities found, proceed with the update
            const updatedTermChoices = { ...prevSelectedInstances[term] };
            updatedTermChoices[instance.day_of_week] = event.target.checked ? instance : null;
            
            return {
                ...prevSelectedInstances,
                [term]: updatedTermChoices
            };
        });
    }
    
    
    

    return (
        <div key={club.id} className="p-4 border rounded shadow bg-gray-50 flex flex-col">

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{club.name}</h3>
                    <p className="text-gray-600 mb-2">{club.description}</p>
                    <p className="text-sm italic mb-2">{club.rule}</p>
                    <p className="text-sm italic mb-2">{club.id}</p>
                </div>

                <div className="ml-4 text-sm font-semibold">
                    <span className="bg-gray-300 px-2 py-1 rounded">
                        21 / 30 {/* Placeholder for capacity */}
                    </span>
                </div>
            </div>

            <div className="flex">
                {Object.keys(groupedByTerm).map(term => (
                    <div key={term} className="mb-2 mr-4">
                        <strong>Term {term}:</strong>
                        <form>
                            {groupedByTerm[term].map(instance => (
                                <div key={instance.id} className="text-gray-500">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={`term-${term}`}
                                            value={instance.day_of_week}
                                            className="mr-2"
                                            checked={currentBookingChoices[term][instance.day_of_week]?.id === instance.id}
                                            onChange={(e) => updateBookingChoice(e, term, instance)}
                                        />
                                        {`Day: ${instance.day_of_week} - ${instance.id}`} - {
                                            currentBookingChoices[term][instance.day_of_week]?.id === instance.id ?
                                                "Selected"
                                                :
                                                currentBookingChoices[term][instance.day_of_week] ?
                                                    <em className='text-red-500'>Selecting this will remove your booking for this day: {availableClubs[currentBookingChoices[term][instance.day_of_week].club_id].name}</em>
                                                    : "Available"
                                        }
                                    </label>
                                </div>
                            ))}
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );


}